import {expect} from 'chai';
import {after, before, describe, it} from 'mocha';
import Scorm12API from '../src/Scorm12API';
import * as h from './api_helpers';
import ErrorCodes from '../src/constants/error_codes';
import {scorm12_values} from './field_values';
import * as sinon from 'sinon';
import Pretender from 'fetch-pretender';

const scorm12_error_codes = ErrorCodes.scorm12;

let clock;
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
  before(() => {
    clock = sinon.useFakeTimers();

    const server = new Pretender(() => {
    });
    server.post('/scorm12', () => {
      return [200, {'Content-Type': 'application/json'}, '{}'];
    }, false);

    server.post('/scorm12/error', () => {
      return [500, {'Content-Type': 'application/json'}, '{}'];
    }, false);
  });

  after(() => {
    clock.restore();
  });

  describe('LMSSetValue()', () => {
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.core.score.raw',
      validValues: scorm12_values.validScoreRange,
      invalidValues: scorm12_values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.core.score.min',
      validValues: scorm12_values.validScoreRange,
      invalidValues: scorm12_values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.core.score.max',
      validValues: scorm12_values.validScoreRange,
      invalidValues: scorm12_values.invalidScoreRange,
    });
  });

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
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.objectives.0.id',
        valueToTest: 'AAA',
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.10.correct_responses.0.pattern',
        valueToTest: 't',
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

  describe('renderCommitCMI()', () => {
    it('should calculate total time when terminateCommit passed',
        () => {
          const scorm12API = api();
          scorm12API.cmi.core.total_time = '12:34:56';
          scorm12API.cmi.core.session_time = '23:59:59';
          const cmiExport = scorm12API.renderCommitCMI(true);
          expect(
              cmiExport.cmi.core.total_time,
          ).to.equal('36:34:55');
        });
    it('if the user passes, should calculate total time when terminateCommit passed',
        () => {
          const scorm12API = api();
          scorm12API.cmi.core.score.max = '100';
          scorm12API.cmi.core.score.min = '0';
          scorm12API.cmi.core.score.raw = '100';
          scorm12API.cmi.core.exit = 'suspend';
          scorm12API.cmi.core.lesson_status = 'completed';
          scorm12API.cmi.core.total_time = '0000:00:00';
          scorm12API.cmi.core.session_time = '23:59:59';
          const cmiExport = scorm12API.renderCommitCMI(true);
          expect(
              cmiExport.cmi.core.total_time,
          ).to.equal('23:59:59');
        });
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

  describe('Event Handlers', () => {
    it('Should handle SetValue.cmi.core.student_name event',
        () => {
          const scorm12API = apiInitialized();
          const callback = sinon.spy();
          scorm12API.on('LMSSetValue.cmi.core.student_name', callback);
          scorm12API.lmsSetValue('cmi.core.student_name', '@jcputney');
          expect(callback.called).to.be.true;
        });
    it('Should handle SetValue.cmi.* event',
        () => {
          const scorm12API = apiInitialized();
          const callback = sinon.spy();
          scorm12API.on('LMSSetValue.cmi.*', callback);
          scorm12API.lmsSetValue('cmi.core.student_name', '@jcputney');
          expect(callback.called).to.be.true;
        });
    it('Should handle CommitSuccess event',
        () => {
          const scorm12API = api({
            lmsCommitUrl: '/scorm12',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm12API.lmsInitialize();

          const callback = sinon.spy();
          scorm12API.on('CommitSuccess', callback);

          scorm12API.lmsSetValue('cmi.core.session_time', '00:01:00');
          clock.tick(2000);
          expect(callback.called).to.be.true;
        });
    it('Should clear all event listeners for CommitSuccess',
        () => {
          const scorm12API = api({
            lmsCommitUrl: '/scorm12',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm12API.lmsInitialize();

          const callback = sinon.spy();
          const callback2 = sinon.spy();
          scorm12API.on('CommitSuccess', callback);
          scorm12API.on('CommitSuccess', callback2);

          scorm12API.lmsSetValue('cmi.core.session_time', '00:01:00');
          clock.tick(2000);
          expect(callback.calledOnce).to.be.true;
          expect(callback2.calledOnce).to.be.true;

          scorm12API.clear('CommitSuccess');

          scorm12API.lmsSetValue('cmi.core.session_time', '00:01:00');
          clock.tick(2000);
          expect(callback.calledTwice).to.be.false;
          expect(callback2.calledTwice).to.be.false;
        });
    it('Should clear only the specific event listener for CommitSuccess',
        () => {
          const scorm12API = api({
            lmsCommitUrl: '/scorm12',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm12API.lmsInitialize();

          const callback = sinon.spy(() => 1);
          const callback2 = sinon.spy(() => 2);
          const callback3 = sinon.spy(() => 3);
          const callback4 = sinon.spy(() => 4);
          scorm12API.on('CommitSuccess', callback);
          scorm12API.on('CommitSuccess', callback2);
          scorm12API.on('LMSCommit', callback3);
          scorm12API.on('LMSSetValue', callback4);

          scorm12API.lmsSetValue('cmi.core.session_time', '00:01:00');
          clock.tick(2000);
          expect(callback.calledOnce).to.be.true;
          expect(callback2.calledOnce).to.be.true;
          expect(callback3.calledOnce).to.be.true;
          expect(callback4.calledOnce).to.be.true;

          scorm12API.off('CommitSuccess', callback);

          scorm12API.lmsSetValue('cmi.core.session_time', '00:01:00');
          clock.tick(2000);
          expect(callback.calledTwice).to.be.false; // removed callback should not be called a second time
          expect(callback2.calledTwice).to.be.true;
          expect(callback3.calledTwice).to.be.true;
          expect(callback4.calledTwice).to.be.true;
        });
    it('Should handle CommitError event',
        () => {
          const scorm12API = api({
            lmsCommitUrl: '/scorm12/error',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm12API.lmsInitialize();

          const callback = sinon.spy();
          scorm12API.on('CommitError', callback);

          scorm12API.lmsSetValue('cmi.core.session_time', '00:01:00');
          clock.tick(2000);
          expect(callback.called).to.be.true;
        });
  });
});
