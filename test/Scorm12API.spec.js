import {expect} from 'chai';
import {describe, it} from 'mocha';
import Scorm12API from '../src/Scorm12API';
import * as h from './api_helpers';
import {scorm12_error_codes} from '../src/constants/error_codes';

describe('SCORM 1.2 API Tests', () => {
  describe('Pre-Initialization', () => {
    describe('LMSSetValue', () => {
      const api = () => {
        const API = new Scorm12API();
        API.apiLogLevel = 1;
        return API;
      };
      const apiInitialized = () => {
        const API = api();
        API.lmsInitialize();
        return API;
      };

      describe('Should throw errors', () => {
        h.checkWrite({
          api: api(),
          fieldName: 'cmi.objectives.0.id',
          expectedError: scorm12_error_codes.STORE_BEFORE_INIT,
        });
        h.checkWrite({
          api: api(),
          fieldName: 'cmi.interactions.0.id',
          expectedError: scorm12_error_codes.STORE_BEFORE_INIT,
        });
      });

      describe('Should succeed', () => {
        h.checkWrite({
          api: apiInitialized(),
          fieldName: 'cmi.objectives.0.id',
          valueToTest: 'AAA',
        });
        h.checkWrite({
          api: apiInitialized(),
          fieldName: 'cmi.interactions.0.id',
          valueToTest: 'AAA',
        });
      });
    });
  });
});
