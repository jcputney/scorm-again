const global_constants = {
  SCORM_TRUE: "true",
  SCORM_FALSE: "false",
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2
};
const scorm12_constants = {
  // Children lists
  cmi_children: "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
  core_children: "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
  score_children: "raw,min,max",
  objectives_children: "id,score,status",
  correct_responses_children: "pattern",
  student_data_children: "mastery_score,max_time_allowed,time_limit_action",
  student_preference_children: "audio,language,speed,text",
  interactions_children: "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
  error_descriptions: {
    "101": {
      basicMessage: "General Exception",
      detailMessage: "No specific error code exists to describe the error."
    },
    "201": {
      basicMessage: "Invalid argument error",
      detailMessage: "Indicates that an argument represents an invalid data model element or is otherwise incorrect."
    },
    "202": {
      basicMessage: "Element cannot have children",
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.'
    },
    "203": {
      basicMessage: "Element not an array - cannot have count",
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.'
    },
    "301": {
      basicMessage: "Not initialized",
      detailMessage: "Indicates that an API call was made before the call to lmsInitialize."
    },
    "401": {
      basicMessage: "Not implemented error",
      detailMessage: "The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement."
    },
    "402": {
      basicMessage: "Invalid set value, element is a keyword",
      detailMessage: 'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").'
    },
    "403": {
      basicMessage: "Element is read only",
      detailMessage: "LMSSetValue was called with a data model element that can only be read."
    },
    "404": {
      basicMessage: "Element is write only",
      detailMessage: "LMSGetValue was called on a data model element that can only be written to."
    },
    "405": {
      basicMessage: "Incorrect Data Type",
      detailMessage: "LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element."
    },
    "407": {
      basicMessage: "Element Value Out Of Range",
      detailMessage: "The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element."
    },
    "408": {
      basicMessage: "Data Model Dependency Not Established",
      detailMessage: "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element."
    }
  }
};

const global_errors = {
  GENERAL: 101,
  INITIALIZATION_FAILED: 101,
  INITIALIZED: 101,
  TERMINATED: 101,
  TERMINATION_FAILURE: 101,
  TERMINATION_BEFORE_INIT: 101,
  MULTIPLE_TERMINATION: 101,
  RETRIEVE_BEFORE_INIT: 101,
  RETRIEVE_AFTER_TERM: 101,
  STORE_BEFORE_INIT: 101,
  STORE_AFTER_TERM: 101,
  COMMIT_BEFORE_INIT: 101,
  COMMIT_AFTER_TERM: 101,
  ARGUMENT_ERROR: 101,
  CHILDREN_ERROR: 101,
  COUNT_ERROR: 101,
  GENERAL_GET_FAILURE: 101,
  GENERAL_SET_FAILURE: 101,
  GENERAL_COMMIT_FAILURE: 101,
  UNDEFINED_DATA_MODEL: 101,
  UNIMPLEMENTED_ELEMENT: 101,
  VALUE_NOT_INITIALIZED: 101,
  INVALID_SET_VALUE: 101,
  READ_ONLY_ELEMENT: 101,
  WRITE_ONLY_ELEMENT: 101,
  TYPE_MISMATCH: 101,
  VALUE_OUT_OF_RANGE: 101,
  DEPENDENCY_NOT_ESTABLISHED: 101
};
const scorm12_errors$1 = {
  ...global_errors,
  RETRIEVE_BEFORE_INIT: 301,
  STORE_BEFORE_INIT: 301,
  COMMIT_BEFORE_INIT: 301,
  ARGUMENT_ERROR: 201,
  CHILDREN_ERROR: 202,
  COUNT_ERROR: 203,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 401,
  VALUE_NOT_INITIALIZED: 301,
  INVALID_SET_VALUE: 402,
  READ_ONLY_ELEMENT: 403,
  WRITE_ONLY_ELEMENT: 404,
  TYPE_MISMATCH: 405,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
};

const scorm12_regex = {
  CMIString256: "^.{0,255}$",
  CMIString4096: "^.{0,4096}$",
  CMITime: "^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)$",
  CMITimespan: "^([0-9]{2,}):([0-9]{2}):([0-9]{2})(.[0-9]{1,2})?$",
  CMISInteger: "^-?([0-9]+)$",
  CMIDecimal: "^-?([0-9]{0,3})(\\.[0-9]*)?$",
  CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
  // Allow storing larger responses for interactions
  // Some content packages may exceed the 255 character limit
  // defined in the SCORM 1.2 specification.  The previous
  // expression truncated these values which resulted in
  // a "101: General Exception" being thrown when long
  // answers were supplied.  To support these packages we
  // relax the limitation and accept any length string.
  CMIFeedback: "^.*$",
  // Vocabulary Data Type Definition
  CMIStatus: "^(passed|completed|failed|incomplete|browsed)$",
  CMIStatus2: "^(passed|completed|failed|incomplete|browsed|not attempted)$",
  CMIExit: "^(time-out|suspend|logout|)$",
  CMIType: "^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$",
  CMIResult: "^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$",
  NAVEvent: "^(previous|continue|start|resumeAll|choice|jump|exit|exitAll|abandon|abandonAll|suspendAll|retry|retryAll|_none_)$",
  // Data ranges
  score_range: "0#100",
  audio_range: "-1#100",
  speed_range: "-100#100",
  weighting_range: "-100#100",
  text_range: "-1#1"
};

class BaseScormValidationError extends Error {
  constructor(CMIElement, errorCode) {
    super(`${CMIElement} : ${errorCode.toString()}`);
    this._errorCode = errorCode;
    Object.setPrototypeOf(this, BaseScormValidationError.prototype);
  }
  /**
   * Getter for _errorCode
   * @return {number}
   */
  get errorCode() {
    return this._errorCode;
  }
}
class ValidationError extends BaseScormValidationError {
  /**
   * Constructor to take in an error message and code
   * @param {string} CMIElement
   * @param {number} errorCode
   * @param {string} errorMessage
   * @param {string} detailedMessage
   */
  constructor(CMIElement, errorCode, errorMessage, detailedMessage) {
    super(CMIElement, errorCode);
    this._detailedMessage = "";
    this.message = `${CMIElement} : ${errorMessage}`;
    this._errorMessage = errorMessage;
    if (detailedMessage) {
      this._detailedMessage = detailedMessage;
    }
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  /**
   * Getter for _errorMessage
   * @return {string}
   */
  get errorMessage() {
    return this._errorMessage;
  }
  /**
   * Getter for _detailedMessage
   * @return {string}
   */
  get detailedMessage() {
    return this._detailedMessage;
  }
}

const scorm12_errors = scorm12_constants.error_descriptions;
class Scorm12ValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {string} CMIElement
   * @param {number} errorCode
   */
  constructor(CMIElement, errorCode) {
    if ({}.hasOwnProperty.call(scorm12_errors, String(errorCode))) {
      super(
        CMIElement,
        errorCode,
        scorm12_errors[String(errorCode)]?.basicMessage || "Unknown error",
        scorm12_errors[String(errorCode)]?.detailMessage
      );
    } else {
      super(
        CMIElement,
        101,
        scorm12_errors["101"]?.basicMessage ?? "General error",
        scorm12_errors["101"]?.detailMessage
      );
    }
    Object.setPrototypeOf(this, Scorm12ValidationError.prototype);
  }
}

class BaseCMI {
  /**
   * Constructor for BaseCMI
   * @param {string} cmi_element
   */
  constructor(cmi_element) {
    this.jsonString = false;
    this._initialized = false;
    this._cmi_element = cmi_element;
  }
  /**
   * Getter for _initialized
   * @return {boolean}
   */
  get initialized() {
    return this._initialized;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    this._initialized = true;
  }
}
class BaseRootCMI extends BaseCMI {
  /**
   * Start time of the course
   * @type {number | undefined}
   * @protected
   */
  get start_time() {
    return this._start_time;
  }
  /**
   * Setter for start_time. Can only be called once.
   */
  setStartTime() {
    if (this._start_time === void 0) {
      this._start_time = (/* @__PURE__ */ new Date()).getTime();
    } else {
      throw new Error("Start time has already been set.");
    }
  }
}

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const getSecondsAsHHMMSS = memoize((totalSeconds) => {
  if (!totalSeconds || totalSeconds <= 0) {
    return "00:00:00";
  }
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const dateObj = new Date(totalSeconds * 1e3);
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();
  const ms = totalSeconds % 1;
  let msStr = "";
  if (countDecimals(ms) > 0) {
    if (countDecimals(ms) > 2) {
      msStr = ms.toFixed(2);
    } else {
      msStr = String(ms);
    }
    msStr = "." + msStr.split(".")[1];
  }
  return (hours + ":" + minutes + ":" + seconds).replace(/\b\d\b/g, "0$&") + msStr;
});
const getTimeAsSeconds = memoize(
  (timeString, timeRegex) => {
    if (typeof timeString === "number" || typeof timeString === "boolean") {
      timeString = String(timeString);
    }
    if (typeof timeRegex === "string") {
      timeRegex = new RegExp(timeRegex);
    }
    if (!timeString) {
      return 0;
    }
    if (!timeString.match(timeRegex)) {
      if (/^\d+(?:\.\d+)?$/.test(timeString)) {
        return Number(timeString);
      }
      return 0;
    }
    const parts = timeString.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Number(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  },
  // Custom key function to handle RegExp objects which can't be stringified
  (timeString, timeRegex) => {
    const timeStr = typeof timeString === "string" ? timeString : String(timeString ?? "");
    const regexStr = typeof timeRegex === "string" ? timeRegex : timeRegex?.toString() ?? "";
    return `${timeStr}:${regexStr}`;
  }
);
function addHHMMSSTimeStrings(first, second, timeRegex) {
  if (typeof timeRegex === "string") {
    timeRegex = new RegExp(timeRegex);
  }
  return getSecondsAsHHMMSS(
    getTimeAsSeconds(first, timeRegex) + getTimeAsSeconds(second, timeRegex)
  );
}
function flatten(data) {
  const result = {};
  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      cur.forEach((item, i) => {
        recurse(item, `${prop}[${i}]`);
      });
      if (cur.length === 0) result[prop] = [];
    } else {
      const keys = Object.keys(cur).filter((p) => Object.prototype.hasOwnProperty.call(cur, p));
      const isEmpty = keys.length === 0;
      keys.forEach((p) => {
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      });
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
}
function unflatten(data) {
  if (Object(data) !== data || Array.isArray(data)) return data;
  const result = {};
  const pattern = /\.?([^.[\]]+)|\[(\d+)]/g;
  Object.keys(data).filter((p) => Object.prototype.hasOwnProperty.call(data, p)).forEach((p) => {
    let cur = result;
    let prop = "";
    const regex = new RegExp(pattern);
    Array.from(
      { length: p.match(new RegExp(pattern, "g"))?.length ?? 0 },
      () => regex.exec(p)
    ).forEach((m) => {
      if (m) {
        cur = cur[prop] ?? (cur[prop] = m[2] ? [] : {});
        prop = m[2] || m[1] || "";
      }
    });
    cur[prop] = data[p];
  });
  return result[""] ?? result;
}
function countDecimals(num) {
  if (Math.floor(num) === num || String(num)?.indexOf?.(".") < 0) return 0;
  const parts = num.toString().split(".")?.[1];
  return parts?.length ?? 0;
}
function formatMessage(functionName, message, CMIElement) {
  const baseLength = 20;
  const paddedFunction = functionName.padEnd(baseLength);
  let messageString = `${paddedFunction}: `;
  if (CMIElement) {
    const CMIElementBaseLength = 70;
    messageString += CMIElement;
    messageString = messageString.padEnd(CMIElementBaseLength);
  }
  messageString += message ?? "";
  return messageString;
}
function stringMatches(str, tester) {
  if (typeof str !== "string") {
    return false;
  }
  return new RegExp(tester).test(str);
}
function memoize(fn, keyFn) {
  const cache = /* @__PURE__ */ new Map();
  return (...args) => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);
    return cache.has(key) ? cache.get(key) : (() => {
      const result = fn(...args);
      cache.set(key, result);
      return result;
    })();
  };
}

const checkValidFormat = memoize(
  (CMIElement, value, regexPattern, errorCode, errorClass, allowEmptyString) => {
    if (typeof value !== "string") {
      return false;
    }
    const formatRegex = new RegExp(regexPattern);
    const matches = value.match(formatRegex);
    if (allowEmptyString && value === "") {
      return true;
    }
    if (value === void 0 || !matches || matches[0] === "") {
      throw new errorClass(CMIElement, errorCode);
    }
    return true;
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, regexPattern, errorCode, _errorClass, allowEmptyString) => {
    const valueKey = typeof value === "string" ? value : `[${typeof value}]`;
    return `${CMIElement}:${valueKey}:${regexPattern}:${errorCode}:${allowEmptyString || false}`;
  }
);
const checkValidRange = memoize(
  (CMIElement, value, rangePattern, errorCode, errorClass) => {
    const ranges = rangePattern.split("#");
    value = value * 1;
    if (ranges[0] && value >= ranges[0]) {
      if (ranges[1] && (ranges[1] === "*" || value <= ranges[1])) {
        return true;
      } else {
        throw new errorClass(CMIElement, errorCode);
      }
    } else {
      throw new errorClass(CMIElement, errorCode);
    }
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, rangePattern, errorCode, _errorClass) => `${CMIElement}:${value}:${rangePattern}:${errorCode}`
);

function check12ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
  return checkValidFormat(
    CMIElement,
    value,
    regexPattern,
    scorm12_errors$1.TYPE_MISMATCH,
    Scorm12ValidationError,
    allowEmptyString
  );
}
function check12ValidRange(CMIElement, value, rangePattern, allowEmptyString) {
  if (value === "") {
    throw new Scorm12ValidationError(CMIElement, scorm12_errors$1.VALUE_OUT_OF_RANGE);
  }
  return checkValidRange(
    CMIElement,
    value,
    rangePattern,
    scorm12_errors$1.VALUE_OUT_OF_RANGE,
    Scorm12ValidationError
  );
}

class ValidationService {
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
  validateScore(CMIElement, value, decimalRegex, scoreRange, invalidTypeCode, invalidRangeCode, errorClass) {
    return checkValidFormat(CMIElement, value, decimalRegex, invalidTypeCode, errorClass) && (!scoreRange || checkValidRange(CMIElement, value, scoreRange, invalidRangeCode, errorClass));
  }
  /**
   * Validates a SCORM 1.2 audio property
   *
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Audio(CMIElement, value) {
    return check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) && check12ValidRange(CMIElement, value, scorm12_regex.audio_range);
  }
  /**
   * Validates a SCORM 1.2 language property
   *
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Language(CMIElement, value) {
    return check12ValidFormat(CMIElement, value, scorm12_regex.CMIString256);
  }
  /**
   * Validates a SCORM 1.2 speed property
   *
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Speed(CMIElement, value) {
    return check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) && check12ValidRange(CMIElement, value, scorm12_regex.speed_range);
  }
  /**
   * Validates a SCORM 1.2 text property
   *
   * @param {string} CMIElement
   * @param {string} value - The value to validate
   * @return {boolean} - True if validation passes, throws an error otherwise
   */
  validateScorm12Text(CMIElement, value) {
    return check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) && check12ValidRange(CMIElement, value, scorm12_regex.text_range);
  }
  /**
   * Validates if a property is read-only
   *
   * @param {string} CMIElement
   * @param {boolean} initialized - Whether the object is initialized
   * @throws {BaseScormValidationError} - Throws an error if the object is initialized
   */
  validateReadOnly(CMIElement, initialized) {
    if (initialized) {
      throw new Scorm12ValidationError(CMIElement, scorm12_errors$1.READ_ONLY_ELEMENT);
    }
  }
}
const validationService = new ValidationService();

