import { ValidationError } from "../exceptions";
import { CMIArray } from "../cmi/common/array";

/**
 * Type guard for ValidationError
 * 
 * @param {unknown} value - The value to check
 * @return {boolean} - Whether the value is a ValidationError
 */
export function isValidationError(value: unknown): value is ValidationError {
  return value instanceof ValidationError;
}

/**
 * Type guard for Error
 * 
 * @param {unknown} value - The value to check
 * @return {boolean} - Whether the value is an Error
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

/**
 * Type guard for CMIArray
 * 
 * @param {unknown} value - The value to check
 * @return {boolean} - Whether the value is a CMIArray
 */
export function isCMIArray(value: unknown): value is CMIArray {
  return value instanceof CMIArray;
}