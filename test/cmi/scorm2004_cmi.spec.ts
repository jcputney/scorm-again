import { describe, it } from "mocha";
import { scorm2004_errors } from "../../src/constants/error_codes";
import { scorm2004_constants } from "../../src/constants/api_constants";
import { CMI } from "../../src/cmi/scorm2004/cmi";
import * as h from "../cmi_helpers";
import { expect } from "expect";
import { scorm2004Values } from "../field_values";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "../../src/cmi/scorm2004/interactions";
import { CMICommentsObject } from "../../src/cmi/scorm2004/comments";
import { CMIObjectivesObject } from "../../src/cmi/scorm2004/objectives";
import { ADL } from "../../src/cmi/scorm2004/adl";

const read_only = scorm2004_errors.READ_ONLY_ELEMENT;
const write_only = scorm2004_errors.WRITE_ONLY_ELEMENT;
const type_mismatch = scorm2004_errors.TYPE_MISMATCH;

const cmi = () => {
  return new CMI();
};
const cmiInitialized = () => {
  const cmiObj = new CMI();
  cmiObj.initialize();
  return cmiObj;
};
const comments = () => {
  return new CMICommentsObject();
};
const lmsComments = () => {
  return new CMICommentsObject(true);
};
const lmsCommentsInitialized = () => {
  const cmi = lmsComments();
  cmi.initialize();
  return cmi;
};
const interaction = () => {
  return new CMIInteractionsObject();
};
const interactionInitialized = () => {
  const cmi = new CMIInteractionsObject();
  cmi.initialize();
  return cmi;
};
const objective = () => {
  return new CMIObjectivesObject();
};
const objectiveInitialized = () => {
  const cmi = new CMIObjectivesObject();
  cmi.initialize();
  return cmi;
};
const interactionObjective = () => {
  return new CMIInteractionsObjectivesObject();
};
const correctResponse = () => {
  return new CMIInteractionsCorrectResponsesObject();
};
const adl = () => {
  return new ADL();
};

