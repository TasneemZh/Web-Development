import 'dotenv/config';

export const SERVER_PORT = Number(process.env.PORT) || 3000;

export const SERVER_DB_PATH = process.env.SERVER_DB_PATH || './data/server.db';

export const FETCH_JOBS_TIMEOUT = 10000;

export const DELAY_JOBS_EXTRA_TIMEOUT = 5000;

export const JOB_TYPES = {
  DELAY: 'DELAY',
  HTTP_GET_JSON: 'HTTP_GET_JSON',
} as const;

export const PERIOD_TO_CHECK_TIMEOUT_CRITERIA = 5000;

export const LEASE_DURATION_SECONDS = 30;
