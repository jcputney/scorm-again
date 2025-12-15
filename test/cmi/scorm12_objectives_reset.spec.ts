import { describe, expect, it } from "vitest";
import { CMIObjectivesObject } from "../../src/cmi/scorm12/objectives";

describe("SCORM 1.2 Objectives Reset Tests", () => {
  describe("CMIObjectivesObject reset method", () => {
    it("should reset all properties to their default values", () => {
      const objective = new CMIObjectivesObject();

      // Set some properties
      objective.id = "objective-1";
      objective.status = "completed";
      objective.score.raw = "85";
      objective.score.min = "0";
      objective.score.max = "100";

      // Verify properties are set
      expect(objective.id).toBe("objective-1");
      expect(objective.status).toBe("completed");
      expect(objective.score.raw).toBe("85");
      expect(objective.score.min).toBe("0");
      expect(objective.score.max).toBe("100");

      // Reset the objective
      objective.reset();

      // Verify properties are reset
      // For write-only properties, we need to check the JSON representation
      const resetJson = JSON.stringify(objective);
      expect(resetJson).toContain('"id":""');
      expect(resetJson).toContain('"status":""');

      // Score values should NOT be reset (intentional - preserves learner data)
      // See test/cmi/common/score_reset.spec.ts for detailed score reset behavior
      const scoreJson = JSON.stringify(objective.score);
      expect(scoreJson).toContain('"raw":"85"'); // Retained, not reset
      expect(scoreJson).toContain('"min":"0"'); // Retained, not reset
      expect(scoreJson).toContain('"max":"100"'); // Retained, not reset
    });
  });
});
