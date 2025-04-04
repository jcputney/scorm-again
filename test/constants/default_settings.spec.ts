import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { DefaultSettings } from "../../src/constants/default_settings";
import { global_constants } from "../../src/constants/api_constants";
import { LogLevelEnum } from "../../src/constants/enums";

describe("DefaultSettings", () => {
  describe("responseHandler", () => {
    it("should return SCORM_TRUE and errorCode 0 for status 200 with no result", async () => {
      // Create a mock response with status 200 but no result in the body
      const mockResponse = new Response(JSON.stringify({}), { status: 200 });

      // Call the responseHandler
      const result = await DefaultSettings.responseHandler(mockResponse);

      // Verify the result
      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
    });

    it("should return SCORM_FALSE and errorCode 101 for non-200 status with no result", async () => {
      // Create a mock response with status 400 and no result in the body
      const mockResponse = new Response(JSON.stringify({}), { status: 400 });

      // Call the responseHandler
      const result = await DefaultSettings.responseHandler(mockResponse);

      // Verify the result
      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });

    it("should return the result and errorCode from the response when available", async () => {
      // Create a mock response with a result and errorCode
      const mockResponse = new Response(
        JSON.stringify({
          result: global_constants.SCORM_TRUE,
          errorCode: 42,
        }),
        { status: 200 },
      );

      // Call the responseHandler
      const result = await DefaultSettings.responseHandler(mockResponse);

      // Verify the result
      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(42);
    });

    it("should derive errorCode from result when only result is provided", async () => {
      // Create a mock response with only a result
      const mockResponse = new Response(
        JSON.stringify({
          result: global_constants.SCORM_TRUE,
        }),
        { status: 200 },
      );

      // Call the responseHandler
      const result = await DefaultSettings.responseHandler(mockResponse);

      // Verify the result
      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
    });

    it("should derive errorCode 101 when result is SCORM_FALSE", async () => {
      // Create a mock response with only a result set to SCORM_FALSE
      const mockResponse = new Response(
        JSON.stringify({
          result: global_constants.SCORM_FALSE,
        }),
        { status: 200 },
      );

      // Call the responseHandler
      const result = await DefaultSettings.responseHandler(mockResponse);

      // Verify the result
      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });

    it("should return SCORM_FALSE and errorCode 101 when response is undefined", async () => {
      // Call the responseHandler with undefined
      const result = await DefaultSettings.responseHandler(undefined as any);

      // Verify the result
      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });
  });

  describe("requestHandler", () => {
    it("should return the commitObject unchanged", () => {
      const commitObject = { data: "test" };
      const result = DefaultSettings.requestHandler(commitObject);
      expect(result).toBe(commitObject);
    });
  });

  describe("onLogMessage", () => {
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
    });

    it("should call console.error for ERROR level", () => {
      DefaultSettings.onLogMessage(LogLevelEnum.ERROR, "Error message");
      expect(consoleErrorStub.calledOnce).toBe(true);
      expect(consoleErrorStub.calledWith("Error message")).toBe(true);
    });

    it("should call console.error for string '4' level", () => {
      DefaultSettings.onLogMessage("4", "Error message");
      expect(consoleErrorStub.calledOnce).toBe(true);
      expect(consoleErrorStub.calledWith("Error message")).toBe(true);
    });

    it("should call console.error for numeric 4 level", () => {
      DefaultSettings.onLogMessage(4, "Error message");
      expect(consoleErrorStub.calledOnce).toBe(true);
      expect(consoleErrorStub.calledWith("Error message")).toBe(true);
    });

    it("should call console.warn for WARN level", () => {
      DefaultSettings.onLogMessage(LogLevelEnum.WARN, "Warn message");
      expect(consoleWarnStub.calledOnce).toBe(true);
      expect(consoleWarnStub.calledWith("Warn message")).toBe(true);
    });

    it("should call console.info for INFO level", () => {
      DefaultSettings.onLogMessage(LogLevelEnum.INFO, "Info message");
      expect(consoleInfoStub.calledOnce).toBe(true);
      expect(consoleInfoStub.calledWith("Info message")).toBe(true);
    });

    it("should call console.debug for DEBUG level when available", () => {
      DefaultSettings.onLogMessage(LogLevelEnum.DEBUG, "Debug message");
      expect(consoleDebugStub.calledOnce).toBe(true);
      expect(consoleDebugStub.calledWith("Debug message")).toBe(true);
    });

    it("should call console.log for DEBUG level when console.debug is not available", () => {
      // Temporarily remove console.debug
      const originalDebug = console.debug;
      consoleDebugStub.restore();
      delete console.debug;

      // Reset the console.log stub to ensure it's clean
      consoleLogStub.resetHistory();

      DefaultSettings.onLogMessage(LogLevelEnum.DEBUG, "Debug message");

      expect(consoleLogStub.calledOnce).toBe(true);
      expect(consoleLogStub.calledWith("Debug message")).toBe(true);

      // Restore console.debug
      console.debug = originalDebug;
      // Don't re-stub console.debug here, it will be re-stubbed in the afterEach hook
    });
  });
});
