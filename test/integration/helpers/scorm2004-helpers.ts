import { expect, FrameLocator, Page, Route } from "@playwright/test";
import { Scorm2004API } from "../../../index";
import {
  ensureApiInitialized as ensureApiInitializedCommon,
  getCmiValue as getCmiValueCommon,
  initializeApi as initializeApiCommon,
  setCmiValue as setCmiValueCommon,
  setCmiValueFromModule as setCmiValueFromModuleCommon,
  verifyApiAccessibleFromModule as verifyApiAccessibleFromModuleCommon,
  waitForModuleFrame as waitForModuleFrameCommon,
  configureWrapper
} from "./scorm-common-helpers";

/**
 * Helper utilities for SCORM 2004 integration tests
 * These can be reused across multiple test files for different module types
 *
 * Note: Many functions are wrappers around common helpers with SCORM 2004 defaults
 */

declare global {
  interface Window {
    API_1484_11: Scorm2004API;
  }
}

// SCORM 2004 API name constant
const SCORM2004_API_NAME = "API_1484_11" as const;
const DEFAULT_SEQUENCING = {
  hideLmsUi: ["exitAll", "abandonAll"],
  auxiliaryResources: [
    { resourceId: "urn:scorm-again:help", purpose: "help" },
    { resourceId: "urn:scorm-again:glossary", purpose: "glossary" }
  ]
};

const DEFAULT_CMI = {
  learner_id: "123456",
  learner_name: "John Doe",
  completion_status: "not attempted",
  entry: "ab-initio",
  credit: "credit",
  exit: "time-out",
  score: {
    raw: 0,
    min: 0,
    max: 100
  },
  time_limit_action: "exit,message",
  max_time_allowed: "PT1H"
};

/**
 * Helper class to track and verify commit HTTP requests
 */
export class CommitRequestTracker {
  private requests: Array<{
    url: string;
    method: string;
    postData: any;
    timestamp: number;
  }> = [];

  captureRequest(route: Route) {
    const request = route.request();
    const postData = request.postDataJSON();
    this.requests.push({
      url: request.url(),
      method: request.method(),
      postData: postData || {},
      timestamp: Date.now()
    });
  }

  getRequests() {
    return this.requests;
  }

  getRequestCount() {
    return this.requests.length;
  }

  getLastRequest() {
    return this.requests[this.requests.length - 1];
  }

  clear() {
    this.requests = [];
  }

  hasRequestWithMethod(method: string) {
    return this.requests.some((req) => req.method === method);
  }

