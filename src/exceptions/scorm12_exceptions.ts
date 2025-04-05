import { ValidationError } from "../exceptions";
import { scorm12_constants } from "../constants/api_constants";

const scorm12_errors = scorm12_constants.error_descriptions;

/**
 * SCORM 1.2 Validation Error
 */
export class Scorm12ValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {string} CMIElement
   * @param {number} errorCode
   */
  constructor(CMIElement: string, errorCode: number) {
    if ({}.hasOwnProperty.call(scorm12_errors, String(errorCode))) {
      super(
        CMIElement,
        errorCode,
        scorm12_errors[String(errorCode)].basicMessage,
        scorm12_errors[String(errorCode)].detailMessage,
      );
    } else {
      super(
        CMIElement,
        101,
        scorm12_errors["101"].basicMessage,
        scorm12_errors["101"].detailMessage,
      );
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Scorm12ValidationError.prototype);
  }
}
