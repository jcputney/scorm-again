import { expect } from "expect";
import { describe, it } from "mocha";
import { scorm12_constants } from "../../src/constants/api_constants";
import { scorm12_errors } from "../../src/constants/error_codes";
import { CMI } from "../../src/cmi/scorm12/cmi";
import * as h from "../cmi_helpers";
import { scorm12Values } from "../field_values";
import { CMIObjectivesObject } from "../../src/cmi/scorm12/objectives";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "../../src/cmi/scorm12/interactions";

const scorm12 = scorm12_constants;
const scorm12_error_codes = scorm12;

const invalid_set = scorm12_errors.INVALID_SET_VALUE;
const type_mismatch = scorm12_errors.TYPE_MISMATCH;
const write_only = scorm12_errors.WRITE_ONLY_ELEMENT;
const read_only = scorm12_errors.READ_ONLY_ELEMENT;

const cmi = () => {
  return new CMI();
};
const cmiInitialized = () => {
  const obj = new CMI();
  obj.initialize();
  return obj;
};
const interaction = () => {
  return new CMIInteractionsObject();
};
const interactionInitialized = () => {
  const cmi = new CMIInteractionsObject();
  cmi.initialize();
  return cmi;
};
const interactionObjective = () => {
  return new CMIInteractionsObjectivesObject();
};
const correctResponse = () => {
  return new CMIInteractionsCorrectResponsesObject();
};
const objective = () => {
  return new CMIObjectivesObject();
};

