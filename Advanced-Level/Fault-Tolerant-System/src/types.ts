import { JOB_TYPES } from './constants/server.js';
import {
  CommandPayloadDelay,
  CommandPayloadHttp,
  DelayResult,
  GenericFailureResult,
  HttpResult,
} from './interfaces.js';

export type EntityType = 'SERVER' | 'AGENT';

export type CommandType = (typeof JOB_TYPES)[keyof typeof JOB_TYPES];

export type CommandStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export type CommandPayload = CommandPayloadDelay | CommandPayloadHttp;

export type JobResult = DelayResult | HttpResult | GenericFailureResult;
