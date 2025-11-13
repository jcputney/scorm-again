// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import { aicc_constants, CMI, NAV, scorm12_errors } from "../../src";
import * as h from "./cmi_helpers";
import { scorm12Values } from "../field_values";
import { CMITriesObject } from "../../src/cmi/aicc/tries";
import { CMIEvaluationCommentsObject } from "../../src/cmi/aicc/evaluation";
import { CMIObjectivesObject } from "../../src/cmi/scorm12/objectives";
import { CMIInteractionsObject } from "../../src/cmi/scorm12/interactions";
import { CMIPathsObject } from "../../src/cmi/aicc/paths";
import { CMIStudentDemographics } from "../../src/cmi/aicc/student_demographics";

const invalid_set = scorm12_errors.INVALID_SET_VALUE as number;
const type_mismatch = scorm12_errors.TYPE_MISMATCH as number;
const write_only = scorm12_errors.WRITE_ONLY_ELEMENT as number;
const read_only = scorm12_errors.READ_ONLY_ELEMENT as number;

describe("AICC CMI Tests", () => {
  describe("CMI Spec Tests", () => {
    describe("Pre-Initialize Tests", () => {
      const cmi = () => {
        return new CMI();
      };

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
        expectedValue: aicc_constants.cmi_children,
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
        expectedValue: aicc_constants.core_children,
        expectedError: invalid_set,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.core.student_id",
      });
      it("should allow hyphens and periods in student_id", () => {
        const instance = cmi();
        expect(() => {
          instance.core.student_id = "student-1.id";
        }).not.toThrow();
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
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.credit",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.credit",
        validValues: scorm12Values.validCredit,
        invalidValues: scorm12Values.invalidCredit,
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
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.entry",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.entry",
        validValues: scorm12Values.validEntry,
        invalidValues: scorm12Values.invalidEntry,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.total_time",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.total_time",
        validValues: scorm12Values.validTimespan,
        invalidValues: scorm12Values.invalidTimespan,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_mode",
        expectedValue: "normal",
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_mode",
        validValues: scorm12Values.validLessonMode,
        invalidValues: scorm12Values.invalidLessonMode,
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

      it("normalizes legacy 'normal' exit value to empty string", () => {
        const cmiObj = cmi();
        cmiObj.core.exit = "normal";
        const serialized = JSON.parse(JSON.stringify(cmiObj));
        expect(serialized.core.exit).toEqual("");
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

      it("normalizes session_time values with overflow minutes or seconds", () => {
        const cmiObj = cmi();
        cmiObj.core.session_time = "00:75:30";
        const serialized = JSON.parse(JSON.stringify(cmiObj));
        expect(serialized.core.session_time).toEqual("01:15:30");
      });

      it("normalizes student_data.max_time_allowed values with overflow", () => {
        const cmiObj = cmi();
        cmiObj.student_data.max_time_allowed = "00:62:00";
        const serialized = JSON.parse(JSON.stringify(cmiObj));
        expect(serialized.student_data.max_time_allowed).toEqual("01:02:00");
      });

      it("accepts ISO 8601 duration values for max_time_allowed", () => {
        const cmiObj = cmi();
        cmiObj.student_data.max_time_allowed = "P1DT23H59M59S";
        const serialized = JSON.parse(JSON.stringify(cmiObj));
        expect(serialized.student_data.max_time_allowed).toEqual("47:59:59");
      });

      /**
       * cmi.core.score Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.score._children",
        expectedValue: aicc_constants.score_children,
        expectedError: invalid_set,
      });

      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.raw",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.min",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
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
        expectedValue: aicc_constants.objectives_children,
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
        expectedValue: aicc_constants.student_data_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_data.mastery_score",
        validValues: scorm12Values.validMasteryScore,
        invalidValues: scorm12Values.invalidMasteryScore,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_data.max_time_allowed",
        validValues: scorm12Values.validTimespan,
        invalidValues: scorm12Values.invalidTimespan,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_data.time_limit_action",
        validValues: scorm12Values.validTimeLimitAction,
        invalidValues: scorm12Values.invalidTimeLimitAction,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.student_data.tries_during_lesson",
      });

      /**
       * cmi.student_preference Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_preference._children",
        expectedValue: aicc_constants.student_preference_children,
        expectedError: invalid_set,
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
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_preference.speed",
        validValues: scorm12Values.validSpeedRange,
        invalidValues: scorm12Values.invalidSpeedRange,
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
        expectedValue: aicc_constants.interactions_children,
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
      const cmi = () => {
        const obj = new CMI();
        obj.initialize();
        return obj;
      };

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
        expectedValue: aicc_constants.cmi_children,
        expectedError: invalid_set,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.suspend_data",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.launch_data",
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.comments",
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.comments_from_lms",
        expectedError: read_only,
      });

      /**
       * cmi.core Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core._children",
        expectedValue: aicc_constants.core_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.student_id",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.student_name",
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_location",
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.credit",
        expectedError: read_only,
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
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.entry",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.total_time",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.core.lesson_mode",
        expectedValue: "normal",
        expectedError: read_only,
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
        expectedValue: aicc_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.raw",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.core.score.min",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
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
        expectedValue: aicc_constants.objectives_children,
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
        expectedValue: aicc_constants.student_data_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_data.mastery_score",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_data.max_time_allowed",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_data.time_limit_action",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_data.tries_during_lesson",
        expectedError: read_only,
      });

      /**
       * cmi.student_preference Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.student_preference._children",
        expectedValue: aicc_constants.student_preference_children,
        expectedError: invalid_set,
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
      h.checkValidValues({
        cmi: cmi(),
        fieldName: "cmi.student_preference.speed",
        validValues: scorm12Values.validSpeedRange,
        invalidValues: scorm12Values.invalidSpeedRange,
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
        expectedValue: aicc_constants.interactions_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: "cmi.interactions._count",
        expectedValue: 0,
        expectedError: invalid_set,
      });

      it("should export JSON", () => {
        const cmiObj = cmi();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        cmiObj.evaluation.comments.childArray.push(new CMIEvaluationCommentsObject());
        cmiObj.student_data.tries.childArray.push(new CMITriesObject());
        expect(JSON.stringify(cmiObj)).toEqual(
          '{"suspend_data":"","launch_data":"","comments":"","comments_from_lms":"","core":{"student_id":"","student_name":"","lesson_location":"","credit":"","lesson_status":"not attempted","entry":"","lesson_mode":"normal","exit":"","session_time":"00:00:00","score":{"raw":"","min":"","max":"100"}},"objectives":{"0":{"id":"","status":"","score":{"raw":"","min":"","max":"100"}}},"student_data":{"mastery_score":"","max_time_allowed":"","time_limit_action":"","tries":{"0":{"status":"","time":"","score":{"raw":"","min":"","max":"100"}}},"attempt_records":{}},"student_preference":{"audio":"","language":"","lesson_type":"","speed":"","text":"","text_color":"","text_location":"","text_size":"","video":"","windows":{}},"student_demographics":{"city":"","class":"","company":"","country":"","experience":"","familiar_name":"","instructor_name":"","title":"","native_language":"","state":"","street_address":"","telephone":"","years_experience":""},"interactions":{"0":{"id":"","time":"","type":"","weighting":"","student_response":"","result":"","latency":"","objectives":{},"correct_responses":{}}},"evaluation":{"comments":{"0":{"content":"","location":"","time":""}}},"paths":{}}',
        );
      });

      it("normalizes interaction latency values with overflow", () => {
        const interaction = new CMIInteractionsObject();
        interaction.latency = "00:61:30";
        const json = interaction.toJSON();
        expect(json.latency).toEqual("01:01:30");
      });

      it("normalizes legacy 'incorrect' result value to 'wrong'", () => {
        const interaction = new CMIInteractionsObject();
        interaction.result = "incorrect";
        const json = interaction.toJSON();
        expect(json.result).toEqual("wrong");
      });
    });

    describe("CMITriesObject Tests", () => {
      const triesObject = () => {
        return new CMITriesObject();
      };
      const triesInitialized = () => {
        const cmi = new CMITriesObject();
        cmi.initialize();
        return cmi;
      };

      /**
       * cmi.interactions.n.objectives.n object
       */
      h.checkRead({
        cmi: triesObject(),
        fieldName: "cmi.status",
      });
      h.checkRead({
        cmi: triesInitialized(),
        fieldName: "cmi.status",
      });
      h.checkValidValues({
        cmi: triesObject(),
        fieldName: "cmi.status",
        validValues: scorm12Values.validLessonStatus.concat(["not attempted"]),
        invalidValues: scorm12Values.invalidLessonStatus,
      });
      h.checkReadAndWrite({
        cmi: triesObject(),
        fieldName: "cmi.time",
        valueToTest: "23:59:59",
      });
      h.checkValidValues({
        cmi: triesObject(),
        fieldName: "cmi.time",
        validValues: scorm12Values.validTime,
        invalidValues: scorm12Values.invalidTime,
      });

      /**
       * cmi.student_data.tries.n.score Properties
       */
      h.checkReadOnly({
        cmi: triesObject(),
        fieldName: "cmi.score._children",
        expectedValue: aicc_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: triesObject(),
        fieldName: "cmi.score.raw",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: triesObject(),
        fieldName: "cmi.score.min",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: triesObject(),
        fieldName: "cmi.score.max",
        validValues: scorm12Values.validScoreRange,
        invalidValues: scorm12Values.invalidScoreRange,
      });

      it("should export JSON", () => {
        const cmi = triesObject();
        expect(JSON.stringify(cmi)).toEqual(
          '{"status":"","time":"","score":{"raw":"","min":"","max":"100"}}',
        );
      });
    });

    describe("CMIPathsObject Tests", () => {
      const paths = () => {
        return new CMIPathsObject();
      };

      h.checkFieldConstraintSize({
        cmi: paths(),
        fieldName: "cmi.location_id",
        expectedError: type_mismatch,
        limit: 255,
      });
      h.checkReadAndWrite({
        cmi: paths(),
        fieldName: "cmi.date",
        valueToTest: "2021-01-01",
      });
      h.checkValidValues({
        cmi: paths(),
        fieldName: "cmi.time",
        validValues: scorm12Values.validTime,
        invalidValues: scorm12Values.invalidTime,
      });
      h.checkValidValues({
        cmi: paths(),
        fieldName: "cmi.status",
        validValues: scorm12Values.validLessonStatus,
        invalidValues: scorm12Values.invalidLessonStatus,
      });
      h.checkFieldConstraintSize({
        cmi: paths(),
        fieldName: "cmi.why_left",
        expectedError: type_mismatch,
        limit: 255,
      });
      h.checkValidValues({
        cmi: paths(),
        fieldName: "cmi.time_in_element",
        validValues: scorm12Values.validTime,
        invalidValues: scorm12Values.invalidTime,
      });

      it("should export JSON", () => {
        const cmi = paths();
        expect(JSON.stringify(cmi)).toEqual(
          '{"location_id":"","date":"","time":"","status":"","why_left":"","time_in_element":""}',
        );
      });
    });

    describe("CMIStudentDemographicsObject Tests", () => {
      const cmiInit = () => {
        const cmiStudentDemographics = new CMIStudentDemographics();
        cmiStudentDemographics.initialize();
        return cmiStudentDemographics;
      };
      const cmi = () => {
        return new CMIStudentDemographics();
      };

      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.city",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.class",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.company",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.country",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.experience",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.familiar_name",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.instructor_name",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.title",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.native_language",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.state",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.street_address",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.telephone",
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmiInit(),
        fieldName: "cmi.years_experience",
        expectedError: read_only,
      });

      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.city",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.class",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.company",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.country",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.experience",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.familiar_name",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.instructor_name",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.title",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.native_language",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.state",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.street_address",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.telephone",
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: "cmi.years_experience",
      });
    });

    describe("CMIEvaluationCommentsObject Tests", () => {
      const evaluationComment = () => {
        return new CMIEvaluationCommentsObject();
      };

      /**
       * cmi.evaluation.comments.n object
       */
      h.checkFieldConstraintSize({
        cmi: evaluationComment(),
        fieldName: "cmi.content",
        expectedError: type_mismatch,
        limit: 255,
      });
      h.checkFieldConstraintSize({
        cmi: evaluationComment(),
        fieldName: "cmi.location",
        expectedError: type_mismatch,
        limit: 255,
      });
      h.checkReadAndWrite({
        cmi: evaluationComment(),
        fieldName: "cmi.time",
        valueToTest: "23:59:59",
      });
      h.checkValidValues({
        cmi: evaluationComment(),
        fieldName: "cmi.time",
        validValues: scorm12Values.validTime,
        invalidValues: scorm12Values.invalidTime,
      });

      it("should export JSON", () => {
        const cmi = evaluationComment();
        expect(JSON.stringify(cmi)).toEqual('{"content":"","location":"","time":""}');
      });
    });

    describe("NAV Tests", () => {
      const nav = () => {
        return new NAV();
      };

      /**
       * cmi.interactions.n.correct_responses.n object
       */
      h.checkValidValues({
        cmi: nav(),
        fieldName: "cmi.event",
        validValues: ["previous", "continue"],
        invalidValues: ["P", "f", "complete", "started", "in progress"],
      });

      it("should export JSON", () => {
        const cmi = nav();
        expect(JSON.stringify(cmi)).toEqual('{"event":""}');
      });
    });
  });
});
