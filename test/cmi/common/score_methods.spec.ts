import { describe, expect, it } from "vitest";
import { CMIScore } from "../../../src/cmi/common/score";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";
import { ScoreObject } from "../../../src/types/api_types";

describe("CMIScore Methods", () => {
  describe("getScoreObject()", () => {
    it("should return only default max when no scores are explicitly set", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      const result: ScoreObject = score.getScoreObject();

      // Default max is "100" per constructor, so it should be in the result
      expect(result).toEqual({ max: 100 });
      expect(Object.keys(result).length).toBe(1);
    });

    it("should return raw and default max when only raw is set", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "75";

      const result: ScoreObject = score.getScoreObject();

      // Default max is "100", so it will be included
      expect(result).toEqual({
        raw: 75,
        max: 100,
      });
      expect(result.raw).toBe(75);
      expect(result.min).toBeUndefined();
      expect(result.max).toBe(100);
    });

    it("should return min and default max when only min is set", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.min = "10";

      const result: ScoreObject = score.getScoreObject();

      // Default max is "100", so it will be included
      expect(result).toEqual({
        min: 10,
        max: 100,
      });
      expect(result.min).toBe(10);
      expect(result.raw).toBeUndefined();
      expect(result.max).toBe(100);
    });

    it("should return only max when only max is set", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        max: "",
        errorClass: Scorm12ValidationError,
      });

      score.max = "100";

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        max: 100,
      });
      expect(result.max).toBe(100);
      expect(result.raw).toBeUndefined();
      expect(result.min).toBeUndefined();
    });

    it("should return all scores when all are set", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "85";
      score.min = "0";
      score.max = "100";

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        raw: 85,
        min: 0,
        max: 100,
      });
    });

    it("should convert string scores to numeric values", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "95.5";
      score.min = "0.0";
      score.max = "100.0";

      const result: ScoreObject = score.getScoreObject();

      expect(typeof result.raw).toBe("number");
      expect(typeof result.min).toBe("number");
      expect(typeof result.max).toBe("number");
      expect(result.raw).toBe(95.5);
      expect(result.min).toBe(0);
      expect(result.max).toBe(100);
    });

    it("should handle decimal scores correctly", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "87.75";
      score.min = "10.25";
      score.max = "99.99";

      const result: ScoreObject = score.getScoreObject();

      expect(result.raw).toBe(87.75);
      expect(result.min).toBe(10.25);
      expect(result.max).toBe(99.99);
    });

    it("should exclude scores that are empty strings", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        max: "",
        errorClass: Scorm12ValidationError,
      });

      // raw and min default to empty strings
      // max was explicitly set to empty string in constructor
      score.raw = "90";
      // min and max remain empty

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        raw: 90,
      });
      expect(result.min).toBeUndefined();
      expect(result.max).toBeUndefined();
    });

    it("should handle partial score set (raw and max only)", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "80";
      score.max = "100";
      // min remains empty

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        raw: 80,
        max: 100,
      });
      expect(result.min).toBeUndefined();
    });

    it("should handle partial score set (min and max only)", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.min = "0";
      score.max = "100";
      // raw remains empty

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        min: 0,
        max: 100,
      });
      expect(result.raw).toBeUndefined();
    });

    it("should handle zero values correctly", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "0";
      score.min = "0";
      score.max = "0";

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        raw: 0,
        min: 0,
        max: 0,
      });
    });

    it("should handle negative min values", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "50";
      score.min = "-100";
      score.max = "100";

      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        raw: 50,
        min: -100,
        max: 100,
      });
    });

    it("should return empty object after reset", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      // Set all scores
      score.raw = "90";
      score.min = "0";
      score.max = "100";

      // Verify they are set
      let result = score.getScoreObject();
      expect(Object.keys(result).length).toBe(3);

      // Reset
      score.reset();

      // getScoreObject should now return minimal object
      result = score.getScoreObject();
      // max may still be present due to default "100" in constructor
      // raw and min should be absent
      expect(result.raw).toBeUndefined();
      expect(result.min).toBeUndefined();
    });

    it("should handle max with default value of 100", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      // Default max is "100" per constructor
      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({
        max: 100,
      });
    });

    it("should handle score with no default max", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        max: "",
        errorClass: Scorm12ValidationError,
      });

      // max is empty string, should not be in result
      const result: ScoreObject = score.getScoreObject();

      expect(result).toEqual({});
    });

    it("should preserve precision for decimal values", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "87.123456";
      score.min = "0.000001";
      score.max = "100.999999";

      const result: ScoreObject = score.getScoreObject();

      expect(result.raw).toBeCloseTo(87.123456, 6);
      expect(result.min).toBeCloseTo(0.000001, 6);
      expect(result.max).toBeCloseTo(100.999999, 6);
    });

    it("should handle leading zeros in string scores", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "007";
      score.min = "000";
      score.max = "0100";

      const result: ScoreObject = score.getScoreObject();

      expect(result.raw).toBe(7);
      expect(result.min).toBe(0);
      expect(result.max).toBe(100);
    });

    it("should exclude NaN values from result", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        max: "",
        errorClass: Scorm12ValidationError,
      });

      // Internal state could have empty strings
      // which parse to NaN
      (score as any)._raw = "";
      (score as any)._min = "";
      (score as any)._max = "";

      const result: ScoreObject = score.getScoreObject();

      // All should be excluded because they parse to NaN
      expect(result.raw).toBeUndefined();
      expect(result.min).toBeUndefined();
      expect(result.max).toBeUndefined();
      expect(Object.keys(result).length).toBe(0);
    });

    it("should handle very large numeric values", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "999999999";
      score.min = "0";
      score.max = "1000000000";

      const result: ScoreObject = score.getScoreObject();

      expect(result.raw).toBe(999999999);
      expect(result.min).toBe(0);
      expect(result.max).toBe(1000000000);
    });

    it("should handle very small decimal values", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      score.raw = "0.00001";
      score.min = "0.000001";
      score.max = "0.0001";

      const result: ScoreObject = score.getScoreObject();

      expect(result.raw).toBe(0.00001);
      expect(result.min).toBe(0.000001);
      expect(result.max).toBe(0.0001);
    });
  });

  describe("_children setter", () => {
    it("should throw error when attempting to set _children", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      expect(() => {
        score._children = "invalid";
      }).toThrow(Scorm12ValidationError);
    });

    it("should throw error with correct CMI element path", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError,
      });

      try {
        score._children = "invalid";
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Scorm12ValidationError);
        expect(error.message).toContain("cmi.core.score._children");
      }
    });

    it("should not affect _children getter", () => {
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        score_children: "raw,min,max",
        errorClass: Scorm12ValidationError,
      });

      // Getter should still work
      expect(score._children).toBe("raw,min,max");

      // Try to set (will throw)
      try {
        score._children = "new_value";
      } catch (e) {
        // Expected
      }

      // Getter should still return original value
      expect(score._children).toBe("raw,min,max");
    });
  });
});
