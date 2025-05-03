import { describe, expect, it } from "vitest";
import { Scorm2004CMIScore } from "../../src/cmi/scorm2004/score";
import { scorm2004_constants } from "../../src";

describe("SCORM 2004 CMIScore Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const score = new Scorm2004CMIScore();

      expect(score.scaled).toBe("");
      expect(score.raw).toBe("");
      expect(score.min).toBe("");
      expect(score.max).toBe("");
    });

    it("should have read-only _children property", () => {
      const score = new Scorm2004CMIScore();

      expect(score["_children"]).toBe(scorm2004_constants.score_children);

      expect(() => {
        // eslint-disable-next-line
        // @ts-ignore - Testing invalid assignment
        score["_children"] = "invalid";
      }).toThrow();
    });
  });

  describe("Reset Tests", () => {
    it("should reset to default values", () => {
      const score = new Scorm2004CMIScore();

      // Set non-default values
      score.scaled = "0.5";
      score.raw = "50";
      score.min = "0";
      score.max = "100";

      // Reset
      score.reset();

      // Values should be reset to defaults
      expect(score.scaled).toBe("");
      expect(score.raw).toBe("");
      expect(score.min).toBe("");
      expect(score.max).toBe("");
    });
  });

  describe("Property Tests", () => {
    describe("scaled", () => {
      it("should set and get scaled", () => {
        const score = new Scorm2004CMIScore();

        score.scaled = "0.5";
        expect(score.scaled).toBe("0.5");

        score.scaled = "-1";
        expect(score.scaled).toBe("-1");

        score.scaled = "1";
        expect(score.scaled).toBe("1");

        score.scaled = "0";
        expect(score.scaled).toBe("0");
      });

      it("should reject invalid scaled values", () => {
        const score = new Scorm2004CMIScore();

        // Invalid format
        expect(() => {
          score.scaled = "invalid";
        }).toThrow();

        // Out of range
        expect(() => {
          score.scaled = "-1.1";
        }).toThrow();

        expect(() => {
          score.scaled = "1.1";
        }).toThrow();
      });
    });

    describe("raw", () => {
      it("should set and get raw", () => {
        const score = new Scorm2004CMIScore();

        score.raw = "50";
        expect(score.raw).toBe("50");

        score.raw = "0";
        expect(score.raw).toBe("0");

        score.raw = "100";
        expect(score.raw).toBe("100");

        score.raw = "75.5";
        expect(score.raw).toBe("75.5");
      });

      it("should reject invalid raw values", () => {
        const score = new Scorm2004CMIScore();

        // Invalid format
        expect(() => {
          score.raw = "invalid";
        }).toThrow();
      });
    });

    describe("min", () => {
      it("should set and get min", () => {
        const score = new Scorm2004CMIScore();

        score.min = "0";
        expect(score.min).toBe("0");

        score.min = "-50";
        expect(score.min).toBe("-50");

        score.min = "10.5";
        expect(score.min).toBe("10.5");
      });

      it("should reject invalid min values", () => {
        const score = new Scorm2004CMIScore();

        // Invalid format
        expect(() => {
          score.min = "invalid";
        }).toThrow();
      });
    });

    describe("max", () => {
      it("should set and get max", () => {
        const score = new Scorm2004CMIScore();

        score.max = "100";
        expect(score.max).toBe("100");

        score.max = "50";
        expect(score.max).toBe("50");

        score.max = "200.5";
        expect(score.max).toBe("200.5");
      });

      it("should reject invalid max values", () => {
        const score = new Scorm2004CMIScore();

        // Invalid format
        expect(() => {
          score.max = "invalid";
        }).toThrow();
      });
    });
  });

  describe("JSON Serialization", () => {
    it("should serialize to JSON correctly", () => {
      const score = new Scorm2004CMIScore();

      // Set non-default values
      score.scaled = "0.5";
      score.raw = "50";
      score.min = "0";
      score.max = "100";

      const json = JSON.stringify(score);
      const parsed = JSON.parse(json);

      expect(parsed.scaled).toBe("0.5");
      expect(parsed.raw).toBe("50");
      expect(parsed.min).toBe("0");
      expect(parsed.max).toBe("100");
    });
  });
});
