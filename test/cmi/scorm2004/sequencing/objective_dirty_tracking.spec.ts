import { describe, it, expect, beforeEach } from "vitest";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { CompletionStatus } from "../../../../src/constants/enums";

describe("ActivityObjective Dirty Flag Tracking", () => {

  describe("initial state", () => {
    it("should not be dirty initially", () => {
      const objective = new ActivityObjective("test");
      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
      expect(objective.isDirty('completionStatus')).toBe(false);
      expect(objective.isDirty('progressMeasure')).toBe(false);
    });
  });

  describe("setter behavior", () => {
    it("should be dirty after setter changes satisfiedStatus value", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = true; // default is false
      expect(objective.isDirty('satisfiedStatus')).toBe(true);
    });

    it("should not be dirty if satisfiedStatus setter value unchanged", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = false; // same as default
      expect(objective.isDirty('satisfiedStatus')).toBe(false);
    });

    it("should be dirty after setter changes normalizedMeasure value", () => {
      const objective = new ActivityObjective("test");
      objective.normalizedMeasure = 0.5; // default is 0
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
    });

    it("should not be dirty if normalizedMeasure setter value unchanged", () => {
      const objective = new ActivityObjective("test");
      objective.normalizedMeasure = 0; // same as default
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
    });

    it("should be dirty after setter changes completionStatus value", () => {
      const objective = new ActivityObjective("test");
      objective.completionStatus = CompletionStatus.COMPLETED; // default is UNKNOWN
      expect(objective.isDirty('completionStatus')).toBe(true);
    });

    it("should not be dirty if completionStatus setter value unchanged", () => {
      const objective = new ActivityObjective("test");
      objective.completionStatus = CompletionStatus.UNKNOWN; // same as default
      expect(objective.isDirty('completionStatus')).toBe(false);
    });

    it("should be dirty after setter changes progressMeasure value", () => {
      const objective = new ActivityObjective("test");
      objective.progressMeasure = 0.8; // default is 0
      expect(objective.isDirty('progressMeasure')).toBe(true);
    });

    it("should not be dirty if progressMeasure setter value unchanged", () => {
      const objective = new ActivityObjective("test");
      objective.progressMeasure = 0; // same as default
      expect(objective.isDirty('progressMeasure')).toBe(false);
    });

    it("should track multiple dirty flags independently", () => {
      const objective = new ActivityObjective("test");

      objective.satisfiedStatus = true;
      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);

      objective.normalizedMeasure = 0.5;
      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
    });

    it("should set dirty flag when value changes from non-default to different value", () => {
      const objective = new ActivityObjective("test");

      objective.satisfiedStatus = true;
      expect(objective.isDirty('satisfiedStatus')).toBe(true);

      // Change again to different value
      objective.satisfiedStatus = false;
      expect(objective.isDirty('satisfiedStatus')).toBe(true);
    });
  });

  describe("clearDirty", () => {
    it("should clear individual dirty flag for satisfiedStatus", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = true;
      expect(objective.isDirty('satisfiedStatus')).toBe(true);

      objective.clearDirty('satisfiedStatus');
      expect(objective.isDirty('satisfiedStatus')).toBe(false);
    });

    it("should clear individual dirty flag for normalizedMeasure", () => {
      const objective = new ActivityObjective("test");
      objective.normalizedMeasure = 0.5;
      expect(objective.isDirty('normalizedMeasure')).toBe(true);

      objective.clearDirty('normalizedMeasure');
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
    });

    it("should clear individual dirty flag for completionStatus", () => {
      const objective = new ActivityObjective("test");
      objective.completionStatus = CompletionStatus.COMPLETED;
      expect(objective.isDirty('completionStatus')).toBe(true);

      objective.clearDirty('completionStatus');
      expect(objective.isDirty('completionStatus')).toBe(false);
    });

    it("should clear individual dirty flag for progressMeasure", () => {
      const objective = new ActivityObjective("test");
      objective.progressMeasure = 0.8;
      expect(objective.isDirty('progressMeasure')).toBe(true);

      objective.clearDirty('progressMeasure');
      expect(objective.isDirty('progressMeasure')).toBe(false);
    });

    it("should clear only specified dirty flag, not others", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = true;
      objective.normalizedMeasure = 0.5;

      objective.clearDirty('satisfiedStatus');
      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
    });
  });

  describe("clearAllDirty", () => {
    it("should clear all dirty flags", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = true;
      objective.normalizedMeasure = 0.5;
      objective.completionStatus = CompletionStatus.COMPLETED;
      objective.progressMeasure = 0.8;

      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
      expect(objective.isDirty('completionStatus')).toBe(true);
      expect(objective.isDirty('progressMeasure')).toBe(true);

      objective.clearAllDirty();

      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
      expect(objective.isDirty('completionStatus')).toBe(false);
      expect(objective.isDirty('progressMeasure')).toBe(false);
    });

    it("should work on objective with no dirty flags", () => {
      const objective = new ActivityObjective("test");

      expect(() => objective.clearAllDirty()).not.toThrow();

      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
    });
  });

  describe("resetState", () => {
    it("should clear dirty flags on reset", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = true;
      objective.normalizedMeasure = 0.5;

      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);

      objective.resetState();

      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
    });

    it("should reset values and clear dirty flags", () => {
      const objective = new ActivityObjective("test");
      objective.satisfiedStatus = true;
      objective.normalizedMeasure = 0.5;
      objective.completionStatus = CompletionStatus.COMPLETED;
      objective.progressMeasure = 0.8;

      objective.resetState();

      // Check values are reset
      expect(objective.satisfiedStatus).toBe(false);
      expect(objective.normalizedMeasure).toBe(0);
      expect(objective.completionStatus).toBe(CompletionStatus.UNKNOWN);
      expect(objective.progressMeasure).toBe(0);

      // Check dirty flags are cleared
      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
      expect(objective.isDirty('completionStatus')).toBe(false);
      expect(objective.isDirty('progressMeasure')).toBe(false);
    });
  });

  describe("updateFromActivity", () => {
    it("should set dirty flag when updating from activity with different value", () => {
      const activity = new Activity("act1", "Activity 1");
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;

      const objective = new ActivityObjective("test");
      objective.updateFromActivity(activity);

      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
    });

    it("should not set dirty flag when updating from activity with same value", () => {
      const activity = new Activity("act1", "Activity 1");
      activity.objectiveSatisfiedStatus = false; // same as default
      activity.objectiveNormalizedMeasure = 0; // same as default

      const objective = new ActivityObjective("test");
      objective.updateFromActivity(activity);

      expect(objective.isDirty('satisfiedStatus')).toBe(false);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
    });

    it("should update dirty flags for all changed properties", () => {
      const activity = new Activity("act1", "Activity 1");
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveNormalizedMeasure = 0.75;
      activity.progressMeasure = 0.9;
      activity.completionStatus = CompletionStatus.COMPLETED;

      const objective = new ActivityObjective("test");
      objective.updateFromActivity(activity);

      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
      expect(objective.isDirty('progressMeasure')).toBe(true);
      expect(objective.isDirty('completionStatus')).toBe(true);
    });
  });

  describe("initializeFromCMI", () => {
    it("should always set dirty flags when initializing from CMI", () => {
      const objective = new ActivityObjective("test");

      // Initialize with default values (same as current defaults)
      objective.initializeFromCMI(false, 0, false);

      // Should still be marked dirty because CMI data should be written to global
      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
    });

    it("should set dirty flags when initializing from CMI with non-default values", () => {
      const objective = new ActivityObjective("test");

      objective.initializeFromCMI(true, 0.8, true);

      expect(objective.isDirty('satisfiedStatus')).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(true);
      expect(objective.satisfiedStatus).toBe(true);
      expect(objective.normalizedMeasure).toBe(0.8);
      expect(objective.measureStatus).toBe(true);
    });
  });
});

