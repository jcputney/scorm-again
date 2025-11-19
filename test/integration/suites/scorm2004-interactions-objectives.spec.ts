import { expect, test } from "@playwright/test";
import { ensureApiInitialized } from "../helpers/scorm2004-helpers";

export type WrapperConfig = {
  name: string;
  path: string;
};

export type ModuleConfig = {
  path: string;
};

/**
 * SCORM 2004 Interactions and Objectives test suite
 * Tests interaction and objective data model elements
 *
 * Note: This function should be called within an existing test.describe block
 */
export function scorm2004InteractionsObjectivesTests(
  wrapper: WrapperConfig,
  module: ModuleConfig
) {
  // Tests are added to the current describe block context
  test("should handle interactions array correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const interactionTests = await page.evaluate(() => {
      const results: any = {};

      // Create an interaction
      results.createId = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.id",
        "interaction_1"
      );
      results.setType = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.type",
        "choice"
      );
      results.setTimestamp = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.timestamp",
        new Date().toISOString()
      );
      results.setLearnerResponse = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.learner_response",
        "a"
      );
      results.setResult = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.result",
        "correct"
      );
      results.setCorrectResponse = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.correct_responses.0.pattern",
        "a"
      );

      // Get interaction count (may return as number or string)
      results.getCount = window.API_1484_11.lmsGetValue("cmi.interactions._count");

      // Get interaction data
      results.getId = window.API_1484_11.lmsGetValue("cmi.interactions.0.id");
      results.getType = window.API_1484_11.lmsGetValue("cmi.interactions.0.type");
      results.getResult = window.API_1484_11.lmsGetValue("cmi.interactions.0.result");

      return results;
    });

    // Verify interaction creation
    expect(interactionTests.createId).toBe("true");
    expect(interactionTests.setType).toBe("true");
    expect(interactionTests.setTimestamp).toBe("true");
    expect(interactionTests.setLearnerResponse).toBe("true");
    expect(interactionTests.setResult).toBe("true");
    expect(interactionTests.setCorrectResponse).toBe("true");

    // Verify interaction count (may be string or number)
    const interactionCount = interactionTests.getCount;
    expect(interactionCount === "1" || interactionCount === 1).toBe(true);

    // Verify interaction data retrieval
    expect(interactionTests.getId).toBe("interaction_1");
    expect(interactionTests.getType).toBe("choice");
    expect(interactionTests.getResult).toBe("correct");
  });

  test("should handle objectives array correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const objectiveTests = await page.evaluate(() => {
      const results: any = {};

      // Create an objective
      results.createId = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.id",
        "objective_1"
      );
      results.setScore = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.score.raw",
        "85"
      );
      results.setScoreScaled = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.score.scaled",
        "0.85"
      );
      results.setSuccessStatus = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.success_status",
        "passed"
      );
      results.setCompletionStatus = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.completion_status",
        "completed"
      );

      // Get objective count
      results.getCount = window.API_1484_11.lmsGetValue("cmi.objectives._count");

      // Get objective data
      results.getId = window.API_1484_11.lmsGetValue("cmi.objectives.0.id");
      results.getScore = window.API_1484_11.lmsGetValue("cmi.objectives.0.score.raw");
      results.getSuccessStatus = window.API_1484_11.lmsGetValue(
        "cmi.objectives.0.success_status"
      );

      return results;
    });

    // Verify objective creation
    expect(objectiveTests.createId).toBe("true");
    expect(objectiveTests.setScore).toBe("true");
    expect(objectiveTests.setScoreScaled).toBe("true");
    expect(objectiveTests.setSuccessStatus).toBe("true");
    expect(objectiveTests.setCompletionStatus).toBe("true");

    // Verify objective count (may be string or number)
    const objectiveCount = objectiveTests.getCount;
    expect(objectiveCount === "1" || objectiveCount === 1).toBe(true);

    // Verify objective data retrieval
    expect(objectiveTests.getId).toBe("objective_1");
    expect(objectiveTests.getScore).toBe("85");
    expect(objectiveTests.getSuccessStatus).toBe("passed");
  });

  test("should handle comments from learner correctly", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const commentTests = await page.evaluate(() => {
      const results: any = {};

      // Add a comment
      results.setComment = window.API_1484_11.lmsSetValue(
        "cmi.comments_from_learner.0.comment",
        "This is a test comment"
      );
      results.setLocation = window.API_1484_11.lmsSetValue(
        "cmi.comments_from_learner.0.location",
        "Page 1"
      );
      results.setTimestamp = window.API_1484_11.lmsSetValue(
        "cmi.comments_from_learner.0.timestamp",
        new Date().toISOString()
      );

      // Get comment count
      results.getCount = window.API_1484_11.lmsGetValue(
        "cmi.comments_from_learner._count"
      );

      // Get comment data
      results.getComment = window.API_1484_11.lmsGetValue(
        "cmi.comments_from_learner.0.comment"
      );
      results.getLocation = window.API_1484_11.lmsGetValue(
        "cmi.comments_from_learner.0.location"
      );

      return results;
    });

    // Verify comment creation
    expect(commentTests.setComment).toBe("true");
    expect(commentTests.setLocation).toBe("true");
    expect(commentTests.setTimestamp).toBe("true");

    // Verify comment count (may be string or number)
    const commentCount = commentTests.getCount;
    expect(commentCount === "1" || commentCount === 1).toBe(true);

    // Verify comment data retrieval
    expect(commentTests.getComment).toBe("This is a test comment");
    expect(commentTests.getLocation).toBe("Page 1");
  });

  test("should handle interactions with all fields", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const interactionTests = await page.evaluate(() => {
      const results: any = {};

      // Create interaction with all fields
      results.setId = window.API_1484_11.lmsSetValue("cmi.interactions.0.id", "interaction_full");
      results.setType = window.API_1484_11.lmsSetValue("cmi.interactions.0.type", "choice");
      results.setTimestamp = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.timestamp",
        new Date().toISOString()
      );
      results.setLearnerResponse = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.learner_response",
        "a"
      );
      results.setResult = window.API_1484_11.lmsSetValue("cmi.interactions.0.result", "correct");
      results.setWeighting = window.API_1484_11.lmsSetValue("cmi.interactions.0.weighting", "1.0");
      results.setLatency = window.API_1484_11.lmsSetValue("cmi.interactions.0.latency", "PT30S");
      results.setDescription = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.description",
        "Test interaction description"
      );
      results.setCorrectResponse = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.correct_responses.0.pattern",
        "a"
      );

      // Get all fields
      results.getId = window.API_1484_11.lmsGetValue("cmi.interactions.0.id");
      results.getType = window.API_1484_11.lmsGetValue("cmi.interactions.0.type");
      results.getWeighting = window.API_1484_11.lmsGetValue("cmi.interactions.0.weighting");
      results.getLatency = window.API_1484_11.lmsGetValue("cmi.interactions.0.latency");
      results.getDescription = window.API_1484_11.lmsGetValue("cmi.interactions.0.description");

      return results;
    });

    // Verify all fields can be set
    expect(interactionTests.setId).toBe("true");
    expect(interactionTests.setType).toBe("true");
    expect(interactionTests.setWeighting).toBe("true");
    expect(interactionTests.setLatency).toBe("true");
    expect(interactionTests.setDescription).toBe("true");

    // Verify all fields can be retrieved
    expect(interactionTests.getId).toBe("interaction_full");
    expect(interactionTests.getType).toBe("choice");
    expect(interactionTests.getWeighting).toBe("1.0");
    expect(interactionTests.getLatency).toBe("PT30S");
    expect(interactionTests.getDescription).toBe("Test interaction description");
  });

  test("should handle objectives with all fields", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const objectiveTests = await page.evaluate(() => {
      const results: any = {};

      // Create objective with all fields
      results.setId = window.API_1484_11.lmsSetValue("cmi.objectives.0.id", "objective_full");
      results.setDescription = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.description",
        "Test objective description"
      );
      results.setScoreRaw = window.API_1484_11.lmsSetValue("cmi.objectives.0.score.raw", "90");
      results.setScoreScaled = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.score.scaled",
        "0.9"
      );
      results.setSuccessStatus = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.success_status",
        "passed"
      );
      results.setCompletionStatus = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.completion_status",
        "completed"
      );
      results.setProgressMeasure = window.API_1484_11.lmsSetValue(
        "cmi.objectives.0.progress_measure",
        "0.9"
      );

      // Get all fields
      results.getId = window.API_1484_11.lmsGetValue("cmi.objectives.0.id");
      results.getDescription = window.API_1484_11.lmsGetValue("cmi.objectives.0.description");
      results.getProgressMeasure = window.API_1484_11.lmsGetValue(
        "cmi.objectives.0.progress_measure"
      );

      return results;
    });

    // Verify all fields can be set
    expect(objectiveTests.setId).toBe("true");
    expect(objectiveTests.setDescription).toBe("true");
    expect(objectiveTests.setProgressMeasure).toBe("true");

    // Verify all fields can be retrieved
    expect(objectiveTests.getId).toBe("objective_full");
    expect(objectiveTests.getDescription).toBe("Test objective description");
    expect(objectiveTests.getProgressMeasure).toBe("0.9");
  });

  test("should handle multiple interactions and objectives", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const multiTests = await page.evaluate(() => {
      const results: any = {};

      // Create first interaction
      window.API_1484_11.lmsSetValue("cmi.interactions.0.id", "interaction_1");
      window.API_1484_11.lmsSetValue("cmi.interactions.0.type", "choice");
      window.API_1484_11.lmsSetValue("cmi.interactions.0.result", "correct");

      // Create second interaction
      window.API_1484_11.lmsSetValue("cmi.interactions.1.id", "interaction_2");
      window.API_1484_11.lmsSetValue("cmi.interactions.1.type", "true-false");
      window.API_1484_11.lmsSetValue("cmi.interactions.1.result", "incorrect");

      // Create first objective
      window.API_1484_11.lmsSetValue("cmi.objectives.0.id", "objective_1");
      window.API_1484_11.lmsSetValue("cmi.objectives.0.score.raw", "80");

      // Create second objective
      window.API_1484_11.lmsSetValue("cmi.objectives.1.id", "objective_2");
      window.API_1484_11.lmsSetValue("cmi.objectives.1.score.raw", "90");

      // Get counts
      results.interactionCount = window.API_1484_11.lmsGetValue("cmi.interactions._count");
      results.objectiveCount = window.API_1484_11.lmsGetValue("cmi.objectives._count");

      // Get data from both
      results.interaction1Id = window.API_1484_11.lmsGetValue("cmi.interactions.0.id");
      results.interaction2Id = window.API_1484_11.lmsGetValue("cmi.interactions.1.id");
      results.objective1Id = window.API_1484_11.lmsGetValue("cmi.objectives.0.id");
      results.objective2Id = window.API_1484_11.lmsGetValue("cmi.objectives.1.id");

      return results;
    });

    // Verify counts
    expect(parseInt(multiTests.interactionCount, 10)).toBeGreaterThanOrEqual(2);
    expect(parseInt(multiTests.objectiveCount, 10)).toBeGreaterThanOrEqual(2);

    // Verify data from both
    expect(multiTests.interaction1Id).toBe("interaction_1");
    expect(multiTests.interaction2Id).toBe("interaction_2");
    expect(multiTests.objective1Id).toBe("objective_1");
    expect(multiTests.objective2Id).toBe("objective_2");
  });

  test("should handle interaction-objective linking", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const linkingTests = await page.evaluate(() => {
      const results: any = {};

      // Create an objective
      window.API_1484_11.lmsSetValue("cmi.objectives.0.id", "objective_1");

      // Create an interaction linked to that objective
      window.API_1484_11.lmsSetValue("cmi.interactions.0.id", "interaction_1");
      window.API_1484_11.lmsSetValue("cmi.interactions.0.type", "choice");
      results.setObjectiveId = window.API_1484_11.lmsSetValue(
        "cmi.interactions.0.objectives.0.id",
        "objective_1"
      );

      // Verify the link
      results.getObjectiveId = window.API_1484_11.lmsGetValue(
        "cmi.interactions.0.objectives.0.id"
      );
      results.getObjectiveCount = window.API_1484_11.lmsGetValue(
        "cmi.interactions.0.objectives._count"
      );

      return results;
    });

    expect(linkingTests.setObjectiveId).toBe("true");
    expect(linkingTests.getObjectiveId).toBe("objective_1");
    expect(parseInt(linkingTests.getObjectiveCount, 10)).toBeGreaterThanOrEqual(1);
  });
}

