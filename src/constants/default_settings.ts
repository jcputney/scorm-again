import { InternalSettings, LogLevel, ResultObject } from "../types/api_types";
import { global_constants } from "./api_constants";
import { LogLevelEnum } from "./enums";

/**
 * Default settings for the SCORM API
 */
export const DefaultSettings: InternalSettings = {
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
  responseHandler: async function (response: Response): Promise<ResultObject> {
    if (typeof response !== "undefined") {
      const responseText = await response.text();
      let httpResult = null;
      if (responseText) {
        httpResult = JSON.parse(responseText);
      }
      if (
        httpResult === null ||
        !{}.hasOwnProperty.call(httpResult, "result")
      ) {
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
  requestHandler: function (commitObject) {
    return commitObject;
  },
  onLogMessage: function (messageLevel: LogLevel, logMessage) {
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
  },
  scoItemIds: [],
  scoItemIdValidator: false,
  globalObjectiveIds: [],
};
