this.Scorm2004API = (function () {
  'use strict';

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
      "0": {
        basicMessage: "No Error",
        detailMessage: "No error occurred, the previous API call was successful."
      },
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
    cmi_children: "_version,comments_from_learner,comments_from_lms,completion_status,completion_threshold,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time",
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
  const getSecondsAsISODuration = memoize(seconds => {
    if (!seconds || seconds <= 0) {
      return "PT0S";
    }
    let duration = "P";
    let remainder = seconds;
    const designationEntries = Object.entries(designations);
    designationEntries.forEach(_ref => {
      let [designationsKey, current_seconds] = _ref;
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
  const getDurationAsSeconds = memoize((duration, durationRegex) => {
    if (typeof durationRegex === "string") {
      durationRegex = new RegExp(durationRegex);
    }
    if (!duration || !duration?.match?.(durationRegex)) {
      return 0;
    }
    const [, years, months, weeks, days, hours, minutes, seconds] = new RegExp(durationRegex).exec?.(duration) ?? [];
    let result = 0;
    result += Number(seconds) || 0;
    result += Number(minutes) * 60 || 0;
    result += Number(hours) * 3600 || 0;
    result += Number(days) * (60 * 60 * 24) || 0;
    result += Number(weeks) * (60 * 60 * 24 * 7) || 0;
    result += Number(months) * (60 * 60 * 24 * 30) || 0;
    result += Number(years) * (60 * 60 * 24 * 365) || 0;
    return result;
  },
  // Custom key function to handle RegExp objects which can't be stringified
  (duration, durationRegex) => {
    const durationStr = duration ?? "";
    const regexStr = typeof durationRegex === "string" ? durationRegex : durationRegex?.toString() ?? "";
    return `${durationStr}:${regexStr}`;
  });
  const validateISO8601Duration = memoize((duration, durationRegex) => {
    if (typeof durationRegex === "string") {
      durationRegex = new RegExp(durationRegex);
    }
    return !(!duration || !duration?.match?.(durationRegex));
  });
  function addTwoDurations(first, second, durationRegex) {
    const regex = new RegExp(durationRegex) ;
    return getSecondsAsISODuration(getDurationAsSeconds(first, regex) + getDurationAsSeconds(second, regex));
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
        const keys = Object.keys(cur).filter(p => Object.prototype.hasOwnProperty.call(cur, p));
        const isEmpty = keys.length === 0;
        keys.forEach(p => {
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
    Object.keys(data).filter(p => Object.prototype.hasOwnProperty.call(data, p)).forEach(p => {
      let cur = result;
      let prop = "";
      const regex = new RegExp(pattern);
      Array.from({
        length: p.match(new RegExp(pattern, "g"))?.length ?? 0
      }, () => regex.exec(p)).forEach(m => {
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
    let messageString = functionName ? `${String(functionName).padEnd(baseLength)}: ` : "";
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
    const cache = /* @__PURE__ */new Map();
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      const key = keyFn ? keyFn(...args) : JSON.stringify(args);
      return cache.has(key) ? cache.get(key) : (() => {
        const result = fn(...args);
        cache.set(key, result);
        return result;
      })();
    };
  }
  function parseNavigationRequest(navRequest) {
    const validCommands = /* @__PURE__ */new Set(["start", "resumeAll", "continue", "previous", "choice", "jump", "exit", "exitAll", "abandon", "abandonAll", "suspendAll", "_none_"]);
    const trimmed = navRequest.trim();
    if (!trimmed) {
      return {
        command: "_none_",
        targetActivityId: null,
        valid: false,
        error: "Empty navigation request"
      };
    }
    if (validCommands.has(trimmed)) {
      return {
        command: trimmed,
        targetActivityId: null,
        valid: true
      };
    }
    const dotIndex = trimmed.indexOf(".");
    if (dotIndex > 0) {
      const command = trimmed.substring(0, dotIndex);
      const targetActivityId = trimmed.substring(dotIndex + 1);
      if ((command === "choice" || command === "jump") && targetActivityId) {
        if (/^[a-zA-Z0-9._-]+$/.test(targetActivityId)) {
          return {
            command,
            targetActivityId,
            valid: true
          };
        } else {
          return {
            command: "_none_",
            targetActivityId: null,
            valid: false,
            error: `Invalid target activity ID: contains disallowed characters`
          };
        }
      }
    }
    return {
      command: "_none_",
      targetActivityId: null,
      valid: false,
      error: `Unrecognized navigation command: "${trimmed}"`
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
    throttleCommits: false,
    useAsynchronousCommits: false,
    sendFullCommit: true,
    lmsCommitUrl: false,
    dataCommitFormat: "json",
    commitRequestDataType: "application/json;charset=UTF-8",
    autoProgress: false,
    logLevel: LogLevelEnum.ERROR,
    selfReportSessionTime: false,
    alwaysSendTotalTime: false,
    renderCommonCommitFields: false,
    autoCompleteLessonStatus: false,
    strict_errors: true,
    xhrHeaders: {},
    xhrWithCredentials: false,
    fetchMode: "cors",
    useBeaconInsteadOfFetch: "never",
    responseHandler: async function (response) {
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
        } catch (e) {}
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
            errorCode: typeof httpResult.errorCode === "number" ? httpResult.errorCode : httpResult.result === true || httpResult.result === global_constants.SCORM_TRUE ? 0 : 101
          };
        }
      }
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: 101
      };
    },
    xhrResponseHandler: function (xhr) {
      if (typeof xhr !== "undefined") {
        let httpResult = null;
        if (xhr.status >= 200 && xhr.status <= 299) {
          try {
            httpResult = JSON.parse(xhr.responseText);
          } catch (e) {}
          if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
            return {
              result: global_constants.SCORM_TRUE,
              errorCode: 0
            };
          }
          return {
            result: httpResult.result,
            errorCode: typeof httpResult.errorCode === "number" ? httpResult.errorCode : httpResult.result === true || httpResult.result === global_constants.SCORM_TRUE ? 0 : 101
          };
        } else {
          return {
            result: global_constants.SCORM_FALSE,
            errorCode: 101
          };
        }
      }
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: 101
      };
    },
    requestHandler: function (commitObject) {
      return commitObject;
    },
    onLogMessage: defaultLogHandler,
    mastery_override: false,
    score_overrides_status: false,
    completion_status_on_failed: "completed",
    scoItemIds: [],
    scoItemIdValidator: false,
    globalObjectiveIds: [],
    // Offline support settings
    enableOfflineSupport: false,
    courseId: "",
    syncOnInitialize: true,
    syncOnTerminate: true,
    maxSyncAttempts: 5,
    // Multi-SCO support settings
    scoId: "",
    autoPopulateCommitMetadata: false,
    // HTTP service settings
    httpService: null,
    // Global learner preferences settings
    globalStudentPreferences: false
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
     * Wrap the API commit call to check if the call has already been canceled
     */
    wrapper() {
      if (!this._cancelled) {
        if (this._API.isInitialized()) {
          (async () => await this._API.commit(this._callback))();
        }
      }
    }
  }

  class AsynchronousHttpService {
    /**
     * Constructor for AsynchronousHttpService
     * @param {Settings} settings - The settings object
     * @param {ErrorCode} error_codes - The error codes object
     */
    constructor(settings, error_codes) {
      this.settings = settings;
      this.error_codes = error_codes;
    }
    /**
     * Sends HTTP requests asynchronously to the LMS
     * Returns immediate success - actual result handled via events
     *
     * WARNING: This is NOT SCORM-compliant. Always returns optimistic success immediately.
     * The actual HTTP request happens in the background, and success/failure is reported
     * via CommitSuccess/CommitError events, but NOT to the SCO's commit call.
     *
     * @param {string} url - The URL endpoint to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
     * @param {boolean} immediate - Whether to send the request immediately without waiting
     * @param {Function} apiLog - Function to log API messages with appropriate levels
     * @param {Function} processListeners - Function to trigger event listeners for commit events
     * @return {ResultObject} - Immediate optimistic success result
     */
    processHttpRequest(url, params) {
      let immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      let apiLog = arguments.length > 3 ? arguments[3] : undefined;
      let processListeners = arguments.length > 4 ? arguments[4] : undefined;
      this._performAsyncRequest(url, params, immediate, apiLog, processListeners);
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0
      };
    }
    /**
     * Performs the async request in the background
     * @param {string} url - The URL to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @param {boolean} immediate - Whether this is an immediate request
     * @param apiLog - Function to log API messages
     * @param {Function} processListeners - Function to process event listeners
     * @private
     */
    async _performAsyncRequest(url, params, immediate, apiLog, processListeners) {
      try {
        const processedParams = this.settings.requestHandler(params);
        let response;
        if (immediate && this.settings.useBeaconInsteadOfFetch !== "never") {
          response = await this.performBeacon(url, processedParams);
        } else {
          response = await this.performFetch(url, processedParams);
        }
        const result = await this.transformResponse(response, processListeners);
        if (this._isSuccessResponse(response, result)) {
          processListeners("CommitSuccess");
        } else {
          processListeners("CommitError", void 0, result.errorCode);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        apiLog("processHttpRequest", `Async request failed: ${message}`, LogLevelEnum.ERROR);
        processListeners("CommitError");
      }
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
      return {
        body,
        contentType
      };
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
      const {
        body,
        contentType
      } = this._prepareRequestBody(params);
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
      const {
        body,
        contentType
      } = this._prepareRequestBody(params);
      const beaconSuccess = navigator.sendBeacon(url, new Blob([body], {
        type: contentType
      }));
      return Promise.resolve({
        status: beaconSuccess ? 200 : 0,
        ok: beaconSuccess,
        json: async () => ({
          result: beaconSuccess ? "true" : "false",
          errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391
        }),
        text: async () => JSON.stringify({
          result: beaconSuccess ? "true" : "false",
          errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391
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
      let result;
      try {
        result = typeof this.settings.responseHandler === "function" ? await this.settings.responseHandler(response) : await response.json();
      } catch (parseError) {
        const responseText = await response.text().catch(() => "Unable to read response text");
        return {
          result: global_constants.SCORM_FALSE,
          errorCode: this.error_codes.GENERAL_COMMIT_FAILURE || 391,
          errorMessage: `Failed to parse LMS response: ${parseError instanceof Error ? parseError.message : String(parseError)}`,
          errorDetails: JSON.stringify({
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            responseText: responseText.substring(0, 500),
            // Limit response text to avoid huge logs
            parseError: parseError instanceof Error ? parseError.message : String(parseError)
          })
        };
      }
      if (!Object.hasOwnProperty.call(result, "errorCode")) {
        result.errorCode = this._isSuccessResponse(response, result) ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391;
      }
      if (!this._isSuccessResponse(response, result)) {
        result.errorDetails = {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          ...result.errorDetails
          // Preserve any existing error details
        };
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

  class SynchronousHttpService {
    /**
     * Constructor for SynchronousHttpService
     * @param {InternalSettings} settings - The settings object
     * @param {ErrorCode} error_codes - The error codes object
     */
    constructor(settings, error_codes) {
      this.settings = settings;
      this.error_codes = error_codes;
    }
    /**
     * Sends synchronous HTTP requests to the LMS
     * @param {string} url - The URL endpoint to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
     * @param {boolean} immediate - Whether this is a termination commit (use sendBeacon)
     * @param {Function} _apiLog - Function to log API messages (unused in synchronous mode - errors returned directly)
     * @param {Function} _processListeners - Function to trigger event listeners (unused in synchronous mode - no async events)
     * @return {ResultObject} - The result of the request (synchronous)
     *
     * @remarks
     * The apiLog and processListeners parameters are part of the IHttpService interface contract
     * but are not used by SynchronousHttpService because:
     * - Synchronous XHR blocks until complete, so errors are returned directly to the caller
     * - No async events need to be triggered (CommitSuccess/CommitError) since results are synchronous
     * - AsynchronousHttpService uses these parameters to handle background request results
     */
    processHttpRequest(url, params) {
      let immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (immediate) {
        return this._handleImmediateRequest(url, params);
      }
      return this._performSyncXHR(url, params);
    }
    /**
     * Handles an immediate request using sendBeacon
     * @param {string} url - The URL to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @return {ResultObject} - The result based on beacon success
     * @private
     */
    _handleImmediateRequest(url, params) {
      const requestPayload = this.settings.requestHandler(params) ?? params;
      const {
        body
      } = this._prepareRequestBody(requestPayload);
      const beaconSuccess = navigator.sendBeacon(url, new Blob([body], {
        type: "text/plain;charset=UTF-8"
      }));
      return {
        result: beaconSuccess ? "true" : "false",
        errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391
      };
    }
    /**
     * Performs a synchronous XMLHttpRequest
     * @param {string} url - The URL to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @return {ResultObject} - The result of the request
     * @private
     */
    _performSyncXHR(url, params) {
      const requestPayload = this.settings.requestHandler(params) ?? params;
      const {
        body,
        contentType
      } = this._prepareRequestBody(requestPayload);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, false);
      xhr.setRequestHeader("Content-Type", contentType);
      Object.entries(this.settings.xhrHeaders).forEach(_ref => {
        let [key, value] = _ref;
        xhr.setRequestHeader(key, String(value));
      });
      if (this.settings.xhrWithCredentials) {
        xhr.withCredentials = true;
      }
      try {
        xhr.send(body);
        return this.settings.xhrResponseHandler(xhr);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return {
          result: global_constants.SCORM_FALSE,
          errorCode: this.error_codes.GENERAL_COMMIT_FAILURE || 391,
          errorMessage: message
        };
      }
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
      return {
        body,
        contentType
      };
    }
    /**
     * Updates the service settings
     * @param {InternalSettings} settings - The new settings
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
      this.listenerMap = /* @__PURE__ */new Map();
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
      if (!listenerName) return null;
      const listenerSplit = listenerName.split(".");
      const functionName = listenerSplit[0];
      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(`${functionName}.`, "");
      }
      return {
        functionName: functionName ?? listenerName,
        CMIElement
      };
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
        const {
          functionName,
          CMIElement
        } = parsedListener;
        const listeners = this.listenerMap.get(functionName) ?? [];
        listeners.push({
          functionName,
          CMIElement,
          callback
        });
        this.listenerMap.set(functionName, listeners);
        this.listenerCount++;
        this.apiLog("on", `Added event listener: ${this.listenerCount}`, LogLevelEnum.INFO, functionName);
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
        const {
          functionName,
          CMIElement
        } = parsedListener;
        const listeners = this.listenerMap.get(functionName);
        if (!listeners) continue;
        const removeIndex = listeners.findIndex(obj => obj.CMIElement === CMIElement && obj.callback === callback);
        if (removeIndex !== -1) {
          listeners.splice(removeIndex, 1);
          this.listenerCount--;
          if (listeners.length === 0) {
            this.listenerMap.delete(functionName);
          }
          this.apiLog("off", `Removed event listener: ${this.listenerCount}`, LogLevelEnum.INFO, functionName);
        }
      }
    }
    /**
     * Provides a mechanism for clearing all listeners from a specific SCORM event
     *
     * Note: clear() differs from off() in CMIElement matching behavior:
     * - clear() with CMIElement=null removes ALL listeners for the function
     * - off() requires exact CMIElement match AND callback match
     * This allows clear() to remove all listeners at once, while off() is surgical.
     *
     * @param {string} listenerName - The name of the listener to clear
     */
    clear(listenerName) {
      const listenerFunctions = listenerName.split(" ");
      for (const listenerFunction of listenerFunctions) {
        const parsedListener = this.parseListenerName(listenerFunction);
        if (!parsedListener) continue;
        const {
          functionName,
          CMIElement
        } = parsedListener;
        if (this.listenerMap.has(functionName)) {
          const listeners = this.listenerMap.get(functionName);
          const newListeners = CMIElement === null ? [] : listeners.filter(obj => obj.CMIElement !== CMIElement);
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
          this.apiLog("processListeners", `Processing listener: ${listener.functionName}`, LogLevelEnum.DEBUG, CMIElement);
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
    loadFromFlattenedJSON(json) {
      let CMIElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      let setCMIValue = arguments.length > 2 ? arguments[2] : undefined;
      let isNotInitialized = arguments.length > 3 ? arguments[3] : undefined;
      let setStartingData = arguments.length > 4 ? arguments[4] : undefined;
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
          others.push({
            key,
            value: json[key]
          });
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
      const processItems = items => {
        items.forEach(item => {
          const obj = {};
          obj[item.key] = item.value;
          this.loadFromJSON(unflatten(obj), CMIElement, setCMIValue, isNotInitialized, setStartingData);
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
    loadFromJSON(json) {
      let CMIElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      let setCMIValue = arguments.length > 2 ? arguments[2] : undefined;
      let isNotInitialized = arguments.length > 3 ? arguments[3] : undefined;
      let setStartingData = arguments.length > 4 ? arguments[4] : undefined;
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
                  this.loadFromJSON(item, tempCMIElement, setCMIValue, isNotInitialized, setStartingData);
                } else {
                  setCMIValue(tempCMIElement, item);
                }
              }
            }
          } else if (value.constructor === Object) {
            this.loadFromJSON(value, currentCMIElement, setCMIValue, isNotInitialized, setStartingData);
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
        return JSON.stringify({
          cmi
        });
      }
      return JSON.stringify({
        cmi
      }, (k, v) => v === void 0 ? null : v, 2);
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
     *
     * @security LOG-INJECTION
     * Be aware that logMessage is passed through to the log handler without sanitization.
     * When logging user-controlled data (e.g., SCORM CMI values from content, URL parameters,
     * postMessage payloads), consider the following risks:
     *
     * 1. Log injection: Malicious input containing newlines or ANSI codes could pollute logs
     *    or create fake log entries that mislead security monitoring.
     *
     * 2. Information disclosure: Sensitive data in logs may be exposed to unauthorized viewers
     *    with log access (developers, support staff, aggregation systems).
     *
     * 3. Log storage exhaustion: Extremely large or repeated values could fill disk space
     *    or cause performance degradation in log processing systems.
     *
     * Defensive patterns:
     * - Truncate long values before logging (e.g., logMessage.substring(0, 500))
     * - Strip or escape newlines and control characters
     * - Redact sensitive fields (PII, credentials, session tokens)
     * - Implement custom log handlers that sanitize before writing to external systems
     * - Use structured logging formats (JSON) that escape values properly
     *
     * Example of safe logging for user-controlled data:
     * ```typescript
     * const sanitized = userInput.replace(/[\r\n\x00-\x1F\x7F]/g, '').substring(0, 200);
     * loggingService.info(`User input: ${sanitized}`);
     * ```
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
      this._lastDiagnostic = "";
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
     * Get the last custom diagnostic message
     *
     * @return {string} - The last custom diagnostic message, or empty string if none
     */
    get lastDiagnostic() {
      return this._lastDiagnostic;
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
      this._lastDiagnostic = message || "";
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
        this._lastDiagnostic = "";
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
        returnValue = global_constants.SCORM_FALSE;
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
        returnValue = global_constants.SCORM_FALSE;
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
      this.boundOnlineStatusChangeHandler = this.handleOnlineStatusChange.bind(this);
      this.boundCustomNetworkStatusHandler = this.handleCustomNetworkStatus.bind(this);
      window.addEventListener("online", this.boundOnlineStatusChangeHandler);
      window.addEventListener("offline", this.boundOnlineStatusChangeHandler);
      window.addEventListener("scorm-again:network-status", this.boundCustomNetworkStatusHandler);
    }
    /**
     * Handle changes in online status
     */
    handleOnlineStatusChange() {
      const wasOnline = this.isOnline;
      this.isOnline = navigator.onLine;
      if (!wasOnline && this.isOnline) {
        this.apiLog("OfflineStorageService", "Device is back online, attempting to sync...", LogLevelEnum.INFO);
        this.syncOfflineData().then(success => {
          if (success) {
            this.apiLog("OfflineStorageService", "Sync completed successfully", LogLevelEnum.INFO);
          } else {
            this.apiLog("OfflineStorageService", "Sync failed", LogLevelEnum.ERROR);
          }
        }, error => {
          this.apiLog("OfflineStorageService", `Error during sync: ${error}`, LogLevelEnum.ERROR);
        });
      } else if (wasOnline && !this.isOnline) {
        this.apiLog("OfflineStorageService", "Device is offline, data will be stored locally", LogLevelEnum.INFO);
      }
    }
    /**
     * Handle custom network status events from external code
     * This allows mobile apps or other external code to programmatically update network status
     * @param {Event} event - The custom event containing network status
     */
    handleCustomNetworkStatus(event) {
      if (!(event instanceof CustomEvent)) {
        this.apiLog("OfflineStorageService", "Invalid network status event received", LogLevelEnum.WARN);
        return;
      }
      const {
        online
      } = event.detail;
      if (typeof online !== "boolean") {
        this.apiLog("OfflineStorageService", "Invalid online status value in custom event", LogLevelEnum.WARN);
        return;
      }
      const wasOnline = this.isOnline;
      this.isOnline = online;
      this.apiLog("OfflineStorageService", `Network status updated via custom event: ${online ? "online" : "offline"}`, LogLevelEnum.INFO);
      if (!wasOnline && this.isOnline) {
        this.apiLog("OfflineStorageService", "Device is back online, attempting to sync...", LogLevelEnum.INFO);
        this.syncOfflineData().then(success => {
          if (success) {
            this.apiLog("OfflineStorageService", "Sync completed successfully", LogLevelEnum.INFO);
          } else {
            this.apiLog("OfflineStorageService", "Sync failed", LogLevelEnum.ERROR);
          }
        }, error => {
          this.apiLog("OfflineStorageService", `Error during sync: ${error}`, LogLevelEnum.ERROR);
        });
      } else if (wasOnline && !this.isOnline) {
        this.apiLog("OfflineStorageService", "Device is offline, data will be stored locally", LogLevelEnum.INFO);
      }
    }
    /**
     * Store commit data offline
     * @param {string} courseId - Identifier for the course
     * @param {CommitObject} commitData - The data to store offline
     * @returns {ResultObject} - Result of the storage operation
     */
    storeOffline(courseId, commitData) {
      try {
        const queueItem = {
          id: `${courseId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          courseId,
          timestamp: Date.now(),
          data: commitData,
          syncAttempts: 0
        };
        const currentQueue = this.getFromStorage(this.syncQueue) || [];
        currentQueue.push(queueItem);
        this.saveToStorage(this.syncQueue, currentQueue);
        this.saveToStorage(`${this.storeName}_${courseId}`, commitData);
        this.apiLog("OfflineStorageService", `Stored data offline for course ${courseId}`, LogLevelEnum.INFO);
        return {
          result: global_constants.SCORM_TRUE,
          errorCode: 0
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const isQuotaError = errorMessage.includes("storage quota");
        this.apiLog("OfflineStorageService", isQuotaError ? `storage quota exceeded - cannot store offline data for course ${courseId}` : `Error storing offline data: ${error}`, LogLevelEnum.ERROR);
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
        const data = this.getFromStorage(`${this.storeName}_${courseId}`);
        return data || null;
      } catch (error) {
        this.apiLog("OfflineStorageService", `Error retrieving offline data: ${error}`, LogLevelEnum.ERROR);
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
        const syncQueue = this.getFromStorage(this.syncQueue) || [];
        if (syncQueue.length === 0) {
          this.syncInProgress = false;
          return true;
        }
        this.apiLog("OfflineStorageService", `Found ${syncQueue.length} items to sync`, LogLevelEnum.INFO);
        const remainingQueue = [];
        for (const item of syncQueue) {
          const maxAttempts = this.settings.maxSyncAttempts ?? 5;
          if (item.syncAttempts >= maxAttempts) {
            this.apiLog("OfflineStorageService", `Removing abandoned item ${item.id} after ${maxAttempts} failed sync attempts`, LogLevelEnum.WARN);
            continue;
          }
          try {
            const syncResult = await this.sendDataToLMS(item.data);
            if (syncResult.result === true || syncResult.result === global_constants.SCORM_TRUE) {
              this.apiLog("OfflineStorageService", `Successfully synced item ${item.id}`, LogLevelEnum.INFO);
            } else {
              item.syncAttempts++;
              remainingQueue.push(item);
              this.apiLog("OfflineStorageService", `Failed to sync item ${item.id}, attempt #${item.syncAttempts}`, LogLevelEnum.WARN);
            }
          } catch (error) {
            item.syncAttempts++;
            remainingQueue.push(item);
            this.apiLog("OfflineStorageService", `Error syncing item ${item.id}: ${error}`, LogLevelEnum.ERROR);
          }
        }
        this.saveToStorage(this.syncQueue, remainingQueue);
        this.apiLog("OfflineStorageService", `Sync completed. ${syncQueue.length - remainingQueue.length} items synced, ${remainingQueue.length} items remaining`, LogLevelEnum.INFO);
        this.syncInProgress = false;
        return true;
      } catch (error) {
        this.apiLog("OfflineStorageService", `Error during sync process: ${error}`, LogLevelEnum.ERROR);
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
        this.apiLog("OfflineStorageService", `Error sending data to LMS: ${error}`, LogLevelEnum.ERROR);
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
     * @returns {T|null} - The retrieved data
     */
    getFromStorage(key) {
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
     * @returns {void}
     * @throws {Error} Re-throws QuotaExceededError for handling upstream
     */
    saveToStorage(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        if (error instanceof DOMException && error.name === "QuotaExceededError") {
          throw new Error("storage quota exceeded - localStorage is full");
        }
        throw error;
      }
    }
    /**
     * Check if there is pending offline data for a course
     * @param {string} courseId - Identifier for the course
     * @returns {Promise<boolean>} - Whether there is pending data
     */
    async hasPendingOfflineData(courseId) {
      const queue = this.getFromStorage(this.syncQueue) || [];
      return queue.some(item => item.courseId === courseId);
    }
    /**
     * Update the service settings
     * @param {Settings} settings - The new settings
     */
    updateSettings(settings) {
      this.settings = settings;
    }
    /**
     * Clean up event listeners
     * Should be called when the service is no longer needed
     */
    destroy() {
      window.removeEventListener("online", this.boundOnlineStatusChangeHandler);
      window.removeEventListener("offline", this.boundOnlineStatusChangeHandler);
      window.removeEventListener("scorm-again:network-status", this.boundCustomNetworkStatusHandler);
    }
  }

  class BaseCMI {
    /**
     * Constructor for BaseCMI
     * @param {string} cmi_element
     */
    constructor(cmi_element) {
      /**
       * Flag used during JSON serialization to allow getter access without initialization checks.
       * When true, getters can be accessed before the API is initialized, which is necessary
       * for serializing the CMI data structure to JSON format.
       */
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
     * Start time of the session
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
        this._start_time = (/* @__PURE__ */new Date()).getTime();
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
    MULTIPLE_TERMINATION: 113,
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
      this._errorCode = params.errorCode ?? scorm12_errors$1.GENERAL;
      this._errorClass = params.errorClass || BaseScormValidationError;
      this.childArray = [];
    }
    /**
     * Called when the API has been reset
     */
    reset() {
      let wipe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this._initialized = false;
      if (wipe) {
        this.childArray = [];
      } else {
        for (let i = 0; i < this.childArray.length; i++) {
          this.childArray[i]?.reset();
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
      if (settings?.asyncCommit !== void 0 && settings.useAsynchronousCommits === void 0 && settings.throttleCommits === void 0) {
        console.warn("DEPRECATED: 'asyncCommit' setting is deprecated and will be removed in a future version. Use 'useAsynchronousCommits: true' and 'throttleCommits: true' instead.");
        if (settings.asyncCommit) {
          this.settings.useAsynchronousCommits = true;
          this.settings.throttleCommits = true;
        }
      }
      if (!this.settings.useAsynchronousCommits && this.settings.throttleCommits) {
        console.warn("throttleCommits cannot be used with synchronous commits. Setting throttleCommits to false.");
        this.settings.throttleCommits = false;
      }
      this._loggingService = loggingService || getLoggingService();
      this._loggingService.setLogLevel(this.settings.logLevel);
      if (this.settings.onLogMessage) {
        this._loggingService.setLogHandler(this.settings.onLogMessage);
      } else {
        this._loggingService.setLogHandler(defaultLogHandler);
      }
      if (httpService) {
        this._httpService = httpService;
      } else if (this.settings.httpService) {
        this._httpService = this.settings.httpService;
      } else {
        if (this.settings.useAsynchronousCommits) {
          console.warn("WARNING: useAsynchronousCommits=true is not SCORM compliant. Commit failures will not be reported to the SCO, which may cause data loss. This setting should only be used for specific legacy compatibility cases.");
          this._httpService = new AsynchronousHttpService(this.settings, this._error_codes);
        } else {
          this._httpService = new SynchronousHttpService(this.settings, this._error_codes);
        }
      }
      this._eventService = eventService || new EventService((functionName, message, level, element) => this.apiLog(functionName, message, level, element));
      this._serializationService = serializationService || new SerializationService();
      this._errorHandlingService = errorHandlingService || createErrorHandlingService(this._error_codes, (functionName, message, level, element) => this.apiLog(functionName, message, level || LogLevelEnum.ERROR, element), (errorNumber, detail) => this.getLmsErrorMessageDetails(errorNumber, detail));
      if (this.settings.enableOfflineSupport) {
        this._offlineStorageService = offlineStorageService || new OfflineStorageService(this.settings, this._error_codes, (functionName, message, level, element) => this.apiLog(functionName, message, level, element));
        if (this.settings.courseId) {
          this._courseId = this.settings.courseId;
        }
        if (this.settings.syncOnTerminate) {
          this._eventService.on("BeforeTerminate", () => {
            if (this._offlineStorageService?.isDeviceOnline() && this._courseId) {
              this._offlineStorageService.hasPendingOfflineData(this._courseId).then(hasPendingData => {
                if (hasPendingData) {
                  this.apiLog("BeforeTerminate", "Syncing pending offline data before termination", LogLevelEnum.INFO);
                  return this._offlineStorageService?.syncOfflineData();
                }
              }).then(syncSuccess => {
                if (syncSuccess) {
                  this.processListeners("OfflineDataSynced");
                } else if (syncSuccess === false) {
                  this.processListeners("OfflineDataSyncFailed");
                }
              }).catch(error => {
                this.apiLog("BeforeTerminate", `Error syncing offline data: ${error}`, LogLevelEnum.ERROR);
                this.processListeners("OfflineDataSyncFailed");
              });
            }
          });
        }
        if (this._offlineStorageService && this._courseId) {
          this._offlineStorageService.getOfflineData(this._courseId).then(offlineData => {
            if (offlineData) {
              this.apiLog("constructor", "Found offline data to restore", LogLevelEnum.INFO);
              this.loadFromJSON(offlineData.runtimeData);
            }
          }).catch(error => {
            this.apiLog("constructor", `Error retrieving offline data: ${error}`, LogLevelEnum.ERROR);
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
     * Protected getter for eventService
     * @return {IEventService}
     */
    get eventService() {
      return this._eventService;
    }
    /**
     * Protected getter for loggingService
     * @return {ILoggingService}
     */
    get loggingService() {
      return this._loggingService;
    }
    /**
     * Common reset method for all APIs. New settings are merged with the existing settings.
     * @param {Settings} settings
     * @protected
     */
    commonReset(settings) {
      this.apiLog("reset", "Called", LogLevelEnum.INFO);
      this.settings = {
        ...this.settings,
        ...settings
      };
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
          this._offlineStorageService.hasPendingOfflineData(this._courseId).then(hasPendingData => {
            if (hasPendingData) {
              this.apiLog(callbackName, "Syncing pending offline data on initialization", LogLevelEnum.INFO);
              this._offlineStorageService?.syncOfflineData().then(syncSuccess => {
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
      this._loggingService.log(messageLevel, logMessage);
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
      this._settings = {
        ...this._settings,
        ...settings
      };
      this._httpService?.updateSettings(this._settings);
      if (settings.logLevel !== void 0 && settings.logLevel !== previousSettings.logLevel) {
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
    terminate(callbackName, checkTerminated) {
      let returnValue = global_constants.SCORM_TRUE;
      let stateCheckPassed = false;
      if (this.isNotInitialized()) {
        const errorCode = this._error_codes.TERMINATION_BEFORE_INIT ?? 0;
        this.throwSCORMError("api", errorCode);
        if (errorCode === 112) returnValue = global_constants.SCORM_FALSE;
      } else if (checkTerminated && this.isTerminated()) {
        const errorCode = this._error_codes.MULTIPLE_TERMINATION ?? 0;
        this.throwSCORMError("api", errorCode);
        if (errorCode === 113) returnValue = global_constants.SCORM_FALSE;
      } else {
        stateCheckPassed = true;
        this.processListeners("BeforeTerminate");
        const result = this.storeData(true);
        if ((result.errorCode ?? 0) > 0) {
          if (result.errorMessage) {
            this.apiLog("terminate", `Terminate failed with error: ${result.errorMessage}`, LogLevelEnum.ERROR);
          }
          if (result.errorDetails) {
            this.apiLog("terminate", `Error details: ${JSON.stringify(result.errorDetails)}`, LogLevelEnum.DEBUG);
          }
          this.throwSCORMError("api", result.errorCode ?? 0);
          returnValue = global_constants.SCORM_FALSE;
        } else {
          this.currentState = global_constants.STATE_TERMINATED;
          if (checkTerminated) this.lastErrorCode = "0";
          returnValue = result?.result ?? global_constants.SCORM_TRUE;
        }
        this.processListeners(callbackName);
      }
      this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
      if (stateCheckPassed) {
        this.clearSCORMError(returnValue);
      }
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
      if (this.checkState(checkTerminated, this._error_codes.RETRIEVE_BEFORE_INIT ?? 0, this._error_codes.RETRIEVE_AFTER_TERM ?? 0)) {
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
      if (this.checkState(checkTerminated, this._error_codes.STORE_BEFORE_INIT ?? 0, this._error_codes.STORE_AFTER_TERM ?? 0)) {
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
      this.apiLog(callbackName, ": " + value + ": result: " + returnValue, LogLevelEnum.INFO, CMIElement);
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
    commit(callbackName) {
      let checkTerminated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.clearScheduledCommit();
      let returnValue = global_constants.SCORM_TRUE;
      if (this.isNotInitialized()) {
        const errorCode = this._error_codes.COMMIT_BEFORE_INIT ?? 0;
        this.throwSCORMError("api", errorCode);
        if (errorCode === 142) returnValue = global_constants.SCORM_FALSE;
      } else if (checkTerminated && this.isTerminated()) {
        const errorCode = this._error_codes.COMMIT_AFTER_TERM ?? 0;
        this.throwSCORMError("api", errorCode);
        if (errorCode === 143) returnValue = global_constants.SCORM_FALSE;
      } else {
        const result = this.storeData(false);
        if ((result.errorCode ?? 0) > 0) {
          if (result.errorMessage) {
            this.apiLog("commit", `Commit failed with error: ${result.errorMessage}`, LogLevelEnum.ERROR);
          }
          if (result.errorDetails) {
            this.apiLog("commit", `Error details: ${JSON.stringify(result.errorDetails)}`, LogLevelEnum.DEBUG);
          }
          this.throwSCORMError("api", result.errorCode);
        }
        returnValue = result?.result ?? global_constants.SCORM_FALSE;
        this.apiLog(callbackName, " Result: " + returnValue, LogLevelEnum.DEBUG, "HttpRequest");
        if (checkTerminated) this.lastErrorCode = "0";
        this.processListeners(callbackName);
        if (this.settings.enableOfflineSupport && this._offlineStorageService && this._offlineStorageService.isDeviceOnline() && this._courseId) {
          this._offlineStorageService.hasPendingOfflineData(this._courseId).then(hasPendingData => {
            if (hasPendingData) {
              this.apiLog(callbackName, "Syncing pending offline data", LogLevelEnum.INFO);
              this._offlineStorageService?.syncOfflineData().then(syncSuccess => {
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
      if (!this.isNotInitialized() && !(checkTerminated && this.isTerminated())) {
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
     * @return {string} - Error description string (max 255 chars per spec)
     */
    getErrorString(callbackName, CMIErrorCode) {
      let returnValue = "";
      if (CMIErrorCode !== null && CMIErrorCode !== "") {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
        this.processListeners(callbackName);
      }
      if (returnValue.length > 255) {
        returnValue = returnValue.substring(0, 255);
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
      const errorCode = CMIErrorCode === "" ? String(this.lastErrorCode) : CMIErrorCode;
      if (errorCode !== null && errorCode !== "") {
        const customDiagnostic = this._errorHandlingService.lastDiagnostic;
        if (customDiagnostic && String(errorCode) === String(this.lastErrorCode)) {
          returnValue = customDiagnostic;
        } else {
          returnValue = this.getLmsErrorMessageDetails(errorCode, true);
        }
        this.processListeners(callbackName);
      }
      if (returnValue.length > 255) {
        returnValue = returnValue.substring(0, 255);
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
     * Checks if setting an ID would create a duplicate in the objectives or interactions array.
     * Per SCORM 2004 RTE Section 4.1.5/4.1.6: IDs must be unique within their respective arrays.
     *
     * @param {string} CMIElement - The element path (e.g., "cmi.objectives.0.id")
     * @param {string} value - The ID value being set
     * @return {boolean} - True if a duplicate would be created, false otherwise
     * @protected
     */
    _checkForDuplicateId(CMIElement, value) {
      const getCMIArrayProperty = (obj, prop) => {
        if (obj && typeof obj === "object" && prop in obj) {
          const value2 = obj[prop];
          return value2 instanceof CMIArray ? value2 : void 0;
        }
        return void 0;
      };
      const hasDuplicateId = (array, currentIndex, idValue) => {
        for (let i = 0; i < array.childArray.length; i++) {
          if (i !== currentIndex) {
            const child = array.childArray[i];
            if (child && typeof child === "object" && "id" in child && child.id === idValue) {
              return true;
            }
          }
        }
        return false;
      };
      const objectivesMatch = CMIElement.match(/^cmi\.objectives\.(\d+)\.id$/);
      if (objectivesMatch && objectivesMatch[1]) {
        const currentIndex = parseInt(objectivesMatch[1], 10);
        const objectives = getCMIArrayProperty(this.cmi, "objectives");
        if (objectives) {
          return hasDuplicateId(objectives, currentIndex, value);
        }
        return false;
      }
      const interactionsMatch = CMIElement.match(/^cmi\.interactions\.(\d+)\.id$/);
      if (interactionsMatch && interactionsMatch[1]) {
        const currentIndex = parseInt(interactionsMatch[1], 10);
        const interactions = getCMIArrayProperty(this.cmi, "interactions");
        if (interactions) {
          return hasDuplicateId(interactions, currentIndex, value);
        }
        return false;
      }
      const interactionObjectivesMatch = CMIElement.match(/^cmi\.interactions\.(\d+)\.objectives\.(\d+)\.id$/);
      if (interactionObjectivesMatch && interactionObjectivesMatch[1] && interactionObjectivesMatch[2]) {
        const interactionIndex = parseInt(interactionObjectivesMatch[1], 10);
        const currentObjIndex = parseInt(interactionObjectivesMatch[2], 10);
        const interactions = getCMIArrayProperty(this.cmi, "interactions");
        if (interactions) {
          const interaction = interactions.childArray[interactionIndex];
          if (interaction) {
            const objectives = getCMIArrayProperty(interaction, "objectives");
            if (objectives) {
              return hasDuplicateId(objectives, currentObjIndex, value);
            }
          }
        }
        return false;
      }
      return false;
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
    getLmsErrorMessageDetails(_errorNumber) {
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
        if (scorm2004) {
          this.throwSCORMError(CMIElement, this._error_codes.GENERAL_SET_FAILURE, "The data model element was not specified");
        }
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
              if (scorm2004 && attribute === "id" && this.isInitialized()) {
                const duplicateError = this._checkForDuplicateId(CMIElement, value);
                if (duplicateError) {
                  this.throwSCORMError(CMIElement, this._error_codes.GENERAL_SET_FAILURE);
                  break;
                }
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
                if (index > refObject.childArray.length) {
                  const errorCode = scorm2004 ? this._error_codes.GENERAL_SET_FAILURE : this._error_codes.INVALID_SET_VALUE || this._error_codes.GENERAL_SET_FAILURE;
                  this.throwSCORMError(CMIElement, errorCode, `Cannot set array element at index ${index}. Array indices must be sequential. Current array length is ${refObject.childArray.length}, expected index ${refObject.childArray.length}.`);
                  break;
                }
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
        this.apiLog(methodName, `There was an error setting the value for: ${CMIElement}, value of: ${value}`, LogLevelEnum.WARN);
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
        if (scorm2004) {
          this.throwSCORMError(CMIElement, this._error_codes.GENERAL_GET_FAILURE, "The data model element was not specified");
        }
        return "";
      }
      if (scorm2004 && CMIElement.endsWith("._version") && CMIElement !== "cmi._version") {
        this.throwSCORMError(CMIElement, this._error_codes.GENERAL_GET_FAILURE, "The _version keyword was used incorrectly");
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
            const target = String(attribute).substring(8, String(attribute).length - 1);
            return refObject._isTargetValid(target);
          } else if (typeof attribute === "undefined" || !this._checkObjectHasProperty(refObject, attribute)) {
            if (attribute === "_children") {
              this.throwSCORMError(CMIElement, this._error_codes.GENERAL_GET_FAILURE, "The data model element does not have children");
              return;
            } else if (attribute === "_count") {
              this.throwSCORMError(CMIElement, this._error_codes.GENERAL_GET_FAILURE, "The data model element is not a collection and therefore does not have a count");
              return;
            }
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
              this.throwSCORMError(CMIElement, this._error_codes.VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
              return;
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
      this._serializationService.loadFromFlattenedJSON(json, CMIElement, (CMIElement2, value) => this.setCMIValue(CMIElement2, value), () => this.isNotInitialized(), data => {
        this.startingData = data;
      });
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
    loadFromJSON(json) {
      let CMIElement = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      if ((!CMIElement || CMIElement === "") && !Object.hasOwnProperty.call(json, "cmi") && !Object.hasOwnProperty.call(json, "adl")) {
        CMIElement = "cmi";
      }
      this._serializationService.loadFromJSON(json, CMIElement, (CMIElement2, value) => this.setCMIValue(CMIElement2, value), () => this.isNotInitialized(), data => {
        this.startingData = data;
      });
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
     * @returns {ResultObject} - The result of the request
     */
    processHttpRequest(url, params) {
      let immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (this.settings.enableOfflineSupport && this._offlineStorageService && !this._offlineStorageService.isDeviceOnline() && this._courseId) {
        this.apiLog("processHttpRequest", "Device is offline, storing data locally", LogLevelEnum.INFO);
        if (params && typeof params === "object" && "cmi" in params) {
          return this._offlineStorageService.storeOffline(this._courseId, params);
        } else {
          this.apiLog("processHttpRequest", "Invalid commit data format for offline storage", LogLevelEnum.ERROR);
          return {
            result: global_constants.SCORM_FALSE,
            errorCode: this._error_codes.GENERAL ?? 101
          };
        }
      }
      return this._httpService.processHttpRequest(url, params, immediate, (functionName, message, level, element) => this.apiLog(functionName, message, level, element), (functionName, CMIElement, value) => this.processListeners(functionName, CMIElement, value));
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
    _checkObjectHasProperty(obj, attribute) {
      if (obj === null || obj === void 0 || typeof obj !== "object") {
        return false;
      }
      return Object.hasOwnProperty.call(obj, attribute) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), attribute) != null || attribute in obj;
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
        if (returnValue !== "") {
          returnValue = global_constants.SCORM_FALSE;
        }
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
      return this._serializationService.getCommitObject(terminateCommit, this.settings.alwaysSendTotalTime, this.settings.renderCommonCommitFields, (terminateCommit2, includeTotalTime) => this.renderCommitObject(terminateCommit2, includeTotalTime), (terminateCommit2, includeTotalTime) => this.renderCommitCMI(terminateCommit2, includeTotalTime), this.settings.logLevel);
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
        super(CMIElement, errorCode, scorm2004_errors[String(errorCode)]?.basicMessage || "Unknown error", scorm2004_errors[String(errorCode)]?.detailMessage);
      } else {
        super(CMIElement, 101, scorm2004_errors["101"]?.basicMessage, scorm2004_errors["101"]?.detailMessage);
      }
      Object.setPrototypeOf(this, Scorm2004ValidationError.prototype);
    }
  }

  const checkValidFormat = memoize((CMIElement, value, regexPattern, errorCode, errorClass, allowEmptyString) => {
    if (typeof value !== "string") {
      return false;
    }
    const formatRegex = new RegExp(regexPattern);
    const matches = value.match(formatRegex);
    if (allowEmptyString && value === "") {
      return true;
    }
    if (!matches || matches[0] === "") {
      throw new errorClass(CMIElement, errorCode);
    }
    return true;
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, regexPattern, errorCode, _errorClass, allowEmptyString) => {
    const valueKey = typeof value === "string" ? value : `[${typeof value}]`;
    return `${CMIElement}:${valueKey}:${regexPattern}:${errorCode}:${allowEmptyString || false}`;
  });
  const checkValidRange = memoize((CMIElement, value, rangePattern, errorCode, errorClass) => {
    const ranges = rangePattern.split("#");
    value = Number(value);
    if (isNaN(value)) {
      throw new errorClass(CMIElement, errorCode);
    }
    const minBound = ranges[0];
    const maxBound = ranges[1];
    const hasMinimum = minBound !== void 0 && minBound !== "";
    const hasMaximum = maxBound !== void 0 && maxBound !== "" && maxBound !== "*";
    if (hasMinimum && value < Number(minBound)) {
      throw new errorClass(CMIElement, errorCode);
    }
    if (hasMaximum && value > Number(maxBound)) {
      throw new errorClass(CMIElement, errorCode);
    }
    return true;
  },
  // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  (CMIElement, value, rangePattern, errorCode, _errorClass) => `${CMIElement}:${value}:${rangePattern}:${errorCode}`);

  function check2004ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
    return checkValidFormat(CMIElement, value, regexPattern, scorm2004_errors$1.TYPE_MISMATCH, Scorm2004ValidationError, allowEmptyString);
  }
  function check2004ValidRange(CMIElement, value, rangePattern) {
    return checkValidRange(CMIElement, value, rangePattern, scorm2004_errors$1.VALUE_OUT_OF_RANGE, Scorm2004ValidationError);
  }

  const scorm12_regex = {
    /** CMIString256 - Character string, max 255 chars (RTE A.1) */
    CMIString256: "^[\\s\\S]{0,255}$",
    /** CMISInteger - Signed integer (RTE A.5) */
    CMISInteger: "^-?([0-9]+)$",
    /**
     * CMIDecimal - Signed decimal (RTE A.6)
     * We set practical limits on decimals to prevent abuse while maintaining
     * broad compatibility with legacy content.
     * Increased from 3 to 10 digits before decimal to match SCORM 2004 behavior.
     */
    CMIDecimal: "^-?([0-9]{0,10})(\\.[0-9]*)?$",
    /** score_range - Valid score range 0-100 (RTE 3.4.2.2.2) */
    score_range: "0#100",
    /** audio_range - Audio level range -1 to 100 (RTE 3.4.2.3.1) */
    audio_range: "-1#100",
    /** speed_range - Playback speed range -100 to 100 (RTE 3.4.2.3.2) */
    speed_range: "-100#100",
    /** text_range - Text display preference -1 to 1 (RTE 3.4.2.3.3) */
    text_range: "-1#1"
  };
  const scorm2004_regex = {
    /** CMIString250 - Character string, max 250 chars (RTE C.1.1) */
    CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
    /** CMIString1000 - Character string, max 1000 chars (RTE C.1.1) */
    CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
    /** CMIString4000 - Character string, max 4000 chars (RTE C.1.1) */
    CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
    /** CMIString64000 - Character string, max 64000 chars (RTE C.1.1) */
    CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
    /**
     * CMILang - Language code per RFC 1766/RFC 3066 (RTE C.1.2)
     * Primary tag: 1-8 characters (ISO 639-1: 2, ISO 639-2: 3, or i/x for IANA/private)
     * Subtag: 2-8 alphanumeric characters
     */
    CMILang: "^([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?$|^$",
    /** CMILangString250 - String with optional language tag, max 250 chars (RTE C.1.3) */
    CMILangString250: "^({lang=([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,250}$)?$",
    /** CMILangcr - Language tag pattern with content */
    CMILangcr: "^(({lang=([a-zA-Z]{1,8}|i|x)?(-[a-zA-Z0-9-]{2,8})?}))(.*?)$",
    /** CMILangString250cr - String with optional language tag (carriage return variant) */
    CMILangString250cr: "^(({lang=([a-zA-Z]{1,8}|i|x)?(-[a-zA-Z0-9-]{2,8})?})?(.{0,250})?)?$",
    /** CMILangString4000 - String with optional language tag, max 4000 chars (RTE C.1.3) */
    CMILangString4000: "^({lang=([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,4000}$)?$",
    /**
     * CMITime - ISO 8601 timestamp format (RTE C.1.4)
     * Year range expanded from 1970-2038 to 1970-9999 to support future dates
     */
    CMITime: "^(19[7-9][0-9]|[2-9][0-9]{3})((-(0[1-9]|1[0-2]))((-(0[1-9]|[1-2][0-9]|3[0-1]))(T([0-1][0-9]|2[0-3])((:[0-5][0-9])((:[0-5][0-9])((\\.[0-9]{1,6})((Z|([+|-]([0-1][0-9]|2[0-3])))(:[0-5][0-9])?)?)?)?)?)?)?)?$",
    /** CMITimespan - ISO 8601 duration format (RTE C.1.5) */
    CMITimespan: "^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:(\\d+(?:\\.\\d{1,2})?)S)?)?$",
    /** CMISInteger - Signed integer (RTE C.1.7) */
    CMISInteger: "^-?([0-9]+)$",
    /**
     * CMIDecimal - Signed decimal (RTE C.1.8)
     * Spec allows unlimited digits, but we set practical limits to prevent abuse
     * while maintaining broad compatibility:
     * - Up to 10 digits before decimal (supports values up to 10 billion)
     * - Up to 18 digits after decimal (maintains precision for scientific use)
     */
    CMIDecimal: "^-?([0-9]{1,10})(\\.[0-9]{1,18})?$",
    /** CMIShortIdentifier - Short identifier with word chars/punctuation, max 250 chars (RTE C.1.10) */
    CMIShortIdentifier: "^[\\w\\.\\-\\_]{1,250}$",
    /** CMILongIdentifier - Long identifier supporting URN format, max 4000 chars (RTE C.1.11) */
    CMILongIdentifier: "^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$",
    /** CMIFeedback - Unrestricted feedback text (RTE C.1.12) */
    CMIFeedback: "^.*$",
    /** CMICStatus - Completion status vocabulary (RTE 4.1.4) */
    CMICStatus: "^(completed|incomplete|not attempted|unknown)$",
    /** CMISStatus - Success status vocabulary (RTE 4.1.11) */
    CMISStatus: "^(passed|failed|unknown)$",
    /** CMIExit - Exit vocabulary (RTE 4.1.3) */
    CMIExit: "^(time-out|suspend|logout|normal)$",
    /** CMIType - Interaction type vocabulary (RTE 4.1.6.2) */
    CMIType: "^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$",
    /** CMIResult - Interaction result vocabulary (RTE 4.1.6.8) */
    CMIResult: "^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$",
    /** NAVEvent - Navigation event vocabulary (SN Book Table 4.4.2) */
    NAVEvent: "^(_?(start|resumeAll|previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|retry|retryAll)|_none_|(\\{target=(?<choice_target>\\S{0,}[a-zA-Z0-9-_]+)})?choice|(\\{target=(?<jump_target>\\S{0,}[a-zA-Z0-9-_]+)})?jump)$",
    /** NAVBoolean - Navigation boolean vocabulary (SN Book) */
    NAVBoolean: "^(unknown|true|false)$",
    /** NAVTarget - Navigation target pattern (SN Book) */
    NAVTarget: "^{target=\\S{0,}[a-zA-Z0-9-_]+}$",
    /** scaled_range - Scaled score range -1 to 1 (RTE 4.1.10.1) */
    scaled_range: "-1#1",
    /** audio_range - Audio level range 0 to 999.9999999 (RTE 4.1.7.1) */
    audio_range: "0#999.9999999",
    /** speed_range - Playback speed range 0 to 999.9999999 (RTE 4.1.7.4) */
    speed_range: "0#999.9999999",
    /** text_range - Text display preference -1 to 1 (RTE 4.1.7.5) */
    text_range: "-1#1",
    /** progress_range - Progress measure range 0 to 1 (RTE 4.1.8) */
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
      throw new Scorm2004ValidationError(this._cmi_element + "._children", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
      if (check2004ValidFormat(this._cmi_element + ".audio_level", audio_level, scorm2004_regex.CMIDecimal) && check2004ValidRange(this._cmi_element + ".audio_level", audio_level, scorm2004_regex.audio_range)) {
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
      if (check2004ValidFormat(this._cmi_element + ".delivery_speed", delivery_speed, scorm2004_regex.CMIDecimal) && check2004ValidRange(this._cmi_element + ".delivery_speed", delivery_speed, scorm2004_regex.speed_range)) {
        if (parseFloat(delivery_speed) === 0) {
          throw new Scorm2004ValidationError(this._cmi_element + ".delivery_speed", scorm2004_errors$1.VALUE_OUT_OF_RANGE);
        }
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
      if (check2004ValidFormat(this._cmi_element + ".audio_captioning", audio_captioning, scorm2004_regex.CMISInteger) && check2004ValidRange(this._cmi_element + ".audio_captioning", audio_captioning, scorm2004_regex.text_range)) {
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
     * Constructor for `cmi.interactions` Array
     *
     * Per SCORM 2004 RTE Section 4.1.6:
     * - Read-only array structure (add via index access)
     * - Each interaction has enhanced metadata and validation
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
      this._idIsSet = false;
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
      this._idIsSet = false;
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
     * Per SCORM 2004 RTE: identifier SHALL NOT be empty or contain only whitespace
     * Per SCORM 2004 RTE Section 4.1.6: Once set, an interaction ID is immutable (error 351)
     * @param {string} id
     */
    set id(id) {
      if (id === "" || id.trim() === "") {
        throw new Scorm2004ValidationError(this._cmi_element + ".id", scorm2004_errors$1.TYPE_MISMATCH);
      }
      if (this._idIsSet && this._id !== id) {
        throw new Scorm2004ValidationError(this._cmi_element + ".id", scorm2004_errors$1.GENERAL_SET_FAILURE);
      }
      if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
        this._id = id;
        this._idIsSet = true;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".type", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".timestamp", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".weighting", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".weighting", weighting, scorm2004_regex.CMIDecimal)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
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
                const values = nodes[i]?.split(delimiter2);
                if (values?.length === 2) {
                  if (this.type === "performance" && (values[0] === "" || values[1] === "")) {
                    throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
                  }
                  if (!values[0]?.match(formatRegex)) {
                    throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
                  } else {
                    if (!response_type.format2 || !values[1]?.match(new RegExp(response_type.format2))) {
                      throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
                    }
                  }
                } else {
                  throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
                }
              } else {
                if (!nodes[i]?.match(formatRegex)) {
                  throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
                } else {
                  if (nodes[i] !== "" && response_type.unique) {
                    for (let j = 0; j < i; j++) {
                      if (nodes[i] === nodes[j]) {
                        throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
                      }
                    }
                  }
                }
              }
            }
          } else {
            throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.GENERAL_SET_FAILURE);
          }
          this._learner_response = learner_response;
        } else {
          throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", scorm2004_errors$1.TYPE_MISMATCH);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".latency", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".description", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".description", description, scorm2004_regex.CMILangString250, true)) {
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
     * Per SCORM 2004 RTE: identifier SHALL NOT be empty or contain only whitespace
     * @param {string} id
     */
    set id(id) {
      if (id === "" || id.trim() === "") {
        throw new Scorm2004ValidationError(this._cmi_element + ".id", scorm2004_errors$1.TYPE_MISMATCH);
      }
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
    return text.split(splitRe).map(part => part.replace(unescapeRe, delim));
  }
  function splitFirstUnescaped(text, delim) {
    const reDelim = escapeRegex(delim);
    const splitRe = new RegExp(`(?<!\\\\)${reDelim}`);
    const unescapeRe = new RegExp(`\\\\${reDelim}`, "g");
    const parts = text.split(splitRe);
    const firstPart = parts[0] ?? "";
    if (parts.length === 1) {
      return [firstPart.replace(unescapeRe, delim)];
    }
    const part1 = firstPart.replace(unescapeRe, delim);
    const part2 = parts.slice(1).join(delim).replace(unescapeRe, delim);
    return [part1, part2];
  }
  function validatePattern(type, pattern, responseDef) {
    if (pattern.trim() !== pattern) {
      throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
    }
    const subDelim1 = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : null;
    const rawNodes = subDelim1 ? splitUnescaped(pattern, subDelim1) : [pattern];
    for (const raw of rawNodes) {
      if (raw.trim() !== raw) {
        throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
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
      throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
    }
    if (responseDef.unique || responseDef.duplicate === false) {
      const seen = new Set(nodes);
      if (seen.size !== nodes.length) {
        throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
      }
    }
    if (nodes.length === 0 || nodes.length > responseDef.max) {
      throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.GENERAL_SET_FAILURE);
    }
    const fmt1 = new RegExp(responseDef.format);
    const fmt2 = responseDef.format2 ? new RegExp(responseDef.format2) : null;
    const checkSingle = value => {
      if (!fmt1.test(value)) {
        throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
      }
    };
    const checkPair = (value, delimBracketed) => {
      if (!delimBracketed) {
        throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
      }
      const delim = stripBrackets(delimBracketed);
      const parts = value.split(new RegExp(`(?<!\\\\)${escapeRegex(delim)}`, "g")).map(n => n.replace(new RegExp(`\\\\${escapeRegex(delim)}`, "g"), delim));
      if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
        throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
      }
      if (parts[0] !== void 0 && !fmt1.test(parts[0]) || fmt2 && parts[1] !== void 0 && !fmt2.test(parts[1])) {
        throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
      }
    };
    for (const node of nodes) {
      switch (type) {
        case "numeric":
          {
            const numDelim = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : ":";
            const nums = node.split(numDelim);
            if (nums.length < 1 || nums.length > 2) {
              throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
            }
            nums.forEach(checkSingle);
            break;
          }
        case "performance":
          {
            const delimBracketed = responseDef.delimiter2;
            if (!delimBracketed) {
              throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
            }
            const delim = stripBrackets(delimBracketed);
            const parts = splitFirstUnescaped(node, delim);
            if (parts.length !== 2) {
              throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
            }
            const [part1, part2] = parts;
            if (part1 === "" || part2 === "" || part1 === part2) {
              throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
            }
            if (part1 === void 0 || !fmt1.test(part1)) {
              throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
            }
            if (fmt2 && part2 !== void 0 && !fmt2.test(part2)) {
              throw new Scorm2004ValidationError("cmi.interactions.n.correct_responses.n.pattern", scorm2004_errors$1.TYPE_MISMATCH);
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
      const result = {
        pattern: this.pattern
      };
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
        super(CMIElement, errorCode, scorm12_errors[String(errorCode)]?.basicMessage || "Unknown error", scorm12_errors[String(errorCode)]?.detailMessage);
      } else {
        super(CMIElement, 101, scorm12_errors["101"]?.basicMessage, scorm12_errors["101"]?.detailMessage);
      }
      Object.setPrototypeOf(this, Scorm12ValidationError.prototype);
    }
  }

  function check12ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
    return checkValidFormat(CMIElement, value, regexPattern, scorm12_errors$1.TYPE_MISMATCH, Scorm12ValidationError, allowEmptyString);
  }
  function check12ValidRange(CMIElement, value, rangePattern, allowEmptyString) {
    if (value === "") {
      {
        throw new Scorm12ValidationError(CMIElement, scorm12_errors$1.VALUE_OUT_OF_RANGE);
      }
    }
    return checkValidRange(CMIElement, value, rangePattern, scorm12_errors$1.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
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
     * @spec SCORM 1.2 RTE 3.4.2.3.1 - Audio preference validation
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
     * @spec SCORM 1.2 RTE 3.4.2.3.2 - Language preference validation
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
     * @spec SCORM 1.2 RTE 3.4.2.3.3 - Speed preference validation
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
     * @spec SCORM 1.2 RTE 3.4.2.3.4 - Text preference validation
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
     *
     * SPEC COMPLIANCE NOTE for _max default:
     * The SCORM 1.2 specification defines the default value for score.max as empty string ("").
     * This implementation defaults to "100" instead for the following reasons:
     *
     * 1. Most SCOs expect a 0-100 scale and don't explicitly set max
     * 2. An empty max creates ambiguity in score interpretation
     * 3. "100" is the most common expected value and simplifies SCO development
     * 4. This matches real-world LMS behavior (most default to 100)
     * 5. SCOs can still explicitly set max="" if needed
     *
     * Strict spec default would be: ""
     *
     * @param params - Configuration parameters
     * @param params.score_range - Optional range pattern. When provided, uses scorm12_regex.score_range.
     *                             When omitted or falsy, disables range validation (sets to false).
     *                             SCORM 1.2 passes a truthy value to enable "0#100" validation.
     *                             SCORM 2004 omits this to allow unbounded scores.
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
     *
     * SCORE-01: Resets _raw and _min to empty strings to match subclass behavior.
     * _max is NOT reset here as it has a non-trivial default ("100") that is
     * handled by the constructor or reinitialization logic.
     */
    reset() {
      this._initialized = false;
      this._raw = "";
      this._min = "";
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
      if (validationService.validateScore(this._cmi_element + ".raw", raw, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
      if (validationService.validateScore(this._cmi_element + ".min", min, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
      if (validationService.validateScore(this._cmi_element + ".max", max, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
        this._max = max;
      }
    }
    /**
     * Gets score object with numeric values
     * @return {ScoreObject}
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
    constructor() {
      let readOnlyAfterInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".comment", scorm2004_errors$1.READ_ONLY_ELEMENT);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".comment", comment, scorm2004_regex.CMILangString4000, true)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".location", scorm2004_errors$1.READ_ONLY_ELEMENT);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".location", location, scorm2004_regex.CMIString250)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".timestamp", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
      return this.childArray.find(objective => objective.id === id);
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
      this._idIsSet = false;
      this._success_status = "unknown";
      this._completion_status = "unknown";
      this._progress_measure = "";
      this._description = "";
      this.score = new Scorm2004CMIScore();
    }
    reset() {
      this._initialized = false;
      this._id = "";
      this._idIsSet = false;
      this._success_status = "unknown";
      this._completion_status = "unknown";
      this._progress_measure = "";
      this._description = "";
      this.score?.reset();
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
     * Per SCORM 2004 RTE: identifier SHALL NOT be empty or contain only whitespace
     * Per SCORM 2004 RTE Section 4.1.5: Once set, an objective ID is immutable (error 351)
     * @param {string} id
     */
    set id(id) {
      if (id === "" || id.trim() === "") {
        throw new Scorm2004ValidationError(this._cmi_element + ".id", scorm2004_errors$1.TYPE_MISMATCH);
      }
      if (this._idIsSet && this._id !== id) {
        throw new Scorm2004ValidationError(this._cmi_element + ".id", scorm2004_errors$1.GENERAL_SET_FAILURE);
      }
      if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
        this._id = id;
        this._idIsSet = true;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".success_status", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".success_status", success_status, scorm2004_regex.CMISStatus)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".completion_status", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".completion_status", completion_status, scorm2004_regex.CMICStatus)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".progress_measure", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".progress_measure", progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(this._cmi_element + ".progress_measure", progress_measure, scorm2004_regex.progress_range)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".description", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        if (check2004ValidFormat(this._cmi_element + ".description", description, scorm2004_regex.CMILangString250, true)) {
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
    /**
     * Populate this objective from a plain object
     * @param {any} data
     */
    fromJSON(data) {
      if (!data || typeof data !== "object") return;
      if (typeof data.id === "string") this.id = data.id;
      if (typeof data.success_status === "string") this.success_status = data.success_status;
      if (typeof data.completion_status === "string") this.completion_status = data.completion_status;
      if (typeof data.progress_measure !== "undefined") this.progress_measure = String(data.progress_measure);
      if (typeof data.description === "string") this.description = data.description;
      if (data.score && typeof data.score === "object") {
        if (typeof data.score.scaled !== "undefined") this.score.scaled = String(data.score.scaled);
        if (typeof data.score.raw !== "undefined") this.score.raw = String(data.score.raw);
        if (typeof data.score.min !== "undefined") this.score.min = String(data.score.min);
        if (typeof data.score.max !== "undefined") this.score.max = String(data.score.max);
      }
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
      throw new Scorm2004ValidationError(this._cmi_element + "._version", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
      throw new Scorm2004ValidationError(this._cmi_element + "._children", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".learner_id", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".learner_name", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
      if (check2004ValidFormat(this._cmi_element + ".completion_status", completion_status, scorm2004_regex.CMICStatus)) {
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
      if (check2004ValidFormat(this._cmi_element + ".success_status", success_status, scorm2004_regex.CMISStatus)) {
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
      if (check2004ValidFormat(this._cmi_element + ".progress_measure", progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(this._cmi_element + ".progress_measure", progress_measure, scorm2004_regex.progress_range)) {
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
      this._total_time = "PT0S";
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
        throw new Scorm2004ValidationError(this._cmi_element + ".entry", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".exit", scorm2004_errors$1.WRITE_ONLY_ELEMENT);
      }
      return this._exit;
    }
    /**
     * Internal getter for exit value - for use by the API for sequencing purposes.
     * This bypasses the write-only restriction since the API needs to know the exit
     * value to properly handle sequencing and navigation.
     * @return {string}
     */
    getExitValueInternal() {
      return this._exit;
    }
    /**
     * Setter for _exit
     * @param {string} exit
     */
    set exit(exit) {
      if (exit === "logout") {
        console.warn('SCORM 2004: cmi.exit value "logout" is deprecated per 4th Edition. Consider using "normal" or "suspend" instead.');
      }
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
        throw new Scorm2004ValidationError(this._cmi_element + ".session_time", scorm2004_errors$1.WRITE_ONLY_ELEMENT);
      }
      return this._session_time;
    }
    /**
     * Setter for _session_time
     * @param {string} session_time
     */
    set session_time(session_time) {
      if (check2004ValidFormat(this._cmi_element + ".session_time", session_time, scorm2004_regex.CMITimespan)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".total_time", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
      if (typeof start_time !== "undefined") {
        const seconds = (/* @__PURE__ */new Date()).getTime() - start_time;
        sessionTime = getSecondsAsISODuration(seconds / 1e3);
      }
      return addTwoDurations(this._total_time, sessionTime, scorm2004_regex.CMITimespan);
    }
    /**
     * Reset the session properties
     *
     * When resetting for a new SCO delivery, entry is set to "ab-initio" per SCORM 2004 spec:
     * - "ab-initio" indicates the learner is beginning a new attempt on the activity
     * - "resume" indicates the learner is resuming a previously suspended attempt
     *
     * Since reset() is called for SCO transitions (new attempts), "ab-initio" is the correct value.
     * The LMS can override this if the learner is resuming a suspended session.
     */
    reset() {
      this._initialized = false;
      this._entry = "ab-initio";
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
        throw new Scorm2004ValidationError(this._cmi_element + ".launch_data", scorm2004_errors$1.READ_ONLY_ELEMENT);
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
      if (check2004ValidFormat(this._cmi_element + ".suspend_data", suspend_data, scorm2004_regex.CMIString64000, true)) {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".credit", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (!/^(credit|no-credit)$/.test(credit)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".credit", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._credit = credit;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".mode", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (!/^(browse|normal|review)$/.test(mode)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".mode", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._mode = mode;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".time_limit_action", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (!/^(exit,message|exit,no message|continue,message|continue,no message)$/.test(time_limit_action)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".time_limit_action", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._time_limit_action = time_limit_action;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".max_time_allowed", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (max_time_allowed === "") {
        this._max_time_allowed = max_time_allowed;
        return;
      }
      const regex = new RegExp(scorm2004_regex.CMITimespan);
      if (!regex.test(max_time_allowed)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".max_time_allowed", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._max_time_allowed = max_time_allowed;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".scaled_passing_score", scorm2004_errors$1.READ_ONLY_ELEMENT ?? 404);
      }
      if (scaled_passing_score === "") {
        this._scaled_passing_score = scaled_passing_score;
        return;
      }
      const regex = new RegExp(scorm2004_regex.CMIDecimal);
      if (!regex.test(scaled_passing_score)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".scaled_passing_score", scorm2004_errors$1.TYPE_MISMATCH ?? 406);
      }
      const num = parseFloat(scaled_passing_score);
      if (num < -1 || num > 1) {
        throw new Scorm2004ValidationError(this._cmi_element + ".scaled_passing_score", scorm2004_errors$1.VALUE_OUT_OF_RANGE ?? 407);
      }
      this._scaled_passing_score = scaled_passing_score;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".completion_threshold", scorm2004_errors$1.READ_ONLY_ELEMENT ?? 404);
      }
      if (completion_threshold === "") {
        this._completion_threshold = completion_threshold;
        return;
      }
      const regex = new RegExp(scorm2004_regex.CMIDecimal);
      if (!regex.test(completion_threshold)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".completion_threshold", scorm2004_errors$1.TYPE_MISMATCH ?? 406);
      }
      const num = parseFloat(completion_threshold);
      if (num < 0 || num > 1) {
        throw new Scorm2004ValidationError(this._cmi_element + ".completion_threshold", scorm2004_errors$1.VALUE_OUT_OF_RANGE ?? 407);
      }
      this._completion_threshold = completion_threshold;
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
    constructor() {
      let initialized = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
     * 
     * Resets SCO-specific CMI data while preserving global objectives.
     * 
     * The objectives.reset(false) call resets individual objective objects
     * but maintains the array structure. Global objectives stored in
     * Scorm2004API._globalObjectives are preserved separately and are not
     * affected by this reset.
     * 
     * This aligns with SCORM 2004 Sequencing and Navigation (SN) Book:
     * - Content Delivery Environment Process (DB.2) requires reset between SCOs
     * - Global objectives (via mapInfo) must persist across SCO transitions
     * - SCO-specific data (location, entry, session, interactions) must be reset
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
      this.objectives?.reset(true);
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
     * @spec RTE 4.2.8 - cmi.completion_status
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
     * @spec RTE 4.2.9 - cmi.completion_threshold
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
     * @spec RTE 4.2.10 - cmi.credit
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
     * @spec RTE 4.2.11 - cmi.entry
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
     * @spec RTE 4.2.12 - cmi.exit
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
     * Internal getter for exit value - for use by the API for sequencing purposes.
     * This bypasses the write-only restriction since the API needs to know the exit
     * value to properly handle sequencing and navigation.
     * @return {string}
     */
    getExitValueInternal() {
      return this.session.getExitValueInternal();
    }
    /**
     * Getter for _launch_data
     * @return {string}
     * @spec RTE 4.2.13 - cmi.launch_data
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
     * @spec RTE 4.2.14 - cmi.learner_id
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
     * @spec RTE 4.2.15 - cmi.learner_name
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
     * @spec RTE 4.2.17 - cmi.location
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
     * @spec RTE 4.2.18 - cmi.max_time_allowed
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
     * @spec RTE 4.2.19 - cmi.mode
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
     * @spec RTE 4.2.21 - cmi.progress_measure
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
     * @spec RTE 4.2.22 - cmi.scaled_passing_score
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
     * @spec RTE 4.2.24 - cmi.session_time
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
     * @spec RTE 4.2.25 - cmi.success_status
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
     * @spec RTE 4.2.26 - cmi.suspend_data
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
     * @spec RTE 4.2.27 - cmi.time_limit_action
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
     * @spec RTE 4.2.28 - cmi.total_time
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
     *      time_limit_action: string,
     *      total_time: string
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
        time_limit_action: this.time_limit_action,
        total_time: this.total_time
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
      this.request_valid.setParentNav(this);
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
      if (this._sequencing) {
        this._sequencing.adlNav = null;
      }
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
        this._request = request;
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
      this._idIsSet = false;
      this._storeIsSet = false;
    }
    /**
     * Called when the API has been reset
     */
    reset() {
      this._initialized = false;
      this._idIsSet = false;
      this._storeIsSet = false;
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
     * Per SCORM 2004 4th Ed: id is read-only after initialization (error 404)
     * @param {string} id
     */
    set id(id) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".id", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
        this._id = id;
        this._idIsSet = true;
      }
    }
    /**
     * Getter for _store
     * Per SCORM 2004 4th Ed: returns error 403 if store not initialized
     * @return {string}
     */
    get store() {
      if (this.initialized && !this._storeIsSet) {
        throw new Scorm2004ValidationError(this._cmi_element + ".store", scorm2004_errors$1.VALUE_NOT_INITIALIZED);
      }
      return this._store;
    }
    /**
     * Setter for _store
     * Per SCORM 2004 4th Ed: store requires id to be set first (error 408)
     * Per SCORM 2004 4th Ed SPM: store max length is 64000 characters
     * @param {string} store
     */
    set store(store) {
      if (this.initialized && !this._idIsSet) {
        throw new Scorm2004ValidationError(this._cmi_element + ".store", scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED);
      }
      if (check2004ValidFormat(this._cmi_element + ".store", store, scorm2004_regex.CMIString64000)) {
        this._store = store;
        this._storeIsSet = true;
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
  class ADLNavRequestValidChoice {
    constructor() {
      this._parentNav = null;
      this._staticValues = {};
    }
    setParentNav(nav) {
      this._parentNav = nav;
    }
    /**
     * Validate if a target can be chosen
     * Called by BaseAPI when accessing adl.nav.request_valid.choice.{target=...}
     */
    _isTargetValid(target) {
      if (this._parentNav?.sequencing?.overallSequencingProcess) {
        const process = this._parentNav.sequencing.overallSequencingProcess;
        if (process.predictChoiceEnabled) {
          const result = process.predictChoiceEnabled(target) ? "true" : "false";
          return result;
        }
      }
      const value = this._staticValues[target];
      if (value === NAVBoolean.TRUE) {
        return "true";
      }
      if (value === NAVBoolean.FALSE) {
        return "false";
      }
      return "unknown";
    }
    /**
     * Get all static values
     */
    getAll() {
      return {
        ...this._staticValues
      };
    }
    /**
     * Set static values (used during initialization)
     */
    setAll(values) {
      this._staticValues = {
        ...values
      };
    }
  }
  class ADLNavRequestValidJump {
    constructor() {
      this._parentNav = null;
      this._staticValues = {};
    }
    setParentNav(nav) {
      this._parentNav = nav;
    }
    /**
     * Validate if a target can be jumped to
     * Called by BaseAPI when accessing adl.nav.request_valid.jump.{target=...}
     */
    _isTargetValid(target) {
      if (this._parentNav?.sequencing?.activityTree) {
        const activity = this._parentNav.sequencing.activityTree.getActivity(target);
        return activity ? "true" : "false";
      }
      const value = this._staticValues[target];
      if (value === NAVBoolean.TRUE) return "true";
      if (value === NAVBoolean.FALSE) return "false";
      return "unknown";
    }
    /**
     * Get all static values
     */
    getAll() {
      return {
        ...this._staticValues
      };
    }
    /**
     * Set static values (used during initialization)
     */
    setAll(values) {
      this._staticValues = {
        ...values
      };
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
      this._exit = "unknown";
      this._exitAll = "unknown";
      this._abandon = "unknown";
      this._abandonAll = "unknown";
      this._suspendAll = "unknown";
      this._parentNav = null;
      this._choice = new ADLNavRequestValidChoice();
      this._jump = new ADLNavRequestValidJump();
    }
    /**
     * Set parent nav reference for sequencing access
     * @param {ADLNav} nav - Parent ADLNav instance
     */
    setParentNav(nav) {
      this._parentNav = nav;
      this._choice.setParentNav(nav);
      this._jump.setParentNav(nav);
    }
    /**
     * Called when the API has been reset
     */
    reset() {
      this._initialized = false;
      this._continue = "unknown";
      this._previous = "unknown";
      this._choice.setAll({});
      this._jump.setAll({});
      this._exit = "unknown";
      this._exitAll = "unknown";
      this._abandon = "unknown";
      this._abandonAll = "unknown";
      this._suspendAll = "unknown";
    }
    /**
     * Getter for _continue
     * Dynamically evaluates whether continue navigation is valid using sequencing
     * @return {string}
     */
    get continue() {
      if (this._parentNav?.sequencing?.overallSequencingProcess) {
        const process = this._parentNav.sequencing.overallSequencingProcess;
        if (process.predictContinueEnabled) {
          return process.predictContinueEnabled() ? "true" : "false";
        }
      }
      return this._continue;
    }
    /**
     * Setter for _continue. Just throws an error.
     * @param {string} _continue
     */
    set continue(_continue) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".continue", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".continue", _continue, scorm2004_regex.NAVBoolean)) {
        this._continue = _continue;
      }
    }
    /**
     * Getter for _previous
     * Dynamically evaluates whether previous navigation is valid using sequencing
     * @return {string}
     */
    get previous() {
      if (this._parentNav?.sequencing?.overallSequencingProcess) {
        const process = this._parentNav.sequencing.overallSequencingProcess;
        if (process.predictPreviousEnabled) {
          return process.predictPreviousEnabled() ? "true" : "false";
        }
      }
      return this._previous;
    }
    /**
     * Setter for _previous. Just throws an error.
     * @param {string} _previous
     */
    set previous(_previous) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".previous", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".previous", _previous, scorm2004_regex.NAVBoolean)) {
        this._previous = _previous;
      }
    }
    /**
     * Getter for _choice
     * @return {ADLNavRequestValidChoice}
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
        throw new Scorm2004ValidationError(this._cmi_element + ".choice", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (typeof choice !== "object") {
        throw new Scorm2004ValidationError(this._cmi_element + ".choice", scorm2004_errors$1.TYPE_MISMATCH);
      }
      const converted = {};
      for (const key in choice) {
        if ({}.hasOwnProperty.call(choice, key)) {
          if (check2004ValidFormat(this._cmi_element + ".choice." + key, choice[key] || "", scorm2004_regex.NAVBoolean) && check2004ValidFormat(this._cmi_element + ".choice." + key, key, scorm2004_regex.NAVTarget)) {
            const value = choice[key];
            if (value === "true") {
              converted[key] = NAVBoolean.TRUE;
            } else if (value === "false") {
              converted[key] = NAVBoolean.FALSE;
            } else if (value === "unknown") {
              converted[key] = NAVBoolean.UNKNOWN;
            }
          }
        }
      }
      this._choice.setAll(converted);
    }
    /**
     * Getter for _jump
     * @return {ADLNavRequestValidJump}
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
        throw new Scorm2004ValidationError(this._cmi_element + ".jump", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (typeof jump !== "object") {
        throw new Scorm2004ValidationError(this._cmi_element + ".jump", scorm2004_errors$1.TYPE_MISMATCH);
      }
      const converted = {};
      for (const key in jump) {
        if ({}.hasOwnProperty.call(jump, key)) {
          if (check2004ValidFormat(this._cmi_element + ".jump." + key, jump[key] || "", scorm2004_regex.NAVBoolean) && check2004ValidFormat(this._cmi_element + ".jump." + key, key, scorm2004_regex.NAVTarget)) {
            const value = jump[key];
            if (value === "true") {
              converted[key] = NAVBoolean.TRUE;
            } else if (value === "false") {
              converted[key] = NAVBoolean.FALSE;
            } else if (value === "unknown") {
              converted[key] = NAVBoolean.UNKNOWN;
            }
          }
        }
      }
      this._jump.setAll(converted);
    }
    /**
     * Getter for _exit
     * @return {string}
     */
    get exit() {
      return this._exit;
    }
    /**
     * Setter for _exit. Just throws an error.
     * @param {string} _exit
     */
    set exit(_exit) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".exit", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".exit", _exit, scorm2004_regex.NAVBoolean)) {
        this._exit = _exit;
      }
    }
    /**
     * Getter for _exitAll
     * @return {string}
     */
    get exitAll() {
      return this._exitAll;
    }
    /**
     * Setter for _exitAll. Just throws an error.
     * @param {string} _exitAll
     */
    set exitAll(_exitAll) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".exitAll", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".exitAll", _exitAll, scorm2004_regex.NAVBoolean)) {
        this._exitAll = _exitAll;
      }
    }
    /**
     * Getter for _abandon
     * @return {string}
     */
    get abandon() {
      return this._abandon;
    }
    /**
     * Setter for _abandon. Just throws an error.
     * @param {string} _abandon
     */
    set abandon(_abandon) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".abandon", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".abandon", _abandon, scorm2004_regex.NAVBoolean)) {
        this._abandon = _abandon;
      }
    }
    /**
     * Getter for _abandonAll
     * @return {string}
     */
    get abandonAll() {
      return this._abandonAll;
    }
    /**
     * Setter for _abandonAll. Just throws an error.
     * @param {string} _abandonAll
     */
    set abandonAll(_abandonAll) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".abandonAll", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".abandonAll", _abandonAll, scorm2004_regex.NAVBoolean)) {
        this._abandonAll = _abandonAll;
      }
    }
    /**
     * Getter for _suspendAll
     * @return {string}
     */
    get suspendAll() {
      return this._suspendAll;
    }
    /**
     * Setter for _suspendAll. Just throws an error.
     * @param {string} _suspendAll
     */
    set suspendAll(_suspendAll) {
      if (this.initialized) {
        throw new Scorm2004ValidationError(this._cmi_element + ".suspendAll", scorm2004_errors$1.READ_ONLY_ELEMENT);
      }
      if (check2004ValidFormat(this._cmi_element + ".suspendAll", _suspendAll, scorm2004_regex.NAVBoolean)) {
        this._suspendAll = _suspendAll;
      }
    }
    /**
     * toJSON for adl.nav.request_valid
     *
     * @return {
     *    {
     *      previous: string,
     *      continue: string,
     *      choice: { [key: string]: NAVBoolean },
     *      jump: { [key: string]: NAVBoolean },
     *      exit: string,
     *      exitAll: string,
     *      abandon: string,
     *      abandonAll: string,
     *      suspendAll: string
     *    }
     *  }
     */
    toJSON() {
      this.jsonString = true;
      const result = {
        previous: this.previous,
        continue: this.continue,
        choice: this._choice.getAll(),
        jump: this._jump.getAll(),
        exit: this.exit,
        exitAll: this.exitAll,
        abandon: this.abandon,
        abandonAll: this.abandonAll,
        suspendAll: this.suspendAll
      };
      this.jsonString = false;
      return result;
    }
  }

  const HIDE_LMS_UI_TOKENS = ["continue", "previous", "exit", "exitAll", "abandon", "abandonAll", "suspendAll"];

  var RuleConditionOperator = /* @__PURE__ */(RuleConditionOperator2 => {
    RuleConditionOperator2["NOT"] = "not";
    RuleConditionOperator2["AND"] = "and";
    RuleConditionOperator2["OR"] = "or";
    return RuleConditionOperator2;
  })(RuleConditionOperator || {});
  var RuleActionType = /* @__PURE__ */(RuleActionType2 => {
    RuleActionType2["SKIP"] = "skip";
    RuleActionType2["DISABLED"] = "disabled";
    RuleActionType2["HIDE_FROM_CHOICE"] = "hiddenFromChoice";
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
  const _RuleCondition = class _RuleCondition extends BaseCMI {
    /**
     * Constructor for RuleCondition
     * @param {RuleConditionType} condition - The condition type
     * @param {RuleConditionOperator | null} operator - The operator (null for no operator)
     * @param {Map<string, any>} parameters - Additional parameters for the condition
     */
    constructor() {
      let condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "always";
      let operator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : /* @__PURE__ */new Map();
      super("ruleCondition");
      this._condition = "always" /* ALWAYS */;
      this._operator = null;
      this._parameters = /* @__PURE__ */new Map();
      this._referencedObjective = null;
      this._condition = condition;
      this._operator = operator;
      this._parameters = parameters;
    }
    /**
     * Allow integrators to override the clock used for time-based rules.
     */
    static setNowProvider(now) {
      if (typeof now === "function") {
        _RuleCondition._now = now;
      }
    }
    /**
     * Allow integrators to set an elapsed seconds hook for time limit calculations
     */
    static setElapsedSecondsHook(hook) {
      _RuleCondition._getElapsedSecondsHook = hook;
    }
    /**
     * Called when the API needs to be reset
     */
    reset() {
      this._initialized = false;
      this._condition = "always" /* ALWAYS */;
      this._operator = null;
      this._parameters = /* @__PURE__ */new Map();
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
    get referencedObjective() {
      return this._referencedObjective;
    }
    set referencedObjective(objectiveId) {
      this._referencedObjective = objectiveId;
    }
    resolveReferencedObjective(activity) {
      if (!this._referencedObjective) {
        return null;
      }
      if (activity.primaryObjective?.id === this._referencedObjective) {
        return activity.primaryObjective;
      }
      const objectives = activity.objectives || [];
      return objectives.find(obj => obj.id === this._referencedObjective) || null;
    }
    /**
     * Evaluate the condition for an activity
     * @param {Activity} activity - The activity to evaluate the condition for
     * @return {boolean} - True if the condition is met, false otherwise
     */
    evaluate(activity) {
      let result;
      const referencedObjective = this.resolveReferencedObjective(activity);
      switch (this._condition) {
        case "satisfied" /* SATISFIED */:
        case "objectiveSatisfied" /* OBJECTIVE_SATISFIED */:
          if (referencedObjective) {
            result = referencedObjective.satisfiedStatus === true;
          } else {
            result = activity.successStatus === SuccessStatus.PASSED || activity.objectiveSatisfiedStatus === true;
          }
          break;
        case "objectiveStatusKnown" /* OBJECTIVE_STATUS_KNOWN */:
          result = referencedObjective ? !!referencedObjective.measureStatus : !!activity.objectiveMeasureStatus;
          break;
        case "objectiveMeasureKnown" /* OBJECTIVE_MEASURE_KNOWN */:
          result = referencedObjective ? !!referencedObjective.measureStatus : !!activity.objectiveMeasureStatus;
          break;
        case "objectiveMeasureGreaterThan" /* OBJECTIVE_MEASURE_GREATER_THAN */:
          {
            const greaterThanValue = this._parameters.get("threshold") || 0;
            const measureStatus = referencedObjective ? referencedObjective.measureStatus : activity.objectiveMeasureStatus;
            const measureValue = referencedObjective ? referencedObjective.normalizedMeasure : activity.objectiveNormalizedMeasure;
            result = !!measureStatus && measureValue > greaterThanValue;
            break;
          }
        case "objectiveMeasureLessThan" /* OBJECTIVE_MEASURE_LESS_THAN */:
          {
            const lessThanValue = this._parameters.get("threshold") || 0;
            const measureStatus = referencedObjective ? referencedObjective.measureStatus : activity.objectiveMeasureStatus;
            const measureValue = referencedObjective ? referencedObjective.normalizedMeasure : activity.objectiveNormalizedMeasure;
            result = !!measureStatus && measureValue < lessThanValue;
            break;
          }
        case "completed" /* COMPLETED */:
        case "activityCompleted" /* ACTIVITY_COMPLETED */:
          if (referencedObjective) {
            result = referencedObjective.completionStatus === CompletionStatus.COMPLETED;
          } else {
            result = activity.isCompleted;
          }
          break;
        case "progressKnown" /* PROGRESS_KNOWN */:
        case "activityProgressKnown" /* ACTIVITY_PROGRESS_KNOWN */:
          if (referencedObjective) {
            result = referencedObjective.completionStatus !== CompletionStatus.UNKNOWN;
          } else {
            result = activity.completionStatus !== "unknown";
          }
          break;
        case "attempted" /* ATTEMPTED */:
          result = activity.attemptCount > 0;
          break;
        case "attemptLimitExceeded" /* ATTEMPT_LIMIT_EXCEEDED */:
          result = activity.hasAttemptLimitExceeded();
          break;
        case "timeLimitExceeded" /* TIME_LIMIT_EXCEEDED */:
          result = this.evaluateTimeLimitExceeded(activity);
          break;
        case "outsideAvailableTimeRange" /* OUTSIDE_AVAILABLE_TIME_RANGE */:
          result = this.evaluateOutsideAvailableTimeRange(activity);
          break;
        case "always" /* ALWAYS */:
          result = true;
          break;
        case "never" /* NEVER */:
          result = false;
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
     * Evaluate if time limit has been exceeded
     * @param {Activity} activity - The activity to evaluate
     * @return {boolean}
     * @private
     */
    evaluateTimeLimitExceeded(activity) {
      let limit = activity.timeLimitDuration;
      if (!limit && activity.attemptAbsoluteDurationLimit) {
        limit = activity.attemptAbsoluteDurationLimit;
      }
      if (!limit) {
        return false;
      }
      const limitSeconds = getDurationAsSeconds(limit, scorm2004_regex.CMITimespan);
      if (limitSeconds <= 0) {
        return false;
      }
      let elapsedSeconds = 0;
      if (_RuleCondition._getElapsedSecondsHook) {
        try {
          const hookResult = _RuleCondition._getElapsedSecondsHook(activity);
          if (typeof hookResult === "number" && !Number.isNaN(hookResult) && hookResult >= 0) {
            elapsedSeconds = hookResult;
          }
        } catch {
          elapsedSeconds = 0;
        }
      }
      if (elapsedSeconds === 0 && activity.attemptExperiencedDuration) {
        const attemptDurationSeconds = getDurationAsSeconds(activity.attemptExperiencedDuration, scorm2004_regex.CMITimespan);
        if (attemptDurationSeconds > 0) {
          elapsedSeconds = attemptDurationSeconds;
        }
      }
      if (elapsedSeconds === 0 && activity.attemptAbsoluteStartTime) {
        try {
          const start = new Date(activity.attemptAbsoluteStartTime).getTime();
          const nowMs = _RuleCondition._now().getTime();
          if (!Number.isNaN(start) && !Number.isNaN(nowMs) && nowMs >= start) {
            elapsedSeconds = (nowMs - start) / 1e3;
          }
        } catch {
          elapsedSeconds = 0;
        }
      }
      return elapsedSeconds > limitSeconds;
    }
    /**
     * Evaluate if activity is outside available time range
     * @param {Activity} activity - The activity to evaluate
     * @return {boolean}
     * @private
     */
    evaluateOutsideAvailableTimeRange(activity) {
      const beginTime = activity.beginTimeLimit;
      const endTime = activity.endTimeLimit;
      if (!beginTime && !endTime) {
        return false;
      }
      const now = _RuleCondition._now();
      if (beginTime) {
        const beginDate = new Date(beginTime);
        if (now < beginDate) {
          return true;
        }
      }
      if (endTime) {
        const endDate = new Date(endTime);
        if (now > endDate) {
          return true;
        }
      }
      return false;
    }
    /**
     * Parse ISO 8601 duration to milliseconds
     * Uses the standard getDurationAsSeconds utility which supports full ISO 8601 format
     * including date components (years, months, weeks, days) and time components (hours, minutes, seconds).
     * @param {string} duration - ISO 8601 duration string (e.g., "PT1H30M", "P1D", "P1Y2M3DT4H5M6S")
     * @return {number} - Duration in milliseconds
     * @private
     */
    parseISO8601Duration(duration) {
      const seconds = getDurationAsSeconds(duration, scorm2004_regex.CMITimespan);
      return seconds * 1e3;
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
  };
  // Optional, overridable provider for current time (LMS may set via SequencingService)
  _RuleCondition._now = () => /* @__PURE__ */new Date();
  // Optional, overridable hook for getting elapsed seconds
  _RuleCondition._getElapsedSecondsHook = void 0;
  let RuleCondition = _RuleCondition;
  class SequencingRule extends BaseCMI {
    /**
     * Constructor for SequencingRule
     * @param {RuleActionType} action - The action to take when the rule conditions are met
     * @param {string | RuleConditionOperator} conditionCombination - How to combine multiple conditions ("all"/"and" or "any"/"or")
     */
    constructor() {
      let action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "skip";
      let conditionCombination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "and";
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
        throw new Scorm2004ValidationError(this._cmi_element + ".conditions", scorm2004_errors$1.TYPE_MISMATCH);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".conditions", scorm2004_errors$1.TYPE_MISMATCH);
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
        return this._conditions.every(condition => condition.evaluate(activity));
      } else if (this._conditionCombination === "any" || this._conditionCombination === "or" /* OR */) {
        return this._conditions.some(condition => condition.evaluate(activity));
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
        throw new Scorm2004ValidationError(this._cmi_element + ".preConditionRules", scorm2004_errors$1.TYPE_MISMATCH);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".exitConditionRules", scorm2004_errors$1.TYPE_MISMATCH);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".postConditionRules", scorm2004_errors$1.TYPE_MISMATCH);
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

  var RollupActionType = /* @__PURE__ */(RollupActionType2 => {
    RollupActionType2["SATISFIED"] = "satisfied";
    RollupActionType2["NOT_SATISFIED"] = "notSatisfied";
    RollupActionType2["COMPLETED"] = "completed";
    RollupActionType2["INCOMPLETE"] = "incomplete";
    return RollupActionType2;
  })(RollupActionType || {});
  var RollupConsiderationType = /* @__PURE__ */(RollupConsiderationType2 => {
    RollupConsiderationType2["ALL"] = "all";
    RollupConsiderationType2["ANY"] = "any";
    RollupConsiderationType2["NONE"] = "none";
    RollupConsiderationType2["AT_LEAST_COUNT"] = "atLeastCount";
    RollupConsiderationType2["AT_LEAST_PERCENT"] = "atLeastPercent";
    return RollupConsiderationType2;
  })(RollupConsiderationType || {});
  class RollupCondition extends BaseCMI {
    /**
     * Constructor for RollupCondition
     * @param {RollupConditionType} condition - The condition type
     * @param {Map<string, any>} parameters - Additional parameters for the condition
     */
    constructor() {
      let condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "always";
      let parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /* @__PURE__ */new Map();
      super("rollupCondition");
      this._condition = "always" /* ALWAYS */;
      this._parameters = /* @__PURE__ */new Map();
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
          return activity.objectiveSatisfiedStatus === true || activity.successStatus === SuccessStatus.PASSED;
        case "objectiveStatusKnown" /* OBJECTIVE_STATUS_KNOWN */:
          return activity.objectiveSatisfiedStatusKnown;
        case "objectiveMeasureKnown" /* OBJECTIVE_MEASURE_KNOWN */:
          return activity.objectiveMeasureStatus;
        case "objectiveMeasureGreaterThan" /* OBJECTIVE_MEASURE_GREATER_THAN */:
          {
            const greaterThanValue = this._parameters.get("threshold") || 0;
            return activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue;
          }
        case "objectiveMeasureLessThan" /* OBJECTIVE_MEASURE_LESS_THAN */:
          {
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
    constructor() {
      let action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "satisfied";
      let consideration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "all";
      let minimumCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      let minimumPercent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".conditions", scorm2004_errors$1.TYPE_MISMATCH);
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
      const matchingChildren = children.filter(child => {
        return this._conditions.every(condition => condition.evaluate(child));
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
        case "atLeastPercent" /* AT_LEAST_PERCENT */:
          {
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
        throw new Scorm2004ValidationError(this._cmi_element + ".rules", scorm2004_errors$1.TYPE_MISMATCH);
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
      const children = activity.getAvailableChildren();
      let completionRollup = false;
      let successRollup = false;
      if (activity.sequencingControls.rollupObjectiveSatisfied) {
        const measureRollupResult = this._objectiveRollupUsingMeasure(activity, children);
        if (measureRollupResult !== null) {
          successRollup = true;
        }
      }
      if (!successRollup) {
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
      const allCompleted = children.every(child => child.isCompleted);
      if (allCompleted) {
        activity.completionStatus = CompletionStatus.COMPLETED;
        activity.isCompleted = true;
      } else {
        const anyIncomplete = children.some(child => child.completionStatus === CompletionStatus.INCOMPLETE);
        if (anyIncomplete) {
          activity.completionStatus = CompletionStatus.INCOMPLETE;
          activity.isCompleted = false;
        }
      }
    }
    /**
     * Objective Rollup Using Measure Process (RB.1.2.a)
     * @param {Activity} activity - The activity to process rollup for
     * @param {Activity[]} children - The child activities
     * @return {boolean | null} - True if satisfied, false if not satisfied, null if measure rollup not applicable
     * @private
     */
    _objectiveRollupUsingMeasure(activity, children) {
      const objectiveMeasureWeight = activity.sequencingControls.objectiveMeasureWeight;
      if (objectiveMeasureWeight <= 0) {
        return null;
      }
      let totalWeight = 0;
      let weightedSum = 0;
      let hasValidMeasures = false;
      for (const child of children) {
        if (!child.sequencingControls.rollupObjectiveSatisfied) {
          continue;
        }
        if (child.objectiveMeasureStatus && child.objectiveMeasureStatus === true) {
          const childWeight = child.sequencingControls.objectiveMeasureWeight;
          if (childWeight > 0) {
            weightedSum += child.objectiveNormalizedMeasure * childWeight;
            totalWeight += childWeight;
            hasValidMeasures = true;
          }
        }
      }
      if (!hasValidMeasures || totalWeight === 0) {
        return null;
      }
      const normalizedMeasure = weightedSum / totalWeight;
      activity.objectiveNormalizedMeasure = normalizedMeasure;
      activity.objectiveMeasureStatus = true;
      if (normalizedMeasure >= activity.scaledPassingScore) {
        activity.successStatus = SuccessStatus.PASSED;
        activity.objectiveSatisfiedStatus = true;
        return true;
      } else {
        activity.successStatus = SuccessStatus.FAILED;
        activity.objectiveSatisfiedStatus = false;
        return false;
      }
    }
    /**
     * Default success rollup
     * @param {Activity} activity - The activity to process rollup for
     * @param {Activity[]} children - The child activities
     * @private
     */
    _defaultSuccessRollup(activity, children) {
      const allSatisfied = children.every(child => child.successStatus === SuccessStatus.PASSED);
      if (allSatisfied) {
        activity.successStatus = SuccessStatus.PASSED;
      } else {
        const anyNotSatisfied = children.some(child => child.successStatus === SuccessStatus.FAILED);
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

  const ValidLanguages = ["aa", "ab", "ae", "af", "ak", "am", "an", "ar", "as", "av", "ay", "az", "ba", "be", "bg", "bh", "bi", "bm", "bn", "bo", "br", "bs", "ca", "ce", "ch", "co", "cr", "cs", "cu", "cv", "cy", "da", "de", "dv", "dz", "ee", "el", "en", "eo", "es", "et", "eu", "fa", "ff", "fi", "fj", "fo", "fr", "fy", "ga", "gd", "gl", "gn", "gu", "gv", "ha", "he", "hi", "ho", "hr", "ht", "hu", "hy", "hz", "ia", "id", "ie", "ig", "ii", "ik", "io", "is", "it", "iu", "ja", "jv", "ka", "kg", "ki", "kj", "kk", "kl", "km", "kn", "ko", "kr", "ks", "ku", "kv", "kw", "ky", "la", "lb", "lg", "li", "ln", "lo", "lt", "lu", "lv", "mg", "mh", "mi", "mk", "ml", "mn", "mo", "mr", "ms", "mt", "my", "na", "nb", "nd", "ne", "ng", "nl", "nn", "no", "nr", "nv", "ny", "oc", "oj", "om", "or", "os", "pa", "pi", "pl", "ps", "pt", "qu", "rm", "rn", "ro", "ru", "rw", "sa", "sc", "sd", "se", "sg", "sh", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "ss", "st", "su", "sv", "sw", "ta", "te", "tg", "th", "ti", "tk", "tl", "tn", "to", "tr", "ts", "tt", "tw", "ty", "ug", "uk", "ur", "uz", "ve", "vi", "vo", "wa", "wo", "xh", "yi", "yo", "za", "zh", "zu", "aar", "abk", "ave", "afr", "aka", "amh", "arg", "ara", "asm", "ava", "aym", "aze", "bak", "bel", "bul", "bih", "bis", "bam", "ben", "tib", "bod", "bre", "bos", "cat", "che", "cha", "cos", "cre", "cze", "ces", "chu", "chv", "wel", "cym", "dan", "ger", "deu", "div", "dzo", "ewe", "gre", "ell", "eng", "epo", "spa", "est", "baq", "eus", "per", "fas", "ful", "fin", "fij", "fao", "fre", "fra", "fry", "gle", "gla", "glg", "grn", "guj", "glv", "hau", "heb", "hin", "hmo", "hrv", "hat", "hun", "arm", "hye", "her", "ina", "ind", "ile", "ibo", "iii", "ipk", "ido", "ice", "isl", "ita", "iku", "jpn", "jav", "geo", "kat", "kon", "kik", "kua", "kaz", "kal", "khm", "kan", "kor", "kau", "kas", "kur", "kom", "cor", "kir", "lat", "ltz", "lug", "lim", "lin", "lao", "lit", "lub", "lav", "mlg", "mah", "mao", "mri", "mac", "mkd", "mal", "mon", "mol", "mar", "may", "msa", "mlt", "bur", "mya", "nau", "nob", "nde", "nep", "ndo", "dut", "nld", "nno", "nor", "nbl", "nav", "nya", "oci", "oji", "orm", "ori", "oss", "pan", "pli", "pol", "pus", "por", "que", "roh", "run", "rum", "ron", "rus", "kin", "san", "srd", "snd", "sme", "sag", "slo", "sin", "slk", "slv", "smo", "sna", "som", "alb", "sqi", "srp", "ssw", "sot", "sun", "swe", "swa", "tam", "tel", "tgk", "tha", "tir", "tuk", "tgl", "tsn", "ton", "tur", "tso", "tat", "twi", "tah", "uig", "ukr", "urd", "uzb", "ven", "vie", "vol", "wln", "wol", "xho", "yid", "yor", "zha", "chi", "zho", "zul"];

  var SelectionTiming = /* @__PURE__ */(SelectionTiming2 => {
    SelectionTiming2["NEVER"] = "never";
    SelectionTiming2["ONCE"] = "once";
    SelectionTiming2["ON_EACH_NEW_ATTEMPT"] = "onEachNewAttempt";
    return SelectionTiming2;
  })(SelectionTiming || {});
  var RandomizationTiming = /* @__PURE__ */(RandomizationTiming2 => {
    RandomizationTiming2["NEVER"] = "never";
    RandomizationTiming2["ONCE"] = "once";
    RandomizationTiming2["ON_EACH_NEW_ATTEMPT"] = "onEachNewAttempt";
    return RandomizationTiming2;
  })(RandomizationTiming || {});
  class SequencingControls extends BaseCMI {
    /**
     * Constructor for SequencingControls
     */
    constructor() {
      super("sequencingControls");
      // Sequencing Control Modes
      this._enabled = true;
      this._choice = true;
      this._choiceExit = true;
      // Per SCORM 2004 Sequencing & Navigation, flow defaults to true
      this._flow = true;
      this._forwardOnly = false;
      this._useCurrentAttemptObjectiveInfo = true;
      this._useCurrentAttemptProgressInfo = true;
      // Constrain Choice Controls
      this._preventActivation = false;
      this._constrainChoice = false;
      // Rule-driven traversal limiter (e.g., post-condition stopForwardTraversal)
      this._stopForwardTraversal = false;
      // Rollup Controls
      this._rollupObjectiveSatisfied = true;
      this._rollupProgressCompletion = true;
      this._objectiveMeasureWeight = 1;
      // Selection Controls
      this._selectionTiming = "never" /* NEVER */;
      this._selectCount = null;
      this._selectionCountStatus = false;
      this._randomizeChildren = false;
      // Randomization Controls
      this._randomizationTiming = "never" /* NEVER */;
      this._reorderChildren = false;
      // Auto-completion/satisfaction controls
      this._completionSetByContent = false;
      this._objectiveSetByContent = false;
      // Delivery Controls
      this._tracked = true;
    }
    /**
     * Reset the sequencing controls to their default values
     */
    reset() {
      this._initialized = false;
      this._enabled = true;
      this._choice = true;
      this._choiceExit = true;
      this._flow = true;
      this._forwardOnly = false;
      this._useCurrentAttemptObjectiveInfo = true;
      this._useCurrentAttemptProgressInfo = true;
      this._preventActivation = false;
      this._constrainChoice = false;
      this._stopForwardTraversal = false;
      this._rollupObjectiveSatisfied = true;
      this._rollupProgressCompletion = true;
      this._objectiveMeasureWeight = 1;
      this._selectionTiming = "never" /* NEVER */;
      this._selectCount = null;
      this._selectionCountStatus = false;
      this._randomizeChildren = false;
      this._randomizationTiming = "never" /* NEVER */;
      this._reorderChildren = false;
      this._completionSetByContent = false;
      this._objectiveSetByContent = false;
      this._tracked = true;
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
     * Getter for choice
     * @return {boolean}
     */
    get choice() {
      return this._choice;
    }
    /**
     * Setter for choice
     * @param {boolean} choice
     */
    set choice(choice) {
      this._choice = choice;
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
     * Getter for stopForwardTraversal
     * @return {boolean}
     */
    get stopForwardTraversal() {
      return this._stopForwardTraversal;
    }
    /**
     * Setter for stopForwardTraversal
     * @param {boolean} stopForwardTraversal
     */
    set stopForwardTraversal(stopForwardTraversal) {
      this._stopForwardTraversal = stopForwardTraversal;
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
      if (objectiveMeasureWeight >= 0) {
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
      return this._enabled && this._flow;
    }
    /**
     * Check if backward navigation is allowed
     * @return {boolean} - True if backward navigation is allowed, false otherwise
     */
    isBackwardNavigationAllowed() {
      return this._enabled && this._flow && !this._forwardOnly;
    }
    /**
     * Getter for selectionTiming
     * @return {SelectionTiming}
     */
    get selectionTiming() {
      return this._selectionTiming;
    }
    /**
     * Setter for selectionTiming
     * @param {SelectionTiming} selectionTiming
     */
    set selectionTiming(selectionTiming) {
      this._selectionTiming = selectionTiming;
    }
    /**
     * Getter for selectCount
     * @return {number | null}
     */
    get selectCount() {
      return this._selectCount;
    }
    /**
     * Setter for selectCount
     * @param {number | null} selectCount
     */
    set selectCount(selectCount) {
      if (selectCount === null || selectCount > 0) {
        this._selectCount = selectCount;
      }
    }
    /**
     * Getter for selectionCountStatus
     * @return {boolean}
     */
    get selectionCountStatus() {
      return this._selectionCountStatus;
    }
    /**
     * Setter for selectionCountStatus
     * @param {boolean} selectionCountStatus
     */
    set selectionCountStatus(selectionCountStatus) {
      this._selectionCountStatus = selectionCountStatus;
    }
    /**
     * Getter for randomizeChildren
     * @return {boolean}
     */
    get randomizeChildren() {
      return this._randomizeChildren;
    }
    /**
     * Setter for randomizeChildren
     * @param {boolean} randomizeChildren
     */
    set randomizeChildren(randomizeChildren) {
      this._randomizeChildren = randomizeChildren;
    }
    /**
     * Getter for randomizationTiming
     * @return {RandomizationTiming}
     */
    get randomizationTiming() {
      return this._randomizationTiming;
    }
    /**
     * Setter for randomizationTiming
     * @param {RandomizationTiming} randomizationTiming
     */
    set randomizationTiming(randomizationTiming) {
      this._randomizationTiming = randomizationTiming;
    }
    /**
     * Getter for reorderChildren
     * @return {boolean}
     */
    get reorderChildren() {
      return this._reorderChildren;
    }
    /**
     * Setter for reorderChildren
     * @param {boolean} reorderChildren
     */
    set reorderChildren(reorderChildren) {
      this._reorderChildren = reorderChildren;
    }
    /**
     * Getter for completionSetByContent
     * @return {boolean}
     */
    get completionSetByContent() {
      return this._completionSetByContent;
    }
    /**
     * Setter for completionSetByContent
     * @param {boolean} completionSetByContent
     */
    set completionSetByContent(completionSetByContent) {
      this._completionSetByContent = completionSetByContent;
    }
    /**
     * Getter for objectiveSetByContent
     * @return {boolean}
     */
    get objectiveSetByContent() {
      return this._objectiveSetByContent;
    }
    /**
     * Setter for objectiveSetByContent
     * @param {boolean} objectiveSetByContent
     */
    set objectiveSetByContent(objectiveSetByContent) {
      this._objectiveSetByContent = objectiveSetByContent;
    }
    /**
     * Getter for tracked
     * @return {boolean}
     */
    get tracked() {
      return this._tracked;
    }
    /**
     * Setter for tracked
     * @param {boolean} tracked
     */
    set tracked(tracked) {
      this._tracked = tracked;
    }
    /**
     * toJSON for SequencingControls
     * @return {object}
     */
    toJSON() {
      this.jsonString = true;
      const result = {
        enabled: this._enabled,
        choice: this._choice,
        choiceExit: this._choiceExit,
        flow: this._flow,
        forwardOnly: this._forwardOnly,
        useCurrentAttemptObjectiveInfo: this._useCurrentAttemptObjectiveInfo,
        useCurrentAttemptProgressInfo: this._useCurrentAttemptProgressInfo,
        preventActivation: this._preventActivation,
        constrainChoice: this._constrainChoice,
        stopForwardTraversal: this._stopForwardTraversal,
        rollupObjectiveSatisfied: this._rollupObjectiveSatisfied,
        rollupProgressCompletion: this._rollupProgressCompletion,
        objectiveMeasureWeight: this._objectiveMeasureWeight,
        selectionTiming: this._selectionTiming,
        selectCount: this._selectCount,
        selectionCountStatus: this._selectionCountStatus,
        randomizeChildren: this._randomizeChildren,
        randomizationTiming: this._randomizationTiming,
        reorderChildren: this._reorderChildren,
        completionSetByContent: this._completionSetByContent,
        objectiveSetByContent: this._objectiveSetByContent,
        tracked: this._tracked
      };
      this.jsonString = false;
      return result;
    }
  }

  class ActivityObjective {
    constructor(id) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this._satisfiedStatus = false;
      this._satisfiedStatusKnown = false;
      // Note: measureStatus has no dirty flag because it is not synchronized to global
      // objectives. It serves as a validity gate for other synced properties.
      this._measureStatus = false;
      this._normalizedMeasure = 0;
      this._progressMeasure = 0;
      this._progressMeasureStatus = false;
      this._completionStatus = CompletionStatus.UNKNOWN;
      this._progressStatus = false;
      // Dirty flags for tracking which properties have been modified locally
      this._satisfiedStatusDirty = false;
      this._normalizedMeasureDirty = false;
      this._completionStatusDirty = false;
      this._progressMeasureDirty = false;
      this._id = id;
      this._description = options.description ?? null;
      this._satisfiedByMeasure = options.satisfiedByMeasure ?? false;
      this._minNormalizedMeasure = options.minNormalizedMeasure ?? null;
      this._mapInfo = options.mapInfo ? [...options.mapInfo] : [];
      this._isPrimary = options.isPrimary ?? false;
    }
    get id() {
      return this._id;
    }
    get description() {
      return this._description;
    }
    get satisfiedByMeasure() {
      return this._satisfiedByMeasure;
    }
    set satisfiedByMeasure(value) {
      this._satisfiedByMeasure = value;
    }
    get minNormalizedMeasure() {
      return this._minNormalizedMeasure;
    }
    set minNormalizedMeasure(value) {
      this._minNormalizedMeasure = value;
    }
    get mapInfo() {
      return this._mapInfo;
    }
    set mapInfo(mapInfo) {
      this._mapInfo = [...mapInfo];
    }
    get isPrimary() {
      return this._isPrimary;
    }
    set isPrimary(value) {
      this._isPrimary = value;
    }
    get satisfiedStatus() {
      return this._satisfiedStatus;
    }
    set satisfiedStatus(value) {
      if (this._satisfiedStatus !== value) {
        this._satisfiedStatus = value;
        this._satisfiedStatusDirty = true;
      }
    }
    get satisfiedStatusKnown() {
      return this._satisfiedStatusKnown;
    }
    set satisfiedStatusKnown(value) {
      this._satisfiedStatusKnown = value;
    }
    get measureStatus() {
      return this._measureStatus;
    }
    set measureStatus(value) {
      this._measureStatus = value;
    }
    get normalizedMeasure() {
      return this._normalizedMeasure;
    }
    set normalizedMeasure(value) {
      if (this._normalizedMeasure !== value) {
        this._normalizedMeasure = value;
        this._normalizedMeasureDirty = true;
      }
    }
    get progressMeasure() {
      return this._progressMeasure;
    }
    set progressMeasure(value) {
      if (this._progressMeasure !== value) {
        this._progressMeasure = value;
        this._progressMeasureDirty = true;
      }
    }
    get progressMeasureStatus() {
      return this._progressMeasureStatus;
    }
    set progressMeasureStatus(value) {
      this._progressMeasureStatus = value;
    }
    get completionStatus() {
      return this._completionStatus;
    }
    set completionStatus(value) {
      if (this._completionStatus !== value) {
        this._completionStatus = value;
        this._completionStatusDirty = true;
      }
    }
    get progressStatus() {
      return this._progressStatus;
    }
    set progressStatus(value) {
      this._progressStatus = value;
    }
    isDirty(property) {
      switch (property) {
        case "satisfiedStatus":
          return this._satisfiedStatusDirty;
        case "normalizedMeasure":
          return this._normalizedMeasureDirty;
        case "completionStatus":
          return this._completionStatusDirty;
        case "progressMeasure":
          return this._progressMeasureDirty;
      }
    }
    clearDirty(property) {
      switch (property) {
        case "satisfiedStatus":
          this._satisfiedStatusDirty = false;
          break;
        case "normalizedMeasure":
          this._normalizedMeasureDirty = false;
          break;
        case "completionStatus":
          this._completionStatusDirty = false;
          break;
        case "progressMeasure":
          this._progressMeasureDirty = false;
          break;
      }
    }
    clearAllDirty() {
      this._satisfiedStatusDirty = false;
      this._normalizedMeasureDirty = false;
      this._completionStatusDirty = false;
      this._progressMeasureDirty = false;
    }
    /**
     * Initialize objective values from CMI data transfer
     * This method always marks values as dirty since CMI data should be written to global objectives,
     * even if the values match the current defaults (e.g., satisfiedStatus = false, normalizedMeasure = 0)
     * Note: Callers must separately set satisfiedStatusKnown based on CMI data availability.
     * @param satisfiedStatus - The satisfied status from CMI
     * @param normalizedMeasure - The normalized measure from CMI
     * @param measureStatus - Whether measure is valid
     */
    initializeFromCMI(satisfiedStatus, normalizedMeasure, measureStatus) {
      this._satisfiedStatus = satisfiedStatus;
      this._satisfiedStatusDirty = true;
      this._normalizedMeasure = normalizedMeasure;
      this._normalizedMeasureDirty = true;
      this._measureStatus = measureStatus;
    }
    resetState() {
      this._satisfiedStatus = false;
      this._satisfiedStatusKnown = false;
      this._measureStatus = false;
      this._normalizedMeasure = 0;
      this._progressMeasure = 0;
      this._progressMeasureStatus = false;
      this._completionStatus = CompletionStatus.UNKNOWN;
      this._progressStatus = false;
      this.clearAllDirty();
    }
    updateFromActivity(activity) {
      if (this._satisfiedStatus !== activity.objectiveSatisfiedStatus) {
        this._satisfiedStatus = activity.objectiveSatisfiedStatus;
        this._satisfiedStatusDirty = true;
      }
      this._satisfiedStatusKnown = activity.objectiveSatisfiedStatusKnown;
      this._measureStatus = activity.objectiveMeasureStatus;
      if (this._normalizedMeasure !== activity.objectiveNormalizedMeasure) {
        this._normalizedMeasure = activity.objectiveNormalizedMeasure;
        this._normalizedMeasureDirty = true;
      }
      if (this._progressMeasure !== activity.progressMeasure) {
        this._progressMeasure = activity.progressMeasure;
        this._progressMeasureDirty = true;
      }
      this._progressMeasureStatus = activity.progressMeasureStatus;
      if (this._completionStatus !== activity.completionStatus) {
        this._completionStatus = activity.completionStatus;
        this._completionStatusDirty = true;
      }
    }
    applyToActivity(activity) {
      if (!this._isPrimary) {
        return;
      }
      activity.setPrimaryObjectiveState(this._satisfiedStatus, this._measureStatus, this._normalizedMeasure, this._progressMeasure, this._progressMeasureStatus, this._completionStatus);
    }
  }
  class Activity extends BaseCMI {
    /**
     * Constructor for Activity
     * @param {string} id - The unique identifier for this activity
     * @param {string} title - The title of this activity
     */
    constructor() {
      let id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      let title = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
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
      // Duration tracking fields (separate from limits) - actual calculated values
      this._attemptAbsoluteDurationValue = "PT0H0M0S";
      this._attemptExperiencedDurationValue = "PT0H0M0S";
      this._activityAbsoluteDurationValue = "PT0H0M0S";
      this._activityExperiencedDurationValue = "PT0H0M0S";
      // Timestamp tracking for duration calculation
      this._activityStartTimestampUtc = null;
      this._attemptStartTimestampUtc = null;
      this._activityEndedDate = null;
      this._objectiveSatisfiedStatus = false;
      this._objectiveSatisfiedStatusKnown = false;
      this._objectiveMeasureStatus = false;
      this._objectiveNormalizedMeasure = 0;
      this._scaledPassingScore = 0.7;
      // Default passing score
      // Dirty flags for tracking which activity-level objective properties have been modified locally
      this._objectiveSatisfiedStatusDirty = false;
      this._objectiveNormalizedMeasureDirty = false;
      this._objectiveMeasureStatusDirty = false;
      this._progressMeasure = 0;
      this._progressMeasureStatus = false;
      this._location = "";
      this._attemptAbsoluteStartTime = "";
      this._learnerPrefs = null;
      this._activityAttemptActive = false;
      this._isHiddenFromChoice = false;
      this._isAvailable = true;
      this._hideLmsUi = [];
      this._auxiliaryResources = [];
      this._attemptLimit = null;
      this._attemptAbsoluteDurationLimit = null;
      this._activityAbsoluteDurationLimit = null;
      this._timeLimitAction = null;
      this._timeLimitDuration = null;
      this._beginTimeLimit = null;
      this._endTimeLimit = null;
      this._launchData = "";
      this._credit = "credit";
      this._maxTimeAllowed = "";
      this._completionThreshold = "";
      this._processedChildren = null;
      this._isNewAttempt = false;
      this._primaryObjective = null;
      this._objectives = [];
      this._rollupConsiderations = {
        requiredForSatisfied: "always",
        requiredForNotSatisfied: "always",
        requiredForCompleted: "always",
        requiredForIncomplete: "always",
        measureSatisfactionIfActive: true
      };
      // Individual rollup consideration properties for this activity (RB.1.4.2)
      // These determine when THIS activity is included in parent rollup calculations
      this._requiredForSatisfied = "always";
      this._requiredForNotSatisfied = "always";
      this._requiredForCompleted = "always";
      this._requiredForIncomplete = "always";
      this._wasSkipped = false;
      this._attemptProgressStatus = false;
      this._wasAutoCompleted = false;
      this._wasAutoSatisfied = false;
      this._completedByMeasure = false;
      this._minProgressMeasure = 1;
      this._progressWeight = 1;
      this._attemptCompletionAmountStatus = false;
      this._id = id;
      this._title = title;
      this._sequencingControls = new SequencingControls();
      this._sequencingRules = new SequencingRules();
      this._rollupRules = new RollupRules();
      this._primaryObjective = null;
      this._objectives = [];
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
      this._attemptAbsoluteDurationValue = "PT0H0M0S";
      this._attemptExperiencedDurationValue = "PT0H0M0S";
      this._activityAbsoluteDurationValue = "PT0H0M0S";
      this._activityExperiencedDurationValue = "PT0H0M0S";
      this._activityStartTimestampUtc = null;
      this._attemptStartTimestampUtc = null;
      this._activityEndedDate = null;
      this._objectiveSatisfiedStatus = false;
      this._objectiveSatisfiedStatusKnown = false;
      this._objectiveMeasureStatus = false;
      this._objectiveNormalizedMeasure = 0;
      this._progressMeasure = 0;
      this._progressMeasureStatus = false;
      this._location = "";
      this._attemptAbsoluteStartTime = "";
      this._learnerPrefs = null;
      this._activityAttemptActive = false;
      if (this._primaryObjective) {
        this._primaryObjective.resetState();
        this._primaryObjective.updateFromActivity(this);
      }
      for (const objective of this._objectives) {
        objective.resetState();
      }
      for (const child of this._children) {
        child.reset();
      }
      this._wasSkipped = false;
      this._attemptProgressStatus = false;
      this._wasAutoCompleted = false;
      this._wasAutoSatisfied = false;
      this._completedByMeasure = false;
      this._minProgressMeasure = 1;
      this._progressWeight = 1;
      this._attemptCompletionAmountStatus = false;
      this.clearAllObjectiveDirty();
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
        throw new Scorm2004ValidationError(this._cmi_element + ".children", scorm2004_errors$1.TYPE_MISMATCH);
      }
      child._parent = this;
      this._children.push(child);
    }
    /**
     * Reorder child activities based on provided identifier order
     * @param {string[]} order - Ordered list of child activity IDs
     */
    setChildOrder(order) {
      if (order.length === 0) {
        return;
      }
      const childMap = new Map(this._children.map(child => [child.id, child]));
      const reordered = [];
      for (const id of order) {
        const child = childMap.get(id);
        if (child) {
          reordered.push(child);
          childMap.delete(id);
        }
      }
      if (childMap.size > 0) {
        for (const child of this._children) {
          if (childMap.has(child.id)) {
            reordered.push(child);
            childMap.delete(child.id);
          }
        }
      }
      if (reordered.length === this._children.length) {
        this._children.splice(0, this._children.length, ...reordered);
      }
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
      if (isCompleted) {
        this._completionStatus = CompletionStatus.COMPLETED;
      } else {
        this._completionStatus = CompletionStatus.INCOMPLETE;
      }
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
      this.updatePrimaryObjectiveFromActivity();
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
     * Setter for attemptCount
     * @param {number} value
     */
    set attemptCount(value) {
      this._attemptCount = value;
    }
    /**
     * Getter for attemptCompletionAmount
     * @return {number}
     */
    get attemptCompletionAmount() {
      return this._attemptCompletionAmount;
    }
    /**
     * Setter for attemptCompletionAmount
     * @param {number} value
     */
    set attemptCompletionAmount(value) {
      this._attemptCompletionAmount = value;
    }
    /**
     * Increment the attempt count
     */
    incrementAttemptCount() {
      this._attemptCount++;
      this._isNewAttempt = true;
      const controls = this._sequencingControls;
      if (controls.selectionTiming === "onEachNewAttempt" || controls.randomizationTiming === "onEachNewAttempt") {
        this._processedChildren = null;
      }
    }
    /**
     * Getter for objectiveSatisfiedStatus
     * @return {boolean}
     */
    get objectiveSatisfiedStatus() {
      return this._objectiveSatisfiedStatus;
    }
    /**
     * Setter for objectiveSatisfiedStatus
     * @param {boolean} objectiveSatisfiedStatus
     */
    set objectiveSatisfiedStatus(objectiveSatisfiedStatus) {
      if (this._objectiveSatisfiedStatus !== objectiveSatisfiedStatus) {
        this._objectiveSatisfiedStatus = objectiveSatisfiedStatus;
        this._objectiveSatisfiedStatusDirty = true;
      }
      this._objectiveSatisfiedStatusKnown = true;
      if (objectiveSatisfiedStatus) {
        this._successStatus = SuccessStatus.PASSED;
      } else {
        this._successStatus = SuccessStatus.FAILED;
      }
      this.updatePrimaryObjectiveFromActivity();
    }
    /**
     * Getter for objectiveSatisfiedStatusKnown
     * Indicates whether the objective satisfied status has been explicitly set
     * @return {boolean}
     */
    get objectiveSatisfiedStatusKnown() {
      return this._objectiveSatisfiedStatusKnown;
    }
    /**
     * Setter for objectiveSatisfiedStatusKnown
     * @param {boolean} value
     */
    set objectiveSatisfiedStatusKnown(value) {
      this._objectiveSatisfiedStatusKnown = value;
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
      if (this._objectiveMeasureStatus !== objectiveMeasureStatus) {
        this._objectiveMeasureStatus = objectiveMeasureStatus;
        this._objectiveMeasureStatusDirty = true;
      }
      this.updatePrimaryObjectiveFromActivity();
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
      if (this._objectiveNormalizedMeasure !== objectiveNormalizedMeasure) {
        this._objectiveNormalizedMeasure = objectiveNormalizedMeasure;
        this._objectiveNormalizedMeasureDirty = true;
      }
      this.updatePrimaryObjectiveFromActivity();
    }
    /**
     * Getter for scaledPassingScore
     * @return {number}
     */
    get scaledPassingScore() {
      return this._scaledPassingScore;
    }
    /**
     * Setter for scaledPassingScore
     * @param {number} scaledPassingScore
     */
    set scaledPassingScore(scaledPassingScore) {
      if (scaledPassingScore >= -1 && scaledPassingScore <= 1) {
        this._scaledPassingScore = scaledPassingScore;
      }
    }
    /**
     * Getter for progressMeasure
     * @return {number}
     */
    get progressMeasure() {
      return this._progressMeasure;
    }
    /**
     * Setter for progressMeasure
     * @param {number} progressMeasure
     */
    set progressMeasure(progressMeasure) {
      this._progressMeasure = progressMeasure;
      this.updatePrimaryObjectiveFromActivity();
    }
    /**
     * Getter for progressMeasureStatus
     * @return {boolean}
     */
    get progressMeasureStatus() {
      return this._progressMeasureStatus;
    }
    /**
     * Setter for progressMeasureStatus
     * @param {boolean} progressMeasureStatus
     */
    set progressMeasureStatus(progressMeasureStatus) {
      this._progressMeasureStatus = progressMeasureStatus;
      this.updatePrimaryObjectiveFromActivity();
    }
    /**
     * Getter for location
     * @return {string}
     */
    get location() {
      return this._location;
    }
    /**
     * Setter for location
     * @param {string} location
     */
    set location(location) {
      this._location = location;
    }
    /**
     * Getter for attemptAbsoluteStartTime
     * @return {string}
     */
    get attemptAbsoluteStartTime() {
      return this._attemptAbsoluteStartTime;
    }
    /**
     * Setter for attemptAbsoluteStartTime
     * @param {string} attemptAbsoluteStartTime
     */
    set attemptAbsoluteStartTime(attemptAbsoluteStartTime) {
      this._attemptAbsoluteStartTime = attemptAbsoluteStartTime;
    }
    /**
     * Getter for learnerPrefs
     * @return {any}
     */
    get learnerPrefs() {
      return this._learnerPrefs;
    }
    /**
     * Setter for learnerPrefs
     * @param {any} learnerPrefs
     */
    set learnerPrefs(learnerPrefs) {
      this._learnerPrefs = learnerPrefs;
    }
    /**
     * Getter for activityAttemptActive
     * @return {boolean}
     */
    get activityAttemptActive() {
      return this._activityAttemptActive;
    }
    /**
     * Setter for activityAttemptActive
     * @param {boolean} activityAttemptActive
     */
    set activityAttemptActive(activityAttemptActive) {
      this._activityAttemptActive = activityAttemptActive;
    }
    /**
     * Getter for isHiddenFromChoice
     * @return {boolean}
     */
    get isHiddenFromChoice() {
      return this._isHiddenFromChoice;
    }
    /**
     * Setter for isHiddenFromChoice
     * @param {boolean} isHiddenFromChoice
     */
    set isHiddenFromChoice(isHiddenFromChoice) {
      this._isHiddenFromChoice = isHiddenFromChoice;
    }
    /**
     * Getter for isAvailable
     * @return {boolean}
     */
    get isAvailable() {
      return this._isAvailable;
    }
    /**
     * Setter for isAvailable
     * @param {boolean} isAvailable
     */
    set isAvailable(isAvailable) {
      this._isAvailable = isAvailable;
    }
    /**
     * Getter for attemptLimit
     * @return {number | null}
     */
    get attemptLimit() {
      return this._attemptLimit;
    }
    /**
     * Setter for attemptLimit
     * @param {number | null} attemptLimit
     */
    set attemptLimit(attemptLimit) {
      this._attemptLimit = attemptLimit;
    }
    /**
     * Check if attempt limit has been exceeded
     * @return {boolean}
     */
    hasAttemptLimitExceeded() {
      if (this._attemptLimit === null) {
        return false;
      }
      return this._attemptCount >= this._attemptLimit;
    }
    /**
     * Getter for timeLimitDuration
     * @return {string | null}
     */
    get timeLimitDuration() {
      return this._timeLimitDuration;
    }
    /**
     * Setter for timeLimitDuration
     * @param {string | null} timeLimitDuration
     */
    set timeLimitDuration(timeLimitDuration) {
      this._timeLimitDuration = timeLimitDuration;
    }
    /**
     * Getter for timeLimitAction
     * @return {string | null}
     */
    get timeLimitAction() {
      return this._timeLimitAction;
    }
    /**
     * Setter for timeLimitAction
     * @param {string | null} timeLimitAction
     */
    set timeLimitAction(timeLimitAction) {
      this._timeLimitAction = timeLimitAction;
    }
    /**
     * Getter for beginTimeLimit
     * @return {string | null}
     */
    get beginTimeLimit() {
      return this._beginTimeLimit;
    }
    /**
     * Setter for beginTimeLimit
     * @param {string | null} beginTimeLimit
     */
    set beginTimeLimit(beginTimeLimit) {
      this._beginTimeLimit = beginTimeLimit;
    }
    /**
     * Getter for endTimeLimit
     * @return {string | null}
     */
    get endTimeLimit() {
      return this._endTimeLimit;
    }
    /**
     * Setter for endTimeLimit
     * @param {string | null} endTimeLimit
     */
    set endTimeLimit(endTimeLimit) {
      this._endTimeLimit = endTimeLimit;
    }
    /**
     * Getter for attemptAbsoluteDurationLimit
     * @return {string | null}
     */
    get attemptAbsoluteDurationLimit() {
      return this._attemptAbsoluteDurationLimit;
    }
    /**
     * Setter for attemptAbsoluteDurationLimit
     * @param {string | null} attemptAbsoluteDurationLimit
     */
    set attemptAbsoluteDurationLimit(attemptAbsoluteDurationLimit) {
      if (attemptAbsoluteDurationLimit !== null) {
        if (!validateISO8601Duration(attemptAbsoluteDurationLimit, scorm2004_regex.CMITimespan)) {
          throw new Scorm2004ValidationError(this._cmi_element + ".attemptAbsoluteDurationLimit", scorm2004_errors$1.TYPE_MISMATCH);
        }
      }
      this._attemptAbsoluteDurationLimit = attemptAbsoluteDurationLimit;
    }
    /**
     * Getter for attemptExperiencedDuration
     * @return {string}
     */
    get attemptExperiencedDuration() {
      return this._attemptExperiencedDuration;
    }
    /**
     * Setter for attemptExperiencedDuration
     * @param {string} attemptExperiencedDuration
     */
    set attemptExperiencedDuration(attemptExperiencedDuration) {
      if (!validateISO8601Duration(attemptExperiencedDuration, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".attemptExperiencedDuration", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._attemptExperiencedDuration = attemptExperiencedDuration;
    }
    /**
     * Getter for activityAbsoluteDurationLimit
     * @return {string | null}
     */
    get activityAbsoluteDurationLimit() {
      return this._activityAbsoluteDurationLimit;
    }
    /**
     * Setter for activityAbsoluteDurationLimit
     * @param {string | null} activityAbsoluteDurationLimit
     */
    set activityAbsoluteDurationLimit(activityAbsoluteDurationLimit) {
      if (activityAbsoluteDurationLimit !== null) {
        if (!validateISO8601Duration(activityAbsoluteDurationLimit, scorm2004_regex.CMITimespan)) {
          throw new Scorm2004ValidationError(this._cmi_element + ".activityAbsoluteDurationLimit", scorm2004_errors$1.TYPE_MISMATCH);
        }
      }
      this._activityAbsoluteDurationLimit = activityAbsoluteDurationLimit;
    }
    /**
     * Getter for activityExperiencedDuration
     * @return {string}
     */
    get activityExperiencedDuration() {
      return this._activityExperiencedDuration;
    }
    /**
     * Setter for activityExperiencedDuration
     * @param {string} activityExperiencedDuration
     */
    set activityExperiencedDuration(activityExperiencedDuration) {
      if (!validateISO8601Duration(activityExperiencedDuration, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".activityExperiencedDuration", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._activityExperiencedDuration = activityExperiencedDuration;
    }
    /**
     * Getter for attemptAbsoluteDuration (alias for limit)
     * @return {string}
     */
    get attemptAbsoluteDuration() {
      return this._attemptAbsoluteDurationLimit || "PT0H0M0S";
    }
    /**
     * Setter for attemptAbsoluteDuration
     * @param {string} duration
     */
    set attemptAbsoluteDuration(duration) {
      this._attemptAbsoluteDurationLimit = duration;
    }
    /**
     * Getter for activityAbsoluteDuration (alias for limit)
     * @return {string}
     */
    get activityAbsoluteDuration() {
      return this._activityAbsoluteDurationLimit || "PT0H0M0S";
    }
    /**
     * Setter for activityAbsoluteDuration
     * @param {string} duration
     */
    set activityAbsoluteDuration(duration) {
      this._activityAbsoluteDurationLimit = duration;
    }
    /**
     * Getter for attemptAbsoluteDurationValue (actual calculated duration)
     * @return {string}
     */
    get attemptAbsoluteDurationValue() {
      return this._attemptAbsoluteDurationValue;
    }
    /**
     * Setter for attemptAbsoluteDurationValue
     * @param {string} duration
     */
    set attemptAbsoluteDurationValue(duration) {
      if (!validateISO8601Duration(duration, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".attemptAbsoluteDurationValue", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._attemptAbsoluteDurationValue = duration;
    }
    /**
     * Getter for attemptExperiencedDurationValue (actual calculated duration)
     * @return {string}
     */
    get attemptExperiencedDurationValue() {
      return this._attemptExperiencedDurationValue;
    }
    /**
     * Setter for attemptExperiencedDurationValue
     * @param {string} duration
     */
    set attemptExperiencedDurationValue(duration) {
      if (!validateISO8601Duration(duration, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".attemptExperiencedDurationValue", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._attemptExperiencedDurationValue = duration;
    }
    /**
     * Getter for activityAbsoluteDurationValue (actual calculated duration)
     * @return {string}
     */
    get activityAbsoluteDurationValue() {
      return this._activityAbsoluteDurationValue;
    }
    /**
     * Setter for activityAbsoluteDurationValue
     * @param {string} duration
     */
    set activityAbsoluteDurationValue(duration) {
      if (!validateISO8601Duration(duration, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".activityAbsoluteDurationValue", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._activityAbsoluteDurationValue = duration;
    }
    /**
     * Getter for activityExperiencedDurationValue (actual calculated duration)
     * @return {string}
     */
    get activityExperiencedDurationValue() {
      return this._activityExperiencedDurationValue;
    }
    /**
     * Setter for activityExperiencedDurationValue
     * @param {string} duration
     */
    set activityExperiencedDurationValue(duration) {
      if (!validateISO8601Duration(duration, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".activityExperiencedDurationValue", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._activityExperiencedDurationValue = duration;
    }
    /**
     * Getter for activityStartTimestampUtc
     * @return {string | null}
     */
    get activityStartTimestampUtc() {
      return this._activityStartTimestampUtc;
    }
    /**
     * Setter for activityStartTimestampUtc
     * @param {string | null} timestamp
     */
    set activityStartTimestampUtc(timestamp) {
      this._activityStartTimestampUtc = timestamp;
    }
    /**
     * Getter for attemptStartTimestampUtc
     * @return {string | null}
     */
    get attemptStartTimestampUtc() {
      return this._attemptStartTimestampUtc;
    }
    /**
     * Setter for attemptStartTimestampUtc
     * @param {string | null} timestamp
     */
    set attemptStartTimestampUtc(timestamp) {
      this._attemptStartTimestampUtc = timestamp;
    }
    /**
     * Getter for activityEndedDate
     * @return {Date | null}
     */
    get activityEndedDate() {
      return this._activityEndedDate;
    }
    /**
     * Setter for activityEndedDate
     * @param {Date | null} date
     */
    set activityEndedDate(date) {
      this._activityEndedDate = date;
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
      this._sequencingControls = sequencingControls;
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
      this._sequencingRules = sequencingRules;
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
      this._rollupRules = rollupRules;
    }
    get rollupConsiderations() {
      return {
        ...this._rollupConsiderations
      };
    }
    set rollupConsiderations(config) {
      this._rollupConsiderations = {
        ...config
      };
    }
    applyRollupConsiderations(settings) {
      this._rollupConsiderations = {
        ...this._rollupConsiderations,
        ...settings
      };
    }
    /**
     * Individual rollup consideration getters/setters (RB.1.4.2)
     * These control when THIS activity is included in parent rollup
     */
    get requiredForSatisfied() {
      return this._requiredForSatisfied;
    }
    set requiredForSatisfied(value) {
      this._requiredForSatisfied = value;
    }
    get requiredForNotSatisfied() {
      return this._requiredForNotSatisfied;
    }
    set requiredForNotSatisfied(value) {
      this._requiredForNotSatisfied = value;
    }
    get requiredForCompleted() {
      return this._requiredForCompleted;
    }
    set requiredForCompleted(value) {
      this._requiredForCompleted = value;
    }
    get requiredForIncomplete() {
      return this._requiredForIncomplete;
    }
    set requiredForIncomplete(value) {
      this._requiredForIncomplete = value;
    }
    get wasSkipped() {
      return this._wasSkipped;
    }
    set wasSkipped(value) {
      this._wasSkipped = value;
    }
    get attemptProgressStatus() {
      return this._attemptProgressStatus;
    }
    set attemptProgressStatus(value) {
      this._attemptProgressStatus = value;
    }
    get wasAutoCompleted() {
      return this._wasAutoCompleted;
    }
    set wasAutoCompleted(value) {
      this._wasAutoCompleted = value;
    }
    get wasAutoSatisfied() {
      return this._wasAutoSatisfied;
    }
    set wasAutoSatisfied(value) {
      this._wasAutoSatisfied = value;
    }
    get completedByMeasure() {
      return this._completedByMeasure;
    }
    set completedByMeasure(value) {
      this._completedByMeasure = value;
    }
    get minProgressMeasure() {
      return this._minProgressMeasure;
    }
    set minProgressMeasure(value) {
      if (value < 0 || value > 1) {
        throw new Scorm2004ValidationError(this._cmi_element + ".minProgressMeasure", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._minProgressMeasure = value;
    }
    get progressWeight() {
      return this._progressWeight;
    }
    set progressWeight(value) {
      if (value < 0) {
        throw new Scorm2004ValidationError(this._cmi_element + ".progressWeight", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._progressWeight = value;
    }
    get attemptCompletionAmountStatus() {
      return this._attemptCompletionAmountStatus;
    }
    set attemptCompletionAmountStatus(value) {
      this._attemptCompletionAmountStatus = value;
    }
    /**
     * Getter for primary objective
     * @return {ActivityObjective | null}
     */
    get primaryObjective() {
      return this._primaryObjective;
    }
    /**
     * Setter for primary objective
     * @param {ActivityObjective | null} objective
    */
    set primaryObjective(objective) {
      this._primaryObjective = objective;
      if (this._primaryObjective) {
        this._primaryObjective.isPrimary = true;
        if (this._primaryObjective.minNormalizedMeasure !== null) {
          this._scaledPassingScore = this._primaryObjective.minNormalizedMeasure ?? this._scaledPassingScore;
        }
        this._primaryObjective.updateFromActivity(this);
      }
      this.syncPrimaryObjectiveCollection();
    }
    /**
     * Get additional objectives (excludes primary objective)
     * @return {ActivityObjective[]}
     */
    get objectives() {
      return this._objectives.filter(obj => obj.id !== this._primaryObjective?.id);
    }
    /**
     * Replace objectives collection
     * @param {ActivityObjective[]} objectives
    */
    set objectives(objectives) {
      this._objectives = [...objectives];
      this.syncPrimaryObjectiveCollection();
    }
    /**
     * Add an objective
     * @param {ActivityObjective} objective
     */
    addObjective(objective) {
      if (!this._objectives.find(obj => obj.id === objective.id)) {
        this._objectives.push(objective);
      }
    }
    /**
     * Ensure the primary objective is represented within the objectives collection.
     */
    syncPrimaryObjectiveCollection() {
      if (!this._primaryObjective) {
        this._objectives = this._objectives.filter(objective => !objective.isPrimary);
        return;
      }
      const existingIndex = this._objectives.findIndex(objective => objective.id === this._primaryObjective?.id);
      if (existingIndex >= 0) {
        this._objectives[existingIndex] = this._primaryObjective;
        return;
      }
      this._objectives = [this._primaryObjective, ...this._objectives];
    }
    /**
     * Get objective by ID
     * @param {string} objectiveId
     * @return {{ objective: ActivityObjective, isPrimary: boolean } | null}
     */
    getObjectiveById(objectiveId) {
      if (this._primaryObjective?.id === objectiveId) {
        return {
          objective: this._primaryObjective,
          isPrimary: true
        };
      }
      const additional = this._objectives.find(obj => obj.id === objectiveId);
      if (additional) {
        return {
          objective: additional,
          isPrimary: false
        };
      }
      return null;
    }
    /**
     * Get all objectives including primary
     * @return {ActivityObjective[]}
     */
    getAllObjectives() {
      const objectives = [];
      if (this._primaryObjective) {
        objectives.push(this._primaryObjective);
      }
      const additionalObjectives = this._objectives.filter(obj => obj !== this._primaryObjective && obj.id !== this._primaryObjective?.id);
      return objectives.concat(additionalObjectives);
    }
    updatePrimaryObjectiveFromActivity() {
      if (this._primaryObjective) {
        this._primaryObjective.updateFromActivity(this);
      }
    }
    isObjectiveDirty(property) {
      switch (property) {
        case "satisfiedStatus":
          return this._objectiveSatisfiedStatusDirty;
        case "normalizedMeasure":
          return this._objectiveNormalizedMeasureDirty;
        case "measureStatus":
          return this._objectiveMeasureStatusDirty;
      }
    }
    clearObjectiveDirty(property) {
      switch (property) {
        case "satisfiedStatus":
          this._objectiveSatisfiedStatusDirty = false;
          break;
        case "normalizedMeasure":
          this._objectiveNormalizedMeasureDirty = false;
          break;
        case "measureStatus":
          this._objectiveMeasureStatusDirty = false;
          break;
      }
    }
    clearAllObjectiveDirty() {
      this._objectiveSatisfiedStatusDirty = false;
      this._objectiveNormalizedMeasureDirty = false;
      this._objectiveMeasureStatusDirty = false;
    }
    setPrimaryObjectiveState(satisfiedStatus, measureStatus, normalizedMeasure, progressMeasure, progressMeasureStatus, completionStatus) {
      if (this._objectiveSatisfiedStatus !== satisfiedStatus) {
        this._objectiveSatisfiedStatus = satisfiedStatus;
        this._objectiveSatisfiedStatusDirty = true;
      }
      this._objectiveSatisfiedStatusKnown = true;
      if (this._objectiveMeasureStatus !== measureStatus) {
        this._objectiveMeasureStatus = measureStatus;
        this._objectiveMeasureStatusDirty = true;
      }
      if (this._objectiveNormalizedMeasure !== normalizedMeasure) {
        this._objectiveNormalizedMeasure = normalizedMeasure;
        this._objectiveNormalizedMeasureDirty = true;
      }
      this._progressMeasure = progressMeasure;
      this._progressMeasureStatus = progressMeasureStatus;
      this._completionStatus = completionStatus;
      if (this._primaryObjective) {
        this._primaryObjective.satisfiedStatus = satisfiedStatus;
        this._primaryObjective.measureStatus = measureStatus;
        this._primaryObjective.normalizedMeasure = normalizedMeasure;
        this._primaryObjective.progressMeasure = progressMeasure;
        this._primaryObjective.progressMeasureStatus = progressMeasureStatus;
        this._primaryObjective.completionStatus = completionStatus;
      }
    }
    getObjectiveStateSnapshot() {
      const primarySnapshot = this._primaryObjective ? {
        id: this._primaryObjective.id,
        satisfiedStatus: this.objectiveSatisfiedStatus,
        measureStatus: this.objectiveMeasureStatus,
        normalizedMeasure: this.objectiveNormalizedMeasure,
        progressMeasure: this.progressMeasure ?? 0,
        progressMeasureStatus: this.progressMeasureStatus,
        progressStatus: this._primaryObjective.progressStatus,
        completionStatus: this.completionStatus,
        satisfiedByMeasure: this._primaryObjective.satisfiedByMeasure,
        minNormalizedMeasure: this._primaryObjective.minNormalizedMeasure
      } : null;
      const additionalSnapshots = this._objectives.map(objective => ({
        id: objective.id,
        satisfiedStatus: objective.satisfiedStatus,
        measureStatus: objective.measureStatus,
        normalizedMeasure: objective.normalizedMeasure,
        progressMeasure: objective.progressMeasure,
        progressMeasureStatus: objective.progressMeasureStatus,
        progressStatus: objective.progressStatus,
        completionStatus: objective.completionStatus,
        satisfiedByMeasure: objective.satisfiedByMeasure,
        minNormalizedMeasure: objective.minNormalizedMeasure
      }));
      return {
        primary: primarySnapshot,
        objectives: additionalSnapshots
      };
    }
    applyObjectiveStateSnapshot(snapshot) {
      if (snapshot.primary) {
        const primary = this.getObjectiveById(snapshot.primary.id);
        if (primary && primary.isPrimary) {
          const state = snapshot.primary;
          primary.objective.satisfiedByMeasure = state.satisfiedByMeasure ?? primary.objective.satisfiedByMeasure;
          primary.objective.minNormalizedMeasure = state.minNormalizedMeasure !== void 0 ? state.minNormalizedMeasure : primary.objective.minNormalizedMeasure;
          this.setPrimaryObjectiveState(state.satisfiedStatus, state.measureStatus, state.normalizedMeasure, state.progressMeasure, state.progressMeasureStatus, state.completionStatus);
        }
      }
      for (const state of snapshot.objectives) {
        const match = this.getObjectiveById(state.id);
        if (match && !match.isPrimary) {
          const objective = match.objective;
          objective.satisfiedStatus = state.satisfiedStatus;
          objective.measureStatus = state.measureStatus;
          objective.normalizedMeasure = state.normalizedMeasure;
          objective.progressMeasure = state.progressMeasure;
          objective.progressMeasureStatus = state.progressMeasureStatus;
          objective.completionStatus = state.completionStatus;
          objective.satisfiedByMeasure = state.satisfiedByMeasure ?? objective.satisfiedByMeasure;
          objective.minNormalizedMeasure = state.minNormalizedMeasure !== void 0 ? state.minNormalizedMeasure : objective.minNormalizedMeasure;
        }
      }
    }
    /**
     * Get available children with selection and randomization applied
     * @return {Activity[]}
     */
    getAvailableChildren() {
      if (this._children.length === 0) {
        return [];
      }
      if (this._processedChildren !== null) {
        return this._processedChildren;
      }
      return this._children;
    }
    /**
     * Set the processed children (called by SelectionRandomization)
     * @param {Activity[]} processedChildren
     */
    setProcessedChildren(processedChildren) {
      this._processedChildren = processedChildren;
    }
    /**
     * Reset processed children (used when configuration changes)
     */
    resetProcessedChildren() {
      this._processedChildren = null;
    }
    /**
     * Get whether this is a new attempt
     * @return {boolean}
     */
    get isNewAttempt() {
      return this._isNewAttempt;
    }
    /**
     * Set whether this is a new attempt
     * @param {boolean} isNewAttempt
     */
    set isNewAttempt(isNewAttempt) {
      this._isNewAttempt = isNewAttempt;
    }
    /**
     * Getter for launchData
     * @return {string}
     */
    get launchData() {
      return this._launchData;
    }
    /**
     * Setter for launchData
     * @param {string} launchData
     */
    set launchData(launchData) {
      this._launchData = launchData;
    }
    /**
     * Getter for credit
     * @return {string}
     */
    get credit() {
      return this._credit;
    }
    /**
     * Setter for credit
     * @param {string} credit
     */
    set credit(credit) {
      this._credit = credit;
    }
    /**
     * Getter for maxTimeAllowed
     * @return {string}
     */
    get maxTimeAllowed() {
      return this._maxTimeAllowed;
    }
    /**
     * Setter for maxTimeAllowed
     * @param {string} maxTimeAllowed
     */
    set maxTimeAllowed(maxTimeAllowed) {
      this._maxTimeAllowed = maxTimeAllowed;
    }
    /**
     * Getter for completionThreshold
     * @return {string}
     */
    get completionThreshold() {
      return this._completionThreshold;
    }
    /**
     * Setter for completionThreshold
     * @param {string} completionThreshold
     */
    set completionThreshold(completionThreshold) {
      this._completionThreshold = completionThreshold;
    }
    /**
     * Get suspension state for this activity and its descendants
     * Captures all state needed to restore activity tree after suspend/resume
     * @return {object} - Complete suspension state
     */
    getSuspensionState() {
      return {
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
        attemptAbsoluteDurationValue: this._attemptAbsoluteDurationValue,
        attemptExperiencedDurationValue: this._attemptExperiencedDurationValue,
        activityAbsoluteDurationValue: this._activityAbsoluteDurationValue,
        activityExperiencedDurationValue: this._activityExperiencedDurationValue,
        activityStartTimestampUtc: this._activityStartTimestampUtc,
        attemptStartTimestampUtc: this._attemptStartTimestampUtc,
        objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
        objectiveSatisfiedStatusKnown: this._objectiveSatisfiedStatusKnown,
        objectiveMeasureStatus: this._objectiveMeasureStatus,
        objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
        scaledPassingScore: this._scaledPassingScore,
        progressMeasure: this._progressMeasure,
        progressMeasureStatus: this._progressMeasureStatus,
        location: this._location,
        attemptAbsoluteStartTime: this._attemptAbsoluteStartTime,
        activityAttemptActive: this._activityAttemptActive,
        isHiddenFromChoice: this._isHiddenFromChoice,
        isAvailable: this._isAvailable,
        rollupConsiderations: {
          ...this._rollupConsiderations
        },
        wasSkipped: this._wasSkipped,
        attemptProgressStatus: this._attemptProgressStatus,
        wasAutoCompleted: this._wasAutoCompleted,
        wasAutoSatisfied: this._wasAutoSatisfied,
        completedByMeasure: this._completedByMeasure,
        minProgressMeasure: this._minProgressMeasure,
        progressWeight: this._progressWeight,
        attemptCompletionAmountStatus: this._attemptCompletionAmountStatus,
        // Selection/randomization state preservation
        processedChildren: this._processedChildren ? this._processedChildren.map(c => c.id) : null,
        isNewAttempt: this._isNewAttempt,
        selectionCountStatus: this._sequencingControls.selectionCountStatus,
        reorderChildren: this._sequencingControls.reorderChildren,
        // Objective state preservation
        primaryObjective: this._primaryObjective ? {
          id: this._primaryObjective.id,
          satisfiedStatus: this._primaryObjective.satisfiedStatus,
          measureStatus: this._primaryObjective.measureStatus,
          normalizedMeasure: this._primaryObjective.normalizedMeasure,
          progressMeasure: this._primaryObjective.progressMeasure,
          progressMeasureStatus: this._primaryObjective.progressMeasureStatus,
          completionStatus: this._primaryObjective.completionStatus,
          satisfiedByMeasure: this._primaryObjective.satisfiedByMeasure,
          minNormalizedMeasure: this._primaryObjective.minNormalizedMeasure,
          progressStatus: this._primaryObjective.progressStatus,
          mapInfo: this._primaryObjective.mapInfo
        } : null,
        objectives: this._objectives.map(obj => ({
          id: obj.id,
          satisfiedStatus: obj.satisfiedStatus,
          measureStatus: obj.measureStatus,
          normalizedMeasure: obj.normalizedMeasure,
          progressMeasure: obj.progressMeasure,
          progressMeasureStatus: obj.progressMeasureStatus,
          completionStatus: obj.completionStatus,
          satisfiedByMeasure: obj.satisfiedByMeasure,
          minNormalizedMeasure: obj.minNormalizedMeasure,
          progressStatus: obj.progressStatus,
          mapInfo: obj.mapInfo
        })),
        // Recursively save children state
        children: this._children.map(child => child.getSuspensionState())
      };
    }
    /**
     * Restore suspension state for this activity and its descendants
     * Restores all state needed to resume from suspended state
     * @param {any} state - Suspension state to restore
     */
    restoreSuspensionState(state) {
      if (!state) return;
      this._isVisible = state.isVisible ?? this._isVisible;
      this._isActive = state.isActive ?? this._isActive;
      this._isSuspended = state.isSuspended ?? this._isSuspended;
      this._isCompleted = state.isCompleted ?? this._isCompleted;
      this._completionStatus = state.completionStatus ?? this._completionStatus;
      this._successStatus = state.successStatus ?? this._successStatus;
      this._attemptCount = state.attemptCount ?? this._attemptCount;
      this._attemptCompletionAmount = state.attemptCompletionAmount ?? this._attemptCompletionAmount;
      this._attemptAbsoluteDuration = state.attemptAbsoluteDuration ?? this._attemptAbsoluteDuration;
      this._attemptExperiencedDuration = state.attemptExperiencedDuration ?? this._attemptExperiencedDuration;
      this._activityAbsoluteDuration = state.activityAbsoluteDuration ?? this._activityAbsoluteDuration;
      this._activityExperiencedDuration = state.activityExperiencedDuration ?? this._activityExperiencedDuration;
      this._attemptAbsoluteDurationValue = state.attemptAbsoluteDurationValue ?? this._attemptAbsoluteDurationValue;
      this._attemptExperiencedDurationValue = state.attemptExperiencedDurationValue ?? this._attemptExperiencedDurationValue;
      this._activityAbsoluteDurationValue = state.activityAbsoluteDurationValue ?? this._activityAbsoluteDurationValue;
      this._activityExperiencedDurationValue = state.activityExperiencedDurationValue ?? this._activityExperiencedDurationValue;
      this._activityStartTimestampUtc = state.activityStartTimestampUtc ?? this._activityStartTimestampUtc;
      this._attemptStartTimestampUtc = state.attemptStartTimestampUtc ?? this._attemptStartTimestampUtc;
      this._objectiveSatisfiedStatus = state.objectiveSatisfiedStatus ?? this._objectiveSatisfiedStatus;
      this._objectiveSatisfiedStatusKnown = state.objectiveSatisfiedStatusKnown ?? this._objectiveSatisfiedStatusKnown;
      this._objectiveMeasureStatus = state.objectiveMeasureStatus ?? this._objectiveMeasureStatus;
      this._objectiveNormalizedMeasure = state.objectiveNormalizedMeasure ?? this._objectiveNormalizedMeasure;
      this._scaledPassingScore = state.scaledPassingScore ?? this._scaledPassingScore;
      this._progressMeasure = state.progressMeasure ?? this._progressMeasure;
      this._progressMeasureStatus = state.progressMeasureStatus ?? this._progressMeasureStatus;
      this._location = state.location ?? this._location;
      this._attemptAbsoluteStartTime = state.attemptAbsoluteStartTime ?? this._attemptAbsoluteStartTime;
      this._activityAttemptActive = state.activityAttemptActive ?? this._activityAttemptActive;
      this._isHiddenFromChoice = state.isHiddenFromChoice ?? this._isHiddenFromChoice;
      this._isAvailable = state.isAvailable ?? this._isAvailable;
      if (state.rollupConsiderations) {
        this._rollupConsiderations = {
          ...state.rollupConsiderations
        };
      }
      this._wasSkipped = state.wasSkipped ?? this._wasSkipped;
      this._attemptProgressStatus = state.attemptProgressStatus ?? this._attemptProgressStatus;
      this._wasAutoCompleted = state.wasAutoCompleted ?? this._wasAutoCompleted;
      this._wasAutoSatisfied = state.wasAutoSatisfied ?? this._wasAutoSatisfied;
      this._completedByMeasure = state.completedByMeasure ?? this._completedByMeasure;
      this._minProgressMeasure = state.minProgressMeasure ?? this._minProgressMeasure;
      this._progressWeight = state.progressWeight ?? this._progressWeight;
      this._attemptCompletionAmountStatus = state.attemptCompletionAmountStatus ?? this._attemptCompletionAmountStatus;
      this._isNewAttempt = state.isNewAttempt ?? this._isNewAttempt;
      if (state.selectionCountStatus !== void 0) {
        this._sequencingControls.selectionCountStatus = state.selectionCountStatus;
      }
      if (state.reorderChildren !== void 0) {
        this._sequencingControls.reorderChildren = state.reorderChildren;
      }
      if (state.processedChildren) {
        const childMap = new Map(this._children.map(c => [c.id, c]));
        this._processedChildren = state.processedChildren.map(id => childMap.get(id)).filter(c => c !== void 0);
      } else {
        this._processedChildren = null;
      }
      if (state.primaryObjective && this._primaryObjective) {
        this._primaryObjective.satisfiedStatus = state.primaryObjective.satisfiedStatus ?? this._primaryObjective.satisfiedStatus;
        this._primaryObjective.measureStatus = state.primaryObjective.measureStatus ?? this._primaryObjective.measureStatus;
        this._primaryObjective.normalizedMeasure = state.primaryObjective.normalizedMeasure ?? this._primaryObjective.normalizedMeasure;
        this._primaryObjective.progressMeasure = state.primaryObjective.progressMeasure ?? this._primaryObjective.progressMeasure;
        this._primaryObjective.progressMeasureStatus = state.primaryObjective.progressMeasureStatus ?? this._primaryObjective.progressMeasureStatus;
        this._primaryObjective.completionStatus = state.primaryObjective.completionStatus ?? this._primaryObjective.completionStatus;
        this._primaryObjective.progressStatus = state.primaryObjective.progressStatus ?? this._primaryObjective.progressStatus;
      }
      if (state.objectives) {
        for (const objState of state.objectives) {
          const objective = this._objectives.find(o => o.id === objState.id);
          if (objective) {
            objective.satisfiedStatus = objState.satisfiedStatus ?? objective.satisfiedStatus;
            objective.measureStatus = objState.measureStatus ?? objective.measureStatus;
            objective.normalizedMeasure = objState.normalizedMeasure ?? objective.normalizedMeasure;
            objective.progressMeasure = objState.progressMeasure ?? objective.progressMeasure;
            objective.progressMeasureStatus = objState.progressMeasureStatus ?? objective.progressMeasureStatus;
            objective.completionStatus = objState.completionStatus ?? objective.completionStatus;
            objective.progressStatus = objState.progressStatus ?? objective.progressStatus;
          }
        }
      }
      if (state.children && Array.isArray(state.children)) {
        for (let i = 0; i < state.children.length && i < this._children.length; i++) {
          const childState = state.children[i];
          const child = this._children.find(c => c.id === childState.id);
          if (child) {
            child.restoreSuspensionState(childState);
          }
        }
      }
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
        objectiveSatisfiedStatusKnown: this._objectiveSatisfiedStatusKnown,
        objectiveMeasureStatus: this._objectiveMeasureStatus,
        objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
        rollupConsiderations: {
          ...this._rollupConsiderations
        },
        wasSkipped: this._wasSkipped,
        completedByMeasure: this._completedByMeasure,
        minProgressMeasure: this._minProgressMeasure,
        progressWeight: this._progressWeight,
        attemptCompletionAmountStatus: this._attemptCompletionAmountStatus,
        hideLmsUi: [...this._hideLmsUi],
        auxiliaryResources: this._auxiliaryResources.map(resource => ({
          ...resource
        })),
        children: this._children.map(child => child.toJSON())
      };
      this.jsonString = false;
      return result;
    }
    get auxiliaryResources() {
      return this._auxiliaryResources.map(resource => ({
        ...resource
      }));
    }
    set auxiliaryResources(resources) {
      const sanitized = [];
      const seen = /* @__PURE__ */new Set();
      for (const resource of resources || []) {
        if (!resource) continue;
        const resourceId = typeof resource.resourceId === "string" ? resource.resourceId.trim() : "";
        const purpose = typeof resource.purpose === "string" ? resource.purpose.trim() : "";
        if (!resourceId || seen.has(resourceId)) {
          continue;
        }
        seen.add(resourceId);
        sanitized.push({
          resourceId,
          purpose
        });
      }
      this._auxiliaryResources = sanitized;
    }
    addAuxiliaryResource(resource) {
      this.auxiliaryResources = [...this._auxiliaryResources, resource];
    }
    /**
     * Capture current rollup status for optimization comparison
     * Used by Overall Rollup Process (RB.1.5) to detect when status stops changing
     * @return {RollupStatusSnapshot} - Snapshot of current rollup-relevant status
     */
    captureRollupStatus() {
      return {
        measureStatus: this._objectiveMeasureStatus,
        normalizedMeasure: this._objectiveNormalizedMeasure,
        objectiveProgressStatus: this._objectiveSatisfiedStatus !== null && this._objectiveSatisfiedStatus !== void 0,
        objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
        attemptProgressStatus: this._completionStatus !== CompletionStatus.UNKNOWN,
        attemptCompletionStatus: this._completionStatus === CompletionStatus.COMPLETED
      };
    }
    /**
     * Compare two rollup status snapshots for equality
     * Uses epsilon comparison for floating point normalizedMeasure
     * @param {RollupStatusSnapshot} prior - Previous status snapshot
     * @param {RollupStatusSnapshot} current - Current status snapshot
     * @return {boolean} - True if statuses are equal (no change), false if different
     */
    static compareRollupStatus(prior, current) {
      const EPSILON = 1e-4;
      return prior.measureStatus === current.measureStatus && Math.abs(prior.normalizedMeasure - current.normalizedMeasure) < EPSILON && prior.objectiveProgressStatus === current.objectiveProgressStatus && prior.objectiveSatisfiedStatus === current.objectiveSatisfiedStatus && prior.attemptProgressStatus === current.attemptProgressStatus && prior.attemptCompletionStatus === current.attemptCompletionStatus;
    }
    /**
     * Getter for hideLmsUi directives
     * @return {HideLmsUiItem[]}
     */
    get hideLmsUi() {
      return [...this._hideLmsUi];
    }
    /**
     * Setter for hideLmsUi directives
     * @param {HideLmsUiItem[]} hideLmsUi
     */
    set hideLmsUi(hideLmsUi) {
      const valid = new Set(HIDE_LMS_UI_TOKENS);
      const seen = /* @__PURE__ */new Set();
      const sanitized = [];
      for (const directive of hideLmsUi) {
        if (valid.has(directive) && !seen.has(directive)) {
          seen.add(directive);
          sanitized.push(directive);
        }
      }
      this._hideLmsUi = sanitized;
    }
  }

  class ActivityTree extends BaseCMI {
    /**
     * Constructor for ActivityTree
     */
    constructor(root) {
      super("activityTree");
      this._root = null;
      this._currentActivity = null;
      this._suspendedActivity = null;
      this._activities = /* @__PURE__ */new Map();
      if (root) {
        this.root = root;
      }
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
      this._activities.clear();
      if (this._root) {
        this._root.reset();
        this._activities.set(this._root.id, this._root);
        this._addActivitiesToMap(this._root);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".root", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._activities.clear();
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
        throw new Scorm2004ValidationError(this._cmi_element + ".currentActivity", scorm2004_errors$1.TYPE_MISMATCH);
      }
      if (this._currentActivity) {
        this._currentActivity.isActive = false;
        let ancestor = this._currentActivity.parent;
        while (ancestor) {
          ancestor.isActive = false;
          ancestor = ancestor.parent;
        }
      }
      this._currentActivity = activity;
      if (activity) {
        activity.isActive = true;
        let ancestor = activity.parent;
        while (ancestor) {
          ancestor.isActive = true;
          ancestor = ancestor.parent;
        }
      }
    }
    /**
     * Set current activity without activating it
     * This method is used when the sequencing process needs to update the current activity
     * pointer without triggering the automatic activation behavior (e.g., after termination).
     * Unlike the normal setter, this method only deactivates the old current activity (and
     * non-shared ancestors) WITHOUT activating the new current activity.
     * @param {Activity | null} activity - The activity to set as current
     */
    setCurrentActivityWithoutActivation(activity) {
      if (activity !== null && !(activity instanceof Activity)) {
        throw new Scorm2004ValidationError(this._cmi_element + ".currentActivity", scorm2004_errors$1.TYPE_MISMATCH);
      }
      if (this._currentActivity) {
        const activitiesToPreserve = /* @__PURE__ */new Set();
        if (activity) {
          activitiesToPreserve.add(activity);
          let ancestor2 = activity.parent;
          while (ancestor2) {
            activitiesToPreserve.add(ancestor2);
            ancestor2 = ancestor2.parent;
          }
        }
        this._currentActivity.isActive = false;
        let ancestor = this._currentActivity.parent;
        while (ancestor) {
          if (!activitiesToPreserve.has(ancestor)) {
            ancestor.isActive = false;
          }
          ancestor = ancestor.parent;
        }
      }
      this._currentActivity = activity;
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
        throw new Scorm2004ValidationError(this._cmi_element + ".suspendedActivity", scorm2004_errors$1.TYPE_MISMATCH);
      }
      if (this._suspendedActivity) {
        this._suspendedActivity.isSuspended = false;
        let ancestor = this._suspendedActivity.parent;
        while (ancestor) {
          ancestor.isSuspended = false;
          ancestor = ancestor.parent;
        }
      }
      this._suspendedActivity = activity;
      if (activity) {
        activity.isSuspended = true;
        let ancestor = activity.parent;
        while (ancestor) {
          ancestor.isSuspended = true;
          ancestor = ancestor.parent;
        }
      }
    }
    /**
     * Get an activity by ID
     * @param {string} id - The ID of the activity to get
     * @return {Activity | null} - The activity with the given ID, or null if not found
     */
    getActivity(id) {
      return this._activities.get(id) || null;
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
     * @param {boolean} useAvailableChildren - Whether to use available children (with selection/randomization)
     * @return {Activity[]} - An array of the activity's children
     */
    getChildren(activity) {
      let useAvailableChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      return useAvailableChildren ? activity.getAvailableChildren() : activity.children;
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
      return activity.parent.children.filter(child => child !== activity);
    }
    /**
     * Get the next sibling of an activity
     * @param {Activity} activity - The activity to get the next sibling of
     * @param {boolean} useAvailableChildren - Whether to use available children (with selection/randomization)
     * @return {Activity | null} - The next sibling of the activity, or null if it has no next sibling
     */
    getNextSibling(activity) {
      let useAvailableChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (!activity.parent) {
        return null;
      }
      let siblings = useAvailableChildren ? activity.parent.getAvailableChildren() : activity.parent.children;
      let index = siblings.indexOf(activity);
      if (index === -1 && useAvailableChildren) {
        siblings = activity.parent.children;
        index = siblings.indexOf(activity);
      }
      if (index === -1 || index === siblings.length - 1) {
        return null;
      }
      return siblings[index + 1] ?? null;
    }
    /**
     * Get the previous sibling of an activity
     * @param {Activity} activity - The activity to get the previous sibling of
     * @param {boolean} useAvailableChildren - Whether to use available children (with selection/randomization)
     * @return {Activity | null} - The previous sibling of the activity, or null if it has no previous sibling
     */
    getPreviousSibling(activity) {
      let useAvailableChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      if (!activity.parent) {
        return null;
      }
      let siblings = useAvailableChildren ? activity.parent.getAvailableChildren() : activity.parent.children;
      let index = siblings.indexOf(activity);
      if (index === -1 && useAvailableChildren) {
        siblings = activity.parent.children;
        index = siblings.indexOf(activity);
      }
      if (index <= 0) {
        return null;
      }
      return siblings[index - 1] ?? null;
    }
    /**
     * Get the first child of an activity
     * @param {Activity} activity - The activity to get the first child of
     * @param {boolean} useAvailableChildren - Whether to use available children (with selection/randomization)
     * @return {Activity | null} - The first child of the activity, or null if it has no children
     */
    getFirstChild(activity) {
      let useAvailableChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const children = useAvailableChildren ? activity.getAvailableChildren() : activity.children;
      if (children.length === 0) {
        return null;
      }
      return children[0] ?? null;
    }
    /**
     * Get the last child of an activity
     * @param {Activity} activity - The activity to get the last child of
     * @param {boolean} useAvailableChildren - Whether to use available children (with selection/randomization)
     * @return {Activity | null} - The last child of the activity, or null if it has no children
     */
    getLastChild(activity) {
      let useAvailableChildren = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const children = useAvailableChildren ? activity.getAvailableChildren() : activity.children;
      if (children.length === 0) {
        return null;
      }
      return children[children.length - 1] ?? null;
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

  class Sequencing extends BaseCMI {
    /**
     * Constructor for Sequencing
     */
    constructor() {
      super("sequencing");
      this._adlNav = null;
      this._hideLmsUi = [];
      this._auxiliaryResources = [];
      this._overallSequencingProcess = null;
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
      this._hideLmsUi = [];
      this._auxiliaryResources = [];
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
        throw new Scorm2004ValidationError(this._cmi_element + ".activityTree", scorm2004_errors$1.TYPE_MISMATCH);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".sequencingRules", scorm2004_errors$1.TYPE_MISMATCH);
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
        throw new Scorm2004ValidationError(this._cmi_element + ".sequencingControls", scorm2004_errors$1.TYPE_MISMATCH);
      }
      this._sequencingControls = sequencingControls;
    }
    get hideLmsUi() {
      return [...this._hideLmsUi];
    }
    set hideLmsUi(items) {
      this._hideLmsUi = [...items];
    }
    get auxiliaryResources() {
      return this._auxiliaryResources.map(resource => ({
        ...resource
      }));
    }
    set auxiliaryResources(resources) {
      this._auxiliaryResources = resources.map(resource => ({
        ...resource
      }));
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
        throw new Scorm2004ValidationError(this._cmi_element + ".rollupRules", scorm2004_errors$1.TYPE_MISMATCH);
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
     * Getter for overallSequencingProcess
     * @return {any | null}
     */
    get overallSequencingProcess() {
      return this._overallSequencingProcess;
    }
    /**
     * Setter for overallSequencingProcess
     * @param {any | null} process
     */
    set overallSequencingProcess(process) {
      this._overallSequencingProcess = process;
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
     * Get the current activity
     * @return {Activity | null}
     */
    getCurrentActivity() {
      return this._activityTree.currentActivity;
    }
    /**
     * Get the root activity
     * @return {Activity | null}
     */
    getRootActivity() {
      return this._activityTree.root;
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
        rollupRules: this._rollupRules,
        adlNav: this._adlNav
      };
      this.jsonString = false;
      return result;
    }
  }

  class RollupProcess {
    constructor(eventCallback) {
      this.rollupStateLog = [];
      this.eventCallback = null;
      this.eventCallback = eventCallback || null;
    }
    /**
     * Overall Rollup Process
     * Performs rollup from a given activity up through its ancestors
     * OPTIMIZATION: Stops propagating rollup when status stops changing (SCORM 2004 4.6.1)
     * @spec SN Book: RB.1.5 (Overall Rollup Process)
     * @param {Activity} activity - The activity to start rollup from
     * @return {Activity[]} - Array of activities that had status changes
     */
    overallRollupProcess(activity) {
      const affectedActivities = [];
      let currentActivity = activity.parent;
      let onlyDurationRollup = false;
      let isFirst = true;
      while (currentActivity) {
        if (currentActivity.children.length > 0) {
          this.durationRollupProcess(currentActivity);
        }
        if (!onlyDurationRollup) {
          const beforeStatus = currentActivity.captureRollupStatus();
          if (currentActivity.sequencingControls.rollupObjectiveSatisfied || currentActivity.sequencingControls.rollupProgressCompletion) {
            if (currentActivity.children.length > 0) {
              this.measureRollupProcess(currentActivity);
              this.completionMeasureRollupProcess(currentActivity);
            }
            if (currentActivity.sequencingControls.rollupObjectiveSatisfied) {
              this.objectiveRollupProcess(currentActivity);
            }
            if (currentActivity.sequencingControls.rollupProgressCompletion) {
              this.activityProgressRollupProcess(currentActivity);
            }
          }
          const afterStatus = currentActivity.captureRollupStatus();
          if (!isFirst) {
            const changed = !Activity.compareRollupStatus(beforeStatus, afterStatus);
            if (!changed) {
              this.eventCallback?.("rollup_optimization_activated", {
                activityId: currentActivity.id,
                depth: affectedActivities.length
              });
              onlyDurationRollup = true;
            }
          }
          if (isFirst || !Activity.compareRollupStatus(beforeStatus, afterStatus)) {
            affectedActivities.push(currentActivity);
          }
        }
        currentActivity = currentActivity.parent;
        isFirst = false;
      }
      return affectedActivities;
    }
    /**
     * Measure Rollup Process
     * Rolls up objective measure (score) from children to parent
     * INTEGRATION: Uses complex weighted measure calculation
     * @spec SN Book: RB.1.1 (Measure Rollup Process)
     * @param {Activity} activity - The parent activity
     */
    measureRollupProcess(activity) {
      if (!activity.sequencingControls.rollupObjectiveSatisfied) {
        return;
      }
      const children = activity.getAvailableChildren();
      if (children.length === 0) {
        return;
      }
      const rollupConsiderations = activity.rollupConsiderations;
      const contributingChildren = children.filter(child => {
        if (!this.checkChildForRollupSubprocess(child, "measure")) {
          return false;
        }
        if (!child.objectiveMeasureStatus || child.objectiveNormalizedMeasure === null) {
          return false;
        }
        if (!rollupConsiderations.measureSatisfactionIfActive && (child.activityAttemptActive || child.isActive)) {
          return false;
        }
        return true;
      });
      if (contributingChildren.length === 0) {
        activity.objectiveMeasureStatus = false;
        return;
      }
      const complexWeightedMeasure = this.calculateComplexWeightedMeasure(activity, contributingChildren, {
        enableThresholdBias: false
      });
      activity.objectiveNormalizedMeasure = complexWeightedMeasure;
      activity.objectiveMeasureStatus = true;
      const clusters = this.identifyActivityClusters(contributingChildren);
      if (clusters.length > 1) {
        this.processCrossClusterDependencies(activity, clusters);
      }
    }
    /**
     * Objective Rollup Process
     * Determines objective satisfaction status using rules, measure, or default
     * @spec SN Book: RB.1.2 (Objective Rollup Process)
     * @param {Activity} activity - The parent activity
     */
    objectiveRollupProcess(activity) {
      const rollupRules = activity.rollupRules;
      const ruleResult = this.objectiveRollupUsingRules(activity, rollupRules.rules);
      if (ruleResult !== null) {
        activity.objectiveSatisfiedStatus = ruleResult;
        this.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
      const measureResult = this.objectiveRollupUsingMeasure(activity);
      if (measureResult !== null) {
        activity.objectiveSatisfiedStatus = measureResult;
        this.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
      activity.objectiveSatisfiedStatus = this.objectiveRollupUsingDefault(activity);
      this.syncPrimaryObjectiveFromActivity(activity);
    }
    /**
     * Sync primary objective status from activity properties
     * Ensures the primary objective reflects the activity's rollup-derived status
     */
    syncPrimaryObjectiveFromActivity(activity) {
      if (activity.primaryObjective) {
        activity.primaryObjective.satisfiedStatus = activity.objectiveSatisfiedStatus;
        activity.primaryObjective.satisfiedStatusKnown = activity.objectiveSatisfiedStatusKnown;
        activity.primaryObjective.measureStatus = activity.objectiveMeasureStatus;
        activity.primaryObjective.normalizedMeasure = activity.objectiveNormalizedMeasure;
        activity.primaryObjective.progressMeasure = activity.progressMeasure;
        activity.primaryObjective.progressMeasureStatus = activity.progressMeasureStatus;
        activity.primaryObjective.completionStatus = activity.completionStatus;
      }
    }
    /**
     * Objective Rollup Using Rules
     * @spec SN Book: RB.1.2.b (Objective Rollup Using Rules)
     * @param {Activity} activity - The parent activity
     * @param {RollupRule[]} rules - The rollup rules to evaluate
     * @return {boolean | null} - True if satisfied, false if not, null if no rule applies
     */
    objectiveRollupUsingRules(activity, rules) {
      const satisfiedRules = rules.filter(rule => rule.action === RollupActionType.SATISFIED);
      const notSatisfiedRules = rules.filter(rule => rule.action === RollupActionType.NOT_SATISFIED);
      for (const rule of satisfiedRules) {
        if (this.evaluateRollupRule(activity, rule)) {
          return true;
        }
      }
      for (const rule of notSatisfiedRules) {
        if (this.evaluateRollupRule(activity, rule)) {
          return false;
        }
      }
      return null;
    }
    /**
     * Objective Rollup Using Measure
     * @spec SN Book: RB.1.2.a (Objective Rollup Using Measure)
     * @param {Activity} activity - The parent activity
     * @return {boolean | null} - True if satisfied, false if not, null if no measure
     */
    objectiveRollupUsingMeasure(activity) {
      if (!activity.objectiveMeasureStatus || activity.scaledPassingScore === null) {
        return null;
      }
      return activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
    }
    /**
     * Objective Rollup Using Default
     * For default rollup (no explicit rules), a child is included only if it
     * passes BOTH requiredForSatisfied AND requiredForNotSatisfied considerations.
     * This ensures symmetric exclusion: setting either consideration excludes
     * the child from the entire objective rollup evaluation.
     * @spec SN Book: RB.1.2.c (Objective Rollup Using Default)
     * @param {Activity} activity - The parent activity
     * @return {boolean} - True if all tracked children are satisfied
     */
    objectiveRollupUsingDefault(activity) {
      const children = activity.getAvailableChildren();
      if (children.length === 0) {
        return false;
      }
      const considerations = activity.rollupConsiderations;
      const contributors = children.filter(child => {
        if (!this.checkChildForRollupSubprocess(child, "objective", "satisfied") || !this.checkChildForRollupSubprocess(child, "objective", "notSatisfied")) {
          return false;
        }
        if (!considerations.measureSatisfactionIfActive && (child.activityAttemptActive || child.isActive)) {
          return false;
        }
        return true;
      });
      if (contributors.length === 0) {
        return false;
      }
      if (contributors.some(child => !this.isChildSatisfiedForRollup(child))) {
        return false;
      }
      return contributors.every(child => this.isChildSatisfiedForRollup(child));
    }
    /**
     * Completion Measure Rollup Process
     * Rolls up attemptCompletionAmount from children to parent using weighted averaging
     * 4th Edition Addition: Supports completion measure rollup for progress tracking
     * @spec SN Book: RB.1.1.b (Completion Measure Rollup Process)
     * @param {Activity} activity - The parent activity
     */
    completionMeasureRollupProcess(activity) {
      const children = activity.getAvailableChildren();
      if (children.length === 0) {
        return;
      }
      const contributingChildren = children.filter(child => {
        return child.attemptCompletionAmountStatus;
      });
      if (contributingChildren.length === 0) {
        activity.attemptCompletionAmountStatus = false;
        return;
      }
      let totalWeightedMeasure = 0;
      let totalWeight = 0;
      for (const child of contributingChildren) {
        totalWeightedMeasure += child.attemptCompletionAmount * child.progressWeight;
        totalWeight += child.progressWeight;
      }
      if (totalWeight > 0) {
        activity.attemptCompletionAmount = totalWeightedMeasure / totalWeight;
        activity.attemptCompletionAmountStatus = true;
      }
    }
    /**
     * Activity Progress Rollup Using Measure
     * Determines completion status using attemptCompletionAmount threshold comparison
     * 4th Edition Addition: Measure-based completion determination
     * @spec SN Book: RB.1.3.a (Activity Progress Rollup Using Measure)
     * @param {Activity} activity - The activity to evaluate
     * @return {boolean} - True if measure-based evaluation was applied, false otherwise
     */
    activityProgressRollupUsingMeasure(activity) {
      if (!activity.completedByMeasure) {
        return false;
      }
      if (!activity.attemptCompletionAmountStatus) {
        activity.completionStatus = CompletionStatus.UNKNOWN;
        this.syncPrimaryObjectiveFromActivity(activity);
        return true;
      }
      if (activity.attemptCompletionAmount >= activity.minProgressMeasure) {
        activity.completionStatus = CompletionStatus.COMPLETED;
      } else {
        activity.completionStatus = CompletionStatus.INCOMPLETE;
      }
      this.syncPrimaryObjectiveFromActivity(activity);
      return true;
    }
    /**
     * Activity Progress Rollup Process
     * Determines activity completion status
     * MODIFIED: Now tries measure-based rollup first
     * @spec SN Book: RB.1.3 (Activity Progress Rollup Process)
     * @param {Activity} activity - The parent activity
     */
    activityProgressRollupProcess(activity) {
      if (this.activityProgressRollupUsingMeasure(activity)) {
        return;
      }
      const rollupRules = activity.rollupRules;
      const completedRules = rollupRules.rules.filter(rule => rule.action === RollupActionType.COMPLETED);
      const incompleteRules = rollupRules.rules.filter(rule => rule.action === RollupActionType.INCOMPLETE);
      for (const rule of completedRules) {
        if (this.evaluateRollupRule(activity, rule)) {
          activity.completionStatus = "completed";
          this.syncPrimaryObjectiveFromActivity(activity);
          return;
        }
      }
      for (const rule of incompleteRules) {
        if (this.evaluateRollupRule(activity, rule)) {
          activity.completionStatus = "incomplete";
          this.syncPrimaryObjectiveFromActivity(activity);
          return;
        }
      }
      const children = activity.getAvailableChildren();
      const contributors = children.filter(child => this.checkChildForRollupSubprocess(child, "progress", "completed") && this.checkChildForRollupSubprocess(child, "progress", "incomplete"));
      if (contributors.length === 0) {
        activity.completionStatus = "incomplete";
        this.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
      if (contributors.some(child => !this.isChildCompletedForRollup(child))) {
        activity.completionStatus = "incomplete";
        this.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
      activity.completionStatus = "completed";
      this.syncPrimaryObjectiveFromActivity(activity);
    }
    /**
     * Duration Rollup Process
     * Aggregates duration information from child activities to parent cluster
     * Called ALWAYS for cluster activities, even when other rollup is skipped due to optimization
     * @spec SN Book: RB.1.4 (Duration Rollup Process)
     * @spec Reference: Overall Rollup Process [RB.1.5] - duration rollup happens before optimization check
     * @param {Activity} activity - The parent cluster activity
     */
    durationRollupProcess(activity) {
      if (activity.children.length === 0) {
        return;
      }
      const children = activity.getAvailableChildren();
      if (children.length === 0) {
        return;
      }
      let earliestChildActivityStartTimestampUtc = null;
      let earliestChildAttemptStartTimestampUtc = null;
      let latestChildEndDate = null;
      let latestAttemptChildEndDate = null;
      let childrenActivityExperiencedDurationSeconds = 0;
      let childrenAttemptExperiencedDurationSeconds = 0;
      for (const child of children) {
        if (child.activityStartTimestampUtc) {
          if (!earliestChildActivityStartTimestampUtc || child.activityStartTimestampUtc < earliestChildActivityStartTimestampUtc) {
            earliestChildActivityStartTimestampUtc = child.activityStartTimestampUtc;
          }
        }
        if (child.activityEndedDate) {
          if (!latestChildEndDate || child.activityEndedDate > latestChildEndDate) {
            latestChildEndDate = child.activityEndedDate;
          }
        }
        const activityDuration = child.activityExperiencedDurationValue !== "PT0H0M0S" ? child.activityExperiencedDurationValue : child.activityExperiencedDuration;
        if (activityDuration && activityDuration !== "PT0H0M0S") {
          childrenActivityExperiencedDurationSeconds += getDurationAsSeconds(activityDuration, scorm2004_regex.CMITimespan);
        }
        const isChildInSameAttempt = !activity.attemptStartTimestampUtc || child.attemptStartTimestampUtc && child.attemptStartTimestampUtc >= activity.attemptStartTimestampUtc;
        if (isChildInSameAttempt) {
          if (child.attemptStartTimestampUtc) {
            if (!earliestChildAttemptStartTimestampUtc || child.attemptStartTimestampUtc < earliestChildAttemptStartTimestampUtc) {
              earliestChildAttemptStartTimestampUtc = child.attemptStartTimestampUtc;
            }
          }
          if (child.activityEndedDate) {
            if (!latestAttemptChildEndDate || child.activityEndedDate > latestAttemptChildEndDate) {
              latestAttemptChildEndDate = child.activityEndedDate;
            }
          }
          const attemptDuration = child.attemptExperiencedDurationValue !== "PT0H0M0S" ? child.attemptExperiencedDurationValue : child.attemptExperiencedDuration;
          if (attemptDuration && attemptDuration !== "PT0H0M0S") {
            childrenAttemptExperiencedDurationSeconds += getDurationAsSeconds(attemptDuration, scorm2004_regex.CMITimespan);
          }
        }
      }
      if (earliestChildActivityStartTimestampUtc !== null) {
        activity.activityStartTimestampUtc = earliestChildActivityStartTimestampUtc;
        if (!activity.attemptStartTimestampUtc && earliestChildAttemptStartTimestampUtc) {
          activity.attemptStartTimestampUtc = earliestChildAttemptStartTimestampUtc;
        }
        activity.activityEndedDate = latestChildEndDate;
        if (latestChildEndDate && activity.activityStartTimestampUtc) {
          const startDate = new Date(activity.activityStartTimestampUtc);
          const durationMs = latestChildEndDate.getTime() - startDate.getTime();
          const durationSeconds = Math.max(0, durationMs / 1e3);
          activity.activityAbsoluteDurationValue = getSecondsAsISODuration(durationSeconds);
        }
        if (latestAttemptChildEndDate && activity.attemptStartTimestampUtc) {
          const startDate = new Date(activity.attemptStartTimestampUtc);
          const durationMs = latestAttemptChildEndDate.getTime() - startDate.getTime();
          const durationSeconds = Math.max(0, durationMs / 1e3);
          activity.attemptAbsoluteDurationValue = getSecondsAsISODuration(durationSeconds);
        }
        activity.activityExperiencedDurationValue = getSecondsAsISODuration(childrenActivityExperiencedDurationSeconds);
        activity.attemptExperiencedDurationValue = getSecondsAsISODuration(childrenAttemptExperiencedDurationSeconds);
        this.eventCallback?.("duration_rollup_completed", {
          activityId: activity.id,
          activityAbsoluteDuration: activity.activityAbsoluteDurationValue,
          attemptAbsoluteDuration: activity.attemptAbsoluteDurationValue,
          activityExperiencedDuration: activity.activityExperiencedDurationValue,
          attemptExperiencedDuration: activity.attemptExperiencedDurationValue,
          childCount: children.length
        });
      }
    }
    /**
     * Get trackable children for rollup operations
     * Filters out activities with tracked=false from rollup calculations
     * @param {Activity} activity - The parent activity
     * @return {Activity[]} - Array of trackable children
     */
    getTrackableChildren(activity) {
      return activity.children.filter(child => child.sequencingControls.tracked !== false);
    }
    /**
     * Check Child For Rollup Subprocess
     * Determines if a child activity contributes to rollup based on its individual consideration settings
     * This implements the full SCORM 2004 RB.1.4.2 specification
     * @spec SN Book: RB.1.4.2 (Check Child For Rollup Subprocess)
     * @param {Activity} child - The child activity to check
     * @param {string} rollupType - Type of rollup ("measure", "objective", "progress")
     * @param {string} [rollupAction] - Specific rollup action (satisfied, notSatisfied, completed, incomplete)
     * @return {boolean} - True if child contributes to rollup
     */
    checkChildForRollupSubprocess(child, rollupType, rollupAction) {
      if (child.sequencingControls.tracked === false) {
        return false;
      }
      let included = false;
      if (rollupType === "measure" || rollupType === "objective") {
        if (!child.sequencingControls.rollupObjectiveSatisfied) {
          return false;
        }
        included = true;
        const requiredForSatisfied = child.requiredForSatisfied;
        const requiredForNotSatisfied = child.requiredForNotSatisfied;
        if (rollupAction === "satisfied" && requiredForSatisfied === "ifNotSuspended" || rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifNotSuspended") {
          if (!child.attemptProgressStatus || child.attemptCount > 0 && child.isSuspended) {
            included = false;
          }
        } else if (rollupAction === "satisfied" && requiredForSatisfied === "ifAttempted" || rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifAttempted") {
          if (!child.attemptProgressStatus || child.attemptCount === 0) {
            included = false;
          }
        } else if (rollupAction === "satisfied" && requiredForSatisfied === "ifNotSkipped" || rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifNotSkipped") {
          if (child.wasSkipped) {
            included = false;
          }
        }
      }
      if (rollupType === "progress") {
        if (!child.sequencingControls.rollupProgressCompletion) {
          return false;
        }
        included = true;
        const requiredForCompleted = child.requiredForCompleted;
        const requiredForIncomplete = child.requiredForIncomplete;
        if (rollupAction === "completed" && requiredForCompleted === "ifNotSuspended" || rollupAction === "incomplete" && requiredForIncomplete === "ifNotSuspended") {
          if (!child.attemptProgressStatus || child.attemptCount > 0 && child.isSuspended) {
            included = false;
          }
        } else if (rollupAction === "completed" && requiredForCompleted === "ifAttempted" || rollupAction === "incomplete" && requiredForIncomplete === "ifAttempted") {
          if (!child.attemptProgressStatus || child.attemptCount === 0) {
            included = false;
          }
        } else if (rollupAction === "completed" && requiredForCompleted === "ifNotSkipped" || rollupAction === "incomplete" && requiredForIncomplete === "ifNotSkipped") {
          if (child.wasSkipped) {
            included = false;
          }
        }
      }
      if (included && !child.isAvailable) {
        return false;
      }
      return included;
    }
    filterChildrenForRequirement(children, requirement, rollupType, mode, considerations) {
      return children.filter(child => this.shouldIncludeChildForRollup(child, requirement, rollupType, mode, considerations));
    }
    shouldIncludeChildForRollup(child, requirement, rollupType, mode, considerations) {
      if (!this.checkChildForRollupSubprocess(child, rollupType, mode)) {
        return false;
      }
      if (rollupType === "objective" && !considerations.measureSatisfactionIfActive && (child.activityAttemptActive || child.isActive)) {
        return false;
      }
      return true;
    }
    isChildSatisfiedForRollup(child) {
      if (child.objectiveSatisfiedStatus === true) {
        return true;
      }
      if (child.objectiveSatisfiedStatus === false) {
        return false;
      }
      if (child.successStatus === SuccessStatus.PASSED) {
        return true;
      }
      if (child.successStatus === SuccessStatus.FAILED) {
        return false;
      }
      return false;
    }
    isChildCompletedForRollup(child) {
      if (child.completionStatus === "completed" || child.isCompleted) {
        return true;
      }
      return false;
    }
    /**
     * Evaluate a rollup rule
     * @param {Activity} activity - The parent activity
     * @param {RollupRule} rule - The rule to evaluate
     * @return {boolean} - True if the rule applies
     */
    evaluateRollupRule(activity, rule) {
      const children = activity.getAvailableChildren();
      let contributingChildren = 0;
      let satisfiedCount = 0;
      for (const child of children) {
        let isIncluded = false;
        switch (rule.action) {
          case RollupActionType.SATISFIED:
            isIncluded = this.checkChildForRollupSubprocess(child, "objective", "satisfied");
            break;
          case RollupActionType.NOT_SATISFIED:
            isIncluded = this.checkChildForRollupSubprocess(child, "objective", "notSatisfied");
            break;
          case RollupActionType.COMPLETED:
            isIncluded = this.checkChildForRollupSubprocess(child, "progress", "completed");
            break;
          case RollupActionType.INCOMPLETE:
            isIncluded = this.checkChildForRollupSubprocess(child, "progress", "incomplete");
            break;
        }
        if (isIncluded) {
          contributingChildren++;
          if (this.evaluateRollupConditionsSubprocess(child, rule)) {
            satisfiedCount++;
          }
        }
      }
      if (rule.consideration === RollupConsiderationType.ALL) {
        return contributingChildren > 0 && satisfiedCount === contributingChildren;
      } else if (rule.minimumCount !== null) {
        return satisfiedCount >= rule.minimumCount;
      } else if (rule.minimumPercent !== null) {
        const percent = contributingChildren > 0 ? satisfiedCount / contributingChildren : 0;
        return percent >= rule.minimumPercent;
      }
      return contributingChildren > 0 && satisfiedCount === contributingChildren;
    }
    /**
     * Evaluate Rollup Conditions Subprocess
     * Evaluates if rollup rule conditions are met for a given activity
     * @spec SN Book: RB.1.4.1 (Evaluate Rollup Conditions Subprocess)
     * @param {Activity} child - The child activity to evaluate
     * @param {RollupRule} rule - The rollup rule containing conditions to evaluate
     * @return {boolean} - True if all conditions are met, false otherwise
     */
    evaluateRollupConditionsSubprocess(child, rule) {
      if (rule.conditions.length === 0) {
        return true;
      }
      switch (rule.consideration) {
        case RollupConsiderationType.ALL:
          return rule.conditions.every(condition => condition.evaluate(child));
        case RollupConsiderationType.ANY:
          return rule.conditions.some(condition => condition.evaluate(child));
        case RollupConsiderationType.NONE:
          return !rule.conditions.some(condition => condition.evaluate(child));
        case RollupConsiderationType.AT_LEAST_COUNT:
        case RollupConsiderationType.AT_LEAST_PERCENT:
          return rule.conditions.every(condition => condition.evaluate(child));
        default:
          return false;
      }
    }
    /**
     * Priority 5 Gap: Validate rollup state consistency across the activity tree
     * Ensures that rollup states are consistent and valid before processing
     * @param {Activity} rootActivity - The root activity to validate from
     * @return {boolean} - True if state is consistent, false otherwise
     */
    validateRollupStateConsistency(rootActivity) {
      try {
        this.eventCallback?.("rollup_validation_started", {
          activityId: rootActivity.id,
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
        const inconsistencies = [];
        this.validateActivityRollupState(rootActivity, inconsistencies);
        if (inconsistencies.length > 0) {
          this.eventCallback?.("rollup_state_inconsistencies", {
            activityId: rootActivity.id,
            inconsistencies,
            count: inconsistencies.length
          });
          return false;
        }
        this.eventCallback?.("rollup_validation_completed", {
          activityId: rootActivity.id,
          result: "consistent"
        });
        return true;
      } catch (error) {
        this.eventCallback?.("rollup_validation_error", {
          activityId: rootActivity.id,
          error: error instanceof Error ? error.message : String(error)
        });
        return false;
      }
    }
    /**
     * Priority 5 Gap: Process global objective mapping for shared objectives
     * Handles cross-activity objective synchronization and global state management
     *
     * IMPORTANT: Uses two-pass approach to ensure correct synchronization order:
     * 1. WRITE pass: All activities write their local state TO global objectives
     * 2. READ pass: All activities read FROM global objectives into local state
     *
     * This ensures that when activity A writes to a global and activity B reads from it,
     * B will see A's data regardless of tree traversal order.
     *
     * @param {Activity} activity - The root activity to start processing from
     * @param {Map<string, any>} globalObjectives - Global objective map
     */
    processGlobalObjectiveMapping(activity, globalObjectives) {
      try {
        this.eventCallback?.("global_objective_processing_started", {
          activityId: activity.id,
          globalObjectiveCount: globalObjectives.size
        });
        const allActivities = [];
        this.collectActivitiesRecursive(activity, allActivities);
        for (const act of allActivities) {
          this.syncGlobalObjectivesWritePhase(act, globalObjectives);
        }
        for (const act of allActivities) {
          this.syncGlobalObjectivesReadPhase(act, globalObjectives);
        }
        this.eventCallback?.("global_objective_processing_completed", {
          activityId: activity.id,
          processedObjectives: globalObjectives.size
        });
      } catch (error) {
        this.eventCallback?.("global_objective_processing_error", {
          activityId: activity.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    /**
     * Collect all activities in the tree recursively
     */
    collectActivitiesRecursive(activity, result) {
      result.push(activity);
      for (const child of activity.children) {
        this.collectActivitiesRecursive(child, result);
      }
    }
    /**
     * Write phase: Write local objective state TO global objectives
     */
    syncGlobalObjectivesWritePhase(activity, globalObjectives) {
      const objectives = activity.getAllObjectives();
      for (const objective of objectives) {
        const mapInfos = objective.mapInfo.length > 0 ? objective.mapInfo : [this.createDefaultMapInfo(objective)];
        for (const mapInfo of mapInfos) {
          const targetId = mapInfo.targetObjectiveID || objective.id;
          const globalObjective = this.ensureGlobalObjectiveEntry(globalObjectives, targetId, objective, mapInfo);
          if (mapInfo.writeSatisfiedStatus && objective.measureStatus && objective.isDirty("satisfiedStatus")) {
            globalObjective.satisfiedStatus = objective.satisfiedStatus;
            globalObjective.satisfiedStatusKnown = true;
            objective.clearDirty("satisfiedStatus");
          }
          if (mapInfo.writeNormalizedMeasure && objective.measureStatus && objective.isDirty("normalizedMeasure")) {
            globalObjective.normalizedMeasure = objective.normalizedMeasure;
            globalObjective.normalizedMeasureKnown = true;
            objective.clearDirty("normalizedMeasure");
            if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
              const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
              globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
              globalObjective.satisfiedStatusKnown = true;
              objective.clearDirty("satisfiedStatus");
            }
          }
          if (mapInfo.writeCompletionStatus && objective.completionStatus !== CompletionStatus.UNKNOWN && objective.isDirty("completionStatus")) {
            globalObjective.completionStatus = objective.completionStatus;
            globalObjective.completionStatusKnown = true;
            objective.clearDirty("completionStatus");
          }
          if (mapInfo.writeProgressMeasure && objective.progressMeasureStatus && objective.isDirty("progressMeasure")) {
            globalObjective.progressMeasure = objective.progressMeasure;
            globalObjective.progressMeasureKnown = true;
            objective.clearDirty("progressMeasure");
          }
          if (mapInfo.updateAttemptData) {
            this.updateActivityAttemptData(activity, globalObjective, objective);
          }
        }
      }
    }
    /**
     * Read phase: Read FROM global objectives into local state
     */
    syncGlobalObjectivesReadPhase(activity, globalObjectives) {
      const objectives = activity.getAllObjectives();
      for (const objective of objectives) {
        const mapInfos = objective.mapInfo.length > 0 ? objective.mapInfo : [this.createDefaultMapInfo(objective)];
        for (const mapInfo of mapInfos) {
          const targetId = mapInfo.targetObjectiveID || objective.id;
          const globalObjective = globalObjectives.get(targetId);
          if (!globalObjective) continue;
          const isPrimary = objective.isPrimary;
          if (mapInfo.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
            objective.satisfiedStatus = globalObjective.satisfiedStatus;
            objective.measureStatus = true;
          }
          if (mapInfo.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
            objective.normalizedMeasure = globalObjective.normalizedMeasure;
            objective.measureStatus = true;
            if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
              const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
              objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
            }
          }
          if (mapInfo.readProgressMeasure && globalObjective.progressMeasureKnown) {
            objective.progressMeasure = globalObjective.progressMeasure;
            objective.progressMeasureStatus = true;
          }
          if (mapInfo.readCompletionStatus && globalObjective.completionStatusKnown) {
            objective.completionStatus = globalObjective.completionStatus;
          }
          if (isPrimary) {
            objective.applyToActivity(activity);
          }
          this.eventCallback?.("objective_synchronized", {
            activityId: activity.id,
            objectiveId: objective.id,
            globalState: globalObjective,
            synchronizationTime: (/* @__PURE__ */new Date()).toISOString()
          });
        }
      }
    }
    /**
     * Priority 5 Gap: Handle complex objective weighting scenarios
     * Supports weighted rollup calculations with complex dependency chains
     * INTEGRATION: Now properly integrated into measureRollupProcess
     * @param {Activity} activity - The parent activity
     * @param {Activity[]} children - Child activities to weight
     * @return {number} - Calculated weighted measure
     */
    calculateComplexWeightedMeasure(activity, children, options) {
      let totalWeightedMeasure = 0;
      let totalWeight = 0;
      const weightingLog = [];
      const enableBias = options?.enableThresholdBias ?? true;
      for (const child of children) {
        if (!this.checkChildForRollupSubprocess(child, "measure")) {
          continue;
        }
        if (child.objectiveMeasureStatus && child.objectiveNormalizedMeasure !== null) {
          const baseWeight = child.sequencingControls.objectiveMeasureWeight;
          const adjustedWeight = this.calculateAdjustedWeight(child, baseWeight, enableBias);
          const contribution = child.objectiveNormalizedMeasure * adjustedWeight;
          totalWeightedMeasure += contribution;
          totalWeight += adjustedWeight;
          weightingLog.push({
            childId: child.id,
            measure: child.objectiveNormalizedMeasure,
            weight: adjustedWeight
          });
        }
      }
      this.eventCallback?.("complex_weighting_calculated", {
        activityId: activity.id,
        weightingDetails: weightingLog,
        totalWeight,
        totalWeightedMeasure,
        result: totalWeight > 0 ? totalWeightedMeasure / totalWeight : 0
      });
      return totalWeight > 0 ? totalWeightedMeasure / totalWeight : 0;
    }
    /**
     * Priority 5 Gap: Handle cross-cluster dependencies in rollup
     * Manages dependencies between activity clusters for accurate rollup
     * INTEGRATION: Now properly integrated into rollup process
     * @param {Activity} activity - The activity to process
     * @param {Activity[]} clusters - Related activity clusters
     */
    processCrossClusterDependencies(activity, clusters) {
      try {
        this.eventCallback?.("cross_cluster_processing_started", {
          activityId: activity.id,
          clusterCount: clusters.length
        });
        const dependencyMap = /* @__PURE__ */new Map();
        for (const cluster of clusters) {
          this.analyzeCrossClusterDependencies(cluster, dependencyMap);
        }
        const processOrder = this.resolveDependencyOrder(dependencyMap);
        for (const clusterId of processOrder) {
          const cluster = clusters.find(c => c.id === clusterId);
          if (cluster) {
            this.processClusterRollup(cluster);
          }
        }
        this.eventCallback?.("cross_cluster_processing_completed", {
          activityId: activity.id,
          processedClusters: processOrder.length,
          dependencyMap: Array.from(dependencyMap.entries())
        });
      } catch (error) {
        this.eventCallback?.("cross_cluster_processing_error", {
          activityId: activity.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    // Helper Methods for Priority 5 Gap Implementation
    /**
     * Validate rollup state for a single activity
     */
    validateActivityRollupState(activity, inconsistencies) {
      const activityId = activity.id;
      if (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure === null) {
        inconsistencies.push(`Activity ${activityId}: measure status true but normalized measure is null`);
      }
      if (activity.objectiveMeasureStatus && activity.scaledPassingScore !== null && activity.successStatus !== "unknown") {
        const expectedSatisfied = activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
        if (activity.objectiveSatisfiedStatus !== expectedSatisfied) {
          inconsistencies.push(`Activity ${activityId}: satisfaction status inconsistent with measure`);
        }
      }
      const controls = activity.sequencingControls;
      if (!controls.rollupObjectiveSatisfied && !controls.rollupProgressCompletion) {
        if (activity.children.length > 0) {
          if (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure !== 0) ;
        }
      }
      if (activity.requiredForSatisfied === "ifAttempted" && activity.attemptCount === 0) ;
      if (activity.requiredForSatisfied === "ifNotSuspended" && activity.isSuspended && activity.attemptCount > 0) ;
      if (activity.requiredForSatisfied === "ifNotSkipped" && activity.wasSkipped) ;
      const children = activity.getAvailableChildren();
      if (children.length > 0 && controls.rollupObjectiveSatisfied) {
        const satisfiedChildren = children.filter(child => this.checkChildForRollupSubprocess(child, "objective", "satisfied") && this.isChildSatisfiedForRollup(child));
        const notSatisfiedChildren = children.filter(child => this.checkChildForRollupSubprocess(child, "objective", "notSatisfied") && !this.isChildSatisfiedForRollup(child));
        if (satisfiedChildren.length > 0 && notSatisfiedChildren.length === 0) {
          if (activity.objectiveSatisfiedStatus === false && activity.rollupRules.rules.length === 0) {
            inconsistencies.push(`Activity ${activityId}: all children satisfied but parent is not satisfied (no rollup rules to override)`);
          }
        }
      }
      if (children.length > 0 && controls.rollupProgressCompletion) {
        const completedChildren = children.filter(child => this.checkChildForRollupSubprocess(child, "progress", "completed") && this.isChildCompletedForRollup(child));
        const incompleteChildren = children.filter(child => this.checkChildForRollupSubprocess(child, "progress", "incomplete") && !this.isChildCompletedForRollup(child));
        if (completedChildren.length > 0 && incompleteChildren.length === 0) {
          if (activity.completionStatus !== "completed" && activity.rollupRules.rules.length === 0) {
            inconsistencies.push(`Activity ${activityId}: all children completed but parent is incomplete (no rollup rules to override)`);
          }
        }
      }
      for (const child of children) {
        this.validateActivityRollupState(child, inconsistencies);
      }
      this.rollupStateLog.push({
        activity: activityId,
        timestamp: (/* @__PURE__ */new Date()).toISOString(),
        state: {
          measureStatus: activity.objectiveMeasureStatus,
          measure: activity.objectiveNormalizedMeasure,
          satisfiedStatus: activity.objectiveSatisfiedStatus,
          completionStatus: activity.completionStatus
        }
      });
    }
    /**
     * Synchronize global objectives with activity-specific objectives
     */
    synchronizeGlobalObjectives(activity, globalObjectives) {
      const objectives = activity.getAllObjectives();
      for (const objective of objectives) {
        const mapInfos = objective.mapInfo.length > 0 ? objective.mapInfo : [this.createDefaultMapInfo(objective)];
        for (const mapInfo of mapInfos) {
          const targetId = mapInfo.targetObjectiveID || objective.id;
          const globalObjective = this.ensureGlobalObjectiveEntry(globalObjectives, targetId, objective, mapInfo);
          this.syncObjectiveState(activity, objective, mapInfo, globalObjective);
        }
      }
    }
    /**
     * Calculate adjusted weight for complex weighting scenarios
     */
    calculateAdjustedWeight(child, baseWeight) {
      let enableBias = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      let adjustedWeight = baseWeight;
      if (child.completionStatus !== "completed") {
        adjustedWeight *= 0.8;
      }
      if (child.attemptCount > 1) {
        const attemptPenalty = Math.max(0.5, 1 - (child.attemptCount - 1) * 0.1);
        adjustedWeight *= attemptPenalty;
      }
      if (child.hasAttemptLimitExceeded()) {
        adjustedWeight *= 0.6;
      }
      if (enableBias && child.objectiveMeasureStatus) {
        const threshold = child.scaledPassingScore ?? 0.7;
        if (child.objectiveNormalizedMeasure >= threshold) {
          adjustedWeight *= 1.05;
        } else {
          adjustedWeight *= 0.95;
        }
      }
      return Math.max(0, adjustedWeight);
    }
    /**
     * Analyze cross-cluster dependencies
     */
    analyzeCrossClusterDependencies(cluster, dependencyMap) {
      const dependencies = [];
      cluster.sequencingRules;
      dependencyMap.set(cluster.id, dependencies);
    }
    /**
     * Resolve dependency processing order
     */
    resolveDependencyOrder(dependencyMap) {
      const resolved = [];
      const resolving = /* @__PURE__ */new Set();
      const resolve = id => {
        if (resolved.includes(id)) return;
        if (resolving.has(id)) {
          this.eventCallback?.("circular_dependency_detected", {
            activityId: id
          });
          return;
        }
        resolving.add(id);
        const dependencies = dependencyMap.get(id) || [];
        for (const depId of dependencies) {
          resolve(depId);
        }
        resolving.delete(id);
        resolved.push(id);
      };
      for (const id of Array.from(dependencyMap.keys())) {
        resolve(id);
      }
      return resolved;
    }
    /**
     * Process rollup for a specific cluster
     */
    processClusterRollup(cluster) {
      this.measureRollupProcess(cluster);
      if (cluster.sequencingControls.rollupObjectiveSatisfied) {
        this.objectiveRollupProcess(cluster);
      }
      if (cluster.sequencingControls.rollupProgressCompletion) {
        this.activityProgressRollupProcess(cluster);
      }
    }
    /**
     * Get activity objectives (implementation depends on objective model)
     */
    getActivityObjectives(activity) {
      return activity.getAllObjectives().map(objective => objective.id);
    }
    /**
     * Synchronize objective state between local and global according to SCORM 2004 specification
     */
    syncObjectiveState(activity, objective, mapInfo, globalObjective) {
      try {
        const isPrimary = objective.isPrimary;
        const localObjective = this.getLocalObjectiveState(activity, objective, isPrimary);
        if (mapInfo.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
          objective.satisfiedStatus = globalObjective.satisfiedStatus;
          objective.measureStatus = true;
        }
        if (mapInfo.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
          objective.normalizedMeasure = globalObjective.normalizedMeasure;
          objective.measureStatus = true;
          if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
            const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
            objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
          }
        }
        if (mapInfo.readProgressMeasure && globalObjective.progressMeasureKnown) {
          objective.progressMeasure = globalObjective.progressMeasure;
          objective.progressMeasureStatus = true;
        }
        if (mapInfo.readCompletionStatus && globalObjective.completionStatusKnown) {
          objective.completionStatus = globalObjective.completionStatus;
        }
        if (objective.isPrimary) {
          objective.applyToActivity(activity);
        }
        if (mapInfo.writeSatisfiedStatus && objective.measureStatus) {
          globalObjective.satisfiedStatus = objective.satisfiedStatus;
          globalObjective.satisfiedStatusKnown = true;
        }
        if (mapInfo.writeNormalizedMeasure && objective.measureStatus) {
          globalObjective.normalizedMeasure = objective.normalizedMeasure;
          globalObjective.normalizedMeasureKnown = true;
          if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
            const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
            globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
            globalObjective.satisfiedStatusKnown = true;
          }
        }
        if (mapInfo.writeCompletionStatus && objective.completionStatus !== CompletionStatus.UNKNOWN) {
          globalObjective.completionStatus = objective.completionStatus;
          globalObjective.completionStatusKnown = true;
        }
        if (mapInfo.writeProgressMeasure && objective.progressMeasureStatus) {
          globalObjective.progressMeasure = objective.progressMeasure;
          globalObjective.progressMeasureKnown = true;
        }
        if (mapInfo.updateAttemptData) {
          this.updateActivityAttemptData(activity, globalObjective, objective);
        }
        this.eventCallback?.("objective_synchronized", {
          activityId: activity.id,
          objectiveId: objective.id,
          localState: localObjective,
          globalState: globalObjective,
          synchronizationTime: (/* @__PURE__ */new Date()).toISOString()
        });
      } catch (error) {
        this.eventCallback?.("objective_sync_error", {
          activityId: activity.id,
          objectiveId: objective.id,
          error: error instanceof Error ? error.message : String(error),
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      }
    }
    /**
     * Update activity attempt data based on global objective state
     */
    updateActivityAttemptData(activity, globalObjective, objective) {
      try {
        if (!objective.isPrimary && !globalObjective.updateAttemptData) {
          return;
        }
        const hasCompletionRollupRules = activity.rollupRules.rules.some(rule => rule.action === "completed" || rule.action === "incomplete");
        if (globalObjective.satisfiedStatusKnown && globalObjective.satisfiedStatus) {
          if (!hasCompletionRollupRules && (activity.completionStatus === "unknown" || activity.completionStatus === "incomplete")) {
            activity.completionStatus = "completed";
          }
          if (activity.successStatus === "unknown") {
            activity.successStatus = "passed";
          }
        }
        if (globalObjective.attemptCount && globalObjective.attemptCount > activity.attemptCount) {
          activity.attemptCount = globalObjective.attemptCount;
        }
        if (globalObjective.progressMeasureKnown && globalObjective.progressMeasure !== void 0) {
          activity.attemptCompletionAmount = globalObjective.progressMeasure;
        }
        if (globalObjective.attemptAbsoluteDuration) {
          activity.attemptAbsoluteDuration = globalObjective.attemptAbsoluteDuration;
        }
        if (globalObjective.attemptExperiencedDuration) {
          activity.attemptExperiencedDuration = globalObjective.attemptExperiencedDuration;
        }
        if (globalObjective.activityAbsoluteDuration) {
          activity.activityAbsoluteDuration = globalObjective.activityAbsoluteDuration;
        }
        if (globalObjective.activityExperiencedDuration) {
          activity.activityExperiencedDuration = globalObjective.activityExperiencedDuration;
        }
        if (globalObjective.location !== void 0) {
          activity.location = globalObjective.location;
        }
        if (globalObjective.suspendData !== void 0) {
          activity.isSuspended = globalObjective.suspendData.length > 0;
        }
      } catch (error) {
        this.eventCallback?.("attempt_data_update_error", {
          activityId: activity.id,
          error: error instanceof Error ? error.message : String(error),
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      }
    }
    /**
     * Get local objective state
     */
    getLocalObjectiveState(activity, objective, isPrimary) {
      if (isPrimary) {
        return {
          id: objective.id,
          satisfiedStatus: activity.objectiveSatisfiedStatus,
          measureStatus: activity.objectiveMeasureStatus,
          normalizedMeasure: activity.objectiveNormalizedMeasure,
          progressMeasure: activity.progressMeasure,
          progressMeasureStatus: activity.progressMeasureStatus,
          completionStatus: activity.completionStatus,
          scaledPassingScore: activity.scaledPassingScore
        };
      }
      return {
        id: objective.id,
        satisfiedStatus: objective.satisfiedStatus,
        measureStatus: objective.measureStatus,
        normalizedMeasure: objective.normalizedMeasure,
        progressMeasure: objective.progressMeasure,
        progressMeasureStatus: objective.progressMeasureStatus,
        completionStatus: objective.completionStatus,
        scaledPassingScore: objective.minNormalizedMeasure
      };
    }
    ensureGlobalObjectiveEntry(globalObjectives, targetId, objective, mapInfo) {
      if (!globalObjectives.has(targetId)) {
        globalObjectives.set(targetId, {
          id: targetId,
          satisfiedStatus: objective.satisfiedStatus,
          satisfiedStatusKnown: objective.satisfiedStatusKnown,
          normalizedMeasure: objective.normalizedMeasure,
          normalizedMeasureKnown: objective.measureStatus,
          progressMeasure: objective.progressMeasure,
          progressMeasureKnown: objective.progressMeasureStatus,
          completionStatus: objective.completionStatus,
          completionStatusKnown: objective.completionStatus !== CompletionStatus.UNKNOWN,
          satisfiedByMeasure: objective.satisfiedByMeasure,
          minNormalizedMeasure: objective.minNormalizedMeasure
        });
      }
      return globalObjectives.get(targetId);
    }
    createDefaultMapInfo(objective) {
      return {
        targetObjectiveID: objective.id,
        readSatisfiedStatus: false,
        writeSatisfiedStatus: true,
        readNormalizedMeasure: false,
        writeNormalizedMeasure: true,
        readCompletionStatus: false,
        writeCompletionStatus: true,
        readProgressMeasure: false,
        writeProgressMeasure: true,
        updateAttemptData: objective.isPrimary
      };
    }
    /**
     * INTEGRATION: Identify Activity Clusters
     * Identifies clusters among child activities for cross-cluster dependency processing
     * @param {Activity[]} children - Child activities to analyze
     * @return {Activity[]} - Array of identified clusters
     */
    identifyActivityClusters(children) {
      const clusters = [];
      for (const child of children) {
        if (child.children.length > 0 && child.sequencingControls.flow) {
          clusters.push(child);
        }
      }
      return clusters;
    }
  }

  class ActivityTreeQueries {
    constructor(activityTree) {
      this.activityTree = activityTree;
    }
    /**
     * Check if activity is in the activity tree
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if activity is in the tree
     */
    isInTree(activity) {
      return this.activityTree.getAllActivities().includes(activity);
    }
    /**
     * Check if activity1 is a parent (ancestor) of activity2
     * Used for choiceExit validation to determine if target is within a subtree
     * @param {Activity} ancestor - Potential parent/ancestor activity
     * @param {Activity} descendant - Potential child/descendant activity
     * @return {boolean} - True if ancestor is an ancestor of descendant
     */
    isAncestorOf(ancestor, descendant) {
      let current = descendant;
      while (current) {
        if (current === ancestor) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }
    /**
     * Find common ancestor of two activities
     * @param {Activity | null} activity1 - First activity
     * @param {Activity | null} activity2 - Second activity
     * @return {Activity | null} - Common ancestor or null
     */
    findCommonAncestor(activity1, activity2) {
      if (!activity1 || !activity2) {
        return null;
      }
      const ancestors1 = [];
      let current = activity1;
      while (current) {
        ancestors1.push(current);
        current = current.parent;
      }
      current = activity2;
      while (current) {
        if (ancestors1.includes(current)) {
          return current;
        }
        current = current.parent;
      }
      return null;
    }
    /**
     * Find which child of ancestor is in the path to the target activity
     * Used for multi-level constraint validation
     * @param {Activity} ancestor - The ancestor activity
     * @param {Activity} target - The target activity
     * @return {Activity | null} - The child in the path, or null
     */
    findChildInPath(ancestor, target) {
      let current = target;
      while (current && current.parent) {
        if (current.parent === ancestor) {
          return current;
        }
        current = current.parent;
      }
      return null;
    }
    /**
     * Check if activity is the last activity in a forward preorder tree traversal
     * Per SB.2.1 step 3.1: An activity is last overall if it's a leaf with no next siblings
     * anywhere in its ancestor chain
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if this is the last activity in the tree
     */
    isLastInTree(activity) {
      if (activity.children.length > 0) {
        return false;
      }
      let current = activity;
      while (current) {
        if (this.activityTree.getNextSibling(current)) {
          return false;
        }
        current = current.parent;
      }
      return true;
    }
    /**
     * Find the currently active activity within a parent's children
     * @param {Activity} parent - The parent activity
     * @return {Activity | null} - The active child or null
     */
    getCurrentInParent(parent) {
      if (parent.children) {
        for (const child of parent.children) {
          if (child.isActive) {
            return child;
          }
        }
      }
      return null;
    }
    /**
     * Check if activity is mandatory (cannot be skipped)
     * In SCORM 2004, this is typically determined by sequencing rules
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if activity is mandatory
     */
    isMandatory(activity) {
      if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
        for (const rule of activity.sequencingRules.preConditionRules) {
          if (rule.action === "skip" && rule.conditions && rule.conditions.length === 0) {
            return false;
          }
        }
      }
      return activity.mandatory === true;
    }
    /**
     * Check if activity is completed
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if activity is completed
     */
    isCompleted(activity) {
      return activity.completionStatus === "completed" || activity.completionStatus === "passed" || activity.successStatus === "passed";
    }
    /**
     * Check if activity is available for choice according to SCORM 2004 rules
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if activity is available for choice
     */
    isAvailableForChoice(activity) {
      return activity.isVisible && !activity.isHiddenFromChoice && activity.isAvailable && (activity.sequencingControls ? activity.sequencingControls.choice : true);
    }
    /**
     * Get all ancestors of an activity from child to root
     * @param {Activity} activity - The activity to get ancestors for
     * @return {Activity[]} - Array of ancestors from immediate parent to root
     */
    getAncestors(activity) {
      const ancestors = [];
      let current = activity.parent;
      while (current) {
        ancestors.push(current);
        current = current.parent;
      }
      return ancestors;
    }
    /**
     * Get the path from an activity to the root
     * @param {Activity} activity - The activity
     * @return {Activity[]} - Array from the activity to root (inclusive)
     */
    getPathToRoot(activity) {
      const path = [activity];
      let current = activity.parent;
      while (current) {
        path.push(current);
        current = current.parent;
      }
      return path;
    }
    /**
     * Check if an activity is a leaf (has no children)
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if activity is a leaf
     */
    isLeaf(activity) {
      return activity.children.length === 0;
    }
    /**
     * Check if an activity is a cluster (has children)
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if activity is a cluster
     */
    isCluster(activity) {
      return activity.children.length > 0;
    }
    /**
     * Get the depth of an activity in the tree (root = 0)
     * @param {Activity} activity - Activity to get depth for
     * @return {number} - Depth in tree
     */
    getDepth(activity) {
      let depth = 0;
      let current = activity.parent;
      while (current) {
        depth++;
        current = current.parent;
      }
      return depth;
    }
  }

  class ChoiceConstraintValidator {
    constructor(activityTree, treeQueries) {
      this.activityTree = activityTree;
      this.treeQueries = treeQueries;
    }
    /**
     * Main entry point - consolidates ALL constraint validation for choice navigation
     * @param {Activity | null} currentActivity - Current activity (may be null if no session started)
     * @param {Activity} targetActivity - Target activity for the choice
     * @param {ChoiceValidationOptions} options - Validation options
     * @return {ConstraintValidationResult} - Validation result with exception if invalid
     */
    validateChoice(currentActivity, targetActivity) {
      let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!this.treeQueries.isInTree(targetActivity)) {
        return {
          valid: false,
          exception: "SB.2.9-2"
        };
      }
      if (targetActivity === this.activityTree.root) {
        return {
          valid: false,
          exception: "SB.2.9-3"
        };
      }
      const pathValidation = this.validatePathToRoot(targetActivity);
      if (!pathValidation.valid) {
        return pathValidation;
      }
      if (options.checkAvailability && !targetActivity.isAvailable) {
        return {
          valid: false,
          exception: "SB.2.9-7"
        };
      }
      if (!currentActivity) {
        return {
          valid: true,
          exception: null
        };
      }
      const choiceExitValidation = this.validateChoiceExit(currentActivity, targetActivity);
      if (!choiceExitValidation.valid) {
        return choiceExitValidation;
      }
      const ancestorValidation = this.validateAncestorConstraints(currentActivity, targetActivity);
      if (!ancestorValidation.valid) {
        return ancestorValidation;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Validate path to root - check hidden from choice and choice control
     * @param {Activity} targetActivity - Target activity
     * @return {ConstraintValidationResult} - Validation result
     */
    validatePathToRoot(targetActivity) {
      let activity = targetActivity;
      while (activity) {
        if (activity.isHiddenFromChoice) {
          return {
            valid: false,
            exception: "SB.2.9-4"
          };
        }
        if (activity.parent && !activity.parent.sequencingControls.choice) {
          return {
            valid: false,
            exception: "SB.2.9-5"
          };
        }
        if (activity.parent && activity.parent.sequencingControls.preventActivation) {
          if (targetActivity.attemptCount === 0 && !targetActivity.isActive) {
            return {
              valid: false,
              exception: "SB.2.9-6"
            };
          }
        }
        activity = activity.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Validate choiceExit constraint at all ancestor levels
     * Per SCORM spec: choiceExit only applies when we're actively IN that ancestor's subtree
     * @param {Activity} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity
     * @return {ConstraintValidationResult} - Validation result
     */
    validateChoiceExit(currentActivity, targetActivity) {
      let currentAncestor = currentActivity.parent;
      while (currentAncestor) {
        if (currentAncestor.isActive && !currentAncestor.sequencingControls.choiceExit) {
          if (!this.treeQueries.isAncestorOf(currentAncestor, targetActivity)) {
            return {
              valid: false,
              exception: "SB.2.9-8"
            };
          }
          break;
        }
        currentAncestor = currentAncestor.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Validate constraints at all ancestor levels
     * Checks forwardOnly, constrainChoice, preventActivation
     * @param {Activity} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity
     * @return {ConstraintValidationResult} - Validation result
     */
    validateAncestorConstraints(currentActivity, targetActivity) {
      let ancestorActivity = targetActivity.parent;
      while (ancestorActivity) {
        const validation = this.validateConstraintsAtLevel(ancestorActivity, currentActivity, targetActivity);
        if (!validation.valid) {
          return validation;
        }
        ancestorActivity = ancestorActivity.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Validate constraints at a specific ancestor level
     * @param {Activity} ancestor - The ancestor to check
     * @param {Activity} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity
     * @return {ConstraintValidationResult} - Validation result
     */
    validateConstraintsAtLevel(ancestor, currentActivity, targetActivity) {
      const targetChild = this.treeQueries.findChildInPath(ancestor, targetActivity);
      const currentChild = this.treeQueries.findChildInPath(ancestor, currentActivity);
      if (!targetChild || !currentChild) {
        return {
          valid: true,
          exception: null
        };
      }
      const siblings = ancestor.children;
      const targetIndex = siblings.indexOf(targetChild);
      const currentIndex = siblings.indexOf(currentChild);
      if (targetIndex === -1 || currentIndex === -1) {
        return {
          valid: true,
          exception: null
        };
      }
      if (ancestor.sequencingControls.forwardOnly && targetIndex < currentIndex) {
        return {
          valid: false,
          exception: "SB.2.9-5"
        };
      }
      if (targetIndex > currentIndex) {
        for (let i = currentIndex + 1; i < targetIndex; i++) {
          const intermediateChild = siblings[i];
          if (intermediateChild && this.treeQueries.isMandatory(intermediateChild) && !this.treeQueries.isCompleted(intermediateChild)) {
            return {
              valid: false,
              exception: "SB.2.9-6"
            };
          }
        }
      }
      if (ancestor.sequencingControls.constrainChoice) {
        if (targetIndex > currentIndex + 1) {
          return {
            valid: false,
            exception: "SB.2.9-7"
          };
        }
        if (targetIndex < currentIndex) {
          if (targetActivity.completionStatus !== "completed" && targetActivity.completionStatus !== "passed") {
            return {
              valid: false,
              exception: "SB.2.9-7"
            };
          }
        }
      }
      if (ancestor.sequencingControls.preventActivation) {
        if (targetActivity.attemptCount === 0 && !targetActivity.isActive) {
          return {
            valid: false,
            exception: "SB.2.9-6"
          };
        }
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Check forwardOnly violation at ALL ancestor levels
     * This is critical for Previous request validation
     * @param {Activity} fromActivity - The activity to check from
     * @return {ConstraintValidationResult} - Violation info or valid result
     */
    checkForwardOnlyViolation(fromActivity) {
      let current = fromActivity.parent;
      while (current) {
        if (current.sequencingControls.forwardOnly) {
          return {
            valid: false,
            exception: "SB.2.9-5"
          };
        }
        current = current.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Validate activity is available for choice navigation
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if available for choice
     */
    isAvailableForChoice(activity) {
      return this.treeQueries.isAvailableForChoice(activity);
    }
    /**
     * Validate choice flow constraints for flow tree traversal
     * @param {Activity} fromActivity - Activity to traverse from
     * @param {Activity[]} children - Available children
     * @return {{ valid: boolean; validChildren: Activity[] }} - Valid children that meet constraints
     */
    validateFlowConstraints(fromActivity, children) {
      const validChildren = [];
      for (const child of children) {
        if (this.meetsFlowConstraints(child, fromActivity)) {
          validChildren.push(child);
        }
      }
      return {
        valid: validChildren.length > 0,
        validChildren
      };
    }
    /**
     * Check if activity meets flow constraints
     * @param {Activity} activity - Activity to check
     * @param {Activity} parent - Parent activity
     * @return {boolean} - True if constraints are met
     */
    meetsFlowConstraints(activity, parent) {
      if (!activity.isAvailable || activity.isHiddenFromChoice) {
        return false;
      }
      if (parent.sequencingControls.constrainChoice) {
        return this.validateConstrainChoiceForFlow(activity, parent);
      }
      return true;
    }
    /**
     * Validate constrainChoice for flow scenarios
     * @param {Activity} activity - Activity to validate
     * @param {Activity} parent - Parent activity
     * @return {boolean} - True if valid
     */
    validateConstrainChoiceForFlow(activity, parent) {
      if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
        return true;
      }
      const children = parent.children;
      if (!children || children.length === 0) {
        return true;
      }
      const targetIndex = children.indexOf(activity);
      if (targetIndex === -1) {
        return false;
      }
      const currentActivity = this.treeQueries.getCurrentInParent(parent);
      if (!currentActivity) {
        return this.isAvailableForChoice(activity);
      }
      const currentIndex = children.indexOf(currentActivity);
      if (currentIndex === -1) {
        return true;
      }
      if (parent.sequencingControls.flow) {
        if (parent.sequencingControls.forwardOnly && targetIndex < currentIndex) {
          if (activity.completionStatus === "completed" || activity.completionStatus === "passed") {
            return true;
          }
          return false;
        }
        if (targetIndex >= currentIndex) {
          if (targetIndex === currentIndex || targetIndex === currentIndex + 1) {
            return this.isAvailableForChoice(activity);
          }
          return false;
        }
        if (targetIndex < currentIndex) {
          return (activity.completionStatus === "completed" || activity.completionStatus === "passed") && this.isAvailableForChoice(activity);
        }
        return false;
      } else {
        return this.isAvailableForChoice(activity) && (activity.completionStatus === "completed" || activity.completionStatus === "unknown" || activity.completionStatus === "incomplete");
      }
    }
    /**
     * Validate traversal constraints for choice navigation
     * @param {Activity} activity - Activity to validate
     * @return {{ canTraverse: boolean; canTraverseInto: boolean }} - Traversal permissions
     */
    validateTraversalConstraints(activity) {
      let canTraverse = true;
      let canTraverseInto = true;
      if (activity.parent?.sequencingControls.constrainChoice) {
        canTraverse = this.evaluateConstrainChoiceForTraversal(activity);
      }
      if (activity.sequencingControls && activity.sequencingControls.stopForwardTraversal) {
        canTraverseInto = false;
      }
      if (activity.parent?.sequencingControls.forwardOnly) {
        canTraverseInto = this.evaluateForwardOnlyForChoice(activity);
      }
      return {
        canTraverse,
        canTraverseInto
      };
    }
    /**
     * Evaluate constrainChoice for traversal
     * @param {Activity} activity - Activity to evaluate
     * @return {boolean} - True if traversal is allowed
     */
    evaluateConstrainChoiceForTraversal(activity) {
      if (!activity.parent) {
        return true;
      }
      let currentAncestor = activity.parent;
      while (currentAncestor) {
        if (currentAncestor.sequencingControls && currentAncestor.sequencingControls.constrainChoice) {
          const ancestorChildren = currentAncestor.children;
          const childInPath = this.treeQueries.findChildInPath(currentAncestor, activity);
          if (childInPath) {
            const childIndex = ancestorChildren.indexOf(childInPath);
            const currentAtLevel = this.treeQueries.getCurrentInParent(currentAncestor);
            if (currentAtLevel) {
              const currentIndex = ancestorChildren.indexOf(currentAtLevel);
              if (currentIndex !== -1 && childIndex !== -1) {
                if (currentIndex < childIndex) {
                  for (let i = currentIndex + 1; i < childIndex; i++) {
                    const intermediateActivity = ancestorChildren[i];
                    if (intermediateActivity && this.treeQueries.isMandatory(intermediateActivity) && !this.treeQueries.isCompleted(intermediateActivity)) {
                      return false;
                    }
                  }
                }
                if (currentAncestor.sequencingControls.forwardOnly && childIndex < currentIndex) {
                  if (!this.treeQueries.isCompleted(activity)) {
                    return false;
                  }
                }
              }
            }
          }
        }
        currentAncestor = currentAncestor.parent;
      }
      return this.isAvailableForChoice(activity);
    }
    /**
     * Evaluate forwardOnly for choice scenarios
     * @param {Activity} activity - Activity to evaluate
     * @return {boolean} - True if allowed
     */
    evaluateForwardOnlyForChoice(activity) {
      if (!activity.parent) {
        return true;
      }
      const parent = activity.parent;
      if (!parent.sequencingControls || !parent.sequencingControls.forwardOnly) {
        return true;
      }
      const siblings = parent.children;
      if (!siblings || siblings.length === 0) {
        return true;
      }
      const targetIndex = siblings.indexOf(activity);
      if (targetIndex === -1) {
        return false;
      }
      const currentActivity = this.treeQueries.getCurrentInParent(parent);
      if (!currentActivity) {
        return this.isAvailableForChoice(activity);
      }
      const currentIndex = siblings.indexOf(currentActivity);
      if (currentIndex === -1) {
        return true;
      }
      if (targetIndex < currentIndex) {
        if (activity.completionStatus === "completed" || activity.completionStatus === "passed") {
          if (activity.sequencingControls && activity.sequencingControls.choice) {
            return true;
          }
        }
        return false;
      }
      return this.isAvailableForChoice(activity);
    }
    /**
     * Check for time-based constraint boundary violations
     * @param {Activity} targetActivity - Target activity
     * @param {Date} now - Current time
     * @return {boolean} - True if there is a boundary violation
     */
    hasTimeBoundaryViolation(targetActivity, now) {
      if (targetActivity.beginTimeLimit) {
        try {
          const beginTime = new Date(targetActivity.beginTimeLimit);
          if (now < beginTime) {
            return true;
          }
        } catch {}
      }
      if (targetActivity.endTimeLimit) {
        try {
          const endTime = new Date(targetActivity.endTimeLimit);
          if (now > endTime) {
            return true;
          }
        } catch {}
      }
      return false;
    }
    /**
     * Check for attempt limit violations
     * @param {Activity} targetActivity - Target activity
     * @return {boolean} - True if attempt limit exceeded
     */
    hasAttemptLimitViolation(targetActivity) {
      return !!(targetActivity.attemptLimit && targetActivity.attemptCount >= targetActivity.attemptLimit);
    }
  }

  var SequencingRequestType = /* @__PURE__ */(SequencingRequestType2 => {
    SequencingRequestType2["START"] = "start";
    SequencingRequestType2["RESUME_ALL"] = "resumeAll";
    SequencingRequestType2["CONTINUE"] = "continue";
    SequencingRequestType2["PREVIOUS"] = "previous";
    SequencingRequestType2["CHOICE"] = "choice";
    SequencingRequestType2["JUMP"] = "jump";
    SequencingRequestType2["EXIT"] = "exit";
    SequencingRequestType2["EXIT_PARENT"] = "exitParent";
    SequencingRequestType2["EXIT_ALL"] = "exitAll";
    SequencingRequestType2["ABANDON"] = "abandon";
    SequencingRequestType2["ABANDON_ALL"] = "abandonAll";
    SequencingRequestType2["SUSPEND_ALL"] = "suspendAll";
    SequencingRequestType2["RETRY"] = "retry";
    SequencingRequestType2["RETRY_ALL"] = "retryAll";
    return SequencingRequestType2;
  })(SequencingRequestType || {});
  var DeliveryRequestType = /* @__PURE__ */(DeliveryRequestType2 => {
    DeliveryRequestType2["DELIVER"] = "deliver";
    DeliveryRequestType2["DO_NOT_DELIVER"] = "doNotDeliver";
    return DeliveryRequestType2;
  })(DeliveryRequestType || {});
  class SequencingResult {
    constructor() {
      let deliveryRequest = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "doNotDeliver";
      let targetActivity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let exception = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      let endSequencingSession = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.deliveryRequest = deliveryRequest;
      this.targetActivity = targetActivity;
      this.exception = exception;
      this.endSequencingSession = endSequencingSession;
    }
  }
  class FlowSubprocessResult {
    constructor(identifiedActivity, deliverable) {
      let exception = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      let endSequencingSession = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      this.identifiedActivity = identifiedActivity;
      this.deliverable = deliverable;
      this.exception = exception;
      this.endSequencingSession = endSequencingSession;
    }
  }
  class ChoiceTraversalResult {
    constructor(activity) {
      let exception = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.activity = activity;
      this.exception = exception;
    }
  }
  var FlowSubprocessMode = /* @__PURE__ */(FlowSubprocessMode2 => {
    FlowSubprocessMode2["FORWARD"] = "forward";
    FlowSubprocessMode2["BACKWARD"] = "backward";
    return FlowSubprocessMode2;
  })(FlowSubprocessMode || {});

  class RuleEvaluationEngine {
    constructor() {
      let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.now = options.now || (() => /* @__PURE__ */new Date());
      this.getAttemptElapsedSecondsHook = options.getAttemptElapsedSecondsHook || null;
    }
    /**
     * Sequencing Rules Check Process (UP.2)
     * General process for evaluating a set of sequencing rules
     * @param {Activity} activity - The activity to evaluate rules for
     * @param {SequencingRule[]} rules - The rules to evaluate
     * @return {RuleActionType | null} - The action to take, or null if no rules apply
     */
    checkSequencingRules(activity, rules) {
      for (const rule of rules) {
        if (this.checkRuleSubprocess(activity, rule)) {
          return rule.action;
        }
      }
      return null;
    }
    /**
     * Sequencing Rules Check Subprocess (UP.2.1)
     * Evaluates individual sequencing rule conditions
     * @param {Activity} activity - The activity to evaluate the rule for
     * @param {SequencingRule} rule - The rule to evaluate
     * @return {boolean} - True if all rule conditions are met
     */
    checkRuleSubprocess(activity, rule) {
      if (rule.conditions.length === 0) {
        return true;
      }
      const conditionCombination = rule.conditionCombination;
      if (conditionCombination === "all" || conditionCombination === RuleConditionOperator.AND) {
        return rule.conditions.every(condition => condition.evaluate(activity));
      } else if (conditionCombination === "any" || conditionCombination === RuleConditionOperator.OR) {
        return rule.conditions.some(condition => condition.evaluate(activity));
      }
      return false;
    }
    /**
     * Exit Action Rules Subprocess (TB.2.1)
     * Evaluates the exit condition rules for an activity
     * @param {Activity} activity - The activity to evaluate exit rules for
     * @return {RuleActionType | null} - The exit action to process, if any
     */
    evaluateExitRules(activity) {
      const exitAction = this.checkSequencingRules(activity, activity.sequencingRules.exitConditionRules);
      if (exitAction === RuleActionType.EXIT || exitAction === RuleActionType.EXIT_PARENT || exitAction === RuleActionType.EXIT_ALL) {
        return exitAction;
      }
      return null;
    }
    /**
     * Post Condition Rules Subprocess (TB.2.2)
     * Evaluates the post-condition rules for an activity after delivery
     * @param {Activity} activity - The activity to evaluate post-condition rules for
     * @return {RuleActionType | null} - The action to take, if any
     */
    evaluatePostConditionAction(activity) {
      const postAction = this.checkSequencingRules(activity, activity.sequencingRules.postConditionRules);
      const validActions = [RuleActionType.EXIT_PARENT, RuleActionType.EXIT_ALL, RuleActionType.RETRY, RuleActionType.RETRY_ALL, RuleActionType.CONTINUE, RuleActionType.PREVIOUS, RuleActionType.STOP_FORWARD_TRAVERSAL];
      if (postAction && validActions.includes(postAction)) {
        return postAction;
      }
      return null;
    }
    /**
     * Evaluate post-condition rules and map to sequencing/termination requests
     * @param {Activity} activity - The activity to evaluate
     * @return {PostConditionResult} - The post-condition result with sequencing and termination requests
     */
    evaluatePostConditions(activity) {
      const postAction = this.evaluatePostConditionAction(activity);
      if (!postAction) {
        return {
          sequencingRequest: null,
          terminationRequest: null
        };
      }
      switch (postAction) {
        case RuleActionType.EXIT_PARENT:
          return {
            sequencingRequest: null,
            terminationRequest: SequencingRequestType.EXIT_PARENT
          };
        case RuleActionType.EXIT_ALL:
          return {
            sequencingRequest: null,
            terminationRequest: SequencingRequestType.EXIT_ALL
          };
        case RuleActionType.RETRY:
          return {
            sequencingRequest: SequencingRequestType.RETRY,
            terminationRequest: null
          };
        case RuleActionType.RETRY_ALL:
          return {
            sequencingRequest: SequencingRequestType.RETRY,
            terminationRequest: SequencingRequestType.EXIT_ALL
          };
        case RuleActionType.CONTINUE:
          return {
            sequencingRequest: SequencingRequestType.CONTINUE,
            terminationRequest: null
          };
        case RuleActionType.PREVIOUS:
          return {
            sequencingRequest: SequencingRequestType.PREVIOUS,
            terminationRequest: null
          };
        case RuleActionType.STOP_FORWARD_TRAVERSAL:
          activity.sequencingControls.stopForwardTraversal = true;
          return {
            sequencingRequest: null,
            terminationRequest: null
          };
        default:
          return {
            sequencingRequest: null,
            terminationRequest: null
          };
      }
    }
    /**
     * Limit Conditions Check Process (UP.1)
     * Checks if an activity has exceeded its limit conditions
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if limit conditions are violated
     */
    checkLimitConditions(activity) {
      if (activity.attemptLimit !== null && activity.attemptCount >= activity.attemptLimit) {
        return true;
      }
      if (activity.attemptAbsoluteDurationLimit !== null) {
        const attemptLimitMs = this.parseDuration(activity.attemptAbsoluteDurationLimit);
        if (attemptLimitMs > 0) {
          const attemptDurationMs = this.parseDuration(activity.attemptExperiencedDuration);
          if (attemptDurationMs >= attemptLimitMs) {
            return true;
          }
        }
      }
      if (activity.activityAbsoluteDurationLimit !== null) {
        const activityLimitMs = this.parseDuration(activity.activityAbsoluteDurationLimit);
        if (activityLimitMs > 0) {
          const activityDurationMs = this.parseDuration(activity.activityExperiencedDuration);
          if (activityDurationMs >= activityLimitMs) {
            return true;
          }
        }
      }
      return false;
    }
    /**
     * Parse ISO 8601 duration to milliseconds
     * @param {string} duration - ISO 8601 duration string
     * @return {number} - Duration in milliseconds
     */
    parseDuration(duration) {
      if (!duration || typeof duration !== "string") {
        return 0;
      }
      const regex = /^P(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
      const matches = duration.match(regex);
      if (!matches || duration === "P" || duration.endsWith("T")) {
        return 0;
      }
      const years = parseFloat(matches[1] || "0");
      const months = parseFloat(matches[2] || "0");
      const weeks = parseFloat(matches[3] || "0");
      const days = parseFloat(matches[4] || "0");
      const hours = parseFloat(matches[5] || "0");
      const minutes = parseFloat(matches[6] || "0");
      const seconds = parseFloat(matches[7] || "0");
      let totalMs = 0;
      totalMs += years * 365.25 * 24 * 3600 * 1e3;
      totalMs += months * 30.44 * 24 * 3600 * 1e3;
      totalMs += weeks * 7 * 24 * 3600 * 1e3;
      totalMs += days * 24 * 3600 * 1e3;
      totalMs += hours * 3600 * 1e3;
      totalMs += minutes * 60 * 1e3;
      totalMs += seconds * 1e3;
      return totalMs;
    }
    /**
     * Get elapsed attempt seconds for an activity
     * @param {Activity} activity - The activity
     * @return {number} - Elapsed seconds
     */
    getElapsedSeconds(activity) {
      if (this.getAttemptElapsedSecondsHook) {
        try {
          return this.getAttemptElapsedSecondsHook(activity) || 0;
        } catch {
          return 0;
        }
      }
      if (activity.attemptAbsoluteStartTime) {
        const start = new Date(activity.attemptAbsoluteStartTime).getTime();
        const nowMs = this.now().getTime();
        if (!Number.isNaN(start) && nowMs > start) {
          return Math.max(0, (nowMs - start) / 1e3);
        }
      }
      return 0;
    }
    /**
     * Check if time limit has been exceeded
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if time limit exceeded
     */
    isTimeLimitExceeded(activity) {
      let limit = activity.timeLimitDuration;
      if (!limit && activity.attemptAbsoluteDurationLimit) {
        limit = activity.attemptAbsoluteDurationLimit;
      }
      if (!limit) {
        return false;
      }
      const limitSeconds = getDurationAsSeconds(limit, scorm2004_regex.CMITimespan);
      if (limitSeconds <= 0) {
        return false;
      }
      const elapsedSeconds = this.getElapsedSeconds(activity);
      return elapsedSeconds > limitSeconds;
    }
    /**
     * Check if activity is outside available time range
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if outside time range
     */
    isOutsideAvailableTimeRange(activity) {
      const now = this.now();
      if (activity.beginTimeLimit) {
        try {
          const beginDate = new Date(activity.beginTimeLimit);
          if (!Number.isNaN(beginDate.getTime()) && now < beginDate) {
            return true;
          }
        } catch {}
      }
      if (activity.endTimeLimit) {
        try {
          const endDate = new Date(activity.endTimeLimit);
          if (!Number.isNaN(endDate.getTime()) && now > endDate) {
            return true;
          }
        } catch {}
      }
      return false;
    }
    /**
     * Evaluate pre-condition rules and check if activity can be delivered
     * @param {Activity} activity - The activity to check
     * @return {{ canDeliver: boolean; wasSkipped: boolean }} - Delivery check result
     */
    canDeliverActivity(activity) {
      if (this.checkLimitConditions(activity)) {
        return {
          canDeliver: false,
          wasSkipped: false
        };
      }
      const preConditionResult = this.checkSequencingRules(activity, activity.sequencingRules.preConditionRules);
      const wasSkipped = preConditionResult === RuleActionType.SKIP;
      return {
        canDeliver: preConditionResult !== RuleActionType.SKIP && preConditionResult !== RuleActionType.DISABLED,
        wasSkipped
      };
    }
  }

  class SelectionRandomization {
    /**
     * Select Children Process (SR.1)
     * Selects a subset of child activities based on selection controls
     * @param {Activity} activity - The parent activity whose children need to be selected
     * @return {Activity[]} - The selected child activities
     */
    static selectChildrenProcess(activity) {
      const controls = activity.sequencingControls;
      const children = [...activity.children];
      if (controls.selectionTiming === SelectionTiming.NEVER) {
        return children;
      }
      if (controls.selectionTiming === SelectionTiming.ONCE && controls.selectionCountStatus) {
        return children;
      }
      if (controls.selectionTiming !== SelectionTiming.ONCE && !controls.selectionCountStatus) {
        return children;
      }
      const selectCount = controls.selectCount;
      if (selectCount === null || selectCount >= children.length) {
        if (controls.selectionTiming === SelectionTiming.ONCE) {
          controls.selectionCountStatus = true;
        }
        return children;
      }
      const selectedChildren = [];
      const availableIndices = children.map((_, index) => index);
      for (let i = 0; i < selectCount; i++) {
        if (availableIndices.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const childIndex = availableIndices[randomIndex];
        if (childIndex !== void 0 && children[childIndex]) {
          selectedChildren.push(children[childIndex]);
        }
        availableIndices.splice(randomIndex, 1);
      }
      if (controls.selectionTiming === SelectionTiming.ONCE) {
        controls.selectionCountStatus = true;
      }
      for (const child of children) {
        if (!selectedChildren.includes(child)) {
          child.isHiddenFromChoice = true;
          child.isAvailable = false;
        }
      }
      return selectedChildren;
    }
    /**
     * Randomize Children Process (SR.2)
     * Randomizes the order of child activities based on randomization controls
     * @param {Activity} activity - The parent activity whose children need to be randomized
     * @return {Activity[]} - The randomized child activities
     */
    static randomizeChildrenProcess(activity) {
      const controls = activity.sequencingControls;
      const children = [...activity.children];
      if (controls.randomizationTiming === RandomizationTiming.NEVER) {
        return children;
      }
      if (controls.randomizationTiming === RandomizationTiming.ONCE && controls.reorderChildren) {
        return children;
      }
      if (!controls.randomizeChildren) {
        return children;
      }
      const randomizedChildren = [...children];
      for (let i = randomizedChildren.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempI = randomizedChildren[i];
        const tempJ = randomizedChildren[j];
        if (tempI && tempJ) {
          randomizedChildren[i] = tempJ;
          randomizedChildren[j] = tempI;
        }
      }
      if (controls.randomizationTiming === RandomizationTiming.ONCE) {
        controls.reorderChildren = true;
      }
      activity.children.length = 0;
      activity.children.push(...randomizedChildren);
      return randomizedChildren;
    }
    /**
     * Apply selection and randomization to an activity
     * This combines both SR.1 and SR.2 processes
     * @param {Activity} activity - The parent activity
     * @param {boolean} isNewAttempt - Whether this is a new attempt on the activity
     * @return {Activity[]} - The processed child activities
     */
    static applySelectionAndRandomization(activity) {
      let isNewAttempt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const controls = activity.sequencingControls;
      if (!isNewAttempt && (activity.isActive || activity.isSuspended)) {
        return activity.children;
      }
      let shouldApplySelection = false;
      let shouldApplyRandomization = false;
      if (controls.selectionTiming === SelectionTiming.ON_EACH_NEW_ATTEMPT) {
        shouldApplySelection = isNewAttempt;
        if (isNewAttempt) {
          controls.selectionCountStatus = true;
        }
      } else if (controls.selectionTiming === SelectionTiming.ONCE) {
        shouldApplySelection = !controls.selectionCountStatus;
      }
      if (controls.randomizationTiming === RandomizationTiming.ON_EACH_NEW_ATTEMPT) {
        shouldApplyRandomization = isNewAttempt;
        if (isNewAttempt) {
          controls.reorderChildren = false;
        }
      } else if (controls.randomizationTiming === RandomizationTiming.ONCE) {
        shouldApplyRandomization = !controls.reorderChildren;
      }
      if (shouldApplySelection) {
        this.selectChildrenProcess(activity);
      }
      if (shouldApplyRandomization) {
        this.randomizeChildrenProcess(activity);
      }
      const processedChildren = activity.children.filter(child => child.isAvailable);
      activity.setProcessedChildren(processedChildren);
      return processedChildren;
    }
    /**
     * Check if selection is needed for an activity
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if selection is needed
     */
    static isSelectionNeeded(activity) {
      const controls = activity.sequencingControls;
      if (controls.selectionTiming === SelectionTiming.NEVER) {
        return false;
      }
      if (controls.selectionTiming === SelectionTiming.ONCE && controls.selectionCountStatus) {
        return false;
      }
      return controls.selectCount !== null && controls.selectCount < activity.children.length;
    }
    /**
     * Check if randomization is needed for an activity
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if randomization is needed
     */
    static isRandomizationNeeded(activity) {
      const controls = activity.sequencingControls;
      if (controls.randomizationTiming === RandomizationTiming.NEVER) {
        return false;
      }
      if (controls.randomizationTiming === RandomizationTiming.ONCE && controls.reorderChildren) {
        return false;
      }
      return controls.randomizeChildren;
    }
  }

  class FlowTraversalService {
    constructor(activityTree, ruleEngine) {
      this.activityTree = activityTree;
      this.ruleEngine = ruleEngine;
    }
    /**
     * Flow Subprocess (SB.2.3)
     * Traverses the activity tree in the specified direction to find a deliverable activity
     * @param {Activity} fromActivity - The activity to flow from
     * @param {FlowSubprocessMode} direction - The flow direction
     * @return {FlowSubprocessResult} - Result containing the deliverable activity
     */
    flowSubprocess(fromActivity, direction) {
      let candidateActivity = fromActivity;
      let firstIteration = true;
      let lastCandidateHadNoChildren = false;
      while (candidateActivity) {
        const traversalResult = this.flowTreeTraversalSubprocess(candidateActivity, direction, firstIteration);
        if (!traversalResult.activity) {
          let exceptionCode = null;
          if (traversalResult.exception) {
            exceptionCode = traversalResult.exception;
          } else if (direction === FlowSubprocessMode.BACKWARD) {
            exceptionCode = "SB.2.1-3";
          } else if (lastCandidateHadNoChildren) {
            exceptionCode = "SB.2.1-2";
          }
          return new FlowSubprocessResult(candidateActivity, false, exceptionCode, traversalResult.endSequencingSession);
        }
        lastCandidateHadNoChildren = traversalResult.activity.children.length > 0 && traversalResult.activity.getAvailableChildren().length === 0;
        const deliverable = this.flowActivityTraversalSubprocess(traversalResult.activity, direction === FlowSubprocessMode.FORWARD, true, direction);
        if (deliverable) {
          return new FlowSubprocessResult(deliverable, true, null, false);
        }
        candidateActivity = traversalResult.activity;
        firstIteration = false;
      }
      return new FlowSubprocessResult(null, false, null, false);
    }
    /**
     * Flow Tree Traversal Subprocess (SB.2.1)
     * Traverses the activity tree to find the next activity in the specified direction
     * @param {Activity} fromActivity - The activity to traverse from
     * @param {FlowSubprocessMode} direction - The traversal direction
     * @param {boolean} skipChildren - Whether to skip checking children
     * @return {FlowTreeTraversalResult} - The next activity and flags
     */
    flowTreeTraversalSubprocess(fromActivity, direction) {
      let skipChildren = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      if (direction === FlowSubprocessMode.FORWARD) {
        return this.traverseForward(fromActivity, skipChildren);
      } else {
        return this.traverseBackward(fromActivity);
      }
    }
    /**
     * Traverse forward in the activity tree
     * @param {Activity} fromActivity - Starting activity
     * @param {boolean} skipChildren - Whether to skip children
     * @return {FlowTreeTraversalResult}
     */
    traverseForward(fromActivity, skipChildren) {
      if (skipChildren && this.isActivityLastOverall(fromActivity)) {
        if (this.activityTree.root) {
          this.terminateDescendentAttempts(this.activityTree.root);
        }
        return {
          activity: null,
          endSequencingSession: true
        };
      }
      if (!skipChildren) {
        this.ensureSelectionAndRandomization(fromActivity);
        const children = fromActivity.getAvailableChildren();
        if (children.length > 0) {
          return {
            activity: children[0] || null,
            endSequencingSession: false
          };
        }
      }
      let current = fromActivity;
      while (current) {
        const nextSibling = this.activityTree.getNextSibling(current);
        if (nextSibling) {
          return {
            activity: nextSibling,
            endSequencingSession: false
          };
        }
        current = current.parent;
      }
      if (this.activityTree.root) {
        this.terminateDescendentAttempts(this.activityTree.root);
      }
      return {
        activity: null,
        endSequencingSession: true
      };
    }
    /**
     * Traverse backward in the activity tree
     * @param {Activity} fromActivity - Starting activity
     * @return {FlowTreeTraversalResult}
     */
    traverseBackward(fromActivity) {
      if (fromActivity.parent && fromActivity.parent.sequencingControls.forwardOnly) {
        return {
          activity: null,
          endSequencingSession: false,
          exception: "SB.2.1-4"
        };
      }
      const previousSibling = this.activityTree.getPreviousSibling(fromActivity);
      if (previousSibling) {
        return {
          activity: this.getLastDescendant(previousSibling),
          endSequencingSession: false
        };
      }
      let current = fromActivity;
      let ancestorIterations = 0;
      const maxIterations = 1e4;
      while (current && current.parent) {
        if (++ancestorIterations > maxIterations) {
          throw new Error("Infinite loop detected in backward traversal");
        }
        const parentPreviousSibling = this.activityTree.getPreviousSibling(current.parent);
        if (parentPreviousSibling) {
          return {
            activity: this.getLastDescendant(parentPreviousSibling),
            endSequencingSession: false
          };
        }
        current = current.parent;
      }
      return {
        activity: null,
        endSequencingSession: false
      };
    }
    /**
     * Get the last descendant of an activity
     * @param {Activity} activity - The activity
     * @return {Activity} - The last descendant
     */
    getLastDescendant(activity) {
      let lastDescendant = activity;
      let iterations = 0;
      const maxIterations = 1e4;
      while (true) {
        if (++iterations > maxIterations) {
          throw new Error("Infinite loop detected while getting last descendant");
        }
        this.ensureSelectionAndRandomization(lastDescendant);
        const children = lastDescendant.getAvailableChildren();
        if (children.length === 0) {
          break;
        }
        const lastChild = children[children.length - 1];
        if (!lastChild) break;
        lastDescendant = lastChild;
      }
      return lastDescendant;
    }
    /**
     * Flow Activity Traversal Subprocess (SB.2.2)
     * Checks if an activity can be delivered and flows into clusters if needed
     * @param {Activity} activity - The activity to check
     * @param {boolean} _direction - Direction (unused but part of spec)
     * @param {boolean} considerChildren - Whether to consider children
     * @param {FlowSubprocessMode} mode - The flow mode
     * @return {Activity | null} - The deliverable activity or null
     */
    flowActivityTraversalSubprocess(activity, _direction, considerChildren, mode) {
      const parent = activity.parent;
      if (parent && !parent.sequencingControls.flow) {
        return null;
      }
      if (!activity.isAvailable) {
        return null;
      }
      if (mode === FlowSubprocessMode.FORWARD && activity.sequencingControls.stopForwardTraversal) {
        return null;
      }
      if (considerChildren) {
        this.ensureSelectionAndRandomization(activity);
        const availableChildren = activity.getAvailableChildren();
        for (const child of availableChildren) {
          const deliverable = this.flowActivityTraversalSubprocess(child, mode === FlowSubprocessMode.FORWARD, true, mode);
          if (deliverable) {
            return deliverable;
          }
        }
      }
      if (activity.children.length === 0) {
        if (this.checkActivityProcess(activity)) {
          return activity;
        }
        return null;
      }
      return null;
    }
    /**
     * Check Activity Process (SB.2.3)
     * Validates if an activity can be delivered
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if activity can be delivered
     */
    checkActivityProcess(activity) {
      if (!activity.isAvailable) {
        return false;
      }
      if (activity.children.length === 0 && !activity.isVisible) {
        return false;
      }
      if (this.ruleEngine.checkLimitConditions(activity)) {
        return false;
      }
      const deliveryCheck = this.ruleEngine.canDeliverActivity(activity);
      activity.wasSkipped = deliveryCheck.wasSkipped;
      return deliveryCheck.canDeliver;
    }
    /**
     * Ensure selection and randomization is applied to an activity
     * @param {Activity} activity - The activity to process
     */
    ensureSelectionAndRandomization(activity) {
      if (activity.getAvailableChildren() === activity.children && (SelectionRandomization.isSelectionNeeded(activity) || SelectionRandomization.isRandomizationNeeded(activity))) {
        SelectionRandomization.applySelectionAndRandomization(activity, activity.isNewAttempt);
      }
    }
    /**
     * Check if activity is the last activity in the tree (forward preorder)
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if last in tree
     */
    isActivityLastOverall(activity) {
      if (activity.children.length > 0) {
        return false;
      }
      let current = activity;
      while (current) {
        if (this.activityTree.getNextSibling(current)) {
          return false;
        }
        current = current.parent;
      }
      return true;
    }
    /**
     * Terminate descendent attempts (simplified version)
     * Full version with exit rules is in SequencingProcess
     * @param {Activity} activity - The activity
     */
    terminateDescendentAttempts(activity) {
      activity.isActive = false;
      for (const child of activity.children) {
        this.terminateDescendentAttempts(child);
      }
    }
    /**
     * Find the first deliverable activity from a cluster
     * Used for START and RETRY_ALL requests
     * @param {Activity} cluster - The cluster activity
     * @return {Activity | null} - The first deliverable activity
     */
    findFirstDeliverableActivity(cluster) {
      if (cluster.children.length === 0) {
        if (this.checkActivityProcess(cluster)) {
          return cluster;
        }
        return null;
      }
      this.ensureSelectionAndRandomization(cluster);
      const availableChildren = cluster.getAvailableChildren();
      for (const child of availableChildren) {
        const deliverable = this.flowActivityTraversalSubprocess(child, true, true, FlowSubprocessMode.FORWARD);
        if (deliverable) {
          return deliverable;
        }
      }
      return null;
    }
    /**
     * Can activity be delivered (public wrapper)
     * @param {Activity} activity - The activity
     * @return {boolean} - True if can be delivered
     */
    canDeliver(activity) {
      return this.checkActivityProcess(activity);
    }
  }

  class FlowRequestHandler {
    constructor(activityTree, traversalService) {
      this.activityTree = activityTree;
      this.traversalService = traversalService;
    }
    /**
     * Start Sequencing Request Process (SB.2.5)
     * Initiates a new sequencing session from the root
     * @return {SequencingResult}
     */
    handleStart() {
      const result = new SequencingResult();
      if (!this.activityTree.root) {
        result.exception = "SB.2.5-1";
        return result;
      }
      if (this.activityTree.currentActivity) {
        result.exception = "SB.2.5-2";
        return result;
      }
      const deliverableActivity = this.traversalService.findFirstDeliverableActivity(this.activityTree.root);
      if (!deliverableActivity) {
        result.exception = "SB.2.5-3";
        return result;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = deliverableActivity;
      return result;
    }
    /**
     * Resume All Sequencing Request Process (SB.2.6)
     * Resumes a suspended sequencing session
     * @return {SequencingResult}
     */
    handleResumeAll() {
      const result = new SequencingResult();
      if (!this.activityTree.suspendedActivity) {
        result.exception = "SB.2.6-1";
        return result;
      }
      if (this.activityTree.currentActivity) {
        result.exception = "SB.2.6-2";
        return result;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = this.activityTree.suspendedActivity;
      return result;
    }
    /**
     * Continue Sequencing Request Process (SB.2.7)
     * Navigates to the next activity in forward flow
     * @param {Activity} currentActivity - The current activity
     * @return {SequencingResult}
     */
    handleContinue(currentActivity) {
      const result = new SequencingResult();
      if (currentActivity.isActive) {
        result.exception = "SB.2.7-1";
        return result;
      }
      if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
        result.exception = "SB.2.7-2";
        return result;
      }
      const flowResult = this.traversalService.flowSubprocess(currentActivity, FlowSubprocessMode.FORWARD);
      result.endSequencingSession = flowResult.endSequencingSession;
      if (!flowResult.deliverable || !flowResult.identifiedActivity) {
        result.exception = flowResult.exception || "SB.2.7-2";
        return result;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = flowResult.identifiedActivity;
      return result;
    }
    /**
     * Previous Sequencing Request Process (SB.2.8)
     * Navigates to the previous activity in backward flow
     * @param {Activity} currentActivity - The current activity
     * @return {SequencingResult}
     */
    handlePrevious(currentActivity) {
      const result = new SequencingResult();
      if (currentActivity.isActive) {
        result.exception = "SB.2.8-1";
        return result;
      }
      if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
        result.exception = "SB.2.8-2";
        return result;
      }
      const forwardOnlyViolation = this.checkForwardOnlyViolation(currentActivity);
      if (forwardOnlyViolation) {
        result.exception = forwardOnlyViolation;
        return result;
      }
      const flowResult = this.traversalService.flowSubprocess(currentActivity, FlowSubprocessMode.BACKWARD);
      if (!flowResult.deliverable || !flowResult.identifiedActivity) {
        result.exception = flowResult.exception || "SB.2.8-3";
        return result;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = flowResult.identifiedActivity;
      return result;
    }
    /**
     * Check forwardOnly violation at all ancestor levels
     * @param {Activity} activity - The activity to check
     * @return {string | null} - Exception code or null
     */
    checkForwardOnlyViolation(activity) {
      let current = activity.parent;
      while (current) {
        if (current.sequencingControls.forwardOnly) {
          return "SB.2.9-5";
        }
        current = current.parent;
      }
      return null;
    }
  }

  class ChoiceRequestHandler {
    constructor(activityTree, constraintValidator, traversalService, treeQueries) {
      this.activityTree = activityTree;
      this.constraintValidator = constraintValidator;
      this.traversalService = traversalService;
      this.treeQueries = treeQueries;
    }
    /**
     * Choice Sequencing Request Process (SB.2.9)
     * Processes a choice navigation request to a specific activity
     * @param {string} targetActivityId - The target activity ID
     * @param {Activity | null} currentActivity - Current activity (may be null)
     * @return {SequencingResult}
     */
    handleChoice(targetActivityId, currentActivity) {
      const result = new SequencingResult();
      const targetActivity = this.activityTree.getActivity(targetActivityId);
      if (!targetActivity) {
        result.exception = "SB.2.9-1";
        return result;
      }
      if (currentActivity && currentActivity.isActive) {
        result.exception = "SB.2.9-6";
        return result;
      }
      const validation = this.constraintValidator.validateChoice(currentActivity, targetActivity, {
        checkAvailability: true
      });
      if (!validation.valid) {
        result.exception = validation.exception;
        return result;
      }
      const commonAncestor = this.treeQueries.findCommonAncestor(currentActivity, targetActivity);
      if (currentActivity) {
        this.terminateDescendentAttemptsProcess(commonAncestor || this.activityTree.root);
      }
      const activityPath = this.buildActivityPath(targetActivity, commonAncestor);
      for (const pathActivity of activityPath) {
        if (!this.traversalService.checkActivityProcess(pathActivity)) {
          return result;
        }
      }
      let deliveryTarget = targetActivity;
      if (targetActivity.children.length > 0) {
        const flowResult = this.choiceFlowSubprocess(targetActivity);
        if (!flowResult) {
          result.exception = "SB.2.9-7";
          return result;
        }
        deliveryTarget = flowResult;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = deliveryTarget;
      return result;
    }
    /**
     * Jump Sequencing Request Process (SB.2.13)
     * Processes a jump navigation request (SCORM 2004 4th Edition)
     * Jump bypasses most sequencing rules
     * @param {string} targetActivityId - The target activity ID
     * @return {SequencingResult}
     */
    handleJump(targetActivityId) {
      const result = new SequencingResult();
      const targetActivity = this.activityTree.getActivity(targetActivityId);
      if (!targetActivity) {
        result.exception = "SB.2.13-1";
        return result;
      }
      if (!this.treeQueries.isInTree(targetActivity)) {
        result.exception = "SB.2.13-2";
        return result;
      }
      if (!targetActivity.isAvailable) {
        result.exception = "SB.2.13-3";
        return result;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = targetActivity;
      return result;
    }
    /**
     * Get all activities available for choice navigation
     * @return {Activity[]} - Array of available activities
     */
    getAvailableChoices() {
      const allActivities = this.activityTree.getAllActivities();
      const currentActivity = this.activityTree.currentActivity;
      const availableActivities = [];
      for (const activity of allActivities) {
        if (activity === this.activityTree.root) {
          continue;
        }
        if (activity.isHiddenFromChoice || !activity.isAvailable || !activity.isVisible) {
          continue;
        }
        if (activity.parent && !activity.parent.sequencingControls.choice) {
          continue;
        }
        const validation = this.constraintValidator.validateChoice(currentActivity, activity);
        if (validation.valid) {
          availableActivities.push(activity);
        }
      }
      return availableActivities;
    }
    /**
     * Build the activity path from target to common ancestor
     * @param {Activity} targetActivity - Target activity
     * @param {Activity | null} commonAncestor - Common ancestor
     * @return {Activity[]} - Path of activities
     */
    buildActivityPath(targetActivity, commonAncestor) {
      const activityPath = [];
      let activity = targetActivity;
      while (activity && activity !== commonAncestor) {
        activityPath.unshift(activity);
        activity = activity.parent;
      }
      return activityPath;
    }
    /**
     * Choice Flow Subprocess (SB.2.9.1)
     * Handles the flow logic specific to choice navigation requests
     * @param {Activity} targetActivity - The target activity for the choice
     * @return {Activity | null} - The activity to deliver, or null if flow fails
     */
    choiceFlowSubprocess(targetActivity) {
      if (targetActivity.children.length === 0) {
        return targetActivity;
      }
      return this.choiceFlowTreeTraversal(targetActivity);
    }
    /**
     * Choice Flow Tree Traversal (SB.2.9.2)
     * Traverses into a cluster to find a deliverable leaf
     * @param {Activity} fromActivity - The cluster to traverse from
     * @return {Activity | null} - A leaf activity for delivery, or null
     */
    choiceFlowTreeTraversal(fromActivity) {
      this.traversalService.ensureSelectionAndRandomization(fromActivity);
      const children = fromActivity.getAvailableChildren();
      const validChildren = this.constraintValidator.validateFlowConstraints(fromActivity, children);
      if (!validChildren.valid) {
        return null;
      }
      for (const child of validChildren.validChildren) {
        const traversalResult = this.enhancedChoiceTraversal(child);
        if (traversalResult.activity) {
          return traversalResult.activity;
        }
      }
      return null;
    }
    /**
     * Enhanced Choice Activity Traversal (SB.2.4)
     * Traverses with stopForwardTraversal and forwardOnly checks
     * @param {Activity} activity - The activity to traverse
     * @param {boolean} isBackwardTraversal - Whether this is backward traversal
     * @return {ChoiceTraversalResult} - Result with activity or exception
     */
    enhancedChoiceTraversal(activity) {
      let isBackwardTraversal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (isBackwardTraversal && activity === this.activityTree.root) {
        return new ChoiceTraversalResult(null, "SB.2.4-3");
      }
      if (!activity.isAvailable) {
        return new ChoiceTraversalResult(null, null);
      }
      if (activity.isHiddenFromChoice) {
        return new ChoiceTraversalResult(null, null);
      }
      if (activity.sequencingControls && activity.sequencingControls.stopForwardTraversal) {
        return new ChoiceTraversalResult(null, "SB.2.4-1");
      }
      const traversalValidation = this.constraintValidator.validateTraversalConstraints(activity);
      if (!traversalValidation.canTraverse) {
        return new ChoiceTraversalResult(null, null);
      }
      if (activity.children.length === 0) {
        if (this.traversalService.checkActivityProcess(activity)) {
          return new ChoiceTraversalResult(activity, null);
        }
        return new ChoiceTraversalResult(null, null);
      }
      if (activity.parent?.sequencingControls.constrainChoice && !traversalValidation.canTraverseInto) {
        return new ChoiceTraversalResult(null, "SB.2.4-2");
      }
      if (traversalValidation.canTraverseInto) {
        const flowResult = this.choiceFlowTreeTraversal(activity);
        return new ChoiceTraversalResult(flowResult, null);
      }
      return new ChoiceTraversalResult(null, null);
    }
    /**
     * Terminate descendent attempts (simplified)
     * @param {Activity} activity - The activity
     */
    terminateDescendentAttemptsProcess(activity) {
      activity.isActive = false;
      for (const child of activity.children) {
        this.terminateDescendentAttemptsProcess(child);
      }
    }
  }

  class ExitRequestHandler {
    constructor(activityTree, ruleEngine) {
      this.activityTree = activityTree;
      this.ruleEngine = ruleEngine;
    }
    /**
     * Exit Sequencing Request Process (SB.2.11)
     * @param {Activity} currentActivity - The current activity
     * @return {SequencingResult}
     */
    handleExit(currentActivity) {
      const result = new SequencingResult();
      if (!currentActivity.parent) {
        result.exception = "SB.2.11-1";
        return result;
      }
      if (!currentActivity.parent.sequencingControls.choiceExit) {
        result.exception = "SB.2.11-2";
        return result;
      }
      this.terminateDescendentAttempts(currentActivity);
      return result;
    }
    /**
     * Exit All Sequencing Request Process
     * @return {SequencingResult}
     */
    handleExitAll() {
      const result = new SequencingResult();
      if (this.activityTree.root) {
        this.terminateDescendentAttempts(this.activityTree.root);
      }
      return result;
    }
    /**
     * Abandon Sequencing Request Process
     * @param {Activity} currentActivity - The current activity
     * @return {SequencingResult}
     */
    handleAbandon(currentActivity) {
      const result = new SequencingResult();
      currentActivity.isActive = false;
      this.activityTree.currentActivity = currentActivity.parent;
      return result;
    }
    /**
     * Abandon All Sequencing Request Process
     * @return {SequencingResult}
     */
    handleAbandonAll() {
      const result = new SequencingResult();
      this.activityTree.currentActivity = null;
      return result;
    }
    /**
     * Suspend All Sequencing Request Process (SB.2.15)
     * @param {Activity} currentActivity - The current activity
     * @return {SequencingResult}
     */
    handleSuspendAll(currentActivity) {
      const result = new SequencingResult();
      if (currentActivity === this.activityTree.root) {
        result.exception = "SB.2.15-1";
        return result;
      }
      currentActivity.isSuspended = true;
      this.activityTree.suspendedActivity = currentActivity;
      this.activityTree.currentActivity = null;
      return result;
    }
    /**
     * Terminate descendent attempts with exit rule evaluation
     * @param {Activity} activity - The activity
     * @param {boolean} skipExitRules - Whether to skip exit rules
     */
    terminateDescendentAttempts(activity) {
      let skipExitRules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      let exitAction = null;
      if (!skipExitRules) {
        exitAction = this.ruleEngine.evaluateExitRules(activity);
      }
      activity.isActive = false;
      for (const child of activity.children) {
        this.terminateDescendentAttempts(child, skipExitRules);
      }
      if (exitAction && !skipExitRules) {
        this.processDeferredExitAction(exitAction, activity);
      }
    }
    /**
     * Process deferred exit action
     * @param {RuleActionType} exitAction - The exit action
     * @param {Activity} activity - The activity
     */
    processDeferredExitAction(exitAction, activity) {
      switch (exitAction) {
        case RuleActionType.EXIT:
          break;
        case RuleActionType.EXIT_PARENT:
          if (activity.parent && activity.parent.isActive) {
            this.terminateDescendentAttempts(activity.parent, true);
          }
          break;
        case RuleActionType.EXIT_ALL:
          if (this.activityTree.root && this.activityTree.root !== activity) {
            const allActivities = this.activityTree.getAllActivities();
            const anyActive = allActivities.some(a => a.isActive);
            if (anyActive) {
              this.terminateDescendentAttempts(this.activityTree.root, true);
            }
          }
          break;
      }
    }
  }

  class RetryRequestHandler {
    constructor(activityTree, traversalService) {
      this.activityTree = activityTree;
      this.traversalService = traversalService;
    }
    /**
     * Retry Sequencing Request Process (SB.2.10)
     * @param {Activity} currentActivity - The current activity
     * @return {SequencingResult}
     */
    handleRetry(currentActivity) {
      const result = new SequencingResult();
      if (currentActivity.isActive || currentActivity.isSuspended) {
        result.exception = "SB.2.10-2";
        return result;
      }
      if (currentActivity.children.length > 0) {
        this.traversalService.ensureSelectionAndRandomization(currentActivity);
        const availableChildren = currentActivity.getAvailableChildren();
        let deliverableActivity = null;
        for (const child of availableChildren) {
          deliverableActivity = this.traversalService.flowActivityTraversalSubprocess(child, true, true, FlowSubprocessMode.FORWARD);
          if (deliverableActivity) {
            break;
          }
        }
        if (!deliverableActivity) {
          result.exception = "SB.2.10-3";
          return result;
        }
        result.deliveryRequest = DeliveryRequestType.DELIVER;
        result.targetActivity = deliverableActivity;
        return result;
      }
      this.terminateDescendentAttempts(currentActivity);
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = currentActivity;
      return result;
    }
    /**
     * Retry All Sequencing Request Process
     * Clears current activity and restarts from the root
     * @return {SequencingResult}
     */
    handleRetryAll() {
      this.activityTree.currentActivity = null;
      if (!this.activityTree.root) {
        const result2 = new SequencingResult();
        result2.exception = "SB.2.10-1";
        return result2;
      }
      const deliverableActivity = this.traversalService.findFirstDeliverableActivity(this.activityTree.root);
      const result = new SequencingResult();
      if (!deliverableActivity) {
        result.exception = "SB.2.10-3";
        return result;
      }
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = deliverableActivity;
      return result;
    }
    /**
     * Terminate descendent attempts (simplified)
     * @param {Activity} activity - The activity
     */
    terminateDescendentAttempts(activity) {
      activity.isActive = false;
      for (const child of activity.children) {
        this.terminateDescendentAttempts(child);
      }
    }
  }

  class SequencingProcess {
    /**
     * Get/set the current time function (used for testing time-dependent logic)
     */
    get now() {
      return this._now;
    }
    set now(fn) {
      this._now = fn;
      RuleCondition.setNowProvider(fn);
      this.ruleEngine = new RuleEvaluationEngine({
        now: fn,
        getAttemptElapsedSecondsHook: this._getAttemptElapsedSecondsHook
      });
      this.traversalService = new FlowTraversalService(this.activityTree, this.ruleEngine);
      this.flowHandler = new FlowRequestHandler(this.activityTree, this.traversalService);
      this.choiceHandler = new ChoiceRequestHandler(this.activityTree, this.constraintValidator, this.traversalService, this.treeQueries);
      this.retryHandler = new RetryRequestHandler(this.activityTree, this.traversalService);
    }
    /**
     * Get/set the elapsed seconds hook (used for time-based rules)
     */
    get getAttemptElapsedSecondsHook() {
      return this._getAttemptElapsedSecondsHook;
    }
    set getAttemptElapsedSecondsHook(fn) {
      this._getAttemptElapsedSecondsHook = fn;
      RuleCondition.setElapsedSecondsHook(fn);
      this.ruleEngine = new RuleEvaluationEngine({
        now: this._now,
        getAttemptElapsedSecondsHook: fn
      });
      this.traversalService = new FlowTraversalService(this.activityTree, this.ruleEngine);
      this.flowHandler = new FlowRequestHandler(this.activityTree, this.traversalService);
      this.choiceHandler = new ChoiceRequestHandler(this.activityTree, this.constraintValidator, this.traversalService, this.treeQueries);
      this.retryHandler = new RetryRequestHandler(this.activityTree, this.traversalService);
    }
    constructor(activityTree, _sequencingRules, _sequencingControls) {
      let options = arguments.length > 4 ? arguments[4] : undefined;
      this.activityTree = activityTree;
      this._now = options?.now || (() => /* @__PURE__ */new Date());
      this._getAttemptElapsedSecondsHook = options?.getAttemptElapsedSeconds;
      this.treeQueries = new ActivityTreeQueries(activityTree);
      this.ruleEngine = new RuleEvaluationEngine({
        now: this._now,
        getAttemptElapsedSecondsHook: this._getAttemptElapsedSecondsHook
      });
      this.constraintValidator = new ChoiceConstraintValidator(activityTree, this.treeQueries);
      this.traversalService = new FlowTraversalService(activityTree, this.ruleEngine);
      this.flowHandler = new FlowRequestHandler(activityTree, this.traversalService);
      this.choiceHandler = new ChoiceRequestHandler(activityTree, this.constraintValidator, this.traversalService, this.treeQueries);
      this.exitHandler = new ExitRequestHandler(activityTree, this.ruleEngine);
      this.retryHandler = new RetryRequestHandler(activityTree, this.traversalService);
    }
    /**
     * Main Sequencing Request Process (SB.2.12)
     * This is the main entry point for all navigation requests
     * @param {SequencingRequestType} request - The sequencing request
     * @param {string | null} targetActivityId - Target activity ID (for CHOICE and JUMP)
     * @return {SequencingResult}
     */
    sequencingRequestProcess(request) {
      let targetActivityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      const currentActivity = this.activityTree.currentActivity;
      switch (request) {
        case SequencingRequestType.START:
          return this.flowHandler.handleStart();
        case SequencingRequestType.RESUME_ALL:
          return this.flowHandler.handleResumeAll();
        case SequencingRequestType.CONTINUE:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.flowHandler.handleContinue(currentActivity);
        case SequencingRequestType.PREVIOUS:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.flowHandler.handlePrevious(currentActivity);
        case SequencingRequestType.CHOICE:
          if (!targetActivityId) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-5");
          }
          return this.choiceHandler.handleChoice(targetActivityId, currentActivity);
        case SequencingRequestType.JUMP:
          if (!targetActivityId) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-5");
          }
          return this.choiceHandler.handleJump(targetActivityId);
        case SequencingRequestType.EXIT:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.exitHandler.handleExit(currentActivity);
        case SequencingRequestType.EXIT_ALL:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.exitHandler.handleExitAll();
        case SequencingRequestType.ABANDON:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.exitHandler.handleAbandon(currentActivity);
        case SequencingRequestType.ABANDON_ALL:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.exitHandler.handleAbandonAll();
        case SequencingRequestType.SUSPEND_ALL:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.exitHandler.handleSuspendAll(currentActivity);
        case SequencingRequestType.RETRY:
          if (!currentActivity) {
            return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
          }
          return this.retryHandler.handleRetry(currentActivity);
        case SequencingRequestType.RETRY_ALL:
          return this.retryHandler.handleRetryAll();
        default:
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-6");
      }
    }
    /**
     * Evaluate post-condition rules for the current activity
     * @param {Activity} activity - The activity to evaluate
     * @return {PostConditionResult} - The post-condition result
     */
    evaluatePostConditionRules(activity) {
      return this.ruleEngine.evaluatePostConditions(activity);
    }
    /**
     * Check if an activity can be delivered
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if the activity can be delivered
     */
    canActivityBeDelivered(activity) {
      return this.traversalService.canDeliver(activity);
    }
    /**
     * Validate navigation request before expensive operations
     * @param {SequencingRequestType} request - The navigation request
     * @param {string | null} targetActivityId - Target activity ID
     * @param {Activity | null} currentActivity - Current activity
     * @return {{valid: boolean, exception: string | null}} - Validation result
     */
    validateNavigationRequest(request) {
      let targetActivityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let currentActivity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      const validRequestTypes = Object.values(SequencingRequestType);
      if (!validRequestTypes.includes(request)) {
        return {
          valid: false,
          exception: "SB.2.12-6"
        };
      }
      switch (request) {
        case SequencingRequestType.CONTINUE:
        case SequencingRequestType.PREVIOUS:
          {
            if (!currentActivity) {
              return {
                valid: false,
                exception: "SB.2.12-1"
              };
            }
            if (currentActivity.isActive) {
              return {
                valid: false,
                exception: request === SequencingRequestType.CONTINUE ? "SB.2.7-1" : "SB.2.8-1"
              };
            }
            if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
              return {
                valid: false,
                exception: request === SequencingRequestType.CONTINUE ? "SB.2.7-2" : "SB.2.8-2"
              };
            }
            if (request === SequencingRequestType.PREVIOUS) {
              const forwardOnlyViolation = this.constraintValidator.checkForwardOnlyViolation(currentActivity);
              if (!forwardOnlyViolation.valid) {
                return forwardOnlyViolation;
              }
            }
            break;
          }
        case SequencingRequestType.CHOICE:
          {
            if (!targetActivityId) {
              return {
                valid: false,
                exception: "SB.2.12-5"
              };
            }
            const targetActivity = this.activityTree.getActivity(targetActivityId);
            if (!targetActivity) {
              return {
                valid: false,
                exception: "SB.2.9-1"
              };
            }
            const choiceValidation = this.constraintValidator.validateChoice(currentActivity, targetActivity, {
              checkAvailability: true
            });
            if (!choiceValidation.valid) {
              return choiceValidation;
            }
            if (!this.traversalService.canDeliver(targetActivity)) {
              return {
                valid: false,
                exception: "SB.2.9-6"
              };
            }
            const preConditionResult = this.ruleEngine.checkSequencingRules(targetActivity, targetActivity.sequencingRules.preConditionRules);
            if (preConditionResult === RuleActionType.HIDE_FROM_CHOICE) {
              return {
                valid: false,
                exception: "SB.2.9-4"
              };
            }
            break;
          }
        case SequencingRequestType.JUMP:
          {
            if (!targetActivityId) {
              return {
                valid: false,
                exception: "SB.2.12-5"
              };
            }
            const jumpTarget = this.activityTree.getActivity(targetActivityId);
            if (!jumpTarget) {
              return {
                valid: false,
                exception: "SB.2.13-1"
              };
            }
            break;
          }
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Get all available activities that can be selected via choice navigation
     * @return {Activity[]} - Array of activities available for choice
     */
    getAvailableChoices() {
      return this.choiceHandler.getAvailableChoices();
    }
    // Expose services for advanced use cases
    getTreeQueries() {
      return this.treeQueries;
    }
    getConstraintValidator() {
      return this.constraintValidator;
    }
    getRuleEngine() {
      return this.ruleEngine;
    }
    getTraversalService() {
      return this.traversalService;
    }
  }

  class NavigationLookAhead {
    constructor(activityTree, sequencingProcess) {
      this.cache = null;
      this.isDirty = true;
      this.activityTree = activityTree;
      this.sequencingProcess = sequencingProcess;
    }
    /**
     * Predict if Continue navigation would succeed from current activity
     * @return {boolean} - True if Continue would succeed, false otherwise
     */
    predictContinueEnabled() {
      this.ensureCacheValid();
      return this.cache?.continueEnabled ?? false;
    }
    /**
     * Predict if Previous navigation would succeed from current activity
     * @return {boolean} - True if Previous would succeed, false otherwise
     */
    predictPreviousEnabled() {
      this.ensureCacheValid();
      return this.cache?.previousEnabled ?? false;
    }
    /**
     * Predict if choice to specific activity would succeed
     * @param {string} activityId - Target activity ID
     * @return {boolean} - True if choice would succeed, false otherwise
     */
    predictChoiceEnabled(activityId) {
      this.ensureCacheValid();
      return this.cache?.choiceEnabledMap.get(activityId) ?? false;
    }
    /**
     * Get list of all activity IDs that can be chosen
     * @return {string[]} - Array of activity IDs that can be chosen
     */
    getAvailableChoices() {
      this.ensureCacheValid();
      return Array.from(this.cache?.availableChoices ?? []);
    }
    /**
     * Get all navigation predictions at once
     * @return {NavigationPredictions} - Navigation predictions object
     */
    getAllPredictions() {
      this.ensureCacheValid();
      return {
        continueEnabled: this.cache?.continueEnabled ?? false,
        previousEnabled: this.cache?.previousEnabled ?? false,
        availableChoices: Array.from(this.cache?.availableChoices ?? [])
      };
    }
    /**
     * Invalidate the cache to force recalculation on next access
     * Should be called after:
     * - Activity change
     * - Rollup process
     * - Objective changes
     * - Attempt changes
     */
    invalidateCache() {
      this.isDirty = true;
    }
    /**
     * Force immediate cache update (useful for testing)
     */
    updateCache() {
      this.isDirty = true;
      this.ensureCacheValid();
    }
    /**
     * Ensure cache is valid, recalculating if needed
     * @private
     */
    ensureCacheValid() {
      const currentTreeHash = this.calculateTreeStateHash();
      if (this.isDirty || !this.cache || this.cache.treeStateHash !== currentTreeHash) {
        this.recalculateCache(currentTreeHash);
        this.isDirty = false;
      }
    }
    /**
     * Recalculate all navigation predictions
     * @param {string} treeStateHash - Current tree state hash
     * @private
     */
    recalculateCache(treeStateHash) {
      const currentActivity = this.activityTree.currentActivity;
      this.cache = {
        continueEnabled: false,
        previousEnabled: false,
        availableChoices: /* @__PURE__ */new Set(),
        choiceEnabledMap: /* @__PURE__ */new Map(),
        treeStateHash
      };
      if (!currentActivity) {
        this.calculateAvailableChoicesFromRoot();
        return;
      }
      this.cache.continueEnabled = this.predictContinueInternal(currentActivity);
      this.cache.previousEnabled = this.predictPreviousInternal(currentActivity);
      this.calculateAvailableChoices();
    }
    /**
     * Predict if Continue would succeed from the given activity
     * @param {Activity} currentActivity - Current activity
     * @return {boolean} - True if Continue would succeed
     * @private
     */
    predictContinueInternal(currentActivity) {
      if (!currentActivity.parent) {
        return false;
      }
      if (!currentActivity.parent.sequencingControls.flow) {
        return false;
      }
      return this.hasAvailableNextActivity(currentActivity);
    }
    /**
     * Check if there's an available next activity in flow
     * @param {Activity} currentActivity - Current activity
     * @return {boolean} - True if next activity exists
     * @private
     */
    hasAvailableNextActivity(currentActivity) {
      const parent = currentActivity.parent;
      if (!parent) {
        return false;
      }
      const siblings = parent.children;
      const currentIndex = siblings.indexOf(currentActivity);
      if (currentIndex === -1) {
        return false;
      }
      if (currentIndex < siblings.length - 1) {
        for (let i = currentIndex + 1; i < siblings.length; i++) {
          const sibling = siblings[i];
          if (sibling && this.isActivityPotentiallyDeliverableForward(sibling)) {
            return true;
          }
        }
      }
      if (parent.parent && parent.sequencingControls.flow) {
        return this.hasAvailableNextActivity(parent);
      }
      return false;
    }
    /**
     * Predict if Previous would succeed from the given activity
     * @param {Activity} currentActivity - Current activity
     * @return {boolean} - True if Previous would succeed
     * @private
     */
    predictPreviousInternal(currentActivity) {
      if (!currentActivity.parent) {
        return false;
      }
      if (!currentActivity.parent.sequencingControls.flow) {
        return false;
      }
      if (currentActivity.parent.sequencingControls.forwardOnly) {
        return false;
      }
      return this.hasAvailablePreviousActivity(currentActivity);
    }
    /**
     * Check if there's an available previous activity in flow
     * @param {Activity} currentActivity - Current activity
     * @return {boolean} - True if previous activity exists
     * @private
     */
    hasAvailablePreviousActivity(currentActivity) {
      const parent = currentActivity.parent;
      if (!parent) {
        return false;
      }
      const siblings = parent.children;
      const currentIndex = siblings.indexOf(currentActivity);
      if (currentIndex === -1) {
        return false;
      }
      if (currentIndex > 0) {
        for (let i = currentIndex - 1; i >= 0; i--) {
          const sibling = siblings[i];
          if (sibling && this.isActivityPotentiallyDeliverableBackward(sibling)) {
            return true;
          }
        }
      }
      if (parent.parent && parent.sequencingControls.flow && !parent.sequencingControls.forwardOnly) {
        return this.hasAvailablePreviousActivity(parent);
      }
      return false;
    }
    /**
     * Calculate available choices from root (when no current activity)
     * @private
     */
    calculateAvailableChoicesFromRoot() {
      if (!this.cache || !this.activityTree.root) {
        return;
      }
    }
    /**
     * Calculate all available choices in the tree
     * @private
     */
    calculateAvailableChoices() {
      if (!this.cache || !this.activityTree.root) {
        return;
      }
      const root = this.activityTree.root;
      this.recursivelyCheckChoiceAvailability(root);
    }
    /**
     * Recursively check choice availability for activity and its descendants
     * @param {Activity} activity - Activity to check
     * @private
     */
    recursivelyCheckChoiceAvailability(activity) {
      if (!this.cache) {
        return;
      }
      const currentActivity = this.activityTree.currentActivity;
      const validation = this.sequencingProcess.validateNavigationRequest(SequencingRequestType.CHOICE, activity.id, currentActivity);
      const isChoiceEnabled = validation.valid;
      this.cache.choiceEnabledMap.set(activity.id, isChoiceEnabled);
      if (isChoiceEnabled) {
        this.cache.availableChoices.add(activity.id);
      }
      if (activity.children) {
        for (const child of activity.children) {
          this.recursivelyCheckChoiceAvailability(child);
        }
      }
    }
    /**
     * Check if activity is potentially deliverable for forward navigation (Continue)
     * This properly evaluates preConditionRules to determine if the activity can be delivered
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if potentially deliverable
     * @private
     */
    isActivityPotentiallyDeliverableForward(activity) {
      if (activity.isHiddenFromChoice || !activity.isAvailable) {
        return false;
      }
      if (activity.children.length === 0) {
        if (!activity.isVisible) {
          return false;
        }
        return this.sequencingProcess.canActivityBeDelivered(activity);
      }
      for (const child of activity.children) {
        if (this.isActivityPotentiallyDeliverableForward(child)) {
          return true;
        }
      }
      return false;
    }
    /**
     * Check if activity is potentially deliverable for backward navigation (Previous)
     * This uses a simpler check that doesn't fully evaluate preConditionRules
     * since we're typically going back to a previously visited activity
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if potentially deliverable
     * @private
     */
    isActivityPotentiallyDeliverableBackward(activity) {
      if (activity.isHiddenFromChoice || !activity.isAvailable) {
        return false;
      }
      if (activity.children.length === 0) {
        return activity.isVisible;
      }
      for (const child of activity.children) {
        if (this.isActivityPotentiallyDeliverableBackward(child)) {
          return true;
        }
      }
      return false;
    }
    /**
     * Calculate a hash of the tree state for cache invalidation
     * @return {string} - Hash representing current tree state
     * @private
     */
    calculateTreeStateHash() {
      const currentActivity = this.activityTree.currentActivity;
      const suspendedActivity = this.activityTree.suspendedActivity;
      const parts = [currentActivity?.id ?? "none", suspendedActivity?.id ?? "none", this.getActivityTreeStateSignature()];
      return parts.join("|");
    }
    /**
     * Get a signature of the activity tree state
     * @return {string} - Signature of tree state
     * @private
     */
    getActivityTreeStateSignature() {
      if (!this.activityTree.root) {
        return "empty";
      }
      const signatures = [];
      this.collectActivitySignatures(this.activityTree.root, signatures);
      return signatures.join(":");
    }
    /**
     * Recursively collect activity signatures
     * @param {Activity} activity - Activity to process
     * @param {string[]} signatures - Array to collect signatures
     * @private
     */
    collectActivitySignatures(activity, signatures) {
      const sig = [activity.id, activity.isActive ? "A" : "-", activity.isSuspended ? "S" : "-", activity.completionStatus, activity.successStatus, activity.attemptCount.toString()].join("");
      signatures.push(sig);
      if (activity.children) {
        for (const child of activity.children) {
          this.collectActivitySignatures(child, signatures);
        }
      }
    }
  }

  var NavigationRequestType = /* @__PURE__ */(NavigationRequestType2 => {
    NavigationRequestType2["START"] = "start";
    NavigationRequestType2["RESUME_ALL"] = "resumeAll";
    NavigationRequestType2["CONTINUE"] = "continue";
    NavigationRequestType2["PREVIOUS"] = "previous";
    NavigationRequestType2["CHOICE"] = "choice";
    NavigationRequestType2["JUMP"] = "jump";
    NavigationRequestType2["EXIT"] = "exit";
    NavigationRequestType2["EXIT_ALL"] = "exitAll";
    NavigationRequestType2["ABANDON"] = "abandon";
    NavigationRequestType2["ABANDON_ALL"] = "abandonAll";
    NavigationRequestType2["SUSPEND_ALL"] = "suspendAll";
    NavigationRequestType2["NOT_VALID"] = "_none_";
    return NavigationRequestType2;
  })(NavigationRequestType || {});
  class NavigationRequestResult {
    constructor() {
      let valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      let terminationRequest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let sequencingRequest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      let targetActivityId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      let exception = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      this.valid = valid;
      this.terminationRequest = terminationRequest;
      this.sequencingRequest = sequencingRequest;
      this.targetActivityId = targetActivityId;
      this.exception = exception;
    }
  }
  class DeliveryRequest {
    constructor() {
      let valid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      let targetActivity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let exception = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.valid = valid;
      this.targetActivity = targetActivity;
      this.exception = exception;
    }
  }
  const _OverallSequencingProcess = class _OverallSequencingProcess {
    constructor(activityTree, sequencingProcess, rollupProcess) {
      let adlNav = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      let eventCallback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      let options = arguments.length > 5 ? arguments[5] : undefined;
      this.contentDelivered = false;
      this._deliveryInProgress = false;
      // Tracks when we're in contentDeliveryEnvironmentProcess
      this.eventCallback = null;
      this.globalObjectiveMap = /* @__PURE__ */new Map();
      this.getCMIData = null;
      this.is4thEdition = false;
      this.activityTree = activityTree;
      this.sequencingProcess = sequencingProcess;
      this.rollupProcess = rollupProcess;
      this.adlNav = adlNav;
      this.eventCallback = eventCallback;
      this.now = options?.now || (() => /* @__PURE__ */new Date());
      this.enhancedDeliveryValidation = options?.enhancedDeliveryValidation === true;
      this.defaultHideLmsUi = options?.defaultHideLmsUi ? [...options.defaultHideLmsUi] : [];
      this.defaultAuxiliaryResources = options?.defaultAuxiliaryResources ? options.defaultAuxiliaryResources.map(resource => ({
        ...resource
      })) : [];
      this.getCMIData = options?.getCMIData || null;
      this.is4thEdition = options?.is4thEdition || false;
      this.initializeGlobalObjectiveMap();
      this.navigationLookAhead = new NavigationLookAhead(this.activityTree, this.sequencingProcess);
    }
    /**
     * Overall Sequencing Process
     * Main entry point for processing navigation requests
     * @spec SN Book: OP.1 (Overall Sequencing Process)
     * @param {NavigationRequestType} navigationRequest - The navigation request
     * @param {string | null} targetActivityId - Target activity for choice/jump requests
     * @param {string} exitType - The cmi.exit value (logout, normal, suspend, time-out, or empty)
     * @return {DeliveryRequest} - The delivery request result
     */
    processNavigationRequest(navigationRequest) {
      let targetActivityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      let exitType = arguments.length > 2 ? arguments[2] : undefined;
      const navResult = this.navigationRequestProcess(navigationRequest, targetActivityId);
      if (!navResult.valid) {
        return new DeliveryRequest(false, null, navResult.exception);
      }
      if (navResult.terminationRequest) {
        const hadSequencingRequest = !!navResult.sequencingRequest;
        const termResult = this.terminationRequestProcess(navResult.terminationRequest, hadSequencingRequest, exitType);
        if (!termResult.valid) {
          return new DeliveryRequest(false, null, termResult.exception || "TB.2.3-1");
        }
        if (termResult.sequencingRequest !== null) {
          if (hadSequencingRequest || termResult.sequencingRequest !== SequencingRequestType.EXIT) {
            navResult.sequencingRequest = termResult.sequencingRequest;
          }
        }
        if (!navResult.sequencingRequest) {
          if (navResult.terminationRequest === SequencingRequestType.EXIT_ALL || navResult.terminationRequest === SequencingRequestType.ABANDON_ALL) {
            this.fireEvent("onSequencingSessionEnd", {
              reason: navResult.terminationRequest === SequencingRequestType.EXIT_ALL ? "exit_all" : "abandon_all",
              navigationRequest
            });
          }
          return new DeliveryRequest(true, null);
        }
      }
      if (navResult.sequencingRequest) {
        const seqResult = this.sequencingProcess.sequencingRequestProcess(navResult.sequencingRequest, navResult.targetActivityId);
        if (seqResult.endSequencingSession) {
          this.fireEvent("onSequencingSessionEnd", {
            reason: "end_of_content",
            exception: seqResult.exception,
            navigationRequest
          });
          return new DeliveryRequest(false, null, seqResult.exception || "SESSION_ENDED");
        }
        if (seqResult.exception) {
          return new DeliveryRequest(false, null, seqResult.exception);
        }
        if (seqResult.deliveryRequest === DeliveryRequestType.DELIVER && seqResult.targetActivity) {
          if (this.activityTree.root) {
            const isConsistent = this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
            if (!isConsistent) {
              this.fireEvent("onSequencingDebug", {
                message: "Rollup state inconsistency detected before delivery",
                activityId: this.activityTree.root.id
              });
            }
          }
          this.rollupProcess.processGlobalObjectiveMapping(seqResult.targetActivity, this.globalObjectiveMap);
          const deliveryResult = this.deliveryRequestProcess(seqResult.targetActivity);
          if (deliveryResult.valid) {
            this.contentDeliveryEnvironmentProcess(deliveryResult.targetActivity);
            this.navigationLookAhead.invalidateCache();
            if (this.activityTree.root) {
              this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
            }
            return deliveryResult;
          }
          return deliveryResult;
        }
      }
      return new DeliveryRequest(false, null, "OP.1-1");
    }
    /**
     * Navigation Request Process
     * Validates navigation requests and converts them to termination/sequencing requests
     * @spec SN Book: NB.2.1 (Navigation Request Process)
     * @param {NavigationRequestType} request - The navigation request
     * @param {string | null} targetActivityId - Target activity for choice/jump
     * @return {NavigationRequestResult} - The validation result
     */
    navigationRequestProcess(request) {
      let targetActivityId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.fireEvent("onNavigationRequestProcessing", {
        request,
        targetActivityId
      });
      const currentActivity = this.activityTree.currentActivity;
      switch (request) {
        case "start" /* START */:
          if (currentActivity !== null) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-1");
          }
          return new NavigationRequestResult(true, null, SequencingRequestType.START, null);
        case "resumeAll" /* RESUME_ALL */:
          if (currentActivity !== null) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-2");
          }
          if (this.activityTree.suspendedActivity === null) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-3");
          }
          return new NavigationRequestResult(true, null, SequencingRequestType.RESUME_ALL, null);
        case "continue" /* CONTINUE */:
          {
            if (!currentActivity) {
              return new NavigationRequestResult(false, null, null, null, "NB.2.1-4");
            }
            if (!currentActivity.parent || !currentActivity.parent.sequencingControls.flow) {
              return new NavigationRequestResult(false, null, null, null, "NB.2.1-5");
            }
            const continueTerminationRequest = currentActivity.isActive ? SequencingRequestType.EXIT : null;
            return new NavigationRequestResult(true, continueTerminationRequest, SequencingRequestType.CONTINUE, null);
          }
        case "previous" /* PREVIOUS */:
          {
            if (!currentActivity) {
              return new NavigationRequestResult(false, null, null, null, "NB.2.1-6");
            }
            if (!currentActivity.parent || !currentActivity.parent.sequencingControls.flow) {
              return new NavigationRequestResult(false, null, null, null, "NB.2.1-7");
            }
            const forwardOnlyValidation = this.validateForwardOnlyConstraints(currentActivity);
            if (!forwardOnlyValidation.valid) {
              return new NavigationRequestResult(false, null, null, null, forwardOnlyValidation.exception);
            }
            const previousTerminationRequest = currentActivity.isActive ? SequencingRequestType.EXIT : null;
            return new NavigationRequestResult(true, previousTerminationRequest, SequencingRequestType.PREVIOUS, null);
          }
        case "choice" /* CHOICE */:
          {
            if (!targetActivityId) {
              return new NavigationRequestResult(false, null, null, null, "NB.2.1-9");
            }
            const targetActivity = this.activityTree.getActivity(targetActivityId);
            if (!targetActivity) {
              return new NavigationRequestResult(false, null, null, null, "NB.2.1-10");
            }
            const choiceValidation = this.validateComplexChoicePath(currentActivity, targetActivity);
            if (!choiceValidation.valid) {
              return new NavigationRequestResult(false, null, null, null, choiceValidation.exception);
            }
            return new NavigationRequestResult(true, currentActivity?.isActive ? SequencingRequestType.EXIT : null, SequencingRequestType.CHOICE, targetActivityId);
          }
        case "jump" /* JUMP */:
          if (!targetActivityId) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-12");
          }
          return new NavigationRequestResult(true, null, SequencingRequestType.JUMP, targetActivityId);
        case "exit" /* EXIT */:
          if (!currentActivity) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-13");
          }
          if (currentActivity === this.activityTree.root) {
            return new NavigationRequestResult(true, SequencingRequestType.EXIT_ALL, null, null);
          }
          return new NavigationRequestResult(true, SequencingRequestType.EXIT, null, null);
        case "exitAll" /* EXIT_ALL */:
          if (!currentActivity) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-14");
          }
          return new NavigationRequestResult(true, SequencingRequestType.EXIT_ALL, null, null);
        case "abandon" /* ABANDON */:
          if (!currentActivity) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-15");
          }
          return new NavigationRequestResult(true, SequencingRequestType.ABANDON, null, null);
        case "abandonAll" /* ABANDON_ALL */:
          if (!currentActivity) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-16");
          }
          return new NavigationRequestResult(true, SequencingRequestType.ABANDON_ALL, null, null);
        case "suspendAll" /* SUSPEND_ALL */:
          if (!currentActivity) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-17");
          }
          return new NavigationRequestResult(true, SequencingRequestType.SUSPEND_ALL, null, null);
        default:
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-18");
      }
    }
    /**
     * Enhanced Termination Request Process
     * Processes termination requests with post-condition loop for EXIT_PARENT handling
     * Implements missing post-condition loop per SCORM 2004 3rd Edition TB.2.3
     * @spec SN Book: TB.2.3 (Termination Request Process)
     * @param {SequencingRequestType} request - The termination request
     * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
     * @param {string} exitType - The cmi.exit value (logout, normal, suspend, time-out, or empty)
     * @return {TerminationRequestResult} - Termination result with sequencing request
     */
    terminationRequestProcess(request) {
      let hasSequencingRequest = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      let exitType = arguments.length > 2 ? arguments[2] : undefined;
      const currentActivity = this.activityTree.currentActivity;
      if (!currentActivity) {
        return {
          terminationRequest: request,
          sequencingRequest: null,
          exception: "TB.2.3-1",
          valid: false
        };
      }
      if ((request === SequencingRequestType.EXIT || request === SequencingRequestType.ABANDON) && !currentActivity.isActive) {
        return {
          terminationRequest: request,
          sequencingRequest: null,
          exception: "TB.2.3-2",
          valid: false
        };
      }
      this.fireEvent("onTerminationRequestProcessing", {
        request,
        hasSequencingRequest,
        currentActivity: currentActivity.id,
        exitType
      });
      if (exitType === "logout") {
        this.fireEvent("onSequencingDebug", {
          message: "cmi.exit='logout' detected, treating as EXIT_ALL",
          activityId: currentActivity.id
        });
        return this.handleExitAllTermination(currentActivity);
      }
      switch (request) {
        case SequencingRequestType.EXIT:
          return this.handleExitTermination(currentActivity, hasSequencingRequest);
        case SequencingRequestType.EXIT_ALL:
          return this.handleExitAllTermination(currentActivity);
        case SequencingRequestType.ABANDON:
          return this.handleAbandonTermination(currentActivity, hasSequencingRequest);
        case SequencingRequestType.ABANDON_ALL:
          return this.handleAbandonAllTermination(currentActivity);
        case SequencingRequestType.SUSPEND_ALL:
          return this.handleSuspendAllTermination(currentActivity);
        default:
          return {
            terminationRequest: request,
            sequencingRequest: null,
            exception: "TB.2.3-7",
            valid: false
          };
      }
    }
    /**
     * Handle EXIT termination with post-condition loop (TB.2.3 step 3)
     * Implements the do-while loop for EXIT_PARENT cascading
     * @param {Activity} currentActivity - The current activity
     * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
     * @return {TerminationRequestResult} - The termination result
     */
    handleExitTermination(currentActivity, hasSequencingRequest) {
      if (currentActivity.children.length > 0) {
        this.terminateDescendentAttemptsProcess(currentActivity);
      }
      this.endAttemptProcess(currentActivity);
      const exitActionResult = this.enhancedExitActionRulesSubprocess(currentActivity);
      if (exitActionResult.action === "EXIT_ALL") {
        return this.handleExitAllTermination(currentActivity);
      } else if (exitActionResult.action === "EXIT_PARENT") {
        if (currentActivity.parent) {
          this.activityTree.currentActivity = currentActivity.parent;
          this.endAttemptProcess(this.activityTree.currentActivity);
        }
      }
      let processedExit = false;
      let postConditionResult;
      do {
        processedExit = false;
        postConditionResult = this.integratePostConditionRulesSubprocess(this.activityTree.currentActivity || currentActivity);
        if (postConditionResult.terminationRequest === SequencingRequestType.EXIT_ALL) {
          this.fireEvent("onPostConditionExitAll", {
            activity: (this.activityTree.currentActivity || currentActivity).id
          });
          return this.handleExitAllTermination(this.activityTree.root);
        }
        if (postConditionResult.terminationRequest === SequencingRequestType.EXIT_PARENT) {
          const current = this.activityTree.currentActivity || currentActivity;
          if (!current.parent) {
            return {
              terminationRequest: SequencingRequestType.EXIT_PARENT,
              sequencingRequest: null,
              exception: "TB.2.3-4",
              valid: false
            };
          } else {
            this.activityTree.currentActivity = current.parent;
            this.endAttemptProcess(this.activityTree.currentActivity);
            processedExit = true;
            this.fireEvent("onPostConditionExitParent", {
              fromActivity: current.id,
              toActivity: this.activityTree.currentActivity.id
            });
          }
        }
        if (!processedExit) {
          const atRoot = (this.activityTree.currentActivity || currentActivity) === this.activityTree.root;
          if (atRoot && postConditionResult.sequencingRequest !== SequencingRequestType.RETRY) {
            return {
              terminationRequest: SequencingRequestType.EXIT,
              sequencingRequest: SequencingRequestType.EXIT,
              exception: null,
              valid: true
            };
          }
        }
      } while (processedExit);
      if (!hasSequencingRequest && !postConditionResult.sequencingRequest) {
        const current = this.activityTree.currentActivity || currentActivity;
        if (current.parent) {
          this.activityTree.setCurrentActivityWithoutActivation(current.parent);
        }
      }
      return {
        terminationRequest: SequencingRequestType.EXIT,
        sequencingRequest: postConditionResult.sequencingRequest,
        exception: null,
        valid: true
      };
    }
    /**
     * Handle EXIT_ALL termination (TB.2.3 step 4)
     * @param {Activity} currentActivity - The current activity
     * @return {TerminationRequestResult} - The termination result
     */
    handleExitAllTermination(currentActivity) {
      if (this.activityTree.root) {
        this.handleMultiLevelExitActions(this.activityTree.root);
      }
      if (this.activityTree.root) {
        this.endAttemptProcess(this.activityTree.root);
      }
      this.activityTree.currentActivity = null;
      this.performComplexSuspendedActivityCleanup();
      return {
        terminationRequest: SequencingRequestType.EXIT_ALL,
        sequencingRequest: SequencingRequestType.EXIT,
        exception: null,
        valid: true
      };
    }
    /**
     * Handle ABANDON termination (TB.2.3 step 6)
     * @param {Activity} currentActivity - The current activity
     * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
     * @return {TerminationRequestResult} - The termination result
     */
    handleAbandonTermination(currentActivity, hasSequencingRequest) {
      currentActivity.isActive = false;
      if (!hasSequencingRequest) {
        this.activityTree.currentActivity = currentActivity.parent;
      }
      return {
        terminationRequest: SequencingRequestType.ABANDON,
        sequencingRequest: null,
        exception: null,
        valid: true
      };
    }
    /**
     * Handle ABANDON_ALL termination (TB.2.3 step 7)
     * @param {Activity} currentActivity - The current activity
     * @return {TerminationRequestResult} - The termination result
     */
    handleAbandonAllTermination(currentActivity) {
      const activityPath = [];
      let current = currentActivity;
      while (current !== null) {
        activityPath.push(current);
        current = current.parent;
      }
      if (activityPath.length === 0) {
        return {
          terminationRequest: SequencingRequestType.ABANDON_ALL,
          sequencingRequest: null,
          exception: "TB.2.3-6",
          valid: false
        };
      }
      for (const activity of activityPath) {
        activity.isActive = false;
      }
      this.activityTree.currentActivity = null;
      this.performComplexSuspendedActivityCleanup();
      return {
        terminationRequest: SequencingRequestType.ABANDON_ALL,
        sequencingRequest: null,
        exception: null,
        valid: true
      };
    }
    /**
     * Handle SUSPEND_ALL termination (TB.2.3 step 5)
     * Implements TB.2.3 steps 5.1-5.7 for SUSPEND_ALL processing
     * @param {Activity} currentActivity - The current activity
     * @return {TerminationRequestResult} - The termination result
     */
    handleSuspendAllTermination(currentActivity) {
      const suspendResult = this.handleSuspendAllRequest(currentActivity);
      if (!suspendResult.valid) {
        return suspendResult;
      }
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: SequencingRequestType.EXIT,
        exception: null,
        valid: true
      };
    }
    /**
     * Enhanced Exit Action Rules Subprocess with recursion detection
     * Priority 2 Gap: Exit Action Rule Recursion
     * @param {Activity} activity - Activity to evaluate
     * @param {number} recursionDepth - Current recursion depth
     * @return {{action: string | null, recursionDepth: number}} - Exit action result
     */
    enhancedExitActionRulesSubprocess(activity) {
      let recursionDepth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      recursionDepth++;
      const exitRules = activity.sequencingRules.exitConditionRules;
      for (const rule of exitRules) {
        let conditionsMet = true;
        if (rule.conditionCombination === "all") {
          conditionsMet = rule.conditions.every(condition => condition.evaluate(activity));
        } else {
          conditionsMet = rule.conditions.some(condition => condition.evaluate(activity));
        }
        if (conditionsMet) {
          if (rule.action === RuleActionType.EXIT_PARENT) {
            return {
              action: "EXIT_PARENT",
              recursionDepth
            };
          } else if (rule.action === RuleActionType.EXIT_ALL) {
            return {
              action: "EXIT_ALL",
              recursionDepth
            };
          }
        }
      }
      return {
        action: null,
        recursionDepth
      };
    }
    /**
     * Integrate Post-Condition Rules Subprocess
     * Priority 2 Gap: Post-Condition Rule Evaluation Integration
     * @param {Activity} activity - Activity to evaluate post-conditions for
     * @return {import("./sequencing_process").PostConditionResult} - Post-condition result with sequencing and termination requests
     */
    integratePostConditionRulesSubprocess(activity) {
      const postResult = this.sequencingProcess.evaluatePostConditionRules(activity);
      if (postResult.sequencingRequest || postResult.terminationRequest) {
        this.fireEvent("onPostConditionEvaluated", {
          activity: activity.id,
          sequencingRequest: postResult.sequencingRequest,
          terminationRequest: postResult.terminationRequest,
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      }
      return postResult;
    }
    /**
     * Handle Multi-Level Exit Actions
     * Priority 2 Gap: Multi-Level Exit Actions
     * @param {Activity} rootActivity - Root activity to start from
     */
    handleMultiLevelExitActions(rootActivity) {
      this.processExitActionsAtLevel(rootActivity, 0);
      this.terminateAllActivities(rootActivity);
    }
    /**
     * Process exit actions at specific level
     * @param {Activity} activity - Activity to process
     * @param {number} level - Current level in hierarchy
     */
    processExitActionsAtLevel(activity, level) {
      const exitAction = this.enhancedExitActionRulesSubprocess(activity, 0);
      if (exitAction.action) {
        this.fireEvent("onMultiLevelExitAction", {
          activity: activity.id,
          level,
          action: exitAction.action
        });
      }
      for (const child of activity.children) {
        this.processExitActionsAtLevel(child, level + 1);
      }
    }
    /**
     * Perform Complex Suspended Activity Cleanup
     * Priority 2 Gap: Complex Suspended Activity Cleanup
     */
    performComplexSuspendedActivityCleanup() {
      const suspendedActivity = this.activityTree.suspendedActivity;
      if (suspendedActivity) {
        let current = suspendedActivity;
        const cleanedActivities = [];
        while (current) {
          if (current.isSuspended) {
            current.isSuspended = false;
            cleanedActivities.push(current.id);
          }
          current = current.parent;
        }
        this.activityTree.suspendedActivity = null;
        this.fireEvent("onSuspendedActivityCleanup", {
          cleanedActivities,
          originalSuspendedActivity: suspendedActivity.id
        });
      }
    }
    /**
     * Handle Suspend All Request
     * Implements TB.2.3 steps 5.1-5.6 from SCORM 2004 reference
     * Suspends all activities in the path from current activity to root
     * @param {Activity} currentActivity - Current activity to suspend
     * @return {TerminationRequestResult} - Result with validation status
     */
    handleSuspendAllRequest(currentActivity) {
      const rootActivity = this.activityTree.root;
      if (!currentActivity || !rootActivity) {
        this.fireEvent("onSuspendError", {
          exception: "TB.2.3-1",
          message: "No current activity to suspend",
          activity: currentActivity?.id
        });
        return {
          terminationRequest: SequencingRequestType.SUSPEND_ALL,
          sequencingRequest: null,
          exception: "TB.2.3-1",
          valid: false
        };
      }
      if (currentActivity === rootActivity && !currentActivity.isActive && !currentActivity.isSuspended) {
        this.fireEvent("onSuspendError", {
          exception: "TB.2.3-3",
          message: "Nothing to suspend (root activity)",
          activity: currentActivity.id
        });
        return {
          terminationRequest: SequencingRequestType.SUSPEND_ALL,
          sequencingRequest: null,
          exception: "TB.2.3-3",
          valid: false
        };
      }
      this.activityTree.suspendedActivity = currentActivity;
      const suspendedActivity = currentActivity;
      const activityPath = [];
      let current = suspendedActivity;
      while (current !== null) {
        activityPath.push(current);
        current = current.parent;
      }
      if (activityPath.length === 0) {
        this.fireEvent("onSuspendError", {
          exception: "TB.2.3-5",
          message: "Activity path is empty",
          activity: suspendedActivity?.id
        });
        return {
          terminationRequest: SequencingRequestType.SUSPEND_ALL,
          sequencingRequest: null,
          exception: "TB.2.3-5",
          valid: false
        };
      }
      for (const activity of activityPath) {
        activity.isActive = false;
        activity.isSuspended = true;
      }
      this.activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;
      this.fireEvent("onActivitySuspended", {
        activity: suspendedActivity?.id,
        suspendedPath: activityPath.map(a => a.id),
        pathLength: activityPath.length,
        timestamp: (/* @__PURE__ */new Date()).toISOString()
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: null,
        valid: true
      };
    }
    /**
     * Enhanced Delivery Request Process
     * Priority 4 Gap: Comprehensive delivery validation with state consistency checks
     * @spec SN Book: DB.1.1 (Delivery Request Process)
     * @param {Activity} activity - The activity to deliver
     * @return {DeliveryRequest} - The delivery validation result
     */
    deliveryRequestProcess(activity) {
      this.fireEvent("onDeliveryRequestProcessing", {
        activity: activity.id,
        timestamp: (/* @__PURE__ */new Date()).toISOString()
      });
      if (this.enhancedDeliveryValidation) {
        const stateConsistencyCheck = this.validateActivityTreeStateConsistency(activity);
        if (!stateConsistencyCheck.consistent) {
          return new DeliveryRequest(false, null, stateConsistencyCheck.exception);
        }
      }
      if (activity.children.length > 0) {
        return new DeliveryRequest(false, null, "DB.1.1-1");
      }
      if (this.enhancedDeliveryValidation) {
        const resourceConstraintCheck = this.validateResourceConstraints(activity);
        if (!resourceConstraintCheck.available) {
          return new DeliveryRequest(false, null, resourceConstraintCheck.exception);
        }
      }
      if (this.enhancedDeliveryValidation) {
        const concurrentDeliveryCheck = this.validateConcurrentDeliveryPrevention(activity);
        if (!concurrentDeliveryCheck.allowed) {
          return new DeliveryRequest(false, null, concurrentDeliveryCheck.exception);
        }
      }
      if (this.enhancedDeliveryValidation) {
        const dependencyCheck = this.validateActivityDependencies(activity);
        if (!dependencyCheck.satisfied) {
          return new DeliveryRequest(false, null, dependencyCheck.exception);
        }
      }
      const activityPath = this.getActivityPath(activity, true);
      if (activityPath.length === 0) {
        return new DeliveryRequest(false, null, "DB.1.1-2");
      }
      for (const pathActivity of activityPath) {
        if (!this.checkActivityProcess(pathActivity)) {
          return new DeliveryRequest(false, null, "DB.1.1-3");
        }
      }
      return new DeliveryRequest(true, activity);
    }
    /**
     * Content Delivery Environment Process
     * Handles the delivery of content to the learner
     * @spec SN Book: DB.2 (Content Delivery Environment Process)
     * @param {Activity} activity - The activity to deliver
     */
    contentDeliveryEnvironmentProcess(activity) {
      this._deliveryInProgress = true;
      try {
        const isResuming = activity.isSuspended;
        if (this.activityTree.suspendedActivity) {
          this.clearSuspendedActivitySubprocess();
        }
        const activityPath = this.getActivityPath(activity, true);
        for (const pathActivity of activityPath) {
          if (!pathActivity.isActive) {
            if (isResuming || pathActivity.isSuspended) {
              pathActivity.isSuspended = false;
            } else {
              pathActivity.incrementAttemptCount();
            }
            pathActivity.isActive = true;
            SelectionRandomization.applySelectionAndRandomization(pathActivity, pathActivity.attemptCount <= 1);
          }
        }
        this.activityTree.currentActivity = activity;
        this.initializeActivityForDelivery(activity);
        this.setupActivityAttemptTracking(activity);
        this.contentDelivered = true;
        if (this.adlNav) {
          this.updateNavigationValidity();
        }
        this.fireActivityDeliveryEvent(activity);
      } finally {
        this._deliveryInProgress = false;
      }
    }
    /**
     * Initialize Activity For Delivery (DB.2.2)
     * Set up initial tracking states for a delivered activity
     * @param {Activity} activity - The activity being delivered
     */
    initializeActivityForDelivery(activity) {
      if (activity.completionStatus === "unknown") {
        if (activity.children.length === 0) {
          activity.completionStatus = "not attempted";
        }
      }
      if (activity.objectiveSatisfiedStatus === null) {
        activity.objectiveSatisfiedStatus = false;
      }
      if (activity.progressMeasure === null) {
        activity.progressMeasure = 0;
        activity.progressMeasureStatus = false;
      }
      if (activity.objectiveNormalizedMeasure === null) {
        activity.objectiveNormalizedMeasure = 0;
        activity.objectiveMeasureStatus = false;
      }
      activity.attemptAbsoluteDuration = "PT0H0M0S";
      activity.attemptExperiencedDuration = "PT0H0M0S";
      activity.isAvailable = true;
    }
    /**
     * Setup Activity Attempt Tracking
     * Initialize attempt tracking information per SCORM 2004 4th Edition
     * @param {Activity} activity - The activity being delivered
     */
    setupActivityAttemptTracking(activity) {
      activity.wasSkipped = false;
      activity.attemptAbsoluteStartTime = this.now().toISOString();
      if (!activity.location) {
        activity.location = "";
      }
      activity.activityAttemptActive = true;
      if (!activity.learnerPrefs) {
        activity.learnerPrefs = {
          audioCaptioning: "0",
          audioLevel: "1",
          deliverySpeed: "1",
          language: ""
        };
      }
    }
    /**
     * Fire Activity Delivery Event
     * Notify listeners that an activity has been delivered
     * @param {Activity} activity - The activity that was delivered
     */
    fireActivityDeliveryEvent(activity) {
      try {
        if (this.eventCallback) {
          this.eventCallback("onActivityDelivery", activity);
        }
        console.debug(`Activity delivered: ${activity.id} - ${activity.title}`);
      } catch (error) {
        console.warn(`Failed to fire activity delivery event: ${error}`);
      }
    }
    /**
     * Fire a sequencing event
     * @param {string} eventType - The type of event
     * @param {any} data - Event data
     */
    fireEvent(eventType, data) {
      try {
        if (this.eventCallback) {
          this.eventCallback(eventType, data);
        }
      } catch (error) {
        console.warn(`Failed to fire sequencing event ${eventType}: ${error}`);
      }
    }
    /**
     * Clear Suspended Activity Subprocess (DB.2.1)
     * Clears the suspended activity state
     */
    clearSuspendedActivitySubprocess() {
      if (this.activityTree.suspendedActivity) {
        let current = this.activityTree.suspendedActivity;
        while (current) {
          current.isSuspended = false;
          current = current.parent;
        }
        this.activityTree.suspendedActivity = null;
      }
    }
    /**
     * End Attempt Process
     * Ends an attempt on an activity
     * @spec SN Book: UP.4 (Utility Process - End Attempt Process)
     * @param {Activity} activity - The activity to end attempt on
     */
    endAttemptProcess(activity) {
      if (!activity.isActive) {
        return;
      }
      this.transferRteDataToActivity(activity);
      activity.isActive = false;
      activity.activityAttemptActive = false;
      if (activity.children.length === 0) {
        {
          if (!activity.isSuspended) {
            if (!activity.sequencingControls.completionSetByContent) {
              if (!activity.attemptProgressStatus) {
                activity.attemptProgressStatus = true;
                activity.completionStatus = "completed";
                activity.wasAutoCompleted = true;
                this.fireEvent("onAutoCompletion", {
                  activityId: activity.id,
                  timestamp: (/* @__PURE__ */new Date()).toISOString()
                });
              }
            }
            if (!activity.sequencingControls.objectiveSetByContent) {
              const primaryObjective = activity.primaryObjective;
              if (primaryObjective) {
                if (!primaryObjective.progressStatus) {
                  primaryObjective.progressStatus = true;
                  primaryObjective.satisfiedStatus = true;
                  activity.objectiveSatisfiedStatus = true;
                  activity.successStatus = "passed";
                  activity.wasAutoSatisfied = true;
                  this.fireEvent("onAutoSatisfaction", {
                    activityId: activity.id,
                    timestamp: (/* @__PURE__ */new Date()).toISOString()
                  });
                }
              }
            }
          }
        }
      } else {
        const hasSuspendedChildren = activity.children.some(child => child.isSuspended);
        activity.isSuspended = hasSuspendedChildren;
      }
      if (activity.completionStatus === "unknown") {
        activity.completionStatus = "incomplete";
      }
      if (activity.successStatus === "unknown" && activity.objectiveSatisfiedStatus) {
        activity.successStatus = activity.objectiveSatisfiedStatus ? "passed" : "failed";
      }
      const mappingRoot = this.activityTree.root || activity;
      this.rollupProcess.processGlobalObjectiveMapping(mappingRoot, this.globalObjectiveMap);
      this.rollupProcess.overallRollupProcess(activity);
      this.navigationLookAhead.invalidateCache();
      if (this.activityTree.root) {
        this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
      }
      SelectionRandomization.applySelectionAndRandomization(activity, false);
    }
    /**
     * Transfer RTE Data to Activity (Full Implementation)
     * Transfers ALL CMI data from runtime environment to activity state
     * Called at the start of endAttemptProcess to ensure proper data transfer
     *
     * This implements:
     * - Primary objective data transfer (completion, success, score)
     * - Non-primary objective data transfer by ID matching
     * - Change tracking to prevent overwriting global objectives
     * - Score normalization (ScaleRawScore)
     * - 4th Edition specific handling
     *
     * @param {Activity} activity - The activity to transfer data to
     */
    transferRteDataToActivity(activity) {
      if (!this.getCMIData) {
        return;
      }
      const cmiData = this.getCMIData();
      if (!cmiData) {
        return;
      }
      this.transferPrimaryObjectiveData(activity, cmiData);
      this.transferNonPrimaryObjectiveData(activity, cmiData);
      this.fireEvent("onRteDataTransfer", {
        activityId: activity.id,
        timestamp: (/* @__PURE__ */new Date()).toISOString()
      });
    }
    /**
     * Transfer primary objective data from CMI to activity
     * @param {Activity} activity - The activity to transfer data to
     * @param {CMIDataForTransfer} cmiData - CMI data from runtime
     */
    transferPrimaryObjectiveData(activity, cmiData) {
      if (cmiData.completion_status && cmiData.completion_status !== "unknown") {
        activity.completionStatus = cmiData.completion_status;
        activity.attemptProgressStatus = true;
      }
      let hasSuccessStatus = false;
      let successStatus = false;
      let hasNormalizedMeasure = false;
      let normalizedScore = 0;
      if (cmiData.success_status && cmiData.success_status !== "unknown") {
        successStatus = cmiData.success_status === "passed";
        hasSuccessStatus = true;
        activity.objectiveSatisfiedStatus = successStatus;
        activity.objectiveSatisfiedStatusKnown = true;
        activity.successStatus = cmiData.success_status;
        activity.objectiveMeasureStatus = true;
      }
      if (cmiData.score) {
        const normalized = this.normalizeScore(cmiData.score);
        if (normalized !== null) {
          normalizedScore = normalized;
          hasNormalizedMeasure = true;
          activity.objectiveNormalizedMeasure = normalizedScore;
          activity.objectiveMeasureStatus = true;
        }
      }
      if (activity.primaryObjective && (hasSuccessStatus || hasNormalizedMeasure)) {
        const finalStatus = hasSuccessStatus ? successStatus : activity.primaryObjective.satisfiedStatus;
        const finalMeasure = hasNormalizedMeasure ? normalizedScore : activity.primaryObjective.normalizedMeasure;
        const measureStatus = hasSuccessStatus || hasNormalizedMeasure;
        activity.primaryObjective.initializeFromCMI(finalStatus, finalMeasure, measureStatus);
        if (hasSuccessStatus) {
          activity.primaryObjective.satisfiedStatusKnown = true;
          activity.primaryObjective.progressStatus = true;
        }
      }
      if (cmiData.progress_measure && cmiData.progress_measure !== "") {
        const progressMeasure = parseFloat(cmiData.progress_measure);
        if (!isNaN(progressMeasure)) {
          activity.progressMeasure = progressMeasure;
          activity.progressMeasureStatus = true;
          if (activity.primaryObjective) {
            activity.primaryObjective.progressMeasure = progressMeasure;
            activity.primaryObjective.progressMeasureStatus = true;
          }
        }
      }
    }
    /**
     * Transfer non-primary objective data from CMI to activity objectives
     * Only transfers changed values to protect global objectives
     * @param {Activity} activity - The activity to transfer data to
     * @param {CMIDataForTransfer} cmiData - CMI data from runtime
     */
    transferNonPrimaryObjectiveData(activity, cmiData) {
      if (!cmiData.objectives || cmiData.objectives.length === 0) {
        return;
      }
      for (const cmiObjective of cmiData.objectives) {
        if (!cmiObjective.id) {
          continue;
        }
        const activityObjectiveMatch = activity.getObjectiveById(cmiObjective.id);
        if (!activityObjectiveMatch || activityObjectiveMatch.isPrimary) {
          continue;
        }
        const activityObjective = activityObjectiveMatch.objective;
        let hasSuccessStatus = false;
        let successStatus = false;
        let hasNormalizedMeasure = false;
        let normalizedScore = 0;
        if (cmiObjective.success_status && cmiObjective.success_status !== "unknown") {
          successStatus = cmiObjective.success_status === "passed";
          hasSuccessStatus = true;
          activityObjective.progressStatus = true;
        }
        if (cmiObjective.completion_status && cmiObjective.completion_status !== "unknown") {
          activityObjective.completionStatus = cmiObjective.completion_status;
        }
        if (cmiObjective.score) {
          const normalized = this.normalizeScore(cmiObjective.score);
          if (normalized !== null) {
            normalizedScore = normalized;
            hasNormalizedMeasure = true;
          }
        }
        if (hasSuccessStatus || hasNormalizedMeasure) {
          const finalStatus = hasSuccessStatus ? successStatus : activityObjective.satisfiedStatus;
          const finalMeasure = hasNormalizedMeasure ? normalizedScore : activityObjective.normalizedMeasure;
          const measureStatus = hasNormalizedMeasure;
          activityObjective.initializeFromCMI(finalStatus, finalMeasure, measureStatus);
        }
        if (cmiObjective.progress_measure && cmiObjective.progress_measure !== "") {
          const progressMeasure = parseFloat(cmiObjective.progress_measure);
          if (!isNaN(progressMeasure)) {
            activityObjective.progressMeasure = progressMeasure;
            activityObjective.progressMeasureStatus = true;
          }
        }
      }
    }
    /**
     * Normalize score from raw/min/max if scaled is not available
     * Implements ScaleRawScore process
     * @param {Object} score - Score object with scaled, raw, min, max
     * @return {number | null} - Normalized score or null if cannot normalize
     */
    normalizeScore(score) {
      if (score.scaled && score.scaled !== "") {
        const scaled = parseFloat(score.scaled);
        if (!isNaN(scaled)) {
          return scaled;
        }
      }
      if (score.raw && score.raw !== "" && score.min && score.min !== "" && score.max && score.max !== "") {
        const raw = parseFloat(score.raw);
        const min = parseFloat(score.min);
        const max = parseFloat(score.max);
        if (!isNaN(raw) && !isNaN(min) && !isNaN(max) && max > min) {
          const normalized = (raw - min) / (max - min);
          return Math.max(-1, Math.min(1, normalized));
        }
      }
      return null;
    }
    /**
     * Update navigation validity in ADL nav
     * Called after activity delivery and after rollup to update navigation button states
     */
    updateNavigationValidity() {
      if (!this.adlNav || !this.activityTree.currentActivity) {
        return;
      }
      this.navigationLookAhead.invalidateCache();
      const continueValid = this.navigationLookAhead.predictContinueEnabled();
      try {
        this.adlNav.request_valid.continue = continueValid ? "true" : "false";
      } catch (e) {}
      const previousValid = this.navigationLookAhead.predictPreviousEnabled();
      try {
        this.adlNav.request_valid.previous = previousValid ? "true" : "false";
      } catch (e) {}
      const allActivities = this.activityTree.getAllActivities();
      const choiceMap = {};
      const jumpMap = {};
      for (const act of allActivities) {
        const choiceRes = this.navigationRequestProcess("choice" /* CHOICE */, act.id);
        choiceMap[act.id] = choiceRes.valid ? "true" : "false";
        const jumpRes = this.navigationRequestProcess("jump" /* JUMP */, act.id);
        jumpMap[act.id] = jumpRes.valid ? "true" : "false";
      }
      try {
        this.adlNav.request_valid.choice = choiceMap;
      } catch (e) {}
      try {
        this.adlNav.request_valid.jump = jumpMap;
      } catch (e) {}
      this.fireEvent("onNavigationValidityUpdate", {
        continue: continueValid,
        previous: previousValid,
        choice: choiceMap,
        jump: jumpMap,
        hideLmsUi: this.getEffectiveHideLmsUi(this.activityTree.currentActivity)
      });
    }
    /**
     * Synchronize global objectives from activity states
     * Called after CMI changes that affect objective status to update global objective mappings
     * This ensures that preconditions based on global objectives are properly evaluated
     */
    synchronizeGlobalObjectives() {
      if (!this.activityTree.root) {
        return;
      }
      this.rollupProcess.processGlobalObjectiveMapping(this.activityTree.root, this.globalObjectiveMap);
    }
    getEffectiveHideLmsUi(activity) {
      const seen = /* @__PURE__ */new Set();
      for (const directive of this.defaultHideLmsUi) {
        seen.add(directive);
      }
      let current = activity;
      while (current) {
        for (const directive of current.hideLmsUi) {
          seen.add(directive);
        }
        current = current.parent;
      }
      return _OverallSequencingProcess.HIDE_LMS_UI_ORDER.filter(directive => seen.has(directive));
    }
    getEffectiveAuxiliaryResources(activity) {
      const merged = /* @__PURE__ */new Map();
      for (const resource of this.defaultAuxiliaryResources) {
        if (resource.resourceId) {
          merged.set(resource.resourceId, {
            ...resource
          });
        }
      }
      const lineage = [];
      let current = activity;
      while (current) {
        lineage.push(current);
        current = current.parent;
      }
      for (const node of lineage.reverse()) {
        for (const resource of node.auxiliaryResources) {
          if (resource.resourceId) {
            merged.set(resource.resourceId, {
              ...resource
            });
          }
        }
      }
      return Array.from(merged.values());
    }
    /**
     * Find common ancestor between two activities
     */
    findCommonAncestor(activity1, activity2) {
      const ancestors1 = [];
      let current = activity1;
      while (current) {
        ancestors1.push(current);
        current = current.parent;
      }
      current = activity2;
      while (current) {
        if (ancestors1.includes(current)) {
          return current;
        }
        current = current.parent;
      }
      return null;
    }
    /**
     * Check if content has been delivered
     */
    hasContentBeenDelivered() {
      return this.contentDelivered;
    }
    /**
     * Check if content delivery is currently in progress
     * Used to prevent re-entrant termination requests during delivery
     */
    isDeliveryInProgress() {
      return this._deliveryInProgress;
    }
    /**
     * Reset content delivered flag
     */
    resetContentDelivered() {
      this.contentDelivered = false;
    }
    /**
     * Set content delivered flag
     * @param {boolean} value - The value to set
     */
    setContentDelivered(value) {
      this.contentDelivered = value;
    }
    /**
     * Exit Action Rules Subprocess (TB.2.1)
     * Evaluates exit action rules for the current activity
     * @param {Activity} activity - The activity to evaluate
     * @return {string | null} - The exit action to take, or null if none
     */
    exitActionRulesSubprocess(activity) {
      const exitRules = activity.sequencingRules.exitConditionRules;
      for (const rule of exitRules) {
        let conditionsMet = true;
        if (rule.conditionCombination === "all") {
          conditionsMet = rule.conditions.every(condition => condition.evaluate(activity));
        } else {
          conditionsMet = rule.conditions.some(condition => condition.evaluate(activity));
        }
        if (conditionsMet) {
          if (rule.action === RuleActionType.EXIT_PARENT) {
            return "EXIT_PARENT";
          } else if (rule.action === RuleActionType.EXIT_ALL) {
            return "EXIT_ALL";
          }
        }
      }
      return null;
    }
    /**
     * Terminate all activities in the tree
     * @param {Activity} activity - The activity to start from (usually root)
     */
    terminateAllActivities(activity) {
      for (const child of activity.children) {
        this.terminateAllActivities(child);
      }
      if (activity.isActive) {
        this.endAttemptProcess(activity);
      }
    }
    /**
     * Limit Conditions Check Process (UP.1)
     * Checks if any limit conditions are violated for the activity
     * @param {Activity} activity - The activity to check limit conditions for
     * @return {boolean} - True if limit conditions are met, false if violated
     */
    limitConditionsCheckProcess(activity) {
      let result = true;
      let failureReason = "";
      if (activity.attemptLimit !== null && activity.attemptLimit > 0) {
        if (activity.attemptCount >= activity.attemptLimit) {
          result = false;
          failureReason = "Attempt limit exceeded";
        }
      }
      if (result && activity.attemptAbsoluteDurationLimit) {
        const limitDuration = getDurationAsSeconds(activity.attemptAbsoluteDurationLimit, scorm2004_regex.CMITimespan);
        if (limitDuration > 0) {
          const currentDuration = getDurationAsSeconds(activity.attemptAbsoluteDuration || "PT0H0M0S", scorm2004_regex.CMITimespan);
          if (currentDuration >= limitDuration) {
            result = false;
            failureReason = "Attempt duration limit exceeded";
          }
        }
      }
      if (result && activity.activityAbsoluteDurationLimit) {
        const limitDuration = getDurationAsSeconds(activity.activityAbsoluteDurationLimit, scorm2004_regex.CMITimespan);
        if (limitDuration > 0) {
          const currentDuration = getDurationAsSeconds(activity.activityAbsoluteDuration || "PT0H0M0S", scorm2004_regex.CMITimespan);
          if (currentDuration >= limitDuration) {
            result = false;
            failureReason = "Activity duration limit exceeded";
          }
        }
      }
      if (result && activity.beginTimeLimit) {
        const currentTime = this.now();
        const beginTime = new Date(activity.beginTimeLimit);
        if (currentTime < beginTime) {
          result = false;
          failureReason = "Not yet time to begin";
        }
      }
      if (result && activity.endTimeLimit) {
        const currentTime = this.now();
        const endTime = new Date(activity.endTimeLimit);
        if (currentTime > endTime) {
          result = false;
          failureReason = "Time limit expired";
        }
      }
      this.fireEvent("onLimitConditionCheck", {
        activity,
        result,
        failureReason,
        checks: {
          attemptLimit: activity.attemptLimit,
          attemptCount: activity.attemptCount,
          attemptDurationLimit: activity.attemptAbsoluteDurationLimit,
          activityDurationLimit: activity.activityAbsoluteDurationLimit,
          beginTimeLimit: activity.beginTimeLimit,
          endTimeLimit: activity.endTimeLimit
        }
      });
      return result;
    }
    /**
     * Get Activity Path (Helper for DB.1.1)
     * Forms the activity path from root to target activity, inclusive
     * @param {Activity} activity - The target activity
     * @param {boolean} includeActivity - Whether to include the target in the path
     * @return {Activity[]} - Array of activities from root to target
     */
    getActivityPath(activity) {
      let includeActivity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      const path = [];
      let current = activity;
      while (current !== null) {
        path.unshift(current);
        current = current.parent;
      }
      if (!includeActivity && path.length > 0) {
        path.pop();
      }
      return path;
    }
    /**
     * Check Activity Process (UP.5)
     * Validates if an activity can be delivered based on sequencing rules and limit conditions
     * Note: Cluster/leaf validation is handled in DB.1.1 Step 1, not here
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if activity is valid (not disabled, limits not violated)
     */
    checkActivityProcess(activity) {
      if (!activity.isAvailable) {
        return false;
      }
      if (!this.limitConditionsCheckProcess(activity)) {
        return false;
      }
      return true;
    }
    /**
     * Terminate Descendent Attempts Process (UP.3)
     * Recursively terminates all active descendant attempts
     * @param {Activity} activity - The activity whose descendants to terminate
     */
    terminateDescendentAttemptsProcess(activity) {
      for (const child of activity.children) {
        if (child.children.length > 0) {
          this.terminateDescendentAttemptsProcess(child);
        }
        const exitAction = this.exitActionRulesSubprocess(child);
        if (child.isActive) {
          if (exitAction === "EXIT_ALL") {
            this.terminateDescendentAttemptsProcess(child);
          }
          this.endAttemptProcess(child);
        }
      }
    }
    /**
     * Get Sequencing State for Persistence
     * Returns the current state of the sequencing engine for multi-session support
     * @return {object} - Serializable sequencing state
     */
    getSequencingState() {
      return {
        version: "1.0",
        timestamp: (/* @__PURE__ */new Date()).toISOString(),
        contentDelivered: this.contentDelivered,
        currentActivity: this.activityTree.currentActivity?.id || null,
        suspendedActivity: this.activityTree.suspendedActivity?.id || null,
        activityStates: this.serializeActivityStates(),
        navigationState: this.getNavigationState(),
        globalObjectiveMap: this.serializeGlobalObjectiveMap()
      };
    }
    /**
     * Restore Sequencing State from Persistence
     * Restores the sequencing engine state from a previous session
     * @param {any} state - Previously saved sequencing state
     * @return {boolean} - True if restoration was successful
     */
    restoreSequencingState(state) {
      try {
        if (!state || state.version !== "1.0") {
          console.warn("Incompatible sequencing state version");
          return false;
        }
        this.contentDelivered = state.contentDelivered || false;
        if (state.globalObjectiveMap) {
          this.restoreGlobalObjectiveMap(state.globalObjectiveMap);
        }
        if (state.activityStates) {
          this.deserializeActivityStates(state.activityStates);
        }
        if (state.currentActivity) {
          const currentActivity = this.activityTree.getActivity(state.currentActivity);
          if (currentActivity) {
            this.activityTree.currentActivity = currentActivity;
            currentActivity.isActive = true;
          }
        }
        if (state.suspendedActivity) {
          const suspendedActivity = this.activityTree.getActivity(state.suspendedActivity);
          if (suspendedActivity) {
            this.activityTree.suspendedActivity = suspendedActivity;
            suspendedActivity.isSuspended = true;
          }
        }
        if (state.navigationState) {
          this.restoreNavigationState(state.navigationState);
        }
        if (this.activityTree.root) {
          this.rollupProcess.processGlobalObjectiveMapping(this.activityTree.root, this.globalObjectiveMap);
        }
        console.debug("Sequencing state restored successfully");
        return true;
      } catch (error) {
        console.error(`Failed to restore sequencing state: ${error}`);
        return false;
      }
    }
    /**
     * Serialize Activity States
     * Creates a serializable representation of all activity states
     * @return {object} - Serialized activity states
     */
    serializeActivityStates() {
      const states = {};
      const serializeActivity = activity => {
        states[activity.id] = {
          id: activity.id,
          title: activity.title,
          isActive: activity.isActive,
          isSuspended: activity.isSuspended,
          isCompleted: activity.isCompleted,
          completionStatus: activity.completionStatus,
          successStatus: activity.successStatus,
          attemptCount: activity.attemptCount,
          attemptCompletionAmount: activity.attemptCompletionAmount,
          attemptAbsoluteDuration: activity.attemptAbsoluteDuration,
          attemptExperiencedDuration: activity.attemptExperiencedDuration,
          activityAbsoluteDuration: activity.activityAbsoluteDuration,
          activityExperiencedDuration: activity.activityExperiencedDuration,
          objectiveSatisfiedStatus: activity.objectiveSatisfiedStatus,
          objectiveMeasureStatus: activity.objectiveMeasureStatus,
          objectiveNormalizedMeasure: activity.objectiveNormalizedMeasure,
          progressMeasure: activity.progressMeasure,
          progressMeasureStatus: activity.progressMeasureStatus,
          isAvailable: activity.isAvailable,
          isHiddenFromChoice: activity.isHiddenFromChoice,
          location: activity.location,
          attemptAbsoluteStartTime: activity.attemptAbsoluteStartTime,
          objectives: activity.getObjectiveStateSnapshot(),
          auxiliaryResources: activity.auxiliaryResources,
          selectionRandomizationState: {
            selectionCountStatus: activity.sequencingControls.selectionCountStatus,
            reorderChildren: activity.sequencingControls.reorderChildren,
            childOrder: activity.children.map(child => child.id),
            selectedChildIds: activity.children.filter(child => child.isAvailable).map(child => child.id),
            hiddenFromChoiceChildIds: activity.children.filter(child => child.isHiddenFromChoice).map(child => child.id)
          }
        };
        for (const child of activity.children) {
          serializeActivity(child);
        }
      };
      if (this.activityTree.root) {
        serializeActivity(this.activityTree.root);
      }
      return states;
    }
    /**
     * Deserialize Activity States
     * Restores activity states from serialized data
     * @param {any} states - Serialized activity states
     */
    deserializeActivityStates(states) {
      const restoreActivity = activity => {
        const state = states[activity.id];
        if (state) {
          activity.isActive = state.isActive || false;
          activity.isSuspended = state.isSuspended || false;
          activity.isCompleted = state.isCompleted || false;
          activity.completionStatus = state.completionStatus || "unknown";
          activity.successStatus = state.successStatus || "unknown";
          activity.attemptCount = state.attemptCount || 0;
          activity.attemptCompletionAmount = state.attemptCompletionAmount || 0;
          activity.attemptAbsoluteDuration = state.attemptAbsoluteDuration || "PT0H0M0S";
          activity.attemptExperiencedDuration = state.attemptExperiencedDuration || "PT0H0M0S";
          activity.activityAbsoluteDuration = state.activityAbsoluteDuration || "PT0H0M0S";
          activity.activityExperiencedDuration = state.activityExperiencedDuration || "PT0H0M0S";
          activity.objectiveSatisfiedStatus = state.objectiveSatisfiedStatus || false;
          activity.objectiveMeasureStatus = state.objectiveMeasureStatus || false;
          activity.objectiveNormalizedMeasure = state.objectiveNormalizedMeasure || 0;
          activity.progressMeasure = state.progressMeasure || null;
          activity.progressMeasureStatus = state.progressMeasureStatus || false;
          activity.isAvailable = state.isAvailable !== false;
          activity.isHiddenFromChoice = state.isHiddenFromChoice === true;
          activity.location = state.location || "";
          activity.attemptAbsoluteStartTime = state.attemptAbsoluteStartTime || null;
          if (Array.isArray(state.auxiliaryResources)) {
            activity.auxiliaryResources = state.auxiliaryResources;
          }
          if (state.objectives) {
            activity.applyObjectiveStateSnapshot(state.objectives);
          }
        }
        for (const child of activity.children) {
          restoreActivity(child);
        }
        if (state?.selectionRandomizationState) {
          const selectionState = state.selectionRandomizationState;
          const sequencingControls = activity.sequencingControls;
          if (selectionState.selectionCountStatus !== void 0) {
            sequencingControls.selectionCountStatus = selectionState.selectionCountStatus;
          }
          if (selectionState.reorderChildren !== void 0) {
            sequencingControls.reorderChildren = selectionState.reorderChildren;
          }
          if (selectionState.childOrder && selectionState.childOrder.length > 0) {
            activity.setChildOrder(selectionState.childOrder);
          }
          const selectedSet = Array.isArray(selectionState.selectedChildIds) ? new Set(selectionState.selectedChildIds) : null;
          const hiddenSet = Array.isArray(selectionState.hiddenFromChoiceChildIds) ? new Set(selectionState.hiddenFromChoiceChildIds) : null;
          if (selectedSet || hiddenSet) {
            for (const child of activity.children) {
              if (selectedSet) {
                const isSelected = selectedSet.has(child.id);
                child.isAvailable = isSelected;
                if (!hiddenSet) {
                  child.isHiddenFromChoice = !isSelected;
                }
              }
              if (hiddenSet) {
                child.isHiddenFromChoice = hiddenSet.has(child.id);
              }
            }
          }
          activity.setProcessedChildren(activity.children.filter(child => child.isAvailable));
        } else {
          activity.resetProcessedChildren();
        }
      };
      if (this.activityTree.root) {
        restoreActivity(this.activityTree.root);
      }
    }
    /**
     * Get Navigation State
     * Returns current navigation validity and ADL nav state
     * @return {any} - Navigation state
     */
    getNavigationState() {
      if (!this.adlNav) {
        return null;
      }
      return {
        request: this.adlNav.request || "_none_",
        requestValid: {
          continue: this.adlNav.request_valid?.continue || "false",
          previous: this.adlNav.request_valid?.previous || "false",
          choice: this.adlNav.request_valid?.choice || "false",
          jump: this.adlNav.request_valid?.jump || "false",
          exit: this.adlNav.request_valid?.exit || "false",
          exitAll: this.adlNav.request_valid?.exitAll || "false",
          abandon: this.adlNav.request_valid?.abandon || "false",
          abandonAll: this.adlNav.request_valid?.abandonAll || "false",
          suspendAll: this.adlNav.request_valid?.suspendAll || "false"
        },
        hideLmsUi: this.getEffectiveHideLmsUi(this.activityTree.currentActivity),
        auxiliaryResources: this.getEffectiveAuxiliaryResources(this.activityTree.currentActivity)
      };
    }
    /**
     * Restore Navigation State
     * Restores ADL navigation state
     * @param {any} navState - Navigation state to restore
     */
    restoreNavigationState(navState) {
      if (!this.adlNav || !navState) {
        return;
      }
      try {
        if (navState.requestValid) {
          const requestValid = navState.requestValid;
          this.adlNav.request_valid.continue = requestValid.continue || "false";
          this.adlNav.request_valid.previous = requestValid.previous || "false";
          this.adlNav.request_valid.choice = requestValid.choice || "false";
          this.adlNav.request_valid.jump = requestValid.jump || "false";
          this.adlNav.request_valid.exit = requestValid.exit || "false";
          this.adlNav.request_valid.exitAll = requestValid.exitAll || "false";
          this.adlNav.request_valid.abandon = requestValid.abandon || "false";
          this.adlNav.request_valid.abandonAll = requestValid.abandonAll || "false";
          this.adlNav.request_valid.suspendAll = requestValid.suspendAll || "false";
        }
      } catch (error) {
        console.warn(`Could not fully restore navigation state: ${error}`);
      }
    }
    /**
     * Enhanced Complex Choice Path Validation
     * Implements comprehensive choice validation with nested hierarchy support
     * @param {Activity | null} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity for choice
     * @return {{valid: boolean, exception: string | null}} - Validation result
     */
    validateComplexChoicePath(currentActivity, targetActivity) {
      if (targetActivity.isHiddenFromChoice) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      if (!targetActivity.isAvailable) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      if (this.isActivityDisabled(targetActivity)) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      if (currentActivity) {
        const commonAncestor = this.findCommonAncestor(currentActivity, targetActivity);
        if (!commonAncestor) {
          return {
            valid: false,
            exception: "NB.2.1-11"
          };
        }
        let node = currentActivity;
        while (node && node !== commonAncestor) {
          if (node.isActive === true && node.sequencingControls && node.sequencingControls.choiceExit === false) {
            if (targetActivity !== node && !this.activityContains(node, targetActivity)) {
              return {
                valid: false,
                exception: "NB.2.1-11"
              };
            }
          }
          node = node.parent;
        }
        const constrainChoiceValidation = this.validateConstrainChoiceControls(currentActivity, targetActivity, commonAncestor);
        if (!constrainChoiceValidation.valid) {
          return constrainChoiceValidation;
        }
        const choiceSetValidation = this.validateChoiceSetConstraints(currentActivity, targetActivity, commonAncestor);
        if (!choiceSetValidation.valid) {
          return choiceSetValidation;
        }
      }
      let activity = targetActivity;
      while (activity) {
        if (activity.parent && !activity.parent.sequencingControls.choice) {
          return {
            valid: false,
            exception: "NB.2.1-11"
          };
        }
        activity = activity.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Enhanced Forward-Only Navigation Constraints
     * Handles forward-only constraints at different cluster levels
     * @param {Activity} currentActivity - Current activity
     * @return {{valid: boolean, exception: string | null}} - Validation result
     */
    validateForwardOnlyConstraints(currentActivity) {
      if (currentActivity.parent?.sequencingControls.forwardOnly) {
        return {
          valid: false,
          exception: "NB.2.1-8"
        };
      }
      let ancestor = currentActivity.parent?.parent;
      while (ancestor) {
        if (ancestor.sequencingControls.forwardOnly) {
          return {
            valid: false,
            exception: "NB.2.1-8"
          };
        }
        ancestor = ancestor.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Enhanced constrainChoice Control Validation
     * Implements proper constrainChoice validation in nested hierarchies
     * @param {Activity} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity
     * @param {Activity} commonAncestor - Common ancestor
     * @return {{valid: boolean, exception: string | null}} - Validation result
     */
    validateConstrainChoiceControls(currentActivity, targetActivity, commonAncestor) {
      let ancestor = commonAncestor;
      while (ancestor) {
        if (ancestor.sequencingControls?.constrainChoice || ancestor.sequencingControls?.preventActivation) {
          const currentBranch = this.findChildContaining(ancestor, currentActivity);
          if (!currentBranch) {
            return {
              valid: false,
              exception: "NB.2.1-11"
            };
          }
          if (targetActivity === ancestor) {
            return {
              valid: false,
              exception: "NB.2.1-11"
            };
          }
          const targetBranch = this.findChildContaining(ancestor, targetActivity);
          if (!targetBranch) {
            return {
              valid: false,
              exception: "NB.2.1-11"
            };
          }
          if (ancestor.sequencingControls?.constrainChoice && targetBranch !== currentBranch) {
            return {
              valid: false,
              exception: "NB.2.1-11"
            };
          }
          if (ancestor.sequencingControls?.preventActivation && targetBranch !== currentBranch) {
            if (this.requiresNewActivation(targetBranch, targetActivity)) {
              return {
                valid: false,
                exception: "NB.2.1-11"
              };
            }
          }
        }
        ancestor = ancestor.parent;
      }
      return this.validateAncestorConstraints(commonAncestor, currentActivity, targetActivity);
    }
    /**
     * Validate Choice Set Constraints
     * Validates choice sets with multiple targets
     * @param {Activity} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity
     * @param {Activity} commonAncestor - Common ancestor
     * @return {{valid: boolean, exception: string | null}} - Validation result
     */
    validateChoiceSetConstraints(currentActivity, targetActivity, commonAncestor) {
      if (!this.activityContains(commonAncestor, targetActivity) && targetActivity !== commonAncestor) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      let node = targetActivity;
      while (node && node !== commonAncestor) {
        if (!node.isAvailable || node.isHiddenFromChoice || this.isActivityDisabled(node)) {
          return {
            valid: false,
            exception: "NB.2.1-11"
          };
        }
        node = node.parent;
      }
      return {
        valid: true,
        exception: null
      };
    }
    /**
     * Check if activity is disabled
     * @param {Activity} activity - Activity to check
     * @return {boolean} - True if disabled
     */
    isActivityDisabled(activity) {
      if (!activity.isAvailable) {
        return true;
      }
      if (activity.isHiddenFromChoice) {
        return true;
      }
      const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
      if (!preConditionResult) {
        return false;
      }
      return preConditionResult === RuleActionType.DISABLED || preConditionResult === RuleActionType.HIDE_FROM_CHOICE || preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL;
    }
    /**
     * Find child activity that contains the target activity
     * @param {Activity} parent - Parent activity
     * @param {Activity} target - Target activity to find
     * @return {Activity | null} - Child activity containing target
     */
    findChildContaining(parent, target) {
      for (const child of parent.children) {
        if (child === target) {
          return child;
        }
        if (this.activityContains(child, target)) {
          return child;
        }
      }
      return null;
    }
    /**
     * Check if an activity contains another activity in its hierarchy
     * @param {Activity} container - Container activity
     * @param {Activity} target - Target activity
     * @return {boolean} - True if container contains target
     */
    activityContains(container, target) {
      let current = target;
      while (current) {
        if (current === container) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }
    /**
     * Validate ancestor-level constraints
     * @param {Activity} ancestor - Ancestor activity
     * @param {Activity} currentActivity - Current activity
     * @param {Activity} targetActivity - Target activity
     * @return {{valid: boolean, exception: string | null}} - Validation result
     */
    validateAncestorConstraints(ancestor, currentActivity, targetActivity) {
      const children = ancestor.children;
      if (!children || children.length === 0) {
        return {
          valid: true,
          exception: null
        };
      }
      const currentTop = this.findChildContaining(ancestor, currentActivity);
      const targetTop = this.findChildContaining(ancestor, targetActivity);
      if (!currentTop || !targetTop) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      const currentIndex = children.indexOf(currentTop);
      const targetIndex = children.indexOf(targetTop);
      if (ancestor.sequencingControls.forwardOnly && targetIndex < currentIndex) {
        return {
          valid: false,
          exception: "NB.2.1-8"
        };
      }
      const traversalStopIndex = children.findIndex(child => child?.sequencingControls.stopForwardTraversal);
      if (currentTop.sequencingControls.stopForwardTraversal && targetIndex > currentIndex) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      if (traversalStopIndex !== -1 && targetIndex > traversalStopIndex) {
        return {
          valid: false,
          exception: "NB.2.1-11"
        };
      }
      if (targetIndex > currentIndex && ancestor.sequencingControls.forwardOnly) {
        for (let i = currentIndex + 1; i < targetIndex; i++) {
          const between = children[i];
          if (!between) {
            continue;
          }
          if (between.sequencingControls.stopForwardTraversal) {
            return {
              valid: false,
              exception: "NB.2.1-11"
            };
          }
          if (this.helperIsActivityMandatory(between) && !this.helperIsActivityCompleted(between)) {
            return {
              valid: false,
              exception: "NB.2.1-11"
            };
          }
        }
      }
      return {
        valid: true,
        exception: null
      };
    }
    requiresNewActivation(branchRoot, targetActivity) {
      if (this.branchHasActiveAttempt(branchRoot)) {
        return false;
      }
      if (targetActivity.activityAttemptActive || targetActivity.isActive) {
        return false;
      }
      return true;
    }
    branchHasActiveAttempt(activity) {
      if (activity.activityAttemptActive || activity.isActive) {
        return true;
      }
      for (const child of activity.children) {
        if (this.branchHasActiveAttempt(child)) {
          return true;
        }
      }
      return false;
    }
    /** Helper: mandatory activity detection (mirrors SequencingProcess behavior) */
    helperIsActivityMandatory(activity) {
      if (!activity.isAvailable || activity.isHiddenFromChoice) {
        return false;
      }
      const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
      if (preConditionResult === RuleActionType.SKIP || preConditionResult === RuleActionType.DISABLED || preConditionResult === RuleActionType.HIDE_FROM_CHOICE || preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL) {
        return false;
      }
      if (this.isActivityDisabled(activity)) {
        return false;
      }
      return activity.mandatory !== false;
    }
    /** Helper: completed-state check (mirrors SequencingProcess behavior) */
    helperIsActivityCompleted(activity) {
      if (!activity.isAvailable || activity.isHiddenFromChoice) {
        return true;
      }
      const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
      if (preConditionResult === RuleActionType.SKIP || preConditionResult === RuleActionType.DISABLED || preConditionResult === RuleActionType.HIDE_FROM_CHOICE || preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL) {
        return true;
      }
      if (this.isActivityDisabled(activity)) {
        return true;
      }
      return activity.completionStatus === "completed" || activity.successStatus === "passed" || activity.successStatus === "passed";
    }
    /**
     * Evaluate pre-condition rules for choice navigation
     * @param {Activity} activity - Activity to evaluate
     * @return {string | null} - Rule result or null
     */
    evaluatePreConditionRulesForChoice(activity) {
      if (!activity.sequencingRules) {
        return null;
      }
      const action = activity.sequencingRules.evaluatePreConditionRules(activity);
      if (action) {
        return action;
      }
      return null;
    }
    /**
     * Validate Activity Tree State Consistency
     * Priority 4 Gap: Activity Tree State Consistency
     * @param {Activity} activity - Activity to validate
     * @return {{consistent: boolean, exception: string | null}} - Consistency result
     */
    validateActivityTreeStateConsistency(activity) {
      if (!this.activityTree.root) {
        return {
          consistent: false,
          exception: "DB.1.1-4"
        };
      }
      if (!this.isActivityPartOfTree(activity, this.activityTree.root)) {
        return {
          consistent: false,
          exception: "DB.1.1-5"
        };
      }
      const activeActivities = this.getActiveActivities();
      if (activeActivities.length > 1) {
        this.fireEvent("onStateInconsistency", {
          activeActivities: activeActivities.map(a => a.id),
          targetActivity: activity.id
        });
        return {
          consistent: false,
          exception: "DB.1.1-6"
        };
      }
      let current = activity;
      while (current?.parent) {
        if (!current.parent.children.includes(current)) {
          return {
            consistent: false,
            exception: "DB.1.1-7"
          };
        }
        current = current.parent;
      }
      return {
        consistent: true,
        exception: null
      };
    }
    /**
     * Validate Resource Constraints
     * Priority 4 Gap: Resource Constraint Checking
     * @param {Activity} activity - Activity to validate
     * @return {{available: boolean, exception: string | null}} - Resource availability result
     */
    validateResourceConstraints(activity) {
      const requiredResources = this.getActivityRequiredResources(activity);
      for (const resource of requiredResources) {
        if (!this.isResourceAvailable(resource)) {
          return {
            available: false,
            exception: "DB.1.1-8"
            // Resource not available
          };
        }
      }
      const systemResourceCheck = this.checkSystemResourceLimits();
      if (!systemResourceCheck.adequate) {
        return {
          available: false,
          exception: "DB.1.1-9"
          // Insufficient system resources
        };
      }
      return {
        available: true,
        exception: null
      };
    }
    /**
     * Validate Concurrent Delivery Prevention
     * Priority 4 Gap: Prevent Multiple Simultaneous Deliveries
     * @param {Activity} activity - Activity to validate
     * @return {{allowed: boolean, exception: string | null}} - Concurrency check result
     */
    validateConcurrentDeliveryPrevention(activity) {
      if (this.contentDelivered && this.activityTree.currentActivity && this.activityTree.currentActivity !== activity) {
        return {
          allowed: false,
          exception: "DB.1.1-10"
          // Another activity is currently being delivered
        };
      }
      if (this.hasPendingDeliveryRequests()) {
        return {
          allowed: false,
          exception: "DB.1.1-11"
          // Delivery request already in queue
        };
      }
      if (this.isDeliveryLocked()) {
        return {
          allowed: false,
          exception: "DB.1.1-12"
          // Delivery is currently locked
        };
      }
      return {
        allowed: true,
        exception: null
      };
    }
    /**
     * Validate Activity Dependencies
     * Priority 4 Gap: Dependency Resolution
     * @param {Activity} activity - Activity to validate
     * @return {{satisfied: boolean, exception: string | null}} - Dependency check result
     */
    validateActivityDependencies(activity) {
      const prerequisites = this.getActivityPrerequisites(activity);
      for (const prerequisite of prerequisites) {
        if (!this.isPrerequisiteSatisfied(prerequisite, activity)) {
          return {
            satisfied: false,
            exception: "DB.1.1-13"
            // Prerequisites not satisfied
          };
        }
      }
      const objectiveDependencies = this.getObjectiveDependencies(activity);
      for (const dependency of objectiveDependencies) {
        if (!this.isObjectiveDependencySatisfied(dependency)) {
          return {
            satisfied: false,
            exception: "DB.1.1-14"
            // Objective dependencies not met
          };
        }
      }
      const sequencingDependencies = this.getSequencingRuleDependencies(activity);
      if (!sequencingDependencies.satisfied) {
        return {
          satisfied: false,
          exception: "DB.1.1-15"
          // Sequencing dependencies not met
        };
      }
      return {
        satisfied: true,
        exception: null
      };
    }
    /**
     * Helper methods for delivery request validation
     */
    isActivityPartOfTree(activity, root) {
      if (activity === root) {
        return true;
      }
      for (const child of root.children) {
        if (this.isActivityPartOfTree(activity, child)) {
          return true;
        }
      }
      return false;
    }
    getActiveActivities() {
      const activeActivities = [];
      if (this.activityTree.root) {
        this.collectActiveActivities(this.activityTree.root, activeActivities);
      }
      return activeActivities;
    }
    collectActiveActivities(activity, activeActivities) {
      if (activity.isActive) {
        activeActivities.push(activity);
      }
      for (const child of activity.children) {
        this.collectActiveActivities(child, activeActivities);
      }
    }
    getActivityRequiredResources(activity) {
      const resources = [];
      const activityInfo = (activity.title + " " + activity.location).toLowerCase();
      if (activityInfo.includes("video") || activityInfo.includes("multimedia")) {
        resources.push("video-codec");
      }
      if (activityInfo.includes("audio") || activityInfo.includes("sound")) {
        resources.push("audio-codec");
      }
      if (activityInfo.includes("flash") || activityInfo.includes(".swf")) {
        resources.push("flash-plugin");
      }
      if (activityInfo.includes("java") || activityInfo.includes("applet")) {
        resources.push("java-runtime");
      }
      if (activity.children && activity.children.length > 0) {
        resources.push("high-bandwidth");
      }
      if (activity.attemptAbsoluteDurationLimit && this.parseDurationToMinutes(activity.attemptAbsoluteDurationLimit) > 60) {
        resources.push("extended-storage");
      }
      if (activity.attemptLimit && activity.attemptLimit > 1) {
        resources.push("persistent-storage");
      }
      return resources;
    }
    isResourceAvailable(resource) {
      try {
        switch (resource) {
          case "video-codec":
            return !!document.createElement("video").canPlayType;
          case "audio-codec":
            return !!document.createElement("audio").canPlayType;
          case "flash-plugin":
            return navigator.plugins && Array.from(navigator.plugins).some(plugin => plugin.name === "Shockwave Flash");
          case "java-runtime":
            return navigator.plugins && Array.from(navigator.plugins).some(plugin => plugin.name === "Java");
          case "high-bandwidth":
            if ("connection" in navigator) {
              const connection = navigator.connection;
              return connection.effectiveType === "4g" || connection.downlink > 5;
            }
            return true;
          // Assume available if can't detect
          case "extended-storage":
            return true;
          case "persistent-storage":
            return "localStorage" in window && "sessionStorage" in window;
          default:
            return true;
        }
      } catch (error) {
        return false;
      }
    }
    checkSystemResourceLimits() {
      try {
        let adequate = true;
        if ("memory" in performance) {
          const memory = performance.memory;
          const memoryUsagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
          if (memoryUsagePercent > 0.8) {
            adequate = false;
          }
        }
        if ("deviceMemory" in navigator) {
          const deviceMemory = navigator.deviceMemory;
          if (deviceMemory < 2) {
            adequate = false;
          }
        }
        if ("hardwareConcurrency" in navigator) {
          const cores = navigator.hardwareConcurrency;
          if (cores < 2) {
            adequate = false;
          }
        }
        if ("connection" in navigator) {
          const connection = navigator.connection;
          if (connection.saveData || connection.effectiveType === "slow-2g") {
            adequate = false;
          }
        }
        return {
          adequate
        };
      } catch (error) {
        return {
          adequate: true
        };
      }
    }
    hasPendingDeliveryRequests() {
      if (this.activityTree && this.activityTree.pendingRequests) {
        return this.activityTree.pendingRequests.length > 0;
      }
      if (typeof window !== "undefined" && window.pendingScormRequests) {
        return window.pendingScormRequests > 0;
      }
      if (this.eventCallback) {
        try {
          this.eventCallback("check_pending_requests", {});
        } catch (error) {}
      }
      return false;
    }
    isDeliveryLocked() {
      if (this.activityTree && this.activityTree.navigationLocked) {
        return true;
      }
      if (this.activityTree && this.activityTree.terminationInProgress) {
        return true;
      }
      const resourceCheck = this.checkSystemResourceLimits();
      if (!resourceCheck.adequate) {
        return true;
      }
      return !!(typeof window !== "undefined" && window.scormMaintenanceMode);
    }
    getActivityPrerequisites(activity) {
      const prerequisites = [];
      if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
        for (const rule of activity.sequencingRules.preConditionRules) {
          if (rule.conditions && rule.conditions.length > 0) {
            for (const condition of rule.conditions) {
              if (condition.referencedObjectiveID && condition.referencedObjectiveID !== activity.id) {
                prerequisites.push(condition.referencedObjectiveID);
              }
            }
          }
        }
      }
      if (activity.parent && activity.sequencingControls && !activity.sequencingControls.choiceExit) {
        const siblings = activity.parent.children;
        if (siblings) {
          const activityIndex = siblings.indexOf(activity);
          for (let i = 0; i < activityIndex; i++) {
            const sibling = siblings[i];
            if (sibling) {
              prerequisites.push(sibling.id);
            }
          }
        }
      }
      if (activity.prerequisiteActivities) {
        prerequisites.push(...activity.prerequisiteActivities);
      }
      return Array.from(new Set(prerequisites));
    }
    isPrerequisiteSatisfied(prerequisiteId, _activity) {
      const prerequisite = this.activityTree.getActivity(prerequisiteId);
      if (!prerequisite) {
        return false;
      }
      return prerequisite.completionStatus === "completed";
    }
    getObjectiveDependencies(activity) {
      const dependencies = [];
      const objectives = activity.objectives;
      if (objectives && objectives.length > 0) {
        for (const objective of objectives) {
          if (objective.globalObjectiveID) {
            dependencies.push(objective.globalObjectiveID);
          }
          if (!objective.satisfiedByMeasure && objective.readNormalizedMeasure) {
            dependencies.push(objective.id + "_measure");
          }
        }
      }
      if (activity.sequencingRules) {
        const allRules = [...(activity.sequencingRules.preConditionRules || []), ...(activity.sequencingRules.exitConditionRules || []), ...(activity.sequencingRules.postConditionRules || [])];
        for (const rule of allRules) {
          if (rule.conditions && rule.conditions.length > 0) {
            for (const condition of rule.conditions) {
              if (condition.objectiveReference && condition.objectiveReference !== activity.id) {
                dependencies.push(condition.objectiveReference);
              }
            }
          }
        }
      }
      return Array.from(new Set(dependencies));
    }
    isObjectiveDependencySatisfied(objectiveId) {
      if (this.activityTree && this.activityTree.globalObjectives) {
        const globalObjectives = this.activityTree.globalObjectives;
        const globalObjective = globalObjectives[objectiveId];
        if (globalObjective) {
          return globalObjective.satisfied === true && globalObjective.statusKnown === true;
        }
      }
      if (objectiveId.endsWith("_measure")) {
        const baseObjectiveId = objectiveId.replace("_measure", "");
        if (this.activityTree && this.activityTree.globalObjectives) {
          const globalObjectives = this.activityTree.globalObjectives;
          const globalObjective = globalObjectives[baseObjectiveId];
          if (globalObjective) {
            return globalObjective.measureKnown === true && globalObjective.normalizedMeasure >= 0;
          }
        }
      }
      const referencedActivity = this.activityTree.getActivity(objectiveId);
      if (referencedActivity) {
        return referencedActivity.objectiveSatisfiedStatus && referencedActivity.objectiveMeasureStatus;
      }
      return false;
    }
    getSequencingRuleDependencies(activity) {
      let satisfied = true;
      try {
        if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
          for (const rule of activity.sequencingRules.preConditionRules) {
            if (rule.conditions && rule.conditions.length > 0) {
              for (const condition of rule.conditions) {
                const conditionType = condition.conditionType || condition.condition;
                switch (conditionType) {
                  case "activityProgressKnown":
                    if (!activity.progressMeasureStatus) satisfied = false;
                    break;
                  case "objectiveStatusKnown":
                  case "objectiveSatisfied":
                    {
                      const objectiveId = condition.referencedObjectiveID || activity.id;
                      if (!this.isObjectiveDependencySatisfied(objectiveId)) satisfied = false;
                      break;
                    }
                  case "attemptLimitExceeded":
                    if (activity.attemptLimit === null) satisfied = false;
                    break;
                  case "timeLimitExceeded":
                    if (!activity.attemptAbsoluteDurationLimit && !activity.activityAbsoluteDurationLimit) satisfied = false;
                    break;
                  case "always":
                  case "never":
                    break;
                  default:
                    satisfied = false;
                }
              }
            }
          }
        }
        if (activity.sequencingRules && activity.sequencingRules.exitConditionRules) {
          for (const rule of activity.sequencingRules.exitConditionRules) {
            if (rule.conditions && rule.conditions.length > 0) {
              for (const condition of rule.conditions) {
                const conditionType = condition.conditionType || condition.condition;
                if (["objectiveStatusKnown", "objectiveSatisfied"].includes(conditionType)) {
                  const objectiveId = condition.referencedObjectiveID || activity.id;
                  if (!this.isObjectiveDependencySatisfied(objectiveId)) satisfied = false;
                }
              }
            }
          }
        }
        if (activity.rollupRules && activity.rollupRules.rules) {
          for (const rule of activity.rollupRules.rules) {
            if (rule.conditions && rule.conditions.length > 0) {
              if (activity.children && activity.children.length > 0) {
                for (const child of activity.children) {
                  if (!child.isCompleted) {
                    satisfied = false;
                    break;
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        satisfied = false;
      }
      return {
        satisfied
      };
    }
    /**
     * Helper method to parse ISO 8601 duration to minutes
     */
    parseDurationToMinutes(duration) {
      return getDurationAsSeconds(duration, scorm2004_regex.CMITimespan) / 60;
    }
    /**
     * INTEGRATION: Initialize Global Objective Map
     * Sets up the global objective map for cross-activity objective synchronization
     */
    initializeGlobalObjectiveMap() {
      try {
        this.globalObjectiveMap.clear();
        if (this.activityTree.root) {
          this.collectGlobalObjectives(this.activityTree.root);
        }
        this.fireEvent("onGlobalObjectiveMapInitialized", {
          objectiveCount: this.globalObjectiveMap.size,
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      } catch (error) {
        this.fireEvent("onGlobalObjectiveMapError", {
          error: error instanceof Error ? error.message : String(error),
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      }
    }
    /**
     * INTEGRATION: Collect Global Objectives
     * Recursively collects global objectives from the activity tree
     * @param {Activity} activity - Activity to collect objectives from
     */
    collectGlobalObjectives(activity) {
      const objectives = activity.getAllObjectives();
      if (objectives.length === 0) {
        const defaultId = `${activity.id}_default_objective`;
        if (!this.globalObjectiveMap.has(defaultId)) {
          this.globalObjectiveMap.set(defaultId, {
            id: defaultId,
            satisfiedStatus: activity.objectiveSatisfiedStatus,
            satisfiedStatusKnown: activity.objectiveMeasureStatus,
            normalizedMeasure: activity.objectiveNormalizedMeasure,
            normalizedMeasureKnown: activity.objectiveMeasureStatus,
            progressMeasure: activity.progressMeasure,
            progressMeasureKnown: activity.progressMeasureStatus,
            completionStatus: activity.completionStatus,
            completionStatusKnown: activity.completionStatus !== CompletionStatus.UNKNOWN,
            readSatisfiedStatus: true,
            writeSatisfiedStatus: true,
            readNormalizedMeasure: true,
            writeNormalizedMeasure: true,
            readCompletionStatus: true,
            writeCompletionStatus: true,
            readProgressMeasure: true,
            writeProgressMeasure: true,
            satisfiedByMeasure: activity.scaledPassingScore !== null,
            minNormalizedMeasure: activity.scaledPassingScore,
            updateAttemptData: true
          });
        }
      }
      for (const objective of objectives) {
        const mapInfos = objective.mapInfo.length > 0 ? objective.mapInfo : [{
          targetObjectiveID: objective.id,
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true,
          readProgressMeasure: true,
          writeProgressMeasure: true,
          readCompletionStatus: true,
          writeCompletionStatus: true,
          updateAttemptData: objective.isPrimary
        }];
        for (const mapInfo of mapInfos) {
          const targetId = mapInfo.targetObjectiveID || objective.id;
          if (!this.globalObjectiveMap.has(targetId)) {
            this.globalObjectiveMap.set(targetId, {
              id: targetId,
              satisfiedStatus: objective.satisfiedStatus,
              satisfiedStatusKnown: objective.measureStatus,
              normalizedMeasure: objective.normalizedMeasure,
              normalizedMeasureKnown: objective.measureStatus,
              progressMeasure: objective.progressMeasure,
              progressMeasureKnown: objective.progressMeasureStatus,
              completionStatus: objective.completionStatus,
              completionStatusKnown: objective.completionStatus !== CompletionStatus.UNKNOWN,
              readSatisfiedStatus: mapInfo.readSatisfiedStatus ?? false,
              writeSatisfiedStatus: mapInfo.writeSatisfiedStatus ?? false,
              readNormalizedMeasure: mapInfo.readNormalizedMeasure ?? false,
              writeNormalizedMeasure: mapInfo.writeNormalizedMeasure ?? false,
              readProgressMeasure: mapInfo.readProgressMeasure ?? false,
              writeProgressMeasure: mapInfo.writeProgressMeasure ?? false,
              readCompletionStatus: mapInfo.readCompletionStatus ?? false,
              writeCompletionStatus: mapInfo.writeCompletionStatus ?? false,
              readRawScore: mapInfo.readRawScore ?? false,
              writeRawScore: mapInfo.writeRawScore ?? false,
              readMinScore: mapInfo.readMinScore ?? false,
              writeMinScore: mapInfo.writeMinScore ?? false,
              readMaxScore: mapInfo.readMaxScore ?? false,
              writeMaxScore: mapInfo.writeMaxScore ?? false,
              satisfiedByMeasure: objective.satisfiedByMeasure,
              minNormalizedMeasure: objective.minNormalizedMeasure,
              updateAttemptData: mapInfo.updateAttemptData ?? objective.isPrimary
            });
          }
        }
      }
      for (const child of activity.children) {
        this.collectGlobalObjectives(child);
      }
    }
    /**
     * INTEGRATION: Get Global Objective Map
     * Returns the current global objective map for external access
     * @return {Map<string, any>} - Current global objective map
     */
    getGlobalObjectiveMap() {
      return this.globalObjectiveMap;
    }
    /**
     * INTEGRATION: Snapshot the Global Objective Map
     * Provides a serializable copy for persistence consumers
     * @return {Record<string, any>} - Plain-object snapshot of global objectives
     */
    getGlobalObjectiveMapSnapshot() {
      return this.serializeGlobalObjectiveMap();
    }
    /**
     * INTEGRATION: Restore Global Objective Map
     * Replaces the current map contents with persisted data
     * @param {Record<string, any>} snapshot - Serialized global objective map
     */
    restoreGlobalObjectiveMapSnapshot(snapshot) {
      this.restoreGlobalObjectiveMap(snapshot);
    }
    /**
     * INTEGRATION: Update Global Objective
     * Updates a specific global objective with new data
     * @param {string} objectiveId - Objective ID to update
     * @param {any} objectiveData - New objective data
     */
    updateGlobalObjective(objectiveId, objectiveData) {
      try {
        this.globalObjectiveMap.set(objectiveId, {
          ...this.globalObjectiveMap.get(objectiveId),
          ...objectiveData,
          lastUpdated: (/* @__PURE__ */new Date()).toISOString()
        });
        this.fireEvent("onGlobalObjectiveUpdated", {
          objectiveId,
          data: objectiveData,
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      } catch (error) {
        this.fireEvent("onGlobalObjectiveUpdateError", {
          objectiveId,
          error: error instanceof Error ? error.message : String(error),
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      }
    }
    serializeGlobalObjectiveMap() {
      const serialized = {};
      this.globalObjectiveMap.forEach((data, id) => {
        serialized[id] = {
          ...data
        };
      });
      return serialized;
    }
    restoreGlobalObjectiveMap(mapData) {
      this.globalObjectiveMap.clear();
      if (!mapData) {
        return;
      }
      for (const [id, data] of Object.entries(mapData)) {
        this.globalObjectiveMap.set(id, {
          ...data
        });
      }
    }
    /**
     * Get complete suspension state including activity tree and global objectives
     * Captures all state needed to restore sequencing after suspend/resume
     * @return {object} - Complete suspension state
     */
    getSuspensionState() {
      const state = {
        activityTree: this.activityTree.root ? this.activityTree.root.getSuspensionState() : null,
        currentActivityId: this.activityTree.currentActivity?.id || null,
        suspendedActivityId: this.activityTree.suspendedActivity?.id || null,
        globalObjectives: this.serializeGlobalObjectiveMap(),
        timestamp: (/* @__PURE__ */new Date()).toISOString()
      };
      this.fireEvent("onSuspensionStateCaptured", {
        hasActivityTree: !!state.activityTree,
        currentActivityId: state.currentActivityId,
        suspendedActivityId: state.suspendedActivityId,
        globalObjectiveCount: Object.keys(state.globalObjectives).length,
        timestamp: state.timestamp
      });
      return state;
    }
    /**
     * Restore complete suspension state including activity tree and global objectives
     * Restores all state needed to resume from suspended state
     * @param {any} state - Suspension state to restore
     */
    restoreSuspensionState(state) {
      if (!state) {
        this.fireEvent("onSuspensionStateRestoreError", {
          error: "No suspension state provided",
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
        return;
      }
      try {
        if (state.globalObjectives) {
          this.restoreGlobalObjectiveMap(state.globalObjectives);
        }
        if (state.activityTree && this.activityTree.root) {
          this.activityTree.root.restoreSuspensionState(state.activityTree);
        }
        if (state.currentActivityId) {
          const currentActivity = this.activityTree.getActivity(state.currentActivityId);
          if (currentActivity) {
            this.activityTree.currentActivity = currentActivity;
          }
        }
        if (state.suspendedActivityId) {
          const suspendedActivity = this.activityTree.getActivity(state.suspendedActivityId);
          if (suspendedActivity) {
            this.activityTree.suspendedActivity = suspendedActivity;
          }
        }
        this.fireEvent("onSuspensionStateRestored", {
          currentActivityId: state.currentActivityId,
          suspendedActivityId: state.suspendedActivityId,
          globalObjectiveCount: state.globalObjectives ? Object.keys(state.globalObjectives).length : 0,
          originalTimestamp: state.timestamp,
          restoreTimestamp: (/* @__PURE__ */new Date()).toISOString()
        });
      } catch (error) {
        this.fireEvent("onSuspensionStateRestoreError", {
          error: error instanceof Error ? error.message : String(error),
          timestamp: (/* @__PURE__ */new Date()).toISOString()
        });
        throw error;
      }
    }
    /**
     * Get navigation look-ahead predictions
     * Provides UI with navigation button states before user interaction
     * @return {NavigationPredictions} - Current navigation predictions
     */
    getNavigationLookAhead() {
      return this.navigationLookAhead.getAllPredictions();
    }
    /**
     * Predict if Continue navigation would succeed
     * @return {boolean} - True if Continue would succeed
     */
    predictContinueEnabled() {
      return this.navigationLookAhead.predictContinueEnabled();
    }
    /**
     * Predict if Previous navigation would succeed
     * @return {boolean} - True if Previous would succeed
     */
    predictPreviousEnabled() {
      return this.navigationLookAhead.predictPreviousEnabled();
    }
    /**
     * Predict if choice to specific activity would succeed
     * @param {string} activityId - Target activity ID
     * @return {boolean} - True if choice would succeed
     */
    predictChoiceEnabled(activityId) {
      return this.navigationLookAhead.predictChoiceEnabled(activityId);
    }
    /**
     * Get list of all activities that can be chosen
     * @return {string[]} - Array of activity IDs available for choice
     */
    getAvailableChoices() {
      return this.navigationLookAhead.getAvailableChoices();
    }
    /**
     * Invalidate navigation prediction cache
     * Called when state changes that affect navigation
     */
    invalidateNavigationCache() {
      this.navigationLookAhead.invalidateCache();
    }
    /**
     * Apply delivery controls for auto-completion and auto-satisfaction
     * This method implements the completionSetByContent and objectiveSetByContent
     * delivery controls as specified in SCORM 2004 Section 11.
     *
     * When completionSetByContent is false and the content doesn't set completion
     * status, the LMS should automatically mark the activity as completed.
     *
     * When objectiveSetByContent is false and the content doesn't set success
     * status, the LMS should automatically mark the activity as satisfied (passed).
     *
     * @param {Activity} activity - The activity to apply delivery controls to
     */
    applyDeliveryControls(activity) {
      if (!activity.sequencingControls.completionSetByContent) {
        if (activity.completionStatus === CompletionStatus.UNKNOWN) {
          activity.completionStatus = CompletionStatus.COMPLETED;
          activity.wasAutoCompleted = true;
        }
      }
      if (!activity.sequencingControls.objectiveSetByContent) {
        if (activity.successStatus === SuccessStatus.UNKNOWN) {
          activity.successStatus = SuccessStatus.PASSED;
          activity.wasAutoSatisfied = true;
        }
      }
    }
  };
  _OverallSequencingProcess.HIDE_LMS_UI_ORDER = [...HIDE_LMS_UI_TOKENS];
  let OverallSequencingProcess = _OverallSequencingProcess;

  class ActivityDeliveryService {
    constructor(eventService, loggingService) {
      let callbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this.currentDeliveredActivity = null;
      this.pendingDelivery = null;
      this.eventService = eventService;
      this.loggingService = loggingService;
      this.callbacks = callbacks;
    }
    /**
     * Process a sequencing result and handle activity delivery
     * @param {SequencingResult} result - The sequencing result to process
     */
    processSequencingResult(result) {
      if (result.exception) {
        this.loggingService.error(`Sequencing error: ${result.exception}`);
        this.callbacks.onSequencingError?.(result.exception);
        return;
      }
      if (result.deliveryRequest === DeliveryRequestType.DELIVER && result.targetActivity) {
        this.deliverActivity(result.targetActivity);
      } else {
        this.loggingService.info("Sequencing completed with no delivery request");
      }
      this.callbacks.onSequencingComplete?.(result);
    }
    /**
     * Deliver an activity
     * @param {Activity} activity - The activity to deliver
     */
    deliverActivity(activity) {
      if (this.currentDeliveredActivity && this.currentDeliveredActivity !== activity) {
        this.unloadActivity(this.currentDeliveredActivity);
      }
      this.pendingDelivery = activity;
      this.loggingService.info(`Delivering activity: ${activity.id} - ${activity.title}`);
      this.eventService.processListeners("ActivityDelivery", activity.id, activity);
      this.callbacks.onDeliverActivity?.(activity);
      this.currentDeliveredActivity = activity;
      this.pendingDelivery = null;
      activity.isActive = true;
    }
    /**
     * Unload an activity
     * @param {Activity} activity - The activity to unload
     */
    unloadActivity(activity) {
      this.loggingService.info(`Unloading activity: ${activity.id} - ${activity.title}`);
      this.eventService.processListeners("ActivityUnload", activity.id, activity);
      this.callbacks.onUnloadActivity?.(activity);
      activity.isActive = false;
    }
    /**
     * Get the currently delivered activity
     * @return {Activity | null}
     */
    getCurrentDeliveredActivity() {
      return this.currentDeliveredActivity;
    }
    /**
     * Get the pending delivery activity
     * @return {Activity | null}
     */
    getPendingDelivery() {
      return this.pendingDelivery;
    }
    /**
     * Update delivery callbacks
     * @param {ActivityDeliveryCallbacks} callbacks - The new callbacks
     */
    updateCallbacks(callbacks) {
      this.callbacks = {
        ...this.callbacks,
        ...callbacks
      };
    }
    /**
     * Reset the delivery service
     */
    reset() {
      if (this.currentDeliveredActivity) {
        this.unloadActivity(this.currentDeliveredActivity);
      }
      this.currentDeliveredActivity = null;
      this.pendingDelivery = null;
    }
  }

  class SequencingService {
    constructor(sequencing, cmi, adl, eventService, loggingService) {
      let configuration = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
      this.overallSequencingProcess = null;
      this.sequencingProcess = null;
      this.eventListeners = {};
      this.isInitialized = false;
      this.isSequencingActive = false;
      this.lastCMIValues = /* @__PURE__ */new Map();
      this.lastSequencingResult = null;
      this.sequencing = sequencing;
      this.cmi = cmi;
      this.adl = adl;
      this.eventService = eventService;
      this.loggingService = loggingService;
      this.configuration = {
        autoRollupOnCMIChange: true,
        autoProgressOnCompletion: false,
        validateNavigationRequests: true,
        enableEventSystem: true,
        logLevel: "info",
        now: () => /* @__PURE__ */new Date(),
        ...configuration
      };
      const deliveryCallbacks = {
        onDeliverActivity: activity => this.handleActivityDelivery(activity),
        onUnloadActivity: activity => this.handleActivityUnload(activity),
        onSequencingComplete: result => this.handleSequencingComplete(result),
        onSequencingError: error => this.handleSequencingError(error)
      };
      this.activityDeliveryService = new ActivityDeliveryService(eventService, loggingService, deliveryCallbacks);
      this.rollupProcess = new RollupProcess();
      if (this.configuration.now) {
        RuleCondition.setNowProvider(this.configuration.now);
      }
      this.setupCMIChangeWatchers();
      this.createSequencingProcesses();
    }
    /**
     * Create sequencing processes
     * Called from constructor to enable navigation before SCO Initialize
     */
    createSequencingProcesses() {
      try {
        if (!this.sequencing.initialized) {
          this.sequencing.initialize();
        }
        this.sequencing.adlNav = this.adl.nav;
        if (this.sequencing.activityTree.root) {
          const seqOptions = {};
          if (this.configuration.now) seqOptions.now = this.configuration.now;
          if (this.configuration.getAttemptElapsedSeconds) seqOptions.getAttemptElapsedSeconds = this.configuration.getAttemptElapsedSeconds;
          if (this.configuration.getActivityElapsedSeconds) seqOptions.getActivityElapsedSeconds = this.configuration.getActivityElapsedSeconds;
          this.sequencingProcess = new SequencingProcess(this.sequencing.activityTree, this.sequencing.sequencingRules, this.sequencing.sequencingControls, this.adl.nav, seqOptions);
          const overallOptions = {};
          if (this.configuration.now) overallOptions.now = this.configuration.now;
          overallOptions.defaultHideLmsUi = [...this.sequencing.hideLmsUi];
          if (this.sequencing.auxiliaryResources.length > 0) {
            overallOptions.defaultAuxiliaryResources = this.sequencing.auxiliaryResources.map(resource => ({
              resourceId: resource.resourceId,
              purpose: resource.purpose
            }));
          }
          overallOptions.getCMIData = () => this.getCMIDataForTransfer();
          this.overallSequencingProcess = new OverallSequencingProcess(this.sequencing.activityTree, this.sequencingProcess, this.rollupProcess, this.adl.nav, (eventType, data) => this.handleSequencingProcessEvent(eventType, data), overallOptions);
          this.sequencing.overallSequencingProcess = this.overallSequencingProcess;
          this.isInitialized = true;
          this.log("info", "Sequencing processes created and ready for navigation");
        }
      } catch (error) {
        this.log("error", `Failed to create sequencing processes: ${error}`);
      }
    }
    /**
     * Initialize the sequencing service
     * Called when SCORM API Initialize() is called
     * Note: Sequencing processes are created in constructor to enable pre-SCO navigation
     */
    initialize() {
      try {
        this.log("info", "Initializing sequencing service for SCO session");
        if (!this.isInitialized) {
          this.createSequencingProcesses();
        }
        if (this.shouldAutoStartSequencing() && !this.isSequencingActive) {
          this.startSequencing();
        }
        this.initializeCMITracking();
        this.fireEvent("onSequencingStart", this.sequencing.getCurrentActivity());
        this.log("info", "Sequencing service initialized successfully");
        return global_constants.SCORM_TRUE;
      } catch (error) {
        const errorMsg = `Failed to initialize sequencing service: ${error}`;
        this.log("error", errorMsg);
        this.fireEvent("onSequencingError", errorMsg, "initialization");
        return global_constants.SCORM_FALSE;
      }
    }
    /**
     * Terminate the sequencing service
     * Called when SCORM API Terminate() is called
     */
    terminate() {
      try {
        this.log("info", "Terminating sequencing service");
        this.triggerFinalRollup();
        this.endSequencing();
        this.isInitialized = false;
        this.fireEvent("onSequencingEnd");
        this.log("info", "Sequencing service terminated successfully");
        return global_constants.SCORM_TRUE;
      } catch (error) {
        const errorMsg = `Failed to terminate sequencing service: ${error}`;
        this.log("error", errorMsg);
        this.fireEvent("onSequencingError", errorMsg, "termination");
        return global_constants.SCORM_FALSE;
      }
    }
    /**
     * Process a navigation request
     * Implements the complete Overall Sequencing Process (OP.1)
     * @param {string} request - The navigation request
     * @param {string} targetActivityId - Optional target activity ID for choice/jump requests
     * @param {string} exitType - Optional cmi.exit value (logout, normal, suspend, time-out, or empty)
     */
    processNavigationRequest(request, targetActivityId, exitType) {
      if (!this.isInitialized || !this.overallSequencingProcess) {
        this.log("warn", `Navigation request '${request}' ignored - sequencing not initialized`);
        return false;
      }
      try {
        this.log("info", `Processing navigation request: ${request}${targetActivityId ? ` (target: ${targetActivityId})` : ""}${exitType ? ` (exit: ${exitType})` : ""}`);
        this.fireEvent("onNavigationRequest", request, targetActivityId);
        const navRequestType = this.parseNavigationRequest(request);
        if (navRequestType === null) {
          this.log("warn", `Invalid navigation request: ${request}`);
          return false;
        }
        const deliveryRequest = this.overallSequencingProcess.processNavigationRequest(navRequestType, targetActivityId || null, exitType);
        const sequencingResult = {
          deliveryRequest: deliveryRequest.valid ? DeliveryRequestType.DELIVER : DeliveryRequestType.DO_NOT_DELIVER,
          targetActivity: deliveryRequest.targetActivity,
          exception: deliveryRequest.exception || null,
          endSequencingSession: false
        };
        this.lastSequencingResult = sequencingResult;
        if (deliveryRequest.valid && deliveryRequest.targetActivity) {
          this.activityDeliveryService.processSequencingResult(sequencingResult);
          this.overallSequencingProcess.updateNavigationValidity();
          this.log("info", `Navigation request '${request}' resulted in activity delivery: ${deliveryRequest.targetActivity.id}`);
          return true;
        } else {
          if (deliveryRequest.exception) {
            this.log("warn", `Navigation request '${request}' failed: ${deliveryRequest.exception}`);
            this.fireEvent("onSequencingError", deliveryRequest.exception, "navigation");
          } else {
            this.log("info", `Navigation request '${request}' completed with no activity delivery`);
          }
          return deliveryRequest.valid;
        }
      } catch (error) {
        const errorMsg = `Error processing navigation request '${request}': ${error}`;
        this.log("error", errorMsg);
        this.fireEvent("onSequencingError", errorMsg, "navigation");
        return false;
      }
    }
    /**
     * Trigger rollup when CMI values change
     * Called automatically when tracked CMI values are updated
     */
    triggerRollupOnCMIChange(cmiElement, oldValue, newValue) {
      if (!this.configuration.autoRollupOnCMIChange || !this.isInitialized) {
        return;
      }
      const rollupTriggeringElements = ["cmi.completion_status", "cmi.success_status", "cmi.score.scaled", "cmi.score.raw", "cmi.score.min", "cmi.score.max", "cmi.progress_measure", "cmi.objectives.n.success_status", "cmi.objectives.n.completion_status", "cmi.objectives.n.score.scaled"];
      if (!rollupTriggeringElements.some(element => cmiElement.startsWith(element))) {
        return;
      }
      try {
        this.log("debug", `Triggering rollup due to CMI change: ${cmiElement} = ${newValue} (was ${oldValue})`);
        const currentActivity = this.sequencing.getCurrentActivity();
        if (!currentActivity) {
          this.log("debug", "No current activity for rollup");
          return;
        }
        this.updateActivityFromCMI(currentActivity);
        this.rollupProcess.overallRollupProcess(currentActivity);
        if (this.overallSequencingProcess) {
          this.overallSequencingProcess.synchronizeGlobalObjectives();
        }
        if (this.overallSequencingProcess) {
          this.overallSequencingProcess.updateNavigationValidity();
        }
        this.fireEvent("onRollupComplete", currentActivity);
        this.log("debug", `Rollup completed for activity: ${currentActivity.id}`);
      } catch (error) {
        const errorMsg = `Error during rollup on CMI change: ${error}`;
        this.log("error", errorMsg);
        this.fireEvent("onSequencingError", errorMsg, "rollup");
      }
    }
    /**
     * Set event listeners for sequencing events
     */
    setEventListeners(listeners) {
      this.eventListeners = {
        ...this.eventListeners,
        ...listeners
      };
      this.log("debug", "Sequencing event listeners updated");
    }
    /**
     * Update sequencing configuration
     */
    updateConfiguration(config) {
      this.configuration = {
        ...this.configuration,
        ...config
      };
      this.log("debug", "Sequencing configuration updated");
    }
    /**
     * Get the current sequencing state
     */
    getSequencingState() {
      return {
        isInitialized: this.isInitialized,
        isActive: this.isSequencingActive,
        currentActivity: this.sequencing.getCurrentActivity(),
        rootActivity: this.sequencing.getRootActivity(),
        lastSequencingResult: this.lastSequencingResult
      };
    }
    /**
     * Get the overall sequencing process instance
     * @return {OverallSequencingProcess | null} The overall sequencing process or null if not initialized
     */
    getOverallSequencingProcess() {
      return this.overallSequencingProcess;
    }
    /**
     * Check if content delivery is currently in progress
     * Used to prevent re-entrant termination requests during delivery
     * @return {boolean} True if delivery is in progress
     */
    isDeliveryInProgress() {
      return this.overallSequencingProcess?.isDeliveryInProgress() ?? false;
    }
    // Private helper methods
    /**
     * Set up watchers for CMI value changes
     */
    setupCMIChangeWatchers() {}
    /**
     * Initialize CMI tracking by storing current values
     */
    initializeCMITracking() {
      this.lastCMIValues.set("cmi.completion_status", this.cmi.completion_status);
      this.lastCMIValues.set("cmi.success_status", this.cmi.success_status);
      this.lastCMIValues.set("cmi.progress_measure", this.cmi.progress_measure);
      if (this.cmi.score) {
        this.lastCMIValues.set("cmi.score.scaled", this.cmi.score.scaled);
        this.lastCMIValues.set("cmi.score.raw", this.cmi.score.raw);
      }
    }
    /**
     * Check if sequencing should auto-start
     */
    shouldAutoStartSequencing() {
      return !!(this.sequencing.activityTree.root && !this.sequencing.getCurrentActivity());
    }
    /**
     * Start automatic sequencing
     */
    startSequencing() {
      if (!this.overallSequencingProcess) {
        return;
      }
      try {
        const startResult = this.processNavigationRequest("start");
        if (startResult) {
          this.isSequencingActive = true;
          this.log("info", "Automatic sequencing started");
        }
      } catch (error) {
        this.log("error", `Failed to start automatic sequencing: ${error}`);
      }
    }
    /**
     * End sequencing session
     */
    endSequencing() {
      this.isSequencingActive = false;
      this.activityDeliveryService.reset();
    }
    /**
     * Trigger final rollup on termination
     */
    triggerFinalRollup() {
      try {
        const currentActivity = this.sequencing.getCurrentActivity();
        if (currentActivity) {
          this.updateActivityFromCMI(currentActivity);
          this.rollupProcess.overallRollupProcess(currentActivity);
          if (this.overallSequencingProcess) {
            this.overallSequencingProcess.synchronizeGlobalObjectives();
          }
          this.log("info", "Final rollup completed");
        }
      } catch (error) {
        this.log("error", `Error during final rollup: ${error}`);
      }
    }
    /**
     * Update activity properties from current CMI values
     */
    updateActivityFromCMI(activity) {
      if (this.cmi.completion_status !== "unknown") {
        activity.completionStatus = this.cmi.completion_status;
        activity.attemptProgressStatus = true;
      }
      if (this.cmi.success_status !== "unknown") {
        activity.successStatus = this.cmi.success_status;
        activity.objectiveSatisfiedStatus = this.cmi.success_status === "passed";
        activity.objectiveMeasureStatus = true;
        if (activity.primaryObjective) {
          activity.primaryObjective.progressStatus = true;
        }
      }
      if (this.cmi.progress_measure !== "") {
        const progressMeasure = parseFloat(this.cmi.progress_measure);
        if (!isNaN(progressMeasure)) {
          activity.progressMeasure = progressMeasure;
          activity.progressMeasureStatus = true;
        }
      }
      if (this.cmi.score && this.cmi.score.scaled !== "") {
        const scaledScore = parseFloat(this.cmi.score.scaled);
        if (!isNaN(scaledScore)) {
          activity.objectiveNormalizedMeasure = scaledScore;
          activity.objectiveMeasureStatus = true;
          if (activity.primaryObjective) {
            activity.primaryObjective.progressStatus = true;
          }
        }
      }
      if (activity.primaryObjective) {
        activity.primaryObjective.updateFromActivity(activity);
      }
    }
    /**
     * Get CMI data for RTE data transfer to activity state
     * This method provides all CMI data to the sequencing process for transfer
     * @return {Object} - CMI data formatted for transfer
     */
    getCMIDataForTransfer() {
      const cmiData = {
        completion_status: this.cmi.completion_status,
        success_status: this.cmi.success_status,
        progress_measure: this.cmi.progress_measure,
        score: {
          scaled: this.cmi.score?.scaled || "",
          raw: this.cmi.score?.raw || "",
          min: this.cmi.score?.min || "",
          max: this.cmi.score?.max || ""
        },
        objectives: []
      };
      if (this.cmi.objectives && this.cmi.objectives.childArray) {
        for (const baseCmiObj of this.cmi.objectives.childArray) {
          const cmiObjective = baseCmiObj;
          if (cmiObjective.id) {
            cmiData.objectives.push({
              id: cmiObjective.id,
              success_status: cmiObjective.success_status,
              completion_status: cmiObjective.completion_status,
              progress_measure: cmiObjective.progress_measure,
              score: {
                scaled: cmiObjective.score?.scaled || "",
                raw: cmiObjective.score?.raw || "",
                min: cmiObjective.score?.min || "",
                max: cmiObjective.score?.max || ""
              }
            });
          }
        }
      }
      return cmiData;
    }
    /**
     * Parse navigation request string to NavigationRequestType
     */
    parseNavigationRequest(request) {
      let normalizedRequest = request;
      if (normalizedRequest.startsWith("_") && normalizedRequest !== "_none_") {
        normalizedRequest = normalizedRequest.substring(1);
      }
      if (request.includes("choice")) {
        return NavigationRequestType.CHOICE;
      }
      if (request.includes("jump")) {
        return NavigationRequestType.JUMP;
      }
      switch (normalizedRequest) {
        case "start":
          return NavigationRequestType.START;
        case "resumeAll":
          return NavigationRequestType.RESUME_ALL;
        case "continue":
          return NavigationRequestType.CONTINUE;
        case "previous":
          return NavigationRequestType.PREVIOUS;
        case "exit":
          return NavigationRequestType.EXIT;
        case "exitAll":
          return NavigationRequestType.EXIT_ALL;
        case "abandon":
          return NavigationRequestType.ABANDON;
        case "abandonAll":
          return NavigationRequestType.ABANDON_ALL;
        case "suspendAll":
          return NavigationRequestType.SUSPEND_ALL;
        case "_none_":
          return NavigationRequestType.NOT_VALID;
        default:
          return null;
      }
    }
    /**
     * Handle activity delivery event
     */
    handleActivityDelivery(activity) {
      this.log("info", `Activity delivered: ${activity.id} - ${activity.title}`);
      this.fireEvent("onActivityDelivery", activity);
    }
    /**
     * Handle activity unload event
     */
    handleActivityUnload(activity) {
      this.log("info", `Activity unloaded: ${activity.id} - ${activity.title}`);
      this.fireEvent("onActivityUnload", activity);
    }
    /**
     * Handle sequencing completion event
     */
    handleSequencingComplete(result) {
      this.log("debug", "Sequencing completed", result);
    }
    /**
     * Handle sequencing error event
     */
    handleSequencingError(error) {
      this.log("error", `Sequencing error: ${error}`);
      this.fireEvent("onSequencingError", error, "sequencing");
    }
    /**
     * Fire an event to registered listeners with enhanced error handling
     */
    fireEvent(eventType) {
      if (!this.configuration.enableEventSystem) {
        return;
      }
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      if (eventType !== "onSequencingDebug") {
        this.fireDebugEvent(`${eventType} fired`, {
          eventType,
          argsLength: args.length
        });
      }
      try {
        const listener = this.eventListeners[eventType];
        if (listener && typeof listener === "function") {
          try {
            listener(...args);
            this.log("debug", `Internal listener for ${eventType} executed successfully`);
          } catch (listenerError) {
            this.log("error", `Internal listener for ${eventType} failed: ${listenerError}`);
          }
        }
        try {
          this.eventService.processListeners(`Sequencing.${eventType}`, args[0], ...args.slice(1));
          this.log("debug", `Event service listeners for ${eventType} processed`);
        } catch (eventServiceError) {
          this.log("warn", `Event service failed for ${eventType}: ${eventServiceError}`);
        }
        try {
          if (typeof window !== "undefined" && window.scormSequencingEvents) {
            const globalListeners = window.scormSequencingEvents;
            if (globalListeners[eventType] && typeof globalListeners[eventType] === "function") {
              globalListeners[eventType](...args);
              this.log("debug", `Global listener for ${eventType} executed`);
            }
          }
        } catch (globalError) {
          this.log("warn", `Global listener for ${eventType} failed: ${globalError}`);
        }
      } catch (error) {
        this.log("error", `Critical error firing event ${eventType}: ${error}`);
      }
    }
    /**
     * Fire a debug event with detailed information
     */
    fireDebugEvent(event, data) {
      try {
        const listener = this.eventListeners["onSequencingDebug"];
        if (listener && typeof listener === "function") {
          listener(event, {
            timestamp: (/* @__PURE__ */new Date()).toISOString(),
            ...data
          });
        }
        try {
          this.eventService.processListeners("Sequencing.onSequencingDebug", event, {
            timestamp: (/* @__PURE__ */new Date()).toISOString(),
            ...data
          });
        } catch (eventServiceError) {}
      } catch (error) {
        console.debug(`Debug event failed: ${error}`);
      }
    }
    /**
     * Fire activity attempt start event
     */
    fireActivityAttemptStart(activity) {
      this.fireEvent("onActivityAttemptStart", activity);
      this.fireDebugEvent("Activity attempt started", {
        activityId: activity.id,
        title: activity.title,
        attemptCount: activity.attemptCount
      });
    }
    /**
     * Fire activity attempt end event
     */
    fireActivityAttemptEnd(activity) {
      this.fireEvent("onActivityAttemptEnd", activity);
      this.fireDebugEvent("Activity attempt ended", {
        activityId: activity.id,
        title: activity.title,
        completionStatus: activity.completionStatus,
        successStatus: activity.successStatus
      });
    }
    /**
     * Fire limit condition check event
     */
    fireLimitConditionCheck(activity, result) {
      this.fireEvent("onLimitConditionCheck", activity, result);
      this.fireDebugEvent("Limit condition check", {
        activityId: activity.id,
        result,
        attemptCount: activity.attemptCount,
        attemptLimit: activity.attemptLimit
      });
    }
    /**
     * Fire navigation validity update event
     */
    fireNavigationValidityUpdate(validity) {
      this.fireEvent("onNavigationValidityUpdate", validity);
      this.fireDebugEvent("Navigation validity updated", {
        validity
      });
    }
    /**
     * Fire sequencing state change event
     */
    fireSequencingStateChange(state) {
      this.fireEvent("onSequencingStateChange", state);
      this.fireDebugEvent("Sequencing state changed", {
        stateKeys: Object.keys(state)
      });
    }
    /**
     * Handle events from the sequencing process
     */
    handleSequencingProcessEvent(eventType, data) {
      try {
        switch (eventType) {
          case "onActivityDelivery":
            this.fireEvent("onActivityDelivery", data);
            break;
          case "onLimitConditionCheck":
            this.fireLimitConditionCheck(data.activity, data.result);
            break;
          case "onActivityAttemptStart":
            this.fireActivityAttemptStart(data);
            break;
          case "onActivityAttemptEnd":
            this.fireActivityAttemptEnd(data);
            break;
          case "onNavigationValidityUpdate":
            this.fireNavigationValidityUpdate(data);
            break;
          case "onSequencingSessionEnd":
            this.fireEvent("onSequencingSessionEnd", data);
            break;
          default:
            this.fireDebugEvent(`Sequencing process event: ${eventType}`, data);
        }
      } catch (error) {
        this.log("error", `Error handling sequencing process event ${eventType}: ${error}`);
      }
    }
    /**
     * Log message with appropriate level
     */
    log(level, message, data) {
      const logLevels = ["debug", "info", "warn", "error"];
      const configLevel = this.configuration.logLevel || "info";
      if (logLevels.indexOf(level) >= logLevels.indexOf(configLevel)) {
        switch (level) {
          case "debug":
            this.loggingService.debug(`[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`);
            break;
          case "info":
            this.loggingService.info(`[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`);
            break;
          case "warn":
            this.loggingService.warn(`[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`);
            break;
          case "error":
            this.loggingService.error(`[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`);
            break;
        }
      }
    }
  }

  class Scorm2004API extends BaseAPI {
    /**
     * Constructor for SCORM 2004 API
     * @param {Settings} settings
     * @param {IHttpService} httpService - Optional HTTP service instance
     */
    constructor(settings, httpService) {
      const settingsCopy = settings ? {
        ...settings
      } : void 0;
      if (settingsCopy) {
        if (settingsCopy.mastery_override === void 0) {
          settingsCopy.mastery_override = false;
        }
      }
      super(scorm2004_errors$1, settingsCopy, httpService);
      this._version = "1.0";
      this._globalObjectives = [];
      this._sequencingService = null;
      this._extractedScoItemIds = [];
      this._sequencingCollections = {};
      this.cmi = new CMI();
      this.adl = new ADL();
      this._sequencing = new Sequencing();
      this.adl.sequencing = this._sequencing;
      if (settingsCopy?.sequencing) {
        this.configureSequencing(settingsCopy.sequencing);
      }
      this.initializeSequencingService(settingsCopy);
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
     *
     * This method is designed for transitioning between SCOs in a sequenced course.
     * When called, it resets SCO-specific data while preserving global objectives.
     *
     * What gets reset:
     * - SCO-specific CMI data (location, entry, session time, interactions, score)
     * - Sequencing state (activity tree, current activity, etc.)
     * - ADL navigation state
     *
     * What is preserved:
     * - Global objectives (_globalObjectives array) - these persist across SCO transitions
     *   to allow activities to share objective data via mapInfo
     *
     * According to SCORM 2004 Sequencing and Navigation (SN) Book:
     * - Content Delivery Environment Process (DB.2) requires API reset between SCOs
     * - Global objectives must persist to support cross-activity objective tracking
     * - SCO-specific objectives in cmi.objectives are reset (via objectives.reset(false))
     *   but the array structure is maintained
     *
     * @param {Settings} settings - Optional new settings to merge with existing settings
     */
    reset(settings) {
      this.commonReset(settings);
      this.cmi?.reset();
      this.adl?.reset();
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
     *
     * Global objectives persist across SCO transitions and are used for cross-activity
     * objective tracking via mapInfo (SCORM 2004 SN Book SB.2.4).
     *
     * These objectives are NOT reset when reset() is called, allowing activities
     * to share objective data across SCO boundaries.
     *
     * @return {CMIObjectivesObject[]} Array of global objective objects
     */
    get globalObjectives() {
      return this._globalObjectives;
    }
    /**
     * Initialize - Begins a communication session with the LMS
     *
     * Per SCORM 2004 RTE Section 3.1.2.1:
     * - Parameter must be empty string ("")
     * - Returns "true" on success, "false" on failure
     * - Sets error 103 if already initialized
     * - Sets error 104 if already terminated
     * - Sets error 101 if parameter is not an empty string
     * - Initializes the CMI data model for the current attempt
     *
     * @param {string} parameter - Must be an empty string per SCORM 2004 specification
     * @return {string} "true" or "false"
     */
    lmsInitialize() {
      let parameter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      if (parameter !== "") {
        this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
        return global_constants.SCORM_FALSE;
      }
      this.cmi.initialize();
      const result = this.initialize("Initialize", "LMS was already initialized!", "LMS is already finished!");
      if (result === global_constants.SCORM_TRUE && this._sequencingService) {
        this._sequencingService.initialize();
      }
      if (result === global_constants.SCORM_TRUE) {
        this.restoreGlobalObjectivesToCMI();
      }
      if (result === global_constants.SCORM_TRUE && this.settings.sequencingStatePersistence) {
        this.loadSequencingState().catch(() => {
          this.apiLog("lmsInitialize", "Failed to auto-load sequencing state", LogLevelEnum.WARN);
        });
      }
      return result;
    }
    /**
     * Terminate - Ends the communication session and persists data
     *
     * Per SCORM 2004 RTE Section 3.1.2.2:
     * - Parameter must be empty string ("")
     * - Returns "true" on success, "false" on failure
     * - Commits all data to persistent storage
     * - Sets error 112 if not initialized
     * - Sets error 113 if already terminated
     * - Sets error 101 if parameter is not an empty string
     * - Processes navigation requests set via adl.nav.request
     *
     * @param {string} parameter - Must be an empty string per SCORM 2004 specification
     * @return {string} "true" or "false"
     */
    lmsFinish() {
      let parameter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      if (parameter !== "") {
        this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
        return global_constants.SCORM_FALSE;
      }
      const pendingNavRequest = this.adl?.nav?.request || "_none_";
      const exitType = this.cmi?.getExitValueInternal() || "";
      const wasAlreadyTerminated = this.isTerminated();
      const deliveryInProgress = this._sequencingService?.isDeliveryInProgress() ?? false;
      const result = this.terminate("Terminate", true);
      if (result === global_constants.SCORM_TRUE && !wasAlreadyTerminated && !deliveryInProgress) {
        let navigationHandled = false;
        let processedSequencingRequest = null;
        let normalizedRequest = pendingNavRequest;
        let normalizedTarget = "";
        const choiceJumpRegex = new RegExp(scorm2004_regex.NAVEvent);
        if (pendingNavRequest !== "_none_") {
          const matches = pendingNavRequest.match(choiceJumpRegex);
          if (matches) {
            if (matches.groups?.choice_target) {
              normalizedTarget = matches.groups?.choice_target;
              normalizedRequest = "choice";
            } else if (matches.groups?.jump_target) {
              normalizedTarget = matches.groups?.jump_target;
              normalizedRequest = "jump";
            }
          }
        }
        if (this._sequencingService) {
          try {
            let requestToProcess = null;
            let targetForProcessing;
            if (normalizedRequest !== "_none_") {
              requestToProcess = normalizedRequest;
              targetForProcessing = normalizedTarget || void 0;
            } else if (this._sequencing.getCurrentActivity()) {
              requestToProcess = "exit";
            }
            if (requestToProcess) {
              navigationHandled = this._sequencingService.processNavigationRequest(requestToProcess, targetForProcessing, exitType);
              processedSequencingRequest = requestToProcess;
            }
          } catch (error) {
            navigationHandled = false;
          }
        }
        if (!navigationHandled) {
          if (pendingNavRequest !== "_none_") {
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
            const action = navActions[normalizedRequest];
            if (action) {
              this.processListeners(action, "adl.nav.request", normalizedTarget);
            }
          } else if (this.settings.autoProgress) {
            this.processListeners("SequenceNext", void 0, "next");
          }
        }
        if (this._sequencingService && processedSequencingRequest && ["exitAll", "abandonAll", "suspendAll"].includes(processedSequencingRequest)) {
          this._sequencingService.terminate();
        }
        this.adl.nav.request = "_none_";
      }
      return result;
    }
    /**
     * GetValue - Retrieves a value from the CMI data model
     *
     * Per SCORM 2004 RTE Section 3.1.2.3:
     * - Returns the value of the specified CMI element
     * - Returns empty string if element has no value
     * - Sets error 122 if not initialized
     * - Sets error 123 if already terminated
     * - Sets error 401 if element is not implemented (invalid element)
     * - Sets error 405 if element is write-only
     * - Sets error 403 if element is not readable
     *
     * @param {string} CMIElement - The CMI element path (e.g., "cmi.completion_status")
     * @return {string} The value of the element, or empty string
     */
    lmsGetValue(CMIElement) {
      if (CMIElement === "adl.nav.request") {
        this.throwSCORMError(CMIElement, scorm2004_errors$1.WRITE_ONLY_ELEMENT, "adl.nav.request is write-only");
        return "";
      }
      const adlNavRequestRegex = "^adl\\.nav\\.request_valid\\.(choice|jump)\\.{target=([a-zA-Z0-9-_]+)}$";
      if (stringMatches(CMIElement, adlNavRequestRegex)) {
        const matches = CMIElement.match(adlNavRequestRegex);
        if (matches) {
          const request = matches[1];
          const target = matches[2]?.replace(/{target=/g, "").replace(/}/g, "") || "";
          if (request === "choice" || request === "jump") {
            const overallProcess = this._sequencing?.overallSequencingProcess;
            if (this.settings.scoItemIdValidator) {
              return String(this.settings.scoItemIdValidator(target));
            }
            if (overallProcess?.predictChoiceEnabled && request === "choice") {
              return overallProcess.predictChoiceEnabled(target) ? "true" : "false";
            } else if (overallProcess?.predictJumpEnabled && request === "jump") {
              return overallProcess.predictJumpEnabled(target) ? "true" : "false";
            } else {
              if (this._extractedScoItemIds.length > 0) {
                return String(this._extractedScoItemIds.includes(target));
              }
              return String(this.settings?.scoItemIds?.includes(target));
            }
          }
        }
      }
      if (this.isTerminated()) {
        this.lastErrorCode = String(scorm2004_errors$1.RETRIEVE_AFTER_TERM);
        return "";
      }
      if (!this.isInitialized()) {
        this.lastErrorCode = String(scorm2004_errors$1.RETRIEVE_BEFORE_INIT);
        return "";
      }
      if (CMIElement === "cmi.completion_status") {
        return this.evaluateCompletionStatus();
      }
      if (CMIElement === "cmi.success_status") {
        return this.evaluateSuccessStatus();
      }
      return this.getValue("GetValue", true, CMIElement);
    }
    /**
     * Evaluates completion_status per SCORM 2004 RTE Table 4.2.4.1a
     *
     * Rules:
     * 1. If completion_threshold is defined AND progress_measure is set:
     *    - Return "completed" if progress_measure >= completion_threshold
     *    - Return "incomplete" if progress_measure < completion_threshold
     * 2. If completion_threshold is defined but progress_measure is NOT set:
     *    - Return "unknown"
     * 3. Otherwise:
     *    - Return the SCO-set value (or "unknown" if not set)
     *
     * @returns {string} The evaluated completion status
     */
    evaluateCompletionStatus() {
      const threshold = this.cmi.completion_threshold;
      const progressMeasure = this.cmi.progress_measure;
      const storedStatus = this.cmi.completion_status;
      if (threshold !== "" && threshold !== null && threshold !== void 0) {
        const thresholdValue = parseFloat(String(threshold));
        if (!isNaN(thresholdValue)) {
          if (progressMeasure !== "" && progressMeasure !== null && progressMeasure !== void 0) {
            const progressValue = parseFloat(String(progressMeasure));
            if (!isNaN(progressValue)) {
              return progressValue >= thresholdValue ? CompletionStatus.COMPLETED : CompletionStatus.INCOMPLETE;
            }
          }
          return CompletionStatus.UNKNOWN;
        }
      }
      return storedStatus || CompletionStatus.UNKNOWN;
    }
    /**
     * Evaluates success_status per SCORM 2004 RTE Table 4.2.21.1a
     *
     * Rules:
     * 1. If scaled_passing_score is defined AND score.scaled is set:
     *    - Return "passed" if score.scaled >= scaled_passing_score
     *    - Return "failed" if score.scaled < scaled_passing_score
     * 2. If scaled_passing_score is defined but score.scaled is NOT set:
     *    - Return "unknown"
     * 3. Otherwise:
     *    - Return the SCO-set value (or "unknown" if not set)
     *
     * @returns {string} The evaluated success status
     */
    evaluateSuccessStatus() {
      const scaledPassingScore = this.cmi.scaled_passing_score;
      const scaledScore = this.cmi.score.scaled;
      const storedStatus = this.cmi.success_status;
      if (scaledPassingScore !== "" && scaledPassingScore !== null && scaledPassingScore !== void 0) {
        const passingScoreValue = parseFloat(String(scaledPassingScore));
        if (!isNaN(passingScoreValue)) {
          if (scaledScore !== "" && scaledScore !== null && scaledScore !== void 0) {
            const scoreValue = parseFloat(String(scaledScore));
            if (!isNaN(scoreValue)) {
              return scoreValue >= passingScoreValue ? SuccessStatus.PASSED : SuccessStatus.FAILED;
            }
          }
          return SuccessStatus.UNKNOWN;
        }
      }
      return storedStatus || SuccessStatus.UNKNOWN;
    }
    /**
     * SetValue - Sets a value in the CMI data model
     *
     * Per SCORM 2004 RTE Section 3.1.2.4:
     * - Sets the value of the specified CMI element
     * - Returns "true" on success, "false" on failure
     * - Sets error 132 if not initialized
     * - Sets error 133 if already terminated
     * - Sets error 401 if element is not implemented (invalid element)
     * - Sets error 403 if element is read-only
     * - Sets error 406 if incorrect data type
     * - Sets error 407 if element is a keyword and value is not valid
     * - Triggers autocommit if enabled
     *
     * @param {string} CMIElement - The CMI element path (e.g., "cmi.completion_status")
     * @param {any} value - The value to set
     * @return {string} "true" or "false"
     */
    lmsSetValue(CMIElement, value) {
      let oldValue = null;
      try {
        oldValue = this.getCMIValue(CMIElement);
      } catch (error) {
        oldValue = null;
      }
      const result = this.setValue("SetValue", "Commit", true, CMIElement, value);
      if (result === global_constants.SCORM_TRUE && this._sequencingService) {
        try {
          this._sequencingService.triggerRollupOnCMIChange(CMIElement, oldValue, value);
        } catch (rollupError) {
          console.warn(`Sequencing rollup failed for ${CMIElement}: ${rollupError}`);
        }
      }
      if (result === global_constants.SCORM_TRUE && this.settings.sequencingStatePersistence?.autoSaveOn === "setValue") {
        const sequencingElements = ["cmi.completion_status", "cmi.success_status", "cmi.score.scaled", "cmi.objectives", "adl.nav.request"];
        if (sequencingElements.some(element => CMIElement.startsWith(element))) {
          this.saveSequencingState().catch(() => {
            this.apiLog("lmsSetValue", "Failed to auto-save sequencing state", LogLevelEnum.WARN);
          });
        }
      }
      return result;
    }
    /**
     * Commit - Requests immediate persistence of data to the LMS
     *
     * Per SCORM 2004 RTE Section 3.1.2.5:
     * - Parameter must be empty string ("")
     * - Requests persistence of all data set since last successful commit
     * - Returns "true" on success, "false" on failure
     * - Sets error 142 if not initialized
     * - Sets error 143 if already terminated
     * - Sets error 101 if parameter is not an empty string
     * - Sets error 391 if commit failed
     * - Does not terminate the communication session
     *
     * @param {string} parameter - Must be an empty string per SCORM 2004 specification
     * @return {string} "true" or "false"
     */
    lmsCommit() {
      let parameter = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      if (parameter !== "") {
        this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
        return global_constants.SCORM_FALSE;
      }
      if (this.settings.throttleCommits) {
        this.scheduleCommit(500, "Commit");
        return global_constants.SCORM_TRUE;
      } else {
        const result = this.commit("Commit", true);
        if (result === global_constants.SCORM_TRUE && this.settings.sequencingStatePersistence?.autoSaveOn === "commit") {
          this.saveSequencingState().catch(() => {
            this.apiLog("lmsCommit", "Failed to auto-save sequencing state", LogLevelEnum.WARN);
          });
        }
        return result;
      }
    }
    /**
     * GetLastError - Returns the error code from the last API call
     *
     * Per SCORM 2004 RTE Section 3.1.2.6:
     * - Returns the error code that resulted from the last API call
     * - Returns "0" if no error occurred
     * - Can be called at any time (even before Initialize)
     * - Does not change the current error state
     * - Should be called after each API call to check for errors
     *
     * @return {string} Error code as a string (e.g., "0", "103", "401")
     */
    lmsGetLastError() {
      return this.getLastError("GetLastError");
    }
    /**
     * GetErrorString - Returns a short description for an error code
     *
     * Per SCORM 2004 RTE Section 3.1.2.7:
     * - Returns a textual description for the specified error code
     * - Returns empty string if error code is not recognized
     * - Can be called at any time (even before Initialize)
     * - Does not change the current error state
     * - Used to provide user-friendly error messages
     *
     * @param {string|number} CMIErrorCode - The error code to get the description for
     * @return {string} Short error description
     */
    lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString("GetErrorString", CMIErrorCode);
    }
    /**
     * GetDiagnostic - Returns detailed diagnostic information for an error
     *
     * Per SCORM 2004 RTE Section 3.1.2.8:
     * - Returns detailed diagnostic information for the specified error code
     * - Implementation-specific; can include additional context or debugging info
     * - Returns empty string if no diagnostic information is available
     * - Can be called at any time (even before Initialize)
     * - Does not change the current error state
     * - Used for debugging and troubleshooting
     *
     * @param {string|number} CMIErrorCode - The error code to get diagnostic information for
     * @return {string} Detailed diagnostic information
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
          let global_index = this._globalObjectives.findIndex(obj => obj.id === objective_id);
          if (global_index === -1) {
            global_index = this._globalObjectives.length;
            const newGlobalObjective = new CMIObjectivesObject();
            newGlobalObjective.id = objective_id;
            this._globalObjectives.push(newGlobalObjective);
          }
          const global_element = CMIElement.replace(element_base, `_globalObjectives.${global_index}`);
          this._commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);
          const updatedObjective = this._globalObjectives[global_index];
          if (objective_id && updatedObjective) {
            this.updateGlobalObjectiveFromCMI(objective_id, updatedObjective);
          }
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
          const interaction_count = interaction.correct_responses._count;
          const response_type = CorrectResponses[interaction.type];
          if (response_type && typeof response_type.limit !== "undefined" && interaction_count >= response_type.limit) {
            this.throwSCORMError(CMIElement, scorm2004_errors$1.GENERAL_SET_FAILURE, `Data Model Element Collection Limit Reached: ${CMIElement}`);
            return null;
          }
          this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
          if (response_type) {
            this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
          } else {
            this.throwSCORMError(CMIElement, scorm2004_errors$1.GENERAL_SET_FAILURE, `Incorrect Response Type: ${interaction.type}`);
            return null;
          }
        }
      }
      if (this.lastErrorCode === "0") {
        return new CMIInteractionsCorrectResponsesObject(interaction?.type);
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
        this.throwSCORMError(CMIElement, scorm2004_errors$1.GENERAL_SET_FAILURE, `Data Model Element Pattern Too Long: ${value}`);
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
          if (response?.pattern === value) {
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
      if (!interaction) {
        this.throwSCORMError(CMIElement, scorm2004_errors$1.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
        return;
      }
      const interaction_count = interaction.correct_responses._count;
      this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
      const response_type = CorrectResponses[interaction.type];
      if (response_type && (typeof response_type.limit === "undefined" || interaction_count < response_type.limit)) {
        this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
        if (this.lastErrorCode === "0" && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastErrorCode === "0" && value === "") ; else {
          if (this.lastErrorCode === "0") {
            this.throwSCORMError(CMIElement, scorm2004_errors$1.GENERAL_SET_FAILURE, `Data Model Element Pattern Already Exists: ${CMIElement} - ${value}`);
          }
        }
      } else {
        this.throwSCORMError(CMIElement, scorm2004_errors$1.GENERAL_SET_FAILURE, `Data Model Element Collection Limit Reached: ${CMIElement} - ${value}`);
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
      const errorDescription = scorm2004_constants.error_descriptions[errorNumber];
      if (errorDescription) {
        basicMessage = errorDescription.basicMessage;
        detailMessage = errorDescription.detailMessage;
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
        if (i !== current_index) {
          const item = correct_response.childArray[i];
          const existingPattern = item?.pattern;
          if (existingPattern === value) {
            found = true;
          }
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
        this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `Incorrect Response Type: ${interaction_type}`);
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
              this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${interaction_type}: ${value}`);
            } else {
              if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
                this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${interaction_type}: ${value}`);
              }
            }
          } else {
            this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${interaction_type}: ${value}`);
          }
        } else {
          const matches = nodes[i].match(formatRegex);
          if (!matches && value !== "" || !matches && interaction_type === "true-false") {
            this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${interaction_type}: ${value}`);
          } else {
            if (interaction_type === "numeric" && nodes.length > 1) {
              if (Number(nodes[0]) > Number(nodes[1])) {
                this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${interaction_type}: ${value}`);
              }
            } else {
              if (nodes[i] !== "" && response.unique) {
                for (let j = 0; j < i && this.lastErrorCode === "0"; j++) {
                  if (nodes[i] === nodes[j]) {
                    this.throwSCORMError(CMIElement, scorm2004_errors$1.TYPE_MISMATCH, `${interaction_type}: ${value}`);
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
        node = node.substring(matches[1]?.length || 0);
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
    renderCommitCMI(terminateCommit) {
      let includeTotalTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const cmiExport = this.renderCMIToJSONObject();
      if (terminateCommit || includeTotalTime) {
        cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
      } else {
        delete cmiExport.cmi.total_time;
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
    renderCommitObject(terminateCommit) {
      let includeTotalTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
      const calculateTotalTime = terminateCommit || includeTotalTime;
      const totalTimeDuration = calculateTotalTime ? this.cmi.getCurrentTotalTime() : "";
      const totalTimeSeconds = getDurationAsSeconds(totalTimeDuration, scorm2004_regex.CMITimespan);
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
      if (this.settings.autoPopulateCommitMetadata) {
        if (this.settings.courseId) {
          commitObject.courseId = this.settings.courseId;
        }
        if (this.settings.scoId) {
          commitObject.scoId = this.settings.scoId;
        }
        if (this.cmi.learner_id) {
          commitObject.learnerId = this.cmi.learner_id;
        }
        if (this.cmi.learner_name) {
          commitObject.learnerName = this.cmi.learner_name;
        }
        const sequencingState = this._sequencingService?.getSequencingState();
        if (sequencingState?.currentActivity?.id) {
          commitObject.activityId = sequencingState.currentActivity.id;
        }
      }
      this.syncCmiToSequencingActivity(completionStatus, successStatus, scoreObject);
      return commitObject;
    }
    /**
     * Synchronize CMI runtime data to the current sequencing activity
     * When cmi.success_status or cmi.completion_status are set, update the
     * current activity's primary objective accordingly
     *
     * @param {CompletionStatus} completionStatus
     * @param {SuccessStatus} successStatus
     * @param {ScoreObject} scoreObject
     * @private
     */
    syncCmiToSequencingActivity(completionStatus, successStatus, scoreObject) {
      if (!this._sequencing) {
        return;
      }
      const currentActivity = this._sequencing.getCurrentActivity();
      if (!currentActivity || !currentActivity.primaryObjective) {
        return;
      }
      const primaryObjective = currentActivity.primaryObjective;
      if (successStatus !== SuccessStatus.UNKNOWN) {
        primaryObjective.satisfiedStatus = successStatus === SuccessStatus.PASSED;
        primaryObjective.satisfiedStatusKnown = true;
        primaryObjective.measureStatus = true;
        currentActivity.objectiveMeasureStatus = true;
        currentActivity.objectiveSatisfiedStatus = successStatus === SuccessStatus.PASSED;
        currentActivity.objectiveSatisfiedStatusKnown = true;
      }
      if (completionStatus !== CompletionStatus.UNKNOWN) {
        primaryObjective.completionStatus = completionStatus;
      }
      if (scoreObject?.scaled !== void 0 && scoreObject.scaled !== null) {
        primaryObjective.normalizedMeasure = scoreObject.scaled;
        primaryObjective.measureStatus = true;
      }
    }
    /**
     * Attempts to store the data to the LMS - delegates to DataSerializationModule
     *
     * @param {boolean} terminateCommit
     * @return {ResultObject}
     */
    storeData(terminateCommit) {
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
      const scoreObject = this.cmi?.score?.getScoreObject() || {};
      let completionStatusEnum = CompletionStatus.UNKNOWN;
      if (this.cmi.completion_status === "completed") {
        completionStatusEnum = CompletionStatus.COMPLETED;
      } else if (this.cmi.completion_status === "incomplete") {
        completionStatusEnum = CompletionStatus.INCOMPLETE;
      }
      let successStatusEnum = SuccessStatus.UNKNOWN;
      if (this.cmi.success_status === "passed") {
        successStatusEnum = SuccessStatus.PASSED;
      } else if (this.cmi.success_status === "failed") {
        successStatusEnum = SuccessStatus.FAILED;
      }
      this.syncCmiToSequencingActivity(completionStatusEnum, successStatusEnum, scoreObject);
      if (typeof this.settings.lmsCommitUrl === "string") {
        const result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);
        if (navRequest && result.navRequest !== void 0 && result.navRequest !== "" && typeof result.navRequest === "string") {
          const parsed = parseNavigationRequest(result.navRequest);
          if (!parsed.valid) {
            this.apiLog("storeData", `Invalid navigation request from LMS: ${parsed.error}`, LogLevelEnum.WARN);
          } else {
            const navEventMap = {
              start: "SequenceStart",
              resumeAll: "SequenceResumeAll",
              continue: "SequenceNext",
              previous: "SequencePrevious",
              choice: "SequenceChoice",
              jump: "SequenceJump",
              exit: "SequenceExit",
              exitAll: "SequenceExitAll",
              abandon: "SequenceAbandon",
              abandonAll: "SequenceAbandonAll",
              suspendAll: "SequenceSuspendAll"
            };
            const eventName = navEventMap[parsed.command];
            if (eventName) {
              this.processListeners(eventName, "adl.nav.request", parsed.targetActivityId);
            }
          }
        } else if (result?.navRequest && !navRequest) {
          if (typeof result.navRequest === "object" && Object.hasOwnProperty.call(result.navRequest, "name") && result.navRequest.name) {
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
      this._sequencingCollections = this.sanitizeSequencingCollections(sequencingSettings.collections);
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
      if (sequencingSettings.hideLmsUi) {
        this._sequencing.hideLmsUi = this.sanitizeHideLmsUi(sequencingSettings.hideLmsUi);
      } else {
        this._sequencing.hideLmsUi = [];
      }
      if (sequencingSettings.auxiliaryResources) {
        this._sequencing.auxiliaryResources = this.sanitizeAuxiliaryResources(sequencingSettings.auxiliaryResources);
      } else {
        this._sequencing.auxiliaryResources = [];
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
      const selectionStates = [];
      const collectionRefs = this.normalizeCollectionRefs(activitySettings.sequencingCollectionRefs);
      for (const ref of collectionRefs) {
        const collection = this._sequencingCollections[ref];
        if (collection) {
          this.applySequencingCollection(activity, collection, selectionStates);
        }
      }
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
      if (activitySettings.isHiddenFromChoice !== void 0) {
        activity.isHiddenFromChoice = activitySettings.isHiddenFromChoice;
      }
      if (activitySettings.isAvailable !== void 0) {
        activity.isAvailable = activitySettings.isAvailable;
      }
      if (activitySettings.attemptLimit !== void 0) {
        activity.attemptLimit = activitySettings.attemptLimit;
      }
      if (activitySettings.attemptAbsoluteDurationLimit !== void 0) {
        activity.attemptAbsoluteDurationLimit = activitySettings.attemptAbsoluteDurationLimit;
      }
      if (activitySettings.activityAbsoluteDurationLimit !== void 0) {
        activity.activityAbsoluteDurationLimit = activitySettings.activityAbsoluteDurationLimit;
      }
      if (activitySettings.timeLimitAction !== void 0) {
        activity.timeLimitAction = activitySettings.timeLimitAction;
      }
      if (activitySettings.timeLimitDuration !== void 0) {
        activity.timeLimitDuration = activitySettings.timeLimitDuration;
      }
      if (activitySettings.beginTimeLimit !== void 0) {
        activity.beginTimeLimit = activitySettings.beginTimeLimit;
      }
      if (activitySettings.endTimeLimit !== void 0) {
        activity.endTimeLimit = activitySettings.endTimeLimit;
      }
      if (activitySettings.primaryObjective) {
        const primaryObjective = this.createActivityObjectiveFromSettings(activitySettings.primaryObjective, true);
        activity.primaryObjective = primaryObjective;
        if (primaryObjective.minNormalizedMeasure !== null) {
          activity.scaledPassingScore = primaryObjective.minNormalizedMeasure;
        }
      }
      if (activitySettings.objectives) {
        for (const objectiveSettings of activitySettings.objectives) {
          const isPrimary = objectiveSettings.isPrimary === true;
          const objective = this.createActivityObjectiveFromSettings(objectiveSettings, isPrimary);
          if (isPrimary) {
            activity.primaryObjective = objective;
          } else {
            activity.addObjective(objective);
          }
        }
      }
      if (activitySettings.sequencingControls) {
        this.applySequencingControlsSettings(activity.sequencingControls, activitySettings.sequencingControls);
      }
      if (activitySettings.sequencingRules) {
        this.applySequencingRulesSettings(activity.sequencingRules, activitySettings.sequencingRules);
      }
      if (activitySettings.rollupRules) {
        this.applyRollupRulesSettings(activity.rollupRules, activitySettings.rollupRules);
      }
      if (activitySettings.rollupConsiderations) {
        activity.applyRollupConsiderations(activitySettings.rollupConsiderations);
      }
      if (activitySettings.hideLmsUi) {
        const mergedHide = this.mergeHideLmsUi(activity.hideLmsUi, activitySettings.hideLmsUi);
        if (mergedHide.length > 0) {
          activity.hideLmsUi = mergedHide;
        }
      }
      if (activitySettings.auxiliaryResources) {
        const sanitizedAux = this.sanitizeAuxiliaryResources(activitySettings.auxiliaryResources);
        if (sanitizedAux.length > 0) {
          activity.auxiliaryResources = this.mergeAuxiliaryResources(activity.auxiliaryResources, sanitizedAux);
        }
      }
      if (activitySettings.children) {
        for (const childSettings of activitySettings.children) {
          const childActivity = this.createActivity(childSettings);
          activity.addChild(childActivity);
        }
      }
      if (activitySettings.selectionRandomizationState) {
        selectionStates.push(this.cloneSelectionRandomizationState(activitySettings.selectionRandomizationState));
      }
      for (const state of selectionStates) {
        this.applySelectionRandomizationState(activity, state);
      }
      return activity;
    }
    /**
     * Configure sequencing rules based on provided settings
     * @param {SequencingRulesSettings} sequencingRulesSettings - The sequencing rules settings
     */
    configureSequencingRules(sequencingRulesSettings) {
      this.applySequencingRulesSettings(this._sequencing.sequencingRules, sequencingRulesSettings);
    }
    /**
     * Create a sequencing rule from settings
     * @param {SequencingRuleSettings} ruleSettings - The sequencing rule settings
     * @return {SequencingRule} - The created sequencing rule
     */
    createSequencingRule(ruleSettings) {
      const rule = new SequencingRule(ruleSettings.action, ruleSettings.conditionCombination);
      for (const conditionSettings of ruleSettings.conditions) {
        const condition = new RuleCondition(conditionSettings.condition, conditionSettings.operator, new Map(Object.entries(conditionSettings.parameters || {})));
        if (conditionSettings.referencedObjective) {
          condition.referencedObjective = conditionSettings.referencedObjective;
        }
        rule.addCondition(condition);
      }
      return rule;
    }
    /**
     * Configure sequencing controls based on provided settings
     * @param {SequencingControlsSettings} sequencingControlsSettings - The sequencing controls settings
     */
    configureSequencingControls(sequencingControlsSettings) {
      this.applySequencingControlsSettings(this._sequencing.sequencingControls, sequencingControlsSettings);
    }
    /**
     * Applies the selection randomization state to the given activity by updating its sequencing controls
     * and configuring visibility, availability, and order of its child elements.
     *
     * @param {Activity} activity - The activity to which the selection randomization state is applied.
     * @param {SelectionRandomizationStateSettings} state - The settings object defining the selection
     * randomization state, including properties for selection count status, child order, reorder controls,
     * selected child IDs, and hidden child IDs.
     * @return {void} This method does not return a value.
     */
    applySelectionRandomizationState(activity, state) {
      const sequencingControls = activity.sequencingControls;
      if (state.selectionCountStatus !== void 0) {
        sequencingControls.selectionCountStatus = state.selectionCountStatus;
      }
      if (state.reorderChildren !== void 0) {
        sequencingControls.reorderChildren = state.reorderChildren;
      }
      const selectedSet = state.selectedChildIds ? new Set(state.selectedChildIds) : null;
      const hiddenSet = state.hiddenFromChoiceChildIds ? new Set(state.hiddenFromChoiceChildIds) : null;
      if (state.childOrder && state.childOrder.length > 0) {
        activity.setChildOrder(state.childOrder);
      }
      let selectionTouched = false;
      if (selectedSet || hiddenSet) {
        for (const child of activity.children) {
          if (selectedSet) {
            const isSelected = selectedSet.has(child.id);
            child.isAvailable = isSelected;
            if (!hiddenSet) {
              child.isHiddenFromChoice = !isSelected;
            }
            selectionTouched = true;
          }
          if (hiddenSet) {
            child.isHiddenFromChoice = hiddenSet.has(child.id);
            selectionTouched = true;
          }
        }
      }
      const shouldSetProcessedChildren = selectionTouched || !!selectedSet || state.selectionCountStatus !== void 0 || state.reorderChildren !== void 0 || state.childOrder && state.childOrder.length > 0;
      if (shouldSetProcessedChildren) {
        activity.setProcessedChildren(activity.children.filter(child => child.isAvailable));
      }
    }
    /**
     * Applies the given sequencing controls settings to the specified target.
     *
     * @param {SequencingControls} target - The target object where sequencing control settings will be applied.
     * @param {SequencingControlsSettings} settings - An object containing the sequencing control settings to be applied to the target.
     * @return {void} - No return value as the method modifies the target object directly.
     */
    applySequencingControlsSettings(target, settings) {
      if (settings.enabled !== void 0) {
        target.enabled = settings.enabled;
      }
      if (settings.choice !== void 0) {
        target.choice = settings.choice;
      }
      if (settings.choiceExit !== void 0) {
        target.choiceExit = settings.choiceExit;
      }
      if (settings.flow !== void 0) {
        target.flow = settings.flow;
      }
      if (settings.forwardOnly !== void 0) {
        target.forwardOnly = settings.forwardOnly;
      }
      if (settings.useCurrentAttemptObjectiveInfo !== void 0) {
        target.useCurrentAttemptObjectiveInfo = settings.useCurrentAttemptObjectiveInfo;
      }
      if (settings.useCurrentAttemptProgressInfo !== void 0) {
        target.useCurrentAttemptProgressInfo = settings.useCurrentAttemptProgressInfo;
      }
      if (settings.preventActivation !== void 0) {
        target.preventActivation = settings.preventActivation;
      }
      if (settings.constrainChoice !== void 0) {
        target.constrainChoice = settings.constrainChoice;
      }
      if (settings.stopForwardTraversal !== void 0) {
        target.stopForwardTraversal = settings.stopForwardTraversal;
      }
      if (settings.rollupObjectiveSatisfied !== void 0) {
        target.rollupObjectiveSatisfied = settings.rollupObjectiveSatisfied;
      }
      if (settings.rollupProgressCompletion !== void 0) {
        target.rollupProgressCompletion = settings.rollupProgressCompletion;
      }
      if (settings.objectiveMeasureWeight !== void 0) {
        target.objectiveMeasureWeight = settings.objectiveMeasureWeight;
      }
      if (settings.selectionTiming !== void 0) {
        target.selectionTiming = settings.selectionTiming;
      }
      if (settings.selectCount !== void 0) {
        target.selectCount = settings.selectCount;
      }
      if (settings.randomizeChildren !== void 0) {
        target.randomizeChildren = settings.randomizeChildren;
      }
      if (settings.randomizationTiming !== void 0) {
        target.randomizationTiming = settings.randomizationTiming;
      }
      if (settings.selectionCountStatus !== void 0) {
        target.selectionCountStatus = settings.selectionCountStatus;
      }
      if (settings.reorderChildren !== void 0) {
        target.reorderChildren = settings.reorderChildren;
      }
      if (settings.completionSetByContent !== void 0) {
        target.completionSetByContent = settings.completionSetByContent;
      }
      if (settings.objectiveSetByContent !== void 0) {
        target.objectiveSetByContent = settings.objectiveSetByContent;
      }
    }
    /**
     * Applies the sequencing rules settings to the specified target object.
     *
     * @param {SequencingRules} target The target object where the sequencing rules will be applied.
     * @param {SequencingRulesSettings} settings The settings object containing the sequencing rules to be applied. If null or undefined, no rules will be applied.
     * @return {void} This method does not return a value.
     */
    applySequencingRulesSettings(target, settings) {
      if (!settings) {
        return;
      }
      if (settings.preConditionRules) {
        for (const ruleSettings of settings.preConditionRules) {
          const rule = this.createSequencingRule(ruleSettings);
          target.addPreConditionRule(rule);
        }
      }
      if (settings.exitConditionRules) {
        for (const ruleSettings of settings.exitConditionRules) {
          const rule = this.createSequencingRule(ruleSettings);
          target.addExitConditionRule(rule);
        }
      }
      if (settings.postConditionRules) {
        for (const ruleSettings of settings.postConditionRules) {
          const rule = this.createSequencingRule(ruleSettings);
          target.addPostConditionRule(rule);
        }
      }
    }
    /**
     * Applies rollup rules settings to the specified target object.
     * This method processes the provided settings and adds the corresponding
     * rollup rules to the target.
     *
     * @param {RollupRules} target - The target object where rollup rules will be applied.
     * @param {RollupRulesSettings} settings - The settings containing the rollup rules to be applied.
     * @return {void} This method does not return a value.
     */
    applyRollupRulesSettings(target, settings) {
      if (!settings?.rules) {
        return;
      }
      for (const ruleSettings of settings.rules) {
        const rule = this.createRollupRule(ruleSettings);
        target.addRule(rule);
      }
    }
    /**
     * Clones the given SelectionRandomizationStateSettings object, creating a new object with identical properties.
     *
     * @param {SelectionRandomizationStateSettings} state - The SelectionRandomizationStateSettings object to be cloned.
     * @return {SelectionRandomizationStateSettings} A new instance of SelectionRandomizationStateSettings with the same properties as the input object.
     */
    cloneSelectionRandomizationState(state) {
      const clone = {};
      if (state.childOrder) {
        clone.childOrder = [...state.childOrder];
      }
      if (state.selectedChildIds) {
        clone.selectedChildIds = [...state.selectedChildIds];
      }
      if (state.hiddenFromChoiceChildIds) {
        clone.hiddenFromChoiceChildIds = [...state.hiddenFromChoiceChildIds];
      }
      if (state.selectionCountStatus !== void 0) {
        clone.selectionCountStatus = state.selectionCountStatus;
      }
      if (state.reorderChildren !== void 0) {
        clone.reorderChildren = state.reorderChildren;
      }
      return clone;
    }
    /**
     * Merges the current array of HideLmsUiItem objects with an optional additional array,
     * and sanitizes the combined result.
     *
     * @param {HideLmsUiItem[]} current - The current array of HideLmsUiItem objects.
     * @param {HideLmsUiItem[]} [additional] - An optional array of additional HideLmsUiItem objects to merge.
     * @return {HideLmsUiItem[]} The sanitized merged array of HideLmsUiItem objects.
     */
    mergeHideLmsUi(current, additional) {
      if (!additional || additional.length === 0) {
        return current;
      }
      return this.sanitizeHideLmsUi([...current, ...additional]);
    }
    /**
     * Sanitizes and processes a collection of sequencing settings. This involves ensuring that
     * the IDs are trimmed and non-empty, cloning objects deeply to ensure immutability,
     * and sanitizing each subset of sequencing configurations.
     *
     * @param {Record<string, SequencingCollectionSettings>} [collections] -
     *        A record of sequencing collection settings where keys are collection IDs
     *        and values are the associated configuration to be sanitized.
     *
     * @return {Record<string, SequencingCollectionSettings>}
     *         A sanitized record of sequencing collection settings, with processed and
     *         cloned settings for immutability and validity.
     */
    sanitizeSequencingCollections(collections) {
      if (!collections) {
        return {};
      }
      const sanitized = {};
      for (const [id, collection] of Object.entries(collections)) {
        const trimmedId = id.trim();
        if (!trimmedId) {
          continue;
        }
        const sanitizedCollection = {};
        if (collection.sequencingControls) {
          sanitizedCollection.sequencingControls = {
            ...collection.sequencingControls
          };
        }
        if (collection.sequencingRules) {
          const ruleClone = rule => {
            const cloned = {
              action: rule.action,
              conditions: rule.conditions.map(condition => {
                const clonedCondition = {
                  condition: condition.condition
                };
                if (condition.operator !== void 0) {
                  clonedCondition.operator = condition.operator;
                }
                if (condition.parameters) {
                  clonedCondition.parameters = {
                    ...condition.parameters
                  };
                }
                if (condition.referencedObjective !== void 0) {
                  clonedCondition.referencedObjective = condition.referencedObjective;
                }
                return clonedCondition;
              })
            };
            if (rule.conditionCombination !== void 0) {
              cloned.conditionCombination = rule.conditionCombination;
            }
            return cloned;
          };
          sanitizedCollection.sequencingRules = {};
          if (collection.sequencingRules.preConditionRules) {
            sanitizedCollection.sequencingRules.preConditionRules = collection.sequencingRules.preConditionRules.map(ruleClone);
          }
          if (collection.sequencingRules.exitConditionRules) {
            sanitizedCollection.sequencingRules.exitConditionRules = collection.sequencingRules.exitConditionRules.map(ruleClone);
          }
          if (collection.sequencingRules.postConditionRules) {
            sanitizedCollection.sequencingRules.postConditionRules = collection.sequencingRules.postConditionRules.map(ruleClone);
          }
        }
        if (collection.rollupRules) {
          sanitizedCollection.rollupRules = {
            rules: collection.rollupRules.rules?.map(rule => {
              const clonedRule = {
                action: rule.action,
                conditions: rule.conditions.map(condition => {
                  const clonedCondition = {
                    condition: condition.condition
                  };
                  if (condition.parameters) {
                    clonedCondition.parameters = {
                      ...condition.parameters
                    };
                  }
                  return clonedCondition;
                })
              };
              if (rule.consideration !== void 0) {
                clonedRule.consideration = rule.consideration;
              }
              if (rule.minimumCount !== void 0) {
                clonedRule.minimumCount = rule.minimumCount;
              }
              if (rule.minimumPercent !== void 0) {
                clonedRule.minimumPercent = rule.minimumPercent;
              }
              return clonedRule;
            })
          };
        }
        if (collection.rollupConsiderations) {
          sanitizedCollection.rollupConsiderations = {
            ...collection.rollupConsiderations
          };
        }
        if (collection.selectionRandomizationState) {
          sanitizedCollection.selectionRandomizationState = this.cloneSelectionRandomizationState(collection.selectionRandomizationState);
        }
        if (collection.hideLmsUi) {
          sanitizedCollection.hideLmsUi = this.sanitizeHideLmsUi(collection.hideLmsUi);
        }
        if (collection.auxiliaryResources) {
          sanitizedCollection.auxiliaryResources = this.sanitizeAuxiliaryResources(collection.auxiliaryResources);
        }
        sanitized[trimmedId] = sanitizedCollection;
      }
      return sanitized;
    }
    /**
     * Normalizes the provided collection references into an array of unique, trimmed strings.
     * Removes duplicates and trims whitespace from each reference.
     *
     * @param {string | string[]} [refs] - A single reference string or an array of reference strings to be normalized.
     *                                      If not provided, defaults to an empty array.
     * @return {string[]} An array of unique and trimmed strings representing normalized collection references.
     */
    normalizeCollectionRefs(refs) {
      if (!refs) {
        return [];
      }
      const raw = Array.isArray(refs) ? refs : [refs];
      const seen = /* @__PURE__ */new Set();
      const result = [];
      for (const ref of raw) {
        const trimmed = ref.trim();
        if (!trimmed || seen.has(trimmed)) {
          continue;
        }
        seen.add(trimmed);
        result.push(trimmed);
      }
      return result;
    }
    /**
     * Applies the sequencing configuration from the given collection to the specified activity.
     *
     * @param {Activity} activity - The activity to which the sequencing collection settings will be applied.
     * @param {SequencingCollectionSettings} collection - The collection of sequencing settings to apply to the activity.
     * @param {SelectionRandomizationStateSettings[]} selectionStates - The list of selection randomization state objects, which may be modified during this process.
     * @return {void} This method does not return a value.
     */
    applySequencingCollection(activity, collection, selectionStates) {
      if (!collection) {
        return;
      }
      if (collection.sequencingControls) {
        this.applySequencingControlsSettings(activity.sequencingControls, collection.sequencingControls);
      }
      if (collection.sequencingRules) {
        this.applySequencingRulesSettings(activity.sequencingRules, collection.sequencingRules);
      }
      if (collection.rollupRules) {
        this.applyRollupRulesSettings(activity.rollupRules, collection.rollupRules);
      }
      if (collection.rollupConsiderations) {
        activity.applyRollupConsiderations(collection.rollupConsiderations);
      }
      if (collection.hideLmsUi) {
        const merged = this.mergeHideLmsUi(activity.hideLmsUi, collection.hideLmsUi);
        if (merged.length > 0) {
          activity.hideLmsUi = merged;
        }
      }
      if (collection.auxiliaryResources) {
        const sanitizedAux = this.sanitizeAuxiliaryResources(collection.auxiliaryResources);
        if (sanitizedAux.length > 0) {
          activity.auxiliaryResources = this.mergeAuxiliaryResources(activity.auxiliaryResources, sanitizedAux);
        }
      }
      if (collection.selectionRandomizationState) {
        selectionStates.push(this.cloneSelectionRandomizationState(collection.selectionRandomizationState));
      }
    }
    /**
     * Sanitizes and filters the given auxiliary resources by removing duplicates,
     * trimming unnecessary whitespace, and ensuring valid data integrity.
     *
     * @param {AuxiliaryResourceSettings[]} [resources] - An optional array of auxiliary resource settings
     *     that include details such as resource ID and purpose.
     * @return {AuxiliaryResource[]} - A sanitized array of auxiliary resources, each containing
     *     valid resource IDs and purposes, with duplicates and invalid entries removed.
     */
    sanitizeAuxiliaryResources(resources) {
      if (!resources) {
        return [];
      }
      const seen = /* @__PURE__ */new Set();
      const sanitized = [];
      for (const resource of resources) {
        if (!resource) continue;
        if (!resource.resourceId || typeof resource.resourceId !== "string") continue;
        if (!resource.purpose || typeof resource.purpose !== "string") continue;
        const resourceId = resource.resourceId.trim();
        const purpose = resource.purpose.trim();
        if (!resourceId || !purpose) continue;
        const key = `${resourceId}::${purpose}`;
        if (!seen.has(key)) {
          seen.add(key);
          sanitized.push({
            resourceId,
            purpose
          });
        }
      }
      return sanitized;
    }
    /**
     * Merges two arrays of auxiliary resources, removing duplicates based on their resource identifiers.
     *
     * @param {AuxiliaryResource[] | undefined} existing - The existing array of auxiliary resources. This can be undefined.
     * @param {AuxiliaryResource[] | undefined} additions - The array of new auxiliary resources to add. This can be undefined.
     * @return {AuxiliaryResource[]} A new array containing unique auxiliary resources from both input arrays, filtered by their resource identifiers.
     */
    mergeAuxiliaryResources(existing, additions) {
      const merged = [];
      const seen = /* @__PURE__ */new Set();
      for (const resource of [...(existing ?? []), ...(additions ?? [])]) {
        if (!resource) {
          continue;
        }
        const resourceId = resource.resourceId;
        if (!resourceId || seen.has(resourceId)) {
          continue;
        }
        seen.add(resourceId);
        merged.push({
          resourceId,
          purpose: resource.purpose
        });
      }
      return merged;
    }
    /**
     * Filters and sanitizes a list of items by removing duplicates and ensuring
     * only valid items are included according to a predefined set of valid tokens.
     *
     * @param {HideLmsUiItem[] | undefined} items - The list of items to be sanitized.
     * Can be undefined, in which case an empty array is returned.
     * @return {HideLmsUiItem[]} The sanitized list of unique and valid items.
     */
    sanitizeHideLmsUi(items) {
      if (!items) {
        return [];
      }
      const valid = new Set(HIDE_LMS_UI_TOKENS);
      const seen = /* @__PURE__ */new Set();
      const sanitized = [];
      for (const item of items) {
        if (valid.has(item) && !seen.has(item)) {
          seen.add(item);
          sanitized.push(item);
        }
      }
      return sanitized;
    }
    /**
     * Configure rollup rules based on provided settings
     * @param {RollupRulesSettings} rollupRulesSettings - The rollup rules settings
     */
    configureRollupRules(rollupRulesSettings) {
      this.applyRollupRulesSettings(this._sequencing.rollupRules, rollupRulesSettings);
    }
    /**
     * Create a rollup rule from settings
     * @param {RollupRuleSettings} ruleSettings - The rollup rule settings
     * @return {RollupRule} - The created rollup rule
     */
    createRollupRule(ruleSettings) {
      const rule = new RollupRule(ruleSettings.action, ruleSettings.consideration, ruleSettings.minimumCount, ruleSettings.minimumPercent);
      for (const conditionSettings of ruleSettings.conditions) {
        const condition = new RollupCondition(conditionSettings.condition, new Map(Object.entries(conditionSettings.parameters || {})));
        rule.addCondition(condition);
      }
      return rule;
    }
    /**
     * Create an activity objective from settings
     * @param {ObjectiveSettings} objectiveSettings
     * @param {boolean} isPrimary
     * @return {ActivityObjective}
     */
    createActivityObjectiveFromSettings(objectiveSettings, isPrimary) {
      const mapInfo = (objectiveSettings.mapInfo || []).map(info => ({
        targetObjectiveID: info.targetObjectiveID,
        readSatisfiedStatus: info.readSatisfiedStatus ?? false,
        readNormalizedMeasure: info.readNormalizedMeasure ?? false,
        writeSatisfiedStatus: info.writeSatisfiedStatus ?? false,
        writeNormalizedMeasure: info.writeNormalizedMeasure ?? false,
        readCompletionStatus: info.readCompletionStatus ?? false,
        writeCompletionStatus: info.writeCompletionStatus ?? false,
        readProgressMeasure: info.readProgressMeasure ?? false,
        writeProgressMeasure: info.writeProgressMeasure ?? false,
        readRawScore: info.readRawScore ?? false,
        writeRawScore: info.writeRawScore ?? false,
        readMinScore: info.readMinScore ?? false,
        writeMinScore: info.writeMinScore ?? false,
        readMaxScore: info.readMaxScore ?? false,
        writeMaxScore: info.writeMaxScore ?? false,
        updateAttemptData: info.updateAttemptData ?? false
      }));
      return new ActivityObjective(objectiveSettings.objectiveID, {
        description: objectiveSettings.description ?? null,
        satisfiedByMeasure: objectiveSettings.satisfiedByMeasure ?? false,
        minNormalizedMeasure: objectiveSettings.minNormalizedMeasure ?? null,
        mapInfo,
        isPrimary
      });
    }
    /**
     * Initialize the sequencing service
     * @param {Settings} settings - API settings that may include sequencing configuration
     */
    initializeSequencingService(settings) {
      try {
        const sequencingConfig = {
          autoRollupOnCMIChange: settings?.sequencing?.autoRollupOnCMIChange ?? true,
          autoProgressOnCompletion: settings?.sequencing?.autoProgressOnCompletion ?? false,
          validateNavigationRequests: settings?.sequencing?.validateNavigationRequests ?? true,
          enableEventSystem: settings?.sequencing?.enableEventSystem ?? true,
          logLevel: settings?.sequencing?.logLevel ?? "info"
        };
        this._sequencingService = new SequencingService(this._sequencing, this.cmi, this.adl, this.eventService || this,
        // Use eventService if available, fallback to this
        this.loggingService,
        // loggingService is always initialized in BaseAPI constructor
        sequencingConfig);
        if (settings?.sequencing?.eventListeners) {
          this._sequencingService.setEventListeners(settings.sequencing.eventListeners);
        }
        this.syncGlobalObjectiveIdsFromSequencing();
      } catch (error) {
        console.warn("Failed to initialize sequencing service:", error);
        this._sequencingService = null;
      }
    }
    /**
     * Syncs global objective IDs from the sequencing service's globalObjectiveMap
     * to settings.globalObjectiveIds. This ensures that objectives referenced via
     * mapInfo in the activity tree are recognized as global objectives when
     * setCMIValue is called.
     *
     * Per SCORM 2004 SN Book SB.2.4, global objectives must persist across SCO
     * transitions and be available for cross-activity objective tracking.
     */
    syncGlobalObjectiveIdsFromSequencing() {
      if (!this._sequencingService) {
        return;
      }
      const overallProcess = this._sequencingService.getOverallSequencingProcess();
      if (!overallProcess) {
        return;
      }
      const globalObjectiveMap = overallProcess.getGlobalObjectiveMap();
      if (!globalObjectiveMap || globalObjectiveMap.size === 0) {
        return;
      }
      const globalIds = Array.from(globalObjectiveMap.keys());
      const existingIds = this.settings.globalObjectiveIds || [];
      const mergedIds = Array.from(new Set(existingIds.concat(globalIds)));
      this.settings.globalObjectiveIds = mergedIds;
    }
    /**
     * Restores global objectives from _globalObjectives to cmi.objectives
     * This is called after Initialize to ensure global objectives are accessible
     * to the content via cmi.objectives.n.id, cmi.objectives.n.success_status, etc.
     *
     * Per SCORM 2004 SN Book SB.2.4, global objectives must persist across SCO
     * transitions and be accessible to content via the CMI data model.
     */
    restoreGlobalObjectivesToCMI() {
      if (this._globalObjectives.length === 0) {
        return;
      }
      for (let i = 0; i < this._globalObjectives.length; i++) {
        const globalObj = this._globalObjectives[i];
        if (!globalObj || !globalObj.id) {
          continue;
        }
        const existingObjective = this.cmi.objectives.findObjectiveById(globalObj.id);
        if (existingObjective) {
          continue;
        }
        const index = this.cmi.objectives.childArray.length;
        this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.id`, globalObj.id);
        if (globalObj.success_status && globalObj.success_status !== "unknown") {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.success_status`, globalObj.success_status);
        }
        if (globalObj.completion_status && globalObj.completion_status !== "unknown") {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.completion_status`, globalObj.completion_status);
        }
        if (globalObj.score.scaled !== "" && globalObj.score.scaled !== null) {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.score.scaled`, globalObj.score.scaled);
        }
        if (globalObj.score.raw !== "" && globalObj.score.raw !== null) {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.score.raw`, globalObj.score.raw);
        }
        if (globalObj.score.min !== "" && globalObj.score.min !== null) {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.score.min`, globalObj.score.min);
        }
        if (globalObj.score.max !== "" && globalObj.score.max !== null) {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.score.max`, globalObj.score.max);
        }
        if (globalObj.progress_measure !== "" && globalObj.progress_measure !== null) {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.progress_measure`, globalObj.progress_measure);
        }
        if (globalObj.description !== "") {
          this._commonSetCMIValue("RestoreGlobalObjective", true, `cmi.objectives.${index}.description`, globalObj.description);
        }
      }
    }
    /**
     * Get the sequencing service (for advanced sequencing operations)
     * @return {SequencingService | null}
     */
    getSequencingService() {
      return this._sequencingService;
    }
    /**
     * Set sequencing event listeners
     * @param {SequencingEventListeners} listeners - Event listeners for sequencing events
     */
    setSequencingEventListeners(listeners) {
      if (this._sequencingService) {
        this._sequencingService.setEventListeners(listeners);
      }
    }
    /**
     * Update sequencing configuration
     * @param {SequencingConfiguration} config - New sequencing configuration
     */
    updateSequencingConfiguration(config) {
      if (this._sequencingService) {
        this._sequencingService.updateConfiguration(config);
      }
    }
    /**
     * Get current sequencing state information
     * @return {object} Current sequencing state
     */
    getSequencingState() {
      if (this._sequencingService) {
        return this._sequencingService.getSequencingState();
      }
      return {
        isInitialized: false,
        isActive: false,
        currentActivity: null,
        rootActivity: this._sequencing.getRootActivity(),
        lastSequencingResult: null
      };
    }
    /**
     * Process a navigation request directly (for advanced use)
     * @param {string} request - Navigation request
     * @param {string} targetActivityId - Target activity ID for choice/jump requests
     * @return {boolean} True if request was processed successfully
     */
    processNavigationRequest(request, targetActivityId) {
      if (this._sequencingService) {
        return this._sequencingService.processNavigationRequest(request, targetActivityId);
      }
      return false;
    }
    /**
     * Reset sequencing state explicitly (primarily for tests/tools, not normal LMS flow)
     */
    resetSequencingState() {
      this._sequencing?.reset();
      this._sequencingService?.setEventListeners({});
    }
    /**
     * Get tracking data for a specific activity
     * Useful for players to update UI based on activity status
     * @param {string} activityId - The activity ID
     * @return {object | null} Tracking data for the activity or null if not found
     */
    getActivityTrackingData(activityId) {
      if (!this._sequencing?.activityTree) {
        return null;
      }
      const activity = this._sequencing.activityTree.getActivity(activityId);
      if (!activity) {
        return null;
      }
      return {
        completionStatus: activity.completionStatus || "unknown",
        successStatus: activity.successStatus || "unknown",
        progressMeasure: activity.progressMeasure ?? null,
        score: activity.objectiveMeasureStatus ? activity.objectiveNormalizedMeasure : null
      };
    }
    /**
     * Save current sequencing state to persistent storage
     * @param {Partial<SequencingStateMetadata>} metadata - Optional metadata override
     * @return {Promise<boolean>} Promise resolving to success status
     */
    async saveSequencingState(metadata) {
      if (!this.settings.sequencingStatePersistence) {
        this.apiLog("saveSequencingState", "No persistence configuration provided", LogLevelEnum.WARN);
        return false;
      }
      try {
        const stateData = this.serializeSequencingState();
        const fullMetadata = {
          learnerId: this.cmi.learner_id || "unknown",
          courseId: this.settings.courseId || "unknown",
          attemptNumber: 1,
          lastUpdated: (/* @__PURE__ */new Date()).toISOString(),
          version: this.settings.sequencingStatePersistence.stateVersion || "1.0",
          ...metadata
        };
        const config = this.settings.sequencingStatePersistence;
        let dataToSave = stateData;
        if (config.compress !== false) {
          dataToSave = this.compressStateData(stateData);
        }
        if (config.maxStateSize && dataToSave.length > config.maxStateSize) {
          throw new Error(`State size ${dataToSave.length} exceeds limit ${config.maxStateSize}`);
        }
        const success = await config.persistence.saveState(dataToSave, fullMetadata);
        if (config.debugPersistence) {
          this.apiLog("saveSequencingState", `State save ${success ? "succeeded" : "failed"}: size=${dataToSave.length}`, success ? LogLevelEnum.INFO : LogLevelEnum.WARN);
        }
        return success;
      } catch (error) {
        this.apiLog("saveSequencingState", `Error saving sequencing state: ${error instanceof Error ? error.message : String(error)}`, LogLevelEnum.ERROR);
        return false;
      }
    }
    /**
     * Load sequencing state from persistent storage
     * @param {Partial<SequencingStateMetadata>} metadata - Optional metadata override
     * @return {Promise<boolean>} Promise resolving to success status
     */
    async loadSequencingState(metadata) {
      if (!this.settings.sequencingStatePersistence) {
        this.apiLog("loadSequencingState", "No persistence configuration provided", LogLevelEnum.WARN);
        return false;
      }
      try {
        const fullMetadata = {
          learnerId: this.cmi.learner_id || "unknown",
          courseId: this.settings.courseId || "unknown",
          attemptNumber: 1,
          version: this.settings.sequencingStatePersistence.stateVersion || "1.0",
          ...metadata
        };
        const config = this.settings.sequencingStatePersistence;
        const stateData = await config.persistence.loadState(fullMetadata);
        if (!stateData) {
          if (config.debugPersistence) {
            this.apiLog("loadSequencingState", "No sequencing state found to load", LogLevelEnum.INFO);
          }
          return false;
        }
        let dataToLoad = stateData;
        if (config.compress !== false) {
          dataToLoad = this.decompressStateData(stateData);
        }
        const success = this.deserializeSequencingState(dataToLoad);
        if (config.debugPersistence) {
          this.apiLog("loadSequencingState", `State load ${success ? "succeeded" : "failed"}: size=${stateData.length}`, success ? LogLevelEnum.INFO : LogLevelEnum.WARN);
        }
        return success;
      } catch (error) {
        this.apiLog("loadSequencingState", `Error loading sequencing state: ${error instanceof Error ? error.message : String(error)}`, LogLevelEnum.ERROR);
        return false;
      }
    }
    /**
     * Determines the appropriate cmi.entry value based on previous exit state.
     * Per SCORM 2004 RTE 4.2.11 (cmi.entry) and 4.2.12 (cmi.exit):
     *
     * - If previous exit was "suspend": "resume" (learner suspended, wants to continue)
     * - If previous exit was "logout": "" (deprecated, attempt ended)
     * - If previous exit was "normal": "" (attempt completed normally)
     * - If previous exit was "time-out":
     *   - With suspend data: "resume" (resuming from interrupted session)
     *   - Without suspend data: "" (session ended)
     * - If no previous exit or unrecognized: "ab-initio" (fresh start)
     *
     * @param {string} previousExit - The cmi.exit value from the previous session
     * @param {boolean} hasSuspendData - Whether suspend_data exists from previous session
     * @return {string} The appropriate cmi.entry value ("ab-initio", "resume", or "")
     */
    determineEntryValue(previousExit, hasSuspendData) {
      const trimmedExit = previousExit?.trim();
      if (previousExit === "" || previousExit === void 0 || previousExit === null || trimmedExit === "") {
        return "ab-initio";
      }
      if (previousExit === "suspend") {
        return "resume";
      }
      if (previousExit === "logout" || previousExit === "normal") {
        return "";
      }
      if (previousExit === "time-out") {
        return hasSuspendData ? "resume" : "";
      }
      return "";
    }
    /**
     * Serialize current sequencing state to JSON string
     * @return {string} Serialized state
     */
    serializeSequencingState() {
      const state = {
        version: this.settings.sequencingStatePersistence?.stateVersion || "1.0",
        timestamp: (/* @__PURE__ */new Date()).toISOString(),
        sequencing: null,
        currentActivityId: null,
        globalObjectives: this._globalObjectives.map(obj => obj.toJSON()),
        globalObjectiveMap: {},
        adlNavState: {
          request: this.adl.nav.request,
          request_valid: this.adl.nav.request_valid
        },
        contentDelivered: false
      };
      if (this._sequencingService) {
        const overallProcess = this._sequencingService.getOverallSequencingProcess();
        if (overallProcess) {
          const sequencingState = overallProcess.getSequencingState();
          state.sequencing = sequencingState;
          state.contentDelivered = overallProcess.hasContentBeenDelivered();
          state.globalObjectiveMap = this.captureGlobalObjectiveSnapshot(overallProcess);
        }
        const currentActivity = this._sequencing.getCurrentActivity();
        if (currentActivity) {
          state.currentActivityId = currentActivity.id;
        }
      }
      if (!state.globalObjectiveMap || Object.keys(state.globalObjectiveMap).length === 0) {
        state.globalObjectiveMap = this.captureGlobalObjectiveSnapshot();
      }
      return JSON.stringify(state);
    }
    /**
     * Deserialize sequencing state from JSON string
     * @param {string} stateData - Serialized state data
     * @return {boolean} Success status
     */
    deserializeSequencingState(stateData) {
      try {
        const state = JSON.parse(stateData);
        const expectedVersion = this.settings.sequencingStatePersistence?.stateVersion || "1.0";
        if (state.version !== expectedVersion) {
          this.apiLog("deserializeSequencingState", `State version mismatch: ${state.version} vs expected ${expectedVersion}`, LogLevelEnum.WARN);
        }
        if (state.globalObjectiveMap && state.sequencing && !state.sequencing.globalObjectiveMap) {
          state.sequencing.globalObjectiveMap = state.globalObjectiveMap;
        }
        if (state.sequencing && this._sequencingService) {
          const overallProcess = this._sequencingService.getOverallSequencingProcess();
          if (overallProcess) {
            overallProcess.restoreSequencingState(state.sequencing);
            if (state.contentDelivered) {
              overallProcess.setContentDelivered(true);
            }
          }
        }
        const restoredObjectives = /* @__PURE__ */new Map();
        if (Array.isArray(state.globalObjectives)) {
          for (const objData of state.globalObjectives) {
            const objective = this.buildCMIObjectiveFromJSON(objData);
            if (objective.id) {
              restoredObjectives.set(objective.id, objective);
            }
          }
        }
        if (state.globalObjectiveMap && typeof state.globalObjectiveMap === "object") {
          const objectivesFromMap = this.buildCMIObjectivesFromMap(state.globalObjectiveMap);
          for (const objective of objectivesFromMap) {
            if (!objective.id) {
              continue;
            }
            if (!restoredObjectives.has(objective.id)) {
              restoredObjectives.set(objective.id, objective);
            }
          }
        }
        if (restoredObjectives.size > 0) {
          this._globalObjectives = Array.from(restoredObjectives.values());
          this._globalObjectives.forEach(objective => {
            if (objective.id) {
              this.updateGlobalObjectiveFromCMI(objective.id, objective);
            }
          });
        }
        if (state.adlNavState) {
          this.adl.nav.request = state.adlNavState.request || "_none_";
          this.adl.nav.request_valid = state.adlNavState.request_valid || {};
        }
        return true;
      } catch (error) {
        this.apiLog("deserializeSequencingState", `Error deserializing sequencing state: ${error instanceof Error ? error.message : String(error)}`, LogLevelEnum.ERROR);
        return false;
      }
    }
    /**
     * Captures the global objective snapshot by collecting data from the provided overall process
     * or the internally managed sequencing service if no process is provided.
     *
     * @param {OverallSequencingProcess | null} [overallProcess] - An optional parameter representing the overall sequencing process. If not provided, it attempts to use the internal sequencing service.
     * @return {Record<string, GlobalObjectiveMapEntry>} A record containing the snapshot of the global objectives, with each objective's identifier as the key and its corresponding data as the value.
     */
    captureGlobalObjectiveSnapshot(overallProcess) {
      const snapshot = {};
      const process = overallProcess ?? this._sequencingService?.getOverallSequencingProcess() ?? null;
      if (process) {
        const processSnapshot = process.getGlobalObjectiveMapSnapshot();
        for (const [id, data] of Object.entries(processSnapshot)) {
          snapshot[id] = {
            ...data
          };
        }
      }
      for (const objective of this._globalObjectives) {
        if (!objective.id || snapshot[objective.id]) {
          continue;
        }
        snapshot[objective.id] = this.buildObjectiveMapEntryFromCMI(objective);
      }
      return snapshot;
    }
    /**
     * Constructs an array of `CMIObjectivesObject` instances from a given snapshot map.
     *
     * @param {Record<string, GlobalObjectiveMapEntry>} snapshot - A map where each entry represents objective data
     *                                         with various properties that may include
     *                                         satisfied status, progress measure, completion status, etc.
     * @return {CMIObjectivesObject[]} An array of `CMIObjectivesObject` instances built
     *                                  from the provided snapshot map. Returns an empty array
     *                                  if the snapshot is invalid or no valid objectives can be created.
     */
    buildCMIObjectivesFromMap(snapshot) {
      const objectives = [];
      if (!snapshot || typeof snapshot !== "object") {
        return objectives;
      }
      for (const [objectiveId, entry] of Object.entries(snapshot)) {
        if (!entry || typeof entry !== "object") {
          continue;
        }
        const objective = new CMIObjectivesObject();
        objective.id = entry.id ?? objectiveId;
        if (entry.satisfiedStatusKnown === true) {
          objective.success_status = entry.satisfiedStatus ? SuccessStatus.PASSED : SuccessStatus.FAILED;
        }
        const normalizedMeasure = this.parseObjectiveNumber(entry.normalizedMeasure);
        if (entry.normalizedMeasureKnown === true && normalizedMeasure !== null) {
          objective.score.scaled = String(normalizedMeasure);
        }
        const progressMeasure = this.parseObjectiveNumber(entry.progressMeasure);
        if (entry.progressMeasureKnown === true && progressMeasure !== null) {
          objective.progress_measure = String(progressMeasure);
        }
        if (entry.completionStatusKnown === true && typeof entry.completionStatus === "string") {
          objective.completion_status = entry.completionStatus;
        }
        objectives.push(objective);
      }
      return objectives;
    }
    /**
     * Constructs a `CMIObjectivesObject` instance from the provided JSON data.
     *
     * @param {any} data - The JSON data used to populate the `CMIObjectivesObject`. If the input is invalid or missing, an empty `CMIObjectivesObject` instance is returned.
     * @return {CMIObjectivesObject} A populated `CMIObjectivesObject` instance based on the input data. Returns a default object if the input does not contain valid fields.
     */
    buildCMIObjectiveFromJSON(data) {
      const objective = new CMIObjectivesObject();
      if (!data || typeof data !== "object") {
        return objective;
      }
      if (typeof data.id === "string") {
        objective.id = data.id;
      }
      if (typeof data.success_status === "string") {
        objective.success_status = data.success_status;
      }
      if (typeof data.completion_status === "string") {
        objective.completion_status = data.completion_status;
      }
      if (typeof data.progress_measure === "string" && data.progress_measure !== "") {
        objective.progress_measure = data.progress_measure;
      }
      if (typeof data.description === "string") {
        objective.description = data.description;
      }
      const score = data.score;
      if (score && typeof score === "object") {
        if (typeof score.scaled === "string" && score.scaled !== "") {
          objective.score.scaled = score.scaled;
        } else if (typeof score.scaled === "number" && Number.isFinite(score.scaled)) {
          objective.score.scaled = String(score.scaled);
        }
        if (typeof score.raw === "string" && score.raw !== "") {
          objective.score.raw = score.raw;
        } else if (typeof score.raw === "number" && Number.isFinite(score.raw)) {
          objective.score.raw = String(score.raw);
        }
        if (typeof score.min === "string" && score.min !== "") {
          objective.score.min = score.min;
        } else if (typeof score.min === "number" && Number.isFinite(score.min)) {
          objective.score.min = String(score.min);
        }
        if (typeof score.max === "string" && score.max !== "") {
          objective.score.max = score.max;
        } else if (typeof score.max === "number" && Number.isFinite(score.max)) {
          objective.score.max = String(score.max);
        }
      }
      return objective;
    }
    /**
     * Builds a map entry from the given CMI objectives object to a standardized GlobalObjectiveMapEntry.
     *
     * @param {CMIObjectivesObject} objective - The CMI objectives object containing data about a specific learning objective.
     * @return {GlobalObjectiveMapEntry} An object containing mapped properties and their values based on the provided objective.
     */
    buildObjectiveMapEntryFromCMI(objective) {
      const entry = {
        id: objective.id,
        satisfiedStatusKnown: false,
        normalizedMeasureKnown: false,
        progressMeasureKnown: false,
        completionStatusKnown: false,
        readSatisfiedStatus: true,
        writeSatisfiedStatus: true,
        readNormalizedMeasure: true,
        writeNormalizedMeasure: true,
        readCompletionStatus: true,
        writeCompletionStatus: true,
        readProgressMeasure: true,
        writeProgressMeasure: true
      };
      if (objective.success_status && objective.success_status !== SuccessStatus.UNKNOWN) {
        entry.satisfiedStatus = objective.success_status === SuccessStatus.PASSED;
        entry.satisfiedStatusKnown = true;
      }
      const normalizedMeasure = this.parseObjectiveNumber(objective.score?.scaled);
      if (normalizedMeasure !== null) {
        entry.normalizedMeasure = normalizedMeasure;
        entry.normalizedMeasureKnown = true;
      }
      const progressMeasure = this.parseObjectiveNumber(objective.progress_measure);
      if (progressMeasure !== null) {
        entry.progressMeasure = progressMeasure;
        entry.progressMeasureKnown = true;
      }
      if (objective.completion_status && objective.completion_status !== CompletionStatus.UNKNOWN) {
        entry.completionStatus = objective.completion_status;
        entry.completionStatusKnown = true;
      }
      return entry;
    }
    /**
     * Updates the global objective map in the sequencing service from CMI objective data.
     *
     * This method synchronizes global objectives between:
     * - _globalObjectives array (persists across SCO transitions)
     * - Sequencing service global objective map (used for sequencing decisions)
     *
     * When a SCO writes to a global objective via SetValue, this method ensures
     * the sequencing service is updated so that sequencing rules can evaluate
     * the objective status correctly.
     *
     * According to SCORM 2004 SN Book SB.2.4, global objectives must be synchronized
     * across all activities that reference them via mapInfo.
     *
     * @param {string} objectiveId - The global objective ID
     * @param {CMIObjectivesObject} objective - The CMI objective object with updated values
     * @private
     */
    updateGlobalObjectiveFromCMI(objectiveId, objective) {
      if (!objectiveId || !this._sequencingService) {
        return;
      }
      const overallProcess = this._sequencingService.getOverallSequencingProcess();
      if (!overallProcess) {
        return;
      }
      const map = overallProcess.getGlobalObjectiveMap();
      if (!map.has(objectiveId)) {
        const fallbackEntry = this.buildObjectiveMapEntryFromCMI(objective);
        overallProcess.updateGlobalObjective(objectiveId, fallbackEntry);
        return;
      }
      const updatePayload = {};
      if (objective.success_status && objective.success_status !== SuccessStatus.UNKNOWN) {
        updatePayload.satisfiedStatus = objective.success_status === SuccessStatus.PASSED;
        updatePayload.satisfiedStatusKnown = true;
      }
      const normalizedMeasure = this.parseObjectiveNumber(objective.score?.scaled);
      if (normalizedMeasure !== null) {
        updatePayload.normalizedMeasure = normalizedMeasure;
        updatePayload.normalizedMeasureKnown = true;
      }
      const progressMeasure = this.parseObjectiveNumber(objective.progress_measure);
      if (progressMeasure !== null) {
        updatePayload.progressMeasure = progressMeasure;
        updatePayload.progressMeasureKnown = true;
      }
      if (objective.completion_status && objective.completion_status !== CompletionStatus.UNKNOWN) {
        updatePayload.completionStatus = objective.completion_status;
        updatePayload.completionStatusKnown = true;
      }
      if (Object.keys(updatePayload).length === 0) {
        return;
      }
      overallProcess.updateGlobalObjective(objectiveId, updatePayload);
    }
    /**
     * Parses the given value into a finite number if possible, otherwise returns null.
     *
     * @param {any} value - The input value to be parsed into a number.
     * @return {number | null} The parsed finite number if the input is valid, otherwise null.
     */
    parseObjectiveNumber(value) {
      if (value === null || value === void 0) {
        return null;
      }
      if (typeof value === "number" && Number.isFinite(value)) {
        return value;
      }
      const parsed = parseFloat(String(value));
      return Number.isFinite(parsed) ? parsed : null;
    }
    /**
     * Simple compression using base64 encoding
     * @param {string} data - Data to compress
     * @return {string} Compressed data
     */
    compressStateData(data) {
      if (typeof btoa !== "undefined") {
        return btoa(encodeURIComponent(data));
      }
      return data;
    }
    /**
     * Simple decompression from base64
     * @param {string} data - Data to decompress
     * @return {string} Decompressed data
     */
    decompressStateData(data) {
      if (typeof atob !== "undefined") {
        try {
          return decodeURIComponent(atob(data));
        } catch {
          return data;
        }
      }
      return data;
    }
  }

  return Scorm2004API;

})();
//# sourceMappingURL=scorm2004.js.map
