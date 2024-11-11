import { expect } from "expect";
import * as sinon from "sinon";
import { SinonStub } from "sinon";
import { LogLevel, ResultObject, Settings } from "../../src/types/api_types";
import { global_constants } from "../../src/constants/api_constants";
import { LogLevelEnum } from "../../src/constants/enums";
import { DefaultSettings } from "../../src/constants/default_settings";

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
    logLevel: LogLevelEnum.ERROR,
    selfReportSessionTime: false,
    alwaysSendTotalTime: false,
    strict_errors: true,
    xhrHeaders: {},
    xhrWithCredentials: false,
    responseHandler: async (response: Response): Promise<ResultObject> => {
      const httpResult = JSON.parse(await response.text());
      return {
        result: httpResult.result || global_constants.SCORM_FALSE,
        errorCode:
          httpResult.errorCode !== undefined ? httpResult.errorCode : 101,
      };
    },
    requestHandler: (commitObject: any) => commitObject,
    onLogMessage: DefaultSettings.onLogMessage,
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
    expect(defaultSettings.logLevel).toEqual(LogLevelEnum.ERROR);
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

    const testLog = function (
      stub: SinonStub,
      level: LogLevel,
      shouldBeLogged = true,
    ) {
      const message = `${level} message - ${typeof level}`;
      defaultSettings.onLogMessage(level, message);
      expect(stub.calledWith(message)).toBe(shouldBeLogged);
    };

    testLog(consoleErrorStub, LogLevelEnum.ERROR);
    testLog(consoleErrorStub, 4);
    testLog(consoleErrorStub, "4");
    testLog(consoleErrorStub, "ERROR");

    testLog(consoleWarnStub, LogLevelEnum.WARN);
    testLog(consoleWarnStub, 3);
    testLog(consoleWarnStub, "3");
    testLog(consoleWarnStub, "WARN");

    testLog(consoleInfoStub, LogLevelEnum.INFO);
    testLog(consoleInfoStub, 2);
    testLog(consoleInfoStub, "2");
    testLog(consoleInfoStub, "INFO");

    testLog(consoleDebugStub, LogLevelEnum.DEBUG);
    testLog(consoleDebugStub, 1);
    testLog(consoleDebugStub, "1");
    testLog(consoleDebugStub, "DEBUG");

    testLog(consoleLogStub, LogLevelEnum.NONE, false);
    testLog(consoleLogStub, 5, false);
    testLog(consoleLogStub, "5", false);
    testLog(consoleLogStub, "NONE", false);

    consoleErrorStub.restore();
    consoleWarnStub.restore();
    consoleInfoStub.restore();
    consoleDebugStub.restore();
    consoleLogStub.restore();
  });
});