class CMIScore extends BaseCMI {
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
  constructor(params) {
    super(params.CMIElement);
    this._raw = "";
    this._min = "";
    this.__children = params.score_children || scorm12_constants.score_children;
    this.__score_range = !params.score_range ? false : scorm12_regex.score_range;
    this._max = params.max || params.max === "" ? params.max : "100";
    this.__invalid_error_code = params.invalidErrorCode || scorm12_errors$1.INVALID_SET_VALUE;
    this.__invalid_type_code = params.invalidTypeCode || scorm12_errors$1.TYPE_MISMATCH;
    this.__invalid_range_code = params.invalidRangeCode || scorm12_errors$1.VALUE_OUT_OF_RANGE;
    this.__decimal_regex = params.decimalRegex || scorm12_regex.CMIDecimal;
    this.__error_class = params.errorClass;
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
  }
  /**
   * Getter for _children
   * @return {string}
   */
  get _children() {
    return this.__children;
  }
  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   */
  set _children(_children) {
    throw new this.__error_class(this._cmi_element + "._children", this.__invalid_error_code);
  }
  /**
   * Getter for _raw
   * @return {string}
   */
  get raw() {
    return this._raw;
  }
  /**
   * Setter for _raw
   * @param {string} raw
   */
  set raw(raw) {
    if (validationService.validateScore(
      this._cmi_element + ".raw",
      raw,
      this.__decimal_regex,
      this.__score_range,
      this.__invalid_type_code,
      this.__invalid_range_code,
      this.__error_class
    )) {
      this._raw = raw;
    }
  }
  /**
   * Getter for _min
   * @return {string}
   */
  get min() {
    return this._min;
  }
  /**
   * Setter for _min
   * @param {string} min
   */
  set min(min) {
    if (validationService.validateScore(
      this._cmi_element + ".min",
      min,
      this.__decimal_regex,
      this.__score_range,
      this.__invalid_type_code,
      this.__invalid_range_code,
      this.__error_class
    )) {
      this._min = min;
    }
  }
  /**
   * Getter for _max
   * @return {string}
   */
  get max() {
    return this._max;
  }
  /**
   * Setter for _max
   * @param {string} max
   */
  set max(max) {
    if (validationService.validateScore(
      this._cmi_element + ".max",
      max,
      this.__decimal_regex,
      this.__score_range,
      this.__invalid_type_code,
      this.__invalid_range_code,
      this.__error_class
    )) {
      this._max = max;
    }
  }
  /**
   * Getter for _score_range
   * @return {string | false}
   */
  getScoreObject() {
    const scoreObject = {};
    if (!Number.isNaN(Number.parseFloat(this.raw))) {
      scoreObject.raw = Number.parseFloat(this.raw);
    }
    if (!Number.isNaN(Number.parseFloat(this.min))) {
      scoreObject.min = Number.parseFloat(this.min);
    }
    if (!Number.isNaN(Number.parseFloat(this.max))) {
      scoreObject.max = Number.parseFloat(this.max);
    }
    return scoreObject;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      raw: this.raw,
      min: this.min,
      max: this.max
    };
    this.jsonString = false;
    return result;
  }
}

class CMICore extends BaseCMI {
  /**
   * Constructor for `cmi.core`
   */
  constructor() {
    super("cmi.core");
    this.__children = scorm12_constants.core_children;
    this._student_id = "";
    this._student_name = "";
    this._lesson_location = "";
    this._credit = "";
    this._lesson_status = "not attempted";
    this._entry = "";
    this._total_time = "";
    this._lesson_mode = "normal";
    this._exit = "";
    this._session_time = "00:00:00";
    this._suspend_data = "";
    this.score = new CMIScore({
      CMIElement: "cmi.core.score",
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_errors$1.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_errors$1.TYPE_MISMATCH,
      invalidRangeCode: scorm12_errors$1.VALUE_OUT_OF_RANGE,
      errorClass: Scorm12ValidationError
    });
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._exit = "";
    this._entry = "";
    this._session_time = "00:00:00";
    this.score?.reset();
  }
  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children() {
    return this.__children;
  }
  /**
   * Setter for __children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children) {
    throw new Scorm12ValidationError(
      this._cmi_element + "._children",
      scorm12_errors$1.INVALID_SET_VALUE
    );
  }
  /**
   * Getter for _student_id
   * @return {string}
   */
  get student_id() {
    return this._student_id;
  }
  /**
   * Setter for _student_id. Can only be called before  initialization.
   * @param {string} student_id
   */
  set student_id(student_id) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".student_id",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._student_id = student_id;
    }
  }
  /**
   * Getter for _student_name
   * @return {string}
   */
  get student_name() {
    return this._student_name;
  }
  /**
   * Setter for _student_name. Can only be called before  initialization.
   * @param {string} student_name
   */
  set student_name(student_name) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".student_name",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._student_name = student_name;
    }
  }
  /**
   * Getter for _lesson_location
   * @return {string}
   */
  get lesson_location() {
    return this._lesson_location;
  }
  /**
   * Setter for _lesson_location
   * @param {string} lesson_location
   */
  set lesson_location(lesson_location) {
    if (check12ValidFormat(
      this._cmi_element + ".lesson_location",
      lesson_location,
      scorm12_regex.CMIString256,
      true
    )) {
      this._lesson_location = lesson_location;
    }
  }
  /**
   * Getter for _credit
   * @return {string}
   */
  get credit() {
    return this._credit;
  }
  /**
   * Setter for _credit. Can only be called before  initialization.
   * @param {string} credit
   */
  set credit(credit) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".credit",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._credit = credit;
    }
  }
  /**
   * Getter for _lesson_status
   * @return {string}
   */
  get lesson_status() {
    return this._lesson_status;
  }
  /**
   * Setter for _lesson_status
   * @param {string} lesson_status
   */
  set lesson_status(lesson_status) {
    if (this.initialized) {
      if (check12ValidFormat(
        this._cmi_element + ".lesson_status",
        lesson_status,
        scorm12_regex.CMIStatus
      )) {
        this._lesson_status = lesson_status;
      }
    } else {
      if (check12ValidFormat(
        this._cmi_element + ".lesson_status",
        lesson_status,
        scorm12_regex.CMIStatus2
      )) {
        this._lesson_status = lesson_status;
      }
    }
  }
  /**
   * Getter for _entry
   * @return {string}
   */
  get entry() {
    return this._entry;
  }
  /**
   * Setter for _entry. Can only be called before  initialization.
   * @param {string} entry
   */
  set entry(entry) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".entry",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._entry = entry;
    }
  }
  /**
   * Getter for _total_time
   * @return {string}
   */
  get total_time() {
    return this._total_time;
  }
  /**
   * Setter for _total_time. Can only be called before  initialization.
   * @param {string} total_time
   */
  set total_time(total_time) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".total_time",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._total_time = total_time;
    }
  }
  /**
   * Getter for _lesson_mode
   * @return {string}
   */
  get lesson_mode() {
    return this._lesson_mode;
  }
  /**
   * Setter for _lesson_mode. Can only be called before  initialization.
   * @param {string} lesson_mode
   */
  set lesson_mode(lesson_mode) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".lesson_mode",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._lesson_mode = lesson_mode;
    }
  }
  /**
   * Getter for _exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".exit",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._exit;
  }
  /**
   * Setter for _exit
   * @param {string} exit
   */
  set exit(exit) {
    if (check12ValidFormat(this._cmi_element + ".exit", exit, scorm12_regex.CMIExit, true)) {
      this._exit = exit;
    }
  }
  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".session_time",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._session_time;
  }
  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time) {
    if (check12ValidFormat(
      this._cmi_element + ".session_time",
      session_time,
      scorm12_regex.CMITimespan
    )) {
      this._session_time = session_time;
    }
  }
  /**
   * Getter for _suspend_data
   * @return {string}
   */
  get suspend_data() {
    return this._suspend_data;
  }
  /**
   * Setter for _suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data) {
    if (check12ValidFormat(
      this._cmi_element + ".suspend_data",
      suspend_data,
      scorm12_regex.CMIString4096,
      true
    )) {
      this._suspend_data = suspend_data;
    }
  }
  /**
   * Adds the current session time to the existing total time.
   * @param {number} start_time
   * @return {string}
   */
  getCurrentTotalTime(start_time) {
    let sessionTime = this._session_time;
    if (typeof start_time !== "undefined" && start_time !== null) {
      const seconds = (/* @__PURE__ */ new Date()).getTime() - start_time;
      sessionTime = getSecondsAsHHMMSS(seconds / 1e3);
    }
    return addHHMMSSTimeStrings(
      this._total_time,
      sessionTime,
      new RegExp(scorm12_regex.CMITimespan)
    );
  }
  /**
   * toJSON for cmi.core
   *
   * @return {
   *    {
   *      student_name: string,
   *      entry: string,
   *      exit: string,
   *      score: CMIScore,
   *      student_id: string,
   *      lesson_mode: string,
   *      lesson_location: string,
   *      lesson_status: string,
   *      credit: string,
   *      session_time: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      student_id: this.student_id,
      student_name: this.student_name,
      lesson_location: this.lesson_location,
      credit: this.credit,
      lesson_status: this.lesson_status,
      entry: this.entry,
      lesson_mode: this.lesson_mode,
      exit: this.exit,
      session_time: this.session_time,
      score: this.score
    };
    this.jsonString = false;
    return result;
  }
}

class CMIArray extends BaseCMI {
  /**
   * Constructor cmi *.n arrays
   * @param {object} params
   */
  constructor(params) {
    super(params.CMIElement);
    this.__children = params.children;
    this._errorCode = params.errorCode || scorm12_errors$1.GENERAL;
    this._errorClass = params.errorClass || BaseScormValidationError;
    this.childArray = [];
  }
  /**
   * Called when the API has been reset
   */
  reset(wipe = false) {
    this._initialized = false;
    if (wipe) {
      this.childArray = [];
    } else {
      for (let i = 0; i < this.childArray.length; i++) {
        this.childArray[i].reset();
      }
    }
  }
  /**
   * Getter for _children
   * @return {string}
   */
  get _children() {
    return this.__children;
  }
  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   */
  set _children(_children) {
    throw new this._errorClass(this._cmi_element + "._children", this._errorCode);
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
    throw new this._errorClass(this._cmi_element + "._count", this._errorCode);
  }
  /**
   * toJSON for *.n arrays
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {};
    for (let i = 0; i < this.childArray.length; i++) {
      result[i + ""] = this.childArray[i];
    }
    this.jsonString = false;
    return result;
  }
}

class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives`
   */
  constructor() {
    super({
      CMIElement: "cmi.objectives",
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_errors$1.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError
    });
  }
}
class CMIObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super("cmi.objectives.n");
    this._id = "";
    this._status = "";
    this.score = new CMIScore({
      CMIElement: "cmi.objectives.n.score",
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_errors$1.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_errors$1.TYPE_MISMATCH,
      invalidRangeCode: scorm12_errors$1.VALUE_OUT_OF_RANGE,
      errorClass: Scorm12ValidationError
    });
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._id = "";
    this._status = "";
    this.score?.reset();
  }
  /**
   * Getter for _id
   * @return {string}
   */
  get id() {
    return this._id;
  }
  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id) {
    if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
      this._id = id;
    }
  }
  /**
   * Getter for _status
   * @return {string}
   */
  get status() {
    return this._status;
  }
  /**
   * Setter for _status
   * @param {string} status
   */
  set status(status) {
    if (check12ValidFormat(this._cmi_element + ".status", status, scorm12_regex.CMIStatus2)) {
      this._status = status;
    }
  }
  /**
   * toJSON for cmi.objectives.n
   * @return {
   *    {
   *      id: string,
   *      status: string,
   *      score: CMIScore
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this.id,
      status: this.status,
      score: this.score
    };
    this.jsonString = false;
    return result;
  }
}

class CMIStudentData extends BaseCMI {
  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  constructor(student_data_children) {
    super("cmi.student_data");
    this._mastery_score = "";
    this._max_time_allowed = "";
    this._time_limit_action = "";
    this.__children = student_data_children ? student_data_children : scorm12_constants.student_data_children;
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
  }
  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children() {
    return this.__children;
  }
  /**
   * Setter for __children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children) {
    throw new Scorm12ValidationError(
      this._cmi_element + "._children",
      scorm12_errors$1.INVALID_SET_VALUE
    );
  }
  /**
   * Getter for _master_score
   * @return {string}
   */
  get mastery_score() {
    return this._mastery_score;
  }
  /**
   * Setter for _master_score. Can only be called before  initialization.
   * @param {string} mastery_score
   */
  set mastery_score(mastery_score) {
    validationService.validateReadOnly(this._cmi_element + ".mastery_score", this.initialized);
    this._mastery_score = mastery_score;
  }
  /**
   * Getter for _max_time_allowed
   * @return {string}
   */
  get max_time_allowed() {
    return this._max_time_allowed;
  }
  /**
   * Setter for _max_time_allowed. Can only be called before  initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed) {
    validationService.validateReadOnly(this._cmi_element + ".max_time_allowed", this.initialized);
    this._max_time_allowed = max_time_allowed;
  }
  /**
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action() {
    return this._time_limit_action;
  }
  /**
   * Setter for _time_limit_action. Can only be called before  initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action) {
    validationService.validateReadOnly(this._cmi_element + ".time_limit_action", this.initialized);
    this._time_limit_action = time_limit_action;
  }
  /**
   * toJSON for cmi.student_data
   *
   * @return {
   *    {
   *      max_time_allowed: string,
   *      time_limit_action: string,
   *      mastery_score: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      mastery_score: this.mastery_score,
      max_time_allowed: this.max_time_allowed,
      time_limit_action: this.time_limit_action
    };
    this.jsonString = false;
    return result;
  }
}

class CMIStudentPreference extends BaseCMI {
  /**
   * Constructor for cmi.student_preference
   * @param {string} student_preference_children
   */
  constructor(student_preference_children) {
    super("cmi.student_preference");
    this._audio = "";
    this._language = "";
    this._speed = "";
    this._text = "";
    this.__children = student_preference_children ? student_preference_children : scorm12_constants.student_preference_children;
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
  }
  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children() {
    return this.__children;
  }
  /**
   * Setter for __children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children) {
    throw new Scorm12ValidationError(
      this._cmi_element + "._children",
      scorm12_errors$1.INVALID_SET_VALUE
    );
  }
  /**
   * Getter for _audio
   * @return {string}
   */
  get audio() {
    return this._audio;
  }
  /**
   * Setter for _audio
   * @param {string} audio
   */
  set audio(audio) {
    if (validationService.validateScorm12Audio(this._cmi_element + ".audio", audio)) {
      this._audio = audio;
    }
  }
  /**
   * Getter for _language
   * @return {string}
   */
  get language() {
    return this._language;
  }
  /**
   * Setter for _language
   * @param {string} language
   */
  set language(language) {
    if (validationService.validateScorm12Language(this._cmi_element + ".language", language)) {
      this._language = language;
    }
  }
  /**
   * Getter for _speed
   * @return {string}
   */
  get speed() {
    return this._speed;
  }
  /**
   * Setter for _speed
   * @param {string} speed
   */
  set speed(speed) {
    if (validationService.validateScorm12Speed(this._cmi_element + ".speed", speed)) {
      this._speed = speed;
    }
  }
  /**
   * Getter for _text
   * @return {string}
   */
  get text() {
    return this._text;
  }
  /**
   * Setter for _text
   * @param {string} text
   */
  set text(text) {
    if (validationService.validateScorm12Text(this._cmi_element + ".text", text)) {
      this._text = text;
    }
  }
  /**
   * toJSON for cmi.student_preference
   *
   * @return {
   *    {
   *      audio: string,
   *      language: string,
   *      speed: string,
   *      text: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      audio: this.audio,
      language: this.language,
      speed: this.speed,
      text: this.text
    };
    this.jsonString = false;
    return result;
  }
}

class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.interactions`
   */
  constructor() {
    super({
      CMIElement: "cmi.interactions",
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_errors$1.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError
    });
  }
}
class CMIInteractionsObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n object
   */
  constructor() {
    super("cmi.interactions.n");
    this._id = "";
    this._time = "";
    this._type = "";
    this._weighting = "";
    this._student_response = "";
    this._result = "";
    this._latency = "";
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm12_errors$1.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: scorm12_constants.objectives_children
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.correct_responses",
      errorCode: scorm12_errors$1.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: scorm12_constants.correct_responses_children
    });
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.objectives?.initialize();
    this.correct_responses?.initialize();
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._id = "";
    this._time = "";
    this._type = "";
    this._weighting = "";
    this._student_response = "";
    this._result = "";
    this._latency = "";
    this.objectives?.reset();
    this.correct_responses?.reset();
  }
  /**
   * Getter for _id. Should only be called during JSON export.
   * @return {string}
   */
  get id() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".id",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._id;
  }
  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id) {
    if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
      this._id = id;
    }
  }
  /**
   * Getter for _time. Should only be called during JSON export.
   * @return {string}
   */
  get time() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".time",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._time;
  }
  /**
   * Setter for _time
   * @param {string} time
   */
  set time(time) {
    if (check12ValidFormat(this._cmi_element + ".time", time, scorm12_regex.CMITime)) {
      this._time = time;
    }
  }
  /**
   * Getter for _type. Should only be called during JSON export.
   * @return {string}
   */
  get type() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".type",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._type;
  }
  /**
   * Setter for _type
   * @param {string} type
   */
  set type(type) {
    if (check12ValidFormat(this._cmi_element + ".type", type, scorm12_regex.CMIType)) {
      this._type = type;
    }
  }
  /**
   * Getter for _weighting. Should only be called during JSON export.
   * @return {string}
   */
  get weighting() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".weighting",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._weighting;
  }
  /**
   * Setter for _weighting
   * @param {string} weighting
   */
  set weighting(weighting) {
    if (check12ValidFormat(this._cmi_element + ".weighting", weighting, scorm12_regex.CMIDecimal) && check12ValidRange(this._cmi_element + ".weighting", weighting, scorm12_regex.weighting_range)) {
      this._weighting = weighting;
    }
  }
  /**
   * Getter for _student_response. Should only be called during JSON export.
   * @return {string}
   */
  get student_response() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".student_response",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._student_response;
  }
  /**
   * Setter for _student_response
   * @param {string} student_response
   */
  set student_response(student_response) {
    if (check12ValidFormat(
      this._cmi_element + ".student_response",
      student_response,
      scorm12_regex.CMIFeedback,
      true
    )) {
      this._student_response = student_response;
    }
  }
  /**
   * Getter for _result. Should only be called during JSON export.
   * @return {string}
   */
  get result() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".result",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._result;
  }
  /**
   * Setter for _result
   * @param {string} result
   */
  set result(result) {
    if (check12ValidFormat(this._cmi_element + ".result", result, scorm12_regex.CMIResult)) {
      this._result = result;
    }
  }
  /**
   * Getter for _latency. Should only be called during JSON export.
   * @return {string}
   */
  get latency() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".latency",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._latency;
  }
  /**
   * Setter for _latency
   * @param {string} latency
   */
  set latency(latency) {
    if (check12ValidFormat(this._cmi_element + ".latency", latency, scorm12_regex.CMITimespan)) {
      this._latency = latency;
    }
  }
  /**
   * toJSON for cmi.interactions.n
   *
   * @return {
   *    {
   *      id: string,
   *      time: string,
   *      type: string,
   *      weighting: string,
   *      student_response: string,
   *      result: string,
   *      latency: string,
   *      objectives: CMIArray,
   *      correct_responses: CMIArray
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this.id,
      time: this.time,
      type: this.type,
      weighting: this.weighting,
      student_response: this.student_response,
      result: this.result,
      latency: this.latency,
      objectives: this.objectives,
      correct_responses: this.correct_responses
    };
    this.jsonString = false;
    return result;
  }
}
class CMIInteractionsObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  constructor() {
    super("cmi.interactions.n.objectives.n");
    this._id = "";
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._id = "";
  }
  /**
   * Getter for _id
   * @return {string}
   */
  get id() {
    return this._id;
  }
  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id) {
    if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
      this._id = id;
    }
  }
  /**
   * toJSON for cmi.interactions.n.objectives.n
   * @return {
   *    {
   *      id: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this.id
    };
    this.jsonString = false;
    return result;
  }
}
class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  constructor() {
    super("cmi.interactions.correct_responses.n");
    this._pattern = "";
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._pattern = "";
  }
  /**
   * Getter for _pattern
   * @return {string}
   */
  get pattern() {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".pattern",
        scorm12_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._pattern;
  }
  /**
   * Setter for _pattern
   * @param {string} pattern
   */
  set pattern(pattern) {
    if (check12ValidFormat(this._cmi_element + ".pattern", pattern, scorm12_regex.CMIFeedback, true)) {
      this._pattern = pattern;
    }
  }
  /**
   * toJSON for cmi.interactions.correct_responses.n
   * @return {
   *    {
   *      pattern: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      pattern: this._pattern
    };
    this.jsonString = false;
    return result;
  }
}

class CMI extends BaseRootCMI {
  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  constructor(cmi_children, student_data, initialized) {
    super("cmi");
    this.__children = "";
    this.__version = "3.4";
    this._launch_data = "";
    this._comments = "";
    this._comments_from_lms = "";
    if (initialized) this.initialize();
    this.__children = cmi_children ? cmi_children : scorm12_constants.cmi_children;
    this.core = new CMICore();
    this.objectives = new CMIObjectives();
    this.student_data = student_data ? student_data : new CMIStudentData();
    this.student_preference = new CMIStudentPreference();
    this.interactions = new CMIInteractions();
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._launch_data = "";
    this._comments = "";
    this.core?.reset();
    this.objectives = new CMIObjectives();
    this.interactions = new CMIInteractions();
    this.student_data?.reset();
    this.student_preference?.reset();
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.core?.initialize();
    this.objectives?.initialize();
    this.student_data?.initialize();
    this.student_preference?.initialize();
    this.interactions?.initialize();
  }
  /**
   * toJSON for cmi
   *
   * @return {
   *    {
   *      suspend_data: string,
   *      launch_data: string,
   *      comments: string,
   *      comments_from_lms: string,
   *      core: CMICore,
   *      objectives: CMIObjectives,
   *      student_data: CMIStudentData,
   *      student_preference: CMIStudentPreference,
   *      interactions: CMIInteractions
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      suspend_data: this.suspend_data,
      launch_data: this.launch_data,
      comments: this.comments,
      comments_from_lms: this.comments_from_lms,
      core: this.core,
      objectives: this.objectives,
      student_data: this.student_data,
      student_preference: this.student_preference,
      interactions: this.interactions
    };
    this.jsonString = false;
    return result;
  }
  /**
   * Getter for __version
   * @return {string}
   */
  get _version() {
    return this.__version;
  }
  /**
   * Setter for __version. Just throws an error.
   * @param {string} _version
   */
  set _version(_version) {
    throw new Scorm12ValidationError(
      this._cmi_element + "._version",
      scorm12_errors$1.INVALID_SET_VALUE
    );
  }
  /**
   * Getter for __children
   * @return {string}
   */
  get _children() {
    return this.__children;
  }
  /**
   * Setter for __version. Just throws an error.
   * @param {string} _children
   */
  set _children(_children) {
    throw new Scorm12ValidationError(
      this._cmi_element + "._children",
      scorm12_errors$1.INVALID_SET_VALUE
    );
  }
  /**
   * Getter for _suspend_data
   * @return {string}
   */
  get suspend_data() {
    return this.core?.suspend_data;
  }
  /**
   * Setter for _suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data) {
    if (this.core) {
      this.core.suspend_data = suspend_data;
    }
  }
  /**
   * Getter for _launch_data
   * @return {string}
   */
  get launch_data() {
    return this._launch_data;
  }
  /**
   * Setter for _launch_data. Can only be called before  initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".launch_data",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._launch_data = launch_data;
    }
  }
  /**
   * Getter for _comments
   * @return {string}
   */
  get comments() {
    return this._comments;
  }
  /**
   * Setter for _comments
   * @param {string} comments
   */
  set comments(comments) {
    if (check12ValidFormat(
      this._cmi_element + ".comments",
      comments,
      scorm12_regex.CMIString4096,
      true
    )) {
      this._comments = comments;
    }
  }
  /**
   * Getter for _comments_from_lms
   * @return {string}
   */
  get comments_from_lms() {
    return this._comments_from_lms;
  }
  /**
   * Setter for _comments_from_lms. Can only be called before  initialization.
   * @param {string} comments_from_lms
   */
  set comments_from_lms(comments_from_lms) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".comments_from_lms",
        scorm12_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._comments_from_lms = comments_from_lms;
    }
  }
  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string}
   */
  getCurrentTotalTime() {
    return this.core.getCurrentTotalTime(this.start_time);
  }
}

