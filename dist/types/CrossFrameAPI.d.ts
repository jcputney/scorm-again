import { CrossFrameAPIOptions, CrossFrameEventCallback } from "./types/CrossFrame";
export default class CrossFrameAPI {
    private _cache;
    private _cacheTimestamps;
    private _lastError;
    private _pending;
    private _counter;
    private readonly _origin;
    private readonly _targetWindow;
    private readonly _timeout;
    private readonly _heartbeatInterval;
    private readonly _heartbeatTimeout;
    private _destroyed;
    private _connected;
    private _lastHeartbeatResponse;
    private _heartbeatTimer;
    private _eventListeners;
    private readonly _boundOnMessage;
    private static _isValidMessageResponse;
    private static _validateArgs;
    private _handler;
    constructor(targetOrigin?: string, targetWindow?: Window, options?: CrossFrameAPIOptions);
    destroy(): void;
    on(event: string, callback: CrossFrameEventCallback): void;
    off(event: string, callback: CrossFrameEventCallback): void;
    get connected(): boolean;
    private _emit;
    private _startHeartbeat;
    private _sendHeartbeat;
    private _post;
    private _onMessage;
    private _capture;
}
//# sourceMappingURL=CrossFrameAPI.d.ts.map