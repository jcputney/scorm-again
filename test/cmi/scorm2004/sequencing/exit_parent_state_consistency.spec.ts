import { beforeEach, describe, expect, it } from "vitest";
import {
  NavigationRequestType,
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("EXIT_PARENT State Consistency (OSP-03)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let root: Activity;
  let child1: Activity;
  let child2: Activity;
  let grandchild1: Activity;
  let grandchild2: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    child1 = new Activity("module1", "Module 1");
    child2 = new Activity("module2", "Module 2");
    grandchild1 = new Activity("lesson1", "Lesson 1");
    grandchild2 = new Activity("lesson2", "Lesson 2");

    root.addChild(child1);
    root.addChild(child2);
    child1.addChild(grandchild1);
    child1.addChild(grandchild2);

    activityTree.root = root;

    // Enable flow for testing
    root.sequencingControls.flow = true;
    root.sequencingControls.choice = true;
    child1.sequencingControls.flow = true;
    child2.sequencingControls.flow = true;

    // Disable auto-completion to test termination logic in isolation
    root.sequencingControls.completionSetByContent = true;
    child1.sequencingControls.completionSetByContent = true;
    child2.sequencingControls.completionSetByContent = true;
    grandchild1.sequencingControls.completionSetByContent = true;
    grandchild2.sequencingControls.completionSetByContent = true;

    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();

    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess
    );
  });

  describe("Plain EXIT current activity state consistency", () => {
    it("should keep the terminated activity current when a post-condition does not trigger", () => {
      // Set up activity with post-condition that will NOT trigger
      const continueRule = grandchild1.sequencingRules.postConditionRules[0] =
        new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      grandchild1.isCompleted = false; // Post-condition won't trigger

      // Navigation request is just EXIT with no sequencing.
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);

      // The old current activity (grandchild1) should be deactivated
      expect(grandchild1.isActive).toBe(false);

      // Current activity remains the just-ended activity.
      expect(activityTree.currentActivity).toBe(grandchild1);

      // Ancestors remain active because they were already active.
      expect(child1.isActive).toBe(true);

      // Root should also remain active (shared ancestor)
      expect(root.isActive).toBe(true);
    });

    it("should maintain consistent state after EXIT with no sequencing request", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(grandchild1);

      // Child1 and root remain active (they were already active as ancestors)
      expect(child1.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should handle EXIT at root as session exit", () => {
      activityTree.currentActivity = root;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      // Root exit should become EXIT_ALL
      expect(root.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should allow subsequent continue navigation after plain EXIT", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      const result1 = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
      expect(result1.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(grandchild1);

      const result2 = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      expect(result2.valid).toBe(true);
      expect(result2.targetActivity).toBe(grandchild2);
    });

    it("should compare behavior: setter activation vs direct assignment", () => {
      // Test 1: Normal setter behavior
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = false;
      root.isActive = false;

      // Setting currentActivity via setter should activate parent chain
      activityTree.currentActivity = child1;
      expect(child1.isActive).toBe(true); // Setter activates
      expect(root.isActive).toBe(true); // Setter activates ancestors

      // Test 2: Direct assignment behavior
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = false;
      root.isActive = false;

      // Direct assignment should NOT activate parent chain
      (activityTree as any)._currentActivity = child1;
      expect(child1.isActive).toBe(false); // Direct assignment does NOT activate
      expect(root.isActive).toBe(false); // Direct assignment does NOT activate ancestors

      // Verify currentActivity is still set correctly
      expect(activityTree.currentActivity).toBe(child1);
    });
  });

  describe("Verification of setter validation bypass rationale", () => {
    it("should confirm setter activates ancestors (the behavior being avoided)", () => {
      activityTree.currentActivity = null;
      grandchild1.isActive = false;
      child1.isActive = false;
      root.isActive = false;

      // When we use the setter, it should activate the activity and all ancestors
      activityTree.currentActivity = grandchild1;

      expect(grandchild1.isActive).toBe(true);
      expect(child1.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should confirm setter deactivates old current and its ancestors", () => {
      // Set up: grandchild1 is current and active
      activityTree.currentActivity = grandchild1;
      expect(grandchild1.isActive).toBe(true);
      expect(child1.isActive).toBe(true);
      expect(root.isActive).toBe(true);

      // Now switch to grandchild2 using the setter
      activityTree.currentActivity = grandchild2;

      // Old current (grandchild1) should be deactivated
      expect(grandchild1.isActive).toBe(false);

      // New current (grandchild2) and its ancestors should be active
      expect(grandchild2.isActive).toBe(true);
      expect(child1.isActive).toBe(true); // Still active (shared ancestor)
      expect(root.isActive).toBe(true); // Still active (shared ancestor)
    });

    it("should demonstrate the non-activating current activity helper", () => {
      // Scenario: a sequencing action needs to set a new current activity
      // without activating that activity or its ancestors.

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      // Terminate grandchild1
      grandchild1.isActive = false;

      // Now we want to set child1 as current WITHOUT activating it.
      // If we use the setter:
      // activityTree.currentActivity = child1;
      // This would activate child1 and root, which is wrong after termination

      activityTree.setCurrentActivityWithoutActivation(child1);

      // Verify: child1 is current and REMAINS active (it was already active)
      // The method preserves the active state of the new current
      expect(activityTree.currentActivity).toBe(child1);
      expect(child1.isActive).toBe(true); // Preserved from before
    });
  });

  describe("Alternative solutions to direct assignment", () => {
    it("should demonstrate the deactivation logic needed by non-activating assignment", () => {
      // Current state
      activityTree.currentActivity = grandchild1;
      expect(grandchild1.isActive).toBe(true);

      // We want to change current to child1 WITHOUT activating it
      const desiredCurrent = child1;

      // Manual implementation of what the method would do:
      // 1. Deactivate old current and ancestors
      if (activityTree.currentActivity) {
        activityTree.currentActivity.isActive = false;
        let ancestor = activityTree.currentActivity.parent;
        while (ancestor) {
          ancestor.isActive = false;
          ancestor = ancestor.parent;
        }
      }

      // 2. Set new current WITHOUT activating it
      (activityTree as any)._currentActivity = desiredCurrent;

      // 3. Verify the result
      expect(activityTree.currentActivity).toBe(child1);
      expect(child1.isActive).toBe(false);
      expect(grandchild1.isActive).toBe(false);
      expect(root.isActive).toBe(false);

      // This demonstrates that direct assignment is missing the deactivation logic
    });
  });

  describe("Impact analysis: non-activating current activity assignment", () => {
    it("should preserve old current deactivation when setting current without activation", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      grandchild1.isActive = false;
      activityTree.setCurrentActivityWithoutActivation(child1);

      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(child1);
      expect(child1.isActive).toBe(true);
    });

    it("should verify the actual state after plain EXIT with no sequencing request", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(grandchild1);
      expect(grandchild1.isActive).toBe(false);
      expect(child1.isActive).toBe(true);
    });
  });
});
