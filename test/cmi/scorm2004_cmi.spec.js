import {describe, it} from 'mocha';
import {scorm2004_error_codes} from '../../src/constants/error_codes';
import {scorm2004_constants} from '../../src/constants/api_constants';
import {
  ADL,
  CMI,
  CMICommentsFromLearnerObject,
  CMICommentsFromLMSObject, CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
  CMIObjectivesObject,
} from '../../src/cmi/scorm2004_cmi';
import * as h from '../helpers';
import {expect} from 'chai';
import {scorm2004_values} from '../../src/constants/field_values';
import {valid_languages} from '../../src/constants/language_constants';

const read_only = scorm2004_error_codes.READ_ONLY_ELEMENT;
const write_only = scorm2004_error_codes.WRITE_ONLY_ELEMENT;
const invalid_set = scorm2004_error_codes.INVALID_SET_VALUE;
const type_mismatch = scorm2004_error_codes.TYPE_MISMATCH;

describe('SCORM 2004 CMI Tests', () => {
  describe('CMI Spec Tests', () => {
    describe('Pre-Initialize Tests', () => {
      const cmi = () => {
        return new CMI();
      };

      /**
       * Base CMI Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi._version',
        expectedValue: '1.0',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi._children',
        expectedValue: scorm2004_constants.cmi_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.completion_status',
        expectedError: type_mismatch,
        validValues: scorm2004_values.validCStatus,
        invalidValues: scorm2004_values.invalidCStatus,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.completion_threshold',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.credit',
        expectedValue: 'credit',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.entry',
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: 'cmi.exit',
        expectedError: write_only,
        valueToTest: 'time-out',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.exit',
        validValues: scorm2004_values.validExit,
        invalidValues: scorm2004_values.invalidExit,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.launch_data',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.learner_id',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.learner_name',
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.location',
        limit: 1000,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.max_time_allowed',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.mode',
        expectedValue: 'normal',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.max_time_allowed',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.progress_measure',
        validValues: scorm2004_values.valid0To1Range,
        invalidValues: scorm2004_values.invalid0To1Range,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.scaled_passing_score',
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: 'cmi.session_time',
        valueToTest: 'P0S',
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.session_time',
        validValues: scorm2004_values.validISO8601Durations,
        invalidValues: scorm2004_values.invalidISO8601Durations,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.success_status',
        expectedValue: 'unknown',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.success_status',
        validValues: scorm2004_values.validSStatus,
        invalidValues: scorm2004_values.invalidSStatus,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.suspend_data',
        limit: 64000,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.time_limit_action',
        expectedValue: 'continue,no message',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.total_time',
        expectedValue: '0',
      });

      /**
       * cmi.learner_preference Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference._children',
        expectedValue: scorm2004_constants.student_preference_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.audio_level',
        validValues: scorm2004_values.valid0To100Range,
        invalidValues: scorm2004_values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.language',
        validValues: [
          'en',
          'fr',
          'ru',
          'es',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.delivery_speed',
        validValues: scorm2004_values.valid0To100Range,
        invalidValues: scorm2004_values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.audio_captioning',
        validValues: scorm2004_values.validIntegerScaledRange,
        invalidValues: scorm2004_values.invalidIntegerScaledRange,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._children',
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.score Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.score._children',
        expectedValue: scorm2004_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.scaled',
        validValues: scorm2004_values.validScaledRange,
        invalidValues: scorm2004_values.invalidScaledRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.raw',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.min',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.max',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });

      /**
       * cmi.comments_from_learner Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_learner._children',
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_learner._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.comments_from_lms Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_lms._children',
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_lms._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.interactions Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.interactions._children',
        expectedValue: scorm2004_constants.interactions_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.interactions._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._children',
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      it('should export JSON', () => {
        const cmiObj = cmi();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        expect(
            JSON.stringify(cmiObj),
        ).
            to.
            equal(
                '{"comments_from_learner":{},"comments_from_lms":{},"completion_status":"unknown","completion_threshold":"","credit":"credit","entry":"","exit":"","interactions":{"0":{"id":"","type":"","objectives":{},"timestamp":"","weighting":"","learner_response":"","result":"","latency":"","description":"","correct_responses":{}}},"launch_data":"","learner_id":"","learner_name":"","learner_preference":{"audio_level":"1","language":"","delivery_speed":"1","audio_captioning":"0"},"location":"","max_time_allowed":"","mode":"normal","objectives":{"0":{"id":"","success_status":"unknown","completion_status":"unknown","progress_measure":"","description":"","score":{"scaled":"","raw":"","min":"","max":""}}},"progress_measure":"","scaled_passing_score":"","score":{"scaled":"","raw":"","min":"","max":""},"session_time":"PT0H0M0S","success_status":"unknown","suspend_data":"","time_limit_action":"continue,no message","total_time":"0"}');
      });
    });

    describe('Post-Initialize Tests', () => {
      const cmi = () => {
        const cmiObj = new CMI();
        cmiObj.initialize();
        return cmiObj;
      };

      /**
       * Base CMI Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi._version',
        expectedValue: '1.0',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi._children',
        expectedValue: scorm2004_constants.cmi_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.completion_status',
        expectedError: type_mismatch,
        validValues: scorm2004_values.validCStatus,
        invalidValues: scorm2004_values.invalidCStatus,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.completion_threshold',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.credit',
        expectedValue: 'credit',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.entry',
        expectedError: read_only,
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: 'cmi.exit',
        expectedError: write_only,
        valueToTest: 'time-out',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.exit',
        validValues: scorm2004_values.validExit,
        invalidValues: scorm2004_values.invalidExit,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.launch_data',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.learner_id',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.learner_name',
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.location',
        limit: 1000,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.max_time_allowed',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.mode',
        expectedValue: 'normal',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.max_time_allowed',
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.progress_measure',
        validValues: scorm2004_values.valid0To1Range,
        invalidValues: scorm2004_values.invalid0To1Range,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.scaled_passing_score',
        expectedError: read_only,
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: 'cmi.session_time',
        valueToTest: 'P0S',
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.session_time',
        validValues: scorm2004_values.validISO8601Durations,
        invalidValues: scorm2004_values.invalidISO8601Durations,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.success_status',
        expectedValue: 'unknown',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.success_status',
        validValues: scorm2004_values.validSStatus,
        invalidValues: scorm2004_values.invalidSStatus,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.suspend_data',
        limit: 64000,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.time_limit_action',
        expectedValue: 'continue,no message',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.total_time',
        expectedValue: '0',
        expectedError: read_only,
      });

      /**
       * cmi.learner_preference Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference._children',
        expectedValue: scorm2004_constants.student_preference_children,
        expectedError: read_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.audio_level',
        validValues: scorm2004_values.valid0To100Range,
        invalidValues: scorm2004_values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.language',
        validValues: [
          'en',
          'fr',
          'ru',
          'es',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.delivery_speed',
        validValues: scorm2004_values.valid0To100Range,
        invalidValues: scorm2004_values.invalid0To100Range,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.learner_preference.audio_captioning',
        validValues: scorm2004_values.validIntegerScaledRange,
        invalidValues: scorm2004_values.invalidIntegerScaledRange,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._children',
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.score Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.score._children',
        expectedValue: scorm2004_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.scaled',
        validValues: scorm2004_values.validScaledRange,
        invalidValues: scorm2004_values.invalidScaledRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.raw',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.min',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.max',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });

      /**
       * cmi.comments_from_learner Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_learner._children',
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_learner._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.comments_from_lms Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_lms._children',
        expectedValue: scorm2004_constants.comments_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_lms._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.interactions Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.interactions._children',
        expectedValue: scorm2004_constants.interactions_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.interactions._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      /**
       * cmi.objectives Properties
       */
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._children',
        expectedValue: scorm2004_constants.objectives_children,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: read_only,
      });

      it('should export JSON', () => {
        const cmiObj = cmi();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        expect(
            JSON.stringify(cmiObj),
        ).
            to.
            equal(
                '{"comments_from_learner":{},"comments_from_lms":{},"completion_status":"unknown","completion_threshold":"","credit":"credit","entry":"","exit":"","interactions":{"0":{"id":"","type":"","objectives":{},"timestamp":"","weighting":"","learner_response":"","result":"","latency":"","description":"","correct_responses":{}}},"launch_data":"","learner_id":"","learner_name":"","learner_preference":{"audio_level":"1","language":"","delivery_speed":"1","audio_captioning":"0"},"location":"","max_time_allowed":"","mode":"normal","objectives":{"0":{"id":"","success_status":"unknown","completion_status":"unknown","progress_measure":"","description":"","score":{"scaled":"","raw":"","min":"","max":""}}},"progress_measure":"","scaled_passing_score":"","score":{"scaled":"","raw":"","min":"","max":""},"session_time":"PT0H0M0S","success_status":"unknown","suspend_data":"","time_limit_action":"continue,no message","total_time":"0"}');
      });
    });

    describe('CMICommentsFromLearnerObject Tests', () => {
      const comments = () => {
        return new CMICommentsFromLearnerObject();
      };

      /**
       * cmi.comments_from_learner.n object
       */
      h.checkValidValues({
        cmi: comments(),
        fieldName: 'cmi.comment',
        validValues: scorm2004_values.validComment,
        invalidValues: scorm2004_values.invalidComment,
      });

      h.checkFieldConstraintSize({
        cmi: comments(),
        fieldName: 'cmi.location',
        expectedError: type_mismatch,
        limit: 250,
      });

      h.checkReadAndWrite({
        cmi: comments(),
        fieldName: 'cmi.timestamp',
        valueToTest: '2019-06-25T02:30:00',
      });
      h.checkValidValues({
        cmi: comments(),
        fieldName: 'cmi.timestamp',
        validValues: scorm2004_values.validTimestamps,
        invalidValues: scorm2004_values.invalidTimestamps,
      });

      it('should export JSON', () => {
        const cmi = comments();
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"comment":"","location":"","timestamp":""}');
      });
    });

    describe('CMICommentsFromLMSObject Tests', () => {
      const comments = () => {
        return new CMICommentsFromLMSObject();
      };
      const commentsInitialized = () => {
        const cmi = new CMICommentsFromLMSObject();
        cmi.initialize();
        return cmi;
      };

      /**
       * cmi.comments_from_lms.n object
       */
      h.checkValidValues({
        cmi: comments(),
        fieldName: 'cmi.comment',
        validValues: scorm2004_values.validComment,
        invalidValues: scorm2004_values.invalidComment,
      });

      h.checkFieldConstraintSize({
        cmi: comments(),
        fieldName: 'cmi.location',
        expectedError: type_mismatch,
        limit: 250,
      });

      h.checkReadAndWrite({
        cmi: comments(),
        fieldName: 'cmi.timestamp',
        valueToTest: scorm2004_values.validTimestamps[0],
      });
      h.checkValidValues({
        cmi: comments(),
        fieldName: 'cmi.timestamp',
        validValues: scorm2004_values.validTimestamps,
        invalidValues: scorm2004_values.invalidTimestamps,
      });

      h.checkReadOnly({
        cmi: commentsInitialized(),
        fieldName: 'cmi.comment',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: commentsInitialized(),
        fieldName: 'cmi.location',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: commentsInitialized(),
        fieldName: 'cmi.timestamp',
        expectedError: read_only,
      });

      it('should export JSON', () => {
        const cmi = comments();
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"comment":"","location":"","timestamp":""}');
      });
    });

    describe('CMIInteractionsObject Tests', () => {
      const interaction = () => {
        return new CMIInteractionsObject();
      };
      const interactionInitialized = () => {
        const cmi = new CMIInteractionsObject();
        cmi.initialize();
        return cmi;
      };

      /**
       * cmi.interactions.n object
       */
      h.checkReadAndWrite({
        cmi: interaction(),
        fieldName: 'cmi.id',
      });
      h.checkReadAndWrite({
        cmi: interactionInitialized(),
        fieldName: 'cmi.id',
      });

      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.timestamp',
        validValues: scorm2004_values.validTimestamps,
        invalidValues: scorm2004_values.invalidTimestamps,
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.type',
        validValues: scorm2004_values.validType,
        invalidValues: scorm2004_values.invalidType,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: 'cmi.correct_responses._count',
        expectedValue: 0,
        expectedError: read_only,
      });
      h.checkWrite({
        cmi: interaction(),
        fieldName: 'cmi.weighting',
        valueToTest: '0',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.weighting',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });

      /**
       * TODO: Learner Response depends on first setting Type, so need to build out lots of test cases
       */

      h.checkRead({
        cmi: interaction(),
        fieldName: 'cmi.result',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.result',
        validValues: scorm2004_values.validResult.concat([
          '1',
          '999',
          '999.99999',
        ]),
        invalidValues: scorm2004_values.invalidResult,
      });
      h.checkRead({
        cmi: interaction(),
        fieldName: 'cmi.latency',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.latency',
        validValues: scorm2004_values.validISO8601Durations,
        invalidValues: scorm2004_values.invalidISO8601Durations,
      });

      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.description',
        validValues: scorm2004_values.validDescription,
        invalidValues: scorm2004_values.invalidDescription,
      });

      it('should export JSON', () => {
        const cmi = interaction();
        cmi.objectives.childArray.push(new CMIInteractionsObjectivesObject());
        cmi.correct_responses.childArray.push(
            new CMIInteractionsCorrectResponsesObject());
        expect(
            JSON.stringify(cmi),
        ).
            to.
            equal(
                '{"id":"","type":"","objectives":{"0":{"id":""}},"timestamp":"","weighting":"","learner_response":"","result":"","latency":"","description":"","correct_responses":{"0":{"pattern":""}}}');
      });
    });

    describe('CMIObjectivesObject Tests', () => {
      const objective = () => {
        return new CMIObjectivesObject();
      };
      const objectiveInitialized = () => {
        const cmi = new CMIObjectivesObject();
        cmi.initialize();
        return cmi;
      };

      /**
       * cmi.objectives.n object
       */
      h.checkReadAndWrite({
        cmi: objective(),
        fieldName: 'cmi.id',
      });
      h.checkReadAndWrite({
        cmi: objectiveInitialized(),
        fieldName: 'cmi.id',
      });
      h.checkRead({
        cmi: objective(),
        fieldName: 'cmi.success_status',
        expectedValue: 'unknown',
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.success_status',
        validValues: scorm2004_values.validSStatus,
        invalidValues: scorm2004_values.invalidSStatus,
      });
      h.checkRead({
        cmi: objective(),
        fieldName: 'cmi.completion_status',
        expectedValue: 'unknown',
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.completion_status',
        validValues: scorm2004_values.validCStatus,
        invalidValues: scorm2004_values.invalidCStatus,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.progress_measure',
        validValues: scorm2004_values.valid0To1Range,
        invalidValues: scorm2004_values.invalid0To1Range,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.description',
        validValues: scorm2004_values.validDescription,
        invalidValues: scorm2004_values.invalidDescription,
      });

      /**
       * cmi.objectives.n.score Properties
       */
      h.checkInvalidSet({
        cmi: objective(),
        fieldName: 'cmi.score._children',
        expectedValue: scorm2004_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.scaled',
        validValues: scorm2004_values.validScaledRange,
        invalidValues: scorm2004_values.invalidScaledRange,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.raw',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.min',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.max',
        validValues: scorm2004_values.validScoreRange,
        invalidValues: scorm2004_values.invalidScoreRange,
      });

      it('should export JSON', () => {
        const cmi = objective();
        expect(
            JSON.stringify(cmi),
        ).
            to.
            equal(
                '{"id":"","success_status":"unknown","completion_status":"unknown","progress_measure":"","description":"","score":{"scaled":"","raw":"","min":"","max":""}}');
      });
    });

    describe('CMIInteractionsObjectivesObject Tests', () => {
      const interactionObjective = () => {
        return new CMIInteractionsObjectivesObject();
      };

      /**
       * cmi.interactions.n.objectives.n object
       */
      h.checkReadAndWrite({
        cmi: interactionObjective(),
        fieldName: 'cmi.id',
      });

      it('should export JSON', () => {
        const cmi = interactionObjective();
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"id":""}');
      });
    });

    describe('CMIInteractionsCorrectResponsesObject Tests', () => {
      const correctResponse = () => {
        return new CMIInteractionsCorrectResponsesObject();
      };

      /**
       * cmi.interactions.n.correct_responses.n object
       */
      h.checkReadAndWrite({
        cmi: correctResponse(),
        fieldName: 'cmi.pattern',
      });

      it('should export JSON', () => {
        const cmi = correctResponse();
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"pattern":""}');
      });
    });

    describe('ADL Tests', () => {
      describe('ADLNav Tests', () => {
        const adl = () => {
          return new ADL();
        };

        /**
         * cmi.interactions.n.correct_responses.n object
         */
        h.checkRead({
          cmi: adl(),
          fieldName: 'cmi.nav.request',
          expectedValue: '_none_',
        });

        h.checkValidValues({
          cmi: adl(),
          fieldName: 'cmi.nav.request',
          validValues: scorm2004_values.validNavRequest,
          invalidValues: scorm2004_values.invalidNavRequest,
        });

        it('should export JSON', () => {
          const cmi = adl();
          expect(
              JSON.stringify(cmi),
          ).to.equal('{"nav":{"request":"_none_"}}');
        });
      });
    });
  });
});
