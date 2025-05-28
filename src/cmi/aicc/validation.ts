import { checkValidFormat } from "../common/validation";
import { AICCValidationError } from "../../exceptions/aicc_exceptions";
import { scorm12_errors } from "../../constants/error_codes";

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
    scorm12_errors.TYPE_MISMATCH as number,
    AICCValidationError,
    allowEmptyString,
  );
}
