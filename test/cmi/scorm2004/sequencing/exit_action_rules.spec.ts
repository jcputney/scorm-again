import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess, SequencingRequestType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { SequencingRule, RuleCondition, RuleActionType, RuleConditionType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Exit Action Rules Subprocess (TB.2.1)", () => {
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

  describe("Exit Action", () => {
    it("should terminate only the current activity when EXIT action is triggered", () => {
      // Add exit rule to child activity
      const exitRule = new SequencingRule(RuleActionType.EXIT);
      exitRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addExitConditionRule(exitRule);

      // Set activities as active
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;
      grandchildActivity.isActive = true;

      // Set current activity
      activityTree.currentActivity = childActivity1;

      // Process exit request
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Check that child1 and its descendants are terminated
      expect(childActivity1.isActive).toBe(false);
      expect(grandchildActivity.isActive).toBe(false);
      
      // But parent and siblings should still be active
      expect(parentActivity.isActive).toBe(true);
      expect(rootActivity.isActive).toBe(true);
    });
  });

  describe("Exit Parent Action", () => {
    it("should terminate the parent activity when EXIT_PARENT action is triggered", () => {
      // Add exit parent rule to child activity
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addExitConditionRule(exitParentRule);

      // Set activities as active
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;
      childActivity2.isActive = true;
      grandchildActivity.isActive = true;

      // Set current activity
      activityTree.currentActivity = childActivity1;

      // Process exit request
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Check that parent and all its descendants are terminated
      expect(parentActivity.isActive).toBe(false);
      expect(childActivity1.isActive).toBe(false);
      expect(childActivity2.isActive).toBe(false);
      expect(grandchildActivity.isActive).toBe(false);
      
      // But root should still be active
      expect(rootActivity.isActive).toBe(true);
    });

    it("should not cause infinite recursion with EXIT_PARENT", () => {
      // Add exit parent rule to both child activities
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addExitConditionRule(exitParentRule);
      childActivity2.sequencingRules.addExitConditionRule(exitParentRule);

      // Set activities as active
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;
      childActivity2.isActive = true;

      // Set current activity
      activityTree.currentActivity = childActivity1;

      // Process exit request - should not cause infinite loop
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // All activities under parent should be terminated
      expect(parentActivity.isActive).toBe(false);
      expect(childActivity1.isActive).toBe(false);
      expect(childActivity2.isActive).toBe(false);
    });
  });

  describe("Exit All Action", () => {
    it("should terminate all activities when EXIT_ALL action is triggered", () => {
      // Add exit all rule to grandchild activity
      const exitAllRule = new SequencingRule(RuleActionType.EXIT_ALL);
      exitAllRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      grandchildActivity.sequencingRules.addExitConditionRule(exitAllRule);

      // Set activities as active
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;
      childActivity2.isActive = true;
      grandchildActivity.isActive = true;

      // Set current activity
      activityTree.currentActivity = grandchildActivity;

      // Process exit request
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Check that all activities are terminated
      expect(rootActivity.isActive).toBe(false);
      expect(parentActivity.isActive).toBe(false);
      expect(childActivity1.isActive).toBe(false);
      expect(childActivity2.isActive).toBe(false);
      expect(grandchildActivity.isActive).toBe(false);
    });
  });

  describe("Conditional Exit Rules", () => {
    it("should only trigger exit action when condition is met", () => {
      // Add conditional exit rule (exit when completed)
      const exitRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addExitConditionRule(exitRule);

      // Set activities as active but not completed
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;
      childActivity1.isCompleted = false;

      // Set current activity
      activityTree.currentActivity = childActivity1;

      // Process exit request - condition not met
      let result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Parent should still be active (condition not met)
      expect(parentActivity.isActive).toBe(true);
      expect(childActivity1.isActive).toBe(false); // Current activity is terminated

      // Now set activity as completed and try again
      childActivity1.isActive = true;
      childActivity1.isCompleted = true;

      // Process exit request - condition now met
      result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Parent should now be terminated
      expect(parentActivity.isActive).toBe(false);
    });

    it("should evaluate multiple exit rules in order", () => {
      // Add two exit rules with different conditions
      const exitRule1 = new SequencingRule(RuleActionType.EXIT);
      exitRule1.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      childActivity1.sequencingRules.addExitConditionRule(exitRule1);

      const exitRule2 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitRule2.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addExitConditionRule(exitRule2);

      // Set activities as active and attempted but not completed
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;
      childActivity1.incrementAttemptCount(); // Attempted
      childActivity1.isCompleted = false; // Not completed

      // Set current activity
      activityTree.currentActivity = childActivity1;

      // Process exit request - first rule should match
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Only current activity should be terminated (EXIT action)
      expect(childActivity1.isActive).toBe(false);
      expect(parentActivity.isActive).toBe(true);
    });
  });

  describe("Invalid Exit Actions", () => {
    it("should ignore non-exit actions in exit condition rules", () => {
      // Add invalid action types for exit rules
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addExitConditionRule(skipRule);

      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addExitConditionRule(continueRule);

      // Set activities as active
      rootActivity.isActive = true;
      parentActivity.isActive = true;
      childActivity1.isActive = true;

      // Set current activity
      activityTree.currentActivity = childActivity1;

      // Process exit request
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Only current activity should be terminated (normal exit)
      expect(childActivity1.isActive).toBe(false);
      expect(parentActivity.isActive).toBe(true);
    });
  });
});