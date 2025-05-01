import { LogLevelEnum } from "../constants/enums";
import { ErrorCode } from "../constants/error_codes";
import { ValidationError } from "../exceptions";
import { IErrorHandlingService, ILoggingService } from "../interfaces/services";
export declare class ErrorHandlingService implements IErrorHandlingService {
    private _lastErrorCode;
    private readonly _errorCodes;
    private readonly _apiLog;
    private readonly _getLmsErrorMessageDetails;
    private readonly _loggingService;
    constructor(errorCodes: ErrorCode, apiLog: (functionName: string, message: string, logLevel?: LogLevelEnum, CMIElement?: string) => void, getLmsErrorMessageDetails: (errorCode: number, detail: boolean) => string, loggingService?: ILoggingService);
    get lastErrorCode(): string;
    set lastErrorCode(errorCode: string);
    throwSCORMError(CMIElement: string, errorNumber: number, message?: string): void;
    clearSCORMError(success: string): void;
    handleValueAccessException(CMIElement: string, e: Error | ValidationError | unknown, returnValue: string): string;
    get errorCodes(): ErrorCode;
}
export declare function createErrorHandlingService(errorCodes: ErrorCode, apiLog: (functionName: string, message: string, logLevel: LogLevelEnum, CMIElement?: string) => void, getLmsErrorMessageDetails: (errorCode: number, detail: boolean) => string, loggingService?: ILoggingService): ErrorHandlingService;
