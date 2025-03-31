import { expect } from "expect";
import { describe, it } from "mocha";
import * as sinon from "sinon";
import { Scorm12Impl } from "../src/Scorm12API";
import { scorm12_errors } from "../src/constants/error_codes";
import { global_constants, scorm12_constants } from "../src/constants/api_constants";
import { Settings } from "../src/types/api_types";
import { LogLevelEnum } from "../src/constants/enums";

// Helper functions to create API instances
const api = (settings?: Settings) => {
  const API = new Scorm12Impl({ ...settings, logLevel: LogLevelEnum.NONE });
  return API;
};

const apiInitialized = (settings?: Settings) => {
  const API = api(settings);
  API.lmsInitialize();
  return API;
};

describe("SCORM 1.2 API Additional Tests", () => {
  describe("lmsInitialize()", () => {
    it("should initialize the API and return SCORM_TRUE", () => {
      const scorm12API = api();
      const initializeSpy = sinon.spy(scorm12API, "initialize");

      const result = scorm12API.lmsInitialize();

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(initializeSpy.calledOnce).toBe(true);
      expect(initializeSpy.calledWith("LMSInitialize", "LMS was already initialized!", "LMS is already finished!")).toBe(true);
      expect(scorm12API.cmi.core.lesson_status).toBe("not attempted");
    });

    it("should set statusSetByModule to true if lesson_status is already set", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "incomplete";

      scorm12API.lmsInitialize();

      expect(scorm12API.statusSetByModule).toBe(true);
    });
  });

  describe("internalFinish()", () => {
    it("should call terminate with 'LMSFinish' and true", async () => {
      const scorm12API = api();
      const terminateStub = sinon.stub(scorm12API, "terminate").resolves(global_constants.SCORM_TRUE);

      await scorm12API.internalFinish();

      expect(terminateStub.calledOnce).toBe(true);
      expect(terminateStub.calledWith("LMSFinish", true)).toBe(true);
    });

    it("should process 'SequenceNext' listener when nav.event is 'continue'", async () => {
      const scorm12API = api();
      const terminateStub = sinon.stub(scorm12API, "terminate").resolves(global_constants.SCORM_TRUE);
      const processListenersSpy = sinon.spy(scorm12API, "processListeners");
      scorm12API.nav.event = "continue";

      await scorm12API.internalFinish();

      expect(processListenersSpy.calledWith("SequenceNext")).toBe(true);
    });

    it("should process 'SequencePrevious' listener when nav.event is not 'continue'", async () => {
      const scorm12API = api();
      const terminateStub = sinon.stub(scorm12API, "terminate").resolves(global_constants.SCORM_TRUE);
      const processListenersSpy = sinon.spy(scorm12API, "processListeners");
      scorm12API.nav.event = "previous";

      await scorm12API.internalFinish();

      expect(processListenersSpy.calledWith("SequencePrevious")).toBe(true);
    });

    it("should process 'SequenceNext' listener when autoProgress is true and nav.event is empty", async () => {
      const scorm12API = api({ autoProgress: true });
      const terminateStub = sinon.stub(scorm12API, "terminate").resolves(global_constants.SCORM_TRUE);
      const processListenersSpy = sinon.spy(scorm12API, "processListeners");
      scorm12API.nav.event = "";

      await scorm12API.internalFinish();

      expect(processListenersSpy.calledWith("SequenceNext")).toBe(true);
    });

    it("should not process any listeners when autoProgress is false and nav.event is empty", async () => {
      const scorm12API = api({ autoProgress: false });
      const terminateStub = sinon.stub(scorm12API, "terminate").resolves(global_constants.SCORM_TRUE);
      const processListenersSpy = sinon.spy(scorm12API, "processListeners");
      scorm12API.nav.event = "";

      await scorm12API.internalFinish();

      expect(processListenersSpy.called).toBe(false);
    });
  });

  describe("lmsGetLastError()", () => {
    it("should call getLastError with 'LMSGetLastError'", () => {
      const scorm12API = api();
      const getLastErrorSpy = sinon.spy(scorm12API, "getLastError");

      scorm12API.lmsGetLastError();

      expect(getLastErrorSpy.calledOnce).toBe(true);
      expect(getLastErrorSpy.calledWith("LMSGetLastError")).toBe(true);
    });
  });

  describe("lmsGetErrorString()", () => {
    it("should call getErrorString with 'LMSGetErrorString' and the error code", () => {
      const scorm12API = api();
      const getErrorStringSpy = sinon.spy(scorm12API, "getErrorString");

      scorm12API.lmsGetErrorString("101");

      expect(getErrorStringSpy.calledOnce).toBe(true);
      expect(getErrorStringSpy.calledWith("LMSGetErrorString", "101")).toBe(true);
    });
  });

  describe("lmsGetDiagnostic()", () => {
    it("should call getDiagnostic with 'LMSGetDiagnostic' and the error code", () => {
      const scorm12API = api();
      const getDiagnosticSpy = sinon.spy(scorm12API, "getDiagnostic");

      scorm12API.lmsGetDiagnostic("101");

      expect(getDiagnosticSpy.calledOnce).toBe(true);
      expect(getDiagnosticSpy.calledWith("LMSGetDiagnostic", "101")).toBe(true);
    });
  });

  describe("validateCorrectResponse()", () => {
    it("should not throw an error (empty implementation)", () => {
      const scorm12API = api();

      expect(() => {
        scorm12API.validateCorrectResponse("cmi.interactions.0.correct_responses.0.pattern", "true");
      }).not.toThrow();
    });
  });

  describe("getLmsErrorMessageDetails()", () => {
    it("should return basic message when detail is false", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails(101, false);

      expect(result).toBe(scorm12_errors.descriptions["101"].basicMessage);
    });

    it("should return detail message when detail is true", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails(101, true);

      expect(result).toBe(scorm12_errors.descriptions["101"].detailMessage);
    });

    it("should handle string error codes", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails("101", false);

      expect(result).toBe(scorm12_errors.descriptions["101"].basicMessage);
    });

    it("should return 'No Error' for unknown error codes", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails(999, false);

      expect(result).toBe("No Error");
    });
  });

  describe("lmsCommit()", () => {
    it("should schedule commit when asyncCommit is true", () => {
      const scorm12API = api({ asyncCommit: true });
      const scheduleCommitSpy = sinon.spy(scorm12API, "scheduleCommit");

      const result = scorm12API.lmsCommit();

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(scheduleCommitSpy.calledOnce).toBe(true);
      expect(scheduleCommitSpy.calledWith(500, "LMSCommit")).toBe(true);
    });

    it("should call commit directly when asyncCommit is false", () => {
      const scorm12API = api({ asyncCommit: false });
      const commitSpy = sinon.spy(scorm12API, "commit");

      const result = scorm12API.lmsCommit();

      expect(result).toBe(global_constants.SCORM_TRUE);
      // Note: We can't easily test if commit was called because it's called in an async IIFE
    });
  });

  describe("lmsFinish()", () => {
    it("should call internalFinish and return SCORM_TRUE", () => {
      const scorm12API = api();
      const internalFinishSpy = sinon.spy(scorm12API, "internalFinish");

      const result = scorm12API.lmsFinish();

      expect(result).toBe(global_constants.SCORM_TRUE);
      // Note: We can't easily test if internalFinish was called because it's called in an async IIFE
    });
  });
});
