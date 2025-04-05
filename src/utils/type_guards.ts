import { ValidationError } from "../exceptions";
import { CMIArray } from "../cmi/common/array";

/**
 * Type guard for ValidationError
 *
 * @param {unknown} value - The value to check
 * @return {boolean} - Whether the value is a ValidationError
 */
export function isValidationError(value: unknown): boolean {
  // First try the direct instanceof check (works in non-webpack environments)
  if (value instanceof ValidationError) {
    return true;
  }

  // If that fails, use pure duck typing to check for ValidationError properties
  // This is more reliable when compiled through webpack
  return (
    value !== null &&
    typeof value === "object" &&
    // Check for public getters instead of private properties
    "errorCode" in value &&
    "errorMessage" in value &&
    typeof (value as any).errorCode === "number" &&
    typeof (value as any).errorMessage === "string"
  );
}

/**
 * Type guard for Error
 *
 * @param {unknown} value - The value to check
 * @return {boolean} - Whether the value is an Error
 */
export function isError(value: unknown): boolean {
  // First try the direct instanceof check (works in non-webpack environments)
  if (value instanceof Error) {
    return true;
  }

  // If that fails, use duck typing to check for Error properties
  // This is more reliable when compiled through webpack
  return (
    value !== null &&
    typeof value === "object" &&
    "message" in value &&
    typeof (value as any).message === "string" &&
    "name" in value &&
    typeof (value as any).name === "string"
  );
}

/**
 * Type guard for CMIArray
 *
 * @param {unknown} value - The value to check
 * @return {boolean} - Whether the value is a CMIArray
 */
export function isCMIArray(value: unknown): value is CMIArray {
  // First try the direct instanceof check (works in non-webpack environments)
  if (value instanceof CMIArray) {
    return true;
  }

  // If that fails, use duck typing to check for CMIArray properties
  // This is more reliable when compiled through webpack
  return (
    value !== null &&
    typeof value === "object" &&
    "childArray" in value &&
    Array.isArray((value as any).childArray) &&
    "initialized" in value
  );
}
