import { describe, expect, it } from "vitest";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupCondition,
  RollupConditionOperator,
  RollupConditionType,
} from "../../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { CompletionStatus } from "../../../../../src/constants/enums";

describe("activityProgressKnown rollup condition", () => {
  it.each([false, true])("matches progressKnown for known progress %s, including not", (known) => {
    const activity = new Activity("child", "Child");
    activity.completionStatus = known ? CompletionStatus.INCOMPLETE : CompletionStatus.UNKNOWN;
    for (const operator of [RollupConditionOperator.NO_OP, RollupConditionOperator.NOT]) {
      const expected = operator === RollupConditionOperator.NOT ? !known : known;
      for (const name of [
        RollupConditionType.PROGRESS_KNOWN,
        RollupConditionType.ACTIVITY_PROGRESS_KNOWN,
      ]) {
        expect(new RollupCondition(name, new Map(), operator).evaluate(activity)).toBe(expected);
      }
    }
  });
});
