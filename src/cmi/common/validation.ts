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
    regexPattern: string | RegExp, // We accept either a string or a RegExp object to allow the usage of flags.
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
    // COM-VAL-01: Removed redundant value === undefined check (already handled by typeof above)
    if (!matches || matches[0] === "") {
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

    // If value is not a valid number, throw error
    if (isNaN(value)) {
      throw new errorClass(CMIElement, errorCode);
    }

    // COM-VAL-02: Handle empty minimum (no lower bound) and empty/wildcard maximum (no upper bound)
    const hasMinimum = ranges[0] !== "";
    const hasMaximum = ranges[1] !== "" && ranges[1] !== "*";

    // Check minimum bound if it exists
    if (hasMinimum && value < ranges[0]) {
      throw new errorClass(CMIElement, errorCode);
    }

    // Check maximum bound if it exists
    if (hasMaximum && value > ranges[1]) {
      throw new errorClass(CMIElement, errorCode);
    }

    return true;
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, rangePattern, errorCode, _errorClass) =>
    `${CMIElement}:${value}:${rangePattern}:${errorCode}`,
);