class NAV extends BaseCMI {
  /**
   * Constructor for NAV object
   */
  constructor() {
    super("cmi.nav");
    this._event = "";
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._event = "";
    this._initialized = false;
  }
  /**
   * Getter for _event
   * @return {string}
   */
  get event() {
    return this._event;
  }
  /**
   * Setter for _event
   * @param {string} event
   */
  set event(event) {
    if (event === "" || check12ValidFormat(this._cmi_element + ".event", event, scorm12_regex.NAVEvent)) {
      this._event = event;
    }
  }
  /**
   * toJSON for nav object
   * @return {
   *    {
   *      event: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      event: this.event
    };
    this.jsonString = false;
    return result;
  }
}

const SuccessStatus = {
  PASSED: "passed",
  FAILED: "failed",
  UNKNOWN: "unknown"
};
const CompletionStatus = {
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
  UNKNOWN: "unknown"
};
const LogLevelEnum = {
  _: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  NONE: 5
};

const DefaultSettings = {
  autocommit: false,
  autocommitSeconds: 10,
  asyncCommit: false,
  sendFullCommit: true,
  lmsCommitUrl: false,
  dataCommitFormat: "json",
  commitRequestDataType: "application/json;charset=UTF-8",
  autoProgress: false,
  logLevel: LogLevelEnum.ERROR,
  selfReportSessionTime: false,
  alwaysSendTotalTime: false,
  renderCommonCommitFields: false,
  strict_errors: true,
  xhrHeaders: {},
  xhrWithCredentials: false,
  fetchMode: "cors",
  useBeaconInsteadOfFetch: "never",
  responseHandler: async function(response) {
    if (typeof response !== "undefined") {
      let httpResult = null;
      try {
        if (typeof response.json === "function") {
          httpResult = await response.json();
        } else if (typeof response.text === "function") {
          const responseText = await response.text();
          if (responseText) {
            httpResult = JSON.parse(responseText);
          }
        }
      } catch (e) {
      }
      if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
        if (response.status === 200) {
          return {
            result: global_constants.SCORM_TRUE,
            errorCode: 0
          };
        } else {
          return {
            result: global_constants.SCORM_FALSE,
            errorCode: 101
          };
        }
      } else {
        return {
          result: httpResult.result,
          errorCode: httpResult.errorCode ? httpResult.errorCode : httpResult.result === global_constants.SCORM_TRUE ? 0 : 101
        };
      }
    }
    return {
      result: global_constants.SCORM_FALSE,
      errorCode: 101
    };
  },
  requestHandler: function(commitObject) {
    return commitObject;
  },
  onLogMessage: defaultLogHandler,
  scoItemIds: [],
  scoItemIdValidator: false,
  globalObjectiveIds: [],
  // Offline support settings
  enableOfflineSupport: false,
  courseId: "",
  syncOnInitialize: true,
  syncOnTerminate: true,
  maxSyncAttempts: 5
};
function defaultLogHandler(messageLevel, logMessage) {
  switch (messageLevel) {
    case "4":
    case 4:
    case "ERROR":
    case LogLevelEnum.ERROR:
      console.error(logMessage);
      break;
    case "3":
    case 3:
    case "WARN":
    case LogLevelEnum.WARN:
      console.warn(logMessage);
      break;
    case "2":
    case 2:
    case "INFO":
    case LogLevelEnum.INFO:
      console.info(logMessage);
      break;
    case "1":
    case 1:
    case "DEBUG":
    case LogLevelEnum.DEBUG:
      if (console.debug) {
        console.debug(logMessage);
      } else {
        console.log(logMessage);
      }
      break;
  }
}

class ScheduledCommit {
  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   * @param {string} callback
   */
  constructor(API, when, callback) {
    this._cancelled = false;
    this._API = API;
    this._timeout = setTimeout(this.wrapper.bind(this), when);
    this._callback = callback;
  }
  /**
   * Cancel any currently scheduled commit
   */
  cancel() {
    this._cancelled = true;
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }
  /**
   * Wrap the API commit call to check if the call has already been cancelled
   */
  wrapper() {
    if (!this._cancelled) {
      (async () => await this._API.commit(this._callback))();
    }
  }
}

