import { afterEach, beforeEach, describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { HttpService } from "../../src/services/HttpService";
import { LogLevelEnum } from "../../src/constants/enums";
import { global_constants } from "../../src/constants/api_constants";
import { Settings } from "../../src/types/api_types";

describe("HttpService", () => {
  let httpService: HttpService;
  let settings: Settings;
  let errorCodes: any;
  let apiLogStub: sinon.SinonStub;
  let processListenersStub: sinon.SinonStub;
  let fetchStub: sinon.SinonStub;

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
    };

    // Create mock error codes
    errorCodes = {
      GENERAL: 101,
    };

    // Create stubs for dependencies
    apiLogStub = sinon.stub();
    processListenersStub = sinon.stub();

    // Stub the global fetch function
    fetchStub = sinon.stub(global, "fetch");

    // Create a new instance for each test
    httpService = new HttpService(settings, errorCodes);
  });

  afterEach(() => {
    // Restore stubs
    fetchStub.restore();
  });

  describe("processHttpRequest", () => {
    it("should call fetch with the correct parameters", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.resolves(mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(fetchStub.calledOnce).toBe(true);
      expect(fetchStub.firstCall.args[0]).toBe(url);
      expect(fetchStub.firstCall.args[1].method).toBe("POST");
      expect(fetchStub.firstCall.args[1].mode).toBe("cors");
      expect(fetchStub.firstCall.args[1].body).toBe(JSON.stringify(params));
      expect(fetchStub.firstCall.args[1].headers["Content-Type"]).toBe("application/json");
    });

    it("should handle immediate requests", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.resolves(mockResponse);

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
      expect(fetchStub.calledOnce).toBe(true);
    });

    it("should call requestHandler with params", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.resolves(mockResponse);
      const requestHandlerSpy = sinon.spy(settings, "requestHandler");

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(requestHandlerSpy.calledOnce).toBe(true);
      expect(requestHandlerSpy.calledWith(params)).toBe(true);

      requestHandlerSpy.restore();
    });

    it("should call responseHandler with response", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.resolves(mockResponse);
      const responseHandlerSpy = sinon.spy(settings, "responseHandler");

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(responseHandlerSpy.calledOnce).toBe(true);
      expect(responseHandlerSpy.firstCall.args[0]).toBe(mockResponse);

      responseHandlerSpy.restore();
    });

    it("should call processListeners with CommitSuccess on successful response", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
        { status: 200 },
      );
      fetchStub.resolves(mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(processListenersStub.calledWith("CommitSuccess")).toBe(true);
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
      fetchStub.resolves(mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(processListenersStub.calledWith("CommitError")).toBe(true);
    });

    it("should handle fetch errors", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = { data: "test" };
      fetchStub.rejects(new Error("Network error"));

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
      expect(
        apiLogStub.calledWith(
          "processHttpRequest",
          sinon.match.instanceOf(Error),
          LogLevelEnum.ERROR,
        ),
      ).toBe(true);
      expect(processListenersStub.calledWith("CommitError")).toBe(true);
    });

    it("should handle array params", async () => {
      // Arrange
      const url = "https://example.com/api";
      const params = ["param1=value1", "param2=value2"];
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.resolves(mockResponse);

      // Act
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(fetchStub.calledOnce).toBe(true);
      expect(fetchStub.firstCall.args[1].body).toBe("param1=value1&param2=value2");
    });
  });

  describe("updateSettings", () => {
    it("should update the settings", async () => {
      // Arrange
      const newSettings: Settings = {
        fetchMode: "no-cors",
        commitRequestDataType: "text/plain",
        xhrHeaders: { "X-Custom-Header": "value" },
        xhrWithCredentials: true,
        requestHandler: (params) => params,
        responseHandler: async (response) => {
          const text = await response.text();
          return text ? JSON.parse(text) : { result: global_constants.SCORM_TRUE, errorCode: 0 };
        },
      };
      const url = "https://example.com/api";
      const params = { data: "test" };
      const mockResponse = new Response(
        JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      );
      fetchStub.resolves(mockResponse);

      // Act
      httpService.updateSettings(newSettings);

      // Make a request to test the updated settings
      await httpService.processHttpRequest(url, params, false, apiLogStub, processListenersStub);

      // Assert
      expect(fetchStub.called).toBe(true);
      const fetchCall = fetchStub.getCall(0);
      expect(fetchCall.args[1].mode).toBe("no-cors");
      expect(fetchCall.args[1].headers["Content-Type"]).toBe("text/plain");
      expect(fetchCall.args[1].headers["X-Custom-Header"]).toBe("value");
      expect(fetchCall.args[1].credentials).toBe("include");
    });
  });
});
