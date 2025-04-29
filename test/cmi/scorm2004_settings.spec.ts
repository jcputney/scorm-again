import { describe, it  , vi } from "vitest";
;
import { CMISettings } from "../../src/cmi/scorm2004/settings";
import { scorm2004_errors } from "../../src/constants/error_codes";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 CMISettings Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const settings = new CMISettings();

      expect(settings.credit).toBe("credit");
      expect(settings.mode).toBe("normal");
      expect(settings.time_limit_action).toBe("continue,no message");
      expect(settings.max_time_allowed).toBe("");
    });
  });

  describe("Property Tests", () => {
    describe("credit", () => {
      it("should set and get credit before initialization", () => {
        const settings = new CMISettings();

        settings.credit = "no-credit";
        expect(settings.credit).toBe("no-credit");
      });

      it("should reject modifications to credit after initialization", () => {
        const settings = new CMISettings();

        settings.credit = "no-credit";
        settings.initialize();

        expect(() => {
          settings.credit = "credit";
        }).toThrow(new Scorm2004ValidationError("cmi.credit", scorm2004_errors.READ_ONLY_ELEMENT));
      });
    });

    describe("mode", () => {
      it("should set and get mode before initialization", () => {
        const settings = new CMISettings();

        settings.mode = "browse";
        expect(settings.mode).toBe("browse");
      });

      it("should reject modifications to mode after initialization", () => {
        const settings = new CMISettings();

        settings.mode = "browse";
        settings.initialize();

        expect(() => {
          settings.mode = "normal";
        }).toThrow(new Scorm2004ValidationError("cmi.mode", scorm2004_errors.READ_ONLY_ELEMENT));
      });
    });

    describe("time_limit_action", () => {
      it("should set and get time_limit_action before initialization", () => {
        const settings = new CMISettings();

        settings.time_limit_action = "exit,message";
        expect(settings.time_limit_action).toBe("exit,message");
      });

      it("should reject modifications to time_limit_action after initialization", () => {
        const settings = new CMISettings();

        settings.time_limit_action = "exit,message";
        settings.initialize();

        expect(() => {
          settings.time_limit_action = "continue,no message";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });

    describe("max_time_allowed", () => {
      it("should set and get max_time_allowed before initialization", () => {
        const settings = new CMISettings();

        settings.max_time_allowed = "PT1H30M";
        expect(settings.max_time_allowed).toBe("PT1H30M");
      });

      it("should reject modifications to max_time_allowed after initialization", () => {
        const settings = new CMISettings();

        settings.max_time_allowed = "PT1H30M";
        settings.initialize();

        expect(() => {
          settings.max_time_allowed = "PT2H";
        }).toThrow(
          new Scorm2004ValidationError("cmi.max_time_allowed", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });
  });

  describe("Method Tests", () => {
    describe("reset", () => {
      it("should reset initialization flag but not properties", () => {
        const settings = new CMISettings();

        settings.credit = "no-credit";
        settings.mode = "browse";
        settings.time_limit_action = "exit,message";
        settings.max_time_allowed = "PT1H30M";
        settings.initialize();

        settings.reset();

        // Properties should not be reset as they are read-only after initialization
        expect(settings.credit).toBe("no-credit");
        expect(settings.mode).toBe("browse");
        expect(settings.time_limit_action).toBe("exit,message");
        expect(settings.max_time_allowed).toBe("PT1H30M");
        expect(settings.initialized).toBe(false);

        // After reset, we should be able to set the properties again
        settings.credit = "credit";
        expect(settings.credit).toBe("credit");
      });
    });
  });
});
