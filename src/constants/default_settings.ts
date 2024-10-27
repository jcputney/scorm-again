import { ResultObject, Settings } from "../types/api_types";
import APIConstants from "./api_constants";

/**
 * Default settings for the SCORM API
 */
export const DefaultSettings: Settings = {
  autocommit: false,
  autocommitSeconds: 10,
  asyncCommit: false,
  sendFullCommit: true,
  lmsCommitUrl: false,
  dataCommitFormat: "json",
  commitRequestDataType: "application/json;charset=UTF-8",
  autoProgress: false,
  logLevel: APIConstants.global.LOG_LEVEL_ERROR,
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
            result: APIConstants.global.SCORM_TRUE,
            errorCode: 0,
          };
        } else {
          return {
            result: APIConstants.global.SCORM_FALSE,
            errorCode: 101,
          };
        }
      } else {
        return {
          result: httpResult.result,
          errorCode: httpResult.errorCode
            ? httpResult.errorCode
            : httpResult.result === APIConstants.global.SCORM_TRUE
              ? 0
              : 101,
        };
      }
    }
    return {
      result: APIConstants.global.SCORM_FALSE,
      errorCode: 101,
    };
  },
  requestHandler: function (commitObject) {
    return commitObject;
  },
  onLogMessage: function (messageLevel, logMessage) {
    switch (messageLevel) {
      case APIConstants.global.LOG_LEVEL_ERROR:
        console.error(logMessage);
        break;
      case APIConstants.global.LOG_LEVEL_WARNING:
        console.warn(logMessage);
        break;
      case APIConstants.global.LOG_LEVEL_INFO:
        console.info(logMessage);
        break;
      case APIConstants.global.LOG_LEVEL_DEBUG:
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
};
