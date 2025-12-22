import { CommitObject, LogLevel, ResultObject, Settings } from "../types/api_types";
import { ErrorCode } from "../constants/error_codes";
import { LogLevelEnum } from "../constants/enums";
import { BaseCMI } from "../cmi/common/base_cmi";
import { ValidationError } from "../exceptions";
import { StringKeyMap } from "../utilities";
export interface IHttpService {
    processHttpRequest(url: string, params: CommitObject | StringKeyMap | Array<any>, immediate: boolean, apiLog: (functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string) => void, processListeners: (functionName: string, CMIElement?: string, value?: any) => void): ResultObject;
    updateSettings(settings: Settings): void;
}
export interface IEventService {
    on(listenerName: string, callback: Function): void;
    off(listenerName: string, callback: Function): void;
    clear(listenerName: string): void;
    processListeners(functionName: string, CMIElement?: string, value?: any): void;
    reset(): void;
}
export interface ISerializationService {
    loadFromFlattenedJSON(json: object, CMIElement: string, setCMIValue: (CMIElement: string, value: any) => void, isNotInitialized: () => boolean, setStartingData: (data: StringKeyMap) => void): void;
    loadFromJSON(json: object, CMIElement: string, setCMIValue: (CMIElement: string, value: any) => void, isNotInitialized: () => boolean, setStartingData: (data: StringKeyMap) => void): void;
    renderCMIToJSONString(cmi: BaseCMI | StringKeyMap, sendFullCommit: boolean): string;
    renderCMIToJSONObject(cmi: BaseCMI | StringKeyMap, sendFullCommit: boolean): StringKeyMap;
    getCommitObject(terminateCommit: boolean, alwaysSendTotalTime: boolean, renderCommonCommitFields: boolean | ((commitObject: CommitObject) => boolean), renderCommitObject: (terminateCommit: boolean, includeTotalTime?: boolean) => CommitObject, renderCommitCMI: (terminateCommit: boolean, includeTotalTime?: boolean) => StringKeyMap | Array<any>, apiLogLevel: LogLevel): CommitObject | StringKeyMap | Array<any>;
}
export interface ICMIDataService {
    updateLastErrorCode(errorCode: string): void;
    throwSCORMError(CMIElement: string, errorNumber: number, message?: string, throwException?: boolean): void;
    setCMIValue(cmi: StringKeyMap, methodName: string, scorm2004: boolean, CMIElement: string, value: any, isInitialized: boolean): string;
    getCMIValue(cmi: StringKeyMap, methodName: string, scorm2004: boolean, CMIElement: string): string;
}
export interface IErrorHandlingService {
    get lastErrorCode(): string;
    set lastErrorCode(errorCode: string);
    get lastDiagnostic(): string;
    throwSCORMError(CMIElement: string | undefined, errorNumber: number, message?: string): void;
    clearSCORMError(success: string): void;
    handleValueAccessException(CMIElement: string, e: ValidationError | Error | unknown, returnValue: string): string;
    get errorCodes(): ErrorCode;
}
export interface ILoggingService {
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    setLogHandler(handler: (messageLevel: LogLevel, logMessage: string) => void): void;
    log(messageLevel: LogLevel, logMessage: string): void;
    error(logMessage: string): void;
    warn(logMessage: string): void;
    info(logMessage: string): void;
    debug(logMessage: string): void;
}
export interface IOfflineStorageService {
    storeOffline(courseId: string, commitData: CommitObject): ResultObject;
    getOfflineData(courseId: string): Promise<CommitObject | null>;
    syncOfflineData(): Promise<boolean>;
    hasPendingOfflineData(courseId: string): Promise<boolean>;
    isDeviceOnline(): boolean;
    updateSettings(settings: Settings): void;
}
//# sourceMappingURL=services.d.ts.map