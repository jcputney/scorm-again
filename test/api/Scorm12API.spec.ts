// noinspection DuplicatedCode

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import * as h from "./api_helpers";
import { scorm12Values } from "../field_values";
import { Settings } from "../../src/types/api_types";
import { DefaultSettings } from "../../src/constants/default_settings";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";
import { StringKeyMap } from "../../src";
import BaseAPI from "../../src/BaseAPI";

const api = (
  settings?: Settings,
  httpService?: any,
  startingData: StringKeyMap = {},
): Scorm12API => {
  const API = new Scorm12API({ ...settings, logLevel: LogLevelEnum.NONE }, httpService);
  API.startingData = startingData;
  return API;
};
const apiInitialized = (settings?: Settings, startingData: StringKeyMap = {}): Scorm12API => {
  const API = api(settings);
  API.loadFromJSON(startingData ? startingData : {});
  API.lmsInitialize();
  return API;
};

describe("SCORM 1.2 API Tests", () => {
  beforeAll((): void => {
    vi.useFakeTimers();

    // Set up fetch mocks
    vi.stubGlobal("fetch", vi.fn());

    (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
      if (url.toString().includes("/scorm12/error")) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({}),
      } as Response);
    });
  });

  afterAll((): void => {
    vi.useRealTimers();
    vi.restoreAllMocks();
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
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi._children",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.core._children",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.core.score._children",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives._children",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives._count",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions._children",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions._count",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions.0.objectives._count",
        expectedError: 402,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions.0.correct_responses._count",
        expectedError: 402,
      });
    });

    describe("Invalid Sets - Should Fail After Initialization", () => {
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.launch_data",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.student_id",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.student_name",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.credit",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.entry",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.total_time",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.core.lesson_mode",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.mastery_score",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.max_time_allowed",
        expectedError: 403,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.student_data.time_limit_action",
        expectedError: 403,
      });
    });
  });

  describe("LMSGetValue()", () => {
    describe("Invalid Properties - Should Always Fail", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.close",
        expectedError: 101,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.exit",
        expectedError: 101,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.entry",
        expectedError: 101,
        errorThrown: false,
      });
    });

    describe("Write-Only Properties - Should Always Fail", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.objectives.0.id",
        initializeFirst: true,
        initializationValue: "AAA",
        expectedError: 404,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.exit",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.session_time",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.id",
        initializeFirst: true,
        initializationValue: "AAA",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.time",
        initializeFirst: true,
        initializationValue: "12:59:59",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.type",
        initializeFirst: true,
        initializationValue: "true-false",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.weighting",
        initializeFirst: true,
        initializationValue: "0",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.student_response",
        initializeFirst: true,
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.result",
        initializeFirst: true,
        initializationValue: "correct",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.latency",
        initializeFirst: true,
        initializationValue: "01:59:59.99",
        expectedError: 404,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.correct_responses.0.pattern",
        initializeFirst: true,
        initializationValue: "AAA",
        expectedValue: "AAA",
        expectedError: 404,
      });
    });
  });

  describe("LMSSetValue()", () => {
    describe("Uninitialized - Should Fail", () => {
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.objectives.0.id",
        expectedError: 301,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.interactions.0.id",
        expectedError: 301,
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
        fieldName: "cmi.interactions.0.correct_responses.0.pattern",
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
      const cmiExport: StringKeyMap = scorm12API.renderCommitCMI(true, true) as StringKeyMap;
      const exportCmi = cmiExport.cmi as StringKeyMap;
      const exportCore = exportCmi.core as StringKeyMap;
      expect(exportCore.total_time).toEqual("36:34:55");
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
      const cmiExport: StringKeyMap = scorm12API.renderCommitCMI(true, true) as StringKeyMap;
      const exportCmi = cmiExport.cmi as StringKeyMap;
      const exportCore = exportCmi.core as StringKeyMap;
      expect(exportCore.total_time).toEqual("23:59:59");
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
      const cmiExport: StringKeyMap = scorm12API.renderCommitCMI(true) as StringKeyMap;
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
      const commitObject = scorm12API.renderCommitObject(true, true);
      expect(commitObject.successStatus).toEqual("unknown");
      expect(commitObject.completionStatus).toEqual("incomplete");
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      const runtimeCore = runtimeCmi.core as StringKeyMap;
      expect(runtimeCore.lesson_status).toEqual("incomplete");
      expect(commitObject.totalTimeSeconds).toEqual(
        12 * 3600 + 34 * 60 + 56 + (23 * 3600 + 59 * 60 + 59),
      );
      expect(commitObject.score?.max).toEqual(100);
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
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      const runtimeCore = runtimeCmi.core as StringKeyMap;
      expect(runtimeCore.lesson_status).toEqual("completed");
      const runtimeScore = runtimeCore.score as StringKeyMap;
      expect(runtimeScore.raw).toEqual("85");
      expect(runtimeScore.min).toEqual("0");
      expect(runtimeScore.max).toEqual("100");
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
      expect(commitObject.successStatus).toEqual(SuccessStatus.PASSED);
      expect(commitObject.completionStatus).toEqual(CompletionStatus.COMPLETED);
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      const runtimeCore = runtimeCmi.core as StringKeyMap;
      expect(runtimeCore.lesson_status).toEqual("passed");
    });

    it("should render commit object with failed success status", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "failed";
      const commitObject = scorm12API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual(SuccessStatus.FAILED);
      expect(commitObject.completionStatus).toEqual(CompletionStatus.INCOMPLETE);
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      const runtimeCore = runtimeCmi.core as StringKeyMap;
      expect(runtimeCore.lesson_status).toEqual("failed");
    });

    it("should calculate total time when terminateCommit is true", () => {
      const scorm12API = api();
      scorm12API.cmi.core.total_time = "12:34:56";
      scorm12API.cmi.core.session_time = "23:59:59";
      const commitObject = scorm12API.renderCommitObject(true, true);
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      const runtimeCore = runtimeCmi.core as StringKeyMap;
      expect(runtimeCore.total_time).toEqual("36:34:55");
    });

    describe("autoPopulateCommitMetadata", () => {
      it("should not populate metadata when autoPopulateCommitMetadata is false (default)", () => {
        const scorm12API = api();
        scorm12API.cmi.core.student_id = "student_123";
        scorm12API.cmi.core.student_name = "John Doe";
        const commitObject = scorm12API.renderCommitObject(true);
        expect(commitObject.courseId).toBeUndefined();
        expect(commitObject.scoId).toBeUndefined();
        expect(commitObject.learnerId).toBeUndefined();
        expect(commitObject.learnerName).toBeUndefined();
      });

      it("should populate all metadata when autoPopulateCommitMetadata is true", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          courseId: "course-123",
          scoId: "sco-456",
        });
        scorm12API.cmi.core.student_id = "student_789";
        scorm12API.cmi.core.student_name = "Jane Smith";
        const commitObject = scorm12API.renderCommitObject(true);
        expect(commitObject.courseId).toEqual("course-123");
        expect(commitObject.scoId).toEqual("sco-456");
        expect(commitObject.learnerId).toEqual("student_789");
        expect(commitObject.learnerName).toEqual("Jane Smith");
      });

      it("should only populate courseId when only courseId is provided", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          courseId: "my-course",
        });
        const commitObject = scorm12API.renderCommitObject(true);
        expect(commitObject.courseId).toEqual("my-course");
        expect(commitObject.scoId).toBeUndefined();
        expect(commitObject.learnerId).toBeUndefined();
        expect(commitObject.learnerName).toBeUndefined();
      });

      it("should only populate scoId when only scoId is provided", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          scoId: "my-sco",
        });
        const commitObject = scorm12API.renderCommitObject(true);
        expect(commitObject.courseId).toBeUndefined();
        expect(commitObject.scoId).toEqual("my-sco");
        expect(commitObject.learnerId).toBeUndefined();
        expect(commitObject.learnerName).toBeUndefined();
      });

      it("should populate learner info from CMI when available", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
        });
        scorm12API.cmi.core.student_id = "learner-abc";
        scorm12API.cmi.core.student_name = "Bob Wilson";
        const commitObject = scorm12API.renderCommitObject(false);
        expect(commitObject.learnerId).toEqual("learner-abc");
        expect(commitObject.learnerName).toEqual("Bob Wilson");
      });

      it("should not populate learner info when CMI values are empty", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          courseId: "course-1",
        });
        // student_id and student_name are empty by default
        const commitObject = scorm12API.renderCommitObject(true);
        expect(commitObject.courseId).toEqual("course-1");
        expect(commitObject.learnerId).toBeUndefined();
        expect(commitObject.learnerName).toBeUndefined();
      });

      it("should work correctly on non-terminate commits", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          courseId: "course-xyz",
          scoId: "sco-xyz",
        });
        scorm12API.cmi.core.student_id = "student-xyz";
        const commitObject = scorm12API.renderCommitObject(false);
        expect(commitObject.courseId).toEqual("course-xyz");
        expect(commitObject.scoId).toEqual("sco-xyz");
        expect(commitObject.learnerId).toEqual("student-xyz");
      });

      it("should preserve other commit object fields when metadata is populated", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          courseId: "course-preserve",
        });
        scorm12API.cmi.core.lesson_status = "passed";
        scorm12API.cmi.core.score.raw = "95";
        scorm12API.cmi.core.student_id = "student-preserve";
        const commitObject = scorm12API.renderCommitObject(true);
        // Verify original fields are intact
        expect(commitObject.successStatus).toEqual(SuccessStatus.PASSED);
        expect(commitObject.completionStatus).toEqual(CompletionStatus.COMPLETED);
        expect(commitObject.score?.raw).toEqual(95);
        // Verify metadata is added
        expect(commitObject.courseId).toEqual("course-preserve");
        expect(commitObject.learnerId).toEqual("student-preserve");
      });

      it("should handle reset and metadata update for multi-SCO scenario", () => {
        const scorm12API = api({
          autoPopulateCommitMetadata: true,
          courseId: "course-multi",
          scoId: "sco-1",
        });
        scorm12API.cmi.core.student_id = "learner-1";
        const commitObject1 = scorm12API.renderCommitObject(true);
        expect(commitObject1.scoId).toEqual("sco-1");

        // Simulate multi-SCO transition
        scorm12API.reset({ scoId: "sco-2", autoPopulateCommitMetadata: true });
        scorm12API.cmi.core.student_id = "learner-1"; // Re-set after reset
        const commitObject2 = scorm12API.renderCommitObject(true);
        expect(commitObject2.scoId).toEqual("sco-2");
      });
    });
  });

  describe("storeData()", () => {
    it('should set cmi.core.lesson_status to "incomplete"', () => {
      const scorm12API = api();
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("incomplete");
    });
    it('should set cmi.core.lesson_status to "completed" when legacy auto-complete is enabled', () => {
      const scorm12API = api({
        ...DefaultSettings,
        autoCompleteLessonStatus: true,
      });
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
    });
    it("should not override lesson_status when set by module", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "passed";
      scorm12API.statusSetByModule = true;
      scorm12API.storeData(true);
      expect(scorm12API.cmi.core.lesson_status).toEqual("passed");
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

    // GAP-34: score_overrides_status tests
    describe("score_overrides_status setting", () => {
      it("should preserve SCO-set status when score_overrides_status=false (backward compatibility)", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: false,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        scorm12API.cmi.core.score.raw = "75.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
      });

      it("should override SCO-set status to 'passed' when score_overrides_status=true and score >= mastery", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        scorm12API.cmi.core.score.raw = "75.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("passed");
      });

      it("should override SCO-set status to 'failed' when score_overrides_status=true and score < mastery", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        scorm12API.cmi.core.score.raw = "45.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("failed");
      });

      it("should override SCO-set 'passed' status to 'failed' when score_overrides_status=true and score < mastery", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "passed");
        scorm12API.cmi.core.score.raw = "45.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("failed");
      });

      it("should override SCO-set 'failed' status to 'passed' when score_overrides_status=true and score >= mastery", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "failed");
        scorm12API.cmi.core.score.raw = "75.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("passed");
      });

      it("should only apply in normal mode with credit", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "no-credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        scorm12API.cmi.core.score.raw = "75.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
      });

      it("should only apply in normal mode", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.core.lesson_mode = "browse";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        scorm12API.cmi.core.score.raw = "75.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
      });

      it("should only apply when both mastery_score and raw score are set", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        // No raw score set
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
      });

      it("should only apply when mastery_score is set", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
        });
        scorm12API.cmi.core.credit = "credit";
        // mastery_score is empty by default
        scorm12API.lmsInitialize();
        scorm12API.lmsSetValue("cmi.core.lesson_status", "completed");
        scorm12API.cmi.core.score.raw = "75.0";
        scorm12API.storeData(true);
        expect(scorm12API.cmi.core.lesson_status).toEqual("completed");
      });

      it("should only override when statusSetByModule is true", () => {
        const scorm12API = api({
          ...DefaultSettings,
          score_overrides_status: true,
          mastery_override: false,
        });
        scorm12API.cmi.core.credit = "credit";
        scorm12API.cmi.student_data.mastery_score = "60.0";
        scorm12API.cmi.core.score.raw = "75.0";
        // statusSetByModule is false since we didn't call lmsSetValue for lesson_status
        scorm12API.storeData(true);
        // Should default to "incomplete" (autoCompleteLessonStatus is false)
        // Stage 2 doesn't apply because statusSetByModule is false
        expect(scorm12API.cmi.core.lesson_status).toEqual("incomplete");
      });
    });
  });

  describe("LMSCommit Throttle Tests", () => {
    it("should throttle LMSCommit calls when autocommit is true", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        autocommit: true,
        autocommitSeconds: 1,
      });
      scorm12API.lmsInitialize();

      const commitSpy = vi.spyOn(scorm12API, "commit");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      scorm12API.lmsSetValue("cmi.core.session_time", "00:02:00");
      scorm12API.lmsSetValue("cmi.core.session_time", "00:03:00");

      vi.advanceTimersByTime(2000);

      expect(commitSpy).toHaveBeenCalledOnce();
    });

    it("should call LMSCommit only once within the throttle period", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        throttleCommits: true,
        useAsynchronousCommits: true,
        autocommit: true,
        autocommitSeconds: 1,
      });
      scorm12API.lmsInitialize();

      const commitSpy = vi.spyOn(scorm12API, "commit");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");

      scorm12API.lmsCommit();

      vi.advanceTimersByTime(300);
      scorm12API.lmsCommit();

      vi.advanceTimersByTime(300);
      scorm12API.lmsCommit();

      vi.advanceTimersByTime(1000);

      expect(commitSpy).toHaveBeenCalledOnce();
    });

    it("should call LMSCommit multiple times if throttle period is exceeded", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        autocommit: true,
        autocommitSeconds: 1,
      });
      scorm12API.lmsInitialize();

      const commitSpy = vi.spyOn(scorm12API, "commit");

      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");
      vi.advanceTimersByTime(2000);
      scorm12API.lmsSetValue("cmi.core.session_time", "00:02:00");
      vi.advanceTimersByTime(2000);
      scorm12API.lmsSetValue("cmi.core.session_time", "00:03:00");

      vi.advanceTimersByTime(2000);

      expect(commitSpy.mock.calls.length === 3).toBe(true);
    });
  });

  describe("Event Handlers", () => {
    // Mock the HttpService to directly trigger the callbacks without network
    beforeEach(() => {
      // Override the implementation to be synchronous
      vi.spyOn(BaseAPI.prototype, "commit").mockImplementation(function (
        this: BaseAPI,
        callbackName: string,
      ) {
        if (callbackName === "LMSCommit") {
          // First trigger the original event
          this.processListeners(callbackName);
          // Then trigger the success event
          this.processListeners("CommitSuccess");
        }
        return Promise.resolve("true");
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("Should handle SetValue.cmi.core.student_name event", async () => {
      const scorm12API = apiInitialized();
      const callbackManager = vi.fn();
      scorm12API.on("LMSSetValue.cmi.core.student_name", callbackManager);
      scorm12API.lmsSetValue("cmi.core.student_name", "test student");

      expect(callbackManager).toHaveBeenCalledWith("cmi.core.student_name", "test student");
    });

    it("Should handle SetValue.cmi.* event", () => {
      const scorm12API = apiInitialized();
      const callback = vi.fn();
      scorm12API.on("LMSSetValue.cmi.*", callback);
      scorm12API.lmsSetValue("cmi.core.student_name", "@jcputney");
      expect(callback).toHaveBeenCalled();
    });

    it("Should handle CommitSuccess event", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: false,
        },
      });
      scorm12API.lmsInitialize();

      const callback = vi.fn();
      scorm12API.on("CommitSuccess", callback);

      // Call lmsCommit directly
      scorm12API.lmsCommit();

      expect(callback).toHaveBeenCalled();
    });

    it("Should clear all event listeners for CommitSuccess", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: false,
        },
      });
      scorm12API.lmsInitialize();

      const callback = vi.fn();
      const callback2 = vi.fn();
      scorm12API.on("CommitSuccess", callback);
      scorm12API.on("CommitSuccess", callback2);

      // First commit
      scorm12API.lmsCommit();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();

      // Clear event listeners
      scorm12API.clear("CommitSuccess");

      // Second commit
      scorm12API.lmsCommit();

      // Expect still called only once (no new calls)
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it("Should clear only the specific event listener for CommitSuccess", async () => {
      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12",
          autocommit: false,
          throttleCommits: false,
        },
      });
      scorm12API.lmsInitialize();

      const callback = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      const callback4 = vi.fn();
      scorm12API.on("CommitSuccess", callback);
      scorm12API.on("CommitSuccess", callback2);
      scorm12API.on("LMSCommit", callback3);
      scorm12API.on("LMSSetValue", callback4);

      // Set a value to trigger LMSSetValue event
      scorm12API.lmsSetValue("cmi.core.session_time", "00:01:00");

      // First commit
      scorm12API.lmsCommit();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
      expect(callback3).toHaveBeenCalledOnce();
      expect(callback4).toHaveBeenCalledOnce();

      // Remove one specific listener
      scorm12API.off("CommitSuccess", callback);

      // Set another value and commit again
      scorm12API.lmsSetValue("cmi.core.session_time", "00:02:00");
      scorm12API.lmsCommit();

      // First callback should still be called only once
      expect(callback).toHaveBeenCalledTimes(1);

      // Other callbacks should be called twice
      expect(callback2).toHaveBeenCalledTimes(2);
      expect(callback3).toHaveBeenCalledTimes(2);
      expect(callback4).toHaveBeenCalledTimes(2);
    });

    it("Should handle CommitError event", async () => {
      // Override the mock for this specific test
      vi.spyOn(BaseAPI.prototype, "commit").mockImplementation(function (
        this: BaseAPI,
        callbackName: string,
      ) {
        if (callbackName === "LMSCommit") {
          // Directly trigger error event
          this.processListeners("CommitError", undefined, 101);
        }
        return Promise.resolve("false");
      });

      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12/error",
          autocommit: false,
        },
      });
      scorm12API.lmsInitialize();

      const callback = vi.fn();
      scorm12API.on("CommitError", callback);

      // Call commit directly
      scorm12API.lmsCommit();

      expect(callback).toHaveBeenCalled();
    });

    it("Should handle CommitError event when offline", async () => {
      // Override the mock for this specific test
      vi.spyOn(BaseAPI.prototype, "commit").mockImplementation(function (
        this: BaseAPI,
        callbackName: string,
      ) {
        if (callbackName === "LMSCommit") {
          // Directly trigger error event for network error
          this.processListeners("CommitError");
        }
        return Promise.resolve("false");
      });

      const scorm12API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm12/does_not_exist",
          autocommit: false,
        },
      });
      scorm12API.lmsInitialize();

      const callback = vi.fn();
      scorm12API.on("CommitError", callback);

      // Call commit directly
      scorm12API.lmsCommit();

      expect(callback).toHaveBeenCalled();
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

      expect(scorm12api.getCMIValue("cmi.objectives.10.id")).toEqual("topic-MllWvr");
    });
  });

  describe("Synchronous Commit Tests", () => {
    it("should return actual commit failure synchronously", () => {
      const mockService = {
        processHttpRequest: vi.fn().mockReturnValue({
          result: "false",
          errorCode: 101,
        }),
        updateSettings: vi.fn(),
      };

      const scorm12API = api(
        {
          lmsCommitUrl: "http://test.com/commit",
        },
        mockService,
      );
      scorm12API.lmsInitialize();

      const result = scorm12API.lmsCommit();

      // Should return actual failure synchronously
      expect(result).toBe("false");
      expect(scorm12API.lmsGetLastError()).toBe("101");
    });

    it("should return success when commit succeeds", () => {
      const mockService = {
        processHttpRequest: vi.fn().mockReturnValue({
          result: "true",
          errorCode: 0,
        }),
        updateSettings: vi.fn(),
      };

      const scorm12API = api(
        {
          lmsCommitUrl: "http://test.com/commit",
        },
        mockService,
      );
      scorm12API.lmsInitialize();

      const result = scorm12API.lmsCommit();

      expect(result).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should return actual terminate failure synchronously", () => {
      const mockService = {
        processHttpRequest: vi.fn().mockReturnValue({
          result: "false",
          errorCode: 101,
        }),
        updateSettings: vi.fn(),
      };

      const scorm12API = api(
        {
          lmsCommitUrl: "http://test.com/commit",
        },
        mockService,
      );
      scorm12API.lmsInitialize();

      const result = scorm12API.lmsFinish();

      // Should return actual failure synchronously
      expect(result).toBe("false");
      expect(scorm12API.lmsGetLastError()).toBe("101");
    });
  });
});
