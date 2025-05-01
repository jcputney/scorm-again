import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HttpService } from "../../src/services/HttpService";
import { LogLevelEnum } from "../../src/constants/enums";
import { global_constants } from "../../src";
import { InternalSettings } from "../../src/types/api_types";

describe("HttpService", () => {
  let httpService: HttpService;
  let settings: InternalSettings;
  let errorCodes: any;
  const apiLogStub = vi.fn();
  const processListenersStub = vi.fn();
  let fetchStub: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create mock settings
    settings = {
      fetchMode: "cors",
      commitRequestDataType: "application/json",
      xhrHeaders: {},
      xhrWithCredentials: false,
      requestHandler: (params) => params,
      responseHandler: async (response) => {
        const text = await response.text();
        return text ? JSON.parse(text) : { result: global_constants.SCORM_TRUE, errorCode: 0 };
      },
    } as InternalSettings;

    // Create mock error codes
    errorCodes = {
      GENERAL: 101,
    };

    // Stub the global fetch function
    fetchStub = vi.spyOn(global, "fetch");

    // Create a new instance for each test
    httpService = new HttpService(settings, errorCodes);
  });

  afterEach(() => {
    // Restore stubs
    // fetchStub.restore() - not needed with vi.restoreAllMocks()
  });

  describe("processHttpRequest", () => {
    it("should call fetch with the correct parameters", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(fetchStub).toHaveBeenCalledOnce();
      expect(fetchStub.mock.calls[0][0]).toBe(url);
      expect((fetchStub.mock.calls[0][1] as any).method).toBe("POST");
      expect((fetchStub.mock.calls[0][1] as any).mode).toBe("cors");
      expect((fetchStub.mock.calls[0][1] as any).body).toBe(JSON.stringify(params));
      expect((fetchStub.mock.calls[0][1] as any).headers["Content-Type"]).toBe("application/json");
    });

    it("should handle immediate requests", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Act
      const result = await httpService.processHttpRequest(
        url,
        params,
        true,
        apiLogStub,
        processListenersStub,
      );

      // Assert
      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
      expect(fetchStub).toHaveBeenCalledOnce();
    });

    it("should call requestHandler with params", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);
      const requestHandlerSpy = vi.spyOn(settings, "requestHandler");

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(requestHandlerSpy).toHaveBeenCalledOnce();
      expect(requestHandlerSpy).toHaveBeenCalledWith(params);

      // requestHandlerSpy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should call responseHandler with response", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);
      const responseHandlerSpy = vi.spyOn(settings, "responseHandler") as any;

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(responseHandlerSpy).toHaveBeenCalledOnce();
      expect(responseHandlerSpy.mock.calls[0][0]).toBe(mockResponse);

      // responseHandlerSpy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should call processListeners with CommitSuccess on successful response", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
        { status: 200 },
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(processListenersStub).toHaveBeenCalledWith("CommitSuccess");
    });

    it("should call processListeners with CommitError on failed response", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({
          result: global_constants.SCORM_FALSE,
          errorCode: 101,
        }),
        { status: 400 },
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(processListenersStub).toHaveBeenCalledWith("CommitError", undefined, 101);
    });

    it("should handle fetch errors", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      fetchStub.mockRejectedValue(new Error("Network error"));

      // Act
      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      // Assert
      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(errorCodes.GENERAL);
      expect(apiLogStub).toHaveBeenCalledWith(
        "processHttpRequest",
        expect.any(Error),
        LogLevelEnum.ERROR,
      );
      expect(processListenersStub).toHaveBeenCalledWith("CommitError");
    });

    it("should handle array params", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = ["param1=value1", "param2=value2"];
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(fetchStub).toHaveBeenCalledOnce();
      expect((fetchStub.mock.calls[0][1] as any).body).toBe("param1=value1&param2=value2");
    });
  });

  describe("updateSettings", () => {
    it("should update the settings", async () => {
      // Arrange
      const newSettings = {
        fetchMode: "no-cors",
        commitRequestDataType: "text/plain",
        xhrHeaders: { "X-Custom-Header": "value" },
        xhrWithCredentials: true,
        requestHandler: (params: any) => params,
        responseHandler: async (response: { text: () => any }) => {
          const text = await response.text();
          return text ? JSON.parse(text) : { result: global_constants.SCORM_TRUE, errorCode: 0 };
        },
      } as unknown as InternalSettings;
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Act
      httpService.updateSettings(newSettings);

      // Make a request to test the updated settings
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(fetchStub).toHaveBeenCalled();
      const fetchCall = fetchStub.mock.calls[0] as any[];
      expect(fetchCall[1].mode).toBe("no-cors");
      expect(fetchCall[1].headers["Content-Type"]).toBe("text/plain");
      expect(fetchCall[1].headers["X-Custom-Header"]).toBe("value");
      expect(fetchCall[1].credentials).toBe("include");
    });
  });
});
