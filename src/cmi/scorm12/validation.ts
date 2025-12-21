import { checkValidFormat, checkValidRange } from "../common/validation";
import { scorm12_errors } from "../../constants/error_codes";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} CMIElement
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidFormat(
  CMIElement: string,
  value: string,
  regexPattern: string | RegExp, // We accept either a string or a RegExp object to allow the usage of flags.
  allowEmptyString?: boolean,
): boolean {
  return checkValidFormat(
    CMIElement,
    value,
    regexPattern,
    scorm12_errors.TYPE_MISMATCH as number,
    Scorm12ValidationError,
    allowEmptyString,
  );
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} CMIElement
 * @param {string} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidRange(
  CMIElement: string,
  value: any,
  rangePattern: string,
  allowEmptyString?: boolean,
): boolean {
  if (value === "") {
    if (!allowEmptyString) {
      throw new Scorm12ValidationError(CMIElement, scorm12_errors.VALUE_OUT_OF_RANGE as number);
    }
    return true; // VAL-01: Early return for empty string when allowEmptyString is true
  }

  return checkValidRange(
    CMIElement,
    value,
    rangePattern,
    scorm12_errors.VALUE_OUT_OF_RANGE as number,
    Scorm12ValidationError,
  );
}
