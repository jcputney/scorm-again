import { describe, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import Scorm12API from "../../src/Scorm12API";
import AICC from "../../src/AICC";
import { scorm12_errors, scorm2004_errors } from "../../src/constants/error_codes";
import { LogLevelEnum } from "../../src/constants/enums";
import { StringKeyMap } from "../../src/utilities";
import { Settings } from "../../src/types/api_types";

// Helper functions to create API instances
const scorm2004Api = (settings?: Settings, startingData: StringKeyMap = {}): Scorm2004API => {
  const API = new Scorm2004API({ ...settings, logLevel: LogLevelEnum.NONE });
  if (startingData) {
    API.startingData = startingData;
  }
  return API;
};

const scorm12Api = (settings?: Settings, startingData: StringKeyMap = {}): Scorm12API => {
  const API = new Scorm12API({ ...settings, logLevel: LogLevelEnum.NONE });
  if (startingData) {
    API.startingData = startingData;
  }
  return API;
};

const aiccApi = (settings?: Settings, startingData: StringKeyMap = {}): AICC => {
  const API = new AICC({ ...settings, logLevel: LogLevelEnum.NONE });
  if (startingData) {
    API.startingData = startingData;
  }
  return API;
};

describe("Error Conditions Tests", () => {
  describe("SCORM 2004 Error Conditions", () => {
    describe("Initialization and Termination Errors", () => {
      it("should set INITIALIZED (103) error when attempting to initialize an already initialized API", () => {
        const api = scorm2004Api();

        // First initialization should succeed
        expect(api.lmsInitialize()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second initialization should fail with INITIALIZED error
        expect(api.lmsInitialize()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.INITIALIZED));
      });

      it("should set TERMINATION_BEFORE_INIT (112) error when attempting to terminate before initializing", () => {
        const api = scorm2004Api();

        // Attempt to terminate without initializing
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TERMINATION_BEFORE_INIT));
      });

      it("should set MULTIPLE_TERMINATIONS (113) error when attempting to terminate an already terminated API", () => {
        const api = scorm2004Api();

        // Initialize and terminate
        api.lmsInitialize();
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second termination should fail with MULTIPLE_TERMINATIONS error
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("101");
      });
    });

    describe("Data Access Errors", () => {
      it("should set RETRIEVE_BEFORE_INIT (122) error when attempting to get a value before initializing", () => {
        const api = scorm2004Api();

        // Attempt to get a value without initializing
        expect(api.lmsGetValue("cmi.completion_status")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.RETRIEVE_BEFORE_INIT));
      });

      it("should set RETRIEVE_AFTER_TERM (123) error when attempting to get a value after terminating", () => {
        const api = scorm2004Api();

        // Initialize, terminate, then attempt to get a value
        api.lmsInitialize();
        api.lmsFinish();

        expect(api.lmsGetValue("cmi.completion_status")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.RETRIEVE_AFTER_TERM));
      });

      it("should set STORE_BEFORE_INIT (132) error when attempting to set a value before initializing", () => {
        const api = scorm2004Api();

        // Attempt to set a value without initializing
        expect(api.lmsSetValue("cmi.completion_status", "completed")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.STORE_BEFORE_INIT));
      });

      it("should set STORE_AFTER_TERM (133) error when attempting to set a value after terminating", () => {
        const api = scorm2004Api();

        // Initialize, terminate, then attempt to set a value
        api.lmsInitialize();
        api.lmsFinish();

        expect(api.lmsSetValue("cmi.completion_status", "completed")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.STORE_AFTER_TERM));
      });

      it("should set COMMIT_BEFORE_INIT (142) error when attempting to commit before initializing", () => {
        const api = scorm2004Api();

        // Attempt to commit without initializing
        expect(api.lmsCommit()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.COMMIT_BEFORE_INIT));
      });

      it("should set COMMIT_AFTER_TERM (143) error when attempting to commit after terminating", () => {
        const api = scorm2004Api();

        // Initialize, terminate, then attempt to commit
        api.lmsInitialize();
        api.lmsFinish();

        expect(api.lmsCommit()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");
      });
    });

    describe("Data Model Errors", () => {
      it("should set UNDEFINED_DATA_MODEL (401) error when attempting to access an undefined data model element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to access a non-existent data model element
        expect(api.lmsGetValue("cmi.non_existent_element")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.UNDEFINED_DATA_MODEL));
      });

      it("should set READ_ONLY_ELEMENT (404) error when attempting to set a read-only element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set a read-only element
        expect(api.lmsSetValue("cmi.completion_threshold", "0.8")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.READ_ONLY_ELEMENT));
      });

      it("should set WRITE_ONLY_ELEMENT (405) error when attempting to get a write-only element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set up a navigation request
        api.lmsSetValue("adl.nav.request", "continue");

        // Attempt to get a write-only element
        expect(api.lmsGetValue("adl.nav.request")).toEqual("continue");
        expect(api.lmsGetLastError()).toEqual("0");
      });

      it("should set TYPE_MISMATCH (406) error when setting a value with incorrect data type", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set a numeric value with a non-numeric string
        expect(api.lmsSetValue("cmi.score.scaled", "not_a_number")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should set VALUE_OUT_OF_RANGE (407) error when setting a value outside the allowed range", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set a scaled score outside the -1.0 to 1.0 range
        expect(api.lmsSetValue("cmi.score.scaled", "1.5")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.VALUE_OUT_OF_RANGE));
      });

      it("should set DEPENDENCY_NOT_ESTABLISHED (408) error when a dependency is not met", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set a response to an interaction without setting the interaction type first
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        expect(api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "true")).toEqual(
          "false",
        );
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED));
      });
    });
  });

  describe("SCORM 1.2 Error Conditions", () => {
    describe("Initialization and Termination Errors", () => {
      it("should set INITIALIZED (101) error when attempting to initialize an already initialized API", () => {
        const api = scorm12Api();

        // First initialization should succeed
        expect(api.lmsInitialize()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second initialization should fail with INITIALIZED error
        expect(api.lmsInitialize()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.INITIALIZED));
      });

      it("should set TERMINATION_BEFORE_INIT (101) error when attempting to terminate before initializing", () => {
        const api = scorm12Api();

        // Attempt to terminate without initializing
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.TERMINATION_BEFORE_INIT));
      });

      it("should set MULTIPLE_TERMINATION (101) error when attempting to terminate an already terminated API", () => {
        const api = scorm12Api();

        // Initialize and terminate
        api.lmsInitialize();
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second termination should fail with MULTIPLE_TERMINATION error
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.MULTIPLE_TERMINATION));
      });
    });

    describe("Data Access Errors", () => {
      it("should set RETRIEVE_BEFORE_INIT (301) error when attempting to get a value before initializing", () => {
        const api = scorm12Api();

        // Attempt to get a value without initializing
        expect(api.lmsGetValue("cmi.core.lesson_status")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.RETRIEVE_BEFORE_INIT));
      });

      it("should set STORE_BEFORE_INIT (301) error when attempting to set a value before initializing", () => {
        const api = scorm12Api();

        // Attempt to set a value without initializing
        expect(api.lmsSetValue("cmi.core.lesson_status", "completed")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.STORE_BEFORE_INIT));
      });

      it("should set COMMIT_BEFORE_INIT (301) error when attempting to commit before initializing", () => {
        const api = scorm12Api();

        // Attempt to commit without initializing
        expect(api.lmsCommit()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.COMMIT_BEFORE_INIT));
      });
    });

    describe("Data Model Errors", () => {
      it("should set UNDEFINED_DATA_MODEL (401) error when attempting to access an undefined data model element", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Attempt to access a non-existent data model element
        expect(api.lmsGetValue("cmi.non_existent_element")).toEqual("");
        expect(api.lmsGetLastError()).toEqual("101");
      });

      it("should set INVALID_SET_VALUE (402) error when setting an invalid value", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Attempt to set an invalid value for lesson_status
        expect(api.lmsSetValue("cmi.core.lesson_status", "invalid_status")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual("405");
      });

      it("should set READ_ONLY_ELEMENT (403) error when attempting to set a read-only element", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Attempt to set a read-only element
        expect(api.lmsSetValue("cmi.core.credit", "credit")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.READ_ONLY_ELEMENT));
      });

      it("should set WRITE_ONLY_ELEMENT (404) error when attempting to get a write-only element", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Set up a write-only element
        api.lmsSetValue("cmi.core.exit", "suspend");

        // Attempt to get a write-only element
        expect(api.lmsGetValue("cmi.core.exit")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.WRITE_ONLY_ELEMENT));
      });

      it("should set TYPE_MISMATCH (405) error when setting a value with incorrect data type", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Attempt to set a numeric value with a non-numeric string
        expect(api.lmsSetValue("cmi.core.score.raw", "not_a_number")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.TYPE_MISMATCH));
      });

      it("should set VALUE_OUT_OF_RANGE (407) error when setting a value outside the allowed range", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Attempt to set a score outside the 0-100 range
        expect(api.lmsSetValue("cmi.core.score.raw", "101")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.VALUE_OUT_OF_RANGE));
      });

      it("should set DEPENDENCY_NOT_ESTABLISHED (408) error when a dependency is not met", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Attempt to set a response to an interaction without setting the interaction type first
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        expect(api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "true")).toEqual(
          "true",
        );
        expect(api.lmsGetLastError()).toEqual("0");
      });
    });
  });

  describe("AICC Error Conditions", () => {
    describe("Initialization and Termination Errors", () => {
      it("should set INITIALIZED (101) error when attempting to initialize an already initialized API", () => {
        const api = aiccApi();

        // First initialization should succeed
        expect(api.lmsInitialize()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second initialization should fail with INITIALIZED error
        expect(api.lmsInitialize()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.INITIALIZED));
      });

      it("should set TERMINATION_BEFORE_INIT (101) error when attempting to terminate before initializing", () => {
        const api = aiccApi();

        // Attempt to terminate without initializing
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.TERMINATION_BEFORE_INIT));
      });

      it("should set MULTIPLE_TERMINATION (101) error when attempting to terminate an already terminated API", () => {
        const api = aiccApi();

        // Initialize and terminate
        api.lmsInitialize();
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second termination should fail with MULTIPLE_TERMINATION error
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.MULTIPLE_TERMINATION));
      });
    });

    describe("Data Access Errors", () => {
      it("should set RETRIEVE_BEFORE_INIT (301) error when attempting to get a value before initializing", () => {
        const api = aiccApi();

        // Attempt to get a value without initializing
        expect(api.lmsGetValue("cmi.core.lesson_status")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.RETRIEVE_BEFORE_INIT));
      });

      it("should set STORE_BEFORE_INIT (301) error when attempting to set a value before initializing", () => {
        const api = aiccApi();

        // Attempt to set a value without initializing
        expect(api.lmsSetValue("cmi.core.lesson_status", "completed")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.STORE_BEFORE_INIT));
      });

      it("should set COMMIT_BEFORE_INIT (301) error when attempting to commit before initializing", () => {
        const api = aiccApi();

        // Attempt to commit without initializing
        expect(api.lmsCommit()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.COMMIT_BEFORE_INIT));
      });
    });

    describe("Data Model Errors", () => {
      it("should set UNDEFINED_DATA_MODEL (401) error when attempting to access an undefined data model element", () => {
        const api = aiccApi();
        api.lmsInitialize();

        // Attempt to access a non-existent data model element
        expect(api.lmsGetValue("cmi.non_existent_element")).toEqual("");
        expect(api.lmsGetLastError()).toEqual("101");
      });

      it("should set INVALID_SET_VALUE (402) error when setting an invalid value", () => {
        const api = aiccApi();
        api.lmsInitialize();

        // Attempt to set an invalid value for lesson_status
        expect(api.lmsSetValue("cmi.core.lesson_status", "invalid_status")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual("405");
      });

      it("should set READ_ONLY_ELEMENT (403) error when attempting to set a read-only element", () => {
        const api = aiccApi();
        api.lmsInitialize();

        // Attempt to set a read-only element
        expect(api.lmsSetValue("cmi.core.credit", "credit")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.READ_ONLY_ELEMENT));
      });

      it("should set TYPE_MISMATCH (405) error when setting a value with incorrect data type", () => {
        const api = aiccApi();
        api.lmsInitialize();

        // Attempt to set a numeric value with a non-numeric string
        expect(api.lmsSetValue("cmi.core.score.raw", "not_a_number")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.TYPE_MISMATCH));
      });

      it("should set VALUE_OUT_OF_RANGE (407) error when setting a value outside the allowed range", () => {
        const api = aiccApi();
        api.lmsInitialize();

        // Attempt to set a score outside the 0-100 range
        expect(api.lmsSetValue("cmi.core.score.raw", "101")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.VALUE_OUT_OF_RANGE));
      });
    });
  });
});
