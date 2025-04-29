import { describe, it, vi } from "vitest";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionOperator,
  RuleConditionType,
  SequencingRule,
  SequencingRules,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { SuccessStatus } from "../../../../src/constants/enums";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

describe("SequencingRules", () => {
  describe("RuleCondition", () => {
    describe("constructor", () => {
      it("should initialize with default values", () => {
        const condition = new RuleCondition();
        expect(condition.condition).toBe(RuleConditionType.ALWAYS);
        expect(condition.operator).toBe(null);
        expect(condition.parameters.size).toBe(0);
      });

      it("should initialize with provided values", () => {
        const parameters = new Map([["threshold", 0.8]]);
        const condition = new RuleCondition(
          RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
          RuleConditionOperator.NOT,
          parameters,
        );
        expect(condition.condition).toBe(RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN);
        expect(condition.operator).toBe(RuleConditionOperator.NOT);
        expect(condition.parameters).toBe(parameters);
        expect(condition.parameters.get("threshold")).toBe(0.8);
      });
    });

    describe("reset", () => {
      it("should reset initialized flag", () => {
        const condition = new RuleCondition();
        condition.initialize();
        expect(condition.initialized).toBe(true);

        condition.reset();
        expect(condition.initialized).toBe(false);
      });
    });

    describe("evaluate", () => {
      it("should evaluate SATISFIED condition", () => {
        const condition = new RuleCondition(RuleConditionType.SATISFIED);
        const activity = new Activity();

        activity.successStatus = SuccessStatus.PASSED;
        expect(condition.evaluate(activity)).toBe(true);

        activity.successStatus = SuccessStatus.FAILED;
        expect(condition.evaluate(activity)).toBe(false);

        activity.successStatus = SuccessStatus.UNKNOWN;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate OBJECTIVE_MEASURE_GREATER_THAN condition", () => {
        const parameters = new Map([["threshold", 0.5]]);
        const condition = new RuleCondition(
          RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
          null,
          parameters,
        );
        const activity = new Activity();

        activity.objectiveMeasureStatus = true;
        activity.objectiveNormalizedMeasure = 0.8;
        expect(condition.evaluate(activity)).toBe(true);

        activity.objectiveNormalizedMeasure = 0.5;
        expect(condition.evaluate(activity)).toBe(false);

        activity.objectiveNormalizedMeasure = 0.4;
        expect(condition.evaluate(activity)).toBe(false);

        activity.objectiveMeasureStatus = false;
        activity.objectiveNormalizedMeasure = 0.8;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate COMPLETED condition", () => {
        const condition = new RuleCondition(RuleConditionType.COMPLETED);
        const activity = new Activity();

        activity.isCompleted = true;
        expect(condition.evaluate(activity)).toBe(true);

        activity.isCompleted = false;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate ALWAYS condition", () => {
        const condition = new RuleCondition(RuleConditionType.ALWAYS);
        const activity = new Activity();

        expect(condition.evaluate(activity)).toBe(true);
      });
    });

    describe("toJSON", () => {
      it("should return a JSON representation of the condition", () => {
        const parameters = new Map([["threshold", 0.8]]);
        const condition = new RuleCondition(
          RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
          RuleConditionOperator.NOT,
          parameters,
        );

        const result = condition.toJSON();

        expect(result).toHaveProperty(
          "condition",
          RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        );
        expect(result).toHaveProperty("operator", RuleConditionOperator.NOT);
        expect(result).toHaveProperty("parameters");
        expect(result.parameters).toEqual({ threshold: 0.8 });
      });
    });
  });

  describe("SequencingRule", () => {
    describe("constructor", () => {
      it("should initialize with default values", () => {
        const rule = new SequencingRule();
        expect(rule.action).toBe(RuleActionType.SKIP);
        expect(rule.conditionCombination).toBe(RuleConditionOperator.AND);
        expect(rule.conditions).toEqual([]);
      });

      it("should initialize with provided values", () => {
        const rule = new SequencingRule(RuleActionType.DISABLED, RuleConditionOperator.OR);
        expect(rule.action).toBe(RuleActionType.DISABLED);
        expect(rule.conditionCombination).toBe(RuleConditionOperator.OR);
        expect(rule.conditions).toEqual([]);
      });
    });

    describe("reset", () => {
      it("should reset initialized flag and conditions", () => {
        const rule = new SequencingRule();
        rule.initialize();
        rule.addCondition(new RuleCondition());

        expect(rule.initialized).toBe(true);
        expect(rule.conditions.length).toBe(1);

        rule.reset();

        expect(rule.initialized).toBe(false);
        expect(rule.conditions.length).toBe(0);
      });
    });

    describe("addCondition", () => {
      it("should add a condition to the rule", () => {
        const rule = new SequencingRule();
        const condition = new RuleCondition();

        rule.addCondition(condition);

        expect(rule.conditions).toContain(condition);
      });

      it("should throw an error if condition is not a RuleCondition", () => {
        const rule = new SequencingRule();

        expect(() => {
          rule.addCondition("not a condition" as any);
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("removeCondition", () => {
      it("should remove a condition from the rule", () => {
        const rule = new SequencingRule();
        const condition = new RuleCondition();

        rule.addCondition(condition);
        const result = rule.removeCondition(condition);

        expect(result).toBe(true);
        expect(rule.conditions).not.toContain(condition);
      });

      it("should return false if condition is not found", () => {
        const rule = new SequencingRule();
        const condition = new RuleCondition();

        const result = rule.removeCondition(condition);

        expect(result).toBe(false);
      });
    });

    describe("evaluate", () => {
      it("should return true if there are no conditions", () => {
        const rule = new SequencingRule();
        const activity = new Activity();

        expect(rule.evaluate(activity)).toBe(true);
      });

      it("should evaluate conditions with AND combination", () => {
        const rule = new SequencingRule(RuleActionType.SKIP, RuleConditionOperator.AND);
        const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
        const condition2 = new RuleCondition(RuleConditionType.COMPLETED);
        const activity = new Activity();

        rule.addCondition(condition1);
        rule.addCondition(condition2);

        // Both conditions false
        activity.successStatus = SuccessStatus.FAILED;
        activity.isCompleted = false;
        expect(rule.evaluate(activity)).toBe(false);

        // First condition true, second false
        activity.successStatus = SuccessStatus.PASSED;
        activity.isCompleted = false;
        expect(rule.evaluate(activity)).toBe(false);

        // First condition false, second true
        activity.successStatus = SuccessStatus.FAILED;
        activity.isCompleted = true;
        expect(rule.evaluate(activity)).toBe(false);

        // Both conditions true
        activity.successStatus = SuccessStatus.PASSED;
        activity.isCompleted = true;
        expect(rule.evaluate(activity)).toBe(true);
      });

      it("should evaluate conditions with OR combination", () => {
        const rule = new SequencingRule(RuleActionType.SKIP, RuleConditionOperator.OR);
        const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
        const condition2 = new RuleCondition(RuleConditionType.COMPLETED);
        const activity = new Activity();

        rule.addCondition(condition1);
        rule.addCondition(condition2);

        // Both conditions false
        activity.successStatus = SuccessStatus.FAILED;
        activity.isCompleted = false;
        expect(rule.evaluate(activity)).toBe(false);

        // First condition true, second false
        activity.successStatus = SuccessStatus.PASSED;
        activity.isCompleted = false;
        expect(rule.evaluate(activity)).toBe(true);

        // First condition false, second true
        activity.successStatus = SuccessStatus.FAILED;
        activity.isCompleted = true;
        expect(rule.evaluate(activity)).toBe(true);

        // Both conditions true
        activity.successStatus = SuccessStatus.PASSED;
        activity.isCompleted = true;
        expect(rule.evaluate(activity)).toBe(true);
      });
    });

    describe("toJSON", () => {
      it("should return a JSON representation of the rule", () => {
        const rule = new SequencingRule(RuleActionType.DISABLED, RuleConditionOperator.OR);
        const condition = new RuleCondition(RuleConditionType.SATISFIED);

        rule.addCondition(condition);

        const result = rule.toJSON();

        expect(result).toHaveProperty("action", RuleActionType.DISABLED);
        expect(result).toHaveProperty("conditionCombination", RuleConditionOperator.OR);
        expect(result).toHaveProperty("conditions");
        expect(Array.isArray(result.conditions)).toBe(true);
        expect(result.conditions.length).toBe(1);
        expect(result.conditions[0]).toBe(condition);
      });
    });
  });

  describe("SequencingRules", () => {
    describe("constructor", () => {
      it("should initialize with empty rule arrays", () => {
        const rules = new SequencingRules();
        expect(rules.preConditionRules).toEqual([]);
        expect(rules.exitConditionRules).toEqual([]);
        expect(rules.postConditionRules).toEqual([]);
      });
    });

    describe("reset", () => {
      it("should reset initialized flag and rule arrays", () => {
        const rules = new SequencingRules();
        rules.initialize();
        rules.addPreConditionRule(new SequencingRule());
        rules.addExitConditionRule(new SequencingRule());
        rules.addPostConditionRule(new SequencingRule());

        expect(rules.initialized).toBe(true);
        expect(rules.preConditionRules.length).toBe(1);
        expect(rules.exitConditionRules.length).toBe(1);
        expect(rules.postConditionRules.length).toBe(1);

        rules.reset();

        expect(rules.initialized).toBe(false);
        expect(rules.preConditionRules.length).toBe(0);
        expect(rules.exitConditionRules.length).toBe(0);
        expect(rules.postConditionRules.length).toBe(0);
      });
    });

    describe("addPreConditionRule", () => {
      it("should add a rule to preConditionRules", () => {
        const rules = new SequencingRules();
        const rule = new SequencingRule();

        rules.addPreConditionRule(rule);

        expect(rules.preConditionRules).toContain(rule);
      });

      it("should throw an error if rule is not a SequencingRule", () => {
        const rules = new SequencingRules();

        expect(() => {
          rules.addPreConditionRule("not a rule" as any);
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("addExitConditionRule", () => {
      it("should add a rule to exitConditionRules", () => {
        const rules = new SequencingRules();
        const rule = new SequencingRule();

        rules.addExitConditionRule(rule);

        expect(rules.exitConditionRules).toContain(rule);
      });

      it("should throw an error if rule is not a SequencingRule", () => {
        const rules = new SequencingRules();

        expect(() => {
          rules.addExitConditionRule("not a rule" as any);
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("addPostConditionRule", () => {
      it("should add a rule to postConditionRules", () => {
        const rules = new SequencingRules();
        const rule = new SequencingRule();

        rules.addPostConditionRule(rule);

        expect(rules.postConditionRules).toContain(rule);
      });

      it("should throw an error if rule is not a SequencingRule", () => {
        const rules = new SequencingRules();

        expect(() => {
          rules.addPostConditionRule("not a rule" as any);
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("evaluatePreConditionRules", () => {
      it("should return null if no rules match", () => {
        const rules = new SequencingRules();
        const activity = new Activity();

        // Add a rule that won't match
        const rule = new SequencingRule(RuleActionType.SKIP);
        const condition = new RuleCondition(RuleConditionType.SATISFIED);
        rule.addCondition(condition);
        rules.addPreConditionRule(rule);

        activity.successStatus = SuccessStatus.FAILED;

        expect(rules.evaluatePreConditionRules(activity)).toBe(null);
      });

      it("should return the action of the first matching rule", () => {
        const rules = new SequencingRules();
        const activity = new Activity();

        // Add a rule that won't match
        const rule1 = new SequencingRule(RuleActionType.SKIP);
        const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
        rule1.addCondition(condition1);
        rules.addPreConditionRule(rule1);

        // Add a rule that will match
        const rule2 = new SequencingRule(RuleActionType.DISABLED);
        const condition2 = new RuleCondition(RuleConditionType.ALWAYS);
        rule2.addCondition(condition2);
        rules.addPreConditionRule(rule2);

        // Add another rule that will match but should be ignored
        const rule3 = new SequencingRule(RuleActionType.HIDE_FROM_CHOICE);
        const condition3 = new RuleCondition(RuleConditionType.ALWAYS);
        rule3.addCondition(condition3);
        rules.addPreConditionRule(rule3);

        expect(rules.evaluatePreConditionRules(activity)).toBe(RuleActionType.DISABLED);
      });
    });

    describe("evaluateExitConditionRules", () => {
      it("should return null if no rules match", () => {
        const rules = new SequencingRules();
        const activity = new Activity();

        // Add a rule that won't match
        const rule = new SequencingRule(RuleActionType.EXIT_PARENT);
        const condition = new RuleCondition(RuleConditionType.SATISFIED);
        rule.addCondition(condition);
        rules.addExitConditionRule(rule);

        activity.successStatus = SuccessStatus.FAILED;

        expect(rules.evaluateExitConditionRules(activity)).toBe(null);
      });

      it("should return the action of the first matching rule", () => {
        const rules = new SequencingRules();
        const activity = new Activity();

        // Add a rule that won't match
        const rule1 = new SequencingRule(RuleActionType.EXIT_PARENT);
        const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
        rule1.addCondition(condition1);
        rules.addExitConditionRule(rule1);

        // Add a rule that will match
        const rule2 = new SequencingRule(RuleActionType.EXIT_ALL);
        const condition2 = new RuleCondition(RuleConditionType.ALWAYS);
        rule2.addCondition(condition2);
        rules.addExitConditionRule(rule2);

        expect(rules.evaluateExitConditionRules(activity)).toBe(RuleActionType.EXIT_ALL);
      });
    });

    describe("evaluatePostConditionRules", () => {
      it("should return null if no rules match", () => {
        const rules = new SequencingRules();
        const activity = new Activity();

        // Add a rule that won't match
        const rule = new SequencingRule(RuleActionType.RETRY);
        const condition = new RuleCondition(RuleConditionType.SATISFIED);
        rule.addCondition(condition);
        rules.addPostConditionRule(rule);

        activity.successStatus = SuccessStatus.FAILED;

        expect(rules.evaluatePostConditionRules(activity)).toBe(null);
      });

      it("should return the action of the first matching rule", () => {
        const rules = new SequencingRules();
        const activity = new Activity();

        // Add a rule that won't match
        const rule1 = new SequencingRule(RuleActionType.RETRY);
        const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
        rule1.addCondition(condition1);
        rules.addPostConditionRule(rule1);

        // Add a rule that will match
        const rule2 = new SequencingRule(RuleActionType.CONTINUE);
        const condition2 = new RuleCondition(RuleConditionType.ALWAYS);
        rule2.addCondition(condition2);
        rules.addPostConditionRule(rule2);

        expect(rules.evaluatePostConditionRules(activity)).toBe(RuleActionType.CONTINUE);
      });
    });

    describe("toJSON", () => {
      it("should return a JSON representation of the rules", () => {
        const rules = new SequencingRules();
        const preRule = new SequencingRule(RuleActionType.SKIP);
        const exitRule = new SequencingRule(RuleActionType.EXIT_PARENT);
        const postRule = new SequencingRule(RuleActionType.RETRY);

        rules.addPreConditionRule(preRule);
        rules.addExitConditionRule(exitRule);
        rules.addPostConditionRule(postRule);

        const result = rules.toJSON();

        expect(result).toHaveProperty("preConditionRules");
        expect(result).toHaveProperty("exitConditionRules");
        expect(result).toHaveProperty("postConditionRules");
        expect(Array.isArray(result.preConditionRules)).toBe(true);
        expect(Array.isArray(result.exitConditionRules)).toBe(true);
        expect(Array.isArray(result.postConditionRules)).toBe(true);
        expect(result.preConditionRules.length).toBe(1);
        expect(result.exitConditionRules.length).toBe(1);
        expect(result.postConditionRules.length).toBe(1);
        expect(result.preConditionRules[0]).toBe(preRule);
        expect(result.exitConditionRules[0]).toBe(exitRule);
        expect(result.postConditionRules[0]).toBe(postRule);
      });
    });
  });
});
