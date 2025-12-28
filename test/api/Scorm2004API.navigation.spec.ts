import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { Settings } from "../../src/types/api_types";

const api = (settings?: Settings): Scorm2004API => {
  return new Scorm2004API({ ...settings, logLevel: LogLevelEnum.NONE });
};

const apiInitialized = (settings?: Settings): Scorm2004API => {
  const API = api(settings);
  API.loadFromJSON({}, "");
  API.lmsInitialize();
  return API;
};

describe("SCORM 2004 API Navigation Request Processing Tests", () => {
  beforeAll(() => {
    vi.stubGlobal("fetch", vi.fn());
    (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: "true", errorCode: 0 }),
      } as Response);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Navigation Request Basic Tests", () => {
    it("should access adl.nav properties", () => {
      const apiInstance = apiInitialized();

      // Test that navigation properties are accessible
      expect(apiInstance.adl.nav).toBeDefined();
      expect(apiInstance.adl.nav.request_valid).toBeDefined();
      expect(apiInstance.adl.nav.request).toBeDefined();
    });

    it("should return error 405 when reading adl.nav.request (write-only)", () => {
      const apiInstance = apiInitialized();

      // adl.nav.request is write-only per SCORM 2004 spec
      const result = apiInstance.lmsGetValue("adl.nav.request");

      expect(result).toBe("");
      expect(apiInstance.lmsGetLastError()).toBe("405"); // WRITE_ONLY_ELEMENT
    });

    it("should handle lmsGetValue for adl.nav.request_valid", () => {
      const apiInstance = apiInitialized();

      // Test basic getValue for navigation request valid - returns the object as string
      const result = apiInstance.lmsGetValue("adl.nav.request_valid");
      expect(result).toBeDefined();
    });
  });

  describe("Navigation Request Processing During Terminate", () => {
    it("should process navigation request during Terminate when set", () => {
      const apiInstance = apiInitialized();

      // Mock processListeners to verify navigation event is fired
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      // Set a navigation request
      apiInstance.lmsSetValue("adl.nav.request", "continue");
      expect(apiInstance.lmsGetLastError()).toBe("0");

      // Terminate should process the navigation request
      const result = apiInstance.lmsFinish();
      expect(result).toBe("true");

      // Verify that processListeners was called with SequenceNext (for continue)
      expect(processListenersSpy).toHaveBeenCalled();
      const calls = processListenersSpy.mock.calls;
      const hasSequenceNext = calls.some((call) => call[0] === "SequenceNext");
      expect(hasSequenceNext).toBe(true);
    });

    it("should reset navigation request to _none_ after Terminate", () => {
      const apiInstance = apiInitialized();

      // Set a navigation request
      apiInstance.lmsSetValue("adl.nav.request", "continue");

      // Store initial request value directly (since adl.nav.request is write-only)
      const initialRequest = apiInstance.adl.nav.request;
      expect(initialRequest).toBe("continue");

      // Terminate should process and reset the navigation request
      apiInstance.lmsFinish();

      // After Terminate, request should be reset to _none_
      expect(apiInstance.adl.nav.request).toBe("_none_");
    });

    it("should process different navigation request types during Terminate", () => {
      const navActions: { [key: string]: string } = {
        previous: "SequencePrevious",
        continue: "SequenceNext",
        exit: "SequenceExit",
        exitAll: "SequenceExitAll",
      };

      for (const [navRequest, expectedEvent] of Object.entries(navActions)) {
        const apiInstance = apiInitialized();
        const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

        apiInstance.lmsSetValue("adl.nav.request", navRequest);
        apiInstance.lmsFinish();

        const calls = processListenersSpy.mock.calls;
        const hasExpectedEvent = calls.some((call) => call[0] === expectedEvent);
        expect(hasExpectedEvent).toBe(true);
      }
    });

    it("should not process navigation when request is _none_", () => {
      const apiInstance = apiInitialized();
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      // Don't set any navigation request (default is _none_)
      expect(apiInstance.adl.nav.request).toBe("_none_");

      // Terminate with autoProgress disabled
      apiInstance.settings.autoProgress = false;
      apiInstance.lmsFinish();

      // Verify that processListeners was not called for navigation events
      // Note: processListeners may be called for BeforeTerminate and Terminate events,
      // but not for navigation events like SequenceNext, SequencePrevious, etc.
      const calls = processListenersSpy.mock.calls;
      const hasNavigationEvent = calls.some((call) =>
        [
          "SequenceNext",
          "SequencePrevious",
          "SequenceChoice",
          "SequenceJump",
          "SequenceExit",
          "SequenceExitAll",
          "SequenceAbandon",
          "SequenceAbandonAll",
        ].includes(call[0]),
      );
      expect(hasNavigationEvent).toBe(false);
    });

    it("should process SequenceNext when autoProgress is enabled and request is _none_", () => {
      const apiInstance = apiInitialized();
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      // Enable autoProgress
      apiInstance.settings.autoProgress = true;
      expect(apiInstance.adl.nav.request).toBe("_none_");

      // Terminate should trigger SequenceNext due to autoProgress
      apiInstance.lmsFinish();

      // Verify that processListeners was called with SequenceNext
      expect(processListenersSpy).toHaveBeenCalled();
      const calls = processListenersSpy.mock.calls;
      const hasSequenceNext = calls.some((call) => call[0] === "SequenceNext");
      expect(hasSequenceNext).toBe(true);
    });
  });
});
