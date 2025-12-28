import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SynchronousHttpService } from "../../src/services/SynchronousHttpService";
import { DefaultSettings } from "../../src/constants/default_settings";
import { scorm12_errors } from "../../src/constants/error_codes";
import { global_constants } from "../../src/constants/api_constants";

describe("SynchronousHttpService", () => {
  let service: SynchronousHttpService;
  let mockApiLog: any;
  let mockProcessListeners: any;

  beforeEach(() => {
    service = new SynchronousHttpService(DefaultSettings, scorm12_errors);
    mockApiLog = vi.fn();
    mockProcessListeners = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  /**
   * Creates a mock XMLHttpRequest constructor that returns the provided mock object
   */
  function createMockXHRConstructor(mockXHR: any) {
    return function MockXMLHttpRequest(this: any) {
      Object.assign(this, mockXHR);
      return this;
    } as unknown as typeof XMLHttpRequest;
  }

  describe("processHttpRequest - synchronous mode", () => {
    it("should use sync XHR when immediate=false", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.open).toHaveBeenCalledWith("POST", "http://test.com/commit", false);
      expect(result.result).toBe("true");
      expect(result.errorCode).toBe(0);
    });

    it("should handle XHR success response", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe("true");
      expect(result.errorCode).toBe(0);
    });

    it("should handle XHR error response", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 500,
        statusText: "Internal Server Error",
        responseText: "",
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });

    it("should handle XHR network error", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(() => {
          throw new Error("Network error");
        }),
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });
  });

  describe("processHttpRequest - immediate mode", () => {
    it("should use sendBeacon when immediate=true", () => {
      const mockBeacon = vi.fn().mockReturnValue(true);
      vi.stubGlobal("navigator", { sendBeacon: mockBeacon });

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        true,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockBeacon).toHaveBeenCalled();
      expect(result.result).toBe("true");
      expect(result.errorCode).toBe(0);
    });

    it("should handle sendBeacon failure", () => {
      const mockBeacon = vi.fn().mockReturnValue(false);
      vi.stubGlobal("navigator", { sendBeacon: mockBeacon });

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        true,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe("false");
      expect(result.errorCode).toBe(101);
    });
  });

  describe("headers and credentials", () => {
    it("should apply custom headers from settings", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const customSettings = {
        ...DefaultSettings,
        xhrHeaders: { Authorization: "Bearer token123" },
      };
      service.updateSettings(customSettings);

      service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith("Authorization", "Bearer token123");
    });

    it("should set withCredentials when enabled", () => {
      let capturedXhr: any = null;
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(function (this: any) {
          capturedXhr = this;
        }),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
        withCredentials: false,
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const customSettings = {
        ...DefaultSettings,
        xhrWithCredentials: true,
      };
      service.updateSettings(customSettings);

      service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(capturedXhr.withCredentials).toBe(true);
    });
  });

  describe("requestHandler returning null/undefined", () => {
    it("should use original params when requestHandler returns null in immediate mode", () => {
      const mockBeacon = vi.fn().mockReturnValue(true);
      vi.stubGlobal("navigator", { sendBeacon: mockBeacon });

      const customSettings = {
        ...DefaultSettings,
        requestHandler: vi.fn().mockReturnValue(null),
      };
      service.updateSettings(customSettings);

      const params = { cmi: { core: { score: { raw: "80" } } } };
      service.processHttpRequest(
        "http://test.com/commit",
        params,
        true,
        mockApiLog,
        mockProcessListeners,
      );

      // Verify beacon was called with the original params
      expect(mockBeacon).toHaveBeenCalled();
      const blobArg = mockBeacon.mock.calls[0][1];
      expect(blobArg).toBeInstanceOf(Blob);
    });

    it("should use original params when requestHandler returns undefined in immediate mode", () => {
      const mockBeacon = vi.fn().mockReturnValue(true);
      vi.stubGlobal("navigator", { sendBeacon: mockBeacon });

      const customSettings = {
        ...DefaultSettings,
        requestHandler: vi.fn().mockReturnValue(undefined),
      };
      service.updateSettings(customSettings);

      const params = { cmi: { core: { score: { raw: "80" } } } };
      service.processHttpRequest(
        "http://test.com/commit",
        params,
        true,
        mockApiLog,
        mockProcessListeners,
      );

      // Verify beacon was called
      expect(mockBeacon).toHaveBeenCalled();
    });

    it("should use original params when requestHandler returns null in sync mode", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const customSettings = {
        ...DefaultSettings,
        requestHandler: vi.fn().mockReturnValue(null),
      };
      service.updateSettings(customSettings);

      const params = { cmi: { core: { score: { raw: "80" } } } };
      service.processHttpRequest(
        "http://test.com/commit",
        params,
        false,
        mockApiLog,
        mockProcessListeners,
      );

      // Verify XHR was called with the original params
      expect(mockXHR.send).toHaveBeenCalled();
      const sentData = mockXHR.send.mock.calls[0][0];
      expect(sentData).toBe(JSON.stringify(params));
    });

    it("should use original params when requestHandler returns undefined in sync mode", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const customSettings = {
        ...DefaultSettings,
        requestHandler: vi.fn().mockReturnValue(undefined),
      };
      service.updateSettings(customSettings);

      const params = { cmi: { core: { score: { raw: "80" } } } };
      service.processHttpRequest(
        "http://test.com/commit",
        params,
        false,
        mockApiLog,
        mockProcessListeners,
      );

      // Verify XHR was called
      expect(mockXHR.send).toHaveBeenCalled();
      const sentData = mockXHR.send.mock.calls[0][0];
      expect(sentData).toBe(JSON.stringify(params));
    });
  });

  describe("array parameter encoding", () => {
    it("should encode array parameters with join('&') for immediate mode", () => {
      const mockBeacon = vi.fn().mockReturnValue(true);
      vi.stubGlobal("navigator", { sendBeacon: mockBeacon });

      const arrayParams = ["param1=value1", "param2=value2", "param3=value3"];
      service.processHttpRequest(
        "http://test.com/commit",
        arrayParams,
        true,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockBeacon).toHaveBeenCalled();
      const blobArg = mockBeacon.mock.calls[0][1];
      expect(blobArg).toBeInstanceOf(Blob);
      // Verify the blob contains the joined params (case-insensitive check)
      expect(blobArg.type.toLowerCase()).toBe("text/plain;charset=utf-8");
    });

    it("should encode array parameters with join('&') for sync mode", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const arrayParams = ["param1=value1", "param2=value2", "param3=value3"];
      service.processHttpRequest(
        "http://test.com/commit",
        arrayParams,
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.send).toHaveBeenCalled();
      const sentData = mockXHR.send.mock.calls[0][0];
      expect(sentData).toBe("param1=value1&param2=value2&param3=value3");
      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/x-www-form-urlencoded",
      );
    });

    it("should handle empty arrays", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const emptyArray: string[] = [];
      service.processHttpRequest(
        "http://test.com/commit",
        emptyArray,
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.send).toHaveBeenCalled();
      const sentData = mockXHR.send.mock.calls[0][0];
      expect(sentData).toBe("");
    });

    it("should handle nested arrays (flattened via join)", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const nestedArray = ["param1=value1", "param2=value2"];
      service.processHttpRequest(
        "http://test.com/commit",
        nestedArray,
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.send).toHaveBeenCalled();
      const sentData = mockXHR.send.mock.calls[0][0];
      expect(sentData).toBe("param1=value1&param2=value2");
    });
  });

  describe("custom xhrResponseHandler throwing", () => {
    it("should handle xhrResponseHandler throwing an error", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const customSettings = {
        ...DefaultSettings,
        xhrResponseHandler: vi.fn(() => {
          throw new Error("Response handler error");
        }),
      };
      service.updateSettings(customSettings);

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
      expect(result.errorMessage).toBe("Response handler error");
    });

    it("should handle xhrResponseHandler throwing a non-Error object", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      vi.stubGlobal("XMLHttpRequest", createMockXHRConstructor(mockXHR));

      const customSettings = {
        ...DefaultSettings,
        xhrResponseHandler: vi.fn(() => {
          throw "String error";
        }),
      };
      service.updateSettings(customSettings);

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
      expect(result.errorMessage).toBe("String error");
    });
  });
});
