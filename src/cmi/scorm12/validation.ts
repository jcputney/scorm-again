import {checkValidFormat, checkValidRange} from "../common/validation";
import ErrorCodes from "../../constants/error_codes";
import {Scorm12ValidationError} from "../../exceptions";

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidFormat(
  value: string,
  regexPattern: string,
  allowEmptyString?: boolean,
): boolean {
  return checkValidFormat(
    value,
    regexPattern,
    ErrorCodes.scorm12.TYPE_MISMATCH,
    Scorm12ValidationError,
    allowEmptyString,
  );
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidRange(
  value: any,
  rangePattern: string,
  allowEmptyString?: boolean,
): boolean {
  if (!allowEmptyString && value === "") {
    throw new Scorm12ValidationError(ErrorCodes.scorm12.VALUE_OUT_OF_RANGE);
  }

  return checkValidRange(
    value,
    rangePattern,
    ErrorCodes.scorm12.VALUE_OUT_OF_RANGE,
    Scorm12ValidationError,
  );
}