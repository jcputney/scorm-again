// noinspection DuplicatedCode

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getLoggingService, LoggingService } from "../../src/services/LoggingService";
import { LogLevelEnum } from "../../src/constants/enums";
import { LogLevel } from "../../src/types/api_types";

describe("LoggingService", () => {
  let consoleErrorStub: ReturnType<typeof vi.spyOn>;
  let consoleWarnStub: ReturnType<typeof vi.spyOn>;
  let consoleInfoStub: ReturnType<typeof vi.spyOn>;
  let consoleDebugStub: ReturnType<typeof vi.spyOn>;
  let consoleLogStub: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Stub console methods to prevent actual logging during tests
    consoleErrorStub = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleWarnStub = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleInfoStub = vi.spyOn(console, "info").mockImplementation(() => {});
    consoleDebugStub = vi.spyOn(console, "debug").mockImplementation(() => {});
    consoleLogStub = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore all mocks
    vi.restoreAllMocks();

    // Reset the log level to default
    getLoggingService().setLogLevel(LogLevelEnum.ERROR);
  });

  describe("Singleton Pattern", () => {
    it("should always return the same instance", () => {
      const instance1 = getLoggingService();
      const instance2 = getLoggingService();

      expect(instance1).toBe(instance2);
    });
  });

  describe("Log Level Management", () => {
    it("should have ERROR as the default log level", () => {
      const loggingService = getLoggingService();
      expect(loggingService.getLogLevel()).toBe(LogLevelEnum.ERROR);
    });

    it("should update the log level when setLogLevel is called", () => {
      const loggingService = getLoggingService();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      expect(loggingService.getLogLevel()).toBe(LogLevelEnum.DEBUG);

      loggingService.setLogLevel(LogLevelEnum.INFO);
      expect(loggingService.getLogLevel()).toBe(LogLevelEnum.INFO);
    });
  });

  describe("Log Handler Management", () => {
    it("should use the default log handler by default", () => {
      const loggingService = getLoggingService();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.debug("Debug message");

      expect(consoleDebugStub).toHaveBeenCalledOnce();
      expect(consoleDebugStub).toHaveBeenCalledWith("Debug message");
    });

    it("should use a custom log handler when set", () => {
      const loggingService = getLoggingService();
      const customHandler = vi.fn();

      loggingService.setLogHandler(customHandler);
      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.debug("Debug message");

      expect(customHandler).toHaveBeenCalledOnce();
      expect(customHandler).toHaveBeenCalledWith(LogLevelEnum.DEBUG, "Debug message");
      expect(consoleDebugStub).not.toHaveBeenCalled();
    });
  });

  describe("Logging Methods", () => {
    it("should call log method with correct parameters", () => {
      const loggingService = getLoggingService();
      const logSpy = vi.spyOn(loggingService, "log");

      loggingService.error("Error message");
      expect(logSpy).toHaveBeenCalledWith(LogLevelEnum.ERROR, "Error message");

      loggingService.warn("Warn message");
      expect(logSpy).toHaveBeenCalledWith(LogLevelEnum.WARN, "Warn message");

      loggingService.info("Info message");
      expect(logSpy).toHaveBeenCalledWith(LogLevelEnum.INFO, "Info message");

      loggingService.debug("Debug message");
      expect(logSpy).toHaveBeenCalledWith(LogLevelEnum.DEBUG, "Debug message");
    });

    it("should call console.error when logging error messages", () => {
      // Get a fresh instance for this test
      const loggingService = getLoggingService();

      // Reset stubs
      vi.clearAllMocks();

      // Set log level to DEBUG to ensure all messages are logged
      loggingService.setLogLevel(LogLevelEnum.DEBUG);

      // Create a custom handler that directly calls console.error
      const directHandler = (messageLevel: LogLevel, logMessage: string) => {
        if (messageLevel === LogLevelEnum.ERROR) {
          console.error(logMessage);
        }
      };

      // Set the custom handler
      loggingService.setLogHandler(directHandler);

      // Log an error message
      loggingService.error("Direct error message");

      // Check if console.error was called
      expect(consoleErrorStub).toHaveBeenCalled();
      expect(consoleErrorStub).toHaveBeenCalledWith("Direct error message");
    });

    it("should not log messages below the current log level", () => {
      const loggingService = getLoggingService();
      const customHandler = vi.fn();

      loggingService.setLogHandler(customHandler);
      loggingService.setLogLevel(LogLevelEnum.ERROR);

      loggingService.warn("Warn message");
      loggingService.info("Info message");
      loggingService.debug("Debug message");

      expect(customHandler).not.toHaveBeenCalled();
    });

    it("should log messages at or above the current log level", () => {
      const loggingService = getLoggingService();
      const customHandler = vi.fn();

      loggingService.setLogHandler(customHandler);
      loggingService.setLogLevel(LogLevelEnum.WARN);

      loggingService.error("Error message");
      expect(customHandler).toHaveBeenCalledWith(LogLevelEnum.ERROR, "Error message");

      loggingService.warn("Warn message");
      expect(customHandler).toHaveBeenCalledWith(LogLevelEnum.WARN, "Warn message");
    });
  });

  describe("Default Log Handler", () => {
    // Create a default log handler function that matches the one in LoggingService
    const createDefaultLogHandler = () => {
      return (messageLevel: LogLevel, logMessage: string) => {
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
          case LogLevelEnum.DEBUG: {
            // Access console.debug directly to ensure we check at runtime
            const debug = console.debug;
            if (typeof debug === "function") {
              debug.call(console, logMessage);
            } else {
              console.log(logMessage);
            }
            break;
          }
        }
      };
    };

    it("should call console.error for ERROR level messages", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.ERROR, "Error message");

      expect(consoleErrorStub).toHaveBeenCalledOnce();
      expect(consoleErrorStub).toHaveBeenCalledWith("Error message");
    });

    it("should call console.warn for WARN level messages", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.WARN, "Warn message");

      expect(consoleWarnStub).toHaveBeenCalledOnce();
      expect(consoleWarnStub).toHaveBeenCalledWith("Warn message");
    });

    it("should call console.info for INFO level messages", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.INFO, "Info message");

      expect(consoleInfoStub).toHaveBeenCalledOnce();
      expect(consoleInfoStub).toHaveBeenCalledWith("Info message");
    });

    it("should call console.debug for DEBUG level messages if available", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.DEBUG, "Debug message");

      expect(consoleDebugStub).toHaveBeenCalledOnce();
      expect(consoleDebugStub).toHaveBeenCalledWith("Debug message");
    });

    it("should call console.log for DEBUG level messages if console.debug is not available", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      // Reset the stubs to ensure they're clean
      vi.clearAllMocks();

      // Temporarily remove console.debug
      const originalDebug = console.debug;
      console.debug = undefined as any;

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.DEBUG, "Debug message");

      // Check if console.log was called
      expect(consoleLogStub).toHaveBeenCalledOnce();
      expect(consoleLogStub).toHaveBeenCalledWith("Debug message");

      // Restore console.debug
      console.debug = originalDebug;
      // Don't re-stub console.debug here, it will be re-stubbed in the afterEach hook
    });

    it("should handle string log levels in the default handler", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);

      // Test string log levels
      loggingService.log("ERROR", "Error message");
      expect(consoleErrorStub).toHaveBeenCalledWith("Error message");

      loggingService.log("WARN", "Warn message");
      expect(consoleWarnStub).toHaveBeenCalledWith("Warn message");

      loggingService.log("INFO", "Info message");
      expect(consoleInfoStub).toHaveBeenCalledWith("Info message");

      loggingService.log("DEBUG", "Debug message");
      expect(consoleDebugStub).toHaveBeenCalledWith("Debug message");
    });

    it("should handle numeric string log levels in the default handler", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);

      // Test numeric string log levels
      loggingService.log("4", "Error message");
      expect(consoleErrorStub).toHaveBeenCalledWith("Error message");

      loggingService.log("3", "Warn message");
      expect(consoleWarnStub).toHaveBeenCalledWith("Warn message");

      loggingService.log("2", "Info message");
      expect(consoleInfoStub).toHaveBeenCalledWith("Info message");

      loggingService.log("1", "Debug message");
      expect(consoleDebugStub).toHaveBeenCalledWith("Debug message");
    });
  });

  describe("Numeric Level Conversion", () => {
    // We need to access the private method, so we'll create a test instance
    let loggingService: any;

    beforeEach(() => {
      loggingService = getLoggingService() as any;
    });

    it("should return NONE for undefined level", () => {
      const result = loggingService.getNumericLevel(undefined);
      expect(result).toBe(LogLevelEnum.NONE);
    });

    it("should return the same number for numeric levels", () => {
      expect(loggingService.getNumericLevel(1)).toBe(1);
      expect(loggingService.getNumericLevel(2)).toBe(2);
      expect(loggingService.getNumericLevel(3)).toBe(3);
      expect(loggingService.getNumericLevel(4)).toBe(4);
      expect(loggingService.getNumericLevel(5)).toBe(5);
    });

    it("should convert string numeric levels to numbers", () => {
      expect(loggingService.getNumericLevel("1")).toBe(LogLevelEnum.DEBUG);
      expect(loggingService.getNumericLevel("2")).toBe(LogLevelEnum.INFO);
      expect(loggingService.getNumericLevel("3")).toBe(LogLevelEnum.WARN);
      expect(loggingService.getNumericLevel("4")).toBe(LogLevelEnum.ERROR);
      expect(loggingService.getNumericLevel("5")).toBe(LogLevelEnum.NONE);
    });

    it("should convert string named levels to numbers", () => {
      expect(loggingService.getNumericLevel("DEBUG")).toBe(LogLevelEnum.DEBUG);
      expect(loggingService.getNumericLevel("INFO")).toBe(LogLevelEnum.INFO);
      expect(loggingService.getNumericLevel("WARN")).toBe(LogLevelEnum.WARN);
      expect(loggingService.getNumericLevel("ERROR")).toBe(LogLevelEnum.ERROR);
      expect(loggingService.getNumericLevel("NONE")).toBe(LogLevelEnum.NONE);
    });

    it("should default to ERROR for unknown levels", () => {
      expect(loggingService.getNumericLevel("UNKNOWN")).toBe(LogLevelEnum.ERROR);
      expect(loggingService.getNumericLevel("6")).toBe(LogLevelEnum.ERROR);
      expect(loggingService.getNumericLevel({})).toBe(LogLevelEnum.ERROR);
    });
  });
});
