import { checkValidFormat, checkValidRange } from "../common/validation";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} CMIElement
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check2004ValidFormat(
  CMIElement: string,
  value: string,
  regexPattern: string,
  allowEmptyString?: boolean,
): boolean {
  return checkValidFormat(
    CMIElement,
    value,
    regexPattern,
    scorm2004_errors.TYPE_MISMATCH,
    Scorm2004ValidationError,
    allowEmptyString,
  );
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} CMIElement
 * @param {string} value
 * @param {string} rangePattern
 * @return {boolean}
 */
export function check2004ValidRange(
  CMIElement: string,
  value: string,
  rangePattern: string,
): boolean {
  return checkValidRange(
    CMIElement,
    value,
    rangePattern,
    scorm2004_errors.VALUE_OUT_OF_RANGE,
    Scorm2004ValidationError,
  );
}
