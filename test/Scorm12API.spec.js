import {expect} from 'chai';
import {describe, it} from 'mocha';
import Scorm12API from '../src/Scorm12API';
import * as h from './api_helpers';
import {scorm12_error_codes} from '../src/constants/error_codes';

const api = (settings = {}) => {
  const API = new Scorm12API(settings);
  API.apiLogLevel = 1;
  return API;
};
const apiInitialized = (settings = {}) => {
  const API = api(settings);
  API.lmsInitialize();
  return API;
};

describe('SCORM 1.2 API Tests', () => {
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

    describe('Read and Write Properties - Should Success', () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.objectives.0.id',
        initializeFirst: true,
        initializationValue: 'AAA',
        expectedValue: 'AAA',
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
        initializationValue: 'AAA',
        expectedValue: 'AAA',
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

  describe('storeData()', () => {
    it('should set cmi.core.lesson_status to "completed"', () => {
      const scorm12API = api();
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).to.equal('completed');
    });
    it('should set cmi.core.lesson_status to "browsed"', () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_mode = 'browse';
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).to.equal('browsed');
    });
    it('should set cmi.core.lesson_status to "browsed" - Initial Status',
        () => {
          const scorm12API = api();
          scorm12API.startingData = {'cmi': {'core': {'lesson_status': ''}}};
          scorm12API.cmi.core.lesson_mode = 'browse';
          scorm12API.storeData(true);
          expect(scorm12API.cmi.core.lesson_status).to.equal('browsed');
        });
    it('should set cmi.core.lesson_status to "passed" - mastery_override: true',
        () => {
          const scorm12API = api({mastery_override: true});
          scorm12API.cmi.core.credit = 'credit';
          scorm12API.cmi.student_data.mastery_score = '60.0';
          scorm12API.cmi.core.score.raw = '75.0';
          scorm12API.storeData(true);
          expect(scorm12API.cmi.core.lesson_status).to.equal('passed');
        });
    it('should set cmi.core.lesson_status to "failed" - mastery_override: true',
        () => {
          const scorm12API = api({mastery_override: true});
          scorm12API.cmi.core.credit = 'credit';
          scorm12API.cmi.student_data.mastery_score = '60.0';
          scorm12API.cmi.core.score.raw = '55.0';
          scorm12API.storeData(true);
          expect(scorm12API.cmi.core.lesson_status).to.equal('failed');
        });
    it('should set cmi.core.lesson_status to "passed" - mastery_override: false',
        () => {
          const scorm12API = api({mastery_override: false});
          scorm12API.cmi.core.lesson_status = 'failed'; // module author wanted the user to pass, so we don't override
          scorm12API.cmi.core.credit = 'credit';
          scorm12API.cmi.student_data.mastery_score = '60.0';
          scorm12API.cmi.core.score.raw = '75.0';
          scorm12API.storeData(true);
          expect(scorm12API.cmi.core.lesson_status).to.equal('failed');
        });
    it('should set cmi.core.lesson_status to "failed" - mastery_override: false',
        () => {
          const scorm12API = api({mastery_override: false});
          scorm12API.cmi.core.lesson_status = 'passed'; // module author wanted the user to pass, so we don't override
          scorm12API.cmi.core.credit = 'credit';
          scorm12API.cmi.student_data.mastery_score = '60.0';
          scorm12API.cmi.core.score.raw = '55.0';
          scorm12API.storeData(true);
          expect(scorm12API.cmi.core.lesson_status).to.equal('passed');
        });
  });
});
