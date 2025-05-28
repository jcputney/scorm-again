import { ValidationError } from "../exceptions";
import { aicc_constants } from "../constants/api_constants";

const aicc_errors = aicc_constants.error_descriptions;

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
        aicc_errors[String(errorCode)]?.basicMessage || "Unknown rror",
        aicc_errors[String(errorCode)]?.detailMessage,
      );
    } else {
      super(
        101,
        aicc_errors["101"]?.basicMessage || "General error",
        aicc_errors["101"]?.detailMessage,
      );
    }
  }
}