class HttpService {
  /**
   * Constructor for HttpService
   * @param {Settings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   */
  constructor(settings, error_codes) {
    this.settings = settings;
    this.error_codes = error_codes;
  }
  /**
   * Sends HTTP requests to the LMS with special handling for immediate and standard requests.
   *
   * This method handles communication with the LMS server, implementing two distinct
   * request handling strategies based on the context:
   *
   * 1. Immediate Mode (used during termination):
   *    When immediate=true, the method:
   *    - Initiates the fetch request but doesn't wait for it to complete
   *    - Returns a success result immediately
   *    - Processes the response asynchronously when it arrives
   *
   *    This is critical for browser compatibility during page unload/termination,
   *    as some browsers (especially Chrome) may cancel synchronous or awaited
   *    requests when a page is closing.
   *
   * 2. Standard Mode (normal operation):
   *    When immediate=false, the method:
   *    - Processes the request parameters through the configured requestHandler
   *    - Awaits the fetch response completely
   *    - Transforms the response using the configured responseHandler
   *    - Triggers appropriate event listeners based on success/failure
   *    - Returns the complete result with appropriate error codes
   *
   * The method also includes error handling to catch network failures or other
   * exceptions that might occur during the request process.
   *
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether to send the request immediately without waiting (true) or process normally (false)
   * @param {Function} apiLog - Function to log API messages with appropriate levels
   * @param {Function} processListeners - Function to trigger event listeners for commit events
   * @return {Promise<ResultObject>} - A promise that resolves with the result of the request
   *
   * @example
   * // Standard request (waits for response)
   * const result = await httpService.processHttpRequest(
   *   "https://lms.example.com/commit",
   *   { cmi: { core: { lesson_status: "completed" } } },
   *   false,
   *   console.log,
   *   (event) => dispatchEvent(new CustomEvent(event))
   * );
   *
   * @example
   * // Immediate request (for termination)
   * const result = await httpService.processHttpRequest(
   *   "https://lms.example.com/commit",
   *   { cmi: { core: { lesson_status: "completed" } } },
   *   true,
   *   console.log,
   *   (event) => dispatchEvent(new CustomEvent(event))
   * );
   * // result will be success immediately, regardless of actual HTTP result
   */
  async processHttpRequest(url, params, immediate = false, apiLog, processListeners) {
    const genericError = {
      result: global_constants.SCORM_FALSE,
      errorCode: this.error_codes.GENERAL || 101
    };
    if (immediate) {
      return this._handleImmediateRequest(url, params, apiLog, processListeners);
    }
    try {
      const processedParams = this.settings.requestHandler(params);
      const response = await this.performFetch(url, processedParams);
      return this.transformResponse(response, processListeners);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      apiLog("processHttpRequest", message, LogLevelEnum.ERROR);
      processListeners("CommitError");
      return genericError;
    }
  }
  /**
   * Handles an immediate request (used during termination)
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @param {Function} processListeners - Function to process event listeners
   * @return {ResultObject} - A success result object
   * @private
   */
  _handleImmediateRequest(url, params, apiLog, processListeners) {
    if (this.settings.useBeaconInsteadOfFetch !== "never") {
      const { body, contentType } = this._prepareRequestBody(params);
      navigator.sendBeacon(url, new Blob([body], { type: contentType }));
    } else {
      this.performFetch(url, params).then(async (response) => {
        await this.transformResponse(response, processListeners);
      }).catch((e) => {
        const message = e instanceof Error ? e.message : String(e);
        apiLog("processHttpRequest", message, LogLevelEnum.ERROR);
        processListeners("CommitError");
      });
    }
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0
    };
  }
  /**
   * Prepares the request body and content type based on params type
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {Object} - Object containing body and contentType
   * @private
   */
  _prepareRequestBody(params) {
    const body = params instanceof Array ? params.join("&") : JSON.stringify(params);
    const contentType = params instanceof Array ? "application/x-www-form-urlencoded" : this.settings.commitRequestDataType;
    return { body, contentType };
  }
  /**
   * Perform the fetch request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {StringKeyMap|Array} params - The parameters to include in the request
   * @return {Promise<Response>} - The response from the LMS
   * @private
   */
  async performFetch(url, params) {
    if (this.settings.useBeaconInsteadOfFetch === "always") {
      return this.performBeacon(url, params);
    }
    const { body, contentType } = this._prepareRequestBody(params);
    const init = {
      method: "POST",
      mode: this.settings.fetchMode,
      body,
      headers: {
        ...this.settings.xhrHeaders,
        "Content-Type": contentType
      },
      keepalive: true
    };
    if (this.settings.xhrWithCredentials) {
      init.credentials = "include";
    }
    return fetch(url, init);
  }
  /**
   * Perform the beacon request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {StringKeyMap|Array} params - The parameters to include in the request
   * @return {Promise<Response>} - A promise that resolves with a mock Response object
   * @private
   */
  async performBeacon(url, params) {
    const { body, contentType } = this._prepareRequestBody(params);
    const beaconSuccess = navigator.sendBeacon(url, new Blob([body], { type: contentType }));
    return Promise.resolve({
      status: beaconSuccess ? 200 : 0,
      ok: beaconSuccess,
      json: async () => ({
        result: beaconSuccess ? "true" : "false",
        errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL
      }),
      text: async () => JSON.stringify({
        result: beaconSuccess ? "true" : "false",
        errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL
      })
    });
  }
  /**
   * Transforms the response from the LMS to a ResultObject
   * @param {Response} response - The response from the LMS
   * @param {Function} processListeners - Function to process event listeners
   * @return {Promise<ResultObject>} - The transformed response
   * @private
   */
  async transformResponse(response, processListeners) {
    const result = typeof this.settings.responseHandler === "function" ? await this.settings.responseHandler(response) : await response.json();
    if (!Object.hasOwnProperty.call(result, "errorCode")) {
      result.errorCode = this._isSuccessResponse(response, result) ? 0 : this.error_codes.GENERAL;
    }
    if (this._isSuccessResponse(response, result)) {
      processListeners("CommitSuccess");
    } else {
      processListeners("CommitError", void 0, result.errorCode);
    }
    return result;
  }
  /**
   * Determines if a response is successful based on status code and result
   * @param {Response} response - The HTTP response
   * @param {ResultObject} result - The parsed result object
   * @return {boolean} - Whether the response is successful
   * @private
   */
  _isSuccessResponse(response, result) {
    const value = result.result;
    return response.status >= 200 && response.status <= 299 && (value === true || value === "true" || value === global_constants.SCORM_TRUE);
  }
  /**
   * Updates the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings) {
    this.settings = settings;
  }
}

class EventService {
  /**
   * Constructor for EventService
   * @param {Function} apiLog - Function to log API messages
   */
  constructor(apiLog) {
    // Map of function names to listeners for faster lookups
    this.listenerMap = /* @__PURE__ */ new Map();
    // Total count of listeners for logging
    this.listenerCount = 0;
    this.apiLog = apiLog;
  }
  /**
   * Parses a listener name into its components
   *
   * @param {string} listenerName - The name of the listener
   * @returns {ParsedListener|null} - The parsed listener information or null if invalid
   */
  parseListenerName(listenerName) {
    const listenerSplit = listenerName.split(".");
    if (listenerSplit.length === 0) return null;
    const functionName = listenerSplit[0];
    let CMIElement = null;
    if (listenerSplit.length > 1) {
      CMIElement = listenerName.replace(`${functionName}.`, "");
    }
    return { functionName: functionName ?? listenerName, CMIElement };
  }
  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener
   * @param {Function} callback - The callback function to execute when the event occurs
   */
  on(listenerName, callback) {
    if (!callback) return;
    const listenerFunctions = listenerName.split(" ");
    for (const listenerFunction of listenerFunctions) {
      const parsedListener = this.parseListenerName(listenerFunction);
      if (!parsedListener) continue;
      const { functionName, CMIElement } = parsedListener;
      const listeners = this.listenerMap.get(functionName) ?? [];
      listeners.push({
        functionName,
        CMIElement,
        callback
      });
      this.listenerMap.set(functionName, listeners);
      this.listenerCount++;
      this.apiLog(
        "on",
        `Added event listener: ${this.listenerCount}`,
        LogLevelEnum.INFO,
        functionName
      );
    }
  }
  /**
   * Provides a mechanism for detaching a specific SCORM event listener
   *
   * @param {string} listenerName - The name of the listener to remove
   * @param {Function} callback - The callback function to remove
   */
  off(listenerName, callback) {
    if (!callback) return;
    const listenerFunctions = listenerName.split(" ");
    for (const listenerFunction of listenerFunctions) {
      const parsedListener = this.parseListenerName(listenerFunction);
      if (!parsedListener) continue;
      const { functionName, CMIElement } = parsedListener;
      const listeners = this.listenerMap.get(functionName);
      if (!listeners) continue;
      const removeIndex = listeners.findIndex(
        (obj) => obj.CMIElement === CMIElement && obj.callback === callback
      );
      if (removeIndex !== -1) {
        listeners.splice(removeIndex, 1);
        this.listenerCount--;
        if (listeners.length === 0) {
          this.listenerMap.delete(functionName);
        } else {
          this.listenerMap.set(functionName, listeners);
        }
        this.apiLog(
          "off",
          `Removed event listener: ${this.listenerCount}`,
          LogLevelEnum.INFO,
          functionName
        );
      }
    }
  }
  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener to clear
   */
  clear(listenerName) {
    const listenerFunctions = listenerName.split(" ");
    for (const listenerFunction of listenerFunctions) {
      const parsedListener = this.parseListenerName(listenerFunction);
      if (!parsedListener) continue;
      const { functionName, CMIElement } = parsedListener;
      if (this.listenerMap.has(functionName)) {
        const listeners = this.listenerMap.get(functionName);
        const newListeners = listeners.filter((obj) => obj.CMIElement !== CMIElement);
        this.listenerCount -= listeners.length - newListeners.length;
        if (newListeners.length === 0) {
          this.listenerMap.delete(functionName);
        } else {
          this.listenerMap.set(functionName, newListeners);
        }
      }
    }
  }
  /**
   * Processes any 'on' listeners that have been created
   *
   * @param {string} functionName - The name of the function that triggered the event
   * @param {string} CMIElement - The CMI element that was affected
   * @param {any} value - The value that was set
   */
  processListeners(functionName, CMIElement, value) {
    this.apiLog(functionName, value, LogLevelEnum.INFO, CMIElement);
    const listeners = this.listenerMap.get(functionName);
    if (!listeners) return;
    for (const listener of listeners) {
      const listenerHasCMIElement = !!listener.CMIElement;
      let CMIElementsMatch = false;
      if (CMIElement && listener.CMIElement) {
        if (listener.CMIElement.endsWith("*")) {
          const prefix = listener.CMIElement.slice(0, -1);
          CMIElementsMatch = CMIElement.startsWith(prefix);
        } else {
          CMIElementsMatch = listener.CMIElement === CMIElement;
        }
      }
      if (!listenerHasCMIElement || CMIElementsMatch) {
        this.apiLog(
          "processListeners",
          `Processing listener: ${listener.functionName}`,
          LogLevelEnum.DEBUG,
          CMIElement
        );
        if (functionName.startsWith("Sequence")) {
          listener.callback(value);
        } else if (functionName === "CommitError") {
          listener.callback(value);
        } else if (functionName === "CommitSuccess") {
          listener.callback();
        } else {
          listener.callback(CMIElement, value);
        }
      }
    }
  }
  /**
   * Resets the event service by clearing all listeners
   */
  reset() {
    this.listenerMap.clear();
    this.listenerCount = 0;
  }
}

