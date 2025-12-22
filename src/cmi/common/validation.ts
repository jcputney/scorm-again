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
    const valueKey = typeof value === "string" ? value : `[${typeof value}]`;
    return `${CMIElement}:${valueKey}:${regexPattern}:${errorCode}:${allowEmptyString || false}`;
  },
);

/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * Range pattern format per SCORM RTE specifications:
 * - "min#max": bounded range (e.g., "0#100" = 0 to 100)
 * - "min#*": unbounded maximum (e.g., "-1#*" = -1 to infinity)
 * - "#max": no minimum bound (e.g., "#100" = up to 100)
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
    value = Number(value);

    // If value is not a valid number, throw error
    if (isNaN(value)) {
      throw new errorClass(CMIElement, errorCode);
    }

    // COM-VAL-02: Handle empty minimum (no lower bound) and empty/wildcard maximum (no upper bound)
    // This structure uses independent bound checks rather than nested conditionals to:
    // 1. Correctly handle all SCORM range patterns ("#max", "min#", "min#*", "min#max")
    // 2. Make the validation logic explicit and testable for each boundary condition
    // 3. Avoid the complexity and error-proneness of deeply nested if-else statements
    const minBound = ranges[0];
    const maxBound = ranges[1];
    const hasMinimum = minBound !== undefined && minBound !== "";
    const hasMaximum = maxBound !== undefined && maxBound !== "" && maxBound !== "*";

    // Check minimum bound if it exists
    if (hasMinimum && value < Number(minBound)) {
      throw new errorClass(CMIElement, errorCode);
    }

    // Check maximum bound if it exists
    if (hasMaximum && value > Number(maxBound)) {
      throw new errorClass(CMIElement, errorCode);
    }

    return true;
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, rangePattern, errorCode, _errorClass) =>
    `${CMIElement}:${value}:${rangePattern}:${errorCode}`,
);