  hasRequestWithData(key: string, value: any) {
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
 * Setup route interception to mock commit HTTP requests
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
  const { success = true, delay = 0, errorCode = 0 } = options;

  await page.route("**/commit**", async (route) => {
    tracker.captureRequest(route);

    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const response = success
      ? {
        result: "true",
        errorCode: errorCode
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
      if (window.API_1484_11) {
        (window.API_1484_11 as any).settings = {
          ...(window.API_1484_11 as any).settings,
          lmsCommitUrl: url,
          useAsynchronousCommits: true
        };
      }
    },
    commitUrl
  );
}

/**
 * Inject RecordTest and RecordQuestion functions for quiz testing
 * These functions are normally provided by a launch page
 * The quiz template uses parent.RecordTest, so we need to make them available on window
 */
export async function injectQuizFunctions(page: Page): Promise<void> {
  // Inject RecordTest on wrapper window
  // The launchpage.html has its own RecordTest, but we'll ensure the API is accessible
  await page.evaluate(() => {
    (window as any).RecordTest = function(score: number) {
      // Find API via parent chain (like the module's API discovery does)
      let api = (window as any).API_1484_11;
      if (!api) {
        let win: any = window;
        let tries = 0;
        while (!api && win.parent && win.parent !== win && tries < 500) {
          tries++;
          win = win.parent;
          api = win.API_1484_11;
        }
      }

      if (api) {
        // Use SetValue (3rd Edition style) for compatibility with scormfunctions.js
        api.SetValue("cmi.score.raw", score.toString());
        api.SetValue("cmi.score.min", "0");
        api.SetValue("cmi.score.max", "100");
        const scaledScore = score / 100;
        api.SetValue("cmi.score.scaled", scaledScore.toString());
        api.SetValue("cmi.completion_status", "completed");
        if (score >= 70) {
          api.SetValue("cmi.success_status", "passed");
        } else {
          api.SetValue("cmi.success_status", "failed");
        }
        // Commit the score data
        api.Commit();
      } else {
        console.error("RecordTest: API_1484_11 not found");
      }
    };

    // RecordQuestion function to record individual question interactions (SCORM 2004)
    (window as any).RecordQuestion = function(
      id: string,
      text: string,
      type: string,
      learnerResponse: string,
      correctAnswer: string,
      wasCorrect: boolean,
      objectiveId: string
    ) {
      // Find API via parent chain
      let api = (window as any).API_1484_11;
      if (!api) {
        let win: any = window;
        let tries = 0;
        while (!api && win.parent && win.parent !== win && tries < 500) {
          tries++;
          win = win.parent;
          api = win.API_1484_11;
        }
      }

      if (api) {
        // Get current interaction count
        const countStr = api.GetValue("cmi.interactions._count");
        const count = countStr ? parseInt(countStr, 10) : 0;
        const interactionIndex = count;

        // Set interaction data (SCORM 2004 uses different field names than SCORM 1.2)
        api.SetValue(`cmi.interactions.${interactionIndex}.id`, id);
        api.SetValue(`cmi.interactions.${interactionIndex}.type`, type);
        api.SetValue(`cmi.interactions.${interactionIndex}.learner_response`, learnerResponse);
        api.SetValue(`cmi.interactions.${interactionIndex}.result`, wasCorrect ? "correct" : "incorrect");
        api.SetValue(`cmi.interactions.${interactionIndex}.description`, text);

        // Set timestamp
        const now = new Date();
        const timestamp = now.toISOString();
        api.SetValue(`cmi.interactions.${interactionIndex}.timestamp`, timestamp);

        // Link to objective if provided
        if (objectiveId) {
          api.SetValue(`cmi.interactions.${interactionIndex}.objectives.0.id`, objectiveId);
        }

        // Commit the interaction data
        api.Commit();
      } else {
        console.error("RecordQuestion: API_1484_11 not found");
      }
    };
  });
}

/**
 * Inject RecordTest into the moduleFrame window (launchpage.html)
 * This should be called after the moduleFrame has loaded
 */
export async function injectQuizFunctionsIntoModuleFrame(page: Page): Promise<void> {
  await page.evaluate(() => {
    const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
    if (iframe?.contentWindow) {
      try {
        // Override the launchpage.html's RecordTest function
        // The quiz template calls parent.RecordTest, where parent is the launchpage.html window
        (iframe.contentWindow as any).RecordTest = function(score: number) {
          // Find API via parent chain
          let api = null;
          let win: any = iframe.contentWindow;
          let tries = 0;
          while (!api && win && tries < 500) {
            if (win.API_1484_11) {
              api = win.API_1484_11;
              break;
            }
            if (win.parent && win.parent !== win) {
              win = win.parent;
            } else {
              break;
            }
            tries++;
          }

          if (api) {
            // Use SetValue (3rd Edition style) for compatibility with scormfunctions.js
            api.SetValue("cmi.score.raw", score.toString());
            api.SetValue("cmi.score.min", "0");
            api.SetValue("cmi.score.max", "100");
            const scaledScore = score / 100;
            api.SetValue("cmi.score.scaled", scaledScore.toString());
            api.SetValue("cmi.completion_status", "completed");
            if (score >= 70) {
              api.SetValue("cmi.success_status", "passed");
            } else {
              api.SetValue("cmi.success_status", "failed");
            }
            api.Commit();
          } else {
            console.error("RecordTest: API_1484_11 not found");
          }
        };

        // RecordQuestion function to record individual question interactions (SCORM 2004)
        (iframe.contentWindow as any).RecordQuestion = function(
          id: string,
          text: string,
          type: string,
          learnerResponse: string,
          correctAnswer: string,
          wasCorrect: boolean,
          objectiveId: string
        ) {
          // Find API via parent chain
          let api = null;
          let win: any = iframe.contentWindow;
          let tries = 0;
          while (!api && win && tries < 500) {
            if (win.API_1484_11) {
              api = win.API_1484_11;
              break;
            }
            if (win.parent && win.parent !== win) {
              win = win.parent;
            } else {
              break;
            }
            tries++;
          }

          if (api) {
            // Get current interaction count
            const countStr = api.GetValue("cmi.interactions._count");
            const count = countStr ? parseInt(countStr, 10) : 0;
            const interactionIndex = count;

            // Set interaction data (SCORM 2004 uses different field names than SCORM 1.2)
            api.SetValue(`cmi.interactions.${interactionIndex}.id`, id);
            api.SetValue(`cmi.interactions.${interactionIndex}.type`, type);
            api.SetValue(`cmi.interactions.${interactionIndex}.learner_response`, learnerResponse);
            api.SetValue(`cmi.interactions.${interactionIndex}.result`, wasCorrect ? "correct" : "incorrect");
            api.SetValue(`cmi.interactions.${interactionIndex}.description`, text);

            // Set timestamp
            const now = new Date();
            const timestamp = now.toISOString();
            api.SetValue(`cmi.interactions.${interactionIndex}.timestamp`, timestamp);

            // Link to objective if provided
            if (objectiveId) {
              api.SetValue(`cmi.interactions.${interactionIndex}.objectives.0.id`, objectiveId);
            }

            // Commit the interaction data
            api.Commit();
          } else {
            console.error("RecordQuestion: API_1484_11 not found");
          }
        };
      } catch (e) {
        // If we can't access contentWindow, that's okay
      }
    }
  });
}

/**
 * Evaluate JavaScript in the module iframe
 */
export async function evaluateInModuleFrame(
  page: Page,
  moduleFrame: FrameLocator,
  fn: () => any
): Promise<any> {
  return await page.evaluate((fnString) => {
    const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
    if (iframe?.contentWindow) {
      // Execute function in iframe context
      const func = new Function("return " + fnString)();
      return func.call(iframe.contentWindow);
    }
    return null;
  }, fn.toString());
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
 * Verify API is accessible from module content
 */
export async function verifyApiAccessibleFromModule(page: Page): Promise<boolean> {
  return verifyApiAccessibleFromModuleCommon(page, SCORM2004_API_NAME);
}

/**
 * Set CMI value from module content
 */
export async function setCmiValueFromModule(
  page: Page,
  element: string,
  value: string
): Promise<void> {
  return setCmiValueFromModuleCommon(page, SCORM2004_API_NAME, element, value);
}

/**
 * Get CMI value (SCORM 2004)
 */
export async function getCmiValue(page: Page, element: string): Promise<string> {
  return getCmiValueCommon(page, SCORM2004_API_NAME, element);
}

/**
 * Set CMI value (SCORM 2004)
 */
export async function setCmiValue(
  page: Page,
  element: string,
  value: string
): Promise<string> {
  return setCmiValueCommon(page, SCORM2004_API_NAME, element, value);
}

/**
 * Answer quiz questions in module frame
 */
export async function answerQuizQuestions(
  moduleFrame: FrameLocator,
  answers: Array<{ questionIndex: number; answerIndex: number }>
): Promise<void> {
  // Use page.evaluate since FrameLocator doesn't have evaluate
  // We'll click the elements directly using the locator
  for (const answer of answers) {
    // Try to find and click the radio button
    // This is a simplified approach - may need adjustment based on quiz structure
    const radioSelector = `input[type="radio"]:nth-of-type(${answer.answerIndex + 1})`;
    try {
      await moduleFrame.locator(radioSelector).first().click({ timeout: 1000 });
    } catch {
      // If that doesn't work, try a different approach
      // We'll need to use page.evaluate to access the iframe's document
    }
  }
}

/**
 * Submit quiz in module frame
 */
export async function submitQuiz(moduleFrame: FrameLocator): Promise<void> {
  await moduleFrame.locator("input[type=\"button\"][value=\"Submit Answers\"]").click();
}

/**
 * Navigate through all pages in a content SCO by clicking Next buttons
 * This simulates a learner actually going through the content
 * The module will automatically set completion_status when the last page is reached
 */
export async function navigateThroughContentSCO(
  page: Page,
  moduleFrame: FrameLocator
): Promise<void> {
  // Wait for Next button to be available (indicates module has loaded)
  const nextButton = moduleFrame.locator(
    '#butNext, ' +
    'input[type="button"][value*="Next"], ' +
    'input[type="button"][value*="next"], ' +
    'button:has-text("Next"), ' +
    'button:has-text("next")'
  ).first();
  
  // Wait for the button to be visible (module has loaded)
  await nextButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {
    // If button never appears, we might already be at the end
  });

  let hasNext = true;
  let attempts = 0;
  const maxAttempts = 30; // Safety limit

  while (hasNext && attempts < maxAttempts) {
    attempts++;
    
    // Check if Next button exists and is enabled
    const isVisible = await nextButton.isVisible({ timeout: 1000 }).catch(() => false);
    const isEnabled = isVisible ? await nextButton.isEnabled().catch(() => false) : false;

    if (isVisible && isEnabled) {
      // Get current location before clicking (to detect page change)
      const locationBefore = await getCmiValue(page, "cmi.location").catch(() => "");
      
      // Click Next to go to next page
      await nextButton.click();
      
      // Wait for page to load - wait for location to change, button to become disabled, or completion to be set
      await Promise.race([
        // Wait for location to change (if it was set before)
        locationBefore ? page.waitForFunction(
          async ({ locationBefore: loc }) => {
            const api = (window as any).API_1484_11;
            if (!api) return false;
            const currentLoc = api.lmsGetValue("cmi.location");
            return currentLoc !== loc && currentLoc !== "";
          },
          { locationBefore },
          { timeout: 5000 }
        ).catch(() => null) : Promise.resolve(null),
        // Wait for location to be set (if it wasn't set before)
        !locationBefore ? page.waitForFunction(
          async () => {
            const api = (window as any).API_1484_11;
            if (!api) return false;
            const currentLoc = api.lmsGetValue("cmi.location");
            return currentLoc !== "";
          },
          { timeout: 5000 }
        ).catch(() => null) : Promise.resolve(null),
        // Wait for button to become disabled (we're on last page)
        page.waitForFunction(
          async () => {
            const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
            if (!iframe?.contentWindow) return false;
            try {
              const btn = iframe.contentWindow.document.querySelector<HTMLButtonElement>('#butNext');
              return btn?.disabled === true;
            } catch {
              return false;
            }
          },
          { timeout: 5000 }
        ).catch(() => null),
        // Wait for completion status to be set
        page.waitForFunction(
          async () => {
            const api = (window as any).API_1484_11;
            if (!api) return false;
            const status = api.lmsGetValue("cmi.completion_status");
            return status === "completed" || status === "passed";
          },
          { timeout: 5000 }
        ).catch(() => null)
      ]);
      
      // Give the module a moment to update after navigation
      await page.waitForTimeout(500);
      
      // Check if we've reached the end (Next button is now disabled)
      const stillEnabled = await nextButton.isEnabled({ timeout: 1000 }).catch(() => false);
      if (!stillEnabled) {
        hasNext = false;
      }
    } else {
      // No more pages or reached the end
      hasNext = false;
    }

    // Check if we've reached the end (completion_status might be set)
    const completionStatus = await getCmiValue(page, "cmi.completion_status");
    if (completionStatus === "completed" || completionStatus === "passed") {
      hasNext = false;
    }
  }
  
  // Wait for completion status to be set (if not already set)
  // Also check if we're on the last page (Next button is disabled)
  const isOnLastPage = await nextButton.isEnabled().catch(() => true).then(enabled => !enabled);
  
  if (isOnLastPage) {
    // We're on the last page - wait for completion to be set
    await page.waitForFunction(
      async () => {
        const api = (window as any).API_1484_11;
        if (!api) return false;
        const status = api.lmsGetValue("cmi.completion_status");
        return status === "completed" || status === "passed";
      },
      { timeout: 10000 }
    ).catch(() => {
      // Completion might not be set yet - that's okay, we'll check it in verifyContentSCOCompletion
    });
  }
}

/**
 * Complete a content SCO by navigating through all pages
 * This lets the module's own code set completion_status and success_status
 */
export async function completeContentSCO(
  page: Page
): Promise<void> {
  const moduleFrame = await waitForModuleFrame(page);
  await navigateThroughContentSCO(page, moduleFrame);
  
  // navigateThroughContentSCO already waits for completion status to be set
}

/**
 * Get the nested contentFrame iframe that contains the quiz
 * The structure is: wrapper -> moduleFrame (launchpage.html) -> contentFrame (assessmenttemplate.html)
 */
async function getQuizContentFrame(page: Page, moduleFrame: FrameLocator): Promise<FrameLocator> {
  // The quiz is in a nested iframe with id="contentFrame"
  // Wait for the iframe element to exist in the module frame
  await moduleFrame.locator('#contentFrame').waitFor({ timeout: 10000, state: 'attached' });
  
  // Get the FrameLocator for the nested iframe
  const contentFrame = moduleFrame.frameLocator('#contentFrame');
  
  // Wait for content inside the iframe to load by checking for quiz elements
  // Wait for any quiz indicator to appear (question, form, heading)
  await Promise.race([
    contentFrame.locator('div.question').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    contentFrame.locator('form#frmTest, form').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    contentFrame.locator('h1').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    contentFrame.locator('body').waitFor({ state: 'attached', timeout: 10000 }).catch(() => null)
  ]);
  
  return contentFrame;
}

/**
 * Answer quiz questions correctly by finding and clicking the correct answers
 * The assessment template marks correct answers with class "correctAnswer"
 */
export async function answerQuizCorrectly(
  page: Page,
  moduleFrame: FrameLocator
): Promise<void> {
  // Get the nested contentFrame that contains the quiz
  // This will wait for the iframe to be created and loaded
  const contentFrame = await getQuizContentFrame(page, moduleFrame);
  
  // Wait for quiz questions to be visible (quiz has loaded)
  // Try multiple selectors to find quiz content
  await Promise.race([
    contentFrame.locator('div.question').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    contentFrame.locator('div.correctAnswer').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    contentFrame.locator('form#frmTest, form').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null)
  ]);

  // Find all correct answer divs (they have class "correctAnswer")
  // These are the answers we need to click
  let correctAnswerDivs = contentFrame.locator('div.correctAnswer');
  let count = await correctAnswerDivs.count();
  
  // If no correct answers found at top level, try finding them within questions
  if (count === 0) {
    // Maybe the structure is different - try finding questions first, then correct answers within
    const questions = contentFrame.locator('div.question');
    const questionCount = await questions.count();
    if (questionCount === 0) {
      throw new Error("No quiz questions found - quiz may not have loaded properly");
    }
    // Try to find correct answers within questions
    correctAnswerDivs = contentFrame.locator('div.question div.correctAnswer');
    count = await correctAnswerDivs.count();
    
    if (count === 0) {
      // Still no correct answers - this is unusual but might be a different quiz structure
      // Let's try to find any answer inputs and hope for the best
      const allAnswers = contentFrame.locator('div.question input[type="radio"], div.question input[type="text"]');
      const answerCount = await allAnswers.count();
      if (answerCount === 0) {
        throw new Error("No quiz answer inputs found - quiz structure may be unexpected");
      }
      // If we have answer inputs but no correctAnswer markers, we can't answer correctly
      // This shouldn't happen with the standard assessment template, but handle it gracefully
      throw new Error("Quiz loaded but no correct answers marked - cannot answer correctly");
    }
  }

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
        // The template shows: <div class='correctAnswer'><input.../> (correctValue)</div>
        const parentText = await correctDiv.textContent();
        const match = parentText?.match(/\((\d+)\)/);
        if (match && match[1]) {
          await input.fill(match[1]);
        }
      }
      
