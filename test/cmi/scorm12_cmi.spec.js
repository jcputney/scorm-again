import {expect} from 'chai';
import {describe, it} from 'mocha';
import {scorm12_constants} from '../../src/constants/api_constants';
import {scorm12_error_codes} from '../../src/constants/error_codes';
import {
  CMI,
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
  CMIObjectivesObject,
} from '../../src/cmi/scorm12_cmi';
import * as h from '../helpers';

const invalid_set = scorm12_error_codes.INVALID_SET_VALUE;
const type_mismatch = scorm12_error_codes.TYPE_MISMATCH;
const write_only = scorm12_error_codes.WRITE_ONLY_ELEMENT;
const read_only = scorm12_error_codes.READ_ONLY_ELEMENT;

describe('SCORM 1.2 CMI Tests', () => {
  describe('CMI Spec Tests', () => {
    describe('Pre-Initialize Tests', () => {
      const cmi = () => {
        return new CMI();
      };

      /**
       * Base CMI Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi._version',
        expectedValue: '3.4',
        expectedError: invalid_set,
      });
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi._children',
        expectedValue: scorm12_constants.cmi_children,
        expectedError: invalid_set,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.suspend_data',
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.launch_data',
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.comments',
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_lms',
      });

      /**
       * cmi.core Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.core._children',
        expectedValue: scorm12_constants.core_children,
        expectedError: invalid_set,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.student_id',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.student_name',
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_location',
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.credit',
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_status',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_status',
        validValues: [
          'passed',
          'completed',
          'failed',
          'incomplete',
          'browsed',
        ],
        invalidValues: [
          'Passed',
          'P',
          'F',
          'p',
          'true',
          'false',
          'complete',
        ],
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.entry',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.total_time',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_mode',
        expectedValue: 'normal',
      });
      h.checkWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.exit',
        valueToTest: 'suspend',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.exit',
        validValues: [
          'time-out',
          'suspend',
          'logout',
        ], invalidValues: [
          'complete',
          'exit',
        ],
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.session_time',
        valueToTest: '00:00:00',
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.session_time',
        validValues: [
          '10:06:57',
          '00:00:01.56',
          '23:59:59',
          '47:59:59',
        ],
        invalidValues: [
          '06:5:13',
          '23:59:59.123',
          'P1DT23H59M59S',
        ],
      });

      /**
       * cmi.core.score Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.core.score._children',
        expectedValue: scorm12_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.core.score.raw',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.score.raw',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.core.score.min',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.score.min',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.core.score.max',
        expectedValue: '100',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.score.max',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });

      /**
       * cmi.objectives Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.objectives._children',
        expectedValue: scorm12_constants.objectives_children,
        expectedError: invalid_set,
      });
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: invalid_set,
      });

      /**
       * cmi.student_data Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.student_data._children',
        expectedValue: scorm12_constants.student_data_children,
        expectedError: invalid_set,
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.student_data.mastery_score',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.student_data.max_time_allowed',
      });
      h.checkReadAndWrite({
        cmi: cmi(),
        fieldName: 'cmi.student_data.time_limit_action',
      });

      /**
       * cmi.student_preference Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.student_preference._children',
        expectedValue: scorm12_constants.student_preference_children,
        expectedError: invalid_set,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.audio',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.audio',
        validValues: [
          '1',
          '-1',
          '50',
          '100',
        ],
        invalidValues: [
          'invalid',
          'a100',
          '101',
          '5000000',
          '-500',
        ],
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.language',
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.speed',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.speed',
        validValues: [
          '1',
          '-100',
          '50',
          '100',
        ],
        invalidValues: [
          'invalid',
          'a100',
          '101',
          '-101',
          '5000000',
          '-500',
        ],
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.text',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.text',
        validValues: [
          '1',
          '-1',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.text',
        validValues: [],
        invalidValues: [
          '2',
          '-2',
        ],
      });

      /**
       * cmi.interactions Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.interactions._children',
        expectedValue: scorm12_constants.interactions_children,
        expectedError: invalid_set,
      });
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.interactions._count',
        expectedValue: 0,
        expectedError: invalid_set,
      });
    });

    describe('Post-Initialize Tests', () => {
      const cmi = () => {
        const obj = new CMI();
        obj.initialize();
        return obj;
      };

      /**
       * Base CMI Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi._version',
        expectedValue: '3.4',
        expectedError: invalid_set,
      });
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi._children',
        expectedValue: scorm12_constants.cmi_children,
        expectedError: invalid_set,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.suspend_data',
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.launch_data',
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.comments',
        limit: 4096,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.comments_from_lms',
        expectedError: read_only,
      });

      /**
       * cmi.core Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.core._children',
        expectedValue: scorm12_constants.core_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.student_id',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.student_name',
        expectedError: read_only,
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_location',
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.credit',
        expectedError: read_only,
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_status',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_status',
        validValues: [
          'passed',
          'completed',
          'failed',
          'incomplete',
          'browsed',
        ],
        invalidValues: [
          'Passed',
          'P',
          'F',
          'p',
          'true',
          'false',
          'complete',
        ],
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.entry',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.total_time',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.lesson_mode',
        expectedValue: 'normal',
        expectedError: read_only,
      });
      h.checkWrite({
        cmi: cmi(),
        fieldName: 'cmi.core.exit',
        valueToTest: 'suspend',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.exit',
        validValues: [
          'time-out',
          'suspend',
          'logout',
        ], invalidValues: [
          'complete',
          'exit',
        ],
      });
      h.checkWriteOnly({
        cmi: cmi(),
        fieldName: 'cmi.core.session_time',
        valueToTest: '00:00:00',
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.session_time',
        validValues: [
          '10:06:57',
          '00:00:01.56',
          '23:59:59',
          '47:59:59',
        ],
        invalidValues: [
          '06:5:13',
          '23:59:59.123',
          'P1DT23H59M59S',
        ],
      });

      /**
       * cmi.core.score Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.core.score._children',
        expectedValue: scorm12_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.score.raw',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.score.min',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.core.score.max',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });

      /**
       * cmi.objectives Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.objectives._children',
        expectedValue: scorm12_constants.objectives_children,
        expectedError: invalid_set,
      });
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: invalid_set,
      });

      /**
       * cmi.student_data Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.student_data._children',
        expectedValue: scorm12_constants.student_data_children,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.student_data.mastery_score',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.student_data.max_time_allowed',
        expectedError: read_only,
      });
      h.checkReadOnly({
        cmi: cmi(),
        fieldName: 'cmi.student_data.time_limit_action',
        expectedError: read_only,
      });

      /**
       * cmi.student_preference Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.student_preference._children',
        expectedValue: scorm12_constants.student_preference_children,
        expectedError: invalid_set,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.audio',
        validValues: [
          '1',
          '-1',
          '50',
          '100',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.audio',
        validValues: [],
        invalidValues: [
          '101',
          '5000000',
          '-500',
        ],
      });
      h.checkFieldConstraintSize({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.language',
        limit: 255,
        expectedError: type_mismatch,
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.speed',
        validValues: [
          '1',
          '-100',
          '50',
          '100',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.speed',
        validValues: [],
        invalidValues: [
          '101',
          '-101',
          '5000000',
          '-500',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.text',
        validValues: [
          '1',
          '-1',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.text',
        validValues: [],
        invalidValues: [
          '2',
          '-2',
        ],
      });

      /**
       * cmi.interactions Properties
       */
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.interactions._children',
        expectedValue: scorm12_constants.interactions_children,
        expectedError: invalid_set,
      });
      h.checkInvalidSet({
        cmi: cmi(),
        fieldName: 'cmi.interactions._count',
        expectedValue: 0,
        expectedError: invalid_set,
      });

      it('should export JSON', () => {
        const cmiObj = cmi();
        cmiObj.objectives.childArray.push(new CMIObjectivesObject());
        cmiObj.interactions.childArray.push(new CMIInteractionsObject());
        expect(
            JSON.stringify(cmiObj),
        ).to.equal('{"suspend_data":"","launch_data":"","comments":"","comments_from_lms":"","core":{"student_id":"","student_name":"","lesson_location":"","credit":"","lesson_status":"","entry":"","total_time":"","lesson_mode":"normal","exit":"","session_time":"00:00:00","score":{"raw":"","min":"","max":"100"}},"objectives":{"0":{"id":"","status":"","score":{"raw":"","min":"","max":"100"}}},"student_data":{"mastery_score":"","max_time_allowed":"","time_limit_action":""},"student_preference":{"audio":"","language":"","speed":"","text":""},"interactions":{"0":{"id":"","time":"","type":"","weighting":"","student_response":"","result":"","latency":"","objectives":{},"correct_responses":{}}}}');
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
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.id',
        expectedError: write_only,
      });
      h.checkWriteOnly({
        cmi: interactionInitialized(),
        fieldName: 'cmi.id',
        expectedError: write_only,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.time',
        expectedError: write_only,
        valueToTest: '23:59:59',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.time',
        validValues: [
          '15:00:30',
          '00:50:30',
          '23:00:30',
        ],
        invalidValues: [
          '-00:00:30',
          '0:50:30',
          '23:00:30.',
        ],
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.type',
        expectedError: write_only,
        valueToTest: 'true-false',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.type',
        validValues: [
          'true-false',
          'choice',
          'fill-in',
          'matching',
          'performance',
          'sequencing',
          'likert',
          'numeric',
        ],
        invalidValues: [
          'correct',
          'wrong',
          'logout',
        ],
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: 'cmi.objectives._count',
        expectedValue: 0,
        expectedError: invalid_set,
      });
      h.checkReadOnly({
        cmi: interaction(),
        fieldName: 'cmi.correct_responses._count',
        expectedValue: 0,
        expectedError: invalid_set,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.weighting',
        expectedError: write_only,
        valueToTest: '0',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.weighting',
        validValues: [
          '-100',
          '-1',
          '1',
          '100',
        ],
        invalidValues: [
          '-101',
          '101',
          'invalid',
        ],
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.student_response',
        expectedError: write_only,
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.result',
        expectedError: write_only,
        valueToTest: 'correct',
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.result',
        validValues: [
          'correct',
          'wrong',
          'unanticipated',
          'neutral',
          '1',
          '999',
          '999.99999',
        ],
        invalidValues: [
          '-1',
          '10000',
          'invalid',
        ],
      });
      h.checkWriteOnly({
        cmi: interaction(),
        fieldName: 'cmi.latency',
        valueToTest: '00:00:00',
        expectedError: write_only,
      });
      h.checkValidValues({
        cmi: interaction(),
        fieldName: 'cmi.latency',
        validValues: [
          '10:06:57',
          '00:00:01.56',
          '23:59:59',
          '47:59:59',
        ],
        invalidValues: [
          '06:5:13',
          '23:59:59.123',
          'P1DT23H59M59S',
        ],
      });

      it('should export JSON', () => {
        const cmi = interaction();
        cmi.objectives.childArray.push(new CMIInteractionsObjectivesObject());
        cmi.correct_responses.childArray.push(new CMIInteractionsCorrectResponsesObject());
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"id":"","time":"","type":"","weighting":"","student_response":"","result":"","latency":"","objectives":{"0":{"id":""}},"correct_responses":{"0":{"pattern":""}}}');
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
      h.checkWriteOnly({
        cmi: correctResponse(),
        fieldName: 'cmi.pattern',
        expectedError: write_only,
      });

      it('should export JSON', () => {
        const cmi = correctResponse();
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"pattern":""}');
      });
    });

    describe('CMIObjectivesObject Tests', () => {
      const objective = () => {
        return new CMIObjectivesObject();
      };

      /**
       * cmi.objectives.n object
       */
      h.checkReadAndWrite({
        cmi: objective(),
        fieldName: 'cmi.id',
      });
      h.checkRead({
        cmi: objective(),
        fieldName: 'cmi.status',
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.status',
        validValues: [
          'passed',
          'completed',
          'failed',
          'incomplete',
          'browsed',
          'not attempted',
        ],
        invalidValues: [
          'P',
          'f',
          'complete',
          'started',
          'in progress',
        ],
      });

      /**
       * cmi.objectives.n.score Properties
       */
      h.checkInvalidSet({
        cmi: objective(),
        fieldName: 'cmi.score._children',
        expectedValue: scorm12_constants.score_children,
        expectedError: invalid_set,
      });
      h.checkRead({
        cmi: objective(),
        fieldName: 'cmi.score.raw',
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.raw',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });
      h.checkRead({
        cmi: objective(),
        fieldName: 'cmi.score.min',
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.min',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });
      h.checkRead({
        cmi: objective(),
        fieldName: 'cmi.score.max',
        expectedValue: '100',
      });
      h.checkValidValues({
        cmi: objective(),
        fieldName: 'cmi.score.max',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          '-1',
          '101',
        ],
      });

      it('should export JSON', () => {
        const cmi = objective();
        expect(
            JSON.stringify(cmi),
        ).to.equal('{"id":"","status":"","score":{"raw":"","min":"","max":"100"}}');
      });
    });
  });
});
