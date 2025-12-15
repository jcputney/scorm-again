import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { OverallSequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

describe("Delivery Controls", () => {
  describe("tracked property", () => {
    it("should default tracked to true", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      expect(activity.sequencingControls.tracked).toBe(true);
    });

    it("should allow setting tracked to false", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.tracked = false;
      expect(activity.sequencingControls.tracked).toBe(false);
    });

    it("should exclude non-tracked activities from rollup", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const tracked = new Activity({ id: "tracked", title: "Tracked" });
      const notTracked = new Activity({ id: "notTracked", title: "Not Tracked" });

      tree.root = root;
      root.addChild(tracked);
      root.addChild(notTracked);

      // Set notTracked to not be tracked
      notTracked.sequencingControls.tracked = false;

      // Complete both children
      tracked.completionStatus = CompletionStatus.COMPLETED;
      tracked.successStatus = SuccessStatus.PASSED;
      tracked.objectiveSatisfiedStatus = true;
      notTracked.completionStatus = CompletionStatus.INCOMPLETE; // Should be ignored
      notTracked.successStatus = SuccessStatus.FAILED; // Should be ignored
      notTracked.objectiveSatisfiedStatus = false; // Should be ignored

      // Run rollup
      const rollupProcess = new RollupProcess();
      rollupProcess.overallRollupProcess(tracked);

      // Parent should be completed (only tracked child counts)
      expect(root.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(root.successStatus).toBe(SuccessStatus.PASSED);
    });
  });

  describe("completionSetByContent property", () => {
    it("should default completionSetByContent to false", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      expect(activity.sequencingControls.completionSetByContent).toBe(false);
    });

    it("should auto-complete activity when completionSetByContent=false and content doesn't set completion", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(leaf);

      // completionSetByContent is false by default
      leaf.completionStatus = CompletionStatus.UNKNOWN;

      const process = new OverallSequencingProcess(tree);
      process.applyDeliveryControls(leaf);

      expect(leaf.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(leaf.wasAutoCompleted).toBe(true);
    });

    it("should NOT auto-complete when completionSetByContent=true", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.completionSetByContent = true;
      activity.completionStatus = CompletionStatus.UNKNOWN;

      const process = new OverallSequencingProcess(new ActivityTree());
      process.applyDeliveryControls(activity);

      expect(activity.completionStatus).toBe(CompletionStatus.UNKNOWN);
      expect(activity.wasAutoCompleted).toBe(false);
    });

    it("should NOT auto-complete when completion is already set", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.completionSetByContent = false;
      activity.completionStatus = CompletionStatus.INCOMPLETE;

      const process = new OverallSequencingProcess(new ActivityTree());
      process.applyDeliveryControls(activity);

      expect(activity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(activity.wasAutoCompleted).toBe(false);
    });
  });

  describe("objectiveSetByContent property", () => {
    it("should default objectiveSetByContent to false", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      expect(activity.sequencingControls.objectiveSetByContent).toBe(false);
    });

    it("should auto-satisfy activity when objectiveSetByContent=false and content doesn't set success", () => {
      const tree = new ActivityTree();
      const leaf = new Activity({ id: "leaf", title: "Leaf" });
      tree.root = leaf;

      // objectiveSetByContent is false by default
      leaf.successStatus = SuccessStatus.UNKNOWN;

      const process = new OverallSequencingProcess(tree);
      process.applyDeliveryControls(leaf);

      expect(leaf.successStatus).toBe(SuccessStatus.PASSED);
      expect(leaf.wasAutoSatisfied).toBe(true);
    });

    it("should NOT auto-satisfy when objectiveSetByContent=true", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.objectiveSetByContent = true;
      activity.successStatus = SuccessStatus.UNKNOWN;

      const process = new OverallSequencingProcess(new ActivityTree());
      process.applyDeliveryControls(activity);

      expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN);
      expect(activity.wasAutoSatisfied).toBe(false);
    });

    it("should NOT auto-satisfy when success is already set", () => {
      const activity = new Activity({ id: "test", title: "Test" });
      activity.sequencingControls.objectiveSetByContent = false;
      activity.successStatus = SuccessStatus.FAILED;

      const process = new OverallSequencingProcess(new ActivityTree());
      process.applyDeliveryControls(activity);

      expect(activity.successStatus).toBe(SuccessStatus.FAILED);
      expect(activity.wasAutoSatisfied).toBe(false);
    });
  });
});
