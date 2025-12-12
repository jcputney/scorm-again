import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess, SequencingRequestType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { SequencingRule, RuleCondition, RuleActionType, RuleConditionType, RuleConditionOperator } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

describe("Sequencing Rules Check Process (UP.2)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rootActivity: Activity;
  let parentActivity: Activity;
  let childActivity1: Activity;
  let childActivity2: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    sequencingProcess = new SequencingProcess(activityTree);

    // Create activities
    rootActivity = new Activity("root", "Root Activity");
    parentActivity = new Activity("parent", "Parent Activity");
    childActivity1 = new Activity("child1", "Child 1");
    childActivity2 = new Activity("child2", "Child 2");

    // Build tree structure
    rootActivity.addChild(parentActivity);
    parentActivity.addChild(childActivity1);
    parentActivity.addChild(childActivity2);

    // Set root
    activityTree.root = rootActivity;
  });

  describe("Pre-Condition Rules", () => {
    it("should skip activity when skip rule is triggered", () => {
      // Add skip rule when not completed
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      const notCompletedCondition = new RuleCondition(RuleConditionType.COMPLETED, RuleConditionOperator.NOT);
      skipRule.addCondition(notCompletedCondition);
      childActivity1.sequencingRules.addPreConditionRule(skipRule);

      // Activity is not completed
      childActivity1.completionStatus = CompletionStatus.INCOMPLETE;

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Try to deliver activity - should skip due to pre-condition
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should not deliver due to skip rule
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should disable activity when disabled rule is triggered", () => {
      // Add disabled rule always
      const disabledRule = new SequencingRule(RuleActionType.DISABLED);
      disabledRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity2.sequencingRules.addPreConditionRule(disabledRule);

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Try to deliver activity - should fail due to disabled
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      // Should not deliver due to disabled rule
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should deliver activity when no pre-condition rules prevent it", () => {
      // Add skip rule only when satisfied (not triggered since unknown)
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addPreConditionRule(skipRule);

      // Activity is not satisfied
      childActivity1.successStatus = SuccessStatus.UNKNOWN;

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Try to deliver activity - should succeed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(childActivity1);
    });
  });

  describe("Rule Evaluation Order", () => {
    it("should evaluate rules in order and stop at first match", () => {
      // Add multiple pre-condition rules
      // First rule: skip if not attempted (will match)
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      const notAttemptedCondition = new RuleCondition(RuleConditionType.ATTEMPTED, RuleConditionOperator.NOT);
      skipRule.addCondition(notAttemptedCondition);
      childActivity1.sequencingRules.addPreConditionRule(skipRule);

      // Second rule: disabled always (should not be evaluated)
      const disabledRule = new SequencingRule(RuleActionType.DISABLED);
      disabledRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPreConditionRule(disabledRule);

      // Activity has no attempts (already 0 by default)

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Try to deliver activity
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should not deliver due to first (skip) rule
      expect(result.deliveryRequest).toBe("doNotDeliver");
      
      // Verify it was skip (not disabled) by checking that the activity is still available
      expect(childActivity1.isAvailable).toBe(true);
    });
  });

  describe("Complex Conditions", () => {
    it("should handle multiple conditions with AND combination", () => {
      // Add rule: skip if completed AND satisfied
      const skipRule = new SequencingRule(RuleActionType.SKIP, RuleConditionOperator.AND);
      skipRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      skipRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addPreConditionRule(skipRule);

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Test 1: Completed but not satisfied - should deliver
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      childActivity1.successStatus = SuccessStatus.FAILED;

      let result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.deliveryRequest).toBe("deliver");

      // Test 2: Both completed and satisfied - should skip
      childActivity1.successStatus = SuccessStatus.PASSED;

      result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle multiple conditions with OR combination", () => {
      // Add rule: skip if completed OR satisfied
      const skipRule = new SequencingRule(RuleActionType.SKIP, RuleConditionOperator.OR);
      skipRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      skipRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity2.sequencingRules.addPreConditionRule(skipRule);

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Test 1: Only completed - should skip
      childActivity2.completionStatus = CompletionStatus.COMPLETED;
      childActivity2.successStatus = SuccessStatus.UNKNOWN;

      let result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe("doNotDeliver");

      // Test 2: Neither completed nor satisfied - should deliver
      childActivity2.completionStatus = CompletionStatus.INCOMPLETE;
      childActivity2.successStatus = SuccessStatus.UNKNOWN;

      result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe("deliver");
    });
  });

  describe("Integration with Limit Conditions", () => {
    it("should check limit conditions before pre-condition rules", () => {
      // Set attempt limit
      childActivity1.attemptLimit = 1;
      childActivity1.incrementAttemptCount(); // Already at limit

      // Add pre-condition rule that would skip (but shouldn't be evaluated)
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPreConditionRule(skipRule);

      // Set parent as current but not active (terminated)
      activityTree.currentActivity = parentActivity;
      rootActivity.isActive = false;
      parentActivity.isActive = false;

      // Try to deliver activity
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should not deliver due to limit condition (not pre-condition rule)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });
  });

  describe("Post-Condition and Exit Rule Integration", () => {
    it("should use UP.2 for all rule types consistently", () => {
      // Add various rules to test consistency
      const preRule = new SequencingRule(RuleActionType.SKIP);
      preRule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      childActivity1.sequencingRules.addPreConditionRule(preRule);

      const postRule = new SequencingRule(RuleActionType.CONTINUE);
      postRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(postRule);

      const exitRule = new SequencingRule(RuleActionType.EXIT);
      exitRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addExitConditionRule(exitRule);

      // Set activity state
      childActivity1.incrementAttemptCount();
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      childActivity1.successStatus = SuccessStatus.PASSED;

      // Test pre-condition evaluation
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      activityTree.currentActivity = parentActivity;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should skip due to pre-condition (attempted)
      expect(result.deliveryRequest).toBe("doNotDeliver");

      // Test post-condition evaluation
      const postResult = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(postResult.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });
  });
});