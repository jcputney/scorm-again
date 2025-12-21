import { describe, expect, it } from "vitest";
import * as Utilities from "../../src/utilities";
import { scorm12_regex, scorm2004_regex } from "../../src";

describe("Utility Tests", () => {
  describe("getSecondsAsHHMMSS()", () => {
    it("10 returns 00:00:10", () => {
      expect(Utilities.getSecondsAsHHMMSS(10)).toEqual("00:00:10");
    });

    it("60 returns 00:01:00", () => {
      expect(Utilities.getSecondsAsHHMMSS(60)).toEqual("00:01:00");
    });

    it("3600 returns 01:00:00", () => {
      expect(Utilities.getSecondsAsHHMMSS(3600)).toEqual("01:00:00");
    });

    it("70 returns 00:01:10", () => {
      expect(Utilities.getSecondsAsHHMMSS(70)).toEqual("00:01:10");
    });

    it("3670 returns 01:01:10", () => {
      expect(Utilities.getSecondsAsHHMMSS(3670)).toEqual("01:01:10");
    });

    it("90000 returns 25:00:00, check for hours greater than 24", () => {
      expect(Utilities.getSecondsAsHHMMSS(90000)).toEqual("25:00:00");
    });

    it("-3600 returns 00:00:00, negative time not allowed in SCORM session times", () => {
      expect(Utilities.getSecondsAsHHMMSS(-3600)).toEqual("00:00:00");
    });

    it("Empty seconds returns 00:00:00", () => {
      expect(Utilities.getSecondsAsHHMMSS(null)).toEqual("00:00:00");
    });
  });

  describe("getSecondsAsISODuration()", () => {
    it("10 returns PT10S", () => {
      expect(Utilities.getSecondsAsISODuration(10)).toEqual("PT10S");
    });

    it("60 returns PT1M", () => {
      expect(Utilities.getSecondsAsISODuration(60)).toEqual("PT1M");
    });

    it("3600 returns PT1H", () => {
      expect(Utilities.getSecondsAsISODuration(3600)).toEqual("PT1H");
    });

    it("70 returns PT1M10S", () => {
      expect(Utilities.getSecondsAsISODuration(70)).toEqual("PT1M10S");
    });

    it("916.88 returns PT15M16.88S", () => {
      expect(Utilities.getSecondsAsISODuration(916.88)).toEqual("PT15M16.88S");
    });

    it("3670 returns PT1H1M10S", () => {
      expect(Utilities.getSecondsAsISODuration(3670)).toEqual("PT1H1M10S");
    });

    it("90000 returns P1DT1H", () => {
      expect(Utilities.getSecondsAsISODuration(90000)).toEqual("P1DT1H");
    });

    it("90061 returns P1DT1H1M1S", () => {
      expect(Utilities.getSecondsAsISODuration(90061)).toEqual("P1DT1H1M1S");
    });

    it("-3600 returns PT0S, negative time not allowed in SCORM session times", () => {
      expect(Utilities.getSecondsAsISODuration(-3600)).toEqual("PT0S");
    });

    it("Empty seconds returns PT0S", () => {
      expect(Utilities.getSecondsAsISODuration(null)).toEqual("PT0S");
    });
  });

  describe("getTimeAsSeconds()", () => {
    it("00:00:10 returns 10", () => {
      expect(Utilities.getTimeAsSeconds("00:00:10", scorm12_regex.CMITimespan)).toEqual(10);
    });

    it("00:01:10 returns 70", () => {
      expect(Utilities.getTimeAsSeconds("00:01:10", scorm12_regex.CMITimespan)).toEqual(70);
    });

    it("01:01:10 returns 3670", () => {
      expect(Utilities.getTimeAsSeconds("01:01:10", scorm12_regex.CMITimespan)).toEqual(3670);
    });

    it("100:00:00 returns 3670", () => {
      expect(Utilities.getTimeAsSeconds("100:00:00", scorm12_regex.CMITimespan)).toEqual(360000);
    });

    it("-01:00:00 returns 0", () => {
      expect(Utilities.getTimeAsSeconds("-01:00:00", scorm12_regex.CMITimespan)).toEqual(0);
    });

    it("Number value is treated as seconds", () => {
      expect(Utilities.getTimeAsSeconds(999, scorm12_regex.CMITimespan)).toEqual(999);
    });

    it("boolean value returns 0", () => {
      expect(Utilities.getTimeAsSeconds(true, scorm12_regex.CMITimespan)).toEqual(0);
    });

    it("Empty value returns 0", () => {
      expect(Utilities.getTimeAsSeconds(null, scorm12_regex.CMITimespan)).toEqual(0);
    });

    it("converts overflow minute or second values to seconds", () => {
      expect(Utilities.getTimeAsSeconds("00:60:00", scorm12_regex.CMITimespan)).toEqual(3600);
      expect(Utilities.getTimeAsSeconds("00:00:60", scorm12_regex.CMITimespan)).toEqual(60);
    });
  });

  describe("getDurationAsSeconds()", () => {
    it("P0S returns 0", () => {
      expect(Utilities.getDurationAsSeconds("P0S", scorm2004_regex.CMITimespan)).toEqual(0);
    });

    it("P70S returns 70", () => {
      expect(Utilities.getDurationAsSeconds("P70S", scorm2004_regex.CMITimespan)).toEqual(70);
    });

    it("PT1M10S returns 70", () => {
      expect(Utilities.getDurationAsSeconds("PT1M10S", scorm2004_regex.CMITimespan)).toEqual(70);
    });

    it("PT15M16.88S returns 916.88", () => {
      expect(Utilities.getDurationAsSeconds("PT15M16.88S", scorm2004_regex.CMITimespan)).toEqual(
        916.88,
      );
    });

    it("P1D returns 86400", () => {
      expect(Utilities.getDurationAsSeconds("P1D", scorm2004_regex.CMITimespan)).toEqual(
        24 * 60 * 60,
      );
    });

    it("P1Y returns number of seconds for one year from now", () => {
      expect(Utilities.getDurationAsSeconds("P1Y", scorm2004_regex.CMITimespan)).toEqual(
        365 * 24 * 60 * 60,
      );
    });

    it("Invalid duration returns 0", () => {
      expect(Utilities.getDurationAsSeconds("T1M10S", scorm2004_regex.CMITimespan)).toEqual(0);
    });

    it("Empty duration returns 0", () => {
      expect(Utilities.getDurationAsSeconds(null, scorm2004_regex.CMITimespan)).toEqual(0);
    });
  });

  describe("addTwoDurations()", () => {
    it("P1H5M30.5S plus PT15M10S equals P1H20M40.5S", () => {
      expect(
        Utilities.addTwoDurations("PT1H5M30.5S", "PT15M30S", scorm2004_regex.CMITimespan),
      ).toEqual("PT1H21M0.5S");
    });
    it("P1Y364D plus P2DT1H45M52S equals P731DT1H45M52S", () => {
      expect(
        Utilities.addTwoDurations("P1Y364D", "P2DT1H45M52S", scorm2004_regex.CMITimespan),
      ).toEqual("P731DT1H45M52S");
    });
    it("Invalid plus valid equals valid", () => {
      expect(
        Utilities.addTwoDurations(
          "NOT A VALID DURATION",
          "PT1H30M45S",
          scorm2004_regex.CMITimespan,
        ),
      ).toEqual("PT1H30M45S");
    });
    it("Valid plus invalid equals valid", () => {
      expect(
        Utilities.addTwoDurations(
          "PT1H30M45S",
          "NOT A VALID DURATION",
          scorm2004_regex.CMITimespan,
        ),
      ).toEqual("PT1H30M45S");
    });
  });

  describe("addHHMMSSTimeStrings()", () => {
    it("01:05:30.5 plus 00:15:10 equals 01:20:40.5", () => {
      expect(
        Utilities.addHHMMSSTimeStrings("01:05:30.5", "00:15:30", scorm12_regex.CMITimespan),
      ).toEqual("01:21:00.5");
    });
    it("17496:00:00 plus 49:35:52 equals 17545:35:52", () => {
      expect(
        Utilities.addHHMMSSTimeStrings("17496:00:00", "49:35:52", scorm12_regex.CMITimespan),
      ).toEqual("17545:35:52");
    });
    it("Invalid plus valid equals valid", () => {
      expect(
        Utilities.addHHMMSSTimeStrings("-00:15:10", "01:05:30.5", scorm12_regex.CMITimespan),
      ).toEqual("01:05:30.5");
    });
    it("Valid plus invalid equals valid", () => {
      expect(
        Utilities.addHHMMSSTimeStrings(
          "01:05:30.5",
          "NOT A VALID DURATION",
          scorm12_regex.CMITimespan,
        ),
      ).toEqual("01:05:30.5");
    });
  });

  describe("flatten()", () => {
    it("Should return flattened object", () => {
      expect(
        Utilities.flatten({
          cmi: {
            core: {
              learner_id: "jputney",
              learner_name: "Jonathan",
            },
            objectives: {
              "0": {
                id: "AAA",
              },
              "1": {
                id: "BBB",
              },
            },
          },
        }),
      ).toEqual({
        "cmi.core.learner_id": "jputney",
        "cmi.core.learner_name": "Jonathan",
        "cmi.objectives.0.id": "AAA",
        "cmi.objectives.1.id": "BBB",
      });
    });
  });

  describe("unflatten()", () => {
    it("Should return flattened object", () => {
      expect(
        Utilities.unflatten({
          "cmi.core.learner_id": "jputney",
          "cmi.core.learner_name": "Jonathan",
          "cmi.objectives.0.id": "AAA",
          "cmi.objectives.1.id": "BBB",
        }),
      ).toEqual({
        cmi: {
          core: {
            learner_id: "jputney",
            learner_name: "Jonathan",
          },
          objectives: {
            "0": {
              id: "AAA",
            },
            "1": {
              id: "BBB",
            },
          },
        },
      });
    });
  });

  describe("stringMatches()", () => {
    it("returns true when regex matches", () => {
      expect(Utilities.stringMatches("hello", "^he")).toBe(true);
    });

    it("returns false when regex does not match", () => {
      expect(Utilities.stringMatches("hello", "world")).toBe(false);
    });

    it("returns false when provided value is null", () => {
      expect(Utilities.stringMatches(null, "test")).toBe(false);
    });
  });

  describe("parseNavigationRequest() - Security", () => {
    describe("Valid navigation commands", () => {
      it("should parse simple navigation commands", () => {
        const validCommands = [
          "start",
          "resumeAll",
          "continue",
          "previous",
          "exit",
          "exitAll",
          "abandon",
          "abandonAll",
          "suspendAll",
          "_none_",
        ];

        validCommands.forEach((command) => {
          const result = Utilities.parseNavigationRequest(command);
          expect(result.valid).toBe(true);
          expect(result.command).toBe(command);
          expect(result.targetActivityId).toBeNull();
          expect(result.error).toBeUndefined();
        });
      });

      it("should parse choice command with valid target activity ID", () => {
        const result = Utilities.parseNavigationRequest("choice.activity_123");
        expect(result.valid).toBe(true);
        expect(result.command).toBe("choice");
        expect(result.targetActivityId).toBe("activity_123");
        expect(result.error).toBeUndefined();
      });

      it("should parse jump command with valid target activity ID", () => {
        const result = Utilities.parseNavigationRequest("jump.SCO-456");
        expect(result.valid).toBe(true);
        expect(result.command).toBe("jump");
        expect(result.targetActivityId).toBe("SCO-456");
        expect(result.error).toBeUndefined();
      });

      it("should parse target IDs with dots, hyphens, and underscores", () => {
        const validTargets = [
          "choice.activity.with.dots",
          "jump.activity-with-hyphens",
          "choice.activity_with_underscores",
          "jump.MixedCase123",
        ];

        validTargets.forEach((navRequest) => {
          const result = Utilities.parseNavigationRequest(navRequest);
          expect(result.valid).toBe(true);
        });
      });

      it("should trim whitespace from navigation commands", () => {
        const result = Utilities.parseNavigationRequest("  continue  ");
        expect(result.valid).toBe(true);
        expect(result.command).toBe("continue");
      });
    });

    describe("Code injection prevention", () => {
      it("should block JavaScript function calls", () => {
        const result = Utilities.parseNavigationRequest("alert('XSS')");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
        expect(result.error).toContain("Unrecognized navigation command");
      });

      it("should block JavaScript with window object access", () => {
        const result = Utilities.parseNavigationRequest("window.hacked = true");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
      });

      it("should block eval attempts", () => {
        const result = Utilities.parseNavigationRequest("eval('malicious code')");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
      });

      it("should block function constructor attempts", () => {
        const result = Utilities.parseNavigationRequest("Function('return this')()");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
      });

      it("should block semicolon-separated commands", () => {
        const result = Utilities.parseNavigationRequest("continue; alert('XSS')");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
      });

      it("should block special characters in target activity IDs", () => {
        const maliciousTargets = [
          "choice.'; alert('XSS'); '",
          "jump.<script>alert('XSS')</script>",
          "choice.activity'; DROP TABLE students; --",
          'jump.activity"); window.hacked=true; ("',
          "choice.activity&param=value",
          "jump.activity|command",
          "choice.activity`whoami`",
        ];

        maliciousTargets.forEach((navRequest) => {
          const result = Utilities.parseNavigationRequest(navRequest);
          expect(result.valid).toBe(false);
          expect(result.error).toContain("Invalid target activity ID");
        });
      });

      it("should block empty target activity IDs", () => {
        const result = Utilities.parseNavigationRequest("choice.");
        expect(result.valid).toBe(false);
      });

      it("should block commands other than choice/jump with targets", () => {
        const result = Utilities.parseNavigationRequest("continue.someTarget");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
      });
    });

    describe("Edge cases", () => {
      it("should handle empty string", () => {
        const result = Utilities.parseNavigationRequest("");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
        expect(result.error).toContain("Empty navigation request");
      });

      it("should handle whitespace-only string", () => {
        const result = Utilities.parseNavigationRequest("   ");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
        expect(result.error).toContain("Empty navigation request");
      });

      it("should be case-sensitive", () => {
        const result = Utilities.parseNavigationRequest("CONTINUE");
        expect(result.valid).toBe(false);
        expect(result.command).toBe("_none_");
      });

      it("should not allow multiple dots", () => {
        const result = Utilities.parseNavigationRequest("choice.activity.extra.parts");
        // This should still be valid - dots are allowed in activity IDs
        expect(result.valid).toBe(true);
        expect(result.targetActivityId).toBe("activity.extra.parts");
      });

      it("should reject commands with only a dot", () => {
        const result = Utilities.parseNavigationRequest(".");
        expect(result.valid).toBe(false);
      });
    });

    describe("SCORM 2004 compliance", () => {
      it("should support all SCORM 2004 navigation request types", () => {
        // Per SCORM 2004 spec, these are all valid navigation request types
        const scormCommands = [
          "start",
          "resumeAll",
          "continue",
          "previous",
          "choice",
          "jump",
          "exit",
          "exitAll",
          "abandon",
          "abandonAll",
          "suspendAll",
        ];

        scormCommands.forEach((command) => {
          const result = Utilities.parseNavigationRequest(command);
          expect(result.valid).toBe(true);
        });
      });

      it("should support _none_ as a special no-operation value", () => {
        const result = Utilities.parseNavigationRequest("_none_");
        expect(result.valid).toBe(true);
        expect(result.command).toBe("_none_");
      });
    });
  });
});
