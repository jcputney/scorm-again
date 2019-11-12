import {expect} from 'chai';
import {describe, it, beforeEach, afterEach} from 'mocha';
import {scorm2004_error_codes} from '../../src/constants/error_codes';
import {scorm2004_constants} from '../../src/constants/api_constants';
import {CMI} from '../../src/cmi/scorm2004_cmi';

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
              to.throw(scorm2004_error_codes.TYPE_MISMATCH + '');
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
          to.throw(scorm2004_error_codes.INVALID_SET_VALUE + '');
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
          to.throw(scorm2004_error_codes.READ_ONLY_ELEMENT + '');
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
          to.throw(scorm2004_error_codes.WRITE_ONLY_ELEMENT + '');
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

describe('SCORM 2004 CMI Tests', () => {
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
      checkReadOnly({fieldName: 'cmi._version', expectedValue: '1.0'});
      checkReadOnly({
        fieldName: 'cmi._children',
        expectedValue: scorm2004_constants.cmi_children,
      });
      checkValidValues({
        fieldName: 'cmi.completion_status',
        expectedError: scorm2004_error_codes.TYPE_MISMATCH,
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
    });
  });
});