class SerializationService {
  /**
   * Loads CMI data from a flattened JSON object with special handling for arrays and ordering.
   *
   * This method implements a complex algorithm for loading flattened JSON data into the CMI
   * object structure. It handles several key challenges:
   *
   * 1. Ordering dependencies: Some CMI elements (like interactions and objectives) must be
   *    loaded in a specific order to ensure proper initialization.
   *
   * 2. Array handling: Interactions and objectives are stored as arrays, and their properties
   *    must be loaded in the correct order (e.g., 'id' and 'type' must be set before other properties).
   *
   * 3. Unflattening: The method converts flattened dot notation (e.g., "cmi.objectives.0.id")
   *    back into nested objects before loading.
   *
   * The algorithm works by:
   * - Categorizing keys into interactions, objectives, and other properties
   * - Sorting interactions to prioritize 'id' and 'type' fields within each index
   * - Sorting objectives to prioritize 'id' fields within each index
   * - Processing each category in order: interactions, objectives, then other properties
   *
   * @param {StringKeyMap} json - The flattened JSON object with dot notation keys
   * @param {string} CMIElement - The CMI element to start from (usually empty or "cmi")
   * @param {Function} setCMIValue - Function to set CMI value
   * @param {Function} isNotInitialized - Function to check if API is not initialized
   *
   * @param setStartingData
   * @example
   * // Example of flattened JSON input:
   * // {
   * //   "cmi.objectives.0.id": "obj1",
   * //   "cmi.objectives.0.score.raw": "80",
   * //   "cmi.interactions.0.id": "int1",
   * //   "cmi.interactions.0.type": "choice",
   * //   "cmi.interactions.0.result": "correct"
   * // }
   */
  loadFromFlattenedJSON(json, CMIElement = "", setCMIValue, isNotInitialized, setStartingData) {
    if (!isNotInitialized()) {
      console.error("loadFromFlattenedJSON can only be called before the call to lmsInitialize.");
      return;
    }
    const int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
    const obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;
    const interactions = [];
    const objectives = [];
    const others = [];
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        const intMatch = key.match(int_pattern);
        if (intMatch) {
          interactions.push({
            key,
            value: json[key],
            index: Number(intMatch[2]),
            field: intMatch[3] || ""
          });
          continue;
        }
        const objMatch = key.match(obj_pattern);
        if (objMatch) {
          objectives.push({
            key,
            value: json[key],
            index: Number(objMatch[2]),
            field: objMatch[3] || ""
          });
          continue;
        }
        others.push({ key, value: json[key] });
      }
    }
    interactions.sort((a, b) => {
      if (a.index !== b.index) {
        return a.index - b.index;
      }
      if (a.field === "id") return -1;
      if (b.field === "id") return 1;
      if (a.field === "type") return -1;
      if (b.field === "type") return 1;
      return a.field.localeCompare(b.field);
    });
    objectives.sort((a, b) => {
      if (a.index !== b.index) {
        return a.index - b.index;
      }
      if (a.field === "id") return -1;
      if (b.field === "id") return 1;
      return a.field.localeCompare(b.field);
    });
    others.sort((a, b) => a.key.localeCompare(b.key));
    const processItems = (items) => {
      items.forEach((item) => {
        const obj = {};
        obj[item.key] = item.value;
        this.loadFromJSON(
          unflatten(obj),
          CMIElement,
          setCMIValue,
          isNotInitialized,
          setStartingData
        );
      });
    };
    processItems(interactions);
    processItems(objectives);
    processItems(others);
  }
  /**
   * Loads CMI data from a nested JSON object with recursive traversal.
   *
   * This method implements a recursive algorithm for loading nested JSON data into the CMI
   * object structure. It handles several key aspects:
   *
   * 1. Recursive traversal: The method recursively traverses the nested JSON structure,
   *    building CMI element paths as it goes (e.g., "cmi.core.student_id").
   *
   * 2. Type-specific handling: Different data types are handled differently:
   *    - Arrays: Each array element is processed individually with its index in the path
   *    - Objects: Recursively processed with updated path
   *    - Primitives: Set directly using setCMIValue
   *
   * 3. Initialization check: Ensures the method is only called before API initialization
   *
   * 4. Starting data storage: Stores the original JSON data for potential future use
   *
   * The algorithm works by:
   * - First storing the complete JSON object via setStartingData
   * - Iterating through each property in the JSON object
   * - For each property, determining its type and handling it accordingly
   * - Building the CMI element path as it traverses the structure
   * - Setting values at the appropriate paths using setCMIValue
   *
   * @param {{[key: string]: any}} json - The nested JSON object to load
   * @param {string} CMIElement - The CMI element to start from (usually empty or "cmi")
   * @param {Function} setCMIValue - Function to set CMI value at a specific path
   * @param {Function} isNotInitialized - Function to check if API is not initialized
   * @param {Function} setStartingData - Function to store the original JSON data
   *
   * @example
   * // Example of nested JSON input:
   * // {
   * //   "core": {
   * //     "student_id": "12345",
   * //     "student_name": "John Doe"
   * //   },
   * //   "objectives": [
   * //     { "id": "obj1", "score": { "raw": 80 } },
   * //     { "id": "obj2", "score": { "raw": 90 } }
   * //   ]
   * // }
   */
  loadFromJSON(json, CMIElement = "", setCMIValue, isNotInitialized, setStartingData) {
    if (!isNotInitialized()) {
      console.error("loadFromJSON can only be called before the call to lmsInitialize.");
      return;
    }
    CMIElement = CMIElement !== void 0 ? CMIElement : "cmi";
    setStartingData(json);
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key) && json[key]) {
        const currentCMIElement = (CMIElement ? CMIElement + "." : "") + key;
        const value = json[key];
        if (value.constructor === Array) {
          for (let i = 0; i < value.length; i++) {
            if (value[i]) {
              const item = value[i];
              const tempCMIElement = `${currentCMIElement}.${i}`;
              if (item.constructor === Object) {
                this.loadFromJSON(
                  item,
                  tempCMIElement,
                  setCMIValue,
                  isNotInitialized,
                  setStartingData
                );
              } else {
                setCMIValue(tempCMIElement, item);
              }
            }
          }
        } else if (value.constructor === Object) {
          this.loadFromJSON(
            value,
            currentCMIElement,
            setCMIValue,
            isNotInitialized,
            setStartingData
          );
        } else {
          setCMIValue(currentCMIElement, value);
        }
      }
    }
  }
  /**
   * Render the CMI object to JSON for sending to an LMS.
   *
   * @param {BaseCMI|StringKeyMap} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {string}
   */
  renderCMIToJSONString(cmi, sendFullCommit) {
    if (sendFullCommit) {
      return JSON.stringify({ cmi });
    }
    return JSON.stringify({ cmi }, (k, v) => v === void 0 ? null : v, 2);
  }
  /**
   * Returns a JS object representing the current cmi
   * @param {BaseCMI|StringKeyMap} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {object}
   */
  renderCMIToJSONObject(cmi, sendFullCommit) {
    return JSON.parse(this.renderCMIToJSONString(cmi, sendFullCommit));
  }
  /**
   * Builds the commit object to be sent to the LMS
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} alwaysSendTotalTime - Whether to always send total time
   * @param {boolean|Function} renderCommonCommitFields - Whether to render common commit fields
   * @param {Function} renderCommitObject - Function to render commit object
   * @param {Function} renderCommitCMI - Function to render commit CMI
   * @param {LogLevel} apiLogLevel - The API log level
   * @return {CommitObject|StringKeyMap|Array<any>}
   */
  getCommitObject(terminateCommit, alwaysSendTotalTime, renderCommonCommitFields, renderCommitObject, renderCommitCMI, apiLogLevel) {
    const includeTotalTime = alwaysSendTotalTime || terminateCommit;
    const commitObject = renderCommonCommitFields ? renderCommitObject(terminateCommit, includeTotalTime) : renderCommitCMI(terminateCommit, includeTotalTime);
    if ([LogLevelEnum.DEBUG, "1", 1, "DEBUG"].includes(apiLogLevel)) {
      console.debug("Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ");
      console.debug(commitObject);
    }
    return commitObject;
  }
}

class LoggingService {
  /**
   * Private constructor to prevent direct instantiation
   */
  constructor() {
    this._logLevel = LogLevelEnum.ERROR;
    this._logHandler = defaultLogHandler;
  }
  /**
   * Get the singleton instance of LoggingService
   *
   * @returns {LoggingService} The singleton instance
   */
  static getInstance() {
    if (!LoggingService._instance) {
      LoggingService._instance = new LoggingService();
    }
    return LoggingService._instance;
  }
  /**
   * Set the log level
   *
   * @param {LogLevel} level - The log level to set
   */
  setLogLevel(level) {
    this._logLevel = level;
  }
  /**
   * Get the current log level
   *
   * @returns {LogLevel} The current log level
   */
  getLogLevel() {
    return this._logLevel;
  }
  /**
   * Set a custom log handler
   *
   * @param {Function} handler - The function to handle log messages
   */
  setLogHandler(handler) {
    this._logHandler = handler;
  }
  /**
   * Log a message if the message level is greater than or equal to the current log level
   *
   * @param {LogLevel} messageLevel - The level of the message
   * @param {string} logMessage - The message to log
   */
  log(messageLevel, logMessage) {
    if (this.shouldLog(messageLevel)) {
      this._logHandler(messageLevel, logMessage);
    }
  }
  /**
   * Log a message at ERROR level
   *
   * @param {string} logMessage - The message to log
   */
  error(logMessage) {
    this.log(LogLevelEnum.ERROR, logMessage);
  }
  /**
   * Log a message at WARN level
   *
   * @param {string} logMessage - The message to log
   */
  warn(logMessage) {
    this.log(LogLevelEnum.WARN, logMessage);
  }
  /**
   * Log a message at INFO level
   *
   * @param {string} logMessage - The message to log
   */
  info(logMessage) {
    this.log(LogLevelEnum.INFO, logMessage);
  }
  /**
   * Log a message at DEBUG level
   *
   * @param {string} logMessage - The message to log
   */
  debug(logMessage) {
    this.log(LogLevelEnum.DEBUG, logMessage);
  }
  /**
   * Determine if a message should be logged based on its level and the current log level
   *
   * @param {LogLevel} messageLevel - The level of the message
   * @returns {boolean} Whether the message should be logged
   */
  shouldLog(messageLevel) {
    const numericMessageLevel = this.getNumericLevel(messageLevel);
    const numericLogLevel = this.getNumericLevel(this._logLevel);
    return numericMessageLevel >= numericLogLevel;
  }
  /**
   * Convert a log level to its numeric value
   *
   * @param {LogLevel} level - The log level to convert
   * @returns {number} The numeric value of the log level
   */
  getNumericLevel(level) {
    if (level === void 0) return LogLevelEnum.NONE;
    if (typeof level === "number") return level;
    switch (level) {
      case "1":
      case "DEBUG":
        return LogLevelEnum.DEBUG;
      case "2":
      case "INFO":
        return LogLevelEnum.INFO;
      case "3":
      case "WARN":
        return LogLevelEnum.WARN;
      case "4":
      case "ERROR":
        return LogLevelEnum.ERROR;
      case "5":
      case "NONE":
        return LogLevelEnum.NONE;
      default:
        return LogLevelEnum.ERROR;
    }
  }
}
function getLoggingService() {
  return LoggingService.getInstance();
}

class ErrorHandlingService {
  /**
   * Constructor for ErrorHandlingService
   *
   * @param {ErrorCode} errorCodes - The error codes object
   * @param {Function} apiLog - Function for logging API calls
   * @param {Function} getLmsErrorMessageDetails - Function for getting error message details
   * @param {ILoggingService} loggingService - Optional logging service instance
   */
  constructor(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService) {
    this._lastErrorCode = "0";
    this._errorCodes = errorCodes;
    this._apiLog = apiLog;
    this._getLmsErrorMessageDetails = getLmsErrorMessageDetails;
    this._loggingService = loggingService || getLoggingService();
  }
  /**
   * Get the last error code
   *
   * @return {string} - The last error code
   */
  get lastErrorCode() {
    return this._lastErrorCode;
  }
  /**
   * Set the last error code
   *
   * @param {string} errorCode - The error code to set
   */
  set lastErrorCode(errorCode) {
    this._lastErrorCode = errorCode;
  }
  /**
   * Throws a SCORM error
   *
   * @param {string} CMIElement
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   * @throws {ValidationError} - If throwException is true, throws a ValidationError
   */
  throwSCORMError(CMIElement, errorNumber, message) {
    if (!message) {
      message = this._getLmsErrorMessageDetails(errorNumber, true);
    }
    const formattedMessage = `SCORM Error ${errorNumber}: ${message}${CMIElement ? ` [Element: ${CMIElement}]` : ""}`;
    this._apiLog("throwSCORMError", errorNumber + ": " + message, LogLevelEnum.ERROR, CMIElement);
    this._loggingService.error(formattedMessage);
    this._lastErrorCode = String(errorNumber);
  }
  /**
   * Clears the last SCORM error code on success.
   *
   * @param {string} success - Whether the operation was successful
   */
  clearSCORMError(success) {
    if (success !== void 0 && success !== global_constants.SCORM_FALSE) {
      this._lastErrorCode = "0";
    }
  }
  /**
   * Handles exceptions that occur when accessing or setting CMI values.
   *
   * This method provides centralized error handling for exceptions that occur during
   * CMI data operations. It differentiates between different types of errors and
   * handles them appropriately:
   *
   * 1. ValidationError: These are expected errors from the validation system that
   *    indicate a specific SCORM error condition (like invalid data format or range).
   *    For these errors, the method:
   *    - Sets the lastErrorCode to the error code from the ValidationError
   *    - Returns SCORM_FALSE to indicate failure to the caller
   *
   * 2. Standard JavaScript Error: For general JavaScript errors (like TypeError,
   *    ReferenceError, etc.), the method:
   *    - Logs the error message with stack trace to the logging service
   *    - Sets a general SCORM error
   *    - Returns SCORM_FALSE to indicate failure
   *
   * 3. Unknown exceptions: For any other type of exception that doesn't match the
   *    above categories, the method:
   *    - Logs the entire exception object to the logging service
   *    - Sets a general SCORM error
   *    - Returns SCORM_FALSE to indicate failure
   *
   * This method is critical for maintaining SCORM compliance by ensuring that
   * all errors are properly translated into the appropriate SCORM error codes.
   *
   * @param {string} CMIElement
   * @param {ValidationError|Error|unknown} e - The exception that was thrown
   * @param {string} returnValue - The default return value (typically an empty string)
   * @return {string} - Either the original returnValue or SCORM_FALSE if an error occurred
   *
   * @example
   * try {
   *   const value = getCMIValue("cmi.core.score.raw");
   *   return value;
   * } catch (e) {
   *   return handleValueAccessException(e, "");
   * }
   */
  handleValueAccessException(CMIElement, e, returnValue) {
    if (e instanceof ValidationError) {
      const validationError = e;
      this._lastErrorCode = String(validationError.errorCode);
      const errorMessage = `Validation Error ${validationError.errorCode}: ${validationError.message} [Element: ${CMIElement}]`;
      this._loggingService.warn(errorMessage);
      returnValue = global_constants.SCORM_FALSE;
    } else if (e instanceof Error) {
      const errorType = e.constructor.name;
      const errorMessage = `${errorType}: ${e.message} [Element: ${CMIElement}]`;
      const stackTrace = e.stack || "";
      this._loggingService.error(`${errorMessage}
${stackTrace}`);
      this.throwSCORMError(
        CMIElement,
        this._errorCodes.GENERAL,
        `${errorType}: ${e.message}`
      );
    } else {
      const errorMessage = `Unknown error occurred while accessing [Element: ${CMIElement}]`;
      this._loggingService.error(errorMessage);
      try {
        const errorDetails = JSON.stringify(e);
        this._loggingService.error(`Error details: ${errorDetails}`);
      } catch (jsonError) {
        this._loggingService.error("Could not stringify error object for details");
      }
      this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, "Unknown error");
    }
    return returnValue;
  }
  /**
   * Get the error codes object
   *
   * @return {ErrorCode} - The error codes object
   */
  get errorCodes() {
    return this._errorCodes;
  }
}
function createErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService) {
  return new ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService);
}

