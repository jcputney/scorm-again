import { checkValidFormat } from "../common/validation";
import { AICCValidationError } from "../../exceptions";
import ErrorCodes from "../../constants/error_codes";
const aicc_error_codes = ErrorCodes.scorm12;

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function checkAICCValidFormat(
  value: string,
  regexPattern: string,
  allowEmptyString?: boolean,
): boolean {
  return checkValidFormat(
    value,
    regexPattern,
    aicc_error_codes.TYPE_MISMATCH,
    AICCValidationError,
    allowEmptyString,
  );
}
