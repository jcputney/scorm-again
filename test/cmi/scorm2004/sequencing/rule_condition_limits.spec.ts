import { afterEach, describe, it } from "vitest";

import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RuleCondition, RuleConditionType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

const resetNowProvider = () => RuleCondition.setNowProvider(() => new Date());

describe("RuleCondition limit evaluations", () => {
  afterEach(() => {
    resetNowProvider();
  });

  it("should detect when an attempt limit has been exceeded", () => {
    const activity = new Activity("a1");
    activity.attemptLimit = 1;
    activity.attemptCount = 1;

    const condition = new RuleCondition(
      RuleConditionType.ATTEMPT_LIMIT_EXCEEDED,
      null,
      new Map([["attemptLimit", 1]]),
    );
    expect(condition.evaluate(activity)).toBe(true);

    activity.attemptCount = 0;
    expect(condition.evaluate(activity)).toBe(false);
  });

  it("should evaluate time limit exceeded based on experienced duration", () => {
    const activity = new Activity("a2");
    activity.timeLimitDuration = "PT1M";
    activity.attemptExperiencedDuration = "PT2M";

    const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
    expect(condition.evaluate(activity)).toBe(true);

    activity.attemptExperiencedDuration = "PT30S";
    expect(condition.evaluate(activity)).toBe(false);
  });

  it("should detect when current time is outside the available time range", () => {
    const fixedNow = new Date("2025-06-15T12:00:00Z");
    RuleCondition.setNowProvider(() => fixedNow);

    const activity = new Activity("a3");
    activity.beginTimeLimit = "2025-06-20T00:00:00Z"; // now is before begin

    const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
    expect(condition.evaluate(activity)).toBe(true);

    activity.beginTimeLimit = "2025-06-10T00:00:00Z";
    activity.endTimeLimit = "2025-06-14T23:59:59Z"; // now after end
    expect(condition.evaluate(activity)).toBe(true);

    activity.endTimeLimit = "2025-06-16T00:00:00Z";
    expect(condition.evaluate(activity)).toBe(false);
  });
});
