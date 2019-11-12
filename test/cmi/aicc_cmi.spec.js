import {expect} from 'chai';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {aicc_constants} from '../../src/constants/api_constants';
import {scorm12_error_codes} from '../../src/constants/error_codes';
import {CMI} from '../../src/cmi/aicc_cmi';

let cmi;

const checkFieldConstraintSize = ({fieldName, limit, expectedValue = ''}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should be able to write upto ${limit} characters to ${fieldName}`,
        () => {
          expect(() => eval(`${fieldName} = 'x'.repeat(${limit})`)).
              to.not.throw();
        });

    it(`Should fail to write more than ${limit} characters to ${fieldName}`,
        () => {
          expect(() => eval(`${fieldName} = 'x'.repeat(${limit + 1})`)).
              to.throw(scorm12_error_codes.TYPE_MISMATCH + '');
        });
  });
};

const checkInvalidSet = ({fieldName, expectedValue = ''}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should fail to write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = 'xxx'`)).
          to.throw(scorm12_error_codes.INVALID_SET_VALUE + '');
    });
  });
};

const checkReadOnly = ({fieldName, expectedValue = ''}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should fail to write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = 'xxx'`)).
          to.throw(scorm12_error_codes.READ_ONLY_ELEMENT + '');
    });
  });
};

const checkRead = ({fieldName, expectedValue = ''}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });
  });
};

const checkReadAndWrite = ({fieldName, expectedValue = '', valueToTest = 'xxx'}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should be able to read from ${fieldName}`, () => {
      expect(eval(`${fieldName}`)).to.equal(expectedValue);
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).
          to.not.throw();
    });
  });
};

