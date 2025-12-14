import { describe, it, expect, beforeEach } from "vitest";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { OverallSequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { CompletionStatus } from "../../../../src/constants/enums";

describe("Suspension State Preservation", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overallProcess: OverallSequencingProcess;

  beforeEach(() => {
    activityTree = new ActivityTree();
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess
    );
  });

  describe("Global Objective Value Preservation", () => {
    it("should preserve global objective value across suspend/resume", () => {
      // Setup activity with global objective
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      // Create objective with global mapping
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_obj1",
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true
        }]
      });

      child1.primaryObjective = objective;
      root.addChild(child1);
      activityTree.root = root;

      // Set objective values
      child1.objectiveSatisfiedStatus = true;
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.85;

      // Update global objectives
      overallProcess.updateGlobalObjective("global_obj1", {
        satisfiedStatus: true,
        normalizedMeasure: 0.85,
        satisfiedStatusKnown: true,
        normalizedMeasureKnown: true
      });

      // Capture suspension state
      const suspensionState = overallProcess.getSuspensionState();
      expect(suspensionState).toHaveProperty("globalObjectives");

      // Create new process instance and restore
      const newActivityTree = new ActivityTree();
      const newSequencingProcess = new SequencingProcess(newActivityTree);
      const newRollupProcess = new RollupProcess();
      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        newSequencingProcess,
        newRollupProcess
      );

      // Rebuild tree structure for restore
      const newRoot = new Activity("root", "Root");
      const newChild1 = new Activity("child1", "Child 1");
      const newObjective = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_obj1",
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true
        }]
      });
      newChild1.primaryObjective = newObjective;
      newRoot.addChild(newChild1);
      newActivityTree.root = newRoot;

      // Restore suspension state
      newOverallProcess.restoreSuspensionState(suspensionState);

      // Verify global objective was preserved
      const globalObjMap = newOverallProcess.getGlobalObjectiveMapSnapshot();
      expect(globalObjMap["global_obj1"]).toBeDefined();
      expect(globalObjMap["global_obj1"].satisfiedStatus).toBe(true);
      expect(globalObjMap["global_obj1"].normalizedMeasure).toBe(0.85);
    });

    it("should preserve shared global objective between two activities", () => {
      // Setup two activities sharing same global objective
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      // Both reference same global objective
      const obj1 = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "shared_global",
          writeSatisfiedStatus: true,
          writeNormalizedMeasure: true
        }]
      });

      const obj2 = new ActivityObjective("obj2", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "shared_global",
          readSatisfiedStatus: true,
          readNormalizedMeasure: true
        }]
      });

      child1.primaryObjective = obj1;
      child2.primaryObjective = obj2;
      root.addChild(child1);
      root.addChild(child2);
      activityTree.root = root;

      // Child1 writes to global objective
      overallProcess.updateGlobalObjective("shared_global", {
        satisfiedStatus: true,
        normalizedMeasure: 0.92,
        satisfiedStatusKnown: true,
        normalizedMeasureKnown: true
      });

      // Suspend and restore
      const suspensionState = overallProcess.getSuspensionState();

      // New process
      const newActivityTree = new ActivityTree();
      const newSequencingProcess = new SequencingProcess(newActivityTree);
      const newRollupProcess = new RollupProcess();
      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        newSequencingProcess,
        newRollupProcess
      );

      const newRoot = new Activity("root", "Root");
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newObj1 = new ActivityObjective("obj1", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "shared_global",
          writeSatisfiedStatus: true,
          writeNormalizedMeasure: true
        }]
      });
      const newObj2 = new ActivityObjective("obj2", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "shared_global",
          readSatisfiedStatus: true,
          readNormalizedMeasure: true
        }]
      });
      newChild1.primaryObjective = newObj1;
      newChild2.primaryObjective = newObj2;
      newRoot.addChild(newChild1);
      newRoot.addChild(newChild2);
      newActivityTree.root = newRoot;

      newOverallProcess.restoreSuspensionState(suspensionState);

      // Verify shared global objective preserved
      const globalObjMap = newOverallProcess.getGlobalObjectiveMapSnapshot();
      expect(globalObjMap["shared_global"]).toBeDefined();
      expect(globalObjMap["shared_global"].satisfiedStatus).toBe(true);
      expect(globalObjMap["shared_global"].normalizedMeasure).toBe(0.92);
    });

    it("should preserve objective mapping (read/write) after resume", () => {
      const root = new Activity("root", "Root");
      const child = new Activity("child", "Child");

      const objective = new ActivityObjective("obj", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "mapped_obj",
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: false,
          writeNormalizedMeasure: true,
          readProgressMeasure: true,
          writeProgressMeasure: false
        }]
      });

      child.primaryObjective = objective;
      root.addChild(child);
      activityTree.root = root;

      // Capture and restore
      const state = root.getSuspensionState();
      const newRoot = new Activity("root", "Root");
      const newChild = new Activity("child", "Child");
      const newObj = new ActivityObjective("obj", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "mapped_obj",
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: false,
          writeNormalizedMeasure: true,
          readProgressMeasure: true,
          writeProgressMeasure: false
        }]
      });
      newChild.primaryObjective = newObj;
      newRoot.addChild(newChild);
      newRoot.restoreSuspensionState(state);

      // Verify mapping info preserved
      const restoredObj = newChild.primaryObjective;
      expect(restoredObj).toBeDefined();
      expect(restoredObj!.mapInfo).toHaveLength(1);
      expect(restoredObj!.mapInfo[0].targetObjectiveID).toBe("mapped_obj");
      expect(restoredObj!.mapInfo[0].readSatisfiedStatus).toBe(true);
      expect(restoredObj!.mapInfo[0].writeNormalizedMeasure).toBe(true);
    });
  });

  describe("Selection/Randomization State Preservation", () => {
    it("should preserve selected children order", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.selectCount = 2;
      parent.sequencingControls.selectionTiming = "once";

      // Add children
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");
      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);

      // Apply selection
      parent.setProcessedChildren([child1, child3]);
      parent.sequencingControls.selectionCountStatus = true;

      // Suspend
      const state = parent.getSuspensionState();

      // Restore
      const newParent = new Activity("parent", "Parent");
      newParent.sequencingControls.selectCount = 2;
      newParent.sequencingControls.selectionTiming = "once";
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newChild3 = new Activity("child3", "Child 3");
      newParent.addChild(newChild1);
      newParent.addChild(newChild2);
      newParent.addChild(newChild3);

      newParent.restoreSuspensionState(state);

      // Verify selection preserved
      const available = newParent.getAvailableChildren();
      expect(available).toHaveLength(2);
      expect(available[0].id).toBe("child1");
      expect(available[1].id).toBe("child3");
      expect(newParent.sequencingControls.selectionCountStatus).toBe(true);
    });

    it("should NOT re-randomize on resume (preserve random order)", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.randomizeChildren = true;
      parent.sequencingControls.randomizationTiming = "once";

      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");
      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);

      // Simulate randomization already done
      parent.setProcessedChildren([child3, child1, child2]);
      parent.sequencingControls.reorderChildren = true;

      // Suspend
      const state = parent.getSuspensionState();

      // Restore
      const newParent = new Activity("parent", "Parent");
      newParent.sequencingControls.randomizeChildren = true;
      newParent.sequencingControls.randomizationTiming = "once";
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newChild3 = new Activity("child3", "Child 3");
      newParent.addChild(newChild1);
      newParent.addChild(newChild2);
      newParent.addChild(newChild3);

      newParent.restoreSuspensionState(state);

      // Verify randomization state preserved (not re-randomized)
      expect(newParent.sequencingControls.reorderChildren).toBe(true);
      const available = newParent.getAvailableChildren();
      expect(available[0].id).toBe("child3");
      expect(available[1].id).toBe("child1");
      expect(available[2].id).toBe("child2");
    });

    it("should only reorder on NEW attempt, not on resume", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.randomizeChildren = true;
      parent.sequencingControls.randomizationTiming = "onEachNewAttempt";

      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");
      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);

      // Set current order (simulated randomization)
      parent.setProcessedChildren([child2, child3, child1]);
      parent.isNewAttempt = false; // Not a new attempt

      // Suspend
      const state = parent.getSuspensionState();

      // Restore
      const newParent = new Activity("parent", "Parent");
      newParent.sequencingControls.randomizeChildren = true;
      newParent.sequencingControls.randomizationTiming = "onEachNewAttempt";
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newChild3 = new Activity("child3", "Child 3");
      newParent.addChild(newChild1);
      newParent.addChild(newChild2);
      newParent.addChild(newChild3);

      newParent.restoreSuspensionState(state);

      // Verify state indicates not a new attempt (should not reorder)
      expect(newParent.isNewAttempt).toBe(false);
      const available = newParent.getAvailableChildren();
      expect(available[0].id).toBe("child2");
      expect(available[1].id).toBe("child3");
      expect(available[2].id).toBe("child1");
    });

    it("should handle selectionTiming and randomizationTiming values correctly", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.selectionTiming = "onEachNewAttempt";
      parent.sequencingControls.randomizationTiming = "onEachNewAttempt";
      parent.sequencingControls.selectCount = 2;
      parent.sequencingControls.randomizeChildren = true;

      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");
      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);

      // Mark as not a new attempt
      parent.isNewAttempt = false;
      parent.setProcessedChildren([child1, child3]);

      const state = parent.getSuspensionState();

      // Restore
      const newParent = new Activity("parent", "Parent");
      newParent.sequencingControls.selectionTiming = "onEachNewAttempt";
      newParent.sequencingControls.randomizationTiming = "onEachNewAttempt";
      newParent.sequencingControls.selectCount = 2;
      newParent.sequencingControls.randomizeChildren = true;
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newChild3 = new Activity("child3", "Child 3");
      newParent.addChild(newChild1);
      newParent.addChild(newChild2);
      newParent.addChild(newChild3);

      newParent.restoreSuspensionState(state);

      // Verify timing values preserved
      expect(newParent.sequencingControls.selectionTiming).toBe("onEachNewAttempt");
      expect(newParent.sequencingControls.randomizationTiming).toBe("onEachNewAttempt");
      expect(newParent.isNewAttempt).toBe(false);
    });
  });

  describe("Partial Cluster Completion State", () => {
    it("should preserve position in partially completed cluster", () => {
      const cluster = new Activity("cluster", "Cluster");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      // Mark child1 as completed
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptCount = 1;

      // Child2 is active (current position)
      child2.isActive = true;
      child2.attemptCount = 1;

      // Child3 not attempted
      child3.attemptCount = 0;

      cluster.addChild(child1);
      cluster.addChild(child2);
      cluster.addChild(child3);

      const state = cluster.getSuspensionState();

      // Restore
      const newCluster = new Activity("cluster", "Cluster");
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newChild3 = new Activity("child3", "Child 3");
      newCluster.addChild(newChild1);
      newCluster.addChild(newChild2);
      newCluster.addChild(newChild3);

      newCluster.restoreSuspensionState(state);

      // Verify position preserved
      expect(newChild1.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(newChild1.attemptCount).toBe(1);
      expect(newChild2.isActive).toBe(true);
      expect(newChild2.attemptCount).toBe(1);
      expect(newChild3.attemptCount).toBe(0);
    });

    it("should preserve active child within cluster", () => {
      const cluster = new Activity("cluster", "Cluster");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      cluster.addChild(child1);
      cluster.addChild(child2);
      cluster.addChild(child3);

      // Child2 is the active one
      child2.isActive = true;
      child2.activityAttemptActive = true;

      const state = cluster.getSuspensionState();

      // Restore
      const newCluster = new Activity("cluster", "Cluster");
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      const newChild3 = new Activity("child3", "Child 3");
      newCluster.addChild(newChild1);
      newCluster.addChild(newChild2);
      newCluster.addChild(newChild3);

      newCluster.restoreSuspensionState(state);

      // Verify active child preserved
      expect(newChild2.isActive).toBe(true);
      expect(newChild2.activityAttemptActive).toBe(true);
      expect(newChild1.isActive).toBe(false);
      expect(newChild3.isActive).toBe(false);
    });

    it("should preserve attempt progress on partially completed activities", () => {
      const activity = new Activity("activity", "Activity");
      activity.attemptCount = 2;
      activity.attemptProgressStatus = true;
      activity.attemptCompletionAmount = 0.65;
      activity.completionStatus = CompletionStatus.INCOMPLETE;

      const state = activity.getSuspensionState();

      const newActivity = new Activity("activity", "Activity");
      newActivity.restoreSuspensionState(state);

      expect(newActivity.attemptCount).toBe(2);
      expect(newActivity.attemptProgressStatus).toBe(true);
      expect(newActivity.attemptCompletionAmount).toBe(0.65);
      expect(newActivity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });

    it("should preserve suspendedActivity reference correctly", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;
      activityTree.suspendedActivity = child2;
      child2.isSuspended = true;

      const state = overallProcess.getSuspensionState();

      // New tree
      const newActivityTree = new ActivityTree();
      const newSequencingProcess = new SequencingProcess(newActivityTree);
      const newRollupProcess = new RollupProcess();
      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        newSequencingProcess,
        newRollupProcess
      );

      const newRoot = new Activity("root", "Root");
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      newRoot.addChild(newChild1);
      newRoot.addChild(newChild2);
      newActivityTree.root = newRoot;

      newOverallProcess.restoreSuspensionState(state);

      expect(newActivityTree.suspendedActivity).toBeDefined();
      expect(newActivityTree.suspendedActivity?.id).toBe("child2");
      expect(newChild2.isSuspended).toBe(true);
    });
  });

  describe("Attempt Count Preservation", () => {
    it("should preserve attempt count on resume", () => {
      const activity = new Activity("activity", "Activity");
      activity.attemptCount = 3;
      activity.objectiveNormalizedMeasure = 0.75;
      activity.completionStatus = CompletionStatus.COMPLETED;

      const state = activity.getSuspensionState();

      const newActivity = new Activity("activity", "Activity");
      newActivity.restoreSuspensionState(state);

      expect(newActivity.attemptCount).toBe(3);
      expect(newActivity.objectiveNormalizedMeasure).toBe(0.75);
      expect(newActivity.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should preserve attempt count across deep hierarchy", () => {
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      root.attemptCount = 1;
      parent.attemptCount = 2;
      child.attemptCount = 3;

      parent.addChild(child);
      root.addChild(parent);

      const state = root.getSuspensionState();

      const newRoot = new Activity("root", "Root");
      const newParent = new Activity("parent", "Parent");
      const newChild = new Activity("child", "Child");
      newParent.addChild(newChild);
      newRoot.addChild(newParent);

      newRoot.restoreSuspensionState(state);

      expect(newRoot.attemptCount).toBe(1);
      expect(newParent.attemptCount).toBe(2);
      expect(newChild.attemptCount).toBe(3);
    });
  });

  describe("Multiple Suspend/Resume Cycles", () => {
    it("should maintain state through multiple suspend/resume cycles", () => {
      const activity = new Activity("activity", "Activity");
      activity.attemptCount = 1;
      activity.objectiveNormalizedMeasure = 0.5;

      // First cycle
      let state = activity.getSuspensionState();
      let restored = new Activity("activity", "Activity");
      restored.restoreSuspensionState(state);
      expect(restored.attemptCount).toBe(1);
      expect(restored.objectiveNormalizedMeasure).toBe(0.5);

      // Modify after first resume
      restored.attemptCount = 2;
      restored.objectiveNormalizedMeasure = 0.75;

      // Second cycle
      state = restored.getSuspensionState();
      let restored2 = new Activity("activity", "Activity");
      restored2.restoreSuspensionState(state);
      expect(restored2.attemptCount).toBe(2);
      expect(restored2.objectiveNormalizedMeasure).toBe(0.75);

      // Third cycle
      restored2.attemptCount = 3;
      restored2.objectiveNormalizedMeasure = 0.9;
      state = restored2.getSuspensionState();
      let restored3 = new Activity("activity", "Activity");
      restored3.restoreSuspensionState(state);
      expect(restored3.attemptCount).toBe(3);
      expect(restored3.objectiveNormalizedMeasure).toBe(0.9);
    });
  });

  describe("Edge Cases", () => {
    it("should handle suspend during rollup operation", () => {
      const root = new Activity("root", "Root");
      const child = new Activity("child", "Child");
      root.addChild(child);

      // Set rollup-related state
      child.objectiveSatisfiedStatus = true;
      child.objectiveMeasureStatus = true;
      child.objectiveNormalizedMeasure = 0.8;
      child.wasAutoCompleted = true;
      child.completedByMeasure = true;

      const state = root.getSuspensionState();

      const newRoot = new Activity("root", "Root");
      const newChild = new Activity("child", "Child");
      newRoot.addChild(newChild);

      newRoot.restoreSuspensionState(state);

      expect(newChild.objectiveSatisfiedStatus).toBe(true);
      expect(newChild.objectiveMeasureStatus).toBe(true);
      expect(newChild.objectiveNormalizedMeasure).toBe(0.8);
      expect(newChild.wasAutoCompleted).toBe(true);
      expect(newChild.completedByMeasure).toBe(true);
    });

    it("should handle suspend with pending objective updates", () => {
      const activity = new Activity("activity", "Activity");
      const objective = new ActivityObjective("obj1", {
        isPrimary: true,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7
      });

      activity.primaryObjective = objective;
      activity.objectiveSatisfiedStatus = true;
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.85;
      activity.progressMeasure = 0.9;
      activity.progressMeasureStatus = true;

      const state = activity.getSuspensionState();

      const newActivity = new Activity("activity", "Activity");
      const newObjective = new ActivityObjective("obj1", {
        isPrimary: true,
        satisfiedByMeasure: true,
        minNormalizedMeasure: 0.7
      });
      newActivity.primaryObjective = newObjective;

      newActivity.restoreSuspensionState(state);

      expect(newActivity.objectiveSatisfiedStatus).toBe(true);
      expect(newActivity.objectiveMeasureStatus).toBe(true);
      expect(newActivity.objectiveNormalizedMeasure).toBe(0.85);
      expect(newActivity.progressMeasure).toBe(0.9);
      expect(newActivity.progressMeasureStatus).toBe(true);
      expect(newActivity.primaryObjective?.satisfiedByMeasure).toBe(true);
      expect(newActivity.primaryObjective?.minNormalizedMeasure).toBe(0.7);
    });

    it("should preserve duration values across suspension", () => {
      const activity = new Activity("activity", "Activity");
      activity.attemptAbsoluteDurationValue = "PT1H30M45S";
      activity.attemptExperiencedDurationValue = "PT1H15M30S";
      activity.activityAbsoluteDurationValue = "PT2H0M0S";
      activity.activityExperiencedDurationValue = "PT1H45M0S";

      const state = activity.getSuspensionState();

      const newActivity = new Activity("activity", "Activity");
      newActivity.restoreSuspensionState(state);

      expect(newActivity.attemptAbsoluteDurationValue).toBe("PT1H30M45S");
      expect(newActivity.attemptExperiencedDurationValue).toBe("PT1H15M30S");
      expect(newActivity.activityAbsoluteDurationValue).toBe("PT2H0M0S");
      expect(newActivity.activityExperiencedDurationValue).toBe("PT1H45M0S");
    });

    it("should preserve timestamp values for duration tracking", () => {
      const activity = new Activity("activity", "Activity");
      const startTime = "2025-01-15T10:30:00.000Z";
      const attemptStart = "2025-01-15T11:00:00.000Z";

      activity.activityStartTimestampUtc = startTime;
      activity.attemptStartTimestampUtc = attemptStart;

      const state = activity.getSuspensionState();

      const newActivity = new Activity("activity", "Activity");
      newActivity.restoreSuspensionState(state);

      expect(newActivity.activityStartTimestampUtc).toBe(startTime);
      expect(newActivity.attemptStartTimestampUtc).toBe(attemptStart);
    });

    it("should handle empty processedChildren correctly", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      parent.addChild(child1);
      parent.addChild(child2);

      // Explicitly set empty processed children
      parent.setProcessedChildren([]);

      const state = parent.getSuspensionState();

      const newParent = new Activity("parent", "Parent");
      const newChild1 = new Activity("child1", "Child 1");
      const newChild2 = new Activity("child2", "Child 2");
      newParent.addChild(newChild1);
      newParent.addChild(newChild2);

      newParent.restoreSuspensionState(state);

      const available = newParent.getAvailableChildren();
      expect(available).toHaveLength(0);
    });
  });
});
