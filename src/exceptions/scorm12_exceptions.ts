import { ValidationError } from "../exceptions";
import { scorm12_constants } from "../constants/api_constants";

const scorm12_errors = scorm12_constants.error_descriptions;

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
        scorm12_errors[String(errorCode)]?.basicMessage || "Unknown error",
        scorm12_errors[String(errorCode)]?.detailMessage,
      );
    } else {
      super(
        101,
        scorm12_errors["101"]?.basicMessage ?? "General error",
        scorm12_errors["101"]?.detailMessage,
      );
    }
  }
}
