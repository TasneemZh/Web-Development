import { AGENT_ID, NETWORK_TIMEOUT_MS, SERVER_URL } from '../constants/agent.js';
import {
  CommandPayloadDelay,
  CommandPayloadHttp,
  DelayResult,
  HttpResult,
  NetworkError,
} from '../interfaces.js';

export const getFriendlyErrorMessage = (error: unknown, serverUrl: string): string => {
  const err = error as NetworkError;
  const code = err.cause?.code || err.code;

  if (code === 'ECONNREFUSED') {
    return `Could not connect to Control Server at ${serverUrl}. Is it running?`;
  }
  if (code === 'ENOTFOUND') {
    return `Could not resolve hostname for ${serverUrl}.`;
  }
  if (err.name === 'TimeoutError' || err.name === 'AbortError') {
    return 'Request to server timed out.';
  }

  return err.message || String(error);
};

export const executeDelay = async (
  payload: CommandPayloadDelay,
  signal: AbortSignal,
): Promise<DelayResult> => {
  const start = Date.now();
  const targetEnd = start + payload.ms;

  await new Promise<void>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);

    const timer = setTimeout(() => {
      resolve();
    }, payload.ms);

    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });

  while (Date.now() < targetEnd) {
    // waiting till the delay is completed fully
  }

  const end = Date.now();

  return {
    kind: 'DELAY',
    success: true,
    tookMs: end - start,
    error: null,
  };
};

export const executeHttpGet = async (
  payload: CommandPayloadHttp,
  signal: AbortSignal,
): Promise<HttpResult> => {
  try {
    let body: unknown;
    let bodyStr: string;

    const compositeSignal = AbortSignal.any([signal, AbortSignal.timeout(10000)]);

    const response = await fetch(payload.url, {
      signal: compositeSignal,
      headers: { Accept: 'application/json' },
    });

    try {
      body = await response.json();
      bodyStr = JSON.stringify(body);
    } catch {
      bodyStr = await response.text();
      body = bodyStr;
    }

    const isTruncated = bodyStr.length > 1000;

    return {
      kind: 'HTTP',
      success: response.ok,
      status: response.status,
      body: isTruncated ? bodyStr.substring(0, 1000) : body,
      truncated: isTruncated,
      bytesReturned: bodyStr.length,
      error: response.ok ? null : `HTTP Error ${response.status}`,
    };
  } catch (err: unknown) {
    if (signal.aborted) {
      throw signal.reason;
    }

    const errorObj = err as NetworkError;
    const errorMessage =
      errorObj.name === 'TimeoutError' || errorObj.name === 'AbortError'
        ? 'Request timed out'
        : errorObj.message || String(err);

    return {
      kind: 'HTTP',
      success: false,
      status: 0,
      body: null,
      truncated: false,
      bytesReturned: 0,
      error: errorMessage,
    };
  }
};

export const verifyTaskOwnership = async (commandId: string): Promise<boolean> => {
  const res = await fetch(`${SERVER_URL}/internal/ownership`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commandId, agentId: AGENT_ID }),
    signal: AbortSignal.timeout(NETWORK_TIMEOUT_MS),
  });

  if (res.status === 404) {
    return false;
  }

  if (!res.ok) {
    throw new Error(`Server check failed with ${res.status}`);
  }

  const serverState = await res.json();

  if (serverState.status === 'COMPLETED' || serverState.status === 'FAILED') {
    return false;
  }

  if (serverState.agentId !== AGENT_ID) {
    return false;
  }

  return true;
};
