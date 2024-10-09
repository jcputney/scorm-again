import { expect } from "expect";
import * as sinon from "sinon";
import { ResultObject, Settings } from "../../src/types/api_types";
import APIConstants from "../../src/constants/api_constants";

describe("Settings Type", () => {
  const defaultSettings: Settings = {
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
    strict_errors: true,
    xhrHeaders: {},
    xhrWithCredentials: false,
    responseHandler: async (response: Response): Promise<ResultObject> => {
      const httpResult = JSON.parse(await response.text());
      return {
        result: httpResult.result || APIConstants.global.SCORM_FALSE,
        errorCode:
          httpResult.errorCode !== undefined ? httpResult.errorCode : 101,
      };
    },
    requestHandler: (commitObject: any) => commitObject,
    onLogMessage: (messageLevel: number, logMessage: string) => {
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
  };

  it("should have correct default values", () => {
    expect(defaultSettings.autocommit).toBe(false);
    expect(defaultSettings.autocommitSeconds).toEqual(10);
    expect(defaultSettings.asyncCommit).toBe(false);
    expect(defaultSettings.sendFullCommit).toBe(true);
    expect(defaultSettings.lmsCommitUrl).toBe(false);
    expect(defaultSettings.dataCommitFormat).toEqual("json");
    expect(defaultSettings.commitRequestDataType).toEqual(
      "application/json;charset=UTF-8",
    );
    expect(defaultSettings.autoProgress).toBe(false);
    expect(defaultSettings.logLevel).toEqual(
      APIConstants.global.LOG_LEVEL_ERROR,
    );
    expect(defaultSettings.selfReportSessionTime).toBe(false);
    expect(defaultSettings.alwaysSendTotalTime).toBe(false);
    expect(defaultSettings.strict_errors).toBe(true);
    expect(defaultSettings.xhrHeaders).toEqual({});
    expect(defaultSettings.xhrWithCredentials).toBe(false);
  });

  it("should handle response correctly in responseHandler", async () => {
    const response = new Response(
      JSON.stringify({ result: "true", errorCode: 0 }),
    );
    const result = await defaultSettings.responseHandler(response);
    expect(result.result).toEqual("true");
    expect(result.errorCode).toEqual(0);
  });

  it("should handle request correctly in requestHandler", () => {
    const commitObject = { data: "test" };
    const result = defaultSettings.requestHandler(commitObject);
    expect(result).toEqual(commitObject);
  });

  it("should log messages correctly in onLogMessage", () => {
    const consoleErrorStub = sinon.stub(console, "error");
    const consoleWarnStub = sinon.stub(console, "warn");
    const consoleInfoStub = sinon.stub(console, "info");
    const consoleDebugStub = sinon.stub(console, "debug");
    const consoleLogStub = sinon.stub(console, "log");

    defaultSettings.onLogMessage(
      APIConstants.global.LOG_LEVEL_ERROR,
      "Error message",
    );
    expect(consoleErrorStub.calledWith("Error message")).toBe(true);

    defaultSettings.onLogMessage(
      APIConstants.global.LOG_LEVEL_WARNING,
      "Warning message",
    );
    expect(consoleWarnStub.calledWith("Warning message")).toBe(true);

    defaultSettings.onLogMessage(
      APIConstants.global.LOG_LEVEL_INFO,
      "Info message",
    );
    expect(consoleInfoStub.calledWith("Info message")).toBe(true);

    defaultSettings.onLogMessage(
      APIConstants.global.LOG_LEVEL_DEBUG,
      "Debug message",
    );
    expect(consoleDebugStub.calledWith("Debug message")).toBe(true);

    consoleErrorStub.restore();
    consoleWarnStub.restore();
    consoleInfoStub.restore();
    consoleDebugStub.restore();
    consoleLogStub.restore();
  });
});