class OfflineStorageService {
  /**
   * Constructor for OfflineStorageService
   * @param {Settings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   * @param {Function} apiLog - The logging function
   */
  constructor(settings, error_codes, apiLog) {
    this.apiLog = apiLog;
    this.storeName = "scorm_again_offline_data";
    this.syncQueue = "scorm_again_sync_queue";
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.settings = settings;
    this.error_codes = error_codes;
    window.addEventListener("online", this.handleOnlineStatusChange.bind(this));
    window.addEventListener("offline", this.handleOnlineStatusChange.bind(this));
  }
  /**
   * Handle changes in online status
   */
  handleOnlineStatusChange() {
    const wasOnline = this.isOnline;
    this.isOnline = navigator.onLine;
    if (!wasOnline && this.isOnline) {
      this.apiLog(
        "OfflineStorageService",
        "Device is back online, attempting to sync...",
        LogLevelEnum.INFO
      );
      this.syncOfflineData().then(
        (success) => {
          if (success) {
            this.apiLog("OfflineStorageService", "Sync completed successfully", LogLevelEnum.INFO);
          } else {
            this.apiLog("OfflineStorageService", "Sync failed", LogLevelEnum.ERROR);
          }
        },
        (error) => {
          this.apiLog("OfflineStorageService", `Error during sync: ${error}`, LogLevelEnum.ERROR);
        }
      );
    } else if (wasOnline && !this.isOnline) {
      this.apiLog(
        "OfflineStorageService",
        "Device is offline, data will be stored locally",
        LogLevelEnum.INFO
      );
    }
  }
  /**
   * Store commit data offline
   * @param {string} courseId - Identifier for the course
   * @param {CommitObject} commitData - The data to store offline
   * @returns {Promise<ResultObject>} - Result of the storage operation
   */
  async storeOffline(courseId, commitData) {
    try {
      const queueItem = {
        id: `${courseId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        courseId,
        timestamp: Date.now(),
        data: commitData,
        syncAttempts: 0
      };
      const currentQueue = await this.getFromStorage(this.syncQueue) || [];
      currentQueue.push(queueItem);
      await this.saveToStorage(this.syncQueue, currentQueue);
      await this.saveToStorage(`${this.storeName}_${courseId}`, commitData);
      this.apiLog(
        "OfflineStorageService",
        `Stored data offline for course ${courseId}`,
        LogLevelEnum.INFO
      );
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0
      };
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error storing offline data: ${error}`,
        LogLevelEnum.ERROR
      );
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL ?? 0
      };
    }
  }
  /**
   * Get the stored offline data for a course
   * @param {string} courseId - Identifier for the course
   * @returns {Promise<CommitObject|null>} - The stored data or null if not found
   */
  async getOfflineData(courseId) {
    try {
      const data = await this.getFromStorage(`${this.storeName}_${courseId}`);
      return data || null;
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error retrieving offline data: ${error}`,
        LogLevelEnum.ERROR
      );
      return null;
    }
  }
  /**
   * Synchronize offline data with the LMS when connection is available
   * @returns {Promise<boolean>} - Success status of synchronization
   */
  async syncOfflineData() {
    if (this.syncInProgress || !this.isOnline) {
      return false;
    }
    this.syncInProgress = true;
    try {
      const syncQueue = await this.getFromStorage(this.syncQueue) || [];
      if (syncQueue.length === 0) {
        this.syncInProgress = false;
        return true;
      }
      this.apiLog(
        "OfflineStorageService",
        `Found ${syncQueue.length} items to sync`,
        LogLevelEnum.INFO
      );
      const remainingQueue = [];
      for (const item of syncQueue) {
        if (item.syncAttempts >= 5) {
          this.apiLog(
            "OfflineStorageService",
            `Skipping item ${item.id} after 5 failed attempts`,
            LogLevelEnum.WARN
          );
          continue;
        }
        try {
          const syncResult = await this.sendDataToLMS(item.data);
          if (syncResult.result === global_constants.SCORM_TRUE) {
            this.apiLog(
              "OfflineStorageService",
              `Successfully synced item ${item.id}`,
              LogLevelEnum.INFO
            );
          } else {
            item.syncAttempts++;
            remainingQueue.push(item);
            this.apiLog(
              "OfflineStorageService",
              `Failed to sync item ${item.id}, attempt #${item.syncAttempts}`,
              LogLevelEnum.WARN
            );
          }
        } catch (error) {
          item.syncAttempts++;
          remainingQueue.push(item);
          this.apiLog(
            "OfflineStorageService",
            `Error syncing item ${item.id}: ${error}`,
            LogLevelEnum.ERROR
          );
        }
      }
      await this.saveToStorage(this.syncQueue, remainingQueue);
      this.apiLog(
        "OfflineStorageService",
        `Sync completed. ${syncQueue.length - remainingQueue.length} items synced, ${remainingQueue.length} items remaining`,
        LogLevelEnum.INFO
      );
      this.syncInProgress = false;
      return true;
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error during sync process: ${error}`,
        LogLevelEnum.ERROR
      );
      this.syncInProgress = false;
      return false;
    }
  }
  /**
   * Send data to the LMS when online
   * @param {CommitObject} data - The data to send to the LMS
   * @returns {Promise<ResultObject>} - Result of the sync operation
   */
  async sendDataToLMS(data) {
    if (!this.settings.lmsCommitUrl) {
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101
      };
    }
    try {
      const processedData = this.settings.requestHandler(data);
      const init = {
        method: "POST",
        mode: this.settings.fetchMode,
        body: JSON.stringify(processedData),
        headers: {
          ...this.settings.xhrHeaders,
          "Content-Type": this.settings.commitRequestDataType
        }
      };
      if (this.settings.xhrWithCredentials) {
        init.credentials = "include";
      }
      const response = await fetch(this.settings.lmsCommitUrl, init);
      const result = typeof this.settings.responseHandler === "function" ? await this.settings.responseHandler(response) : await response.json();
      if (response.status >= 200 && response.status <= 299 && (result.result === true || result.result === global_constants.SCORM_TRUE)) {
        if (!Object.hasOwnProperty.call(result, "errorCode")) {
          result.errorCode = 0;
        }
        return result;
      } else {
        if (!Object.hasOwnProperty.call(result, "errorCode")) {
          result.errorCode = this.error_codes.GENERAL;
        }
        return result;
      }
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error sending data to LMS: ${error}`,
        LogLevelEnum.ERROR
      );
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101
      };
    }
  }
  /**
   * Check if the device is currently online
   * @returns {boolean} - Online status
   */
  isDeviceOnline() {
    return this.isOnline;
  }
  // noinspection JSValidateJSDoc
  /**
   * Get item from localStorage
   * @param {string} key - The key to retrieve
   * @returns {Promise<T|null>} - The retrieved data
   */
  async getFromStorage(key) {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
  /**
   * Save item to localStorage
   * @param {string} key - The key to store under
   * @param {any} data - The data to store
   * @returns {Promise<void>}
   */
  async saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  /**
   * Check if there is pending offline data for a course
   * @param {string} courseId - Identifier for the course
   * @returns {Promise<boolean>} - Whether there is pending data
   */
  async hasPendingOfflineData(courseId) {
    const queue = await this.getFromStorage(this.syncQueue) || [];
    return queue.some((item) => item.courseId === courseId);
  }
  /**
   * Update the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings) {
    this.settings = settings;
  }
}

class BaseAPI {
  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {ErrorCode} error_codes - The error codes object
   * @param {Settings} settings - Optional settings for the API
   * @param {IHttpService} httpService - Optional HTTP service instance
   * @param {IEventService} eventService - Optional Event service instance
   * @param {ISerializationService} serializationService - Optional Serialization service instance
   * @param {ICMIDataService} cmiDataService - Optional CMI Data service instance
   * @param {IErrorHandlingService} errorHandlingService - Optional Error Handling service instance
   * @param {ILoggingService} loggingService - Optional Logging service instance
   * @param {IOfflineStorageService} offlineStorageService - Optional Offline Storage service instance
   */
  constructor(error_codes, settings, httpService, eventService, serializationService, cmiDataService, errorHandlingService, loggingService, offlineStorageService) {
    this._settings = DefaultSettings;
    this._courseId = "";
    if (new.target === BaseAPI) {
      throw new TypeError("Cannot construct BaseAPI instances directly");
    }
    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this._error_codes = error_codes;
    if (settings) {
      this.settings = {
        ...DefaultSettings,
        ...settings
      };
    }
    this._loggingService = loggingService || getLoggingService();
    this._loggingService.setLogLevel(this.settings.logLevel);
    if (this.settings.onLogMessage) {
      this._loggingService.setLogHandler(this.settings.onLogMessage);
    }
    this._httpService = httpService || new HttpService(this.settings, this._error_codes);
    this._eventService = eventService || new EventService(
      (functionName, message, level, element) => this.apiLog(functionName, message, level, element)
    );
    this._serializationService = serializationService || new SerializationService();
    this._errorHandlingService = errorHandlingService || createErrorHandlingService(
      this._error_codes,
      (functionName, message, level, element) => this.apiLog(functionName, message, level, element),
      (errorNumber, detail) => this.getLmsErrorMessageDetails(errorNumber, detail)
    );
    if (this.settings.enableOfflineSupport) {
      this._offlineStorageService = offlineStorageService || new OfflineStorageService(
        this.settings,
        this._error_codes,
        (functionName, message, level, element) => this.apiLog(functionName, message, level, element)
      );
      if (this.settings.courseId) {
        this._courseId = this.settings.courseId;
      }
      if (this._offlineStorageService && this._courseId) {
        this._offlineStorageService.getOfflineData(this._courseId).then((offlineData) => {
          if (offlineData) {
            this.apiLog("constructor", "Found offline data to restore", LogLevelEnum.INFO);
            this.loadFromJSON(offlineData.runtimeData);
          }
        }).catch((error) => {
          this.apiLog(
            "constructor",
            `Error retrieving offline data: ${error}`,
            LogLevelEnum.ERROR
          );
        });
      }
    }
  }
  /**
   * Get the last error code
   * @return {string}
   */
  get lastErrorCode() {
    return this._errorHandlingService?.lastErrorCode ?? "0";
  }
  /**
   * Set the last error code
   * @param {string} errorCode
   */
  set lastErrorCode(errorCode) {
    if (this._errorHandlingService) {
      this._errorHandlingService.lastErrorCode = errorCode;
    }
  }
  /**
   * Common reset method for all APIs. New settings are merged with the existing settings.
   * @param {Settings} settings
   * @protected
   */
  commonReset(settings) {
    this.apiLog("reset", "Called", LogLevelEnum.INFO);
    this.settings = { ...this.settings, ...settings };
    this.clearScheduledCommit();
    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = "0";
    this._eventService.reset();
    this.startingData = {};
    if (this._offlineStorageService) {
      this._offlineStorageService.updateSettings(this.settings);
      if (settings?.courseId) {
        this._courseId = settings.courseId;
      }
    }
  }
  /**
   * Initialize the API
   * @param {string} callbackName
   * @param {string} initializeMessage
   * @param {string} terminationMessage
   * @return {string}
   */
  initialize(callbackName, initializeMessage, terminationMessage) {
    let returnValue = global_constants.SCORM_FALSE;
    if (this.isInitialized()) {
      this.throwSCORMError("api", this._error_codes.INITIALIZED, initializeMessage);
    } else if (this.isTerminated()) {
      this.throwSCORMError("api", this._error_codes.TERMINATED, terminationMessage);
    } else {
      if (this.settings.selfReportSessionTime) {
        this.cmi.setStartTime();
      }
      this.currentState = global_constants.STATE_INITIALIZED;
      this.lastErrorCode = "0";
      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);
      if (this.settings.enableOfflineSupport && this._offlineStorageService && this._courseId && this.settings.syncOnInitialize && this._offlineStorageService.isDeviceOnline()) {
        this._offlineStorageService.hasPendingOfflineData(this._courseId).then((hasPendingData) => {
          if (hasPendingData) {
            this.apiLog(
              callbackName,
              "Syncing pending offline data on initialization",
              LogLevelEnum.INFO
            );
            this._offlineStorageService?.syncOfflineData().then((syncSuccess) => {
              if (syncSuccess) {
                this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
                this.processListeners("OfflineDataSynced");
              }
            });
          }
        });
      }
    }
    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    this.clearSCORMError(returnValue);
    return returnValue;
  }
  /**
   * Logging for all SCORM actions
   *
   * @param {string} functionName
   * @param {string} logMessage
   * @param {number} messageLevel
   * @param {string} CMIElement
   */
  apiLog(functionName, logMessage, messageLevel, CMIElement) {
    logMessage = formatMessage(functionName, logMessage, CMIElement);
    if (messageLevel >= this.settings.logLevel) {
      this._loggingService.log(messageLevel, logMessage);
    }
  }
  /**
   * Getter for _settings
   * @return {InternalSettings}
   */
  get settings() {
    return this._settings;
  }
  /**
   * Setter for _settings
   * @param {Settings} settings
   */
  set settings(settings) {
    const previousSettings = this._settings;
    this._settings = { ...this._settings, ...settings };
    this._httpService?.updateSettings(this._settings);
    if (settings.logLevel !== void 0 && settings.logLevel !== previousSettings.logLevel) {
      this.settings.logLevel = settings.logLevel;
      this._loggingService?.setLogLevel(settings.logLevel);
    }
    if (settings.onLogMessage !== void 0 && settings.onLogMessage !== previousSettings.onLogMessage) {
      this._loggingService?.setLogHandler(settings.onLogMessage);
    }
  }
  /**
   * Terminates the current run of the API
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  async terminate(callbackName, checkTerminated) {
    let returnValue = global_constants.SCORM_FALSE;
    if (this.checkState(
      checkTerminated,
      this._error_codes.TERMINATION_BEFORE_INIT ?? 0,
      this._error_codes.MULTIPLE_TERMINATION ?? 0
    )) {
      this.currentState = global_constants.STATE_TERMINATED;
      if (this.settings.enableOfflineSupport && this._offlineStorageService && this._courseId && this.settings.syncOnTerminate && this._offlineStorageService.isDeviceOnline()) {
        const hasPendingData = await this._offlineStorageService.hasPendingOfflineData(
          this._courseId
        );
        if (hasPendingData) {
          this.apiLog(
            callbackName,
            "Syncing pending offline data before termination",
            LogLevelEnum.INFO
          );
          await this._offlineStorageService.syncOfflineData();
        }
      }
      const result = await this.storeData(true);
      if ((result.errorCode ?? 0) > 0) {
        this.throwSCORMError("api", result.errorCode ?? 0);
      }
      returnValue = result?.result ?? global_constants.SCORM_FALSE;
      if (checkTerminated) this.lastErrorCode = "0";
      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);
    }
    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    this.clearSCORMError(returnValue);
    return returnValue;
  }
  /**
   * Get the value of the CMIElement.
   *
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @param {string} CMIElement
   * @return {string}
   */
  getValue(callbackName, checkTerminated, CMIElement) {
    let returnValue = "";
    if (this.checkState(
      checkTerminated,
      this._error_codes.RETRIEVE_BEFORE_INIT ?? 0,
      this._error_codes.RETRIEVE_AFTER_TERM ?? 0
    )) {
      try {
        returnValue = this.getCMIValue(CMIElement);
      } catch (e) {
        returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
      }
      this.processListeners(callbackName, CMIElement);
    }
    this.apiLog(callbackName, ": returned: " + returnValue, LogLevelEnum.INFO, CMIElement);
    if (returnValue === void 0) {
      return "";
    }
    if (this.lastErrorCode === "0") {
      this.clearSCORMError(returnValue);
    }
    return returnValue;
  }
  /**
   * Sets the value of the CMIElement.
   *
   * @param {string} callbackName
   * @param {string} commitCallback
   * @param {boolean} checkTerminated
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  setValue(callbackName, commitCallback, checkTerminated, CMIElement, value) {
    if (value !== void 0) {
      value = String(value);
    }
    let returnValue = global_constants.SCORM_FALSE;
    if (this.checkState(
      checkTerminated,
      this._error_codes.STORE_BEFORE_INIT ?? 0,
      this._error_codes.STORE_AFTER_TERM ?? 0
    )) {
      try {
        returnValue = this.setCMIValue(CMIElement, value);
      } catch (e) {
        returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
      }
      this.processListeners(callbackName, CMIElement, value);
    }
    if (returnValue === void 0) {
      returnValue = global_constants.SCORM_FALSE;
    }
    if (String(this.lastErrorCode) === "0") {
      if (this.settings.autocommit) {
        this.scheduleCommit(this.settings.autocommitSeconds * 1e3, commitCallback);
      }
    }
    this.apiLog(
      callbackName,
      ": " + value + ": result: " + returnValue,
      LogLevelEnum.INFO,
      CMIElement
    );
    if (this.lastErrorCode === "0") {
      this.clearSCORMError(returnValue);
    }
    return returnValue;
  }
  /**
   * Orders LMS to store all content parameters
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  async commit(callbackName, checkTerminated = false) {
    this.clearScheduledCommit();
    let returnValue = global_constants.SCORM_FALSE;
    if (this.checkState(
      checkTerminated,
      this._error_codes.COMMIT_BEFORE_INIT ?? 0,
      this._error_codes.COMMIT_AFTER_TERM ?? 0
    )) {
      const result = await this.storeData(false);
      if ((result.errorCode ?? 0) > 0) {
        this.throwSCORMError("api", result.errorCode);
      }
      returnValue = result?.result ?? global_constants.SCORM_FALSE;
      this.apiLog(callbackName, " Result: " + returnValue, LogLevelEnum.DEBUG, "HttpRequest");
      if (checkTerminated) this.lastErrorCode = "0";
      this.processListeners(callbackName);
      if (this.settings.enableOfflineSupport && this._offlineStorageService && this._offlineStorageService.isDeviceOnline() && this._courseId) {
        this._offlineStorageService.hasPendingOfflineData(this._courseId).then((hasPendingData) => {
          if (hasPendingData) {
            this.apiLog(callbackName, "Syncing pending offline data", LogLevelEnum.INFO);
            this._offlineStorageService?.syncOfflineData().then((syncSuccess) => {
              if (syncSuccess) {
                this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
                this.processListeners("OfflineDataSynced");
              } else {
                this.apiLog(callbackName, "Failed to sync some offline data", LogLevelEnum.WARN);
              }
            });
          }
        });
      }
    }
    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    if (this.lastErrorCode === "0") {
      this.clearSCORMError(returnValue);
    }
    return returnValue;
  }
  /**
   * Returns last error code
   * @param {string} callbackName
   * @return {string}
   */
  getLastError(callbackName) {
    const returnValue = String(this.lastErrorCode);
    this.processListeners(callbackName);
    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    return returnValue;
  }
  /**
   * Returns the errorNumber error description
   *
   * @param {string} callbackName
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  getErrorString(callbackName, CMIErrorCode) {
    let returnValue = "";
    if (CMIErrorCode !== null && CMIErrorCode !== "") {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
      this.processListeners(callbackName);
    }
    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    return returnValue;
  }
  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param {string} callbackName
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  getDiagnostic(callbackName, CMIErrorCode) {
    let returnValue = "";
    if (CMIErrorCode !== null && CMIErrorCode !== "") {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
      this.processListeners(callbackName);
    }
    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    return returnValue;
  }
  /**
   * Checks the LMS state and ensures it has been initialized.
   *
   * @param {boolean} checkTerminated
   * @param {number} beforeInitError
   * @param {number} afterTermError
   * @return {boolean}
   */
  checkState(checkTerminated, beforeInitError, afterTermError) {
    if (this.isNotInitialized()) {
      this.throwSCORMError("api", beforeInitError);
      return false;
    } else if (checkTerminated && this.isTerminated()) {
      this.throwSCORMError("api", afterTermError);
      return false;
    }
    return true;
  }
  /**
   * Returns the message that corresponds to errorNumber
   * APIs that inherit BaseAPI should override this function
   *
   * @param {(string|number)} _errorNumber
   * @param {boolean} _detail
   * @return {string}
   * @abstract
   */
  getLmsErrorMessageDetails(_errorNumber, _detail = false) {
    throw new Error("The getLmsErrorMessageDetails method has not been implemented");
  }
  /**
   * Gets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   *
   * @param {string} _CMIElement
   * @return {string}
   * @abstract
   */
  getCMIValue(_CMIElement) {
    throw new Error("The getCMIValue method has not been implemented");
  }
  /**
   * Sets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   *
   * @param {string} _CMIElement
   * @param {any} _value
   * @return {string}
   * @abstract
   */
  setCMIValue(_CMIElement, _value) {
    throw new Error("The setCMIValue method has not been implemented");
  }
  /**
   * Shared API method to set a valid for a given element.
   *
   * @param {string} methodName
   * @param {boolean} scorm2004
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  _commonSetCMIValue(methodName, scorm2004, CMIElement, value) {
    if (!CMIElement || CMIElement === "") {
      return global_constants.SCORM_FALSE;
    }
    this.lastErrorCode = "0";
    const structure = CMIElement.split(".");
    let refObject = this;
    let returnValue = global_constants.SCORM_FALSE;
    let foundFirstIndex = false;
    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004 ? this._error_codes.UNDEFINED_DATA_MODEL : this._error_codes.GENERAL;
    for (let idx = 0; idx < structure.length; idx++) {
      const attribute = structure[idx];
      if (idx === structure.length - 1) {
        if (scorm2004 && attribute && attribute.substring(0, 8) === "{target=") {
          if (this.isInitialized()) {
            this.throwSCORMError(CMIElement, this._error_codes.READ_ONLY_ELEMENT);
            break;
          } else {
            refObject = {
              ...refObject,
              attribute: value
            };
          }
        } else if (typeof attribute === "undefined" || !this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        } else {
          if (stringMatches(CMIElement, "\\.correct_responses\\.\\d+$") && this.isInitialized() && attribute !== "pattern") {
            this.validateCorrectResponse(CMIElement, value);
            if (this.lastErrorCode !== "0") {
              this.throwSCORMError(CMIElement, this._error_codes.TYPE_MISMATCH);
              break;
            }
          }
          if (!scorm2004 || this._errorHandlingService.lastErrorCode === "0") {
            if (typeof attribute === "undefined" || attribute === "__proto__" || attribute === "constructor") {
              this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
              break;
            }
            refObject[attribute] = value;
            returnValue = global_constants.SCORM_TRUE;
          }
        }
      } else {
        if (typeof attribute === "undefined" || !this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
        refObject = refObject[attribute];
        if (!refObject) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
        if (refObject instanceof CMIArray) {
          const index = parseInt(structure[idx + 1] || "0", 10);
          if (!isNaN(index)) {
            const item = refObject.childArray[index];
            if (item) {
              refObject = item;
              foundFirstIndex = true;
            } else {
              const newChild = this.getChildElement(CMIElement, value, foundFirstIndex);
              foundFirstIndex = true;
              if (!newChild) {
                if (this.lastErrorCode === "0") {
                  this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                }
                break;
              } else {
                if (refObject.initialized) newChild.initialize();
                refObject.childArray[index] = newChild;
                refObject = newChild;
              }
            }
            idx++;
          }
        }
      }
    }
    if (returnValue === global_constants.SCORM_FALSE) {
      this.apiLog(
        methodName,
        `There was an error setting the value for: ${CMIElement}, value of: ${value}`,
        LogLevelEnum.WARN
      );
    }
    return returnValue;
  }
  /**
   * Gets a value from the CMI Object
   *
   * @param {string} methodName
   * @param {boolean} scorm2004
   * @param {string} CMIElement
   * @return {any}
   */
  _commonGetCMIValue(methodName, scorm2004, CMIElement) {
    if (!CMIElement || CMIElement === "") {
      return "";
    }
    const structure = CMIElement.split(".");
    let refObject = this;
    let attribute = null;
    const uninitializedErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) has not been initialized.`;
    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004 ? this._error_codes.UNDEFINED_DATA_MODEL : this._error_codes.GENERAL;
    for (let idx = 0; idx < structure.length; idx++) {
      attribute = structure[idx];
      if (!scorm2004) {
        if (idx === structure.length - 1) {
          if (typeof attribute === "undefined" || !this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
            return;
          }
        }
      } else {
        if (String(attribute).substring(0, 8) === "{target=" && typeof refObject._isTargetValid == "function") {
          const target = String(attribute).substring(8, String(attribute).length - 9);
          return refObject._isTargetValid(target);
        } else if (typeof attribute === "undefined" || !this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          return;
        }
      }
      if (attribute !== void 0 && attribute !== null) {
        refObject = refObject[attribute];
        if (refObject === void 0) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
      } else {
        this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
        break;
      }
      if (refObject instanceof CMIArray) {
        const index = parseInt(structure[idx + 1] || "", 10);
        if (!isNaN(index)) {
          const item = refObject.childArray[index];
          if (item) {
            refObject = item;
          } else {
            this.throwSCORMError(
              CMIElement,
              this._error_codes.VALUE_NOT_INITIALIZED,
              uninitializedErrorMessage
            );
            break;
          }
          idx++;
        }
      }
    }
    if (refObject === null || refObject === void 0) {
      if (!scorm2004) {
        if (attribute === "_children") {
          this.throwSCORMError(CMIElement, this._error_codes.CHILDREN_ERROR, void 0);
        } else if (attribute === "_count") {
          this.throwSCORMError(CMIElement, this._error_codes.COUNT_ERROR, void 0);
        }
      }
    } else {
      return refObject;
    }
  }
  /**
   * Returns true if the API's current state is STATE_INITIALIZED
   *
   * @return {boolean}
   */
  isInitialized() {
    return this.currentState === global_constants.STATE_INITIALIZED;
  }
  /**
   * Returns true if the API's current state is STATE_NOT_INITIALIZED
   *
   * @return {boolean}
   */
  isNotInitialized() {
    return this.currentState === global_constants.STATE_NOT_INITIALIZED;
  }
  /**
   * Returns true if the API's current state is STATE_TERMINATED
   *
   * @return {boolean}
   */
  isTerminated() {
    return this.currentState === global_constants.STATE_TERMINATED;
  }
  /**
   * Provides a mechanism for attaching to a specific SCORM event.
   * This method allows you to register a callback function that will be executed
   * when the specified event occurs.
   *
   * @param {string} listenerName - The name of the event to listen for (e.g., "Initialize", "Terminate", "GetValue", "SetValue", "Commit")
   * @param {function} callback - The function to execute when the event occurs. The callback will receive relevant event data.
   * @example
   * // Listen for Initialize events
   * api.on("Initialize", function() {
   *   console.log("API has been initialized");
   * });
   *
   * // Listen for SetValue events
   * api.on("SetValue", function(element, value) {
   *   console.log("Setting " + element + " to " + value);
   * });
   */
  on(listenerName, callback) {
    this._eventService.on(listenerName, callback);
  }
  /**
   * Provides a mechanism for detaching a specific SCORM event listener.
   * This method removes a previously registered callback for an event.
   * Both the event name and the callback reference must match what was used in the 'on' method.
   *
   * @param {string} listenerName - The name of the event to stop listening for
   * @param {function} callback - The callback function to remove
   * @example
   * // Remove a specific listener
   * const myCallback = function() { console.log("API initialized"); };
   * api.on("Initialize", myCallback);
   * // Later, when you want to remove it:
   * api.off("Initialize", myCallback);
   */
  off(listenerName, callback) {
    this._eventService.off(listenerName, callback);
  }
  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event.
   * This method removes all callbacks registered for the specified event.
   *
   * @param {string} listenerName - The name of the event to clear all listeners for
   * @example
   * // Remove all listeners for the Initialize event
   * api.clear("Initialize");
   */
  clear(listenerName) {
    this._eventService.clear(listenerName);
  }
  /**
   * Processes any 'on' listeners that have been created for a specific event.
   * This method is called internally when SCORM events occur to notify all registered listeners.
   * It triggers all callback functions registered for the specified event.
   *
   * @param {string} functionName - The name of the function/event that occurred
   * @param {string} CMIElement - Optional CMI element involved in the event
   * @param {any} value - Optional value associated with the event
   */
  processListeners(functionName, CMIElement, value) {
    this._eventService.processListeners(functionName, CMIElement, value);
  }
  /**
   * Throws a SCORM error with the specified error number and optional message.
   * This method sets the last error code and can be used to indicate that an operation failed.
   * The error number should correspond to one of the standard SCORM error codes.
   *
   * @param {string} CMIElement
   * @param {number} errorNumber - The SCORM error code to set
   * @param {string} message - Optional custom error message to provide additional context
   * @example
   * // Throw a "not initialized" error
   * this.throwSCORMError(301, "The API must be initialized before calling GetValue");
   */
  throwSCORMError(CMIElement, errorNumber, message) {
    this._errorHandlingService.throwSCORMError(CMIElement, errorNumber ?? 0, message);
  }
  /**
   * Clears the last SCORM error code when an operation succeeds.
   * This method is typically called after successful API operations to reset the error state.
   * It only clears the error if the success parameter is "true".
   *
   * @param {string} success - A string indicating whether the operation succeeded ("true" or "false")
   * @example
   * // Clear error after successful operation
   * this.clearSCORMError("true");
   */
  clearSCORMError(success) {
    this._errorHandlingService.clearSCORMError(success);
  }
  /**
   * Load the CMI from a flattened JSON object.
   * This method populates the CMI data model from a flattened JSON structure
   * where keys represent CMI element paths (e.g., "cmi.core.student_id").
   *
   * @param {StringKeyMap} json - The flattened JSON object containing CMI data
   * @param {string} CMIElement - Optional base CMI element path to prepend to all keys
   * @example
   * // Load data from a flattened JSON structure
   * api.loadFromFlattenedJSON({
   *   "cmi.core.student_id": "12345",
   *   "cmi.core.student_name": "John Doe",
   *   "cmi.core.lesson_status": "incomplete"
   * });
   */
  loadFromFlattenedJSON(json, CMIElement) {
    if (!CMIElement) {
      CMIElement = "";
    }
    this._serializationService.loadFromFlattenedJSON(
      json,
      CMIElement,
      (CMIElement2, value) => this.setCMIValue(CMIElement2, value),
      () => this.isNotInitialized(),
      (data) => {
        this.startingData = data;
      }
    );
  }
  /**
   * Returns a flattened JSON object representing the current CMI data.
   */
  getFlattenedCMI() {
    return flatten(this.renderCMIToJSONObject());
  }
  /**
   * Loads CMI data from a hierarchical JSON object.
   * This method populates the CMI data model from a nested JSON structure
   * that mirrors the CMI object hierarchy.
   *
   * @param {StringKeyMap} json - The hierarchical JSON object containing CMI data
   * @param {string} CMIElement - Optional base CMI element path to prepend to all keys
   * @example
   * // Load data from a hierarchical JSON structure
   * api.loadFromJSON({
   *   core: {
   *     student_id: "12345",
   *     student_name: "John Doe",
   *     lesson_status: "incomplete"
   *   },
   *   objectives: [
   *     { id: "obj1", score: { raw: 85 } }
   *   ]
   * });
   */
  loadFromJSON(json, CMIElement = "") {
    if ((!CMIElement || CMIElement === "") && !Object.hasOwnProperty.call(json, "cmi") && !Object.hasOwnProperty.call(json, "adl")) {
      CMIElement = "cmi";
    }
    this._serializationService.loadFromJSON(
      json,
      CMIElement,
      (CMIElement2, value) => this.setCMIValue(CMIElement2, value),
      () => this.isNotInitialized(),
      (data) => {
        this.startingData = data;
      }
    );
  }
  /**
   * Render the CMI object to a JSON string for sending to an LMS.
   * This method serializes the current CMI data model to a JSON string.
   * The output format is controlled by the sendFullCommit setting.
   *
   * @return {string} A JSON string representation of the CMI data
   * @example
   * // Get the current CMI data as a JSON string
   * const jsonString = api.renderCMIToJSONString();
   * console.log(jsonString); // '{"core":{"student_id":"12345",...}}'
   */
  renderCMIToJSONString() {
    return this._serializationService.renderCMIToJSONString(this.cmi, this.settings.sendFullCommit);
  }
  /**
   * Returns a JavaScript object representing the current CMI data.
   * This method creates a plain JavaScript object that mirrors the
   * structure of the CMI data model, suitable for further processing.
   *
   * @return {StringKeyMap} A JavaScript object representing the CMI data
   * @example
   * // Get the current CMI data as a JavaScript object
   * const cmiObject = api.renderCMIToJSONObject();
   * console.log(cmiObject.core.student_id); // "12345"
   */
  renderCMIToJSONObject() {
    return this._serializationService.renderCMIToJSONObject(this.cmi, this.settings.sendFullCommit);
  }
  /**
   * Process an HTTP request
   *
   * @param {string} url - The URL to send the request to
   * @param {CommitObject | StringKeyMap | Array<any>} params - The parameters to send
   * @param {boolean} immediate - Whether to send the request immediately without waiting
   * @returns {Promise<ResultObject>} - The result of the request
   * @async
   */
  async processHttpRequest(url, params, immediate = false) {
    if (this.settings.enableOfflineSupport && this._offlineStorageService && !this._offlineStorageService.isDeviceOnline() && this._courseId) {
      this.apiLog(
        "processHttpRequest",
        "Device is offline, storing data locally",
        LogLevelEnum.INFO
      );
      if (params && typeof params === "object" && "cmi" in params) {
        return await this._offlineStorageService.storeOffline(
          this._courseId,
          params
        );
      } else {
        this.apiLog(
          "processHttpRequest",
          "Invalid commit data format for offline storage",
          LogLevelEnum.ERROR
        );
        return {
          result: global_constants.SCORM_FALSE,
          errorCode: this._error_codes.GENERAL ?? 101
          // Fallback to a default error code if GENERAL is undefined
        };
      }
    }
    return await this._httpService.processHttpRequest(
      url,
      params,
      immediate,
      (functionName, message, level, element) => this.apiLog(functionName, message, level, element),
      (functionName, CMIElement, value) => this.processListeners(functionName, CMIElement, value)
    );
  }
  /**
   * Schedules a commit operation to occur after a specified delay.
   * This method is used to implement auto-commit functionality, where data
   * is periodically sent to the LMS without requiring explicit commit calls.
   *
   * @param {number} when - The number of milliseconds to wait before committing
   * @param {string} callback - The name of the commit event callback
   * @example
   * // Schedule a commit to happen in 60 seconds
   * api.scheduleCommit(60000, "commit");
   */
  scheduleCommit(when, callback) {
    if (!this._timeout) {
      this._timeout = new ScheduledCommit(this, when, callback);
      this.apiLog("scheduleCommit", "scheduled", LogLevelEnum.DEBUG, "");
    }
  }
  /**
   * Clears and cancels any currently scheduled commits.
   * This method is typically called when an explicit commit is performed
   * or when the API is terminated, to prevent redundant commits.
   *
   * @example
   * // Cancel any pending scheduled commits
   * api.clearScheduledCommit();
   */
  clearScheduledCommit() {
    if (this._timeout) {
      this._timeout.cancel();
      this._timeout = void 0;
      this.apiLog("clearScheduledCommit", "cleared", LogLevelEnum.DEBUG, "");
    }
  }
  /**
   * Checks if an object has a specific property, using multiple detection methods.
   * This method performs a thorough check for property existence by:
   * 1. Checking if it's an own property using Object.hasOwnProperty
   * 2. Checking if it's defined in the prototype with a property descriptor
   * 3. Checking if it's accessible via the 'in' operator (includes inherited properties)
   *
   * @param {StringKeyMap} StringKeyMap - The object to check for the property
   * @param {string} attribute - The property name to look for
   * @return {boolean} True if the property exists on the object or its prototype chain
   * @private
   *
   * @example
   * // Check for an own property
   * const obj = { name: "John" };
   * this._checkObjectHasProperty(obj, "name"); // Returns true
   *
   * @example
   * // Check for an inherited property
   * class Parent { get type() { return "parent"; } }
   * const child = Object.create(new Parent());
   * this._checkObjectHasProperty(child, "type"); // Returns true
   *
   * @example
   * // Check for a non-existent property
   * const obj = { name: "John" };
   * this._checkObjectHasProperty(obj, "age"); // Returns false
   */
  _checkObjectHasProperty(StringKeyMap2, attribute) {
    return Object.hasOwnProperty.call(StringKeyMap2, attribute) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(StringKeyMap2), attribute) != null || attribute in StringKeyMap2;
  }
  /**
   * Handles exceptions that occur when accessing CMI values.
   * This method delegates to the ErrorHandlingService to process exceptions
   * that occur during CMI data operations, ensuring consistent error handling
   * throughout the API.
   *
   * @param {string} CMIElement
   * @param {any} e - The exception that was thrown
   * @param {string} returnValue - The default return value to use if an error occurs
   * @return {string} Either the original returnValue or SCORM_FALSE if an error occurred
   * @private
   *
   * @example
   * // Handle a validation error when getting a CMI value
   * try {
   *   return this.getCMIValue("cmi.core.score.raw");
   * } catch (e) {
   *   return this.handleValueAccessException(e, "");
   * }
   *
   * @example
   * // Handle a general error when setting a CMI value
   * try {
   *   this.setCMIValue("cmi.core.lesson_status", "completed");
   *   return "true";
   * } catch (e) {
   *   return this.handleValueAccessException(e, "false");
   * }
   */
  handleValueAccessException(CMIElement, e, returnValue) {
    if (e instanceof ValidationError) {
      this.lastErrorCode = String(e.errorCode);
      returnValue = global_constants.SCORM_FALSE;
      this.throwSCORMError(CMIElement, e.errorCode, e.errorMessage);
    } else {
      if (e instanceof Error && e.message) {
        this.throwSCORMError(CMIElement, this._error_codes.GENERAL, e.message);
      } else {
        this.throwSCORMError(CMIElement, this._error_codes.GENERAL, "Unknown error");
      }
    }
    return returnValue;
  }
  /**
   * Builds the commit object to be sent to the LMS.
   * This method delegates to the SerializationService to create a properly
   * formatted object containing the CMI data that needs to be sent to the LMS.
   * The format and content of the commit object depend on whether this is a
   * regular commit or a termination commit.
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @return {CommitObject|StringKeyMap|Array} The formatted commit object
   * @protected
   *
   * @example
   * // Create a regular commit object
   * const regularCommit = this.getCommitObject(false);
   * // Result might be: { cmi: { core: { lesson_status: "incomplete" } } }
   *
   * @example
   * // Create a termination commit object (includes total_time)
   * const terminationCommit = this.getCommitObject(true);
   * // Result might be: { cmi: { core: { lesson_status: "completed", total_time: "PT1H30M" } } }
   */
  getCommitObject(terminateCommit) {
    return this._serializationService.getCommitObject(
      terminateCommit,
      this.settings.alwaysSendTotalTime,
      this.settings.renderCommonCommitFields,
      (terminateCommit2, includeTotalTime) => this.renderCommitObject(terminateCommit2, includeTotalTime),
      (terminateCommit2, includeTotalTime) => this.renderCommitCMI(terminateCommit2, includeTotalTime),
      this.settings.logLevel
    );
  }
}

class Scorm12API extends BaseAPI {
  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   */
  constructor(settings) {
    if (settings) {
      if (settings.mastery_override === void 0) {
        settings.mastery_override = false;
      }
    }
    super(scorm12_errors$1, settings);
    this.statusSetByModule = false;
    this.cmi = new CMI();
    this.nav = new NAV();
    this.LMSInitialize = this.lmsInitialize;
    this.LMSFinish = this.lmsFinish;
    this.LMSGetValue = this.lmsGetValue;
    this.LMSSetValue = this.lmsSetValue;
    this.LMSCommit = this.lmsCommit;
    this.LMSGetLastError = this.lmsGetLastError;
    this.LMSGetErrorString = this.lmsGetErrorString;
    this.LMSGetDiagnostic = this.lmsGetDiagnostic;
  }
  /**
   * Called when the API needs to be reset
   */
  reset(settings) {
    this.commonReset(settings);
    this.cmi?.reset();
    this.nav?.reset();
  }
  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsInitialize() {
    this.cmi.initialize();
    if (this.cmi.core.lesson_status) {
      this.statusSetByModule = true;
    } else {
      this.cmi.core.lesson_status = "not attempted";
    }
    return this.initialize(
      "LMSInitialize",
      "LMS was already initialized!",
      "LMS is already finished!"
    );
  }
  /**
   * LMSFinish function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsFinish() {
    (async () => {
      await this.internalFinish();
    })();
    return global_constants.SCORM_TRUE;
  }
  async internalFinish() {
    const result = await this.terminate("LMSFinish", true);
    if (result === global_constants.SCORM_TRUE) {
      if (this.nav.event !== "") {
        if (this.nav.event === "continue") {
          this.processListeners("SequenceNext");
        } else {
          this.processListeners("SequencePrevious");
        }
      } else if (this.settings.autoProgress) {
        this.processListeners("SequenceNext");
      }
    }
    return result;
  }
  /**
   * LMSGetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement) {
    return this.getValue("LMSGetValue", false, CMIElement);
  }
  /**
   * LMSSetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  lmsSetValue(CMIElement, value) {
    if (CMIElement === "cmi.core.lesson_status") {
      this.statusSetByModule = true;
    }
    return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
  }
  /**
   * LMSCommit function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsCommit() {
    if (this.settings.asyncCommit) {
      this.scheduleCommit(500, "LMSCommit");
    } else {
      (async () => {
        await this.commit("LMSCommit", false);
      })();
    }
    return global_constants.SCORM_TRUE;
  }
  /**
   * LMSGetLastError function from SCORM 1.2 Spec
   *
   * @return {string}
   */
  lmsGetLastError() {
    return this.getLastError("LMSGetLastError");
  }
  /**
   * LMSGetErrorString function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode) {
    return this.getErrorString("LMSGetErrorString", CMIErrorCode);
  }
  /**
   * LMSGetDiagnostic function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode) {
    return this.getDiagnostic("LMSGetDiagnostic", CMIErrorCode);
  }
  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  setCMIValue(CMIElement, value) {
    return this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
  }
  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement) {
    return this._commonGetCMIValue("getCMIValue", false, CMIElement);
  }
  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {*} _value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI|null}
   */
  getChildElement(CMIElement, _value, foundFirstIndex) {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    } else if (foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
      return new CMIInteractionsCorrectResponsesObject();
    } else if (foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
      return new CMIInteractionsObjectivesObject();
    } else if (!foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
      return new CMIInteractionsObject();
    }
    return null;
  }
  /**
   * Validates Correct Response values
   *
   * @param {string} _CMIElement
   * @param {*} _value
   */
  validateCorrectResponse(_CMIElement, _value) {
  }
  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {number|string} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  getLmsErrorMessageDetails(errorNumber, detail) {
    let basicMessage = "No Error";
    let detailMessage = "No Error";
    errorNumber = String(errorNumber);
    if (scorm12_constants.error_descriptions[errorNumber]) {
      basicMessage = scorm12_constants.error_descriptions[errorNumber]?.basicMessage || basicMessage;
      detailMessage = scorm12_constants.error_descriptions[errorNumber]?.detailMessage || detailMessage;
    }
    return detail ? detailMessage : basicMessage;
  }
  /**
   * Replace the whole API with another
   *
   * @param {Scorm12API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI) {
    this.cmi = newAPI.cmi;
  }
  /**
   * Render the cmi object to the proper format for LMS commit
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {object|Array}
   */
  renderCommitCMI(terminateCommit, includeTotalTime = false) {
    const cmiExport = this.renderCMIToJSONObject();
    if (terminateCommit || includeTotalTime) {
      cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
    }
    const result = [];
    const flattened = flatten(cmiExport);
    switch (this.settings.dataCommitFormat) {
      case "flattened":
        return flatten(cmiExport);
      case "params":
        for (const item in flattened) {
          if ({}.hasOwnProperty.call(flattened, item)) {
            result.push(`${item}=${flattened[item]}`);
          }
        }
        return result;
      case "json":
      default:
        return cmiExport;
    }
  }
  /**
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit, includeTotalTime = false) {
    const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
    const calculateTotalTime = terminateCommit || includeTotalTime;
    const totalTimeHHMMSS = calculateTotalTime ? this.cmi.getCurrentTotalTime() : "";
    const totalTimeSeconds = getTimeAsSeconds(totalTimeHHMMSS, scorm12_regex.CMITimespan);
    const lessonStatus = this.cmi.core.lesson_status;
    let completionStatus = CompletionStatus.UNKNOWN;
    let successStatus = SuccessStatus.UNKNOWN;
    if (lessonStatus) {
      completionStatus = lessonStatus === "completed" || lessonStatus === "passed" ? CompletionStatus.COMPLETED : CompletionStatus.INCOMPLETE;
      if (lessonStatus === "passed") {
        successStatus = SuccessStatus.PASSED;
      } else if (lessonStatus === "failed") {
        successStatus = SuccessStatus.FAILED;
      }
    }
    const scoreObject = this.cmi?.core?.score?.getScoreObject() || {};
    const commitObject = {
      successStatus,
      completionStatus,
      runtimeData: cmiExport,
      totalTimeSeconds
    };
    if (scoreObject) {
      commitObject.score = scoreObject;
    }
    return commitObject;
  }
  /**
   * Attempts to store the data to the LMS
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  async storeData(terminateCommit) {
    if (terminateCommit) {
      const originalStatus = this.cmi.core.lesson_status;
      if (!this.cmi.core.lesson_status || !this.statusSetByModule && this.cmi.core.lesson_status === "not attempted") {
        this.cmi.core.lesson_status = "completed";
      }
      if (this.cmi.core.lesson_mode === "normal") {
        if (this.cmi.core.credit === "credit") {
          if (this.settings.mastery_override && this.cmi.student_data.mastery_score !== "" && this.cmi.core.score.raw !== "") {
            this.cmi.core.lesson_status = parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score) ? "passed" : "failed";
          }
        }
      } else if (this.cmi.core.lesson_mode === "browse") {
        if ((this.startingData?.cmi?.core?.lesson_status || "") === "" && originalStatus === "not attempted") {
          this.cmi.core.lesson_status = "browsed";
        }
      }
    }
    const commitObject = this.getCommitObject(terminateCommit);
    if (typeof this.settings.lmsCommitUrl === "string") {
      return await this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit
      );
    } else {
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0
      };
    }
  }
}

export { Scorm12API };
