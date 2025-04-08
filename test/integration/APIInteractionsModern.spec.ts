import { expect, test } from "@playwright/test";
import { Scorm12API } from "../../index";

/**
 * This file contains integration tests for API interactions using the modern build.
 * It tests various API methods and their interactions with SCORM modules.
 */

// Extend the Window interface to include the SCORM API
declare global {
  interface Window {
    API: Scorm12API;
  }
}

test.describe("SCORM 1.2 API Modern Build Interactions", () => {
  test("should handle data model interactions correctly", async ({ page }) => {
    // Navigate to the SCORM 1.2 modern wrapper with the golf module
    await page.goto(
      "/test/integration/wrappers/scorm12-wrapper-modern.html?module=/test/integration/modules/RuntimeBasicCalls_SCORM12/shared/launchpage.html",
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
