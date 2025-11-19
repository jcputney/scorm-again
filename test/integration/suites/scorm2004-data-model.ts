import { expect, test } from "@playwright/test";
import { ensureApiInitialized } from "../helpers/scorm2004-helpers";

export type WrapperConfig = {
  name: string;
  path: string;
};

export type ModuleConfig = {
  path: string;
};

const SCORM2004_API_NAME = "API_1484_11" as const;

/**
 * SCORM 2004 Data Model test suite
 * Tests all CMI data model elements specific to SCORM 2004
 *
 * Note: This function should be called within an existing test.describe block
 */
export function scorm2004DataModelTests(
  wrapper: WrapperConfig,
  module: ModuleConfig
) {
  // Tests are added to the current describe block context
  test("should handle data model interactions correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const dataModelTests = await page.evaluate(() => {
      const results: any = {};

      // Test location
      results.location = {
        set: window.API_1484_11.lmsSetValue("cmi.location", "page-5"),
        get: window.API_1484_11.lmsGetValue("cmi.location")
      };

      // Test suspend data
      results.suspendData = {
        set: window.API_1484_11.lmsSetValue("cmi.suspend_data", "test_data_123"),
        get: window.API_1484_11.lmsGetValue("cmi.suspend_data")
      };

      // Test completion status
      results.completionStatus = {
        set: window.API_1484_11.lmsSetValue("cmi.completion_status", "incomplete"),
        get: window.API_1484_11.lmsGetValue("cmi.completion_status")
      };

      // Test success status
      results.successStatus = {
        set: window.API_1484_11.lmsSetValue("cmi.success_status", "unknown"),
        get: window.API_1484_11.lmsGetValue("cmi.success_status")
      };

      // Test score
      results.score = {
        setRaw: window.API_1484_11.lmsSetValue("cmi.score.raw", "90"),
        getRaw: window.API_1484_11.lmsGetValue("cmi.score.raw"),
        setScaled: window.API_1484_11.lmsSetValue("cmi.score.scaled", "0.9"),
        getScaled: window.API_1484_11.lmsGetValue("cmi.score.scaled"),
        setMin: window.API_1484_11.lmsSetValue("cmi.score.min", "0"),
        getMin: window.API_1484_11.lmsGetValue("cmi.score.min"),
        setMax: window.API_1484_11.lmsSetValue("cmi.score.max", "100"),
        getMax: window.API_1484_11.lmsGetValue("cmi.score.max")
      };

      // Test session time (write-only, so we can set it but not read it directly)
      results.sessionTime = {
        set: window.API_1484_11.lmsSetValue("cmi.session_time", "PT5M30S"),
        // session_time is write-only in SCORM 2004, so GetValue will return empty or false
        getAttempt: window.API_1484_11.lmsGetValue("cmi.session_time"),
        getError: window.API_1484_11.lmsGetLastError()
      };

      return results;
    });

    // Verify location
    expect(dataModelTests.location.set).toBe("true");
    expect(dataModelTests.location.get).toBe("page-5");

    // Verify suspend data
    expect(dataModelTests.suspendData.set).toBe("true");
    expect(dataModelTests.suspendData.get).toBe("test_data_123");

    // Verify completion status
    expect(dataModelTests.completionStatus.set).toBe("true");
    expect(dataModelTests.completionStatus.get).toBe("incomplete");

    // Verify success status
    expect(dataModelTests.successStatus.set).toBe("true");
    expect(dataModelTests.successStatus.get).toBe("unknown");

    // Verify score
    expect(dataModelTests.score.setRaw).toBe("true");
    expect(dataModelTests.score.getRaw).toBe("90");
    expect(dataModelTests.score.setScaled).toBe("true");
    expect(dataModelTests.score.getScaled).toBe("0.9");
    expect(dataModelTests.score.setMin).toBe("true");
    expect(dataModelTests.score.getMin).toBe("0");
    expect(dataModelTests.score.setMax).toBe("true");
    expect(dataModelTests.score.getMax).toBe("100");

    // Verify session time (write-only element)
    expect(dataModelTests.sessionTime.set).toBe("true");
    // session_time is write-only in SCORM 2004, so GetValue may return empty or "false"
    // The important thing is that SetValue succeeded - GetValue behavior for write-only varies
    expect(["", "false"]).toContain(dataModelTests.sessionTime.getAttempt);
  });

  test("should handle learner preference settings", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const preferenceTests = await page.evaluate(() => {
      const results: any = {};

      // Test audio_level (0.0 to 1.0)
      results.audioLevel = {
        set: window.API_1484_11.lmsSetValue("cmi.learner_preference.audio_level", "0.75"),
        get: window.API_1484_11.lmsGetValue("cmi.learner_preference.audio_level")
      };

      // Test audio_captioning (0 or 1, where 0=false, 1=true)
      results.audioCaptioning = {
        set: window.API_1484_11.lmsSetValue("cmi.learner_preference.audio_captioning", "1"),
        get: window.API_1484_11.lmsGetValue("cmi.learner_preference.audio_captioning")
      };

      // Test delivery_speed (0.0 to 1.0)
      results.deliverySpeed = {
        set: window.API_1484_11.lmsSetValue("cmi.learner_preference.delivery_speed", "1.0"),
        get: window.API_1484_11.lmsGetValue("cmi.learner_preference.delivery_speed")
      };

      // Test language (ISO 639 language code)
      results.language = {
        set: window.API_1484_11.lmsSetValue("cmi.learner_preference.language", "en-US"),
        get: window.API_1484_11.lmsGetValue("cmi.learner_preference.language")
      };

      return results;
    });

    expect(preferenceTests.audioLevel.set).toBe("true");
    expect(preferenceTests.audioLevel.get).toBe("0.75");
    expect(preferenceTests.audioCaptioning.set).toBe("true");
    expect(preferenceTests.audioCaptioning.get).toBe("1"); // audio_captioning uses "0" or "1"
    expect(preferenceTests.deliverySpeed.set).toBe("true");
    expect(preferenceTests.deliverySpeed.get).toBe("1.0");
    expect(preferenceTests.language.set).toBe("true");
    expect(preferenceTests.language.get).toBe("en-US");
  });

  test("should handle read-only data model elements", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const readOnlyTests = await page.evaluate(() => {
      const results: any = {};

      // Test reading read-only elements (should succeed)
      results.version = window.API_1484_11.lmsGetValue("cmi._version");
      results.learnerId = window.API_1484_11.lmsGetValue("cmi.learner_id");
      results.learnerName = window.API_1484_11.lmsGetValue("cmi.learner_name");
      results.credit = window.API_1484_11.lmsGetValue("cmi.credit");
      results.entry = window.API_1484_11.lmsGetValue("cmi.entry");
      results.mode = window.API_1484_11.lmsGetValue("cmi.mode");
      results.launchData = window.API_1484_11.lmsGetValue("cmi.launch_data");

      // Test that setting read-only elements fails
      results.setVersion = window.API_1484_11.lmsSetValue("cmi._version", "2.0");
      results.setVersionError = window.API_1484_11.lmsGetLastError();
      results.setCredit = window.API_1484_11.lmsSetValue("cmi.credit", "no_credit");
      results.setCreditError = window.API_1484_11.lmsGetLastError();
      results.setEntry = window.API_1484_11.lmsSetValue("cmi.entry", "resume");
      results.setEntryError = window.API_1484_11.lmsGetLastError();

      return results;
    });

    // Read-only elements should be readable
    expect(readOnlyTests.version).toBeTruthy();
    expect(readOnlyTests.learnerId).toBeTruthy();
    expect(readOnlyTests.credit).toBeTruthy();
    expect(readOnlyTests.entry).toBeTruthy();
    expect(readOnlyTests.mode).toBeTruthy();

    // Setting read-only elements should fail
    expect(readOnlyTests.setVersion).toBe("false");
    expect(readOnlyTests.setVersionError).toBe("404"); // READ_ONLY_ELEMENT
    expect(readOnlyTests.setCredit).toBe("false");
    expect(readOnlyTests.setCreditError).toBe("404"); // READ_ONLY_ELEMENT
    expect(readOnlyTests.setEntry).toBe("false");
    expect(readOnlyTests.setEntryError).toBe("404"); // READ_ONLY_ELEMENT
  });

  test("should handle exit values correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const exitTests = await page.evaluate(() => {
      const results: any = {};

      // Test all valid exit values (write-only element)
      // Valid values per SCORM 2004: "", "time-out", "suspend", "logout", "normal"
      results.setNormal = window.API_1484_11.lmsSetValue("cmi.exit", "normal");
      results.setSuspend = window.API_1484_11.lmsSetValue("cmi.exit", "suspend");
      results.setLogout = window.API_1484_11.lmsSetValue("cmi.exit", "logout");
      results.setTimeout = window.API_1484_11.lmsSetValue("cmi.exit", "time-out");
      results.setEmpty = window.API_1484_11.lmsSetValue("cmi.exit", "");

      // Test invalid exit value
      results.setInvalid = window.API_1484_11.lmsSetValue("cmi.exit", "invalid");
      results.setInvalidError = window.API_1484_11.lmsGetLastError();

      return results;
    });

    // All valid exit values should succeed
    expect(exitTests.setNormal).toBe("true");
    expect(exitTests.setSuspend).toBe("true");
    expect(exitTests.setLogout).toBe("true");
    // Note: "time-out" (with hyphen) is the correct SCORM 2004 value, not "timeout"
    expect(exitTests.setTimeout).toBe("true");
    expect(exitTests.setEmpty).toBe("true");

    // Invalid exit value should fail
    expect(exitTests.setInvalid).toBe("false");
    expect(exitTests.setInvalidError).not.toBe("0");
  });

  test("should handle progress_measure", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const progressTests = await page.evaluate(() => {
      const results: any = {};

      // Set progress measure (0.0 to 1.0)
      results.setProgress = window.API_1484_11.lmsSetValue("cmi.progress_measure", "0.75");
      results.getProgress = window.API_1484_11.lmsGetValue("cmi.progress_measure");

      // Test invalid values
      results.setInvalid = window.API_1484_11.lmsSetValue("cmi.progress_measure", "1.5");
      results.setInvalidError = window.API_1484_11.lmsGetLastError();

      return results;
    });

    expect(progressTests.setProgress).toBe("true");
    expect(progressTests.getProgress).toBe("0.75");
    // Invalid value should fail (out of range)
    expect(progressTests.setInvalid).toBe("false");
    expect(progressTests.setInvalidError).not.toBe("0");
  });

  test("should handle _children queries", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const childrenTests = await page.evaluate(() => {
      const results: any = {};

      // Get children lists
      results.cmiChildren = window.API_1484_11.lmsGetValue("cmi._children");
      results.scoreChildren = window.API_1484_11.lmsGetValue("cmi.score._children");
      results.interactionsChildren = window.API_1484_11.lmsGetValue(
        "cmi.interactions._children"
      );
      results.objectivesChildren = window.API_1484_11.lmsGetValue("cmi.objectives._children");
      results.commentsChildren = window.API_1484_11.lmsGetValue(
        "cmi.comments_from_learner._children"
      );

      return results;
    });

    // Verify children lists are returned
    expect(childrenTests.cmiChildren.length).toBeGreaterThan(0);
    expect(childrenTests.scoreChildren.length).toBeGreaterThan(0);
    expect(childrenTests.interactionsChildren.length).toBeGreaterThan(0);
    expect(childrenTests.objectivesChildren.length).toBeGreaterThan(0);
    expect(childrenTests.commentsChildren.length).toBeGreaterThan(0);

    // Verify they contain expected elements
    expect(childrenTests.scoreChildren).toContain("raw");
    expect(childrenTests.scoreChildren).toContain("scaled");
    expect(childrenTests.interactionsChildren).toContain("id");
    expect(childrenTests.interactionsChildren).toContain("type");
  });
}

