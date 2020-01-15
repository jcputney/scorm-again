import {expect} from 'chai';
import {describe, it} from 'mocha';
import * as h from './api_helpers';
import ErrorCodes from '../src/constants/error_codes';
import AICC from '../src/AICC';

const scorm12_error_codes = ErrorCodes.scorm12;

const api = () => {
  const API = new AICC();
  API.apiLogLevel = 1;
  return API;
};
const apiInitialized = () => {
  const API = api();
  API.lmsInitialize();
  return API;
};

describe('AICC API Tests', () => {
  describe('setCMIValue()', () => {
    describe('Invalid Sets - Should Always Fail', () => {
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi._version',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi._children',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.core._children',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.core.score._children',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.objectives._children',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.objectives._count',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions._children',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions._count',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions.0.objectives._count',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions.0.correct_responses._count',
        expectedError: scorm12_error_codes.INVALID_SET_VALUE,
      });
    });

    describe('Invalid Sets - Should Fail After Initialization', () => {
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.launch_data',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.student_id',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.student_name',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.credit',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.entry',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.total_time',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.lesson_mode',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.student_data.mastery_score',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.student_data.max_time_allowed',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.student_data.time_limit_action',
        expectedError: scorm12_error_codes.READ_ONLY_ELEMENT,
      });
    });
  });

  describe('LMSGetValue()', () => {
    describe('Invalid Properties - Should Always Fail', () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.close',
        expectedError: scorm12_error_codes.GENERAL,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.exit',
        expectedError: scorm12_error_codes.GENERAL,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.entry',
        expectedError: scorm12_error_codes.GENERAL,
        errorThrown: false,
      });
    });

    describe('Write-Only Properties - Should Always Fail', () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.exit',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.session_time',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.id',
        initializeFirst: true,
        initializationValue: 'AAA',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.time',
        initializeFirst: true,
        initializationValue: '12:59:59',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.type',
        initializeFirst: true,
        initializationValue: 'true-false',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.weighting',
        initializeFirst: true,
        initializationValue: '0',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.student_response',
        initializeFirst: true,
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.result',
        initializeFirst: true,
        initializationValue: 'correct',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.latency',
        initializeFirst: true,
        initializationValue: '01:59:59.99',
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.correct_responses.0.pattern',
        initializeFirst: true,
        expectedError: scorm12_error_codes.WRITE_ONLY_ELEMENT,
      });
    });
  });

  describe('LMSSetValue()', () => {
    describe('Uninitialized - Should Fail', () => {
      h.checkLMSSetValue({
        api: api(),
        fieldName: 'cmi.objectives.0.id',
        expectedError: scorm12_error_codes.STORE_BEFORE_INIT,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: 'cmi.interactions.0.id',
        expectedError: scorm12_error_codes.STORE_BEFORE_INIT,
      });
    });

    describe('Initialized - Should Succeed', () => {
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.objectives.0.id',
        valueToTest: 'AAA',
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.id',
        valueToTest: 'AAA',
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.evaluation.comments.0.content',
        valueToTest: 'AAA',
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.student_data.tries.0.score.max',
        valueToTest: '100',
      });
    });
  });

  describe('replaceWithAnotherScormAPI()', () => {
    const firstAPI = api();
    const secondAPI = api();

    firstAPI.cmi.core.student_id = 'student_1';
    secondAPI.cmi.core.student_id = 'student_2';

    firstAPI.replaceWithAnotherScormAPI(secondAPI);
    expect(
        firstAPI.cmi.core.student_id,
    ).to.equal('student_2');
  });
});
