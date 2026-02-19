import 'dotenv/config';

import {
  AGENT_ID,
  NETWORK_TIMEOUT_MS,
  POLLING_INTERVAL_MS,
  SERVER_URL,
} from './constants/agent.js';
import { AGENT_QUERIES } from './constants/db.js';
import {
  CommandPayloadDelay,
  CommandPayloadHttp,
  LocalTaskRecord,
  PollResponse,
} from './interfaces.js';
import { CommandPayload, CommandType, JobResult } from './types.js';
import {
  executeDelay,
  executeHttpGet,
  getFriendlyErrorMessage,
  verifyTaskOwnership,
} from './utils/agent.js';
import { attemptRandomCrash, initializeChaos } from './utils/chaos.js';
import { initalizeDatabase } from './utils/db.js';

initializeChaos();

const db = initalizeDatabase('AGENT');

console.log(`[Agent] Started as ${AGENT_ID}`);
console.log(`[Agent] Connecting to ${SERVER_URL}`);

const main = async () => {
  await checkRecovery();

  while (true) {
    try {
      await pollAndExecute();
    } catch (error: unknown) {
      console.error('[Agent] Polling error:', getFriendlyErrorMessage(error, SERVER_URL));
    }
    await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));
  }
};

const checkRecovery = async () => {
  const tasks = db.prepare(AGENT_QUERIES.GET_ALL_TASKS).all() as LocalTaskRecord[];

  for (const task of tasks) {
    try {
      const shouldResume = await verifyTaskOwnership(task.command_id);

      if (!shouldResume) {
        console.warn(
          `[Recovery] Task ${task.command_id} is no longer assigned to this agent. Removing local copy.`,
        );
        db.prepare(AGENT_QUERIES.DELETE_TASK).run(task.command_id);
        continue;
      }

      if (task.status === 'ASSIGNED') {
        console.log(`[Recovery] Restarting execution for ${task.command_id}`);
        const payload = JSON.parse(task.payload) as CommandPayload;
        await executeJob(task.command_id, task.type, payload);
      } else if (task.status === 'COMPLETED_PENDING_ACK') {
        console.log(`[Recovery] Retrying report for ${task.command_id}`);
        await reportResult(
          task.command_id,
          task.result ? JSON.parse(task.result) : null,
          'COMPLETED',
        );
      }
    } catch (error) {
      console.error(
        `[Recovery] Failed to verify task ${task.command_id}:`,
        getFriendlyErrorMessage(error, SERVER_URL),
      );
      db.prepare(AGENT_QUERIES.UPDATE_FAILED_TASK).run(task.command_id);
    }
  }
};

const pollAndExecute = async () => {
  const activeTask = db.prepare(AGENT_QUERIES.GET_ACTIVE_TASK).get() as LocalTaskRecord;
  if (activeTask) return;

  const res = await fetch(`${SERVER_URL}/internal/poll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ agentId: AGENT_ID }),
    signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
  });

  if (res.status === 204) return;

  if (!res.ok) {
    throw new Error(`Server returned error: ${res.status} ${res.statusText}`);
  }

  const job = (await res.json()) as PollResponse;

  const existingTask = db
    .prepare(AGENT_QUERIES.GET_TASK_BY_ID)
    .get(job.commandId) as LocalTaskRecord;

  if (existingTask) {
    console.log(
      `[Agent] Polled task ${job.commandId} exists locally. Status: ${existingTask.status}, Failed: ${existingTask.isFailed}`,
    );

    if (existingTask.status === 'COMPLETED_PENDING_ACK') {
      await reportResult(
        existingTask.command_id,
        existingTask.result ? JSON.parse(existingTask.result) : null,
        'COMPLETED',
      );
      return;
    }

    if (existingTask.status === 'ASSIGNED') {
      const payload = JSON.parse(existingTask.payload) as CommandPayload;
      await executeJob(existingTask.command_id, existingTask.type, payload);
      return;
    }
  }
  console.log(`[Agent] Received New Job: ${job.commandId} (${job.type})`);

  db.prepare(AGENT_QUERIES.ASSIGN_NEW_TASK).run(
    job.commandId,
    job.type,
    JSON.stringify(job.payload),
  );

  await executeJob(job.commandId, job.type, job.payload as unknown as CommandPayload);
};

const executeJob = async (id: string, type: CommandType, payload: CommandPayload) => {
  attemptRandomCrash(`job ${id}`);

  const controller = new AbortController();
  const { signal } = controller;

  let result: JobResult;
  let status: 'COMPLETED' | 'FAILED' = 'COMPLETED';

  const heartbeatInterval = setInterval(async () => {
    try {
      const isStillMine = await verifyTaskOwnership(id);

      if (!isStillMine) {
        console.warn(`[Heartbeat] Lost ownership of Job ${id}. Stopping heartbeat.`);
        clearInterval(heartbeatInterval);

        db.prepare(AGENT_QUERIES.DELETE_TASK).run(id);

        controller.abort(new Error('Ownership Lost'));
      }
    } catch (err) {
      console.error(`[Heartbeat] Failed to reach server for Job ${id}`, err);
    }
  }, 10000);

  try {
    switch (type) {
      case 'DELAY':
        result = await executeDelay(payload as CommandPayloadDelay, signal);
        break;

      case 'HTTP_GET_JSON':
        result = await executeHttpGet(payload as CommandPayloadHttp, signal);
        break;

      default:
        throw new Error(`Unknown command type: ${type}`);
    }

    if (!result.success) {
      status = 'FAILED';
    }
  } catch (err: unknown) {
    if (signal.aborted) {
      console.log(`[Agent] Job ${id} execution halted: ${signal.reason}`);
      return;
    }

    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error(`[Agent] Job ${id} Crashed:`, errorMessage);

    status = 'FAILED';
    result = {
      kind: 'GENERIC_FAILURE',
      success: false,
      error: errorMessage,
    };
  } finally {
    clearInterval(heartbeatInterval);
  }

  db.prepare(AGENT_QUERIES.UPDATE_TASK_COMPLETE).run(JSON.stringify(result), id);

  await reportResult(id, result, status);
};

const reportResult = async (
  id: string,
  result: JobResult | null,
  status: 'COMPLETED' | 'FAILED',
) => {
  try {
    const res = await fetch(`${SERVER_URL}/internal/result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commandId: id,
        agentId: AGENT_ID,
        status,
        result,
      }),
      signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
    });

    if (res.status === 403) {
      console.warn(`[Agent] Task ${id} was reassigned. Dropping local result.`);
      db.prepare(AGENT_QUERIES.DELETE_TASK).run(id);
      return;
    }

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    db.prepare(AGENT_QUERIES.DELETE_TASK).run(id);
    console.log(`[Agent] Job ${id} Reported & Cleared.`);
  } catch (error: unknown) {
    console.error(
      `[Agent] Failed to report result for ${id}. Marking isFailed=true. Error: ${getFriendlyErrorMessage(error, SERVER_URL)}`,
    );

    db.prepare(AGENT_QUERIES.UPDATE_FAILED_TASK).run(id);
  }
};

main().catch(console.error);
