import { expect, assert } from 'chai';
import {describe, it, before, beforeEach, after, afterEach, } from "mocha";
import Scorm12API from "../src/Scorm12API";
import {scorm12_constants, scorm12_error_codes} from "../src/constants";

let API;

const checkFieldConstraintSize = (fieldName: String, limit: Number, expectedValue: String = '') => {
    describe(`Field: ${fieldName}`, () => {
        it(`Should be able to read from ${fieldName}`, () => {
            expect(eval(`API.${fieldName}`)).to.equal(expectedValue);
        });

        it(`Should be able to write upto ${limit} characters to ${fieldName}`, () => {
            eval(`API.${fieldName} = 'x'.repeat(${limit})`);
            expect(0).to.equal(API.lastErrorCode);
        });

        it(`Should fail to write more than ${limit} characters to ${fieldName}`, () => {
            eval(`API.${fieldName} = 'x'.repeat(${limit + 1})`);
            expect(scorm12_error_codes.TYPE_MISMATCH + '').to.equal(API.lastErrorCode);
        });
    });
};

const checkInvalidSet = (fieldName: String, expectedValue: String = '') => {
    describe(`Field: ${fieldName}`, () => {
        it(`Should be able to read from ${fieldName}`, () => {
            expect(eval(`API.${fieldName}`)).to.equal(expectedValue);
        });

        it(`Should fail to write to ${fieldName}`, () => {
            eval(`API.${fieldName} = 'xxx'`);
            expect(API.lastErrorCode).to.equal(scorm12_error_codes.INVALID_SET_VALUE + '');
        });
    });
};

const checkReadOnly = (fieldName: String, expectedValue: String = '') => {
    describe(`Field: ${fieldName}`, () => {
        it(`Should be able to read from ${fieldName}`, () => {
            expect(eval(`API.${fieldName}`)).to.equal(expectedValue);
        });

        it(`Should fail to write to ${fieldName}`, () => {
            eval(`API.${fieldName} = 'xxx'`);
            expect(API.lastErrorCode).to.equal(scorm12_error_codes.READ_ONLY_ELEMENT + '');
        });
    });
};

const checkRead = (fieldName: String, expectedValue: String = '') => {
    describe(`Field: ${fieldName}`, () => {
        it(`Should be able to read from ${fieldName}`, () => {
            expect(eval(`API.${fieldName}`)).to.equal(expectedValue);
        });
    });
};

const checkWriteOnly = (fieldName: String, valueToTest: String = 'xxx') => {
    describe(`Field: ${fieldName}`, () => {
        it(`Should fail to read from ${fieldName}`, () => {
            eval(`API.${fieldName}`);
            expect(API.lastErrorCode).to.equal(scorm12_error_codes.WRITE_ONLY_ELEMENT + '');
        });

        it(`Should successfully write to ${fieldName}`, () => {
            eval(`API.${fieldName} = '${valueToTest}'`);
            expect(API.lastErrorCode).to.equal(0);
        });
    });
};

const checkWrite = (fieldName: String, valueToTest: String = 'xxx') => {
    describe(`Field: ${fieldName}`, () => {
        it(`Should successfully write to ${fieldName}`, () => {
            eval(`API.${fieldName} = '${valueToTest}'`);
            expect(API.lastErrorCode).to.equal(0);
        });
    });
};

const checkValidValues = (fieldName: String, expectedError: Number, validValues: Array, invalidValues: Array) => {
    describe(`Field: ${fieldName}`, () => {
        for(let idx in validValues) {
            it(`Should successfully write '${validValues[idx]}' to ${fieldName}`, () => {
                eval(`API.${fieldName} = '${validValues[idx]}'`);
                expect(API.lastErrorCode).to.equal(0);
            });
        }

        for(let idx in invalidValues) {
            it(`Should fail to write '${invalidValues[idx]}' to ${fieldName}`, () => {
                eval(`API.${fieldName} = '${invalidValues[idx]}'`);
                expect(API.lastErrorCode).to.equal(expectedError + '');
            });
        }
    });
};

