import { LogLevelEnum } from "../constants/enums";
import { global_constants } from "../constants/api_constants";
import { ErrorCode } from "../constants/error_codes";
import { ValidationError } from "../exceptions";
import { IErrorHandlingService } from "../interfaces/services";
import { isValidationError, isError } from "../utils/type_guards";

/**
 * Service for handling SCORM errors
 */
export class ErrorHandlingService implements IErrorHandlingService {
  private _lastErrorCode: string = "0";
  private readonly _errorCodes: ErrorCode;
  private readonly _apiLog: (
    functionName: string,
    message: string,
    logLevel?: LogLevelEnum,
  ) => void;
  private readonly _getLmsErrorMessageDetails: (errorCode: number) => string;

  /**
   * Constructor for ErrorHandlingService
   *
   * @param {ErrorCode} errorCodes - The error codes object
   * @param {Function} apiLog - Function for logging API calls
   * @param {Function} getLmsErrorMessageDetails - Function for getting error message details
   */
  constructor(
    errorCodes: ErrorCode,
    apiLog: (
      functionName: string,
      message: string,
      logLevel?: LogLevelEnum,
    ) => void,
    getLmsErrorMessageDetails: (errorCode: number) => string,
  ) {
    this._errorCodes = errorCodes;
    this._apiLog = apiLog;
    this._getLmsErrorMessageDetails = getLmsErrorMessageDetails;
  }

  /**
   * Get the last error code
   *
   * @return {string} - The last error code
   */
  get lastErrorCode(): string {
    return this._lastErrorCode;
  }

  /**
   * Set the last error code
   *
   * @param {string} errorCode - The error code to set
   */
  set lastErrorCode(errorCode: string) {
    this._lastErrorCode = errorCode;
  }

  /**
   * Throws a SCORM error
   *
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   */
  throwSCORMError(errorNumber: number, message?: string): void {
    if (!message) {
      message = this._getLmsErrorMessageDetails(errorNumber);
    }

    this._apiLog(
      "throwSCORMError",
      errorNumber + ": " + message,
      LogLevelEnum.ERROR,
    );

    this._lastErrorCode = String(errorNumber);
  }

  /**
   * Clears the last SCORM error code on success.
   *
   * @param {string} success - Whether the operation was successful
   */
  clearSCORMError(success: string): void {
    if (success !== undefined && success !== global_constants.SCORM_FALSE) {
      this._lastErrorCode = "0";
    }
  }

  /**
   * Handles the error that occurs when trying to access a value
   *
   * @param {ValidationError|Error|unknown} e - The exception that was thrown
   * @param {string} returnValue - The default return value
   * @return {string} - The return value after handling the exception
   */
  handleValueAccessException(e: ValidationError | Error | unknown, returnValue: string): string {
    if (isValidationError(e)) {
      this._lastErrorCode = String(e.errorCode);
      returnValue = global_constants.SCORM_FALSE;
    } else {
      if (isError(e) && e.message) {
        console.error(e.message);
      } else {
        console.error(e);
      }
      this.throwSCORMError(this._errorCodes.GENERAL);
    }
    return returnValue;
  }

  /**
   * Get the error codes object
   *
   * @return {ErrorCode} - The error codes object
   */
  get errorCodes(): ErrorCode {
    return this._errorCodes;
  }
}

// Export a factory function to create the service
export function createErrorHandlingService(
  errorCodes: ErrorCode,
  apiLog: (
    functionName: string,
    message: string,
    logLevel?: LogLevelEnum,
  ) => void,
  getLmsErrorMessageDetails: (errorCode: number) => string,
): ErrorHandlingService {
  return new ErrorHandlingService(
    errorCodes,
    apiLog,
    getLmsErrorMessageDetails,
  );
}
