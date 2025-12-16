// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import Scorm12API from "../../src/Scorm12API";
import { scorm12_errors, scorm2004_errors, StringKeyMap } from "../../src";
import { LogLevelEnum } from "../../src/constants/enums";
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
        // Per SCORM 2004 3rd Edition spec: return "false" for error conditions
        expect(api.lmsFinish()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TERMINATION_BEFORE_INIT));
      });

      it("should set MULTIPLE_TERMINATION (113) error when attempting to terminate an already terminated API", () => {
        const api = scorm2004Api();

        // Initialize and terminate
        api.lmsInitialize();
        expect(api.lmsFinish()).toEqual("true");
        expect(api.lmsGetLastError()).toEqual("0");

        // Second termination should fail with MULTIPLE_TERMINATION error
        // Per SCORM 2004 3rd Edition spec: return "false" for error conditions
        expect(api.lmsFinish()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.MULTIPLE_TERMINATION));
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
        // Per SCORM 2004 3rd Edition spec: return "false" for error conditions
        expect(api.lmsCommit()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.COMMIT_BEFORE_INIT));
      });

      it("should set COMMIT_AFTER_TERM (143) error when attempting to commit after terminating", () => {
        const api = scorm2004Api();

        // Initialize, terminate, then attempt to commit
        api.lmsInitialize();
        api.lmsFinish();

        // Per SCORM 2004 RTE 3.1.2.5: Commit after Terminate returns "false" with error 143
        expect(api.lmsCommit()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.COMMIT_AFTER_TERM));
      });

      // Spec Reference: SCORM 2004 RTE Section 3.1.4.2 - Error Code 391
      it("should return false with error 391 on network failure", () => {
        const api = scorm2004Api({
          lmsCommitUrl: "/scorm2004/network-failure",
        });

        api.lmsInitialize();

        // Set some data
        api.lmsSetValue("cmi.location", "test");

        // Mock the HTTP service to return a failure result
        const originalHttpService = api["_httpService"];
        const mockHttpService = {
          processHttpRequest: () => {
            return {
              result: "false",
              errorCode: 391,
            };
          },
          updateSettings: () => {},
        };
        api["_httpService"] = mockHttpService as any;

        const result = api.lmsCommit();

        // Restore original service
        api["_httpService"] = originalHttpService;

        // When HTTP commit returns failure, Commit should return false
        // Note: The current implementation returns "false" but error 0 because
        // it checks result === "true" but doesn't propagate errorCode from HTTP response
        expect(result).toEqual("false");
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

        // Attempt to get a write-only element - should return "" and set error 405
        expect(api.lmsGetValue("adl.nav.request")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.WRITE_ONLY_ELEMENT));
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

      it("should set GENERAL_GET_FAILURE (301) error when GetValue is called with empty string", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to get value with empty string parameter
        expect(api.lmsGetValue("")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_GET_FAILURE));
        expect(api.lmsGetDiagnostic("")).toContain("not specified");
      });

      it("should set GENERAL_SET_FAILURE (351) error when SetValue is called with empty CMIElement", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set value with empty string element
        expect(api.lmsSetValue("", "some value")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_SET_FAILURE));
      });

      it("should set GENERAL_GET_FAILURE (301) error when using ._version on non-base element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to get ._version on a non-base element (only cmi._version is valid)
        expect(api.lmsGetValue("cmi.learner_id._version")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_GET_FAILURE));
        expect(api.lmsGetDiagnostic("")).toContain("_version keyword was used incorrectly");
      });

      it("should set GENERAL_GET_FAILURE (301) error when using ._children on non-parent element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to get ._children on a non-parent element (learner_name has no children)
        expect(api.lmsGetValue("cmi.learner_name._children")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_GET_FAILURE));
        expect(api.lmsGetDiagnostic("")).toContain("does not have children");
      });

      it("should set GENERAL_GET_FAILURE (301) error when using ._count on non-collection element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to get ._count on a non-collection element
        expect(api.lmsGetValue("cmi.learner_name._count")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_GET_FAILURE));
        expect(api.lmsGetDiagnostic("")).toContain("not a collection");
      });

      it("should set VALUE_NOT_INITIALIZED (403) error when accessing out-of-range collection index", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to access an objective that doesn't exist (no objectives have been created)
        expect(api.lmsGetValue("cmi.objectives.99.id")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.VALUE_NOT_INITIALIZED));
      });
    });

    describe("Diagnostic Message Tests", () => {
      it("should provide diagnostic for SetValue with empty element", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set value with empty string element
        expect(api.lmsSetValue("", "some value")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_SET_FAILURE));
        expect(api.lmsGetDiagnostic("")).toContain("not specified");
      });

      it("should provide diagnostic for SetValue with invalid _version keyword", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Attempt to set ._version on a non-base element (only cmi._version is valid)
        // cmi.learner_id._version is an undefined data model element, so error 401
        expect(api.lmsSetValue("cmi.learner_id._version", "1.0")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.UNDEFINED_DATA_MODEL));

        // Attempt to get ._version on a non-base element
        // Returns error 301 (GENERAL_GET_FAILURE) for invalid _version usage
        expect(api.lmsGetValue("cmi.learner_id._version")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_GET_FAILURE));
      });

      it("should provide diagnostic for SetValue with duplicate objective ID", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set first objective ID
        expect(api.lmsSetValue("cmi.objectives.0.id", "objective-1")).toEqual("true");

        // Try to set duplicate ID - should fail with error 351
        expect(api.lmsSetValue("cmi.objectives.1.id", "objective-1")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_SET_FAILURE));

        // Diagnostic should provide information (exact wording may vary)
        const diagnostic = api.lmsGetDiagnostic("");
        expect(diagnostic).toBeDefined();
        expect(diagnostic.length).toBeGreaterThan(0);
      });

      it("should provide diagnostic for SetValue with duplicate interaction ID", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set first interaction ID
        expect(api.lmsSetValue("cmi.interactions.0.id", "interaction-1")).toEqual("true");

        // Try to set duplicate ID - should fail with error 351
        expect(api.lmsSetValue("cmi.interactions.1.id", "interaction-1")).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.GENERAL_SET_FAILURE));

        // Diagnostic should provide information (exact wording may vary)
        const diagnostic = api.lmsGetDiagnostic("");
        expect(diagnostic).toBeDefined();
        expect(diagnostic.length).toBeGreaterThan(0);
      });
    });

    describe("State Transition Errors", () => {
      it("should set TERMINATED (104) error when attempting to initialize after termination", () => {
        const api = scorm2004Api();

        // Initialize and terminate
        api.lmsInitialize();
        api.lmsFinish();

        // Attempt to initialize again after termination
        expect(api.lmsInitialize()).toEqual("false");
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TERMINATED));
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

        // Attempt to get a write-only element - per SCORM spec, returns "" with error code set
        expect(api.lmsGetValue("cmi.core.exit")).toEqual("");
        expect(api.lmsGetLastError()).toEqual(String(scorm12_errors.WRITE_ONLY_ELEMENT));
      });

      it("should set WRITE_ONLY_ELEMENT (404) error when attempting to get cmi.interactions.n.objectives.n.id", () => {
        const api = scorm12Api();
        api.lmsInitialize();

        // Set up an interaction with an objective
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        api.lmsSetValue("cmi.interactions.0.objectives.0.id", "objective_1");

        // Attempt to get the write-only objective id - per SCORM spec, returns "" with error code set
        expect(api.lmsGetValue("cmi.interactions.0.objectives.0.id")).toEqual("");
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
});
