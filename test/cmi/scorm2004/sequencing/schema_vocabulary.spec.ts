import { describe, expect, it } from "vitest";
import {
  RollupActionType,
  RollupConditionCombination,
  RollupConditionOperator,
  RollupConditionType,
  RollupConsiderationType,
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import {
  RuleActionType,
  RuleConditionOperator,
  RuleConditionType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

/**
 * Token lists from the IMS Simple Sequencing schema that SCORM 2004 manifests are written
 * against (imsss_v1p0util.xsd and imsss_v1p0seqrule.xsd, shipped in every SCORM 2004 package).
 * Each enum must accept every schema token. scorm-again may add its own extensions.
 */
const schema = {
  sequencingRuleConditionType: [
    "satisfied",
    "objectiveStatusKnown",
    "objectiveMeasureKnown",
    "objectiveMeasureGreaterThan",
    "objectiveMeasureLessThan",
    "completed",
    "activityProgressKnown",
    "attempted",
    "attemptLimitExceeded",
    "timeLimitExceeded",
    "outsideAvailableTimeRange",
    "always",
  ],
  rollupRuleConditionType: [
    "satisfied",
    "objectiveStatusKnown",
    "objectiveMeasureKnown",
    "completed",
    "activityProgressKnown",
    "attempted",
    "attemptLimitExceeded",
    "timeLimitExceeded",
    "outsideAvailableTimeRange",
  ],
  conditionOperatorType: ["not", "noOp"],
  conditionCombinationType: ["all", "any"],
  childActivityType: ["all", "any", "none", "atLeastCount", "atLeastPercent"],
  rollupActionType: ["satisfied", "notSatisfied", "completed", "incomplete"],
  sequencingRuleActionType: [
    // preConditionRuleActionType
    "skip",
    "disabled",
    "hiddenFromChoice",
    "stopForwardTraversal",
    // postConditionRuleActionType
    "exitParent",
    "exitAll",
    "retry",
    "retryAll",
    "continue",
    "previous",
    // exitConditionRuleActionType
    "exit",
  ],
};

describe("IMS SS schema vocabulary", () => {
  it.each([
    ["RuleConditionType", RuleConditionType, schema.sequencingRuleConditionType],
    ["RuleConditionOperator", RuleConditionOperator, schema.conditionOperatorType],
    ["RuleActionType", RuleActionType, schema.sequencingRuleActionType],
    ["RollupConditionType", RollupConditionType, schema.rollupRuleConditionType],
    ["RollupConditionOperator", RollupConditionOperator, schema.conditionOperatorType],
    ["RollupConditionCombination", RollupConditionCombination, schema.conditionCombinationType],
    ["RollupConsiderationType", RollupConsiderationType, schema.childActivityType],
    ["RollupActionType", RollupActionType, schema.rollupActionType],
  ])("%s accepts every schema token", (_name, values, tokens) => {
    expect(Object.values(values)).toEqual(expect.arrayContaining(tokens));
  });
});
