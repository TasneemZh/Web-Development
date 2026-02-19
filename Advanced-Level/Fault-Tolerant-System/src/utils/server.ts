import { Database } from 'better-sqlite3';

import { SERVER_QUERIES } from '../constants/db.js';

export const resetAllRunningTasks = (db: Database): void => {
  const info = db.prepare(SERVER_QUERIES.RESET_ALL_RUNNING_TO_PENDING).run();
  if (info.changes > 0) {
    console.log(`[Server] Reset ${info.changes} stuck RUNNING tasks to PENDING on startup.`);
  }
};

export const checkTaskTimeouts = (db: Database) => {
  const timedOutTasks = db.prepare(SERVER_QUERIES.GET_TIMED_OUT_TASKS).all() as { id: string }[];

  if (timedOutTasks.length === 0) return;

  const stmt = db.prepare(SERVER_QUERIES.RESET_TASK_TO_PENDING);

  for (const task of timedOutTasks) {
    console.log(`[Timeout] Task ${task.id} lease expired. Resetting to PENDING.`);
    stmt.run(task.id);
  }
};
