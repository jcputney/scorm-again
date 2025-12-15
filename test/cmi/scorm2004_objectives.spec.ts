// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import { CMIObjectives, CMIObjectivesObject } from "../../src/cmi/scorm2004/objectives";
import { scorm2004_constants } from "../../src";

describe("SCORM 2004 Objectives Tests", () => {
  describe("CMIObjectives Tests", () => {
    describe("Initialization Tests", () => {
      it("should initialize with default values", () => {
        const objectives = new CMIObjectives();

        expect(objectives.childArray.length).toBe(0);
      });

      it("should have read-only _children property", () => {
        const objectives = new CMIObjectives();

        expect(objectives["_children"]).toBe(scorm2004_constants.objectives_children);

        expect(() => {
          // eslint-disable-next-line
          // @ts-ignore - Testing invalid assignment
          objectives["_children"] = "invalid";
        }).toThrow();
      });
    });

    describe("Array Operations", () => {
      it("should add and retrieve objective objects", () => {
        const objectives = new CMIObjectives();

        // Add an objective
        const objectiveObj = new CMIObjectivesObject();
        objectiveObj.id = "objective-1";
        objectiveObj.success_status = "passed";
        objectiveObj.completion_status = "completed";
        objectiveObj.progress_measure = "0.75";
        objectiveObj.description = "Test Objective";

        objectives.childArray.push(objectiveObj);

        expect(objectives.childArray.length).toBe(1);
        expect(objectives.childArray[0].id).toBe("objective-1");
        expect(objectives.childArray[0].success_status).toBe("passed");
        expect(objectives.childArray[0].completion_status).toBe("completed");
        expect(objectives.childArray[0].progress_measure).toBe("0.75");
        expect(objectives.childArray[0].description).toBe("Test Objective");
      });

      it("should find objective by ID", () => {
        const objectives = new CMIObjectives();

        // Add objectives
        const objective1 = new CMIObjectivesObject();
        objective1.id = "objective-1";

        const objective2 = new CMIObjectivesObject();
        objective2.id = "objective-2";

        objectives.childArray.push(objective1);
        objectives.childArray.push(objective2);

        const foundObjective = objectives.findObjectiveById("objective-2");

        expect(foundObjective).toBeDefined();
        expect(foundObjective?.id).toBe("objective-2");
      });

      it("should find objective by index", () => {
        const objectives = new CMIObjectives();

        // Add objectives
        const objective1 = new CMIObjectivesObject();
        objective1.id = "objective-1";

        const objective2 = new CMIObjectivesObject();
        objective2.id = "objective-2";

        objectives.childArray.push(objective1);
        objectives.childArray.push(objective2);

        const foundObjective = objectives.findObjectiveByIndex(1);

        expect(foundObjective).toBeDefined();
        expect(foundObjective.id).toBe("objective-2");
      });

      it("should set objective by index", () => {
        const objectives = new CMIObjectives();

        // Add an objective
        const objective1 = new CMIObjectivesObject();
        objective1.id = "objective-1";
        objectives.childArray.push(objective1);

        // Create a new objective
        const objective2 = new CMIObjectivesObject();
        objective2.id = "objective-2";

        // Set the objective at index 0
        objectives.setObjectiveByIndex(0, objective2);

        expect(objectives.childArray[0].id).toBe("objective-2");
      });
    });

    describe("JSON Serialization", () => {
      it("should serialize to JSON correctly", () => {
        const objectives = new CMIObjectives();

        // Add an objective
        const objectiveObj = new CMIObjectivesObject();
        objectiveObj.id = "objective-1";
        objectiveObj.success_status = "passed";
        objectiveObj.completion_status = "completed";
        objectiveObj.progress_measure = "0.75";
        objectiveObj.description = "Test Objective";

        objectives.childArray.push(objectiveObj);

        const json = JSON.stringify(objectives);
        const parsed = JSON.parse(json);

        expect(parsed["0"]).toBeDefined();
        expect(parsed["0"].id).toBe("objective-1");
        expect(parsed["0"].success_status).toBe("passed");
        expect(parsed["0"].completion_status).toBe("completed");
        expect(parsed["0"].progress_measure).toBe("0.75");
        expect(parsed["0"].description).toBe("Test Objective");
      });
    });
  });

  describe("CMIObjectivesObject Tests", () => {
    describe("Initialization Tests", () => {
      it("should initialize with default values", () => {
        const objectiveObj = new CMIObjectivesObject();

        expect(objectiveObj.id).toBe("");
        expect(objectiveObj.success_status).toBe("unknown");
        expect(objectiveObj.completion_status).toBe("unknown");
        expect(objectiveObj.progress_measure).toBe("");
        expect(objectiveObj.description).toBe("");
        expect(objectiveObj.score).toBeDefined();
      });
    });

    describe("Property Tests", () => {
      describe("id", () => {
        it("should set and get id", () => {
          const objectiveObj = new CMIObjectivesObject();

          objectiveObj.id = "objective-1";
          expect(objectiveObj.id).toBe("objective-1");
        });

        // Per SCORM 2004 RTE Section 4.1.5: Once set, an objective ID is immutable
        it("should reject changing id once set (immutability)", () => {
          const objectiveObj = new CMIObjectivesObject();

          objectiveObj.id = "objective-1";
          expect(objectiveObj.id).toBe("objective-1");

          // Attempting to change ID should throw
          expect(() => {
            objectiveObj.id = "another-objective";
          }).toThrow();

          // Original ID should be preserved
          expect(objectiveObj.id).toBe("objective-1");
        });

        it("should allow setting the same id again (idempotent)", () => {
          const objectiveObj = new CMIObjectivesObject();

          objectiveObj.id = "objective-1";
          objectiveObj.id = "objective-1"; // Same value should work
          expect(objectiveObj.id).toBe("objective-1");
        });

        it("should reject invalid id values", () => {
          const objectiveObj = new CMIObjectivesObject();

          // Invalid format (empty string)
          expect(() => {
            objectiveObj.id = "";
          }).toThrow();
        });
      });

      describe("success_status", () => {
        it("should set and get success_status", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          objectiveObj.success_status = "passed";
          expect(objectiveObj.success_status).toBe("passed");

          objectiveObj.success_status = "failed";
          expect(objectiveObj.success_status).toBe("failed");

          objectiveObj.success_status = "unknown";
          expect(objectiveObj.success_status).toBe("unknown");
        });

        it("should reject invalid success_status values", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          expect(() => {
            objectiveObj.success_status = "invalid";
          }).toThrow();
        });

        it("should throw dependency error if id is not set", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.initialize(); // Initialize to trigger dependency check

          expect(() => {
            objectiveObj.success_status = "passed";
          }).toThrow();
        });
      });

      describe("completion_status", () => {
        it("should set and get completion_status", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          objectiveObj.completion_status = "completed";
          expect(objectiveObj.completion_status).toBe("completed");

          objectiveObj.completion_status = "incomplete";
          expect(objectiveObj.completion_status).toBe("incomplete");

          objectiveObj.completion_status = "not attempted";
          expect(objectiveObj.completion_status).toBe("not attempted");

          objectiveObj.completion_status = "unknown";
          expect(objectiveObj.completion_status).toBe("unknown");
        });

        it("should reject invalid completion_status values", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          expect(() => {
            objectiveObj.completion_status = "invalid";
          }).toThrow();
        });

        it("should throw dependency error if id is not set", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.initialize(); // Initialize to trigger dependency check

          expect(() => {
            objectiveObj.completion_status = "completed";
          }).toThrow();
        });
      });

      describe("progress_measure", () => {
        it("should set and get progress_measure", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          objectiveObj.progress_measure = "0.5";
          expect(objectiveObj.progress_measure).toBe("0.5");

          objectiveObj.progress_measure = "0";
          expect(objectiveObj.progress_measure).toBe("0");

          objectiveObj.progress_measure = "1";
          expect(objectiveObj.progress_measure).toBe("1");
        });

        it("should reject invalid progress_measure values", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          // Invalid format
          expect(() => {
            objectiveObj.progress_measure = "invalid";
          }).toThrow();

          // Out of range
          expect(() => {
            objectiveObj.progress_measure = "-0.1";
          }).toThrow();

          expect(() => {
            objectiveObj.progress_measure = "1.1";
          }).toThrow();
        });

        it("should throw dependency error if id is not set", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.initialize(); // Initialize to trigger dependency check

          expect(() => {
            objectiveObj.progress_measure = "0.5";
          }).toThrow();
        });
      });

      describe("description", () => {
        it("should set and get description", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          objectiveObj.description = "Test Objective";
          expect(objectiveObj.description).toBe("Test Objective");

          objectiveObj.description = "Another description";
          expect(objectiveObj.description).toBe("Another description");
        });

        it("should reject invalid description values", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.id = "objective-1"; // Set ID first to avoid dependency error

          // Create a string that's too long (more than 250 characters)
          const tooLongDescription = "a".repeat(251);

          expect(() => {
            objectiveObj.description = tooLongDescription;
          }).toThrow();
        });

        it("should throw dependency error if id is not set", () => {
          const objectiveObj = new CMIObjectivesObject();
          objectiveObj.initialize(); // Initialize to trigger dependency check

          expect(() => {
            objectiveObj.description = "Test Objective";
          }).toThrow();
        });
      });
    });

    describe("JSON Serialization", () => {
      it("should serialize to JSON correctly", () => {
        const objectiveObj = new CMIObjectivesObject();

        objectiveObj.id = "objective-1";
        objectiveObj.success_status = "passed";
        objectiveObj.completion_status = "completed";
        objectiveObj.progress_measure = "0.75";
        objectiveObj.description = "Test Objective";

        const json = JSON.stringify(objectiveObj);
        const parsed = JSON.parse(json);

        expect(parsed.id).toBe("objective-1");
        expect(parsed.success_status).toBe("passed");
        expect(parsed.completion_status).toBe("completed");
        expect(parsed.progress_measure).toBe("0.75");
        expect(parsed.description).toBe("Test Objective");
        expect(parsed.score).toBeDefined();
      });
    });
  });
});
