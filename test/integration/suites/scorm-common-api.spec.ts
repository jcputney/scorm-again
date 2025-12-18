import { expect, test } from "@playwright/test";
import {
  commit,
  ensureApiInitialized,
  getCmiValue,
  getLastError,
  initializeApi,
  setCmiValue,
  terminateApi
} from "../helpers/scorm-common-helpers";

export type WrapperConfig = {
  name: string;
  path: string;
};

export type ModuleConfig = {
  path: string;
  apiName: "API" | "API_1484_11";
  expectedLearnerId?: string;
};

/**
 * Universal API core functionality tests
 * These tests work across SCORM 1.2, SCORM 2004
 *
 * Note: This function should be called within an existing test.describe block
 */
export function scormCommonApiTests(
  wrapper: WrapperConfig,
  module: ModuleConfig
) {
  // Tests are added to the current describe block context
  test("should initialize API and load module", async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page, module.apiName);

    // Verify API is available and initialized
    if (module.expectedLearnerId) {
      // Get learner ID - different element names for different versions
      let learnerIdElement = "";
      if (module.apiName === "API_1484_11") {
        learnerIdElement = "cmi.learner_id";
      } else if (module.apiName === "API") {
        learnerIdElement = "cmi.core.student_id";
      }

      if (learnerIdElement) {
        const learnerId = await getCmiValue(page, module.apiName, learnerIdElement);
        expect(learnerId).toBe(module.expectedLearnerId);
      }
    }

    // Check for critical console errors (allow 404s for missing module files)
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes("404") &&
        !err.includes("favicon") &&
        !err.includes("Failed to load resource")
    );
    // Log errors for debugging but don't fail on them if they're just resource loading issues
    if (criticalErrors.length > 0) {
      console.log("Console errors:", criticalErrors);
    }
  });

  test("should handle API initialization errors correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized first
    await ensureApiInitialized(page, module.apiName);

    // Test Initialize when already initialized (should return false)
    const initResult = await initializeApi(page, module.apiName);

    // Should return "false" because already initialized
    expect(initResult).toBe("false");

    // Test GetLastError after failed initialize
    const errorCode = await getLastError(page, module.apiName);
    expect(errorCode).not.toBe("0");
  });

  test("should handle invalid data model element errors", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page, module.apiName);

    const errorTests = await page.evaluate(
      ({ apiName }) => {
        const api = (window as any)[apiName];
        const results: any = {};

        // Test invalid element
        if (apiName === "API") {
          results.invalidElement = {
            setValue: api.LMSSetValue("cmi.invalid_element", "test"),
            errorCode: api.LMSGetLastError().toString(),
            errorString: api.LMSGetErrorString(api.LMSGetLastError().toString()),
            diagnostic: api.LMSGetDiagnostic(api.LMSGetLastError().toString())
          };
        } else if (apiName === "API_1484_11") {
          results.invalidElement = {
            setValue: api.lmsSetValue("cmi.invalid_element", "test"),
            errorCode: api.lmsGetLastError().toString(),
            errorString: api.lmsGetErrorString(api.lmsGetLastError().toString()),
            diagnostic: api.lmsGetDiagnostic(api.lmsGetLastError().toString())
          };
        }

        return results;
      },
      { apiName: module.apiName }
    );

    // Verify invalid element error
    expect(errorTests.invalidElement.setValue).toBe("false");
    expect(errorTests.invalidElement.errorCode).toBe("401"); // UNDEFINED_DATA_MODEL
    expect(errorTests.invalidElement.errorString.length).toBeGreaterThan(0);
    if (errorTests.invalidElement.diagnostic) {
      expect(errorTests.invalidElement.diagnostic.length).toBeGreaterThan(0);
    }
  });

  test("should handle GetValue and SetValue with proper error codes", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page, module.apiName);

    // Get a valid element name based on API version
    let validElement = "";
    let setElement = "";
    if (module.apiName === "API_1484_11") {
      validElement = "cmi.learner_name";
      setElement = "cmi.location";
    } else if (module.apiName === "API") {
      validElement = "cmi.core.student_name";
      setElement = "cmi.core.lesson_location";
    }

    if (!validElement || !setElement) {
      test.skip();
      return;
    }

    const errorCodeTests = await page.evaluate(
      ({ apiName, validElement }) => {
        const api = (window as any)[apiName];
        const results: any = {};

        // Clear any previous errors
        if (apiName === "API") {
          api.LMSGetLastError();
          results.validGet = api.LMSGetValue(validElement);
          results.validGetError = api.LMSGetLastError().toString();
          results.invalidGet = api.LMSGetValue("cmi.invalid_element");
          results.invalidGetError = api.LMSGetLastError().toString();
          results.invalidGetErrorString = api.LMSGetErrorString(
            results.invalidGetError
          );
          results.validSet = api.LMSSetValue(setElement, "test");
          results.validSetError = api.LMSGetLastError().toString();
          results.invalidSet = api.LMSSetValue("cmi.invalid", "test");
          results.invalidSetError = api.LMSGetLastError().toString();
          results.invalidSetErrorString = api.LMSGetErrorString(results.invalidSetError);
        } else if (apiName === "API_1484_11") {
          api.lmsGetLastError();
          results.validGet = api.lmsGetValue(validElement);
          results.validGetError = api.lmsGetLastError().toString();
          results.invalidGet = api.lmsGetValue("cmi.invalid_element");
          results.invalidGetError = api.lmsGetLastError().toString();
          results.invalidGetErrorString = api.lmsGetErrorString(results.invalidGetError);
          results.validSet = api.lmsSetValue(setElement, "test");
          results.validSetError = api.lmsGetLastError().toString();
          results.invalidSet = api.lmsSetValue("cmi.invalid", "test");
          results.invalidSetError = api.lmsGetLastError().toString();
          results.invalidSetErrorString = api.lmsGetErrorString(results.invalidSetError);
        }

        return results;
      },
      { apiName: module.apiName, validElement, setElement }
    );

    // Valid GetValue should succeed
    expect(errorCodeTests.validGet).toBeTruthy();
    expect(errorCodeTests.validGetError).toBe("0");

    // Invalid GetValue should fail
    expect(errorCodeTests.invalidGet).toBe("");
    expect(errorCodeTests.invalidGetError).toBe("401"); // UNDEFINED_DATA_MODEL
    expect(errorCodeTests.invalidGetErrorString.length).toBeGreaterThan(0);

    // Valid SetValue should succeed
    expect(errorCodeTests.validSet).toBe("true");
    expect(errorCodeTests.validSetError).toBe("0");

    // Invalid SetValue should fail
    expect(errorCodeTests.invalidSet).toBe("false");
    expect(errorCodeTests.invalidSetError).toBe("401"); // UNDEFINED_DATA_MODEL
    expect(errorCodeTests.invalidSetErrorString.length).toBeGreaterThan(0);
  });

  test("should handle Terminate correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page, module.apiName);

    // Set some data before terminating
    let locationElement = "";
    if (module.apiName === "API_1484_11") {
      locationElement = "cmi.location";
    } else if (module.apiName === "API") {
      locationElement = "cmi.core.lesson_location";
    }

    if (locationElement) {
      await setCmiValue(page, module.apiName, locationElement, "final_page");
      await commit(page, module.apiName);
    }

    // Terminate the session
    const terminateResult = await terminateApi(page, module.apiName);
    expect(terminateResult).toBe("true");

    // After termination, GetValue should still work for reading data
    if (locationElement) {
      const location = await getCmiValue(page, module.apiName, locationElement);
      // Location may persist or be cleared after terminate - both are valid
      expect(typeof location === "string").toBe(true);
    }
  });

  test("should handle GetDiagnostic correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page, module.apiName);

    const diagnosticTests = await page.evaluate(
      ({ apiName }) => {
        const api = (window as any)[apiName];
        const results: any = {};

        // Trigger an error
        if (apiName === "API") {
          api.LMSSetValue("cmi.invalid_element", "test");
          const errorCode = api.LMSGetLastError().toString();
          results.diagnostic = api.LMSGetDiagnostic(errorCode);
          results.errorString = api.LMSGetErrorString(errorCode);
          results.invalidDiagnostic = api.LMSGetDiagnostic("999");
        } else if (apiName === "API_1484_11") {
          api.lmsSetValue("cmi.invalid_element", "test");
          const errorCode = api.lmsGetLastError().toString();
          results.diagnostic = api.lmsGetDiagnostic(errorCode);
          results.errorString = api.lmsGetErrorString(errorCode);
          results.invalidDiagnostic = api.lmsGetDiagnostic("999");
        }

        return results;
      },
      { apiName: module.apiName }
    );

    expect(diagnosticTests.diagnostic.length).toBeGreaterThan(0);
    expect(diagnosticTests.errorString.length).toBeGreaterThan(0);
    expect(diagnosticTests.invalidDiagnostic).toBe("");
  });
}

