import { describe, expect, it } from "vitest";
import { CMISettings } from "../../src/cmi/scorm2004/settings";
import { scorm2004_errors } from "../../src";
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

      it("should accept valid credit value 'credit'", () => {
        const settings = new CMISettings();

        settings.credit = "credit";
        expect(settings.credit).toBe("credit");
      });

      it("should accept valid credit value 'no-credit'", () => {
        const settings = new CMISettings();

        settings.credit = "no-credit";
        expect(settings.credit).toBe("no-credit");
      });

      it("should reject invalid credit values", () => {
        const settings = new CMISettings();

        expect(() => {
          settings.credit = "invalid";
        }).toThrow(new Scorm2004ValidationError("cmi.credit", scorm2004_errors.TYPE_MISMATCH));

        expect(() => {
          settings.credit = "CREDIT";
        }).toThrow(new Scorm2004ValidationError("cmi.credit", scorm2004_errors.TYPE_MISMATCH));

        expect(() => {
          settings.credit = "";
        }).toThrow(new Scorm2004ValidationError("cmi.credit", scorm2004_errors.TYPE_MISMATCH));

        expect(() => {
          settings.credit = "no credit";
        }).toThrow(new Scorm2004ValidationError("cmi.credit", scorm2004_errors.TYPE_MISMATCH));
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

      it("should accept valid mode value 'browse'", () => {
        const settings = new CMISettings();

        settings.mode = "browse";
        expect(settings.mode).toBe("browse");
      });

      it("should accept valid mode value 'normal'", () => {
        const settings = new CMISettings();

        settings.mode = "normal";
        expect(settings.mode).toBe("normal");
      });

      it("should accept valid mode value 'review'", () => {
        const settings = new CMISettings();

        settings.mode = "review";
        expect(settings.mode).toBe("review");
      });

      it("should reject invalid mode values", () => {
        const settings = new CMISettings();

        expect(() => {
          settings.mode = "invalid";
        }).toThrow(new Scorm2004ValidationError("cmi.mode", scorm2004_errors.TYPE_MISMATCH));

        expect(() => {
          settings.mode = "NORMAL";
        }).toThrow(new Scorm2004ValidationError("cmi.mode", scorm2004_errors.TYPE_MISMATCH));

        expect(() => {
          settings.mode = "";
        }).toThrow(new Scorm2004ValidationError("cmi.mode", scorm2004_errors.TYPE_MISMATCH));

        expect(() => {
          settings.mode = "test";
        }).toThrow(new Scorm2004ValidationError("cmi.mode", scorm2004_errors.TYPE_MISMATCH));
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

      it("should accept valid time_limit_action value 'exit,message'", () => {
        const settings = new CMISettings();

        settings.time_limit_action = "exit,message";
        expect(settings.time_limit_action).toBe("exit,message");
      });

      it("should accept valid time_limit_action value 'exit,no message'", () => {
        const settings = new CMISettings();

        settings.time_limit_action = "exit,no message";
        expect(settings.time_limit_action).toBe("exit,no message");
      });

      it("should accept valid time_limit_action value 'continue,message'", () => {
        const settings = new CMISettings();

        settings.time_limit_action = "continue,message";
        expect(settings.time_limit_action).toBe("continue,message");
      });

      it("should accept valid time_limit_action value 'continue,no message'", () => {
        const settings = new CMISettings();

        settings.time_limit_action = "continue,no message";
        expect(settings.time_limit_action).toBe("continue,no message");
      });

      it("should reject invalid time_limit_action values", () => {
        const settings = new CMISettings();

        expect(() => {
          settings.time_limit_action = "invalid";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.time_limit_action = "exit";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.time_limit_action = "EXIT,MESSAGE";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.time_limit_action = "";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.time_limit_action = "continue message";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.time_limit_action = "exit,no_message";
        }).toThrow(
          new Scorm2004ValidationError("cmi.time_limit_action", scorm2004_errors.TYPE_MISMATCH),
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

      it("should accept empty string (undefined value)", () => {
        const settings = new CMISettings();

        settings.max_time_allowed = "";
        expect(settings.max_time_allowed).toBe("");
      });

      it("should accept valid ISO 8601 duration formats", () => {
        const settings = new CMISettings();

        settings.max_time_allowed = "PT1H30M";
        expect(settings.max_time_allowed).toBe("PT1H30M");

        const settings2 = new CMISettings();
        settings2.max_time_allowed = "PT2H";
        expect(settings2.max_time_allowed).toBe("PT2H");

        const settings3 = new CMISettings();
        settings3.max_time_allowed = "PT30M";
        expect(settings3.max_time_allowed).toBe("PT30M");

        const settings4 = new CMISettings();
        settings4.max_time_allowed = "PT45S";
        expect(settings4.max_time_allowed).toBe("PT45S");

        const settings5 = new CMISettings();
        settings5.max_time_allowed = "P1DT2H30M";
        expect(settings5.max_time_allowed).toBe("P1DT2H30M");

        const settings6 = new CMISettings();
        settings6.max_time_allowed = "P1Y2M3DT4H5M6S";
        expect(settings6.max_time_allowed).toBe("P1Y2M3DT4H5M6S");

        const settings7 = new CMISettings();
        settings7.max_time_allowed = "PT1H30M45.5S";
        expect(settings7.max_time_allowed).toBe("PT1H30M45.5S");
      });

      it("should reject invalid duration formats", () => {
        const settings = new CMISettings();

        expect(() => {
          settings.max_time_allowed = "1H30M";
        }).toThrow(
          new Scorm2004ValidationError("cmi.max_time_allowed", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.max_time_allowed = "PT90";
        }).toThrow(
          new Scorm2004ValidationError("cmi.max_time_allowed", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.max_time_allowed = "abc";
        }).toThrow(
          new Scorm2004ValidationError("cmi.max_time_allowed", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.max_time_allowed = "123";
        }).toThrow(
          new Scorm2004ValidationError("cmi.max_time_allowed", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          settings.max_time_allowed = "T1H30M";
        }).toThrow(
          new Scorm2004ValidationError("cmi.max_time_allowed", scorm2004_errors.TYPE_MISMATCH),
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
