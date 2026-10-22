import { describe, expect, it } from "vitest";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType as Action,
  RollupCondition,
  RollupConditionCombination as Combination,
  RollupConditionOperator as Operator,
  RollupConditionType as Condition,
  RollupConsiderationType as ChildSet,
  RollupRule,
} from "../../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { RollupChildFilter } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import { ObjectiveRollupProcessor } from "../../../../../src/cmi/scorm2004/sequencing/rollup/objective_rollup";
import { CompletionStatus, SuccessStatus } from "../../../../../src/constants/enums";

import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ADLNav } from "../../../../../src/cmi/scorm2004/adl";
import {
  NavigationRequestType,
  OverallSequencingProcess,
} from "../../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

const filter = new RollupChildFilter();
const evaluator = new RollupRuleEvaluator(filter);
function tree(statuses: (boolean | null)[]) {
  const parent = new Activity("parent");
  const children = statuses.map((status, i) => {
    const child = new Activity(`child${i}`);
    parent.addChild(child);
    if (status !== null) child.objectiveSatisfiedStatus = status;
    return child;
  });
  return { parent, children };
}
function rule(set = ChildSet.ALL, condition = Condition.SATISFIED, operator = Operator.NO_OP) {
  const result = new RollupRule(Action.SATISFIED, set);
  result.addCondition(new RollupCondition(condition, new Map(), operator));
  return result;
}

