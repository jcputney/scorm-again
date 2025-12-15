import { describe, expect, it } from "vitest";
import { CMIThresholds } from "../../src/cmi/scorm2004/thresholds";
import { scorm2004_errors } from "../../src";
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

      it("should accept empty string (undefined value)", () => {
        const thresholds = new CMIThresholds();

        thresholds.scaled_passing_score = "";
        expect(thresholds.scaled_passing_score).toBe("");
      });

      it("should accept valid decimal values in range -1 to 1", () => {
        const thresholds = new CMIThresholds();

        thresholds.scaled_passing_score = "-1";
        expect(thresholds.scaled_passing_score).toBe("-1");

        const thresholds2 = new CMIThresholds();
        thresholds2.scaled_passing_score = "1";
        expect(thresholds2.scaled_passing_score).toBe("1");

        const thresholds3 = new CMIThresholds();
        thresholds3.scaled_passing_score = "0";
        expect(thresholds3.scaled_passing_score).toBe("0");

        const thresholds4 = new CMIThresholds();
        thresholds4.scaled_passing_score = "0.5";
        expect(thresholds4.scaled_passing_score).toBe("0.5");

        const thresholds5 = new CMIThresholds();
        thresholds5.scaled_passing_score = "-0.5";
        expect(thresholds5.scaled_passing_score).toBe("-0.5");
      });

      it("should reject invalid format (non-decimal)", () => {
        const thresholds = new CMIThresholds();

        expect(() => {
          thresholds.scaled_passing_score = "abc";
        }).toThrow(
          new Scorm2004ValidationError("cmi.scaled_passing_score", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          thresholds.scaled_passing_score = "0.5.5";
        }).toThrow(
          new Scorm2004ValidationError("cmi.scaled_passing_score", scorm2004_errors.TYPE_MISMATCH),
        );
      });

      it("should reject values outside range -1 to 1", () => {
        const thresholds = new CMIThresholds();

        expect(() => {
          thresholds.scaled_passing_score = "1.1";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.scaled_passing_score",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
          ),
        );

        expect(() => {
          thresholds.scaled_passing_score = "-1.1";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.scaled_passing_score",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
          ),
        );

        expect(() => {
          thresholds.scaled_passing_score = "2";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.scaled_passing_score",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
          ),
        );

        expect(() => {
          thresholds.scaled_passing_score = "-2";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.scaled_passing_score",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
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

      it("should accept empty string (undefined value)", () => {
        const thresholds = new CMIThresholds();

        thresholds.completion_threshold = "";
        expect(thresholds.completion_threshold).toBe("");
      });

      it("should accept valid decimal values in range 0 to 1", () => {
        const thresholds = new CMIThresholds();

        thresholds.completion_threshold = "0";
        expect(thresholds.completion_threshold).toBe("0");

        const thresholds2 = new CMIThresholds();
        thresholds2.completion_threshold = "1";
        expect(thresholds2.completion_threshold).toBe("1");

        const thresholds3 = new CMIThresholds();
        thresholds3.completion_threshold = "0.5";
        expect(thresholds3.completion_threshold).toBe("0.5");

        const thresholds4 = new CMIThresholds();
        thresholds4.completion_threshold = "0.9999999";
        expect(thresholds4.completion_threshold).toBe("0.9999999");
      });

      it("should reject invalid format (non-decimal)", () => {
        const thresholds = new CMIThresholds();

        expect(() => {
          thresholds.completion_threshold = "abc";
        }).toThrow(
          new Scorm2004ValidationError("cmi.completion_threshold", scorm2004_errors.TYPE_MISMATCH),
        );

        expect(() => {
          thresholds.completion_threshold = "0.5.5";
        }).toThrow(
          new Scorm2004ValidationError("cmi.completion_threshold", scorm2004_errors.TYPE_MISMATCH),
        );
      });

      it("should reject negative values", () => {
        const thresholds = new CMIThresholds();

        expect(() => {
          thresholds.completion_threshold = "-0.5";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.completion_threshold",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
          ),
        );

        expect(() => {
          thresholds.completion_threshold = "-1";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.completion_threshold",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
          ),
        );
      });

      it("should reject values greater than 1", () => {
        const thresholds = new CMIThresholds();

        expect(() => {
          thresholds.completion_threshold = "1.1";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.completion_threshold",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
          ),
        );

        expect(() => {
          thresholds.completion_threshold = "2";
        }).toThrow(
          new Scorm2004ValidationError(
            "cmi.completion_threshold",
            scorm2004_errors.VALUE_OUT_OF_RANGE,
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
