import {describe} from 'mocha';
import {scorm2004_error_codes} from '../../src/constants/error_codes';
import {scorm2004_constants} from '../../src/constants/api_constants';
import {CMI} from '../../src/cmi/scorm2004_cmi';
import * as h from '../helpers';

const read_only = scorm2004_error_codes.READ_ONLY_ELEMENT;
const write_only = scorm2004_error_codes.WRITE_ONLY_ELEMENT;
const invalid_set = scorm2004_error_codes.INVALID_SET_VALUE;
const invalid_range = scorm2004_error_codes.VALUE_OUT_OF_RANGE;
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
    });
  });
});
