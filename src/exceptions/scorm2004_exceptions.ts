import { ValidationError } from "./base_exceptions";
import { scorm2004_constants } from "../constants/api_constants";

const scorm2004_errors = scorm2004_constants.error_descriptions;

/**
 * SCORM 2004 Validation Error
 */
export class Scorm2004ValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {string} CMIElement
   * @param {number} errorCode
   */
  constructor(CMIElement: string, errorCode: number) {
    if ({}.hasOwnProperty.call(scorm2004_errors, String(errorCode))) {
      super(
        CMIElement,
        errorCode,
        scorm2004_errors[String(errorCode)]?.basicMessage || "Unknown error",
        scorm2004_errors[String(errorCode)]?.detailMessage,
      );
    } else {
      super(
        CMIElement,
        101,
        scorm2004_errors["101"]?.basicMessage || "General error",
        scorm2004_errors["101"]?.detailMessage,
      );
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Scorm2004ValidationError.prototype);
  }
}
