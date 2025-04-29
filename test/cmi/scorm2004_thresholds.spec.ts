import { describe, it  , vi } from "vitest";
;
import { CMIThresholds } from "../../src/cmi/scorm2004/thresholds";
import { scorm2004_errors } from "../../src/constants/error_codes";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 CMIThresholds Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const thresholds = new CMIThresholds();

      expect(thresholds.scaled_passing_score).toBe("");
      expect(thresholds.completion_threshold).toBe("");
    });
  });

  describe("Property Tests", () => {
    describe("scaled_passing_score", () => {
      it("should set and get scaled_passing_score before initialization", () => {
        const thresholds = new CMIThresholds();

        thresholds.scaled_passing_score = "0.75";
        expect(thresholds.scaled_passing_score).toBe("0.75");
      });

      it("should reject modifications to scaled_passing_score after initialization", () => {
        const thresholds = new CMIThresholds();

        thresholds.scaled_passing_score = "0.75";
        thresholds.initialize();

        expect(() => {
          thresholds.scaled_passing_score = "0.8";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.scaled_passing_score",
            scorm2004_errors.READ_ONLY_ELEMENT,
          ),
        );
      });
    });

    describe("completion_threshold", () => {
      it("should set and get completion_threshold before initialization", () => {
        const thresholds = new CMIThresholds();

        thresholds.completion_threshold = "0.9";
        expect(thresholds.completion_threshold).toBe("0.9");
      });

      it("should reject modifications to completion_threshold after initialization", () => {
        const thresholds = new CMIThresholds();

        thresholds.completion_threshold = "0.9";
        thresholds.initialize();

        expect(() => {
          thresholds.completion_threshold = "1.0";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.completion_threshold",
            scorm2004_errors.READ_ONLY_ELEMENT,
          ),
        );
      });
    });
  });

  describe("Method Tests", () => {
    describe("reset", () => {
      it("should reset initialization flag but not properties", () => {
        const thresholds = new CMIThresholds();

        thresholds.scaled_passing_score = "0.75";
        thresholds.completion_threshold = "0.9";
        thresholds.initialize();

        thresholds.reset();

        // Properties should not be reset as they are read-only after initialization
        expect(thresholds.scaled_passing_score).toBe("0.75");
        expect(thresholds.completion_threshold).toBe("0.9");
        expect(thresholds.initialized).toBe(false);

        // After reset, we should be able to set the properties again
        thresholds.scaled_passing_score = "0.8";
        expect(thresholds.scaled_passing_score).toBe("0.8");
      });
    });
  });
});