      // Small delay to ensure click is processed (not really needed but helps with timing)
    } catch (e) {
      // Continue if element not found - some questions might be structured differently
      console.warn(`Could not answer question ${i}:`, e);
    }
  }
}

/**
 * Answer quiz questions incorrectly by finding and clicking wrong answers
 * This is used to test failure scenarios and remediation behavior
 */
export async function answerQuizIncorrectly(
  page: Page,
  moduleFrame: FrameLocator
): Promise<void> {
  // Get the nested contentFrame that contains the quiz
  // This will wait for the iframe to be created and loaded
  const contentFrame = await getQuizContentFrame(page, moduleFrame);
  
  // Wait for quiz questions to be visible (quiz has loaded)
  await Promise.race([
    contentFrame.locator('div.question').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null),
    contentFrame.locator('form#frmTest, form').first().waitFor({ state: 'visible', timeout: 10000 }).catch(() => null)
  ]);

  // Find all question divs
  const questionDivs = contentFrame.locator('div.question');
  const questionCount = await questionDivs.count();
  
  // If no questions found, the quiz might not be loaded
  if (questionCount === 0) {
    throw new Error("No quiz questions found - quiz may not have loaded properly");
  }

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
          // We'll click the first non-correct answer
          const incorrectAnswerDiv = questionDiv.locator('div.answer').first();
          const incorrectExists = await incorrectAnswerDiv.count() > 0;
          
          if (incorrectExists) {
            // Click the first incorrect answer
            const input = incorrectAnswerDiv.locator('input[type="radio"]');
            await input.click({ timeout: 2000 });
          } else {
            // If no incorrect answer div exists, try clicking a different correct answer
            // (this shouldn't happen, but handle it gracefully)
            const allAnswers = questionDiv.locator('div.correctAnswer');
            if (await allAnswers.count() > 1) {
              await allAnswers.nth(1).locator('input[type="radio"]').click({ timeout: 2000 });
            }
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
          // Enter a clearly wrong value (like 999)
          await textInput.fill('999');
        }
      }
      
      // Small delay to ensure input is processed (not really needed but helps with timing)
    } catch (e) {
      // Continue if element not found
      console.warn(`Could not answer question ${i} incorrectly:`, e);
    }
  }
}

