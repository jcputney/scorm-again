import {expect} from 'chai';
import {describe, it} from 'mocha';
import * as h from './api_helpers';
import {scorm2004_error_codes} from '../src/constants/error_codes';
import Scorm2004API from '../src/Scorm2004API';
import {scorm2004_values} from '../src/constants/field_values';

const api = () => {
  const API = new Scorm2004API();
  API.apiLogLevel = 1;
  return API;
};
const apiInitialized = () => {
  const API = api();
  API.lmsInitialize();
  return API;
};

describe('SCORM 2004 API Tests', () => {
  describe('setCMIValue()', () => {
    describe('Invalid Sets - Should Always Fail', () => {
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi._version',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.comments_from_learner._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.comments_from_learner._count',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.comments_from_lms._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.comments_from_lms._count',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions._count',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions.0.objectives._count',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.interactions.0.correct_responses._count',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.learner_preference._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.objectives._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.objectives._count',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.objectives.0.score._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: 'cmi.score._children',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
    });

    describe('Invalid Sets - Should Fail After Initialization', () => {
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.completion_threshold',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.credit',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.entry',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.launch_data',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.learner_id',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.learner_name',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.max_time_allowed',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.mode',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.scaled_passing_score',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.time_limit_action',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.total_time',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms.0.comment',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms.0.location',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms.0.timestamp',
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
    });
  });

  describe('GetValue()', () => {
    describe('Invalid Properties - Should Always Fail', () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.close',
        expectedError: scorm2004_error_codes.UNDEFINED_DATA_MODEL,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.exit',
        expectedError: scorm2004_error_codes.UNDEFINED_DATA_MODEL,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.core.entry',
        expectedError: scorm2004_error_codes.UNDEFINED_DATA_MODEL,
        errorThrown: false,
      });
    });

    describe('Write-Only Properties - Should Always Fail', () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.exit',
        expectedError: scorm2004_error_codes.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: 'cmi.session_time',
        expectedError: scorm2004_error_codes.WRITE_ONLY_ELEMENT,
      });
    });
  });

  describe('SetValue()', () => {
    describe('Uninitialized - Should Fail', () => {
      h.checkLMSSetValue({
        api: api(),
        fieldName: 'cmi.objectives.0.id',
        expectedError: scorm2004_error_codes.STORE_BEFORE_INIT,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: 'cmi.interactions.0.id',
        expectedError: scorm2004_error_codes.STORE_BEFORE_INIT,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: 'cmi.comments_from_learner.0.comment',
        expectedError: scorm2004_error_codes.STORE_BEFORE_INIT,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: 'cmi.comments_from_lms.0.comment',
        expectedError: scorm2004_error_codes.STORE_BEFORE_INIT,
      });
    });

    describe('Initialized - Should Succeed', () => {
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.objectives.0.id',
        valueToTest: 'AAA',
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.id',
        valueToTest: 'AAA',
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_learner.0.comment',
        valueToTest: 'comment',
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_learner.0.location',
        valueToTest: 'location',
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_learner.0.timestamp',
        valueToTest: scorm2004_values.validTimestamps[0],
        errorThrown: false,
      });
    });

    describe('Initialized - Should Fail', () => {
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms.0.comment',
        valueToTest: 'comment',
        errorThrown: false,
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms.0.location',
        valueToTest: 'location',
        errorThrown: false,
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.comments_from_lms.0.timestamp',
        valueToTest: scorm2004_values.validTimestamps[0],
        errorThrown: false,
        expectedError: scorm2004_error_codes.READ_ONLY_ELEMENT,
      });
    });
  });

  describe('renderCommitCMI()', () => {
    it('should calculate total time when terminateCommit passed',
        () => {
          const scorm2004API = api();
          scorm2004API.cmi.total_time = 'PT12H34M56S';
          scorm2004API.cmi.session_time = 'PT23H59M59S';
          const cmiExport = scorm2004API.renderCommitCMI(true);
          expect(
              cmiExport.cmi.total_time
          ).to.equal('P1DT12H34M55S');
        });
  });

  describe('storeData()', () => {
    it('should set cmi.completion_status to "completed"',
        () => {
          const scorm2004API = api();
          scorm2004API.cmi.credit = 'credit';
          scorm2004API.cmi.completion_threshold = '0.6';
          scorm2004API.cmi.progress_measure = '0.75';
          scorm2004API.storeData(true);
          expect(scorm2004API.cmi.completion_status).to.equal('completed');
        });
    it('should set cmi.completion_status to "incomplete"',
        () => {
          const scorm2004API = api();
          scorm2004API.cmi.credit = 'credit';
          scorm2004API.cmi.completion_threshold = '0.7';
          scorm2004API.cmi.progress_measure = '0.6';
          scorm2004API.storeData(true);
          expect(scorm2004API.cmi.completion_status).to.equal('incomplete');
        });
    it('should set cmi.success_status to "passed"',
        () => {
          const scorm2004API = api();
          scorm2004API.cmi.credit = 'credit';
          scorm2004API.cmi.score.scaled = '0.7';
          scorm2004API.cmi.scaled_passing_score = '0.6';
          scorm2004API.storeData(true);
          expect(scorm2004API.cmi.success_status).to.equal('passed');
        });
    it('should set cmi.success_status to "failed"',
        () => {
          const scorm2004API = api();
          scorm2004API.cmi.credit = 'credit';
          scorm2004API.cmi.score.scaled = '0.6';
          scorm2004API.cmi.scaled_passing_score = '0.7';
          scorm2004API.storeData(true);
          expect(scorm2004API.cmi.success_status).to.equal('failed');
        });
  });
});
