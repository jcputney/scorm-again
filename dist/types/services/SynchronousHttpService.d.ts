import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";
export declare class SynchronousHttpService implements IHttpService {
    private settings;
    private error_codes;
    constructor(settings: InternalSettings, error_codes: ErrorCode);
    processHttpRequest(url: string, params: CommitObject | StringKeyMap | Array<any>, immediate: boolean | undefined, _apiLog: (functionName: string, message: any, messageLevel: number, CMIElement?: string) => void, _processListeners: (functionName: string, CMIElement?: string, value?: any) => void): ResultObject;
    private _handleImmediateRequest;
    private _performSyncXHR;
    private _prepareRequestBody;
    updateSettings(settings: InternalSettings): void;
}
//# sourceMappingURL=SynchronousHttpService.d.ts.map