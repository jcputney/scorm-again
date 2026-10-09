import { CommitMetadata, CommitObject, InternalSettings, ResultObject } from "../types/api_types.js";
import { LogLevelEnum } from "../constants/enums.js";
import { IHttpService } from "../interfaces/services.js";
import { ErrorCode } from "../constants/error_codes.js";
import { StringKeyMap } from "../utilities/index.js";
export declare class AsynchronousHttpService implements IHttpService {
    readonly reportsRequestCompletion = true;
    private settings;
    private error_codes;
    constructor(settings: InternalSettings, error_codes: ErrorCode);
    processHttpRequest(url: string, params: CommitObject | StringKeyMap | Array<any>, immediate: boolean | undefined, apiLog: (functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string) => void, processListeners: (functionName: string, CMIElement?: string, value?: any) => void, metadata?: CommitMetadata, onRequestComplete?: () => void): ResultObject;
    private _performAsyncRequest;
    private _prepareRequestBody;
    private performFetch;
    private _sendFetch;
    private performBeacon;
    private _warnIfBeaconContentTypeUnsafe;
    private transformResponse;
    private _isSuccessResponse;
    updateSettings(settings: InternalSettings): void;
}
//# sourceMappingURL=AsynchronousHttpService.d.ts.map