describe('SCORM 1.2 API Tests', () => {
   describe('CMI Spec Tests', () => {
       describe('Post-LMSInitialize Tests', () => {
           beforeEach('Create the API object', () => {
               API = new Scorm12API();
               API.LMSInitialize();
           });
           afterEach('Destroy API object', () => {
               API = null;
           });

           it('LMSInitialize should create CMI object', () => {
               assert(API.cmi !== undefined, 'CMI object is created');
           });

           it('Exporting CMI to JSON produces proper Object', () => {
               expect(
                   JSON.parse(API.renderCMIToJSON())
               ).to.hasOwnProperty('core')
           });

           /**
            * Base CMI Properties
            */
           checkInvalidSet('cmi._version', '3.4');
           checkInvalidSet('cmi._children', scorm12_constants.cmi_children);
           checkFieldConstraintSize('cmi.suspend_data', 4096);
           checkReadOnly('cmi.launch_data');
           checkFieldConstraintSize('cmi.comments', 4096);
           checkReadOnly('cmi.comments_from_lms');

           /**
            * cmi.core Properties
            */
           checkInvalidSet('cmi.core._children', scorm12_constants.core_children);
           checkReadOnly('cmi.core.student_id');
           checkReadOnly('cmi.core.student_name');
           checkFieldConstraintSize('cmi.core.lesson_location', 255);
           checkReadOnly('cmi.core.credit');
           checkRead('cmi.core.lesson_status');
           checkValidValues('cmi.core.lesson_status', scorm12_error_codes.TYPE_MISMATCH, [
               'passed',
               'completed',
               'failed',
               'incomplete',
               'browsed'
           ], [
               'Passed',
               'P',
               'F',
               'p',
               'true',
               'false',
               'complete'
           ]);
           checkReadOnly('cmi.core.entry');
           checkReadOnly('cmi.core.total_time');
           checkReadOnly('cmi.core.lesson_mode', 'normal');
           checkWrite('cmi.core.exit', 'suspend');
           checkValidValues('cmi.core.exit', scorm12_error_codes.TYPE_MISMATCH, [
               'time-out',
               'suspend',
               'logout',
           ], [
               'complete',
               'exit'
           ]);
           checkWriteOnly('cmi.core.session_time', '00:00:00');
           checkValidValues('cmi.core.session_time', scorm12_error_codes.TYPE_MISMATCH, [
               '10:06:57',
               '00:00:01.56',
               '23:59:59',
               '47:59:59',
           ], [
               '06:5:13',
               '23:59:59.123',
               'P1DT23H59M59S'
           ]);

           /**
            * cmi.core.score Properties
            */
           checkInvalidSet('cmi.core.score._children', scorm12_constants.score_children);
           checkValidValues('cmi.core.score.raw', scorm12_error_codes.VALUE_OUT_OF_RANGE, [
               '0',
               '25.1',
               '50.5',
               '75',
               '100',
           ], [
               '-1',
               '101'
           ]);
           checkValidValues('cmi.core.score.min', scorm12_error_codes.VALUE_OUT_OF_RANGE, [
               '0',
               '25.1',
               '50.5',
               '75',
               '100',
           ], [
               '-1',
               '101'
           ]);
           checkValidValues('cmi.core.score.max', scorm12_error_codes.VALUE_OUT_OF_RANGE, [
               '0',
               '25.1',
               '50.5',
               '75',
               '100',
           ], [
               '-1',
               '101'
           ]);

           /**
            * cmi.objectives Properties
            */
           checkInvalidSet('cmi.objectives._children', scorm12_constants.objectives_children);
           checkInvalidSet('cmi.objectives._count', 0);

           /**
            * cmi.student_data Properties
            */
           checkInvalidSet('cmi.student_data._children', scorm12_constants.student_data_children);
           checkReadOnly('cmi.student_data.mastery_score');
           checkReadOnly('cmi.student_data.max_time_allowed');
           checkReadOnly('cmi.student_data.time_limit_action');

           /**
            * cmi.student_preference Properties
            */
           checkInvalidSet('cmi.student_preference._children', scorm12_constants.student_preference_children);
           checkValidValues('cmi.student_preference.audio', scorm12_error_codes.TYPE_MISMATCH, [
               '1',
               '-1',
               '50',
               '100',
           ], [
               'invalid',
               'a100'
           ]);
           checkValidValues('cmi.student_preference.audio', scorm12_error_codes.VALUE_OUT_OF_RANGE, [], [
               '101',
               '5000000',
               '-500'
           ]);
           checkFieldConstraintSize('cmi.student_preference.language', 255);
           checkValidValues('cmi.student_preference.speed', scorm12_error_codes.TYPE_MISMATCH, [
               '1',
               '-100',
               '50',
               '100',
           ], [
               'invalid',
               'a100'
           ]);
           checkValidValues('cmi.student_preference.speed', scorm12_error_codes.VALUE_OUT_OF_RANGE, [], [
               '101',
               '-101',
               '5000000',
               '-500'
           ]);
           checkValidValues('cmi.student_preference.text', scorm12_error_codes.TYPE_MISMATCH, [
               '1',
               '-1'
           ], [
               'invalid',
               'a100'
           ]);
           checkValidValues('cmi.student_preference.text', scorm12_error_codes.VALUE_OUT_OF_RANGE, [], [
               '2',
               '-2'
           ]);

           /**
            * cmi.interactions Properties
            */
           checkInvalidSet('cmi.interactions._children', scorm12_constants.interactions_children);
           checkInvalidSet('cmi.interactions._count', 0);
       });
   });
});