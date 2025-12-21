import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { CompletionStatus } from "../../../../src/constants/enums";

describe("Rollup Status Capture and Compare", () => {
  let activity: Activity;

  beforeEach(() => {
    activity = new Activity("test-activity", "Test Activity");
  });

  describe("captureRollupStatus", () => {
    it("should capture current rollup status snapshot", () => {
      // Set up activity state
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.85;
      activity.objectiveSatisfiedStatus = true;
      activity.completionStatus = CompletionStatus.COMPLETED;

      const snapshot = activity.captureRollupStatus();

      expect(snapshot).toEqual({
        measureStatus: true,
        normalizedMeasure: 0.85,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      });
    });

    it("should capture status when measure is not set", () => {
      activity.objectiveMeasureStatus = false;
      activity.objectiveNormalizedMeasure = 0;
      activity.objectiveSatisfiedStatus = null;
      activity.completionStatus = CompletionStatus.UNKNOWN;

      const snapshot = activity.captureRollupStatus();

      expect(snapshot.measureStatus).toBe(false);
      expect(snapshot.normalizedMeasure).toBe(0);
      expect(snapshot.objectiveProgressStatus).toBe(false);
      expect(snapshot.objectiveSatisfiedStatus).toBe(null);
      expect(snapshot.attemptProgressStatus).toBe(false);
      expect(snapshot.attemptCompletionStatus).toBe(false);
    });

    it("should capture partial completion status", () => {
      activity.completionStatus = CompletionStatus.INCOMPLETE;

      const snapshot = activity.captureRollupStatus();

      expect(snapshot.attemptProgressStatus).toBe(true);
      expect(snapshot.attemptCompletionStatus).toBe(false);
    });

    it("should handle objective satisfied status being false", () => {
      activity.objectiveSatisfiedStatus = false;

      const snapshot = activity.captureRollupStatus();

      expect(snapshot.objectiveProgressStatus).toBe(true);
      expect(snapshot.objectiveSatisfiedStatus).toBe(false);
    });

    it("should handle objective satisfied status being undefined", () => {
      activity.objectiveSatisfiedStatus = undefined;

      const snapshot = activity.captureRollupStatus();

      expect(snapshot.objectiveProgressStatus).toBe(false);
      expect(snapshot.objectiveSatisfiedStatus).toBe(undefined);
    });
  });

  describe("compareRollupStatus", () => {
    it("should return true when statuses are identical", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });

    it("should return false when measureStatus differs", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: false,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should return false when normalizedMeasure differs significantly", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.85,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should return true when normalizedMeasure differs within epsilon tolerance", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.750000,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.750001,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });

    it("should return false when objectiveProgressStatus differs", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: false,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should return false when objectiveSatisfiedStatus differs", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: false,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should return false when attemptProgressStatus differs", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: false,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should return false when attemptCompletionStatus differs", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: false,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should handle null values correctly", () => {
      const status1 = {
        measureStatus: false,
        normalizedMeasure: 0,
        objectiveProgressStatus: false,
        objectiveSatisfiedStatus: null,
        attemptProgressStatus: false,
        attemptCompletionStatus: false,
      };

      const status2 = {
        measureStatus: false,
        normalizedMeasure: 0,
        objectiveProgressStatus: false,
        objectiveSatisfiedStatus: null,
        attemptProgressStatus: false,
        attemptCompletionStatus: false,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });

    it("should detect change from null to boolean", () => {
      const status1 = {
        measureStatus: false,
        normalizedMeasure: 0,
        objectiveProgressStatus: false,
        objectiveSatisfiedStatus: null,
        attemptProgressStatus: false,
        attemptCompletionStatus: false,
      };

      const status2 = {
        measureStatus: false,
        normalizedMeasure: 0,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: false,
        attemptCompletionStatus: false,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(false);
    });

    it("should handle epsilon boundary exactly at threshold", () => {
      const EPSILON = 0.0001;
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75 + EPSILON,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      // Should be true because the implementation uses < epsilon, not <= epsilon
      // So difference equal to epsilon is still within tolerance
      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });

    it("should handle epsilon boundary just below threshold", () => {
      const EPSILON = 0.0001;
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 0.75,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 0.75 + (EPSILON * 0.99),
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      // Should be true because difference is less than epsilon
      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });

    it("should handle negative normalized measures", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: -0.5,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: false,
        attemptProgressStatus: true,
        attemptCompletionStatus: false,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: -0.5,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: false,
        attemptProgressStatus: true,
        attemptCompletionStatus: false,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });

    it("should handle very large normalized measures", () => {
      const status1 = {
        measureStatus: true,
        normalizedMeasure: 100.0,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      const status2 = {
        measureStatus: true,
        normalizedMeasure: 100.0,
        objectiveProgressStatus: true,
        objectiveSatisfiedStatus: true,
        attemptProgressStatus: true,
        attemptCompletionStatus: true,
      };

      expect(Activity.compareRollupStatus(status1, status2)).toBe(true);
    });
  });

  describe("integration: capture and compare workflow", () => {
    it("should detect when rollup changes activity status", () => {
      // Initial state
      activity.objectiveMeasureStatus = false;
      activity.objectiveSatisfiedStatus = null;
      activity.completionStatus = CompletionStatus.UNKNOWN;

      const beforeRollup = activity.captureRollupStatus();

      // Simulate rollup updating the activity
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.85;
      activity.objectiveSatisfiedStatus = true;
      activity.completionStatus = CompletionStatus.COMPLETED;

      const afterRollup = activity.captureRollupStatus();

      // Should detect change
      expect(Activity.compareRollupStatus(beforeRollup, afterRollup)).toBe(false);
    });

    it("should detect no change when rollup doesn't affect tracked status", () => {
      // Set initial complete state
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.85;
      activity.objectiveSatisfiedStatus = true;
      activity.completionStatus = CompletionStatus.COMPLETED;

      const beforeRollup = activity.captureRollupStatus();

      // Simulate rollup running but not changing anything
      // (e.g., child status already contributed to parent)

      const afterRollup = activity.captureRollupStatus();

      // Should detect no change
      expect(Activity.compareRollupStatus(beforeRollup, afterRollup)).toBe(true);
    });

    it("should optimize rollup by stopping propagation when status unchanged", () => {
      // This simulates the rollup optimization in RB.1.5
      // Create a tree: root -> parent -> child
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      root.addChild(parent);
      parent.addChild(child);

      // Set stable state for parent
      parent.objectiveMeasureStatus = true;
      parent.objectiveNormalizedMeasure = 0.75;
      parent.objectiveSatisfiedStatus = true;
      parent.completionStatus = CompletionStatus.COMPLETED;

      const parentBefore = parent.captureRollupStatus();

      // Simulate child completing but parent already in final state
      child.completionStatus = CompletionStatus.COMPLETED;

      // Parent status doesn't change
      const parentAfter = parent.captureRollupStatus();

      // No change detected -> optimization can stop propagating to root
      expect(Activity.compareRollupStatus(parentBefore, parentAfter)).toBe(true);
    });
  });
});
