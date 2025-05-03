import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
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
  let sendBeaconStub: any;

  // Mock navigator.sendBeacon if it doesn't exist (Node.js environment)
  beforeAll(() => {
    if (typeof navigator === "undefined") {
      global.navigator = { sendBeacon: vi.fn(() => true) } as any;
    } else if (!navigator.sendBeacon) {
      navigator.sendBeacon = vi.fn(() => true);
    }
  });

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
      useBeaconInsteadOfFetch: "never",
    } as InternalSettings;

    // Create mock error codes
    errorCodes = {
      GENERAL: 101,
    };

    // Stub the global fetch function
    fetchStub = vi.spyOn(global, "fetch");

    // Stub the navigator.sendBeacon function
    sendBeaconStub = vi.spyOn(navigator, "sendBeacon").mockImplementation(() => true);

    // Create a new instance for each test
    httpService = new HttpService(settings, errorCodes);
  });

  afterEach(() => {
    // Restore stubs
    // fetchStub.restore() - not needed with vi.restoreAllMocks()
  });

  describe("processHttpRequest", () => {
    it("should call fetch with the correct parameters", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(fetchStub).toHaveBeenCalledOnce();
      expect(fetchStub.mock.calls[0][0]).toBe(url);
      expect((fetchStub.mock.calls[0][1] as any).method).toBe("POST");
      expect((fetchStub.mock.calls[0][1] as any).mode).toBe("cors");
      expect((fetchStub.mock.calls[0][1] as any).body).toBe(JSON.stringify(params));
      expect((fetchStub.mock.calls[0][1] as any).headers["Content-Type"]).toBe("application/json");
    });

    it("should handle immediate requests with fetch", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      const result = await httpService.processHttpRequest(
        url,
        params,
        true,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
      expect(fetchStub).toHaveBeenCalledOnce();
      expect(sendBeaconStub).not.toHaveBeenCalled();
    });

    it("should use sendBeacon for immediate requests when useBeaconInsteadOfFetch is 'on-terminate'", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "on-terminate";
      httpService.updateSettings(settings);

      const result = await httpService.processHttpRequest(
        url,
        params,
        true,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
      expect(fetchStub).not.toHaveBeenCalled();
      expect(sendBeaconStub).toHaveBeenCalledOnce();
      expect(sendBeaconStub).toHaveBeenCalledWith(url, expect.any(Blob));
    });

    it("should use sendBeacon for all requests when useBeaconInsteadOfFetch is 'always'", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      // Mock the performBeacon method to return a mock response
      const mockResponse = {
        status: 200,
        ok: true,
        json: async () => ({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
        text: async () => JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      } as Response;

      const result = await httpService.processHttpRequest(
        url,
        params,
        false, // Not immediate
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
      expect(fetchStub).not.toHaveBeenCalled();
      expect(sendBeaconStub).toHaveBeenCalledOnce();
      expect(sendBeaconStub).toHaveBeenCalledWith(url, expect.any(Blob));
    });

    it("should handle array params with sendBeacon", async () => {
      const url = "https://example.com/api";
      const params = ["param1=value1", "param2=value2"];
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);
      expect(fetchStub).not.toHaveBeenCalled();
      expect(sendBeaconStub).toHaveBeenCalledOnce();

      // Verify the content type is set correctly for form data
      const blobArg = sendBeaconStub.mock.calls[0][1] as Blob;
      expect(blobArg.type).toBe("application/x-www-form-urlencoded");
    });

    it("should handle sendBeacon failure", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      // Mock sendBeacon to fail
      sendBeaconStub.mockImplementation(() => false);

      // Clear previous calls to processListenersStub
      processListenersStub.mockClear();

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(errorCodes.GENERAL);
      expect(fetchStub).not.toHaveBeenCalled();
      expect(sendBeaconStub).toHaveBeenCalledOnce();
      expect(processListenersStub).toHaveBeenCalledWith(
        "CommitError",
        undefined,
        errorCodes.GENERAL,
      );
    });

    it("should test the mock response json method from performBeacon", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      // Mock sendBeacon to succeed
      sendBeaconStub.mockImplementation(() => true);

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);

      // Get the mock response directly to test its json method
      const mockResponse = await (httpService as any).performBeacon(url, params);
      const jsonResult = await mockResponse.json();

      // Verify the json method returns the expected result
      expect(jsonResult).toEqual({
        result: "true",
        errorCode: 0,
      });
    });

    it("should test the mock response text method from performBeacon", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      // Mock sendBeacon to succeed
      sendBeaconStub.mockImplementation(() => true);
      // Get the mock response directly to test its text method
      const mockResponse = await (httpService as any).performBeacon(url, params);
      const textResult = await mockResponse.text();

      // Verify the text method returns the expected JSON string
      expect(textResult).toBe(
        JSON.stringify({
          result: "true",
          errorCode: 0,
        }),
      );
    });

    it("should test the mock response json method from performBeacon when sendBeacon fails", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      // Mock sendBeacon to fail
      sendBeaconStub.mockImplementation(() => false);
      // Get the mock response directly to test its json method;
      const mockResponse = await (httpService as any).performBeacon(url, params);
      const jsonResult = await mockResponse.json();

      // Verify the json method returns the expected result for failure
      expect(jsonResult).toEqual({
        result: "false",
        errorCode: errorCodes.GENERAL,
      });
    });

    it("should test the mock response text method from performBeacon when sendBeacon fails", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      settings.useBeaconInsteadOfFetch = "always";
      httpService.updateSettings(settings);

      // Mock sendBeacon to fail
      sendBeaconStub.mockImplementation(() => false);
      // Get the mock response directly to test its text method;
      const mockResponse = await (httpService as any).performBeacon(url, params);
      const textResult = await mockResponse.text();

      // Verify the text method returns the expected JSON string for failure
      expect(textResult).toBe(
        JSON.stringify({
          result: "false",
          errorCode: errorCodes.GENERAL,
        }),
      );
    });

    it("should call requestHandler with params", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);
      const requestHandlerSpy = vi.spyOn(settings, "requestHandler");

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(requestHandlerSpy).toHaveBeenCalledOnce();
      expect(requestHandlerSpy).toHaveBeenCalledWith(params);

      // requestHandlerSpy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should call responseHandler with response", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);
      const responseHandlerSpy = vi.spyOn(settings, "responseHandler") as any;

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(responseHandlerSpy).toHaveBeenCalledOnce();
      expect(responseHandlerSpy.mock.calls[0][0]).toBe(mockResponse);

      // responseHandlerSpy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should call processListeners with CommitSuccess on successful response", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
        { status: 200 },
      );
      fetchStub.mockImplementation(() => mockResponse);

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(processListenersStub).toHaveBeenCalledWith("CommitSuccess");
    });

    it("should call processListeners with CommitError on failed response", async () => {
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

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(processListenersStub).toHaveBeenCalledWith("CommitError", undefined, 101);
    });

    it("should add errorCode when response doesn't have one but is successful", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({
          result: global_constants.SCORM_TRUE,
          // No errorCode property
        }),
        { status: 200 },
      );
      fetchStub.mockImplementation(() => mockResponse);
      processListenersStub.mockClear();

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0); // Should add errorCode 0 for success
      expect(processListenersStub).toHaveBeenCalledWith("CommitSuccess");
    });

    it("should add errorCode when response doesn't have one and is not successful", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({
          result: global_constants.SCORM_FALSE,
          // No errorCode property
        }),
        { status: 400 },
      );
      fetchStub.mockImplementation(() => mockResponse);
      processListenersStub.mockClear();

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(errorCodes.GENERAL); // Should add general error code
      expect(processListenersStub).toHaveBeenCalledWith(
        "CommitError",
        undefined,
        errorCodes.GENERAL,
      );
    });

    it("should handle response without result property", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({
          // No result property
          message: "Success",
        }),
        { status: 200 },
      );
      fetchStub.mockImplementation(() => mockResponse);
      processListenersStub.mockClear();

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      // Since there's no result property, _isSuccessResponse should return false
      expect(result.errorCode).toBe(errorCodes.GENERAL);
      expect(processListenersStub).toHaveBeenCalledWith(
        "CommitError",
        undefined,
        errorCodes.GENERAL,
      );
    });

    it("should handle when responseHandler is not a function", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(JSON.stringify({ result: global_constants.SCORM_TRUE }), {
        status: 200,
      });
      fetchStub.mockImplementation(() => mockResponse);

      // Set responseHandler to undefined
      settings.responseHandler = undefined as any;
      httpService.updateSettings(settings);
      processListenersStub.mockClear();

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(processListenersStub).toHaveBeenCalledWith("CommitSuccess");
    });

    it("should handle fetch errors", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      fetchStub.mockRejectedValue(new Error("Network error"));

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

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
      const url = "https://example.com/api";
      const params = ["param1=value1", "param2=value2"];
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(fetchStub).toHaveBeenCalledOnce();
      expect((fetchStub.mock.calls[0][1] as any).body).toBe("param1=value1&param2=value2");
    });

    it("should handle response parsing errors", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      // Create a response with invalid JSON
      const mockResponse = new Response("This is not valid JSON", { status: 200 });
      fetchStub.mockImplementation(() => mockResponse);

      // Mock the fetch implementation to throw an error during response processing
      fetchStub.mockRejectedValue(new Error("JSON parse error"));

      processListenersStub.mockClear();

      const result = await httpService.processHttpRequest(
        url,
        params,
        false,
        apiLogStub,
        processListenersStub,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(errorCodes.GENERAL);
      expect(apiLogStub).toHaveBeenCalledWith(
        "processHttpRequest",
        expect.any(Error),
        LogLevelEnum.ERROR,
      );
      expect(processListenersStub).toHaveBeenCalledWith("CommitError");
    });

    it("should handle different content types in the request", async () => {
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.mockImplementation(() => mockResponse);

      // Change content type
      settings.commitRequestDataType = "application/x-www-form-urlencoded";
      httpService.updateSettings(settings);

      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(fetchStub).toHaveBeenCalledOnce();
      expect((fetchStub.mock.calls[0][1] as any).headers["Content-Type"]).toBe(
        "application/x-www-form-urlencoded",
      );
    });

    it("should test _isSuccessResponse with different status codes", async () => {
      // We'll test the private method directly
      const httpServiceAny = httpService as any;

      // Test with various status codes and result values
      const testCases = [
        // status, result, expected
        [200, global_constants.SCORM_TRUE, true], // Success case
        [299, global_constants.SCORM_TRUE, true], // Edge of success range
        [300, global_constants.SCORM_TRUE, false], // Outside success range
        [199, global_constants.SCORM_TRUE, false], // Outside success range
        [200, global_constants.SCORM_FALSE, false], // Success status but failed result
        [200, "true", true], // String "true" should work too
        [200, undefined, false], // Undefined result
      ];

      for (const [status, resultValue, expected] of testCases) {
        const response = { status } as Response;
        const result = { result: resultValue };

        expect(httpServiceAny._isSuccessResponse(response, result)).toBe(expected);
      }
    });
  });

  describe("updateSettings", () => {
    it("should update the settings", async () => {
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

      httpService.updateSettings(newSettings);

      // Make a request to test the updated settings
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      expect(fetchStub).toHaveBeenCalled();
      const fetchCall = fetchStub.mock.calls[0] as any[];
      expect(fetchCall[1].mode).toBe("no-cors");
      expect(fetchCall[1].headers["Content-Type"]).toBe("text/plain");
      expect(fetchCall[1].headers["X-Custom-Header"]).toBe("value");
      expect(fetchCall[1].credentials).toBe("include");
    });
  });
});
