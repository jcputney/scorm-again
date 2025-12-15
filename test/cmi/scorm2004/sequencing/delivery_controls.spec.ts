import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
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
});
