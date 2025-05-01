import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";
export declare class HttpService implements IHttpService {
    private settings;
    private error_codes;
    constructor(settings: InternalSettings, error_codes: ErrorCode);
    processHttpRequest(url: string, params: CommitObject | StringKeyMap | Array<any>, immediate: boolean | undefined, apiLog: (functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string) => void, processListeners: (functionName: string, CMIElement?: string, value?: any) => void): Promise<ResultObject>;
    private performFetch;
    private transformResponse;
    updateSettings(settings: InternalSettings): void;
}
