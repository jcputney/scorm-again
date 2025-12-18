import {beforeEach, describe, expect, it} from "vitest";
import {Activity} from "../../../../src/cmi/scorm2004/sequencing/activity";
import {RollupProcess} from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {CompletionStatus} from "../../../../src/constants/enums";

describe("4th Edition Completion Measure Rollup Process", () => {
  let rollupProcess: RollupProcess;

  beforeEach(() => {
    rollupProcess = new RollupProcess();
  });

  describe("Activity Properties", () => {
    it("should initialize completedByMeasure to false by default", () => {
      const activity = new Activity("test", "Test Activity");
      expect(activity.completedByMeasure).toBe(false);
    });

    it("should initialize minProgressMeasure to 1.0 by default", () => {
      const activity = new Activity("test", "Test Activity");
      expect(activity.minProgressMeasure).toBe(1.0);
    });

    it("should initialize progressWeight to 1.0 by default", () => {
      const activity = new Activity("test", "Test Activity");
      expect(activity.progressWeight).toBe(1.0);
    });

    it("should initialize attemptCompletionAmountStatus to false by default", () => {
      const activity = new Activity("test", "Test Activity");
      expect(activity.attemptCompletionAmountStatus).toBe(false);
    });

    it("should validate minProgressMeasure range (0.0-1.0)", () => {
      const activity = new Activity("test", "Test Activity");

      // Valid values
      activity.minProgressMeasure = 0.0;
      expect(activity.minProgressMeasure).toBe(0.0);

      activity.minProgressMeasure = 0.5;
      expect(activity.minProgressMeasure).toBe(0.5);

      activity.minProgressMeasure = 1.0;
      expect(activity.minProgressMeasure).toBe(1.0);

      // Invalid values
      expect(() => {
        activity.minProgressMeasure = -0.1;
      }).toThrow();

      expect(() => {
        activity.minProgressMeasure = 1.1;
      }).toThrow();
    });

    it("should validate progressWeight >= 0.0", () => {
      const activity = new Activity("test", "Test Activity");

      // Valid values
      activity.progressWeight = 0.0;
      expect(activity.progressWeight).toBe(0.0);

      activity.progressWeight = 1.0;
      expect(activity.progressWeight).toBe(1.0);

      activity.progressWeight = 2.5;
      expect(activity.progressWeight).toBe(2.5);

      // Invalid value
      expect(() => {
        activity.progressWeight = -0.1;
      }).toThrow();
    });

    it("should reset new properties in reset() method", () => {
      const activity = new Activity("test", "Test Activity");

      // Set non-default values
      activity.completedByMeasure = true;
      activity.minProgressMeasure = 0.7;
      activity.progressWeight = 2.0;
      activity.attemptCompletionAmountStatus = true;

      // Reset
      activity.reset();

      // Verify defaults restored
      expect(activity.completedByMeasure).toBe(false);
      expect(activity.minProgressMeasure).toBe(1.0);
      expect(activity.progressWeight).toBe(1.0);
      expect(activity.attemptCompletionAmountStatus).toBe(false);
    });

    it("should include new properties in toJSON()", () => {
      const activity = new Activity("test", "Test Activity");
      activity.completedByMeasure = true;
      activity.minProgressMeasure = 0.8;
      activity.progressWeight = 1.5;
      activity.attemptCompletionAmountStatus = true;

      const json = activity.toJSON() as any;

      expect(json.completedByMeasure).toBe(true);
      expect(json.minProgressMeasure).toBe(0.8);
      expect(json.progressWeight).toBe(1.5);
      expect(json.attemptCompletionAmountStatus).toBe(true);
    });
  });

  describe("completedByMeasure=false uses rules-based rollup (backward compatibility)", () => {
    it("should use rules-based rollup when completedByMeasure is false", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = false;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.sequencingControls.rollupProgressCompletion = true;

      const child2 = new Activity("child2", "Child 2");
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.sequencingControls.rollupProgressCompletion = true;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Should use rules-based rollup: all children completed = parent completed
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should ignore attemptCompletionAmount when completedByMeasure is false", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = false;
      parent.minProgressMeasure = 0.5;
      parent.attemptCompletionAmount = 0.6;
      parent.attemptCompletionAmountStatus = true;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.completionStatus = CompletionStatus.INCOMPLETE;
      child.sequencingControls.rollupProgressCompletion = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      // Should use rules-based rollup, not measure-based
      // Child is incomplete, so parent should be incomplete
      expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });
  });

  describe("completedByMeasure=true uses measure threshold", () => {
    it("should mark as completed when attemptCompletionAmount >= minProgressMeasure", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.8;
      child.attemptCompletionAmountStatus = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      // Parent should have completion amount from child
      expect(parent.attemptCompletionAmount).toBe(0.8);
      // Parent should be completed since 0.8 >= 0.7
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should mark as incomplete when attemptCompletionAmount < minProgressMeasure", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.6;
      child.attemptCompletionAmountStatus = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      expect(parent.attemptCompletionAmount).toBe(0.6);
      expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });

    it("should mark as unknown when attemptCompletionAmountStatus is false", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.8;
      child.attemptCompletionAmountStatus = false; // No valid data

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      expect(parent.attemptCompletionAmountStatus).toBe(false);
      expect(parent.completionStatus).toBe(CompletionStatus.UNKNOWN);
    });

    it("should handle edge case: exactly at threshold", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.7;
      child.attemptCompletionAmountStatus = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      expect(parent.attemptCompletionAmount).toBe(0.7);
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });
  });

  describe("Weighted averaging with different progressWeight values", () => {
    it("should calculate weighted average with equal weights", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.6;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 1.0;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Weighted average: (0.6*1.0 + 0.8*1.0) / (1.0 + 1.0) = 1.4 / 2.0 = 0.7
      expect(parent.attemptCompletionAmount).toBe(0.7);
      expect(parent.attemptCompletionAmountStatus).toBe(true);
    });

    it("should calculate weighted average with different weights", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.5;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 2.0; // Higher weight

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Weighted average: (0.5*2.0 + 0.8*1.0) / (2.0 + 1.0) = 1.8 / 3.0 = 0.6
      expect(parent.attemptCompletionAmount).toBeCloseTo(0.6, 10);
      expect(parent.attemptCompletionAmountStatus).toBe(true);
    });

    it("should handle zero weight correctly", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.5;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 0.0; // Zero weight - should be ignored

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Weighted average: (0.5*0.0 + 0.8*1.0) / (0.0 + 1.0) = 0.8 / 1.0 = 0.8
      expect(parent.attemptCompletionAmount).toBe(0.8);
      expect(parent.attemptCompletionAmountStatus).toBe(true);
    });

    it("should skip children without attemptCompletionAmountStatus", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.5;
      child1.attemptCompletionAmountStatus = false; // Not tracked
      child1.progressWeight = 1.0;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Only child2 contributes: 0.8*1.0 / 1.0 = 0.8
      expect(parent.attemptCompletionAmount).toBe(0.8);
      expect(parent.attemptCompletionAmountStatus).toBe(true);
    });

    it("should set attemptCompletionAmountStatus to false when no children have status", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.5;
      child1.attemptCompletionAmountStatus = false;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = false;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      expect(parent.attemptCompletionAmountStatus).toBe(false);
    });
  });

  describe("Multi-level rollup propagation", () => {
    it("should propagate completion measure through multiple levels", () => {
      // Grandparent
      //   -> Parent
      //       -> Child1 (0.6)
      //       -> Child2 (0.8)
      const grandparent = new Activity("grandparent", "Grandparent");
      grandparent.sequencingControls.rollupProgressCompletion = true;

      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;
      parent.progressWeight = 1.0;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.6;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 1.0;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      grandparent.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Parent should have average of children: (0.6 + 0.8) / 2 = 0.7
      expect(parent.attemptCompletionAmount).toBe(0.7);
      expect(parent.attemptCompletionAmountStatus).toBe(true);

      // Grandparent should have parent's value: 0.7
      expect(grandparent.attemptCompletionAmount).toBe(0.7);
      expect(grandparent.attemptCompletionAmountStatus).toBe(true);
    });

    it("should apply completion status at each level using measure-based rollup", () => {
      const grandparent = new Activity("grandparent", "Grandparent");
      grandparent.sequencingControls.rollupProgressCompletion = true;
      grandparent.completedByMeasure = true;
      grandparent.minProgressMeasure = 0.6;

      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;
      parent.progressWeight = 1.0;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.6;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 1.0;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      grandparent.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Parent: 0.7 average >= 0.7 threshold -> COMPLETED
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);

      // Grandparent: 0.7 average >= 0.6 threshold -> COMPLETED
      expect(grandparent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should handle complex multi-level weighted averaging", () => {
      // Grandparent
      //   -> Parent1 (weight 2.0)
      //       -> Child1 (0.5, weight 1.0)
      //       -> Child2 (0.7, weight 1.0)
      //   -> Parent2 (weight 1.0)
      //       -> Child3 (0.9, weight 1.0)
      const grandparent = new Activity("grandparent", "Grandparent");
      grandparent.sequencingControls.rollupProgressCompletion = true;

      const parent1 = new Activity("parent1", "Parent 1");
      parent1.sequencingControls.rollupProgressCompletion = true;
      parent1.progressWeight = 2.0;

      const parent2 = new Activity("parent2", "Parent 2");
      parent2.sequencingControls.rollupProgressCompletion = true;
      parent2.progressWeight = 1.0;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.5;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 1.0;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.7;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 1.0;

      const child3 = new Activity("child3", "Child 3");
      child3.attemptCompletionAmount = 0.9;
      child3.attemptCompletionAmountStatus = true;
      child3.progressWeight = 1.0;

      grandparent.addChild(parent1);
      grandparent.addChild(parent2);
      parent1.addChild(child1);
      parent1.addChild(child2);
      parent2.addChild(child3);

      // Trigger rollup from both branches
      rollupProcess.overallRollupProcess(child1);
      rollupProcess.overallRollupProcess(child3);

      // Parent1: (0.5*1.0 + 0.7*1.0) / (1.0 + 1.0) = 1.2 / 2.0 = 0.6
      expect(parent1.attemptCompletionAmount).toBe(0.6);

      // Parent2: 0.9*1.0 / 1.0 = 0.9
      expect(parent2.attemptCompletionAmount).toBe(0.9);

      // Grandparent: (0.6*2.0 + 0.9*1.0) / (2.0 + 1.0) = 2.1 / 3.0 = 0.7
      expect(grandparent.attemptCompletionAmount).toBeCloseTo(0.7, 10);
    });
  });

  describe("Integration with existing rollup", () => {
    it("should not interfere with objective rollup", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupObjectiveSatisfied = true;
      parent.sequencingControls.rollupProgressCompletion = true;
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;

      const child1 = new Activity("child1", "Child 1");
      child1.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupProgressCompletion = true;
      child1.objectiveSatisfiedStatus = true;
      child1.attemptCompletionAmount = 0.8;
      child1.attemptCompletionAmountStatus = true;

      const child2 = new Activity("child2", "Child 2");
      child2.sequencingControls.rollupObjectiveSatisfied = true;
      child2.sequencingControls.rollupProgressCompletion = true;
      child2.objectiveSatisfiedStatus = true;
      child2.attemptCompletionAmount = 0.9;
      child2.attemptCompletionAmountStatus = true;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Objective rollup should still work
      expect(parent.objectiveSatisfiedStatus).toBe(true);

      // Completion measure rollup should work
      expect(parent.attemptCompletionAmount).toBeCloseTo(0.85, 10);
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should work alongside duration rollup", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.8;
      child.attemptCompletionAmountStatus = true;
      child.activityExperiencedDuration = "PT1H30M";

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      // Both completion measure and duration should be rolled up
      expect(parent.attemptCompletionAmount).toBe(0.8);
      expect(parent.attemptCompletionAmountStatus).toBe(true);
      // Duration rollup also happens (tested separately in duration rollup tests)
    });
  });

  describe("Edge cases", () => {
    it("should handle empty children array", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      rollupProcess.overallRollupProcess(parent);

      // Should not crash and status should remain false
      expect(parent.attemptCompletionAmountStatus).toBe(false);
    });

    it("should handle all children with zero weight", () => {
      const parent = new Activity("parent", "Parent");
      parent.sequencingControls.rollupProgressCompletion = true;

      const child1 = new Activity("child1", "Child 1");
      child1.attemptCompletionAmount = 0.5;
      child1.attemptCompletionAmountStatus = true;
      child1.progressWeight = 0.0;

      const child2 = new Activity("child2", "Child 2");
      child2.attemptCompletionAmount = 0.8;
      child2.attemptCompletionAmountStatus = true;
      child2.progressWeight = 0.0;

      parent.addChild(child1);
      parent.addChild(child2);

      rollupProcess.overallRollupProcess(child1);

      // Total weight is 0, so we should get 0 (or status false would be valid)
      // Implementation returns 0 when totalWeight is 0
      expect(parent.attemptCompletionAmount).toBe(0);
    });

    it("should handle boundary value: minProgressMeasure = 0.0", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.0;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.0;
      child.attemptCompletionAmountStatus = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      // 0.0 >= 0.0 -> COMPLETED
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should handle boundary value: minProgressMeasure = 1.0", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 1.0;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 1.0;
      child.attemptCompletionAmountStatus = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      // 1.0 >= 1.0 -> COMPLETED
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should handle very small differences near threshold", () => {
      const parent = new Activity("parent", "Parent");
      parent.completedByMeasure = true;
      parent.minProgressMeasure = 0.7;
      parent.sequencingControls.rollupProgressCompletion = true;

      const child = new Activity("child", "Child");
      child.attemptCompletionAmount = 0.69999999;
      child.attemptCompletionAmountStatus = true;

      parent.addChild(child);

      rollupProcess.overallRollupProcess(child);

      // Just below threshold -> INCOMPLETE
      expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });
  });
});
