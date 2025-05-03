import { describe, expect, it } from "vitest";
import { CMILearner } from "../../src/cmi/scorm2004/learner";
import { scorm2004_errors } from "../../src";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 CMILearner Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const learner = new CMILearner();

      expect(learner.learner_id).toBe("");
      expect(learner.learner_name).toBe("");
    });
  });

  describe("Property Tests", () => {
    describe("learner_id", () => {
      it("should set and get learner_id before initialization", () => {
        const learner = new CMILearner();

        learner.learner_id = "student123";
        expect(learner.learner_id).toBe("student123");
      });

      it("should reject modifications to learner_id after initialization", () => {
        const learner = new CMILearner();

        learner.learner_id = "student123";
        learner.initialize();

        expect(() => {
          learner.learner_id = "student456";
        }).toThrow(
          new Scorm2004ValidationError("cmi.learner_id", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });

    describe("learner_name", () => {
      it("should set and get learner_name before initialization", () => {
        const learner = new CMILearner();

        learner.learner_name = "John Doe";
        expect(learner.learner_name).toBe("John Doe");
      });

      it("should reject modifications to learner_name after initialization", () => {
        const learner = new CMILearner();

        learner.learner_name = "John Doe";
        learner.initialize();

        expect(() => {
          learner.learner_name = "Jane Doe";
        }).toThrow(
          new Scorm2004ValidationError("cmi.learner_name", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });
  });

  describe("Method Tests", () => {
    describe("reset", () => {
      it("should reset initialization flag but not properties", () => {
        const learner = new CMILearner();

        learner.learner_id = "student123";
        learner.learner_name = "John Doe";
        learner.initialize();

        learner.reset();

        // Properties should not be reset as they are read-only after initialization
        expect(learner.learner_id).toBe("student123");
        expect(learner.learner_name).toBe("John Doe");
        expect(learner.initialized).toBe(false);

        // After reset, we should be able to set the properties again
        learner.learner_id = "student456";
        expect(learner.learner_id).toBe("student456");
      });
    });
  });
});
