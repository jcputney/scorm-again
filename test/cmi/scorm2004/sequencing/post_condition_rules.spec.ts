import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess, SequencingRequestType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { SequencingRule, RuleCondition, RuleActionType, RuleConditionType, RuleConditionOperator } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

describe("Post-Condition Rules Subprocess (TB.2.2)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rootActivity: Activity;
  let parentActivity: Activity;
  let childActivity1: Activity;
  let childActivity2: Activity;
  let grandchildActivity: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    sequencingProcess = new SequencingProcess(activityTree);

    // Create activities
    rootActivity = new Activity("root", "Root Activity");
    parentActivity = new Activity("parent", "Parent Activity");
    childActivity1 = new Activity("child1", "Child 1");
    childActivity2 = new Activity("child2", "Child 2");
    grandchildActivity = new Activity("grandchild", "Grandchild");

    // Build tree structure
    rootActivity.addChild(parentActivity);
    parentActivity.addChild(childActivity1);
    parentActivity.addChild(childActivity2);
    childActivity1.addChild(grandchildActivity);

    // Set root
    activityTree.root = rootActivity;
  });

  describe("Continue Action", () => {
    it("should trigger continue request when CONTINUE action is set", () => {
      // Add post-condition rule to continue
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return continue request
      expect(request).toBe(SequencingRequestType.CONTINUE);
    });

    it("should trigger continue only when activity is completed", () => {
      // Add conditional post-condition rule
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Activity not completed yet
      childActivity1.completionStatus = CompletionStatus.INCOMPLETE;
      let request = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(request).toBeNull();

      // Mark as completed
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      request = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(request).toBe(SequencingRequestType.CONTINUE);
    });
  });

  describe("Previous Action", () => {
    it("should trigger previous request when PREVIOUS action is set", () => {
      // Add post-condition rule to go previous
      const previousRule = new SequencingRule(RuleActionType.PREVIOUS);
      previousRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity2.sequencingRules.addPostConditionRule(previousRule);

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(childActivity2);

      // Should return previous request
      expect(request).toBe(SequencingRequestType.PREVIOUS);
    });
  });

  describe("Retry Action", () => {
    it("should trigger retry request when RETRY action is set", () => {
      // Add post-condition rule to retry
      const retryRule = new SequencingRule(RuleActionType.RETRY);
      retryRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      retryRule.conditions[0].operator = RuleConditionOperator.NOT; // NOT satisfied
      childActivity1.sequencingRules.addPostConditionRule(retryRule);

      // Set activity as not satisfied
      childActivity1.successStatus = SuccessStatus.FAILED;

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return retry request
      expect(request).toBe(SequencingRequestType.RETRY);
    });
  });

  describe("Retry All Action", () => {
    it("should trigger retry all request when RETRY_ALL action is set", () => {
      // Add post-condition rule to retry all
      const retryAllRule = new SequencingRule(RuleActionType.RETRY_ALL);
      retryAllRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      parentActivity.sequencingRules.addPostConditionRule(retryAllRule);

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(parentActivity);

      // Should return retry all request
      expect(request).toBe(SequencingRequestType.RETRY_ALL);
    });
  });

  describe("Exit Actions", () => {
    it("should trigger exit request when EXIT_PARENT action is set", () => {
      // Add post-condition rule to exit parent
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPostConditionRule(exitParentRule);

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return exit request (EXIT_PARENT is mapped to EXIT)
      expect(request).toBe(SequencingRequestType.EXIT);
    });

    it("should trigger exit all request when EXIT_ALL action is set", () => {
      // Add post-condition rule to exit all
      const exitAllRule = new SequencingRule(RuleActionType.EXIT_ALL);
      exitAllRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      grandchildActivity.sequencingRules.addPostConditionRule(exitAllRule);

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(grandchildActivity);

      // Should return exit all request
      expect(request).toBe(SequencingRequestType.EXIT_ALL);
    });
  });

  describe("Multiple Rules", () => {
    it("should evaluate rules in order and return first matching action", () => {
      // Add multiple post-condition rules
      const retryRule = new SequencingRule(RuleActionType.RETRY);
      retryRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addPostConditionRule(retryRule);

      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Set activity as satisfied and completed
      childActivity1.successStatus = SuccessStatus.PASSED;
      childActivity1.completionStatus = CompletionStatus.COMPLETED;

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return retry (first matching rule)
      expect(request).toBe(SequencingRequestType.RETRY);
    });
  });

  describe("Invalid Actions", () => {
    it("should ignore invalid post-condition actions", () => {
      // Add invalid actions for post-condition rules
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPostConditionRule(skipRule);

      const disabledRule = new SequencingRule(RuleActionType.DISABLED);
      disabledRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPostConditionRule(disabledRule);

      // Evaluate post-condition rules
      const request = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return null (no valid action)
      expect(request).toBeNull();
    });
  });

  describe("Complex Conditions", () => {
    it("should handle objective measure conditions", () => {
      // Add post-condition rule based on objective measure
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      const measureCondition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN
      );
      measureCondition.parameters.set("threshold", 0.8);
      continueRule.addCondition(measureCondition);
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Set objective measure below threshold
      childActivity1.objectiveMeasureStatus = true;
      childActivity1.objectiveNormalizedMeasure = 0.7;
      let request = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(request).toBeNull();

      // Set objective measure above threshold
      childActivity1.objectiveNormalizedMeasure = 0.9;
      request = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(request).toBe(SequencingRequestType.CONTINUE);
    });

    it("should handle attempt limit conditions", () => {
      // Add post-condition rule based on attempt limit
      const exitRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      const attemptCondition = new RuleCondition(
        RuleConditionType.ATTEMPT_LIMIT_EXCEEDED
      );
      attemptCondition.parameters.set("attemptLimit", 3);
      exitRule.addCondition(attemptCondition);
      childActivity1.sequencingRules.addPostConditionRule(exitRule);

      // Less than limit
      childActivity1.incrementAttemptCount(); // 1
      childActivity1.incrementAttemptCount(); // 2
      let request = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(request).toBeNull();

      // At limit
      childActivity1.incrementAttemptCount(); // 3
      request = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(request).toBe(SequencingRequestType.EXIT);
    });
  });
});