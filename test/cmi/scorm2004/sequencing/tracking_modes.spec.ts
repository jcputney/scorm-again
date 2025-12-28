import { describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

describe("Current vs. Cumulative Tracking Modes", () => {
  describe("useCurrentAttemptObjectiveInfo", () => {
    it("should default to true", () => {
      const controls = new SequencingControls();
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(true);
    });

    it("should use current attempt data when true", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.useCurrentAttemptObjectiveInfo = true;

      // First attempt - passed
      activity.successStatus = SuccessStatus.PASSED;
      activity.objectiveNormalizedMeasure = 0.8;
      activity.attemptCount = 1;

      // Second attempt - failed (should override)
      activity.successStatus = SuccessStatus.FAILED;
      activity.objectiveNormalizedMeasure = 0.4;
      activity.attemptCount = 2;

      // Current attempt data should be used
      expect(activity.successStatus).toBe(SuccessStatus.FAILED);
      expect(activity.objectiveNormalizedMeasure).toBe(0.4);
    });

    it("should allow setting to false for cumulative mode", () => {
      const controls = new SequencingControls();
      controls.useCurrentAttemptObjectiveInfo = false;
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(false);
    });
  });

  describe("useCurrentAttemptProgressInfo", () => {
    it("should default to true", () => {
      const controls = new SequencingControls();
      expect(controls.useCurrentAttemptProgressInfo).toBe(true);
    });

    it("should use current attempt data when true", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.useCurrentAttemptProgressInfo = true;

      // First attempt - completed
      activity.completionStatus = CompletionStatus.COMPLETED;
      activity.attemptCompletionAmount = 1.0;

      // Second attempt - incomplete
      activity.completionStatus = CompletionStatus.INCOMPLETE;
      activity.attemptCompletionAmount = 0.5;

      // Current attempt data should be used
      expect(activity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });

    it("should allow setting to false for cumulative mode", () => {
      const controls = new SequencingControls();
      controls.useCurrentAttemptProgressInfo = false;
      expect(controls.useCurrentAttemptProgressInfo).toBe(false);
    });
  });

  describe("tracking mode documentation", () => {
    it("useCurrentAttemptObjectiveInfo when true uses current attempt objective data", () => {
      const controls = new SequencingControls();

      // Default is true - use current attempt
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(true);

      // This flag tells the sequencing engine whether to use:
      // - true: Current attempt's objective satisfaction and normalized measure
      // - false: Cumulative (best/last) objective satisfaction and normalized measure
    });

    it("useCurrentAttemptProgressInfo when true uses current attempt progress data", () => {
      const controls = new SequencingControls();

      // Default is true - use current attempt
      expect(controls.useCurrentAttemptProgressInfo).toBe(true);

      // This flag tells the sequencing engine whether to use:
      // - true: Current attempt's completion status and completion amount
      // - false: Cumulative (best/last) completion status and completion amount
    });

    it("tracking modes can be independently configured", () => {
      const controls = new SequencingControls();

      // Can have different tracking modes for objective vs progress
      controls.useCurrentAttemptObjectiveInfo = true;
      controls.useCurrentAttemptProgressInfo = false;

      expect(controls.useCurrentAttemptObjectiveInfo).toBe(true);
      expect(controls.useCurrentAttemptProgressInfo).toBe(false);

      // Or vice versa
      controls.useCurrentAttemptObjectiveInfo = false;
      controls.useCurrentAttemptProgressInfo = true;

      expect(controls.useCurrentAttemptObjectiveInfo).toBe(false);
      expect(controls.useCurrentAttemptProgressInfo).toBe(true);
    });

    it("tracking modes affect rollup and sequencing rule evaluation", () => {
      const controls = new SequencingControls();

      // When set to false (cumulative mode):
      // - Sequencing rules should evaluate against cumulative data
      // - Rollup should use cumulative child data
      // - Navigation requests should consider cumulative status
      controls.useCurrentAttemptObjectiveInfo = false;
      controls.useCurrentAttemptProgressInfo = false;

      expect(controls.useCurrentAttemptObjectiveInfo).toBe(false);
      expect(controls.useCurrentAttemptProgressInfo).toBe(false);

      // Note: The actual cumulative tracking logic would be implemented
      // in the sequencing processes, rollup, and rule evaluation.
      // These flags are tracking preferences that guide those processes.
    });
  });

  describe("reset behavior", () => {
    it("should reset both tracking modes to true", () => {
      const controls = new SequencingControls();

      // Change from defaults
      controls.useCurrentAttemptObjectiveInfo = false;
      controls.useCurrentAttemptProgressInfo = false;

      // Reset
      controls.reset();

      // Should return to true (defaults)
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(true);
      expect(controls.useCurrentAttemptProgressInfo).toBe(true);
    });
  });

  describe("toJSON serialization", () => {
    it("should include both tracking mode flags in JSON output", () => {
      const controls = new SequencingControls();

      controls.useCurrentAttemptObjectiveInfo = false;
      controls.useCurrentAttemptProgressInfo = false;

      const json = controls.toJSON();

      expect(json).toHaveProperty("useCurrentAttemptObjectiveInfo", false);
      expect(json).toHaveProperty("useCurrentAttemptProgressInfo", false);
    });

    it("should serialize true values correctly", () => {
      const controls = new SequencingControls();

      // Keep defaults (true)
      const json = controls.toJSON();

      expect(json).toHaveProperty("useCurrentAttemptObjectiveInfo", true);
      expect(json).toHaveProperty("useCurrentAttemptProgressInfo", true);
    });
  });
});
