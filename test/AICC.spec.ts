import { expect } from "expect";
import { describe, it } from "mocha";
import * as h from "./api_helpers";
import { scorm12_errors } from "../src/constants/error_codes";
import { AICC } from "../src/AICC";
import { DefaultSettings } from "../src/constants/default_settings";
import * as sinon from "sinon";
import { CMITries } from "../src/cmi/aicc/tries";
import { CMIInteractions } from "../src/cmi/scorm12/interactions";
import { RefObject, Settings } from "../src/types/api_types";

const api = (settings?: Settings, startingData: RefObject = {}) => {
  const API = new AICC(settings);
  API.apiLogLevel = 1;
  if (startingData) {
    API.startingData = startingData;
  }
  return API;
};
const apiInitialized = (startingData?: RefObject) => {
  const API = api();
  API.loadFromJSON(startingData ? startingData : {}, "");
  API.lmsInitialize();
  return API;
};

describe("AICC API Tests", () => {
  describe("setCMIValue()", () => {
    describe("Invalid Sets - Should Always Fail", () => {
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi._version",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi._children",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.core._children",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.core.score._children",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives._children",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives._count",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions._children",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions._count",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions.0.objectives._count",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions.0.correct_responses._count",
        expectedError: scorm12_errors.INVALID_SET_VALUE,
      });
    });

    describe("Invalid Sets - Should Fail After Initialization", () => {
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.launch_data",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.student_id",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.student_name",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.credit",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.entry",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.total_time",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.lesson_mode",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.mastery_score",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.max_time_allowed",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.time_limit_action",
        expectedError: scorm12_errors.READ_ONLY_ELEMENT,
      });
    });
  });

  describe("LMSGetValue()", () => {
    describe("Invalid Properties - Should Always Fail", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.close",
        expectedError: scorm12_errors.GENERAL,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.exit",
        expectedError: scorm12_errors.GENERAL,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.entry",
        expectedError: scorm12_errors.GENERAL,
        errorThrown: false,
      });
    });

    describe("Write-Only Properties - Should Always Fail", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.exit",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.session_time",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.id",
        initializeFirst: true,
        initializationValue: "AAA",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.time",
        initializeFirst: true,
        initializationValue: "12:59:59",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.type",
        initializeFirst: true,
        initializationValue: "true-false",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.weighting",
        initializeFirst: true,
        initializationValue: "0",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.student_response",
        initializeFirst: true,
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.result",
        initializeFirst: true,
        initializationValue: "correct",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.latency",
        initializeFirst: true,
        initializationValue: "01:59:59.99",
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.correct_responses.0.pattern",
        initializeFirst: true,
        expectedError: scorm12_errors.WRITE_ONLY_ELEMENT,
      });
    });
  });

  describe("LMSSetValue()", () => {
    describe("Uninitialized - Should Fail", () => {
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.objectives.0.id",
        expectedError: scorm12_errors.STORE_BEFORE_INIT,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.interactions.0.id",
        expectedError: scorm12_errors.STORE_BEFORE_INIT,
      });
    });

    describe("Initialized - Should Succeed", () => {
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.objectives.0.id",
        valueToTest: "AAA",
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.id",
        valueToTest: "AAA",
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.evaluation.comments.0.content",
        valueToTest: "AAA",
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.tries.0.score.max",
        valueToTest: "100",
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.attempt_records.0.score.max",
        valueToTest: "100",
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.paths.0.location_id",
        valueToTest: "xyz",
      });
    });
  });

  describe("reset()", () => {
    it("should reset all CMI values to their default state", () => {
      const aiccAPI = api();
      aiccAPI.cmi.core.student_id = "student_1";
      aiccAPI.lmsInitialize();

      aiccAPI.cmi.core.session_time = "01:00:00";
      aiccAPI.setCMIValue("cmi.student_data.tries.0.score.max", "99");

      aiccAPI.reset();
      expect(aiccAPI.cmi.interactions).toEqual(new CMIInteractions());
      expect(aiccAPI.cmi.core.student_id).toEqual("student_1");
      expect(aiccAPI.getCMIValue("cmi.student_data.tries")).toEqual(
        new CMITries(),
      );
    });

    it("should keep original settings", () => {
      const aiccAPI = api({
        dataCommitFormat: "flattened",
        autocommit: true,
      });

      aiccAPI.reset();

      expect(aiccAPI.settings.sendFullCommit).toEqual(
        DefaultSettings.sendFullCommit,
      );
      expect(aiccAPI.settings.dataCommitFormat).toEqual("flattened");
      expect(aiccAPI.settings.autocommit).toEqual(true);
    });

    it("should be able to override original settings", () => {
      const aiccAPI = api({
        ...DefaultSettings,
        dataCommitFormat: "flattened",
        autocommit: true,
      });

      aiccAPI.reset({
        alwaysSendTotalTime: !DefaultSettings.alwaysSendTotalTime,
      });

      expect(aiccAPI.settings.sendFullCommit).toEqual(
        DefaultSettings.sendFullCommit,
      );
      expect(aiccAPI.settings.dataCommitFormat).toEqual("flattened");
      expect(aiccAPI.settings.autocommit).toEqual(true);
      expect(aiccAPI.settings.alwaysSendTotalTime).toEqual(
        !DefaultSettings.alwaysSendTotalTime,
      );
    });

    it("should call commonReset from the superclass", () => {
      const aiccAPI = api();
      const commonResetSpy = sinon.spy(aiccAPI, "commonReset");

      aiccAPI.reset();

      expect(commonResetSpy.calledOnce).toBe(true);
      commonResetSpy.restore();
    });
  });

  describe("replaceWithAnotherScormAPI()", () => {
    const firstAPI = api();
    const secondAPI = api();

    firstAPI.cmi.core.student_id = "student_1";
    secondAPI.cmi.core.student_id = "student_2";

    firstAPI.replaceWithAnotherScormAPI(secondAPI);
    expect(firstAPI.cmi.core.student_id).toEqual("student_2");
  });
});
