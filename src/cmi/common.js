// @flow
import {scorm12_constants} from '../constants/api_constants';
import {scorm12_error_codes} from '../constants/error_codes';

/**
 * Base class for API cmi objects
 */
export class BaseCMI {
  jsonString = false;
  API;

  /**
   * Constructor for base cmi
   * @param {BaseAPI} API
   */
  constructor(API: any) {
    this.API = API;
  }
}

/**
 * Base class for cmi *.score objects
 */
export class CMIScore extends BaseCMI {
  /**
   * Constructor for *.score
   * @param {BaseAPI} API
   * @param {string} score_children
   * @param {string} score_range
   * @param {number} invalidErrorCode
   */
  constructor(API, score_children?, score_range?, invalidErrorCode) {
    super(API);

    this.#_children = score_children ?
        score_children :
        scorm12_constants.score_children;
    this.#_score_range = score_range ? score_range : false;
    this.#_invalid_error_code = invalidErrorCode ?
        invalidErrorCode :
        scorm12_error_codes.INVALID_SET_VALUE;
  }

  #_children;
  #_score_range;
  #_invalid_error_code;
  #raw = '';
  #min = '';
  #max = '100';

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
    this.API.throwSCORMError(this.#_invalid_error_code);
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
    if (this.API.checkValidFormat(raw, scorm12_constants.CMIDecimal) &&
        (!this.#_score_range ||
            this.API.checkValidRange(raw, this.#_score_range))) {
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
    if (this.API.checkValidFormat(min, scorm12_constants.CMIDecimal) &&
        (!this.#_score_range ||
            this.API.checkValidRange(min, this.#_score_range))) {
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
    if (this.API.checkValidFormat(max, scorm12_constants.CMIDecimal) &&
        (!this.#_score_range ||
            this.API.checkValidRange(max, this.#_score_range))) {
      this.#max = max;
    }
  }

  /**
   * toJSON for *.score
   * @return {{min: string, max: string, raw: string}}
   */
  toJSON() {
    return {
      'raw': this.raw,
      'min': this.min,
      'max': this.max,
    };
  }
}

/**
 * Base class for cmi *.n objects
 */
export class CMIArray extends BaseCMI {
  /**
   * Constructor cmi *.n arrays
   * @param {BaseAPI} API
   * @param {string} children
   * @param {number} errorCode
   */
  constructor({API, children, errorCode}) {
    super(API);
    this.#_children = children;
    this.#errorCode = errorCode;
    this.childArray = [];
  }

  #errorCode;
  #_children;

  /**
   * Getter for _children
   * @return {*}
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
    this.API.throwSCORMError(this.#errorCode);
  }

  /**
   * Getter for _count
   * @return {number}
   * @private
   */
  get _count() {
    return this.childArray.length;
  }

  /**
   * Setter for _count. Just throws an error.
   * @param {number} _count
   * @private
   */
  set _count(_count) {
    this.API.throwSCORMError(this.#errorCode);
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
