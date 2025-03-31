import { BaseScormValidationError } from "../exceptions";
import { checkValidFormat, checkValidRange } from "../cmi/common/validation";
import { check12ValidFormat, check12ValidRange } from "../cmi/scorm12/validation";
import { scorm12_regex } from "../constants/regex";
import { scorm12_errors } from "../constants/error_codes";
import { Scorm12ValidationError } from "../exceptions/scorm12_exceptions";

/**
 * Service for validating CMI data model properties
 */
export class ValidationService {
  /**
   * Validates a score property (raw, min, max)
   * 
   * @param {string} value - The value to validate
   * @param {string} decimalRegex - The regex pattern for decimal validation
   * @param {string | false} scoreRange - The range pattern for score validation, or false if no range validation is needed
   * @param {number} invalidTypeCode - The error code for invalid type
   * @param {number} invalidRangeCode - The error code for invalid range
   * @param {typeof BaseScormValidationError} errorClass - The error class to use for validation errors
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScore(
    value: string,
    decimalRegex: string,
    scoreRange: string | false,
    invalidTypeCode: number,
    invalidRangeCode: number,
    errorClass: typeof BaseScormValidationError,
  ): boolean {
    if (
      checkValidFormat(
        value,
        decimalRegex,
        invalidTypeCode,
        errorClass,
      ) &&
      (!scoreRange ||
        checkValidRange(
          value,
          scoreRange,
          invalidRangeCode,
          errorClass,
        ))
    ) {
      return true;
    }
    return false; // This line should never be reached due to exceptions being thrown
  }

  /**
   * Validates a SCORM 1.2 audio property
   * 
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Audio(value: string): boolean {
    return (
      check12ValidFormat(value, scorm12_regex.CMISInteger) &&
      check12ValidRange(value, scorm12_regex.audio_range)
    );
  }

  /**
   * Validates a SCORM 1.2 language property
   * 
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Language(value: string): boolean {
    return check12ValidFormat(value, scorm12_regex.CMIString256);
  }

  /**
   * Validates a SCORM 1.2 speed property
   * 
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Speed(value: string): boolean {
    return (
      check12ValidFormat(value, scorm12_regex.CMISInteger) &&
      check12ValidRange(value, scorm12_regex.speed_range)
    );
  }

  /**
   * Validates a SCORM 1.2 text property
   * 
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Text(value: string): boolean {
    return (
      check12ValidFormat(value, scorm12_regex.CMISInteger) &&
      check12ValidRange(value, scorm12_regex.text_range)
    );
  }

  /**
   * Validates if a property is read-only
   * 
   * @param {boolean} initialized - Whether the object is initialized
   * @throws {BaseScormValidationError} - Throws an error if the object is initialized
   */
  validateReadOnly(initialized: boolean): void {
    if (initialized) {
      throw new Scorm12ValidationError(scorm12_errors.READ_ONLY_ELEMENT);
    }
  }
}

// Export a singleton instance of the ValidationService
export const validationService = new ValidationService();