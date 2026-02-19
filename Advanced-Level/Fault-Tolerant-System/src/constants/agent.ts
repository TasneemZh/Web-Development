import 'dotenv/config';

export const AGENT_ID = process.env.AGENT_ID || `agent-${Math.floor(Math.random() * 1000)}`;

export const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';

export const AGENT_DB_PATH = process.env.AGENT_DB_PATH || './data/agent.db';

export const POLLING_INTERVAL_MS = 2000;

export const NETWORK_TIMEOUT_MS = 5000;

export const EXECUTION_TIMEOUT_MS = 10000;
