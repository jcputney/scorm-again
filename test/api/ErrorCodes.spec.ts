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

describe("Error Codes Tests", () => {
  describe("SCORM 2004 Error Codes", () => {
    // Test each error code by directly setting it and verifying it can be retrieved
    Object.entries(scorm2004_errors).forEach(([errorName, errorCode]) => {
      describe(`${errorName} Error Tests`, () => {
        it(`should correctly set and retrieve ${errorName} error code`, () => {
          const api = scorm2004Api();

          // Directly set the error code
          api.throwSCORMError("api", errorCode);

          // Verify the error code can be retrieved
          expect(api.lmsGetLastError()).toEqual(String(errorCode));
        });
      });
    });

    describe("throwSCORMError Behavior Tests", () => {
      it("should set lastErrorCode when throwException is false", () => {
        const api = scorm2004Api();

        // Call throwSCORMError with throwException = false
        api.throwSCORMError("api", scorm2004_errors.TYPE_MISMATCH, "Test error");

        // Verify the error code is set
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should not overwrite lastErrorCode with subsequent operations", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set an error code
        api.throwSCORMError("api", scorm2004_errors.TYPE_MISMATCH);

        // Verify the error code is set
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));

        // Perform an operation that should not change the error code
        api.lmsGetValue("cmi.completion_status");

        // Verify the error code is still the same
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should clear lastErrorCode when clearSCORMError is called with 'true'", () => {
        const api = scorm2004Api();

        // Set an error code
        api.throwSCORMError("api", scorm2004_errors.TYPE_MISMATCH);

        // Verify the error code is set
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));

        // Clear the error code
        api.clearSCORMError("true");

        // Verify the error code is cleared
        expect(api.lmsGetLastError()).toEqual("0");
      });
    });

    describe("TYPE_MISMATCH Error Tests (Real Scenarios)", () => {
      it("should set TYPE_MISMATCH (406) error code when setting an invalid value type", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set up an interaction
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        api.lmsSetValue("cmi.interactions.0.type", "true-false");

        expect(api.lmsGetLastError()).toEqual(String(0));

        // Try to set an invalid value for a true-false interaction (should be "true" or "false")
        api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "invalid_value");

        // Verify the error code is TYPE_MISMATCH (406)
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should set TYPE_MISMATCH (406) error code when setting an invalid timestamp value", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set up an interaction
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        api.lmsSetValue("cmi.interactions.0.type", "true-false");

        // Try to set an invalid timestamp value
        api.lmsSetValue("cmi.interactions.0.timestamp", "invalid_timestamp");

        // Verify the error code is TYPE_MISMATCH (406)
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should set TYPE_MISMATCH (406) error code when setting an invalid numeric value", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Try to set an invalid numeric value
        api.lmsSetValue("cmi.score.scaled", "not_a_number");

        // Verify the error code is TYPE_MISMATCH (406)
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should set TYPE_MISMATCH (406) error code when setting an invalid format for matching interaction", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set up a matching interaction
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        api.lmsSetValue("cmi.interactions.0.type", "matching");

        // Try to set an invalid format for matching interaction (should be source[.]target)
        api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "invalid_format");

        // Verify the error code is TYPE_MISMATCH (406)
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      it("should maintain TYPE_MISMATCH (406) error code after multiple operations", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set up an interaction
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        api.lmsSetValue("cmi.interactions.0.type", "true-false");

        // Try to set an invalid value
        api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "invalid_value");

        // Verify the error code is TYPE_MISMATCH (406)
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));

        // Perform another operation that should not change the error code
        api.lmsGetValue("cmi.interactions.0.id");

        // Verify the error code is still TYPE_MISMATCH (406)
        expect(api.lmsGetLastError()).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
      });

      // This test reproduces the issue mentioned in the description
      it("should not set GENERAL (101) error code instead of TYPE_MISMATCH (406) when setting an incorrect value", () => {
        const api = scorm2004Api();
        api.lmsInitialize();

        // Set up an interaction
        api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
        api.lmsSetValue("cmi.interactions.0.type", "true-false");

        // Try to set an invalid value for a true-false interaction (should be "true" or "false")
        api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "invalid_value");

        // Verify the error code is TYPE_MISMATCH (406) and not GENERAL (101)
        const errorCode = api.lmsGetLastError();
        expect(errorCode).toEqual(String(scorm2004_errors.TYPE_MISMATCH));
        expect(errorCode).not.toEqual(String(scorm2004_errors.GENERAL));
      });
    });
  });

  describe("SCORM 1.2 Error Codes", () => {
    // Test each error code by directly setting it and verifying it can be retrieved
    Object.entries(scorm12_errors).forEach(([errorName, errorCode]) => {
      describe(`${errorName} Error Tests`, () => {
        it(`should correctly set and retrieve ${errorName} error code`, () => {
          const api = scorm12Api();

          // Directly set the error code
          api.throwSCORMError("api", errorCode);

          // Verify the error code can be retrieved
          expect(api.lmsGetLastError()).toEqual(String(errorCode));
        });
      });
    });
  });

  describe("AICC Error Codes", () => {
    // Test each error code by directly setting it and verifying it can be retrieved
    // AICC uses the same error codes as SCORM 1.2
    Object.entries(scorm12_errors).forEach(([errorName, errorCode]) => {
      describe(`${errorName} Error Tests`, () => {
        it(`should correctly set and retrieve ${errorName} error code`, () => {
          const api = aiccApi();

          // Directly set the error code
          api.throwSCORMError("api", errorCode);

          // Verify the error code can be retrieved
          expect(api.lmsGetLastError()).toEqual(String(errorCode));
        });
      });
    });
  });
});
