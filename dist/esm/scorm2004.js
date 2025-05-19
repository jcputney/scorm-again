const global_constants = {
  SCORM_TRUE: "true",
  SCORM_FALSE: "false",
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2
};
const scorm12_constants = {
  score_children: "raw,min,max",
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
const scorm2004_constants = {
  // Children lists
  cmi_children: "_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time",
  comments_children: "comment,timestamp,location",
  score_children: "max,raw,scaled,min",
  objectives_children: "progress_measure,completion_status,success_status,description,score,id",
  correct_responses_children: "pattern",
  student_preference_children: "audio_level,audio_captioning,delivery_speed,language",
  interactions_children: "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
  adl_data_children: "id,store",
  error_descriptions: {
    "0": {
      basicMessage: "No Error",
      detailMessage: "No error occurred, the previous API call was successful."
    },
    "101": {
      basicMessage: "General Exception",
      detailMessage: "No specific error code exists to describe the error."
    },
    "102": {
      basicMessage: "General Initialization Failure",
      detailMessage: "Call to Initialize failed for an unknown reason."
    },
    "103": {
      basicMessage: "Already Initialized",
      detailMessage: "Call to Initialize failed because Initialize was already called."
    },
    "104": {
      basicMessage: "Content Instance Terminated",
      detailMessage: "Call to Initialize failed because Terminate was already called."
    },
    "111": {
      basicMessage: "General Termination Failure",
      detailMessage: "Call to Terminate failed for an unknown reason."
    },
    "112": {
      basicMessage: "Termination Before Initialization",
      detailMessage: "Call to Terminate failed because it was made before the call to Initialize."
    },
    "113": {
      basicMessage: "Termination After Termination",
      detailMessage: "Call to Terminate failed because Terminate was already called."
    },
    "122": {
      basicMessage: "Retrieve Data Before Initialization",
      detailMessage: "Call to GetValue failed because it was made before the call to Initialize."
    },
    "123": {
      basicMessage: "Retrieve Data After Termination",
      detailMessage: "Call to GetValue failed because it was made after the call to Terminate."
    },
    "132": {
      basicMessage: "Store Data Before Initialization",
      detailMessage: "Call to SetValue failed because it was made before the call to Initialize."
    },
    "133": {
      basicMessage: "Store Data After Termination",
      detailMessage: "Call to SetValue failed because it was made after the call to Terminate."
    },
    "142": {
      basicMessage: "Commit Before Initialization",
      detailMessage: "Call to Commit failed because it was made before the call to Initialize."
    },
    "143": {
      basicMessage: "Commit After Termination",
      detailMessage: "Call to Commit failed because it was made after the call to Terminate."
    },
    "201": {
      basicMessage: "General Argument Error",
      detailMessage: "An invalid argument was passed to an API method (usually indicates that Initialize, Commit or Terminate did not receive the expected empty string argument."
    },
    "301": {
      basicMessage: "General Get Failure",
      detailMessage: "Indicates a failed GetValue call where no other specific error code is applicable. Use GetDiagnostic for more information."
    },
    "351": {
      basicMessage: "General Set Failure",
      detailMessage: "Indicates a failed SetValue call where no other specific error code is applicable. Use GetDiagnostic for more information."
    },
    "391": {
      basicMessage: "General Commit Failure",
      detailMessage: "Indicates a failed Commit call where no other specific error code is applicable. Use GetDiagnostic for more information."
    },
    "401": {
      basicMessage: "Undefined Data Model Element",
      detailMessage: "The data model element name passed to GetValue or SetValue is not a valid SCORM data model element."
    },
    "402": {
      basicMessage: "Unimplemented Data Model Element",
      detailMessage: "The data model element indicated in a call to GetValue or SetValue is valid, but was not implemented by this LMS. In SCORM 2004, this error would indicate an LMS that is not fully SCORM conformant."
    },
    "403": {
      basicMessage: "Data Model Element Value Not Initialized",
      detailMessage: "Attempt to read a data model element that has not been initialized by the LMS or through a SetValue call. This error condition is often reached during normal execution of a SCO."
    },
    "404": {
      basicMessage: "Data Model Element Is Read Only",
      detailMessage: "SetValue was called with a data model element that can only be read."
    },
    "405": {
      basicMessage: "Data Model Element Is Write Only",
      detailMessage: "GetValue was called on a data model element that can only be written to."
    },
    "406": {
      basicMessage: "Data Model Element Type Mismatch",
      detailMessage: "SetValue was called with a value that is not consistent with the data format of the supplied data model element."
    },
    "407": {
      basicMessage: "Data Model Element Value Out Of Range",
      detailMessage: "The numeric value supplied to a SetValue call is outside of the numeric range allowed for the supplied data model element."
    },
    "408": {
      basicMessage: "Data Model Dependency Not Established",
      detailMessage: "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element."
    }
  }
};

const SECONDS_PER_SECOND = 1;
const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
const designations = {
  D: SECONDS_PER_DAY,
  H: SECONDS_PER_HOUR,
  M: SECONDS_PER_MINUTE,
  S: SECONDS_PER_SECOND
};
const getSecondsAsISODuration = memoize((seconds) => {
  if (!seconds || seconds <= 0) {
    return "PT0S";
  }
  let duration = "P";
  let remainder = seconds;
  const designationEntries = Object.entries(designations);
  designationEntries.forEach(([designationsKey, current_seconds]) => {
    let value = Math.floor(remainder / current_seconds);
    remainder = remainder % current_seconds;
    if (countDecimals(remainder) > 2) {
      remainder = Number(Number(remainder).toFixed(2));
    }
    if (designationsKey === "S" && remainder > 0) {
      value += remainder;
    }
    if (value) {
      const needsTimeSeparator = (duration.indexOf("D") > 0 || ["H", "M", "S"].includes(designationsKey)) && duration.indexOf("T") === -1;
      if (needsTimeSeparator) {
        duration += "T";
      }
      duration += `${value}${designationsKey}`;
    }
  });
  return duration;
});
const getDurationAsSeconds = memoize(
  (duration, durationRegex) => {
    if (typeof durationRegex === "string") {
      durationRegex = new RegExp(durationRegex);
    }
    if (!duration || !duration?.match?.(durationRegex)) {
      return 0;
    }
    const [, years, _, , days, hours, minutes, seconds] = new RegExp(durationRegex).exec?.(duration) ?? [];
    let result = 0;
    result += Number(seconds) || 0;
    result += Number(minutes) * 60 || 0;
    result += Number(hours) * 3600 || 0;
    result += Number(days) * (60 * 60 * 24) || 0;
    result += Number(years) * (60 * 60 * 24 * 365) || 0;
    return result;
  },
  // Custom key function to handle RegExp objects which can't be stringified
  (duration, durationRegex) => {
    const durationStr = duration ?? "";
    const regexStr = typeof durationRegex === "string" ? durationRegex : durationRegex?.toString() ?? "";
    return `${durationStr}:${regexStr}`;
  }
);
function addTwoDurations(first, second, durationRegex) {
  const regex = new RegExp(durationRegex) ;
  return getSecondsAsISODuration(
    getDurationAsSeconds(first, regex) + getDurationAsSeconds(second, regex)
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
        prop = m[2] || m[1];
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

const NAVBoolean = {
  UNKNOWN: "unknown",
  TRUE: "true",
  FALSE: "false"
};
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
      errorCode: this.error_codes.GENERAL
    };
    if (immediate) {
      return this._handleImmediateRequest(url, params, processListeners);
    }
    try {
      const processedParams = this.settings.requestHandler(params);
      const response = await this.performFetch(url, processedParams);
      return this.transformResponse(response, processListeners);
    } catch (e) {
      apiLog("processHttpRequest", e, LogLevelEnum.ERROR);
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
  _handleImmediateRequest(url, params, processListeners) {
    if (this.settings.useBeaconInsteadOfFetch !== "never") {
      const { body, contentType } = this._prepareRequestBody(params);
      navigator.sendBeacon(url, new Blob([body], { type: contentType }));
    } else {
      this.performFetch(url, params).then(async (response) => {
        await this.transformResponse(response, processListeners);
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
    return response.status >= 200 && response.status <= 299 && (result.result === "true" || result.result === global_constants.SCORM_TRUE);
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
    return { functionName, CMIElement };
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
            field: intMatch[3]
          });
          continue;
        }
        const objMatch = key.match(obj_pattern);
        if (objMatch) {
          objectives.push({
            key,
            value: json[key],
            index: Number(objMatch[2]),
            field: objMatch[3]
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
      this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, `${errorType}: ${e.message}`);
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
        errorCode: this.error_codes.GENERAL
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
        errorCode: this.error_codes.GENERAL
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
        errorCode: this.error_codes.GENERAL
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
  INVALID_SET_VALUE: 402,
  READ_ONLY_ELEMENT: 403,
  TYPE_MISMATCH: 405,
  VALUE_OUT_OF_RANGE: 407};
const scorm2004_errors$1 = {
  ...global_errors,
  INITIALIZATION_FAILED: 102,
  INITIALIZED: 103,
  TERMINATED: 104,
  TERMINATION_FAILURE: 111,
  TERMINATION_BEFORE_INIT: 112,
  MULTIPLE_TERMINATIONS: 113,
  RETRIEVE_BEFORE_INIT: 122,
  RETRIEVE_AFTER_TERM: 123,
  STORE_BEFORE_INIT: 132,
  STORE_AFTER_TERM: 133,
  COMMIT_BEFORE_INIT: 142,
  COMMIT_AFTER_TERM: 143,
  ARGUMENT_ERROR: 201,
  GENERAL_GET_FAILURE: 301,
  GENERAL_SET_FAILURE: 351,
  GENERAL_COMMIT_FAILURE: 391,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 402,
  VALUE_NOT_INITIALIZED: 403,
  READ_ONLY_ELEMENT: 404,
  WRITE_ONLY_ELEMENT: 405,
  TYPE_MISMATCH: 406,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
};

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
      this._error_codes.TERMINATION_BEFORE_INIT,
      this._error_codes.MULTIPLE_TERMINATION
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
        this.throwSCORMError("api", result.errorCode);
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
      this._error_codes.RETRIEVE_BEFORE_INIT,
      this._error_codes.RETRIEVE_AFTER_TERM
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
      this._error_codes.STORE_BEFORE_INIT,
      this._error_codes.STORE_AFTER_TERM
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
      this._error_codes.COMMIT_BEFORE_INIT,
      this._error_codes.COMMIT_AFTER_TERM
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
        if (scorm2004 && attribute.substring(0, 8) === "{target=") {
          if (this.isInitialized()) {
            this.throwSCORMError(CMIElement, this._error_codes.READ_ONLY_ELEMENT);
            break;
          } else {
            refObject = {
              ...refObject,
              attribute: value
            };
          }
        } else if (!this._checkObjectHasProperty(refObject, attribute)) {
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
            if (attribute === "__proto__" || attribute === "constructor") {
              this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
              break;
            }
            refObject[attribute] = value;
            returnValue = global_constants.SCORM_TRUE;
          }
        }
      } else {
        refObject = refObject[attribute];
        if (!refObject) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
        if (refObject instanceof CMIArray) {
          const index = parseInt(structure[idx + 1], 10);
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
          if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
            return;
          }
        }
      } else {
        if (String(attribute).substring(0, 8) === "{target=" && typeof refObject._isTargetValid == "function") {
          const target = String(attribute).substring(8, String(attribute).length - 9);
          return refObject._isTargetValid(target);
        } else if (!this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          return;
        }
      }
      refObject = refObject[attribute];
      if (refObject === void 0) {
        this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
        break;
      }
      if (refObject instanceof CMIArray) {
        const index = parseInt(structure[idx + 1], 10);
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
    this._errorHandlingService.throwSCORMError(CMIElement, errorNumber, message);
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
          errorCode: this._error_codes.GENERAL
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

const scorm2004_errors = scorm2004_constants.error_descriptions;
class Scorm2004ValidationError extends ValidationError {
  /**
   * Constructor to take in an error code
   * @param {string} CMIElement
   * @param {number} errorCode
   */
  constructor(CMIElement, errorCode) {
    if ({}.hasOwnProperty.call(scorm2004_errors, String(errorCode))) {
      super(
        CMIElement,
        errorCode,
        scorm2004_errors[String(errorCode)].basicMessage,
        scorm2004_errors[String(errorCode)].detailMessage
      );
    } else {
      super(
        CMIElement,
        101,
        scorm2004_errors["101"].basicMessage,
        scorm2004_errors["101"].detailMessage
      );
    }
    Object.setPrototypeOf(this, Scorm2004ValidationError.prototype);
  }
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
    if (value >= ranges[0]) {
      if (ranges[1] === "*" || value <= ranges[1]) {
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

function check2004ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
  return checkValidFormat(
    CMIElement,
    value,
    regexPattern,
    scorm2004_errors$1.TYPE_MISMATCH,
    Scorm2004ValidationError,
    allowEmptyString
  );
}
function check2004ValidRange(CMIElement, value, rangePattern) {
  return checkValidRange(
    CMIElement,
    value,
    rangePattern,
    scorm2004_errors$1.VALUE_OUT_OF_RANGE,
    Scorm2004ValidationError
  );
}

const scorm12_regex = {
  CMIString256: "^.{0,255}$",
  CMISInteger: "^-?([0-9]+)$",
  CMIDecimal: "^-?([0-9]{0,3})(\\.[0-9]*)?$",
  // Data ranges
  score_range: "0#100",
  audio_range: "-1#100",
  speed_range: "-100#100",
  text_range: "-1#1"
};
const scorm2004_regex = {
  CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
  CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
  CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
  CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
  CMILang: "^([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?$|^$",
  CMILangString250: "^({lang=([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,250}$)?$",
  CMILangcr: "^(({lang=([a-zA-Z]{2,3}|i|x)?(-[a-zA-Z0-9-]{2,8})?}))(.*?)$",
  CMILangString250cr: "^(({lang=([a-zA-Z]{2,3}|i|x)?(-[a-zA-Z0-9-]{2,8})?})?(.{0,250})?)?$",
  CMILangString4000: "^({lang=([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,4000}$)?$",
  CMITime: "^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,6})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$",
  CMITimespan: "^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:([.,\\d]+)S)?)?$",
  CMISInteger: "^-?([0-9]+)$",
  CMIDecimal: "^-?([0-9]{1,5})(\\.[0-9]{1,18})?$",
  CMIShortIdentifier: "^[\\w\\.\\-\\_]{1,250}$",
  CMILongIdentifier: "^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$",
  // need to re-examine this
  CMIFeedback: "^.*$",
  // Vocabulary Data Type Definition
  CMICStatus: "^(completed|incomplete|not attempted|unknown)$",
  CMISStatus: "^(passed|failed|unknown)$",
  CMIExit: "^(time-out|suspend|logout|normal)$",
  CMIType: "^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$",
  CMIResult: "^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$",
  NAVEvent: "^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|_none_|(\\{target=(?<choice_target>\\S{0,}[a-zA-Z0-9-_]+)})?choice|(\\{target=(?<jump_target>\\S{0,}[a-zA-Z0-9-_]+)})?jump)$",
  NAVBoolean: "^(unknown|true|false)$",
  NAVTarget: "^{target=\\S{0,}[a-zA-Z0-9-_]+}$",
  // Data ranges
  scaled_range: "-1#1",
  audio_range: "0#999.9999999",
  speed_range: "0#999.9999999",
  text_range: "-1#1",
  progress_range: "0#1"
};

class CMILearnerPreference extends BaseCMI {
  /**
   * Constructor for cmi.learner_preference
   */
  constructor() {
    super("cmi.learner_preference");
    this.__children = scorm2004_constants.student_preference_children;
    this._audio_level = "1";
    this._language = "";
    this._delivery_speed = "1";
    this._audio_captioning = "0";
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
    throw new Scorm2004ValidationError(
      this._cmi_element + "._children",
      scorm2004_errors$1.READ_ONLY_ELEMENT
    );
  }
  /**
   * Getter for _audio_level
   * @return {string}
   */
  get audio_level() {
    return this._audio_level;
  }
  /**
   * Setter for _audio_level
   * @param {string} audio_level
   */
  set audio_level(audio_level) {
    if (check2004ValidFormat(
      this._cmi_element + ".audio_level",
      audio_level,
      scorm2004_regex.CMIDecimal
    ) && check2004ValidRange(
      this._cmi_element + ".audio_level",
      audio_level,
      scorm2004_regex.audio_range
    )) {
      this._audio_level = audio_level;
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
    if (check2004ValidFormat(this._cmi_element + ".language", language, scorm2004_regex.CMILang)) {
      this._language = language;
    }
  }
  /**
   * Getter for _delivery_speed
   * @return {string}
   */
  get delivery_speed() {
    return this._delivery_speed;
  }
  /**
   * Setter for _delivery_speed
   * @param {string} delivery_speed
   */
  set delivery_speed(delivery_speed) {
    if (check2004ValidFormat(
      this._cmi_element + ".delivery_speed",
      delivery_speed,
      scorm2004_regex.CMIDecimal
    ) && check2004ValidRange(
      this._cmi_element + ".delivery_speed",
      delivery_speed,
      scorm2004_regex.speed_range
    )) {
      this._delivery_speed = delivery_speed;
    }
  }
  /**
   * Getter for _audio_captioning
   * @return {string}
   */
  get audio_captioning() {
    return this._audio_captioning;
  }
  /**
   * Setter for _audio_captioning
   * @param {string} audio_captioning
   */
  set audio_captioning(audio_captioning) {
    if (check2004ValidFormat(
      this._cmi_element + ".audio_captioning",
      audio_captioning,
      scorm2004_regex.CMISInteger
    ) && check2004ValidRange(
      this._cmi_element + ".audio_captioning",
      audio_captioning,
      scorm2004_regex.text_range
    )) {
      this._audio_captioning = audio_captioning;
    }
  }
  /**
   * toJSON for cmi.learner_preference
   *
   * @return {
   *    {
   *      audio_level: string,
   *      language: string,
   *      delivery_speed: string,
   *      audio_captioning: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      audio_level: this.audio_level,
      language: this.language,
      delivery_speed: this.delivery_speed,
      audio_captioning: this.audio_captioning
    };
    this.jsonString = false;
    return result;
  }
}

const LearnerResponses = {
  "true-false": {
    format: "^true$|^false$",
    max: 1,
    delimiter: "",
    unique: false
  },
  choice: {
    format: scorm2004_regex.CMILongIdentifier,
    max: 36,
    delimiter: "[,]",
    unique: true
  },
  "fill-in": {
    format: scorm2004_regex.CMILangString250,
    max: 10,
    delimiter: "[,]",
    unique: false
  },
  "long-fill-in": {
    format: scorm2004_regex.CMILangString4000,
    max: 1,
    delimiter: "",
    unique: false
  },
  matching: {
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false
  },
  performance: {
    format: "^$|" + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + "|^$|" + scorm2004_regex.CMIShortIdentifier,
    max: 250,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false
  },
  sequencing: {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: "[,]",
    unique: false
  },
  likert: {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 1,
    delimiter: "",
    unique: false
  },
  numeric: {
    format: scorm2004_regex.CMIDecimal,
    max: 1,
    delimiter: "",
    unique: false
  },
  other: {
    format: scorm2004_regex.CMIString4000,
    max: 1,
    delimiter: "",
    unique: false
  }
};
const CorrectResponses = {
  "true-false": {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: false,
    format: "^true$|^false$",
    limit: 1
  },
  choice: {
    max: 36,
    delimiter: "[,]",
    unique: true,
    duplicate: false,
    format: scorm2004_regex.CMILongIdentifier
  },
  "fill-in": {
    max: 10,
    delimiter: "[,]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMILangString250cr
  },
  "long-fill-in": {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: true,
    format: scorm2004_regex.CMILangString4000
  },
  matching: {
    max: 36,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier
  },
  performance: {
    max: 250,
    delimiter: "[,]",
    delimiter2: "[.]",
    delimiter3: "[:]",
    unique: false,
    duplicate: false,
    // step_name must be a non-empty short identifier
    format: scorm2004_regex.CMIShortIdentifier,
    // step_answer may be short identifier or numeric range (<decimal>[:<decimal>])
    format2: `^(${scorm2004_regex.CMIShortIdentifier})$|^(?:\\d+(?:\\.\\d+)?(?::\\d+(?:\\.\\d+)?)?)$`
  },
  sequencing: {
    max: 36,
    delimiter: "[,]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  likert: {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    limit: 1
  },
  numeric: {
    max: 2,
    delimiter: "[:]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIDecimal,
    limit: 1
  },
  other: {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIString4000,
    limit: 1
  }
};

class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      CMIElement: "cmi.interactions",
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError
    });
  }
}
class CMIInteractionsObject extends BaseCMI {
  /**
   * Constructor for cmi.interaction.n
   */
  constructor() {
    super("cmi.interactions.n");
    this._id = "";
    this._type = "";
    this._timestamp = "";
    this._weighting = "";
    this._learner_response = "";
    this._result = "";
    this._latency = "";
    this._description = "";
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.n.correct_responses",
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.correct_responses_children
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
    this._type = "";
    this._timestamp = "";
    this._weighting = "";
    this._learner_response = "";
    this._result = "";
    this._latency = "";
    this._description = "";
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.n.correct_responses",
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.correct_responses_children
    });
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
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }
  /**
   * Getter for _type
   * @return {string}
   */
  get type() {
    return this._type;
  }
  /**
   * Setter for _type
   * @param {string} type
   */
  set type(type) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".type",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(this._cmi_element + ".type", type, scorm2004_regex.CMIType)) {
        this._type = type;
      }
    }
  }
  /**
   * Getter for _timestamp
   * @return {string}
   */
  get timestamp() {
    return this._timestamp;
  }
  /**
   * Setter for _timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".timestamp",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(this._cmi_element + ".timestamp", timestamp, scorm2004_regex.CMITime)) {
        this._timestamp = timestamp;
      }
    }
  }
  /**
   * Getter for _weighting
   * @return {string}
   */
  get weighting() {
    return this._weighting;
  }
  /**
   * Setter for _weighting
   * @param {string} weighting
   */
  set weighting(weighting) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".weighting",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".weighting",
        weighting,
        scorm2004_regex.CMIDecimal
      )) {
        this._weighting = weighting;
      }
    }
  }
  /**
   * Getter for _learner_response
   * @return {string}
   */
  get learner_response() {
    return this._learner_response;
  }
  /**
   * Setter for _learner_response. Does type validation to make sure response
   * matches SCORM 2004's spec
   * @param {string} learner_response
   */
  set learner_response(learner_response) {
    if (this.initialized && (this._type === "" || this._id === "")) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".learner_response",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      let nodes = [];
      const response_type = LearnerResponses[this.type];
      if (response_type) {
        if (response_type?.delimiter) {
          const delimiter = response_type.delimiter === "[,]" ? "," : response_type.delimiter;
          nodes = learner_response.split(delimiter);
        } else {
          nodes[0] = learner_response;
        }
        if (nodes.length > 0 && nodes.length <= response_type.max) {
          const formatRegex = new RegExp(response_type.format);
          for (let i = 0; i < nodes.length; i++) {
            if (response_type?.delimiter2) {
              const delimiter2 = response_type.delimiter2 === "[.]" ? "." : response_type.delimiter2;
              const values = nodes[i].split(delimiter2);
              if (values.length === 2) {
                if (this.type === "performance" && (values[0] === "" || values[1] === "")) {
                  throw new Scorm2004ValidationError(
                    this._cmi_element + ".learner_response",
                    scorm2004_errors$1.TYPE_MISMATCH
                  );
                }
                if (!values[0].match(formatRegex)) {
                  throw new Scorm2004ValidationError(
                    this._cmi_element + ".learner_response",
                    scorm2004_errors$1.TYPE_MISMATCH
                  );
                } else {
                  if (!response_type.format2 || !values[1].match(new RegExp(response_type.format2))) {
                    throw new Scorm2004ValidationError(
                      this._cmi_element + ".learner_response",
                      scorm2004_errors$1.TYPE_MISMATCH
                    );
                  }
                }
              } else {
                throw new Scorm2004ValidationError(
                  this._cmi_element + ".learner_response",
                  scorm2004_errors$1.TYPE_MISMATCH
                );
              }
            } else {
              if (!nodes[i].match(formatRegex)) {
                throw new Scorm2004ValidationError(
                  this._cmi_element + ".learner_response",
                  scorm2004_errors$1.TYPE_MISMATCH
                );
              } else {
                if (nodes[i] !== "" && response_type.unique) {
                  for (let j = 0; j < i; j++) {
                    if (nodes[i] === nodes[j]) {
                      throw new Scorm2004ValidationError(
                        this._cmi_element + ".learner_response",
                        scorm2004_errors$1.TYPE_MISMATCH
                      );
                    }
                  }
                }
              }
            }
          }
        } else {
          throw new Scorm2004ValidationError(
            this._cmi_element + ".learner_response",
            scorm2004_errors$1.GENERAL_SET_FAILURE
          );
        }
        this._learner_response = learner_response;
      } else {
        throw new Scorm2004ValidationError(
          this._cmi_element + ".learner_response",
          scorm2004_errors$1.TYPE_MISMATCH
        );
      }
    }
  }
  /**
   * Getter for _result
   * @return {string}
   */
  get result() {
    return this._result;
  }
  /**
   * Setter for _result
   * @param {string} result
   */
  set result(result) {
    if (check2004ValidFormat(this._cmi_element + ".result", result, scorm2004_regex.CMIResult)) {
      this._result = result;
    }
  }
  /**
   * Getter for _latency
   * @return {string}
   */
  get latency() {
    return this._latency;
  }
  /**
   * Setter for _latency
   * @param {string} latency
   */
  set latency(latency) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".latency",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(this._cmi_element + ".latency", latency, scorm2004_regex.CMITimespan)) {
        this._latency = latency;
      }
    }
  }
  /**
   * Getter for _description
   * @return {string}
   */
  get description() {
    return this._description;
  }
  /**
   * Setter for _description
   * @param {string} description
   */
  set description(description) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".description",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".description",
        description,
        scorm2004_regex.CMILangString250,
        true
      )) {
        this._description = description;
      }
    }
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * toJSON for cmi.interactions.n
   *
   * @return {
   *    {
   *      id: string,
   *      type: string,
   *      objectives: CMIArray,
   *      timestamp: string,
   *      correct_responses: CMIArray,
   *      weighting: string,
   *      learner_response: string,
   *      result: string,
   *      latency: string,
   *      description: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this.id,
      type: this.type,
      objectives: this.objectives,
      timestamp: this.timestamp,
      weighting: this.weighting,
      learner_response: this.learner_response,
      result: this.result,
      latency: this.latency,
      description: this.description,
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
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
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
function stripBrackets(delim) {
  return delim.replace(/[[\]]/g, "");
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function splitUnescaped(text, delim) {
  const reDelim = escapeRegex(delim);
  const splitRe = new RegExp(`(?<!\\\\)${reDelim}`, "g");
  const unescapeRe = new RegExp(`\\\\${reDelim}`, "g");
  return text.split(splitRe).map((part) => part.replace(unescapeRe, delim));
}
function validatePattern(type, pattern, responseDef) {
  if (pattern.trim() !== pattern) {
    throw new Scorm2004ValidationError(
      "cmi.interactions.n.correct_responses.n.pattern",
      scorm2004_errors$1.TYPE_MISMATCH
    );
  }
  const subDelim1 = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : null;
  const rawNodes = subDelim1 ? splitUnescaped(pattern, subDelim1) : [pattern];
  for (const raw of rawNodes) {
    if (raw.trim() !== raw) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
  }
  if (type === "fill-in" && pattern === "") {
    return;
  }
  const delim1 = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : null;
  let nodes;
  if (delim1) {
    nodes = splitUnescaped(pattern, delim1);
  } else {
    nodes = [pattern];
  }
  if (!responseDef.delimiter && pattern.includes(",")) {
    throw new Scorm2004ValidationError(
      "cmi.interactions.n.correct_responses.n.pattern",
      scorm2004_errors$1.TYPE_MISMATCH
    );
  }
  if (responseDef.unique || responseDef.duplicate === false) {
    const seen = new Set(nodes);
    if (seen.size !== nodes.length) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
  }
  if (nodes.length === 0 || nodes.length > responseDef.max) {
    throw new Scorm2004ValidationError(
      "cmi.interactions.n.correct_responses.n.pattern",
      scorm2004_errors$1.GENERAL_SET_FAILURE
    );
  }
  const fmt1 = new RegExp(responseDef.format);
  const fmt2 = responseDef.format2 ? new RegExp(responseDef.format2) : null;
  const checkSingle = (value) => {
    if (!fmt1.test(value)) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
  };
  const checkPair = (value, delimBracketed) => {
    if (!delimBracketed) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    const delim = stripBrackets(delimBracketed);
    const parts = value.split(new RegExp(`(?<!\\\\)${escapeRegex(delim)}`, "g")).map((n) => n.replace(new RegExp(`\\\\${escapeRegex(delim)}`, "g"), delim));
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    if (!fmt1.test(parts[0]) || fmt2 && !fmt2.test(parts[1])) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
  };
  for (const node of nodes) {
    switch (type) {
      case "numeric": {
        const numDelim = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : ":";
        const nums = node.split(numDelim);
        if (nums.length < 1 || nums.length > 2) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors$1.TYPE_MISMATCH
          );
        }
        nums.forEach(checkSingle);
        break;
      }
      case "performance": {
        const delimBracketed = responseDef.delimiter2;
        if (!delimBracketed) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors$1.TYPE_MISMATCH
          );
        }
        const delim = stripBrackets(delimBracketed);
        const allParts = splitUnescaped(node, delim);
        if (!node.includes(":") && allParts.length !== 2) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors$1.TYPE_MISMATCH
          );
        }
        const [part1, part2] = splitUnescaped(node, delim);
        if (part1 === "" || part2 === "" || part1 === part2) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors$1.TYPE_MISMATCH
          );
        }
        if (!fmt1.test(part1)) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors$1.TYPE_MISMATCH
          );
        }
        if (fmt2 && !fmt2.test(part2)) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors$1.TYPE_MISMATCH
          );
        }
        break;
      }
      default:
        if (responseDef.delimiter2) {
          checkPair(node, responseDef.delimiter2);
        } else {
          checkSingle(node);
        }
    }
  }
}
class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   * @param interactionType The type of interaction (e.g. "numeric", "choice", etc.)
   */
  constructor(interactionType) {
    super("cmi.interactions.n.correct_responses.n");
    this._pattern = "";
    this._interactionType = interactionType;
  }
  reset() {
    this._initialized = false;
    this._pattern = "";
  }
  get pattern() {
    return this._pattern;
  }
  set pattern(pattern) {
    if (this._interactionType === "fill-in" && pattern === "") {
      this._pattern = "";
      return;
    }
    if (!check2004ValidFormat(this._cmi_element + ".pattern", pattern, scorm2004_regex.CMIFeedback)) {
      return;
    }
    if (this._interactionType) {
      const responseDef = CorrectResponses[this._interactionType];
      if (responseDef) {
        if (this._interactionType === "matching" && /\\[.,]/.test(pattern)) ; else {
          validatePattern(this._interactionType, pattern, responseDef);
        }
      }
    }
    this._pattern = pattern;
  }
  toJSON() {
    this.jsonString = true;
    const result = { pattern: this.pattern };
    this.jsonString = false;
    return result;
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
        scorm12_errors[String(errorCode)].basicMessage,
        scorm12_errors[String(errorCode)].detailMessage
      );
    } else {
      super(
        CMIElement,
        101,
        scorm12_errors["101"].basicMessage,
        scorm12_errors["101"].detailMessage
      );
    }
    Object.setPrototypeOf(this, Scorm12ValidationError.prototype);
  }
}

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

