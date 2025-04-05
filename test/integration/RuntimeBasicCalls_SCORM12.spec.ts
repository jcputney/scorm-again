import { ConsoleMessage, expect, Page, test } from "@playwright/test";
import { Scorm12API } from "../../index";

/**
 * This file contains integration tests for the SCORM module.
 *
 * Console Message Handling:
 * - The ConsoleLogger class collects all console messages during the test
 * - It provides methods to check for specific messages by exact match or pattern
 * - It can also wait for specific messages to appear if needed
 * - This approach allows checking for messages that have already appeared,
 *   rather than only being able to wait for future messages
 */

// Extend the Window interface to include the SCORM API
declare global {
  interface Window {
    API: Scorm12API;
  }
}

/**
 * Console message logger that collects all console messages and provides methods to check for specific messages
 */
class ConsoleLogger {
  private messages: { text: string; type: string }[] = [];
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.setupListener();
  }

  private setupListener() {
    this.page.on("console", (msg: ConsoleMessage) => {
      const text = msg.text();
      const type = msg.type();
      this.messages.push({ text, type });
    });
  }

  /**
   * Check if a message matching the exact text exists in the collected messages
   * @param text The exact text to match
   * @returns True if a matching message exists, false otherwise
   */
  hasMessage(text: string): boolean {
    return this.messages.some((msg) => msg.text === text);
  }

  /**
   * Check if a message matching the pattern exists in the collected messages
   * @param pattern A regular expression pattern to match
   * @returns True if a matching message exists, false otherwise
   */
  hasMessageMatching(pattern: RegExp): boolean {
    return this.messages.some((msg) => pattern.test(msg.text));
  }

  /**
   * Get all messages that match the pattern
   * @param pattern A regular expression pattern to match
   * @returns An array of matching messages
   */
  getMessagesMatching(pattern: RegExp): string[] {
    return this.messages.filter((msg) => pattern.test(msg.text)).map((msg) => msg.text);
  }

  /**
   * Get all collected messages
   * @returns An array of all collected messages
   */
  getAllMessages(): { text: string; type: string }[] {
    return [...this.messages];
  }

  /**
   * Wait for a message matching the pattern to appear
   * @param pattern A regular expression pattern to match
   * @param timeout Maximum time to wait in milliseconds
   * @returns A promise that resolves with the matching message text
   */
  async waitForMessage(pattern: RegExp, timeout = 5000): Promise<string> {
    // Check if we already have a matching message
    const existingMessage = this.messages.find((msg) => pattern.test(msg.text));
    if (existingMessage) {
      return existingMessage.text;
    }

    // Otherwise, wait for a matching message
    return new Promise<string>((resolve, reject) => {
      const listener = (msg: ConsoleMessage) => {
        const text = msg.text();
        if (pattern.test(text)) {
          this.page.removeListener("console", listener);
          clearTimeout(timeoutId);
          resolve(text);
        }
      };

      this.page.on("console", listener);

      // Set timeout
      const timeoutId = setTimeout(() => {
        this.page.removeListener("console", listener);
        reject(
          new Error(
            `Timeout waiting for console message matching ${pattern}. Messages received: ${this.messages.map((m) => m.text).join(", ")}`,
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

test.describe("SCORM Module Integration Tests", () => {
  test("should load a SCORM 1.2 golf module and initialize correctly", async ({
    page,
  }, testInfo) => {
    // Create a console logger to collect and check console messages
    const consoleLogger = new ConsoleLogger(page);

    // Navigate to the SCORM 1.2 wrapper with the golf module
    await page.goto(
      "/test/integration/wrappers/scorm12-wrapper.html?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html",
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

    // Navigate to the SCORM 1.2 wrapper with the golf module
    await page.goto(
      "/test/integration/wrappers/scorm12-wrapper.html?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html",
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

    // Check for error-related console messages
    expect(consoleLogger.hasMessageMatching(/LMSGetValue/)).toBeTruthy();
    expect(consoleLogger.hasMessageMatching(/LMSGetLastError/)).toBeTruthy();
    expect(consoleLogger.hasMessageMatching(/LMSGetErrorString/)).toBeTruthy();

    // Get all error-related messages
    const errorMessages = consoleLogger.getMessagesMatching(/error/i);
    console.log("Error-related messages:", errorMessages);
  });
});
