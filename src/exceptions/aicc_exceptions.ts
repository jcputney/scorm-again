import { ValidationError } from "../exceptions";
import { aicc_constants } from "../constants/api_constants";

const aicc_errors = aicc_constants.error_descriptions;

/**
 * AICC Validation Error
 */
export class AICCValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {string} CMIElement
   * @param {number} errorCode
   */
  constructor(CMIElement: string, errorCode: number) {
    if ({}.hasOwnProperty.call(aicc_errors, String(errorCode))) {
      super(
        CMIElement,
        errorCode,
        aicc_errors[String(errorCode)]?.basicMessage || "Unknown error",
        aicc_errors[String(errorCode)]?.detailMessage,
      );
    } else {
      super(
        CMIElement,
        101,
        aicc_errors["101"]?.basicMessage || "General error",
        aicc_errors["101"]?.detailMessage,
      );
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AICCValidationError.prototype);
  }
}