class Scorm2004CMIScore extends CMIScore {
  /**
   * Constructor for cmi *.score
   */
  constructor() {
    super({
      CMIElement: "cmi.score",
      score_children: scorm2004_constants.score_children,
      max: "",
      invalidErrorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      invalidTypeCode: scorm2004_errors$1.TYPE_MISMATCH,
      invalidRangeCode: scorm2004_errors$1.VALUE_OUT_OF_RANGE,
      decimalRegex: scorm2004_regex.CMIDecimal,
      errorClass: Scorm2004ValidationError
    });
    this._scaled = "";
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._scaled = "";
    this._raw = "";
    this._min = "";
    this._max = "";
  }
  /**
   * Getter for _scaled
   * @return {string}
   */
  get scaled() {
    return this._scaled;
  }
  /**
   * Setter for _scaled
   * @param {string} scaled
   */
  set scaled(scaled) {
    if (check2004ValidFormat(this._cmi_element + ".scaled", scaled, scorm2004_regex.CMIDecimal) && check2004ValidRange(this._cmi_element + ".scaled", scaled, scorm2004_regex.scaled_range)) {
      this._scaled = scaled;
    }
  }
  getScoreObject() {
    const scoreObject = super.getScoreObject();
    if (!Number.isNaN(Number.parseFloat(this.scaled))) {
      scoreObject.scaled = Number.parseFloat(this.scaled);
    }
    return scoreObject;
  }
  /**
   * toJSON for cmi *.score
   *
   * @return {
   *    {
   *      scaled: string,
   *      raw: string,
   *      min: string,
   *      max: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      scaled: this.scaled,
      raw: this.raw,
      min: this.min,
      max: this.max
    };
    this.jsonString = false;
    return result;
  }
}

class CMICommentsFromLMS extends CMIArray {
  /**
   * Constructor for cmi.comments_from_lms Array
   */
  constructor() {
    super({
      CMIElement: "cmi.comments_from_lms",
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError
    });
  }
}
class CMICommentsFromLearner extends CMIArray {
  /**
   * Constructor for cmi.comments_from_learner Array
   */
  constructor() {
    super({
      CMIElement: "cmi.comments_from_learner",
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError
    });
  }
}
class CMICommentsObject extends BaseCMI {
  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  constructor(readOnlyAfterInit = false) {
    super("cmi.comments_from_learner.n");
    this._comment = "";
    this._location = "";
    this._timestamp = "";
    this._comment = "";
    this._location = "";
    this._timestamp = "";
    this._readOnlyAfterInit = readOnlyAfterInit;
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
  }
  /**
   * Getter for _comment
   * @return {string}
   */
  get comment() {
    return this._comment;
  }
  /**
   * Setter for _comment
   * @param {string} comment
   */
  set comment(comment) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".comment",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".comment",
        comment,
        scorm2004_regex.CMILangString4000,
        true
      )) {
        this._comment = comment;
      }
    }
  }
  /**
   * Getter for _location
   * @return {string}
   */
  get location() {
    return this._location;
  }
  /**
   * Setter for _location
   * @param {string} location
   */
  set location(location) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".location",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".location",
        location,
        scorm2004_regex.CMIString250
      )) {
        this._location = location;
      }
    }
  }
  /**
   * Getter for _timestamp
   * @return {string}
   */
  get timestamp() {
    return this._timestamp;
  }
  /**
   * Setter for _timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".timestamp",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      if (check2004ValidFormat(this._cmi_element + ".timestamp", timestamp, scorm2004_regex.CMITime)) {
        this._timestamp = timestamp;
      }
    }
  }
  /**
   * toJSON for cmi.comments_from_learner.n object
   * @return {
   *    {
   *      comment: string,
   *      location: string,
   *      timestamp: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      comment: this.comment,
      location: this.location,
      timestamp: this.timestamp
    };
    this.jsonString = false;
    return result;
  }
}

class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      CMIElement: "cmi.objectives",
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError
    });
  }
  /**
   * Find an objective by its ID
   */
  findObjectiveById(id) {
    return this.childArray.find((objective) => objective.id === id);
  }
  /**
   * Find objective by its index
   */
  findObjectiveByIndex(index) {
    return this.childArray[index];
  }
  /**
   * Set an objective at the given index
   */
  setObjectiveByIndex(index, objective) {
    this.childArray[index] = objective;
  }
}
class CMIObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super("cmi.objectives.n");
    this._id = "";
    this._success_status = "unknown";
    this._completion_status = "unknown";
    this._progress_measure = "";
    this._description = "";
    this.score = new Scorm2004CMIScore();
  }
  reset() {
    this._initialized = false;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
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
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }
  /**
   * Getter for _success_status
   * @return {string}
   */
  get success_status() {
    return this._success_status;
  }
  /**
   * Setter for _success_status
   * @param {string} success_status
   */
  set success_status(success_status) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".success_status",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".success_status",
        success_status,
        scorm2004_regex.CMISStatus
      )) {
        this._success_status = success_status;
      }
    }
  }
  /**
   * Getter for _completion_status
   * @return {string}
   */
  get completion_status() {
    return this._completion_status;
  }
  /**
   * Setter for _completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".completion_status",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".completion_status",
        completion_status,
        scorm2004_regex.CMICStatus
      )) {
        this._completion_status = completion_status;
      }
    }
  }
  /**
   * Getter for _progress_measure
   * @return {string}
   */
  get progress_measure() {
    return this._progress_measure;
  }
  /**
   * Setter for _progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".progress_measure",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".progress_measure",
        progress_measure,
        scorm2004_regex.CMIDecimal
      ) && check2004ValidRange(
        this._cmi_element + ".progress_measure",
        progress_measure,
        scorm2004_regex.progress_range
      )) {
        this._progress_measure = progress_measure;
      }
    }
  }
  /**
   * Getter for _description
   * @return {string}
   */
  get description() {
    return this._description;
  }
  /**
   * Setter for _description
   * @param {string} description
   */
  set description(description) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".description",
        scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED
      );
    } else {
      if (check2004ValidFormat(
        this._cmi_element + ".description",
        description,
        scorm2004_regex.CMILangString250,
        true
      )) {
        this._description = description;
      }
    }
  }
  /**
   * toJSON for cmi.objectives.n
   *
   * @return {
   *    {
   *      id: string,
   *      success_status: string,
   *      completion_status: string,
   *      progress_measure: string,
   *      description: string,
   *      score: Scorm2004CMIScore
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this.id,
      success_status: this.success_status,
      completion_status: this.completion_status,
      progress_measure: this.progress_measure,
      description: this.description,
      score: this.score
    };
    this.jsonString = false;
    return result;
  }
}

class CMIMetadata extends BaseCMI {
  /**
   * Constructor for CMIMetadata
   */
  constructor() {
    super("cmi");
    this.__version = "1.0";
    this.__children = scorm2004_constants.cmi_children;
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
    throw new Scorm2004ValidationError(
      this._cmi_element + "._version",
      scorm2004_errors$1.READ_ONLY_ELEMENT
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
   * Setter for __children. Just throws an error.
   * @param {number} _children
   */
  set _children(_children) {
    throw new Scorm2004ValidationError(
      this._cmi_element + "._children",
      scorm2004_errors$1.READ_ONLY_ELEMENT
    );
  }
  /**
   * Reset the metadata properties
   */
  reset() {
    this._initialized = false;
  }
}

class CMILearner extends BaseCMI {
  /**
   * Constructor for CMILearner
   */
  constructor() {
    super("cmi");
    this._learner_id = "";
    this._learner_name = "";
  }
  /**
   * Getter for _learner_id
   * @return {string}
   */
  get learner_id() {
    return this._learner_id;
  }
  /**
   * Setter for _learner_id. Can only be called before initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".learner_id",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._learner_id = learner_id;
    }
  }
  /**
   * Getter for _learner_name
   * @return {string}
   */
  get learner_name() {
    return this._learner_name;
  }
  /**
   * Setter for _learner_name. Can only be called before initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".learner_name",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._learner_name = learner_name;
    }
  }
  /**
   * Reset the learner properties
   */
  reset() {
    this._initialized = false;
  }
}

class CMIStatus extends BaseCMI {
  /**
   * Constructor for CMIStatus
   */
  constructor() {
    super("cmi");
    this._completion_status = "unknown";
    this._success_status = "unknown";
    this._progress_measure = "";
  }
  /**
   * Getter for _completion_status
   * @return {string}
   */
  get completion_status() {
    return this._completion_status;
  }
  /**
   * Setter for _completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status) {
    if (check2004ValidFormat(
      this._cmi_element + ".completion_status",
      completion_status,
      scorm2004_regex.CMICStatus
    )) {
      this._completion_status = completion_status;
    }
  }
  /**
   * Getter for _success_status
   * @return {string}
   */
  get success_status() {
    return this._success_status;
  }
  /**
   * Setter for _success_status
   * @param {string} success_status
   */
  set success_status(success_status) {
    if (check2004ValidFormat(
      this._cmi_element + ".success_status",
      success_status,
      scorm2004_regex.CMISStatus
    )) {
      this._success_status = success_status;
    }
  }
  /**
   * Getter for _progress_measure
   * @return {string}
   */
  get progress_measure() {
    return this._progress_measure;
  }
  /**
   * Setter for _progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure) {
    if (check2004ValidFormat(
      this._cmi_element + ".progress_measure",
      progress_measure,
      scorm2004_regex.CMIDecimal
    ) && check2004ValidRange(
      this._cmi_element + ".progress_measure",
      progress_measure,
      scorm2004_regex.progress_range
    )) {
      this._progress_measure = progress_measure;
    }
  }
  /**
   * Reset the status properties
   */
  reset() {
    this._initialized = false;
    this._completion_status = "unknown";
    this._success_status = "unknown";
    this._progress_measure = "";
  }
}

class CMISession extends BaseCMI {
  /**
   * Constructor for CMISession
   */
  constructor() {
    super("cmi");
    this._entry = "";
    this._exit = "";
    this._session_time = "PT0H0M0S";
    this._total_time = "";
  }
  /**
   * Getter for _entry
   * @return {string}
   */
  get entry() {
    return this._entry;
  }
  /**
   * Setter for _entry. Can only be called before initialization.
   * @param {string} entry
   */
  set entry(entry) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".entry",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._entry = entry;
    }
  }
  /**
   * Getter for _exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit() {
    if (!this.jsonString) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".exit",
        scorm2004_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._exit;
  }
  /**
   * Setter for _exit
   * @param {string} exit
   */
  set exit(exit) {
    if (check2004ValidFormat(this._cmi_element + ".exit", exit, scorm2004_regex.CMIExit, true)) {
      this._exit = exit;
    }
  }
  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time() {
    if (!this.jsonString) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".session_time",
        scorm2004_errors$1.WRITE_ONLY_ELEMENT
      );
    }
    return this._session_time;
  }
  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time) {
    if (check2004ValidFormat(
      this._cmi_element + ".session_time",
      session_time,
      scorm2004_regex.CMITimespan
    )) {
      this._session_time = session_time;
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
   * Setter for _total_time. Can only be called before initialization.
   * @param {string} total_time
   */
  set total_time(total_time) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".total_time",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._total_time = total_time;
    }
  }
  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string} ISO8601 Duration
   */
  getCurrentTotalTime(start_time) {
    let sessionTime = this._session_time;
    if (typeof start_time !== "undefined" && start_time !== null) {
      const seconds = (/* @__PURE__ */ new Date()).getTime() - start_time;
      sessionTime = getSecondsAsISODuration(seconds / 1e3);
    }
    return addTwoDurations(this._total_time, sessionTime, scorm2004_regex.CMITimespan);
  }
  /**
   * Reset the session properties
   */
  reset() {
    this._initialized = false;
    this._entry = "";
    this._exit = "";
    this._session_time = "PT0H0M0S";
  }
}

