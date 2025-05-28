import { scorm12_constants } from "../../constants/api_constants";
import { scorm12_regex } from "../../constants/regex";
import { BaseCMI } from "./base_cmi";
import { checkValidFormat, checkValidRange } from "./validation";
import { scorm12_errors } from "../../constants/error_codes";
import { BaseScormValidationError } from "../../exceptions";

/**
 * Base class for cmi *.score objects
 */
export class CMIScore extends BaseCMI {
  private readonly __children: string;
  private readonly __score_range: string | false;
  private readonly __invalid_error_code: number;
  private readonly __invalid_type_code: number;
  private readonly __invalid_range_code: number;
  private readonly __decimal_regex: string;
  private readonly __error_class: typeof BaseScormValidationError;
  protected _raw = "";
  protected _min = "";
  protected _max: string;

  /**
   * Constructor for *.score
   * @param {
   *     score_children: string,
   *     score_range: string,
   *     max: string,
   *     invalidErrorCode: number,
   *     invalidTypeCode: number,
   *     invalidRangeCode: number,
   *     decimalRegex: string,
   *     errorClass: typeof BaseScormValidationError
   * } params
   */
  constructor(params: {
    score_children?: string;
    score_range?: string;
    max?: string;
    invalidErrorCode?: number;
    invalidTypeCode?: number;
    invalidRangeCode?: number;
    decimalRegex?: string;
    errorClass: typeof BaseScormValidationError;
  }) {
    super();

    this.__children = params.score_children || scorm12_constants.score_children;
    this.__score_range = !params.score_range
      ? false
      : scorm12_regex.score_range;
    this._max = params.max || params.max === "" ? params.max : "100";
    this.__invalid_error_code =
      params.invalidErrorCode || (scorm12_errors.INVALID_SET_VALUE as number);
    this.__invalid_type_code =
      params.invalidTypeCode || (scorm12_errors.TYPE_MISMATCH as number);
    this.__invalid_range_code =
      params.invalidRangeCode || (scorm12_errors.VALUE_OUT_OF_RANGE as number);
    this.__decimal_regex = params.decimalRegex || scorm12_regex.CMIDecimal;
    this.__error_class = params.errorClass;
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
  }

  /**
   * Getter for _children
   * @return {string}
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   */
  set _children(_children: string) {
    throw new this.__error_class(this.__invalid_error_code);
  }

  /**
   * Getter for _raw
   * @return {string}
   */
  get raw(): string {
    return this._raw;
  }

  /**
   * Setter for _raw
   * @param {string} raw
   */
  set raw(raw: string) {
    if (
      checkValidFormat(
        raw,
        this.__decimal_regex,
        this.__invalid_type_code,
        this.__error_class,
      ) &&
      (!this.__score_range ||
        checkValidRange(
          raw,
          this.__score_range,
          this.__invalid_range_code,
          this.__error_class,
        ))
    ) {
      this._raw = raw;
    }
  }

  /**
   * Getter for _min
   * @return {string}
   */
  get min(): string {
    return this._min;
  }

  /**
   * Setter for _min
   * @param {string} min
   */
  set min(min: string) {
    if (
      checkValidFormat(
        min,
        this.__decimal_regex,
        this.__invalid_type_code,
        this.__error_class,
      ) &&
      (!this.__score_range ||
        checkValidRange(
          min,
          this.__score_range,
          this.__invalid_range_code,
          this.__error_class,
        ))
    ) {
      this._min = min;
    }
  }

  /**
   * Getter for _max
   * @return {string}
   */
  get max(): string {
    return this._max;
  }

  /**
   * Setter for _max
   * @param {string} max
   */
  set max(max: string) {
    if (
      checkValidFormat(
        max,
        this.__decimal_regex,
        this.__invalid_type_code,
        this.__error_class,
      ) &&
      (!this.__score_range ||
        checkValidRange(
          max,
          this.__score_range,
          this.__invalid_range_code,
          this.__error_class,
        ))
    ) {
      this._max = max;
    }
  }

  /**
   * toJSON for *.score
   * @return {
   *    {
   *      min: string,
   *      max: string,
   *      raw: string
   *    }
   *    }
   */
  toJSON(): {
    min: string;
    max: string;
    raw: string;
  } {
    this.jsonString = true;
    const result = {
      raw: this.raw,
      min: this.min,
      max: this.max,
    };
    delete this.jsonString;
    return result;
  }
}
