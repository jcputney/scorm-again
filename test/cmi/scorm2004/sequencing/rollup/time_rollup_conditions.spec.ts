import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionOperator,
  RollupConditionType,
  RollupConsiderationType,
  RollupRule,
} from "../../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { RollupChildFilter } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import { RollupProcess } from "../../../../../src/cmi/scorm2004/sequencing/rollup_process";

/**
 * timeLimitExceeded and outsideAvailableTimeRange are rollup condition types in
 * IMS SS (rollupConditionType) and are evaluated by the Evaluate Rollup
 * Conditions Subprocess (SN RB.1.4.1), with the same meaning as the sequencing
 * rule conditions of the same name.
 */
describe("Time-based rollup conditions (RB.1.4.1)", () => {
  const at = (iso: string) => () => new Date(iso);
  let activity: Activity;

  beforeEach(() => {
    activity = new Activity("child", "Child");
  });

  describe("timeLimitExceeded", () => {
    const condition = new RollupCondition(RollupConditionType.TIME_LIMIT_EXCEEDED);

    it("is true when the attempt has run longer than the time limit", () => {
      activity.timeLimitDuration = "PT1H";
      activity.attemptExperiencedDuration = "PT2H";
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("is false within the limit, and when there is no limit", () => {
      activity.timeLimitDuration = "PT2H";
      activity.attemptExperiencedDuration = "PT1H";
      expect(condition.evaluate(activity)).toBe(false);

      const unlimited = new Activity("unlimited", "Unlimited");
      unlimited.attemptExperiencedDuration = "PT5H";
      expect(condition.evaluate(unlimited)).toBe(false);
    });

    it("measures attemptAbsoluteDurationLimit from the start time with the given clock", () => {
      activity.attemptAbsoluteDurationLimit = "PT30M";
      activity.attemptAbsoluteStartTime = "2025-06-15T10:00:00Z";
      expect(condition.evaluate(activity, at("2025-06-15T11:00:00Z"))).toBe(true);
      expect(condition.evaluate(activity, at("2025-06-15T10:10:00Z"))).toBe(false);
    });

    it("prefers the elapsed-seconds hook", () => {
      activity.timeLimitDuration = "PT1H";
      activity.attemptExperiencedDuration = "PT10M";
      expect(condition.evaluate(activity, at("2025-06-15T10:00:00Z"), () => 7200)).toBe(true);
    });

    it("can be negated", () => {
      activity.timeLimitDuration = "PT1H";
      activity.attemptExperiencedDuration = "PT2H";
      const notExceeded = new RollupCondition(
        RollupConditionType.TIME_LIMIT_EXCEEDED,
        new Map(),
        RollupConditionOperator.NOT,
      );
      expect(notExceeded.evaluate(activity)).toBe(false);
    });
  });

  describe("outsideAvailableTimeRange", () => {
    const condition = new RollupCondition(RollupConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
    const noon = at("2025-06-15T12:00:00Z");

    it("is true before the begin time and after the end time", () => {
      activity.beginTimeLimit = "2025-06-15T13:00:00Z";
      expect(condition.evaluate(activity, noon)).toBe(true);

      const ended = new Activity("ended", "Ended");
      ended.endTimeLimit = "2025-06-15T11:00:00Z";
      expect(condition.evaluate(ended, noon)).toBe(true);
    });

    it("is false inside the range, and when there is no range", () => {
      activity.beginTimeLimit = "2025-06-15T10:00:00Z";
      activity.endTimeLimit = "2025-06-15T14:00:00Z";
      expect(condition.evaluate(activity, noon)).toBe(false);
      expect(condition.evaluate(new Activity("open", "Open"), noon)).toBe(false);
    });
  });

  describe("in rollup rules", () => {
    let parent: Activity;
    let children: Activity[];

    beforeEach(() => {
      parent = new Activity("parent", "Parent");
      children = [new Activity("a", "A"), new Activity("b", "B")];
      for (const child of children) {
        parent.addChild(child);
        child.sequencingControls.tracked = true;
        child.sequencingControls.rollupObjectiveSatisfied = true;
        child.sequencingControls.rollupProgressCompletion = true;
        child.attemptProgressStatus = true;
        child.attemptCount = 1;
      }
      children[0]!.endTimeLimit = "2025-06-15T11:00:00Z";
    });

    const closedRule = () => {
      const rule = new RollupRule(RollupActionType.NOT_SATISFIED, RollupConsiderationType.ANY);
      rule.addCondition(new RollupCondition(RollupConditionType.OUTSIDE_AVAILABLE_TIME_RANGE));
      return rule;
    };

    it("evaluates with the evaluator's clock", () => {
      const filter = new RollupChildFilter();
      const afterEnd = new RollupRuleEvaluator(filter, { now: at("2025-06-15T12:00:00Z") });
      const beforeEnd = new RollupRuleEvaluator(filter, { now: at("2025-06-15T10:00:00Z") });
      expect(afterEnd.evaluateRollupRule(parent, closedRule())).toBe(true);
      expect(beforeEnd.evaluateRollupRule(parent, closedRule())).toBe(false);
    });

    it("passes the evaluator the elapsed-seconds hook", () => {
      children[1]!.timeLimitDuration = "PT1H";
      const rule = new RollupRule(RollupActionType.NOT_SATISFIED, RollupConsiderationType.ANY);
      rule.addCondition(new RollupCondition(RollupConditionType.TIME_LIMIT_EXCEEDED));
      const evaluator = new RollupRuleEvaluator(new RollupChildFilter(), {
        getAttemptElapsedSeconds: (child) => (child.id === "b" ? 7200 : 0),
      });
      expect(evaluator.evaluateRollupRule(parent, rule)).toBe(true);
    });

    it("rolls up through RollupProcess with the clock it was given", () => {
      parent.rollupRules.addRule(closedRule());

      // Before child a's end time the rule does not apply: nothing is rolled up.
      new RollupProcess(undefined, { now: at("2025-06-15T10:00:00Z") }).overallRollupProcess(
        children[0]!,
      );
      expect(parent.objectiveSatisfiedStatusKnown).toBe(false);

      // After it, child a is outside its available time range: notSatisfied.
      new RollupProcess(undefined, { now: at("2025-06-15T12:00:00Z") }).overallRollupProcess(
        children[0]!,
      );
      expect(parent.objectiveSatisfiedStatusKnown).toBe(true);
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });
  });
});
