import { CommandStatus, CommandType } from './types.js';

export interface CommandPayloadDelay {
  ms: number;
}

export interface CommandPayloadHttp {
  url: string;
}

export interface LocalTaskRecord {
  command_id: string;
  status: 'ASSIGNED' | 'COMPLETED_PENDING_ACK';
  payload: string;
  type: CommandType;
  result: string | null;
  isFailed: number;
}

export interface CommandRecord {
  id: string;
  type: CommandType;
  payload: string;
  status: CommandStatus;
  result: string | null;
  assigned_agent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommandResponse {
  commandId: string;
}

export interface CommandStatusResponse {
  status: CommandStatus;
  result: string | null;
  agentId: string | null;
}

export interface PollRequest {
  agentId: string;
}

export interface PollResponse {
  commandId: string;
  type: CommandType;
  payload: string;
}

export interface ResultRequest {
  commandId: string;
  agentId: string;
  status: 'COMPLETED' | 'FAILED';
  result: string | null;
}

export interface CommandRow {
  status: string;
  result: string | null;
  assigned_agent_id: string;
  updated_at: string;
  type: CommandType;
  payload: string;
  id: string;
}

export interface PendingCommand {
  id: string;
  type: CommandType;
  payload: string;
}

export interface CommandStatusFiltering {
  status: CommandStatus;
  assigned_agent_id: string;
}

export interface TaskCount {
  count: number;
}

export interface NetworkError {
  message: string;
  name?: string;
  code?: string;
  cause?: {
    code?: string;
  };
}

export interface BaseExecutionResult {
  success: boolean;
  error: string | null;
}

export interface DelayResult extends BaseExecutionResult {
  kind: 'DELAY';
  tookMs: number;
}

export interface HttpResult extends BaseExecutionResult {
  kind: 'HTTP';
  status: number;
  body: unknown | null;
  truncated: boolean;
  bytesReturned: number;
}

export interface GenericFailureResult extends BaseExecutionResult {
  kind: 'GENERIC_FAILURE';
  success: false;
  error: string;
}
