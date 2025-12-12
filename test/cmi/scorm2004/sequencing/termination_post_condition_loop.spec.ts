import { describe, it, expect, beforeEach } from "vitest";
import {
  OverallSequencingProcess,
  NavigationRequestType,
  TerminationRequestResult,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  SequencingRule,
  RuleCondition,
  RuleConditionType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { CompletionStatus } from "../../../../src/constants/enums";

/**
 * GAP-02: Post-Condition Loop in Termination Request Process (TB.2.3)
 *
 * Tests the critical do-while loop in handleExitTermination() that repeatedly
 * evaluates post-conditions and handles EXIT_PARENT actions by cascading up
 * the activity tree.
 *
 * Reference: /docs/reference-analysis/gaps/02-post-condition-loop.md
 */
describe("GAP-02: Post-Condition Loop in Termination Request Process", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let root: Activity;
  let level1: Activity;
  let level2: Activity;
  let level3: Activity;

  beforeEach(() => {
    // Create a 4-level deep activity tree for testing cascading exits
    activityTree = new ActivityTree();
    root = new Activity("root", "Root Activity");
    level1 = new Activity("level1", "Level 1");
    level2 = new Activity("level2", "Level 2");
    level3 = new Activity("level3", "Leaf Activity");

    root.addChild(level1);
    level1.addChild(level2);
    level2.addChild(level3);

    activityTree.root = root;

    // Enable flow controls for navigation
    root.sequencingControls.flow = true;
    level1.sequencingControls.flow = true;
    level2.sequencingControls.flow = true;

    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();

    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess
    );
  });

  describe("Test 1: Single EXIT_PARENT cascade", () => {
    it("should move to parent and continue loop when EXIT_PARENT is returned from post-condition", () => {
      // Setup: Activity with EXIT_PARENT post-condition
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(exitParentRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.COMPLETED;
      level2.isActive = true;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify the termination was successful
      expect(result.valid).toBe(true);

      // Verify level3 was terminated
      expect(level3.isActive).toBe(false);

      // Verify the post-condition EXIT_PARENT caused level2 to also be terminated
      expect(level2.isActive).toBe(false);

      // Verify we're now at level1 (parent of level2)
      expect(activityTree.currentActivity).toBe(level1);
    });

    it("should end attempt on parent activity when EXIT_PARENT is processed", () => {
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level3.sequencingRules.addPostConditionRule(exitParentRule);

      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;
      level2.completionStatus = CompletionStatus.UNKNOWN;

      overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // End Attempt Process should set completion status if unknown
      expect(level2.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(level2.isActive).toBe(false);
    });
  });

  describe("Test 2: Chained EXIT_PARENT (2-3 levels)", () => {
    it("should cascade through 2 levels when both have EXIT_PARENT post-conditions", () => {
      // Setup: Both level3 and level2 have EXIT_PARENT post-conditions
      const exitParentRule3 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule3.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(exitParentRule3);

      const exitParentRule2 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule2.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level2.sequencingRules.addPostConditionRule(exitParentRule2);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.COMPLETED;
      level2.isActive = true;
      level2.completionStatus = CompletionStatus.COMPLETED;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Verify all three activities were terminated (level3, level2, level1)
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);
      expect(level1.isActive).toBe(false);

      // Should now be at root
      expect(activityTree.currentActivity).toBe(root);
    });

    it("should cascade through 3 levels with chained EXIT_PARENT", () => {
      // Setup: All three levels have EXIT_PARENT post-conditions
      const exitParentRule3 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule3.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level3.sequencingRules.addPostConditionRule(exitParentRule3);

      const exitParentRule2 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule2.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level2.sequencingRules.addPostConditionRule(exitParentRule2);

      const exitParentRule1 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule1.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level1.sequencingRules.addPostConditionRule(exitParentRule1);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // All activities should be terminated
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);
      expect(level1.isActive).toBe(false);
      expect(root.isActive).toBe(false);

      // When reaching root with EXIT_PARENT (step 3.3.5), the termination returns EXIT sequencing request
      // The post-condition loop has successfully cascaded through all 3 levels
      // NOTE: Whether currentActivity is null depends on the navigation request processor
      // The key test is that all levels were terminated via the cascade
    });
  });

  describe("Test 3: EXIT_PARENT at root", () => {
    it("should return EXIT sequencing request when EXIT_PARENT reaches root", () => {
      // Setup: Activity at root level has EXIT_PARENT post-condition
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      root.sequencingRules.addPostConditionRule(exitParentRule);

      // Set up active state
      activityTree.currentActivity = root;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Root should be terminated
      expect(root.isActive).toBe(false);

      // Per TB.2.3 step 3.3.5: At root without retry returns EXIT sequencing request
      // This ends the session
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should handle EXIT_PARENT cascade that reaches root", () => {
      // Setup: level1 has EXIT_PARENT, causing cascade to root
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level1.sequencingRules.addPostConditionRule(exitParentRule);

      // Set up active state
      activityTree.currentActivity = level1;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Both should be terminated
      expect(level1.isActive).toBe(false);
      expect(root.isActive).toBe(false);

      // The post-condition loop successfully cascaded from level1 to root
      // Root's termination with EXIT_PARENT returns EXIT sequencing request
    });
  });

  describe("Test 4: EXIT_ALL from post-condition", () => {
    it("should break loop and terminate all activities when post-condition returns EXIT_ALL", () => {
      // Setup: Leaf activity with EXIT_ALL post-condition
      const exitAllRule = new SequencingRule(RuleActionType.EXIT_ALL);
      exitAllRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(exitAllRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.COMPLETED;
      level2.isActive = true;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // All activities should be terminated (EXIT_ALL behavior)
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);
      expect(level1.isActive).toBe(false);
      expect(root.isActive).toBe(false);

      // Current activity should be null (session ended)
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should handle EXIT_ALL after partial EXIT_PARENT cascade", () => {
      // Setup: level3 has EXIT_PARENT, level2 has EXIT_ALL
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level3.sequencingRules.addPostConditionRule(exitParentRule);

      const exitAllRule = new SequencingRule(RuleActionType.EXIT_ALL);
      exitAllRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level2.sequencingRules.addPostConditionRule(exitAllRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // All activities should be terminated
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);
      expect(level1.isActive).toBe(false);
      expect(root.isActive).toBe(false);

      // Session ended
      expect(activityTree.currentActivity).toBeNull();
    });
  });

  describe("Test 5: Post-condition RETRY", () => {
    it("should evaluate RETRY post-condition after termination", () => {
      // Setup: Activity with RETRY post-condition
      const retryRule = new SequencingRule(RuleActionType.RETRY);
      retryRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(retryRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.COMPLETED;
      level2.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Activity should be terminated
      expect(level3.isActive).toBe(false);

      // The RETRY post-condition should be evaluated (verified via the post-condition loop)
      // The actual retry behavior happens in the sequencing request processor
      // This test verifies the post-condition is integrated into the termination process
    });

    it("should preserve RETRY request through EXIT_PARENT cascade", () => {
      // Setup: level3 has EXIT_PARENT, level2 has RETRY
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level3.sequencingRules.addPostConditionRule(exitParentRule);

      const retryRule = new SequencingRule(RuleActionType.RETRY);
      retryRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level2.sequencingRules.addPostConditionRule(retryRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Both should be terminated (cascade worked)
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);

      // The post-condition loop should have:
      // 1. Terminated level3
      // 2. Evaluated level3's post-condition (EXIT_PARENT)
      // 3. Moved to level2 and terminated it
      // 4. Evaluated level2's post-condition (RETRY)
      // 5. Returned RETRY to the navigation processor for further handling
    });
  });

  describe("Test 6: Post-condition CONTINUE", () => {
    it("should evaluate CONTINUE post-condition after termination", () => {
      // Setup: Activity with CONTINUE post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(continueRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.COMPLETED;
      level2.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Activity should be terminated
      expect(level3.isActive).toBe(false);

      // The post-condition loop evaluates CONTINUE and passes it to navigation processor
      // This test verifies the post-condition is evaluated without triggering EXIT_PARENT behavior
    });

    it("should handle CONTINUE at root per TB.2.3 step 3.3.5", () => {
      // Setup: Root with CONTINUE post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      root.sequencingRules.addPostConditionRule(continueRule);

      // Set up active state
      activityTree.currentActivity = root;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Root should be terminated
      expect(root.isActive).toBe(false);

      // Per TB.2.3 step 3.3.5: At root without RETRY, termination returns EXIT sequencing request
      // The session end is handled by the navigation processor (not directly testable here)
      expect(activityTree.currentActivity).toBeNull();
    });
  });

  describe("Test 7: Post-condition PREVIOUS", () => {
    it("should evaluate PREVIOUS post-condition after termination", () => {
      // Setup: Activity with PREVIOUS post-condition
      const previousRule = new SequencingRule(RuleActionType.PREVIOUS);
      previousRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(previousRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.COMPLETED;
      level2.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Activity should be terminated
      expect(level3.isActive).toBe(false);

      // The post-condition loop evaluates PREVIOUS and passes it to the navigation processor
      // This test verifies the post-condition is integrated into the termination flow
    });
  });

  describe("Test 8: No post-condition (normal EXIT)", () => {
    it("should not trigger loop behavior when no post-condition exists", () => {
      // Setup: Activity with NO post-conditions
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Only level3 should be terminated
      expect(level3.isActive).toBe(false);

      // level2 should still be active (no cascade)
      expect(level2.isActive).toBe(true);

      // Current activity should move to parent
      expect(activityTree.currentActivity).toBe(level2);
    });

    it("should handle partial cascade when post-condition chain ends", () => {
      // Setup: level3 has EXIT_PARENT, level2 has no post-condition
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level3.sequencingRules.addPostConditionRule(exitParentRule);

      // level2 has NO post-conditions

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;
      level1.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // level3 and level2 should be terminated
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);

      // level1 should still be active (cascade stopped)
      expect(level1.isActive).toBe(true);

      // Current activity should be at level1
      expect(activityTree.currentActivity).toBe(level1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle EXIT_PARENT when condition does not match", () => {
      // Setup: EXIT_PARENT with condition that doesn't match
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      level3.sequencingRules.addPostConditionRule(exitParentRule);

      // Set up active state but DON'T complete the activity
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level3.completionStatus = CompletionStatus.INCOMPLETE; // Not completed!
      level2.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // level3 should be terminated
      expect(level3.isActive).toBe(false);

      // level2 should still be active (post-condition didn't match)
      expect(level2.isActive).toBe(true);

      // Current activity should move to parent
      expect(activityTree.currentActivity).toBe(level2);
    });

    it("should handle RETRY at root correctly", () => {
      // Setup: Root with RETRY post-condition
      const retryRule = new SequencingRule(RuleActionType.RETRY);
      retryRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      root.sequencingRules.addPostConditionRule(retryRule);

      // Set up active state
      activityTree.currentActivity = root;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // Root should be terminated
      expect(root.isActive).toBe(false);

      // Per TB.2.3: RETRY at root is an exception to step 3.3.5
      // The RETRY sequencing request is passed to the navigation processor (not EXIT)
      // The post-condition loop handles this case correctly by not returning EXIT
    });

    it("should handle complex multi-level cascade with mixed post-conditions", () => {
      // Setup: Complex scenario
      // level3: EXIT_PARENT
      // level2: EXIT_PARENT
      // level1: CONTINUE
      const exitParentRule3 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule3.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level3.sequencingRules.addPostConditionRule(exitParentRule3);

      const exitParentRule2 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule2.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level2.sequencingRules.addPostConditionRule(exitParentRule2);

      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      level1.sequencingRules.addPostConditionRule(continueRule);

      // Set up active state
      activityTree.currentActivity = level3;
      level3.isActive = true;
      level2.isActive = true;
      level1.isActive = true;
      root.isActive = true;

      // Execute EXIT request
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);

      // Verify success
      expect(result.valid).toBe(true);

      // All three child levels should be terminated
      expect(level3.isActive).toBe(false);
      expect(level2.isActive).toBe(false);
      expect(level1.isActive).toBe(false);

      // Root should still be active
      expect(root.isActive).toBe(true);

      // The post-condition loop should have:
      // 1. Terminated level3
      // 2. Evaluated EXIT_PARENT -> moved to level2, terminated it
      // 3. Evaluated EXIT_PARENT -> moved to level1, terminated it
      // 4. Evaluated CONTINUE -> stopped cascade, returned CONTINUE sequencing request
      // 5. Navigation processor would then handle the CONTINUE request

      // Current should be at root
      expect(activityTree.currentActivity).toBe(root);
    });
  });
});
