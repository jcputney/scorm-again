import {describe, beforeEach, afterEach} from 'mocha';
import {scorm12_constants} from '../../src/constants/api_constants';
import {scorm12_error_codes} from '../../src/constants/error_codes';
import {CMI} from '../../src/cmi/scorm12_cmi';
import * as h from '../helpers';

const invalid_set = scorm12_error_codes.INVALID_SET_VALUE;
const type_mismatch = scorm12_error_codes.TYPE_MISMATCH;
const write_only = scorm12_error_codes.WRITE_ONLY_ELEMENT;
const read_only = scorm12_error_codes.READ_ONLY_ELEMENT;
const invalid_range = scorm12_error_codes.VALUE_OUT_OF_RANGE;

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
        expectedError: type_mismatch,
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
        expectedError: type_mismatch,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: invalid_range,
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
        expectedError: invalid_range,
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
      h.checkValidValues({
        cmi: cmi(),
        fieldName: 'cmi.student_preference.audio',
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: type_mismatch,
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
        expectedError: type_mismatch,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: invalid_range,
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
        expectedError: invalid_range,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
        expectedError: type_mismatch,
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
        expectedError: invalid_range,
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
  });
});
