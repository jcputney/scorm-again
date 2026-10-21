import { describe, expect, it } from "vitest";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { RollupProcess } from "../../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { DeliveryHandler } from "../../../../../src/cmi/scorm2004/sequencing/handlers/delivery_handler";
import {
  RuleCondition,
  RuleConditionType,
} from "../../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("DB.2 attempt timing", () => {
  function fixture(suspended: boolean) {
    const activity = new Activity("a");
    const tree = new ActivityTree();
    tree.root = activity;
    activity.isSuspended = suspended;
    activity.attemptAbsoluteStartTime = "2026-10-21T00:00:00.000Z";
    activity.attemptAbsoluteDuration = "PT0H2M0S";
    activity.attemptExperiencedDuration = "PT0H1M30S";
    const now = () => new Date("2026-10-21T00:03:00.000Z");
    const handler = new DeliveryHandler(tree, new RollupProcess(), new Map(), null, null, { now });
    return { activity, handler, now };
  }

  it("preserves the suspended attempt start time and durations on resume", () => {
    const { activity, handler } = fixture(true);
    handler.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptAbsoluteStartTime).toBe("2026-10-21T00:00:00.000Z");
    expect(activity.attemptAbsoluteDuration).toBe("PT0H2M0S");
    expect(activity.attemptExperiencedDuration).toBe("PT0H1M30S");
  });

  it("keeps timeLimitExceeded true after resumed delivery", () => {
    const { activity, handler, now } = fixture(true);
    activity.timeLimitDuration = "PT0H1M0S";
    const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
    expect(condition.evaluate(activity, now, null)).toBe(true);
    handler.contentDeliveryEnvironmentProcess(activity);
    expect(condition.evaluate(activity, now, null)).toBe(true);
  });

  it("starts the clock on resume when the attempt has no start time", () => {
    const { activity, handler, now } = fixture(true);
    activity.attemptAbsoluteStartTime = "";
    handler.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptAbsoluteStartTime).toBe(now().toISOString());
  });

  it("starts a new attempt clock at delivery", () => {
    const { activity, handler, now } = fixture(false);
    handler.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptAbsoluteStartTime).toBe(now().toISOString());
    expect(activity.attemptAbsoluteDuration).toBe("PT0H0M0S");
    expect(activity.attemptExperiencedDuration).toBe("PT0H0M0S");
  });
});
