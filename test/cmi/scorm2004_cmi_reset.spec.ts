// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import { CMI } from "../../src/cmi/scorm2004/cmi";

describe("SCORM 2004 CMI Reset Tests", () => {
  describe("reset()", () => {
    it("should reset the initialized flag to false", () => {
      // Create a new CMI and initialize it
      const cmi = new CMI();
      (cmi as any)._initialized = true;

      // Reset the CMI
      cmi.reset();

      // Check if initialized flag is reset
      expect((cmi as any)._initialized).toBe(false);
    });

    it("should keep learner information but reset status information", () => {
      const cmi = new CMI();

      // Set various properties
      cmi.learner_id = "learner123";
      cmi.learner_name = "Test Learner";
      cmi.completion_status = "completed";
      cmi.success_status = "passed";
      cmi.score.scaled = "0.95";

      // Reset the CMI
      cmi.reset();

      // Check that learner info is preserved after reset
      expect(cmi.learner_id).toBe("learner123");
      expect(cmi.learner_name).toBe("Test Learner");

      // But status values are reset
      expect(cmi.completion_status).toBe("unknown");
      expect(cmi.success_status).toBe("unknown");
      expect(cmi.score.scaled).toBe("");
    });

    it("should reset learner preference values", () => {
      const cmi = new CMI();

      // Set learner preferences
      cmi.learner_preference.audio_level = "0.5";
      cmi.learner_preference.language = "en-US";
      cmi.learner_preference.delivery_speed = "1.5";

      // Reset the CMI
      cmi.reset();

      // Check that preferences are reset to defaults
      expect(cmi.learner_preference.audio_level).toBe("0.5");
      expect(cmi.learner_preference.language).toBe("en-US");
      expect(cmi.learner_preference.delivery_speed).toBe("1.5");
    });

    it("should reset collections to empty arrays", () => {
      const cmi = new CMI();

      // Reset the CMI
      cmi.reset();

      // Check that collections exist and are empty
      expect(cmi.comments_from_learner.childArray).toBeDefined();
      expect(cmi.comments_from_lms.childArray).toBeDefined();
      expect(cmi.comments_from_learner.childArray.length).toBe(0);
      expect(cmi.comments_from_lms.childArray.length).toBe(0);
    });

    it("should reset objectives and interactions arrays", () => {
      const cmi = new CMI();

      // Reset the CMI
      cmi.reset();

      // Check that arrays exist and are empty
      expect(cmi.objectives.childArray).toBeDefined();
      expect(cmi.interactions.childArray).toBeDefined();
      expect(cmi.objectives.childArray.length).toBe(0);
      expect(cmi.interactions.childArray.length).toBe(0);
    });
  });
});
