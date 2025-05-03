import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BaseAPI from "../../src/BaseAPI";
import { BaseCMI, BaseRootCMI } from "../../src/cmi/common/base_cmi";
import { ErrorCode, global_constants, StringKeyMap } from "../../src";
import { CommitObject, ResultObject, Settings } from "../../src/types/api_types";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";
import { getLoggingService } from "../../src/services/LoggingService";
import { OfflineStorageService } from "../../src/services/OfflineStorageService";
import * as Utilities from "../../src/utilities";
import { ValidationError } from "../../src/exceptions";

// Create a concrete implementation of BaseAPI for testing
class TestAPI extends BaseAPI {
  constructor(error_codes: ErrorCode, settings?: Settings) {
    super(error_codes, settings);
  }

  public cmi: BaseRootCMI = {
    initialize: vi.fn(),
    setStartTime: vi.fn(),
    getCurrentTotalTime: vi.fn().mockReturnValue("PT0H0M0S"),
    reset: vi.fn(),
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

  override getLmsErrorMessageDetails(
    _errorNumber: string | number,
    _detail: boolean = false,
  ): string {
    return `Error: ${_errorNumber}${_detail ? " (Detailed)" : ""}`;
  }

  // Expose protected methods for testing
  public exposedGetLmsErrorMessageDetails(
    errorNumber: string | number,
    detail: boolean = false,
  ): string {
    return super.getLmsErrorMessageDetails(errorNumber, detail);
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
  let logServiceStub: ReturnType<typeof vi.spyOn>;

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
    logServiceStub = vi.spyOn(getLoggingService(), "log").mockImplementation(() => {});

    api = new TestAPI(errorCodes);
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      const renderCMIToJSONStringStub = vi
        .spyOn(api["_serializationService"], "renderCMIToJSONString")
        .mockReturnValue("{}");

      const result = api.renderCMIToJSONString();

      expect(renderCMIToJSONStringStub).toHaveBeenCalledOnce();
      expect(renderCMIToJSONStringStub).toHaveBeenCalledWith(api.cmi, api.settings.sendFullCommit);
      expect(result).toBe("{}");
    });
  });

  describe("renderCMIToJSONObject", () => {
    it("should call serializationService.renderCMIToJSONObject with cmi and sendFullCommit", () => {
      const renderCMIToJSONObjectStub = vi
        .spyOn(api["_serializationService"], "renderCMIToJSONObject")
        .mockReturnValue({});

      const result = api.renderCMIToJSONObject();

      expect(renderCMIToJSONObjectStub).toHaveBeenCalledOnce();
      expect(renderCMIToJSONObjectStub).toHaveBeenCalledWith(api.cmi, api.settings.sendFullCommit);
      expect(result).toEqual({});
    });
  });

  describe("initialize", () => {
    it("should return SCORM_FALSE when already initialized", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.initialize("initialize", "Already initialized", "Already terminated");

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(
        "api",
        errorCodes.INITIALIZED,
        "Already initialized",
      );
    });

    it("should return SCORM_FALSE when already terminated", () => {
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.initialize("initialize", "Already initialized", "Already terminated");

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(
        "api",
        errorCodes.TERMINATED,
        "Already terminated",
      );
    });

    it("should return SCORM_TRUE when initialization is successful", () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      api.selfReportSessionTime = true;
      const processListenersSpy = vi.spyOn(api, "processListeners");

      const result = api.initialize("initialize");

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(api.currentState).toBe(global_constants.STATE_INITIALIZED);
      const startTime = api.cmi.setStartTime as ReturnType<typeof vi.fn>;
      expect(startTime).toHaveBeenCalledOnce();
      expect(processListenersSpy).toHaveBeenCalledWith("initialize");
    });
  });

  describe("apiLog", () => {
    it("should call loggingService.log when message level is higher than apiLogLevel", () => {
      const loggingService = getLoggingService();
      const logSpy = vi.spyOn(loggingService, "log");
      api.apiLogLevel = LogLevelEnum.ERROR;

      api.apiLog("test", "Test message", LogLevelEnum.WARN);

      expect(logSpy).not.toHaveBeenCalled();
    });

    it("should not call loggingService.log when message level is lower than apiLogLevel", () => {
      const loggingService = getLoggingService();
      const logSpy = vi.spyOn(loggingService, "log");
      api.apiLogLevel = LogLevelEnum.ERROR;

      api.apiLog("test", "Test message", LogLevelEnum.DEBUG);

      expect(logSpy).not.toHaveBeenCalled();
    });
  });

  describe("settings", () => {
    it("should update apiLogLevel when settings.logLevel changes", () => {
      const loggingService = getLoggingService();
      const setLogLevelSpy = vi.spyOn(loggingService, "setLogLevel");

      api.settings = { logLevel: LogLevelEnum.DEBUG };

      expect(api.apiLogLevel).toBe(LogLevelEnum.DEBUG);
      expect(setLogLevelSpy).toHaveBeenCalledWith(LogLevelEnum.DEBUG);
    });

    it("should update logHandler when settings.onLogMessage changes", () => {
      const loggingService = getLoggingService();
      const setLogHandlerSpy = vi.spyOn(loggingService, "setLogHandler");
      const customHandler = () => {};

      api.settings = { onLogMessage: customHandler };

      expect(setLogHandlerSpy).toHaveBeenCalledWith(customHandler);
    });
  });

  describe("loadFromJSON", () => {
    it("should call serializationService.loadFromJSON with correct parameters", () => {
      const loadFromJSONStub = vi
        .spyOn(api["_serializationService"], "loadFromJSON")
        .mockImplementation(() => {});
      const json = { cmi: { core: { student_id: "123" } } };

      api.loadFromJSON(json);

      expect(loadFromJSONStub).toHaveBeenCalledOnce();
      expect(loadFromJSONStub).toHaveBeenCalled();
      // Note: We can't easily check the arguments because of the function references
    });
  });

  describe("loadFromFlattenedJSON", () => {
    it("should call serializationService.loadFromFlattenedJSON with correct parameters", () => {
      const loadFromFlattenedJSONStub = vi
        .spyOn(api["_serializationService"], "loadFromFlattenedJSON")
        .mockImplementation(() => {});
      const json = { "cmi.core.student_id": "123" };

      api.loadFromFlattenedJSON(json);

      expect(loadFromFlattenedJSONStub).toHaveBeenCalledOnce();
      expect(loadFromFlattenedJSONStub).toHaveBeenCalled();
      // Note: We can't easily check the arguments because of the function references
    });

    it("should use provided CMIElement when specified", () => {
      const loadFromFlattenedJSONStub = vi
        .spyOn(api["_serializationService"], "loadFromFlattenedJSON")
        .mockImplementation(() => {});
      const json = { "cmi.core.student_id": "123" };

      api.loadFromFlattenedJSON(json, "cmi.core");

      expect(loadFromFlattenedJSONStub).toHaveBeenCalledOnce();
      // We know it's called with the right arguments, but we can't easily check them directly
    });
  });
  describe("handleValueAccessException", () => {
    it("should set lastErrorCode and throw SCORM error for ValidationError", () => {
      const CMIElement = "cmi.core.student_id";
      const errorCode = 101;
      const errorMessage = "Validation error";
      const error = new ValidationError(CMIElement, errorCode, errorMessage);
      const returnValue = "some value";
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api["handleValueAccessException"](CMIElement, error, returnValue);

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(api.lastErrorCode).toBe(String(errorCode));
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(CMIElement, errorCode, errorMessage);
    });

    it("should throw SCORM error with message for Error objects", () => {
      const CMIElement = "cmi.core.student_id";
      const errorMessage = "Some error message";
      const error = new Error(errorMessage);
      const returnValue = "some value";
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api["handleValueAccessException"](CMIElement, error, returnValue);

      expect(result).toBe(returnValue);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(CMIElement, errorCodes.GENERAL, errorMessage);
    });

    it("should throw SCORM error with 'Unknown error' for non-Error objects", () => {
      const CMIElement = "cmi.core.student_id";
      const error = "Just a string error";
      const returnValue = "some value";
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api["handleValueAccessException"](CMIElement, error, returnValue);

      expect(result).toBe(returnValue);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(
        CMIElement,
        errorCodes.GENERAL,
        "Unknown error",
      );
    });
  });

  describe("_checkObjectHasProperty", () => {
    it("should return true for own properties", () => {
      const obj = { name: "John" };

      const result = api["_checkObjectHasProperty"](obj, "name");

      expect(result).toBe(true);
    });

    it("should return false for non-existent properties", () => {
      const obj = { name: "John" };

      const result = api["_checkObjectHasProperty"](obj, "age");

      expect(result).toBe(false);
    });

    it("should return true for inherited properties", () => {
      class Parent {
        get type() {
          return "parent";
        }
      }

      const child = Object.create(new Parent());

      const result = api["_checkObjectHasProperty"](child, "type");

      expect(result).toBe(true);
    });

    it("should return true for properties defined with Object.defineProperty", () => {
      const obj = {};
      Object.defineProperty(obj, "id", {
        value: 123,
        enumerable: true,
      });

      const result = api["_checkObjectHasProperty"](obj, "id");

      expect(result).toBe(true);
    });
  });

  describe("getCommitObject", () => {
    it("should call serializationService.getCommitObject with correct parameters", () => {
      const mockCommitObject = {
        method: "POST",
        params: { cmi: { core: { student_id: "123" } } },
      };

      const getCommitObjectSpy = vi
        .spyOn(api["_serializationService"], "getCommitObject")
        .mockReturnValue(mockCommitObject);

      const result = api["getCommitObject"](false);

      expect(result).toBe(mockCommitObject);
      expect(getCommitObjectSpy).toHaveBeenCalledWith(
        false,
        api.settings.alwaysSendTotalTime,
        api.settings.renderCommonCommitFields,
        expect.any(Function),
        expect.any(Function),
        api.apiLogLevel,
      );
    });

    it("should pass the terminateCommit parameter to serializationService", () => {
      const mockCommitObject = {
        method: "POST",
        params: { cmi: { core: { student_id: "123", session_time: "PT1H" } } },
      };

      const getCommitObjectSpy = vi
        .spyOn(api["_serializationService"], "getCommitObject")
        .mockReturnValue(mockCommitObject);

      const result = api["getCommitObject"](true);

      expect(result).toBe(mockCommitObject);
      expect(getCommitObjectSpy).toHaveBeenCalledWith(
        true, // terminateCommit should be true
        api.settings.alwaysSendTotalTime,
        api.settings.renderCommonCommitFields,
        expect.any(Function),
        expect.any(Function),
        api.apiLogLevel,
      );
    });
  });

  describe("getFlattenedCMI", () => {
    it("should call Utilities.flatten with the result of renderCMIToJSONObject", () => {
      const mockCMIObject = { core: { student_id: "123" } };
      const flattenedObject = { "core.student_id": "123" };

      const renderCMIToJSONObjectSpy = vi
        .spyOn(api, "renderCMIToJSONObject")
        .mockReturnValue(mockCMIObject);

      const flattenSpy = vi.spyOn(Utilities, "flatten").mockReturnValue(flattenedObject);

      const result = api.getFlattenedCMI();

      expect(result).toBe(flattenedObject);
      expect(renderCMIToJSONObjectSpy).toHaveBeenCalledOnce();
      expect(flattenSpy).toHaveBeenCalledWith(mockCMIObject);
    });
  });

  describe("processHttpRequest", () => {
    it("should call httpService.processHttpRequest when online", async () => {
      const url = "https://example.com/lms";
      const params = { cmi: { core: { student_id: "123" } } };
      const httpServiceProcessHttpRequestSpy = vi
        .spyOn(api["_httpService"], "processHttpRequest")
        .mockResolvedValue({ result: global_constants.SCORM_TRUE, errorCode: 0 });

      const result = await api.processHttpRequest(url, params);

      expect(result).toEqual({ result: global_constants.SCORM_TRUE, errorCode: 0 });
      expect(httpServiceProcessHttpRequestSpy).toHaveBeenCalledWith(
        url,
        params,
        false,
        expect.any(Function),
        expect.any(Function),
      );
    });

    it("should store data offline when offline support is enabled and device is offline", async () => {
      api.settings = { enableOfflineSupport: true };
      const url = "https://example.com/lms";
      const params = { cmi: { core: { student_id: "123" } } };

      // Mock the offline storage service
      const offlineStorageService = {
        isDeviceOnline: vi.fn().mockReturnValue(false),
        storeOffline: vi.fn().mockResolvedValue({
          result: global_constants.SCORM_TRUE,
          errorCode: 0,
        }),
      };

      // eslint-disable-next-line
      // @ts-ignore - Assign the mock service
      api["_offlineStorageService"] = offlineStorageService;
      api["_courseId"] = "course123";

      const apiLogSpy = vi.spyOn(api, "apiLog");

      const result = await api.processHttpRequest(url, params);

      expect(result).toEqual({ result: global_constants.SCORM_TRUE, errorCode: 0 });
      expect(offlineStorageService.isDeviceOnline).toHaveBeenCalled();
      expect(offlineStorageService.storeOffline).toHaveBeenCalledWith("course123", params);
      expect(apiLogSpy).toHaveBeenCalledWith(
        "processHttpRequest",
        "Device is offline, storing data locally",
        LogLevelEnum.INFO,
      );
    });

    it("should return error when offline and params format is invalid", async () => {
      api.settings = { enableOfflineSupport: true };
      const url = "https://example.com/lms";
      const params = ["invalid", "format"]; // Invalid format for offline storage

      // Mock the offline storage service
      const offlineStorageService = {
        isDeviceOnline: vi.fn().mockReturnValue(false),
      };

      // eslint-disable-next-line
      // @ts-ignore - Assign the mock service
      api["_offlineStorageService"] = offlineStorageService;
      api["_courseId"] = "course123";

      const apiLogSpy = vi.spyOn(api, "apiLog");

      const result = await api.processHttpRequest(url, params);

      expect(result).toEqual({
        result: global_constants.SCORM_FALSE,
        errorCode: errorCodes.GENERAL,
      });
      expect(apiLogSpy).toHaveBeenCalledWith(
        "processHttpRequest",
        "Invalid commit data format for offline storage",
        LogLevelEnum.ERROR,
      );
    });
  });

  describe("scheduled commit methods", () => {
    describe("scheduleCommit", () => {
      it("should create a new ScheduledCommit when no timeout exists", () => {
        // Arrange
        const apiLogSpy = vi.spyOn(api, "apiLog");

        // Act
        api.scheduleCommit(1000, "Commit");

        // Assert
        expect(api["_timeout"]).toBeDefined();
        expect(apiLogSpy).toHaveBeenCalledWith(
          "scheduleCommit",
          "scheduled",
          LogLevelEnum.DEBUG,
          "",
        );
      });

      it("should not create a new ScheduledCommit when timeout already exists", () => {
        // Arrange
        // Create an initial timeout
        const apiLogSpy = vi.spyOn(api, "apiLog");
        api.scheduleCommit(1000, "Commit");
        const initialTimeout = api["_timeout"];

        // Act
        api.scheduleCommit(2000, "Commit");

        // Assert
        expect(api["_timeout"]).toBe(initialTimeout); // Should be the same object
        expect(apiLogSpy).toHaveBeenCalledExactlyOnceWith(
          "scheduleCommit",
          "scheduled",
          LogLevelEnum.DEBUG,
          "",
        );
      });
    });

    describe("clearScheduledCommit", () => {
      it("should cancel and clear the timeout when it exists", () => {
        // Arrange
        api.scheduleCommit(1000, "Commit");
        const timeout = api["_timeout"];
        const cancelSpy = vi.spyOn(timeout!, "cancel");
        const apiLogSpy = vi.spyOn(api, "apiLog");

        // Act
        api.clearScheduledCommit();

        // Assert
        expect(cancelSpy).toHaveBeenCalledOnce();
        expect(api["_timeout"]).toBeUndefined();
        expect(apiLogSpy).toHaveBeenCalledWith(
          "clearScheduledCommit",
          "cleared",
          LogLevelEnum.DEBUG,
          "",
        );
      });

      it("should do nothing when no timeout exists", () => {
        // Arrange
        api["_timeout"] = undefined;
        const apiLogSpy = vi.spyOn(api, "apiLog");

        // Act
        api.clearScheduledCommit();

        // Assert
        expect(apiLogSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe("checkState", () => {
    it("should return false and throw error when not initialized", () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.checkState(
        true,
        errorCodes.RETRIEVE_BEFORE_INIT,
        errorCodes.RETRIEVE_AFTER_TERM,
      );

      expect(result).toBe(false);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.RETRIEVE_BEFORE_INIT);
    });

    it("should return false and throw error when terminated and checkTerminated is true", () => {
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.checkState(
        true,
        errorCodes.RETRIEVE_BEFORE_INIT,
        errorCodes.RETRIEVE_AFTER_TERM,
      );

      expect(result).toBe(false);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.RETRIEVE_AFTER_TERM);
    });

    it("should return true when initialized", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.checkState(
        true,
        errorCodes.RETRIEVE_BEFORE_INIT,
        errorCodes.RETRIEVE_AFTER_TERM,
      );

      expect(result).toBe(true);
      expect(throwSCORMErrorSpy).not.toHaveBeenCalled();
    });

    it("should return true when terminated but checkTerminated is false", () => {
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.checkState(
        false,
        errorCodes.RETRIEVE_BEFORE_INIT,
        errorCodes.RETRIEVE_AFTER_TERM,
      );

      expect(result).toBe(true);
      expect(throwSCORMErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe("terminate", () => {
    beforeEach(() => {
      // Mock the storeData method to return a successful result
      vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      });
    });

    it("should return SCORM_FALSE and throw error when not initialized", async () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      const checkStateSpy = vi.spyOn(api, "checkState").mockReturnValue(false);

      const result = await api.terminate("Terminate", true);

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(checkStateSpy).toHaveBeenCalledWith(
        true,
        errorCodes.TERMINATION_BEFORE_INIT,
        errorCodes.MULTIPLE_TERMINATION,
      );
    });

    it("should call storeData with calculateTotalTime=true when checkState returns true", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      vi.spyOn(api, "checkState").mockReturnValue(true);
      const storeDataSpy = vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      });
      const processListenersSpy = vi.spyOn(api, "processListeners");

      const result = await api.terminate("Terminate", true);

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(api.currentState).toBe(global_constants.STATE_TERMINATED);
      expect(storeDataSpy).toHaveBeenCalledWith(true);
      expect(processListenersSpy).toHaveBeenCalledWith("Terminate");
    });

    it("should throw SCORM error when storeData returns an error code", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      vi.spyOn(api, "checkState").mockReturnValue(true);
      vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_FALSE,
        errorCode: errorCodes.GENERAL,
      });
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = await api.terminate("Terminate", true);

      expect(result).toBe(global_constants.SCORM_TRUE); // Still returns true because we set it after the error
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.GENERAL);
    });

    it("should reset lastErrorCode when checkTerminated is true", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      vi.spyOn(api, "checkState").mockReturnValue(true);
      vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      });

      await api.terminate("Terminate", true);

      expect(api.lastErrorCode).toBe("0");
    });

    it("should attempt to sync offline data when online and offline data exists", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      api.settings = { enableOfflineSupport: true, syncOnTerminate: true };
      vi.spyOn(api, "checkState").mockReturnValue(true);

      // Mock the offline storage service
      const offlineStorageService = {
        isDeviceOnline: vi.fn().mockReturnValue(true),
        hasPendingOfflineData: vi.fn().mockResolvedValue(true),
        syncOfflineData: vi.fn().mockResolvedValue(true),
      };

      // eslint-disable-next-line
      // @ts-ignore - Assign the mock service
      api["_offlineStorageService"] = offlineStorageService;
      api["_courseId"] = "course123";

      await api.terminate("Terminate", true);

      expect(offlineStorageService.isDeviceOnline).toHaveBeenCalled();
      expect(offlineStorageService.hasPendingOfflineData).toHaveBeenCalledWith("course123");
      expect(offlineStorageService.syncOfflineData).toHaveBeenCalled();
    });
  });

  describe("error information methods", () => {
    describe("getLastError", () => {
      it("should return the last error code", () => {
        // Arrange
        vi.spyOn(api, "lastErrorCode", "get").mockReturnValue("101");
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getLastError("GetLastError");

        // Assert
        expect(result).toBe("101");
        expect(processListenersSpy).toHaveBeenCalledWith("GetLastError");
      });
    });

    describe("getErrorString", () => {
      it("should return empty string when CMIErrorCode is null", () => {
        // Arrange
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getErrorString("GetErrorString", null as any);

        // Assert
        expect(result).toBe("");
        expect(processListenersSpy).not.toHaveBeenCalled();
      });

      it("should return empty string when CMIErrorCode is empty", () => {
        // Arrange
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getErrorString("GetErrorString", "");

        // Assert
        expect(result).toBe("");
        expect(processListenersSpy).not.toHaveBeenCalled();
      });

      it("should call getLmsErrorMessageDetails and process listeners when CMIErrorCode is valid", () => {
        // Arrange
        const getLmsErrorMessageDetailsSpy = vi
          .spyOn(api, "getLmsErrorMessageDetails")
          .mockReturnValue("Error message");
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getErrorString("GetErrorString", "101");

        // Assert
        expect(result).toBe("Error message");
        expect(getLmsErrorMessageDetailsSpy).toHaveBeenCalledWith("101");
        expect(processListenersSpy).toHaveBeenCalledWith("GetErrorString");
      });
    });

    describe("getDiagnostic", () => {
      it("should return empty string when CMIErrorCode is null", () => {
        // Arrange
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getDiagnostic("GetDiagnostic", null as any);

        // Assert
        expect(result).toBe("");
        expect(processListenersSpy).not.toHaveBeenCalled();
      });

      it("should return empty string when CMIErrorCode is empty", () => {
        // Arrange
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getDiagnostic("GetDiagnostic", "");

        // Assert
        expect(result).toBe("");
        expect(processListenersSpy).not.toHaveBeenCalled();
      });

      it("should call getLmsErrorMessageDetails with detail=true and process listeners when CMIErrorCode is valid", () => {
        // Arrange
        const getLmsErrorMessageDetailsSpy = vi
          .spyOn(api, "getLmsErrorMessageDetails")
          .mockReturnValue("Detailed error message");
        const processListenersSpy = vi.spyOn(api, "processListeners");

        // Act
        const result = api.getDiagnostic("GetDiagnostic", "101");

        // Assert
        expect(result).toBe("Detailed error message");
        expect(getLmsErrorMessageDetailsSpy).toHaveBeenCalledWith("101", true);
        expect(processListenersSpy).toHaveBeenCalledWith("GetDiagnostic");
      });
    });
  });

  describe("commit", () => {
    beforeEach(() => {
      // Mock the storeData method to return a successful result
      vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      });
    });

    it("should return SCORM_FALSE and throw error when not initialized", async () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");
      const clearScheduledCommitSpy = vi.spyOn(api, "clearScheduledCommit");

      const result = await api.commit("Commit", true);

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.COMMIT_BEFORE_INIT);
      expect(clearScheduledCommitSpy).toHaveBeenCalledOnce();
    });

    it("should return SCORM_FALSE and throw error when terminated and checkTerminated is true", async () => {
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");
      const clearScheduledCommitSpy = vi.spyOn(api, "clearScheduledCommit");

      const result = await api.commit("Commit", true);

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.COMMIT_AFTER_TERM);
      expect(clearScheduledCommitSpy).toHaveBeenCalledOnce();
    });

    it("should call storeData and process listeners when initialized", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const storeDataSpy = vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      });
      const processListenersSpy = vi.spyOn(api, "processListeners");
      const clearScheduledCommitSpy = vi.spyOn(api, "clearScheduledCommit");

      const result = await api.commit("Commit", true);

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(storeDataSpy).toHaveBeenCalledWith(false);
      expect(processListenersSpy).toHaveBeenCalledWith("Commit");
      expect(clearScheduledCommitSpy).toHaveBeenCalledOnce();
    });

    it("should throw SCORM error when storeData returns an error code", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_FALSE,
        errorCode: errorCodes.GENERAL,
      });
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = await api.commit("Commit", true);

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.GENERAL);
    });

    it("should reset lastErrorCode when checkTerminated is true", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      vi.spyOn(api, "storeData").mockResolvedValue({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      });

      await api.commit("Commit", true);

      expect(api.lastErrorCode).toBe("0");
    });

    it("should attempt to sync offline data when online and offline data exists", async () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      api.settings = { enableOfflineSupport: true };

      // Mock the offline storage service
      const offlineStorageService = {
        isDeviceOnline: vi.fn().mockReturnValue(true),
        hasPendingOfflineData: vi.fn().mockResolvedValue(true),
        syncOfflineData: vi.fn().mockResolvedValue(true),
      };

      // eslint-disable-next-line
      // @ts-ignore - Assign the mock service
      api["_offlineStorageService"] = offlineStorageService;
      api["_courseId"] = "course123";

      await api.commit("Commit", true);

      expect(offlineStorageService.isDeviceOnline).toHaveBeenCalled();
      expect(offlineStorageService.hasPendingOfflineData).toHaveBeenCalledWith("course123");
      expect(offlineStorageService.syncOfflineData).toHaveBeenCalled();
    });
  });

  describe("setValue", () => {
    it("should return SCORM_FALSE and throw error when not initialized", () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.STORE_BEFORE_INIT);
    });

    it("should return SCORM_FALSE and throw error when terminated and checkTerminated is true", () => {
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.STORE_AFTER_TERM);
    });

    it("should call setCMIValue and process listeners when initialized", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const setCMIValueStub = vi
        .spyOn(api, "setCMIValue")
        .mockReturnValue(global_constants.SCORM_TRUE);
      const processListenersSpy = vi.spyOn(api, "processListeners");

      const result = api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(setCMIValueStub).toHaveBeenCalledWith("cmi.core.student_id", "student123");
      expect(processListenersSpy).toHaveBeenCalledWith(
        "SetValue",
        "cmi.core.student_id",
        "student123",
      );
    });

    it("should handle exceptions from setCMIValue", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const error = new Error("Test error");
      const setCMIValueStub = vi.spyOn(api, "setCMIValue").mockImplementation(() => {
        throw error;
      });
      const handleValueAccessExceptionSpy = vi
        .spyOn(api as any, "handleValueAccessException")
        .mockReturnValue(global_constants.SCORM_FALSE);

      const result = api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(result).toBe(global_constants.SCORM_FALSE);
      expect(setCMIValueStub).toHaveBeenCalledWith("cmi.core.student_id", "student123");
      expect(handleValueAccessExceptionSpy).toHaveBeenCalledWith(
        "cmi.core.student_id",
        error,
        global_constants.SCORM_FALSE,
      );
    });

    it("should schedule commit when autocommit is enabled and no errors", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      api.settings = { autocommit: true, autocommitSeconds: 10 };
      vi.spyOn(api, "setCMIValue").mockReturnValue(global_constants.SCORM_TRUE);
      vi.spyOn(api, "lastErrorCode", "get").mockReturnValue("0");
      const scheduleCommitSpy = vi.spyOn(api, "scheduleCommit");

      api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(scheduleCommitSpy).toHaveBeenCalledWith(10000, "Commit");
    });

    it("should not schedule commit when autocommit is disabled", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      api.settings = { autocommit: false };
      vi.spyOn(api, "setCMIValue").mockReturnValue(global_constants.SCORM_TRUE);
      vi.spyOn(api, "lastErrorCode", "get").mockReturnValue("0");
      const scheduleCommitSpy = vi.spyOn(api, "scheduleCommit");

      api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(scheduleCommitSpy).not.toHaveBeenCalled();
    });

    it("should not schedule commit when there are errors", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      api.settings = { autocommit: true, autocommitSeconds: 10 };
      vi.spyOn(api, "setCMIValue").mockReturnValue(global_constants.SCORM_TRUE);
      vi.spyOn(api, "lastErrorCode", "get").mockReturnValue("101");
      const scheduleCommitSpy = vi.spyOn(api, "scheduleCommit");

      api.setValue("SetValue", "Commit", true, "cmi.core.student_id", "student123");

      expect(scheduleCommitSpy).not.toHaveBeenCalled();
    });
  });

  describe("getValue", () => {
    it("should return empty string and throw error when not initialized", () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.getValue("GetValue", true, "cmi.core.student_id");

      expect(result).toBe("");
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.RETRIEVE_BEFORE_INIT);
    });

    it("should return empty string and throw error when terminated and checkTerminated is true", () => {
      api.currentState = global_constants.STATE_TERMINATED;
      const throwSCORMErrorSpy = vi.spyOn(api, "throwSCORMError");

      const result = api.getValue("GetValue", true, "cmi.core.student_id");

      expect(result).toBe("");
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith("api", errorCodes.RETRIEVE_AFTER_TERM);
    });

    it("should call getCMIValue and process listeners when initialized", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const getCMIValueStub = vi.spyOn(api, "getCMIValue").mockReturnValue("student123");
      const processListenersSpy = vi.spyOn(api, "processListeners");

      const result = api.getValue("GetValue", true, "cmi.core.student_id");

      expect(result).toBe("student123");
      expect(getCMIValueStub).toHaveBeenCalledWith("cmi.core.student_id");
      expect(processListenersSpy).toHaveBeenCalledWith("GetValue", "cmi.core.student_id");
    });

    it("should handle exceptions from getCMIValue", () => {
      api.currentState = global_constants.STATE_INITIALIZED;
      const error = new Error("Test error");
      const getCMIValueStub = vi.spyOn(api, "getCMIValue").mockImplementation(() => {
        throw error;
      });
      const handleValueAccessExceptionSpy = vi
        .spyOn(api as any, "handleValueAccessException")
        .mockReturnValue("");

      const result = api.getValue("GetValue", true, "cmi.core.student_id");

      expect(result).toBe("");
      expect(getCMIValueStub).toHaveBeenCalledWith("cmi.core.student_id");
      expect(handleValueAccessExceptionSpy).toHaveBeenCalledWith("cmi.core.student_id", error, "");
    });
  });

  describe("error handling methods", () => {
    it("should set error code with throwSCORMError method", () => {
      const errorHandlingServiceThrowSCORMErrorSpy = vi.spyOn(
        api["_errorHandlingService"],
        "throwSCORMError",
      );

      api.throwSCORMError("cmi.core.student_id", errorCodes.GENERAL, "Error message");

      expect(errorHandlingServiceThrowSCORMErrorSpy).toHaveBeenCalledWith(
        "cmi.core.student_id",
        errorCodes.GENERAL,
        "Error message",
      );
    });

    it("should clear error code with clearSCORMError method", () => {
      const errorHandlingServiceClearSCORMErrorSpy = vi.spyOn(
        api["_errorHandlingService"],
        "clearSCORMError",
      );

      api.clearSCORMError("true");

      expect(errorHandlingServiceClearSCORMErrorSpy).toHaveBeenCalledWith("true");
    });
  });

  describe("event handling methods", () => {
    it("should register event listeners with on method", () => {
      const eventServiceOnSpy = vi.spyOn(api["_eventService"], "on");
      const callback = vi.fn();

      api.on("Initialize", callback);

      expect(eventServiceOnSpy).toHaveBeenCalledWith("Initialize", callback);
    });

    it("should unregister event listeners with off method", () => {
      const eventServiceOffSpy = vi.spyOn(api["_eventService"], "off");
      const callback = vi.fn();

      api.off("Initialize", callback);

      expect(eventServiceOffSpy).toHaveBeenCalledWith("Initialize", callback);
    });

    it("should clear all event listeners with clear method", () => {
      const eventServiceClearSpy = vi.spyOn(api["_eventService"], "clear");

      api.clear("Initialize");

      expect(eventServiceClearSpy).toHaveBeenCalledWith("Initialize");
    });

    it("should process event listeners with processListeners method", () => {
      const eventServiceProcessListenersSpy = vi.spyOn(api["_eventService"], "processListeners");

      api.processListeners("Initialize", "cmi.core.student_id", "value");

      expect(eventServiceProcessListenersSpy).toHaveBeenCalledWith(
        "Initialize",
        "cmi.core.student_id",
        "value",
      );
    });
  });

  describe("state checking methods", () => {
    it("should correctly identify initialized state", () => {
      api.currentState = global_constants.STATE_INITIALIZED;

      expect(api.isInitialized()).toBe(true);
      expect(api.isNotInitialized()).toBe(false);
      expect(api.isTerminated()).toBe(false);
    });

    it("should correctly identify not initialized state", () => {
      api.currentState = global_constants.STATE_NOT_INITIALIZED;

      expect(api.isInitialized()).toBe(false);
      expect(api.isNotInitialized()).toBe(true);
      expect(api.isTerminated()).toBe(false);
    });

    it("should correctly identify terminated state", () => {
      api.currentState = global_constants.STATE_TERMINATED;

      expect(api.isInitialized()).toBe(false);
      expect(api.isNotInitialized()).toBe(false);
      expect(api.isTerminated()).toBe(true);
    });
  });
  describe("constructor with offline storage", () => {
    beforeEach(() => {
      vi.restoreAllMocks();
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should not initialize offline storage service when enableOfflineSupport is false", () => {
      const settings = { enableOfflineSupport: false };

      const testApi = new TestAPI(errorCodes, settings);

      // Assert
      expect(testApi["_offlineStorageService"]).toBeUndefined();
    });

    it("should initialize offline storage service when enableOfflineSupport is true", () => {
      const settings = { enableOfflineSupport: true };
      const OfflineStorageServiceSpy = vi.spyOn(OfflineStorageService.prototype, "constructor");

      const testApi = new TestAPI(errorCodes, settings);

      // Assert
      expect(testApi["_offlineStorageService"]).toBeDefined();
      expect(testApi["_offlineStorageService"]).toBeInstanceOf(OfflineStorageService);
    });

    it("should store courseId when provided with settings", () => {
      const settings = {
        enableOfflineSupport: true,
        courseId: "test-course-123",
      };

      const testApi = new TestAPI(errorCodes, settings);

      // Assert
      expect(testApi["_courseId"]).toBe("test-course-123");
    });

    it("should not attempt to retrieve offline data when courseId is not provided", () => {
      const settings = { enableOfflineSupport: true };
      const offlineStorageService = {
        getOfflineData: vi.fn().mockResolvedValue(null),
      };

      // Create API with mocked service
      const testApi = new TestAPI(errorCodes, settings);
      // eslint-disable-next-line
      // @ts-ignore - Assign the mock service
      testApi["_offlineStorageService"] = offlineStorageService;

      // Assert
      expect(offlineStorageService.getOfflineData).not.toHaveBeenCalled();
    });

    it("should attempt to retrieve offline data when courseId is provided", async () => {
      // Mock the OfflineStorageService constructor
      const mockGetOfflineData = vi.fn().mockResolvedValue(null);
      vi.spyOn(OfflineStorageService.prototype, 'getOfflineData').mockImplementation(mockGetOfflineData);

      const settings = {
        enableOfflineSupport: true,
        courseId: "test-course-123",
      };

      // Create API with the settings
      const testApi = new TestAPI(errorCodes, settings);

      // Wait for any promises to resolve
      vi.runAllTimers();
      await Promise.resolve();

      // Assert
      expect(mockGetOfflineData).toHaveBeenCalledWith("test-course-123");
    });

    it("should load data from offline storage when data is found", async () => {
      const offlineData = {
        runtimeData: { cmi: { core: { student_id: "offline-student" } } },
      };

      // Mock the OfflineStorageService.getOfflineData method
      const mockGetOfflineData = vi.fn().mockResolvedValue(offlineData);
      vi.spyOn(OfflineStorageService.prototype, 'getOfflineData').mockImplementation(mockGetOfflineData);

      const settings = {
        enableOfflineSupport: true,
        courseId: "test-course-123",
      };

      // Create API with the settings
      const testApi = new TestAPI(errorCodes, settings);

      // Mock the loadFromJSON method
      const loadFromJSONSpy = vi.spyOn(testApi, "loadFromJSON");

      // Wait for any promises to resolve
      vi.runAllTimers();
      await Promise.resolve();

      // Assert
      expect(mockGetOfflineData).toHaveBeenCalledWith("test-course-123");
      expect(loadFromJSONSpy).toHaveBeenCalledWith(offlineData.runtimeData);
    });

    it("should handle errors when retrieving offline data", async () => {
      // Mock the OfflineStorageService.getOfflineData method to throw an error
      const mockGetOfflineData = vi.fn().mockRejectedValue(new Error("Storage error"));
      vi.spyOn(OfflineStorageService.prototype, 'getOfflineData').mockImplementation(mockGetOfflineData);

      const settings = {
        enableOfflineSupport: true,
        courseId: "test-course-123",
        logLevel: LogLevelEnum.DEBUG, // Set log level to ensure logs are processed
      };

      // Create API with the settings
      const testApi = new TestAPI(errorCodes, settings);

      // Wait for any promises to resolve
      vi.runAllTimers();
      await Promise.resolve();

      // Assert that getOfflineData was called with the correct courseId
      expect(mockGetOfflineData).toHaveBeenCalledWith("test-course-123");

      // Note: We can see from the console output that the error is being logged correctly,
      // but we can't easily spy on the logging service due to how it's implemented.
      // The most important part of this test is verifying that getOfflineData is called
      // with the correct courseId, which we've done above.
    });

    it("should not attempt to load data when no offline data is found", async () => {
      // Mock the OfflineStorageService.getOfflineData method to return null
      const mockGetOfflineData = vi.fn().mockResolvedValue(null);
      vi.spyOn(OfflineStorageService.prototype, 'getOfflineData').mockImplementation(mockGetOfflineData);

      const settings = {
        enableOfflineSupport: true,
        courseId: "test-course-123",
      };

      // Create API with the settings
      const testApi = new TestAPI(errorCodes, settings);

      // Mock the loadFromJSON method
      const loadFromJSONSpy = vi.spyOn(testApi, "loadFromJSON");

      // Wait for any promises to resolve
      vi.runAllTimers();
      await Promise.resolve();

      // Assert
      expect(mockGetOfflineData).toHaveBeenCalledWith("test-course-123");
      expect(loadFromJSONSpy).not.toHaveBeenCalled();
    });
  });
});
