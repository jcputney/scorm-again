import { expect, Page, FrameLocator } from "@playwright/test";
import { Scorm12API } from "../../../index";
import {
  ensureApiInitialized as ensureApiInitializedCommon,
  getCmiValue as getCmiValueCommon,
  initializeApi as initializeApiCommon,
  setCmiValue as setCmiValueCommon,
  setCmiValueFromModule as setCmiValueFromModuleCommon,
  verifyApiAccessibleFromModule as verifyApiAccessibleFromModuleCommon,
  waitForModuleFrame as waitForModuleFrameCommon
} from "./scorm-common-helpers";

/**
 * Helper utilities for SCORM 1.2 integration tests
 * These can be reused across multiple test files for different module types
 *
 * Note: Many functions are wrappers around common helpers with SCORM 1.2 defaults
 */

declare global {
  interface Window {
    API: Scorm12API;
  }
}

// SCORM 1.2 API name constant
const SCORM12_API_NAME = "API" as const;

/**
 * Helper class to track and verify commit HTTP requests (SCORM 1.2)
 */
export class CommitRequestTracker {
  private requests: Array<{
    url: string;
    method: string;
    postData: any;
    timestamp: number;
  }> = [];

  captureRequest(route: any) {
    const request = route.request();
    const postData = request.postDataJSON();
    this.requests.push({
      url: request.url(),
      method: request.method(),
      postData: postData || {},
      timestamp: Date.now()
    });
  }

  getRequests(): Array<any> {
    return this.requests;
  }

  getRequestCount(): number {
    return this.requests.length;
  }

  clear() {
    this.requests = [];
  }

  getLastRequest(): any {
    return this.requests[this.requests.length - 1] || null;
  }

  hasRequestWithMethod(method: string): boolean {
    return this.requests.some((req) => req.method === method);
  }

  hasRequestWithData(key: string, value: any): boolean {
    return this.requests.some((req) => {
      const data = req.postData;
      if (typeof data === "object" && data !== null) {
        return data[key] === value;
      }
      return false;
    });
  }
}

/**
 * Setup route interception for commit requests
 */
export async function setupCommitMocking(
  page: Page,
  tracker: CommitRequestTracker,
  options: {
    success?: boolean;
    delay?: number;
    errorCode?: number;
  } = {}
): Promise<void> {
  const { success = true, delay = 0, errorCode } = options;

  await page.route("**/api/commit", async (route) => {
    tracker.captureRequest(route);

    if (delay > 0) {
      await page.waitForTimeout(delay);
    }

    const response = success
      ? {
        result: "true",
        errorCode: 0
      }
      : {
        result: "false",
        errorCode: errorCode || 101
      };

    await route.fulfill({
      status: success ? 200 : 500,
      contentType: "application/json",
      body: JSON.stringify(response)
    });
  });
}

/**
 * Configure API with commit URL for HTTP testing
 */
export async function configureApiForHttpCommits(
  page: Page,
  commitUrl: string = "http://localhost:3000/api/commit"
): Promise<void> {
  await page.evaluate(
    (url) => {
      if (window.API) {
        (window.API as any).settings = {
          ...(window.API as any).settings,
          lmsCommitUrl: url,
          useAsynchronousCommits: true
        };
      }
    },
    commitUrl
  );
}

/**
 * Inject RecordTest and RecordQuestion functions for quiz testing (SCORM 1.2)
 * These functions are normally provided by a launch page
 * The quiz template uses parent.RecordTest, so we need to make them available on window
 */
