import { describe, it, expect, beforeEach, vi } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {
  SequencingRule,
  RuleCondition,
  RuleActionType,
  RuleConditionType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Time Limit Edge Cases (UP.1)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rootActivity: Activity;
  let testActivity: Activity;

  beforeEach(() => {
    // Create activities first
    rootActivity = new Activity("root", "Root Activity");
    testActivity = new Activity("test", "Test Activity");

    // Set up hierarchy
    rootActivity.addChild(testActivity);

    // Enable choice controls (required for choice sequencing)
    rootActivity.sequencingControls.choice = true;
    rootActivity.sequencingControls.flow = true;
    testActivity.sequencingControls.choice = true;

    // Disable preventActivation to allow delivery to new activities
    rootActivity.sequencingControls.preventActivation = false;

    // Set activity state
    rootActivity.isActive = false;
    testActivity.isActive = false;
    // Set attemptCount > 0 to bypass preventActivation check
    testActivity.attemptCount = 1;

    // Initialize the tree structure
    rootActivity.initialize();

    // Create tree and process AFTER activities are fully configured
    activityTree = new ActivityTree(rootActivity);
    sequencingProcess = new SequencingProcess(activityTree);

    // Set current activity (null for no current activity - starting fresh)
    activityTree.currentActivity = null;
  });

  describe("timeLimitExceeded - Duration Limit Tests", () => {
    it("should return false when no time limit is defined", () => {
      // Setup: No time limit
      testActivity.timeLimitDuration = null;
      testActivity.attemptAbsoluteDurationLimit = null;

      // Add a rule with timeLimitExceeded condition
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      // Test: Condition should be false, activity should be deliverable
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Activity should be deliverable (not skipped)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should handle attempt duration exactly at limit (boundary test)", () => {
      // Setup: 10 second limit
      testActivity.timeLimitDuration = "PT10S";

      // Mock time: exactly 10 seconds elapsed
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:10.000Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();

      // Mock clock
      sequencingProcess.now = () => currentTime;

      // Add skip rule on time limit exceeded
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Exactly at limit should NOT exceed (need to be strictly greater)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should detect attempt duration 1ms over limit", () => {
      // Setup: 10 second limit
      testActivity.timeLimitDuration = "PT10S";

      // Mock time: 10.001 seconds elapsed (1ms over)
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:10.001Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (limit exceeded)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle sub-second precision (100ms increments)", () => {
      // Setup: 0.5 second limit (500ms)
      testActivity.timeLimitDuration = "PT0.5S";

      // Mock time: 0.6 seconds elapsed (600ms)
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:00.600Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (0.6s > 0.5s)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should fallback to attemptAbsoluteDurationLimit when timeLimitDuration not set", () => {
      // Setup: Only attemptAbsoluteDurationLimit set
      testActivity.timeLimitDuration = null;
      testActivity.attemptAbsoluteDurationLimit = "PT5S";

      // Mock time: 6 seconds elapsed
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:06.000Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (6s > 5s using fallback limit)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should use hook-based calculation when getAttemptElapsedSecondsHook is set", () => {
      // Setup: 10 second limit
      testActivity.timeLimitDuration = "PT10S";

      // Mock hook returning 15 seconds
      sequencingProcess.getAttemptElapsedSecondsHook = (activity: Activity) => {
        if (activity.id === "test") {
          return 15; // Exceeded
        }
        return 0;
      };

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (hook returns 15s > 10s limit)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should fallback to timestamp-based calculation when hook returns invalid value", () => {
      // Setup: 10 second limit
      testActivity.timeLimitDuration = "PT10S";

      // Mock time: 12 seconds elapsed
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:12.000Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();
      sequencingProcess.now = () => currentTime;

      // Mock hook returning invalid value (NaN)
      sequencingProcess.getAttemptElapsedSecondsHook = () => NaN;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped using timestamp fallback (12s > 10s)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should fallback to timestamp-based calculation when hook throws error", () => {
      // Setup: 10 second limit
      testActivity.timeLimitDuration = "PT10S";

      // Mock time: 12 seconds elapsed
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:12.000Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();
      sequencingProcess.now = () => currentTime;

      // Mock hook throwing error
      sequencingProcess.getAttemptElapsedSecondsHook = () => {
        throw new Error("Hook failed");
      };

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped using timestamp fallback (12s > 10s)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle invalid duration string gracefully (null)", () => {
      // Setup: null duration
      testActivity.timeLimitDuration = null;
      testActivity.attemptAbsoluteDurationLimit = null;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;

      // Should not throw, should return deliverable
      expect(() =>
        sequencingProcess.sequencingRequestProcess(SequencingRequestType.CHOICE, "test"),
      ).not.toThrow();
    });

    it("should handle invalid duration string gracefully (malformed)", () => {
      // Setup: malformed duration (getDurationAsSeconds returns 0)
      testActivity.timeLimitDuration = "INVALID";

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (invalid limit = no limit = false condition)
      expect(result.deliveryRequest).toBe("deliver");
    });
  });

  describe("outsideAvailableTimeRange - Time Range Tests", () => {
    it("should return true when current time is before beginTimeLimit", () => {
      // Setup: Begin time in future
      const beginTime = new Date("2025-01-01T15:00:00.000Z");
      const currentTime = new Date("2025-01-01T14:00:00.000Z"); // 1 hour before
      testActivity.beginTimeLimit = beginTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule on outside time range
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (before begin time)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should return true when current time is after endTimeLimit", () => {
      // Setup: End time in past
      const endTime = new Date("2025-01-01T14:00:00.000Z");
      const currentTime = new Date("2025-01-01T15:00:00.000Z"); // 1 hour after
      testActivity.endTimeLimit = endTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (after end time)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should return false when current time is within time range", () => {
      // Setup: Current time between begin and end
      const beginTime = new Date("2025-01-01T12:00:00.000Z");
      const endTime = new Date("2025-01-01T16:00:00.000Z");
      const currentTime = new Date("2025-01-01T14:00:00.000Z"); // In range
      testActivity.beginTimeLimit = beginTime.toISOString();
      testActivity.endTimeLimit = endTime.toISOString();

      // Mock both clock sources for consistent time
      sequencingProcess.now = () => currentTime;
      RuleCondition.setNowProvider(() => currentTime);

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (within range)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should handle timezone-aware dates (UTC)", () => {
      // Setup: UTC timezone
      const beginTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T11:00:00.000Z");
      testActivity.beginTimeLimit = beginTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (before begin time)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle timezone-aware dates (+05:00 offset)", () => {
      // Setup: +05:00 timezone
      testActivity.beginTimeLimit = "2025-01-01T17:00:00+05:00"; // 12:00 UTC
      const currentTime = new Date("2025-01-01T11:00:00.000Z"); // 11:00 UTC

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (11:00 UTC < 12:00 UTC)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle timezone-aware dates (-08:00 offset)", () => {
      // Setup: -08:00 timezone
      testActivity.endTimeLimit = "2025-01-01T06:00:00-08:00"; // 14:00 UTC
      const currentTime = new Date("2025-01-01T15:00:00.000Z"); // 15:00 UTC

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (15:00 UTC > 14:00 UTC)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle edge case: only beginTimeLimit defined (before)", () => {
      // Setup: Only begin time, current before begin
      const beginTime = new Date("2025-01-01T15:00:00.000Z");
      const currentTime = new Date("2025-01-01T14:00:00.000Z");
      testActivity.beginTimeLimit = beginTime.toISOString();
      testActivity.endTimeLimit = null;

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (before begin)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle edge case: only beginTimeLimit defined (after)", () => {
      // Setup: Only begin time, current after begin
      const beginTime = new Date("2025-01-01T14:00:00.000Z");
      const currentTime = new Date("2025-01-01T15:00:00.000Z");
      testActivity.beginTimeLimit = beginTime.toISOString();
      testActivity.endTimeLimit = null;

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (after begin, no end limit)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should handle edge case: only endTimeLimit defined (before)", () => {
      // Setup: Only end time, current before end
      const endTime = new Date("2025-01-01T15:00:00.000Z");
      const currentTime = new Date("2025-01-01T14:00:00.000Z");
      testActivity.beginTimeLimit = null;
      testActivity.endTimeLimit = endTime.toISOString();

      // Mock both clock sources for consistent time
      sequencingProcess.now = () => currentTime;
      RuleCondition.setNowProvider(() => currentTime);

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (before end, no begin limit)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should handle edge case: only endTimeLimit defined (after)", () => {
      // Setup: Only end time, current after end
      const endTime = new Date("2025-01-01T14:00:00.000Z");
      const currentTime = new Date("2025-01-01T15:00:00.000Z");
      testActivity.beginTimeLimit = null;
      testActivity.endTimeLimit = endTime.toISOString();

      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (after end)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should handle edge case: neither limit defined", () => {
      // Setup: No time limits
      testActivity.beginTimeLimit = null;
      testActivity.endTimeLimit = null;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (no limits = always inside range)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should handle invalid date format gracefully", () => {
      // Setup: Invalid date string
      testActivity.beginTimeLimit = "INVALID_DATE";

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(
        new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE),
      );
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;

      // Should not throw, should treat as no limit
      expect(() =>
        sequencingProcess.sequencingRequestProcess(SequencingRequestType.CHOICE, "test"),
      ).not.toThrow();
    });
  });

  describe("parseISO8601Duration - Enhanced Format Support", () => {
    it("should parse full ISO 8601 duration with all components (P1Y2M3DT4H5M6S)", () => {
      // This is tested indirectly through timeLimitExceeded
      // Setup: Complex duration
      testActivity.timeLimitDuration = "P1Y2M3DT4H5M6S";

      // Mock time: way over limit
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      // 1 year + 2 months + 3 days + 4 hours + 5 minutes + 6 seconds ≈ 396 days
      const currentTime = new Date("2026-02-05T12:00:00.000Z"); // Approx 1 year 1 month later
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();
      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should handle complex duration (implementation detail: approximate conversions used)
      // We're way over the limit so should be skipped
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should parse duration with weeks component (P2W)", () => {
      // Setup: 2 week duration (14 days)
      testActivity.timeLimitDuration = "P2W";

      // Mock time: 15 days elapsed
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-16T12:00:00.000Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();
      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (15 days > 14 days)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should parse duration with decimal seconds (PT1.5S)", () => {
      // Setup: 1.5 second limit
      testActivity.timeLimitDuration = "PT1.5S";

      // Mock time: 2 seconds elapsed
      const startTime = new Date("2025-01-01T12:00:00.000Z");
      const currentTime = new Date("2025-01-01T12:00:02.000Z");
      testActivity.attemptAbsoluteStartTime = startTime.toISOString();
      sequencingProcess.now = () => currentTime;

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      activityTree.currentActivity = rootActivity;
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be skipped (2s > 1.5s)
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should reject invalid duration 'P' (empty duration)", () => {
      // Setup: Invalid "P" only
      testActivity.timeLimitDuration = "P";

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (invalid duration treated as no limit)
      expect(result.deliveryRequest).toBe("deliver");
    });

    it("should reject invalid duration ending with 'T'", () => {
      // Setup: Invalid duration ending with T
      testActivity.timeLimitDuration = "P1DT";

      // Add skip rule
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED));
      testActivity.sequencingRules.addPreConditionRule(rule);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test",
      );

      // Should be deliverable (invalid duration treated as no limit)
      expect(result.deliveryRequest).toBe("deliver");
    });
  });
});
