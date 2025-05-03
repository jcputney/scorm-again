export default class CrossFrameAPI {
    private _cache;
    private _lastError;
    private _pending;
    private _counter;
    private readonly _origin;
    private _handler;
    constructor(targetOrigin?: string);
    private _post;
    private _onMessage;
    private _capture;
}