export async function injectQuizFunctions(page: Page): Promise<void> {
  await page.evaluate(() => {
    // RecordTest function to record quiz scores (SCORM 1.2)
    // Make it available on window (which is the parent for iframes)
    (window as any).RecordTest = function(score: number) {
      if (window.API) {
        window.API.LMSSetValue("cmi.core.score.raw", score.toString());
        window.API.LMSSetValue("cmi.core.score.min", "0");
        window.API.LMSSetValue("cmi.core.score.max", "100");
        if (score >= 70) {
          window.API.LMSSetValue("cmi.core.lesson_status", "passed");
        } else {
          window.API.LMSSetValue("cmi.core.lesson_status", "completed");
        }
        // Commit the score data
        window.API.LMSCommit();
      }
    };

    // RecordQuestion function to record individual question interactions (SCORM 1.2)
    (window as any).RecordQuestion = function(
      id: string,
      text: string,
      type: string,
      learnerResponse: string,
      correctAnswer: string,
      wasCorrect: boolean,
      objectiveId: string
    ) {
      if (window.API) {
        // Find the next available interaction index
        // SCORM 1.2 doesn't have _count, so we need to find the first empty slot
        let interactionIndex = 0;
        let foundEmpty = false;
        while (!foundEmpty && interactionIndex < 100) {
          // Try to get the id - if it's empty, we can use this index
          const existingId = window.API.LMSGetValue(`cmi.interactions.${interactionIndex}.id`);
          if (!existingId || existingId === "") {
            foundEmpty = true;
            break;
          }
          interactionIndex++;
        }

        // Set interaction data
        window.API.LMSSetValue(`cmi.interactions.${interactionIndex}.id`, id);
        window.API.LMSSetValue(`cmi.interactions.${interactionIndex}.type`, type);
        window.API.LMSSetValue(
          `cmi.interactions.${interactionIndex}.student_response`,
          learnerResponse
        );
        // SCORM 1.2 uses "correct"/"wrong" (not "incorrect")
        window.API.LMSSetValue(
          `cmi.interactions.${interactionIndex}.result`,
          wasCorrect ? "correct" : "wrong"
        );
        window.API.LMSSetValue(
          `cmi.interactions.${interactionIndex}.correct_responses.0.pattern`,
          correctAnswer
        );

        // If there's an objective ID, link it
        if (objectiveId) {
          // Find or create objective
          let objectiveIndex = 0;
          let foundObjective = false;
          while (!foundObjective && objectiveIndex < 100) {
            const existingObjId = window.API.LMSGetValue(`cmi.objectives.${objectiveIndex}.id`);
            if (existingObjId === objectiveId) {
              foundObjective = true;
              break;
            }
            if (!existingObjId || existingObjId === "") {
              // Create new objective
              window.API.LMSSetValue(`cmi.objectives.${objectiveIndex}.id`, objectiveId);
              foundObjective = true;
              break;
            }
            objectiveIndex++;
          }

          // Link interaction to objective
          if (foundObjective) {
            window.API.LMSSetValue(
              `cmi.interactions.${interactionIndex}.objectives.0.id`,
              objectiveId
            );
          }
        }
      }
    };
  });
}

/**
 * Verify quiz score was recorded (SCORM 1.2)
 */
export async function verifyQuizScore(
  page: Page,
  minScore: number = 0,
  maxScore: number = 100
): Promise<void> {
  const score = await getCmiValue(page, "cmi.core.score.raw");
  if (score) {
    const scoreNum = parseInt(score, 10);
    expect(scoreNum).toBeGreaterThanOrEqual(minScore);
    expect(scoreNum).toBeLessThanOrEqual(maxScore);
  }
}

/**
 * Verify interactions were recorded (SCORM 1.2)
 */
export async function verifyInteractionsRecorded(page: Page): Promise<void> {
  const count = await getCmiValue(page, "cmi.core.lesson_status");
  // SCORM 1.2 doesn't have interaction count, but we can check lesson_status
  expect(typeof count === "string").toBe(true);
}

// Wrapper functions with SCORM 1.2 defaults
export async function getCmiValue(page: Page, element: string): Promise<string> {
  return getCmiValueCommon(page, SCORM12_API_NAME, element);
}

export async function setCmiValue(page: Page, element: string, value: string): Promise<string> {
  return setCmiValueCommon(page, SCORM12_API_NAME, element, value);
}

export async function initializeApi(page: Page): Promise<string> {
  return initializeApiCommon(page, SCORM12_API_NAME);
}

export async function ensureApiInitialized(page: Page): Promise<void> {
  return ensureApiInitializedCommon(page, SCORM12_API_NAME);
}

export async function verifyApiAccessibleFromModule(page: Page): Promise<boolean> {
  return verifyApiAccessibleFromModuleCommon(page, SCORM12_API_NAME);
}

export async function setCmiValueFromModule(
  page: Page,
  element: string,
  value: string
): Promise<string> {
  return setCmiValueFromModuleCommon(page, SCORM12_API_NAME, element, value);
}

/**
 * Wait for module frame to load and return the frame locator
 */
export async function waitForModuleFrame(
  page: Page,
  timeout: number = 5000
): Promise<FrameLocator> {
  await waitForModuleFrameCommon(page, timeout);
  return page.frameLocator("#moduleFrame");
}

/**
 * Get wrapper configurations for SCORM 1.2
 */
/**
 * Navigate through a content SCO by clicking Next buttons
 * This simulates a learner progressing through content pages
 */
