import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { Settings } from "../../src/types/api_types";
import { ADLNav } from "../../src";

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

    it("should handle lmsGetValue for adl.nav.request", () => {
      const apiInstance = apiInitialized();

      // Test basic getValue for navigation request
      const result = apiInstance.lmsGetValue("adl.nav.request");
      expect(typeof result).toBe("string");
    });

    it("should handle lmsGetValue for adl.nav.request_valid", () => {
      const apiInstance = apiInitialized();

      // Test basic getValue for navigation request valid - returns the object as string
      const result = apiInstance.lmsGetValue("adl.nav.request_valid");
      expect(result).toBeDefined();
    });
  });
});
