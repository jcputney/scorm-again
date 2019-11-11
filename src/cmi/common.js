import {scorm12_constants} from '../constants/api_constants';
import {scorm12_error_codes} from '../constants/error_codes';

export class BaseCMI {
    jsonString = false;
    API;

    constructor(API: any) {
      this.API = API;
    }
}

export class CMIScore extends BaseCMI {
  constructor(API, score_children?, score_range?, invalidErrorCode) {
    super(API);

    this.#_children = score_children? score_children : scorm12_constants.score_children;
    this.#_score_range = score_range? score_range : false;
    this.#_invalid_error_code = invalidErrorCode ? invalidErrorCode : scorm12_error_codes.INVALID_SET_VALUE;
  }

    #_children;
    #_score_range;
    #_invalid_error_code;
    #raw = '';
    #min = '';
    #max = '100';

    get _children() {
      return this.#_children;
    }
    set _children(_children) {
      this.API.throwSCORMError(this.#_invalid_error_code);
    }

    get raw() {
      return this.#raw;
    }
    set raw(raw) {
      if (this.API.checkValidFormat(raw, scorm12_constants.CMIDecimal) &&
            (!this.#_score_range || this.API.checkValidRange(raw, this.#_score_range))) {
        this.#raw = raw;
      }
    }

    get min() {
      return this.#min;
    }
    set min(min) {
      if (this.API.checkValidFormat(min, scorm12_constants.CMIDecimal) &&
            (!this.#_score_range || this.API.checkValidRange(min, this.#_score_range))) {
        this.#min = min;
      }
    }

    get max() {
      return this.#max;
    }
    set max(max) {
      if (this.API.checkValidFormat(max, scorm12_constants.CMIDecimal) &&
            (!this.#_score_range || this.API.checkValidRange(max, this.#_score_range))) {
        this.#max = max;
      }
    }

    toJSON = () => {
      return {
        'raw': this.raw,
        'min': this.min,
        'max': this.max,
      };
    }
}

export class CMIArray extends BaseCMI {
  constructor({API, children, errorCode}) {
    super(API);
    this.#_children = children;
    this.#errorCode = errorCode;
    this.childArray = [];
  }

    #errorCode;
    #_children;

    get _children() {
      return this.#_children;
    }
    set _children(_children) {
      this.API.throwSCORMError(this.#errorCode);
    }

    get _count() {
      return this.childArray.length;
    }
    set _count(_count) {
      this.API.throwSCORMError(this.#errorCode);
    }

    toJSON = () => {
      this.jsonString = true;
      const result = {};
      for (let i = 0; i < this.childArray.length; i++) {
        result[i + ''] = this.childArray[i];
      }
      delete this.jsonString;
      return result;
    }
}