class CMIContent extends BaseCMI {
  /**
   * Constructor for CMIContent
   */
  constructor() {
    super("cmi");
    this._location = "";
    this._launch_data = "";
    this._suspend_data = "";
  }
  /**
   * Getter for _location
   * @return {string}
   */
  get location() {
    return this._location;
  }
  /**
   * Setter for _location
   * @param {string} location
   */
  set location(location) {
    if (check2004ValidFormat(this._cmi_element + ".location", location, scorm2004_regex.CMIString1000)) {
      this._location = location;
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
   * Setter for _launch_data. Can only be called before initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".launch_data",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._launch_data = launch_data;
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
    if (check2004ValidFormat(
      this._cmi_element + ".suspend_data",
      suspend_data,
      scorm2004_regex.CMIString64000,
      true
    )) {
      this._suspend_data = suspend_data;
    }
  }
  /**
   * Reset the content properties
   */
  reset() {
    this._initialized = false;
    this._location = "";
    this._suspend_data = "";
  }
}

class CMISettings extends BaseCMI {
  /**
   * Constructor for CMISettings
   */
  constructor() {
    super("cmi");
    this._credit = "credit";
    this._mode = "normal";
    this._time_limit_action = "continue,no message";
    this._max_time_allowed = "";
  }
  /**
   * Getter for _credit
   * @return {string}
   */
  get credit() {
    return this._credit;
  }
  /**
   * Setter for _credit. Can only be called before initialization.
   * @param {string} credit
   */
  set credit(credit) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".credit",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._credit = credit;
    }
  }
  /**
   * Getter for _mode
   * @return {string}
   */
  get mode() {
    return this._mode;
  }
  /**
   * Setter for _mode. Can only be called before initialization.
   * @param {string} mode
   */
  set mode(mode) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".mode",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._mode = mode;
    }
  }
  /**
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action() {
    return this._time_limit_action;
  }
  /**
   * Setter for _time_limit_action. Can only be called before initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".time_limit_action",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._time_limit_action = time_limit_action;
    }
  }
  /**
   * Getter for _max_time_allowed
   * @return {string}
   */
  get max_time_allowed() {
    return this._max_time_allowed;
  }
  /**
   * Setter for _max_time_allowed. Can only be called before initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".max_time_allowed",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._max_time_allowed = max_time_allowed;
    }
  }
  /**
   * Reset the settings properties
   */
  reset() {
    this._initialized = false;
  }
}

class CMIThresholds extends BaseCMI {
  /**
   * Constructor for CMIThresholds
   */
  constructor() {
    super("cmi");
    this._scaled_passing_score = "";
    this._completion_threshold = "";
  }
  /**
   * Getter for _scaled_passing_score
   * @return {string}
   */
  get scaled_passing_score() {
    return this._scaled_passing_score;
  }
  /**
   * Setter for _scaled_passing_score. Can only be called before initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".scaled_passing_score",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._scaled_passing_score = scaled_passing_score;
    }
  }
  /**
   * Getter for _completion_threshold
   * @return {string}
   */
  get completion_threshold() {
    return this._completion_threshold;
  }
  /**
   * Setter for _completion_threshold. Can only be called before initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".completion_threshold",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    } else {
      this._completion_threshold = completion_threshold;
    }
  }
  /**
   * Reset the threshold properties
   */
  reset() {
    this._initialized = false;
  }
}

