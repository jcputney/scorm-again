import APIConstants from "./constants/api_constants";
import { BaseScormValidationError } from "./cmi/common";

const scorm12_errors = APIConstants.scorm12.error_descriptions;
const aicc_errors = APIConstants.aicc.error_descriptions;
const scorm2004_errors = APIConstants.scorm2004.error_descriptions;

type APIError = {
  errorCode: number;
  errorMessage: string;
  detailedMessage: string;
};

/**
 * Base Validation Exception
 */
export class ValidationError
  extends BaseScormValidationError
  implements APIError
{
  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   * @param {string} errorMessage
   * @param {string} detailedMessage
   */
  constructor(
    errorCode: number,
    errorMessage: string,
    detailedMessage?: string,
  ) {
    super(errorCode);
    this.setMessage(errorMessage);
    this._errorMessage = errorMessage;
    if (detailedMessage) {
      this._detailedMessage = detailedMessage;
    }
  }

  private readonly _errorMessage: string;
  private readonly _detailedMessage: string = "";

  /**
   * Getter for _errorMessage
   * @return {string}
   */
  get errorMessage(): string {
    return this._errorMessage;
  }

  /**
   * Getter for _detailedMessage
   * @return {string}
   */
  get detailedMessage(): string {
    return this._detailedMessage;
  }
}

/**
 * SCORM 1.2 Validation Error
 */
export class Scorm12ValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {number} errorCode
   */
  constructor(errorCode: number) {
    if ({}.hasOwnProperty.call(scorm12_errors, String(errorCode))) {
      super(
        errorCode,
        scorm12_errors[String(errorCode)].basicMessage,
        scorm12_errors[String(errorCode)].detailMessage,
      );
    } else {
      super(
        101,
        scorm12_errors["101"].basicMessage,
        scorm12_errors["101"].detailMessage,
      );
    }
  }
}

/**
 * AICC Validation Error
 */
export class AICCValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {number} errorCode
   */
  constructor(errorCode: number) {
    if ({}.hasOwnProperty.call(aicc_errors, String(errorCode))) {
      super(
        errorCode,
        aicc_errors[String(errorCode)].basicMessage,
        aicc_errors[String(errorCode)].detailMessage,
      );
    } else {
      super(
        101,
        aicc_errors["101"].basicMessage,
        aicc_errors["101"].detailMessage,
      );
    }
  }
}

/**
 * SCORM 2004 Validation Error
 */
export class Scorm2004ValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {number} errorCode
   */
  constructor(errorCode: number) {
    if ({}.hasOwnProperty.call(scorm2004_errors, String(errorCode))) {
      super(
        errorCode,
        scorm2004_errors[String(errorCode)].basicMessage,
        scorm2004_errors[String(errorCode)].detailMessage,
      );
    } else {
      super(
        101,
        scorm2004_errors["101"].basicMessage,
        scorm2004_errors["101"].detailMessage,
      );
    }
  }
}
