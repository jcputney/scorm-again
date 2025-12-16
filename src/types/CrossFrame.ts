/**
 * Configuration options for CrossFrameAPI (client-side)
 */
export interface CrossFrameAPIOptions {
  /** Timeout for postMessage requests in milliseconds. Default: 5000 */
  timeout?: number;
  /** Interval between heartbeat pings in milliseconds. Default: 30000 */
  heartbeatInterval?: number;
  /** Time without heartbeat response before marking connection as lost. Default: 60000 */
  heartbeatTimeout?: number;
}

/**
 * Configuration options for CrossFrameLMS (server-side)
 */
export interface CrossFrameLMSOptions {
  /** Maximum requests per second before rate limiting. Default: 100 */
  rateLimit?: number;
}

/**
 * Events emitted by CrossFrameAPI for connection status changes
 */
export type CrossFrameEvent =
  | { type: "connectionLost" }
  | { type: "connectionRestored" }
  | { type: "rateLimited"; method: string };

/**
 * Callback type for CrossFrame event listeners
 */
export type CrossFrameEventCallback = (event: CrossFrameEvent) => void;

/**
 * Type for the message data sent from client to server
 */
export type MessageData = {
  messageId: string;
  method: string;
  params: unknown[];
  /** Marks this message as a heartbeat ping */
  isHeartbeat?: boolean;
};

/**
 * Type for the message response sent from server to client
 */
export type MessageResponse = {
  messageId: string;
  result?: unknown;
  error?: {
    message: string;
    /** SCORM error code if applicable */
    code?: string;
    // Note: stack trace intentionally omitted for security
  };
  /** Marks this message as a heartbeat response */
  isHeartbeat?: boolean;
};