class CMI extends BaseRootCMI {
  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  constructor(initialized = false) {
    super("cmi");
    this.metadata = new CMIMetadata();
    this.learner = new CMILearner();
    this.status = new CMIStatus();
    this.session = new CMISession();
    this.content = new CMIContent();
    this.settings = new CMISettings();
    this.thresholds = new CMIThresholds();
    this.learner_preference = new CMILearnerPreference();
    this.score = new Scorm2004CMIScore();
    this.comments_from_learner = new CMICommentsFromLearner();
    this.comments_from_lms = new CMICommentsFromLMS();
    this.interactions = new CMIInteractions();
    this.objectives = new CMIObjectives();
    if (initialized) this.initialize();
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.metadata?.initialize();
    this.learner?.initialize();
    this.status?.initialize();
    this.session?.initialize();
    this.content?.initialize();
    this.settings?.initialize();
    this.thresholds?.initialize();
    this.learner_preference?.initialize();
    this.score?.initialize();
    this.comments_from_learner?.initialize();
    this.comments_from_lms?.initialize();
    this.interactions?.initialize();
    this.objectives?.initialize();
  }
  /**
   * Called when API is moving to another SCO
   */
  reset() {
    this._initialized = false;
    this.metadata?.reset();
    this.learner?.reset();
    this.status?.reset();
    this.session?.reset();
    this.content?.reset();
    this.settings?.reset();
    this.thresholds?.reset();
    this.objectives?.reset(false);
    this.interactions?.reset(true);
    this.score?.reset();
    this.comments_from_learner?.reset();
    this.comments_from_lms?.reset();
    this.learner_preference?.reset();
  }
  /**
   * Getter for __version
   * @return {string}
   * @private
   */
  get _version() {
    return this.metadata._version;
  }
  /**
   * Setter for __version. Just throws an error.
   * @param {string} _version
   * @private
   */
  set _version(_version) {
    this.metadata._version = _version;
  }
  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children() {
    return this.metadata._children;
  }
  /**
   * Setter for __children. Just throws an error.
   * @param {number} _children
   * @private
   */
  set _children(_children) {
    this.metadata._children = _children;
  }
  /**
   * Getter for _completion_status
   * @return {string}
   */
  get completion_status() {
    return this.status.completion_status;
  }
  /**
   * Setter for _completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status) {
    this.status.completion_status = completion_status;
  }
  /**
   * Getter for _completion_threshold
   * @return {string}
   */
  get completion_threshold() {
    return this.thresholds.completion_threshold;
  }
  /**
   * Setter for _completion_threshold. Can only be called before initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold) {
    this.thresholds.completion_threshold = completion_threshold;
  }
  /**
   * Getter for _credit
   * @return {string}
   */
  get credit() {
    return this.settings.credit;
  }
  /**
   * Setter for _credit. Can only be called before initialization.
   * @param {string} credit
   */
  set credit(credit) {
    this.settings.credit = credit;
  }
  /**
   * Getter for _entry
   * @return {string}
   */
  get entry() {
    return this.session.entry;
  }
  /**
   * Setter for _entry. Can only be called before initialization.
   * @param {string} entry
   */
  set entry(entry) {
    this.session.entry = entry;
  }
  /**
   * Getter for _exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit() {
    this.session.jsonString = this.jsonString;
    return this.session.exit;
  }
  /**
   * Setter for _exit
   * @param {string} exit
   */
  set exit(exit) {
    this.session.exit = exit;
  }
  /**
   * Getter for _launch_data
   * @return {string}
   */
  get launch_data() {
    return this.content.launch_data;
  }
  /**
   * Setter for _launch_data. Can only be called before initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data) {
    this.content.launch_data = launch_data;
  }
  /**
   * Getter for _learner_id
   * @return {string}
   */
  get learner_id() {
    return this.learner.learner_id;
  }
  /**
   * Setter for _learner_id. Can only be called before initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id) {
    this.learner.learner_id = learner_id;
  }
  /**
   * Getter for _learner_name
   * @return {string}
   */
  get learner_name() {
    return this.learner.learner_name;
  }
  /**
   * Setter for _learner_name. Can only be called before initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name) {
    this.learner.learner_name = learner_name;
  }
  /**
   * Getter for _location
   * @return {string}
   */
  get location() {
    return this.content.location;
  }
  /**
   * Setter for _location
   * @param {string} location
   */
  set location(location) {
    this.content.location = location;
  }
  /**
   * Getter for _max_time_allowed
   * @return {string}
   */
  get max_time_allowed() {
    return this.settings.max_time_allowed;
  }
  /**
   * Setter for _max_time_allowed. Can only be called before initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed) {
    this.settings.max_time_allowed = max_time_allowed;
  }
  /**
   * Getter for _mode
   * @return {string}
   */
  get mode() {
    return this.settings.mode;
  }
  /**
   * Setter for _mode. Can only be called before initialization.
   * @param {string} mode
   */
  set mode(mode) {
    this.settings.mode = mode;
  }
  /**
   * Getter for _progress_measure
   * @return {string}
   */
  get progress_measure() {
    return this.status.progress_measure;
  }
  /**
   * Setter for _progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure) {
    this.status.progress_measure = progress_measure;
  }
  /**
   * Getter for _scaled_passing_score
   * @return {string}
   */
  get scaled_passing_score() {
    return this.thresholds.scaled_passing_score;
  }
  /**
   * Setter for _scaled_passing_score. Can only be called before initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score) {
    this.thresholds.scaled_passing_score = scaled_passing_score;
  }
  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time() {
    this.session.jsonString = this.jsonString;
    return this.session.session_time;
  }
  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time) {
    this.session.session_time = session_time;
  }
  /**
   * Getter for _success_status
   * @return {string}
   */
  get success_status() {
    return this.status.success_status;
  }
  /**
   * Setter for _success_status
   * @param {string} success_status
   */
  set success_status(success_status) {
    this.status.success_status = success_status;
  }
  /**
   * Getter for _suspend_data
   * @return {string}
   */
  get suspend_data() {
    return this.content.suspend_data;
  }
  /**
   * Setter for _suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data) {
    this.content.suspend_data = suspend_data;
  }
  /**
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action() {
    return this.settings.time_limit_action;
  }
  /**
   * Setter for _time_limit_action. Can only be called before initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action) {
    this.settings.time_limit_action = time_limit_action;
  }
  /**
   * Getter for _total_time
   * @return {string}
   */
  get total_time() {
    return this.session.total_time;
  }
  /**
   * Setter for _total_time. Can only be called before initialization.
   * @param {string} total_time
   */
  set total_time(total_time) {
    this.session.total_time = total_time;
  }
  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string} ISO8601 Duration
   */
  getCurrentTotalTime() {
    return this.session.getCurrentTotalTime(this.start_time);
  }
  /**
   * toJSON for cmi
   *
   * @return {
   *    {
   *      comments_from_learner: CMICommentsFromLearner,
   *      comments_from_lms: CMICommentsFromLMS,
   *      completion_status: string,
   *      completion_threshold: string,
   *      credit: string,
   *      entry: string,
   *      exit: string,
   *      interactions: CMIInteractions,
   *      launch_data: string,
   *      learner_id: string,
   *      learner_name: string,
   *      learner_preference: CMILearnerPreference,
   *      location: string,
   *      max_time_allowed: string,
   *      mode: string,
   *      objectives: CMIObjectives,
   *      progress_measure: string,
   *      scaled_passing_score: string,
   *      score: Scorm2004CMIScore,
   *      session_time: string,
   *      success_status: string,
   *      suspend_data: string,
   *      time_limit_action: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    this.session.jsonString = true;
    const result = {
      comments_from_learner: this.comments_from_learner,
      comments_from_lms: this.comments_from_lms,
      completion_status: this.completion_status,
      completion_threshold: this.completion_threshold,
      credit: this.credit,
      entry: this.entry,
      exit: this.exit,
      interactions: this.interactions,
      launch_data: this.launch_data,
      learner_id: this.learner_id,
      learner_name: this.learner_name,
      learner_preference: this.learner_preference,
      location: this.location,
      max_time_allowed: this.max_time_allowed,
      mode: this.mode,
      objectives: this.objectives,
      progress_measure: this.progress_measure,
      scaled_passing_score: this.scaled_passing_score,
      score: this.score,
      session_time: this.session_time,
      success_status: this.success_status,
      suspend_data: this.suspend_data,
      time_limit_action: this.time_limit_action
    };
    this.jsonString = false;
    this.session.jsonString = false;
    return result;
  }
}

class ADL extends BaseCMI {
  /**
   * Constructor for adl
   */
  constructor() {
    super("adl");
    this.data = new ADLData();
    this._sequencing = null;
    this.nav = new ADLNav();
    this.data = new ADLData();
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.nav?.initialize();
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this.nav?.reset();
  }
  /**
   * Getter for sequencing
   * @return {Sequencing | null}
   */
  get sequencing() {
    return this._sequencing;
  }
  /**
   * Setter for sequencing
   * @param {Sequencing | null} sequencing
   */
  set sequencing(sequencing) {
    this._sequencing = sequencing;
    if (sequencing) {
      sequencing.adlNav = this.nav;
      this.nav.sequencing = sequencing;
    }
  }
  /**
   * toJSON for adl
   * @return {
   *    {
   *      nav: ADLNav,
   *      data: ADLData
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      nav: this.nav,
      data: this.data
    };
    this.jsonString = false;
    return result;
  }
}
class ADLNav extends BaseCMI {
  /**
   * Constructor for `adl.nav`
   */
  constructor() {
    super("adl.nav");
    this._request = "_none_";
    this._sequencing = null;
    this.request_valid = new ADLNavRequestValid();
  }
  /**
   * Getter for sequencing
   * @return {Sequencing | null}
   */
  get sequencing() {
    return this._sequencing;
  }
  /**
   * Setter for sequencing
   * @param {Sequencing | null} sequencing
   */
  set sequencing(sequencing) {
    this._sequencing = sequencing;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.request_valid?.initialize();
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._request = "_none_";
    this._sequencing = null;
    this.request_valid?.reset();
  }
  /**
   * Getter for _request
   * @return {string}
   */
  get request() {
    return this._request;
  }
  /**
   * Setter for _request
   * @param {string} request
   */
  set request(request) {
    if (check2004ValidFormat(this._cmi_element + ".request", request, scorm2004_regex.NAVEvent)) {
      if (this._request !== request) {
        this._request = request;
        if (this._sequencing) {
          this._sequencing.processNavigationRequest(request);
        }
      }
    }
  }
  /**
   * toJSON for adl.nav
   *
   * @return {
   *    {
   *      request: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      request: this.request
    };
    this.jsonString = false;
    return result;
  }
}
class ADLData extends CMIArray {
  constructor() {
    super({
      CMIElement: "adl.data",
      children: scorm2004_constants.adl_data_children,
      errorCode: scorm2004_errors$1.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError
    });
  }
}
class ADLDataObject extends BaseCMI {
  constructor() {
    super("adl.data.n");
    this._id = "";
    this._store = "";
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
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
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }
  /**
   * Getter for _store
   * @return {string}
   */
  get store() {
    return this._store;
  }
  /**
   * Setter for _store
   * @param {string} store
   */
  set store(store) {
    if (check2004ValidFormat(this._cmi_element + ".store", store, scorm2004_regex.CMILangString4000)) {
      this._store = store;
    }
  }
  /**
   * toJSON for adl.data.n
   *
   * @return {
   *    {
   *      id: string,
   *      store: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this._id,
      store: this._store
    };
    this.jsonString = false;
    return result;
  }
}
class ADLNavRequestValid extends BaseCMI {
  /**
   * Constructor for adl.nav.request_valid
   */
  constructor() {
    super("adl.nav.request_valid");
    this._continue = "unknown";
    this._previous = "unknown";
    this._choice = {};
    this._jump = {};
  }
  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._continue = "unknown";
    this._previous = "unknown";
  }
  /**
   * Getter for _continue
   * @return {string}
   */
  get continue() {
    return this._continue;
  }
  /**
   * Setter for _continue. Just throws an error.
   * @param {string} _continue
   */
  set continue(_continue) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".continue",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    }
    if (check2004ValidFormat(this._cmi_element + ".continue", _continue, scorm2004_regex.NAVBoolean)) {
      this._continue = _continue;
    }
  }
  /**
   * Getter for _previous
   * @return {string}
   */
  get previous() {
    return this._previous;
  }
  /**
   * Setter for _previous. Just throws an error.
   * @param {string} _previous
   */
  set previous(_previous) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".previous",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    }
    if (check2004ValidFormat(this._cmi_element + ".previous", _previous, scorm2004_regex.NAVBoolean)) {
      this._previous = _previous;
    }
  }
  /**
   * Getter for _choice
   * @return {{ [key: string]: NAVBoolean }}
   */
  get choice() {
    return this._choice;
  }
  /**
   * Setter for _choice
   * @param {{ [key: string]: string }} choice
   */
  set choice(choice) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".choice",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    }
    if (typeof choice !== "object") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".choice",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    for (const key in choice) {
      if ({}.hasOwnProperty.call(choice, key)) {
        if (check2004ValidFormat(
          this._cmi_element + ".choice." + key,
          choice[key],
          scorm2004_regex.NAVBoolean
        ) && check2004ValidFormat(this._cmi_element + ".choice." + key, key, scorm2004_regex.NAVTarget)) {
          const value = choice[key];
          if (value === "true") {
            this._choice[key] = NAVBoolean.TRUE;
          } else if (value === "false") {
            this._choice[key] = NAVBoolean.FALSE;
          } else if (value === "unknown") {
            this._choice[key] = NAVBoolean.UNKNOWN;
          }
        }
      }
    }
  }
  /**
   * Getter for _jump
   * @return {{ [key: string]: NAVBoolean }}
   */
  get jump() {
    return this._jump;
  }
  /**
   * Setter for _jump
   * @param {{ [key: string]: string }} jump
   */
  set jump(jump) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".jump",
        scorm2004_errors$1.READ_ONLY_ELEMENT
      );
    }
    if (typeof jump !== "object") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".jump",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    for (const key in jump) {
      if ({}.hasOwnProperty.call(jump, key)) {
        if (check2004ValidFormat(
          this._cmi_element + ".jump." + key,
          jump[key],
          scorm2004_regex.NAVBoolean
        ) && check2004ValidFormat(this._cmi_element + ".jump." + key, key, scorm2004_regex.NAVTarget)) {
          const value = jump[key];
          if (value === "true") {
            this._jump[key] = NAVBoolean.TRUE;
          } else if (value === "false") {
            this._jump[key] = NAVBoolean.FALSE;
          } else if (value === "unknown") {
            this._jump[key] = NAVBoolean.UNKNOWN;
          }
        }
      }
    }
  }
  /**
   * toJSON for adl.nav.request_valid
   *
   * @return {
   *    {
   *      previous: string,
   *      continue: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      previous: this._previous,
      continue: this._continue,
      choice: this._choice,
      jump: this._jump
    };
    this.jsonString = false;
    return result;
  }
}

var RuleActionType = /* @__PURE__ */ ((RuleActionType2) => {
  RuleActionType2["SKIP"] = "skip";
  RuleActionType2["DISABLED"] = "disabled";
  RuleActionType2["HIDE_FROM_CHOICE"] = "hideFromChoice";
  RuleActionType2["STOP_FORWARD_TRAVERSAL"] = "stopForwardTraversal";
  RuleActionType2["EXIT_PARENT"] = "exitParent";
  RuleActionType2["EXIT_ALL"] = "exitAll";
  RuleActionType2["RETRY"] = "retry";
  RuleActionType2["RETRY_ALL"] = "retryAll";
  RuleActionType2["CONTINUE"] = "continue";
  RuleActionType2["PREVIOUS"] = "previous";
  RuleActionType2["EXIT"] = "exit";
  return RuleActionType2;
})(RuleActionType || {});
class RuleCondition extends BaseCMI {
  /**
   * Constructor for RuleCondition
   * @param {RuleConditionType} condition - The condition type
   * @param {RuleConditionOperator | null} operator - The operator (null for no operator)
   * @param {Map<string, any>} parameters - Additional parameters for the condition
   */
  constructor(condition = "always" /* ALWAYS */, operator = null, parameters = /* @__PURE__ */ new Map()) {
    super("ruleCondition");
    this._condition = "always" /* ALWAYS */;
    this._operator = null;
    this._parameters = /* @__PURE__ */ new Map();
    this._condition = condition;
    this._operator = operator;
    this._parameters = parameters;
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._condition = "always" /* ALWAYS */;
    this._operator = null;
    this._parameters = /* @__PURE__ */ new Map();
  }
  /**
   * Getter for condition
   * @return {RuleConditionType}
   */
  get condition() {
    return this._condition;
  }
  /**
   * Setter for condition
   * @param {RuleConditionType} condition
   */
  set condition(condition) {
    this._condition = condition;
  }
  /**
   * Getter for operator
   * @return {RuleConditionOperator | null}
   */
  get operator() {
    return this._operator;
  }
  /**
   * Setter for operator
   * @param {RuleConditionOperator | null} operator
   */
  set operator(operator) {
    this._operator = operator;
  }
  /**
   * Getter for parameters
   * @return {Map<string, any>}
   */
  get parameters() {
    return this._parameters;
  }
  /**
   * Setter for parameters
   * @param {Map<string, any>} parameters
   */
  set parameters(parameters) {
    this._parameters = parameters;
  }
  /**
   * Evaluate the condition for an activity
   * @param {Activity} activity - The activity to evaluate the condition for
   * @return {boolean} - True if the condition is met, false otherwise
   */
  evaluate(activity) {
    let result;
    switch (this._condition) {
      case "satisfied" /* SATISFIED */:
        result = activity.successStatus === SuccessStatus.PASSED;
        break;
      case "objectiveStatusKnown" /* OBJECTIVE_STATUS_KNOWN */:
        result = !!activity.objectiveMeasureStatus;
        break;
      case "objectiveMeasureKnown" /* OBJECTIVE_MEASURE_KNOWN */:
        result = !!activity.objectiveMeasureStatus;
        break;
      case "objectiveMeasureGreaterThan" /* OBJECTIVE_MEASURE_GREATER_THAN */: {
        const greaterThanValue = this._parameters.get("threshold") || 0;
        result = activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue;
        break;
      }
      case "objectiveMeasureLessThan" /* OBJECTIVE_MEASURE_LESS_THAN */: {
        const lessThanValue = this._parameters.get("threshold") || 0;
        result = activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure < lessThanValue;
        break;
      }
      case "completed" /* COMPLETED */:
        result = activity.isCompleted;
        break;
      case "progressKnown" /* PROGRESS_KNOWN */:
        result = activity.completionStatus !== "unknown";
        break;
      case "attempted" /* ATTEMPTED */:
        result = activity.attemptCount > 0;
        break;
      case "attemptLimitExceeded" /* ATTEMPT_LIMIT_EXCEEDED */: {
        const attemptLimit = this._parameters.get("attemptLimit") || 0;
        result = activity.attemptCount >= attemptLimit;
        break;
      }
      case "timeLimitExceeded" /* TIME_LIMIT_EXCEEDED */:
        result = false;
        break;
      case "outsideAvailableTimeRange" /* OUTSIDE_AVAILABLE_TIME_RANGE */:
        result = false;
        break;
      case "always" /* ALWAYS */:
        result = true;
        break;
      default:
        result = false;
        break;
    }
    if (this._operator === "not" /* NOT */) {
      result = !result;
    }
    return result;
  }
  /**
   * toJSON for RuleCondition
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      condition: this._condition,
      operator: this._operator,
      parameters: Object.fromEntries(this._parameters)
    };
    this.jsonString = false;
    return result;
  }
}
class SequencingRule extends BaseCMI {
  /**
   * Constructor for SequencingRule
   * @param {RuleActionType} action - The action to take when the rule conditions are met
   * @param {string | RuleConditionOperator} conditionCombination - How to combine multiple conditions ("all"/"and" or "any"/"or")
   */
  constructor(action = "skip" /* SKIP */, conditionCombination = "and" /* AND */) {
    super("sequencingRule");
    this._conditions = [];
    this._action = "skip" /* SKIP */;
    this._conditionCombination = "and" /* AND */;
    this._action = action;
    this._conditionCombination = conditionCombination;
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._conditions = [];
    this._action = "skip" /* SKIP */;
    this._conditionCombination = "and" /* AND */;
  }
  /**
   * Getter for conditions
   * @return {RuleCondition[]}
   */
  get conditions() {
    return this._conditions;
  }
  /**
   * Add a condition to the rule
   * @param {RuleCondition} condition - The condition to add
   */
  addCondition(condition) {
    if (!(condition instanceof RuleCondition)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".conditions",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    if (!this._conditions.includes(condition)) {
      this._conditions.push(condition);
    }
  }
  /**
   * Remove a condition from the rule
   * @param {RuleCondition} condition - The condition to remove
   * @return {boolean} - True if the condition was removed, false otherwise
   */
  removeCondition(condition) {
    if (!(condition instanceof RuleCondition)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".conditions",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    const index = this._conditions.indexOf(condition);
    if (index !== -1) {
      this._conditions.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Getter for action
   * @return {RuleActionType}
   */
  get action() {
    return this._action;
  }
  /**
   * Setter for action
   * @param {RuleActionType} action
   */
  set action(action) {
    this._action = action;
  }
  /**
   * Getter for conditionCombination
   * @return {string | RuleConditionOperator}
   */
  get conditionCombination() {
    return this._conditionCombination;
  }
  /**
   * Setter for conditionCombination
   * @param {string | RuleConditionOperator} conditionCombination
   */
  set conditionCombination(conditionCombination) {
    this._conditionCombination = conditionCombination;
  }
  /**
   * Evaluate the rule for an activity
   * @param {Activity} activity - The activity to evaluate the rule for
   * @return {boolean} - True if the rule conditions are met, false otherwise
   */
  evaluate(activity) {
    if (this._conditions.length === 0) {
      return true;
    }
    if (this._conditionCombination === "all" || this._conditionCombination === "and" /* AND */) {
      return this._conditions.every((condition) => condition.evaluate(activity));
    } else if (this._conditionCombination === "any" || this._conditionCombination === "or" /* OR */) {
      return this._conditions.some((condition) => condition.evaluate(activity));
    }
    return false;
  }
  /**
   * toJSON for SequencingRule
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      conditions: this._conditions,
      action: this._action,
      conditionCombination: this._conditionCombination
    };
    this.jsonString = false;
    return result;
  }
}
class SequencingRules extends BaseCMI {
  /**
   * Constructor for SequencingRules
   */
  constructor() {
    super("sequencingRules");
    this._preConditionRules = [];
    this._exitConditionRules = [];
    this._postConditionRules = [];
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._preConditionRules = [];
    this._exitConditionRules = [];
    this._postConditionRules = [];
  }
  /**
   * Getter for preConditionRules
   * @return {SequencingRule[]}
   */
  get preConditionRules() {
    return this._preConditionRules;
  }
  /**
   * Add a pre-condition rule
   * @param {SequencingRule} rule - The rule to add
   */
  addPreConditionRule(rule) {
    if (!(rule instanceof SequencingRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".preConditionRules",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._preConditionRules.push(rule);
  }
  /**
   * Getter for exitConditionRules
   * @return {SequencingRule[]}
   */
  get exitConditionRules() {
    return this._exitConditionRules;
  }
  /**
   * Add an exit condition rule
   * @param {SequencingRule} rule - The rule to add
   */
  addExitConditionRule(rule) {
    if (!(rule instanceof SequencingRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".exitConditionRules",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._exitConditionRules.push(rule);
  }
  /**
   * Getter for postConditionRules
   * @return {SequencingRule[]}
   */
  get postConditionRules() {
    return this._postConditionRules;
  }
  /**
   * Add a post-condition rule
   * @param {SequencingRule} rule - The rule to add
   */
  addPostConditionRule(rule) {
    if (!(rule instanceof SequencingRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".postConditionRules",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._postConditionRules.push(rule);
  }
  /**
   * Evaluate pre-condition rules for an activity
   * @param {Activity} activity - The activity to evaluate the rules for
   * @return {RuleActionType | null} - The action to take, or null if no rules are met
   */
  evaluatePreConditionRules(activity) {
    for (const rule of this._preConditionRules) {
      if (rule.evaluate(activity)) {
        return rule.action;
      }
    }
    return null;
  }
  /**
   * Evaluate exit condition rules for an activity
   * @param {Activity} activity - The activity to evaluate the rules for
   * @return {RuleActionType | null} - The action to take, or null if no rules are met
   */
  evaluateExitConditionRules(activity) {
    for (const rule of this._exitConditionRules) {
      if (rule.evaluate(activity)) {
        return rule.action;
      }
    }
    return null;
  }
  /**
   * Evaluate post-condition rules for an activity
   * @param {Activity} activity - The activity to evaluate the rules for
   * @return {RuleActionType | null} - The action to take, or null if no rules are met
   */
  evaluatePostConditionRules(activity) {
    for (const rule of this._postConditionRules) {
      if (rule.evaluate(activity)) {
        return rule.action;
      }
    }
    return null;
  }
  /**
   * toJSON for SequencingRules
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      preConditionRules: this._preConditionRules,
      exitConditionRules: this._exitConditionRules,
      postConditionRules: this._postConditionRules
    };
    this.jsonString = false;
    return result;
  }
}

class RollupCondition extends BaseCMI {
  /**
   * Constructor for RollupCondition
   * @param {RollupConditionType} condition - The condition type
   * @param {Map<string, any>} parameters - Additional parameters for the condition
   */
  constructor(condition = "always" /* ALWAYS */, parameters = /* @__PURE__ */ new Map()) {
    super("rollupCondition");
    this._condition = "always" /* ALWAYS */;
    this._parameters = /* @__PURE__ */ new Map();
    this._condition = condition;
    this._parameters = parameters;
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
  }
  /**
   * Getter for condition
   * @return {RollupConditionType}
   */
  get condition() {
    return this._condition;
  }
  /**
   * Setter for condition
   * @param {RollupConditionType} condition
   */
  set condition(condition) {
    this._condition = condition;
  }
  /**
   * Getter for parameters
   * @return {Map<string, any>}
   */
  get parameters() {
    return this._parameters;
  }
  /**
   * Setter for parameters
   * @param {Map<string, any>} parameters
   */
  set parameters(parameters) {
    this._parameters = parameters;
  }
  /**
   * Evaluate the condition for an activity
   * @param {Activity} activity - The activity to evaluate the condition for
   * @return {boolean} - True if the condition is met, false otherwise
   */
  evaluate(activity) {
    switch (this._condition) {
      case "satisfied" /* SATISFIED */:
        return activity.successStatus === SuccessStatus.PASSED;
      case "objectiveStatusKnown" /* OBJECTIVE_STATUS_KNOWN */:
        return activity.objectiveMeasureStatus;
      case "objectiveMeasureKnown" /* OBJECTIVE_MEASURE_KNOWN */:
        return activity.objectiveMeasureStatus;
      case "objectiveMeasureGreaterThan" /* OBJECTIVE_MEASURE_GREATER_THAN */: {
        const greaterThanValue = this._parameters.get("threshold") || 0;
        return activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue;
      }
      case "objectiveMeasureLessThan" /* OBJECTIVE_MEASURE_LESS_THAN */: {
        const lessThanValue = this._parameters.get("threshold") || 0;
        return activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure < lessThanValue;
      }
      case "completed" /* COMPLETED */:
        return activity.isCompleted;
      case "progressKnown" /* PROGRESS_KNOWN */:
        return activity.completionStatus !== CompletionStatus.UNKNOWN;
      case "attempted" /* ATTEMPTED */:
        return activity.attemptCount > 0;
      case "notAttempted" /* NOT_ATTEMPTED */:
        return activity.attemptCount === 0;
      case "always" /* ALWAYS */:
        return true;
      default:
        return false;
    }
  }
  /**
   * toJSON for RollupCondition
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      condition: this._condition,
      parameters: Object.fromEntries(this._parameters)
    };
    this.jsonString = false;
    return result;
  }
}
class RollupRule extends BaseCMI {
  /**
   * Constructor for RollupRule
   * @param {RollupActionType} action - The action to take when the rule conditions are met
   * @param {RollupConsiderationType} consideration - How to consider child activities
   * @param {number} minimumCount - The minimum count for AT_LEAST_COUNT consideration
   * @param {number} minimumPercent - The minimum percent for AT_LEAST_PERCENT consideration
   */
  constructor(action = "satisfied" /* SATISFIED */, consideration = "all" /* ALL */, minimumCount = 0, minimumPercent = 0) {
    super("rollupRule");
    this._conditions = [];
    this._action = "satisfied" /* SATISFIED */;
    this._consideration = "all" /* ALL */;
    this._minimumCount = 0;
    this._minimumPercent = 0;
    this._action = action;
    this._consideration = consideration;
    this._minimumCount = minimumCount;
    this._minimumPercent = minimumPercent;
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._conditions = [];
  }
  /**
   * Getter for conditions
   * @return {RollupCondition[]}
   */
  get conditions() {
    return this._conditions;
  }
  /**
   * Add a condition to the rule
   * @param {RollupCondition} condition - The condition to add
   */
  addCondition(condition) {
    if (!(condition instanceof RollupCondition)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".conditions",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._conditions.push(condition);
  }
  /**
   * Remove a condition from the rule
   * @param {RollupCondition} condition - The condition to remove
   * @return {boolean} - True if the condition was removed, false otherwise
   */
  removeCondition(condition) {
    const index = this._conditions.indexOf(condition);
    if (index !== -1) {
      this._conditions.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Getter for action
   * @return {RollupActionType}
   */
  get action() {
    return this._action;
  }
  /**
   * Setter for action
   * @param {RollupActionType} action
   */
  set action(action) {
    this._action = action;
  }
  /**
   * Getter for consideration
   * @return {RollupConsiderationType}
   */
  get consideration() {
    return this._consideration;
  }
  /**
   * Setter for consideration
   * @param {RollupConsiderationType} consideration
   */
  set consideration(consideration) {
    this._consideration = consideration;
  }
  /**
   * Getter for minimumCount
   * @return {number}
   */
  get minimumCount() {
    return this._minimumCount;
  }
  /**
   * Setter for minimumCount
   * @param {number} minimumCount
   */
  set minimumCount(minimumCount) {
    if (minimumCount >= 0) {
      this._minimumCount = minimumCount;
    }
  }
  /**
   * Getter for minimumPercent
   * @return {number}
   */
  get minimumPercent() {
    return this._minimumPercent;
  }
  /**
   * Setter for minimumPercent
   * @param {number} minimumPercent
   */
  set minimumPercent(minimumPercent) {
    if (minimumPercent >= 0 && minimumPercent <= 100) {
      this._minimumPercent = minimumPercent;
    }
  }
  /**
   * Evaluate the rule for a set of child activities
   * @param {Activity[]} children - The child activities to evaluate the rule for
   * @return {boolean} - True if the rule conditions are met, false otherwise
   */
  evaluate(children) {
    if (children.length === 0) {
      return false;
    }
    const matchingChildren = children.filter((child) => {
      return this._conditions.every((condition) => condition.evaluate(child));
    });
    switch (this._consideration) {
      case "all" /* ALL */:
        return matchingChildren.length === children.length;
      case "any" /* ANY */:
        return matchingChildren.length > 0;
      case "none" /* NONE */:
        return matchingChildren.length === 0;
      case "atLeastCount" /* AT_LEAST_COUNT */:
        return matchingChildren.length >= this._minimumCount;
      case "atLeastPercent" /* AT_LEAST_PERCENT */: {
        const percent = matchingChildren.length / children.length * 100;
        return percent >= this._minimumPercent;
      }
      default:
        return false;
    }
  }
  /**
   * toJSON for RollupRule
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      conditions: this._conditions,
      action: this._action,
      consideration: this._consideration,
      minimumCount: this._minimumCount,
      minimumPercent: this._minimumPercent
    };
    this.jsonString = false;
    return result;
  }
}
class RollupRules extends BaseCMI {
  /**
   * Constructor for RollupRules
   */
  constructor() {
    super("rollupRules");
    this._rules = [];
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._rules = [];
  }
  /**
   * Getter for rules
   * @return {RollupRule[]}
   */
  get rules() {
    return this._rules;
  }
  /**
   * Add a rule
   * @param {RollupRule} rule - The rule to add
   */
  addRule(rule) {
    if (!(rule instanceof RollupRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".rules",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._rules.push(rule);
  }
  /**
   * Remove a rule
   * @param {RollupRule} rule - The rule to remove
   * @return {boolean} - True if the rule was removed, false otherwise
   */
  removeRule(rule) {
    const index = this._rules.indexOf(rule);
    if (index !== -1) {
      this._rules.splice(index, 1);
      return true;
    }
    return false;
  }
  /**
   * Process rollup for an activity
   * @param {Activity} activity - The activity to process rollup for
   */
  processRollup(activity) {
    if (!activity || activity.children.length === 0) {
      return;
    }
    const children = activity.children;
    let completionRollup = false;
    let successRollup = false;
    for (const rule of this._rules) {
      if (rule.evaluate(children)) {
        switch (rule.action) {
          case "satisfied" /* SATISFIED */:
            activity.successStatus = SuccessStatus.PASSED;
            successRollup = true;
            break;
          case "notSatisfied" /* NOT_SATISFIED */:
            activity.successStatus = SuccessStatus.FAILED;
            successRollup = true;
            break;
          case "completed" /* COMPLETED */:
            activity.completionStatus = CompletionStatus.COMPLETED;
            activity.isCompleted = true;
            completionRollup = true;
            break;
          case "incomplete" /* INCOMPLETE */:
            activity.completionStatus = CompletionStatus.INCOMPLETE;
            activity.isCompleted = false;
            completionRollup = true;
            break;
        }
      }
    }
    if (!completionRollup) {
      this._defaultCompletionRollup(activity, children);
    }
    if (!successRollup) {
      this._defaultSuccessRollup(activity, children);
    }
  }
  /**
   * Default completion rollup
   * @param {Activity} activity - The activity to process rollup for
   * @param {Activity[]} children - The child activities
   * @private
   */
  _defaultCompletionRollup(activity, children) {
    const allCompleted = children.every((child) => child.isCompleted);
    if (allCompleted) {
      activity.completionStatus = CompletionStatus.COMPLETED;
      activity.isCompleted = true;
    } else {
      const anyIncomplete = children.some(
        (child) => child.completionStatus === CompletionStatus.INCOMPLETE
      );
      if (anyIncomplete) {
        activity.completionStatus = CompletionStatus.INCOMPLETE;
        activity.isCompleted = false;
      }
    }
  }
  /**
   * Default success rollup
   * @param {Activity} activity - The activity to process rollup for
   * @param {Activity[]} children - The child activities
   * @private
   */
  _defaultSuccessRollup(activity, children) {
    const allSatisfied = children.every((child) => child.successStatus === SuccessStatus.PASSED);
    if (allSatisfied) {
      activity.successStatus = SuccessStatus.PASSED;
    } else {
      const anyNotSatisfied = children.some(
        (child) => child.successStatus === SuccessStatus.FAILED
      );
      if (anyNotSatisfied) {
        activity.successStatus = SuccessStatus.FAILED;
      }
    }
  }
  /**
   * toJSON for RollupRules
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      rules: this._rules
    };
    this.jsonString = false;
    return result;
  }
}

const ValidLanguages = [
  "aa",
  "ab",
  "ae",
  "af",
  "ak",
  "am",
  "an",
  "ar",
  "as",
  "av",
  "ay",
  "az",
  "ba",
  "be",
  "bg",
  "bh",
  "bi",
  "bm",
  "bn",
  "bo",
  "br",
  "bs",
  "ca",
  "ce",
  "ch",
  "co",
  "cr",
  "cs",
  "cu",
  "cv",
  "cy",
  "da",
  "de",
  "dv",
  "dz",
  "ee",
  "el",
  "en",
  "eo",
  "es",
  "et",
  "eu",
  "fa",
  "ff",
  "fi",
  "fj",
  "fo",
  "fr",
  "fy",
  "ga",
  "gd",
  "gl",
  "gn",
  "gu",
  "gv",
  "ha",
  "he",
  "hi",
  "ho",
  "hr",
  "ht",
  "hu",
  "hy",
  "hz",
  "ia",
  "id",
  "ie",
  "ig",
  "ii",
  "ik",
  "io",
  "is",
  "it",
  "iu",
  "ja",
  "jv",
  "ka",
  "kg",
  "ki",
  "kj",
  "kk",
  "kl",
  "km",
  "kn",
  "ko",
  "kr",
  "ks",
  "ku",
  "kv",
  "kw",
  "ky",
  "la",
  "lb",
  "lg",
  "li",
  "ln",
  "lo",
  "lt",
  "lu",
  "lv",
  "mg",
  "mh",
  "mi",
  "mk",
  "ml",
  "mn",
  "mo",
  "mr",
  "ms",
  "mt",
  "my",
  "na",
  "nb",
  "nd",
  "ne",
  "ng",
  "nl",
  "nn",
  "no",
  "nr",
  "nv",
  "ny",
  "oc",
  "oj",
  "om",
  "or",
  "os",
  "pa",
  "pi",
  "pl",
  "ps",
  "pt",
  "qu",
  "rm",
  "rn",
  "ro",
  "ru",
  "rw",
  "sa",
  "sc",
  "sd",
  "se",
  "sg",
  "sh",
  "si",
  "sk",
  "sl",
  "sm",
  "sn",
  "so",
  "sq",
  "sr",
  "ss",
  "st",
  "su",
  "sv",
  "sw",
  "ta",
  "te",
  "tg",
  "th",
  "ti",
  "tk",
  "tl",
  "tn",
  "to",
  "tr",
  "ts",
  "tt",
  "tw",
  "ty",
  "ug",
  "uk",
  "ur",
  "uz",
  "ve",
  "vi",
  "vo",
  "wa",
  "wo",
  "xh",
  "yi",
  "yo",
  "za",
  "zh",
  "zu",
  "aar",
  "abk",
  "ave",
  "afr",
  "aka",
  "amh",
  "arg",
  "ara",
  "asm",
  "ava",
  "aym",
  "aze",
  "bak",
  "bel",
  "bul",
  "bih",
  "bis",
  "bam",
  "ben",
  "tib",
  "bod",
  "bre",
  "bos",
  "cat",
  "che",
  "cha",
  "cos",
  "cre",
  "cze",
  "ces",
  "chu",
  "chv",
  "wel",
  "cym",
  "dan",
  "ger",
  "deu",
  "div",
  "dzo",
  "ewe",
  "gre",
  "ell",
  "eng",
  "epo",
  "spa",
  "est",
  "baq",
  "eus",
  "per",
  "fas",
  "ful",
  "fin",
  "fij",
  "fao",
  "fre",
  "fra",
  "fry",
  "gle",
  "gla",
  "glg",
  "grn",
  "guj",
  "glv",
  "hau",
  "heb",
  "hin",
  "hmo",
  "hrv",
  "hat",
  "hun",
  "arm",
  "hye",
  "her",
  "ina",
  "ind",
  "ile",
  "ibo",
  "iii",
  "ipk",
  "ido",
  "ice",
  "isl",
  "ita",
  "iku",
  "jpn",
  "jav",
  "geo",
  "kat",
  "kon",
  "kik",
  "kua",
  "kaz",
  "kal",
  "khm",
  "kan",
  "kor",
  "kau",
  "kas",
  "kur",
  "kom",
  "cor",
  "kir",
  "lat",
  "ltz",
  "lug",
  "lim",
  "lin",
  "lao",
  "lit",
  "lub",
  "lav",
  "mlg",
  "mah",
  "mao",
  "mri",
  "mac",
  "mkd",
  "mal",
  "mon",
  "mol",
  "mar",
  "may",
  "msa",
  "mlt",
  "bur",
  "mya",
  "nau",
  "nob",
  "nde",
  "nep",
  "ndo",
  "dut",
  "nld",
  "nno",
  "nor",
  "nbl",
  "nav",
  "nya",
  "oci",
  "oji",
  "orm",
  "ori",
  "oss",
  "pan",
  "pli",
  "pol",
  "pus",
  "por",
  "que",
  "roh",
  "run",
  "rum",
  "ron",
  "rus",
  "kin",
  "san",
  "srd",
  "snd",
  "sme",
  "sag",
  "slo",
  "sin",
  "slk",
  "slv",
  "smo",
  "sna",
  "som",
  "alb",
  "sqi",
  "srp",
  "ssw",
  "sot",
  "sun",
  "swe",
  "swa",
  "tam",
  "tel",
  "tgk",
  "tha",
  "tir",
  "tuk",
  "tgl",
  "tsn",
  "ton",
  "tur",
  "tso",
  "tat",
  "twi",
  "tah",
  "uig",
  "ukr",
  "urd",
  "uzb",
  "ven",
  "vie",
  "vol",
  "wln",
  "wol",
  "xho",
  "yid",
  "yor",
  "zha",
  "chi",
  "zho",
  "zul"
];

class Activity extends BaseCMI {
  /**
   * Constructor for Activity
   * @param {string} id - The unique identifier for this activity
   * @param {string} title - The title of this activity
   */
  constructor(id = "", title = "") {
    super("activity");
    this._id = "";
    this._title = "";
    this._children = [];
    this._parent = null;
    this._isVisible = true;
    this._isActive = false;
    this._isSuspended = false;
    this._isCompleted = false;
    this._completionStatus = CompletionStatus.UNKNOWN;
    this._successStatus = SuccessStatus.UNKNOWN;
    this._attemptCount = 0;
    this._attemptCompletionAmount = 0;
    this._attemptAbsoluteDuration = "PT0H0M0S";
    this._attemptExperiencedDuration = "PT0H0M0S";
    this._activityAbsoluteDuration = "PT0H0M0S";
    this._activityExperiencedDuration = "PT0H0M0S";
    this._objectiveSatisfiedStatus = false;
    this._objectiveMeasureStatus = false;
    this._objectiveNormalizedMeasure = 0;
    this._id = id;
    this._title = title;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    for (const child of this._children) {
      child.initialize();
    }
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._isActive = false;
    this._isSuspended = false;
    this._isCompleted = false;
    this._completionStatus = CompletionStatus.UNKNOWN;
    this._successStatus = SuccessStatus.UNKNOWN;
    this._attemptCount = 0;
    this._attemptCompletionAmount = 0;
    this._attemptAbsoluteDuration = "PT0H0M0S";
    this._attemptExperiencedDuration = "PT0H0M0S";
    this._activityAbsoluteDuration = "PT0H0M0S";
    this._activityExperiencedDuration = "PT0H0M0S";
    this._objectiveSatisfiedStatus = false;
    this._objectiveMeasureStatus = false;
    this._objectiveNormalizedMeasure = 0;
    for (const child of this._children) {
      child.reset();
    }
  }
  /**
   * Getter for id
   * @return {string}
   */
  get id() {
    return this._id;
  }
  /**
   * Setter for id
   * @param {string} id
   */
  set id(id) {
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }
  /**
   * Getter for title
   * @return {string}
   */
  get title() {
    return this._title;
  }
  /**
   * Setter for title
   * @param {string} title
   */
  set title(title) {
    if (check2004ValidFormat(this._cmi_element + ".title", title, scorm2004_regex.CMILangString250)) {
      this._title = title;
    }
  }
  /**
   * Getter for children
   * @return {Activity[]}
   */
  get children() {
    return this._children;
  }
  /**
   * Add a child activity to this activity
   * @param {Activity} child - The child activity to add
   */
  addChild(child) {
    if (!(child instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".children",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    child._parent = this;
    this._children.push(child);
  }
  /**
   * Remove a child activity from this activity
   * @param {Activity} child - The child activity to remove
   * @return {boolean} - True if the child was removed, false otherwise
   */
  removeChild(child) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
      child._parent = null;
      return true;
    }
    return false;
  }
  /**
   * Getter for parent
   * @return {Activity | null}
   */
  get parent() {
    return this._parent;
  }
  /**
   * Getter for isVisible
   * @return {boolean}
   */
  get isVisible() {
    return this._isVisible;
  }
  /**
   * Setter for isVisible
   * @param {boolean} isVisible
   */
  set isVisible(isVisible) {
    this._isVisible = isVisible;
  }
  /**
   * Getter for isActive
   * @return {boolean}
   */
  get isActive() {
    return this._isActive;
  }
  /**
   * Setter for isActive
   * @param {boolean} isActive
   */
  set isActive(isActive) {
    this._isActive = isActive;
  }
  /**
   * Getter for isSuspended
   * @return {boolean}
   */
  get isSuspended() {
    return this._isSuspended;
  }
  /**
   * Setter for isSuspended
   * @param {boolean} isSuspended
   */
  set isSuspended(isSuspended) {
    this._isSuspended = isSuspended;
  }
  /**
   * Getter for isCompleted
   * @return {boolean}
   */
  get isCompleted() {
    return this._isCompleted;
  }
  /**
   * Setter for isCompleted
   * @param {boolean} isCompleted
   */
  set isCompleted(isCompleted) {
    this._isCompleted = isCompleted;
  }
  /**
   * Getter for completionStatus
   * @return {CompletionStatus}
   */
  get completionStatus() {
    return this._completionStatus;
  }
  /**
   * Setter for completionStatus
   * @param {CompletionStatus} completionStatus
   */
  set completionStatus(completionStatus) {
    this._completionStatus = completionStatus;
    this._isCompleted = completionStatus === CompletionStatus.COMPLETED;
  }
  /**
   * Getter for successStatus
   * @return {SuccessStatus}
   */
  get successStatus() {
    return this._successStatus;
  }
  /**
   * Setter for successStatus
   * @param {SuccessStatus} successStatus
   */
  set successStatus(successStatus) {
    this._successStatus = successStatus;
  }
  /**
   * Getter for attemptCount
   * @return {number}
   */
  get attemptCount() {
    return this._attemptCount;
  }
  /**
   * Increment the attempt count
   */
  incrementAttemptCount() {
    this._attemptCount++;
  }
  /**
   * Getter for objectiveMeasureStatus
   * @return {boolean}
   */
  get objectiveMeasureStatus() {
    return this._objectiveMeasureStatus;
  }
  /**
   * Setter for objectiveMeasureStatus
   * @param {boolean} objectiveMeasureStatus
   */
  set objectiveMeasureStatus(objectiveMeasureStatus) {
    this._objectiveMeasureStatus = objectiveMeasureStatus;
  }
  /**
   * Getter for objectiveNormalizedMeasure
   * @return {number}
   */
  get objectiveNormalizedMeasure() {
    return this._objectiveNormalizedMeasure;
  }
  /**
   * Setter for objectiveNormalizedMeasure
   * @param {number} objectiveNormalizedMeasure
   */
  set objectiveNormalizedMeasure(objectiveNormalizedMeasure) {
    this._objectiveNormalizedMeasure = objectiveNormalizedMeasure;
  }
  /**
   * toJSON for Activity
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      id: this._id,
      title: this._title,
      isVisible: this._isVisible,
      isActive: this._isActive,
      isSuspended: this._isSuspended,
      isCompleted: this._isCompleted,
      completionStatus: this._completionStatus,
      successStatus: this._successStatus,
      attemptCount: this._attemptCount,
      attemptCompletionAmount: this._attemptCompletionAmount,
      attemptAbsoluteDuration: this._attemptAbsoluteDuration,
      attemptExperiencedDuration: this._attemptExperiencedDuration,
      activityAbsoluteDuration: this._activityAbsoluteDuration,
      activityExperiencedDuration: this._activityExperiencedDuration,
      objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
      objectiveMeasureStatus: this._objectiveMeasureStatus,
      objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
      children: this._children.map((child) => child.toJSON())
    };
    this.jsonString = false;
    return result;
  }
}

class ActivityTree extends BaseCMI {
  /**
   * Constructor for ActivityTree
   */
  constructor() {
    super("activityTree");
    this._root = null;
    this._currentActivity = null;
    this._suspendedActivity = null;
    this._activities = /* @__PURE__ */ new Map();
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    if (this._root) {
      this._root.initialize();
    }
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._currentActivity = null;
    this._suspendedActivity = null;
    if (this._root) {
      this._root.reset();
    }
  }
  /**
   * Getter for root
   * @return {Activity | null}
   */
  get root() {
    return this._root;
  }
  /**
   * Setter for root
   * @param {Activity} root
   */
  set root(root) {
    if (root !== null && !(root instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".root",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._root = root;
    if (root) {
      this._activities.set(root.id, root);
      this._addActivitiesToMap(root);
    }
  }
  /**
   * Recursively add activities to the activities map
   * @param {Activity} activity
   * @private
   */
  _addActivitiesToMap(activity) {
    for (const child of activity.children) {
      this._activities.set(child.id, child);
      this._addActivitiesToMap(child);
    }
  }
  /**
   * Getter for currentActivity
   * @return {Activity | null}
   */
  get currentActivity() {
    return this._currentActivity;
  }
  /**
   * Setter for currentActivity
   * @param {Activity | null} activity
   */
  set currentActivity(activity) {
    if (activity !== null && !(activity instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".currentActivity",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    if (this._currentActivity) {
      this._currentActivity.isActive = false;
    }
    this._currentActivity = activity;
    if (activity) {
      activity.isActive = true;
    }
  }
  /**
   * Getter for suspendedActivity
   * @return {Activity | null}
   */
  get suspendedActivity() {
    return this._suspendedActivity;
  }
  /**
   * Setter for suspendedActivity
   * @param {Activity | null} activity
   */
  set suspendedActivity(activity) {
    if (activity !== null && !(activity instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".suspendedActivity",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    if (this._suspendedActivity) {
      this._suspendedActivity.isSuspended = false;
    }
    this._suspendedActivity = activity;
    if (activity) {
      activity.isSuspended = true;
    }
  }
  /**
   * Get an activity by ID
   * @param {string} id - The ID of the activity to get
   * @return {Activity | undefined} - The activity with the given ID, or undefined if not found
   */
  getActivity(id) {
    return this._activities.get(id);
  }
  /**
   * Get all activities in the tree
   * @return {Activity[]} - An array of all activities in the tree
   */
  getAllActivities() {
    return Array.from(this._activities.values());
  }
  /**
   * Get the parent of an activity
   * @param {Activity} activity - The activity to get the parent of
   * @return {Activity | null} - The parent of the activity, or null if it has no parent
   */
  getParent(activity) {
    return activity.parent;
  }
  /**
   * Get the children of an activity
   * @param {Activity} activity - The activity to get the children of
   * @return {Activity[]} - An array of the activity's children
   */
  getChildren(activity) {
    return activity.children;
  }
  /**
   * Get the siblings of an activity
   * @param {Activity} activity - The activity to get the siblings of
   * @return {Activity[]} - An array of the activity's siblings
   */
  getSiblings(activity) {
    if (!activity.parent) {
      return [];
    }
    return activity.parent.children.filter((child) => child !== activity);
  }
  /**
   * Get the next sibling of an activity
   * @param {Activity} activity - The activity to get the next sibling of
   * @return {Activity | null} - The next sibling of the activity, or null if it has no next sibling
   */
  getNextSibling(activity) {
    if (!activity.parent) {
      return null;
    }
    const siblings = activity.parent.children;
    const index = siblings.indexOf(activity);
    if (index === -1 || index === siblings.length - 1) {
      return null;
    }
    return siblings[index + 1];
  }
  /**
   * Get the previous sibling of an activity
   * @param {Activity} activity - The activity to get the previous sibling of
   * @return {Activity | null} - The previous sibling of the activity, or null if it has no previous sibling
   */
  getPreviousSibling(activity) {
    if (!activity.parent) {
      return null;
    }
    const siblings = activity.parent.children;
    const index = siblings.indexOf(activity);
    if (index <= 0) {
      return null;
    }
    return siblings[index - 1];
  }
  /**
   * Get the first child of an activity
   * @param {Activity} activity - The activity to get the first child of
   * @return {Activity | null} - The first child of the activity, or null if it has no children
   */
  getFirstChild(activity) {
    if (activity.children.length === 0) {
      return null;
    }
    return activity.children[0];
  }
  /**
   * Get the last child of an activity
   * @param {Activity} activity - The activity to get the last child of
   * @return {Activity | null} - The last child of the activity, or null if it has no children
   */
  getLastChild(activity) {
    if (activity.children.length === 0) {
      return null;
    }
    return activity.children[activity.children.length - 1];
  }
  /**
   * Get the common ancestor of two activities
   * @param {Activity} activity1 - The first activity
   * @param {Activity} activity2 - The second activity
   * @return {Activity | null} - The common ancestor of the two activities, or null if they have no common ancestor
   */
  getCommonAncestor(activity1, activity2) {
    const path1 = [];
    let current = activity1;
    while (current) {
      path1.unshift(current);
      current = current.parent;
    }
    current = activity2;
    while (current) {
      if (path1.includes(current)) {
        return current;
      }
      current = current.parent;
    }
    return null;
  }
  /**
   * toJSON for ActivityTree
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      root: this._root,
      currentActivity: this._currentActivity ? this._currentActivity.id : null,
      suspendedActivity: this._suspendedActivity ? this._suspendedActivity.id : null
    };
    this.jsonString = false;
    return result;
  }
}

class SequencingControls extends BaseCMI {
  /**
   * Constructor for SequencingControls
   */
  constructor() {
    super("sequencingControls");
    // Sequencing Control Modes
    this._enabled = true;
    this._choiceExit = true;
    this._flow = false;
    this._forwardOnly = false;
    this._useCurrentAttemptObjectiveInfo = true;
    this._useCurrentAttemptProgressInfo = true;
    // Constrain Choice Controls
    this._preventActivation = false;
    this._constrainChoice = false;
    // Rollup Controls
    this._rollupObjectiveSatisfied = true;
    this._rollupProgressCompletion = true;
    this._objectiveMeasureWeight = 1;
  }
  /**
   * Reset the sequencing controls to their default values
   */
  reset() {
    this._initialized = false;
    this._enabled = true;
    this._choiceExit = true;
    this._flow = false;
    this._forwardOnly = false;
    this._useCurrentAttemptObjectiveInfo = true;
    this._useCurrentAttemptProgressInfo = true;
    this._preventActivation = false;
    this._constrainChoice = false;
    this._rollupObjectiveSatisfied = true;
    this._rollupProgressCompletion = true;
    this._objectiveMeasureWeight = 1;
  }
  /**
   * Getter for enabled
   * @return {boolean}
   */
  get enabled() {
    return this._enabled;
  }
  /**
   * Setter for enabled
   * @param {boolean} enabled
   */
  set enabled(enabled) {
    this._enabled = enabled;
  }
  /**
   * Getter for choiceExit
   * @return {boolean}
   */
  get choiceExit() {
    return this._choiceExit;
  }
  /**
   * Setter for choiceExit
   * @param {boolean} choiceExit
   */
  set choiceExit(choiceExit) {
    this._choiceExit = choiceExit;
  }
  /**
   * Getter for flow
   * @return {boolean}
   */
  get flow() {
    return this._flow;
  }
  /**
   * Setter for flow
   * @param {boolean} flow
   */
  set flow(flow) {
    this._flow = flow;
  }
  /**
   * Getter for forwardOnly
   * @return {boolean}
   */
  get forwardOnly() {
    return this._forwardOnly;
  }
  /**
   * Setter for forwardOnly
   * @param {boolean} forwardOnly
   */
  set forwardOnly(forwardOnly) {
    this._forwardOnly = forwardOnly;
  }
  /**
   * Getter for useCurrentAttemptObjectiveInfo
   * @return {boolean}
   */
  get useCurrentAttemptObjectiveInfo() {
    return this._useCurrentAttemptObjectiveInfo;
  }
  /**
   * Setter for useCurrentAttemptObjectiveInfo
   * @param {boolean} useCurrentAttemptObjectiveInfo
   */
  set useCurrentAttemptObjectiveInfo(useCurrentAttemptObjectiveInfo) {
    this._useCurrentAttemptObjectiveInfo = useCurrentAttemptObjectiveInfo;
  }
  /**
   * Getter for useCurrentAttemptProgressInfo
   * @return {boolean}
   */
  get useCurrentAttemptProgressInfo() {
    return this._useCurrentAttemptProgressInfo;
  }
  /**
   * Setter for useCurrentAttemptProgressInfo
   * @param {boolean} useCurrentAttemptProgressInfo
   */
  set useCurrentAttemptProgressInfo(useCurrentAttemptProgressInfo) {
    this._useCurrentAttemptProgressInfo = useCurrentAttemptProgressInfo;
  }
  /**
   * Getter for preventActivation
   * @return {boolean}
   */
  get preventActivation() {
    return this._preventActivation;
  }
  /**
   * Setter for preventActivation
   * @param {boolean} preventActivation
   */
  set preventActivation(preventActivation) {
    this._preventActivation = preventActivation;
  }
  /**
   * Getter for constrainChoice
   * @return {boolean}
   */
  get constrainChoice() {
    return this._constrainChoice;
  }
  /**
   * Setter for constrainChoice
   * @param {boolean} constrainChoice
   */
  set constrainChoice(constrainChoice) {
    this._constrainChoice = constrainChoice;
  }
  /**
   * Getter for rollupObjectiveSatisfied
   * @return {boolean}
   */
  get rollupObjectiveSatisfied() {
    return this._rollupObjectiveSatisfied;
  }
  /**
   * Setter for rollupObjectiveSatisfied
   * @param {boolean} rollupObjectiveSatisfied
   */
  set rollupObjectiveSatisfied(rollupObjectiveSatisfied) {
    this._rollupObjectiveSatisfied = rollupObjectiveSatisfied;
  }
  /**
   * Getter for rollupProgressCompletion
   * @return {boolean}
   */
  get rollupProgressCompletion() {
    return this._rollupProgressCompletion;
  }
  /**
   * Setter for rollupProgressCompletion
   * @param {boolean} rollupProgressCompletion
   */
  set rollupProgressCompletion(rollupProgressCompletion) {
    this._rollupProgressCompletion = rollupProgressCompletion;
  }
  /**
   * Getter for objectiveMeasureWeight
   * @return {number}
   */
  get objectiveMeasureWeight() {
    return this._objectiveMeasureWeight;
  }
  /**
   * Setter for objectiveMeasureWeight
   * @param {number} objectiveMeasureWeight
   */
  set objectiveMeasureWeight(objectiveMeasureWeight) {
    if (objectiveMeasureWeight >= 0 && objectiveMeasureWeight <= 1) {
      this._objectiveMeasureWeight = objectiveMeasureWeight;
    }
  }
  /**
   * Check if choice navigation is allowed
   * @return {boolean} - True if choice navigation is allowed, false otherwise
   */
  isChoiceNavigationAllowed() {
    return this._enabled && !this._constrainChoice;
  }
  /**
   * Check if flow navigation is allowed
   * @return {boolean} - True if flow navigation is allowed, false otherwise
   */
  isFlowNavigationAllowed() {
    return this._enabled && this._flow;
  }
  /**
   * Check if forward navigation is allowed
   * @return {boolean} - True if forward navigation is allowed, false otherwise
   */
  isForwardNavigationAllowed() {
    return this._enabled && (!this._forwardOnly || this._flow);
  }
  /**
   * Check if backward navigation is allowed
   * @return {boolean} - True if backward navigation is allowed, false otherwise
   */
  isBackwardNavigationAllowed() {
    return this._enabled && !this._forwardOnly;
  }
  /**
   * toJSON for SequencingControls
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      enabled: this._enabled,
      choiceExit: this._choiceExit,
      flow: this._flow,
      forwardOnly: this._forwardOnly,
      useCurrentAttemptObjectiveInfo: this._useCurrentAttemptObjectiveInfo,
      useCurrentAttemptProgressInfo: this._useCurrentAttemptProgressInfo,
      preventActivation: this._preventActivation,
      constrainChoice: this._constrainChoice,
      rollupObjectiveSatisfied: this._rollupObjectiveSatisfied,
      rollupProgressCompletion: this._rollupProgressCompletion,
      objectiveMeasureWeight: this._objectiveMeasureWeight
    };
    this.jsonString = false;
    return result;
  }
}

class Sequencing extends BaseCMI {
  /**
   * Constructor for Sequencing
   */
  constructor() {
    super("sequencing");
    this._adlNav = null;
    this._activityTree = new ActivityTree();
    this._sequencingRules = new SequencingRules();
    this._sequencingControls = new SequencingControls();
    this._rollupRules = new RollupRules();
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this._activityTree.initialize();
    this._sequencingRules.initialize();
    this._sequencingControls.initialize();
    this._rollupRules.initialize();
  }
  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._activityTree.reset();
    this._sequencingRules.reset();
    this._sequencingControls.reset();
    this._rollupRules.reset();
  }
  /**
   * Getter for activityTree
   * @return {ActivityTree}
   */
  get activityTree() {
    return this._activityTree;
  }
  /**
   * Setter for activityTree
   * @param {ActivityTree} activityTree
   */
  set activityTree(activityTree) {
    if (!(activityTree instanceof ActivityTree)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".activityTree",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._activityTree = activityTree;
  }
  /**
   * Getter for sequencingRules
   * @return {SequencingRules}
   */
  get sequencingRules() {
    return this._sequencingRules;
  }
  /**
   * Setter for sequencingRules
   * @param {SequencingRules} sequencingRules
   */
  set sequencingRules(sequencingRules) {
    if (!(sequencingRules instanceof SequencingRules)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".sequencingRules",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._sequencingRules = sequencingRules;
  }
  /**
   * Getter for sequencingControls
   * @return {SequencingControls}
   */
  get sequencingControls() {
    return this._sequencingControls;
  }
  /**
   * Setter for sequencingControls
   * @param {SequencingControls} sequencingControls
   */
  set sequencingControls(sequencingControls) {
    if (!(sequencingControls instanceof SequencingControls)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".sequencingControls",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._sequencingControls = sequencingControls;
  }
  /**
   * Getter for rollupRules
   * @return {RollupRules}
   */
  get rollupRules() {
    return this._rollupRules;
  }
  /**
   * Setter for rollupRules
   * @param {RollupRules} rollupRules
   */
  set rollupRules(rollupRules) {
    if (!(rollupRules instanceof RollupRules)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".rollupRules",
        scorm2004_errors$1.TYPE_MISMATCH
      );
    }
    this._rollupRules = rollupRules;
  }
  /**
   * Getter for adlNav
   * @return {ADLNav | null}
   */
  get adlNav() {
    return this._adlNav;
  }
  /**
   * Setter for adlNav
   * @param {ADLNav | null} adlNav
   */
  set adlNav(adlNav) {
    this._adlNav = adlNav;
  }
  /**
   * Process navigation request
   * @param {string} request - The navigation request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processNavigationRequest(request) {
    if (!this._adlNav) {
      return false;
    }
    this._adlNav.request = request;
    const currentActivity = this._activityTree.currentActivity;
    if (!currentActivity) {
      return false;
    }
    const preConditionAction = this._sequencingRules.evaluatePreConditionRules(currentActivity);
    if (preConditionAction) {
      switch (preConditionAction) {
        case RuleActionType.SKIP:
          return false;
        case RuleActionType.DISABLED:
          return false;
        case RuleActionType.HIDE_FROM_CHOICE:
          return false;
        case RuleActionType.STOP_FORWARD_TRAVERSAL:
          return false;
      }
    }
    switch (request) {
      case "continue":
        return this.processContinueRequest(currentActivity);
      case "previous":
        return this.processPreviousRequest(currentActivity);
      case "choice":
        return false;
      case "exit":
        return this.processExitRequest(currentActivity);
      case "exitAll":
        return this.processExitAllRequest();
      case "abandon":
        return this.processAbandonRequest(currentActivity);
      case "abandonAll":
        return this.processAbandonAllRequest();
      case "suspendAll":
        return this.processSuspendAllRequest(currentActivity);
      default:
        return false;
    }
  }
  /**
   * Process continue request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processContinueRequest(currentActivity) {
    if (!this._sequencingControls.isForwardNavigationAllowed()) {
      return false;
    }
    const nextActivity = this._activityTree.getNextSibling(currentActivity);
    if (!nextActivity) {
      return false;
    }
    if (this._handleExitConditionAction(currentActivity)) {
      return true;
    }
    this._activityTree.currentActivity = nextActivity;
    const postConditionAction = this._sequencingRules.evaluatePostConditionRules(nextActivity);
    if (postConditionAction) {
      switch (postConditionAction) {
        case RuleActionType.RETRY:
          nextActivity.incrementAttemptCount();
          return true;
        case RuleActionType.RETRY_ALL:
          this._activityTree.getAllActivities().forEach((activity) => {
            activity.incrementAttemptCount();
          });
          return true;
        case RuleActionType.CONTINUE:
          return this.processContinueRequest(nextActivity);
        case RuleActionType.PREVIOUS:
          return this.processPreviousRequest(nextActivity);
        case RuleActionType.EXIT:
          this._activityTree.currentActivity = currentActivity;
          return true;
      }
    }
    return true;
  }
  /**
   * Process previous request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processPreviousRequest(currentActivity) {
    if (!this._sequencingControls.isBackwardNavigationAllowed()) {
      return false;
    }
    const previousActivity = this._activityTree.getPreviousSibling(currentActivity);
    if (!previousActivity) {
      return false;
    }
    if (this._handleExitConditionAction(currentActivity)) {
      return true;
    }
    this._activityTree.currentActivity = previousActivity;
    const postConditionAction = this._sequencingRules.evaluatePostConditionRules(previousActivity);
    if (postConditionAction) {
      switch (postConditionAction) {
        case RuleActionType.RETRY:
          previousActivity.incrementAttemptCount();
          return true;
        case RuleActionType.RETRY_ALL:
          this._activityTree.getAllActivities().forEach((activity) => {
            activity.incrementAttemptCount();
          });
          return true;
        case RuleActionType.CONTINUE:
          return this.processContinueRequest(previousActivity);
        case RuleActionType.PREVIOUS:
          return this.processPreviousRequest(previousActivity);
        case RuleActionType.EXIT:
          this._activityTree.currentActivity = currentActivity;
          return true;
      }
    }
    return true;
  }
  /**
   * Process exit request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processExitRequest(currentActivity) {
    if (!this._sequencingControls.choiceExit) {
      return false;
    }
    const parent = currentActivity.parent;
    if (!parent) {
      return false;
    }
    this._activityTree.currentActivity = parent;
    return true;
  }
  /**
   * Process exit all request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processExitAllRequest() {
    if (!this._sequencingControls.choiceExit) {
      return false;
    }
    this._activityTree.currentActivity = null;
    return true;
  }
  /**
   * Process abandon request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processAbandonRequest(currentActivity) {
    const parent = currentActivity.parent;
    if (!parent) {
      return false;
    }
    this._activityTree.currentActivity = parent;
    return true;
  }
  /**
   * Process abandon all request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processAbandonAllRequest() {
    this._activityTree.currentActivity = null;
    return true;
  }
  /**
   * Process suspend all request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processSuspendAllRequest(currentActivity) {
    this._activityTree.suspendedActivity = currentActivity;
    this._activityTree.currentActivity = null;
    return true;
  }
  /**
   * Process rollup for the entire activity tree
   */
  processRollup() {
    const root = this._activityTree.root;
    if (!root) {
      return;
    }
    this._processRollupRecursive(root);
  }
  /**
   * Handle exit condition actions for an activity
   * @param {Activity} activity - The activity to handle exit conditions for
   * @return {boolean} - True if an exit action was handled, false otherwise
   * @private
   */
  _handleExitConditionAction(activity) {
    const exitConditionAction = this._sequencingRules.evaluateExitConditionRules(activity);
    if (exitConditionAction) {
      switch (exitConditionAction) {
        case RuleActionType.EXIT_PARENT: {
          const parent = activity.parent;
          if (parent) {
            this._activityTree.currentActivity = parent;
            return true;
          }
          return false;
        }
        case RuleActionType.EXIT_ALL:
          this._activityTree.currentActivity = null;
          return true;
      }
    }
    return false;
  }
  /**
   * Process rollup recursively
   * @param {Activity} activity - The activity to process rollup for
   * @private
   */
  _processRollupRecursive(activity) {
    for (const child of activity.children) {
      this._processRollupRecursive(child);
    }
    this._rollupRules.processRollup(activity);
  }
  /**
   * toJSON for Sequencing
   * @return {object}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      activityTree: this._activityTree,
      sequencingRules: this._sequencingRules,
      sequencingControls: this._sequencingControls,
      rollupRules: this._rollupRules
    };
    this.jsonString = false;
    return result;
  }
}

class Scorm2004API extends BaseAPI {
  /**
   * Constructor for SCORM 2004 API
   * @param {Settings} settings
   */
  constructor(settings) {
    if (settings) {
      if (settings.mastery_override === void 0) {
        settings.mastery_override = false;
      }
    }
    super(scorm2004_errors$1, settings);
    this._version = "1.0";
    this._globalObjectives = [];
    this._extractedScoItemIds = [];
    this.cmi = new CMI();
    this.adl = new ADL();
    this._sequencing = new Sequencing();
    this.adl.sequencing = this._sequencing;
    if (settings?.sequencing) {
      this.configureSequencing(settings.sequencing);
    }
    this.Initialize = this.lmsInitialize;
    this.Terminate = this.lmsFinish;
    this.GetValue = this.lmsGetValue;
    this.SetValue = this.lmsSetValue;
    this.Commit = this.lmsCommit;
    this.GetLastError = this.lmsGetLastError;
    this.GetErrorString = this.lmsGetErrorString;
    this.GetDiagnostic = this.lmsGetDiagnostic;
  }
  /**
   * Called when the API needs to be reset
   */
  reset(settings) {
    this.commonReset(settings);
    this.cmi?.reset();
    this.adl?.reset();
    this._sequencing?.reset();
  }
  /**
   * Getter for _version
   * @return {string}
   */
  get version() {
    return this._version;
  }
  /**
   * Getter for _globalObjectives
   */
  get globalObjectives() {
    return this._globalObjectives;
  }
  /**
   * Initialize function from SCORM 2004 Spec
   *
   * @return {string} bool
   */
  lmsInitialize() {
    this.cmi.initialize();
    return this.initialize(
      "Initialize",
      "LMS was already initialized!",
      "LMS is already finished!"
    );
  }
  /**
   * Terminate function from SCORM 2004 Spec
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
    const result = await this.terminate("Terminate", true);
    if (result === global_constants.SCORM_TRUE) {
      if (this.adl.nav.request !== "_none_") {
        const navActions = {
          continue: "SequenceNext",
          previous: "SequencePrevious",
          choice: "SequenceChoice",
          jump: "SequenceJump",
          exit: "SequenceExit",
          exitAll: "SequenceExitAll",
          abandon: "SequenceAbandon",
          abandonAll: "SequenceAbandonAll"
        };
        let request = this.adl.nav.request;
        const choiceJumpRegex = new RegExp(scorm2004_regex.NAVEvent);
        const matches = request.match(choiceJumpRegex);
        let target = "";
        if (matches) {
          if (matches.groups?.choice_target) {
            target = matches.groups?.choice_target;
            request = "choice";
          } else if (matches.groups?.jump_target) {
            target = matches.groups?.jump_target;
            request = "jump";
          }
        }
        const action = navActions[request];
        if (action) {
          this.processListeners(action, "adl.nav.request", target);
        }
      } else if (this.settings.autoProgress) {
        this.processListeners("SequenceNext", void 0, "next");
      }
    }
    return result;
  }
  /**
   * GetValue function from SCORM 2004 Spec
   *
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement) {
    const adlNavRequestRegex = "^adl\\.nav\\.request_valid\\.(choice|jump)\\.{target=\\S{0,}([a-zA-Z0-9-_]+)}$";
    if (stringMatches(CMIElement, adlNavRequestRegex)) {
      const matches = CMIElement.match(adlNavRequestRegex);
      if (matches) {
        const request = matches[1];
        const target = matches[2].replace(/{target=/g, "").replace(/}/g, "");
        if (request === "choice" || request === "jump") {
          if (this.settings.scoItemIdValidator) {
            return String(this.settings.scoItemIdValidator(target));
          }
          if (this._extractedScoItemIds.length > 0) {
            return String(this._extractedScoItemIds.includes(target));
          }
          return String(this.settings?.scoItemIds?.includes(target));
        }
      }
    }
    return this.getValue("GetValue", true, CMIElement);
  }
  /**
   * SetValue function from SCORM 2004 Spec
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  lmsSetValue(CMIElement, value) {
    return this.setValue("SetValue", "Commit", true, CMIElement, value);
  }
  /**
   * Commit function from SCORM 2004 Spec
   *
   * @return {string} bool
   */
  lmsCommit() {
    if (this.settings.asyncCommit) {
      this.scheduleCommit(500, "Commit");
    } else {
      (async () => {
        await this.commit("Commit", false);
      })();
    }
    return global_constants.SCORM_TRUE;
  }
  /**
   * GetLastError function from SCORM 2004 Spec
   *
   * @return {string}
   */
  lmsGetLastError() {
    return this.getLastError("GetLastError");
  }
  /**
   * GetErrorString function from SCORM 2004 Spec
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode) {
    return this.getErrorString("GetErrorString", CMIErrorCode);
  }
  /**
   * GetDiagnostic function from SCORM 2004 Spec
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode) {
    return this.getDiagnostic("GetDiagnostic", CMIErrorCode);
  }
  /**
   * Sets a value on the CMI Object - delegates to CMIValueHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  setCMIValue(CMIElement, value) {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      const parts = CMIElement.split(".");
      const index = Number(parts[2]);
      const element_base = `cmi.objectives.${index}`;
      let objective_id;
      const setting_id = stringMatches(CMIElement, "cmi\\.objectives\\.\\d+\\.id");
      if (setting_id) {
        objective_id = value;
      } else {
        const objective = this.cmi.objectives.findObjectiveByIndex(index);
        objective_id = objective ? objective.id : void 0;
      }
      const is_global = objective_id && this.settings.globalObjectiveIds?.includes(objective_id);
      if (is_global) {
        let global_index = this._globalObjectives.findIndex((obj) => obj.id === objective_id);
        if (global_index === -1) {
          global_index = this._globalObjectives.length;
          const newGlobalObjective = new CMIObjectivesObject();
          newGlobalObjective.id = objective_id;
          this._globalObjectives.push(newGlobalObjective);
        }
        const global_element = CMIElement.replace(
          element_base,
          `_globalObjectives.${global_index}`
        );
        this._commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);
      }
    }
    return this._commonSetCMIValue("SetValue", true, CMIElement, value);
  }
  /**
   * Gets or builds a new child element to add to the array - delegates to CMIElementHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI|null}
   */
  getChildElement(CMIElement, value, foundFirstIndex) {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    }
    if (foundFirstIndex) {
      if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
        return this.createCorrectResponsesObject(CMIElement, value);
      } else if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
        return new CMIInteractionsObjectivesObject();
      }
    } else if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
      return new CMIInteractionsObject();
    }
    if (stringMatches(CMIElement, "cmi\\.comments_from_learner\\.\\d+")) {
      return new CMICommentsObject();
    } else if (stringMatches(CMIElement, "cmi\\.comments_from_lms\\.\\d+")) {
      return new CMICommentsObject(true);
    }
    if (stringMatches(CMIElement, "adl\\.data\\.\\d+")) {
      return new ADLDataObject();
    }
    return null;
  }
  /**
   * Creates a correct responses object for an interaction - delegates to CMIElementHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {BaseCMI|null}
   */
  createCorrectResponsesObject(CMIElement, value) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const interaction = this.cmi.interactions.childArray[index];
    if (this.isInitialized()) {
      if (typeof interaction === "undefined" || !interaction.type) {
        this.throwSCORMError(CMIElement, scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
        return null;
      } else {
        this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
        const response_type = CorrectResponses[interaction.type];
        if (response_type) {
          this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
        } else {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors$1.GENERAL_SET_FAILURE,
            `Incorrect Response Type: ${interaction.type}`
          );
          return null;
        }
      }
    }
    if (this.lastErrorCode === "0") {
      return new CMIInteractionsCorrectResponsesObject(interaction);
    }
    return null;
  }
  /**
   * Checks for valid response types - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {ResponseType} response_type
   * @param {any} value
   * @param {string} interaction_type
   */
  checkValidResponseType(CMIElement, response_type, value, interaction_type) {
    let nodes = [];
    if (response_type?.delimiter) {
      nodes = String(value).split(response_type.delimiter);
    } else {
      nodes[0] = value;
    }
    if (nodes.length > 0 && nodes.length <= response_type.max) {
      this.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value);
    } else if (nodes.length > response_type.max) {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors$1.GENERAL_SET_FAILURE,
        `Data Model Element Pattern Too Long: ${value}`
      );
    }
  }
  /**
   * Checks for duplicate 'choice' responses - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {CMIInteractionsObject} interaction
   * @param {any} value
   */
  checkDuplicateChoiceResponse(CMIElement, interaction, value) {
    const interaction_count = interaction.correct_responses._count;
    if (interaction.type === "choice") {
      for (let i = 0; i < interaction_count && this.lastErrorCode === "0"; i++) {
        const response = interaction.correct_responses.childArray[i];
        if (response.pattern === value) {
          this.throwSCORMError(CMIElement, scorm2004_errors$1.GENERAL_SET_FAILURE, `${value}`);
        }
      }
    }
  }
  /**
   * Validate correct response - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {*} value
   */
  validateCorrectResponse(CMIElement, value) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const pattern_index = Number(parts[4]);
    const interaction = this.cmi.interactions.childArray[index];
    const interaction_count = interaction.correct_responses._count;
    this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
    const response_type = CorrectResponses[interaction.type];
    if (typeof response_type.limit === "undefined" || interaction_count <= response_type.limit) {
      this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
      if (this.lastErrorCode === "0" && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastErrorCode === "0" && value === "") ; else {
        if (this.lastErrorCode === "0") {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors$1.GENERAL_SET_FAILURE,
            `Data Model Element Pattern Already Exists: ${CMIElement} - ${value}`
          );
        }
      }
    } else {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors$1.GENERAL_SET_FAILURE,
        `Data Model Element Collection Limit Reached: ${CMIElement} - ${value}`
      );
    }
  }
  /**
   * Gets a value from the CMI Object - delegates to CMIValueHandlerModule
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement) {
    return this._commonGetCMIValue("GetValue", true, CMIElement);
  }
  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {(string|number)} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  getLmsErrorMessageDetails(errorNumber, detail) {
    let basicMessage = "";
    let detailMessage = "";
    errorNumber = String(errorNumber);
    if (scorm2004_constants.error_descriptions[errorNumber]) {
      basicMessage = scorm2004_constants.error_descriptions[errorNumber].basicMessage;
      detailMessage = scorm2004_constants.error_descriptions[errorNumber].detailMessage;
    }
    return detail ? detailMessage : basicMessage;
  }
  /**
   * Check to see if a correct_response value has been duplicated - delegates to ValidationModule
   * @param {CMIArray} correct_response
   * @param {number} current_index
   * @param {*} value
   * @return {boolean}
   */
  checkDuplicatedPattern(correct_response, current_index, value) {
    let found = false;
    const count = correct_response._count;
    for (let i = 0; i < count && !found; i++) {
      if (i !== current_index && correct_response.childArray[i] === value) {
        found = true;
      }
    }
    return found;
  }
  /**
   * Checks for a valid correct_response value - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {string} interaction_type
   * @param {Array} nodes
   * @param {*} value
   */
  checkCorrectResponseValue(CMIElement, interaction_type, nodes, value) {
    const response = CorrectResponses[interaction_type];
    if (!response) {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors$1.TYPE_MISMATCH,
        `Incorrect Response Type: ${interaction_type}`
      );
      return;
    }
    const formatRegex = new RegExp(response.format);
    for (let i = 0; i < nodes.length && this.lastErrorCode === "0"; i++) {
      if (interaction_type.match("^(fill-in|long-fill-in|matching|performance|sequencing)$")) {
        nodes[i] = this.removeCorrectResponsePrefixes(CMIElement, nodes[i]);
      }
      if (response?.delimiter2) {
        const values = nodes[i].split(response.delimiter2);
        if (values.length === 2) {
          const matches = values[0].match(formatRegex);
          if (!matches) {
            this.throwSCORMError(
              CMIElement,
              scorm2004_errors$1.TYPE_MISMATCH,
              `${interaction_type}: ${value}`
            );
          } else {
            if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
              this.throwSCORMError(
                CMIElement,
                scorm2004_errors$1.TYPE_MISMATCH,
                `${interaction_type}: ${value}`
              );
            }
          }
        } else {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors$1.TYPE_MISMATCH,
            `${interaction_type}: ${value}`
          );
        }
      } else {
        const matches = nodes[i].match(formatRegex);
        if (!matches && value !== "" || !matches && interaction_type === "true-false") {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors$1.TYPE_MISMATCH,
            `${interaction_type}: ${value}`
          );
        } else {
          if (interaction_type === "numeric" && nodes.length > 1) {
            if (Number(nodes[0]) > Number(nodes[1])) {
              this.throwSCORMError(
                CMIElement,
                scorm2004_errors$1.TYPE_MISMATCH,
                `${interaction_type}: ${value}`
              );
            }
          } else {
            if (nodes[i] !== "" && response.unique) {
              for (let j = 0; j < i && this.lastErrorCode === "0"; j++) {
                if (nodes[i] === nodes[j]) {
                  this.throwSCORMError(
                    CMIElement,
                    scorm2004_errors$1.TYPE_MISMATCH,
                    `${interaction_type}: ${value}`
                  );
                }
              }
            }
          }
        }
      }
    }
  }
  /**
   * Remove prefixes from correct_response - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {string} node
   * @return {*}
   */
  removeCorrectResponsePrefixes(CMIElement, node) {
    let seenOrder = false;
    let seenCase = false;
    let seenLang = false;
    const prefixRegex = new RegExp("^({(lang|case_matters|order_matters)=([^}]+)})");
    let matches = node.match(prefixRegex);
    let langMatches = null;
    while (matches) {
      switch (matches[2]) {
        case "lang":
          langMatches = node.match(scorm2004_regex.CMILangcr);
          if (langMatches) {
            const lang = langMatches[3];
            if (lang !== void 0 && lang.length > 0) {
              if (!ValidLanguages.includes(lang.toLowerCase())) {
                this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${node}`);
              }
            }
          }
          seenLang = true;
          break;
        case "case_matters":
          if (!seenLang && !seenOrder && !seenCase) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${node}`);
            }
          }
          seenCase = true;
          break;
        case "order_matters":
          if (!seenCase && !seenLang && !seenOrder) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${node}`);
            }
          }
          seenOrder = true;
          break;
      }
      node = node.substring(matches[1].length);
      matches = node.match(prefixRegex);
    }
    return node;
  }
  /**
   * Replace the whole API with another
   * @param {Scorm2004API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI) {
    this.cmi = newAPI.cmi;
    this.adl = newAPI.adl;
  }
  /**
   * Render the cmi object to the proper format for LMS commit - delegates to DataSerializationModule
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {object|Array}
   */
  renderCommitCMI(terminateCommit, includeTotalTime = false) {
    const cmiExport = this.renderCMIToJSONObject();
    if (terminateCommit || includeTotalTime) {
      cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
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
   * Render the cmi object to the proper format for LMS commit - delegates to DataSerializationModule
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit, includeTotalTime = false) {
    const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
    const calculateTotalTime = terminateCommit || includeTotalTime;
    const totalTimeDuration = calculateTotalTime ? this.cmi.getCurrentTotalTime() : "";
    const totalTimeSeconds = getDurationAsSeconds(
      totalTimeDuration,
      scorm2004_regex.CMITimespan
    );
    let completionStatus = CompletionStatus.UNKNOWN;
    let successStatus = SuccessStatus.UNKNOWN;
    if (this.cmi.completion_status) {
      if (this.cmi.completion_status === "completed") {
        completionStatus = CompletionStatus.COMPLETED;
      } else if (this.cmi.completion_status === "incomplete") {
        completionStatus = CompletionStatus.INCOMPLETE;
      }
    }
    if (this.cmi.success_status) {
      if (this.cmi.success_status === "passed") {
        successStatus = SuccessStatus.PASSED;
      } else if (this.cmi.success_status === "failed") {
        successStatus = SuccessStatus.FAILED;
      }
    }
    const scoreObject = this.cmi?.score?.getScoreObject() || {};
    const commitObject = {
      completionStatus,
      successStatus,
      totalTimeSeconds,
      runtimeData: cmiExport
    };
    if (scoreObject) {
      commitObject.score = scoreObject;
    }
    return commitObject;
  }
  /**
   * Attempts to store the data to the LMS - delegates to DataSerializationModule
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  async storeData(terminateCommit) {
    if (terminateCommit) {
      if (this.cmi.mode === "normal") {
        if (this.cmi.credit === "credit") {
          if (this.cmi.completion_threshold && this.cmi.progress_measure) {
            if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
              this.cmi.completion_status = "completed";
            } else {
              this.cmi.completion_status = "incomplete";
            }
          }
          if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
            if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
              this.cmi.success_status = "passed";
            } else {
              this.cmi.success_status = "failed";
            }
          }
        }
      }
    }
    let navRequest = false;
    if (this.adl.nav.request !== this.startingData?.adl?.nav?.request && this.adl.nav.request !== "_none_") {
      navRequest = true;
    }
    const commitObject = this.getCommitObject(terminateCommit);
    if (typeof this.settings.lmsCommitUrl === "string") {
      const result = await this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit
      );
      if (navRequest && result.navRequest !== void 0 && result.navRequest !== "" && typeof result.navRequest === "string") {
        Function(`"use strict";(() => { ${result.navRequest} })()`)();
      } else if (result?.navRequest && !navRequest) {
        if (typeof result.navRequest === "object" && Object.hasOwnProperty.call(result.navRequest, "name")) {
          this.processListeners(result.navRequest.name, result.navRequest.data);
        }
      }
      return result;
    }
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0
    };
  }
  /**
   * Configure sequencing based on provided settings
   * @param {SequencingSettings} sequencingSettings - The sequencing settings
   */
  configureSequencing(sequencingSettings) {
    if (sequencingSettings.activityTree) {
      this.configureActivityTree(sequencingSettings.activityTree);
    }
    if (sequencingSettings.sequencingRules) {
      this.configureSequencingRules(sequencingSettings.sequencingRules);
    }
    if (sequencingSettings.sequencingControls) {
      this.configureSequencingControls(sequencingSettings.sequencingControls);
    }
    if (sequencingSettings.rollupRules) {
      this.configureRollupRules(sequencingSettings.rollupRules);
    }
  }
  /**
   * Configure activity tree based on provided settings
   * @param {ActivitySettings} activityTreeSettings - The activity tree settings
   */
  configureActivityTree(activityTreeSettings) {
    const rootActivity = this.createActivity(activityTreeSettings);
    const activityTree = this._sequencing.activityTree;
    activityTree.root = rootActivity;
    this._extractedScoItemIds = this.extractActivityIds(rootActivity);
  }
  /**
   * Extract all activity IDs from an activity and its children
   * @param {Activity} activity - The activity to extract IDs from
   * @return {string[]} - Array of activity IDs
   */
  extractActivityIds(activity) {
    const ids = [activity.id];
    for (const child of activity.children) {
      ids.push(...this.extractActivityIds(child));
    }
    return ids;
  }
  /**
   * Create an activity from settings
   * @param {ActivitySettings} activitySettings - The activity settings
   * @return {Activity} - The created activity
   */
  createActivity(activitySettings) {
    const activity = new Activity(activitySettings.id, activitySettings.title);
    if (activitySettings.isVisible !== void 0) {
      activity.isVisible = activitySettings.isVisible;
    }
    if (activitySettings.isActive !== void 0) {
      activity.isActive = activitySettings.isActive;
    }
    if (activitySettings.isSuspended !== void 0) {
      activity.isSuspended = activitySettings.isSuspended;
    }
    if (activitySettings.isCompleted !== void 0) {
      activity.isCompleted = activitySettings.isCompleted;
    }
    if (activitySettings.children) {
      for (const childSettings of activitySettings.children) {
        const childActivity = this.createActivity(childSettings);
        activity.addChild(childActivity);
      }
    }
    return activity;
  }
  /**
   * Configure sequencing rules based on provided settings
   * @param {SequencingRulesSettings} sequencingRulesSettings - The sequencing rules settings
   */
  configureSequencingRules(sequencingRulesSettings) {
    const sequencingRules = this._sequencing.sequencingRules;
    if (sequencingRulesSettings.preConditionRules) {
      for (const ruleSettings of sequencingRulesSettings.preConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        sequencingRules.addPreConditionRule(rule);
      }
    }
    if (sequencingRulesSettings.exitConditionRules) {
      for (const ruleSettings of sequencingRulesSettings.exitConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        sequencingRules.addExitConditionRule(rule);
      }
    }
    if (sequencingRulesSettings.postConditionRules) {
      for (const ruleSettings of sequencingRulesSettings.postConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        sequencingRules.addPostConditionRule(rule);
      }
    }
  }
  /**
   * Create a sequencing rule from settings
   * @param {SequencingRuleSettings} ruleSettings - The sequencing rule settings
   * @return {SequencingRule} - The created sequencing rule
   */
  createSequencingRule(ruleSettings) {
    const rule = new SequencingRule(ruleSettings.action, ruleSettings.conditionCombination);
    for (const conditionSettings of ruleSettings.conditions) {
      const condition = new RuleCondition(
        conditionSettings.condition,
        conditionSettings.operator,
        new Map(Object.entries(conditionSettings.parameters || {}))
      );
      rule.addCondition(condition);
    }
    return rule;
  }
  /**
   * Configure sequencing controls based on provided settings
   * @param {SequencingControlsSettings} sequencingControlsSettings - The sequencing controls settings
   */
  configureSequencingControls(sequencingControlsSettings) {
    const sequencingControls = this._sequencing.sequencingControls;
    if (sequencingControlsSettings.enabled !== void 0) {
      sequencingControls.enabled = sequencingControlsSettings.enabled;
    }
    if (sequencingControlsSettings.choiceExit !== void 0) {
      sequencingControls.choiceExit = sequencingControlsSettings.choiceExit;
    }
    if (sequencingControlsSettings.flow !== void 0) {
      sequencingControls.flow = sequencingControlsSettings.flow;
    }
    if (sequencingControlsSettings.forwardOnly !== void 0) {
      sequencingControls.forwardOnly = sequencingControlsSettings.forwardOnly;
    }
    if (sequencingControlsSettings.useCurrentAttemptObjectiveInfo !== void 0) {
      sequencingControls.useCurrentAttemptObjectiveInfo = sequencingControlsSettings.useCurrentAttemptObjectiveInfo;
    }
    if (sequencingControlsSettings.useCurrentAttemptProgressInfo !== void 0) {
      sequencingControls.useCurrentAttemptProgressInfo = sequencingControlsSettings.useCurrentAttemptProgressInfo;
    }
    if (sequencingControlsSettings.preventActivation !== void 0) {
      sequencingControls.preventActivation = sequencingControlsSettings.preventActivation;
    }
    if (sequencingControlsSettings.constrainChoice !== void 0) {
      sequencingControls.constrainChoice = sequencingControlsSettings.constrainChoice;
    }
    if (sequencingControlsSettings.rollupObjectiveSatisfied !== void 0) {
      sequencingControls.rollupObjectiveSatisfied = sequencingControlsSettings.rollupObjectiveSatisfied;
    }
    if (sequencingControlsSettings.rollupProgressCompletion !== void 0) {
      sequencingControls.rollupProgressCompletion = sequencingControlsSettings.rollupProgressCompletion;
    }
    if (sequencingControlsSettings.objectiveMeasureWeight !== void 0) {
      sequencingControls.objectiveMeasureWeight = sequencingControlsSettings.objectiveMeasureWeight;
    }
  }
  /**
   * Configure rollup rules based on provided settings
   * @param {RollupRulesSettings} rollupRulesSettings - The rollup rules settings
   */
  configureRollupRules(rollupRulesSettings) {
    const rollupRules = this._sequencing.rollupRules;
    if (rollupRulesSettings.rules) {
      for (const ruleSettings of rollupRulesSettings.rules) {
        const rule = this.createRollupRule(ruleSettings);
        rollupRules.addRule(rule);
      }
    }
  }
  /**
   * Create a rollup rule from settings
   * @param {RollupRuleSettings} ruleSettings - The rollup rule settings
   * @return {RollupRule} - The created rollup rule
   */
  createRollupRule(ruleSettings) {
    const rule = new RollupRule(
      ruleSettings.action,
      ruleSettings.consideration,
      ruleSettings.minimumCount,
      ruleSettings.minimumPercent
    );
    for (const conditionSettings of ruleSettings.conditions) {
      const condition = new RollupCondition(
        conditionSettings.condition,
        new Map(Object.entries(conditionSettings.parameters || {}))
      );
      rule.addCondition(condition);
    }
    return rule;
  }
}

export { Scorm2004API };
//# sourceMappingURL=scorm2004.js.map