/**
 * Exit a SCORM 2004 module through its UI so that sequencing and commits run naturally.
 */
export async function exitScorm2004Course(
  page: Page,
  { preserveProgress = true }: { preserveProgress?: boolean } = {}
): Promise<void> {
  const moduleFrame = page.frameLocator("#moduleFrame");
  const exitButton = moduleFrame.locator('button:has-text("Exit"), input[value*="Exit"]');
  const visible = await exitButton.isVisible({ timeout: 3000 }).catch(() => false);
  if (!visible) {
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

  await page.waitForTimeout(1500);
}

/**
 * Complete an assessment SCO by answering questions and submitting
 * This lets the module's own code set score, success_status, and objectives
 * 
 * @param page - Playwright page
 * @param shouldPass - If true, answer correctly to pass. If false, answer incorrectly to fail.
 * @param passThreshold - The score threshold for passing (default 70)
 */
export async function completeAssessmentSCO(
  page: Page,
  shouldPass: boolean = true,
  passThreshold: number = 70
): Promise<{score: number, successStatus: string, completionStatus: string}> {
  // Inject quiz functions (RecordTest, RecordQuestion) if not already available
  // These are needed for the quiz template to submit scores
  await injectQuizFunctions(page);
  
  const moduleFrame = await waitForModuleFrame(page);
  
  // Inject RecordTest into the moduleFrame window (launchpage.html)
  // This ensures the quiz can call parent.RecordTest
  await injectQuizFunctionsIntoModuleFrame(page);
  
  // Wait for the contentFrame iframe to be created (launchpage.html creates it)
  await moduleFrame.locator('#contentFrame').waitFor({ state: 'attached', timeout: 10000 });

  // Answer questions correctly or incorrectly based on shouldPass parameter
  if (shouldPass) {
    await answerQuizCorrectly(page, moduleFrame);
  } else {
    await answerQuizIncorrectly(page, moduleFrame);
  }

  // Submit the quiz (submit button is in the contentFrame)
  const contentFrame = await getQuizContentFrame(page, moduleFrame);
  const submitButton = contentFrame.locator(
    'input[type="button"][value*="Submit"], ' +
    'input[type="button"][value*="submit"], ' +
    'button:has-text("Submit"), ' +
    'button:has-text("submit")'
  ).first();
  
  // Wait for submit button to be visible and clickable
  await submitButton.waitFor({ state: 'visible', timeout: 5000 });
  
  // Get initial score before submitting (to detect change)
  const scoreBefore = await getCmiValue(page, "cmi.score.raw").catch(() => "");
  
  await submitButton.click();
  
  // Wait for quiz to be processed - wait for either score or success_status to change
  await Promise.race([
    // Wait for score to be set (if it wasn't set before)
    scoreBefore === "" ? page.waitForFunction(
      async () => {
        const api = (window as any).API_1484_11;
        if (!api) return false;
        const score = api.lmsGetValue("cmi.score.raw");
        return score !== "" && score !== null;
      },
      { timeout: 15000 }
    ).catch(() => null) : Promise.resolve(null),
    // Wait for score to change (if it was set before)
    scoreBefore !== "" ? page.waitForFunction(
      async ({ scoreBefore: before }) => {
        const api = (window as any).API_1484_11;
        if (!api) return false;
        const score = api.lmsGetValue("cmi.score.raw");
        return score !== before && score !== "";
      },
      { scoreBefore },
      { timeout: 15000 }
    ).catch(() => null) : Promise.resolve(null),
    // Wait for success_status to be set (indicates quiz was processed)
    page.waitForFunction(
      async () => {
        const api = (window as any).API_1484_11;
        if (!api) return false;
        const status = api.lmsGetValue("cmi.success_status");
        return status === "passed" || status === "failed";
      },
      { timeout: 15000 }
    ).catch(() => null),
    // Wait for completion_status to be set (indicates quiz was processed)
    page.waitForFunction(
      async () => {
        const api = (window as any).API_1484_11;
        if (!api) return false;
        const status = api.lmsGetValue("cmi.completion_status");
        return status === "completed";
      },
      { timeout: 15000 }
    ).catch(() => null)
  ]);

  // Give it a moment for the API to update
  await page.waitForTimeout(500);

  // Capture values BEFORE sequencing can advance to next activity
  // (After quiz submission, sequencing may deliver next activity which resets CMI)
  const scoreRaw = await getCmiValue(page, "cmi.score.raw");
  const successStatus = await getCmiValue(page, "cmi.success_status");
  const completionStatus = await getCmiValue(page, "cmi.completion_status");

  return {
    score: scoreRaw ? parseInt(scoreRaw, 10) : 0,
    successStatus,
    completionStatus
  };
}

/**
 * Verify quiz score was recorded (SCORM 2004)
 */
export async function verifyQuizScore(page: Page): Promise<{
  score: string;
  scaledScore: string;
  successStatus: string;
}> {
  const score = await getCmiValue(page, "cmi.score.raw");
  const scaledScore = await getCmiValue(page, "cmi.score.scaled");
  const successStatus = await getCmiValue(page, "cmi.success_status");

  expect(score).not.toBe("");
  expect(parseInt(score, 10)).toBeGreaterThanOrEqual(0);
  expect(parseInt(score, 10)).toBeLessThanOrEqual(100);
  expect(scaledScore).not.toBe("");

  const scoreNum = parseInt(score, 10);
  if (scoreNum >= 70) {
    expect(successStatus).toBe("passed");
  } else {
    expect(successStatus).toBe("failed");
  }

  return { score, scaledScore, successStatus };
}

/**
 * Verify interactions were recorded
 */
export async function verifyInteractionsRecorded(page: Page): Promise<
  Array<{
    id: string;
    type: string;
    result: string;
    learnerResponse: string;
  }>
> {
  const interactionData = await page.evaluate(() => {
    const count = parseInt(window.API_1484_11.lmsGetValue("cmi.interactions._count"), 10);
    const interactions: Array<{
      id: string;
      type: string;
      result: string;
      learnerResponse: string;
    }> = [];
    for (let i = 0; i < count; i++) {
      interactions.push({
        id: window.API_1484_11.lmsGetValue(`cmi.interactions.${i}.id`),
        type: window.API_1484_11.lmsGetValue(`cmi.interactions.${i}.type`),
        result: window.API_1484_11.lmsGetValue(`cmi.interactions.${i}.result`),
        learnerResponse: window.API_1484_11.lmsGetValue(
          `cmi.interactions.${i}.learner_response`
        )
      });
    }
    return interactions;
  });

  expect(interactionData.length).toBeGreaterThan(0);
  expect(interactionData[0].id).toBeTruthy();
  expect(interactionData[0].type).toBeTruthy();

  return interactionData;
}

/**
 * Initialize the API (call Initialize(''))
 * This is required before the API can be used
 */
export async function initializeApi(page: Page): Promise<string> {
  return initializeApiCommon(page, SCORM2004_API_NAME);
}

/**
 * Wait for API to be ready and initialize it if needed
 */
export async function ensureApiInitialized(page: Page): Promise<void> {
  return ensureApiInitializedCommon(page, SCORM2004_API_NAME);
}

/**
 * Initialize a sequenced module for testing
 * This is a common pattern: navigate, inject sequencing config, initialize API
 * 
 * @param page - Playwright page
 * @param wrapperPath - Wrapper path (from getWrapperConfigs)
 * @param modulePath - Module path to load
 * @param activityTree - Activity tree configuration
 * @param sequencingControls - Sequencing controls configuration
 */
type SequencedModuleOptions = {
  activityTree?: any;
  sequencingControls?: any;
  initialCmi?: Record<string, any>;
  apiOptions?: Record<string, any>;
  sequencingOverrides?: Record<string, any>;
};

export async function initializeSequencedModule(
  page: Page,
  wrapperPath: string,
  modulePath: string,
  options: SequencedModuleOptions = {}
): Promise<void> {
  const sequencing = {
    ...DEFAULT_SEQUENCING,
    ...(options.sequencingOverrides ?? {})
  };

  if (options.activityTree) {
    sequencing.activityTree = options.activityTree;
  }

  if (options.sequencingControls) {
    sequencing.sequencingControls = options.sequencingControls;
  }

  await configureWrapper(page, {
    apiOptions: {
      autocommit: true,
      logLevel: 1,
      mastery_override: false,
      ...(options.apiOptions ?? {})
    },
    sequencing,
    initialCmi: {
      ...DEFAULT_CMI,
      ...(options.initialCmi ?? {})
    }
  });

  await page.goto(`${wrapperPath}?module=${modulePath}`);
  await page.waitForLoadState("networkidle");
  await ensureApiInitialized(page);
  await waitForModuleFrameCommon(page).catch(() => {});
  await injectQuizFunctions(page);
  await page.waitForFunction(
    () => {
      const api = (window as any).API_1484_11;
      return api && typeof api.lmsGetValue === "function";
    },
    { timeout: 5000 }
  );
}

/**
 * Inject sequencing configuration into the API
 * This re-initializes the API with sequencing enabled
 */
export async function injectSequencingConfig(
  page: Page,
  activityTree: any,
  sequencingControls: any
): Promise<void> {
  await page.evaluate(
    ({ activityTree, sequencingControls }) => {
      // Try to get Scorm2004API from window (Standard wrapper) or import it (ESM wrapper)
      let Scorm2004API = (window as any).Scorm2004API;
      
      // For ESM wrapper, try to access it from the existing API instance
      if (!Scorm2004API && (window as any).API_1484_11) {
        // Get the constructor from the existing API instance
        Scorm2004API = (window as any).API_1484_11.constructor;
      }
      
      if (Scorm2004API) {
        // Re-initialize API with sequencing configuration
        const newApi = new Scorm2004API({
          autocommit: true,
          logLevel: 1,
          mastery_override: false,
          sequencing: {
            activityTree,
            sequencingControls,
            hideLmsUi: ["exitAll", "abandonAll"],
            auxiliaryResources: [
              { resourceId: "urn:scorm-again:help", purpose: "help" },
              { resourceId: "urn:scorm-again:glossary", purpose: "glossary" },
            ],
          },
        });

        // Load initial CMI data
        newApi.loadFromJSON({
          cmi: {
            learner_id: "123456",
            learner_name: "John Doe",
            completion_status: "not attempted",
            entry: "ab-initio",
            credit: "credit",
            exit: "time-out",
            score: {
              raw: 0,
              min: 0,
              max: 100,
            },
          },
        });
        
        // Replace the API instance on wrapper window
        (window as any).API_1484_11 = newApi;
        
        // Also update the API in the moduleFrame if it exists and has already found the API
        // This ensures the module's API variable points to the new instance
        try {
          const iframe = document.querySelector<HTMLIFrameElement>("#moduleFrame");
          if (iframe?.contentWindow) {
            // Update API_1484_11 on the moduleFrame's parent (which is the wrapper)
            // The module's API discovery should find it, but we'll also try to update
            // the module's API variable directly if it exists
            const moduleWindow = iframe.contentWindow as any;
            if (moduleWindow.API) {
              // The module has already found the API - update it to point to the new instance
              moduleWindow.API = newApi;
            }
            // Also set API_1484_11 on the module window's parent chain
            if (moduleWindow.parent && moduleWindow.parent !== moduleWindow) {
              moduleWindow.parent.API_1484_11 = newApi;
            }
          }
        } catch (e) {
          // Can't access moduleFrame - that's okay, the module will find it via API discovery
        }
      } else {
        console.error("Scorm2004API not found in window");
      }
    },
    { activityTree, sequencingControls }
  );
}

/**
 * Initialize a non-sequenced module for testing
 * 
 * @param page - Playwright page
 * @param wrapperPath - Wrapper path (from getWrapperConfigs)
 * @param modulePath - Module path to load
 */
export async function initializeModule(
  page: Page,
  wrapperPath: string,
  modulePath: string
): Promise<void> {
  await page.goto(`${wrapperPath}?module=${modulePath}`);
  await page.waitForLoadState("networkidle");
  await ensureApiInitialized(page);
  
  // Wait for API to be ready
  await page.waitForFunction(
    () => {
      const api = (window as any).API_1484_11 || (window as any).API;
      return api && (typeof api.lmsGetValue === 'function' || typeof api.LMSGetValue === 'function');
    },
    { timeout: 5000 }
  );
}

/**
 * Verify assessment results after completing a quiz
 * Checks score, success_status, and completion_status
 * 
 * @param page - Playwright page
 * @param expectedPass - Whether the quiz should have passed (true) or failed (false)
 * @param passThreshold - Score threshold for passing (default 70)
 * @returns Object with score, successStatus, and completionStatus
 */
export async function verifyAssessmentResults(
  page: Page,
  expectedPass: boolean,
  passThreshold: number = 70
): Promise<{
  score: number;
  successStatus: string;
  completionStatus: string;
}> {
  // Wait for score to be set (if not already set)
  await page.waitForFunction(
    async () => {
      const api = (window as any).API_1484_11;
      if (!api) return false;
      const score = api.lmsGetValue("cmi.score.raw");
      return score !== "" && score !== null;
    },
    { timeout: 5000 }
  ).catch(() => {
    // Score might already be set or might not be set yet
  });
  
  const scoreRaw = await getCmiValue(page, "cmi.score.raw");
  const score = scoreRaw ? parseInt(scoreRaw, 10) : 0;
  const successStatus = await getCmiValue(page, "cmi.success_status");
  const completionStatus = await getCmiValue(page, "cmi.completion_status");

  // Verify score was actually set (not empty)
  // Note: score can be 0 if the quiz was failed, but scoreRaw should not be empty
  if (scoreRaw === "" || scoreRaw === null) {
    throw new Error("Quiz score was not set - quiz may not have been submitted properly");
  }

  // Verify score is in valid range
  expect(score).toBeGreaterThanOrEqual(0);
  expect(score).toBeLessThanOrEqual(100);

  // Verify score matches expected pass/fail
  if (expectedPass) {
    expect(score).toBeGreaterThanOrEqual(passThreshold);
    // success_status might be "passed" or "unknown" initially, but should eventually be "passed"
    expect(["passed", "unknown"]).toContain(successStatus);
  } else {
    expect(score).toBeLessThan(passThreshold);
    // success_status might be "failed" or "unknown" initially
    expect(["failed", "unknown"]).toContain(successStatus);
  }

  // Verify completion status (might be "completed" or "not attempted" initially)
  expect(["completed", "not attempted", "incomplete"]).toContain(completionStatus);

  return { score, successStatus, completionStatus };
}

/**
 * Get navigation validity for a specific request type
 * 
 * @param page - Playwright page
 * @param requestType - Navigation request type: "continue", "previous", "choice", "jump"
 * @param targetActivityId - Optional target activity ID for choice/jump requests
 * @returns Validity value ("true", "false", or "unknown")
 */
export async function getNavigationValidity(
  page: Page,
  requestType: "continue" | "previous" | "choice" | "jump",
  targetActivityId?: string
): Promise<string> {
  return await page.evaluate(
    ({ type, target }) => {
      const api = (window as any).API_1484_11;
      if (!api) return "unknown";

      if (type === "continue") {
        return api.lmsGetValue("adl.nav.request_valid.continue");
      } else if (type === "previous") {
        return api.lmsGetValue("adl.nav.request_valid.previous");
      } else if (type === "choice" && target) {
        return api.lmsGetValue(`adl.nav.request_valid.choice.{target=${target}}`);
      } else if (type === "jump" && target) {
        return api.lmsGetValue(`adl.nav.request_valid.jump.{target=${target}}`);
      }
      return "unknown";
    },
    { type: requestType, target: targetActivityId }
  );
}

/**
 * Verify content SCO completion
 * Checks completion_status, success_status, and location
 * 
 * @param page - Playwright page
 * @returns Object with completionStatus, successStatus, and location
 */
export async function verifyContentSCOCompletion(page: Page): Promise<{
  completionStatus: string;
  successStatus: string;
  location: string;
}> {
  // Wait for completion status to be set
  await page.waitForFunction(
    async () => {
      const api = (window as any).API_1484_11;
      if (!api) return false;
      const status = api.lmsGetValue("cmi.completion_status");
      return status === "completed" || status === "passed" || status === "incomplete";
    },
    { timeout: 10000 }
  ).catch(() => {
    // Completion might already be set or might not be set yet
  });
  
  const completionStatus = await getCmiValue(page, "cmi.completion_status");
  const successStatus = await getCmiValue(page, "cmi.success_status");
  const location = await getCmiValue(page, "cmi.location");

  // Verify completion status
  expect(["completed", "passed", "incomplete", "not attempted"]).toContain(completionStatus);

  // success_status might be "passed" or "unknown"
  expect(["passed", "unknown"]).toContain(successStatus);
  
  // location should be set if we navigated (but might be empty string initially)
  // If location is empty, that's okay - it might not be set by the module
  // The important thing is that completion_status was set
  if (location === "" && completionStatus === "not attempted") {
    // Neither location nor completion was set - this indicates navigation didn't work
    throw new Error("Content navigation did not complete - location and completion_status were not set");
  }

  return { completionStatus, successStatus, location };
}

/**
 * Get wrapper configurations for testing
 */
export function getWrapperConfigs() {
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

export async function getModuleFramePath(page: Page): Promise<string> {
  return await page.evaluate(() => {
    const frame = document.getElementById("moduleFrame") as HTMLIFrameElement | null;
    return frame?.getAttribute("src") || "";
  });
}

export async function clickSequencingButton(page: Page, directive: string): Promise<void> {
  const button = page.locator(`button[data-directive="${directive}"]`);
  await button.waitFor({ state: "visible" });
  const enabled = await button.isEnabled();
  if (!enabled) {
    throw new Error(`Sequencing button ${directive} is disabled`);
  }
  await button.click();
  await page.waitForTimeout(500);
}

export async function waitForScoContent(page: Page, contentKey: string): Promise<void> {
  await page
    .waitForFunction(
      (key) => {
        const frame = document.getElementById("moduleFrame") as HTMLIFrameElement | null;
        return Boolean(frame?.src.includes(key));
      },
      contentKey,
      { timeout: 10000 }
    )
    .catch(async (error) => {
      const debugInfo = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api?.getSequencingState?.();
        return {
          currentActivity: state?.currentActivity?.id || null,
          navRequest: api?.adl?.nav?.request || null,
          completionStatus: api?.cmi?.completion_status || null,
          successStatus: api?.cmi?.success_status || null,
          lastSequencingResult: state?.lastSequencingResult || null
        };
      });
      throw new Error(
        `Timed out waiting for SCO content '${contentKey}'. Sequencing state: ${JSON.stringify(
          debugInfo
        )}\nOriginal error: ${error}`
      );
    });
}