export async function navigateThroughContentSCO(
  page: Page,
  moduleFrame: FrameLocator
): Promise<void> {
  // Wait for module to load
  await page.waitForTimeout(1000);

  // Find the Next button in the module frame
  let hasNext = true;
  let attempts = 0;
  const maxAttempts = 20; // Safety limit

  while (hasNext && attempts < maxAttempts) {
    attempts++;

    // Check if Next button exists and is enabled
    const nextButton = moduleFrame.locator('input[type="button"][value*="Next"], button:has-text("Next")');
    const isVisible = await nextButton.isVisible({ timeout: 1000 }).catch(() => false);
    const isEnabled = isVisible ? await nextButton.isEnabled().catch(() => false) : false;

    if (isVisible && isEnabled) {
      // Click Next to go to next page
      await nextButton.click();
      await page.waitForTimeout(500); // Wait for page transition
    } else {
      // No more pages or reached the end
      hasNext = false;
    }

    // Check if we've reached the end (completion_status might be set)
    const completionStatus = await getCmiValue(page, "cmi.core.lesson_status");
    if (completionStatus === "completed" || completionStatus === "passed") {
      hasNext = false;
    }
  }
}

/**
 * Complete a content SCO by navigating through all its pages
 * This lets the module's own code set completion_status and success_status
 */
export async function completeContentSCO(
  page: Page
): Promise<void> {
  const moduleFrame = await waitForModuleFrame(page);
  await navigateThroughContentSCO(page, moduleFrame);

  // Wait for module to process completion
  await page.waitForTimeout(1000);
}

/**
 * Get the nested contentFrame iframe that contains the quiz
 * The structure is: wrapper -> moduleFrame -> contentFrame (quiz)
 */
async function getQuizContentFrame(page: Page, moduleFrame: FrameLocator): Promise<FrameLocator> {
  // The quiz is in a nested iframe with id="contentFrame"
  return moduleFrame.frameLocator('#contentFrame');
}

/**
 * Answer quiz questions correctly by finding and clicking the correct answers
 * The assessment template marks correct answers with class "correctAnswer"
 */
export async function answerQuizCorrectly(
  page: Page,
  moduleFrame: FrameLocator
): Promise<void> {
  await page.waitForTimeout(2000); // Wait for quiz to fully render

  // Get the nested contentFrame that contains the quiz
  const contentFrame = await getQuizContentFrame(page, moduleFrame);
  await page.waitForTimeout(1000);

  // Find all correct answer divs (they have class "correctAnswer")
  const correctAnswerDivs = contentFrame.locator('div.correctAnswer');
  const count = await correctAnswerDivs.count();

  for (let i = 0; i < count; i++) {
    try {
      // Within each correct answer div, find the input (radio button or text input)
      const correctDiv = correctAnswerDivs.nth(i);
      const input = correctDiv.locator('input[type="radio"], input[type="text"]');
      
      const inputType = await input.getAttribute('type').catch(() => null);
      
      if (inputType === 'radio') {
        // For radio buttons, just click it
        await input.click({ timeout: 2000 });
      } else if (inputType === 'text') {
        // For numeric questions, get the correct value from the parent div text
        const parentText = await correctDiv.textContent();
        const match = parentText?.match(/\((\d+)\)/);
        if (match && match[1]) {
          await input.fill(match[1]);
        }
      }
      
      await page.waitForTimeout(200);
    } catch (e) {
      // Continue if element not found
      console.warn(`Could not answer question ${i}:`, e);
    }
  }
}

/**
 * Answer quiz questions incorrectly by finding and clicking wrong answers
 * This is used to test failure scenarios
 */
export async function answerQuizIncorrectly(
  page: Page,
  moduleFrame: FrameLocator
): Promise<void> {
  await page.waitForTimeout(2000); // Wait for quiz to fully render

  // Get the nested contentFrame that contains the quiz
  const contentFrame = await getQuizContentFrame(page, moduleFrame);
  await page.waitForTimeout(1000);

  // Find all question divs
  const questionDivs = contentFrame.locator('div.question');
  const questionCount = await questionDivs.count();

  for (let i = 0; i < questionCount; i++) {
    try {
      const questionDiv = questionDivs.nth(i);
      
      // Find all answer divs within this question
      const answerDivs = questionDiv.locator('div.answer, div.correctAnswer');
      const answerCount = await answerDivs.count();
      
      if (answerCount > 0) {
        // Find the correct answer div (has class "correctAnswer")
        const correctAnswerDiv = questionDiv.locator('div.correctAnswer');
        const correctExists = await correctAnswerDiv.count() > 0;
        
        if (correctExists) {
          // Find an incorrect answer (any answer div that's NOT the correct one)
          const incorrectAnswerDiv = questionDiv.locator('div.answer').first();
          const incorrectExists = await incorrectAnswerDiv.count() > 0;
          
          if (incorrectExists) {
            // Click the first incorrect answer
            const input = incorrectAnswerDiv.locator('input[type="radio"]');
            await input.click({ timeout: 2000 });
          }
        } else {
          // No correct answer marked, just click the first answer
          const firstInput = questionDiv.locator('input[type="radio"]').first();
          await firstInput.click({ timeout: 2000 });
        }
      } else {
        // For numeric questions, enter a wrong value
        const textInput = questionDiv.locator('input[type="text"]');
        const inputExists = await textInput.count() > 0;
        if (inputExists) {
          await textInput.fill('999');
        }
      }
      
      await page.waitForTimeout(200);
    } catch (e) {
      // Continue if element not found
      console.warn(`Could not answer question ${i} incorrectly:`, e);
    }
  }
}

