import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { Settings } from "../../src/types/api_types";

const api = (settings?: Settings): Scorm2004API => {
  return new Scorm2004API({ ...settings, logLevel: LogLevelEnum.NONE });
};

describe("SCORM 2004 API - determineEntryValue() Helper", () => {
  describe("No previous exit or empty exit (first-time learner)", () => {
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

  describe("Previous exit was 'logout' (per SCORM spec: always returns '')", () => {
    it("should return '' when previousExit is 'logout'", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("logout", false);
      expect(result).toBe("");
    });

    it("should return '' when previousExit is 'logout' even with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("logout", true);
      expect(result).toBe("");
    });
  });

  describe("Previous exit was 'normal' (per SCORM spec: always returns '')", () => {
    it("should return '' when previousExit is 'normal' with no suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", false);
      expect(result).toBe("");
    });

    it("should return '' when previousExit is 'normal' even with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", true);
      expect(result).toBe("");
    });
  });

  describe("Previous exit was 'time-out' (per SCORM spec: '' or possibly 'resume' with suspend data)", () => {
    it("should return '' when previousExit is 'time-out' with no suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("time-out", false);
      expect(result).toBe("");
    });

    it("should return 'resume' when previousExit is 'time-out' with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("time-out", true);
      expect(result).toBe("resume");
    });
  });

  describe("Edge cases and invalid values", () => {
    it("should return '' for an unknown/invalid exit value (previous session existed)", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("invalid-exit-value", false);
      expect(result).toBe("");
    });

    it("should return '' for an unknown exit value even with suspend data", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("unknown", true);
      expect(result).toBe("");
    });

    it("should handle whitespace strings as empty (first-time learner)", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("   ", false);
      expect(result).toBe("ab-initio");
    });
  });

  describe("Use case scenarios per SCORM 2004 spec", () => {
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

    it("should handle learner who completed normally (per spec: returns '')", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", true);
      expect(result).toBe("");
    });

    it("should handle learner who timed out but has suspend data (per spec: may return 'resume')", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("time-out", true);
      expect(result).toBe("resume");
    });

    it("should handle learner who logged out and is returning (per spec: returns '')", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("logout", false);
      expect(result).toBe("");
    });

    it("should handle learner who completed normally without suspend data (per spec: returns '')", () => {
      const apiInstance = api();
      const result = apiInstance.determineEntryValue("normal", false);
      expect(result).toBe("");
    });
  });
});
