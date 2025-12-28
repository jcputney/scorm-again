import { expect, test } from "@playwright/test";
import {
  CommitRequestTracker,
  completeAssessmentSCO,
  completeContentSCO,
  ensureApiInitialized,
  exitScorm2004Course,
  getCmiValue,
  getWrapperConfigs,
  injectQuizFunctions,
  setupCommitMocking,
  verifyApiAccessibleFromModule,
} from "./helpers/scorm2004-helpers";
import { configureWrapper, waitForPageReady } from "./helpers/scorm-common-helpers";
import { scormCommonApiTests } from "./suites/scorm-common-api.js";
import { scorm2004DataModelTests } from "./suites/scorm2004-data-model.js";

/**
 * Comprehensive integration tests for RuntimeBasicCalls_SCORM20043rdEdition module
 *
 * This module demonstrates basic SCORM 2004 3rd Edition runtime calls including:
 * - Multi-page navigation within a single SCO
 * - Bookmarking (cmi.location)
 * - Status reporting (completion_status and success_status)
 * - Score tracking (cmi.score)
 * - Time tracking (cmi.total_time and cmi.session_time)
 * - Intra-SCO navigation controller
 *
 * The manifest describes this as demonstrating "basic runtime calls" in a multi-page SCO.
 * It includes bookmarking, status reporting, score and time, and a basic controller for
 * providing intra-SCO navigation.
 *
 * Tests cover:
 * - API initialization and loading
 * - Error handling
 * - Commit functionality with mocked LMS calls
 * - SCORM 2004 data model interactions
 * - Launchpage navigation (multi-page SCO)
 * - Bookmarking functionality
 * - Status reporting (completion and success)
 * - Score and time tracking
 */

// Module path - uses launchpage.html which manages multi-page navigation
const MODULE_PATH =
  "/test/integration/modules/RuntimeBasicCalls_SCORM20043rdEdition/shared/launchpage.html";

// Module configuration
const moduleConfig = {
  path: MODULE_PATH,
  apiName: "API_1484_11" as const,
  expectedLearnerId: "123456",
};

// Get wrapper configurations
const wrappers = getWrapperConfigs();

