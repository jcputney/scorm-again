import { describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { global_constants, scorm12_constants } from "../../src";
import { Settings } from "../../src/types/api_types";
import { LogLevelEnum } from "../../src/constants/enums";

// Helper functions to create API instances
const api = (settings?: Settings) => {
  return new Scorm12API({ ...settings, logLevel: LogLevelEnum.NONE });
};

describe("SCORM 1.2 API Additional Tests", () => {
  describe("lmsInitialize()", () => {
    it("should initialize the API and return SCORM_TRUE", () => {
      const scorm12API = api();
      const initializeSpy = vi.spyOn(scorm12API, "initialize");

      const result = scorm12API.lmsInitialize();

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(initializeSpy).toHaveBeenCalledOnce();
      expect(initializeSpy).toHaveBeenCalledWith(
        "LMSInitialize",
        "LMS was already initialized!",
        "LMS is already finished!",
      );
      expect(scorm12API.cmi.core.lesson_status).toBe("not attempted");
    });

    it("should set statusSetByModule to true if lesson_status is already set", () => {
      const scorm12API = api();
      scorm12API.cmi.core.lesson_status = "incomplete";

      scorm12API.lmsInitialize();

      expect(scorm12API.statusSetByModule).toBe(true);
    });
  });

  describe("lmsFinish()", () => {
    it("should call terminate with 'LMSFinish' and true", () => {
      const scorm12API = api();
      const terminateStub = vi
        .spyOn(scorm12API, "terminate")
        .mockImplementation(() => global_constants.SCORM_TRUE);

      scorm12API.lmsFinish();

      expect(terminateStub).toHaveBeenCalledOnce();
      expect(terminateStub).toHaveBeenCalledWith("LMSFinish", true);
    });

    it("should process 'SequenceNext' listener when nav.event is 'continue'", () => {
      const scorm12API = api();
      vi.spyOn(scorm12API, "terminate").mockImplementation(() => global_constants.SCORM_TRUE);
      const processListenersSpy = vi.spyOn(scorm12API, "processListeners");
      scorm12API.nav.event = "continue";

      scorm12API.lmsFinish();

      expect(processListenersSpy).toHaveBeenCalledWith("SequenceNext");
    });

    it("should process 'SequencePrevious' listener when nav.event is not 'continue'", () => {
      const scorm12API = api();
      vi.spyOn(scorm12API, "terminate").mockImplementation(() => global_constants.SCORM_TRUE);
      const processListenersSpy = vi.spyOn(scorm12API, "processListeners");
      scorm12API.nav.event = "previous";

      scorm12API.lmsFinish();

      expect(processListenersSpy).toHaveBeenCalledWith("SequencePrevious");
    });

    it("should process 'SequenceNext' listener when autoProgress is true and nav.event is empty", () => {
      const scorm12API = api({ autoProgress: true });
      vi.spyOn(scorm12API, "terminate").mockImplementation(() => global_constants.SCORM_TRUE);
      const processListenersSpy = vi.spyOn(scorm12API, "processListeners");
      scorm12API.nav.event = "";

      scorm12API.lmsFinish();

      expect(processListenersSpy).toHaveBeenCalledWith("SequenceNext");
    });

    it("should not process any listeners when autoProgress is false and nav.event is empty", () => {
      const scorm12API = api({ autoProgress: false });
      vi.spyOn(scorm12API, "terminate").mockImplementation(() => global_constants.SCORM_TRUE);
      const processListenersSpy = vi.spyOn(scorm12API, "processListeners");
      scorm12API.nav.event = "";

      scorm12API.lmsFinish();

      expect(processListenersSpy).not.toHaveBeenCalled();
    });
  });

  describe("lmsGetLastError()", () => {
    it("should call getLastError with 'LMSGetLastError'", () => {
      const scorm12API = api();
      const getLastErrorSpy = vi.spyOn(scorm12API, "getLastError");

      scorm12API.lmsGetLastError();

      expect(getLastErrorSpy).toHaveBeenCalledOnce();
      expect(getLastErrorSpy).toHaveBeenCalledWith("LMSGetLastError");
    });
  });

  describe("lmsGetErrorString()", () => {
    it("should call getErrorString with 'LMSGetErrorString' and the error code", () => {
      const scorm12API = api();
      const getErrorStringSpy = vi.spyOn(scorm12API, "getErrorString");

      scorm12API.lmsGetErrorString("101");

      expect(getErrorStringSpy).toHaveBeenCalledOnce();
      expect(getErrorStringSpy).toHaveBeenCalledWith("LMSGetErrorString", "101");
    });

    it("should return the error string for a given error code", () => {
      const scorm12API = api();
      const errorString = scorm12API.lmsGetErrorString("101");
      expect(errorString).toEqual("General Exception");
    });

    it("should return empty string when error code is empty string (per SCORM spec)", () => {
      const scorm12API = api();
      const errorString = scorm12API.lmsGetErrorString("");
      expect(errorString).toEqual("");
    });

    it("should return 'No Error' for an unknown error code (SCORM 1.2 default)", () => {
      const scorm12API = api();
      const errorString = scorm12API.lmsGetErrorString("9999");
      expect(errorString).toEqual("No Error");
    });
  });

  describe("lmsGetDiagnostic()", () => {
    it("should call getDiagnostic with 'LMSGetDiagnostic' and the error code", () => {
      const scorm12API = api();
      const getDiagnosticSpy = vi.spyOn(scorm12API, "getDiagnostic");

      scorm12API.lmsGetDiagnostic("101");

      expect(getDiagnosticSpy).toHaveBeenCalledOnce();
      expect(getDiagnosticSpy).toHaveBeenCalledWith("LMSGetDiagnostic", "101");
    });
  });

  describe("validateCorrectResponse()", () => {
    it("should not throw an error (empty implementation)", () => {
      const scorm12API = api();

      expect(() => {
        scorm12API.validateCorrectResponse(
          "cmi.interactions.0.correct_responses.0.pattern",
          "true",
        );
      }).not.toThrow();
    });
  });

  describe("getLmsErrorMessageDetails()", () => {
    it("should return basic message when detail is false", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails(101, false);

      expect(result).toBe(scorm12_constants.error_descriptions["101"].basicMessage);
    });

    it("should return detail message when detail is true", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails(101, true);

      expect(result).toBe(scorm12_constants.error_descriptions["101"].detailMessage);
    });

    it("should handle string error codes", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails("101", false);

      expect(result).toBe(scorm12_constants.error_descriptions["101"].basicMessage);
    });

    it("should return 'No Error' for unknown error codes", () => {
      const scorm12API = api();

      const result = scorm12API.getLmsErrorMessageDetails(999, false);

      expect(result).toBe("No Error");
    });
  });

  describe("lmsCommit()", () => {
    it("should schedule commit when throttleCommits is true", () => {
      // throttleCommits requires useAsynchronousCommits
      const scorm12API = api({ throttleCommits: true, useAsynchronousCommits: true });
      const scheduleCommitSpy = vi.spyOn(scorm12API, "scheduleCommit");

      const result = scorm12API.lmsCommit();

      expect(result).toBe(global_constants.SCORM_TRUE);
      expect(scheduleCommitSpy).toHaveBeenCalledOnce();
      expect(scheduleCommitSpy).toHaveBeenCalledWith(500, "LMSCommit");
    });

    it("should call commit directly when throttleCommits is false", () => {
      const scorm12API = api({ throttleCommits: false });
      scorm12API.lmsInitialize();
      vi.spyOn(scorm12API, "commit");

      const result = scorm12API.lmsCommit();

      expect(result).toBe(global_constants.SCORM_TRUE);
      // Note: We can't easily test if commit was called because it's called in an async IIFE
    });
  });
});