describe("Activity Objective Dirty Flag Tracking", () => {
  let activity: Activity;

  beforeEach(() => {
    activity = new Activity("act1", "Activity 1");
  });

  describe("initial state", () => {
    it("should not be dirty initially", () => {
      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(false);
      expect(activity.isObjectiveDirty('measureStatus')).toBe(false);
    });
  });

  describe("setter behavior", () => {
    it("should be dirty after setter changes objectiveSatisfiedStatus", () => {
      activity.objectiveSatisfiedStatus = true;
      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(true);
    });

    it("should not be dirty if objectiveSatisfiedStatus unchanged", () => {
      activity.objectiveSatisfiedStatus = false; // same as default
      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
    });

    it("should be dirty after setter changes objectiveNormalizedMeasure", () => {
      activity.objectiveNormalizedMeasure = 0.75;
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(true);
    });

    it("should not be dirty if objectiveNormalizedMeasure unchanged", () => {
      activity.objectiveNormalizedMeasure = 0; // same as default
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(false);
    });

    it("should be dirty after setter changes objectiveMeasureStatus", () => {
      activity.objectiveMeasureStatus = true;
      expect(activity.isObjectiveDirty('measureStatus')).toBe(true);
    });

    it("should not be dirty if objectiveMeasureStatus unchanged", () => {
      activity.objectiveMeasureStatus = false; // same as default
      expect(activity.isObjectiveDirty('measureStatus')).toBe(false);
    });
  });

  describe("clearObjectiveDirty", () => {
    it("should clear individual dirty flag", () => {
      activity.objectiveSatisfiedStatus = true;
      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(true);

      activity.clearObjectiveDirty('satisfiedStatus');
      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
    });

    it("should clear only specified flag", () => {
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;

      activity.clearObjectiveDirty('satisfiedStatus');
      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(true);
    });
  });

  describe("clearAllObjectiveDirty", () => {
    it("should clear all dirty flags", () => {
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;
      activity.objectiveMeasureStatus = true;

      activity.clearAllObjectiveDirty();

      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(false);
      expect(activity.isObjectiveDirty('measureStatus')).toBe(false);
    });
  });

  describe("reset", () => {
    it("should clear dirty flags on reset", () => {
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;

      activity.reset();

      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(false);
    });
  });

  describe("setPrimaryObjectiveState", () => {
    it("should set dirty flags when values change", () => {
      activity.setPrimaryObjectiveState(
        true, // satisfiedStatus
        true, // measureStatus
        0.8, // normalizedMeasure
        0.5, // progressMeasure
        true, // progressMeasureStatus
        CompletionStatus.COMPLETED
      );

      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(true);
      expect(activity.isObjectiveDirty('measureStatus')).toBe(true);
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(true);
    });

    it("should not set dirty flags when values unchanged", () => {
      activity.setPrimaryObjectiveState(
        false, // satisfiedStatus - same as default
        false, // measureStatus - same as default
        0, // normalizedMeasure - same as default
        0, // progressMeasure
        false, // progressMeasureStatus
        CompletionStatus.UNKNOWN
      );

      expect(activity.isObjectiveDirty('satisfiedStatus')).toBe(false);
      expect(activity.isObjectiveDirty('measureStatus')).toBe(false);
      expect(activity.isObjectiveDirty('normalizedMeasure')).toBe(false);
    });

    it("should update primary objective dirty flags when primary objective exists", () => {
      const primaryObjective = new ActivityObjective("primary", { isPrimary: true });
      activity.primaryObjective = primaryObjective;

      activity.setPrimaryObjectiveState(
        true,
        true,
        0.9,
        0.7,
        true,
        CompletionStatus.COMPLETED
      );

      // Primary objective should have dirty flags set
      expect(primaryObjective.isDirty('satisfiedStatus')).toBe(true);
      expect(primaryObjective.isDirty('normalizedMeasure')).toBe(true);
    });
  });
});

