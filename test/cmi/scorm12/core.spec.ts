import { beforeEach, describe, expect, it, vi } from "vitest";
import { CMICore } from "../../../src/cmi/scorm12/core";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../../src/constants/error_codes";

describe("SCORM 1.2 Core Tests", () => {
  describe("exit property", () => {
    let core: CMICore;

    beforeEach(() => {
      core = new CMICore();
      core.initialize();
    });

    it("should normalize 'normal' exit value to empty string and log console warning", () => {
      // Spy on console.warn to verify warning is logged
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      });

      // Set exit to 'normal'
      core.exit = "normal";

      // Verify console.warn was called with the expected message
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "SCORM 1.2: Received non-standard value 'normal' for cmi.core.exit; normalizing to empty string."
      );

      // Verify the value was normalized to empty string
      const json = core.toJSON();
      expect(json.exit).toBe("");

      // Clean up spy
      consoleWarnSpy.mockRestore();
    });

    it("should accept standard exit values without normalization", () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {
      });

      // Test all valid SCORM 1.2 exit values
      const validExitValues = ["", "time-out", "suspend", "logout"];

      validExitValues.forEach((exitValue) => {
        core.exit = exitValue;
        const json = core.toJSON();
        expect(json.exit).toBe(exitValue);
      });

      // Verify console.warn was NOT called for valid values
      expect(consoleWarnSpy).not.toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it("should throw error when reading exit directly (write-only)", () => {
      core.exit = "suspend";

      expect(() => {
        // noinspection JSUnusedLocalSymbols
        const _ = core.exit;
      }).toThrow(
        new Scorm12ValidationError("cmi.core.exit", scorm12_errors.WRITE_ONLY_ELEMENT as number)
      );
    });

    it("should allow reading exit during JSON serialization", () => {
      core.exit = "logout";

      const json = core.toJSON();
      expect(json.exit).toBe("logout");
    });
  });

  describe("getCurrentTotalTime()", () => {
    let core: CMICore;

    beforeEach(() => {
      core = new CMICore();
      core.initialize();
    });

    it("should handle undefined start_time by using session_time only (with total_time)", () => {
      // Set session_time before calling getCurrentTotalTime
      core.session_time = "00:05:30";

      // Set total_time before initialization
      core.reset();
      (core as any)._total_time = "01:00:00";
      core.initialize();
      core.session_time = "00:05:30";

      // Call getCurrentTotalTime with undefined start_time
      const result = core.getCurrentTotalTime(undefined);

      // Should add total_time + session_time
      // 01:00:00 + 00:05:30 = 01:05:30
      expect(result).toBe("01:05:30");
    });

    it("should handle undefined start_time by using session_time only", () => {
      // Set session_time
      core.session_time = "00:10:00";

      // Set total_time
      core.reset();
      (core as any)._total_time = "00:30:00";
      core.initialize();
      core.session_time = "00:10:00";

      // Call getCurrentTotalTime with undefined start_time
      const result = core.getCurrentTotalTime(undefined);

      // Should add total_time + session_time
      // 00:30:00 + 00:10:00 = 00:40:00
      expect(result).toBe("00:40:00");
    });

    it("should calculate current time when start_time is provided", () => {
      // Set total_time
      core.reset();
      (core as any)._total_time = "00:15:00";
      core.initialize();

      // Create a start_time 10 seconds ago
      const startTime = new Date().getTime() - 10000; // 10 seconds ago

      const result = core.getCurrentTotalTime(startTime);

      // Result should be approximately 00:15:10 (total_time + ~10 seconds)
      // We'll check if it starts with 00:15: and is close to 10 seconds
      expect(result).toMatch(/^00:15:(0[89]|1[0-2])$/);
    });

    it("should handle zero total_time with undefined start_time", () => {
      // Default total_time is empty string
      core.session_time = "00:02:00";

      const result = core.getCurrentTotalTime(undefined);

      // Should just be session_time since total_time is empty
      expect(result).toBe("00:02:00");
    });
  });

  describe("session_time property", () => {
    let core: CMICore;

    beforeEach(() => {
      core = new CMICore();
      core.initialize();
    });

    it("should normalize session_time to HH:MM:SS format", () => {
      // Set various timespan formats
      core.session_time = "0000:05:30.00";

      const json = core.toJSON();
      expect(json.session_time).toBe("00:05:30");
    });

    it("should handle large hour values", () => {
      core.session_time = "1234:56:78";

      const json = core.toJSON();
      // 1234:56:78 = 1234*3600 + 56*60 + 78 = 4445838 seconds
      // 78 seconds overflow: 78 / 60 = 1 minute, 18 seconds remaining
      // So 1234:56:78 becomes 1234:57:18
      expect(json.session_time).toBe("1234:57:18");
    });

    it("should throw error when reading session_time directly (write-only)", () => {
      core.session_time = "00:05:00";

      expect(() => {
        // noinspection JSUnusedLocalSymbols
        const _ = core.session_time;
      }).toThrow(
        new Scorm12ValidationError(
          "cmi.core.session_time",
          scorm12_errors.WRITE_ONLY_ELEMENT as number
        )
      );
    });
  });

  describe("reset()", () => {
    it("should reset exit and entry to empty strings", () => {
      const core = new CMICore();
      core.initialize();

      // Set values before initialization for entry
      core.reset();
      (core as any)._entry = "resume";
      core.initialize();
      core.exit = "suspend";

      const jsonBefore = core.toJSON();
      expect(jsonBefore.exit).toBe("suspend");
      expect(jsonBefore.entry).toBe("resume");

      // Reset
      core.reset();
      core.initialize();

      const jsonAfter = core.toJSON();
      expect(jsonAfter.exit).toBe("");
      expect(jsonAfter.entry).toBe("");
    });

    it("should reset session_time to 00:00:00", () => {
      const core = new CMICore();
      core.initialize();

      core.session_time = "01:30:45";
      const jsonBefore = core.toJSON();
      expect(jsonBefore.session_time).toBe("01:30:45");

      core.reset();
      core.initialize();

      const jsonAfter = core.toJSON();
      expect(jsonAfter.session_time).toBe("00:00:00");
    });

    it("should call score.reset()", () => {
      const core = new CMICore();
      core.initialize();

      // Set score values
      core.score.raw = "85";
      core.score.max = "100";
      core.score.min = "0";

      // Reset
      core.reset();
      core.initialize();

      // Score should be reset
      expect(core.score.raw).toBe("");
      expect(core.score.min).toBe("");
    });
  });
});
