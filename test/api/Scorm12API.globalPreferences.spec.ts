import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { LogLevelEnum } from "../../src/constants/enums";

describe("SCORM 1.2 Global Learner Preferences Tests", () => {
  beforeEach(() => {
    // Clear global preferences before each test
    Scorm12API.clearGlobalPreferences();
  });

  afterEach(() => {
    // Clean up after each test
    Scorm12API.clearGlobalPreferences();
  });

  describe("globalStudentPreferences=false (default)", () => {
    it("should keep preferences isolated between API instances", () => {
      // Create first API instance and set preferences
      const api1 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");
      api1.lmsSetValue("cmi.student_preference.language", "en");
      api1.lmsSetValue("cmi.student_preference.speed", "100");
      api1.lmsSetValue("cmi.student_preference.text", "1");

      // Create second API instance
      const api2 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api2.lmsInitialize();

      // Preferences should NOT be shared (default values)
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("");
      expect(api2.lmsGetValue("cmi.student_preference.language")).toBe("");
      expect(api2.lmsGetValue("cmi.student_preference.speed")).toBe("");
      expect(api2.lmsGetValue("cmi.student_preference.text")).toBe("");
    });
  });

  describe("globalStudentPreferences=true", () => {
    it("should persist audio preference across API instances", () => {
      // Create first API instance and set audio preference
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");

      // Create second API instance
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Audio preference should be persisted
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("1");
    });

    it("should persist language preference across API instances", () => {
      // Create first API instance and set language preference
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.language", "en-US");

      // Create second API instance
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Language preference should be persisted
      expect(api2.lmsGetValue("cmi.student_preference.language")).toBe("en-US");
    });

    it("should persist speed preference across API instances", () => {
      // Create first API instance and set speed preference
      // Note: SCORM 1.2 speed range is -100 to 100
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.speed", "50");

      // Create second API instance
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Speed preference should be persisted
      expect(api2.lmsGetValue("cmi.student_preference.speed")).toBe("50");
    });

    it("should persist text preference across API instances", () => {
      // Create first API instance and set text preference
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.text", "1");

      // Create second API instance
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Text preference should be persisted
      expect(api2.lmsGetValue("cmi.student_preference.text")).toBe("1");
    });

    it("should persist all four preference fields across API instances", () => {
      // Create first API instance and set all preferences
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");
      api1.lmsSetValue("cmi.student_preference.language", "fr");
      api1.lmsSetValue("cmi.student_preference.speed", "-50");
      api1.lmsSetValue("cmi.student_preference.text", "0");

      // Create second API instance
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // All preferences should be persisted
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("1");
      expect(api2.lmsGetValue("cmi.student_preference.language")).toBe("fr");
      expect(api2.lmsGetValue("cmi.student_preference.speed")).toBe("-50");
      expect(api2.lmsGetValue("cmi.student_preference.text")).toBe("0");
    });

    it("should update global preferences when values change", () => {
      // Create first API instance and set initial preferences
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.language", "en");

      // Create second API instance and update the preference
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();
      expect(api2.lmsGetValue("cmi.student_preference.language")).toBe("en");
      api2.lmsSetValue("cmi.student_preference.language", "es");

      // Create third API instance
      const api3 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api3.lmsInitialize();

      // The updated preference should be persisted
      expect(api3.lmsGetValue("cmi.student_preference.language")).toBe("es");
    });

    it("should work across multiple SCO instances simulating a real course", () => {
      // SCO 1 - Learner sets their preferences
      const sco1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      sco1.lmsInitialize();
      sco1.lmsSetValue("cmi.student_preference.audio", "1");
      sco1.lmsSetValue("cmi.student_preference.language", "en-GB");
      sco1.lmsSetValue("cmi.student_preference.speed", "100");
      sco1.lmsSetValue("cmi.student_preference.text", "1");
      sco1.lmsFinish();

      // SCO 2 - Preferences should carry over
      const sco2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      sco2.lmsInitialize();
      expect(sco2.lmsGetValue("cmi.student_preference.audio")).toBe("1");
      expect(sco2.lmsGetValue("cmi.student_preference.language")).toBe("en-GB");
      expect(sco2.lmsGetValue("cmi.student_preference.speed")).toBe("100");
      expect(sco2.lmsGetValue("cmi.student_preference.text")).toBe("1");
      sco2.lmsFinish();

      // SCO 3 - Preferences should still be available
      const sco3 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      sco3.lmsInitialize();
      expect(sco3.lmsGetValue("cmi.student_preference.audio")).toBe("1");
      expect(sco3.lmsGetValue("cmi.student_preference.language")).toBe("en-GB");
      expect(sco3.lmsGetValue("cmi.student_preference.speed")).toBe("100");
      expect(sco3.lmsGetValue("cmi.student_preference.text")).toBe("1");
      sco3.lmsFinish();
    });
  });

  describe("clearGlobalPreferences()", () => {
    it("should reset the global preference store", () => {
      // Create first API instance and set preferences
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");
      api1.lmsSetValue("cmi.student_preference.language", "en");

      // Clear global preferences
      Scorm12API.clearGlobalPreferences();

      // Create second API instance
      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Preferences should be cleared (default values)
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("");
      expect(api2.lmsGetValue("cmi.student_preference.language")).toBe("");
    });

    it("should allow setting new preferences after clearing", () => {
      // Create first API instance and set preferences
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.language", "en");

      // Clear and set new preferences
      Scorm12API.clearGlobalPreferences();

      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();
      api2.lmsSetValue("cmi.student_preference.language", "fr");

      // Create third API instance
      const api3 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api3.lmsInitialize();

      // New preference should be persisted
      expect(api3.lmsGetValue("cmi.student_preference.language")).toBe("fr");
    });
  });

  describe("backward compatibility", () => {
    it("should not interfere when globalStudentPreferences is undefined", () => {
      // Test that the feature doesn't break existing code
      const api1 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");

      const api2 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api2.lmsInitialize();

      // Should behave as if disabled
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("");
    });

    it("should handle mixed scenarios with some instances having global prefs enabled and others disabled", () => {
      // First API with global prefs enabled
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");

      // Second API with global prefs disabled
      const api2 = new Scorm12API({
        globalStudentPreferences: false,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Should not load from global storage
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("");

      // But setting a value shouldn't affect global storage
      api2.lmsSetValue("cmi.student_preference.audio", "0");

      // Third API with global prefs enabled should still see the original value
      const api3 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api3.lmsInitialize();
      expect(api3.lmsGetValue("cmi.student_preference.audio")).toBe("1");
    });
  });

  describe("edge cases", () => {
    it("should not update global preferences when setting invalid empty strings", () => {
      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.audio", "1");

      // Attempting to set empty string fails validation (for audio, speed, text fields)
      // This is caught by the setter, so global preference is not updated
      const result = api1.lmsSetValue("cmi.student_preference.audio", "");
      expect(result).toBe("false"); // Set operation fails

      // Local value remains "1" because set failed
      expect(api1.lmsGetValue("cmi.student_preference.audio")).toBe("1");

      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      // Global preference still has "1" because the empty string set failed
      expect(api2.lmsGetValue("cmi.student_preference.audio")).toBe("1");
    });

    it("should initialize global storage on first write if not already initialized", () => {
      // Ensure global storage is cleared
      Scorm12API.clearGlobalPreferences();

      const api1 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api1.lmsInitialize();
      api1.lmsSetValue("cmi.student_preference.language", "de");

      const api2 = new Scorm12API({
        globalStudentPreferences: true,
        logLevel: LogLevelEnum.NONE,
      });
      api2.lmsInitialize();

      expect(api2.lmsGetValue("cmi.student_preference.language")).toBe("de");
    });
  });
});
