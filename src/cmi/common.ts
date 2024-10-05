import APIConstants from "../constants/api_constants";
import ErrorCodes from "../constants/error_codes";
import Regex from "../constants/regex";

const scorm12_constants = APIConstants.scorm12;
const scorm12_regex = Regex.scorm12;
const scorm12_error_codes = ErrorCodes.scorm12;

export class BaseScormValidationError extends Error {
  constructor(errorCode: number) {
    super(errorCode.toString());
    this._errorCode = errorCode;
    this.name = 'ScormValidationError';
  }

  private readonly _errorCode: number;

  /**
   * Getter for _errorCode
   * @return {number}
   */
  get errorCode(): number {
    return this._errorCode
  }

  setMessage(message: string) {
    this.message = message;
  }
}

export class BaseScorm12ValidationError extends BaseScormValidationError {
  constructor(errorCode: number) {
    super(errorCode);
    this.name = 'Scorm12ValidationError';
  }
}

export class BaseScorm2004ValidationError extends BaseScormValidationError {
  constructor(errorCode: number) {
    super(errorCode);
    this.name = 'Scorm2004ValidationError';
  }
}

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
    allowEmptyString?: boolean
): boolean {
  const formatRegex = new RegExp(regexPattern);
  const matches = value.match(formatRegex);
  if (allowEmptyString && value === '') {
    return true;
  }
  if (value === undefined || !matches || matches[0] === '') {
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
    errorClass: typeof BaseScormValidationError
): boolean {
  const ranges = rangePattern.split('#');
  value = value * 1.0;
  if (value >= ranges[0]) {
    if (ranges[1] === '*' || value <= ranges[1]) {
      return true;
    } else {
      throw new errorClass(errorCode);
    }
  } else {
    throw new errorClass(errorCode);
  }
}

/**
 * Base class for API cmi objects
 */
export abstract class BaseCMI {
  jsonString? = false;
  private _initialized = false;
  private _start_time: number | undefined;

  /**
   * Getter for _initialized
   * @return {boolean}
   */
  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * Getter for _start_time
   * @return {number | undefined}
   */
  get start_time(): number | undefined {
    return this._start_time;
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize(): void {
    this._initialized = true;
  }

  /**
   * Called when the player should override the 'session_time' provided by
   * the module
   */
  setStartTime(): void {
    this._start_time = new Date().getTime();
  }
}

/**
 * Base class for cmi root objects
 */
export abstract class BaseRootCMI extends BaseCMI {
  abstract getCurrentTotalTime(): string;
}

/**
 * Base class for cmi *.score objects
 */
export class CMIScore extends BaseCMI {
  private __children: string;
  private __score_range: string | false;
  private __invalid_error_code: number;
  private __invalid_type_code: number;
  private __invalid_range_code: number;
  private __decimal_regex: string;
  private __error_class: typeof BaseScormValidationError;
  private _raw = '';
  private _min = '';
  private _max: string;

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
   *     errorClass: ErrorClass
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
    this.__score_range = !params.score_range ? false : scorm12_regex.score_range;
    this._max = (params.max || params.max === '') ? params.max : '100';
    this.__invalid_error_code = params.invalidErrorCode || scorm12_error_codes.INVALID_SET_VALUE;
    this.__invalid_type_code = params.invalidTypeCode || scorm12_error_codes.TYPE_MISMATCH;
    this.__invalid_range_code = params.invalidRangeCode || scorm12_error_codes.VALUE_OUT_OF_RANGE;
    this.__decimal_regex = params.decimalRegex || scorm12_regex.CMIDecimal;
    this.__error_class = params.errorClass;
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
        checkValidFormat(raw, this.__decimal_regex, this.__invalid_type_code, this.__error_class) &&
        (!this.__score_range || checkValidRange(raw, this.__score_range, this.__invalid_range_code, this.__error_class))
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
        checkValidFormat(min, this.__decimal_regex, this.__invalid_type_code, this.__error_class) &&
        (!this.__score_range || checkValidRange(min, this.__score_range, this.__invalid_range_code, this.__error_class))
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
        checkValidFormat(max, this.__decimal_regex, this.__invalid_type_code, this.__error_class) &&
        (!this.__score_range || checkValidRange(max, this.__score_range, this.__invalid_range_code, this.__error_class))
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
    min: string,
    max: string,
    raw: string
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

/**
 * Base class for cmi *.n objects
 */
export class CMIArray extends BaseCMI {
  private _errorCode: number;
  private _errorClass: typeof BaseScormValidationError;
  private __children: string;
  childArray: any[];

  /**
   * Constructor cmi *.n arrays
   * @param {object} params
   */
  constructor(params: {
    children: string;
    errorCode?: number;
    errorClass?: typeof BaseScormValidationError;
  }) {
    super();
    this.__children = params.children;
    this._errorCode = params.errorCode || scorm12_error_codes.GENERAL;
    this._errorClass = params.errorClass || BaseScorm12ValidationError;
    this.childArray = [];
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
    throw new this._errorClass(this._errorCode);
  }

  /**
   * Getter for _count
   * @return {number}
   */
  get _count(): number {
    return this.childArray.length;
  }

  /**
   * Setter for _count. Just throws an error.
   * @param {number} _count
   */
  set _count(_count: number) {
    throw new this._errorClass(this._errorCode);
  }

  /**
   * toJSON for *.n arrays
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result: { [key: string]: any } = {};
    for (let i = 0; i < this.childArray.length; i++) {
      result[i + ''] = this.childArray[i];
    }
    delete this.jsonString;
    return result;
  }
}