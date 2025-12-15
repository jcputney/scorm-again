// Boundary Value Tests - Testing edge cases and boundary conditions for SCORM data types
// Spec Reference: SCORM 1.2 RTE Section 3.2, SCORM 2004 RTE Section 4.2

import { describe, expect, it, beforeEach } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";

describe("Boundary Value Tests", () => {
  describe("SCORM 1.2 Boundary Values", () => {
    let api: Scorm12API;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api.lmsInitialize();
    });

    describe("CMITimespan boundaries", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.2.4 - CMITimespan format HHHH:MM:SS.SS

      describe("Hour boundaries", () => {
        it("Should accept single-digit hours (0-9)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "5:30:15");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should accept double-digit hours (10-99)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "23:30:15");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should accept triple-digit hours (100-999)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "123:30:15");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should accept 4-digit hours (1000-9999)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "1234:30:15");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        // Note: Implementation accepts lenient timespan format (no max hour limit enforced)
        it("Should accept 5-digit hours (lenient implementation)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "10000:30:15");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should handle edge case: exactly 9999 hours", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "9999:59:59.99");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });
      });

      describe("Minute boundaries", () => {
        it("Should accept minutes 00-59", () => {
          expect(api.lmsSetValue("cmi.core.session_time", "01:00:00")).toBe("true");
          expect(api.lmsSetValue("cmi.core.session_time", "01:30:00")).toBe("true");
          expect(api.lmsSetValue("cmi.core.session_time", "01:59:00")).toBe("true");
        });

        // Note: Implementation accepts lenient timespan (minutes >= 60 allowed)
        it("Should accept minutes >= 60 (lenient implementation)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:60:00");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should reject minutes > 99", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:100:00");
          expect(result).toBe("false");
          expect(api.lmsGetLastError()).toBe("405");
        });

        it("Should handle edge case: exactly 59 minutes", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "12:59:30");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });
      });

      describe("Second boundaries", () => {
        it("Should accept seconds 00-59", () => {
          expect(api.lmsSetValue("cmi.core.session_time", "01:00:00")).toBe("true");
          expect(api.lmsSetValue("cmi.core.session_time", "01:00:30")).toBe("true");
          expect(api.lmsSetValue("cmi.core.session_time", "01:00:59")).toBe("true");
        });

        // Note: Implementation accepts lenient timespan (seconds >= 60 allowed)
        it("Should accept seconds >= 60 (lenient implementation)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:00:60");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should reject seconds > 99", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:00:100");
          expect(result).toBe("false");
          expect(api.lmsGetLastError()).toBe("405");
        });

        it("Should handle edge case: exactly 59 seconds", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "12:30:59");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });
      });

      describe("Decimal precision", () => {
        it("Should accept up to 2 decimal places (centiseconds)", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:30:45.99");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should reject more than 2 decimal places", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:30:45.999");
          expect(result).toBe("false");
          expect(api.lmsGetLastError()).toBe("405");
        });

        it("Should accept 1 decimal place", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:30:45.5");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should accept no decimal places", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "01:30:45");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });
      });

      describe("Edge cases", () => {
        it("Should accept minimum valid value: 00:00:00", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "00:00:00");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should accept maximum valid value: 9999:59:59.99", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "9999:59:59.99");
          expect(result).toBe("true");
          expect(api.lmsGetLastError()).toBe("0");
        });

        it("Should reject negative values", () => {
          const result = api.lmsSetValue("cmi.core.session_time", "-01:30:00");
          expect(result).toBe("false");
          expect(api.lmsGetLastError()).toBe("405");
        });
      });
    });

    describe("String length boundaries - suspend_data", () => {
      // Note: Implementation uses CMIString64000 (64000 chars) instead of spec's CMIString4096
      // See src/constants/regex.ts CMIString64000 for rationale

      it("Should accept suspend_data at exactly 63999 characters", () => {
        const data = "x".repeat(63999);
        const result = api.lmsSetValue("cmi.suspend_data", data);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept suspend_data at exactly 64000 characters", () => {
        const data = "x".repeat(64000);
        const result = api.lmsSetValue("cmi.suspend_data", data);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject suspend_data at 64001 characters", () => {
        const data = "x".repeat(64001);
        const result = api.lmsSetValue("cmi.suspend_data", data);
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("405");
      });

      it("Should accept empty suspend_data", () => {
        const result = api.lmsSetValue("cmi.suspend_data", "");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept suspend_data with 1 character", () => {
        const result = api.lmsSetValue("cmi.suspend_data", "x");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("String length boundaries - comments", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.2 - CMIString4096

      it("Should accept comments at exactly 4096 characters", () => {
        const data = "x".repeat(4096);
        const result = api.lmsSetValue("cmi.comments", data);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject comments at 4097 characters", () => {
        const data = "x".repeat(4097);
        const result = api.lmsSetValue("cmi.comments", data);
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("405");
      });
    });

    describe("Numeric score boundaries", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.2 - CMIDecimal (0..100)

      it("Should accept score.raw at exactly 0", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "0");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept score.raw at exactly 100", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "100");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject score.raw at -1", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "-1");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("Should reject score.raw at 101", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "101");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("Should accept decimal score.raw values within range", () => {
        expect(api.lmsSetValue("cmi.core.score.raw", "0.5")).toBe("true");
        expect(api.lmsSetValue("cmi.core.score.raw", "50.25")).toBe("true");
        expect(api.lmsSetValue("cmi.core.score.raw", "99.99")).toBe("true");
      });

      it("Should handle edge case: score boundaries with decimals", () => {
        expect(api.lmsSetValue("cmi.core.score.raw", "0.01")).toBe("true");
        expect(api.lmsSetValue("cmi.core.score.raw", "99.99")).toBe("true");
      });
    });

    describe("Array index boundaries", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.2.1.2 - Array indexing

      it("Should accept sequential array indexes starting at 0", () => {
        expect(api.lmsSetValue("cmi.objectives.0.id", "obj-0")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.1.id", "obj-1")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.2.id", "obj-2")).toBe("true");
      });

      // Note: SCORM 1.2 returns 402 (invalid set value) for skipped indexes
      it("Should reject skipped array indexes with error 402", () => {
        api.lmsSetValue("cmi.objectives.0.id", "obj-0");
        const result = api.lmsSetValue("cmi.objectives.2.id", "obj-2");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("402");
      });

      it("Should handle high array indexes sequentially", () => {
        // Build up to a high index sequentially
        for (let i = 0; i < 100; i++) {
          const result = api.lmsSetValue(`cmi.interactions.${i}.id`, `int-${i}`);
          expect(result).toBe("true");
        }
        // Next index should work
        const result = api.lmsSetValue("cmi.interactions.100.id", "int-100");
        expect(result).toBe("true");
      });

      it("Should enforce sequential indexing for nested arrays", () => {
        api.lmsSetValue("cmi.interactions.0.id", "int-0");
        expect(api.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj-0")).toBe("true");
        expect(api.lmsSetValue("cmi.interactions.0.objectives.1.id", "obj-1")).toBe("true");

        // Skip index 2
        const result = api.lmsSetValue("cmi.interactions.0.objectives.3.id", "obj-3");
        expect(result).toBe("false");
      });
    });

    describe("CMIIdentifier boundaries", () => {
      // Note: Implementation uses relaxed validation (printable ASCII + whitespace, max 255 chars)
      // instead of strict spec (alphanumeric + hyphen + underscore only, no spaces)
      // See src/constants/regex.ts CMIIdentifier for rationale

      it("Should accept identifier at exactly 255 characters", () => {
        const id = "a".repeat(255);
        const result = api.lmsSetValue("cmi.objectives.0.id", id);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject identifier at 256 characters", () => {
        const id = "a".repeat(256);
        const result = api.lmsSetValue("cmi.objectives.0.id", id);
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("405");
      });

      it("Should reject empty identifier", () => {
        // Empty identifiers are rejected - objectives need an ID to be meaningful
        const result = api.lmsSetValue("cmi.objectives.0.id", "");
        expect(result).toBe("false");
      });

      it("Should accept identifier with single character", () => {
        const result = api.lmsSetValue("cmi.objectives.0.id", "x");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept alphanumeric identifiers (strict spec format)", () => {
        expect(api.lmsSetValue("cmi.objectives.0.id", "objective1")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.1.id", "OBJ-123")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.2.id", "obj_test_456")).toBe("true");
      });

      it("Should accept identifiers with hyphens and underscores", () => {
        expect(api.lmsSetValue("cmi.objectives.0.id", "my-objective")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.1.id", "my_objective")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.2.id", "my-obj_123")).toBe("true");
      });

      // Relaxed validation tests (implementation accepts these, strict spec would reject)
      it("Should accept identifiers with spaces (relaxed validation)", () => {
        // Note: Strict SCORM 1.2 spec does NOT allow spaces, but we accept them for compatibility
        const result = api.lmsSetValue("cmi.objectives.0.id", "objective one");
        expect(result).toBe("true");
      });

      it("Should accept identifiers with periods (relaxed validation)", () => {
        // Note: Strict SCORM 1.2 spec does NOT allow periods, but we accept them for compatibility
        const result = api.lmsSetValue("cmi.objectives.0.id", "obj.1.2");
        expect(result).toBe("true");
      });

      it("Should accept identifiers with special characters (relaxed validation)", () => {
        // Note: Implementation allows all printable ASCII for legacy content compatibility
        expect(api.lmsSetValue("cmi.objectives.0.id", "obj@test")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.1.id", "obj#123")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.2.id", "obj+test")).toBe("true");
      });

      it("Should reject control characters (non-printable)", () => {
        // Control characters (0x00-0x1F) should be rejected
        const result = api.lmsSetValue("cmi.objectives.0.id", "obj\x00test");
        expect(result).toBe("false");
      });
    });
  });

  describe("SCORM 2004 Boundary Values", () => {
    let api: Scorm2004API;

    beforeEach(() => {
      api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      api.lmsInitialize();
    });

    describe("Score.scaled boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.12 - Real range -1 to 1

      it("Should accept score.scaled at exactly -1.0", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "-1.0");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept score.scaled at exactly -1", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "-1");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept score.scaled at exactly 0", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "0");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept score.scaled at exactly 1", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "1");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept score.scaled at exactly 1.0", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "1.0");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject score.scaled at -1.0001", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "-1.0001");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("Should reject score.scaled at 1.0001", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "1.0001");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("Should accept values within range", () => {
        expect(api.lmsSetValue("cmi.score.scaled", "-0.5")).toBe("true");
        expect(api.lmsSetValue("cmi.score.scaled", "0.5")).toBe("true");
        expect(api.lmsSetValue("cmi.score.scaled", "-0.9999")).toBe("true");
        expect(api.lmsSetValue("cmi.score.scaled", "0.9999")).toBe("true");
      });

      it("Should handle edge cases with high precision", () => {
        expect(api.lmsSetValue("cmi.score.scaled", "-0.999999")).toBe("true");
        expect(api.lmsSetValue("cmi.score.scaled", "0.999999")).toBe("true");
      });
    });

    describe("Progress measure boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.14 - Real range 0 to 1

      it("Should accept progress_measure at exactly 0", () => {
        const result = api.lmsSetValue("cmi.progress_measure", "0");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept progress_measure at exactly 1", () => {
        const result = api.lmsSetValue("cmi.progress_measure", "1");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject progress_measure at -0.0001", () => {
        const result = api.lmsSetValue("cmi.progress_measure", "-0.0001");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("Should reject progress_measure at 1.0001", () => {
        const result = api.lmsSetValue("cmi.progress_measure", "1.0001");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("Should accept values within range", () => {
        expect(api.lmsSetValue("cmi.progress_measure", "0.25")).toBe("true");
        expect(api.lmsSetValue("cmi.progress_measure", "0.5")).toBe("true");
        expect(api.lmsSetValue("cmi.progress_measure", "0.75")).toBe("true");
      });
    });

    describe("String length boundaries - suspend_data", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.16 - SPM (64000 chars)

      it("Should accept suspend_data at exactly 64000 characters", () => {
        const data = "x".repeat(64000);
        const result = api.lmsSetValue("cmi.suspend_data", data);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject suspend_data at 64001 characters", () => {
        const data = "x".repeat(64001);
        const result = api.lmsSetValue("cmi.suspend_data", data);
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should accept empty suspend_data", () => {
        const result = api.lmsSetValue("cmi.suspend_data", "");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept suspend_data near boundary", () => {
        const data = "x".repeat(63999);
        const result = api.lmsSetValue("cmi.suspend_data", data);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("String length boundaries - comments", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.3 - Comment with language (4000 chars)

      it("Should accept comment at exactly 4000 characters", () => {
        const comment = "x".repeat(4000);
        const result = api.lmsSetValue("cmi.comments_from_learner.0.comment", comment);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject comment at 4001 characters", () => {
        const comment = "x".repeat(4001);
        const result = api.lmsSetValue("cmi.comments_from_learner.0.comment", comment);
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should accept comment with language prefix at boundary", () => {
        // Language prefix counts toward total length
        const comment = "{lang=en}" + "x".repeat(4000 - 10);
        const result = api.lmsSetValue("cmi.comments_from_learner.0.comment", comment);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("String length boundaries - description", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2 - Long Identifier (250 chars)

      it("Should accept interaction description at exactly 250 characters", () => {
        api.lmsSetValue("cmi.interactions.0.id", "int-1");
        const description = "x".repeat(250);
        const result = api.lmsSetValue("cmi.interactions.0.description", description);
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject interaction description at 251 characters", () => {
        api.lmsSetValue("cmi.interactions.0.id", "int-1");
        const description = "x".repeat(251);
        const result = api.lmsSetValue("cmi.interactions.0.description", description);
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });
    });

    describe("Numeric score boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.13 - Real 10,7

      it("Should accept score.raw with 10 digits", () => {
        const result = api.lmsSetValue("cmi.score.raw", "1234567890");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      // Note: Implementation returns 406 (type mismatch) for 11+ digit numbers
      it("Should reject score.raw with 11 digits with error 406", () => {
        const result = api.lmsSetValue("cmi.score.raw", "12345678901");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should accept negative score.raw with 10 digits", () => {
        const result = api.lmsSetValue("cmi.score.raw", "-999999999");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      // Note: Implementation returns 406 (type mismatch) for 11+ digit numbers
      it("Should reject negative score.raw with 11 digits with error 406", () => {
        const result = api.lmsSetValue("cmi.score.raw", "-12345678901");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should accept score.raw with decimal values", () => {
        expect(api.lmsSetValue("cmi.score.raw", "123.456")).toBe("true");
        expect(api.lmsSetValue("cmi.score.raw", "9999.9999")).toBe("true");
      });

      it("Should handle maximum positive value", () => {
        const result = api.lmsSetValue("cmi.score.raw", "9999999999");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should handle maximum negative value", () => {
        const result = api.lmsSetValue("cmi.score.raw", "-999999999");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("Array index boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.1.2 - Array indexing

      it("Should accept sequential array indexes starting at 0", () => {
        expect(api.lmsSetValue("cmi.objectives.0.id", "obj-0")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.1.id", "obj-1")).toBe("true");
        expect(api.lmsSetValue("cmi.objectives.2.id", "obj-2")).toBe("true");
      });

      // Note: SCORM 2004 returns 351 (data model dependency not established) for skipped indexes
      it("Should reject skipped array indexes with error 351", () => {
        api.lmsSetValue("cmi.objectives.0.id", "obj-0");
        const result = api.lmsSetValue("cmi.objectives.2.id", "obj-2");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("351");
      });

      it("Should handle high array indexes sequentially", () => {
        for (let i = 0; i < 50; i++) {
          const result = api.lmsSetValue(`cmi.interactions.${i}.id`, `int-${i}`);
          expect(result).toBe("true");
        }
        const result = api.lmsSetValue("cmi.interactions.50.id", "int-50");
        expect(result).toBe("true");
      });

      it("Should enforce sequential indexing for nested arrays", () => {
        api.lmsSetValue("cmi.interactions.0.id", "int-0");
        expect(api.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj-0")).toBe("true");
        expect(api.lmsSetValue("cmi.interactions.0.objectives.1.id", "obj-1")).toBe("true");

        const result = api.lmsSetValue("cmi.interactions.0.objectives.3.id", "obj-3");
        expect(result).toBe("false");
      });
    });

    describe("Timestamp boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.19 - ISO 8601

      it("Should accept valid timestamp: 1970-01-01 (epoch)", () => {
        const result = api.lmsSetValue(
          "cmi.comments_from_learner.0.timestamp",
          "1970-01-01T00:00:00",
        );
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject timestamp before epoch: 1969-12-31", () => {
        const result = api.lmsSetValue(
          "cmi.comments_from_learner.0.timestamp",
          "1969-12-31T23:59:59",
        );
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      // Note: SCORM spec doesn't limit year range, implementation accepts 1970-9999
      it("Should accept far future date (2999)", () => {
        const result = api.lmsSetValue(
          "cmi.comments_from_learner.0.timestamp",
          "2999-12-31T23:59:59",
        );
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject invalid month: 13", () => {
        const result = api.lmsSetValue(
          "cmi.comments_from_learner.0.timestamp",
          "2023-13-01T12:00:00",
        );
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should reject invalid day: 32", () => {
        const result = api.lmsSetValue(
          "cmi.comments_from_learner.0.timestamp",
          "2023-01-32T12:00:00",
        );
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should reject invalid hour: 24", () => {
        const result = api.lmsSetValue(
          "cmi.comments_from_learner.0.timestamp",
          "2023-01-01T24:00:00",
        );
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });
    });

    describe("ISO 8601 Duration boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.20 - ISO 8601 Duration

      it("Should accept minimum duration: PT0S", () => {
        const result = api.lmsSetValue("cmi.session_time", "PT0S");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept complex duration", () => {
        const result = api.lmsSetValue("cmi.session_time", "P1Y2M3DT4H5M6S");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept large values", () => {
        const result = api.lmsSetValue("cmi.session_time", "P999Y999M999DT999H999M999S");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should reject negative duration", () => {
        const result = api.lmsSetValue("cmi.session_time", "-PT1H");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Should reject invalid format (SCORM 1.2 format)", () => {
        const result = api.lmsSetValue("cmi.session_time", "01:30:00");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });
    });

    describe("Audio level boundaries", () => {
      // Spec Reference: SCORM 2004 RTE Section 4.2.14 - Real range 0 to 1

      it("Should accept audio_level at exactly 0", () => {
        const result = api.lmsSetValue("cmi.learner_preference.audio_level", "0");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should accept audio_level at exactly 1", () => {
        const result = api.lmsSetValue("cmi.learner_preference.audio_level", "1");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      // Note: Implementation does not enforce audio_level range (accepts values > 1)
      it("Should accept audio_level > 1 (lenient implementation)", () => {
        const result = api.lmsSetValue("cmi.learner_preference.audio_level", "1.1");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      // Note: Implementation rejects negative audio_level as out of range
      it("Should reject negative audio_level with error 407", () => {
        const result = api.lmsSetValue("cmi.learner_preference.audio_level", "-0.1");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });
    });
  });

  describe("Cross-version boundary consistency", () => {
    it("Both versions should reject excessively long strings", () => {
      const api12 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api12.lmsInitialize();
      // SCORM 1.2 uses 64000 limit (not spec's 4096) for legacy compatibility
      const result12 = api12.lmsSetValue("cmi.suspend_data", "x".repeat(64001));

      const api2004 = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      api2004.lmsInitialize();
      const result2004 = api2004.lmsSetValue("cmi.suspend_data", "x".repeat(100000));

      expect(result12).toBe("false");
      expect(result2004).toBe("false");
    });

    it("Both versions should handle empty strings correctly", () => {
      const api12 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api12.lmsInitialize();
      const result12 = api12.lmsSetValue("cmi.suspend_data", "");

      const api2004 = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      api2004.lmsInitialize();
      const result2004 = api2004.lmsSetValue("cmi.suspend_data", "");

      expect(result12).toBe("true");
      expect(result2004).toBe("true");
    });
  });
});
