export default class CrossFrameAPI {
    private _cache;
    private _lastError;
    private _pending;
    private _counter;
    private readonly _origin;
    private readonly _targetWindow;
    private _handler;
    constructor(targetOrigin?: string, targetWindow?: Window);
    private _post;
    private _onMessage;
    private _capture;
}
//# sourceMappingURL=CrossFrameAPI.d.ts.map