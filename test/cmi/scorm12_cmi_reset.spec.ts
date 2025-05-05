import { describe, expect, it } from "vitest";
import { CMI } from "../../src/cmi/scorm12/cmi";

describe("SCORM 1.2 CMI Reset Tests", () => {
  describe("reset()", () => {
    it("should reset the initialized flag to false", () => {
      const cmi = new CMI();
      (cmi as any)._initialized = true;

      cmi.reset();

      expect((cmi as any)._initialized).toBe(false);
    });

    it("should clear launch_data and comments on reset", () => {
      const cmi = new CMI();

      // Use private property to set launch_data since it's read-only after initialization
      (cmi as any)._launch_data = "test launch data";
      cmi.comments = "test comments";

      cmi.reset();

      expect(cmi.launch_data).toBe("");
      expect(cmi.comments).toBe("");
    });

    it("should keep some core properties and reset others after reset", () => {
      const cmi = new CMI();

      // Set some values to non-default values
      cmi.core.lesson_status = "completed";
      cmi.core.score.raw = "90";
      // Note: entry gets reset

      cmi.reset();

      // These values are preserved after reset
      expect(cmi.core.lesson_status).toBe("completed");
      expect(cmi.core.score.raw).toBe("90");
      // entry is reset
      expect(cmi.core.entry).toBe("");
    });

    it("should keep student data and preferences after reset", () => {
      const cmi = new CMI();

      // Set some values to non-default values
      cmi.student_preference.audio = "1";
      cmi.student_data.mastery_score = "85";

      cmi.reset();

      // These values are preserved after reset
      expect(cmi.student_preference.audio).toBe("1");
      expect(cmi.student_data.mastery_score).toBe("85");
    });

    it("should not affect comments_from_lms", () => {
      const cmi = new CMI();

      (cmi as any)._comments_from_lms = "test comments from LMS";

      cmi.reset();

      expect(cmi.comments_from_lms).toBe("test comments from LMS");
    });

    it("should reset arrays to empty arrays but not null", () => {
      const cmi = new CMI();

      cmi.reset();

      expect(cmi.objectives.childArray).toBeDefined();
      expect(cmi.interactions.childArray).toBeDefined();
      expect(cmi.objectives.childArray.length).toBe(0);
      expect(cmi.interactions.childArray.length).toBe(0);
    });
  });
});