describe("SCORM 2004 CMI Tests", () => {
  describe("getCurrentTotalTime()", () => {
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "PT0S",
      sessionTime: "PT15M45S",
      expectedTotal: "PT15M45S",
      totalFieldName: "cmi.total_time",
      sessionFieldName: "cmi.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "PT60S",
      sessionTime: "PT15M45S",
      expectedTotal: "PT16M45S",
      totalFieldName: "cmi.total_time",
      sessionFieldName: "cmi.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "PT60S",
      sessionTime: "PT0S",
      expectedTotal: "PT1M",
      totalFieldName: "cmi.total_time",
      sessionFieldName: "cmi.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "PT25H1M0S",
      sessionTime: "PT13H",
      expectedTotal: "P1DT14H1M",
      totalFieldName: "cmi.total_time",
      sessionFieldName: "cmi.session_time",
    });
    h.checkGetCurrentTotalTime({
      cmi: cmi(),
      startingTotal: "PT48H1M45S",
      sessionTime: "PT13H16S",
      expectedTotal: "P2DT13H2M1S",
      totalFieldName: "cmi.total_time",
      sessionFieldName: "cmi.session_time",
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
        expectedValue: "1.0",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi._children",
        expectedValue: scorm2004_constants.cmi_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.completion_status",
        validValues: scorm2004Values.validCStatus,
        invalidValues: scorm2004Values.invalidCStatus,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.completion_threshold",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.credit",
        expectedValue: "credit",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.entry",
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: "cmi.exit",
        expectedError: write_only,
        valueToTest: "time-out",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.exit",
        validValues: scorm2004Values.validExit,
        invalidValues: scorm2004Values.invalidExit,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.launch_data",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.learner_id",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.learner_name",
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.location",
        limit: 1000,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.max_time_allowed",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.mode",
        expectedValue: "normal",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.max_time_allowed",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.progress_measure",
        validValues: scorm2004Values.valid0To1Range,
        invalidValues: scorm2004Values.invalid0To1Range,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.scaled_passing_score",
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: "cmi.session_time",
        valueToTest: "P0S",
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.session_time",
        validValues: scorm2004Values.validISO8601Durations,
        invalidValues: scorm2004Values.invalidISO8601Durations,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.success_status",
        expectedValue: "unknown",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.success_status",
        validValues: scorm2004Values.validSStatus,
        invalidValues: scorm2004Values.invalidSStatus,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.suspend_data",
        limit: 64000,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.time_limit_action",
        expectedValue: "continue,no message",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.total_time",
        expectedValue: "",
      });

      /**
       * cmi.learner_preference Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.learner_preference._children",
        expectedValue: scorm2004_constants.student_preference_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.learner_preference.audio_level",
        validValues: scorm2004Values.valid0To100Range,
        invalidValues: scorm2004Values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.learner_preference.language",
        validValues: ["en", "fr", "ru", "es"],
        invalidValues: ["invalid", "a100"],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.learner_preference.delivery_speed",
        validValues: scorm2004Values.valid0To100Range,
        invalidValues: scorm2004Values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.learner_preference.audio_captioning",
        validValues: scorm2004Values.validIntegerScaledRange,
        invalidValues: scorm2004Values.invalidIntegerScaledRange,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.objectives._children",
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.score Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.score._children",
        expectedValue: scorm2004_constants.score_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.score.scaled",
        validValues: scorm2004Values.validScaledRange,
        invalidValues: scorm2004Values.invalidScaledRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.score.raw",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.score.min",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.score.max",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });

      /**
       * cmi.comments_from_learner Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.comments_from_learner._children",
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.comments_from_learner._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.comments_from_lms Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.comments_from_lms._children",
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.comments_from_lms._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.interactions Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.interactions._children",
        expectedValue: scorm2004_constants.interactions_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.interactions._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.objectives._children",
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      it("should export JSON", () => {
        const cmiObj = cmi();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        expect(JSON.stringify(cmiObj)).toEqual(
          '{"comments_from_learner":{},"comments_from_lms":{},"completion_status":"unknown","completion_threshold":"","credit":"credit","entry":"","exit":"","interactions":{"0":{"id":"","type":"","objectives":{},"timestamp":"","weighting":"","learner_response":"","result":"","latency":"","description":"","correct_responses":{}}},"launch_data":"","learner_id":"","learner_name":"","learner_preference":{"audio_level":"1","language":"","delivery_speed":"1","audio_captioning":"0"},"location":"","max_time_allowed":"","mode":"normal","objectives":{"0":{"id":"","success_status":"unknown","completion_status":"unknown","progress_measure":"","description":"","score":{"scaled":"","raw":"","min":"","max":""}}},"progress_measure":"","scaled_passing_score":"","score":{"scaled":"","raw":"","min":"","max":""},"session_time":"PT0H0M0S","success_status":"unknown","suspend_data":"","time_limit_action":"continue,no message"}',
        );
      });
    });

    describe("Post-Initialize Tests", () => {
      /**
       * Base CMI Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi._version",
        expectedValue: "1.0",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi._children",
        expectedValue: scorm2004_constants.cmi_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.completion_status",
        validValues: scorm2004Values.validCStatus,
        invalidValues: scorm2004Values.invalidCStatus,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.completion_threshold",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.credit",
        expectedValue: "credit",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.entry",
        expectedError: read_only,
      });
      h.checkWriteOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.exit",
        expectedError: write_only,
        valueToTest: "time-out",
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.exit",
        validValues: scorm2004Values.validExit,
        invalidValues: scorm2004Values.invalidExit,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.launch_data",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_id",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_name",
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.location",
        limit: 1000,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.max_time_allowed",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.mode",
        expectedValue: "normal",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.max_time_allowed",
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.progress_measure",
        validValues: scorm2004Values.valid0To1Range,
        invalidValues: scorm2004Values.invalid0To1Range,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.scaled_passing_score",
        expectedError: read_only,
      });
      h.checkWriteOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.session_time",
        valueToTest: "P0S",
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.session_time",
        validValues: scorm2004Values.validISO8601Durations,
        invalidValues: scorm2004Values.invalidISO8601Durations,
      });
      h.checkRead({
        cmi: cmiInitialized(),
        fieldName: "cmi.success_status",
        expectedValue: "unknown",
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.success_status",
        validValues: scorm2004Values.validSStatus,
        invalidValues: scorm2004Values.invalidSStatus,
      });
      h.checkFieldConstraintSize({
        cmi: cmiInitialized(),
        fieldName: "cmi.suspend_data",
        limit: 64000,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.time_limit_action",
        expectedValue: "continue,no message",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.total_time",
        expectedValue: "",
        expectedError: read_only,
      });

      /**
       * cmi.learner_preference Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_preference._children",
        expectedValue: scorm2004_constants.student_preference_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_preference.audio_level",
        validValues: scorm2004Values.valid0To100Range,
        invalidValues: scorm2004Values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_preference.language",
        validValues: ["en", "fr", "ru", "es"],
        invalidValues: ["invalid", "a100"],
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_preference.delivery_speed",
        validValues: scorm2004Values.valid0To100Range,
        invalidValues: scorm2004Values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.learner_preference.audio_captioning",
        validValues: scorm2004Values.validIntegerScaledRange,
        invalidValues: scorm2004Values.invalidIntegerScaledRange,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.objectives._children",
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.score Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.score._children",
        expectedValue: scorm2004_constants.score_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.score.scaled",
        validValues: scorm2004Values.validScaledRange,
        invalidValues: scorm2004Values.invalidScaledRange,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.score.raw",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.score.min",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmiInitialized(),
        fieldName: "cmi.score.max",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });

      /**
       * cmi.comments_from_learner Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.comments_from_learner._children",
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.comments_from_learner._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.comments_from_lms Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.comments_from_lms._children",
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.comments_from_lms._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.interactions Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.interactions._children",
        expectedValue: scorm2004_constants.interactions_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.interactions._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.objectives._children",
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInitialized(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: read_only,
      });

      it("should export JSON", () => {
        const cmiObj = cmiInitialized();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        expect(JSON.stringify(cmiObj)).toEqual(
          '{"comments_from_learner":{},"comments_from_lms":{},"completion_status":"unknown","completion_threshold":"","credit":"credit","entry":"","exit":"","interactions":{"0":{"id":"","type":"","objectives":{},"timestamp":"","weighting":"","learner_response":"","result":"","latency":"","description":"","correct_responses":{}}},"launch_data":"","learner_id":"","learner_name":"","learner_preference":{"audio_level":"1","language":"","delivery_speed":"1","audio_captioning":"0"},"location":"","max_time_allowed":"","mode":"normal","objectives":{"0":{"id":"","success_status":"unknown","completion_status":"unknown","progress_measure":"","description":"","score":{"scaled":"","raw":"","min":"","max":""}}},"progress_measure":"","scaled_passing_score":"","score":{"scaled":"","raw":"","min":"","max":""},"session_time":"PT0H0M0S","success_status":"unknown","suspend_data":"","time_limit_action":"continue,no message"}',
        );
      });
    });

    describe("CMICommentsObject Tests", () => {
      /**
       * cmi.comments_from_learner.n object
       */
      h.checkValidValues({
        cmi: comments(),
        fieldName: "cmi.comment",
        validValues: scorm2004Values.validComment,
        invalidValues: scorm2004Values.invalidComment,
      });

      h.checkFieldConstraintSize({
        cmi: comments(),
        fieldName: "cmi.location",
        expectedError: type_mismatch,
        limit: 250,
      });

      h.checkReadAndWrite({
        cmi: comments(),
        fieldName: "cmi.timestamp",
        valueToTest: "2019-06-25T02:30:00",
      });
      h.checkValidValues({
        cmi: comments(),
        fieldName: "cmi.timestamp",
        validValues: scorm2004Values.validTimestamps,
        invalidValues: scorm2004Values.invalidTimestamps,
      });

      it("should export JSON", () => {
        const cmi = comments();
        expect(JSON.stringify(cmi)).toEqual(
          '{"comment":"","location":"","timestamp":""}',
        );
      });
    });

    describe("CMICommentsFromLMSObject Tests", () => {
      /**
       * cmi.comments_from_lms.n object
       */
      h.checkValidValues({
        cmi: lmsComments(),
        fieldName: "cmi.comment",
        validValues: scorm2004Values.validComment,
        invalidValues: scorm2004Values.invalidComment,
      });

      h.checkFieldConstraintSize({
        cmi: lmsComments(),
        fieldName: "cmi.location",
        expectedError: type_mismatch,
        limit: 250,
      });

      h.checkReadAndWrite({
        cmi: lmsComments(),
        fieldName: "cmi.timestamp",
        valueToTest: scorm2004Values.validTimestamps[0],
      });
      h.checkValidValues({
        cmi: lmsComments(),
        fieldName: "cmi.timestamp",
        validValues: scorm2004Values.validTimestamps,
        invalidValues: scorm2004Values.invalidTimestamps,
      });

      h.checkReadOnly({
        cmi: lmsCommentsInitialized(),
        fieldName: "cmi.comment",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: lmsCommentsInitialized(),
        fieldName: "cmi.location",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: lmsCommentsInitialized(),
        fieldName: "cmi.timestamp",
        expectedError: read_only,
      });

      it("should export JSON", () => {
        const cmi = lmsComments();
        expect(JSON.stringify(cmi)).toEqual(
          '{"comment":"","location":"","timestamp":""}',
        );
      });
    });

    describe("CMIInteractionsObject Tests", () => {
      /**
       * cmi.interactions.n object
       */
      h.checkReadAndWrite({
        cmi: interaction(),
        fieldName: "cmi.id",
      });
      h.checkReadAndWrite({
        cmi: interactionInitialized(),
        fieldName: "cmi.id",
      });

      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.timestamp",
        validValues: scorm2004Values.validTimestamps,
        invalidValues: scorm2004Values.invalidTimestamps,
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.type",
        validValues: scorm2004Values.validType,
        invalidValues: scorm2004Values.invalidType,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: "cmi.objectives._count",
        expectedValue: 0,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: "cmi.correct_responses._count",
        expectedValue: 0,
        expectedError: read_only,
      });
      h.checkWrite({
        cmi: interaction(),
        fieldName: "cmi.weighting",
        valueToTest: "0",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.weighting",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });

      /**
       * TODO: Learner Response depends on first setting Type, so need to build out lots of test cases
       */

      h.checkRead({
        cmi: interaction(),
        fieldName: "cmi.result",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.result",
        validValues: scorm2004Values.validResult.concat([
          "1",
          "999",
          "999.99999",
        ]),
        invalidValues: scorm2004Values.invalidResult,
      });
      h.checkRead({
        cmi: interaction(),
        fieldName: "cmi.latency",
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.latency",
        validValues: scorm2004Values.validISO8601Durations,
        invalidValues: scorm2004Values.invalidISO8601Durations,
      });

      h.checkValidValues({
        cmi: interaction(),
        fieldName: "cmi.description",
        validValues: scorm2004Values.validDescription,
        invalidValues: scorm2004Values.invalidDescription,
      });

      it("should export JSON", () => {
        const cmi = interaction();
        cmi.objectives.childArray.push(new CMIInteractionsObjectivesObject());
        cmi.correct_responses.childArray.push(
          new CMIInteractionsCorrectResponsesObject(),
        );
        expect(JSON.stringify(cmi)).toEqual(
          '{"id":"","type":"","objectives":{"0":{"id":""}},"timestamp":"","weighting":"","learner_response":"","result":"","latency":"","description":"","correct_responses":{"0":{"pattern":""}}}',
        );
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
      h.checkReadAndWrite({
        cmi: objectiveInitialized(),
        fieldName: "cmi.id",
      });
      h.checkRead({
        cmi: objective(),
        fieldName: "cmi.success_status",
        expectedValue: "unknown",
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.success_status",
        validValues: scorm2004Values.validSStatus,
        invalidValues: scorm2004Values.invalidSStatus,
      });
      h.checkRead({
        cmi: objective(),
        fieldName: "cmi.completion_status",
        expectedValue: "unknown",
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.completion_status",
        validValues: scorm2004Values.validCStatus,
        invalidValues: scorm2004Values.invalidCStatus,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.progress_measure",
        validValues: scorm2004Values.valid0To1Range,
        invalidValues: scorm2004Values.invalid0To1Range,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.description",
        validValues: scorm2004Values.validDescription,
        invalidValues: scorm2004Values.invalidDescription,
      });

      /**
       * cmi.objectives.n.score Properties
       */
      h.checkReadOnly({
        cmi: objective(),
        fieldName: "cmi.score._children",
        expectedValue: scorm2004_constants.score_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.scaled",
        validValues: scorm2004Values.validScaledRange,
        invalidValues: scorm2004Values.invalidScaledRange,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.raw",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.min",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: "cmi.score.max",
        validValues: scorm2004Values.validScoreRange,
        invalidValues: scorm2004Values.invalidScoreRange,
      });

      it("should export JSON", () => {
        const cmi = objective();
        expect(JSON.stringify(cmi)).toEqual(
          '{"id":"","success_status":"unknown","completion_status":"unknown","progress_measure":"","description":"","score":{"scaled":"","raw":"","min":"","max":""}}',
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
      h.checkReadAndWrite({
        cmi: correctResponse(),
        fieldName: "cmi.pattern",
      });

      it("should export JSON", () => {
        const cmi = correctResponse();
        expect(JSON.stringify(cmi)).toEqual('{"pattern":""}');
      });
    });

    describe("ADL Tests", () => {
      describe("ADLNav Tests", () => {
        /**
         * cmi.interactions.n.correct_responses.n object
         */
        h.checkRead({
          cmi: adl(),
          fieldName: "cmi.nav.request",
          expectedValue: "_none_",
        });

        h.checkValidValues({
          cmi: adl(),
          fieldName: "cmi.nav.request",
          validValues: scorm2004Values.validNavRequest,
          invalidValues: scorm2004Values.invalidNavRequest,
        });

        it("should export JSON", () => {
          const cmi = adl();
          expect(JSON.stringify(cmi)).toEqual(
            '{"nav":{"request":"_none_"},"data":{}}',
          );
        });
      });
    });
  });
});
