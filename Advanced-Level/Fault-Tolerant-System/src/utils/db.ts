import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

import { AGENT_DB_PATH } from '../constants/agent.js';
import { AGENT_SCHEMA } from '../constants/db.js';
import { SERVER_SCHEMA } from '../constants/db.js';
import { SERVER_DB_PATH } from '../constants/server.js';
import { EntityType } from '../types.js';

export const ensureDbDir = (dbPath: string): void => {
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
};

export const initalizeDatabase = (entity: EntityType) => {
  ensureDbDir(entity === 'SERVER' ? SERVER_DB_PATH : AGENT_DB_PATH);
  const db = new Database(entity === 'SERVER' ? SERVER_DB_PATH : AGENT_DB_PATH);

  if (entity === 'SERVER') {
    db.pragma('journal_mode = WAL');

    db.exec(SERVER_SCHEMA);
  } else {
    db.exec(AGENT_SCHEMA);
  }

  return db;
};
