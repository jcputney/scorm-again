import { describe, it, expect } from "vitest";
import {
  parseScormTime,
  formatScormTime,
  addScormTime,
  compareScormTime,
  hasExceededTimeLimit,
  formatHumanReadable,
  scormTimeToHumanReadable,
} from "../../../src/utilities/scorm12-lms-helpers/time_utilities";

describe("SCORM 1.2 Time Utilities", () => {
  describe("parseScormTime", () => {
    it("should parse standard SCORM time format", () => {
      expect(parseScormTime("0001:30:45.50")).toBe(5445.5);
    });

    it("should parse time with leading zeros", () => {
      expect(parseScormTime("0000:00:30.00")).toBe(30);
    });

    it("should parse time with hours > 99", () => {
      expect(parseScormTime("0100:00:00.00")).toBe(360000);
    });

    it("should handle empty string", () => {
      expect(parseScormTime("")).toBe(0);
    });

    it("should handle short format HH:MM:SS", () => {
      expect(parseScormTime("01:30:45")).toBe(5445);
    });

    it("should handle minutes and seconds only", () => {
      expect(parseScormTime("30:45")).toBe(1845);
    });

    it("should handle decimal seconds", () => {
      expect(parseScormTime("0000:00:45.75")).toBe(45.75);
    });
  });

  describe("formatScormTime", () => {
    it("should format seconds to SCORM time", () => {
      expect(formatScormTime(5445.5)).toBe("0001:30:45.50");
    });

    it("should format zero correctly", () => {
      expect(formatScormTime(0)).toBe("0000:00:00.00");
    });

    it("should format negative as zero", () => {
      expect(formatScormTime(-100)).toBe("0000:00:00.00");
    });

    it("should handle large hour values", () => {
      expect(formatScormTime(360000)).toBe("0100:00:00.00");
    });

    it("should preserve decimal precision", () => {
      expect(formatScormTime(45.75)).toBe("0000:00:45.75");
    });
  });

  describe("addScormTime", () => {
    it("should add two SCORM times", () => {
      const result = addScormTime("0001:00:00.00", "0000:30:00.00");
      expect(result).toBe("0001:30:00.00");
    });

    it("should handle zero addition", () => {
      const result = addScormTime("0001:00:00.00", "0000:00:00.00");
      expect(result).toBe("0001:00:00.00");
    });

    it("should handle decimal seconds", () => {
      const result = addScormTime("0000:00:30.50", "0000:00:29.50");
      expect(result).toBe("0000:01:00.00");
    });

    it("should handle rollover correctly", () => {
      const result = addScormTime("0000:59:59.00", "0000:00:02.00");
      expect(result).toBe("0001:00:01.00");
    });
  });

  describe("compareScormTime", () => {
    it("should return negative when first is smaller", () => {
      expect(compareScormTime("0000:30:00.00", "0001:00:00.00")).toBeLessThan(0);
    });

    it("should return positive when first is larger", () => {
      expect(compareScormTime("0001:00:00.00", "0000:30:00.00")).toBeGreaterThan(
        0,
      );
    });

    it("should return zero when equal", () => {
      expect(compareScormTime("0001:00:00.00", "0001:00:00.00")).toBe(0);
    });
  });

  describe("hasExceededTimeLimit", () => {
    it("should return true when current exceeds max", () => {
      expect(hasExceededTimeLimit("0001:30:00.00", "0001:00:00.00")).toBe(true);
    });

    it("should return true when current equals max", () => {
      expect(hasExceededTimeLimit("0001:00:00.00", "0001:00:00.00")).toBe(true);
    });

    it("should return false when current is less than max", () => {
      expect(hasExceededTimeLimit("0000:30:00.00", "0001:00:00.00")).toBe(false);
    });
  });

  describe("formatHumanReadable", () => {
    it("should format hours, minutes, seconds", () => {
      expect(formatHumanReadable(5445)).toBe("1h 30m 45s");
    });

    it("should omit zero hours", () => {
      expect(formatHumanReadable(1845)).toBe("30m 45s");
    });

    it("should omit zero minutes when only seconds", () => {
      expect(formatHumanReadable(45)).toBe("45s");
    });

    it("should show 0s for zero time", () => {
      expect(formatHumanReadable(0)).toBe("0s");
    });

    it("should handle hours only", () => {
      expect(formatHumanReadable(3600)).toBe("1h");
    });

    it("should handle negative as 0s", () => {
      expect(formatHumanReadable(-100)).toBe("0s");
    });
  });

  describe("scormTimeToHumanReadable", () => {
    it("should convert SCORM time to human readable", () => {
      expect(scormTimeToHumanReadable("0001:30:45.00")).toBe("1h 30m 45s");
    });

    it("should handle empty string", () => {
      expect(scormTimeToHumanReadable("")).toBe("0s");
    });
  });
});