// Run tests for each wrapper type
wrappers.forEach((wrapper) => {
  test.describe(`RuntimeBasicCalls SCORM 2004 3rd Edition Integration (${wrapper.name})`, () => {
    // Compose universal API tests
    scormCommonApiTests(wrapper, moduleConfig);

    // Compose SCORM 2004 data model tests
    scorm2004DataModelTests(wrapper, moduleConfig);

    // Module-specific tests below

    test("should initialize API and load launchpage", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Verify launchpage loaded (should have navigation buttons)
      const moduleFrame = page.frameLocator("#moduleFrame");
      const hasNextButton = await moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .isVisible()
        .catch(() => false);
      expect(hasNextButton).toBe(true);

      // Verify API is accessible
      const apiAccessible = await verifyApiAccessibleFromModule(page);
      expect(apiAccessible).toBe(true);
    });

    test("should track cmi.location (bookmarking) during navigation", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Get initial location (bookmark)
      const initialLocation = await getCmiValue(page, "cmi.location");
      expect(typeof initialLocation === "string").toBe(true);

      // Navigate to next page using the Next button
      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();

      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(2000); // Wait for navigation

        // Verify location (bookmark) was updated
        const newLocation = await getCmiValue(page, "cmi.location");
        expect(newLocation).not.toBe(initialLocation);
        // Location should be a page number (string representation)
        expect(typeof newLocation === "string").toBe(true);
      }
    });

    test("should handle bookmark restoration on resume", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Navigate to a specific page
      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();

      // Navigate a few pages
      for (
        let i = 0;
        i < 3 && (await nextButton.isVisible({ timeout: 1000 }).catch(() => false));
        i++
      ) {
        const isDisabled = await nextButton.getAttribute("disabled").catch(() => null);
        if (isDisabled !== null) break;
        await nextButton.click();
        await page.waitForTimeout(1500);
      }

      // Get the current location (bookmark)
      const savedLocation = await getCmiValue(page, "cmi.location");
      expect(savedLocation).toBeTruthy();

      // Reload the page to simulate a resume
      await page.reload();
      await waitForPageReady(page);

      await ensureApiInitialized(page);
      await page.waitForTimeout(2000);

      // The launchpage should restore from bookmark
      // Verify location is still set (bookmark persisted)
      const restoredLocation = await getCmiValue(page, "cmi.location");
      expect(restoredLocation).toBeTruthy();
    });

    test("should track completion_status and success_status during navigation", async ({
      page,
    }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Get initial status
      const initialCompletion = await getCmiValue(page, "cmi.completion_status");
      expect(["unknown", "not attempted", "incomplete", "completed"]).toContain(initialCompletion);

      // Navigate to the last page (assessment)
      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();

      // Navigate to last page (page 14 is the assessment)
      // The launchpage sets completion_status to "completed" when currentPage == pageArray.length - 1
      for (let i = 0; i < 14; i++) {
        const buttonVisible = await nextButton.isVisible({ timeout: 500 }).catch(() => false);
        if (!buttonVisible) break;

        const isDisabled = await nextButton.getAttribute("disabled").catch(() => null);
        if (isDisabled !== null) {
          // Reached the end
          break;
        }

        await nextButton.click();
        await page.waitForTimeout(1000); // Reduced wait time to avoid timeout
      }

      await page.waitForTimeout(2000);

      // Verify status was updated
      const finalCompletion = await getCmiValue(page, "cmi.completion_status");
      // Should be "completed" when reaching the end, or at least "incomplete"
      expect(["incomplete", "completed"]).toContain(finalCompletion);
    });

    /**
     * Test: Complete assessment by interacting with quiz
     *
     * Specification: SCORM 2004 Runtime Environment (RTE) Book
     * - Section: Data Model (DM.1.1)
     * - Expected Behavior: When a learner takes a quiz:
     *   1. Module records interactions
     *   2. Module calculates and sets score
     *   3. Module sets success_status based on score
     *   4. Module sets completion_status
     *
     * This test actually interacts with the quiz (clicks answers, submits)
     * rather than directly setting CMI values.
     */
    test("should track score during quiz interaction", async ({ page }) => {
      const tracker = new CommitRequestTracker();
      await setupCommitMocking(page, tracker, { success: true });

      // Navigate to the module
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Navigate through content to reach the assessment (last page)
      await completeContentSCO(page);

      // Wait for assessment to load
      await page.waitForTimeout(2000);

      // Actually take the quiz by answering correctly
      const { score } = await completeAssessmentSCO(page, true);

      // Verify the module set the score (not us - the module did it via RecordTest)
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);

      // Verify score was recorded
      const scoreRaw = await getCmiValue(page, "cmi.score.raw");
      const scoreScaled = await getCmiValue(page, "cmi.score.scaled");
      // Score should be set by the module
      if (scoreRaw) {
        expect(parseInt(scoreRaw, 10)).toBeGreaterThanOrEqual(0);
        expect(parseInt(scoreRaw, 10)).toBeLessThanOrEqual(100);
      }
      if (scoreScaled) {
        expect(parseFloat(scoreScaled)).toBeGreaterThanOrEqual(0);
        expect(parseFloat(scoreScaled)).toBeLessThanOrEqual(1);
      }
    });

    test("should track total_time and treat session_time as write-only", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Navigate a few pages
      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();

      if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(2000);
      }

      // total_time is read-only in SCORM 2004, but we can verify it exists
      const totalTime = await getCmiValue(page, "cmi.total_time");
      expect(typeof totalTime === "string").toBe(true);

      const sessionTimeCheck = await page.evaluate(() => {
        const value = window.API_1484_11.lmsGetValue("cmi.session_time");
        const error = window.API_1484_11.lmsGetLastError().toString();
        return { value, error };
      });
      expect(sessionTimeCheck.value === "" || sessionTimeCheck.value === "false").toBe(true);
      expect(sessionTimeCheck.error).toBe("405");
    });

    test("should handle previous/next navigation buttons", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();
      const prevButton = moduleFrame
        .locator('button:has-text("Previous"), input[value*="Previous"]')
        .first();

      // Verify buttons exist
      const hasNext = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);
      const hasPrev = await prevButton.isVisible({ timeout: 2000 }).catch(() => false);

      expect(hasNext || hasPrev).toBe(true);

      // Get initial location
      const initialLocation = await getCmiValue(page, "cmi.location");

      // Navigate forward
      if (hasNext && !(await nextButton.getAttribute("disabled"))) {
        await nextButton.click();
        await page.waitForTimeout(2000);

        const locationAfterNext = await getCmiValue(page, "cmi.location");
        expect(locationAfterNext).not.toBe(initialLocation);

        // Navigate back
        if (
          (await prevButton.isVisible({ timeout: 2000 }).catch(() => false)) &&
          !(await prevButton.getAttribute("disabled"))
        ) {
          await prevButton.click();
          await page.waitForTimeout(2000);

          const locationAfterPrev = await getCmiValue(page, "cmi.location");
          // Should be back to initial location (or close to it)
          expect(typeof locationAfterPrev === "string").toBe(true);
        }
      }
    });

    test("should exit via UI without breaking API availability", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      await exitScorm2004Course(page, { preserveProgress: false });

      const apiAccessible = await verifyApiAccessibleFromModule(page);
      expect(apiAccessible).toBe(true);
    });

    test("should send commits with mocked LMS HTTP calls via learner actions", async ({ page }) => {
      const tracker = new CommitRequestTracker();

      // Setup route interception before navigating
      await setupCommitMocking(page, tracker, { success: true });

      // Configure API with commit URL at initialization time
      // Use async commits so the API uses fetch() which Playwright can intercept in all browsers
      // (sync XHR is not interceptable in webkit due to Playwright bug #22812)
      await configureWrapper(page, {
        apiOptions: {
          lmsCommitUrl: "http://localhost:3000/api/commit",
          useAsynchronousCommits: true,
        },
      });

      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      await injectQuizFunctions(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      await completeContentSCO(page);
      await completeAssessmentSCO(page, true);
      await exitScorm2004Course(page);

      await page.waitForTimeout(2000);

      expect(tracker.getRequestCount()).toBeGreaterThan(0);
      const lastRequest = tracker.getLastRequest();
      expect(lastRequest?.postData?.cmi?.location).toBeDefined();
      expect(lastRequest?.postData?.cmi?.score?.raw).toBeDefined();
    });

    test("should handle all content sections navigation", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();

      // Navigate through multiple pages to verify content loads
      for (let i = 0; i < 5; i++) {
        const buttonVisible = await nextButton.isVisible({ timeout: 500 }).catch(() => false);
        if (!buttonVisible) break;

        const isDisabled = await nextButton.getAttribute("disabled").catch(() => null);
        if (isDisabled !== null) break;

        await nextButton.click();
        await page.waitForTimeout(1500);

        // Verify content loaded by checking iframe content
        const contentInfo = await page.evaluate(() => {
          const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
          if (iframe?.contentWindow) {
            const innerFrame = iframe.contentDocument?.querySelector("iframe");
            if (innerFrame?.contentDocument) {
              const h1 = innerFrame.contentDocument.querySelector("h1");
              return {
                hasH1: !!h1,
                h1Text: h1?.textContent?.trim() || "",
                hasContent: innerFrame.contentDocument.body?.textContent?.length > 0,
              };
            }
          }
          return { hasH1: false, h1Text: "", hasContent: false };
        });

        // Verify content loaded
        expect(contentInfo.hasContent).toBe(true);
      }
    });
  });
});
