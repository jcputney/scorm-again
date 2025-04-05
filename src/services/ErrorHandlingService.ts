import { LogLevelEnum } from "../constants/enums";
import { global_constants } from "../constants/api_constants";
import { ErrorCode } from "../constants/error_codes";
import { ValidationError } from "../exceptions";
import { IErrorHandlingService } from "../interfaces/services";
import { isError, isValidationError } from "../utils/type_guards";

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
    CMIElement?: string,
  ) => void;
  private readonly _getLmsErrorMessageDetails: (errorCode: number, detail: boolean) => string;

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
      CMIElement?: string,
    ) => void,
    getLmsErrorMessageDetails: (errorCode: number, detail: boolean) => string,
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
   * @param {string} CMIElement
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   * @throws {ValidationError} - If throwException is true, throws a ValidationError
   */
  throwSCORMError(CMIElement: string, errorNumber: number, message?: string): void {
    if (!message) {
      message = this._getLmsErrorMessageDetails(errorNumber, true);
    }

    this._apiLog("throwSCORMError", errorNumber + ": " + message, LogLevelEnum.ERROR, CMIElement);

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
   * Handles exceptions that occur when accessing or setting CMI values.
   *
   * This method provides centralized error handling for exceptions that occur during
   * CMI data operations. It differentiates between different types of errors and
   * handles them appropriately:
   *
   * 1. ValidationError: These are expected errors from the validation system that
   *    indicate a specific SCORM error condition (like invalid data format or range).
   *    For these errors, the method:
   *    - Sets the lastErrorCode to the error code from the ValidationError
   *    - Returns SCORM_FALSE to indicate failure to the caller
   *
   * 2. Standard JavaScript Error: For general JavaScript errors (like TypeError,
   *    ReferenceError, etc.), the method:
   *    - Logs the error message to the console
   *    - Sets a general SCORM error
   *    - Returns SCORM_FALSE to indicate failure
   *
   * 3. Unknown exceptions: For any other type of exception that doesn't match the
   *    above categories, the method:
   *    - Logs the entire exception object to the console
   *    - Sets a general SCORM error
   *    - Returns SCORM_FALSE to indicate failure
   *
   * This method is critical for maintaining SCORM compliance by ensuring that
   * all errors are properly translated into the appropriate SCORM error codes.
   *
   * @param {string} CMIElement
   * @param {ValidationError|Error|unknown} e - The exception that was thrown
   * @param {string} returnValue - The default return value (typically an empty string)
   * @return {string} - Either the original returnValue or SCORM_FALSE if an error occurred
   *
   * @example
   * try {
   *   const value = getCMIValue("cmi.core.score.raw");
   *   return value;
   * } catch (e) {
   *   return handleValueAccessException(e, "");
   * }
   */
  handleValueAccessException(
    CMIElement: string,
    e: Error | ValidationError,
    returnValue: string,
  ): string {
    if (isValidationError(e)) {
      const validationError = e as ValidationError;
      this._lastErrorCode = String(validationError.errorCode);
      returnValue = global_constants.SCORM_FALSE;
    } else {
      if (isError(e) && e.message) {
        console.error(e.message);
        this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, e.message);
      } else {
        console.error(e);
        this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, "Unknown error");
      }
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
    CMIElement?: string,
  ) => void,
  getLmsErrorMessageDetails: (errorCode: number, detail: boolean) => string,
): ErrorHandlingService {
  return new ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails);
}
