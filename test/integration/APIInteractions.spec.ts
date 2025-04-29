import { ConsoleMessage, expect, Page, test } from "@playwright/test";
import { Scorm12API } from "../../index";

/**
 * This file contains integration tests for API interactions.
 * It tests various API methods and their interactions with SCORM modules.
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

// Define the wrapper types to test
const wrappers = [
  {
    name: "Standard",
    path: "/test/integration/wrappers/scorm12-wrapper.html",
  },
  {
    name: "Modern",
    path: "/test/integration/wrappers/scorm12-wrapper-modern.html",
  },
  {
    name: "ESM",
    path: "/test/integration/wrappers/scorm12-wrapper-esm.html",
  },
  {
    name: "Cross-Frame",
    path: "/test/integration/wrappers/scorm12-wrapper-cross-frame.html",
  },
];

wrappers.forEach((wrapper) => {
  test.describe(`SCORM 1.2 API Interactions (${wrapper.name})`, () => {
    test("should handle data model interactions correctly", async ({ page }) => {
      // Navigate to the SCORM 1.2 wrapper with the golf module
      await page.goto(
        `${wrapper.path}?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html`,
      );

      // Wait for the page to load and the SCORM API to be initialized
      await page.waitForLoadState("networkidle");

      // Verify that the SCORM API is available
      const apiExists = await page.evaluate(() => {
        return typeof window.API !== "undefined";
      });
      expect(apiExists).toBeTruthy();

      // Test setting and getting various data model elements
      const testInteractions = await page.evaluate(() => {
        const results = {
          studentName: {
            set: window.API.LMSSetValue("cmi.core.student_name", "Test Student"),
            get: window.API.LMSGetValue("cmi.core.student_name"),
          },
          lessonLocation: {
            set: window.API.LMSSetValue("cmi.core.lesson_location", "page1"),
            get: window.API.LMSGetValue("cmi.core.lesson_location"),
          },
          suspendData: {
            set: window.API.LMSSetValue("cmi.suspend_data", "test suspend data"),
            get: window.API.LMSGetValue("cmi.suspend_data"),
          },
          lessonStatus: {
            set: window.API.LMSSetValue("cmi.core.lesson_status", "incomplete"),
            get: window.API.LMSGetValue("cmi.core.lesson_status"),
          },
          score: {
            setRaw: window.API.LMSSetValue("cmi.core.score.raw", "85"),
            getRaw: window.API.LMSGetValue("cmi.core.score.raw"),
          },
          commit: window.API.LMSCommit(),
        };

        // Test error handling
        const errorHandling = {
          invalidElement: {
            setValue: window.API.LMSSetValue("cmi.invalid_element", "test"),
            errorCode: window.API.LMSGetLastError(),
            errorString: window.API.LMSGetErrorString(window.API.LMSGetLastError()),
          },
          readOnlyElement: {
            setValue: window.API.LMSSetValue("cmi.core.student_id", "12345"),
            errorCode: window.API.LMSGetLastError(),
            errorString: window.API.LMSGetErrorString(window.API.LMSGetLastError()),
          },
        };

        return { results, errorHandling };
      });

      // Verify that the data model interactions worked correctly
      expect(testInteractions.results.studentName.set).toBe("false");
      expect(testInteractions.results.studentName.get).toBe("John Doe");
      expect(testInteractions.results.lessonLocation.set).toBe("true");
      expect(testInteractions.results.lessonLocation.get).toBe("page1");
      expect(testInteractions.results.suspendData.set).toBe("true");
      expect(testInteractions.results.suspendData.get).toBe("test suspend data");
      expect(testInteractions.results.lessonStatus.set).toBe("true");
      expect(testInteractions.results.lessonStatus.get).toBe("incomplete");
      expect(testInteractions.results.score.setRaw).toBe("true");
      expect(testInteractions.results.score.getRaw).toBe("85");
      expect(testInteractions.results.commit).toBe("true");

      // Verify that error handling worked correctly
      expect(testInteractions.errorHandling.invalidElement.setValue).toBe("false");
      expect(testInteractions.errorHandling.invalidElement.errorCode).not.toBe("0");
      expect(testInteractions.errorHandling.invalidElement.errorString.length).toBeGreaterThan(0);
      expect(testInteractions.errorHandling.readOnlyElement.setValue).toBe("false");
      expect(testInteractions.errorHandling.readOnlyElement.errorCode).not.toBe("0");
      expect(testInteractions.errorHandling.readOnlyElement.errorString.length).toBeGreaterThan(0);

      // Test finishing the session
      const finishResult = await page.evaluate(() => {
        return window.API.LMSFinish();
      });
      expect(finishResult).toBe("true");
    });
  });

  test.describe(`SCORM Module Integration Tests (${wrapper.name})`, () => {
    test("should load a SCORM 1.2 golf module and initialize correctly", async ({
      page,
    }, testInfo) => {
      // Create a console logger to collect and check console messages
      const consoleLogger = new ConsoleLogger(page);

      // Navigate to the SCORM 1.2 wrapper with the golf module
      await page.goto(
        `${wrapper.path}?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html`,
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
        `${wrapper.path}?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html`,
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
});
