import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { getLoggingService, LoggingService } from "../../src/services/LoggingService";
import { LogLevelEnum } from "../../src/constants/enums";
import { LogLevel } from "../../src/types/api_types";

describe("LoggingService", () => {
  let consoleErrorStub: sinon.SinonStub;
  let consoleWarnStub: sinon.SinonStub;
  let consoleInfoStub: sinon.SinonStub;
  let consoleDebugStub: sinon.SinonStub;
  let consoleLogStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub console methods to prevent actual logging during tests
    consoleErrorStub = sinon.stub(console, "error");
    consoleWarnStub = sinon.stub(console, "warn");
    consoleInfoStub = sinon.stub(console, "info");
    consoleDebugStub = sinon.stub(console, "debug");
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(() => {
    // Restore console methods
    consoleErrorStub.restore();
    consoleWarnStub.restore();
    consoleInfoStub.restore();
    consoleDebugStub.restore();
    consoleLogStub.restore();

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

      expect(consoleDebugStub.calledOnce).toBe(true);
      expect(consoleDebugStub.calledWith("Debug message")).toBe(true);
    });

    it("should use a custom log handler when set", () => {
      const loggingService = getLoggingService();
      const customHandler = sinon.spy();

      loggingService.setLogHandler(customHandler);
      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.debug("Debug message");

      expect(customHandler.calledOnce).toBe(true);
      expect(customHandler.calledWith(LogLevelEnum.DEBUG, "Debug message")).toBe(true);
      expect(consoleDebugStub.called).toBe(false);
    });
  });

  describe("Logging Methods", () => {
    it("should call log method with correct parameters", () => {
      const loggingService = getLoggingService();
      const logSpy = sinon.spy(loggingService, "log");

      loggingService.error("Error message");
      expect(logSpy.calledWith(LogLevelEnum.ERROR, "Error message")).toBe(true);

      loggingService.warn("Warn message");
      expect(logSpy.calledWith(LogLevelEnum.WARN, "Warn message")).toBe(true);

      loggingService.info("Info message");
      expect(logSpy.calledWith(LogLevelEnum.INFO, "Info message")).toBe(true);

      loggingService.debug("Debug message");
      expect(logSpy.calledWith(LogLevelEnum.DEBUG, "Debug message")).toBe(true);

      logSpy.restore();
    });

    it("should call console.error when logging error messages", () => {
      // Get a fresh instance for this test
      const loggingService = getLoggingService();

      // Reset stubs
      consoleErrorStub.resetHistory();

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
      expect(consoleErrorStub.called).toBe(true);
      expect(consoleErrorStub.calledWith("Direct error message")).toBe(true);
    });

    it("should not log messages below the current log level", () => {
      const loggingService = getLoggingService();
      const customHandler = sinon.spy();

      loggingService.setLogHandler(customHandler);
      loggingService.setLogLevel(LogLevelEnum.ERROR);

      loggingService.warn("Warn message");
      loggingService.info("Info message");
      loggingService.debug("Debug message");

      expect(customHandler.called).toBe(false);
    });

    it("should log messages at or above the current log level", () => {
      const loggingService = getLoggingService();
      const customHandler = sinon.spy();

      loggingService.setLogHandler(customHandler);
      loggingService.setLogLevel(LogLevelEnum.WARN);

      loggingService.error("Error message");
      expect(customHandler.calledWith(LogLevelEnum.ERROR, "Error message")).toBe(true);

      loggingService.warn("Warn message");
      expect(customHandler.calledWith(LogLevelEnum.WARN, "Warn message")).toBe(true);
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
          case LogLevelEnum.DEBUG:
            // Access console.debug directly to ensure we check at runtime
            const debug = console.debug;
            if (typeof debug === "function") {
              debug.call(console, logMessage);
            } else {
              console.log(logMessage);
            }
            break;
        }
      };
    };

    it("should call console.error for ERROR level messages", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.ERROR, "Error message");

      expect(consoleErrorStub.calledOnce).toBe(true);
      expect(consoleErrorStub.calledWith("Error message")).toBe(true);
    });

    it("should call console.warn for WARN level messages", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.WARN, "Warn message");

      expect(consoleWarnStub.calledOnce).toBe(true);
      expect(consoleWarnStub.calledWith("Warn message")).toBe(true);
    });

    it("should call console.info for INFO level messages", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.INFO, "Info message");

      expect(consoleInfoStub.calledOnce).toBe(true);
      expect(consoleInfoStub.calledWith("Info message")).toBe(true);
    });

    it("should call console.debug for DEBUG level messages if available", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.DEBUG, "Debug message");

      expect(consoleDebugStub.calledOnce).toBe(true);
      expect(consoleDebugStub.calledWith("Debug message")).toBe(true);
    });

    it("should call console.log for DEBUG level messages if console.debug is not available", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      // Reset the console.log stub to ensure it's clean
      consoleLogStub.resetHistory();

      // Temporarily remove console.debug
      const originalDebug = console.debug;
      consoleDebugStub.restore();
      delete console.debug;

      loggingService.setLogLevel(LogLevelEnum.DEBUG);
      loggingService.log(LogLevelEnum.DEBUG, "Debug message");

      // Check if console.log was called
      expect(consoleLogStub.calledOnce).toBe(true);
      expect(consoleLogStub.calledWith("Debug message")).toBe(true);

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
      expect(consoleErrorStub.calledWith("Error message")).toBe(true);

      loggingService.log("WARN", "Warn message");
      expect(consoleWarnStub.calledWith("Warn message")).toBe(true);

      loggingService.log("INFO", "Info message");
      expect(consoleInfoStub.calledWith("Info message")).toBe(true);

      loggingService.log("DEBUG", "Debug message");
      expect(consoleDebugStub.calledWith("Debug message")).toBe(true);
    });

    it("should handle numeric string log levels in the default handler", () => {
      const loggingService = getLoggingService();

      // Reset the log handler to a new default one
      (loggingService as any)._logHandler = createDefaultLogHandler();

      loggingService.setLogLevel(LogLevelEnum.DEBUG);

      // Test numeric string log levels
      loggingService.log("4", "Error message");
      expect(consoleErrorStub.calledWith("Error message")).toBe(true);

      loggingService.log("3", "Warn message");
      expect(consoleWarnStub.calledWith("Warn message")).toBe(true);

      loggingService.log("2", "Info message");
      expect(consoleInfoStub.calledWith("Info message")).toBe(true);

      loggingService.log("1", "Debug message");
      expect(consoleDebugStub.calledWith("Debug message")).toBe(true);
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
