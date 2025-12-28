import { Page } from "@playwright/test";

/**
 * Universal SCORM helpers that work across SCORM 1.2, SCORM 2004
 * These helpers are version-agnostic and accept the API name as a parameter
 */

export type ScormApiName = "API" | "API_1484_11";

/**
 * Resilient page ready helper for cross-browser stability.
 * Waits for DOM and load readiness first (reliable), then attempts
 * networkidle as best-effort with a short timeout.
 *
 * This addresses Firefox timing issues where networkidle can be
 * unreliable or behave differently than in Chromium.
 *
 * @param page - Playwright page object
 * @param networkIdleTimeout - Max time to wait for networkidle (default: 2000ms)
 */
export async function waitForPageReady(
  page: Page,
  networkIdleTimeout: number = 2000
): Promise<void> {
  // Wait for DOM content to be loaded (reliable across browsers)
  await page.waitForLoadState("domcontentloaded");

  // Wait for load event (reliable across browsers)
  await page.waitForLoadState("load");

  // Attempt networkidle as best-effort with short timeout
  // This is nice-to-have but not blocking - Firefox can be flaky here
  try {
    await page.waitForLoadState("networkidle", { timeout: networkIdleTimeout });
  } catch {
    // networkidle timeout is acceptable - DOM and load are sufficient
  }
}

/**
 * Configure the SCORM wrapper with settings that must be applied before navigation.
 * This works by injecting a script that seeds window.__SCORM_WRAPPER_CONFIG__ prior
 * to the wrapper HTML executing its bootstrapping logic.
 */
export async function configureWrapper(page: Page, config: Record<string, any>): Promise<void> {
  await page.addInitScript((wrapperConfig) => {
    (window as any).__SCORM_WRAPPER_CONFIG__ = wrapperConfig;
  }, config);
}

/**
 * Get the API object from window
 */
export function getApiFromWindow(page: Page, apiName: ScormApiName): Promise<any> {
  return page.evaluate(
    (name) => {
      return (window as any)[name];
    },
    apiName
  );
}

/**
 * Get a CMI value (works for all SCORM versions)
 */
export async function getCmiValue(
  page: Page,
  apiName: ScormApiName,
  element: string
): Promise<string> {
  return await page.evaluate(
    ({ apiName, element }) => {
      const api = (window as any)[apiName];
      if (!api) {
        throw new Error(`API ${apiName} not found on window`);
      }
      // Handle different method names
      if (apiName === "API") {
        return api.LMSGetValue(element);
      } else if (apiName === "API_1484_11") {
        return api.lmsGetValue(element);
      }
      throw new Error(`Unknown API name: ${apiName}`);
    },
    { apiName, element }
  );
}

/**
 * Set a CMI value (works for all SCORM versions)
 */
export async function setCmiValue(
  page: Page,
  apiName: ScormApiName,
  element: string,
  value: string
): Promise<string> {
  return await page.evaluate(
    ({ apiName, element, value }) => {
      const api = (window as any)[apiName];
      if (!api) {
        throw new Error(`API ${apiName} not found on window`);
      }
      // Handle different method names
      if (apiName === "API") {
        return api.LMSSetValue(element, value);
      } else if (apiName === "API_1484_11") {
        return api.lmsSetValue(element, value);
      }
      throw new Error(`Unknown API name: ${apiName}`);
    },
    { apiName, element, value }
  );
}

/**
 * Initialize the API (works for all SCORM versions)
 */
export async function initializeApi(page: Page, apiName: ScormApiName): Promise<string> {
  return await page.evaluate(
    (name) => {
      const api = (window as any)[name];
      if (!api) {
        return "false";
      }
      // Handle different method names
      if (name === "API") {
        return api.LMSInitialize("");
      } else if (name === "API_1484_11") {
        return api.lmsInitialize("");
      }
      return "false";
    },
    apiName
  );
}

/**
 * Terminate the API (works for all SCORM versions)
 */
export async function terminateApi(page: Page, apiName: ScormApiName): Promise<string> {
  return await page.evaluate(
    (name) => {
      const api = (window as any)[name];
      if (!api) {
        return "false";
      }
      // Handle different method names
      if (name === "API") {
        return api.LMSFinish("");
      } else if (name === "API_1484_11") {
        return api.lmsFinish("");
      }
      return "false";
    },
    apiName
  );
}

/**
 * Get the last error code
 */