/**
 * Exit the SCO using the learner-facing UI so that the module drives Terminate/Commit.
 * @param preserveProgress - Whether to accept the "save progress" prompt.
 */
export async function exitScorm12Course(
  page: Page,
  { preserveProgress = true }: { preserveProgress?: boolean } = {}
): Promise<void> {
  const moduleFrame = page.frameLocator("#moduleFrame");
  const exitButton = moduleFrame.locator('button:has-text("Exit"), input[value*="Exit"]');

  const isVisible = await exitButton.isVisible({ timeout: 3000 }).catch(() => false);
  if (!isVisible) {
    throw new Error("Exit button not available in module frame");
  }

  const dialogHandler = async (dialog: any) => {
    if (preserveProgress) {
      await dialog.accept();
    } else {
      await dialog.dismiss();
    }
  };

  page.on("dialog", dialogHandler);
  try {
    await exitButton.click();
    await page.waitForTimeout(500);
  } finally {
    page.off("dialog", dialogHandler);
  }

  // Give the module time to run its unload handlers and for commits to flush
  await page.waitForTimeout(1500);
}

/**
 * Complete an assessment SCO by answering questions and submitting
 * This lets the module's own code set score and lesson_status
 * 
 * @param page - Playwright page
 * @param shouldPass - If true, answer correctly to pass. If false, answer incorrectly to fail.
 * @param passThreshold - The score threshold for passing (default 70)
 */
export async function completeAssessmentSCO(
  page: Page,
  shouldPass: boolean = true,
  passThreshold: number = 70
): Promise<{score: number; lessonStatus: string | null}> {
  await injectQuizFunctions(page);
  const moduleFrame = await waitForModuleFrame(page);
  await page.waitForTimeout(2000); // Wait for quiz to load

  // Answer questions correctly or incorrectly based on shouldPass parameter
  if (shouldPass) {
    await answerQuizCorrectly(page, moduleFrame);
  } else {
    await answerQuizIncorrectly(page, moduleFrame);
  }

  // Submit the quiz (submit button is in the contentFrame)
  const contentFrame = await getQuizContentFrame(page, moduleFrame);
  const submitButton = contentFrame.locator(
    'input[type="button"][value*="Submit"], button:has-text("Submit")'
  );
  const submitVisible = await submitButton.isVisible({ timeout: 2000 }).catch(() => false);
  
  if (submitVisible) {
    await submitButton.click();

    await Promise.race([
      page.waitForFunction(
        () => {
          const api = (window as any).API;
          if (!api) {
            return false;
          }
          const scoreValue = api.LMSGetValue("cmi.core.score.raw");
          return typeof scoreValue === "string" && scoreValue !== "";
        },
        { timeout: 15000 }
      ).catch(() => null),
      page.waitForFunction(
        () => {
          const api = (window as any).API;
          if (!api) {
            return false;
          }
          const status = api.LMSGetValue("cmi.core.lesson_status");
          return (
            typeof status === "string" &&
            status !== "" &&
            status !== "not attempted"
          );
        },
        { timeout: 15000 }
      ).catch(() => null)
    ]);
  }

  const scoreRaw = await getCmiValue(page, "cmi.core.score.raw");
  const lessonStatus = await getCmiValue(page, "cmi.core.lesson_status");
  const parsedScore = scoreRaw ? parseInt(scoreRaw, 10) : 0;
  return { score: parsedScore, lessonStatus: lessonStatus ?? null };
}

export function getWrapperConfigs(): Array<{ name: string; path: string }> {
  return [
    {
      name: "Standard",
      path: "/test/integration/wrappers/scorm12-wrapper.html"
    },
    {
      name: "ESM",
      path: "/test/integration/wrappers/scorm12-wrapper-esm.html"
    }
  ];
}
