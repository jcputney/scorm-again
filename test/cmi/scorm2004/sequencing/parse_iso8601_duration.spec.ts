import { describe, expect, it } from "vitest";
import {
  RuleCondition,
  RuleConditionType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

/**
 * Tests for parseISO8601Duration method in RuleCondition
 *
 * This test suite validates that the parseISO8601Duration method correctly handles
 * all ISO 8601 duration formats as specified by SCORM 2004:
 * - Date components: Years (Y), Months (M), Weeks (W), Days (D)
 * - Time components: Hours (H), Minutes (M), Seconds (S)
 * - Combined date and time components
 *
 * Critical Bug Fix: [SEQ-RULES-02]
 * Previously, parseISO8601Duration only supported time components (PT...)
 * Now it correctly handles full ISO 8601 duration format including date components.
 */
describe("RuleCondition - parseISO8601Duration", () => {
  let activity: Activity;
  let condition: RuleCondition;

  // Helper to test duration parsing via TIME_LIMIT_EXCEEDED condition
  const testDurationParsing = (timeLimitDuration: string, attemptDuration: string): boolean => {
    activity = new Activity("test");
    activity.timeLimitDuration = timeLimitDuration;
    activity.attemptExperiencedDuration = attemptDuration;

    condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
    return condition.evaluate(activity);
  };

  describe("Time-only durations (PT...)", () => {
    it("should parse hours only (PT1H)", () => {
      // 1 hour limit, 2 hours elapsed - should exceed
      expect(testDurationParsing("PT1H", "PT2H")).toBe(true);
      // 2 hours limit, 1 hour elapsed - should not exceed
      expect(testDurationParsing("PT2H", "PT1H")).toBe(false);
    });

    it("should parse minutes only (PT30M)", () => {
      // 30 minutes limit, 45 minutes elapsed - should exceed
      expect(testDurationParsing("PT30M", "PT45M")).toBe(true);
      // 45 minutes limit, 30 minutes elapsed - should not exceed
      expect(testDurationParsing("PT45M", "PT30M")).toBe(false);
    });

    it("should parse seconds only (PT90S)", () => {
      // 90 seconds limit, 120 seconds elapsed - should exceed
      expect(testDurationParsing("PT90S", "PT120S")).toBe(true);
      // 120 seconds limit, 90 seconds elapsed - should not exceed
      expect(testDurationParsing("PT120S", "PT90S")).toBe(false);
    });

    it("should parse decimal seconds (PT1.5S)", () => {
      // 1.5 seconds limit, 2 seconds elapsed - should exceed
      expect(testDurationParsing("PT1.5S", "PT2S")).toBe(true);
      // 2 seconds limit, 1.5 seconds elapsed - should not exceed
      expect(testDurationParsing("PT2S", "PT1.5S")).toBe(false);
    });

    it("should parse hours and minutes (PT1H30M)", () => {
      // 1.5 hours limit, 2 hours elapsed - should exceed
      expect(testDurationParsing("PT1H30M", "PT2H")).toBe(true);
      // 2 hours limit, 1.5 hours elapsed - should not exceed
      expect(testDurationParsing("PT2H", "PT1H30M")).toBe(false);
    });

    it("should parse all time components (PT1H30M45S)", () => {
      // 1:30:45 limit, 2:00:00 elapsed - should exceed
      expect(testDurationParsing("PT1H30M45S", "PT2H")).toBe(true);
      // 2:00:00 limit, 1:30:45 elapsed - should not exceed
      expect(testDurationParsing("PT2H", "PT1H30M45S")).toBe(false);
    });
  });

  describe("Date-only durations (P...)", () => {
    it("should parse days only (P1D)", () => {
      // 1 day (24 hours) limit, 2 days elapsed - should exceed
      expect(testDurationParsing("P1D", "P2D")).toBe(true);
      // 2 days limit, 1 day elapsed - should not exceed
      expect(testDurationParsing("P2D", "P1D")).toBe(false);
    });

    it("should parse weeks only (P2W)", () => {
      // 2 weeks (14 days) limit, 3 weeks elapsed - should exceed
      expect(testDurationParsing("P2W", "P3W")).toBe(true);
      // 3 weeks limit, 2 weeks elapsed - should not exceed
      expect(testDurationParsing("P3W", "P2W")).toBe(false);
    });

    it("should parse years only (P1Y)", () => {
      // 1 year limit, 2 years elapsed - should exceed
      expect(testDurationParsing("P1Y", "P2Y")).toBe(true);
      // 2 years limit, 1 year elapsed - should not exceed
      expect(testDurationParsing("P2Y", "P1Y")).toBe(false);
    });

    it("should parse months only (P3M)", () => {
      // 3 months limit, 6 months elapsed - should exceed
      expect(testDurationParsing("P3M", "P6M")).toBe(true);
      // 6 months limit, 3 months elapsed - should not exceed
      expect(testDurationParsing("P6M", "P3M")).toBe(false);
    });
  });

  describe("Combined date and time durations", () => {
    it("should parse days and hours (P1DT12H)", () => {
      // 1.5 days limit, 2 days elapsed - should exceed
      expect(testDurationParsing("P1DT12H", "P2D")).toBe(true);
      // 2 days limit, 1.5 days elapsed - should not exceed
      expect(testDurationParsing("P2D", "P1DT12H")).toBe(false);
    });

    it("should parse full ISO 8601 duration (P1Y2M3DT4H5M6S)", () => {
      // Complex duration: approximately 14 months (1Y2M) + 3 days + 4:05:06
      // P1Y2M3DT4H5M6S = 365d + 60d + 3d + 4h + 5m + 6s ≈ 428 days
      // P2Y = 730 days
      // With limit P1Y2M3DT4H5M6S and elapsed P2Y, should exceed (730 > 428)
      expect(testDurationParsing("P1Y2M3DT4H5M6S", "P2Y")).toBe(true);
      // With limit P2Y and elapsed P1Y2M3DT4H5M6S, should not exceed (428 < 730)
      expect(testDurationParsing("P2Y", "P1Y2M3DT4H5M6S")).toBe(false);
    });

    it("should parse days with time components (P7DT6H30M)", () => {
      // 1 week + 6.5 hours limit, 2 weeks elapsed - should exceed
      expect(testDurationParsing("P7DT6H30M", "P14D")).toBe(true);
      // 2 weeks limit, 1 week + 6.5 hours elapsed - should not exceed
      expect(testDurationParsing("P14D", "P7DT6H30M")).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle PT0S (zero duration)", () => {
      // Zero limit is treated as "no limit" - returns false (defensive check)
      // This prevents accidental instant timeouts
      expect(testDurationParsing("PT0S", "PT1S")).toBe(false);
      // Normal limit with zero elapsed - should not exceed
      expect(testDurationParsing("PT1S", "PT0S")).toBe(false);
    });

    it("should handle P0D (zero days)", () => {
      // Zero days is treated as "no limit" (same as PT0S)
      expect(testDurationParsing("P0D", "PT1H")).toBe(false);
    });

    it("should return false for invalid duration (empty)", () => {
      // Invalid durations should be treated as no limit
      activity = new Activity("test");
      activity.timeLimitDuration = ""; // invalid
      activity.attemptExperiencedDuration = "PT1H";

      condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false for invalid duration (just P)", () => {
      activity = new Activity("test");
      activity.timeLimitDuration = "P"; // invalid - no components
      activity.attemptExperiencedDuration = "PT1H";

      condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false for invalid duration (ends with T)", () => {
      activity = new Activity("test");
      activity.timeLimitDuration = "P1DT"; // invalid - T with no time components
      activity.attemptExperiencedDuration = "PT1H";

      condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should handle very large durations", () => {
      // 100 years limit, 200 years elapsed - should exceed
      expect(testDurationParsing("P100Y", "P200Y")).toBe(true);
      // 200 years limit, 100 years elapsed - should not exceed
      expect(testDurationParsing("P200Y", "P100Y")).toBe(false);
    });
  });

  describe("SCORM 2004 spec examples", () => {
    it("should parse example from spec: PT1H5M (1 hour 5 minutes)", () => {
      // From SCORM 2004 data-types.md
      expect(testDurationParsing("PT1H5M", "PT2H")).toBe(true);
      expect(testDurationParsing("PT2H", "PT1H5M")).toBe(false);
    });

    it("should parse example from spec: PT45M30.5S (45 minutes 30.5 seconds)", () => {
      // From SCORM 2004 data-types.md
      expect(testDurationParsing("PT45M30.5S", "PT46M")).toBe(true);
      expect(testDurationParsing("PT46M", "PT45M30.5S")).toBe(false);
    });

    it("should parse example from spec: P1Y3M2DT3H (1 year, 3 months, 2 days, 3 hours)", () => {
      // From SCORM 2004 data-types.md
      // P1Y3M2DT3H ≈ 457 days, P2Y ≈ 730 days
      // With limit P1Y3M2DT3H and elapsed P2Y, should exceed
      expect(testDurationParsing("P1Y3M2DT3H", "P2Y")).toBe(true);
      // With limit P2Y and elapsed P1Y3M2DT3H, should not exceed
      expect(testDurationParsing("P2Y", "P1Y3M2DT3H")).toBe(false);
    });
  });

  describe("Equivalences (as noted in SCORM spec)", () => {
    it("should treat PT5M and PT300S as equivalent (5 minutes = 300 seconds)", () => {
      // Both represent the same duration
      // PT5M limit with PT300S elapsed should not exceed (equal)
      // We test by using slightly different values
      expect(testDurationParsing("PT5M", "PT301S")).toBe(true);
      expect(testDurationParsing("PT300S", "PT5M1S")).toBe(true);
    });

    it("should treat P1D and PT24H as equivalent (1 day = 24 hours)", () => {
      // Both represent the same duration
      expect(testDurationParsing("P1D", "PT25H")).toBe(true);
      expect(testDurationParsing("PT24H", "P1DT1H")).toBe(true);
    });
  });

  describe("Real-world sequencing scenarios", () => {
    it("should enforce 30-minute time limit for quiz", () => {
      // Common scenario: quiz with 30-minute time limit
      expect(testDurationParsing("PT30M", "PT35M")).toBe(true); // Exceeded
      expect(testDurationParsing("PT30M", "PT29M59S")).toBe(false); // Within limit
    });

    it("should enforce 1-hour time limit for lesson", () => {
      // Common scenario: lesson with 1-hour time limit
      expect(testDurationParsing("PT1H", "PT1H5M")).toBe(true); // Exceeded
      expect(testDurationParsing("PT1H", "PT59M30S")).toBe(false); // Within limit
    });

    it("should enforce 7-day access window for course", () => {
      // Common scenario: course with 7-day access window
      expect(testDurationParsing("P7D", "P8D")).toBe(true); // Exceeded
      expect(testDurationParsing("P7D", "P6DT23H")).toBe(false); // Within limit
    });

    it("should enforce 90-day course completion limit", () => {
      // Common scenario: course must be completed within 90 days
      expect(testDurationParsing("P90D", "P91D")).toBe(true); // Exceeded
      expect(testDurationParsing("P90D", "P89DT23H59M")).toBe(false); // Within limit
    });
  });
});
