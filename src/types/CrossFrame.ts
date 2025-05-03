/**
 * Type for the message data
 */
export type MessageData = {
  messageId: string;
  method: string;
  params: unknown[];
  sab?: SharedArrayBuffer;
};

/**
 * Type for the message response
 */
export type MessageResponse = {
  messageId: string;
  result?: unknown;
  error?: {
    message: string;
    stack?: string;
  };
  sab?: SharedArrayBuffer;
};
