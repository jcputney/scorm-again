export type MessageData = {
    messageId: string;
    method: string;
    params: unknown[];
    sab?: SharedArrayBuffer;
};
export type MessageResponse = {
    messageId: string;
    result?: unknown;
    error?: {
        message: string;
        stack?: string;
    };
    sab?: SharedArrayBuffer;
};
