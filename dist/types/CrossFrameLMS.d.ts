import { CrossFrameLMSOptions } from "./types/CrossFrame";
import { IBaseAPI } from "./interfaces/IBaseAPI";
export default class CrossFrameLMS {
    private readonly _api;
    private readonly _origin;
    private readonly _rateLimit;
    private _requestTimes;
    private _destroyed;
    private readonly _boundOnMessage;
    private static readonly ALLOWED_METHODS;
    constructor(api: IBaseAPI, targetOrigin?: string, options?: CrossFrameLMSOptions);
    destroy(): void;
    private _isRateLimited;
    private static _isValidMessageData;
    private _onMessage;
    private _process;
}
//# sourceMappingURL=CrossFrameLMS.d.ts.map