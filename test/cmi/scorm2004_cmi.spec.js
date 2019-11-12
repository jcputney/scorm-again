import {describe} from 'mocha';
import {scorm2004_error_codes} from '../../src/constants/error_codes';
import {scorm2004_constants} from '../../src/constants/api_constants';
import {CMI} from '../../src/cmi/scorm2004_cmi';
import * as h from '../helpers';

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
        validValues: [
          'completed',
          'incomplete',
          'not attempted',
          'unknown',
        ],
        invalidValues: [
          'complete',
          'passed',
          'failed',
        ],
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
        validValues: [
          'time-out',
          'suspend',
          'logout',
          'normal',
        ],
        invalidValues: [
          'close',
          'exit',
          'crash',
        ],
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
        validValues: [
          '0.0',
          '0.25',
          '0.5',
          '1.0',
        ],
        invalidValues: [
          '-1',
          '-0.1',
          '1.1',
          '.25',
        ],
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
        validValues: [
          'P1Y34DT23H45M15S',
          'PT1M45S',
          'P0S',
          'PT75M',
        ],
        invalidValues: [
          '00:08:45',
          '-P1H',
          '1y45D',
          '0',
        ],
      });
      h.checkRead({
        cmi: cmi(),
        fieldName: 'cmi.success_status',
        expectedValue: 'unknown',
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.success_status',
        validValues: [
          'passed',
          'failed',
          'unknown',
        ],
        invalidValues: [
          'complete',
          'incomplete',
          'P',
          'f',
        ],
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
        validValues: [
          '1',
          '50',
          '100',
        ],
        invalidValues: [
          'invalid',
          'a100',
          '-1',
        ],
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
        validValues: [
          '1',
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
        fieldName: 'cmi.learner_preference.audio_captioning',
        validValues: [
          '1',
          '-1',
        ],
        invalidValues: [
          'invalid',
          'a100',
          '2',
          '-2',
        ],
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
        validValues: [
          '1',
          '0.5',
          '0',
          '-0.5',
          '-1',
        ],
        invalidValues: [
          '-101',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.raw',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          'a100',
          'invalid',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.min',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          'a100',
          'invalid',
        ],
      });
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.score.max',
        validValues: [
          '0',
          '25.1',
          '50.5',
          '75',
          '100',
        ],
        invalidValues: [
          'a100',
          'invalid',
        ],
      });
    });
  });
});
