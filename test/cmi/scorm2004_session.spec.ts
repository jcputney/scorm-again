import { describe, expect, it } from "vitest";
import { CMISession } from "../../src/cmi/scorm2004/session";
import { scorm2004_errors } from "../../src";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 CMISession Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const session = new CMISession();

      expect(session.entry).toBe("");
      // session_time is write-only, so we can't test it directly
      expect(session.total_time).toBe("");

      // exit is write-only, but we can test it by setting jsonString to true
      session.jsonString = true;
      expect(session.exit).toBe("");
      session.jsonString = false;
    });
  });

  describe("Property Tests", () => {
    describe("entry", () => {
      it("should set and get entry before initialization", () => {
        const session = new CMISession();

        session.entry = "ab-initio";
        expect(session.entry).toBe("ab-initio");
      });

      it("should reject modifications to entry after initialization", () => {
        const session = new CMISession();

        session.entry = "ab-initio";
        session.initialize();

        expect(() => {
          session.entry = "resume";
        }).toThrow(new Scorm2004ValidationError("cmi.entry", scorm2004_errors.READ_ONLY_ELEMENT));
      });
    });

    describe("exit", () => {
      it("should set exit", () => {
        const session = new CMISession();

        session.exit = "suspend";

        // exit is write-only, so we need to set jsonString to true to read it
        session.jsonString = true;
        expect(session.exit).toBe("suspend");
        session.jsonString = false;
      });

      it("should reject invalid exit values", () => {
        const session = new CMISession();

        expect(() => {
          session.exit = "invalid-exit";
        }).toThrow();
      });

      it("should reject reading exit without jsonString", () => {
        const session = new CMISession();

        session.exit = "suspend";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = session.exit;
        }).toThrow(new Scorm2004ValidationError("cmi.exit", scorm2004_errors.WRITE_ONLY_ELEMENT));
      });
    });

    describe("session_time", () => {
      it("should set session_time", () => {
        const session = new CMISession();

        session.session_time = "PT1H30M5S";

        // session_time is write-only, so we need to set jsonString to true to read it
        session.jsonString = true;
        expect(session.session_time).toBe("PT1H30M5S");
        session.jsonString = false;
      });

      it("should reject invalid session_time values", () => {
        const session = new CMISession();

        expect(() => {
          session.session_time = "invalid-time";
        }).toThrow();
      });

      it("should reject reading session_time without jsonString", () => {
        const session = new CMISession();

        session.session_time = "PT1H30M5S";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _sessionTime = session.session_time;
        }).toThrow(
          new Scorm2004ValidationError("cmi.session_time", scorm2004_errors.WRITE_ONLY_ELEMENT),
        );
      });
    });

    describe("total_time", () => {
      it("should set and get total_time before initialization", () => {
        const session = new CMISession();

        session.total_time = "PT2H45M10S";
        expect(session.total_time).toBe("PT2H45M10S");
      });

      it("should reject modifications to total_time after initialization", () => {
        const session = new CMISession();

        session.total_time = "PT2H45M10S";
        session.initialize();

        expect(() => {
          session.total_time = "PT3H";
        }).toThrow(
          new Scorm2004ValidationError("cmi.total_time", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });
  });

  describe("Method Tests", () => {
    describe("getCurrentTotalTime", () => {
      it("should add session_time to total_time", () => {
        const session = new CMISession();

        session.total_time = "PT1H";
        session.session_time = "PT30M";

        const totalTime = session.getCurrentTotalTime();

        // Should be 1 hour + 30 minutes = 1 hour 30 minutes
        // The exact format may vary (PT1H30M or PT1H30M0S), so we check that it contains the expected parts
        expect(totalTime).toContain("PT1H30M");
      });

      // We can't directly set start_time as it's a getter-only property
      // and is set internally when initialize() is called
      it("should use session_time when start_time is not set", () => {
        const session = new CMISession();

        session.total_time = "PT1H";
        session.session_time = "PT5S";

        const totalTime = session.getCurrentTotalTime();

        // Should be 1 hour + 5 seconds
        expect(totalTime).toContain("PT1H");
        expect(totalTime).toContain("5S");
      });
    });

    describe("reset", () => {
      it("should reset properties to default values", () => {
        const session = new CMISession();

        session.entry = "ab-initio";
        session.exit = "suspend";
        session.session_time = "PT1H30M5S";
        session.total_time = "PT2H45M10S";
        session.initialize();

        session.reset();

        // After reset, entry should be "ab-initio" for new attempts per SCORM 2004 spec
        expect(session.entry).toBe("ab-initio");

        // Check exit and session_time by setting jsonString to true
        session.jsonString = true;
        expect(session.exit).toBe("");
        expect(session.session_time).toBe("PT0H0M0S");
        session.jsonString = false;

        // total_time should not be reset as it's read-only after initialization
        expect(session.total_time).toBe("PT2H45M10S");
        expect(session.initialized).toBe(false);
      });
    });
  });
});
