import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createErrorHandlingService,
  ErrorHandlingService,
} from "../../src/services/ErrorHandlingService";
import { LogLevelEnum } from "../../src/constants/enums";
import { ValidationError } from "../../src/exceptions";
import { global_constants } from "../../src";

describe("ErrorHandlingService", () => {
  let errorHandlingService: ErrorHandlingService;
  let errorCodes: any;
  let apiLogStub: ReturnType<typeof vi.fn>;
  let getLmsErrorMessageDetailsStub: ReturnType<typeof vi.fn>;
  let consoleErrorStub: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create mock error codes
    errorCodes = {
      GENERAL: 101,
      INITIALIZED: 102,
      TERMINATED: 103,
    };

    // Create stubs for dependencies
    apiLogStub = vi.fn();
    getLmsErrorMessageDetailsStub = vi.fn().mockReturnValue("Error message");
    consoleErrorStub = vi.spyOn(console, "error").mockImplementation((msg) => {
      console.log(msg);
    });

    // Create a new instance for each test
    errorHandlingService = createErrorHandlingService(
      errorCodes,
      apiLogStub,
      getLmsErrorMessageDetailsStub,
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Factory Function", () => {
    it("should create an instance of ErrorHandlingService", () => {
      expect(errorHandlingService).toBeInstanceOf(ErrorHandlingService);
    });
  });

  describe("lastErrorCode", () => {
    it("should have '0' as the default last error code", () => {
      expect(errorHandlingService.lastErrorCode).toBe("0");
    });

    it("should update the last error code when setter is called", () => {
      errorHandlingService.lastErrorCode = "101";
      expect(errorHandlingService.lastErrorCode).toBe("101");

      errorHandlingService.lastErrorCode = "102";
      expect(errorHandlingService.lastErrorCode).toBe("102");
    });
  });

  describe("throwSCORMError", () => {
    it("should set the last error code to the error number", () => {
      errorHandlingService.throwSCORMError("api", 101);
      expect(errorHandlingService.lastErrorCode).toBe("101");
    });

    it("should call apiLog with the error message", () => {
      errorHandlingService.throwSCORMError("api", 101);
      expect(apiLogStub).toHaveBeenCalledOnce();
      expect(apiLogStub).toHaveBeenCalledWith(
        "throwSCORMError",
        "101: Error message",
        LogLevelEnum.ERROR,
        "api",
      );
    });

    it("should use the provided message if available", () => {
      errorHandlingService.throwSCORMError("api", 101, "Custom error message");
      expect(apiLogStub).toHaveBeenCalledWith(
        "throwSCORMError",
        "101: Custom error message",
        LogLevelEnum.ERROR,
        "api",
      );
    });

    it("should get the error message from getLmsErrorMessageDetails if no message is provided", () => {
      errorHandlingService.throwSCORMError("api", 101);
      expect(getLmsErrorMessageDetailsStub).toHaveBeenCalledOnce();
      expect(getLmsErrorMessageDetailsStub).toHaveBeenCalledWith(101, true);
    });
  });

  describe("clearSCORMError", () => {
    it("should clear the last error code if success is not SCORM_FALSE", () => {
      // Set an initial error code
      errorHandlingService.lastErrorCode = "101";

      // Clear the error code
      errorHandlingService.clearSCORMError("true");
      expect(errorHandlingService.lastErrorCode).toBe("0");
    });

    it("should not clear the last error code if success is SCORM_FALSE", () => {
      // Set an initial error code
      errorHandlingService.lastErrorCode = "101";

      // Try to clear the error code with SCORM_FALSE
      errorHandlingService.clearSCORMError(global_constants.SCORM_FALSE);
      expect(errorHandlingService.lastErrorCode).toBe("101");
    });

    it("should not clear the last error code if success is undefined", () => {
      // Set an initial error code
      errorHandlingService.lastErrorCode = "101";

      // Try to clear the error code with undefined
      errorHandlingService.clearSCORMError(undefined as unknown as string);
      expect(errorHandlingService.lastErrorCode).toBe("101");
    });
  });

  describe("handleValueAccessException", () => {
    it("should set the last error code from ValidationError", () => {
      const validationError = new ValidationError("api", 201, "Validation error");
      const returnValue = errorHandlingService.handleValueAccessException(
        "api",
        validationError,
        "",
      );

      expect(errorHandlingService.lastErrorCode).toBe("201");
      expect(returnValue).toBe(global_constants.SCORM_FALSE);
    });

    it("should log the error message for Error instances", () => {
      const error = new Error("General error");
      errorHandlingService.handleValueAccessException("api", error, "");

      expect(consoleErrorStub).toHaveBeenCalledTimes(2);
    });

    it("should log the error for non-Error instances", () => {
      const error = "String error";
      errorHandlingService.handleValueAccessException("api", error, "");

      expect(consoleErrorStub).toHaveBeenCalledTimes(3);
    });

    it("should call throwSCORMError with GENERAL error code for non-ValidationError instances", () => {
      const error = new Error("General error");
      const throwSCORMErrorSpy = vi.spyOn(errorHandlingService, "throwSCORMError");

      errorHandlingService.handleValueAccessException("api", error, "");

      expect(throwSCORMErrorSpy).toHaveBeenCalledOnce();
      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(
        "api",
        errorCodes.GENERAL,
        "Error: General error",
      );
    });

    it("should return the provided return value for non-ValidationError instances", () => {
      const error = new Error("General error");
      const returnValue = errorHandlingService.handleValueAccessException("api", error, "test");

      expect(returnValue).toBe("test");
    });
  });

  describe("errorCodes", () => {
    it("should return the error codes object", () => {
      expect(errorHandlingService.errorCodes).toBe(errorCodes);
    });
  });
});
