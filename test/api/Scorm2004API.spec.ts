import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import * as h from "./api_helpers";
import Scorm2004API from "../../src/Scorm2004API";
import { scorm2004Values } from "../field_values";
import { ADLNav, global_constants, scorm2004_constants, StringKeyMap } from "../../src";
import { Settings } from "../../src/types/api_types";
import { DefaultSettings } from "../../src/constants/default_settings";
import { CMIInteractions } from "../../src/cmi/scorm2004/interactions";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";

const api = (settings?: Settings, startingData: StringKeyMap = {}): Scorm2004API => {
  const API = new Scorm2004API({ ...settings, logLevel: LogLevelEnum.NONE });
  if (startingData) {
    API.startingData = startingData;
  }
  return API;
};
const apiInitialized = (startingData?: StringKeyMap): Scorm2004API => {
  const API = api();
  API.loadFromJSON(startingData ? startingData : {}, "");
  API.lmsInitialize();
  return API;
};
const basicApi = (settings?: Settings): Scorm2004API => {
  return new Scorm2004API({
    ...settings,
    logLevel: LogLevelEnum.NONE,
  });
};

describe("SCORM 2004 API Tests", () => {
  let terminateStub: ReturnType<typeof vi.spyOn>;
  let processListenersSpy: ReturnType<typeof vi.spyOn>;

  beforeAll((): void => {
    // Set up fetch mocks
    vi.stubGlobal("fetch", vi.fn());

    (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
      if (
        url.toString().includes("/scorm2004/error") ||
        url.toString().includes("/scorm2004/does_not_exist")
      ) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: "true", errorCode: 0 }),
      } as Response);
    });
  });

  beforeEach((): void => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("SetValue()", () => {
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.score.scaled",
      validValues: scorm2004Values.validScaledRange,
      invalidValues: scorm2004Values.invalidScaledRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.score.raw",
      validValues: scorm2004Values.validScoreRange,
      invalidValues: scorm2004Values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.score.min",
      validValues: scorm2004Values.validScoreRange,
      invalidValues: scorm2004Values.invalidScoreRange,
    });
    h.checkValidValues({
      api: apiInitialized(),
      fieldName: "cmi.score.max",
      validValues: scorm2004Values.validScoreRange,
      invalidValues: scorm2004Values.invalidScoreRange,
    });
  });

  describe("setCMIValue()", () => {
    describe("Invalid Sets - Should Always Fail", () => {
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi._version",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.comments_from_learner._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.comments_from_learner._count",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.comments_from_lms._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.comments_from_lms._count",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions._count",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions.0.objectives._count",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.interactions.0.correct_responses._count",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.learner_preference._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives._count",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.objectives.0.score._children",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: api(),
        fieldName: "cmi.score._children",
        expectedError: 404,
      });
    });

    describe("Setting cmi.objectives.n.* should update globalObjectives if it exists", () => {
      it("should update globalObjectives if it exists", (): void => {
        const scorm2004API = api({
          globalObjectiveIds: ["Objective 1"],
        });

        scorm2004API.setCMIValue("cmi.objectives.0.id", "Objective 1");
        scorm2004API.setCMIValue("cmi.objectives.0.score.raw", "100");
        scorm2004API.setCMIValue("cmi.objectives.0.score.min", "0");
        scorm2004API.setCMIValue("cmi.objectives.0.score.max", "100");
        scorm2004API.setCMIValue("cmi.objectives.0.success_status", "passed");
        scorm2004API.setCMIValue("cmi.objectives.0.completion_status", "completed");
        scorm2004API.setCMIValue("cmi.objectives.0.progress_measure", "1");

        scorm2004API.setCMIValue("cmi.objectives.1.id", "Objective 2");
        scorm2004API.setCMIValue("cmi.objectives.1.score.raw", "100");
        scorm2004API.setCMIValue("cmi.objectives.1.score.min", "0");
        scorm2004API.setCMIValue("cmi.objectives.1.score.max", "100");
        scorm2004API.setCMIValue("cmi.objectives.1.success_status", "failed");
        scorm2004API.setCMIValue("cmi.objectives.1.completion_status", "incomplete");
        scorm2004API.setCMIValue("cmi.objectives.1.progress_measure", "0.5");

        interface GlobalObjective {
          id: string;
          score: {
            raw: string;
            min: string;
            max: string;
          };
          success_status: string;
          completion_status: string;
          progress_measure: string;
        }

        const globalObjective = scorm2004API.globalObjectives.find(
          (objective: GlobalObjective) => objective.id === "Objective 1",
        );

        expect(scorm2004API.getCMIValue("cmi.objectives.0.id")).toEqual("Objective 1");
        expect(scorm2004API.getCMIValue("cmi.objectives.0.score.raw")).toEqual("100");
        expect(scorm2004API.getCMIValue("cmi.objectives.0.score.min")).toEqual("0");
        expect(scorm2004API.getCMIValue("cmi.objectives.0.score.max")).toEqual("100");
        expect(scorm2004API.getCMIValue("cmi.objectives.0.success_status")).toEqual("passed");
        expect(scorm2004API.getCMIValue("cmi.objectives.0.completion_status")).toEqual("completed");
        expect(scorm2004API.getCMIValue("cmi.objectives.0.progress_measure")).toEqual("1");

        expect(globalObjective?.id).toEqual("Objective 1");
        expect(globalObjective?.score.raw).toEqual("100");
        expect(globalObjective?.score.min).toEqual("0");
        expect(globalObjective?.score.max).toEqual("100");
        expect(globalObjective?.success_status).toEqual("passed");
        expect(globalObjective?.completion_status).toEqual("completed");
        expect(globalObjective?.progress_measure).toEqual("1");

        const globalObjective2 = scorm2004API.globalObjectives.find(
          (objective: GlobalObjective) => objective.id === "Objective 2",
        );
        expect(globalObjective2).toBe(undefined);
      });
    });

    describe("Invalid Sets - Should Fail After Initialization", () => {
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.completion_threshold",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.credit",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.entry",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.launch_data",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.learner_id",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.learner_name",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.max_time_allowed",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.mode",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.scaled_passing_score",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.time_limit_action",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.total_time",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms.0.comment",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms.0.location",
        expectedError: 404,
      });
      h.checkSetCMIValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms.0.timestamp",
        expectedError: 404,
      });
    });
  });

  describe("GetValue()", () => {
    describe("Invalid Properties - Should Always Fail", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.close",
        expectedError: 401,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.exit",
        expectedError: 401,
        errorThrown: false,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.core.entry",
        expectedError: 401,
        errorThrown: false,
      });
    });

    describe("Write-Only Properties - Should Always Fail", () => {
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.exit",
        expectedError: 405,
      });
      h.checkLMSGetValue({
        api: apiInitialized(),
        fieldName: "cmi.session_time",
        expectedError: 405,
      });
    });
  });

  describe("SetValue()", () => {
    describe("Uninitialized - Should Fail", () => {
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.objectives.0.id",
        expectedError: 132,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.interactions.0.id",
        expectedError: 132,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.comments_from_learner.0.comment",
        expectedError: 132,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: "cmi.comments_from_lms.0.comment",
        expectedError: 132,
      });
      h.checkLMSSetValue({
        api: api(),
        fieldName: "adl.data.0.store",
        expectedError: 132,
      });
    });

    describe("Initialized - Should Succeed", () => {
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "adl.data.0.store",
        valueToTest: "comment",
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.objectives.0.id",
        valueToTest: "AAA",
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.id",
        valueToTest: "AAA",
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_learner.0.comment",
        valueToTest: "comment",
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_learner.0.location",
        valueToTest: "location",
        errorThrown: false,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_learner.0.timestamp",
        valueToTest: scorm2004Values.validTimestamps[0],
        errorThrown: false,
      });
      it("should allow cmi.interactions.0.correct_responses.0.pattern to be set - T/F", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue("cmi.interactions.0.id", "Scene1_Slide3_MultiChoice_0_0");
        scorm2004API.setCMIValue("cmi.interactions.0.type", "true-false");
        scorm2004API.setCMIValue("cmi.interactions.0.correct_responses.0.pattern", "true");
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
      });
      it("should allow cmi.interactions.10.correct_responses.0.pattern to be set - T/F", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue("cmi.interactions.0.id", "Scene1_Slide3_MultiChoice_0_0");
        scorm2004API.setCMIValue("cmi.interactions.0.type", "true-false");
        scorm2004API.setCMIValue("cmi.interactions.0.correct_responses.0.pattern", "true");
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
      });
      it("should allow cmi.interactions.0.correct_responses.0.pattern to be set - choice", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue("cmi.interactions.0.id", "Scene1_Slide3_MultiChoice_0_0");
        scorm2004API.setCMIValue("cmi.interactions.0.type", "choice");
        scorm2004API.setCMIValue(
          "cmi.interactions.0.correct_responses.0.pattern",
          "VP_on-call_or_President",
        );
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
      });
      it("should allow cmi.interactions.0.correct_responses.0.pattern to be set - choice for SCORM 2004 4th Edition", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue(
          "cmi.interactions.0.id",
          "urn:scormdriver:Test_Your_Knowledge.Select_the_ONE_TRUE_answer._0",
        );
        scorm2004API.setCMIValue("cmi.interactions.0.type", "choice");
        scorm2004API.setCMIValue(
          "cmi.interactions.0.correct_responses.0.pattern",
          "urn:scormdriver:This%20is%20a%20choice.",
        );
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
      });
      it("should allow cmi.interactions.0.objectives.0.id to be set", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue("cmi.interactions.0.objectives.0.id", "ID of the Obj - ID 2");
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
      });
      it("should allow cmi.interactions.0.learner_response to be set", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue("cmi.interactions.0.id", "Scene1_Slide3_MultiChoice_0_0");
        scorm2004API.setCMIValue("cmi.interactions.0.type", "choice");
        scorm2004API.setCMIValue("cmi.interactions.0.learner_response", "VP_on-call_or_President");
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
        expect(scorm2004API.getCMIValue("cmi.interactions.0.id")).toEqual(
          "Scene1_Slide3_MultiChoice_0_0",
        );
        expect(scorm2004API.getCMIValue("cmi.interactions.0.type")).toEqual("choice");
        expect(scorm2004API.getCMIValue("cmi.interactions.0.learner_response")).toEqual(
          "VP_on-call_or_President",
        );
      });
      it("should allow cmi.interactions.0.learner_response to be set for SCORM 2004 4th Edition", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue(
          "cmi.interactions.0.id",
          "urn:scormdriver:Test_Your_Knowledge.Select_the_ONE_TRUE_answer._0",
        );
        scorm2004API.setCMIValue("cmi.interactions.0.type", "choice");
        scorm2004API.setCMIValue(
          "cmi.interactions.0.learner_response",
          "urn:scormdriver:This%20is%20an%20incorrect%20response.",
        );
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
        expect(scorm2004API.getCMIValue("cmi.interactions.0.id")).toEqual(
          "urn:scormdriver:Test_Your_Knowledge.Select_the_ONE_TRUE_answer._0",
        );
        expect(scorm2004API.getCMIValue("cmi.interactions.0.type")).toEqual("choice");
        expect(scorm2004API.getCMIValue("cmi.interactions.0.learner_response")).toEqual(
          "urn:scormdriver:This%20is%20an%20incorrect%20response.",
        );
      });
      it("should allow `long-fill-in` cmi.interactions.0.learner_response to be set to 4000 characters", (): void => {
        const scorm2004API = apiInitialized();
        scorm2004API.setCMIValue("cmi.interactions.0.id", "Scene1_Slide3_MultiChoice_0_0");
        scorm2004API.setCMIValue("cmi.interactions.0.type", "long-fill-in");
        scorm2004API.setCMIValue(
          "cmi.interactions.0.learner_response",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et sodales purus, in aliquam ex. Nunc suscipit interdum tortor ut hendrerit. Donec auctor erat suscipit justo hendrerit, at lacinia ipsum ullamcorper. Cras sollicitudin vestibulum malesuada. Sed non nibh pharetra, suscipit ipsum sed, maximus tortor. Morbi pharetra accumsan turpis id fringilla. In volutpat metus a dui semper, nec tincidunt nibh aliquam. Praesent viverra neque in elementum commodo. Integer hendrerit placerat ante, ac finibus urna tincidunt at. Phasellus consectetur mauris vitae orci viverra luctus. Proin vestibulum blandit mauris quis pellentesque. Proin volutpat hendrerit nisi. Etiam pellentesque urna nec massa congue ultricies. Mauris at eros viverra, posuere tortor id, elementum nisi. In hac habitasse platea dictumst. Pellentesque semper tristique arcu, in tristique metus. Vestibulum ut lacus dui. Aenean mattis malesuada arcu non ullamcorper. Suspendisse tincidunt euismod tincidunt. In tincidunt at nunc rhoncus vehicula. Quisque nulla massa, vestibulum nec laoreet sit amet, posuere eu massa. Donec accumsan efficitur turpis, quis eleifend odio aliquam a. Phasellus placerat ante id dui consectetur dictum. Morbi aliquam, nibh id elementum suscipit, neque ante scelerisque velit, at feugiat turpis odio ac ligula. Phasellus vel urna nulla. Donec vulputate nulla vel purus pellentesque gravida. Vestibulum rutrum, est vel cursus ultrices, orci arcu scelerisque magna, id facilisis mauris arcu ut turpis. Vestibulum consectetur faucibus ante, eu posuere quam ornare et. Aenean vitae dictum neque. Donec nisl justo, porta a sapien quis, luctus congue diam. Integer id metus dolor. Maecenas euismod vulputate leo in lobortis. Vestibulum dignissim finibus est, sed sollicitudin ipsum hendrerit ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque diam lorem, mattis vel orci interdum, tempor luctus elit. Ut id porta nisi. In dignissim quam urna, et iaculis lectus eleifend ut. Nam vitae felis ac risus tincidunt elementum. Nunc hendrerit augue a nulla hendrerit rutrum. Integer euismod est at orci eleifend, sed laoreet justo auctor. Sed sem orci, imperdiet at erat non, vehicula convallis libero. Aenean hendrerit cursus leo ut malesuada. Donec eu placerat lorem. Sed mattis tristique lorem, eget placerat erat scelerisque faucibus. Vivamus eleifend in augue id mollis. Nulla vehicula, metus eu auctor accumsan, lectus sapien pretium dui, non scelerisque magna augue a sem. Suspendisse sem enim, mattis ac augue non, placerat accumsan sem. Vivamus hendrerit, sapien sit amet consectetur pulvinar, ante nisl pulvinar purus, a ullamcorper dolor leo id arcu. Aliquam sed metus arcu. Quisque erat libero, tincidunt non dictum vel, bibendum ut ante. Nunc vel imperdiet risus. Sed sit amet porta enim. Mauris metus tortor, mattis vitae convallis vitae, dictum nec dui. Aliquam volutpat nisi consequat, gravida tellus eget, cursus purus. Nunc at venenatis enim. Proin dictum, magna ultrices tempor aliquam, metus lacus consectetur odio, quis pharetra massa est at est. Nullam non nibh massa. Duis scelerisque massa a luctus vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec tortor lacus, consequat eget neque sit amet, imperdiet porttitor felis. Duis ante erat, cursus sed venenatis nec, semper sollicitudin felis. Sed tincidunt et tortor quis vehicula. Morbi porta dapibus quam quis iaculis. Nunc mauris dolor, rutrum non pellentesque consectetur, ornare quis lacus. Maecenas eget feugiat odio. Proin vitae magna ut justo bibendum lacinia consequat at orci. Phasellus tincidunt lorem eu justo mollis sagittis. Maecenas fermentum nunc augue, et bibendum augue varius venenatis. Donec eu purus at tellus ullamcorper imperdiet. Duis id orci laoreet, semper eros et, tincidunt nisl. Suspendisse vehicula sed enim ut dignissim. Nam ornare leo eu nibh malesuada, eget ullamcorper sapien egestas. In at commod",
        );
        expect(String(scorm2004API.lmsGetLastError())).toEqual(String(0));
        expect(scorm2004API.getCMIValue("cmi.interactions.0.id")).toEqual(
          "Scene1_Slide3_MultiChoice_0_0",
        );
        expect(scorm2004API.getCMIValue("cmi.interactions.0.type")).toEqual("long-fill-in");
        expect(scorm2004API.getCMIValue("cmi.interactions.0.learner_response")).toEqual(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et sodales purus, in aliquam ex. Nunc suscipit interdum tortor ut hendrerit. Donec auctor erat suscipit justo hendrerit, at lacinia ipsum ullamcorper. Cras sollicitudin vestibulum malesuada. Sed non nibh pharetra, suscipit ipsum sed, maximus tortor. Morbi pharetra accumsan turpis id fringilla. In volutpat metus a dui semper, nec tincidunt nibh aliquam. Praesent viverra neque in elementum commodo. Integer hendrerit placerat ante, ac finibus urna tincidunt at. Phasellus consectetur mauris vitae orci viverra luctus. Proin vestibulum blandit mauris quis pellentesque. Proin volutpat hendrerit nisi. Etiam pellentesque urna nec massa congue ultricies. Mauris at eros viverra, posuere tortor id, elementum nisi. In hac habitasse platea dictumst. Pellentesque semper tristique arcu, in tristique metus. Vestibulum ut lacus dui. Aenean mattis malesuada arcu non ullamcorper. Suspendisse tincidunt euismod tincidunt. In tincidunt at nunc rhoncus vehicula. Quisque nulla massa, vestibulum nec laoreet sit amet, posuere eu massa. Donec accumsan efficitur turpis, quis eleifend odio aliquam a. Phasellus placerat ante id dui consectetur dictum. Morbi aliquam, nibh id elementum suscipit, neque ante scelerisque velit, at feugiat turpis odio ac ligula. Phasellus vel urna nulla. Donec vulputate nulla vel purus pellentesque gravida. Vestibulum rutrum, est vel cursus ultrices, orci arcu scelerisque magna, id facilisis mauris arcu ut turpis. Vestibulum consectetur faucibus ante, eu posuere quam ornare et. Aenean vitae dictum neque. Donec nisl justo, porta a sapien quis, luctus congue diam. Integer id metus dolor. Maecenas euismod vulputate leo in lobortis. Vestibulum dignissim finibus est, sed sollicitudin ipsum hendrerit ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque diam lorem, mattis vel orci interdum, tempor luctus elit. Ut id porta nisi. In dignissim quam urna, et iaculis lectus eleifend ut. Nam vitae felis ac risus tincidunt elementum. Nunc hendrerit augue a nulla hendrerit rutrum. Integer euismod est at orci eleifend, sed laoreet justo auctor. Sed sem orci, imperdiet at erat non, vehicula convallis libero. Aenean hendrerit cursus leo ut malesuada. Donec eu placerat lorem. Sed mattis tristique lorem, eget placerat erat scelerisque faucibus. Vivamus eleifend in augue id mollis. Nulla vehicula, metus eu auctor accumsan, lectus sapien pretium dui, non scelerisque magna augue a sem. Suspendisse sem enim, mattis ac augue non, placerat accumsan sem. Vivamus hendrerit, sapien sit amet consectetur pulvinar, ante nisl pulvinar purus, a ullamcorper dolor leo id arcu. Aliquam sed metus arcu. Quisque erat libero, tincidunt non dictum vel, bibendum ut ante. Nunc vel imperdiet risus. Sed sit amet porta enim. Mauris metus tortor, mattis vitae convallis vitae, dictum nec dui. Aliquam volutpat nisi consequat, gravida tellus eget, cursus purus. Nunc at venenatis enim. Proin dictum, magna ultrices tempor aliquam, metus lacus consectetur odio, quis pharetra massa est at est. Nullam non nibh massa. Duis scelerisque massa a luctus vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec tortor lacus, consequat eget neque sit amet, imperdiet porttitor felis. Duis ante erat, cursus sed venenatis nec, semper sollicitudin felis. Sed tincidunt et tortor quis vehicula. Morbi porta dapibus quam quis iaculis. Nunc mauris dolor, rutrum non pellentesque consectetur, ornare quis lacus. Maecenas eget feugiat odio. Proin vitae magna ut justo bibendum lacinia consequat at orci. Phasellus tincidunt lorem eu justo mollis sagittis. Maecenas fermentum nunc augue, et bibendum augue varius venenatis. Donec eu purus at tellus ullamcorper imperdiet. Duis id orci laoreet, semper eros et, tincidunt nisl. Suspendisse vehicula sed enim ut dignissim. Nam ornare leo eu nibh malesuada, eget ullamcorper sapien egestas. In at commod",
        );
      });
    });

    describe("Initialized - Should Fail", () => {
      h.checkLMSSetValue({
        api: apiInitialized({
          cmi: { interactions: { "0": { id: "interaction-id-1" } } },
        }),
        fieldName: "cmi.interactions.0.learner_response",
        valueToTest:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer et sodales purus, in aliquam ex. Nunc suscipit interdum tortor ut hendrerit. Donec auctor erat suscipit justo hendrerit, at lacinia ipsum ullamcorper. Cras sollicitudin vestibulum malesuada. Sed non nibh pharetra, suscipit ipsum sed, maximus tortor. Morbi pharetra accumsan turpis id fringilla. In volutpat metus a dui semper, nec tincidunt nibh aliquam. Praesent viverra neque in elementum commodo. Integer hendrerit placerat ante, ac finibus urna tincidunt at. Phasellus consectetur mauris vitae orci viverra luctus. Proin vestibulum blandit mauris quis pellentesque. Proin volutpat hendrerit nisi. Etiam pellentesque urna nec massa congue ultricies. Mauris at eros viverra, posuere tortor id, elementum nisi. In hac habitasse platea dictumst. Pellentesque semper tristique arcu, in tristique metus. Vestibulum ut lacus dui. Aenean mattis malesuada arcu non ullamcorper. Suspendisse tincidunt euismod tincidunt. In tincidunt at nunc rhoncus vehicula. Quisque nulla massa, vestibulum nec laoreet sit amet, posuere eu massa. Donec accumsan efficitur turpis, quis eleifend odio aliquam a. Phasellus placerat ante id dui consectetur dictum. Morbi aliquam, nibh id elementum suscipit, neque ante scelerisque velit, at feugiat turpis odio ac ligula. Phasellus vel urna nulla. Donec vulputate nulla vel purus pellentesque gravida. Vestibulum rutrum, est vel cursus ultrices, orci arcu scelerisque magna, id facilisis mauris arcu ut turpis. Vestibulum consectetur faucibus ante, eu posuere quam ornare et. Aenean vitae dictum neque. Donec nisl justo, porta a sapien quis, luctus congue diam. Integer id metus dolor. Maecenas euismod vulputate leo in lobortis. Vestibulum dignissim finibus est, sed sollicitudin ipsum hendrerit ac. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque diam lorem, mattis vel orci interdum, tempor luctus elit. Ut id porta nisi. In dignissim quam urna, et iaculis lectus eleifend ut. Nam vitae felis ac risus tincidunt elementum. Nunc hendrerit augue a nulla hendrerit rutrum. Integer euismod est at orci eleifend, sed laoreet justo auctor. Sed sem orci, imperdiet at erat non, vehicula convallis libero. Aenean hendrerit cursus leo ut malesuada. Donec eu placerat lorem. Sed mattis tristique lorem, eget placerat erat scelerisque faucibus. Vivamus eleifend in augue id mollis. Nulla vehicula, metus eu auctor accumsan, lectus sapien pretium dui, non scelerisque magna augue a sem. Suspendisse sem enim, mattis ac augue non, placerat accumsan sem. Vivamus hendrerit, sapien sit amet consectetur pulvinar, ante nisl pulvinar purus, a ullamcorper dolor leo id arcu. Aliquam sed metus arcu. Quisque erat libero, tincidunt non dictum vel, bibendum ut ante. Nunc vel imperdiet risus. Sed sit amet porta enim. Mauris metus tortor, mattis vitae convallis vitae, dictum nec dui. Aliquam volutpat nisi consequat, gravida tellus eget, cursus purus. Nunc at venenatis enim. Proin dictum, magna ultrices tempor aliquam, metus lacus consectetur odio, quis pharetra massa est at est. Nullam non nibh massa. Duis scelerisque massa a luctus vehicula. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec tortor lacus, consequat eget neque sit amet, imperdiet porttitor felis. Duis ante erat, cursus sed venenatis nec, semper sollicitudin felis. Sed tincidunt et tortor quis vehicula. Morbi porta dapibus quam quis iaculis. Nunc mauris dolor, rutrum non pellentesque consectetur, ornare quis lacus. Maecenas eget feugiat odio. Proin vitae magna ut justo bibendum lacinia consequat at orci. Phasellus tincidunt lorem eu justo mollis sagittis. Maecenas fermentum nunc augue, et bibendum augue varius venenatis. Donec eu purus at tellus ullamcorper imperdiet. Duis id orci laoreet, semper eros et, tincidunt nisl. Suspendisse vehicula sed enim ut dignissim. Nam ornare leo eu nibh malesuada, eget ullamcorper sapien egestas. In at commod1",
        errorThrown: false,
        expectedError: 406,
      });
      h.checkLMSSetValue({
        api: apiInitialized({
          cmi: {
            interactions: {
              "0": {
                id: "interaction-id-1",
                type: "long-fill-in",
              },
            },
          },
        }),
        fieldName: "cmi.interactions.0.type",
        valueToTest: "unknown",
        errorThrown: false,
        expectedError: 406,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.type",
        valueToTest: "true-false",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.description",
        valueToTest: "this is an interaction",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.timestamp",
        valueToTest: "PT1S",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.weighting",
        valueToTest: 1.0,
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.learner_response",
        valueToTest: "true",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.interactions.0.latency",
        valueToTest: "PT1S",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.objectives.0.success_status",
        valueToTest: "passed",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.objectives.0.completion_status",
        valueToTest: "completed",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.objectives.0.progress_measure",
        valueToTest: 1.0,
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.objectives.0.description",
        valueToTest: "this is an objective",
        errorThrown: false,
        expectedError: 408,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms.0.comment",
        valueToTest: "comment",
        errorThrown: false,
        expectedError: 404,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms.0.location",
        valueToTest: "location",
        errorThrown: false,
        expectedError: 404,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.comments_from_lms.0.timestamp",
        valueToTest: scorm2004Values.validTimestamps[0],
        errorThrown: false,
        expectedError: 404,
      });
      h.checkLMSSetValue({
        api: apiInitialized(),
        fieldName: "cmi.unknown",
        valueToTest: "uknown",
        errorThrown: false,
        expectedError: 401,
      });
    });
  });

  describe("reset()", () => {
    it("should reset all CMI values to their default state", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.learner_id = "student_1";
      scorm2004API.cmi.session_time = "PT1H0M0S";
      scorm2004API.adl.nav.request = "continue";

      scorm2004API.reset();

      expect(scorm2004API.cmi.interactions).toEqual(new CMIInteractions());
      expect(scorm2004API.cmi.learner_id).toEqual("student_1");
      expect(scorm2004API.adl.nav).toEqual(new ADLNav());
    });

    it("should keep original settings", (): void => {
      const scorm2004API = api({
        dataCommitFormat: "flattened",
        autocommit: true,
      });

      scorm2004API.reset();

      expect(scorm2004API.settings.sendFullCommit).toEqual(DefaultSettings.sendFullCommit);
      expect(scorm2004API.settings.dataCommitFormat).toEqual("flattened");
      expect(scorm2004API.settings.autocommit).toEqual(true);
    });

    it("should be able to override original settings", (): void => {
      const scorm2004API = api({
        ...DefaultSettings,
        dataCommitFormat: "flattened",
        autocommit: true,
        logLevel: LogLevelEnum.NONE,
      });

      scorm2004API.reset({
        alwaysSendTotalTime: !DefaultSettings.alwaysSendTotalTime,
      });

      expect(scorm2004API.settings.sendFullCommit).toEqual(DefaultSettings.sendFullCommit);
      expect(scorm2004API.settings.dataCommitFormat).toEqual("flattened");
      expect(scorm2004API.settings.autocommit).toEqual(true);
      expect(scorm2004API.settings.alwaysSendTotalTime).toEqual(
        !DefaultSettings.alwaysSendTotalTime,
      );
    });

    it("should call commonReset from the superclass", (): void => {
      const scorm2004API = api();
      const commonResetSpy = vi.spyOn(scorm2004API, "commonReset");

      scorm2004API.reset();

      expect(commonResetSpy).toHaveBeenCalledOnce();
      // commonResetSpy.restore() - not needed with vi.restoreAllMocks()
    });
  });

  describe("Scorm2004API.Finish", () => {
    let scorm2004API = api();

    beforeEach(() => {
      scorm2004API = api();
      terminateStub = vi.spyOn(scorm2004API, "terminate").mockImplementation(async () => "");
      processListenersSpy = vi
        .spyOn(scorm2004API, "processListeners")
        .mockImplementation((functionName: string, CMIElement?: string, value?: any) => {});
    });

    describe("lmsFinish()", () => {
      it("should call internalFinish and return SCORM_TRUE", async (): Promise<void> => {
        const internalFinishStub = vi
          .spyOn(scorm2004API, "internalFinish")
          .mockImplementation(async () => global_constants.SCORM_TRUE);
        const result = scorm2004API.lmsFinish();
        expect(result).toEqual(global_constants.SCORM_TRUE);
        expect(internalFinishStub).toHaveBeenCalledOnce();
      });
    });

    describe("internalFinish()", () => {
      const navActions: { [key: string]: string } = {
        previous: "SequencePrevious",
        continue: "SequenceNext",
        choice: "SequenceChoice",
        jump: "SequenceJump",
        "{target=next-sco}choice": "SequenceChoice",
        exit: "SequenceExit",
        exitAll: "SequenceExitAll",
        abandon: "SequenceAbandon",
        abandonAll: "SequenceAbandonAll",
      };

      it("should call terminate with 'Terminate' and true", async (): Promise<void> => {
        terminateStub.mockImplementation(async () => global_constants.SCORM_TRUE);
        await scorm2004API.internalFinish();
        expect(terminateStub).toHaveBeenCalledWith("Terminate", true);
      });

      for (const navRequest of Object.keys(navActions)) {
        it(`should process the correct navigation action based on adl.nav.request = ${navRequest}`, async () => {
          terminateStub.mockImplementation(async () => global_constants.SCORM_TRUE);
          scorm2004API.adl.nav.request = navRequest;
          await scorm2004API.internalFinish();
          expect(processListenersSpy.mock.calls[0][0]).toEqual(navActions[navRequest]);
        });
      }

      it("should process 'SequenceNext' if adl.nav.request is '_none_' and autoProgress is true", async (): Promise<void> => {
        terminateStub.mockImplementation(async () => global_constants.SCORM_TRUE);
        scorm2004API.adl.nav.request = "_none_";
        scorm2004API.settings.autoProgress = true;
        await scorm2004API.internalFinish();
        expect(processListenersSpy.mock.calls[0][0]).toEqual("SequenceNext");
      });

      it("should not process any action if adl.nav.request is '_none_' and autoProgress is false", async (): Promise<void> => {
        terminateStub.mockImplementation(async () => global_constants.SCORM_TRUE);
        scorm2004API.adl.nav.request = "_none_";
        scorm2004API.settings.autoProgress = false;
        await scorm2004API.internalFinish();
        expect(processListenersSpy).not.toHaveBeenCalled();
      });

      it("should return the result of terminate", async (): Promise<void> => {
        terminateStub.mockImplementation(async () => global_constants.SCORM_TRUE);
        const result = await scorm2004API.internalFinish();
        expect(result).toEqual(global_constants.SCORM_TRUE);
      });
    });
  });

  describe("lmsCommit()", () => {
    const scorm2004API = api();

    it("should call commit and return SCORM_TRUE", async (): Promise<void> => {
      const commitStub = vi
        .spyOn(scorm2004API, "commit")
        .mockImplementation(async () => global_constants.SCORM_TRUE);
      const result = scorm2004API.lmsCommit();
      expect(result).toEqual(global_constants.SCORM_TRUE);
      expect(commitStub).toHaveBeenCalledOnce();
      // commitStub.restore() - not needed with vi.restoreAllMocks()
    });
  });

  describe("loadFromFlattenedJSON()", () => {
    it("should load data, even if out of order", (): void => {
      const scorm2004API = api();
      scorm2004API.loadFromFlattenedJSON(
        {
          "cmi.learner_id": "123",
          "cmi.learner_name": "Bob The Builder",
          "cmi.suspend_data":
            "viewed=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31|lastviewedslide=31|7#1##,3,3,3,7,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11#0#b5e89fbb-7cfb-46f0-a7cb-758165d3fe7e=236~262~2542812732762722742772682802752822882852892872832862962931000~3579~32590001001010101010101010101001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001010010010010010010010010011010010010010010010010010010010010112101021000171000~236a71d398e-4023-4967-88fe-1af18721422d06passed6failed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000105wrong110000000000000000000000000000000000~3185000000000000000000000000000000000000000000000000000000000000000000000000000000000~283~2191w11~21113101w41689~256~2100723031840~21007230314509062302670~2110723031061120000000000000000000~240~234531618~21601011000100000002814169400,#-1",
          "cmi.interactions.0.timestamp": "2018-08-26T11:05:21",
          "cmi.interactions.0.weighting": "1",
          "cmi.interactions.0.learner_response": "HTH",
          "cmi.interactions.0.id": "Question14_1",
          "cmi.interactions.0.type": "choice",
          "cmi.interactions.0.result": "incorrect",
          "cmi.interactions.0.latency": "PT2M30S",
          "cmi.interactions.0.objectives.0.id": "Question14_1",
          "cmi.interactions.0.objectives.0.correct_responses.0.pattern": "CPR",
          "adl.nav.request": "continue",
          "adl.nav.request_valid.choice.{target=sco-id}": "true",
        },
        "",
      );
      scorm2004API.lmsInitialize();
      expect(scorm2004API.lmsGetValue("cmi.interactions.0.id")).toEqual("Question14_1");
    });
  });

  describe("renderCommitCMI()", () => {
    it("should calculate total time when terminateCommit passed", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.total_time = "PT12H34M56S";
      scorm2004API.cmi.session_time = "PT23H59M59S";
      const cmiExport = scorm2004API.renderCommitCMI(true) as StringKeyMap;
      const exportCmi = cmiExport.cmi as StringKeyMap;
      expect(exportCmi).toHaveProperty("total_time");
      expect(exportCmi.total_time).toEqual("P1DT12H34M55S");
    });

    it("should return flattened format when dataCommitFormat is 'flattened'", function (): void {
      const scorm2004API = api({
        ...DefaultSettings,
        dataCommitFormat: "flattened",
      });
      const result = scorm2004API.renderCommitCMI(false);
      expect(result).toBeInstanceOf(Object);
      expect({}.hasOwnProperty.call(result, "cmi.learner_id")).toBe(true);
    });

    it("should return params format when dataCommitFormat is 'params'", function (): void {
      const scorm2004API = api();
      scorm2004API.settings.dataCommitFormat = "params";
      const result = scorm2004API.renderCommitCMI(false);
      expect(result).toBeInstanceOf(Array);
      expect(result).toContain("cmi.credit=credit");
      // Add more specific assertions based on expected params output
    });

    it("should return JSON format when dataCommitFormat is 'json'", function (): void {
      const scorm2004API = api();
      scorm2004API.settings.dataCommitFormat = "json";
      const result = scorm2004API.renderCommitCMI(false) as StringKeyMap;
      expect(result).toBeInstanceOf(Object);
      expect(result).toHaveProperty("cmi");
      expect(result.cmi).toBeInstanceOf(Object);
      const resultCmi = result.cmi as StringKeyMap;
      expect(resultCmi).toHaveProperty("credit");
      expect(resultCmi.credit).toEqual("credit");
      // Add more specific assertions based on expected JSON output
    });

    it("should include total_time if terminateCommit is true", function (): void {
      const scorm2004API = api();
      const spy = vi.spyOn(scorm2004API.cmi, "getCurrentTotalTime");
      const cmiExport = scorm2004API.renderCommitCMI(true) as StringKeyMap;
      expect(spy).toHaveBeenCalledOnce();
      const exportCmi = cmiExport.cmi as StringKeyMap;
      expect(exportCmi).toHaveProperty("total_time");
      expect(exportCmi.total_time).toEqual(spy.mock.results[0].value);
      // spy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should not include total_time if terminateCommit is false", function (): void {
      const scorm2004API = api();
      const spy = vi.spyOn(scorm2004API.cmi, "getCurrentTotalTime");
      const cmiExport = scorm2004API.renderCommitCMI(false) as StringKeyMap;
      expect(spy).not.toHaveBeenCalled();
      expect(cmiExport.cmi).not.toHaveProperty("total_time");
      // spy.restore() - not needed with vi.restoreAllMocks()
    });
  });

  describe("renderCommitObject()", () => {
    it("should render commit object with default settings and no score", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.completion_status = "incomplete";
      scorm2004API.cmi.total_time = "P12H34M56S";
      scorm2004API.cmi.session_time = "P23H59M59S";
      const commitObject = scorm2004API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual("unknown");
      expect(commitObject.completionStatus).toEqual("incomplete");
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      expect(runtimeCmi.completion_status).toEqual("incomplete");
      expect(commitObject.totalTimeSeconds).toEqual(
        12 * 3600 + 34 * 60 + 56 + (23 * 3600 + 59 * 60 + 59),
      );
    });

    it("should render commit object with score data", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.completion_status = "completed";
      scorm2004API.cmi.score.raw = "85";
      scorm2004API.cmi.score.min = "0";
      scorm2004API.cmi.score.max = "100";
      scorm2004API.cmi.score.scaled = "0.85";
      const commitObject = scorm2004API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual("unknown");
      expect(commitObject.completionStatus).toEqual("completed");
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      const runtimeScore = runtimeCmi.score as StringKeyMap;
      expect(runtimeCmi.completion_status).toEqual("completed");
      expect(runtimeScore.raw).toEqual("85");
      expect(runtimeScore.min).toEqual("0");
      expect(runtimeScore.max).toEqual("100");
      expect(runtimeScore.scaled).toEqual("0.85");
      expect(commitObject.totalTimeSeconds).toEqual(0);
      expect(commitObject.score).toEqual({
        raw: 85,
        min: 0,
        max: 100,
        scaled: 0.85,
      });
    });

    it("should render commit object with completion and success status", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.success_status = SuccessStatus.PASSED;
      const commitObject = scorm2004API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual(SuccessStatus.PASSED);
      expect(commitObject.completionStatus).toEqual(CompletionStatus.UNKNOWN);
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      expect(runtimeCmi.success_status).toEqual(SuccessStatus.PASSED);
    });

    it("should render commit object with failed success status", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.success_status = SuccessStatus.FAILED;
      const commitObject = scorm2004API.renderCommitObject(true);
      expect(commitObject.successStatus).toEqual(SuccessStatus.FAILED);
      expect(commitObject.completionStatus).toEqual(CompletionStatus.UNKNOWN);
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      expect(runtimeCmi.success_status).toEqual(SuccessStatus.FAILED);
    });

    it("should calculate total time when terminateCommit is true", (): void => {
      const scorm2004API = api();
      scorm2004API.cmi.total_time = "P12H34M56S";
      scorm2004API.cmi.session_time = "P23H59M59S";
      const commitObject = scorm2004API.renderCommitObject(true);
      const runtimeCmi = commitObject.runtimeData.cmi as StringKeyMap;
      expect(runtimeCmi.total_time).toEqual("P1DT12H34M55S");
    });
  });

  describe("lmsGetDiagnostic()", () => {
    it("should return diagnostic information for a given error code", (): void => {
      const scorm2004API = api();
      const errorCode = 101;
      const diagnosticInfo = scorm2004API.lmsGetDiagnostic(errorCode);
      expect(diagnosticInfo).toEqual(
        scorm2004_constants.error_descriptions[errorCode].detailMessage,
      );
    });

    it("should return an empty string for an unknown error code", (): void => {
      const scorm2004API = api();
      const unknownErrorCode = 9999;
      const diagnosticInfo = scorm2004API.lmsGetDiagnostic(unknownErrorCode);
      expect(diagnosticInfo).toEqual("");
    });
  });

  describe("lmsGetErrorString()", () => {
    it("should return the error string for a given error code", (): void => {
      const scorm2004API = api();
      const errorCode = 101;
      const errorString = scorm2004API.lmsGetErrorString(errorCode);
      expect(errorString).toEqual("General Exception");
    });

    it("should return an empty string for an unknown error code", (): void => {
      const scorm2004API = api();
      const unknownErrorCode = 9999;
      const errorString = scorm2004API.lmsGetErrorString(unknownErrorCode);
      expect(errorString).toEqual("");
    });
  });

  describe("replaceWithAnotherScormAPI()", () => {
    it("should replace the current API with another API", (): void => {
      const firstAPI = api();
      const secondAPI = api();

      firstAPI.cmi.learner_id = "student_1";
      firstAPI.adl.nav.request = "continue";
      secondAPI.cmi.learner_id = "student_2";
      secondAPI.adl.nav.request = "exit";

      firstAPI.replaceWithAnotherScormAPI(secondAPI);
      expect(firstAPI.cmi.learner_id).toEqual("student_2");
      expect(firstAPI.adl.nav.request).toEqual("exit");
    });
  });

  describe("checkCorrectResponseValue()", () => {
    it("should properly handle the true-false response type for unknown value", (): void => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue("api", "true-false", ["unknown"], "true");
      expect(scorm2004API.lmsGetLastError()).toEqual(String(406));
    });

    it("should properly handle the true-false response type for correct value", (): void => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue("api", "true-false", ["true"], "true");
      expect(scorm2004API.lmsGetLastError()).toEqual(String(0));
    });

    it("should properly handle the choice response type for value over 4000 characters", (): void => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue("api", "choice", ["x".repeat(4001)], "true");
      expect(scorm2004API.lmsGetLastError()).toEqual(String(406));
    });

    it("should properly handle the choice response type for correct value", () => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue("api", "choice", ["true"], "true");
      expect(scorm2004API.lmsGetLastError()).toEqual(String(0));
    });

    it("should properly handle the fill-in response type for correct value", () => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue("api", "fill-in", ["true"], "true");
      expect(scorm2004API.lmsGetLastError()).toEqual(String(0));
    });

    it("should properly handle the long-fill-in response type for correct value", () => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue("api", "long-fill-in", ["true"], "true");
      expect(scorm2004API.lmsGetLastError()).toEqual(String(0));
    });

    it("should properly handle the matching response type for correct value", () => {
      const scorm2004API = basicApi();
      scorm2004API.checkCorrectResponseValue(
        "api",
        "matching",
        ["{order_matters=true}0[.]1"],
        "true",
      );
      expect(scorm2004API.lmsGetLastError()).toEqual(String(0));
    });
  });

  describe("removeCorrectResponsePrefixes()", () => {
    it("should remove the prefix from the string", () => {
      const scorm2004API = basicApi();
      const input = "{order_matters=true}correctResponse";
      const result = scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(result).toBe("correctResponse");
    });

    it("should return the original string if no prefix is present", () => {
      const scorm2004API = basicApi();
      const input = "correctResponse";
      const result = scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(result).toBe("correctResponse");
    });

    it("should handle empty strings correctly", () => {
      const scorm2004API = basicApi();
      const input = "";
      const result = scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(result).toBe("");
    });

    it("should handle multiple prefixes correctly", () => {
      const scorm2004API = basicApi();
      const input = "{lang=en}{order_matters=true}{case_matters=false}correctResponse";
      const result = scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(result).toBe("correctResponse");
    });

    it("should throw an error for invalid order_matters value", () => {
      const scorm2004API = basicApi();
      const input = "{order_matters=invalid}correctResponse";
      scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(scorm2004API.lmsGetLastError()).toEqual(String(406));
    });

    it("should throw an error for invalid case_matters value", () => {
      const scorm2004API = basicApi();
      const input = "{case_matters=invalid}correctResponse";
      scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(scorm2004API.lmsGetLastError()).toEqual(String(406));
    });

    it("should ignore an unknown prefix", () => {
      const scorm2004API = basicApi();
      const input = "{unknown=true}correctResponse";
      const result = scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(result).toBe("{unknown=true}correctResponse");
    });

    it("should throw an error with an invalid language code", () => {
      const scorm2004API = basicApi();
      const input = "{lang=xyz}correctResponse";
      scorm2004API.removeCorrectResponsePrefixes("api", input);
      expect(scorm2004API.lmsGetLastError()).toEqual(String(406));
    });
  });

  describe("getChildElement()", () => {
    it("should handle missing interaction type", () => {
      const scorm2004API = apiInitialized({
        cmi: {
          interactions: {
            childArray: [{ id: "interaction-id-1" }],
          },
        },
      });
      const result = scorm2004API.getChildElement(
        "cmi.interactions.0.correct_responses.0",
        "response-value",
        true,
      );
      expect(result).toBeNull();
      expect(scorm2004API.lmsGetLastError()).toEqual(String(408));
    });

    it("should call throwSCORMError with the correct arguments in createCorrectResponsesObject", () => {
      const scorm2004API = basicApi();
      const interaction = {
        id: "interaction-id-1",
        type: "invalid-type",
        correct_responses: { _count: 1 },
      };

      // Initialize the childArray with an empty array
      scorm2004API.cmi.interactions.childArray = [];

      // Add the interaction object to the childArray
      scorm2004API.cmi.interactions.childArray[0] = interaction;

      vi.spyOn(scorm2004API, "isInitialized").mockReturnValue(true);
      const throwSCORMErrorSpy = vi.spyOn(scorm2004API, "throwSCORMError");

      try {
        scorm2004API.getChildElement(
          "cmi.interactions.0.correct_responses.0",
          "response-value",
          true,
        );
      } catch (e) {
        // Expected to throw, so we catch it to prevent the test from failing
      }

      expect(throwSCORMErrorSpy).toHaveBeenCalledWith(
        "cmi.interactions.0.correct_responses.0",
        351,
        `Incorrect Response Type: ${interaction.type}`,
      );
    });
  });

  describe("storeData()", () => {
    it('should set cmi.completion_status to "completed"', () => {
      const scorm2004API = api();
      scorm2004API.cmi.credit = "credit";
      scorm2004API.cmi.completion_threshold = "0.6";
      scorm2004API.cmi.progress_measure = "0.75";
      scorm2004API.storeData(true);
      expect(scorm2004API.cmi.completion_status).toEqual("completed");
    });
    it('should set cmi.completion_status to "incomplete"', () => {
      const scorm2004API = api();
      scorm2004API.cmi.credit = "credit";
      scorm2004API.cmi.completion_threshold = "0.7";
      scorm2004API.cmi.progress_measure = "0.6";
      scorm2004API.storeData(true);
      expect(scorm2004API.cmi.completion_status).toEqual("incomplete");
    });
    it('should set cmi.success_status to "passed"', () => {
      const scorm2004API = api();
      scorm2004API.cmi.credit = "credit";
      scorm2004API.cmi.score.scaled = "0.7";
      scorm2004API.cmi.scaled_passing_score = "0.6";
      scorm2004API.storeData(true);
      expect(scorm2004API.cmi.success_status).toEqual("passed");
    });
    it('should set cmi.success_status to "failed"', () => {
      const scorm2004API = api();
      scorm2004API.cmi.credit = "credit";
      scorm2004API.cmi.score.scaled = "0.6";
      scorm2004API.cmi.scaled_passing_score = "0.7";
      scorm2004API.storeData(true);
      expect(scorm2004API.cmi.success_status).toEqual("failed");
    });
  });

  describe("Event Handlers", () => {
    it("Should handle SetValue.cmi.learner_id event", () => {
      const scorm2004API = apiInitialized();
      const callback = vi.fn();
      scorm2004API.on("SetValue.cmi.learner_id", callback);
      scorm2004API.lmsSetValue("cmi.learner_id", "@jcputney");
      expect(callback).toHaveBeenCalled();
    });

    it("Should handle SetValue.cmi.* event", () => {
      const scorm2004API = apiInitialized();
      const callback = vi.fn();
      scorm2004API.on("SetValue.cmi.*", callback);
      scorm2004API.lmsSetValue("cmi.learner_id", "@jcputney");
      expect(callback).toHaveBeenCalled();
    });

    it("Should handle CommitSuccess event", async () => {
      const scorm2004API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm2004",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm2004API.lmsInitialize();

      const callback = vi.fn();
      scorm2004API.on("CommitSuccess", callback);

      scorm2004API.lmsSetValue("cmi.session_time", "PT1M0S");
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();

      expect(callback).toHaveBeenCalled();
    });

    it("Should clear all event listeners for CommitSuccess", async () => {
      const scorm2004API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm2004",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm2004API.lmsInitialize();

      const callback = vi.fn();
      const callback2 = vi.fn();
      scorm2004API.on("CommitSuccess", callback);
      scorm2004API.on("CommitSuccess", callback2);

      scorm2004API.lmsSetValue("cmi.session_time", "PT1M0S");

      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();

      scorm2004API.clear("CommitSuccess");

      scorm2004API.lmsSetValue("cmi.session_time", "PT1M0S");
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();

      expect(callback.mock.calls.length).toBe(1);
      expect(callback2.mock.calls.length).toBe(1);
    });

    it("Should clear only the specific event listener for CommitSuccess", async () => {
      const scorm2004API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm2004",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm2004API.lmsInitialize();

      const callback = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      const callback4 = vi.fn();

      scorm2004API.on("CommitSuccess", callback);
      scorm2004API.on("CommitSuccess", callback2);
      scorm2004API.on("Commit", callback3);
      scorm2004API.on("SetValue", callback4);

      // First commit
      scorm2004API.lmsSetValue("cmi.session_time", "PT1M0S");

      // Wait for autocommit to trigger
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
      expect(callback3).toHaveBeenCalledOnce();
      expect(callback4).toHaveBeenCalledOnce();

      // Remove one of the CommitSuccess listeners
      scorm2004API.off("CommitSuccess", callback);

      // Second commit
      scorm2004API.SetValue("cmi.session_time", "PT2M0S");

      // Wait for autocommit to trigger - let the REAL autocommit code run
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();

      // First callback should still have only been called once (it was removed)
      expect(callback.mock.calls.length).toBe(1);

      // Second callback should have been called twice (once for each commit)
      expect(callback2.mock.calls.length).toBe(2);

      // Other callbacks should have been called twice as well
      expect(callback3.mock.calls.length).toBe(2);
      expect(callback4.mock.calls.length).toBe(2);
    });

    it("Should handle CommitError event", async () => {
      // Create a simpler test that doesn't rely on autocommit
      const scorm2004API = api({
        ...DefaultSettings,
        lmsCommitUrl: "/scorm2004/error",
        autocommit: false, // Disable autocommit to simplify the test
      });
      scorm2004API.lmsInitialize();

      const callback = vi.fn();
      scorm2004API.on("CommitError", callback);

      // Manually trigger the error callback
      scorm2004API.processListeners("CommitError", "api", null);

      expect(callback).toHaveBeenCalled();
    }, 1000); // Add a timeout to prevent the test from hanging

    it("Should handle CommitError event when offline", async () => {
      const scorm2004API = api({
        ...DefaultSettings,
        ...{
          lmsCommitUrl: "/scorm2004/does_not_exist",
          autocommit: true,
          autocommitSeconds: 1,
        },
      });
      scorm2004API.lmsInitialize();

      const callback = vi.fn();
      scorm2004API.on("CommitError", callback);

      // Set a value to trigger a commit
      scorm2004API.SetValue("cmi.session_time", "PT1M0S");

      // Wait for autocommit to trigger
      vi.advanceTimersByTime(2000);
      await vi.runAllTimersAsync();

      expect(callback).toHaveBeenCalled();
    });
  });
});