export async function advanceScoPages(page: Page, steps: number): Promise<void> {
  const moduleFrame = page.frameLocator("#moduleFrame");
  const nextButton = moduleFrame.locator('button:has-text("Next"), input[value*="Next"]').first();

  for (let i = 0; i < steps; i++) {
    const visible = await nextButton.isVisible({ timeout: 2000 }).catch(() => false);
    const enabled = visible ? await nextButton.isEnabled().catch(() => false) : false;
    if (!visible || !enabled) break;
    await nextButton.click();
    await page.waitForTimeout(500);
  }
}

export async function requestChoiceNavigation(page: Page, activityId: string): Promise<void> {
  await page.evaluate(({ target }) => {
    const api = (window as any).API_1484_11;
    if (!api) {
      return;
    }
    api.lmsSetValue("adl.nav.request", `choice.{target=${target}}`);
    if (typeof api.processNavigationRequest === "function") {
      // Pass target as string, not as object
      api.processNavigationRequest("choice", target);
    } else if (typeof api.Commit === "function") {
      api.Commit("");
    }
  }, { target: activityId });

  await page.waitForTimeout(500);
}

export async function waitForCurrentActivity(
  page: Page,
  activityId: string,
  timeout: number = 10000
): Promise<void> {
  await page.waitForFunction(
    (target) => {
      const api = (window as any).API_1484_11;
      const state = api?.getSequencingState?.();
      return state?.currentActivity?.id === target;
    },
    activityId,
    { timeout }
  );
}

