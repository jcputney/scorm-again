import { describe, expect, it } from "vitest";
import { CMIScore } from "../../../src/cmi/common/score";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";

describe("CMIScore Reset Tests", () => {
  describe("reset()", () => {
    it("should reset the initialized flag to false", () => {
      // Create a score object
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError
      });

      // Set initialized flag
      (score as any)._initialized = true;

      // Reset the score
      score.reset();

      // Check if initialized flag is reset
      expect((score as any)._initialized).toBe(false);
    });

    it("should reset raw and min to empty strings but preserve max default", () => {
      // SCORE-01: Base CMIScore.reset() should reset _raw and _min to match subclass behavior
      // Create a score object and set values
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError
      });

      // Set some values
      score.raw = "90";
      score.min = "0";
      score.max = "100";

      // Reset the score
      score.reset();

      // raw and min should be reset to empty strings
      expect(score.raw).toBe("");
      expect(score.min).toBe("");
      // max should preserve its value (has non-trivial default, handled by constructor/reinitialization)
      expect(score.max).toBe("100");
    });

    it("should be able to set values after reset", () => {
      // Create a score object
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError
      });

      // Set some initial values
      score.raw = "75";
      score.min = "0";
      score.max = "100";

      // Reset
      score.reset();

      // Set new values
      score.raw = "85";
      score.min = "10";
      score.max = "90";

      // Verify new values are set
      expect(score.raw).toBe("85");
      expect(score.min).toBe("10");
      expect(score.max).toBe("90");
    });

    it("should not affect the _children property", () => {
      // Create a score object with specific children
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        score_children: "raw,min,max",
        errorClass: Scorm12ValidationError
      });

      // Get _children before reset
      const childrenBefore = score._children;

      // Reset
      score.reset();

      // Check _children remains the same
      expect(score._children).toBe(childrenBefore);
      expect(score._children).toBe("raw,min,max");
    });

    it("should maintain validation rules after reset", () => {
      // Create a score object
      const score = new CMIScore({
        CMIElement: "cmi.core.score",
        errorClass: Scorm12ValidationError
      });

      // Reset
      score.reset();

      // Try setting invalid values
      let errorThrown = false;
      try {
        score.raw = "invalid";
      } catch (e) {
        errorThrown = true;
      }

      // Validation should still work
      expect(errorThrown).toBe(true);

      // Setting valid values should work
      score.raw = "95";
      expect(score.raw).toBe("95");
    });
  });
});
