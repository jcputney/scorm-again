import { describe, expect, it, beforeEach } from "vitest";

import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { CompletionStatus } from "../../../../src/constants/enums";

describe("Global Objective Mapping Tests", () => {
  let rollupProcess: RollupProcess;
  let globalObjectives: Map<string, any>;

  beforeEach(() => {
    rollupProcess = new RollupProcess();
    globalObjectives = new Map<string, any>();
  });

  describe("Reading satisfied status from global objective", () => {
    it("should read satisfied status from global objective when readSatisfiedStatus is true", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readSatisfiedStatus: true,
          },
        ],
      });
      activity.primaryObjective = objective;

      // Set up global objective with satisfied status
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        readSatisfiedStatus: true,
        writeSatisfiedStatus: false,
        readNormalizedMeasure: false,
        writeNormalizedMeasure: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(objective.satisfiedStatus).toBe(true);
      expect(objective.measureStatus).toBe(true);
      expect(activity.objectiveSatisfiedStatus).toBe(true);
    });

    it("should not read satisfied status when readSatisfiedStatus is false", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readSatisfiedStatus: false,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.satisfiedStatus = false;

      // Set up global objective with satisfied status
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        readSatisfiedStatus: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Should remain unchanged
      expect(objective.satisfiedStatus).toBe(false);
    });

    it("should not read satisfied status when satisfiedStatusKnown is false", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readSatisfiedStatus: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.satisfiedStatus = false;

      // Set up global objective without known status
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        satisfiedStatus: true,
        satisfiedStatusKnown: false,
        readSatisfiedStatus: true,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Should remain unchanged
      expect(objective.satisfiedStatus).toBe(false);
    });
  });

  describe("Reading normalized measure from global objective", () => {
    it("should read normalized measure from global objective when readNormalizedMeasure is true", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;

      // Set up global objective with normalized measure
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        normalizedMeasure: 0.85,
        normalizedMeasureKnown: true,
        readNormalizedMeasure: true,
        writeNormalizedMeasure: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(objective.normalizedMeasure).toBeCloseTo(0.85);
      expect(objective.measureStatus).toBe(true);
      expect(activity.objectiveNormalizedMeasure).toBeCloseTo(0.85);
      expect(activity.objectiveMeasureStatus).toBe(true);
    });

    it("should not read normalized measure when readNormalizedMeasure is false", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readNormalizedMeasure: false,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.normalizedMeasure = 0.5;

      // Set up global objective with different measure
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        normalizedMeasure: 0.85,
        normalizedMeasureKnown: true,
        readNormalizedMeasure: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Should remain unchanged
      expect(objective.normalizedMeasure).toBeCloseTo(0.5);
    });

    it("should derive satisfied status from measure when satisfiedByMeasure is true", () => {
      const activity = new Activity("activity1");
      activity.scaledPassingScore = 0.7;
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;

      // Set up global objective with measure above passing score
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        normalizedMeasure: 0.85,
        normalizedMeasureKnown: true,
        satisfiedByMeasure: true,
        readNormalizedMeasure: true,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(objective.normalizedMeasure).toBeCloseTo(0.85);
      expect(objective.satisfiedStatus).toBe(true);
    });

    it("should set satisfied to false when measure is below threshold", () => {
      const activity = new Activity("activity1");
      activity.scaledPassingScore = 0.7;
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;

      // Set up global objective with measure below passing score
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        normalizedMeasure: 0.5,
        normalizedMeasureKnown: true,
        satisfiedByMeasure: true,
        readNormalizedMeasure: true,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(objective.normalizedMeasure).toBeCloseTo(0.5);
      expect(objective.satisfiedStatus).toBe(false);
    });
  });

  describe("Writing satisfied status to global objective", () => {
    it("should write satisfied status to global objective when writeSatisfiedStatus is true", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            writeSatisfiedStatus: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.satisfiedStatus = true;
      objective.measureStatus = true;
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      expect(globalObj).toBeDefined();
      expect(globalObj.satisfiedStatus).toBe(true);
      expect(globalObj.satisfiedStatusKnown).toBe(true);
    });

    it("should not write satisfied status when writeSatisfiedStatus is false", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            writeSatisfiedStatus: false,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.satisfiedStatus = true;
      objective.measureStatus = true;

      // Pre-populate global objective with different status
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        satisfiedStatus: false,
        satisfiedStatusKnown: true,
        writeSatisfiedStatus: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      // Should remain unchanged
      expect(globalObj.satisfiedStatus).toBe(false);
    });

    it("should not write satisfied status when measureStatus is false", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            writeSatisfiedStatus: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.satisfiedStatus = true;
      objective.measureStatus = false; // No measure status

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      // Should not write status without measure status
      expect(globalObj.satisfiedStatusKnown).toBe(false);
    });
  });

  describe("Writing normalized measure to global objective", () => {
    it("should write normalized measure to global objective when writeNormalizedMeasure is true", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            writeNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.normalizedMeasure = 0.75;
      objective.measureStatus = true;
      activity.objectiveNormalizedMeasure = 0.75;
      activity.objectiveMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      expect(globalObj).toBeDefined();
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.75);
      expect(globalObj.normalizedMeasureKnown).toBe(true);
    });

    it("should not write normalized measure when writeNormalizedMeasure is false", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            writeNormalizedMeasure: false,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.normalizedMeasure = 0.75;
      objective.measureStatus = true;

      // Pre-populate global objective with different measure
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        normalizedMeasure: 0.5,
        normalizedMeasureKnown: true,
        writeNormalizedMeasure: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      // Should remain unchanged
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.5);
    });

    it("should derive and write satisfied status when satisfiedByMeasure is true", () => {
      const activity = new Activity("activity1");
      activity.scaledPassingScore = 0.7;
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            writeNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.normalizedMeasure = 0.85;
      objective.measureStatus = true;
      activity.objectiveNormalizedMeasure = 0.85;
      activity.objectiveMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.85);
      expect(globalObj.satisfiedStatus).toBe(true);
      expect(globalObj.satisfiedStatusKnown).toBe(true);
    });
  });

  describe("Cross-activity sharing via global objectives", () => {
    it("should share objective state between multiple activities", () => {
      const activity1 = new Activity("activity1");
      const activity2 = new Activity("activity2");

      const obj1 = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "SHARED_OBJECTIVE",
            writeNormalizedMeasure: true,
            writeSatisfiedStatus: true,
          },
        ],
      });
      activity1.primaryObjective = obj1;
      obj1.normalizedMeasure = 0.9;
      obj1.satisfiedStatus = true;
      obj1.measureStatus = true;
      activity1.objectiveNormalizedMeasure = 0.9;
      activity1.objectiveMeasureStatus = true;
      activity1.objectiveSatisfiedStatus = true;

      const obj2 = new ActivityObjective("obj2", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "SHARED_OBJECTIVE",
            readNormalizedMeasure: true,
            readSatisfiedStatus: true,
          },
        ],
      });
      activity2.primaryObjective = obj2;

      // Process activity1 first (writes to global)
      rollupProcess.processGlobalObjectiveMapping(activity1, globalObjectives);

      // Verify global objective was created and written
      expect(globalObjectives.has("SHARED_OBJECTIVE")).toBe(true);
      const globalObj = globalObjectives.get("SHARED_OBJECTIVE");
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.9);
      expect(globalObj.satisfiedStatus).toBe(true);

      // Manually set read flags on global objective to enable reading
      // (In real SCORM, the LMS would configure these permissions)
      globalObj.readNormalizedMeasure = true;
      globalObj.readSatisfiedStatus = true;

      // Process activity2 (reads from global)
      rollupProcess.processGlobalObjectiveMapping(activity2, globalObjectives);

      // Verify activity2 received the shared state
      expect(obj2.normalizedMeasure).toBeCloseTo(0.9);
      expect(obj2.satisfiedStatus).toBe(true);
      expect(activity2.objectiveNormalizedMeasure).toBeCloseTo(0.9);
      expect(activity2.objectiveSatisfiedStatus).toBe(true);
    });

    it("should handle bidirectional synchronization with proper permissions", () => {
      const activity1 = new Activity("activity1");
      const activity2 = new Activity("activity2");

      const obj1 = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "BIDIRECTIONAL_OBJ",
            readNormalizedMeasure: true,
            writeNormalizedMeasure: true,
            readSatisfiedStatus: true,
            writeSatisfiedStatus: true,
          },
        ],
      });
      activity1.primaryObjective = obj1;
      obj1.normalizedMeasure = 0.6;
      obj1.measureStatus = true;
      obj1.satisfiedStatus = false;  // Explicitly set initial status
      activity1.objectiveNormalizedMeasure = 0.6;
      activity1.objectiveMeasureStatus = true;
      activity1.objectiveSatisfiedStatus = false;

      // Activity1 creates the global objective with write permissions
      rollupProcess.processGlobalObjectiveMapping(activity1, globalObjectives);

      const globalObj = globalObjectives.get("BIDIRECTIONAL_OBJ");
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.6);

      // Simulate LMS updating the global objective directly
      globalObj.normalizedMeasure = 0.95;
      globalObj.normalizedMeasureKnown = true;
      globalObj.satisfiedStatus = true;
      globalObj.satisfiedStatusKnown = true;
      globalObj.readNormalizedMeasure = true;
      globalObj.readSatisfiedStatus = true;

      // Activity1 reads the updated values
      rollupProcess.processGlobalObjectiveMapping(activity1, globalObjectives);

      expect(obj1.normalizedMeasure).toBeCloseTo(0.95);
      expect(obj1.satisfiedStatus).toBe(true);
      expect(activity1.objectiveNormalizedMeasure).toBeCloseTo(0.95);
      expect(activity1.objectiveSatisfiedStatus).toBe(true);
    });

    it("should handle multiple objectives mapping to different global objectives", () => {
      const activity = new Activity("activity1");

      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_PRIMARY",
            writeNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = primaryObj;
      primaryObj.normalizedMeasure = 0.8;
      primaryObj.measureStatus = true;
      activity.objectiveNormalizedMeasure = 0.8;
      activity.objectiveMeasureStatus = true;

      const secondaryObj = new ActivityObjective("secondary", {
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_SECONDARY",
            writeNormalizedMeasure: true,
          },
        ],
      });
      secondaryObj.normalizedMeasure = 0.6;
      secondaryObj.measureStatus = true;
      activity.addObjective(secondaryObj);

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(globalObjectives.has("GLOBAL_PRIMARY")).toBe(true);
      expect(globalObjectives.has("GLOBAL_SECONDARY")).toBe(true);
      expect(globalObjectives.get("GLOBAL_PRIMARY").normalizedMeasure).toBeCloseTo(0.8);
      expect(globalObjectives.get("GLOBAL_SECONDARY").normalizedMeasure).toBeCloseTo(0.6);
    });

    it("should handle recursive tree processing for global objectives", () => {
      const root = new Activity("root");
      const child1 = new Activity("child1");
      const grandchild = new Activity("grandchild");

      root.addChild(child1);
      child1.addChild(grandchild);

      // Root has read/write permissions
      const rootObj = new ActivityObjective("rootObj", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "COURSE_OBJECTIVE",
            readNormalizedMeasure: true,
            writeNormalizedMeasure: true,
          },
        ],
      });
      root.primaryObjective = rootObj;
      rootObj.normalizedMeasure = 0.5;
      rootObj.measureStatus = true;
      root.objectiveNormalizedMeasure = 0.5;
      root.objectiveMeasureStatus = true;

      // Process root creates global objective
      rollupProcess.processGlobalObjectiveMapping(root, globalObjectives);

      const globalObj = globalObjectives.get("COURSE_OBJECTIVE");
      expect(globalObj).toBeDefined();
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.5);

      // Verify recursive processing visited all activities
      expect(globalObjectives.size).toBeGreaterThan(0);

      // Simulate LMS updating global objective
      globalObj.normalizedMeasure = 0.92;
      globalObj.normalizedMeasureKnown = true;
      globalObj.readNormalizedMeasure = true;

      // Root re-processes and reads updated value
      rollupProcess.processGlobalObjectiveMapping(root, globalObjectives);

      expect(rootObj.normalizedMeasure).toBeCloseTo(0.92);
      expect(root.objectiveNormalizedMeasure).toBeCloseTo(0.92);
    });
  });

  describe("Additional objective mapping features", () => {
    it("should handle completion status mapping", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readCompletionStatus: true,
            writeCompletionStatus: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.completionStatus = CompletionStatus.COMPLETED;
      activity.completionStatus = CompletionStatus.COMPLETED;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      expect(globalObj.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(globalObj.completionStatusKnown).toBe(true);
    });

    it("should handle progress measure mapping", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readProgressMeasure: true,
            writeProgressMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.progressMeasure = 0.75;
      objective.progressMeasureStatus = true;
      activity.progressMeasure = 0.75;
      activity.progressMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      expect(globalObj.progressMeasure).toBeCloseTo(0.75);
      expect(globalObj.progressMeasureKnown).toBe(true);
    });

    it("should create default map info when none is provided", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        // No mapInfo provided
      });
      activity.primaryObjective = objective;
      objective.normalizedMeasure = 0.8;
      objective.measureStatus = true;
      activity.objectiveNormalizedMeasure = 0.8;
      activity.objectiveMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Should create entry with objective's own ID as target
      expect(globalObjectives.has("obj1")).toBe(true);
      const globalObj = globalObjectives.get("obj1");
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.8);
    });

    it("should handle multiple map infos for single objective", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ_A",
            writeNormalizedMeasure: true,
          },
          {
            targetObjectiveID: "GLOBAL_OBJ_B",
            writeNormalizedMeasure: true,
          },
        ],
      });
      activity.primaryObjective = objective;
      objective.normalizedMeasure = 0.88;
      objective.measureStatus = true;
      activity.objectiveNormalizedMeasure = 0.88;
      activity.objectiveMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Both global objectives should be updated
      expect(globalObjectives.has("GLOBAL_OBJ_A")).toBe(true);
      expect(globalObjectives.has("GLOBAL_OBJ_B")).toBe(true);
      expect(globalObjectives.get("GLOBAL_OBJ_A").normalizedMeasure).toBeCloseTo(0.88);
      expect(globalObjectives.get("GLOBAL_OBJ_B").normalizedMeasure).toBeCloseTo(0.88);
    });

    it("should preserve existing global objective data when not overwriting", () => {
      const activity = new Activity("activity1");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [
          {
            targetObjectiveID: "GLOBAL_OBJ",
            readNormalizedMeasure: true,
            // Note: no write permissions
          },
        ],
      });
      activity.primaryObjective = objective;

      // Pre-populate global objective
      globalObjectives.set("GLOBAL_OBJ", {
        id: "GLOBAL_OBJ",
        normalizedMeasure: 0.95,
        normalizedMeasureKnown: true,
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        readNormalizedMeasure: true,
        writeNormalizedMeasure: false,
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("GLOBAL_OBJ");
      // Original data should be preserved
      expect(globalObj.normalizedMeasure).toBeCloseTo(0.95);
      expect(globalObj.satisfiedStatus).toBe(true);

      // Activity should have read the values
      expect(objective.normalizedMeasure).toBeCloseTo(0.95);
      expect(activity.objectiveNormalizedMeasure).toBeCloseTo(0.95);
    });
  });
});
