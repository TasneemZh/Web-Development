import 'dotenv/config';

import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { SERVER_QUERIES } from './constants/db.js';
import {
  JOB_TYPES,
  LEASE_DURATION_SECONDS,
  PERIOD_TO_CHECK_TIMEOUT_CRITERIA,
  SERVER_PORT,
} from './constants/server.js';
import {
  CommandRow,
  CommandStatusFiltering,
  PendingCommand,
  PollRequest,
  ResultRequest,
} from './interfaces.js';
import { initalizeDatabase } from './utils/db.js';
import { checkTaskTimeouts, resetAllRunningTasks } from './utils/server.js';

const app = express();
app.use(express.json());

const db = initalizeDatabase('SERVER');

resetAllRunningTasks(db);

setInterval(() => {
  checkTaskTimeouts(db);
}, PERIOD_TO_CHECK_TIMEOUT_CRITERIA);

app.post('/commands', (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Missing request body' });
  }
  const { type, payload } = req.body;

  if (!type || !payload) {
    return res.status(400).json({ error: 'Missing type or payload' });
  }

  const validTypes = Object.values(JOB_TYPES) as string[];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      error: `Invalid type. Allowed values: ${validTypes.join(', ')}`,
    });
  }

  if (type === JOB_TYPES.DELAY) {
    if (payload.ms === undefined || typeof payload.ms !== 'number') {
      return res.status(400).json({
        error: 'Payload for DELAY must contain a numeric "ms" field',
      });
    }
  }

  if (type === JOB_TYPES.HTTP_GET_JSON) {
    if (!payload.url || typeof payload.url !== 'string') {
      return res.status(400).json({
        error: 'Payload for HTTP_GET_JSON must contain a non-empty "url" string',
      });
    }
  }

  const id = uuidv4();
  const stmt = db.prepare(SERVER_QUERIES.INSERT_COMMAND);

  try {
    stmt.run(id, type, JSON.stringify(payload), 'PENDING');
    res.json({ commandId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to persist command' });
  }
});

app.get('/commands/:id', (req: Request, res: Response) => {
  const row = db.prepare(SERVER_QUERIES.GET_COMMAND).get(req.params.id) as CommandRow;
  if (!row) return res.status(404).json({ error: 'Command not found' });

  res.json({
    status: row.status,
    result: row.result ? JSON.parse(row.result) : null,
    agentId: row.assigned_agent_id,
  });
});

app.post('/internal/ownership', (req: Request, res: Response) => {
  const { commandId, agentId } = req.body;

  const row = db.prepare(SERVER_QUERIES.GET_COMMAND).get(commandId) as CommandRow;
  if (!row) return res.status(404).json({ error: 'Command not found' });

  if (row.status === 'RUNNING' && row.assigned_agent_id === agentId) {
    db.prepare(SERVER_QUERIES.EXTEND_LOCK).run(LEASE_DURATION_SECONDS, commandId, agentId);
    console.log(`[Heartbeat] Extended lease for ${commandId} by ${agentId}`);
  }

  res.json({
    status: row.status,
    agentId: row.assigned_agent_id,
  });
});

app.post('/internal/poll', (req: Request, res: Response) => {
  const { agentId } = req.body as PollRequest;

  const work = db.transaction(() => {
    const pending = db.prepare(SERVER_QUERIES.POLL_WORK).get() as PendingCommand;

    if (!pending) return null;

    db.prepare(SERVER_QUERIES.LOCK_WORK).run(agentId, LEASE_DURATION_SECONDS, pending.id);

    return pending;
  })();

  if (work) {
    res.json({
      commandId: work.id,
      type: work.type,
      payload: JSON.parse(work.payload),
    });
  } else {
    res.status(204).send();
  }
});

app.post('/internal/result', (req: Request, res: Response) => {
  const { commandId, agentId, status, result } = req.body as ResultRequest;

  const current = db
    .prepare(SERVER_QUERIES.GET_COMMAND_STATUS)
    .get(commandId) as CommandStatusFiltering;

  if (!current) return res.status(404).json({ error: 'Command not found' });

  if (current.status === 'COMPLETED' || current.status === 'FAILED') {
    return res.status(200).json({ status: 'ALREADY_PROCESSED' });
  }

  if (current.assigned_agent_id !== null && current.assigned_agent_id !== agentId) {
    return res.status(403).json({ error: 'Task assigned to another agent' });
  }

  db.prepare(SERVER_QUERIES.UPDATE_RESULT).run(status, JSON.stringify(result), agentId, commandId);

  res.json({ success: true });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server running on port ${SERVER_PORT}`);
});
