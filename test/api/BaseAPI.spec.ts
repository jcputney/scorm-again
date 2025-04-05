import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { SinonStub } from "sinon";
import BaseAPI from "../../src/BaseAPI";
import { BaseCMI, BaseRootCMI } from "../../src/cmi/common/base_cmi";
import { ErrorCode } from "../../src/constants/error_codes";
import { CommitObject, ResultObject, Settings } from "../../src/types/api_types";
import { global_constants } from "../../src/constants/api_constants";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";
import { getLoggingService } from "../../src/services/LoggingService";
import { StringKeyMap } from "../../src/utilities";

// Create a concrete implementation of BaseAPI for testing
class TestAPI extends BaseAPI {
  constructor(error_codes: ErrorCode, settings?: Settings) {
    super(error_codes, settings);
  }

  public cmi: BaseRootCMI = {
    initialize: sinon.stub(),
    setStartTime: sinon.stub(),
    getCurrentTotalTime: sinon.stub().returns("PT0H0M0S"),
    reset: sinon.stub(),
    _initialized: false,
    _start_time: 0,
    get initialized(): boolean {
      return this._initialized;
    },
    get start_time(): number | undefined {
      return undefined;
    },
    jsonString: false,
  } as unknown as BaseRootCMI;

  // Implement abstract methods
  reset() {}

  lmsInitialize() {
    return "true";
  }

  lmsFinish() {
    return "true";
  }

  lmsGetValue(_CMIElement: string) {
    return "";
  }

  lmsSetValue(_CMIElement: string, _value: unknown) {
    return "true";
  }

  lmsCommit() {
    return "true";
  }

  lmsGetLastError() {
    return "0";
  }

  lmsGetErrorString(_CMIErrorCode: string | number) {
    return "";
  }

  lmsGetDiagnostic(_CMIErrorCode: string | number) {
    return "";
  }

  validateCorrectResponse(_CMIElement: string, _value: unknown): void {}

  getChildElement(_CMIElement: string, _value: unknown, _foundFirstIndex: boolean): BaseCMI | null {
    return null;
  }

  async storeData(_calculateTotalTime: boolean): Promise<ResultObject> {
    return { result: "true", errorCode: 0 };
  }

  renderCommitCMI(_terminateCommit: boolean): StringKeyMap | Array<string> {
    return {};
  }

  renderCommitObject(_terminateCommit: boolean): CommitObject {
    return {
      successStatus: SuccessStatus.UNKNOWN,
      completionStatus: CompletionStatus.UNKNOWN,
      totalTimeSeconds: 0,
      runtimeData: {},
    };
  }

  // Expose protected methods for testing
  public exposedGetLmsErrorMessageDetails(
    errorNumber: string | number,
    detail: boolean = false,
  ): string {
    return this.getLmsErrorMessageDetails(errorNumber, detail);
  }

  public exposedGetCMIValue(CMIElement: string): string {
    return this.getCMIValue(CMIElement);
  }

  public exposedSetCMIValue(CMIElement: string, value: unknown): string {
    return this.setCMIValue(CMIElement, value);
  }
}

