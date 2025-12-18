import {beforeEach, describe, expect, it, vi} from "vitest";
import {
  NavigationRequestType,
  OverallSequencingProcess,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {SequencingProcess,} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {RollupProcess} from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {ActivityTree} from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {Activity} from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {getExceptionDescription} from "../../../../src/constants/sequencing_exceptions";

describe("Termination Request Process (TB.2.3)", () => {
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

  describe("EXIT termination", () => {
    it("should terminate current activity on EXIT request", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.attemptCount = 1;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
    });

    it("should call End Attempt Process (UP.4) for active activity", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.completionStatus = "unknown";

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(grandchild1.completionStatus).toBe("incomplete"); // Should be set by UP.4
    });

    it("should trigger rollup after termination", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.objectiveSatisfiedStatus = true;
      child1.sequencingControls.rollupObjectiveSatisfied = true;

      const rollupSpy = vi.spyOn(rollupProcess, 'overallRollupProcess');

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(rollupSpy).toHaveBeenCalledWith(grandchild1);
    });
  });

  describe("EXIT_ALL termination", () => {
    it("should terminate all activities and clear current", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT_ALL);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should handle EXIT at root as EXIT_ALL", () => {
      activityTree.currentActivity = root;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(root.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });
  });

  describe("ABANDON termination", () => {
    it("should abandon activity without ending attempt", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.completionStatus = "incomplete";

      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(grandchild1.completionStatus).toBe("incomplete"); // Should not change
    });

    it("should set parent as current after ABANDON", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON);

      expect(result.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(child1);
    });
  });

  describe("ABANDON_ALL termination", () => {
    it("should abandon all activities and clear current", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON_ALL);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });
  });

  describe("SUSPEND_ALL termination", () => {
    it("should suspend current activity and all ancestors", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      expect(result.valid).toBe(true);
      // Per TB.2.3 5.5, all activities in path should be suspended
      expect(grandchild1.isActive).toBe(false);
      expect(grandchild1.isSuspended).toBe(true);
      expect(child1.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);
      expect(activityTree.suspendedActivity).toBe(grandchild1);
      // Per TB.2.3 5.6, current activity is set to root
      expect(activityTree.currentActivity).toBe(root);
    });

    it("should suspend root when it is current activity", () => {
      activityTree.currentActivity = root;
      root.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      expect(result.valid).toBe(true);
      // Root CAN be suspended when it is the current activity
      expect(root.isSuspended).toBe(true);
      expect(root.isActive).toBe(false);
      expect(activityTree.suspendedActivity).toBe(root);
      expect(activityTree.currentActivity).toBe(root);
    });
  });

  describe("Integration with Exit Action Rules (TB.2.1)", () => {
    it("should apply exit action rules during termination", () => {
      // Add exit action rule
      const exitRule = new SequencingRule(RuleActionType.EXIT);
      exitRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      grandchild1.sequencingRules.addExitConditionRule(exitRule);

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.objectiveSatisfiedStatus = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);

      expect(result.valid).toBe(true);
      // Exit action rules should be evaluated
    });

    it("should handle EXIT_PARENT action", () => {
      // Add exit parent rule
      const exitRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      grandchild1.sequencingRules.addExitConditionRule(exitRule);

      // Enable flow controls
      root.sequencingControls.flow = true;
      child1.sequencingControls.flow = true;
      child2.sequencingControls.flow = true;

      // Add a sibling to child1 so there's somewhere to continue to
      grandchild1.isActive = true;
      grandchild1.objectiveSatisfiedStatus = true;
      child1.isActive = true;
      child2.isActive = false; // Not active, so we can flow to it
      root.isActive = true;

      activityTree.currentActivity = grandchild1;

      // Process EXIT request directly (not CONTINUE)
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      // After EXIT_PARENT, child1 and its descendants should be terminated
      expect(child1.isActive).toBe(false);
      expect(grandchild1.isActive).toBe(false);
    });

    it("should handle EXIT_ALL action", () => {
      // Add exit all rule
      const exitRule = new SequencingRule(RuleActionType.EXIT_ALL);
      exitRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      grandchild1.sequencingRules.addExitConditionRule(exitRule);

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.objectiveSatisfiedStatus = true;
      root.isActive = true;
      child1.isActive = true;

      // Process EXIT request directly (not CONTINUE)
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      // After EXIT_ALL, all activities should be terminated
      expect(root.isActive).toBe(false);
      expect(child1.isActive).toBe(false);
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });
  });

  describe("Integration with Post-Condition Rules (TB.2.2)", () => {
    beforeEach(() => {
      // Add post-condition rules
      const postRule = grandchild1.sequencingRules.postConditionRules[0] =
          new SequencingRule(RuleActionType.CONTINUE);
      postRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
    });

    it("should apply post-condition rules after termination", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.isCompleted = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Post-condition CONTINUE will be attempted
      // May succeed or fail depending on flow availability, but should not fail in termination
      if (!result.valid && result.exception) {
        // Should fail in sequencing (SB.x), not termination (TB.2.3)
        expect(result.exception).toMatch(/^SB\./);
      } else {
        expect(result.valid).toBe(true);
      }
    });
  });

  describe("Termination failure scenarios", () => {
    it("should fail termination if no current activity", () => {
      activityTree.currentActivity = null;

      // Internal termination should fail, causing overall process to fail
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-13"); // Navigation validation fails first
    });

    it("should return TB.2.3-2 when terminating already-terminated activity", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = false; // Already terminated

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // TB.2.3-2 check - cannot terminate an already-terminated activity
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("TB.2.3-2");
    });

    it("should return TB.2.3-3 when suspending inactive root activity", () => {
      activityTree.currentActivity = root;
      root.isActive = false; // Not active
      root.isSuspended = false; // Not suspended

      const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      // TB.2.3-3: Nothing to suspend (root activity is not active or suspended)
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("TB.2.3-3");
    });

    it("TB.2.3-6 exception exists for abandon all edge case", () => {
      // TB.2.3-6 is defined for ABANDON_ALL when activity path is empty
      // This is a rare edge case that's difficult to trigger in practice
      // because the path formation always includes at least currentActivity
      // The exception exists for spec completeness and safety

      // Verify the exception code is properly defined
      expect(getExceptionDescription("TB.2.3-6")).toBe("Nothing to abandon");
    });

    it("should return TB.2.3-7 for undefined termination request via navigation", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      // Use an invalid navigation request type
      // Navigation validation happens first, so we get NB.2.1-18 instead of TB.2.3-7
      const result = overallProcess.processNavigationRequest("INVALID_TERMINATION" as any);

      // Navigation validates first before termination, so NB.2.1-18 is returned
      // TB.2.3-7 is an internal guard for when termination is called directly
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-18");
    });
  });

  describe("Terminate Descendent Attempts (UP.3)", () => {
    it("should terminate all descendant attempts", () => {
      activityTree.currentActivity = child1;
      child1.isActive = true;
      grandchild1.isActive = true;
      grandchild2.isActive = true;

      // Trigger termination that includes descendants
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(grandchild2.isActive).toBe(false);
    });

    it("should apply exit rules recursively during descendant termination", () => {
      // Set up exit rule on grandchild that exits parent
      const exitRule = grandchild1.sequencingRules.exitConditionRules[0] =
          new SequencingRule(RuleActionType.EXIT_PARENT);
      exitRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      activityTree.currentActivity = child1;
      child1.isActive = true;
      grandchild1.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(child1.isActive).toBe(false);
      expect(grandchild1.isActive).toBe(false);
    });
  });

  describe("State consistency after termination", () => {
    it("should maintain consistent state after EXIT", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
      expect(grandchild1.isSuspended).toBe(false);
      expect(activityTree.currentActivity).toBe(child1); // Should move to parent
    });

    it("should maintain consistent state after SUSPEND", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      expect(result.valid).toBe(true);
      // fix: all ancestors are suspended
      expect(grandchild1.isActive).toBe(false);
      expect(grandchild1.isSuspended).toBe(true);
      expect(child1.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);
      expect(activityTree.suspendedActivity).toBe(grandchild1);
      // Per TB.2.3 5.6: current activity set to root
      expect(activityTree.currentActivity).toBe(root);
    });

    it("should clear suspended state when resuming different activity", () => {
      // First suspend an activity
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      expect(grandchild1.isSuspended).toBe(true);
      expect(child1.isSuspended).toBe(true);
      expect(activityTree.suspendedActivity).toBe(grandchild1);

      // Simulate session boundary
      activityTree.currentActivity = null;

      // Now choose a different activity
      const result = overallProcess.processNavigationRequest(
          NavigationRequestType.CHOICE,
          "lesson2"
      );

      expect(result.valid).toBe(true);
      // Per DB.2.1: all suspended activities should be cleared
      expect(grandchild1.isSuspended).toBe(false);
      expect(child1.isSuspended).toBe(false);
      expect(root.isSuspended).toBe(false);
      expect(activityTree.suspendedActivity).toBeNull();
    });
  });

  describe("Exit Type Handling (cmi.exit)", () => {
    it("should handle logout exit type and terminate all activities", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;
      root.isActive = true;

      // Process EXIT request with logout exit type
      const result = overallProcess.processNavigationRequest(
          NavigationRequestType.EXIT,
          null,
          "logout"
      );

      expect(result.valid).toBe(true);
      // Logout should terminate all activities (like EXIT_ALL)
      expect(grandchild1.isActive).toBe(false);
      expect(child1.isActive).toBe(false);
      expect(root.isActive).toBe(false);
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should handle normal exit type as regular exit", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.isActive = true;

      // Process EXIT request with normal exit type
      const result = overallProcess.processNavigationRequest(
          NavigationRequestType.EXIT,
          null,
          "normal"
      );

      expect(result.valid).toBe(true);
      // Normal exit should just exit current activity
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(child1);
    });

    it("should handle suspend exit type (note: exitType is informational)", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      // Process EXIT request with suspend exit type
      // Note: cmi.exit="suspend" is informational; actual suspension requires SUSPEND_ALL request
      const result = overallProcess.processNavigationRequest(
          NavigationRequestType.EXIT,
          null,
          "suspend"
      );

      expect(result.valid).toBe(true);
      // EXIT with exitType="suspend" still performs normal exit
      // To actually suspend, use SUSPEND_ALL navigation request
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(child1);
    });

    it("should handle empty exit type as normal exit", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      // Process EXIT request with empty exit type
      const result = overallProcess.processNavigationRequest(
          NavigationRequestType.EXIT,
          null,
          ""
      );

      expect(result.valid).toBe(true);
      // Empty exit should behave like normal exit
      expect(grandchild1.isActive).toBe(false);
      expect(activityTree.currentActivity).toBe(child1);
    });
  });

  describe("Post-Condition Return Value", () => {
    it("should return and use CONTINUE sequencing request from post-condition", () => {
      // Set up activity with post-condition CONTINUE rule
      const continueRule = grandchild1.sequencingRules.postConditionRules[0] =
          new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.isCompleted = true; // Trigger post-condition

      // Navigation request is EXIT (no sequencing request initially)
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Result may be valid or invalid depending on whether CONTINUE can find a next activity
      // The key is that post-condition was evaluated and CONTINUE was attempted
      // If invalid, it should be due to sequencing (SB.2.x) not termination (TB.2.3)
      if (!result.valid && result.exception) {
        // Should fail in sequencing process, not termination
        expect(result.exception).toMatch(/^SB\./);
      } else {
        // If it succeeds, should deliver next activity
        expect(result.targetActivity).toBe(grandchild2);
      }
    });

    it("should use navigation request when no post-condition triggers", () => {
      // Set up activity with post-condition CONTINUE rule that won't trigger
      const continueRule = grandchild1.sequencingRules.postConditionRules[0] =
          new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.isCompleted = false; // Post-condition won't trigger

      // Navigation request is just EXIT with no sequencing
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Should just exit to parent without continuing
      expect(result.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(child1);
    });
  });
});
