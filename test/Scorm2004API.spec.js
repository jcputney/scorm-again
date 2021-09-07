import {expect} from 'chai';
import {describe, it, before, after} from 'mocha';
import * as sinon from 'sinon';
import * as h from './api_helpers';
import Pretender from 'fetch-pretender';
import ErrorCodes from '../src/constants/error_codes';
import Scorm2004API from '../src/Scorm2004API';
import {scorm2004_values} from './field_values';

const scorm2004_error_codes = ErrorCodes.scorm2004;

let clock;
const api = (settings = {}, startingData = {}) => {
  const API = new Scorm2004API(settings);
  API.apiLogLevel = 1;
  if (startingData) {
    API.startingData = startingData;
  }
  return API;
};
const apiInitialized = (startingData) => {
  const API = api();
  API.loadFromJSON(startingData, '');
  API.lmsInitialize();
  return API;
};

describe('SCORM 2004 API Tests', () => {
  before(() => {
    clock = sinon.useFakeTimers();

    const server = new Pretender(() => {
    });
    server.post('/scorm2004', () => {
      return [200, {'Content-Type': 'application/json'}, '{}'];
    }, false);

    server.post('/scorm2004/error', () => {
      return [500, {'Content-Type': 'application/json'}, '{}'];
    }, false);

    server.unhandledRequest = function(verb, path, request) {
      // do nothing
    };
  });

  after(() => {
    clock.restore();
  });

  describe('SetValue()', () => {
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.score.scaled',
      validValues: scorm2004_values.validScaledRange,
      invalidValues: scorm2004_values.invalidScaledRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.score.raw',
      validValues: scorm2004_values.validScoreRange,
      invalidValues: scorm2004_values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.score.min',
      validValues: scorm2004_values.validScoreRange,
      invalidValues: scorm2004_values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: 'cmi.score.max',
      validValues: scorm2004_values.validScoreRange,
      invalidValues: scorm2004_values.invalidScoreRange,
    });
  });

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
      it('should allow cmi.interactions.0.correct_responses.0.pattern to be set - T/F',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'Scene1_Slide3_MultiChoice_0_0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'true-false');
            scorm2004API.setCMIValue(
                'cmi.interactions.0.correct_responses.0.pattern', 'true');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
          });
      it('should allow cmi.interactions.10.correct_responses.0.pattern to be set - T/F',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'Scene1_Slide3_MultiChoice_0_0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'true-false');
            scorm2004API.setCMIValue(
                'cmi.interactions.0.correct_responses.0.pattern', 'true');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
          });
      it('should allow cmi.interactions.0.correct_responses.0.pattern to be set - choice',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'Scene1_Slide3_MultiChoice_0_0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'choice');
            scorm2004API.setCMIValue(
                'cmi.interactions.0.correct_responses.0.pattern',
                'VP_on-call_or_President');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
          });
      it('should allow cmi.interactions.0.correct_responses.0.pattern to be set - choice for SCORM 2004 4th Edition',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'urn:scormdriver:Test_Your_Knowledge.Select_the_ONE_TRUE_answer._0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'choice');
            scorm2004API.setCMIValue(
                'cmi.interactions.0.correct_responses.0.pattern',
                'urn:scormdriver:This%20is%20a%20choice.');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
          });
      it('should allow cmi.interactions.0.objectives.0.id to be set',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.objectives.0.id',
                'ID of the Obj - ID 2');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
          });
      it('should allow cmi.interactions.0.learner_response to be set',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'Scene1_Slide3_MultiChoice_0_0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'choice');
            scorm2004API.setCMIValue('cmi.interactions.0.learner_response',
                'VP_on-call_or_President');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.id'),
            ).to.equal('Scene1_Slide3_MultiChoice_0_0');
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.type'),
            ).to.equal('choice');
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.learner_response'),
            ).to.equal('VP_on-call_or_President');
          });
      it('should allow cmi.interactions.0.learner_response to be set for SCORM 2004 4th Edition',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'urn:scormdriver:Test_Your_Knowledge.Select_the_ONE_TRUE_answer._0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'choice');
            scorm2004API.setCMIValue('cmi.interactions.0.learner_response',
                'urn:scormdriver:This%20is%20an%20incorrect%20response.');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.id'),
            ).to.equal('urn:scormdriver:Test_Your_Knowledge.Select_the_ONE_TRUE_answer._0');
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.type'),
            ).to.equal('choice');
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.learner_response'),
            ).to.equal('urn:scormdriver:This%20is%20an%20incorrect%20response.');
          });
      it('should allow `long-fill-in` cmi.interactions.0.learner_response to be set to 4000 characters',
          () => {
            const scorm2004API = apiInitialized();
            scorm2004API.setCMIValue('cmi.interactions.0.id',
                'Scene1_Slide3_MultiChoice_0_0');
            scorm2004API.setCMIValue('cmi.interactions.0.type', 'long-fill-in');
            scorm2004API.setCMIValue('cmi.interactions.0.learner_response',
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et sodales purus, in aliquam ex. Nunc suscipit interdum tortor ut hendrerit. Donec auctor erat suscipit justo hendrerit, at lacinia ipsum ullamcorper. Cras sollicitudin vestibulum malesuada. Sed non nibh pharetra, suscipit ipsum sed, maximus tortor. Morbi pharetra accumsan turpis id fringilla. In volutpat metus a dui semper, nec tincidunt nibh aliquam. Praesent viverra neque in elementum commodo. Integer hendrerit placerat ante, ac finibus urna tincidunt at. Phasellus consectetur mauris vitae orci viverra luctus. Proin vestibulum blandit mauris quis pellentesque. Proin volutpat hendrerit nisi. Etiam pellentesque urna nec massa congue ultricies. Mauris at eros viverra, posuere tortor id, elementum nisi. In hac habitasse platea dictumst. Pellentesque semper tristique arcu, in tristique metus. Vestibulum ut lacus dui. Aenean mattis malesuada arcu non ullamcorper. Suspendisse tincidunt euismod tincidunt. In tincidunt at nunc rhoncus vehicula. Quisque nulla massa, vestibulum nec laoreet sit amet, posuere eu massa. Donec accumsan efficitur turpis, quis eleifend odio aliquam a. Phasellus placerat ante id dui consectetur dictum. Morbi aliquam, nibh id elementum suscipit, neque ante scelerisque velit, at feugiat turpis odio ac ligula. Phasellus vel urna nulla. Donec vulputate nulla vel purus pellentesque gravida. Vestibulum rutrum, est vel cursus ultrices, orci arcu scelerisque magna, id facilisis mauris arcu ut turpis. Vestibulum consectetur faucibus ante, eu posuere quam ornare et. Aenean vitae dictum neque. Donec nisl justo, porta a sapien quis, luctus congue diam. Integer id metus dolor. Maecenas euismod vulputate leo in lobortis. Vestibulum dignissim finibus est, sed sollicitudin ipsum hendrerit ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque diam lorem, mattis vel orci interdum, tempor luctus elit. Ut id porta nisi. In dignissim quam urna, et iaculis lectus eleifend ut. Nam vitae felis ac risus tincidunt elementum. Nunc hendrerit augue a nulla hendrerit rutrum. Integer euismod est at orci eleifend, sed laoreet justo auctor. Sed sem orci, imperdiet at erat non, vehicula convallis libero. Aenean hendrerit cursus leo ut malesuada. Donec eu placerat lorem. Sed mattis tristique lorem, eget placerat erat scelerisque faucibus. Vivamus eleifend in augue id mollis. Nulla vehicula, metus eu auctor accumsan, lectus sapien pretium dui, non scelerisque magna augue a sem. Suspendisse sem enim, mattis ac augue non, placerat accumsan sem. Vivamus hendrerit, sapien sit amet consectetur pulvinar, ante nisl pulvinar purus, a ullamcorper dolor leo id arcu. Aliquam sed metus arcu. Quisque erat libero, tincidunt non dictum vel, bibendum ut ante. Nunc vel imperdiet risus. Sed sit amet porta enim. Mauris metus tortor, mattis vitae convallis vitae, dictum nec dui. Aliquam volutpat nisi consequat, gravida tellus eget, cursus purus. Nunc at venenatis enim. Proin dictum, magna ultrices tempor aliquam, metus lacus consectetur odio, quis pharetra massa est at est. Nullam non nibh massa. Duis scelerisque massa a luctus vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec tortor lacus, consequat eget neque sit amet, imperdiet porttitor felis. Duis ante erat, cursus sed venenatis nec, semper sollicitudin felis. Sed tincidunt et tortor quis vehicula. Morbi porta dapibus quam quis iaculis. Nunc mauris dolor, rutrum non pellentesque consectetur, ornare quis lacus. Maecenas eget feugiat odio. Proin vitae magna ut justo bibendum lacinia consequat at orci. Phasellus tincidunt lorem eu justo mollis sagittis. Maecenas fermentum nunc augue, et bibendum augue varius venenatis. Donec eu purus at tellus ullamcorper imperdiet. Duis id orci laoreet, semper eros et, tincidunt nisl. Suspendisse vehicula sed enim ut dignissim. Nam ornare leo eu nibh malesuada, eget ullamcorper sapien egestas. In at commod');
            expect(
                String(scorm2004API.lmsGetLastError()),
            ).to.equal(String(0));
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.id'),
            ).to.equal('Scene1_Slide3_MultiChoice_0_0');
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.type'),
            ).to.equal('long-fill-in');
            expect(
                scorm2004API.getCMIValue('cmi.interactions.0.learner_response'),
            ).to.equal(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et sodales purus, in aliquam ex. Nunc suscipit interdum tortor ut hendrerit. Donec auctor erat suscipit justo hendrerit, at lacinia ipsum ullamcorper. Cras sollicitudin vestibulum malesuada. Sed non nibh pharetra, suscipit ipsum sed, maximus tortor. Morbi pharetra accumsan turpis id fringilla. In volutpat metus a dui semper, nec tincidunt nibh aliquam. Praesent viverra neque in elementum commodo. Integer hendrerit placerat ante, ac finibus urna tincidunt at. Phasellus consectetur mauris vitae orci viverra luctus. Proin vestibulum blandit mauris quis pellentesque. Proin volutpat hendrerit nisi. Etiam pellentesque urna nec massa congue ultricies. Mauris at eros viverra, posuere tortor id, elementum nisi. In hac habitasse platea dictumst. Pellentesque semper tristique arcu, in tristique metus. Vestibulum ut lacus dui. Aenean mattis malesuada arcu non ullamcorper. Suspendisse tincidunt euismod tincidunt. In tincidunt at nunc rhoncus vehicula. Quisque nulla massa, vestibulum nec laoreet sit amet, posuere eu massa. Donec accumsan efficitur turpis, quis eleifend odio aliquam a. Phasellus placerat ante id dui consectetur dictum. Morbi aliquam, nibh id elementum suscipit, neque ante scelerisque velit, at feugiat turpis odio ac ligula. Phasellus vel urna nulla. Donec vulputate nulla vel purus pellentesque gravida. Vestibulum rutrum, est vel cursus ultrices, orci arcu scelerisque magna, id facilisis mauris arcu ut turpis. Vestibulum consectetur faucibus ante, eu posuere quam ornare et. Aenean vitae dictum neque. Donec nisl justo, porta a sapien quis, luctus congue diam. Integer id metus dolor. Maecenas euismod vulputate leo in lobortis. Vestibulum dignissim finibus est, sed sollicitudin ipsum hendrerit ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque diam lorem, mattis vel orci interdum, tempor luctus elit. Ut id porta nisi. In dignissim quam urna, et iaculis lectus eleifend ut. Nam vitae felis ac risus tincidunt elementum. Nunc hendrerit augue a nulla hendrerit rutrum. Integer euismod est at orci eleifend, sed laoreet justo auctor. Sed sem orci, imperdiet at erat non, vehicula convallis libero. Aenean hendrerit cursus leo ut malesuada. Donec eu placerat lorem. Sed mattis tristique lorem, eget placerat erat scelerisque faucibus. Vivamus eleifend in augue id mollis. Nulla vehicula, metus eu auctor accumsan, lectus sapien pretium dui, non scelerisque magna augue a sem. Suspendisse sem enim, mattis ac augue non, placerat accumsan sem. Vivamus hendrerit, sapien sit amet consectetur pulvinar, ante nisl pulvinar purus, a ullamcorper dolor leo id arcu. Aliquam sed metus arcu. Quisque erat libero, tincidunt non dictum vel, bibendum ut ante. Nunc vel imperdiet risus. Sed sit amet porta enim. Mauris metus tortor, mattis vitae convallis vitae, dictum nec dui. Aliquam volutpat nisi consequat, gravida tellus eget, cursus purus. Nunc at venenatis enim. Proin dictum, magna ultrices tempor aliquam, metus lacus consectetur odio, quis pharetra massa est at est. Nullam non nibh massa. Duis scelerisque massa a luctus vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec tortor lacus, consequat eget neque sit amet, imperdiet porttitor felis. Duis ante erat, cursus sed venenatis nec, semper sollicitudin felis. Sed tincidunt et tortor quis vehicula. Morbi porta dapibus quam quis iaculis. Nunc mauris dolor, rutrum non pellentesque consectetur, ornare quis lacus. Maecenas eget feugiat odio. Proin vitae magna ut justo bibendum lacinia consequat at orci. Phasellus tincidunt lorem eu justo mollis sagittis. Maecenas fermentum nunc augue, et bibendum augue varius venenatis. Donec eu purus at tellus ullamcorper imperdiet. Duis id orci laoreet, semper eros et, tincidunt nisl. Suspendisse vehicula sed enim ut dignissim. Nam ornare leo eu nibh malesuada, eget ullamcorper sapien egestas. In at commod');
          });
    });

    describe('Initialized - Should Fail', () => {
      h.checkLMSSetValue({
        api: apiInitialized(
            {cmi: {interactions: {'0': {id: 'interaction-id-1'}}}}),
        fieldName: 'cmi.interactions.0.learner_response',
        valueToTest: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et sodales purus, in aliquam ex. Nunc suscipit interdum tortor ut hendrerit. Donec auctor erat suscipit justo hendrerit, at lacinia ipsum ullamcorper. Cras sollicitudin vestibulum malesuada. Sed non nibh pharetra, suscipit ipsum sed, maximus tortor. Morbi pharetra accumsan turpis id fringilla. In volutpat metus a dui semper, nec tincidunt nibh aliquam. Praesent viverra neque in elementum commodo. Integer hendrerit placerat ante, ac finibus urna tincidunt at. Phasellus consectetur mauris vitae orci viverra luctus. Proin vestibulum blandit mauris quis pellentesque. Proin volutpat hendrerit nisi. Etiam pellentesque urna nec massa congue ultricies. Mauris at eros viverra, posuere tortor id, elementum nisi. In hac habitasse platea dictumst. Pellentesque semper tristique arcu, in tristique metus. Vestibulum ut lacus dui. Aenean mattis malesuada arcu non ullamcorper. Suspendisse tincidunt euismod tincidunt. In tincidunt at nunc rhoncus vehicula. Quisque nulla massa, vestibulum nec laoreet sit amet, posuere eu massa. Donec accumsan efficitur turpis, quis eleifend odio aliquam a. Phasellus placerat ante id dui consectetur dictum. Morbi aliquam, nibh id elementum suscipit, neque ante scelerisque velit, at feugiat turpis odio ac ligula. Phasellus vel urna nulla. Donec vulputate nulla vel purus pellentesque gravida. Vestibulum rutrum, est vel cursus ultrices, orci arcu scelerisque magna, id facilisis mauris arcu ut turpis. Vestibulum consectetur faucibus ante, eu posuere quam ornare et. Aenean vitae dictum neque. Donec nisl justo, porta a sapien quis, luctus congue diam. Integer id metus dolor. Maecenas euismod vulputate leo in lobortis. Vestibulum dignissim finibus est, sed sollicitudin ipsum hendrerit ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque diam lorem, mattis vel orci interdum, tempor luctus elit. Ut id porta nisi. In dignissim quam urna, et iaculis lectus eleifend ut. Nam vitae felis ac risus tincidunt elementum. Nunc hendrerit augue a nulla hendrerit rutrum. Integer euismod est at orci eleifend, sed laoreet justo auctor. Sed sem orci, imperdiet at erat non, vehicula convallis libero. Aenean hendrerit cursus leo ut malesuada. Donec eu placerat lorem. Sed mattis tristique lorem, eget placerat erat scelerisque faucibus. Vivamus eleifend in augue id mollis. Nulla vehicula, metus eu auctor accumsan, lectus sapien pretium dui, non scelerisque magna augue a sem. Suspendisse sem enim, mattis ac augue non, placerat accumsan sem. Vivamus hendrerit, sapien sit amet consectetur pulvinar, ante nisl pulvinar purus, a ullamcorper dolor leo id arcu. Aliquam sed metus arcu. Quisque erat libero, tincidunt non dictum vel, bibendum ut ante. Nunc vel imperdiet risus. Sed sit amet porta enim. Mauris metus tortor, mattis vitae convallis vitae, dictum nec dui. Aliquam volutpat nisi consequat, gravida tellus eget, cursus purus. Nunc at venenatis enim. Proin dictum, magna ultrices tempor aliquam, metus lacus consectetur odio, quis pharetra massa est at est. Nullam non nibh massa. Duis scelerisque massa a luctus vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec tortor lacus, consequat eget neque sit amet, imperdiet porttitor felis. Duis ante erat, cursus sed venenatis nec, semper sollicitudin felis. Sed tincidunt et tortor quis vehicula. Morbi porta dapibus quam quis iaculis. Nunc mauris dolor, rutrum non pellentesque consectetur, ornare quis lacus. Maecenas eget feugiat odio. Proin vitae magna ut justo bibendum lacinia consequat at orci. Phasellus tincidunt lorem eu justo mollis sagittis. Maecenas fermentum nunc augue, et bibendum augue varius venenatis. Donec eu purus at tellus ullamcorper imperdiet. Duis id orci laoreet, semper eros et, tincidunt nisl. Suspendisse vehicula sed enim ut dignissim. Nam ornare leo eu nibh malesuada, eget ullamcorper sapien egestas. In at commod1',
        errorThrown: false,
        expectedError: scorm2004_error_codes.TYPE_MISMATCH,
      });
      h.checkLMSSetValue({
        api: apiInitialized(
            {
              cmi: {
                interactions: {
                  '0': {
                    id: 'interaction-id-1',
                    type: 'long-fill-in',
                  },
                },
              },
            }),
        fieldName: 'cmi.interactions.0.type',
        valueToTest: 'unknown',
        errorThrown: false,
        expectedError: scorm2004_error_codes.TYPE_MISMATCH,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.type',
        valueToTest: 'true-false',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.description',
        valueToTest: 'this is an interaction',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.timestamp',
        valueToTest: 'PT1S',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.weighting',
        valueToTest: 1.0,
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.learner_response',
        valueToTest: 'true',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.interactions.0.latency',
        valueToTest: 'PT1S',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.objectives.0.success_status',
        valueToTest: 'passed',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.objectives.0.completion_status',
        valueToTest: 'completed',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.objectives.0.progress_measure',
        valueToTest: 1.0,
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.objectives.0.description',
        valueToTest: 'this is an objective',
        errorThrown: false,
        expectedError: scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      });
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
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: 'cmi.unknown',
        valueToTest: 'uknown',
        errorThrown: false,
        expectedError: scorm2004_error_codes.UNDEFINED_DATA_MODEL,
      });
    });
  });

  describe('loadFromFlattenedJSON()', () => {
    it('should load data, even if out of order',
        () => {
          const scorm2004API = api();
          scorm2004API.loadFromFlattenedJSON({
            'cmi.learner_id': '123',
            'cmi.learner_name': 'Bob The Builder',
            'cmi.suspend_data': 'viewed=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31|lastviewedslide=31|7#1##,3,3,3,7,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11#0#b5e89fbb-7cfb-46f0-a7cb-758165d3fe7e=236~262~2542812732762722742772682802752822882852892872832862962931000~3579~32590001001010101010101010101001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001010010010010010010010010011010010010010010010010010010010010112101021000171000~236a71d398e-4023-4967-88fe-1af18721422d06passed6failed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000105wrong110000000000000000000000000000000000~3185000000000000000000000000000000000000000000000000000000000000000000000000000000000~283~2191w11~21113101w41689~256~2100723031840~21007230314509062302670~2110723031061120000000000000000000~240~234531618~21601011000100000002814169400,#-1',
            'cmi.interactions.0.timestamp': '2018-08-26T11:05:21',
            'cmi.interactions.0.weighting': '1',
            'cmi.interactions.0.learner_response': 'HTH',
            'cmi.interactions.0.id': 'Question14_1',
            'cmi.interactions.0.type': 'choice',
            'cmi.interactions.0.result': 'incorrect',
            'cmi.interactions.0.latency': 'PT2M30S',
            'cmi.interactions.0.objectives.0.id': 'Question14_1',
            'cmi.interactions.0.objectives.0.correct_responses.0.pattern': 'CPR',
          }, '');
          scorm2004API.lmsInitialize();
          expect(scorm2004API.lmsGetValue('cmi.interactions.0.id')).to.eq('Question14_1');
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
              cmiExport.cmi.total_time,
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

  describe('Event Handlers', () => {
    it('Should handle SetValue.cmi.learner_id event',
        () => {
          const scorm2004API = apiInitialized();
          const callback = sinon.spy();
          scorm2004API.on('SetValue.cmi.learner_id', callback);
          scorm2004API.lmsSetValue('cmi.learner_id', '@jcputney');
          expect(callback.called).to.be.true;
        });
    it('Should handle SetValue.cmi.* event',
        () => {
          const scorm2004API = apiInitialized();
          const callback = sinon.spy();
          scorm2004API.on('SetValue.cmi.*', callback);
          scorm2004API.lmsSetValue('cmi.learner_id', '@jcputney');
          expect(callback.called).to.be.true;
        });
    it('Should handle CommitSuccess event',
        () => {
          const scorm2004API = api({
            lmsCommitUrl: '/scorm2004',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm2004API.lmsInitialize();

          const callback = sinon.spy();
          scorm2004API.on('CommitSuccess', callback);

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.called).to.be.true;
        });
    it('Should clear all event listeners for CommitSuccess',
        () => {
          const scorm2004API = api({
            lmsCommitUrl: '/scorm2004',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm2004API.lmsInitialize();

          const callback = sinon.spy();
          const callback2 = sinon.spy();
          scorm2004API.on('CommitSuccess', callback);
          scorm2004API.on('CommitSuccess', callback2);

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.calledOnce).to.be.true;
          expect(callback2.calledOnce).to.be.true;

          scorm2004API.clear('CommitSuccess');

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.calledTwice).to.be.false;
          expect(callback2.calledTwice).to.be.false;
        });
    it('Should clear only the specific event listener for CommitSuccess',
        () => {
          const scorm2004API = api({
            lmsCommitUrl: '/scorm2004',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm2004API.lmsInitialize();

          const callback = sinon.spy(() => 1);
          const callback2 = sinon.spy(() => 2);
          const callback3 = sinon.spy(() => 3);
          const callback4 = sinon.spy(() => 4);
          scorm2004API.on('CommitSuccess', callback);
          scorm2004API.on('CommitSuccess', callback2);
          scorm2004API.on('Commit', callback3);
          scorm2004API.on('SetValue', callback4);

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.calledOnce).to.be.true;
          expect(callback2.calledOnce).to.be.true;
          expect(callback3.calledOnce).to.be.true;
          expect(callback4.calledOnce).to.be.true;

          scorm2004API.off('CommitSuccess', callback);

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.calledTwice).to.be.false; // removed callback should not be called a second time
          expect(callback2.calledTwice).to.be.true;
          expect(callback3.calledTwice).to.be.true;
          expect(callback4.calledTwice).to.be.true;
        });
    it('Should handle CommitError event',
        () => {
          const scorm2004API = api({
            lmsCommitUrl: '/scorm2004/error',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm2004API.lmsInitialize();

          const callback = sinon.spy();
          scorm2004API.on('CommitError', callback);

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.called).to.be.true;
        });
    it('Should handle CommitError event when offline',
        () => {
          const scorm2004API = api({
            lmsCommitUrl: '/scorm2004/does_not_exist',
            autocommit: true,
            autocommitSeconds: 1,
          });
          scorm2004API.lmsInitialize();

          const callback = sinon.spy();
          scorm2004API.on('CommitError', callback);

          scorm2004API.lmsSetValue('cmi.session_time', 'PT1M0S');
          clock.tick(2000);
          expect(callback.called).to.be.true;
        });
  });
});
