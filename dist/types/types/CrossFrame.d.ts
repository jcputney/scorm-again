export interface CrossFrameAPIOptions {
    timeout?: number;
    heartbeatInterval?: number;
    heartbeatTimeout?: number;
}
export interface CrossFrameLMSOptions {
    rateLimit?: number;
}
export type CrossFrameEvent = {
    type: "connectionLost";
} | {
    type: "connectionRestored";
} | {
    type: "rateLimited";
    method: string;
};
export type CrossFrameEventCallback = (event: CrossFrameEvent) => void;
export type MessageData = {
    messageId: string;
    method: string;
    params: unknown[];
    isHeartbeat?: boolean;
};
export type MessageResponse = {
    messageId: string;
    result?: unknown;
    error?: {
        message: string;
        code?: string;
    };
    isHeartbeat?: boolean;
};
//# sourceMappingURL=CrossFrame.d.ts.map