import { describe, expect, it } from "vitest";
import Scorm2004API from "../../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../../src/constants/enums";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupProcess } from "../../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { RollupChildFilter } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupConsiderationType,
  RollupRule,
} from "../../../../../src/cmi/scorm2004/sequencing/rollup_rules";

function setSatisfiedChildren(parent: Activity, satisfied: number): void {
  parent.children.forEach((child, index) => {
    child.sequencingControls.tracked = true;
    child.sequencingControls.rollupObjectiveSatisfied = true;
    child.requiredForSatisfied = "always";
    child.attemptCount = 1;
    child.attemptProgressStatus = true;
    child.objectiveSatisfiedStatus = index < satisfied;
  });
}

describe("minimumPercent units", () => {
  for (const [name, evaluate] of [
    [
      "RollupRuleEvaluator",
      (parent: Activity, rule: RollupRule) =>
        new RollupRuleEvaluator(new RollupChildFilter()).evaluateRollupRule(parent, rule),
    ],
    [
      "legacy RollupRule.evaluate",
      (parent: Activity, rule: RollupRule) => rule.evaluate(parent.children),
    ],
  ] as const) {
    describe(name, () => {
      it.each([
        [0.5, 2, true],
        [0.75, 2, false],
        [50, 2, true],
        [75, 2, false],
        [1, 2, false],
        [1, 3, false],
        [1, 4, true],
        [0.25, 1, true],
      ] as const)(
        "threshold %s with %s of 4 satisfied returns %s",
        (threshold, satisfied, expected) => {
          const parent = new Activity("parent");
          for (let index = 0; index < 4; index++) {
            parent.addChild(new Activity("child-" + index));
          }
          setSatisfiedChildren(parent, satisfied);
          const rule = new RollupRule(
            RollupActionType.SATISFIED,
            RollupConsiderationType.AT_LEAST_PERCENT,
            0,
            threshold,
          );
          rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));

          expect(evaluate(parent, rule)).toBe(expected);
        },
      );
    });
  }

  it("does not satisfy the parent at 2 of 4 through API sequencing settings requiring 0.75", () => {
    const api = new Scorm2004API({
      logLevel: LogLevelEnum.NONE,
      sequencing: {
        activityTree: {
          id: "parent",
          title: "Parent",
          children: Array.from({ length: 4 }, (_, index) => ({
            id: "child-" + index,
            title: "Child " + index,
          })),
          rollupRules: {
            rules: [
              {
                action: "satisfied",
                consideration: "atLeastPercent",
                minimumPercent: 0.75,
                conditions: [{ condition: "satisfied" }],
              },
            ],
          },
        },
      },
    });
    const parent = api._sequencing.activityTree.root!;
    setSatisfiedChildren(parent, 2);

    new RollupProcess().overallRollupProcess(parent.children[0]);

    expect(parent.rollupRules.rules[0].minimumPercent).toBe(0.75);
    expect(parent.objectiveSatisfiedStatus).toBe(false);
  });
});
