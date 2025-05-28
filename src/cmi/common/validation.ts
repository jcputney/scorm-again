import { BaseScormValidationError } from "../../exceptions";

/**
 * Check if the value matches the proper format. If not, throw proper error code.
 *
 * @param {string} value
 * @param {string} regexPattern
 * @param {number} errorCode
 * @param {typeof BaseScormValidationError} errorClass
 * @param {boolean} [allowEmptyString]
 * @return {boolean}
 */
export function checkValidFormat(
  value: string,
  regexPattern: string,
  errorCode: number,
  errorClass: typeof BaseScormValidationError,
  allowEmptyString?: boolean,
): boolean {
  if (typeof value !== "string") {
    return false;
  }
  const formatRegex = new RegExp(regexPattern);
  const matches = value.match(formatRegex);
  if (allowEmptyString && value === "") {
    return true;
  }
  if (value === undefined || !matches || matches[0] === "") {
    throw new errorClass(errorCode);
  }
  return true;
}

/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {any} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @param {typeof BaseScormValidationError} errorClass
 * @return {boolean}
 */
export function checkValidRange(
  value: any,
  rangePattern: string,
  errorCode: number,
  errorClass: typeof BaseScormValidationError,
): boolean {
  const ranges = rangePattern.split("#");
  value = value * 1.0;
  if (ranges[0] && value >= ranges[0]) {
    if (ranges[1] && (ranges[1] === "*" || value <= ranges[1])) {
      return true;
    } else {
      throw new errorClass(errorCode);
    }
  } else {
    throw new errorClass(errorCode);
  }
}
