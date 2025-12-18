import {beforeEach, describe, expect, it} from "vitest";
import {Activity, ActivityObjective} from "../../../../src/cmi/scorm2004/sequencing/activity";
import {SequencingControls} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import {ActivityTree} from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {SequencingProcess} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {RollupProcess} from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {ADLNav} from "../../../../src/cmi/scorm2004/adl";
import {SequencingRules} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Auto-Completion and Auto-Satisfaction Logic", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overallSequencingProcess: OverallSequencingProcess;
  let adlNav: ADLNav;
  let leafActivity: Activity;

  beforeEach(() => {
    // Create a simple activity tree with a root and one leaf
    const root = new Activity("root", "Root Activity");
    leafActivity = new Activity("leaf1", "Leaf Activity 1");

    // Create primary objective for leaf activity
    const primaryObjective = new ActivityObjective("obj1", {isPrimary: true});
    leafActivity.primaryObjective = primaryObjective;

    root.addChild(leafActivity);

    activityTree = new ActivityTree();
    activityTree.root = root;

    const sequencingRules = new SequencingRules();
    const sequencingControls = new SequencingControls();

    adlNav = new ADLNav();

    sequencingProcess = new SequencingProcess(
        activityTree,
        sequencingRules,
        sequencingControls,
        adlNav
    );

    rollupProcess = new RollupProcess();

    overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav
    );
  });

  describe("Auto-Completion Logic", () => {
    it("should auto-complete when completionSetByContent=false and content doesn't set status", () => {
      // Setup: completionSetByContent defaults to false
      leafActivity.sequencingControls.completionSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.attemptProgressStatus = false; // Content did NOT set completion

      // Simulate end attempt through private method access
      // We'll use a workaround to test this
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify auto-completion occurred
      expect(leafActivity.completionStatus).toBe("completed");
      expect(leafActivity.attemptProgressStatus).toBe(true);
      expect(leafActivity.wasAutoCompleted).toBe(true);
    });

    it("should NOT auto-complete when completionSetByContent=false but content sets status", () => {
      // Setup
      leafActivity.sequencingControls.completionSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.completionStatus = "incomplete";
      leafActivity.attemptProgressStatus = true; // Content DID set completion

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Status should remain as set by content
      expect(leafActivity.completionStatus).toBe("incomplete");
      expect(leafActivity.wasAutoCompleted).toBe(false);
    });

    it("should NOT auto-complete when completionSetByContent=true", () => {
      // Setup
      leafActivity.sequencingControls.completionSetByContent = true;
      leafActivity.isActive = true;
      leafActivity.attemptProgressStatus = false; // Content did NOT set completion

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Should NOT auto-complete, should default to incomplete
      expect(leafActivity.completionStatus).toBe("incomplete");
      expect(leafActivity.wasAutoCompleted).toBe(false);
    });

    it("should NOT auto-complete suspended activities", () => {
      // Setup
      leafActivity.sequencingControls.completionSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.isSuspended = true; // Activity is suspended
      leafActivity.attemptProgressStatus = false;

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Suspended activities should NOT be auto-completed
      expect(leafActivity.completionStatus).toBe("incomplete");
      expect(leafActivity.wasAutoCompleted).toBe(false);
    });

    it("should NOT auto-complete cluster activities (only leaves)", () => {
      // Setup: Use the root activity which has children
      const root = activityTree.root!;
      root.sequencingControls.completionSetByContent = false;
      root.isActive = true;
      root.attemptProgressStatus = false;

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, root);

      // Verify: Cluster activities rely on rollup, not auto-completion
      expect(root.wasAutoCompleted).toBe(false);
    });

    it("should respect explicit incomplete status set by content", () => {
      // Setup
      leafActivity.sequencingControls.completionSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.completionStatus = "incomplete"; // Content explicitly set incomplete
      leafActivity.attemptProgressStatus = true; // Content DID set status

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Should respect content's explicit "incomplete"
      expect(leafActivity.completionStatus).toBe("incomplete");
      expect(leafActivity.wasAutoCompleted).toBe(false);
    });
  });

  describe("Auto-Satisfaction Logic", () => {
    it("should auto-satisfy when objectiveSetByContent=false and content doesn't set status", () => {
      // Setup
      leafActivity.sequencingControls.objectiveSetByContent = false;
      leafActivity.isActive = true;

      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.progressStatus = false; // Content did NOT set objective status

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify auto-satisfaction occurred
      expect(primaryObjective.satisfiedStatus).toBe(true);
      expect(primaryObjective.progressStatus).toBe(true);
      expect(leafActivity.objectiveSatisfiedStatus).toBe(true);
      expect(leafActivity.successStatus).toBe("passed");
      expect(leafActivity.wasAutoSatisfied).toBe(true);
    });

    it("should NOT auto-satisfy when objectiveSetByContent=false but content sets status", () => {
      // Setup
      leafActivity.sequencingControls.objectiveSetByContent = false;
      leafActivity.isActive = true;

      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.satisfiedStatus = false;
      primaryObjective.progressStatus = true; // Content DID set objective status
      leafActivity.successStatus = "failed";

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Status should remain as set by content
      expect(primaryObjective.satisfiedStatus).toBe(false);
      expect(leafActivity.successStatus).toBe("failed");
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });

    it("should NOT auto-satisfy when objectiveSetByContent=true", () => {
      // Setup
      leafActivity.sequencingControls.objectiveSetByContent = true;
      leafActivity.isActive = true;

      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.progressStatus = false; // Content did NOT set status

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Should NOT auto-satisfy
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });

    it("should NOT auto-satisfy suspended activities", () => {
      // Setup
      leafActivity.sequencingControls.objectiveSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.isSuspended = true; // Activity is suspended

      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.progressStatus = false;

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Suspended activities should NOT be auto-satisfied
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });

    it("should NOT auto-satisfy cluster activities", () => {
      // Setup: Use the root activity which has children
      const root = activityTree.root!;
      root.sequencingControls.objectiveSetByContent = false;
      root.isActive = true;

      // Create primary objective for root
      const primaryObjective = new ActivityObjective("rootObj", {isPrimary: true});
      root.primaryObjective = primaryObjective;
      primaryObjective.progressStatus = false;

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, root);

      // Verify: Cluster activities rely on rollup, not auto-satisfaction
      expect(root.wasAutoSatisfied).toBe(false);
    });
  });

  describe("Combined Auto-Completion and Auto-Satisfaction", () => {
    it("should auto-complete AND auto-satisfy when both conditions are met", () => {
      // Setup
      leafActivity.sequencingControls.completionSetByContent = false;
      leafActivity.sequencingControls.objectiveSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.attemptProgressStatus = false;

      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.progressStatus = false;

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify both occurred
      expect(leafActivity.completionStatus).toBe("completed");
      expect(leafActivity.wasAutoCompleted).toBe(true);
      expect(leafActivity.successStatus).toBe("passed");
      expect(leafActivity.wasAutoSatisfied).toBe(true);
    });

    it("should auto-complete but NOT auto-satisfy when only completion conditions are met", () => {
      // Setup
      leafActivity.sequencingControls.completionSetByContent = false;
      leafActivity.sequencingControls.objectiveSetByContent = false;
      leafActivity.isActive = true;
      leafActivity.attemptProgressStatus = false;

      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.progressStatus = true; // Content DID set objective

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify
      expect(leafActivity.completionStatus).toBe("completed");
      expect(leafActivity.wasAutoCompleted).toBe(true);
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });
  });

  describe("Activity State Management", () => {
    it("should reset attemptProgressStatus on activity reset", () => {
      // Setup
      leafActivity.attemptProgressStatus = true;
      leafActivity.wasAutoCompleted = true;
      leafActivity.wasAutoSatisfied = true;

      // Execute
      leafActivity.reset();

      // Verify
      expect(leafActivity.attemptProgressStatus).toBe(false);
      expect(leafActivity.wasAutoCompleted).toBe(false);
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });

    it("should reset progressStatus on objective reset", () => {
      // Setup
      const objective = leafActivity.primaryObjective!;
      objective.progressStatus = true;

      // Execute
      objective.resetState();

      // Verify
      expect(objective.progressStatus).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle activity without primary objective gracefully", () => {
      // Setup: Remove primary objective
      leafActivity.primaryObjective = null;
      leafActivity.sequencingControls.objectiveSetByContent = false;
      leafActivity.isActive = true;

      // Execute - should not throw
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      expect(() => {
        endAttemptProcess.call(overallSequencingProcess, leafActivity);
      }).not.toThrow();

      // Verify: No auto-satisfaction since there's no objective
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });

    it("should handle inactive activity gracefully", () => {
      // Setup
      leafActivity.isActive = false;
      leafActivity.sequencingControls.completionSetByContent = false;

      // Execute
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, leafActivity);

      // Verify: Should return early, no changes
      expect(leafActivity.wasAutoCompleted).toBe(false);
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });
  });

  describe("Default Values", () => {
    it("should have completionSetByContent default to false", () => {
      const controls = new SequencingControls();
      expect(controls.completionSetByContent).toBe(false);
    });

    it("should have objectiveSetByContent default to false", () => {
      const controls = new SequencingControls();
      expect(controls.objectiveSetByContent).toBe(false);
    });

    it("should have attemptProgressStatus default to false on new activity", () => {
      const newActivity = new Activity("test", "Test Activity");
      expect(newActivity.attemptProgressStatus).toBe(false);
    });

    it("should have progressStatus default to false on new objective", () => {
      const objective = new ActivityObjective("test");
      expect(objective.progressStatus).toBe(false);
    });
  });
});
