import { expect, test } from "@playwright/test";
import { Scorm2004API } from "../../index";

/**
 * This file contains integration tests for SCORM 2004 API interactions.
 * It tests various API methods and their interactions with SCORM 2004 modules.
 */

// Extend the Window interface to include the SCORM 2004 API
declare global {
  interface Window {
    API_1484_11: Scorm2004API;
  }
}

test.describe("SCORM 2004 API Interactions", () => {
  test("should handle basic data model interactions correctly", async ({
    page,
  }) => {
    // Listen for all console events and handle errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`Console error: ${msg.text()}`);
      } else {
        // console.log(`Console message: ${msg.text()}`);
      }
    });

    // Navigate to the SCORM 2004 wrapper with the basic calls module
    await page.goto(
      "/test/integration/wrappers/scorm2004-wrapper.html?module=/test/integration/modules/RuntimeBasicCalls_SCORM20043rdEdition/shared/launchpage.html",
    );

    // Wait for the page to load and the SCORM API to be initialized
    await page.waitForLoadState("networkidle");

    // Verify that the SCORM API is available
    const apiExists = await page.evaluate(() => {
      return typeof window.API_1484_11 !== "undefined";
    });
    expect(apiExists).toBeTruthy();

    // Test setting and getting various data model elements
    const testInteractions = await page.evaluate(() => {
      const results = {
        learnerName: {
          set: window.API_1484_11.lmsSetValue(
            "cmi.learner_name",
            "Test Student",
          ),
          get: window.API_1484_11.lmsGetValue("cmi.learner_name"),
        },
        location: {
          set: window.API_1484_11.lmsSetValue("cmi.location", "page1"),
          get: window.API_1484_11.lmsGetValue("cmi.location"),
        },
        suspendData: {
          set: window.API_1484_11.lmsSetValue(
            "cmi.suspend_data",
            "test suspend data",
          ),
          get: window.API_1484_11.lmsGetValue("cmi.suspend_data"),
        },
        completionStatus: {
          set: window.API_1484_11.lmsSetValue(
            "cmi.completion_status",
            "incomplete",
          ),
          get: window.API_1484_11.lmsGetValue("cmi.completion_status"),
        },
        successStatus: {
          set: window.API_1484_11.lmsSetValue("cmi.success_status", "unknown"),
          get: window.API_1484_11.lmsGetValue("cmi.success_status"),
        },
        score: {
          setRaw: window.API_1484_11.lmsSetValue("cmi.score.raw", "85"),
          getRaw: window.API_1484_11.lmsGetValue("cmi.score.raw"),
          setScaled: window.API_1484_11.lmsSetValue("cmi.score.scaled", "0.85"),
          getScaled: window.API_1484_11.lmsGetValue("cmi.score.scaled"),
        },
        commit: window.API_1484_11.lmsCommit(),
      };

      // Test error handling
      const errorHandling = {
        invalidElement: {
          setValue: window.API_1484_11.SetValue("cmi.invalid_element", "test"),
          errorCode: window.API_1484_11.GetLastError(),
          errorString: window.API_1484_11.GetErrorString(
            window.API_1484_11.GetLastError(),
          ),
          diagnosticInfo: window.API_1484_11.GetDiagnostic(
            window.API_1484_11.GetLastError(),
          ),
        },
        readOnlyElement: {
          setValue: window.API_1484_11.SetValue("cmi.learner_id", "12345"),
          errorCode: window.API_1484_11.GetLastError(),
          errorString: window.API_1484_11.GetErrorString(
            window.API_1484_11.GetLastError(),
          ),
          diagnosticInfo: window.API_1484_11.GetDiagnostic(
            window.API_1484_11.GetLastError(),
          ),
        },
        typeMismatch: {
          // Set up an interaction
          setupId: window.API_1484_11.SetValue(
            "cmi.interactions.0.id",
            "interaction_1",
          ),
          setupType: window.API_1484_11.SetValue(
            "cmi.interactions.0.type",
            "true-false",
          ),
          // Try to set an invalid value for a true-false interaction (should be "true" or "false")
          setValue: window.API_1484_11.SetValue(
            "cmi.interactions.0.correct_responses.0.pattern",
            "invalid_value",
          ),
          errorCode: window.API_1484_11.GetLastError(),
          errorString: window.API_1484_11.GetErrorString(
            window.API_1484_11.GetLastError(),
          ),
          diagnosticInfo: window.API_1484_11.GetDiagnostic(
            window.API_1484_11.GetLastError(),
          ),
        },
        invalidTimestamp: {
          // Try to set an invalid timestamp value
          setValue: window.API_1484_11.SetValue(
            "cmi.interactions.0.timestamp",
            "invalid_timestamp",
          ),
          errorCode: window.API_1484_11.GetLastError(),
          errorString: window.API_1484_11.GetErrorString(
            window.API_1484_11.GetLastError(),
          ),
          diagnosticInfo: window.API_1484_11.GetDiagnostic(
            window.API_1484_11.GetLastError(),
          ),
        },
      };

      return { results, errorHandling };
    });

    // Verify that the data model interactions worked correctly
    expect(testInteractions.results.learnerName.set).toBe("false");
    expect(testInteractions.results.learnerName.get).toBe("John Doe");
    expect(testInteractions.results.location.set).toBe("true");
    expect(testInteractions.results.location.get).toBe("page1");
    expect(testInteractions.results.suspendData.set).toBe("true");
    expect(testInteractions.results.suspendData.get).toBe("test suspend data");
    expect(testInteractions.results.completionStatus.set).toBe("true");
    expect(testInteractions.results.completionStatus.get).toBe("incomplete");
    expect(testInteractions.results.successStatus.set).toBe("true");
    expect(testInteractions.results.successStatus.get).toBe("unknown");
    expect(testInteractions.results.score.setRaw).toBe("true");
    expect(testInteractions.results.score.getRaw).toBe("85");
    expect(testInteractions.results.score.setScaled).toBe("true");
    expect(testInteractions.results.score.getScaled).toBe("0.85");
    expect(testInteractions.results.commit).toBe("true");

    // Verify that error handling worked correctly
    expect(testInteractions.errorHandling.invalidElement.setValue).toBe(
      "false",
    );
    expect(testInteractions.errorHandling.invalidElement.errorCode).toBe(
      "401", // UNDEFINED_DATA_MODEL
    );
    expect(
      testInteractions.errorHandling.invalidElement.errorString.length,
    ).toBeGreaterThan(0);
    expect(
      testInteractions.errorHandling.invalidElement.diagnosticInfo.length,
    ).toBeGreaterThan(0);
    expect(testInteractions.errorHandling.readOnlyElement.setValue).toBe(
      "false",
    );
    expect(testInteractions.errorHandling.readOnlyElement.errorCode).toBe(
      "404", // READ_ONLY_ELEMENT
    );
    expect(
      testInteractions.errorHandling.readOnlyElement.errorString.length,
    ).toBeGreaterThan(0);
    expect(
      testInteractions.errorHandling.readOnlyElement.diagnosticInfo.length,
    ).toBeGreaterThan(0);

    // Verify TYPE_MISMATCH error for invalid interaction value
    expect(testInteractions.errorHandling.typeMismatch.setupId).toBe("true");
    expect(testInteractions.errorHandling.typeMismatch.setupType).toBe("true");
    expect(testInteractions.errorHandling.typeMismatch.setValue).toBe("false");
    expect(testInteractions.errorHandling.typeMismatch.errorCode).toBe(
      "406", // TYPE_MISMATCH
    );
    expect(
      testInteractions.errorHandling.typeMismatch.errorString.length,
    ).toBeGreaterThan(0);
    expect(
      testInteractions.errorHandling.typeMismatch.diagnosticInfo.length,
    ).toBeGreaterThan(0);

    // Verify TYPE_MISMATCH error for invalid timestamp
    expect(testInteractions.errorHandling.invalidTimestamp.setValue).toBe(
      "false",
    );
    expect(testInteractions.errorHandling.invalidTimestamp.errorCode).toBe(
      "406", // TYPE_MISMATCH
    );
    expect(
      testInteractions.errorHandling.invalidTimestamp.errorString.length,
    ).toBeGreaterThan(0);
    expect(
      testInteractions.errorHandling.invalidTimestamp.diagnosticInfo.length,
    ).toBeGreaterThan(0);

    // Test finishing the session
    const finishResult = await page.evaluate(() => {
      return window.API_1484_11.lmsFinish();
    });
    expect(finishResult).toBe("true");
  });

  test("should handle advanced data model interactions", async ({ page }) => {
    // Navigate to the SCORM 2004 wrapper with the advanced calls module
    await page.goto(
      "/test/integration/wrappers/scorm2004-wrapper.html?module=/test/integration/modules/RunTimeAdvancedCalls_SCORM20043rdEdition/shared/launchpage.html",
    );

    // Wait for the page to load and the SCORM API to be initialized
    await page.waitForLoadState("networkidle");

    // Test interactions with more complex data model elements
    const advancedInteractions = await page.evaluate(() => {
      // Initialize the API if it's not already initialized
      if (window.API_1484_11.lmsGetValue("cmi.completion_status") === "") {
        window.API_1484_11.lmsInitialize();
      }

      // Test interactions array
      const interactionResults = {
        // Create a new interaction
        createInteraction: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.id",
          "interaction_1",
        ),
        setType: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.type",
          "choice",
        ),
        setTimestamp: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.timestamp",
          new Date().toISOString(),
        ),
        setWeighting: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.weighting",
          "1",
        ),
        setLearnerResponse: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.learner_response",
          "a[,]b",
        ),
        setResult: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.result",
          "correct",
        ),
        setLatency: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.latency",
          "PT1M30S",
        ),

        // Add correct responses
        setCorrectResponse: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.correct_responses.0.pattern",
          "a[,]b",
        ),

        // Add objectives
        setObjective: window.API_1484_11.lmsSetValue(
          "cmi.interactions.0.objectives.0.id",
          "objective_1",
        ),

        // Get the count of interactions
        getInteractionCount: window.API_1484_11.lmsGetValue(
          "cmi.interactions._count",
        ),

        // Get the interaction data
        getId: window.API_1484_11.lmsGetValue("cmi.interactions.0.id"),
        getType: window.API_1484_11.lmsGetValue("cmi.interactions.0.type"),
        getResult: window.API_1484_11.lmsGetValue("cmi.interactions.0.result"),
        getLearnerResponse: window.API_1484_11.lmsGetValue(
          "cmi.interactions.0.learner_response",
        ),
        getCorrectResponse: window.API_1484_11.lmsGetValue(
          "cmi.interactions.0.correct_responses.0.pattern",
        ),
        getObjective: window.API_1484_11.lmsGetValue(
          "cmi.interactions.0.objectives.0.id",
        ),
      };

      // Test objectives array
      const objectiveResults = {
        // Create a new objective
        createObjective: window.API_1484_11.lmsSetValue(
          "cmi.objectives.0.id",
          "objective_1",
        ),
        setScore: window.API_1484_11.lmsSetValue(
          "cmi.objectives.0.score.scaled",
          "0.75",
        ),
        setSuccess: window.API_1484_11.lmsSetValue(
          "cmi.objectives.0.success_status",
          "passed",
        ),
        setCompletion: window.API_1484_11.lmsSetValue(
          "cmi.objectives.0.completion_status",
          "completed",
        ),
        setDescription: window.API_1484_11.lmsSetValue(
          "cmi.objectives.0.description",
          "Test objective",
        ),

        // Get the count of objectives
        getObjectiveCount: window.API_1484_11.lmsGetValue(
          "cmi.objectives._count",
        ),

        // Get the objective data
        getId: window.API_1484_11.lmsGetValue("cmi.objectives.0.id"),
        getScore: window.API_1484_11.lmsGetValue(
          "cmi.objectives.0.score.scaled",
        ),
        getSuccess: window.API_1484_11.lmsGetValue(
          "cmi.objectives.0.success_status",
        ),
        getCompletion: window.API_1484_11.lmsGetValue(
          "cmi.objectives.0.completion_status",
        ),
        getDescription: window.API_1484_11.lmsGetValue(
          "cmi.objectives.0.description",
        ),
      };

      // Commit the data
      const commitResult = window.API_1484_11.lmsCommit();

      // Terminate the session
      const terminateResult = window.API_1484_11.lmsFinish();

      return {
        interactionResults,
        objectiveResults,
        commitResult,
        terminateResult,
      };
    });

    // Verify interaction results
    expect(advancedInteractions.interactionResults.createInteraction).toBe(
      "true",
    );
    expect(advancedInteractions.interactionResults.setType).toBe("true");
    expect(advancedInteractions.interactionResults.setTimestamp).toBe("true");
    expect(advancedInteractions.interactionResults.setWeighting).toBe("true");
    expect(advancedInteractions.interactionResults.setLearnerResponse).toBe(
      "true",
    );
    expect(advancedInteractions.interactionResults.setResult).toBe("true");
    expect(advancedInteractions.interactionResults.setLatency).toBe("true");
    expect(advancedInteractions.interactionResults.setCorrectResponse).toBe(
      "true",
    );
    expect(advancedInteractions.interactionResults.setObjective).toBe("true");
    expect(advancedInteractions.interactionResults.getInteractionCount).toBe(1);
    expect(advancedInteractions.interactionResults.getId).toBe("interaction_1");
    expect(advancedInteractions.interactionResults.getType).toBe("choice");
    expect(advancedInteractions.interactionResults.getResult).toBe("correct");
    expect(advancedInteractions.interactionResults.getLearnerResponse).toBe(
      "a[,]b",
    );
    expect(advancedInteractions.interactionResults.getCorrectResponse).toBe(
      "a[,]b",
    );
    expect(advancedInteractions.interactionResults.getObjective).toBe(
      "objective_1",
    );

    // Verify objective results
    expect(advancedInteractions.objectiveResults.createObjective).toBe("true");
    expect(advancedInteractions.objectiveResults.setScore).toBe("true");
    expect(advancedInteractions.objectiveResults.setSuccess).toBe("true");
    expect(advancedInteractions.objectiveResults.setCompletion).toBe("true");
    expect(advancedInteractions.objectiveResults.setDescription).toBe("true");
    expect(advancedInteractions.objectiveResults.getObjectiveCount).toBe(1);
    expect(advancedInteractions.objectiveResults.getId).toBe("objective_1");
    expect(advancedInteractions.objectiveResults.getScore).toBe("0.75");
    expect(advancedInteractions.objectiveResults.getSuccess).toBe("passed");
    expect(advancedInteractions.objectiveResults.getCompletion).toBe(
      "completed",
    );
    expect(advancedInteractions.objectiveResults.getDescription).toBe(
      "Test objective",
    );

    // Verify commit and terminate results
    expect(advancedInteractions.commitResult).toBe("true");
    expect(advancedInteractions.terminateResult).toBe("true");
  });
});
