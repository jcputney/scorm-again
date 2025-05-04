import { describe, expect, it } from "vitest";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule,
  SequencingRules,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { SuccessStatus } from "../../../../src/constants/enums";

describe("SequencingRules Edge Cases", () => {
  describe("evaluatePreConditionRules", () => {
    it("should return null when there are no pre-condition rules", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      expect(rules.evaluatePreConditionRules(activity)).toBe(null);
    });

    it("should return the action of the first rule that evaluates to true when multiple rules match", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      // Set up activity to match both rules
      activity.successStatus = SuccessStatus.PASSED;
      activity.incrementAttemptCount();

      // Create two rules with different actions
      const rule1 = new SequencingRule(RuleActionType.SKIP);
      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      rule1.addCondition(condition1);

      const rule2 = new SequencingRule(RuleActionType.DISABLED);
      const condition2 = new RuleCondition(RuleConditionType.ATTEMPTED);
      rule2.addCondition(condition2);

      // Add rules in specific order
      rules.addPreConditionRule(rule1);
      rules.addPreConditionRule(rule2);

      // Should return the action of the first rule (SKIP)
      expect(rules.evaluatePreConditionRules(activity)).toBe(RuleActionType.SKIP);

      // Create a new rules object and add the rules in reverse order
      const rulesReversed = new SequencingRules();
      rulesReversed.addPreConditionRule(rule2);
      rulesReversed.addPreConditionRule(rule1);

      // Should return the action of the first rule (DISABLED)
      expect(rulesReversed.evaluatePreConditionRules(activity)).toBe(RuleActionType.DISABLED);
    });

    it("should handle a rule with null action", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      // Set up activity to match the rule
      activity.successStatus = SuccessStatus.PASSED;

      // Create a rule with null action
      // eslint-disable-next-line
      // @ts-ignore
      const rule = new SequencingRule(null);
      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      rule.addCondition(condition);

      rules.addPreConditionRule(rule);

      // Should return null
      expect(rules.evaluatePreConditionRules(activity)).toBe(null);
    });
  });

  describe("evaluateExitConditionRules", () => {
    it("should return null when there are no exit condition rules", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      expect(rules.evaluateExitConditionRules(activity)).toBe(null);
    });

    it("should return the action of the first rule that evaluates to true when multiple rules match", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      // Set up activity to match both rules
      activity.successStatus = SuccessStatus.PASSED;
      activity.incrementAttemptCount();

      // Create two rules with different actions
      const rule1 = new SequencingRule(RuleActionType.EXIT);
      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      rule1.addCondition(condition1);

      const rule2 = new SequencingRule(RuleActionType.EXIT_ALL);
      const condition2 = new RuleCondition(RuleConditionType.ATTEMPTED);
      rule2.addCondition(condition2);

      // Add rules in specific order
      rules.addExitConditionRule(rule1);
      rules.addExitConditionRule(rule2);

      // Should return the action of the first rule (EXIT)
      expect(rules.evaluateExitConditionRules(activity)).toBe(RuleActionType.EXIT);

      // Create a new rules object and add the rules in reverse order
      const rulesReversed = new SequencingRules();
      rulesReversed.addExitConditionRule(rule2);
      rulesReversed.addExitConditionRule(rule1);

      // Should return the action of the first rule (EXIT_ALL)
      expect(rulesReversed.evaluateExitConditionRules(activity)).toBe(RuleActionType.EXIT_ALL);
    });
  });

  describe("evaluatePostConditionRules", () => {
    it("should return null when there are no post-condition rules", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      expect(rules.evaluatePostConditionRules(activity)).toBe(null);
    });

    it("should return the action of the first rule that evaluates to true when multiple rules match", () => {
      const rules = new SequencingRules();
      const activity = new Activity();

      // Set up activity to match both rules
      activity.successStatus = SuccessStatus.PASSED;
      activity.incrementAttemptCount();

      // Create two rules with different actions
      const rule1 = new SequencingRule(RuleActionType.CONTINUE);
      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      rule1.addCondition(condition1);

      const rule2 = new SequencingRule(RuleActionType.PREVIOUS);
      const condition2 = new RuleCondition(RuleConditionType.ATTEMPTED);
      rule2.addCondition(condition2);

      // Add rules in specific order
      rules.addPostConditionRule(rule1);
      rules.addPostConditionRule(rule2);

      // Should return the action of the first rule (CONTINUE)
      expect(rules.evaluatePostConditionRules(activity)).toBe(RuleActionType.CONTINUE);

      // Create a new rules object and add the rules in reverse order
      const rulesReversed = new SequencingRules();
      rulesReversed.addPostConditionRule(rule2);
      rulesReversed.addPostConditionRule(rule1);

      // Should return the action of the first rule (PREVIOUS)
      expect(rulesReversed.evaluatePostConditionRules(activity)).toBe(RuleActionType.PREVIOUS);
    });
  });

  describe("toJSON", () => {
    it("should return an object with the correct properties", () => {
      const rules = new SequencingRules();

      // Create and add some rules
      const preRule = new SequencingRule(RuleActionType.SKIP);
      const exitRule = new SequencingRule(RuleActionType.EXIT);
      const postRule = new SequencingRule(RuleActionType.CONTINUE);

      rules.addPreConditionRule(preRule);
      rules.addExitConditionRule(exitRule);
      rules.addPostConditionRule(postRule);

      const json = rules.toJSON() as any;

      // Check that the JSON object has the correct properties
      expect(json).toHaveProperty("preConditionRules");
      expect(json).toHaveProperty("exitConditionRules");
      expect(json).toHaveProperty("postConditionRules");

      // Check that the arrays contain the correct rules
      expect(json.preConditionRules).toContain(preRule);
      expect(json.exitConditionRules).toContain(exitRule);
      expect(json.postConditionRules).toContain(postRule);
    });
  });
});
