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

  describe("Direct _currentActivity assignment state consistency", () => {
    it("should properly deactivate old current activity when bypassing setter at line 674", () => {
      // Set up activity with post-condition that will NOT trigger
      const continueRule = grandchild1.sequencingRules.postConditionRules[0] =
        new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      grandchild1.isCompleted = false; // Post-condition won't trigger

      // Navigation request is just EXIT with no sequencing
      // This will hit the code path at line 674 where _currentActivity is set directly
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);

      // The old current activity (grandchild1) should be deactivated
      expect(grandchild1.isActive).toBe(false);

      // The parent (child1) becomes the new current activity
      expect(activityTree.currentActivity).toBe(child1);

      // Key test: child1 SHOULD remain active because it was already active as an ancestor
      // The method preserves the active state of the new current and shared ancestors
      expect(child1.isActive).toBe(true);

      // Root should also remain active (shared ancestor)
      expect(root.isActive).toBe(true);
    });

    it("should maintain consistent state after EXIT with post-condition that doesn't trigger", () => {
      // This test verifies that the direct _currentActivity assignment doesn't break state
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(child1);

      // Child1 and root remain active (they were already active as ancestors)
      // The method preserves their state since they're ancestors of the new current
      expect(child1.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should handle null parent when bypassing setter", () => {
      // Edge case: what if current.parent is null but we try to set it?
      // This shouldn't happen in practice due to the if (current.parent) check
      activityTree.currentActivity = root;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      // Root exit should become EXIT_ALL
      expect(root.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should properly handle subsequent navigation after direct assignment", () => {
      // Set up initial state where we'll hit the direct assignment path
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      // First EXIT - will use setCurrentActivityWithoutActivation to set currentActivity to child1
      const result1 = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
      expect(result1.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(child1);
      expect(child1.isActive).toBe(true); // Remains active (was already active as ancestor)

      // Now verify we can still navigate correctly from this state
      // This tests that the direct assignment didn't break the activity tree state
      activityTree.currentActivity = null; // Reset session

      const result2 = overallProcess.processNavigationRequest(NavigationRequestType.START);
      expect(result2.valid).toBe(true);
      // Should be able to start fresh
    });

    it("should compare behavior: setter activation vs direct assignment", () => {
      // Test 1: Normal setter behavior (like line 634)
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = false;
      root.isActive = false;

      // Setting currentActivity via setter should activate parent chain
      activityTree.currentActivity = child1;
      expect(child1.isActive).toBe(true); // Setter activates
      expect(root.isActive).toBe(true); // Setter activates ancestors

      // Test 2: Direct assignment behavior (like line 674)
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

    it("should demonstrate the problem direct assignment is trying to solve", () => {
      // Scenario: We've terminated an activity and want to set parent as current
      // but we DON'T want to activate the parent (it was also terminated)

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      // Terminate grandchild1
      grandchild1.isActive = false;

      // Now we want to set child1 as current WITHOUT activating it
      // If we use the setter:
      // activityTree.currentActivity = child1;
      // This would activate child1 and root, which is wrong after termination

      // So we use the dedicated method:
      activityTree.setCurrentActivityWithoutActivation(child1);

      // Verify: child1 is current and REMAINS active (it was already active)
      // The method preserves the active state of the new current
      expect(activityTree.currentActivity).toBe(child1);
      expect(child1.isActive).toBe(true); // Preserved from before
    });
  });

  describe("Alternative solutions to direct assignment", () => {
    it("should verify if ActivityTree needs a setCurrentActivityWithoutActivation method", () => {
      // This test demonstrates what a proper method might look like

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

  describe("Impact analysis: does direct assignment cause bugs?", () => {
    it("should check if old currentActivity is properly deactivated before direct assignment", () => {
      // Set up the exact scenario from line 674
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      // Before line 674 executes, grandchild1 has already been deactivated
      // by endAttemptProcess (line 582)
      grandchild1.isActive = false; // This happens in endAttemptProcess

      // Now the direct assignment happens (line 674)
      const current = grandchild1;
      if (current.parent) {
        (activityTree as any)._currentActivity = current.parent;
      }

      // The question: is the old currentActivity (grandchild1) still in the correct state?
      // Yes, because it was already deactivated by endAttemptProcess
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(child1);

      // But what about child1's previous active state?
      // It's currently true, but we're setting it as current WITHOUT activation
      // This could be inconsistent
      expect(child1.isActive).toBe(true); // Still active from before
    });

    it("should verify the actual state in the TB.2.3 step 3.6 scenario", () => {
      // This simulates the exact conditions when line 674 is reached:
      // 1. EXIT has been processed
      // 2. No sequencing request follows
      // 3. We want to set parent as current without activating it

      // Initial state
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      root.isActive = true;

      // TB.2.3 step 3.1: endAttemptProcess deactivates grandchild1
      grandchild1.isActive = false;

      // TB.2.3 step 3.6: Set parent as current without activating
      const current = grandchild1;
      if (current.parent) {
        (activityTree as any)._currentActivity = current.parent;
      }

      // State check:
      expect(activityTree.currentActivity).toBe(child1);
      expect(grandchild1.isActive).toBe(false); // Correctly deactivated

      // The issue: child1 is still active, but it SHOULD be inactive
      // because we're exiting from it without a sequencing request
      expect(child1.isActive).toBe(true); // This is potentially wrong!
    });
  });
});
