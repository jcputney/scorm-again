import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { Settings } from "../../src/types/api_types";

const api = (settings?: Settings): Scorm2004API => {
  return new Scorm2004API({ ...settings, logLevel: LogLevelEnum.NONE });
};

describe("SCORM 2004 API - determineEntryValue() Helper", () => {
  describe("No previous exit or empty exit", () => {
    it("should return 'ab-initio' when previousExit is empty string", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("", false);
      expect(result).toBe("ab-initio");
    });

    it("should return 'ab-initio' when previousExit is undefined", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue(undefined as any, false);
      expect(result).toBe("ab-initio");
    });

    it("should return 'ab-initio' when previousExit is null", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue(null as any, false);
      expect(result).toBe("ab-initio");
    });

    it("should return 'ab-initio' when previousExit is empty string regardless of suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("", true);
      expect(result).toBe("ab-initio");
    });
  });

  describe("Previous exit was 'suspend'", () => {
    it("should return 'resume' when previousExit is 'suspend'", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("suspend", false);
      expect(result).toBe("resume");
    });

    it("should return 'resume' when previousExit is 'suspend' with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("suspend", true);
      expect(result).toBe("resume");
    });
  });

  describe("Previous exit was 'logout'", () => {
    it("should return 'resume' when previousExit is 'logout'", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("logout", false);
      expect(result).toBe("resume");
    });

    it("should return 'resume' when previousExit is 'logout' with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("logout", true);
      expect(result).toBe("resume");
    });
  });

  describe("Previous exit was 'normal'", () => {
    it("should return 'ab-initio' when previousExit is 'normal' with no suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", false);
      expect(result).toBe("ab-initio");
    });

    it("should return 'resume' when previousExit is 'normal' with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", true);
      expect(result).toBe("resume");
    });
  });

  describe("Previous exit was 'time-out'", () => {
    it("should return 'ab-initio' when previousExit is 'time-out' with no suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("time-out", false);
      expect(result).toBe("ab-initio");
    });

    it("should return 'resume' when previousExit is 'time-out' with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("time-out", true);
      expect(result).toBe("resume");
    });
  });

  describe("Edge cases and invalid values", () => {
    it("should return 'ab-initio' for an unknown/invalid exit value", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("invalid-exit-value", false);
      expect(result).toBe("ab-initio");
    });

    it("should return 'ab-initio' for an unknown exit value even with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("unknown", true);
      expect(result).toBe("ab-initio");
    });

    it("should handle whitespace strings as empty", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("   ", false);
      expect(result).toBe("ab-initio");
    });
  });

  describe("Use case scenarios", () => {
    it("should handle first-time learner scenario (no previous session)", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("", false);
      expect(result).toBe("ab-initio");
    });

    it("should handle learner who suspended and is resuming", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("suspend", true);
      expect(result).toBe("resume");
    });

    it("should handle learner who completed normally but has suspend data from previous attempt", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", true);
      expect(result).toBe("resume");
    });

    it("should handle learner who timed out but has suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("time-out", true);
      expect(result).toBe("resume");
    });

    it("should handle learner who logged out and is returning", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("logout", false);
      expect(result).toBe("resume");
    });

    it("should handle learner who completed normally without suspend data (fresh start)", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", false);
      expect(result).toBe("ab-initio");
    });
  });
});
