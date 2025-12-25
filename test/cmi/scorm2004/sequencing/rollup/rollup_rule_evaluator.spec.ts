import { beforeEach, describe, expect, it } from "vitest";
import { RollupRuleEvaluator } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import { RollupChildFilter } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType,
  RollupConsiderationType,
  RollupRule,
} from "../../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { CompletionStatus } from "../../../../../src/constants/enums";
import { createMockCondition } from "../../../../helpers/mock-factories";

describe("RollupRuleEvaluator", () => {
  let evaluator: RollupRuleEvaluator;
  let childFilter: RollupChildFilter;
  let parent: Activity;
  let child1: Activity;
  let child2: Activity;
  let child3: Activity;

  beforeEach(() => {
    childFilter = new RollupChildFilter();
    evaluator = new RollupRuleEvaluator(childFilter);

    parent = new Activity("parent", "Parent");
    child1 = new Activity("child1", "Child 1");
    child2 = new Activity("child2", "Child 2");
    child3 = new Activity("child3", "Child 3");

    parent.addChild(child1);
    parent.addChild(child2);
    parent.addChild(child3);

    // Enable rollup tracking for all children
    [child1, child2, child3].forEach((child) => {
      child.sequencingControls.tracked = true;
      child.sequencingControls.rollupObjectiveSatisfied = true;
      child.sequencingControls.rollupProgressCompletion = true;
      child.attemptProgressStatus = true;
      child.attemptCount = 1;
    });
  });

  describe("evaluateRollupRule", () => {
    describe("with SATISFIED action", () => {
      it("should evaluate satisfied rule with all children meeting conditions", () => {
        child1.objectiveSatisfiedStatus = true;
        child1.objectiveMeasureStatus = true;
        child2.objectiveSatisfiedStatus = true;
        child2.objectiveMeasureStatus = true;
        child3.objectiveSatisfiedStatus = true;
        child3.objectiveMeasureStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(true);
      });

      it("should return false when not all children satisfy conditions", () => {
        // Create conditions that check objectiveSatisfiedStatus
        const conditionThatChecksSatisfied = createMockCondition(
          (activity: Activity) => activity.objectiveSatisfiedStatus === true,
        );

        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = false;
        child3.objectiveSatisfiedStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [conditionThatChecksSatisfied],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(false);
      });
    });

    describe("with NOT_SATISFIED action", () => {
      it("should evaluate not satisfied rule correctly", () => {
        child1.objectiveSatisfiedStatus = false;
        child1.objectiveMeasureStatus = true;
        child2.objectiveSatisfiedStatus = false;
        child2.objectiveMeasureStatus = true;
        child3.objectiveSatisfiedStatus = false;
        child3.objectiveMeasureStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.NOT_SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(true);
      });
    });

    describe("with COMPLETED action", () => {
      it("should evaluate completed rule correctly", () => {
        child1.completionStatus = CompletionStatus.COMPLETED;
        child1.progressMeasureStatus = true;
        child2.completionStatus = CompletionStatus.COMPLETED;
        child2.progressMeasureStatus = true;
        child3.completionStatus = CompletionStatus.COMPLETED;
        child3.progressMeasureStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.COMPLETED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(true);
      });
    });

    describe("with INCOMPLETE action", () => {
      it("should evaluate incomplete rule correctly", () => {
        child1.completionStatus = CompletionStatus.INCOMPLETE;
        child1.progressMeasureStatus = true;
        child2.completionStatus = CompletionStatus.INCOMPLETE;
        child2.progressMeasureStatus = true;
        child3.completionStatus = CompletionStatus.INCOMPLETE;
        child3.progressMeasureStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.INCOMPLETE,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(true);
      });
    });

    describe("with minimumCount", () => {
      it("should pass when minimum count is met", () => {
        child1.objectiveSatisfiedStatus = true;
        child1.objectiveMeasureStatus = true;
        child2.objectiveSatisfiedStatus = true;
        child2.objectiveMeasureStatus = true;
        child3.objectiveSatisfiedStatus = false;
        child3.objectiveMeasureStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: 2,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(true);
      });

      it("should fail when minimum count is not met", () => {
        const conditionThatChecksSatisfied = createMockCondition(
          (activity: Activity) => activity.objectiveSatisfiedStatus === true,
        );

        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = false;
        child3.objectiveSatisfiedStatus = false;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [conditionThatChecksSatisfied],
          minimumCount: 2,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(false);
      });
    });

    describe("with minimumPercent", () => {
      it("should pass when minimum percent is met", () => {
        child1.objectiveSatisfiedStatus = true;
        child1.objectiveMeasureStatus = true;
        child2.objectiveSatisfiedStatus = true;
        child2.objectiveMeasureStatus = true;
        child3.objectiveSatisfiedStatus = false;
        child3.objectiveMeasureStatus = true;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: 0.5, // 50%
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(true);
      });

      it("should fail when minimum percent is not met", () => {
        const conditionThatChecksSatisfied = createMockCondition(
          (activity: Activity) => activity.objectiveSatisfiedStatus === true,
        );

        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = false;
        child3.objectiveSatisfiedStatus = false;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [conditionThatChecksSatisfied],
          minimumCount: null,
          minimumPercent: 0.75, // 75%
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(false);
      });

      it("should handle zero contributing children for minimumPercent", () => {
        // Make all children unavailable
        child1.isAvailable = false;
        child2.isAvailable = false;
        child3.isAvailable = false;

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: 0.5,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(parent, rule);
        expect(result).toBe(false);
      });
    });

    describe("with no children", () => {
      it("should return false when no contributing children", () => {
        const emptyParent = new Activity("empty", "Empty");

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupRule(emptyParent, rule);
        expect(result).toBe(false);
      });
    });
  });

  describe("evaluateRollupConditionsSubprocess", () => {
    it("should return true when no conditions are specified", () => {
      const rule: RollupRule = {
        action: RollupActionType.SATISFIED,
        consideration: RollupConsiderationType.ALL,
        conditions: [],
        minimumCount: null,
        minimumPercent: null,
        childActivitySet: "all",
      };

      const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
      expect(result).toBe(true);
    });

    describe("with ALL consideration", () => {
      it("should return true when all conditions are met", () => {
        const condition1 = createMockCondition(() => true);
        const condition2 = createMockCondition(() => true);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(true);
      });

      it("should return false when not all conditions are met", () => {
        const condition1 = createMockCondition(() => true);
        const condition2 = createMockCondition(() => false);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(false);
      });
    });

    describe("with ANY consideration", () => {
      it("should return true when at least one condition is met", () => {
        const condition1 = createMockCondition(() => false);
        const condition2 = createMockCondition(() => true);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ANY,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(true);
      });

      it("should return false when no conditions are met", () => {
        const condition1 = createMockCondition(() => false);
        const condition2 = createMockCondition(() => false);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ANY,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(false);
      });
    });

    describe("with NONE consideration", () => {
      it("should return true when no conditions are met", () => {
        const condition1 = createMockCondition(() => false);
        const condition2 = createMockCondition(() => false);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.NONE,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(true);
      });

      it("should return false when any condition is met", () => {
        const condition1 = createMockCondition(() => true);
        const condition2 = createMockCondition(() => false);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.NONE,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(false);
      });
    });

    describe("with AT_LEAST_COUNT consideration", () => {
      it("should treat as ALL for individual condition evaluation", () => {
        const condition1 = createMockCondition(() => true);
        const condition2 = createMockCondition(() => true);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.AT_LEAST_COUNT,
          conditions: [condition1, condition2],
          minimumCount: 1,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(true);
      });
    });

    describe("with AT_LEAST_PERCENT consideration", () => {
      it("should treat as ALL for individual condition evaluation", () => {
        const condition1 = createMockCondition(() => true);
        const condition2 = createMockCondition(() => true);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.AT_LEAST_PERCENT,
          conditions: [condition1, condition2],
          minimumCount: null,
          minimumPercent: 0.5,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(true);
      });
    });

    describe("with unknown consideration type", () => {
      it("should return false for unknown consideration type", () => {
        const condition1 = createMockCondition(() => true);

        const rule: RollupRule = {
          action: RollupActionType.SATISFIED,
          consideration: "unknown" as RollupConsiderationType,
          conditions: [condition1],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        };

        const result = evaluator.evaluateRollupConditionsSubprocess(child1, rule);
        expect(result).toBe(false);
      });
    });
  });

  describe("evaluateRulesForAction", () => {
    it("should return null when no matching rules", () => {
      const rules: RollupRule[] = [
        {
          action: RollupActionType.COMPLETED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        },
      ];

      const result = evaluator.evaluateRulesForAction(
        parent,
        rules,
        RollupActionType.SATISFIED
      );
      expect(result).toBeNull();
    });

    it("should return true when matching rule applies", () => {
      child1.objectiveSatisfiedStatus = true;
      child1.objectiveMeasureStatus = true;
      child2.objectiveSatisfiedStatus = true;
      child2.objectiveMeasureStatus = true;
      child3.objectiveSatisfiedStatus = true;
      child3.objectiveMeasureStatus = true;

      const rules: RollupRule[] = [
        {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        },
      ];

      const result = evaluator.evaluateRulesForAction(
        parent,
        rules,
        RollupActionType.SATISFIED
      );
      expect(result).toBe(true);
    });

    it("should return false when no matching rule applies", () => {
      const conditionThatChecksSatisfied = createMockCondition(
        (activity: Activity) => activity.objectiveSatisfiedStatus === true,
      );

      child1.objectiveSatisfiedStatus = false;
      child2.objectiveSatisfiedStatus = false;
      child3.objectiveSatisfiedStatus = false;

      const rules: RollupRule[] = [
        {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [conditionThatChecksSatisfied],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        },
      ];

      const result = evaluator.evaluateRulesForAction(
        parent,
        rules,
        RollupActionType.SATISFIED
      );
      expect(result).toBe(false);
    });

    it("should return true when any matching rule applies", () => {
      child1.objectiveSatisfiedStatus = true;
      child1.objectiveMeasureStatus = true;
      child2.objectiveSatisfiedStatus = false;
      child2.objectiveMeasureStatus = true;
      child3.objectiveSatisfiedStatus = false;
      child3.objectiveMeasureStatus = true;

      const rules: RollupRule[] = [
        {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        },
        {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ANY,
          conditions: [],
          minimumCount: 1,
          minimumPercent: null,
          childActivitySet: "all",
        },
      ];

      const result = evaluator.evaluateRulesForAction(
        parent,
        rules,
        RollupActionType.SATISFIED
      );
      expect(result).toBe(true);
    });

    it("should evaluate multiple matching rules until one applies", () => {
      child1.objectiveSatisfiedStatus = true;
      child1.objectiveMeasureStatus = true;
      child2.objectiveSatisfiedStatus = true;
      child2.objectiveMeasureStatus = true;
      child3.objectiveSatisfiedStatus = false;
      child3.objectiveMeasureStatus = true;

      const rules: RollupRule[] = [
        {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: null,
          minimumPercent: null,
          childActivitySet: "all",
        },
        {
          action: RollupActionType.SATISFIED,
          consideration: RollupConsiderationType.ALL,
          conditions: [],
          minimumCount: 2,
          minimumPercent: null,
          childActivitySet: "all",
        },
      ];

      const result = evaluator.evaluateRulesForAction(
        parent,
        rules,
        RollupActionType.SATISFIED
      );
      // Second rule (minimumCount: 2) should match
      expect(result).toBe(true);
    });
  });

  describe("integration scenarios", () => {
    it("should correctly filter and evaluate children with conditions", () => {
      // Set up children with mixed states
      child1.objectiveSatisfiedStatus = true;
      child1.objectiveMeasureStatus = true;
      child2.objectiveSatisfiedStatus = true;
      child2.objectiveMeasureStatus = true;
      child3.objectiveSatisfiedStatus = false;
      child3.objectiveMeasureStatus = true;

      const condition = createMockCondition(() => true);

      const rule: RollupRule = {
        action: RollupActionType.SATISFIED,
        consideration: RollupConsiderationType.ALL,
        conditions: [condition],
        minimumCount: null,
        minimumPercent: 0.66, // Need 66% of children
        childActivitySet: "all",
      };

      const result = evaluator.evaluateRollupRule(parent, rule);
      // 2/3 satisfied = 66.67% >= 66%
      expect(result).toBe(true);
    });
  });
});
