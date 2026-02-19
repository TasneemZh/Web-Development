export const SERVER_SCHEMA = `
  CREATE TABLE IF NOT EXISTS commands (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING',
    result TEXT,
    assigned_agent_id TEXT,
    lock_expiration DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

export const AGENT_SCHEMA = `
  CREATE TABLE IF NOT EXISTS local_tasks (
    command_id TEXT PRIMARY KEY,
    status TEXT, 
    type TEXT,
    payload TEXT,
    result TEXT,
    isFailed INTEGER DEFAULT 0
  )
`;

export const SERVER_QUERIES = {
  INSERT_COMMAND: `INSERT INTO commands (id, type, payload, status) VALUES (?, ?, ?, ?)`,
  GET_COMMAND: `SELECT * FROM commands WHERE id = ?`,
  POLL_WORK: `
    SELECT id, type, payload FROM commands 
    WHERE status = 'PENDING' 
    ORDER BY created_at ASC 
    LIMIT 1
  `,
  LOCK_WORK: `
    UPDATE commands 
    SET status = 'RUNNING', 
        assigned_agent_id = ?, 
        updated_at = CURRENT_TIMESTAMP,
        lock_expiration = datetime('now', '+' || ? || ' seconds')
    WHERE id = ?
  `,
  EXTEND_LOCK: `
    UPDATE commands
    SET lock_expiration = datetime('now', '+' || ? || ' seconds'),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND assigned_agent_id = ? AND status = 'RUNNING'
  `,
  GET_COMMAND_STATUS: `SELECT status, assigned_agent_id FROM commands WHERE id = ?`,
  UPDATE_RESULT: `
    UPDATE commands 
    SET status = ?, result = ?, assigned_agent_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `,
  GET_TIMED_OUT_TASKS: `
    SELECT id FROM commands 
    WHERE status = 'RUNNING' 
    AND lock_expiration < datetime('now')
  `,
  RESET_TASK_TO_PENDING: `
    UPDATE commands 
    SET status = 'PENDING', assigned_agent_id = NULL, lock_expiration = NULL, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `,
  RESET_ALL_RUNNING_TO_PENDING: `
    UPDATE commands 
    SET status = 'PENDING', assigned_agent_id = NULL, lock_expiration = NULL, updated_at = CURRENT_TIMESTAMP 
    WHERE status = 'RUNNING'
  `,
};

export const AGENT_QUERIES = {
  GET_ALL_TASKS: `SELECT * FROM local_tasks`,
  GET_TASK_BY_ID: `SELECT * FROM local_tasks WHERE command_id = ?`,
  GET_ACTIVE_TASK: `
    SELECT * FROM local_tasks 
    WHERE isFailed = 0
    LIMIT 1
  `,
  ASSIGN_NEW_TASK: `INSERT INTO local_tasks (command_id, status, type, payload, result, isFailed) 
     VALUES (?, 'ASSIGNED', ?, ?, NULL, 0)`,
  UPDATE_TASK_COMPLETE: `UPDATE local_tasks SET status = 'COMPLETED_PENDING_ACK', result = ?, isFailed = 0 WHERE command_id = ?`,
  UPDATE_FAILED_TASK: `UPDATE local_tasks SET isFailed = 1 WHERE command_id = ?`,
  DELETE_TASK: `DELETE FROM local_tasks WHERE command_id = ?`,
};
