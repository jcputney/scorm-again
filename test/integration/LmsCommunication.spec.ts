import { expect, test } from "@playwright/test";
import {
  configureLmsEndpoint,
  ensureApiInitialized,
  getCmiValue,
  getMockLmsCommitHistory,
  getMockLmsStorage,
  resetMockLms,
  setCmiValue,
} from "./helpers/scorm2004-helpers";
import { commit, terminateApi, waitForPageReady } from "./helpers/scorm-common-helpers";

/**
 * LMS Communication Integration Tests
 *
 * These tests verify that the SCORM API correctly communicates with an LMS server:
 * - Commit sends CMI data to lmsCommitUrl
 * - Terminate sends final commit
 * - Data persists across sessions via LMS
 * - API handles LMS responses correctly
 *
 * Uses a simple non-sequenced module (RuntimeBasicCalls) since we're testing
 * HTTP communication, not sequencing.
 */

const MOCK_LMS_URL = "http://localhost:3001";
const MODULE_PATH =
  "/test/integration/modules/RuntimeBasicCalls_SCORM20043rdEdition/shared/launchpage.html";
const WRAPPER_PATH = "/test/integration/wrappers/scorm2004-wrapper.html";

// Run these tests serially to avoid race conditions with the shared mock LMS server.
// Other tests running in parallel could interfere with resetMockLms calls.
test.describe.serial("LMS Communication", () => {
  test.beforeEach(async () => {
    // Reset mock LMS state before each test
    await resetMockLms(MOCK_LMS_URL);
  });

  test("Commit sends CMI data to lmsCommitUrl", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Configure API to use mock LMS
    await configureLmsEndpoint(page, MOCK_LMS_URL);

    // Set some values
    await setCmiValue(page, "cmi.location", "page_5");
    await setCmiValue(page, "cmi.completion_status", "incomplete");
    await setCmiValue(page, "cmi.score.raw", "75");

    // Trigger commit
    await commit(page, "API_1484_11");

    // Wait for commit to be processed
    await page.waitForTimeout(500);

    // Verify mock LMS received the data
    const history = await getMockLmsCommitHistory(MOCK_LMS_URL);
    expect(history.length).toBeGreaterThan(0);

    const lastCommit = history[history.length - 1];
    expect(lastCommit.data.cmi).toBeDefined();
  });

  test("Terminate sends final commit before session ends", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Configure API to use mock LMS
    await configureLmsEndpoint(page, MOCK_LMS_URL);

    // Set values
    await setCmiValue(page, "cmi.location", "final_page");
    await setCmiValue(page, "cmi.completion_status", "completed");
    await setCmiValue(page, "cmi.success_status", "passed");

    // Get history before terminate
    const historyBefore = await getMockLmsCommitHistory(MOCK_LMS_URL);
    const countBefore = historyBefore.length;

    // Terminate the session
    await terminateApi(page, "API_1484_11");

    // Wait for termination commit
    await page.waitForTimeout(500);

    // Verify a commit was sent during termination
    const historyAfter = await getMockLmsCommitHistory(MOCK_LMS_URL);
    expect(historyAfter.length).toBeGreaterThan(countBefore);

    // Verify the last commit contains expected data
    const lastCommit = historyAfter[historyAfter.length - 1];
    expect(lastCommit.data.cmi).toBeDefined();
  });

  test("Multiple commits accumulate data correctly", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Configure API to use mock LMS
    await configureLmsEndpoint(page, MOCK_LMS_URL);

    // First commit - set location
    await setCmiValue(page, "cmi.location", "page_1");
    await commit(page, "API_1484_11");
    await page.waitForTimeout(300);

    // Second commit - add score
    await setCmiValue(page, "cmi.location", "page_2");
    await setCmiValue(page, "cmi.score.raw", "50");
    await commit(page, "API_1484_11");
    await page.waitForTimeout(300);

    // Third commit - update score and status
    await setCmiValue(page, "cmi.location", "page_3");
    await setCmiValue(page, "cmi.score.raw", "85");
    await setCmiValue(page, "cmi.completion_status", "completed");
    await commit(page, "API_1484_11");
    await page.waitForTimeout(300);

    // Verify all commits were recorded
    const history = await getMockLmsCommitHistory(MOCK_LMS_URL);
    expect(history.length).toBeGreaterThanOrEqual(3);

    // Verify storage has merged data
    const storage = await getMockLmsStorage(MOCK_LMS_URL);
    const keys = Object.keys(storage);
    expect(keys.length).toBeGreaterThan(0);
  });

  test("SetValue followed by GetValue returns consistent data", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Set various data model elements
    const testData = {
      "cmi.location": "bookmark_location_123",
      "cmi.suspend_data": "custom_suspend_data_xyz",
      "cmi.completion_status": "incomplete",
      "cmi.success_status": "unknown",
      "cmi.score.raw": "42",
      "cmi.score.min": "0",
      "cmi.score.max": "100",
    };

    // Set all values
    for (const [element, value] of Object.entries(testData)) {
      await setCmiValue(page, element, value);
    }

    // Commit to ensure data is processed
    await commit(page, "API_1484_11");
    await page.waitForTimeout(300);

    // Verify all values can be read back
    for (const [element, expectedValue] of Object.entries(testData)) {
      const actualValue = await getCmiValue(page, element);
      expect(actualValue).toBe(expectedValue);
    }
  });

  test("Interactions are correctly recorded", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Configure API to use mock LMS
    await configureLmsEndpoint(page, MOCK_LMS_URL);

    // Record an interaction
    await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
      api.lmsSetValue("cmi.interactions.0.type", "choice");
      api.lmsSetValue("cmi.interactions.0.learner_response", "a");
      api.lmsSetValue("cmi.interactions.0.result", "correct");
      api.lmsSetValue("cmi.interactions.0.latency", "PT30S");
      api.lmsCommit();
    });

    await page.waitForTimeout(500);

    // Verify interaction was recorded
    const interactionId = await getCmiValue(page, "cmi.interactions.0.id");
    expect(interactionId).toBe("interaction_1");

    const interactionType = await getCmiValue(page, "cmi.interactions.0.type");
    expect(interactionType).toBe("choice");

    const interactionCount = await getCmiValue(page, "cmi.interactions._count");
    expect(parseInt(interactionCount, 10)).toBeGreaterThanOrEqual(1);
  });

  test("Objectives are correctly recorded", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Configure API to use mock LMS
    await configureLmsEndpoint(page, MOCK_LMS_URL);

    // Record objectives
    await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      api.lmsSetValue("cmi.objectives.0.id", "objective_1");
      api.lmsSetValue("cmi.objectives.0.success_status", "passed");
      api.lmsSetValue("cmi.objectives.0.completion_status", "completed");
      api.lmsSetValue("cmi.objectives.0.score.scaled", "0.9");

      api.lmsSetValue("cmi.objectives.1.id", "objective_2");
      api.lmsSetValue("cmi.objectives.1.success_status", "failed");
      api.lmsSetValue("cmi.objectives.1.completion_status", "completed");
      api.lmsSetValue("cmi.objectives.1.score.scaled", "0.4");

      api.lmsCommit();
    });

    await page.waitForTimeout(500);

    // Verify objectives were recorded
    const objectiveCount = await getCmiValue(page, "cmi.objectives._count");
    expect(parseInt(objectiveCount, 10)).toBeGreaterThanOrEqual(2);

    const obj1Status = await getCmiValue(page, "cmi.objectives.0.success_status");
    expect(obj1Status).toBe("passed");

    const obj2Status = await getCmiValue(page, "cmi.objectives.1.success_status");
    expect(obj2Status).toBe("failed");
  });

  test("Error state is cleared after successful operation", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Cause an error by setting invalid element
    await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      api.lmsSetValue("cmi.invalid_element", "test"); // This should fail
    });

    // Verify error occurred
    const errorAfterInvalid = await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      return api.lmsGetLastError();
    });
    expect(errorAfterInvalid).not.toBe("0");

    // Perform a valid operation
    await setCmiValue(page, "cmi.location", "valid_page");

    // Get the last error - it should be 0 after successful operation
    // Note: Per SCORM spec, GetLastError returns the error from the most recent API call
    const errorAfterValid = await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      // The SetValue above should have cleared the error
      // But we need to make another call to verify
      api.lmsGetValue("cmi.location"); // Successful call
      return api.lmsGetLastError();
    });
    expect(errorAfterValid).toBe("0");
  });

  test("Session time is tracked correctly", async ({ page }) => {
    // Load the module
    await page.goto(`${WRAPPER_PATH}?module=${MODULE_PATH}`);
    await waitForPageReady(page);
    await ensureApiInitialized(page);

    // Configure API to use mock LMS
    await configureLmsEndpoint(page, MOCK_LMS_URL);

    // Wait a moment to accumulate session time
    await page.waitForTimeout(2000);

    // Set session time explicitly (simulating what a module would do)
    await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      api.lmsSetValue("cmi.session_time", "PT2S"); // 2 seconds
      api.lmsCommit();
    });

    await page.waitForTimeout(500);

    // Verify commit includes session data
    const history = await getMockLmsCommitHistory(MOCK_LMS_URL);
    expect(history.length).toBeGreaterThan(0);
  });
});
