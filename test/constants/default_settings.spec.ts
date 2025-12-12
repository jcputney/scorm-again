// noinspection DuplicatedCode

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DefaultSettings } from "../../src/constants/default_settings";
import { global_constants } from "../../src";
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
      vi.restoreAllMocks();
      vi.clearAllMocks();
    });

    it("should call console.error for ERROR level", () => {
      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage(LogLevelEnum.ERROR, "Error message");
      expect(consoleErrorStub).toHaveBeenCalledOnce();
      expect(consoleErrorStub).toHaveBeenCalledWith("Error message");
    });

    it("should call console.error for string '4' level", () => {
      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage("4", "Error message");
      expect(consoleErrorStub).toHaveBeenCalledOnce();
      expect(consoleErrorStub).toHaveBeenCalledWith("Error message");
    });

    it("should call console.error for numeric 4 level", () => {
      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage(4, "Error message");
      expect(consoleErrorStub).toHaveBeenCalledOnce();
      expect(consoleErrorStub).toHaveBeenCalledWith("Error message");
    });

    it("should call console.warn for WARN level", () => {
      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage(LogLevelEnum.WARN, "Warn message");
      expect(consoleWarnStub).toHaveBeenCalledOnce();
      expect(consoleWarnStub).toHaveBeenCalledWith("Warn message");
    });

    it("should call console.info for INFO level", () => {
      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage(LogLevelEnum.INFO, "Info message");
      expect(consoleInfoStub).toHaveBeenCalledOnce();
      expect(consoleInfoStub).toHaveBeenCalledWith("Info message");
    });

    it("should call console.debug for DEBUG level when available", () => {
      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage(LogLevelEnum.DEBUG, "Debug message");
      expect(consoleDebugStub).toHaveBeenCalledOnce();
      expect(consoleDebugStub).toHaveBeenCalledWith("Debug message");
    });

    it("should call console.log for DEBUG level when console.debug is not available", () => {
      // Temporarily remove console.debug
      const originalDebug = console.debug;
      console.debug = null as any;

      // eslint-disable-next-line
      // @ts-ignore
      DefaultSettings.onLogMessage(LogLevelEnum.DEBUG, "Debug message");

      expect(consoleLogStub).toHaveBeenCalledOnce();
      expect(consoleLogStub).toHaveBeenCalledWith("Debug message");

      // Restore console.debug
      console.debug = originalDebug;
    });
  });

  describe("new HTTP service settings", () => {
    it("should have useAsynchronousCommits default to false", () => {
      expect(DefaultSettings.useAsynchronousCommits).toBe(false);
    });

    it("should have httpService default to null", () => {
      expect(DefaultSettings.httpService).toBeNull();
    });

    it("should have xhrResponseHandler default function", () => {
      expect(typeof DefaultSettings.xhrResponseHandler).toBe("function");
    });

    describe("xhrResponseHandler", () => {
      it("should parse successful XHR response", () => {
        const mockXHR = {
          status: 200,
          responseText: '{"result":"true","errorCode":0}',
        } as XMLHttpRequest;

        const result = DefaultSettings.xhrResponseHandler(mockXHR);
        expect(result.result).toBe("true");
        expect(result.errorCode).toBe(0);
      });

      it("should handle failed XHR response", () => {
        const mockXHR = {
          status: 500,
          responseText: "",
        } as XMLHttpRequest;

        const result = DefaultSettings.xhrResponseHandler(mockXHR);
        expect(result.result).toBe(global_constants.SCORM_FALSE);
        expect(result.errorCode).toBe(101);
      });

      it("should handle XHR response with no result field", () => {
        const mockXHR = {
          status: 200,
          responseText: "{}",
        } as XMLHttpRequest;

        const result = DefaultSettings.xhrResponseHandler(mockXHR);
        expect(result.result).toBe(global_constants.SCORM_TRUE);
        expect(result.errorCode).toBe(0);
      });

      it("should handle XHR response with invalid JSON", () => {
        const mockXHR = {
          status: 200,
          responseText: "not json",
        } as XMLHttpRequest;

        const result = DefaultSettings.xhrResponseHandler(mockXHR);
        expect(result.result).toBe(global_constants.SCORM_TRUE);
        expect(result.errorCode).toBe(0);
      });

      it("should derive errorCode from result when only result is provided", () => {
        const mockXHR = {
          status: 200,
          responseText: `{"result":"${global_constants.SCORM_TRUE}"}`,
        } as XMLHttpRequest;

        const result = DefaultSettings.xhrResponseHandler(mockXHR);
        expect(result.result).toBe(global_constants.SCORM_TRUE);
        expect(result.errorCode).toBe(0);
      });

      it("should derive errorCode 101 when result is SCORM_FALSE", () => {
        const mockXHR = {
          status: 200,
          responseText: `{"result":"${global_constants.SCORM_FALSE}"}`,
        } as XMLHttpRequest;

        const result = DefaultSettings.xhrResponseHandler(mockXHR);
        expect(result.result).toBe(global_constants.SCORM_FALSE);
        expect(result.errorCode).toBe(101);
      });

      it("should return SCORM_FALSE for undefined XHR", () => {
        const result = DefaultSettings.xhrResponseHandler(undefined as any);
        expect(result.result).toBe(global_constants.SCORM_FALSE);
        expect(result.errorCode).toBe(101);
      });
    });
  });
});
