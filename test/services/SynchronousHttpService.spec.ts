import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
});