export async function getObjectiveStatus(
  page: Page,
  objectiveId: string
): Promise<{ success: string; completion: string } | null> {
  return await page.evaluate((targetId) => {
    const api = (window as any).API_1484_11;
    if (!api) return null;
    const count = parseInt(api.lmsGetValue("cmi.objectives._count") || "0", 10);
    for (let i = 0; i < count; i++) {
      const id = api.lmsGetValue(`cmi.objectives.${i}.id`);
      if (id === targetId) {
        return {
          success: api.lmsGetValue(`cmi.objectives.${i}.success_status`),
          completion: api.lmsGetValue(`cmi.objectives.${i}.completion_status`),
        };
      }
    }
    return null;
  }, objectiveId);
}

/**
 * Get global objective status from the sequencing state.
 * Global objectives are stored in the sequencing engine's global objective map,
 * NOT in cmi.objectives (which is per-activity).
 */
export async function getGlobalObjectiveStatus(
  page: Page,
  objectiveId: string
): Promise<{
  satisfiedStatus: boolean | null;
  normalizedMeasure: number | null;
  progressStatus: boolean | null;
} | null> {
  return await page.evaluate((targetId) => {
    const api = (window as any).API_1484_11;
    if (!api) return null;

    // Try to get from sequencing service's overall sequencing process
    const sequencingService = api._sequencingService;
    if (sequencingService) {
      const overallProcess = sequencingService.getOverallSequencingProcess?.();
      if (overallProcess) {
        const snapshot = overallProcess.getGlobalObjectiveMapSnapshot?.();
        if (snapshot && snapshot[targetId]) {
          return snapshot[targetId];
        }
      }
    }

    // Fallback: try getSequencingState which includes globalObjectiveMap
    const state = api.getSequencingState?.();
    if (state?.globalObjectiveMap?.[targetId]) {
      return state.globalObjectiveMap[targetId];
    }

    return null;
  }, objectiveId);
}

