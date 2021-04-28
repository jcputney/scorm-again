// @flow
import APIConstants from '../constants/api_constants';
import ErrorCodes from '../constants/error_codes';
import {ValidationError} from '../exceptions';
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
 * @param {string} errorMessage
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function checkValidFormat(
    value: String,
    regexPattern: String,
    errorCode: number,
    errorMessage: String,
    allowEmptyString?: boolean) {
  const formatRegex = new RegExp(regexPattern);
  const matches = value.match(formatRegex);
  if (allowEmptyString && value === '') {
    return true;
  }
  if (value === undefined || !matches || matches[0] === '') {
    throw new ValidationError(errorCode, errorMessage);
  }
  return true;
}

/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {*} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @param {string} errorMessage
 * @return {boolean}
 */
export function checkValidRange(
    value: any, rangePattern: String, errorCode: number, errorMessage: String) {
  const ranges = rangePattern.split('#');
  value = value * 1.0;
  if (value >= ranges[0]) {
    if ((ranges[1] === '*') || (value <= ranges[1])) {
      return true;
    } else {
      throw new ValidationError(errorCode, errorMessage);
    }
  } else {
    throw new ValidationError(errorCode, errorMessage);
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
   * @param {string} invalidErrorMessage
   * @param {number} invalidTypeCode
   * @param {string} invalidTypeMessage
   * @param {number} invalidRangeCode
   * @param {string} invalidRangeMessage
   * @param {string} decimalRegex
   */
  constructor(
      {
        score_children,
        score_range,
        max,
        invalidErrorCode,
        invalidErrorMessage,
        invalidTypeCode,
        invalidTypeMessage,
        invalidRangeCode,
        invalidRangeMessage,
        decimalRegex,
      }) {
    super();

    this.#_children = score_children ||
        scorm12_constants.score_children;
    this.#_score_range = !score_range ? false : scorm12_regex.score_range;
    this.#max = (max || max === '') ? max : '100';
    this.#_invalid_error_code = invalidErrorCode ||
        scorm12_error_codes.INVALID_SET_VALUE;
    this.#_invalid_error_message = invalidErrorMessage ||
        scorm12_constants.error_descriptions[scorm12_error_codes.INVALID_SET_VALUE].detailMessage;
    this.#_invalid_type_code = invalidTypeCode ||
        scorm12_error_codes.TYPE_MISMATCH;
    this.#_invalid_type_message = invalidTypeMessage ||
        scorm12_constants.error_descriptions[scorm12_error_codes.TYPE_MISMATCH].detailMessage;
    this.#_invalid_range_code = invalidRangeCode ||
        scorm12_error_codes.VALUE_OUT_OF_RANGE;
    this.#_invalid_range_message = invalidRangeMessage ||
        scorm12_constants.error_descriptions[scorm12_error_codes.VALUE_OUT_OF_RANGE].detailMessage;
    this.#_decimal_regex = decimalRegex ||
        scorm12_regex.CMIDecimal;
  }

  #_children;
  #_score_range;
  #_invalid_error_code;
  #_invalid_error_message;
  #_invalid_type_code;
  #_invalid_type_message;
  #_invalid_range_code;
  #_invalid_range_message;
  #_decimal_regex;
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
    throw new ValidationError(this.#_invalid_error_code, this.#_invalid_error_message);
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
    if (checkValidFormat(raw, this.#_decimal_regex,
        this.#_invalid_type_code, this.#_invalid_type_message) &&
        (!this.#_score_range ||
            checkValidRange(raw, this.#_score_range,
                this.#_invalid_range_code, this.#_invalid_range_message))) {
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
    if (checkValidFormat(min, this.#_decimal_regex,
        this.#_invalid_type_code, this.#_invalid_type_message) &&
        (!this.#_score_range ||
            checkValidRange(min, this.#_score_range,
                this.#_invalid_range_code, this.#_invalid_range_message))) {
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
    if (checkValidFormat(max, this.#_decimal_regex,
        this.#_invalid_type_code, this.#_invalid_type_message) &&
        (!this.#_score_range ||
            checkValidRange(max, this.#_score_range,
                this.#_invalid_range_code, this.#_invalid_range_message))) {
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
   * @param {string} errorMessage
   */
  constructor({children, errorCode, errorMessage}) {
    super();
    this.#_children = children;
    this.#errorCode = errorCode;
    this.#errorMessage = errorMessage;
    this.childArray = [];
  }

  #errorCode;
  #errorMessage;
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
    throw new ValidationError(this.#errorCode, this.#errorMessage);
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
    throw new ValidationError(this.#errorCode, this.#errorMessage);
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
