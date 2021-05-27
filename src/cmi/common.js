// @flow
import APIConstants from '../constants/api_constants';
import ErrorCodes from '../constants/error_codes';
import Regex from '../constants/regex';

const scorm12_constants = APIConstants.scorm12;
const scorm12_regex = Regex.scorm12;
const scorm12_error_codes = ErrorCodes.scorm12;

/**
 * Check if the value matches the proper format. If not, throw proper error code.
 *
 * @param {string} value
 * @param {string} regexPattern
 * @param {number} errorCode
 * @param {class} errorClass
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function checkValidFormat(
    value: String,
    regexPattern: String,
    errorCode: number,
    errorClass: function,
    allowEmptyString?: boolean) {
  const formatRegex = new RegExp(regexPattern);
  const matches = value.match(formatRegex);
  if (allowEmptyString && value === '') {
    return true;
  }
  if (value === undefined || !matches || matches[0] === '') {
    throw new errorClass.prototype.constructor(errorCode);
  }
  return true;
}

/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {*} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @param {class} errorClass
 * @return {boolean}
 */
export function checkValidRange(
    value: any,
    rangePattern: String,
    errorCode: number,
    errorClass: function) {
  const ranges = rangePattern.split('#');
  value = value * 1.0;
  if (value >= ranges[0]) {
    if ((ranges[1] === '*') || (value <= ranges[1])) {
      return true;
    } else {
      throw new errorClass.prototype.constructor(errorCode);
    }
  } else {
    throw new errorClass.prototype.constructor(errorCode);
  }
}

/**
 * Base class for API cmi objects
 */
export class BaseCMI {
  jsonString = false;
  #initialized = false;
  #start_time;

  /**
   * Constructor for BaseCMI, just marks the class as abstract
   */
  constructor() {
    if (new.target === BaseCMI) {
      throw new TypeError('Cannot construct BaseCMI instances directly');
    }
  }

  /**
   * Getter for #initialized
   * @return {boolean}
   */
  get initialized() {
    return this.#initialized;
  }

  /**
   * Getter for #start_time
   * @return {Number}
   */
  get start_time() {
    return this.#start_time;
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    this.#initialized = true;
  }

  /**
   * Called when the player should override the 'session_time' provided by
   * the module
   */
  setStartTime() {
    this.#start_time = new Date().getTime();
  }
}

/**
 * Base class for cmi *.score objects
 */
export class CMIScore extends BaseCMI {
  /**
   * Constructor for *.score
   * @param {string} score_children
   * @param {string} score_range
   * @param {string} max
   * @param {number} invalidErrorCode
   * @param {number} invalidTypeCode
   * @param {number} invalidRangeCode
   * @param {string} decimalRegex
   * @param {class} errorClass
   */
  constructor(
      {
        score_children,
        score_range,
        max,
        invalidErrorCode,
        invalidTypeCode,
        invalidRangeCode,
        decimalRegex,
        errorClass,
      }) {
    super();

    this.#_children = score_children ||
        scorm12_constants.score_children;
    this.#_score_range = !score_range ? false : scorm12_regex.score_range;
    this.#max = (max || max === '') ? max : '100';
    this.#_invalid_error_code = invalidErrorCode ||
        scorm12_error_codes.INVALID_SET_VALUE;
    this.#_invalid_type_code = invalidTypeCode ||
        scorm12_error_codes.TYPE_MISMATCH;
    this.#_invalid_range_code = invalidRangeCode ||
        scorm12_error_codes.VALUE_OUT_OF_RANGE;
    this.#_decimal_regex = decimalRegex ||
        scorm12_regex.CMIDecimal;
    this.#_error_class = errorClass;
  }

  #_children;
  #_score_range;
  #_invalid_error_code;
  #_invalid_type_code;
  #_invalid_range_code;
  #_decimal_regex;
  #_error_class;
  #raw = '';
  #min = '';
  #max;

  /**
   * Getter for _children
   * @return {string}
   * @private
   */
  get _children() {
    return this.#_children;
  }

  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children) {
    throw new this.#_error_class.prototype.constructor(this.#_invalid_error_code);
  }

  /**
   * Getter for #raw
   * @return {string}
   */
  get raw() {
    return this.#raw;
  }

  /**
   * Setter for #raw
   * @param {string} raw
   */
  set raw(raw) {
    if (checkValidFormat(raw, this.#_decimal_regex, this.#_invalid_type_code, this.#_error_class) &&
        (!this.#_score_range ||
            checkValidRange(raw, this.#_score_range, this.#_invalid_range_code, this.#_error_class))) {
      this.#raw = raw;
    }
  }

  /**
   * Getter for #min
   * @return {string}
   */
  get min() {
    return this.#min;
  }

  /**
   * Setter for #min
   * @param {string} min
   */
  set min(min) {
    if (checkValidFormat(min, this.#_decimal_regex, this.#_invalid_type_code, this.#_error_class) &&
        (!this.#_score_range ||
            checkValidRange(min, this.#_score_range, this.#_invalid_range_code, this.#_error_class))) {
      this.#min = min;
    }
  }

  /**
   * Getter for #max
   * @return {string}
   */
  get max() {
    return this.#max;
  }

  /**
   * Setter for #max
   * @param {string} max
   */
  set max(max) {
    if (checkValidFormat(max, this.#_decimal_regex, this.#_invalid_type_code, this.#_error_class) &&
        (!this.#_score_range ||
            checkValidRange(max, this.#_score_range, this.#_invalid_range_code, this.#_error_class))) {
      this.#max = max;
    }
  }

  /**
   * toJSON for *.score
   * @return {{min: string, max: string, raw: string}}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'raw': this.raw,
      'min': this.min,
      'max': this.max,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Base class for cmi *.n objects
 */
export class CMIArray extends BaseCMI {
  /**
   * Constructor cmi *.n arrays
   * @param {string} children
   * @param {number} errorCode
   * @param {class} errorClass
   */
  constructor({children, errorCode, errorClass}) {
    super();
    this.#_children = children;
    this.#errorCode = errorCode;
    this.#errorClass = errorClass;
    this.childArray = [];
  }

  #errorCode;
  #errorClass;
  #_children;

  /**
   * Getter for _children
   * @return {*}
   */
  get _children() {
    return this.#_children;
  }

  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   */
  set _children(_children) {
    throw new this.#errorClass.prototype.constructor(this.#errorCode);
  }

  /**
   * Getter for _count
   * @return {number}
   */
  get _count() {
    return this.childArray.length;
  }

  /**
   * Setter for _count. Just throws an error.
   * @param {number} _count
   */
  set _count(_count) {
    throw new this.#errorClass.prototype.constructor(this.#errorCode);
  }

  /**
   * toJSON for *.n arrays
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {};
    for (let i = 0; i < this.childArray.length; i++) {
      result[i + ''] = this.childArray[i];
    }
    delete this.jsonString;
    return result;
  }
}