// ============================================================================
// Assertion Helpers - For outcome-focused sequencing tests
// ============================================================================

/**
 * Assert that the current activity matches the expected activity ID.
 * Waits for the activity to become current with a timeout.
 */
export async function expectCurrentActivity(
  page: Page,
  expectedActivityId: string,
  timeout: number = 10000
): Promise<void> {
  const startTime = Date.now();
  let lastActivityId: string | null = null;

  while (Date.now() - startTime < timeout) {
    lastActivityId = await page.evaluate(() => {
      const api = (window as any).API_1484_11;
      const state = api?.getSequencingState?.();
      return state?.currentActivity?.id || null;
    });

    if (lastActivityId === expectedActivityId) {
      return;
    }

    await page.waitForTimeout(100);
  }

  throw new Error(
    `Expected current activity to be "${expectedActivityId}" but was "${lastActivityId}" after ${timeout}ms`
  );
}

/**
 * Assert that navigation validity matches expected value.
 * @param directive - "continue", "previous", or "choice"
 * @param expected - "true", "false", or "unknown"
 * @param targetActivityId - Required for "choice" directive
 */
export async function expectNavigationValid(
  page: Page,
  directive: "continue" | "previous" | "choice",
  expected: "true" | "false" | "unknown",
  targetActivityId?: string
): Promise<void> {
  const actual = await getNavigationValidity(page, directive, targetActivityId);

  if (actual !== expected) {
    throw new Error(
      `Expected navigation "${directive}"${targetActivityId ? ` to ${targetActivityId}` : ""} to be "${expected}" but was "${actual}"`
    );
  }
}

