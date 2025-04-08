import { ConsoleMessage, expect, Page, test } from "@playwright/test";
import { Scorm12API } from "../../index";

/**
 * This file contains integration tests for SCORM 1.2 runtime basic calls using the modern build.
 * It tests loading a SCORM 1.2 module, initializing the API, navigating through the course, and completing it.
 */

// Extend the Window interface to include the SCORM API
declare global {
  interface Window {
    API: Scorm12API;
  }
}

/**
 * Helper class to log and analyze console messages
 */
class ConsoleLogger {
  private page: Page;
  private messages: ConsoleMessage[] = [];

  /**
   * Creates a new ConsoleLogger
   * @param page - The Playwright page to log console messages from
   */
  constructor(page: Page) {
    this.page = page;
    this.setupListener();
  }

  private setupListener() {
    this.page.on("console", (msg) => {
      this.messages.push(msg);
      // console.log(`Console ${msg.type()}: ${msg.text()}`);
    });
  }

  /**
   * Checks if a specific message has been logged
   * @param text - The exact text to look for
   * @returns True if the message was found, false otherwise
   */
  hasMessage(text: string): boolean {
    return this.messages.some((msg) => msg.text() === text);
  }

  /**
   * Checks if a message matching a pattern has been logged
   * @param pattern - The pattern to match against
   * @returns True if a matching message was found, false otherwise
   */
  hasMessageMatching(pattern: RegExp): boolean {
    return this.messages.some((msg) => pattern.test(msg.text()));
  }

  /**
   * Gets all messages matching a pattern
   * @param pattern - The pattern to match against
   * @returns An array of matching messages
   */
  getMessagesMatching(pattern: RegExp): string[] {
    return this.messages.filter((msg) => pattern.test(msg.text())).map((msg) => msg.text());
  }

  /**
   * Gets all logged messages
   * @returns An array of all messages
   */
  getAllMessages(): string[] {
    return this.messages.map((msg) => msg.text());
  }

  /**
   * Waits for a message matching a pattern to be logged
   * @param pattern - The pattern to match against
   * @param timeout - The maximum time to wait in milliseconds
   * @returns A promise that resolves with the message text when a matching message is logged
   */
  waitForMessage(pattern: RegExp, timeout = 5000): Promise<string> {
    // Check if we already have a matching message
    const existingMessage = this.messages.find((msg) => pattern.test(msg.text()));
    if (existingMessage) {
      return Promise.resolve(existingMessage.text());
    }

    return new Promise((resolve, reject) => {
      const listener = (msg: ConsoleMessage) => {
        if (pattern.test(msg.text())) {
          this.page.removeListener("console", listener);
          clearTimeout(timeoutId);
          resolve(msg.text());
        }
      };

      this.page.on("console", listener);

      // Set a timeout to reject the promise if no matching message is logged
      const timeoutId = setTimeout(() => {
        this.page.removeListener("console", listener);
        const allMessages = this.messages.map((m) => m.text()).join("\n");
        reject(
          new Error(
            `Timeout waiting for console message matching ${pattern}. All messages:\n${allMessages}`,
          ),
        );
      }, timeout);

      // Clean up on navigation
      this.page.on("close", () => {
        clearTimeout(timeoutId);
        this.page.removeListener("console", listener);
      });
    });
  }
}

test.describe("SCORM Module Integration Tests with Modern Build", () => {
  test("should load a SCORM 1.2 golf module and initialize correctly", async ({
    page,
  }, testInfo) => {
    // Create a console logger to collect and check console messages
    const consoleLogger = new ConsoleLogger(page);

    // Navigate to the SCORM 1.2 modern wrapper with the golf module
    await page.goto(
      "/test/integration/wrappers/scorm12-wrapper-modern.html?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html",
    );

    // Wait for the page to load and the SCORM API to be initialized
    await page.waitForLoadState("networkidle");

    // Inject code to check if the SCORM API is available
    const apiExists = await page.evaluate(() => {
      // Look for the SCORM 1.2 API
      return typeof window.API !== "undefined";
    });

    // Verify that the SCORM API is available
    expect(apiExists).toBeTruthy();

    const moduleFrame = page.locator("#moduleFrame").contentFrame();
    const contentFrame = moduleFrame.locator("#contentFrame").contentFrame();

    // Click the "Enter Course" button to start the course
    await moduleFrame.locator("#butNext").click();

    // Wait for the LMSInitialize call
    const initMessage = await consoleLogger.waitForMessage(/LMSInitialize/);
    expect(initMessage).toContain("LMSInitialize");

    // Wait for the course to load
    await page.waitForLoadState("networkidle");

    // Verify that the course has started
    expect(await contentFrame.getByRole("heading", { name: "Par" }).isVisible()).toBe(true);

    // Check if student name is set
    const studentName = await page.evaluate(() => {
      return window.API.LMSGetValue("cmi.core.student_name");
    });

    // Student name might be empty in test environment, but the call should succeed
    expect(typeof studentName).toBe("string");

    // Set a value and verify it was set correctly
    await page.evaluate(() => {
      window.API.LMSSetValue("cmi.core.lesson_location", "page1");
      return window.API.LMSCommit();
    });

    const lessonLocation = await page.evaluate(() => {
      return window.API.LMSGetValue("cmi.core.lesson_location");
    });

    expect(lessonLocation).toBe("page1");

    // Navigate through the course
    await moduleFrame.locator("#butNext").click();
    await page.waitForLoadState("networkidle");

    // Verify navigation worked
    expect(await contentFrame.getByRole("heading", { name: "Scoring" }).isVisible()).toBe(true);

    // Complete the course
    await page.evaluate(() => {
      window.API.LMSSetValue("cmi.core.lesson_status", "completed");
      return window.API.LMSCommit();
    });

    const lessonStatus = await page.evaluate(() => {
      return window.API.LMSGetValue("cmi.core.lesson_status");
    });

    expect(lessonStatus).toBe("completed");

    // Finish the session
    const finishResult = await page.evaluate(() => {
      return window.API.LMSFinish();
    });

    expect(finishResult).toBe("true");
  });

  test("should handle errors gracefully", async ({ page }, testInfo) => {
    // Create a console logger to collect and check console messages
    const consoleLogger = new ConsoleLogger(page);

    // Navigate to the SCORM 1.2 modern wrapper with the golf module
    await page.goto(
      "/test/integration/wrappers/scorm12-wrapper-modern.html?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html",
    );

    // Wait for the page to load and the SCORM API to be initialized
    await page.waitForLoadState("networkidle");

    // Try to get a non-existent data model element
    const errorResult = await page.evaluate(() => {
      window.API.LMSGetValue("cmi.non_existent_element");
      return window.API.LMSGetLastError();
    });

    // Should return an error code
    expect(errorResult).not.toBe("0");

    // Get the error string
    const errorString = await page.evaluate(() => {
      return window.API.LMSGetErrorString(window.API.LMSGetLastError());
    });

    // Should return a non-empty error string
    expect(errorString.length).toBeGreaterThan(0);

    // Get diagnostic info
    const diagnosticInfo = await page.evaluate(() => {
      return window.API.LMSGetDiagnostic(window.API.LMSGetLastError());
    });

    // Should return diagnostic info
    expect(diagnosticInfo.length).toBeGreaterThan(0);
  });
});
