import { InternalSettings, LogLevel, ResultObject } from "../types/api_types";
import { global_constants } from "./api_constants";
import { LogLevelEnum } from "./enums";

/**
 * Default settings for the SCORM API
 */
export const DefaultSettings: InternalSettings = {
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
  responseHandler: async function (response: Response): Promise<ResultObject> {
    if (typeof response !== "undefined") {
      let httpResult = null;

      // Handle both text() and json() response methods
      try {
        if (typeof response.json === "function") {
          // Try to get JSON directly if the method exists
          httpResult = await response.json();
        } else if (typeof response.text === "function") {
          // Fall back to text() if json() is not available
          const responseText = await response.text();
          if (responseText) {
            httpResult = JSON.parse(responseText);
          }
        }
      } catch (e) {
        // If parsing fails, continue with null httpResult
      }

      if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
        if (response.status === 200) {
          return {
            result: global_constants.SCORM_TRUE,
            errorCode: 0,
          };
        } else {
          return {
            result: global_constants.SCORM_FALSE,
            errorCode: 101,
          };
        }
      } else {
        return {
          result: httpResult.result,
          errorCode: httpResult.errorCode
            ? httpResult.errorCode
            : httpResult.result === global_constants.SCORM_TRUE
              ? 0
              : 101,
        };
      }
    }
    return {
      result: global_constants.SCORM_FALSE,
      errorCode: 101,
    };
  },
  xhrResponseHandler: function (xhr: XMLHttpRequest): ResultObject {
    if (typeof xhr !== "undefined") {
      let httpResult = null;

      if (xhr.status >= 200 && xhr.status <= 299) {
        try {
          httpResult = JSON.parse(xhr.responseText);
        } catch (e) {
          // Parsing failed, but status was success
        }

        if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
          return { result: global_constants.SCORM_TRUE, errorCode: 0 };
        }
        return {
          result: httpResult.result,
          errorCode: httpResult.errorCode
            ? httpResult.errorCode
            : httpResult.result === global_constants.SCORM_TRUE
              ? 0
              : 101,
        };
      } else {
        return { result: global_constants.SCORM_FALSE, errorCode: 101 };
      }
    }
    return { result: global_constants.SCORM_FALSE, errorCode: 101 };
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
  globalStudentPreferences: false,
};

export function defaultLogHandler(messageLevel: LogLevel, logMessage: string): void {
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
