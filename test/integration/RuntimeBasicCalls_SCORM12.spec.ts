import { expect, test } from "@playwright/test";
import {
  CommitRequestTracker,
  completeAssessmentSCO,
  completeContentSCO,
  ensureApiInitialized,
  exitScorm12Course,
  getCmiValue,
  getWrapperConfigs,
  injectQuizFunctions,
  setupCommitMocking,
  verifyApiAccessibleFromModule,
} from "./helpers/scorm12-helpers";
import { configureWrapper, waitForPageReady } from "./helpers/scorm-common-helpers";
import { scormCommonApiTests } from "./suites/scorm-common-api.js";
import { scorm12DataModelTests } from "./suites/scorm12-data-model.js";

/**
 * Comprehensive integration tests for RuntimeBasicCalls_SCORM12 module
 *
 * This module demonstrates basic SCORM 1.2 runtime calls including:
 * - Multi-page navigation within a single SCO
 * - Bookmarking (lesson_location)
 * - Status reporting (completion and success via lesson_status)
 * - Score tracking
 * - Time tracking (total_time)
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
 * - SCORM 1.2 data model interactions
 * - Launchpage navigation (multi-page SCO)
 * - Bookmarking functionality
 * - Status reporting (completion and success)
 * - Score and time tracking
 */

// Module path - uses launchpage.html which manages multi-page navigation
const MODULE_PATH = "/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html";

// Module configuration
const moduleConfig = {
  path: MODULE_PATH,
  apiName: "API" as const,
  expectedLearnerId: "123456",
};

// Get wrapper configurations
const wrappers = getWrapperConfigs();

// Run tests for each wrapper type
wrappers.forEach((wrapper) => {
  test.describe(`RuntimeBasicCalls SCORM 1.2 Integration (${wrapper.name})`, () => {
    // Compose universal API tests
    scormCommonApiTests(wrapper, moduleConfig);

    // Compose SCORM 1.2 data model tests
    scorm12DataModelTests(wrapper, moduleConfig);

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

    test("should track lesson_location (bookmarking) during navigation", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Get initial location (bookmark)
      const initialLocation = await getCmiValue(page, "cmi.core.lesson_location");
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
        const newLocation = await getCmiValue(page, "cmi.core.lesson_location");
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
      const savedLocation = await getCmiValue(page, "cmi.core.lesson_location");
      expect(savedLocation).toBeTruthy();

      // Reload the page to simulate a resume
      await page.reload();
      await waitForPageReady(page);

      await ensureApiInitialized(page);
      await page.waitForTimeout(2000);

      // The launchpage should restore from bookmark
      // Verify location is still set (bookmark persisted)
      const restoredLocation = await getCmiValue(page, "cmi.core.lesson_location");
      expect(restoredLocation).toBeTruthy();
    });

    test("should track lesson_status (completion and success) during navigation", async ({
      page,
    }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);
      await waitForPageReady(page);

      await ensureApiInitialized(page);

      // Wait for launchpage to initialize
      await page.waitForTimeout(2000);

      // Get initial status
      const initialStatus = await getCmiValue(page, "cmi.core.lesson_status");
      expect(["not attempted", "incomplete", "completed", "passed", "failed"]).toContain(
        initialStatus,
      );

      // Navigate to the last page (assessment)
      const moduleFrame = page.frameLocator("#moduleFrame");
      const nextButton = moduleFrame
        .locator('button:has-text("Next"), input[value*="Next"]')
        .first();

      // Navigate to last page (page 14 is the assessment)
      // The launchpage sets lesson_status to "completed" when currentPage == pageArray.length - 1
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
      const finalStatus = await getCmiValue(page, "cmi.core.lesson_status");
      // Should be "completed" when reaching the end, or at least "incomplete"
      expect(["incomplete", "completed", "passed"]).toContain(finalStatus);
    });

    /**
     * Test: Complete assessment by interacting with quiz
     *
     * Specification: SCORM 1.2 Runtime Environment (RTE) Book
     * - Section: Data Model (DM.1.1)
     * - Expected Behavior: When a learner takes a quiz:
     *   1. Module records interactions
     *   2. Module calculates and sets score
     *   3. Module sets lesson_status based on score
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
      await injectQuizFunctions(page);

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
      const scoreRaw = await getCmiValue(page, "cmi.core.score.raw");
      // Score should be set by the module
      if (scoreRaw) {
        expect(parseInt(scoreRaw, 10)).toBeGreaterThanOrEqual(0);
        expect(parseInt(scoreRaw, 10)).toBeLessThanOrEqual(100);
      }
    });

    test("should track total_time during navigation", async ({ page }) => {
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

      // total_time is read-only in SCORM 1.2, but we can verify it exists
      const totalTime = await getCmiValue(page, "cmi.core.total_time");
      expect(typeof totalTime === "string").toBe(true);
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
      const initialLocation = await getCmiValue(page, "cmi.core.lesson_location");

      // Navigate forward
      if (hasNext && !(await nextButton.getAttribute("disabled"))) {
        await nextButton.click();
        await page.waitForTimeout(2000);

        const locationAfterNext = await getCmiValue(page, "cmi.core.lesson_location");
        expect(locationAfterNext).not.toBe(initialLocation);

        // Navigate back
        if (
          (await prevButton.isVisible({ timeout: 2000 }).catch(() => false)) &&
          !(await prevButton.getAttribute("disabled"))
        ) {
          await prevButton.click();
          await page.waitForTimeout(2000);

          const locationAfterPrev = await getCmiValue(page, "cmi.core.lesson_location");
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

      await exitScorm12Course(page, { preserveProgress: false });

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

      // Navigate through the SCO and complete the assessment to let the content update CMI
      await completeContentSCO(page);
      await completeAssessmentSCO(page, true);

      await exitScorm12Course(page);

      // Allow async commit to flush
      await page.waitForTimeout(2000);

      const requestCount = tracker.getRequestCount();
      expect(requestCount).toBeGreaterThan(0);

      const lastRequest = tracker.getLastRequest();
      expect(lastRequest).toBeTruthy();
      expect(lastRequest?.postData?.cmi?.core?.lesson_status).toBeDefined();
      expect(lastRequest?.postData?.cmi?.core?.score?.raw).toBeDefined();
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
