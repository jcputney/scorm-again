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
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @param {string} decimalRegex - The regex pattern for decimal validation
   * @param {string | false} scoreRange - The range pattern for score validation, or false if no range validation is needed
   * @param {number} invalidTypeCode - The error code for invalid type
   * @param {number} invalidRangeCode - The error code for invalid range
   * @param {typeof BaseScormValidationError} errorClass - The error class to use for validation errors
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScore(
    CMIElement: string,
    value: string,
    decimalRegex: string,
    scoreRange: string | false,
    invalidTypeCode: number,
    invalidRangeCode: number,
    errorClass: typeof BaseScormValidationError,
  ): boolean {
    return (
      checkValidFormat(CMIElement, value, decimalRegex, invalidTypeCode, errorClass) &&
      (!scoreRange || checkValidRange(CMIElement, value, scoreRange, invalidRangeCode, errorClass))
    );
    // This line should never be reached due to exceptions being thrown
  }

  /**
   * Validates a SCORM 1.2 audio property
   *
   * @spec SCORM 1.2 RTE 3.4.2.3.1 - Audio preference validation
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Audio(CMIElement: string, value: string): boolean {
    return (
      check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) &&
      check12ValidRange(CMIElement, value, scorm12_regex.audio_range)
    );
  }

  /**
   * Validates a SCORM 1.2 language property
   *
   * @spec SCORM 1.2 RTE 3.4.2.3.2 - Language preference validation
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Language(CMIElement: string, value: string): boolean {
    return check12ValidFormat(CMIElement, value, scorm12_regex.CMIString256);
  }

  /**
   * Validates a SCORM 1.2 speed property
   *
   * @spec SCORM 1.2 RTE 3.4.2.3.3 - Speed preference validation
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Speed(CMIElement: string, value: string): boolean {
    return (
      check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) &&
      check12ValidRange(CMIElement, value, scorm12_regex.speed_range)
    );
  }

  /**
   * Validates a SCORM 1.2 text property
   *
   * @spec SCORM 1.2 RTE 3.4.2.3.4 - Text preference validation
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Text(CMIElement: string, value: string): boolean {
    return (
      check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) &&
      check12ValidRange(CMIElement, value, scorm12_regex.text_range)
    );
  }

  /**
   * Validates if a property is read-only
   *
   * @param {string} CMIElement
   * @param {boolean} initialized - Whether the object is initialized
   * @throws {BaseScormValidationError} - Throws an error if the object is initialized
   */
  validateReadOnly(CMIElement: string, initialized: boolean): void {
    if (initialized) {
      throw new Scorm12ValidationError(CMIElement, scorm12_errors.READ_ONLY_ELEMENT as number);
    }
  }
}

// Export a singleton instance of the ValidationService
export const validationService = new ValidationService();