describe("BaseAPI", () => {
  let api: TestAPI;
  let errorCodes: ErrorCode;
  let logServiceStub: sinon.SinonStub;

  beforeEach(() => {
    errorCodes = {
      GENERAL: 101,
      INITIALIZED: 102,
      TERMINATED: 103,
      RETRIEVE_BEFORE_INIT: 122,
      RETRIEVE_AFTER_TERM: 123,
      STORE_BEFORE_INIT: 132,
      STORE_AFTER_TERM: 133,
      COMMIT_BEFORE_INIT: 142,
      COMMIT_AFTER_TERM: 143,
      TERMINATION_BEFORE_INIT: 112,
      MULTIPLE_TERMINATION: 113,
    };

    // Stub the logging service
    logServiceStub = sinon.stub(getLoggingService(), "log");

    api = new TestAPI(errorCodes);
  });

  afterEach(() => {
    logServiceStub.restore();
    sinon.restore();
  });

  describe("setCMIValue", () => {
    it("should throw an error when called directly", () => {
      expect(() => {
        api.exposedSetCMIValue("cmi.core.student_id", "123");
      }).toThrow("The setCMIValue method has not been implemented");
    });
  });

  describe("getCMIValue", () => {
    it("should throw an error when called directly", () => {
      expect(() => {
        api.exposedGetCMIValue("cmi.core.student_id");
      }).toThrow("The getCMIValue method has not been implemented");
    });
  });

  describe("getLmsErrorMessageDetails", () => {
    it("should throw an error when called directly", () => {
      expect(() => {
        api.exposedGetLmsErrorMessageDetails(101);
      }).toThrow("The getLmsErrorMessageDetails method has not been implemented");
    });
  });

  describe("renderCMIToJSONString", () => {
    it("should call serializationService.renderCMIToJSONString with cmi and sendFullCommit", () => {
      // Arrange
      const renderCMIToJSONStringStub = sinon
        .stub(api["_serializationService"], "renderCMIToJSONString")
        .returns("{}");

      // Act
      const result = api.renderCMIToJSONString();

      // Assert
      expect(renderCMIToJSONStringStub.calledOnce).toBe(true);
      expect(renderCMIToJSONStringStub.calledWith(api.cmi, api.settings.sendFullCommit)).toBe(true);
      expect(result).toBe("{}");
    });
  });

  describe("renderCMIToJSONObject", () => {
    it("should call serializationService.renderCMIToJSONObject with cmi and sendFullCommit", () => {
      // Arrange
      const renderCMIToJSONObjectStub = sinon
        .stub(api["_serializationService"], "renderCMIToJSONObject")
        .returns({});

      // Act
      const result = api.renderCMIToJSONObject();

      // Assert
      expect(renderCMIToJSONObjectStub.calledOnce).toBe(true);
      expect(renderCMIToJSONObjectStub.calledWith(api.cmi, api.settings.sendFullCommit)).toBe(true);
      expect(result).toEqual({});
    });
  });

  describe("initialize", () => {
    it("should return SCORM_FALSE when already initialized", () => {
      // Arrange
      api.currentState = global_constants.STATE_INITIALIZED;
      const throwSCORMErrorSpy = sinon.spy(api, "throwSCORMError");

      // Act
      const result = api.initialize("initialize", "Already initialized", "Already terminated");

      // Assert
      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(
        throwSCORMErrorSpy.calledWith("api", errorCodes.INITIALIZED, "Already initialized"),
      ).toBe(true);
    });

    it("should return SCORM_FALSE when already terminated", () => {
      // Arrange
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = sinon.spy(api, "throwSCORMError");

      // Act
      const result = api.initialize("initialize", "Already initialized", "Already terminated");

      // Assert
      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(
        throwSCORMErrorSpy.calledWith("api", errorCodes.TERMINATED, "Already terminated"),
      ).toBe(true);
    });

    it("should return SCORM_TRUE when initialization is successful", () => {
      // Arrange
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      api.selfReportSessionTime = true;
      const processListenersSpy = sinon.spy(api, "processListeners");

      // Act
      const result = api.initialize("initialize");

      // Assert
      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(api.currentState).toBe(global_constants.STATE_INITIALIZED);
      const startTime = api.cmi.setStartTime as SinonStub;
      expect(startTime.calledOnce).toBe(true);
      expect(processListenersSpy.calledWith("initialize")).toBe(true);
    });
  });

  describe("apiLog", () => {
    it("should call loggingService.log when message level is higher than apiLogLevel", () => {
      // Arrange
      api.apiLogLevel = LogLevelEnum.INFO;

      // Act
      api.apiLog("test", "test message", LogLevelEnum.ERROR);

      // Assert
      expect(logServiceStub.calledOnce).toBe(true);
    });

    it("should not call loggingService.log when message level is lower than apiLogLevel", () => {
      // Arrange
      api.apiLogLevel = LogLevelEnum.ERROR;

      // Act
      api.apiLog("test", "test message", LogLevelEnum.INFO);

      // Assert
      expect(logServiceStub.called).toBe(false);
    });
  });

  describe("settings", () => {
    it("should update apiLogLevel when settings.logLevel changes", () => {
      // Arrange
      const loggingService = getLoggingService();
      const setLogLevelSpy = sinon.spy(loggingService, "setLogLevel");

      // Act
      api.settings = { logLevel: LogLevelEnum.DEBUG };

      // Assert
      expect(api.apiLogLevel).toBe(LogLevelEnum.DEBUG);
      expect(setLogLevelSpy.calledWith(LogLevelEnum.DEBUG)).toBe(true);

      setLogLevelSpy.restore();
    });

    it("should update logHandler when settings.onLogMessage changes", () => {
      // Arrange
      const loggingService = getLoggingService();
      const setLogHandlerSpy = sinon.spy(loggingService, "setLogHandler");
      const customHandler = () => {};

      // Act
      api.settings = { onLogMessage: customHandler };

      // Assert
      expect(setLogHandlerSpy.calledWith(customHandler)).toBe(true);

      setLogHandlerSpy.restore();
    });
  });

  describe("loadFromJSON", () => {
    it("should call serializationService.loadFromJSON with correct parameters", () => {
      // Arrange
      const loadFromJSONStub = sinon.stub(api["_serializationService"], "loadFromJSON");
      const json = { cmi: { core: { student_id: "123" } } };

      // Act
      api.loadFromJSON(json);

      // Assert
      expect(loadFromJSONStub.calledOnce).toBe(true);
      expect(loadFromJSONStub.firstCall.args[0]).toBe(json);
      expect(loadFromJSONStub.firstCall.args[1]).toBe("");
      expect(typeof loadFromJSONStub.firstCall.args[2]).toBe("function"); // setCMIValue
      expect(typeof loadFromJSONStub.firstCall.args[3]).toBe("function"); // isNotInitialized
      expect(typeof loadFromJSONStub.firstCall.args[4]).toBe("function"); // callback
    });
  });

  describe("loadFromFlattenedJSON", () => {
    it("should call serializationService.loadFromFlattenedJSON with correct parameters", () => {
      // Arrange
      const loadFromFlattenedJSONStub = sinon.stub(
        api["_serializationService"],
        "loadFromFlattenedJSON",
      );
      const json = { "cmi.core.student_id": "123" };

      // Act
      api.loadFromFlattenedJSON(json);

      // Assert
      expect(loadFromFlattenedJSONStub.calledOnce).toBe(true);
      expect(loadFromFlattenedJSONStub.firstCall.args[0]).toBe(json);
      expect(loadFromFlattenedJSONStub.firstCall.args[1]).toBe("");
      expect(typeof loadFromFlattenedJSONStub.firstCall.args[2]).toBe("function"); // loadFromJSON
      expect(typeof loadFromFlattenedJSONStub.firstCall.args[3]).toBe("function"); // setCMIValue
      expect(typeof loadFromFlattenedJSONStub.firstCall.args[4]).toBe("function"); // isNotInitialized
    });

    it("should use provided CMIElement when specified", () => {
      // Arrange
      const loadFromFlattenedJSONStub = sinon.stub(
        api["_serializationService"],
        "loadFromFlattenedJSON",
      );
      const json = { student_id: "123" };

      // Act
      api.loadFromFlattenedJSON(json, "cmi.core");

      // Assert
      expect(loadFromFlattenedJSONStub.calledOnce).toBe(true);
      expect(loadFromFlattenedJSONStub.firstCall.args[1]).toBe("cmi.core");
    });
  });
});
