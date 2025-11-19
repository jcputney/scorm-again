import { expect, test } from "@playwright/test";
import { ensureApiInitialized, getCmiValue, setCmiValue } from "../helpers/scorm-common-helpers";

export type WrapperConfig = {
  name: string;
  path: string;
};

export type ModuleConfig = {
  path: string;
  apiName: "API" | "API_1484_11" | "AICC";
  expectedLearnerId?: string;
};

/**
 * SCORM 1.2 data model tests
 * These tests cover SCORM 1.2-specific CMI data model elements
 *
 * Note: This function should be called within an existing test.describe block
 */
export function scorm12DataModelTests(
  wrapper: WrapperConfig,
  module: ModuleConfig
) {
  test("should handle data model interactions correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test core elements
    const locationResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.core.lesson_location",
      "page-1"
    );
    expect(locationResult).toBe("true");

    const location = await getCmiValue(page, module.apiName, "cmi.core.lesson_location");
    expect(location).toBe("page-1");

    // Test lesson_status
    const statusResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.core.lesson_status",
      "incomplete"
    );
    expect(statusResult).toBe("true");

    const status = await getCmiValue(page, module.apiName, "cmi.core.lesson_status");
    expect(status).toBe("incomplete");

    // Test score
    const scoreRawResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.core.score.raw",
      "85"
    );
    expect(scoreRawResult).toBe("true");

    const scoreRaw = await getCmiValue(page, module.apiName, "cmi.core.score.raw");
    expect(scoreRaw).toBe("85");

    const scoreMax = await getCmiValue(page, module.apiName, "cmi.core.score.max");
    expect(scoreMax).toBe("100");

    // score.min may be empty if not explicitly set - that's valid
    const scoreMin = await getCmiValue(page, module.apiName, "cmi.core.score.min");
    expect(scoreMin === "0" || scoreMin === "").toBe(true);
  });

  test("should handle student data elements", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test mastery_score (read-only, but can be read)
    const masteryScore = await getCmiValue(page, module.apiName, "cmi.student_data.mastery_score");
    expect(typeof masteryScore === "string").toBe(true);

    // Test max_time_allowed (read-only)
    const maxTime = await getCmiValue(page, module.apiName, "cmi.student_data.max_time_allowed");
    expect(typeof maxTime === "string").toBe(true);

    // Test time_limit_action (read-only)
    const timeLimitAction = await getCmiValue(
      page,
      module.apiName,
      "cmi.student_data.time_limit_action"
    );
    expect(typeof timeLimitAction === "string").toBe(true);
  });

  test("should handle student preference settings", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test audio preference
    const audioResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.student_preference.audio",
      "1"
    );
    expect(audioResult).toBe("true");

    const audio = await getCmiValue(page, module.apiName, "cmi.student_preference.audio");
    expect(audio).toBe("1");

    // Test language preference
    const languageResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.student_preference.language",
      "en-US"
    );
    expect(languageResult).toBe("true");

    const language = await getCmiValue(page, module.apiName, "cmi.student_preference.language");
    expect(language).toBe("en-US");

    // Test speed preference
    const speedResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.student_preference.speed",
      "1"
    );
    expect(speedResult).toBe("true");

    const speed = await getCmiValue(page, module.apiName, "cmi.student_preference.speed");
    expect(speed).toBe("1");

    // Test text preference
    const textResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.student_preference.text",
      "1"
    );
    expect(textResult).toBe("true");

    const text = await getCmiValue(page, module.apiName, "cmi.student_preference.text");
    expect(text).toBe("1");
  });

  test("should handle read-only data model elements", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test read-only elements
    const studentId = await getCmiValue(page, module.apiName, "cmi.core.student_id");
    expect(typeof studentId === "string").toBe(true);

    const studentName = await getCmiValue(page, module.apiName, "cmi.core.student_name");
    expect(typeof studentName === "string").toBe(true);

    // Try to set read-only element (should fail)
    const setStudentIdResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.core.student_id",
      "999999"
    );
    expect(setStudentIdResult).toBe("false");

    // Verify it didn't change
    const studentIdAfter = await getCmiValue(page, module.apiName, "cmi.core.student_id");
    expect(studentIdAfter).toBe(studentId);
  });

  test("should handle exit values correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test valid exit values
    // Note: "normal" is normalized to empty string in SCORM 1.2
    // Note: cmi.core.exit is write-only in SCORM 1.2, so we can't read it back
    const validExits = ["time-out", "suspend", "logout", ""];

    for (const exitValue of validExits) {
      const result = await setCmiValue(page, module.apiName, "cmi.core.exit", exitValue);
      expect(result).toBe("true");

      // Exit is write-only, so we can't read it back - just verify setting succeeded
      // Try to read it - should return error or empty
      const exit = await getCmiValue(page, module.apiName, "cmi.core.exit");
      // Write-only elements return error code or empty when read
      expect(typeof exit === "string").toBe(true);
    }
  });

  test("should handle lesson_status values correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test valid lesson_status values
    // Note: When API is initialized, "not attempted" is not valid (only CMIStatus values are allowed)
    // CMIStatus: passed, completed, failed, incomplete, browsed
    // CMIStatus2 (when not initialized): passed, completed, failed, incomplete, browsed, not attempted
    const validStatuses = ["passed", "completed", "failed", "incomplete", "browsed"];

    for (const status of validStatuses) {
      const result = await setCmiValue(
        page,
        module.apiName,
        "cmi.core.lesson_status",
        status
      );
      expect(result).toBe("true");

      const lessonStatus = await getCmiValue(page, module.apiName, "cmi.core.lesson_status");
      expect(lessonStatus).toBe(status);
    }
  });

  test("should handle total_time correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // total_time is read-only in SCORM 1.2
    const totalTime = await getCmiValue(page, module.apiName, "cmi.core.total_time");
    expect(typeof totalTime === "string").toBe(true);

    // Try to set it (should fail)
    const setResult = await setCmiValue(page, module.apiName, "cmi.core.total_time", "PT1H30M");
    expect(setResult).toBe("false");
  });

  test("should handle interactions array correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Create an interaction
    // Note: In SCORM 1.2, ALL interaction fields (id, type, student_response, result, time, latency, weighting)
    // are write-only and can only be read during JSON export. We test setting them and verify
    // that setting succeeds. The only readable part is correct_responses.0.pattern.
    const interactionTests = await page.evaluate(() => {
      const results: any = {};

      // Set interaction 0 - all fields are write-only, so we just verify setting succeeds
      results.setId = window.API.LMSSetValue("cmi.interactions.0.id", "interaction_1");
      // Try to get id - should return error code (write-only element)
      results.getId = window.API.LMSGetValue("cmi.interactions.0.id");
      results.getIdError = window.API.LMSGetLastError();

      results.setType = window.API.LMSSetValue("cmi.interactions.0.type", "choice");
      // Try to get type - should return error code (write-only element)
      results.getType = window.API.LMSGetValue("cmi.interactions.0.type");
      results.getTypeError = window.API.LMSGetLastError();

      // student_response is also write-only
      results.setStudentResponse = window.API.LMSSetValue(
        "cmi.interactions.0.student_response",
        "answer_1"
      );
      results.getStudentResponse = window.API.LMSGetValue("cmi.interactions.0.student_response");
      results.getStudentResponseError = window.API.LMSGetLastError();

      // result is also write-only
      results.setResult = window.API.LMSSetValue("cmi.interactions.0.result", "correct");
      results.getResult = window.API.LMSGetValue("cmi.interactions.0.result");
      results.getResultError = window.API.LMSGetLastError();

      // correct_responses pattern - need to set interaction id first for the array to exist
      // Set the interaction id first (write-only, but needed for the array structure)
      window.API.LMSSetValue("cmi.interactions.0.id", "test_interaction");

      // correct_responses pattern is also write-only in SCORM 1.2
      results.setCorrectResponse = window.API.LMSSetValue(
        "cmi.interactions.0.correct_responses.0.pattern",
        "answer_1"
      );
      // Try to get pattern - should return error code (write-only element)
      results.getCorrectResponse = window.API.LMSGetValue(
        "cmi.interactions.0.correct_responses.0.pattern"
      );
      results.getCorrectResponseError = window.API.LMSGetLastError();

      return results;
    });

    expect(interactionTests.setId).toBe("true");
    // id is write-only, so reading it should return an error code
    expect(parseInt(interactionTests.getIdError, 10)).toBeGreaterThan(0);
    expect(interactionTests.setType).toBe("true");
    // type is write-only, so reading it should return an error code
    expect(parseInt(interactionTests.getTypeError, 10)).toBeGreaterThan(0);
    expect(interactionTests.setStudentResponse).toBe("true");
    // student_response is write-only, so reading it should return an error code
    expect(parseInt(interactionTests.getStudentResponseError, 10)).toBeGreaterThan(0);
    expect(interactionTests.setResult).toBe("true");
    // result is write-only, so reading it should return an error code
    expect(parseInt(interactionTests.getResultError, 10)).toBeGreaterThan(0);
    // correct_responses pattern is also write-only
    expect(interactionTests.setCorrectResponse).toBe("true");
    // pattern is write-only, so reading it should return an error code
    expect(parseInt(interactionTests.getCorrectResponseError, 10)).toBeGreaterThan(0);
  });

  test("should handle objectives array correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Create an objective
    const objectiveTests = await page.evaluate(() => {
      const results: any = {};

      // Set objective 0
      results.setId = window.API.LMSSetValue("cmi.objectives.0.id", "objective_1");
      results.getId = window.API.LMSGetValue("cmi.objectives.0.id");

      results.setStatus = window.API.LMSSetValue("cmi.objectives.0.status", "passed");
      results.getStatus = window.API.LMSGetValue("cmi.objectives.0.status");

      results.setScoreRaw = window.API.LMSSetValue("cmi.objectives.0.score.raw", "85");
      results.getScoreRaw = window.API.LMSGetValue("cmi.objectives.0.score.raw");

      return results;
    });

    expect(objectiveTests.setId).toBe("true");
    expect(objectiveTests.getId).toBe("objective_1");
    expect(objectiveTests.setStatus).toBe("true");
    expect(objectiveTests.getStatus).toBe("passed");
    expect(objectiveTests.setScoreRaw).toBe("true");
    expect(objectiveTests.getScoreRaw).toBe("85");
  });

  test("should handle comments correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    await ensureApiInitialized(page, module.apiName);

    // Test comments
    const commentsResult = await setCmiValue(
      page,
      module.apiName,
      "cmi.comments",
      "This is a test comment"
    );
    expect(commentsResult).toBe("true");

    const comments = await getCmiValue(page, module.apiName, "cmi.comments");
    expect(comments).toBe("This is a test comment");
  });
}

