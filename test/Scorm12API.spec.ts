import { expect } from "expect";
import { after, before, describe, it } from "mocha";
import { Scorm12API } from "../src/Scorm12API";
import * as h from "./api_helpers";
import { scorm12_errors } from "../src/constants/error_codes";
import { scorm12Values } from "./field_values";
import * as sinon from "sinon";
import Pretender from "fetch-pretender";
import { RefObject, Settings } from "../src/types/api_types";
import { DefaultSettings } from "../src/constants/default_settings";

let clock: sinon.SinonFakeTimers;
const api = (settings?: Settings, startingData: RefObject = {}) => {
  const API = new Scorm12API(settings);
  API.apiLogLevel = 5;
  API.startingData = startingData;
  return API;
};
const apiInitialized = (settings?: Settings, startingData: RefObject = {}) => {
  const API = api(settings);
  API.loadFromJSON(startingData ? startingData : {});
  API.lmsInitialize();
  return API;
};

describe("SCORM 1.2 API Tests", () => {
  before(() => {
    clock = sinon.useFakeTimers();

    const server = new Pretender();
    server.post(
      "/scorm12",
      () => {
        return [200, { "Content-Type": "application/json" }, "{}"];
      },
      false,
    );

    server.post(
      "/scorm12/error",
      () => {
        return [500, { "Content-Type": "application/json" }, "{}"];
      },
      false,
    );
  });

  after(() => {
    clock.restore();
  });

  describe("loadFromJSON()", () => {
    it("should load JSON data into the CMI object", () => {
      const scorm12API = api();
      const jsonData = {
        cmi: {
          core: {
            student_id: "student_1",
            student_name: "John Doe",
            lesson_status: "incomplete",
          },
        },
      };

      scorm12API.loadFromJSON(jsonData);
      scorm12API.lmsInitialize();

      expect(scorm12API.cmi.core.student_id).toEqual("student_1");
      expect(scorm12API.cmi.core.student_name).toEqual("John Doe");
      expect(scorm12API.cmi.core.lesson_status).toEqual("incomplete");
    });

    it("should load nested JSON data into the CMI object", () => {
      const scorm12API = api();
      const jsonData = {
        cmi: {
          objectives: {
            "0": {
              id: "obj_1",
              score: {
                raw: "85",
                min: "0",
                max: "100",
              },
            },
          },
        },
      };

      scorm12API.loadFromJSON(jsonData);

      expect(scorm12API.cmi.objectives.childArray[0].id).toEqual("obj_1");
      expect(scorm12API.cmi.objectives.childArray[0].score.raw).toEqual("85");
      expect(scorm12API.cmi.objectives.childArray[0].score.min).toEqual("0");
      expect(scorm12API.cmi.objectives.childArray[0].score.max).toEqual("100");
    });

    it("should load nested cmi JSON data into the CMI object", () => {
      const scorm12API = api();
      const jsonData = {
        objectives: {
          "0": {
            id: "obj_1",
            score: {
              raw: "85",
              min: "0",
              max: "100",
            },
          },
        },
      };

      scorm12API.loadFromJSON(jsonData, "cmi");

      expect(scorm12API.cmi.objectives.childArray[0].id).toEqual("obj_1");
      expect(scorm12API.cmi.objectives.childArray[0].score.raw).toEqual("85");
      expect(scorm12API.cmi.objectives.childArray[0].score.min).toEqual("0");
      expect(scorm12API.cmi.objectives.childArray[0].score.max).toEqual("100");
    });

    it("should load nested JSON data into the CMI object in a backwards compatible way with v1", () => {
      const scorm12API = api();
      const jsonData = {
        objectives: {
          "0": {
            id: "obj_1",
            score: {
              raw: "85",
              min: "0",
              max: "100",
            },
          },
        },
      };

      scorm12API.loadFromJSON(jsonData);

      expect(scorm12API.cmi.objectives.childArray[0].id).toEqual("obj_1");
      expect(scorm12API.cmi.objectives.childArray[0].score.raw).toEqual("85");
      expect(scorm12API.cmi.objectives.childArray[0].score.min).toEqual("0");
      expect(scorm12API.cmi.objectives.childArray[0].score.max).toEqual("100");
    });

    it("should handle empty JSON data", () => {
      const scorm12API = api();
      const jsonData = {};

      scorm12API.loadFromJSON(jsonData);

      expect(scorm12API.cmi.core.student_id).toBeFalsy();
      expect(scorm12API.cmi.core.student_name).toBeFalsy();
      expect(scorm12API.cmi.core.lesson_status).toBe("not attempted");
    });

    it("should not load data if API is initialized", () => {
      const scorm12API = apiInitialized();
      const jsonData = {
        cmi: {
          core: {
            student_id: "student_1",
            student_name: "John Doe",
            lesson_status: "incomplete",
          },
        },
      };

      scorm12API.loadFromJSON(jsonData);

      expect(scorm12API.cmi.core.student_id).toBeFalsy();
      expect(scorm12API.cmi.core.student_name).toBeFalsy();
      expect(scorm12API.cmi.core.lesson_status).toBe("not attempted");
    });
  });

  describe("LMSSetValue()", () => {
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.core.score.raw",
      validValues: scorm12Values.validScoreRange,
      invalidValues: scorm12Values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.core.score.min",
      validValues: scorm12Values.validScoreRange,
      invalidValues: scorm12Values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.core.score.max",
      validValues: scorm12Values.validScoreRange,
      invalidValues: scorm12Values.invalidScoreRange,
    });
  });

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

    describe("Read and Write Properties - Should Success", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.objectives.0.id",
        initializeFirst: true,
        initializationValue: "AAA",
        expectedValue: "AAA",
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
        initializationValue: "AAA",
        expectedValue: "AAA",
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
        fieldName: "cmi.interactions.0.objectives.0.id",
        valueToTest: "AAA",
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.10.correct_responses.0.pattern",
        valueToTest: "t",
      });
    });
  });

  describe("replaceWithAnotherScormAPI()", () => {
    it("should replace the current API with another API", () => {
      const firstAPI = api();
      const secondAPI = api();

      firstAPI.cmi.core.student_id = "student_1";
      secondAPI.cmi.core.student_id = "student_2";

      firstAPI.replaceWithAnotherScormAPI(secondAPI);
      expect(firstAPI.cmi.core.student_id).toEqual("student_2");
    });
  });

  describe("renderCommitCMI()", () => {
    it("should calculate total time when terminateCommit passed", () => {
      const scorm12API = api();
      scorm12API.cmi.core.total_time = "12:34:56";
      scorm12API.cmi.core.session_time = "23:59:59";
      const cmiExport: RefObject = scorm12API.renderCommitCMI(true);
      expect(cmiExport.cmi.core.total_time).toEqual("36:34:55");
    });
    it("if the user passes, should calculate total time when terminateCommit passed", () => {
      const scorm12API = api();
      scorm12API.cmi.core.score.max = "100";
      scorm12API.cmi.core.score.min = "0";
      scorm12API.cmi.core.score.raw = "100";
      scorm12API.cmi.core.exit = "suspend";
      scorm12API.cmi.core.lesson_status = "completed";
      scorm12API.cmi.core.total_time = "0000:00:00";
      scorm12API.cmi.core.session_time = "23:59:59";
      const cmiExport: RefObject = scorm12API.renderCommitCMI(true);
      expect(cmiExport.cmi.core.total_time).toEqual("23:59:59");
    });
    it("should return flattened format when dataCommitFormat is 'flattened'", function () {
      const scorm12API = api({
        ...DefaultSettings,
        ...{ dataCommitFormat: "flattened" },
      });
      scorm12API.cmi.core.student_id = "student_1";
      scorm12API.cmi.core.student_name = "Student 1";
      scorm12API.cmi.core.lesson_status = "completed";
      scorm12API.cmi.core.score.raw = "100";
      scorm12API.cmi.core.score.max = "100";
      scorm12API.cmi.core.score.min = "0";
      scorm12API.cmi.core.session_time = "23:59:59";
      const cmiExport: RefObject = scorm12API.renderCommitCMI(true);
      expect(cmiExport["cmi.core.student_id"]).toEqual("student_1");
      expect(cmiExport["cmi.core.student_name"]).toEqual("Student 1");
      expect(cmiExport["cmi.core.lesson_status"]).toEqual("completed");
      expect(cmiExport["cmi.core.score.raw"]).toEqual("100");
      expect(cmiExport["cmi.core.score.max"]).toEqual("100");
      expect(cmiExport["cmi.core.score.min"]).toEqual("0");
      expect(cmiExport["cmi.core.session_time"]).toEqual("23:59:59");
    });
    it("should return params format when dataCommitFormat is 'params'", function () {
      const scorm12API = api({
        ...DefaultSettings,
        ...{ dataCommitFormat: "params" },
      });
      scorm12API.cmi.core.student_id = "student_1";
      scorm12API.cmi.core.student_name = "Student 1";
      scorm12API.cmi.core.lesson_status = "completed";
      scorm12API.cmi.core.score.raw = "100";
      scorm12API.cmi.core.score.max = "100";
      scorm12API.cmi.core.score.min = "0";
      scorm12API.cmi.core.session_time = "23:59:59";
      const result = scorm12API.renderCommitCMI(true);
      expect(result).toBeInstanceOf(Array);
      expect(result).toContain("cmi.core.lesson_status=completed");
      expect(result).toContain("cmi.core.score.max=100");
      expect(result).toContain("cmi.core.score.min=0");
      expect(result).toContain("cmi.core.score.raw=100");
      expect(result).toContain("cmi.core.session_time=23:59:59");
      expect(result).toContain("cmi.core.student_id=student_1");
    });
  });

  describe("renderCommitObject()", () => {
    it("should render commit object with default settings and no score", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "incomplete";
      scorm12API.cmi.core.total_time = "12:34:56";
      scorm12API.cmi.core.session_time = "23:59:59";
      const commitObject = scorm12API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual("unknown");
      expect(commitObject.completionStatus).toEqual("incomplete");
      expect(commitObject.runtimeData.cmi.core.lesson_status).toEqual(
        "incomplete",
      );
      expect(commitObject.totalTimeSeconds).toEqual(
        12 * 3600 + 34 * 60 + 56 + (23 * 3600 + 59 * 60 + 59),
      );
      expect(commitObject?.score?.max).toEqual(100);
    });

    it("should render commit object with score data", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "completed";
      scorm12API.cmi.core.score.raw = "85";
      scorm12API.cmi.core.score.min = "0";
      scorm12API.cmi.core.score.max = "100";
      const commitObject = scorm12API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual("unknown");
      expect(commitObject.completionStatus).toEqual("completed");
      expect(commitObject.runtimeData.cmi.core.lesson_status).toEqual(
        "completed",
      );
      expect(commitObject.runtimeData.cmi.core.score.raw).toEqual("85");
      expect(commitObject.runtimeData.cmi.core.score.min).toEqual("0");
      expect(commitObject.runtimeData.cmi.core.score.max).toEqual("100");
      expect(commitObject.totalTimeSeconds).toEqual(0);
      expect(commitObject.score).toEqual({
        raw: 85,
        min: 0,
        max: 100,
      });
    });

    it("should render commit object with completion and success status", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "passed";
      const commitObject = scorm12API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual("passed");
      expect(commitObject.completionStatus).toEqual("completed");
      expect(commitObject.runtimeData.cmi.core.lesson_status).toEqual("passed");
    });

    it("should render commit object with failed success status", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "failed";
      const commitObject = scorm12API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual("failed");
      expect(commitObject.completionStatus).toEqual("incomplete");
      expect(commitObject.runtimeData.cmi.core.lesson_status).toEqual("failed");
    });

    it("should calculate total time when terminateCommit is true", () => {
      const scorm12API = api();
      scorm12API.cmi.core.total_time = "12:34:56";
      scorm12API.cmi.core.session_time = "23:59:59";
      const commitObject = scorm12API.renderCommitObject(true);
      expect(commitObject.runtimeData.cmi.core.total_time).toEqual("36:34:55");
    });
  });

  describe("storeData()", () => {
    it('should set cmi.core.lesson_status to "completed"', () => {
      const scorm12API = api();
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
    });
    it('should set cmi.core.lesson_status to "browsed"', () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_mode = "browse";
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("browsed");
    });
    it('should set cmi.core.lesson_status to "browsed" - Initial Status', () => {
      const scorm12API = api();
      scorm12API.startingData = { cmi: { core: { lesson_status: "" } } };
      scorm12API.cmi.core.lesson_mode = "browse";
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("browsed");
    });
    it('should set cmi.core.lesson_status to "passed" - mastery_override: true', () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{ mastery_override: true },
      });
      scorm12API.cmi.core.credit = "credit";
      scorm12API.cmi.student_data.mastery_score = "60.0";
      scorm12API.cmi.core.score.raw = "75.0";
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("passed");
    });
    it('should set cmi.core.lesson_status to "failed" - mastery_override: true', () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{ mastery_override: true },
      });
      scorm12API.cmi.core.credit = "credit";
      scorm12API.cmi.student_data.mastery_score = "60.0";
      scorm12API.cmi.core.score.raw = "55.0";
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("failed");
    });
    it('should set cmi.core.lesson_status to "passed" - mastery_override: false', () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{ mastery_override: false },
      });
      scorm12API.cmi.core.lesson_status = "failed"; // module author wanted the user to pass, so we don't override
      scorm12API.cmi.core.credit = "credit";
      scorm12API.cmi.student_data.mastery_score = "60.0";
      scorm12API.cmi.core.score.raw = "75.0";
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("failed");
    });
    it('should set cmi.core.lesson_status to "failed" - mastery_override: false', () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{ mastery_override: false },
      });
      scorm12API.cmi.core.lesson_status = "passed"; // module author wanted the user to pass, so we don't override
      scorm12API.cmi.core.credit = "credit";
      scorm12API.cmi.student_data.mastery_score = "60.0";
      scorm12API.cmi.core.score.raw = "55.0";
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("passed");
    });
  });

  describe("LMSCommit Debounce Tests", () => {
    it("should debounce LMSCommit calls when autocommit is true", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        autocommit: true,
        autocommitSeconds: 1,
      });
      scorm12API.lmsInitialize();

      const commitSpy = sinon.spy(scorm12API, "commit");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      scorm12API.lmsSetValue("cmi.core.session_time", "00:02:00");
      scorm12API.lmsSetValue("cmi.core.session_time", "00:03:00");

      clock.tick(2000);
      await clock.runAllAsync();

      expect(commitSpy.calledOnce).toBe(true);
    });

    it("should call LMSCommit only once within the debounce period ", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        asyncCommit: true,
        autocommit: true,
      });
      scorm12API.lmsInitialize();

      const commitSpy = sinon.spy(scorm12API, "commit");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");

      scorm12API.lmsCommit();
      clock.tick(100);

      scorm12API.lmsCommit();
      clock.tick(100);

      scorm12API.lmsCommit();
      clock.tick(100);

      clock.tick(1000);
      await clock.runAllAsync();

      expect(commitSpy.calledOnce).toBe(true);
    });

    it("should call LMSCommit multiple times if debounce period is exceeded", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        autocommit: true,
        autocommitSeconds: 1,
      });
      scorm12API.lmsInitialize();

      const commitSpy = sinon.spy(scorm12API, "commit");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);
      scorm12API.lmsSetValue("cmi.core.session_time", "00:02:00");
      clock.tick(2000);
      scorm12API.lmsSetValue("cmi.core.session_time", "00:03:00");

      clock.tick(2000);
      await clock.runAllAsync();

      expect(commitSpy.calledThrice).toBe(true);
    });
  });

  describe("Event Handlers", () => {
    it("Should handle SetValue.cmi.core.student_name event", () => {
      const scorm12API = apiInitialized();
      const callback = sinon.spy();
      scorm12API.on("LMSSetValue.cmi.core.student_name", callback);
      scorm12API.lmsSetValue("cmi.core.student_name", "@jcputney");
      expect(callback.called).toBe(true);
    });
    it("Should handle SetValue.cmi.* event", () => {
      const scorm12API = apiInitialized();
      const callback = sinon.spy();
      scorm12API.on("LMSSetValue.cmi.*", callback);
      scorm12API.lmsSetValue("cmi.core.student_name", "@jcputney");
      expect(callback.called).toBe(true);
    });
    it("Should handle CommitSuccess event", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm12API.lmsInitialize();

      const callback = sinon.spy();
      scorm12API.on("CommitSuccess", callback);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.called).toBe(true);
    });
    it("Should clear all event listeners for CommitSuccess", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm12API.lmsInitialize();

      const callback = sinon.spy();
      const callback2 = sinon.spy();
      scorm12API.on("CommitSuccess", callback);
      scorm12API.on("CommitSuccess", callback2);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.calledOnce).toBe(true);
      expect(callback2.calledOnce).toBe(true);

      scorm12API.clear("CommitSuccess");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.calledTwice).toBe(false);
      expect(callback2.calledTwice).toBe(false);
    });
    it("Should clear only the specific event listener for CommitSuccess", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm12API.lmsInitialize();

      const callback = sinon.spy(() => 1);
      const callback2 = sinon.spy(() => 2);
      const callback3 = sinon.spy(() => 3);
      const callback4 = sinon.spy(() => 4);
      scorm12API.on("CommitSuccess", callback);
      scorm12API.on("CommitSuccess", callback2);
      scorm12API.on("LMSCommit", callback3);
      scorm12API.on("LMSSetValue", callback4);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.calledOnce).toBe(true);
      expect(callback2.calledOnce).toBe(true);
      expect(callback3.calledOnce).toBe(true);
      expect(callback4.calledOnce).toBe(true);

      scorm12API.off("CommitSuccess", callback);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.calledTwice).toBe(false); // removed callback should not be called a second time
      expect(callback2.calledTwice).toBe(true);
      expect(callback3.calledTwice).toBe(true);
      expect(callback4.calledTwice).toBe(true);
    });

    it("Should handle multiple events in one listener string", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm12API.lmsInitialize();

      const callback = sinon.spy();
      scorm12API.on("LMSSetValue.cmi.core.session_time CommitSuccess", callback);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.calledTwice).toBe(true);
    });

    it("Should detach multiple events using off()", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm12API.lmsInitialize();

      const callback = sinon.spy();
      scorm12API.on("LMSSetValue.cmi.core.session_time CommitSuccess", callback);
      scorm12API.off("LMSSetValue.cmi.core.session_time CommitSuccess", callback);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.called).toBe(false);
    });
    it("Should handle CommitError event", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12/error",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm12API.lmsInitialize();

      const callback = sinon.spy();
      scorm12API.on("CommitError", callback);

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.called).toBe(true);
    });
    it("Should handle CommitError event when offline", async () => {
      const scorm2004API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12/does_not_exist",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm2004API.lmsInitialize();

      const callback = sinon.spy();
      scorm2004API.on("CommitError", callback);

      scorm2004API.lmsSetValue("cmi.core.session_time", "00:01:00");
      clock.tick(2000);

      await clock.runAllAsync();

      expect(callback.called).toBe(true);
    });
  });

  describe("Test issues from users", () => {
    it("Should be able to load the JSON data from issue #587", () => {
      const scorm12api = api({
        ...DefaultSettings,
        autocommit: false,
        lmsCommitUrl: "/scorm12",
        dataCommitFormat: "flattened",
        logLevel: 1,
      });

      scorm12api.loadFromFlattenedJSON(
        {
          "cmi.comments": "",
          "cmi.comments_from_lms": "",
          "cmi.core.credit": "",
          "cmi.core.entry": "",
          "cmi.core.exit": "",
          "cmi.core.lesson_location": "topic-nOmtUy",
          "cmi.core.lesson_mode": "normal",
          "cmi.core.lesson_status": "completed",
          "cmi.core.score.max": "100",
          "cmi.core.score.min": "",
          "cmi.core.score.raw": "",
          "cmi.core.session_time": "00:03:50",
          "cmi.core.student_id": "student1",
          "cmi.core.student_name": "Student 1",
          "cmi.core.total_time": "00:03:50",
          "cmi.interactions": {},
          "cmi.launch_data": "",
          "cmi.objectives.0.id": "topic-aMMlFF",
          "cmi.objectives.0.score.max": "100",
          "cmi.objectives.0.score.min": "",
          "cmi.objectives.0.score.raw": "",
          "cmi.objectives.0.status": "completed",
          "cmi.objectives.1.id": "topic-6ReD72",
          "cmi.objectives.1.score.max": "100",
          "cmi.objectives.1.score.min": "",
          "cmi.objectives.1.score.raw": "",
          "cmi.objectives.1.status": "completed",
          "cmi.objectives.10.id": "topic-MllWvr",
          "cmi.objectives.10.score.max": "100",
          "cmi.objectives.10.score.min": "",
          "cmi.objectives.10.score.raw": "",
          "cmi.objectives.10.status": "completed",
          "cmi.objectives.11.id": "topic-m0dnP3",
          "cmi.objectives.11.score.max": "100",
          "cmi.objectives.11.score.min": "",
          "cmi.objectives.11.score.raw": "",
          "cmi.objectives.11.status": "completed",
          "cmi.objectives.12.id": "topic-so4hKC",
          "cmi.objectives.12.score.max": "100",
          "cmi.objectives.12.score.min": "",
          "cmi.objectives.12.score.raw": "",
          "cmi.objectives.12.status": "completed",
          "cmi.objectives.13.id": "topic-S9p8FE",
          "cmi.objectives.13.score.max": "100",
          "cmi.objectives.13.score.min": "",
          "cmi.objectives.13.score.raw": "",
          "cmi.objectives.13.status": "completed",
          "cmi.objectives.14.id": "topic-E97B5s",
          "cmi.objectives.14.score.max": "100",
          "cmi.objectives.14.score.min": "",
          "cmi.objectives.14.score.raw": "",
          "cmi.objectives.14.status": "completed",
          "cmi.objectives.15.id": "topic-TTyEf0",
          "cmi.objectives.15.score.max": "100",
          "cmi.objectives.15.score.min": "",
          "cmi.objectives.15.score.raw": "",
          "cmi.objectives.15.status": "completed",
          "cmi.objectives.16.id": "topic-Bk8ZLK",
          "cmi.objectives.16.score.max": "100",
          "cmi.objectives.16.score.min": "",
          "cmi.objectives.16.score.raw": "",
          "cmi.objectives.16.status": "completed",
          "cmi.objectives.17.id": "topic-5rxzyV",
          "cmi.objectives.17.score.max": "100",
          "cmi.objectives.17.score.min": "",
          "cmi.objectives.17.score.raw": "",
          "cmi.objectives.17.status": "completed",
          "cmi.objectives.18.id": "topic-Q3rjln",
          "cmi.objectives.18.score.max": "100",
          "cmi.objectives.18.score.min": "",
          "cmi.objectives.18.score.raw": "",
          "cmi.objectives.18.status": "completed",
          "cmi.objectives.19.id": "topic-eIbwi4",
          "cmi.objectives.19.score.max": "100",
          "cmi.objectives.19.score.min": "",
          "cmi.objectives.19.score.raw": "",
          "cmi.objectives.19.status": "completed",
          "cmi.objectives.2.id": "topic-sfvmuO",
          "cmi.objectives.2.score.max": "100",
          "cmi.objectives.2.score.min": "",
          "cmi.objectives.2.score.raw": "",
          "cmi.objectives.2.status": "completed",
          "cmi.objectives.20.id": "topic-AzAspy",
          "cmi.objectives.20.score.max": "100",
          "cmi.objectives.20.score.min": "",
          "cmi.objectives.20.score.raw": "",
          "cmi.objectives.20.status": "completed",
          "cmi.objectives.21.id": "topic-ehMV4A",
          "cmi.objectives.21.score.max": "100",
          "cmi.objectives.21.score.min": "",
          "cmi.objectives.21.score.raw": "",
          "cmi.objectives.21.status": "completed",
          "cmi.objectives.22.id": "topic-U52hDp",
          "cmi.objectives.22.score.max": "100",
          "cmi.objectives.22.score.min": "",
          "cmi.objectives.22.score.raw": "",
          "cmi.objectives.22.status": "completed",
          "cmi.objectives.23.id": "topic-mmAPuC",
          "cmi.objectives.23.score.max": "100",
          "cmi.objectives.23.score.min": "",
          "cmi.objectives.23.score.raw": "",
          "cmi.objectives.23.status": "completed",
          "cmi.objectives.24.id": "topic-UyqqeN",
          "cmi.objectives.24.score.max": "100",
          "cmi.objectives.24.score.min": "",
          "cmi.objectives.24.score.raw": "",
          "cmi.objectives.24.status": "completed",
          "cmi.objectives.25.id": "topic-UIALBn",
          "cmi.objectives.25.score.max": "100",
          "cmi.objectives.25.score.min": "",
          "cmi.objectives.25.score.raw": "",
          "cmi.objectives.25.status": "completed",
          "cmi.objectives.26.id": "topic-oLGCQE",
          "cmi.objectives.26.score.max": "100",
          "cmi.objectives.26.score.min": "",
          "cmi.objectives.26.score.raw": "",
          "cmi.objectives.26.status": "completed",
          "cmi.objectives.27.id": "topic-JhRmY0",
          "cmi.objectives.27.score.max": "100",
          "cmi.objectives.27.score.min": "",
          "cmi.objectives.27.score.raw": "",
          "cmi.objectives.27.status": "completed",
          "cmi.objectives.28.id": "topic-677fLH",
          "cmi.objectives.28.score.max": "100",
          "cmi.objectives.28.score.min": "",
          "cmi.objectives.28.score.raw": "",
          "cmi.objectives.28.status": "completed",
          "cmi.objectives.29.id": "topic-rKvnIL",
          "cmi.objectives.29.score.max": "100",
          "cmi.objectives.29.score.min": "",
          "cmi.objectives.29.score.raw": "",
          "cmi.objectives.29.status": "completed",
          "cmi.objectives.3.id": "topic-IObzTr",
          "cmi.objectives.3.score.max": "100",
          "cmi.objectives.3.score.min": "",
          "cmi.objectives.3.score.raw": "",
          "cmi.objectives.3.status": "completed",
          "cmi.objectives.30.id": "topic-Vjd6mO",
          "cmi.objectives.30.score.max": "100",
          "cmi.objectives.30.score.min": "",
          "cmi.objectives.30.score.raw": "",
          "cmi.objectives.30.status": "completed",
          "cmi.objectives.31.id": "topic-jUsEtX",
          "cmi.objectives.31.score.max": "100",
          "cmi.objectives.31.score.min": "",
          "cmi.objectives.31.score.raw": "",
          "cmi.objectives.31.status": "completed",
          "cmi.objectives.32.id": "topic-SvCWWr",
          "cmi.objectives.32.score.max": "100",
          "cmi.objectives.32.score.min": "",
          "cmi.objectives.32.score.raw": "",
          "cmi.objectives.32.status": "completed",
          "cmi.objectives.33.id": "topic-knRFfG",
          "cmi.objectives.33.score.max": "100",
          "cmi.objectives.33.score.min": "",
          "cmi.objectives.33.score.raw": "",
          "cmi.objectives.33.status": "completed",
          "cmi.objectives.34.id": "topic-wlFwhf",
          "cmi.objectives.34.score.max": "100",
          "cmi.objectives.34.score.min": "",
          "cmi.objectives.34.score.raw": "",
          "cmi.objectives.34.status": "completed",
          "cmi.objectives.35.id": "topic-3b86fq",
          "cmi.objectives.35.score.max": "100",
          "cmi.objectives.35.score.min": "",
          "cmi.objectives.35.score.raw": "",
          "cmi.objectives.35.status": "completed",
          "cmi.objectives.36.id": "topic-ZjIFKf",
          "cmi.objectives.36.score.max": "100",
          "cmi.objectives.36.score.min": "",
          "cmi.objectives.36.score.raw": "",
          "cmi.objectives.36.status": "completed",
          "cmi.objectives.37.id": "topic-A9spZz",
          "cmi.objectives.37.score.max": "100",
          "cmi.objectives.37.score.min": "",
          "cmi.objectives.37.score.raw": "",
          "cmi.objectives.37.status": "completed",
          "cmi.objectives.38.id": "topic-nOmtUy",
          "cmi.objectives.38.score.max": "100",
          "cmi.objectives.38.score.min": "",
          "cmi.objectives.38.score.raw": "",
          "cmi.objectives.38.status": "completed",
          "cmi.objectives.39.id": "topic-jxtabl",
          "cmi.objectives.39.score.max": "100",
          "cmi.objectives.39.score.min": "",
          "cmi.objectives.39.score.raw": "",
          "cmi.objectives.39.status": "completed",
          "cmi.objectives.4.id": "topic-Bq3O5v",
          "cmi.objectives.4.score.max": "100",
          "cmi.objectives.4.score.min": "",
          "cmi.objectives.4.score.raw": "",
          "cmi.objectives.4.status": "completed",
          "cmi.objectives.5.id": "topic-HmnDxg",
          "cmi.objectives.5.score.max": "100",
          "cmi.objectives.5.score.min": "",
          "cmi.objectives.5.score.raw": "",
          "cmi.objectives.5.status": "completed",
          "cmi.objectives.6.id": "topic-4YswmY",
          "cmi.objectives.6.score.max": "100",
          "cmi.objectives.6.score.min": "",
          "cmi.objectives.6.score.raw": "",
          "cmi.objectives.6.status": "completed",
          "cmi.objectives.7.id": "topic-LuAS5e",
          "cmi.objectives.7.score.max": "100",
          "cmi.objectives.7.score.min": "",
          "cmi.objectives.7.score.raw": "",
          "cmi.objectives.7.status": "completed",
          "cmi.objectives.8.id": "topic-K6ECXa",
          "cmi.objectives.8.score.max": "100",
          "cmi.objectives.8.score.min": "",
          "cmi.objectives.8.score.raw": "",
          "cmi.objectives.8.status": "completed",
          "cmi.objectives.9.id": "topic-2lpxvN",
          "cmi.objectives.9.score.max": "100",
          "cmi.objectives.9.score.min": "",
          "cmi.objectives.9.score.raw": "",
          "cmi.objectives.9.status": "completed",
          "cmi.student_data.mastery_score": "",
          "cmi.student_data.max_time_allowed": "",
          "cmi.student_data.time_limit_action": "",
          "cmi.student_preference.audio": "",
          "cmi.student_preference.language": "",
          "cmi.student_preference.speed": "",
          "cmi.student_preference.text": "",
          "cmi.suspend_data": "",
        },
        "",
      );
      scorm12api.lmsInitialize();

      expect(scorm12api.getCMIValue("cmi.objectives.10.id")).toEqual(
        "topic-MllWvr",
      );
    });
  });
});