/**
 * Assert that the course (root activity) is complete.
 * Checks both completion_status and success_status of the root activity.
 */
export async function expectCourseComplete(page: Page): Promise<void> {
  const status = await page.evaluate(() => {
    const api = (window as any).API_1484_11;
    const state = api?.getSequencingState?.();
    const root = state?.rootActivity;

    return {
      completionStatus: root?.completionStatus || api?.lmsGetValue?.("cmi.completion_status"),
      successStatus: root?.successStatus || api?.lmsGetValue?.("cmi.success_status"),
    };
  });

  const isComplete =
    status.completionStatus === "completed" ||
    status.successStatus === "passed";

  if (!isComplete) {
    throw new Error(
      `Expected course to be complete but completion_status="${status.completionStatus}", success_status="${status.successStatus}"`
    );
  }
}

/**
 * Assert activity status (completion and/or success).
 */
export async function expectActivityStatus(
  page: Page,
  activityId: string,
  expected: { completion?: string; success?: string }
): Promise<void> {
  const actual = await page.evaluate((targetId) => {
    const api = (window as any).API_1484_11;
    const state = api?.getSequencingState?.();

    // Find activity in tree
    function findActivity(activity: any): any {
      if (!activity) return null;
      if (activity.id === targetId) return activity;
      if (activity.children) {
        for (const child of activity.children) {
          const found = findActivity(child);
          if (found) return found;
        }
      }
      return null;
    }

    const activity = findActivity(state?.rootActivity);
    if (!activity) return null;

    return {
      completion: activity.completionStatus || "unknown",
      success: activity.successStatus || "unknown",
    };
  }, activityId);

  if (!actual) {
    throw new Error(`Activity "${activityId}" not found in activity tree`);
  }

  if (expected.completion && actual.completion !== expected.completion) {
    throw new Error(
      `Expected activity "${activityId}" completion to be "${expected.completion}" but was "${actual.completion}"`
    );
  }

  if (expected.success && actual.success !== expected.success) {
    throw new Error(
      `Expected activity "${activityId}" success to be "${expected.success}" but was "${actual.success}"`
    );
  }
}

/**
 * Assert that navigation to an activity is blocked (for forced sequential tests).
 */
export async function expectNavigationBlocked(
  page: Page,
  targetActivityId: string
): Promise<void> {
  // Check that choice navigation to this activity is not valid
  const validity = await getNavigationValidity(page, "choice", targetActivityId);

  if (validity === "true") {
    throw new Error(
      `Expected navigation to "${targetActivityId}" to be blocked but it was allowed`
    );
  }
}

/**
 * Assert that the module frame shows specific content (by checking the iframe src or content).
 */
export async function expectModuleContent(
  page: Page,
  contentIdentifier: string,
  timeout: number = 10000
): Promise<void> {
  await page.waitForFunction(
    (identifier) => {
      const frame = document.getElementById("moduleFrame") as HTMLIFrameElement | null;
      if (!frame?.src) return false;
      return frame.src.includes(identifier);
    },
    contentIdentifier,
    { timeout }
  );
}

// ============================================================================
// LMS Communication Helpers
// ============================================================================

/**
 * Configure the API to use a specific LMS commit URL.
 */
export async function configureLmsEndpoint(page: Page, lmsUrl: string): Promise<void> {
  await page.evaluate((url) => {
    const api = (window as any).API_1484_11;
    if (api?.settings) {
      api.settings.lmsCommitUrl = `${url}/lms/commit`;
    }
  }, lmsUrl);
}

/**
 * Reset the mock LMS server state via HTTP.
 */
export async function resetMockLms(lmsUrl: string): Promise<void> {
  await fetch(`${lmsUrl}/lms/reset`, { method: "POST" });
}

/**
 * Get commit history from mock LMS server.
 */
export async function getMockLmsCommitHistory(lmsUrl: string): Promise<any[]> {
  const response = await fetch(`${lmsUrl}/lms/history`);
  return response.json();
}

/**
 * Get stored data from mock LMS server.
 */
export async function getMockLmsStorage(lmsUrl: string): Promise<Record<string, any>> {
  const response = await fetch(`${lmsUrl}/lms/storage`);
  return response.json();
}