describe("Global Objective Sync with Dirty Flags", () => {
  let rollupProcess: RollupProcess;
  let globalObjectives: Map<string, any>;
  let activity: Activity;
  let objective: ActivityObjective;

  beforeEach(() => {
    rollupProcess = new RollupProcess();
    globalObjectives = new Map();
    activity = new Activity("act1", "Activity 1");

    // Create objective with write permissions
    objective = new ActivityObjective("obj1", {
      mapInfo: [{
        targetObjectiveID: "global1",
        writeSatisfiedStatus: true,
        writeNormalizedMeasure: true,
        readSatisfiedStatus: false,
        readNormalizedMeasure: false
      }]
    });

    activity.addObjective(objective);
  });

  describe("write phase behavior", () => {
    it("should not write to global objective if local is not dirty", () => {
      // Set up global objective with initial value
      globalObjectives.set("global1", {
        id: "global1",
        satisfiedStatus: false,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0.5,
        normalizedMeasureKnown: true,
        satisfiedByMeasure: false,
        minNormalizedMeasure: 0.7
      });

      // Set objective value but ensure it's not dirty
      objective.satisfiedStatus = true;
      objective.clearDirty('satisfiedStatus');
      objective.measureStatus = true;

      // Process global objective mapping
      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Global objective should be unchanged since local wasn't dirty
      const globalObj = globalObjectives.get("global1");
      expect(globalObj.satisfiedStatus).toBe(false); // Should remain unchanged
    });

    it("should write to global objective when local is dirty", () => {
      // Set objective value (will be dirty)
      objective.satisfiedStatus = true;
      objective.measureStatus = true;

      // Process global objective mapping
      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Global objective should have the new value
      const globalObj = globalObjectives.get("global1");
      expect(globalObj.satisfiedStatus).toBe(true);
      expect(globalObj.satisfiedStatusKnown).toBe(true);
    });

    it("should clear dirty flag after write", () => {
      // Set objective value (will be dirty)
      objective.satisfiedStatus = true;
      objective.measureStatus = true;

      expect(objective.isDirty('satisfiedStatus')).toBe(true);

      // Process global objective mapping
      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Dirty flag should be cleared
      expect(objective.isDirty('satisfiedStatus')).toBe(false);
    });

    it("should write normalized measure when dirty", () => {
      objective.normalizedMeasure = 0.85;
      objective.measureStatus = true;

      expect(objective.isDirty('normalizedMeasure')).toBe(true);

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("global1");
      expect(globalObj.normalizedMeasure).toBe(0.85);
      expect(globalObj.normalizedMeasureKnown).toBe(true);
      expect(objective.isDirty('normalizedMeasure')).toBe(false);
    });

    it("should not write normalized measure when not dirty", () => {
      globalObjectives.set("global1", {
        id: "global1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0.6,
        normalizedMeasureKnown: true,
        satisfiedByMeasure: false
      });

      objective.normalizedMeasure = 0.85;
      objective.measureStatus = true;
      objective.clearDirty('normalizedMeasure');

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("global1");
      expect(globalObj.normalizedMeasure).toBe(0.6); // unchanged
    });

    it("should handle multiple objectives with different dirty states", () => {
      const objective2 = new ActivityObjective("obj2", {
        mapInfo: [{
          targetObjectiveID: "global2",
          writeSatisfiedStatus: true,
          writeNormalizedMeasure: true,
          readSatisfiedStatus: false,
          readNormalizedMeasure: false
        }]
      });
      activity.addObjective(objective2);

      // First objective is dirty
      objective.satisfiedStatus = true;
      objective.measureStatus = true;

      // Second objective is not dirty
      objective2.satisfiedStatus = true;
      objective2.measureStatus = true;
      objective2.clearDirty('satisfiedStatus');

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // First objective should be written
      const globalObj1 = globalObjectives.get("global1");
      expect(globalObj1.satisfiedStatus).toBe(true);

      // Second objective should not be written (will use default/initial value)
      const globalObj2 = globalObjectives.get("global2");
      expect(globalObj2.satisfiedStatus).toBe(true); // from initialization, not write
      expect(globalObj2.satisfiedStatusKnown).toBe(false); // not written
    });

    it("should require measureStatus to be true for writes", () => {
      objective.satisfiedStatus = true;
      objective.measureStatus = false; // not valid

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("global1");
      // Should not write because measureStatus is false
      expect(globalObj.satisfiedStatusKnown).toBe(false);
    });

    it("should write completion status when dirty", () => {
      const objectiveWithCompletion = new ActivityObjective("obj3", {
        mapInfo: [{
          targetObjectiveID: "global3",
          writeCompletionStatus: true
        }]
      });
      activity.addObjective(objectiveWithCompletion);

      objectiveWithCompletion.completionStatus = CompletionStatus.COMPLETED;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("global3");
      expect(globalObj.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(globalObj.completionStatusKnown).toBe(true);
      expect(objectiveWithCompletion.isDirty('completionStatus')).toBe(false);
    });

    it("should write progress measure when dirty", () => {
      const objectiveWithProgress = new ActivityObjective("obj4", {
        mapInfo: [{
          targetObjectiveID: "global4",
          writeProgressMeasure: true
        }]
      });
      activity.addObjective(objectiveWithProgress);

      objectiveWithProgress.progressMeasure = 0.75;
      objectiveWithProgress.progressMeasureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("global4");
      expect(globalObj.progressMeasure).toBe(0.75);
      expect(globalObj.progressMeasureKnown).toBe(true);
      expect(objectiveWithProgress.isDirty('progressMeasure')).toBe(false);
    });

    it("should handle satisfiedByMeasure writes correctly", () => {
      const objectiveWithSBM = new ActivityObjective("obj5", {
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7,
        mapInfo: [{
          targetObjectiveID: "global5",
          writeNormalizedMeasure: true,
          writeSatisfiedStatus: true
        }]
      });
      activity.addObjective(objectiveWithSBM);

      objectiveWithSBM.normalizedMeasure = 0.85;
      objectiveWithSBM.measureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      const globalObj = globalObjectives.get("global5");
      expect(globalObj.normalizedMeasure).toBe(0.85);
      expect(globalObj.satisfiedStatus).toBe(true); // derived from measure >= threshold
      expect(globalObj.satisfiedStatusKnown).toBe(true);

      // Both dirty flags should be cleared
      expect(objectiveWithSBM.isDirty('normalizedMeasure')).toBe(false);
      expect(objectiveWithSBM.isDirty('satisfiedStatus')).toBe(false);
    });
  });

  describe("two-pass synchronization", () => {
    it("should ensure writes happen before reads across multiple activities", () => {
      // Create two activities sharing a global objective
      const activity1 = new Activity("act1", "Activity 1");
      const activity2 = new Activity("act2", "Activity 2");

      const root = new Activity("root", "Root");
      root.addChild(activity1);
      root.addChild(activity2);

      // Activity 1 writes to global objective
      const obj1 = new ActivityObjective("obj1", {
        mapInfo: [{
          targetObjectiveID: "shared",
          writeSatisfiedStatus: true,
          writeNormalizedMeasure: true,
          readSatisfiedStatus: false,
          readNormalizedMeasure: false
        }]
      });
      activity1.addObjective(obj1);

      // Activity 2 reads from global objective
      const obj2 = new ActivityObjective("obj2", {
        mapInfo: [{
          targetObjectiveID: "shared",
          writeSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readSatisfiedStatus: true,
          readNormalizedMeasure: true
        }]
      });
      activity2.addObjective(obj2);

      // Set value in activity 1 (dirty)
      obj1.satisfiedStatus = true;
      obj1.normalizedMeasure = 0.9;
      obj1.measureStatus = true;

      // Process from root (will process both activities)
      rollupProcess.processGlobalObjectiveMapping(root, globalObjectives);

      // Activity 2 should have received the value from activity 1
      expect(obj2.satisfiedStatus).toBe(true);
      expect(obj2.normalizedMeasure).toBe(0.9);
      expect(obj2.measureStatus).toBe(true);
    });

    it("should not overwrite writes with reads in same pass", () => {
      const activity1 = new Activity("act1", "Activity 1");

      // Objective that both reads and writes
      const obj = new ActivityObjective("obj1", {
        mapInfo: [{
          targetObjectiveID: "global",
          writeSatisfiedStatus: true,
          writeNormalizedMeasure: true,
          readSatisfiedStatus: true,
          readNormalizedMeasure: true
        }]
      });
      activity1.addObjective(obj);

      // Pre-populate global with different value
      globalObjectives.set("global", {
        id: "global",
        satisfiedStatus: false,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0.3,
        normalizedMeasureKnown: true,
        satisfiedByMeasure: false
      });

      // Set local value (dirty)
      obj.satisfiedStatus = true;
      obj.normalizedMeasure = 0.9;
      obj.measureStatus = true;

      rollupProcess.processGlobalObjectiveMapping(activity1, globalObjectives);

      // Global should have the local value (write happened first)
      const globalObj = globalObjectives.get("global");
      expect(globalObj.satisfiedStatus).toBe(true);
      expect(globalObj.normalizedMeasure).toBe(0.9);

      // Local should still have its value (read happened after, saw the write)
      expect(obj.satisfiedStatus).toBe(true);
      expect(obj.normalizedMeasure).toBe(0.9);
    });
  });
});
