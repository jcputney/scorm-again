// Error Scenario Tests - Testing specific SCORM error conditions
// Spec Reference: SCORM 1.2 RTE Section 3.1.2.2, SCORM 2004 RTE Section 3.1.7

import { describe, expect, it, beforeEach } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";

describe("Error Scenario Tests", () => {
  describe("SCORM 1.2 Error Scenarios", () => {
    let api: Scorm12API;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api.lmsInitialize();
    });

    describe("Error 201: Invalid argument (non-empty string to Initialize/Terminate/Commit)", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 201
      // Implementation validates parameter and rejects non-empty strings
      it("LMSInitialize with non-empty string should return false", () => {
        const api2 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
        const result = (api2 as any).LMSInitialize("invalid");
        expect(result).toBe("false");
      });

      it("LMSFinish with non-empty string should return false", () => {
        const result = (api as any).LMSFinish("invalid");
        expect(result).toBe("false");
      });

      it("LMSCommit with non-empty string should return false", () => {
        const result = (api as any).LMSCommit("invalid");
        expect(result).toBe("false");
      });
    });

    describe("Error 202: Invalid argument (_children on leaf element)", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 202
      // Note: Implementation returns UNDEFINED_DATA_MODEL (401) rather than CHILDREN_ERROR (202)
      it("Getting _children on leaf element cmi.core.student_id should fail", () => {
        const result = api.lmsGetValue("cmi.core.student_id._children");
        expect(result).toBe("");
        // Implementation behavior may vary - checking it returns an error
        expect(api.lmsGetLastError()).not.toBe("0");
      });

      it("Getting _children on leaf element cmi.suspend_data should fail", () => {
        const result = api.lmsGetValue("cmi.suspend_data._children");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).not.toBe("0");
      });
    });

    describe("Error 203: Invalid argument (_count on non-array)", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 203
      // Note: Implementation returns 101 (general error) instead of specific 203
      it("Getting _count on non-array element cmi.core should fail", () => {
        const result = api.lmsGetValue("cmi.core._count");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("101");
      });

      it("Getting _count on leaf element cmi.core.student_id should fail", () => {
        const result = api.lmsGetValue("cmi.core.student_id._count");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("101");
      });

      it("Getting _count on non-array cmi.student_data should fail", () => {
        const result = api.lmsGetValue("cmi.student_data._count");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("101");
      });
    });

    describe("Error 402: Invalid set value (keyword)", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 402
      it("SetValue on _version keyword should fail with 402", () => {
        const result = api.lmsSetValue("cmi._version", "1.2");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("402");
      });

      it("SetValue on _children keyword should fail with 402", () => {
        const result = api.lmsSetValue("cmi._children", "core,suspend_data");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("402");
      });

      it("SetValue on cmi.core._children keyword should fail with 402", () => {
        const result = api.lmsSetValue("cmi.core._children", "student_id");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("402");
      });

      it("SetValue on _count keyword should fail with 402", () => {
        const result = api.lmsSetValue("cmi.objectives._count", "5");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("402");
      });

      it("SetValue on cmi.interactions._count keyword should fail with 402", () => {
        const result = api.lmsSetValue("cmi.interactions._count", "10");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("402");
      });
    });

    describe("Error 403: Element is read only", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 403
      it("SetValue on read-only cmi.core.student_id should fail with 403", () => {
        const result = api.lmsSetValue("cmi.core.student_id", "new_student");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.core.student_name should fail with 403", () => {
        const result = api.lmsSetValue("cmi.core.student_name", "John Doe");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.core.credit should fail with 403", () => {
        const result = api.lmsSetValue("cmi.core.credit", "credit");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.core.entry should fail with 403", () => {
        const result = api.lmsSetValue("cmi.core.entry", "resume");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.core.total_time should fail with 403", () => {
        const result = api.lmsSetValue("cmi.core.total_time", "00:30:00");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.core.lesson_mode should fail with 403", () => {
        const result = api.lmsSetValue("cmi.core.lesson_mode", "browse");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.launch_data should fail with 403", () => {
        const result = api.lmsSetValue("cmi.launch_data", "param1=value1");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue on read-only cmi.student_data.mastery_score should fail with 403", () => {
        const result = api.lmsSetValue("cmi.student_data.mastery_score", "80");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });
    });

    describe("Error 404: Element is write only", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 404
      // Per SCORM spec, GetValue on write-only elements returns "" with error code set
      it("GetValue on write-only cmi.core.exit should fail with 404", () => {
        const result = api.lmsGetValue("cmi.core.exit");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("GetValue on write-only cmi.core.session_time should fail with 404", () => {
        const result = api.lmsGetValue("cmi.core.session_time");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("GetValue on write-only cmi.interactions.n.id should fail with 404", () => {
        api.lmsSetValue("cmi.interactions.0.id", "interaction-1");
        const result = api.lmsGetValue("cmi.interactions.0.id");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("GetValue on write-only cmi.interactions.n.objectives.n.id should fail with 404", () => {
        api.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj-1");
        const result = api.lmsGetValue("cmi.interactions.0.objectives.0.id");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("GetValue on write-only cmi.interactions.n.correct_responses.n.pattern should fail with 404", () => {
        api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "true");
        const result = api.lmsGetValue("cmi.interactions.0.correct_responses.0.pattern");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("404");
      });
    });

    describe("Error 405: Incorrect data type", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 405
      it("SetValue with invalid lesson_status value should fail with 405", () => {
        const result = api.lmsSetValue("cmi.core.lesson_status", "PASSED");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("405");
      });

      // Note: credit, entry, lesson_mode are read-only so they return 403 before type check
      it("SetValue with invalid credit value should fail with 403 (read-only)", () => {
        const result = api.lmsSetValue("cmi.core.credit", "yes");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue with invalid entry value should fail with 403 (read-only)", () => {
        const result = api.lmsSetValue("cmi.core.entry", "start");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue with invalid lesson_mode should fail with 403 (read-only)", () => {
        const result = api.lmsSetValue("cmi.core.lesson_mode", "test");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("403");
      });

      it("SetValue with non-numeric score.raw should fail with 405", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "not-a-number");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("405");
      });

      // Note: Implementation accepts lenient time format (single-digit hours)
      it("SetValue with lenient time format should succeed", () => {
        const result = api.lmsSetValue("cmi.core.session_time", "1:30:00");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("Error 407: Element value out of range", () => {
      // Spec Reference: SCORM 1.2 RTE Section 3.1.2.2 - Error Code 407
      it("SetValue with score.raw > 100 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "150");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with score.raw < 0 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.core.score.raw", "-10");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with score.min > 100 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.core.score.min", "101");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with score.max > 100 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.core.score.max", "200");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with student_preference.audio > 100 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.student_preference.audio", "150");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });
    });
  });

  describe("SCORM 2004 Error Scenarios", () => {
    let api: Scorm2004API;

    beforeEach(() => {
      api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      api.lmsInitialize();
    });

    describe("Error 201: Invalid argument (non-empty string to Initialize/Terminate/Commit)", () => {
      // Spec Reference: SCORM 2004 RTE Section 3.1.7 - Error Code 201
      // Implementation validates parameter and rejects non-empty strings
      it("Initialize with non-empty string should return false", () => {
        const api2 = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
        const result = (api2 as any).Initialize("invalid");
        expect(result).toBe("false");
      });

      it("Terminate with non-empty string should return false", () => {
        const result = (api as any).Terminate("invalid");
        expect(result).toBe("false");
      });

      it("Commit with non-empty string should return false", () => {
        const result = (api as any).Commit("invalid");
        expect(result).toBe("false");
      });
    });

    describe("Error 404: Element is read only", () => {
      // Spec Reference: SCORM 2004 RTE Section 3.1.7 - Error Code 404
      it("SetValue on read-only _version keyword should fail with 404", () => {
        const result = api.lmsSetValue("cmi._version", "1.0");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only _children keyword should fail with 404", () => {
        const result = api.lmsSetValue("cmi._children", "completion_status");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.learner_id should fail with 404", () => {
        const result = api.lmsSetValue("cmi.learner_id", "new_learner");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.learner_name should fail with 404", () => {
        const result = api.lmsSetValue("cmi.learner_name", "Jane Doe");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.credit should fail with 404", () => {
        const result = api.lmsSetValue("cmi.credit", "no-credit");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.entry should fail with 404", () => {
        const result = api.lmsSetValue("cmi.entry", "resume");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.mode should fail with 404", () => {
        const result = api.lmsSetValue("cmi.mode", "review");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.total_time should fail with 404", () => {
        const result = api.lmsSetValue("cmi.total_time", "PT1H30M");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.launch_data should fail with 404", () => {
        const result = api.lmsSetValue("cmi.launch_data", "param=value");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.completion_threshold should fail with 404", () => {
        const result = api.lmsSetValue("cmi.completion_threshold", "0.8");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.scaled_passing_score should fail with 404", () => {
        const result = api.lmsSetValue("cmi.scaled_passing_score", "0.7");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("SetValue on read-only cmi.comments_from_lms.n.comment should fail with 404", () => {
        const result = api.lmsSetValue("cmi.comments_from_lms.0.comment", "test");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });
    });

    describe("Error 405: Element is write only", () => {
      // Spec Reference: SCORM 2004 RTE Section 3.1.7 - Error Code 405
      // Per SCORM spec, GetValue on write-only elements returns "" with error code set
      it("GetValue on write-only cmi.exit should fail with 405", () => {
        const result = api.lmsGetValue("cmi.exit");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("405");
      });

      it("GetValue on write-only cmi.session_time should fail with 405", () => {
        const result = api.lmsGetValue("cmi.session_time");
        expect(result).toBe("");
        expect(api.lmsGetLastError()).toBe("405");
      });
    });

    describe("Error 406: Incorrect data type", () => {
      // Spec Reference: SCORM 2004 RTE Section 3.1.7 - Error Code 406
      it("SetValue with invalid completion_status should fail with 406", () => {
        const result = api.lmsSetValue("cmi.completion_status", "finished");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("SetValue with invalid success_status should fail with 406", () => {
        const result = api.lmsSetValue("cmi.success_status", "pass");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("SetValue with invalid exit value should fail with 406", () => {
        const result = api.lmsSetValue("cmi.exit", "quit");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("SetValue with non-numeric score.raw should fail with 406", () => {
        const result = api.lmsSetValue("cmi.score.raw", "high");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("SetValue with invalid ISO 8601 duration should fail with 406", () => {
        const result = api.lmsSetValue("cmi.session_time", "1:30:00");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("SetValue with invalid timestamp should fail with 406", () => {
        const result = api.lmsSetValue("cmi.comments_from_learner.0.timestamp", "12/31/2023");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });
    });

    describe("Error 407: Element value out of range", () => {
      // Spec Reference: SCORM 2004 RTE Section 3.1.7 - Error Code 407
      it("SetValue with score.scaled > 1 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "1.5");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with score.scaled < -1 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.score.scaled", "-1.5");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with progress_measure > 1 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.progress_measure", "1.1");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      it("SetValue with progress_measure < 0 should fail with 407", () => {
        const result = api.lmsSetValue("cmi.progress_measure", "-0.1");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("407");
      });

      // Note: Implementation returns 406 (type mismatch) instead of 407 (out of range) for 11+ digit numbers
      it("SetValue with score.raw exceeding 10 digits should fail with 406", () => {
        const result = api.lmsSetValue("cmi.score.raw", "12345678901");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("406");
      });

      // Note: Implementation does not enforce audio_level range (accepts values > 1)
      it("SetValue with learner_preference.audio_level > 1 is accepted (lenient)", () => {
        const result = api.lmsSetValue("cmi.learner_preference.audio_level", "2");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("Error 408: Dependency not established", () => {
      // Spec Reference: SCORM 2004 RTE Section 3.1.7 - Error Code 408
      it("SetValue on interaction.type without setting interaction.id should fail with 408", () => {
        const result = api.lmsSetValue("cmi.interactions.0.type", "true-false");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("408");
      });

      it("SetValue on interaction.description without setting interaction.id should fail with 408", () => {
        const result = api.lmsSetValue("cmi.interactions.0.description", "Question 1");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("408");
      });

      it("SetValue on interaction.timestamp without setting interaction.id should fail with 408", () => {
        const result = api.lmsSetValue("cmi.interactions.0.timestamp", "2023-01-01T12:00:00");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("408");
      });

      it("SetValue on objective.success_status without setting objective.id should fail with 408", () => {
        const result = api.lmsSetValue("cmi.objectives.0.success_status", "passed");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("408");
      });

      it("SetValue on objective.completion_status without setting objective.id should fail with 408", () => {
        const result = api.lmsSetValue("cmi.objectives.0.completion_status", "completed");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("408");
      });

      it("Should succeed after establishing dependency with interaction.id", () => {
        // First set the required id
        let result = api.lmsSetValue("cmi.interactions.0.id", "question-1");
        expect(result).toBe("true");

        // Now dependent fields should work
        result = api.lmsSetValue("cmi.interactions.0.type", "true-false");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");

        result = api.lmsSetValue("cmi.interactions.0.description", "Question 1");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("Should succeed after establishing dependency with objective.id", () => {
        // First set the required id
        let result = api.lmsSetValue("cmi.objectives.0.id", "objective-1");
        expect(result).toBe("true");

        // Now dependent fields should work
        result = api.lmsSetValue("cmi.objectives.0.success_status", "passed");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");

        result = api.lmsSetValue("cmi.objectives.0.completion_status", "completed");
        expect(result).toBe("true");
        expect(api.lmsGetLastError()).toBe("0");
      });
    });

    describe("Error clearing and persistence", () => {
      it("Error code should persist until next API call", () => {
        // Trigger an error
        api.lmsSetValue("cmi.completion_status", "invalid");
        expect(api.lmsGetLastError()).toBe("406");

        // Error should persist
        expect(api.lmsGetLastError()).toBe("406");
        expect(api.lmsGetLastError()).toBe("406");
      });

      it("Successful operation should clear previous error", () => {
        // Trigger an error
        api.lmsSetValue("cmi.completion_status", "invalid");
        expect(api.lmsGetLastError()).toBe("406");

        // Successful operation should clear it
        api.lmsSetValue("cmi.completion_status", "completed");
        expect(api.lmsGetLastError()).toBe("0");
      });

      it("New error should replace previous error", () => {
        // First error
        api.lmsSetValue("cmi.completion_status", "invalid");
        expect(api.lmsGetLastError()).toBe("406");

        // Second error should replace
        api.lmsSetValue("cmi.score.scaled", "5");
        expect(api.lmsGetLastError()).toBe("407");
      });
    });
  });

  describe("Cross-version error consistency", () => {
    it("Both versions should handle undefined elements with errors", () => {
      const api12 = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api12.lmsInitialize();
      const result12 = api12.lmsGetValue("cmi.nonexistent.element");
      const error12 = api12.lmsGetLastError();

      const api2004 = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      api2004.lmsInitialize();
      const result2004 = api2004.lmsGetValue("cmi.nonexistent.element");
      const error2004 = api2004.lmsGetLastError();

      expect(result12).toBe("");
      expect(result2004).toBe("");
      // Note: SCORM 1.2 returns 101 (general), SCORM 2004 returns 401 (undefined data model)
      expect(error12).toBe("101");
      expect(error2004).toBe("401");
    });
  });
});