describe("SCORM 1.2 CMI Tests", () => {
  describe("getCurrentTotalTime()", () => {
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "00:00:00",
      sessionTime: "00:15:45",
      expectedTotal: "00:15:45",
      totalFieldName: "cmi.core.total_time",
      sessionFieldName: "cmi.core.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "00:01:00",
      sessionTime: "00:15:45",
      expectedTotal: "00:16:45",
      totalFieldName: "cmi.core.total_time",
      sessionFieldName: "cmi.core.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "00:01:00",
      sessionTime: "00:00:00",
      expectedTotal: "00:01:00",
      totalFieldName: "cmi.core.total_time",
      sessionFieldName: "cmi.core.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "25:01:00",
      sessionTime: "13:00:00",
      expectedTotal: "38:01:00",
      totalFieldName: "cmi.core.total_time",
      sessionFieldName: "cmi.core.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "48:01:45",
      sessionTime: "13:00:16",
      expectedTotal: "61:02:01",
      totalFieldName: "cmi.core.total_time",
      sessionFieldName: "cmi.core.session_time",
    });
  });

  describe("CMI Spec Tests", () => {
    describe("Pre-Initialize Tests", () => {
      /**
       * Base CMI Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi._version",
        expectedValue: "3.4",
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi._children",
        expectedValue: scorm12.cmi_children,
        expectedError: invalid_set,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.suspend_data",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.launch_data",
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.comments",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.comments_from_lms",
      });

      /**
       * cmi.core Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core._children",
        expectedValue: scorm12.core_children,
        expectedError: invalid_set,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.student_id",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.student_name",
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_location",
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.credit",
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_status",
        expectedValue: "not attempted",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_status",
        validValues: scorm12Values.validLessonStatus,
        invalidValues: scorm12Values.invalidLessonStatus,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.entry",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.total_time",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_mode",
        expectedValue: "normal",
      });
      h.checkWrite({
        cmi: cmi(),
        fieldName: "cmi.core.exit",
        valueToTest: "suspend",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.exit",
        validValues: scorm12Values.validExit,
        invalidValues: scorm12Values.invalidExit,
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: "cmi.core.session_time",
        valueToTest: "00:00:00",
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.session_time",
        validValues: scorm12Values.validTimespan,
        invalidValues: scorm12Values.invalidTimespan,
      });

      /**
       * cmi.core.score Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.score._children",
        expectedValue: scorm12.score_children,
        expectedError: invalid_set,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.score.raw",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.raw",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.score.min",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.min",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.score.max",
        expectedValue: "100",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.max",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.objectives._children",
        expectedValue: scorm12.objectives_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });

      /**
       * cmi.student_data Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_data._children",
        expectedValue: scorm12.student_data_children,
        expectedError: invalid_set,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.student_data.mastery_score",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.student_data.max_time_allowed",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.student_data.time_limit_action",
      });

      /**
       * cmi.student_preference Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_preference._children",
        expectedValue: scorm12.student_preference_children,
        expectedError: invalid_set,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.student_preference.audio",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_preference.audio",
        validValues: scorm12Values.valid0To100Range.concat(["-1"]),
        invalidValues: scorm12Values.invalid0To100Range,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.student_preference.language",
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.student_preference.speed",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_preference.speed",
        validValues: scorm12Values.validSpeedRange,
        invalidValues: scorm12Values.invalidSpeedRange,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.student_preference.text",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_preference.text",
        validValues: scorm12Values.validIntegerScaledRange,
        invalidValues: scorm12Values.invalidIntegerScaledRange,
      });

      /**
       * cmi.interactions Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.interactions._children",
        expectedValue: scorm12.interactions_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.interactions._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });
    });

    describe("Post-Initialize Tests", () => {
      /**
       * Base CMI Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi._version",
        expectedValue: "3.4",
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi._children",
        expectedValue: scorm12.cmi_children,
        expectedError: invalid_set,
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.suspend_data",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkWrite({
        cmi: cmiInitialized(),
        fieldName: "cmi.suspend_data",
        valueToTest: "",
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.suspend_data",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkWrite({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.suspend_data",
        valueToTest: "",
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.launch_data",
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.comments",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.comments_from_lms",
        expectedError: read_only,
      });

      /**
       * cmi.core Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core._children",
        expectedValue: scorm12.core_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.student_id",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.student_name",
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.lesson_location",
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.credit",
        expectedError: read_only,
      });
      h.checkRead({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.lesson_status",
        expectedValue: "not attempted",
      });
      h.checkWrite({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_status",
        valueToTest: "not attempted",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_status",
        validValues: scorm12Values.validLessonStatus.concat(["not attempted"]),
        invalidValues: scorm12Values.invalidLessonStatus,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.lesson_status",
        validValues: scorm12Values.validLessonStatus,
        invalidValues: scorm12Values.invalidLessonStatus.concat([
          "not attempted",
        ]),
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.entry",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.total_time",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.lesson_mode",
        expectedValue: "normal",
        expectedError: read_only,
      });
      h.checkWrite({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.exit",
        valueToTest: "suspend",
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.exit",
        validValues: scorm12Values.validExit,
        invalidValues: scorm12Values.invalidExit,
      });
      h.checkWriteOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.session_time",
        valueToTest: "00:00:00",
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.session_time",
        validValues: scorm12Values.validTimespan,
        invalidValues: scorm12Values.invalidTimespan,
      });

      /**
       * cmi.core.score Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.score._children",
        expectedValue: scorm12.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.score.raw",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.score.min",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.core.score.max",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.objectives._children",
        expectedValue: scorm12.objectives_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });

      /**
       * cmi.student_data Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_data._children",
        expectedValue: scorm12.student_data_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_data.mastery_score",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_data.max_time_allowed",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_data.time_limit_action",
        expectedError: read_only,
      });

      /**
       * cmi.student_preference Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_preference._children",
        expectedValue: scorm12.student_preference_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_preference.audio",
        validValues: scorm12Values.valid0To100Range.concat(["-1"]),
        invalidValues: scorm12Values.invalid0To100Range,
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_preference.language",
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_preference.speed",
        validValues: scorm12Values.validSpeedRange,
        invalidValues: scorm12Values.invalidSpeedRange,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.student_preference.text",
        validValues: scorm12Values.validIntegerScaledRange,
        invalidValues: scorm12Values.invalidIntegerScaledRange,
      });

      /**
       * cmi.interactions Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.interactions._children",
        expectedValue: scorm12.interactions_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.interactions._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });

      it("should export JSON", () => {
        const cmiObj = cmiInitialized();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        expect(JSON.stringify(cmiObj)).toEqual(
          '{"suspend_data":"","launch_data":"","comments":"","comments_from_lms":"","core":{"student_id":"","student_name":"","lesson_location":"","credit":"","lesson_status":"not attempted","entry":"","lesson_mode":"normal","exit":"","session_time":"00:00:00","score":{"raw":"","min":"","max":"100"}},"objectives":{"0":{"id":"","status":"","score":{"raw":"","min":"","max":"100"}}},"student_data":{"mastery_score":"","max_time_allowed":"","time_limit_action":""},"student_preference":{"audio":"","language":"","speed":"","text":""},"interactions":{"0":{"id":"","time":"","type":"","weighting":"","student_response":"","result":"","latency":"","objectives":{},"correct_responses":{}}}}',
        );
      });
    });

    describe("CMIInteractionsObject Tests", () => {
      /**
       * cmi.interactions.n object
       */
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.id",
        expectedError: write_only,
      });
      h.checkWriteOnly({
        cmi: interactionInitialized(),
        fieldName: "cmi.id",
        expectedError: write_only,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.time",
        expectedError: write_only,
        valueToTest: "23:59:59",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.time",
        validValues: scorm12Values.validTime,
        invalidValues: scorm12Values.invalidTime,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.type",
        expectedError: write_only,
        valueToTest: "true-false",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.type",
        validValues: scorm12Values.validType,
        invalidValues: scorm12Values.invalidType,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: "cmi.correct_responses._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.weighting",
        expectedError: write_only,
        valueToTest: "0",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.weighting",
        validValues: scorm12Values.validSpeedRange,
        invalidValues: scorm12Values.invalidSpeedRange,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.student_response",
        expectedError: write_only,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.result",
        expectedError: write_only,
        valueToTest: "correct",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.result",
        validValues: scorm12Values.validResult.concat([
          "1",
          "999",
          "999.99999",
        ]),
        invalidValues: scorm12Values.invalidResult,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: "cmi.latency",
        valueToTest: "00:00:00",
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.latency",
        validValues: scorm12Values.validTimespan,
        invalidValues: scorm12Values.invalidTimespan,
      });

      it("should export JSON", () => {
        const cmi = interaction();
        cmi.objectives.childArray.push(new CMIInteractionsObjectivesObject());
        cmi.correct_responses.childArray.push(
          new CMIInteractionsCorrectResponsesObject(),
        );
        expect(JSON.stringify(cmi)).toEqual(
          '{"id":"","time":"","type":"","weighting":"","student_response":"","result":"","latency":"","objectives":{"0":{"id":""}},"correct_responses":{"0":{"pattern":""}}}',
        );
      });
    });

    describe("CMIInteractionsObjectivesObject Tests", () => {
      /**
       * cmi.interactions.n.objectives.n object
       */
      h.checkReadAndWrite({
        cmi: interactionObjective(),
        fieldName: "cmi.id",
      });

      it("should export JSON", () => {
        const cmi = interactionObjective();
        expect(JSON.stringify(cmi)).toEqual('{"id":""}');
      });
    });

    describe("CMIInteractionsCorrectResponsesObject Tests", () => {
      /**
       * cmi.interactions.n.correct_responses.n object
       */
      h.checkWriteOnly({
        cmi: correctResponse(),
        fieldName: "cmi.pattern",
        expectedError: write_only,
      });

      it("should export JSON", () => {
        const cmi = correctResponse();
        expect(JSON.stringify(cmi)).toEqual('{"pattern":""}');
      });
    });

    describe("CMIObjectivesObject Tests", () => {
      /**
       * cmi.objectives.n object
       */
      h.checkReadAndWrite({
        cmi: objective(),
        fieldName: "cmi.id",
      });
      h.checkRead({
        cmi: objective(),
        fieldName: "cmi.status",
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.status",
        validValues: scorm12Values.validLessonStatus.concat(["not attempted"]),
        invalidValues: scorm12Values.invalidLessonStatus,
      });

      /**
       * cmi.objectives.n.score Properties
       */
      h.checkReadOnly({
        cmi: objective(),
        fieldName: "cmi.score._children",
        expectedValue: scorm12.score_children,
        expectedError: invalid_set,
      });
      h.checkRead({
        cmi: objective(),
        fieldName: "cmi.score.raw",
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.raw",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkRead({
        cmi: objective(),
        fieldName: "cmi.score.min",
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.min",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkRead({
        cmi: objective(),
        fieldName: "cmi.score.max",
        expectedValue: "100",
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.max",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });

      it("should export JSON", () => {
        const cmi = objective();
        expect(JSON.stringify(cmi)).toEqual(
          '{"id":"","status":"","score":{"raw":"","min":"","max":"100"}}',
        );
      });
    });
  });
});
