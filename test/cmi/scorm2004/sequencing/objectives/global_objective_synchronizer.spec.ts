import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  GlobalObjectiveSynchronizer,
  GlobalObjective,
} from "../../../../../src/cmi/scorm2004/sequencing/objectives/global_objective_synchronizer";
import { Activity, ActivityObjective } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { CompletionStatus } from "../../../../../src/constants/enums";

describe("GlobalObjectiveSynchronizer", () => {
  let synchronizer: GlobalObjectiveSynchronizer;
  let root: Activity;
  let child1: Activity;
  let child2: Activity;
  let globalObjectives: Map<string, GlobalObjective>;
  let eventCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    eventCallback = vi.fn();
    synchronizer = new GlobalObjectiveSynchronizer(eventCallback);

    root = new Activity("root", "Course");
    child1 = new Activity("child1", "Module 1");
    child2 = new Activity("child2", "Module 2");

    root.addChild(child1);
    root.addChild(child2);

    globalObjectives = new Map();
  });

  describe("constructor", () => {
    it("should create synchronizer without event callback", () => {
      const syncNoCallback = new GlobalObjectiveSynchronizer();
      expect(syncNoCallback).toBeDefined();
    });

    it("should create synchronizer with event callback", () => {
      const syncWithCallback = new GlobalObjectiveSynchronizer(eventCallback);
      expect(syncWithCallback).toBeDefined();
    });
  });

  describe("processGlobalObjectiveMapping", () => {
    it("should process global objectives for all activities in tree", () => {
      synchronizer.processGlobalObjectiveMapping(root, globalObjectives);

      expect(eventCallback).toHaveBeenCalledWith(
        "global_objective_processing_started",
        expect.objectContaining({
          activityId: "root",
        })
      );

      expect(eventCallback).toHaveBeenCalledWith(
        "global_objective_processing_completed",
        expect.objectContaining({
          activityId: "root",
        })
      );
    });

    it("should handle processing errors gracefully", () => {
      // Create a mock that throws on first call
      const brokenActivity = {
        id: "broken",
        getAllObjectives: () => {
          throw new Error("Test error");
        },
        children: [],
      } as unknown as Activity;

      synchronizer.processGlobalObjectiveMapping(brokenActivity, globalObjectives);

      expect(eventCallback).toHaveBeenCalledWith(
        "global_objective_processing_error",
        expect.objectContaining({
          activityId: "broken",
          error: expect.any(String),
        })
      );
    });
  });

  describe("collectActivitiesRecursive", () => {
    it("should collect all activities in tree", () => {
      const activities: Activity[] = [];
      synchronizer.collectActivitiesRecursive(root, activities);

      expect(activities).toHaveLength(3);
      expect(activities).toContain(root);
      expect(activities).toContain(child1);
      expect(activities).toContain(child2);
    });

    it("should collect single activity", () => {
      const activities: Activity[] = [];
      synchronizer.collectActivitiesRecursive(child1, activities);

      expect(activities).toHaveLength(1);
      expect(activities).toContain(child1);
    });

    it("should handle deep hierarchies", () => {
      const grandchild = new Activity("grandchild", "Lesson");
      child1.addChild(grandchild);

      const activities: Activity[] = [];
      synchronizer.collectActivitiesRecursive(root, activities);

      expect(activities).toHaveLength(4);
      expect(activities).toContain(grandchild);
    });
  });

  describe("syncGlobalObjectivesWritePhase", () => {
    it("should write satisfied status to global objective when dirty", () => {
      const objective = new ActivityObjective("obj1");
      // Setting a different value first, then the test value, triggers dirty flag
      objective.satisfiedStatus = false;
      objective.satisfiedStatus = true; // This change sets dirty flag
      objective.measureStatus = true;
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: true,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesWritePhase(child1, globalObjectives);

      expect(globalObjectives.has("global-obj-1")).toBe(true);
      expect(globalObjectives.get("global-obj-1")?.satisfiedStatus).toBe(true);
      expect(globalObjectives.get("global-obj-1")?.satisfiedStatusKnown).toBe(true);
    });

    it("should write normalized measure and derive satisfaction from measure", () => {
      const objective = new ActivityObjective("obj1");
      objective.normalizedMeasure = 0; // Default value
      objective.normalizedMeasure = 0.85; // Change triggers dirty flag
      objective.measureStatus = true;
      objective.satisfiedByMeasure = true;
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: true,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesWritePhase(child1, globalObjectives);

      const globalObj = globalObjectives.get("global-obj-1");
      expect(globalObj?.normalizedMeasure).toBe(0.85);
      expect(globalObj?.normalizedMeasureKnown).toBe(true);
      expect(globalObj?.satisfiedStatus).toBe(true);
      expect(globalObj?.satisfiedStatusKnown).toBe(true);
    });

    it("should write completion status to global objective when dirty", () => {
      const objective = new ActivityObjective("obj1");
      objective.completionStatus = CompletionStatus.COMPLETED; // Change from default triggers dirty
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: true,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesWritePhase(child1, globalObjectives);

      const globalObj = globalObjectives.get("global-obj-1");
      expect(globalObj?.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(globalObj?.completionStatusKnown).toBe(true);
    });

    it("should write progress measure to global objective when dirty", () => {
      const objective = new ActivityObjective("obj1");
      objective.progressMeasure = 0; // Default
      objective.progressMeasure = 0.5; // Change triggers dirty
      objective.progressMeasureStatus = true;
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: true,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesWritePhase(child1, globalObjectives);

      const globalObj = globalObjectives.get("global-obj-1");
      expect(globalObj?.progressMeasure).toBe(0.5);
      expect(globalObj?.progressMeasureKnown).toBe(true);
    });

    it("should use default mapInfo when no mapInfo is specified", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = false; // Default
      objective.satisfiedStatus = true; // Change triggers dirty
      objective.measureStatus = true;
      objective.mapInfo = [];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesWritePhase(child1, globalObjectives);

      // Default mapInfo uses the objective id as target
      expect(globalObjectives.has("obj1")).toBe(true);
    });
  });

  describe("syncGlobalObjectivesReadPhase", () => {
    it("should read satisfied status from global objective", () => {
      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };
      globalObjectives.set("global-obj-1", globalObj);

      const objective = new ActivityObjective("obj1");
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: true,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesReadPhase(child1, globalObjectives);

      expect(objective.satisfiedStatus).toBe(true);
      expect(objective.measureStatus).toBe(true);
    });

    it("should read normalized measure and derive satisfaction", () => {
      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0.9,
        normalizedMeasureKnown: true,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.8,
      };
      globalObjectives.set("global-obj-1", globalObj);

      const objective = new ActivityObjective("obj1");
      objective.satisfiedByMeasure = true;
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: true,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesReadPhase(child1, globalObjectives);

      expect(objective.normalizedMeasure).toBe(0.9);
      expect(objective.satisfiedStatus).toBe(true);
    });

    it("should read progress measure from global objective", () => {
      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0.75,
        progressMeasureKnown: true,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };
      globalObjectives.set("global-obj-1", globalObj);

      const objective = new ActivityObjective("obj1");
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: true,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesReadPhase(child1, globalObjectives);

      expect(objective.progressMeasure).toBe(0.75);
      expect(objective.progressMeasureStatus).toBe(true);
    });

    it("should read completion status from global objective", () => {
      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.COMPLETED,
        completionStatusKnown: true,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };
      globalObjectives.set("global-obj-1", globalObj);

      const objective = new ActivityObjective("obj1");
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: true,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesReadPhase(child1, globalObjectives);

      expect(objective.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should skip read if global objective not found", () => {
      const objective = new ActivityObjective("obj1");
      objective.mapInfo = [
        {
          targetObjectiveID: "non-existent",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: true,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesReadPhase(child1, globalObjectives);

      // Should not throw and objective should remain unchanged
      expect(objective.satisfiedStatus).toBe(false);
    });

    it("should apply primary objective to activity", () => {
      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };
      globalObjectives.set("global-obj-1", globalObj);

      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;
      objective.mapInfo = [
        {
          targetObjectiveID: "global-obj-1",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: true,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      const applyToActivitySpy = vi.spyOn(objective, "applyToActivity");
      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.syncGlobalObjectivesReadPhase(child1, globalObjectives);

      expect(applyToActivitySpy).toHaveBeenCalledWith(child1);
    });
  });

  describe("synchronizeGlobalObjectives", () => {
    it("should perform combined read/write synchronization", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = true;
      objective.measureStatus = true;
      objective.mapInfo = [];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective]);

      synchronizer.synchronizeGlobalObjectives(child1, globalObjectives);

      expect(globalObjectives.has("obj1")).toBe(true);
      expect(eventCallback).toHaveBeenCalledWith(
        "objective_synchronized",
        expect.any(Object)
      );
    });
  });

  describe("syncObjectiveState", () => {
    it("should handle synchronization errors gracefully", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      const mapInfo = {
        targetObjectiveID: "global-obj-1",
        writeSatisfiedStatus: true,
        readSatisfiedStatus: true,
        writeNormalizedMeasure: false,
        readNormalizedMeasure: false,
        writeCompletionStatus: false,
        readCompletionStatus: false,
        writeProgressMeasure: false,
        readProgressMeasure: false,
        updateAttemptData: false,
      };

      // Create a global objective that will cause an error
      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };

      // Mock applyToActivity to throw
      vi.spyOn(objective, "applyToActivity").mockImplementation(() => {
        throw new Error("Test error");
      });

      synchronizer.syncObjectiveState(child1, objective, mapInfo, globalObj);

      expect(eventCallback).toHaveBeenCalledWith(
        "objective_sync_error",
        expect.objectContaining({
          activityId: "child1",
          objectiveId: "obj1",
          error: expect.any(String),
        })
      );
    });

    it("should read and write with satisfiedByMeasure", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedByMeasure = true;
      objective.measureStatus = true;

      const mapInfo = {
        targetObjectiveID: "global-obj-1",
        writeSatisfiedStatus: false,
        readSatisfiedStatus: false,
        writeNormalizedMeasure: true,
        readNormalizedMeasure: true,
        writeCompletionStatus: false,
        readCompletionStatus: false,
        writeProgressMeasure: false,
        readProgressMeasure: false,
        updateAttemptData: false,
      };

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0.9,
        normalizedMeasureKnown: true,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7,
      };

      synchronizer.syncObjectiveState(child1, objective, mapInfo, globalObj);

      expect(objective.satisfiedStatus).toBe(true);
      expect(globalObj.satisfiedStatusKnown).toBe(true);
    });
  });

  describe("ensureGlobalObjectiveEntry", () => {
    it("should create new entry if not exists", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = true;
      objective.satisfiedStatusKnown = true;
      objective.normalizedMeasure = 0.8;
      objective.measureStatus = true;
      objective.completionStatus = CompletionStatus.COMPLETED;

      const result = synchronizer.ensureGlobalObjectiveEntry(
        globalObjectives,
        "global-obj-1",
        objective
      );

      expect(result.id).toBe("global-obj-1");
      expect(result.satisfiedStatus).toBe(true);
      expect(result.normalizedMeasure).toBe(0.8);
      expect(result.normalizedMeasureKnown).toBe(true);
      expect(result.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should return existing entry if exists", () => {
      const existingEntry: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0.5,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.INCOMPLETE,
        completionStatusKnown: true,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };
      globalObjectives.set("global-obj-1", existingEntry);

      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = true;

      const result = synchronizer.ensureGlobalObjectiveEntry(
        globalObjectives,
        "global-obj-1",
        objective
      );

      // Should return existing entry, not create new one
      expect(result).toBe(existingEntry);
      expect(result.satisfiedStatus).toBe(false);
    });
  });

  describe("createDefaultMapInfo", () => {
    it("should create default map info with write-only settings", () => {
      const objective = new ActivityObjective("obj1");

      const mapInfo = synchronizer.createDefaultMapInfo(objective);

      expect(mapInfo.targetObjectiveID).toBe("obj1");
      expect(mapInfo.writeSatisfiedStatus).toBe(true);
      expect(mapInfo.readSatisfiedStatus).toBe(false);
      expect(mapInfo.writeNormalizedMeasure).toBe(true);
      expect(mapInfo.readNormalizedMeasure).toBe(false);
      expect(mapInfo.writeCompletionStatus).toBe(true);
      expect(mapInfo.readCompletionStatus).toBe(false);
      expect(mapInfo.writeProgressMeasure).toBe(true);
      expect(mapInfo.readProgressMeasure).toBe(false);
    });

    it("should set updateAttemptData based on isPrimary", () => {
      const primaryObjective = new ActivityObjective("primary");
      primaryObjective.isPrimary = true;

      const secondaryObjective = new ActivityObjective("secondary");
      secondaryObjective.isPrimary = false;

      const primaryMapInfo = synchronizer.createDefaultMapInfo(primaryObjective);
      const secondaryMapInfo = synchronizer.createDefaultMapInfo(secondaryObjective);

      expect(primaryMapInfo.updateAttemptData).toBe(true);
      expect(secondaryMapInfo.updateAttemptData).toBe(false);
    });
  });

  describe("getLocalObjectiveState", () => {
    it("should get state from activity for primary objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      child1.objectiveSatisfiedStatus = true;
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.9;
      child1.progressMeasure = 0.75;
      child1.progressMeasureStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.scaledPassingScore = 0.8;

      const state = synchronizer.getLocalObjectiveState(child1, objective, true);

      expect(state.id).toBe("obj1");
      expect(state.satisfiedStatus).toBe(true);
      expect(state.measureStatus).toBe(true);
      expect(state.normalizedMeasure).toBe(0.9);
      expect(state.progressMeasure).toBe(0.75);
      expect(state.progressMeasureStatus).toBe(true);
      expect(state.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(state.scaledPassingScore).toBe(0.8);
    });

    it("should get state from objective for non-primary objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = true;
      objective.measureStatus = true;
      objective.normalizedMeasure = 0.85;
      objective.progressMeasure = 0.6;
      objective.progressMeasureStatus = true;
      objective.completionStatus = CompletionStatus.INCOMPLETE;
      objective.minNormalizedMeasure = 0.7;

      const state = synchronizer.getLocalObjectiveState(child1, objective, false);

      expect(state.id).toBe("obj1");
      expect(state.satisfiedStatus).toBe(true);
      expect(state.measureStatus).toBe(true);
      expect(state.normalizedMeasure).toBe(0.85);
      expect(state.progressMeasure).toBe(0.6);
      expect(state.progressMeasureStatus).toBe(true);
      expect(state.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(state.scaledPassingScore).toBe(0.7);
    });
  });

  describe("updateActivityAttemptData", () => {
    it("should skip update for non-primary objective without updateAttemptData", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = false;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
        updateAttemptData: false,
      };

      const originalStatus = child1.completionStatus;
      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.completionStatus).toBe(originalStatus);
    });

    it("should update completion status from satisfied global objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      child1.completionStatus = CompletionStatus.UNKNOWN;
      child1.successStatus = "unknown";

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(child1.successStatus).toBe("passed");
    });

    it("should update attempt count from global objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      child1.attemptCount = 1;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
        attemptCount: 3,
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.attemptCount).toBe(3);
    });

    it("should update progress measure from global objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0.65,
        progressMeasureKnown: true,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.attemptCompletionAmount).toBe(0.65);
    });

    it("should update duration data from global objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
        attemptAbsoluteDuration: "PT1H30M0S",
        attemptExperiencedDuration: "PT1H0M0S",
        activityAbsoluteDuration: "PT2H0M0S",
        activityExperiencedDuration: "PT1H45M0S",
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.attemptAbsoluteDuration).toBe("PT1H30M0S");
      expect(child1.attemptExperiencedDuration).toBe("PT1H0M0S");
      expect(child1.activityAbsoluteDuration).toBe("PT2H0M0S");
      expect(child1.activityExperiencedDuration).toBe("PT1H45M0S");
    });

    it("should update location from global objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
        location: "page5",
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.location).toBe("page5");
    });

    it("should update suspend state from global objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      child1.isSuspended = false;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
        suspendData: "some-suspend-data",
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      expect(child1.isSuspended).toBe(true);
    });

    it("should handle errors gracefully", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };

      // Create a broken activity that throws on property access
      const brokenActivity = {
        get rollupRules() {
          throw new Error("Test error");
        },
      } as unknown as Activity;

      synchronizer.updateActivityAttemptData(brokenActivity, globalObj, objective);

      expect(eventCallback).toHaveBeenCalledWith(
        "attempt_data_update_error",
        expect.objectContaining({
          error: expect.any(String),
        })
      );
    });

    it("should not update completion if activity has rollup rules for completion", () => {
      const objective = new ActivityObjective("obj1");
      objective.isPrimary = true;

      child1.completionStatus = CompletionStatus.INCOMPLETE;
      child1.rollupRules = {
        rules: [
          {
            action: "completed",
            conditions: [],
            childActivitySet: "all",
          },
        ],
      };

      const globalObj: GlobalObjective = {
        id: "global-obj-1",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
        satisfiedByMeasure: false,
        minNormalizedMeasure: null,
      };

      synchronizer.updateActivityAttemptData(child1, globalObj, objective);

      // Completion should not change due to rollup rules
      expect(child1.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });
  });

  describe("Integration scenarios", () => {
    it("should synchronize objectives across activities in two-pass approach", () => {
      // Setup: child1 writes to global, child2 reads from it
      const objective1 = new ActivityObjective("shared-obj");
      objective1.satisfiedStatus = false; // Default
      objective1.satisfiedStatus = true; // Change triggers dirty
      objective1.measureStatus = true;
      objective1.mapInfo = [
        {
          targetObjectiveID: "shared-global",
          writeSatisfiedStatus: true,
          readSatisfiedStatus: false,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      const objective2 = new ActivityObjective("reader-obj");
      objective2.mapInfo = [
        {
          targetObjectiveID: "shared-global",
          writeSatisfiedStatus: false,
          readSatisfiedStatus: true,
          writeNormalizedMeasure: false,
          readNormalizedMeasure: false,
          writeCompletionStatus: false,
          readCompletionStatus: false,
          writeProgressMeasure: false,
          readProgressMeasure: false,
          updateAttemptData: false,
        },
      ];

      vi.spyOn(child1, "getAllObjectives").mockReturnValue([objective1]);
      vi.spyOn(child2, "getAllObjectives").mockReturnValue([objective2]);

      synchronizer.processGlobalObjectiveMapping(root, globalObjectives);

      // child2 should have read the satisfied status from global
      expect(objective2.satisfiedStatus).toBe(true);
    });
  });
});