const checkWriteOnly = ({fieldName, valueToTest = 'xxx'}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should fail to read from ${fieldName}`, () => {
      expect(() => eval(`${fieldName}`)).
          to.throw(scorm12_error_codes.WRITE_ONLY_ELEMENT + '');
    });

    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).to.not.throw();
    });
  });
};

const checkWrite = ({fieldName, valueToTest = 'xxx'}) => {
  describe(`Field: ${fieldName}`, () => {
    it(`Should successfully write to ${fieldName}`, () => {
      expect(() => eval(`${fieldName} = '${valueToTest}'`)).to.not.throw();
    });
  });
};

const checkValidValues = ({fieldName, expectedError, validValues, invalidValues}) => {
  describe(`Field: ${fieldName}`, () => {
    for (const idx in validValues) {
      if ({}.hasOwnProperty.call(validValues, idx)) {
        it(`Should successfully write '${validValues[idx]}' to ${fieldName}`,
            () => {
              expect(() => eval(`${fieldName} = '${validValues[idx]}'`)).
                  to.not.throw();
            });
      }
    }

    for (const idx in invalidValues) {
      if ({}.hasOwnProperty.call(invalidValues, idx)) {
        it(`Should fail to write '${invalidValues[idx]}' to ${fieldName}`,
            () => {
              expect(() => eval(`${fieldName} = '${invalidValues[idx]}'`)).
                  to.throw(expectedError + '');
            });
      }
    }
  });
};

describe('AICC CMI Tests', () => {
  describe('CMI Spec Tests', () => {
    describe('Pre-Initialize Tests', () => {
      beforeEach('Create the API object', () => {
        cmi = new CMI();
      });
      afterEach('Destroy API object', () => {
        cmi = null;
      });

      /**
       * Base CMI Properties
       */
      checkInvalidSet({fieldName: 'cmi._version', expectedValue: '3.4'});
      checkInvalidSet({
        fieldName: 'cmi._children',
        expectedValue: aicc_constants.cmi_children,
      });
      checkFieldConstraintSize({fieldName: 'cmi.suspend_data', limit: 4096});
      checkReadAndWrite({fieldName: 'cmi.launch_data'});
      checkFieldConstraintSize({fieldName: 'cmi.comments', limit: 4096});
      checkReadAndWrite({fieldName: 'cmi.comments_from_lms'});

      /**
       * cmi.core Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.core._children',
        expectedValue: aicc_constants.core_children,
      });
      checkReadAndWrite({fieldName: 'cmi.core.student_id'});
      checkReadAndWrite({fieldName: 'cmi.core.student_name'});
      checkFieldConstraintSize({
        fieldName: 'cmi.core.lesson_location',
        limit: 255,
      });
      checkReadAndWrite({fieldName: 'cmi.core.credit'});
      checkRead({fieldName: 'cmi.core.lesson_status'});
      checkValidValues({
        fieldName: 'cmi.core.lesson_status',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkReadAndWrite({fieldName: 'cmi.core.entry'});
      checkReadAndWrite({fieldName: 'cmi.core.total_time'});
      checkReadAndWrite(
          {fieldName: 'cmi.core.lesson_mode', expectedValue: 'normal'});
      checkWrite({fieldName: 'cmi.core.exit', valueToTest: 'suspend'});
      checkValidValues({
        fieldName: 'cmi.core.exit',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
        validValues: [
          'time-out',
          'suspend',
          'logout',
        ], invalidValues: [
          'complete',
          'exit',
        ],
      });
      checkWriteOnly({
        fieldName: 'cmi.core.session_time',
        valueToTest: '00:00:00',
      });
      checkValidValues({
        fieldName: 'cmi.core.session_time',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkInvalidSet({
        fieldName: 'cmi.core.score._children',
        expectedValue: aicc_constants.score_children,
      });
      checkValidValues({
        fieldName: 'cmi.core.score.raw',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
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
      checkValidValues({
        fieldName: 'cmi.core.score.min',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
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
      checkValidValues({
        fieldName: 'cmi.core.score.max',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
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
      checkInvalidSet({
        fieldName: 'cmi.objectives._children',
        expectedValue: aicc_constants.objectives_children,
      });
      checkInvalidSet({fieldName: 'cmi.objectives._count', expectedValue: 0});

      /**
       * cmi.student_data Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.student_data._children',
        expectedValue: aicc_constants.student_data_children,
      });
      checkReadAndWrite({fieldName: 'cmi.student_data.mastery_score'});
      checkReadAndWrite({fieldName: 'cmi.student_data.max_time_allowed'});
      checkReadAndWrite({fieldName: 'cmi.student_data.time_limit_action'});
      checkReadAndWrite({fieldName: 'cmi.student_data.tries_during_lesson'});

      /**
       * cmi.student_preference Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.student_preference._children',
        expectedValue: aicc_constants.student_preference_children,
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.audio',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkValidValues({
        fieldName: 'cmi.student_preference.audio',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        validValues: [],
        invalidValues: [
          '101',
          '5000000',
          '-500',
        ],
      });
      checkFieldConstraintSize({
        fieldName: 'cmi.student_preference.language',
        limit: 255,
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.speed',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkValidValues({
        fieldName: 'cmi.student_preference.speed',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        validValues: [],
        invalidValues: [
          '101',
          '-101',
          '5000000',
          '-500',
        ],
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.text',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
        validValues: [
          '1',
          '-1',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.text',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        validValues: [],
        invalidValues: [
          '2',
          '-2',
        ],
      });

      /**
       * cmi.interactions Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.interactions._children',
        expectedValue: aicc_constants.interactions_children,
      });
      checkInvalidSet({fieldName: 'cmi.interactions._count', expectedValue: 0});
    });

    describe('Post-Initialize Tests', () => {
      beforeEach('Create the API object', () => {
        cmi = new CMI();
        cmi.initialize();
      });
      afterEach('Destroy API object', () => {
        cmi = null;
      });

      /**
       * Base CMI Properties
       */
      checkInvalidSet({fieldName: 'cmi._version', expectedValue: '3.4'});
      checkInvalidSet({
        fieldName: 'cmi._children',
        expectedValue: aicc_constants.cmi_children,
      });
      checkFieldConstraintSize({fieldName: 'cmi.suspend_data', limit: 4096});
      checkReadOnly({fieldName: 'cmi.launch_data'});
      checkFieldConstraintSize({fieldName: 'cmi.comments', limit: 4096});
      checkReadOnly({fieldName: 'cmi.comments_from_lms'});

      /**
       * cmi.core Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.core._children',
        expectedValue: aicc_constants.core_children,
      });
      checkReadOnly({fieldName: 'cmi.core.student_id'});
      checkReadOnly({fieldName: 'cmi.core.student_name'});
      checkFieldConstraintSize({
        fieldName: 'cmi.core.lesson_location',
        limit: 255,
      });
      checkReadOnly({fieldName: 'cmi.core.credit'});
      checkRead({fieldName: 'cmi.core.lesson_status'});
      checkValidValues({
        fieldName: 'cmi.core.lesson_status',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkReadOnly({fieldName: 'cmi.core.entry'});
      checkReadOnly({fieldName: 'cmi.core.total_time'});
      checkReadOnly(
          {fieldName: 'cmi.core.lesson_mode', expectedValue: 'normal'});
      checkWrite({fieldName: 'cmi.core.exit', valueToTest: 'suspend'});
      checkValidValues({
        fieldName: 'cmi.core.exit',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
        validValues: [
          'time-out',
          'suspend',
          'logout',
        ], invalidValues: [
          'complete',
          'exit',
        ],
      });
      checkWriteOnly({
        fieldName: 'cmi.core.session_time',
        valueToTest: '00:00:00',
      });
      checkValidValues({
        fieldName: 'cmi.core.session_time',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkInvalidSet({
        fieldName: 'cmi.core.score._children',
        expectedValue: aicc_constants.score_children,
      });
      checkValidValues({
        fieldName: 'cmi.core.score.raw',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
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
      checkValidValues({
        fieldName: 'cmi.core.score.min',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
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
      checkValidValues({
        fieldName: 'cmi.core.score.max',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
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
      checkInvalidSet({
        fieldName: 'cmi.objectives._children',
        expectedValue: aicc_constants.objectives_children,
      });
      checkInvalidSet({fieldName: 'cmi.objectives._count', expectedValue: 0});

      /**
       * cmi.student_data Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.student_data._children',
        expectedValue: aicc_constants.student_data_children,
      });
      checkReadOnly({fieldName: 'cmi.student_data.mastery_score'});
      checkReadOnly({fieldName: 'cmi.student_data.max_time_allowed'});
      checkReadOnly({fieldName: 'cmi.student_data.time_limit_action'});
      checkReadOnly({fieldName: 'cmi.student_data.tries_during_lesson'});

      /**
       * cmi.student_preference Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.student_preference._children',
        expectedValue: aicc_constants.student_preference_children,
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.audio',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkValidValues({
        fieldName: 'cmi.student_preference.audio',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        validValues: [],
        invalidValues: [
          '101',
          '5000000',
          '-500',
        ],
      });
      checkFieldConstraintSize({
        fieldName: 'cmi.student_preference.language',
        limit: 255,
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.speed',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
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
      checkValidValues({
        fieldName: 'cmi.student_preference.speed',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        validValues: [],
        invalidValues: [
          '101',
          '-101',
          '5000000',
          '-500',
        ],
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.text',
        expectedError: scorm12_error_codes.TYPE_MISMATCH,
        validValues: [
          '1',
          '-1',
        ],
        invalidValues: [
          'invalid',
          'a100',
        ],
      });
      checkValidValues({
        fieldName: 'cmi.student_preference.text',
        expectedError: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        validValues: [],
        invalidValues: [
          '2',
          '-2',
        ],
      });

      /**
       * cmi.interactions Properties
       */
      checkInvalidSet({
        fieldName: 'cmi.interactions._children',
        expectedValue: aicc_constants.interactions_children,
      });
      checkInvalidSet({fieldName: 'cmi.interactions._count', expectedValue: 0});
    });
  });
});