describe("three-valued rollup conditions (RB.1.4 / RB.1.4.1)", () => {
  it.each([
    [SuccessStatus.PASSED, true, true],
    [SuccessStatus.FAILED, true, false],
    [SuccessStatus.UNKNOWN, true, "unknown"],
    [SuccessStatus.PASSED, false, "unknown"],
  ] as const)(
    "evaluates success status %s with objective info available %s",
    (status, available, expected) => {
      const child = new Activity("child");
      child.successStatus = status;
      child.objectiveInfoAvailableInCurrentParentAttempt = available;
      expect(child.objectiveSatisfiedStatusKnown).toBe(false);
      expect(new RollupCondition(Condition.SATISFIED).evaluateThreeValued(child)).toBe(expected);
    },
  );

  it.each([Combination.ALL, Combination.ANY])(
    "keeps empty conditions true for %s",
    (combination) => {
      const custom = new RollupRule(Action.SATISFIED, ChildSet.ALL, 0, 0, combination);
      expect(evaluator.evaluateRollupConditionsThreeValued(new Activity("child"), custom)).toBe(
        true,
      );
    },
  );

  it("keeps the parent unknown with a satisfied and a never-attempted child", () => {
    const { parent } = tree([true, null]);
    const custom = rule(ChildSet.ANY, Condition.SATISFIED, Operator.NOT);
    custom.action = Action.NOT_SATISFIED;
    parent.rollupRules.addRule(custom);
    expect(evaluator.evaluateRollupRule(parent, custom)).toBe(false);
    new ObjectiveRollupProcessor(filter, evaluator).objectiveRollupProcess(parent);
    expect(parent.objectiveSatisfiedStatusKnown).toBe(false);
  });

  it.each([null, true, false])("preserves unknown and negates known satisfied %s", (status) => {
    const {
      children: [child],
    } = tree([status]);
    const condition = new RollupCondition(Condition.SATISFIED, new Map(), Operator.NOT);
    expect(condition.evaluateThreeValued(child!)).toBe(status === null ? "unknown" : !status);
    expect(condition.evaluate(child!)).toBe(status === false);
  });

  it.each([
    Condition.COMPLETED,
    Condition.OBJECTIVE_MEASURE_GREATER_THAN,
    Condition.OBJECTIVE_MEASURE_LESS_THAN,
  ])("preserves unknown for %s including not", (type) => {
    const child = new Activity("child");
    const condition = new RollupCondition(type, new Map(), Operator.NOT);
    expect(condition.evaluateThreeValued(child)).toBe("unknown");
    if (type === Condition.COMPLETED) child.isCompleted = false;
    else child.objectiveMeasureStatus = true;
    expect(condition.evaluateThreeValued(child)).toBe(true);
  });

  it.each([
    [Combination.ALL, Condition.ALWAYS, Operator.NO_OP, "unknown"],
    [Combination.ALL, Condition.ALWAYS, Operator.NOT, false],
    [Combination.ANY, Condition.ALWAYS, Operator.NO_OP, true],
    [Combination.ANY, Condition.ALWAYS, Operator.NOT, "unknown"],
  ] as const)(
    "combines %s with a known condition and unknown",
    (combination, known, operator, expected) => {
      const custom = new RollupRule(Action.SATISFIED, ChildSet.ALL, 0, 0, combination);
      custom.addCondition(new RollupCondition(known, new Map(), operator));
      custom.addCondition(new RollupCondition(Condition.SATISFIED));
      expect(evaluator.evaluateRollupConditionsThreeValued(new Activity("child"), custom)).toBe(
        expected,
      );
    },
  );

  it("combines unknown and false as false in either order", () => {
    const custom = rule();
    custom.conditionCombination = Combination.ALL;
    custom.addCondition(new RollupCondition(Condition.ALWAYS, new Map(), Operator.NOT));
    expect(evaluator.evaluateRollupConditionsThreeValued(new Activity("child"), custom)).toBe(
      false,
    );
    custom.conditions.reverse();
    expect(evaluator.evaluateRollupConditionsThreeValued(new Activity("child"), custom)).toBe(
      false,
    );
  });

  it.each([
    [ChildSet.ALL, [true, null], false],
    [ChildSet.ANY, [true, null], true],
    [ChildSet.NONE, [false, null], false],
    [ChildSet.NONE, [false, false], true],
    [ChildSet.AT_LEAST_COUNT, [null, null], false],
    [ChildSet.AT_LEAST_PERCENT, [null, null], false],
  ] as const)("evaluates child set %s with %j", (set, statuses, expected) => {
    const { parent } = tree([...statuses]);
    expect(evaluator.evaluateRollupRule(parent, rule(set))).toBe(expected);
  });

  it.each([
    [75, false],
    [50, true],
  ] as const)("includes unknown children in the denominator at %s", (percent, expected) => {
    const { parent } = tree([true, true, null, null]);
    const custom = rule(ChildSet.AT_LEAST_PERCENT);
    custom.minimumPercent = percent;
    expect(evaluator.evaluateRollupRule(parent, custom)).toBe(expected);
  });

  it("compares exact whole-percent thresholds without rounding", () => {
    const { parent } = tree([true, false, null]);
    const custom = rule(ChildSet.AT_LEAST_PERCENT);
    custom.minimumPercent = 40;
    expect(evaluator.evaluateRollupRule(parent, custom)).toBe(false);
  });

  it("does not use previous parent-attempt objective or progress information", () => {
    const { parent, children } = tree([true, true]);
    parent.attemptCount = 1;
    for (const child of children) {
      child.attemptCount = 1;
      expect(child.sequencingControls.useCurrentAttemptObjectiveInfo).toBe(true);
      expect(child.sequencingControls.useCurrentAttemptProgressInfo).toBe(true);
      child.isCompleted = true;
    }
    // Enter a fresh sibling so the previous children have not been re-entered.
    const fresh = new Activity("fresh");
    fresh.sequencingControls.rollupObjectiveSatisfied = false;
    fresh.sequencingControls.rollupProgressCompletion = false;
    parent.addChild(fresh);
    parent.sequencingControls.flow = true;
    const activityTree = new ActivityTree();
    activityTree.root = parent;
    const process = new OverallSequencingProcess(
      activityTree,
      new SequencingProcess(activityTree),
      new RollupProcess(),
      new ADLNav(),
    );
    const request = process.processNavigationRequest(NavigationRequestType.CHOICE, "fresh");
    expect(request.valid).toBe(true);
    expect(request.targetActivity).toBe(fresh);
    expect(parent.attemptCount).toBe(2);
    for (const child of children) {
      expect(child.objectiveSatisfiedStatus).toBe(true);
      expect(child.isCompleted).toBe(true);
      expect(child.objectiveInfoAvailableInCurrentParentAttempt).toBe(false);
      expect(child.progressInfoAvailableInCurrentParentAttempt).toBe(false);
    }
    const completed = rule(ChildSet.ALL, Condition.COMPLETED);
    completed.action = Action.COMPLETED;
    for (const custom of [
      rule(),
      completed,
      rule(ChildSet.ANY, Condition.SATISFIED, Operator.NOT),
    ]) {
      expect(evaluator.evaluateRollupRule(parent, custom)).toBe(false);
    }
  });

  it.each([
    Condition.SATISFIED,
    Condition.COMPLETED,
    Condition.OBJECTIVE_MEASURE_GREATER_THAN,
    Condition.OBJECTIVE_MEASURE_LESS_THAN,
  ])("makes known %s unknown when its current-attempt info is unavailable", (type) => {
    const child = new Activity("child");
    child.objectiveSatisfiedStatus = true;
    child.isCompleted = true;
    child.objectiveMeasureStatus = true;
    child.objectiveNormalizedMeasure = 0.8;
    child.objectiveInfoAvailableInCurrentParentAttempt = false;
    child.progressInfoAvailableInCurrentParentAttempt = false;
    const condition = new RollupCondition(type, new Map(), Operator.NOT);
    expect(condition.evaluateThreeValued(child)).toBe("unknown");
    expect(condition.evaluate(child)).toBe(false);
  });

  it.each([
    [Condition.OBJECTIVE_STATUS_KNOWN, false],
    [Condition.OBJECTIVE_MEASURE_KNOWN, false],
    [Condition.PROGRESS_KNOWN, false],
    [Condition.ACTIVITY_PROGRESS_KNOWN, false],
    [Condition.ATTEMPTED, false],
    [Condition.NOT_ATTEMPTED, true],
    [Condition.ATTEMPT_LIMIT_EXCEEDED, false],
    [Condition.ALWAYS, true],
  ] as const)("keeps %s boolean with unavailable tracking", (type, expected) => {
    const child = new Activity("child");
    child.objectiveInfoAvailableInCurrentParentAttempt = false;
    child.progressInfoAvailableInCurrentParentAttempt = false;
    const condition = new RollupCondition(type);
    expect(condition.evaluateThreeValued(child)).toBe(expected);
    condition.operator = Operator.NOT;
    expect(condition.evaluateThreeValued(child)).toBe(!expected);
  });

  it.each([
    [ChildSet.ALL, false],
    [ChildSet.ANY, false],
    [ChildSet.NONE, false],
    [ChildSet.AT_LEAST_COUNT, true],
    [ChildSet.AT_LEAST_PERCENT, false],
  ] as const)("preserves excluded empty-set behavior for %s", (set, expected) => {
    const { parent, children } = tree([null]);
    children[0]!.sequencingControls.rollupObjectiveSatisfied = false;
    expect(evaluator.evaluateRollupRule(parent, rule(set))).toBe(expected);
  });

  it("keeps activityProgressKnown and time conditions boolean, with the clock hooks", () => {
    const child = new Activity("child");
    for (const type of [
      Condition.ACTIVITY_PROGRESS_KNOWN,
      Condition.TIME_LIMIT_EXCEEDED,
      Condition.OUTSIDE_AVAILABLE_TIME_RANGE,
    ]) {
      const condition = new RollupCondition(type);
      expect(
        condition.evaluateThreeValued(
          child,
          () => new Date(0),
          () => 0,
        ),
      ).toBe(false);
      condition.operator = Operator.NOT;
      expect(
        condition.evaluateThreeValued(
          child,
          () => new Date(0),
          () => 0,
        ),
      ).toBe(true);
    }
    child.completionStatus = CompletionStatus.COMPLETED;
    expect(new RollupCondition(Condition.ACTIVITY_PROGRESS_KNOWN).evaluateThreeValued(child)).toBe(
      true,
    );
  });
});