export async function getLastError(page: Page, apiName: ScormApiName): Promise<string> {
  return await page.evaluate(
    (name) => {
      const api = (window as any)[name];
      if (!api) {
        return "0";
      }
      // Handle different method names
      if (name === "API") {
        return api.LMSGetLastError().toString();
      } else if (name === "API_1484_11") {
        return api.lmsGetLastError().toString();
      }
      return "0";
    },
    apiName
  );
}

/**
 * Get error string for an error code
 */
export async function getErrorString(
  page: Page,
  apiName: ScormApiName,
  errorCode: string
): Promise<string> {
  return await page.evaluate(
    ({ name, code }) => {
      const api = (window as any)[name];
      if (!api) {
        return "";
      }
      // Handle different method names
      if (name === "API") {
        return api.LMSGetErrorString(code);
      } else if (name === "API_1484_11") {
        return api.lmsGetErrorString(code);
      }
      return "";
    },
    { name: apiName, code: errorCode }
  );
}

/**
 * Get diagnostic for an error code
 */
export async function getDiagnostic(
  page: Page,
  apiName: ScormApiName,
  errorCode: string
): Promise<string> {
  return await page.evaluate(
    ({ name, code }) => {
      const api = (window as any)[name];
      if (!api) {
        return "";
      }
      // Handle different method names
      if (name === "API") {
        return api.LMSGetDiagnostic(code);
      } else if (name === "API_1484_11") {
        return api.lmsGetDiagnostic(code);
      }
      return "";
    },
    { name: apiName, code: errorCode }
  );
}

/**
 * Commit data (works for all SCORM versions)
 */
export async function commit(page: Page, apiName: ScormApiName): Promise<string> {
  return await page.evaluate(
    (name) => {
      const api = (window as any)[name];
      if (!api) {
        return "false";
      }
      // Handle different method names
      if (name === "API") {
        return api.LMSCommit("");
      } else if (name === "API_1484_11") {
        return api.lmsCommit("");
      }
      return "false";
    },
    apiName
  );
}

/**
 * Wait for API to be available on window and initialize it if needed
 */
export async function ensureApiInitialized(
  page: Page,
  apiName: ScormApiName,
  timeout: number = 5000
): Promise<void> {
  // Wait for API to be available
  await page.waitForFunction(
    (name) => typeof (window as any)[name] !== "undefined",
    apiName,
    { timeout }
  );

  // Always try to initialize - if already initialized, it will return "false" which is fine
  const initResult = await initializeApi(page, apiName);
  // "false" means already initialized, "true" means we just initialized it
  // Both are acceptable outcomes
  if (initResult !== "true" && initResult !== "false") {
    throw new Error(`Failed to initialize API ${apiName}: ${initResult}`);
  }
}

/**
 * Verify API is accessible from module iframe
 */
export async function verifyApiAccessibleFromModule(
  page: Page,
  apiName: ScormApiName
): Promise<boolean> {
  return await page.evaluate(
    (name) => {
      const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
      if (iframe?.contentWindow) {
        return typeof iframe.contentWindow.parent?.window?.[name] !== "undefined";
      }
      return false;
    },
    apiName
  );
}

/**
 * Set CMI value from within module iframe context
 */
export async function setCmiValueFromModule(
  page: Page,
  apiName: ScormApiName,
  element: string,
  value: string
): Promise<void> {
  await page.evaluate(
    ({ apiName, element, value }) => {
      const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
      if (iframe?.contentWindow?.parent?.window) {
        const api = iframe.contentWindow.parent.window[apiName as keyof Window];
        if (api) {
          // Handle different method names
          if (apiName === "API") {
            (api as any).LMSSetValue(element, value);
          } else if (apiName === "API_1484_11") {
            (api as any).lmsSetValue(element, value);
          }
        }
      }
    },
    { apiName, element, value }
  );
}

/**
 * Wait for module frame to load
 */
export async function waitForModuleFrame(
  page: Page,
  timeout: number = 5000
): Promise<void> {
  await page.waitForSelector("#moduleFrame", { state: "attached", timeout });
  await page.waitForTimeout(1000); // Give iframe time to load content
}

/**
 * Get wrapper configurations for SCORM 2004 testing
 */
export function getScorm2004WrapperConfigs() {
  return [
    {
      name: "Standard",
      path: "/test/integration/wrappers/scorm2004-wrapper.html"
    },
    {
      name: "ESM",
      path: "/test/integration/wrappers/scorm2004-wrapper-esm.html"
    }
  ];
}
