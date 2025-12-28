import { describe, expect, it } from "vitest";

import { CMIObjectives, CMIObjectivesObject } from "../../../src/cmi/scorm2004/objectives";
import { Scorm2004ValidationError } from "../../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 Objectives Classes", () => {
  describe("CMIObjectives", () => {
    it("should initialize as a CMI array", () => {
      const objectives = new CMIObjectives();
      expect(objectives.childArray).toEqual([]);
    });

    it("should find objective by ID", () => {
      const objectives = new CMIObjectives();
      const obj1 = new CMIObjectivesObject();
      const obj2 = new CMIObjectivesObject();

      obj1.id = "objective_1";
      obj2.id = "objective_2";

      objectives.childArray.push(obj1, obj2);

      const found = objectives.findObjectiveById("objective_2");
      expect(found).toBe(obj2);
      expect(found?.id).toBe("objective_2");
    });

    it("should return undefined when objective ID not found", () => {
      const objectives = new CMIObjectives();
      const found = objectives.findObjectiveById("nonexistent");
      expect(found).toBeUndefined();
    });

    it("should find objective by index", () => {
      const objectives = new CMIObjectives();
      const obj1 = new CMIObjectivesObject();
      const obj2 = new CMIObjectivesObject();

      obj1.id = "objective_1";
      obj2.id = "objective_2";

      objectives.childArray.push(obj1, obj2);

      const found = objectives.findObjectiveByIndex(1);
      expect(found).toBe(obj2);
      expect(found.id).toBe("objective_2");
    });

    it("should set objective by index", () => {
      const objectives = new CMIObjectives();
      const obj1 = new CMIObjectivesObject();
      const obj2 = new CMIObjectivesObject();

      obj1.id = "objective_1";
      obj2.id = "objective_2";

      objectives.childArray.push(obj1);
      objectives.setObjectiveByIndex(0, obj2);

      expect(objectives.findObjectiveByIndex(0)).toBe(obj2);
      expect(objectives.findObjectiveByIndex(0).id).toBe("objective_2");
    });
  });

  describe("CMIObjectivesObject", () => {
    describe("initialization", () => {
      it("should initialize with default values", () => {
        const objective = new CMIObjectivesObject();

        expect(objective.id).toBe("");
        expect(objective.success_status).toBe("unknown");
        expect(objective.completion_status).toBe("unknown");
        expect(objective.progress_measure).toBe("");
        expect(objective.description).toBe("");
        expect(objective.score).toBeDefined();
      });

      it("should initialize child score object when initialize is called", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();

        expect(objective.initialized).toBe(true);
        expect(objective.score.initialized).toBe(true);
      });
    });

    describe("reset()", () => {
      it("should reset all properties to default values", () => {
        const objective = new CMIObjectivesObject();

        // Set all properties to non-default values
        objective.initialize();
        objective.id = "test_objective_123";
        objective.success_status = "passed";
        objective.completion_status = "completed";
        objective.progress_measure = "0.75";
        objective.description = "Test description";
        objective.score.scaled = "0.85";
        objective.score.raw = "85";
        objective.score.min = "0";
        objective.score.max = "100";

        // Verify values are set
        expect(objective.id).toBe("test_objective_123");
        expect(objective.success_status).toBe("passed");
        expect(objective.completion_status).toBe("completed");
        expect(objective.progress_measure).toBe("0.75");
        expect(objective.description).toBe("Test description");
        expect(objective.score.scaled).toBe("0.85");
        expect(objective.score.raw).toBe("85");
        expect(objective.score.min).toBe("0");
        expect(objective.score.max).toBe("100");

        // Reset the objective
        objective.reset();

        // Verify all properties are reset to defaults
        expect(objective.initialized).toBe(false);
        expect(objective.id).toBe("");
        expect(objective.success_status).toBe("unknown");
        expect(objective.completion_status).toBe("unknown");
        expect(objective.progress_measure).toBe("");
        expect(objective.description).toBe("");
        expect(objective.score.initialized).toBe(false);
        expect(objective.score.scaled).toBe("");
        expect(objective.score.raw).toBe("");
        expect(objective.score.min).toBe("");
        expect(objective.score.max).toBe("");
      });

      it("should reset _idIsSet flag", () => {
        const objective = new CMIObjectivesObject();

        // Set the ID
        objective.id = "test_id";

        // Try to change it - should throw error
        expect(() => {
          objective.id = "different_id";
        }).toThrow(Scorm2004ValidationError);

        // Reset the objective
        objective.reset();

        // Now should be able to set a new ID
        expect(() => {
          objective.id = "new_id_after_reset";
        }).not.toThrow();

        expect(objective.id).toBe("new_id_after_reset");
      });

      it("should reset score object", () => {
        const objective = new CMIObjectivesObject();

        // Set score values
        objective.initialize();
        objective.id = "test_obj";
        objective.score.scaled = "0.9";
        objective.score.raw = "90";
        objective.score.min = "0";
        objective.score.max = "100";

        // Reset
        objective.reset();

        // Verify score is reset
        expect(objective.score.scaled).toBe("");
        expect(objective.score.raw).toBe("");
        expect(objective.score.min).toBe("");
        expect(objective.score.max).toBe("");
      });
    });

    describe("id property", () => {
      it("should set valid id", () => {
        const objective = new CMIObjectivesObject();
        objective.id = "valid_objective_id";
        expect(objective.id).toBe("valid_objective_id");
      });

      it("should reject empty string id", () => {
        const objective = new CMIObjectivesObject();

        expect(() => {
          objective.id = "";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should reject whitespace-only id", () => {
        const objective = new CMIObjectivesObject();

        expect(() => {
          objective.id = "   ";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should reject changing id once set", () => {
        const objective = new CMIObjectivesObject();
        objective.id = "first_id";

        expect(() => {
          objective.id = "second_id";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should allow setting same id multiple times", () => {
        const objective = new CMIObjectivesObject();
        objective.id = "same_id";

        expect(() => {
          objective.id = "same_id";
        }).not.toThrow();

        expect(objective.id).toBe("same_id");
      });
    });

    describe("success_status property", () => {
      it("should set valid success_status when id is set", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();
        objective.id = "test_id";
        objective.success_status = "passed";

        expect(objective.success_status).toBe("passed");
      });

      it("should throw error when setting success_status without id", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();

        expect(() => {
          objective.success_status = "passed";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should allow setting success_status before initialization", () => {
        const objective = new CMIObjectivesObject();
        objective.success_status = "passed";

        expect(objective.success_status).toBe("passed");
      });
    });

    describe("completion_status property", () => {
      it("should set valid completion_status when id is set", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();
        objective.id = "test_id";
        objective.completion_status = "completed";

        expect(objective.completion_status).toBe("completed");
      });

      it("should throw error when setting completion_status without id", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();

        expect(() => {
          objective.completion_status = "completed";
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("progress_measure property", () => {
      it("should set valid progress_measure when id is set", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();
        objective.id = "test_id";
        objective.progress_measure = "0.5";

        expect(objective.progress_measure).toBe("0.5");
      });

      it("should throw error when setting progress_measure without id", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();

        expect(() => {
          objective.progress_measure = "0.5";
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("description property", () => {
      it("should set valid description when id is set", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();
        objective.id = "test_id";
        objective.description = "Test objective description";

        expect(objective.description).toBe("Test objective description");
      });

      it("should throw error when setting description without id", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();

        expect(() => {
          objective.description = "Test description";
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("toJSON()", () => {
      it("should return all properties in JSON format", () => {
        const objective = new CMIObjectivesObject();
        objective.initialize();
        objective.id = "test_id";
        objective.success_status = "passed";
        objective.completion_status = "completed";
        objective.progress_measure = "0.8";
        objective.description = "Test description";
        objective.score.scaled = "0.9";
        objective.score.raw = "90";

        const json = objective.toJSON();

        expect(json).toEqual({
          id: "test_id",
          success_status: "passed",
          completion_status: "completed",
          progress_measure: "0.8",
          description: "Test description",
          score: objective.score
        });
      });
    });

    describe("fromJSON()", () => {
      it("should populate objective from JSON data", () => {
        const objective = new CMIObjectivesObject();
        const data = {
          id: "json_id",
          success_status: "failed",
          completion_status: "incomplete",
          progress_measure: "0.3",
          description: "JSON description",
          score: {
            scaled: "0.5",
            raw: "50",
            min: "0",
            max: "100"
          }
        };

        objective.fromJSON(data);

        expect(objective.id).toBe("json_id");
        expect(objective.success_status).toBe("failed");
        expect(objective.completion_status).toBe("incomplete");
        expect(objective.progress_measure).toBe("0.3");
        expect(objective.description).toBe("JSON description");
        expect(objective.score.scaled).toBe("0.5");
        expect(objective.score.raw).toBe("50");
        expect(objective.score.min).toBe("0");
        expect(objective.score.max).toBe("100");
      });

      it("should handle missing properties gracefully", () => {
        const objective = new CMIObjectivesObject();
        const data = {
          id: "partial_id"
        };

        expect(() => {
          objective.fromJSON(data);
        }).not.toThrow();

        expect(objective.id).toBe("partial_id");
      });

      it("should handle null or invalid data", () => {
        const objective = new CMIObjectivesObject();

        expect(() => {
          objective.fromJSON(null);
        }).not.toThrow();

        expect(() => {
          objective.fromJSON(undefined);
        }).not.toThrow();

        expect(() => {
          objective.fromJSON("invalid");
        }).not.toThrow();
      });
    });
  });
});
