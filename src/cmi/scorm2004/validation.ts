import { checkValidFormat, checkValidRange } from "../common/validation";
import ErrorCodes from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions";

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check2004ValidFormat(
  value: string,
  regexPattern: string,
  allowEmptyString?: boolean,
): boolean {
  return checkValidFormat(
    value,
    regexPattern,
    ErrorCodes.scorm2004.TYPE_MISMATCH,
    Scorm2004ValidationError,
    allowEmptyString,
  );
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} rangePattern
 * @return {boolean}
 */
export function check2004ValidRange(
  value: string,
  rangePattern: string,
): boolean {
  return checkValidRange(
    value,
    rangePattern,
    ErrorCodes.scorm2004.VALUE_OUT_OF_RANGE,
    Scorm2004ValidationError,
  );
}
