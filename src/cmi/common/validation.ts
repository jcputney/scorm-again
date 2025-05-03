import { BaseScormValidationError } from "../../exceptions";
import { memoize } from "../../utilities";

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
export const checkValidFormat = memoize(
  (
    CMIElement: string,
    value: string,
    regexPattern: string,
    errorCode: number,
    errorClass: typeof BaseScormValidationError,
    allowEmptyString?: boolean,
  ): boolean => {
    // noinspection SuspiciousTypeOfGuard
    if (typeof value !== "string") {
      return false;
    }
    const formatRegex = new RegExp(regexPattern);
    const matches = value.match(formatRegex);
    if (allowEmptyString && value === "") {
      return true;
    }
    if (value === undefined || !matches || matches[0] === "") {
      throw new errorClass(CMIElement, errorCode);
    }
    return true;
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, regexPattern, errorCode, _errorClass, allowEmptyString) => {
    // Use typeof for non-string values to ensure consistent cache keys
    // noinspection SuspiciousTypeOfGuard
    const valueKey = typeof value === "string" ? value : `[${typeof value}]`;
    return `${CMIElement}:${valueKey}:${regexPattern}:${errorCode}:${allowEmptyString || false}`;
  },
);

/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {any} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @param {typeof BaseScormValidationError} errorClass
 * @return {boolean}
 */
export const checkValidRange = memoize(
  (
    CMIElement: string,
    value: any,
    rangePattern: string,
    errorCode: number,
    errorClass: typeof BaseScormValidationError,
  ): boolean => {
    const ranges = rangePattern.split("#");
    value = value * 1.0;
    if (value >= ranges[0]) {
      if (ranges[1] === "*" || value <= ranges[1]) {
        return true;
      } else {
        throw new errorClass(CMIElement, errorCode);
      }
    } else {
      throw new errorClass(CMIElement, errorCode);
    }
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, rangePattern, errorCode, _errorClass) =>
    `${CMIElement}:${value}:${rangePattern}:${errorCode}`,
);
