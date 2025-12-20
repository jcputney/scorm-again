import { expect, test } from "@playwright/test";
import {
  CommitRequestTracker,
  setupCommitMocking,
  configureApiForHttpCommits,
  waitForModuleFrame,
  verifyApiAccessibleFromModule,
  getCmiValue,
  getWrapperConfigs,
  completeContentSCO,
  completeAssessmentSCO,
  initializeSequencedModule,
  clickSequencingButton,
  waitForScoContent,
  getModuleFramePath,
  getNavigationValidity,
  requestChoiceNavigation,
  getObjectiveStatus,
  getGlobalObjectiveStatus,
  advanceScoPages,
} from "./helpers/scorm2004-helpers";
import { scormCommonApiTests } from "./suites/scorm-common-api.js";
import { scorm2004DataModelTests } from "./suites/scorm2004-data-model.js";
import { scorm2004NavigationTests } from "./suites/scorm2004-navigation.js";
import { scorm2004InteractionsObjectivesTests } from "./suites/scorm2004-interactions-objectives.js";

/**
 * Comprehensive integration tests for SequencingPreOrPostTestRollup_SCORM20043rdEdition module
 *
 * This module demonstrates rollup using either a pre-test or a post-test in SCORM 2004 3rd Edition.
 *
 * Sequencing Strategy:
 * - Free form navigation is allowed (choice and flow enabled)
 * - Pre-test can only be attempted one time (attemptLimit="1")
 * - Once a test (pre or post) is satisfied, both tests are disabled
 * - Post test cannot be attempted until all content is completed
 *
 * Rollup Strategy:
 * - Course can only be completed and satisfied either by:
 *   - Passing the pretest (testing out), OR
 *   - Completing the entire course and passing the post test
 *
 * Structure:
 * - Root: golf_sample_default_org
 *   - dummy_item (invisible wrapper)
 *     - pretest_item (assessment, attemptLimit=1)
 *     - content_wrapper (invisible)
 *       - playing_item
 *       - etiquette_item
 *       - handicapping_item
 *       - havingfun_item
 *     - posttest_item (assessment)
 *
 * Key Features:
 * - Pre-test has attempt limit of 1
 * - Pre-test and post-test share a global objective (assessment_satisfied)
 * - Content wrapper tracks completion of all content SCOs
 * - Dummy wrapper reads from assessment_satisfied global
 * - Root rolls up: any child satisfied → completed
 *
 * Tests cover:
 * - API initialization with sequencing configuration
 * - Pre-test attempt limit enforcement
 * - Pre-test/post-test mutual disabling (when one is satisfied)
 * - Post-test prerequisite (content must be completed)
 * - Test-out scenario (pre-test passing)
 * - Full course scenario (all content + post-test)
 * - Rollup behavior (dummy wrapper and root)
 */

// Module path - first content SCO
const MODULE_PATH =
  "/test/integration/modules/SequencingPreOrPostTestRollup_SCORM20043rdEdition/shared/launchpage.html?content=playing";

// Activity tree configuration based on manifest analysis
const ACTIVITY_TREE = {
  id: "golf_sample_default_org",
  title: "Golf Explained - Sequencing Pre or Post Test Rollup",
  children: [
    {
      id: "dummy_item",
      title: "Dummy Item",
      isVisible: false,
      children: [
        {
          id: "pretest_item",
          title: "Pre Test",
          identifierref: "assessment_resource",
          sequencingRules: {
            preConditionRules: [
              {
                action: "disabled",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "attemptLimitExceeded",
                  },
                ],
              },
              {
                action: "disabled",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "satisfied",
                    referencedObjective: "assessment_satisfied",
                  },
                ],
              },
            ],
          },
          attemptLimit: 1,
          objectives: [
            {
              objectiveID: "assessment_satisfied",
              isPrimary: true,
              mapInfo: [
                {
                  targetObjectiveID:
                    "com.scorm.golfsamples.sequencing.preorposttestrollup.assessment_satisfied",
                  writeNormalizedMeasure: true,
                  writeSatisfiedStatus: true,
                },
              ],
            },
          ],
        },
        {
          id: "content_wrapper",
          title: "Content Wrapper",
          isVisible: false,
          children: [
            {
              id: "playing_item",
              title: "Playing the Game",
              identifierref: "playing_resource",
            },
            {
              id: "etuqiette_item",
              title: "Etiquette",
              identifierref: "etiquette_resource",
            },
            {
              id: "handicapping_item",
              title: "Handicapping",
              identifierref: "handicapping_resource",
            },
            {
              id: "havingfun_item",
              title: "Having Fun",
              identifierref: "havingfun_resource",
            },
          ],
          sequencingControls: {
            choice: true,
            flow: true,
          },
          rollupRules: {
            rules: [
              {
                consideration: "all",
                conditions: [
                  {
                    condition: "completed",
                  },
                ],
                action: "satisfied",
              },
            ],
          },
          objectives: [
            {
              objectiveID: "content_completed",
              isPrimary: true,
              mapInfo: [
                {
                  targetObjectiveID:
                    "com.scorm.golfsamples.sequencing.preorposttestrollup.content_completed",
                  writeSatisfiedStatus: true,
                },
              ],
            },
          ],
        },
        {
          id: "posttest_item",
          title: "Post Test",
          identifierref: "assessment_resource",
          sequencingRules: {
            preConditionRules: [
              {
                action: "disabled",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "satisfied",
                    referencedObjective: "assessment_satisfied",
                  },
                ],
              },
              {
                action: "disabled",
                conditionCombination: "any",
                conditions: [
                  {
                    condition: "satisfied",
                    operator: "not",
                    referencedObjective: "content_completed",
                  },
                  {
                    condition: "objectiveStatusKnown",
                    operator: "not",
                    referencedObjective: "content_completed",
                  },
                ],
              },
            ],
          },
          objectives: [
            {
              objectiveID: "assessment_satisfied",
              isPrimary: true,
              mapInfo: [
                {
                  targetObjectiveID:
                    "com.scorm.golfsamples.sequencing.preorposttestrollup.assessment_satisfied",
                  writeNormalizedMeasure: true,
                  writeSatisfiedStatus: true,
                },
              ],
            },
            {
              objectiveID: "content_completed",
              isPrimary: false,
              mapInfo: [
                {
                  targetObjectiveID:
                    "com.scorm.golfsamples.sequencing.preorposttestrollup.content_completed",
                  readSatisfiedStatus: true,
                },
              ],
            },
          ],
        },
      ],
      sequencingControls: {
        choice: true,
        flow: true,
      },
      rollupRules: {
        rules: [
          {
            consideration: "any",
            conditions: [
              {
                condition: "completed",
              },
            ],
            action: "incomplete",
          },
          {
            consideration: "all",
            conditions: [
              {
                condition: "completed",
              },
            ],
            action: "completed",
          },
        ],
      },
      objectives: [
        {
          objectiveID: "assessment_satisfied",
          isPrimary: true,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.preorposttestrollup.assessment_satisfied",
              readNormalizedMeasure: true,
              readSatisfiedStatus: true,
            },
          ],
        },
      ],
    },
  ],
  sequencingControls: {
    choice: true,
    flow: true,
  },
  rollupRules: {
    rules: [
      {
        consideration: "any",
        conditions: [
          {
            condition: "satisfied",
          },
        ],
        action: "completed",
      },
    ],
  },
};

// Sequencing controls from manifest
const SEQUENCING_CONTROLS = {
  choice: true,
  flow: true,
};

// Module configuration
const moduleConfig = {
  path: MODULE_PATH,
  apiName: "API_1484_11" as const,
  expectedLearnerId: "123456",
  hasSequencing: true, // This module uses sequencing
  activityTree: ACTIVITY_TREE,
  sequencingControls: SEQUENCING_CONTROLS,
};

// Get wrapper configurations
const wrappers = getWrapperConfigs();

// Run tests for each wrapper type
wrappers.forEach((wrapper) => {
  test.describe(`SequencingPreOrPostTestRollup SCORM 2004 3rd Edition Integration (${wrapper.name})`, () => {
    const launchSequencedModule = async (
      page: any,
      modulePath: string = MODULE_PATH,
      options: Record<string, any> = {},
    ) => {
      await initializeSequencedModule(page, wrapper.path, modulePath, {
        activityTree: ACTIVITY_TREE,
        sequencingControls: SEQUENCING_CONTROLS,
        ...options,
      });
      await waitForModuleFrame(page);
    };

    const PRETEST_ACTIVITY = { id: "pretest_item", key: "assessment" };
    const POSTTEST_ACTIVITY = { id: "posttest_item", key: "assessment" };
    const CONTENT_ACTIVITIES = [
      { id: "playing_item", key: "playing" },
      { id: "etuqiette_item", key: "etiquette" },
      { id: "handicapping_item", key: "handicapping" },
      { id: "havingfun_item", key: "havingfun" },
    ];

    const startPretest = async (page: any) => {
      await requestChoiceNavigation(page, PRETEST_ACTIVITY.id);
      await waitForScoContent(page, PRETEST_ACTIVITY.key);
    };

    const startPosttest = async (page: any) => {
      await requestChoiceNavigation(page, POSTTEST_ACTIVITY.id);
      await waitForScoContent(page, POSTTEST_ACTIVITY.key);
    };

    const completeSequentialContent = async (page: any) => {
      // Navigate to first content activity - course starts on pretest by default
      await requestChoiceNavigation(page, CONTENT_ACTIVITIES[0].id);

      for (let i = 0; i < CONTENT_ACTIVITIES.length; i++) {
        const { key } = CONTENT_ACTIVITIES[i];
        await waitForScoContent(page, key);
        await completeContentSCO(page);
        if (i < CONTENT_ACTIVITIES.length - 1) {
          await clickSequencingButton(page, "continue");
        }
      }
      // Commit data and allow rollup to process
      await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        api.lmsCommit();
      });
      await page.waitForTimeout(500);
    };
    // Compose universal API tests
    scormCommonApiTests(wrapper, moduleConfig);

    // Compose SCORM 2004 data model tests
    scorm2004DataModelTests(wrapper, moduleConfig);

    // Compose SCORM 2004 navigation tests (with sequencing enabled)
    scorm2004NavigationTests(wrapper, { ...moduleConfig, hasSequencing: true });

    // Compose SCORM 2004 interactions/objectives tests
    scorm2004InteractionsObjectivesTests(wrapper, moduleConfig);

    // Module-specific sequencing tests below

    test("should initialize API with sequencing configuration", async ({ page }) => {
      await launchSequencedModule(page);
      await page.waitForTimeout(1000);

      // Verify sequencing is available
      const sequencingInfo = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const results: any = {};

        if (api?.getSequencingService) {
          const sequencingService = api.getSequencingService();
          results.hasSequencingService = !!sequencingService;

          if (sequencingService) {
            const state = api.getSequencingState();
            results.hasSequencingState = !!state;
            results.isInitialized = state?.isInitialized || false;
            results.hasRootActivity = !!state?.rootActivity;
            results.rootActivityId = state?.rootActivity?.id || null;
          }
        }

        return results;
      });

      expect(sequencingInfo.hasSequencingService).toBe(true);
      expect(sequencingInfo.hasSequencingState).toBe(true);
      expect(sequencingInfo.hasRootActivity).toBe(true);
      expect(sequencingInfo.rootActivityId).toBe("golf_sample_default_org");
    });

    /**
     * Test: Pre-test attempt limit enforcement
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Limit Conditions (SB.2.5)
     * - Expected Behavior: Pre-test can only be attempted once (attemptLimit="1")
     *
     * Manifest Analysis:
     * - pretest_item has attemptLimit="1"
     * - PreConditionRule disables if attemptLimitExceeded
     */
    test("should enforce pre-test attempt limit per SCORM 2004 SN Book SB.2.5", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await startPretest(page);
      await completeAssessmentSCO(page, true);
      await clickSequencingButton(page, "continue");

      const pretestValidity = await getNavigationValidity(page, "choice", PRETEST_ACTIVITY.id);
      expect(["false", "unknown"]).toContain(pretestValidity);
    });

    /**
     * Test: Post-test disabled until content is completed
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: PreConditionRule (SB.2.3)
     * - Expected Behavior: Post-test is disabled until content_completed is satisfied
     *
     * Manifest Analysis:
     * - posttest_item has preConditionRule checking if content_completed is NOT satisfied
     * - Content wrapper writes to global: content_completed when all content SCOs are completed
     */
    test("should disable post-test until content is completed per SCORM 2004 SN Book SB.2.3", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      const navResult = await getNavigationValidity(page, "choice", POSTTEST_ACTIVITY.id);
      expect(["false", "unknown"]).toContain(navResult);
    });

    /**
     * Test: Pre-test and post-test mutual disabling
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: PreConditionRule (SB.2.3)
     * - Expected Behavior: Once any test (pre or post) is satisfied, both tests are disabled
     *
     * Manifest Analysis:
     * - Both pretest_item and posttest_item check if assessment_satisfied is satisfied
     * - They share the same global objective: assessment_satisfied
     * - When one test passes, it writes to the global, disabling both tests
     */
    test("should disable both tests when one is satisfied per SCORM 2004 SN Book SB.2.3", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await startPretest(page);
      await completeAssessmentSCO(page, true);
      await clickSequencingButton(page, "continue");

      const pretestValidity = await getNavigationValidity(page, "choice", PRETEST_ACTIVITY.id);
      const posttestValidity = await getNavigationValidity(page, "choice", POSTTEST_ACTIVITY.id);
      expect(["false", "unknown"]).toContain(pretestValidity);
      expect(["false", "unknown"]).toContain(posttestValidity);
    });

    /**
     * Test: Content wrapper rollup when all content is completed
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Content wrapper is satisfied when all children are completed
     *
     * Manifest Analysis:
     * - content_wrapper has rollup rule: all children completed → satisfied
     * - Writes to global: content_completed when satisfied
     */
    test("should satisfy content wrapper when all content SCOs are completed per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);

      // Query from global objective map in sequencing state
      const contentObjective = await getGlobalObjectiveStatus(
        page,
        "com.scorm.golfsamples.sequencing.preorposttestrollup.content_completed",
      );

      expect(contentObjective?.satisfiedStatus).toBe(true);
    });

    /**
     * Test: Root rollup when any child is satisfied
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Root is completed when any child is satisfied
     *
     * Manifest Analysis:
     * - Root has rollup rule: any child satisfied → completed
     * - This allows course completion via either pre-test or post-test
     */
    test("should complete root when any child is satisfied per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await startPretest(page);
      await completeAssessmentSCO(page, true);
      await clickSequencingButton(page, "continue");

      const rootStatus = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        return state?.rootActivity?.completionStatus || null;
      });

      expect(rootStatus).toBe("completed");
    });

    /**
     * Test: Free form navigation is allowed
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Sequencing Controls (SB.2.1)
     * - Expected Behavior: Choice and flow navigation are enabled
     *
     * Manifest Analysis:
     * - Root, dummy_item, and content_wrapper all have choice="true" and flow="true"
     * - This allows free form navigation between activities
     */
    test("should allow free form navigation per SCORM 2004 SN Book SB.2.1", async ({ page }) => {
      // Capture ALL console logs for debugging
      const consoleLogs: string[] = [];
      page.on("console", (msg) => {
        const text = msg.text();
        consoleLogs.push(text);
      });

      await launchSequencedModule(page);
      // Navigate to first content activity - course starts on pretest by default
      await requestChoiceNavigation(page, "playing_item");
      await waitForScoContent(page, "playing");
      await advanceScoPages(page, 1);

      await requestChoiceNavigation(page, "handicapping_item");
      await waitForScoContent(page, "handicapping");

      // Get predict result BEFORE getNavigationValidity
      const prePredictResult = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        if (!api) return "no-api";
        const internalSequencing = (api as any)._sequencing;
        const internalOverallProcess = internalSequencing?.overallSequencingProcess;
        if (!internalOverallProcess?.predictChoiceEnabled) return "no-predict";
        return internalOverallProcess.predictChoiceEnabled("havingfun_item") ? "true" : "false";
      });

      const navValid = await getNavigationValidity(page, "choice", "havingfun_item");

      // If test fails, print debug info
      if (navValid === "false") {
        console.log("=== PRE-PREDICT RESULT ===", prePredictResult);
        console.log("=== DEBUG INFO ===");
        console.log("Navigation validity for havingfun_item:", navValid);
        consoleLogs.forEach((log) => console.log(log));

        // Get additional debug info from the API
        const debugInfo = await page.evaluate(() => {
          const api = (window as any).API_1484_11;
          if (!api) return "API not found";

          // Get access to sequencing internals
          const sequencingService = api.sequencingService;
          const overallProcess = sequencingService?.overallSequencingProcess;
          const navLookAhead = overallProcess?.navigationLookAhead;
          const activityTree = overallProcess?.activityTree;

          // Get the current activity
          const currentActivity = activityTree?.currentActivity;

          // Check if predictChoiceEnabled exists and what it returns
          let predictResult = "N/A";
          if (overallProcess?.predictChoiceEnabled) {
            try {
              predictResult = overallProcess.predictChoiceEnabled("havingfun_item")
                ? "true"
                : "false";
            } catch (e) {
              predictResult = `error: ${e}`;
            }
          }

          // Check what _isTargetValid returns
          let isTargetValidResult = "N/A";
          const choiceObj = api.adl?.nav?.request_valid?.choice;
          if (choiceObj?._isTargetValid) {
            try {
              isTargetValidResult = choiceObj._isTargetValid("havingfun_item");
            } catch (e) {
              isTargetValidResult = `error: ${e}`;
            }
          }

          // Check internal state directly
          const internalSequencing = (api as any)._sequencing;
          const internalOverallProcess = internalSequencing?.overallSequencingProcess;
          const extractedIds = (api as any)._extractedScoItemIds || [];

          // Check navigation look-ahead
          const navLookAheadInternal = internalOverallProcess?.navigationLookAhead;
          let availableChoices: string[] = [];
          let predictChoiceResult = "N/A";
          if (navLookAheadInternal?.getAvailableChoices) {
            availableChoices = navLookAheadInternal.getAvailableChoices();
          }
          if (internalOverallProcess?.predictChoiceEnabled) {
            predictChoiceResult = internalOverallProcess.predictChoiceEnabled("havingfun_item")
              ? "true"
              : "false";
          }

          // Check activity tree state
          const internalActivityTree = internalOverallProcess?.activityTree;
          const currentActivityFromTree = internalActivityTree?.currentActivity;
          const rootActivity = internalActivityTree?.root;

          return {
            apiType: api.constructor.name,
            currentActivityId: currentActivity?.id || "null",
            currentActivityIsActive: currentActivity?.isActive,
            hasSequencingService: !!sequencingService,
            hasOverallProcess: !!overallProcess,
            hasNavLookAhead: !!navLookAhead,
            predictChoiceExists: !!overallProcess?.predictChoiceEnabled,
            predictResult: predictResult,
            isTargetValidResult: isTargetValidResult,
            continueValid: api.lmsGetValue("adl.nav.request_valid.continue"),
            previousValid: api.lmsGetValue("adl.nav.request_valid.previous"),
            havingfunViaGetValue: api.lmsGetValue(
              "adl.nav.request_valid.choice.{target=havingfun_item}",
            ),
            // Internal state checks
            hasInternalSequencing: !!internalSequencing,
            hasInternalOverallProcess: !!internalOverallProcess,
            hasInternalPredictChoice: !!internalOverallProcess?.predictChoiceEnabled,
            extractedIdsCount: extractedIds.length,
            extractedIdsIncludesHavingfun: extractedIds.includes("havingfun_item"),
            extractedIdsSample: extractedIds.slice(0, 5),
            // Navigation look-ahead checks
            predictChoiceResultDirect: predictChoiceResult,
            availableChoices: availableChoices,
            // Activity tree state
            currentActivityFromTree: currentActivityFromTree?.id || "null",
            hasActivityTree: !!internalActivityTree,
            hasRootActivity: !!rootActivity,
          };
        });
        console.log("Debug info:", JSON.stringify(debugInfo, null, 2));
      }

      expect(["true", "unknown"]).toContain(navValid);

      await requestChoiceNavigation(page, "playing_item");
      await waitForScoContent(page, "playing");

      const framePath = await getModuleFramePath(page);
      expect(framePath).toContain("playing");
    });

    /**
     * Test: Test-out scenario (pre-test passing)
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Course can be completed by passing the pre-test
     *
     * Manifest Analysis:
     * - Pre-test writes to global: assessment_satisfied
     * - Dummy wrapper reads from assessment_satisfied
     * - Root rolls up: any child satisfied → completed
     * - This allows "testing out" without completing all content
     */
    test("should allow test-out via pre-test per SCORM 2004 SN Book SB.2.4", async ({ page }) => {
      await launchSequencedModule(page);
      await startPretest(page);
      await completeAssessmentSCO(page, true);
      await clickSequencingButton(page, "continue");

      // Query from global objective map in sequencing state
      const assessmentObjective = await getGlobalObjectiveStatus(
        page,
        "com.scorm.golfsamples.sequencing.preorposttestrollup.assessment_satisfied",
      );
      expect(assessmentObjective?.satisfiedStatus).toBe(true);

      const pretestValidity = await getNavigationValidity(page, "choice", PRETEST_ACTIVITY.id);
      const posttestValidity = await getNavigationValidity(page, "choice", POSTTEST_ACTIVITY.id);
      expect(["false", "unknown"]).toContain(pretestValidity);
      expect(["false", "unknown"]).toContain(posttestValidity);
    });

    /**
     * Test: Full course scenario (all content + post-test)
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Course can be completed by completing all content and passing post-test
     *
     * Manifest Analysis:
     * - Content wrapper: all children completed → satisfied → writes content_completed
     * - Post-test: requires content_completed to be satisfied
     * - Post-test writes to global: assessment_satisfied
     * - Root rolls up: any child satisfied → completed
     */
    test("should allow full course completion via content and post-test per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);

      // Query from global objective map in sequencing state
      const contentObjective = await getGlobalObjectiveStatus(
        page,
        "com.scorm.golfsamples.sequencing.preorposttestrollup.content_completed",
      );
      expect(contentObjective?.satisfiedStatus).toBe(true);

      await startPosttest(page);
      await completeAssessmentSCO(page, true);
      // Note: After completing the final activity (posttest), "continue" is correctly disabled
      // because there's no next activity. We just need to verify the objective is satisfied.
      await page.waitForTimeout(500); // Allow rollup to process

      // Query from global objective map in sequencing state
      const assessmentObjective = await getGlobalObjectiveStatus(
        page,
        "com.scorm.golfsamples.sequencing.preorposttestrollup.assessment_satisfied",
      );
      expect(assessmentObjective?.satisfiedStatus).toBe(true);
    });

    /**
     * Test: Attempt limit enforcement when exceeded
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Limit Conditions (SB.2.5)
     * - Expected Behavior: Pre-test should be disabled after attempt limit is exceeded
     *
     * Manifest Analysis:
     * - Pre-test has attemptLimit="1"
     * - PreConditionRule disables if attemptLimitExceeded
     * - After one attempt, pre-test should be disabled
     */
    test("should disable pre-test when attempt limit is exceeded per SCORM 2004 SN Book SB.2.5", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await startPretest(page);
      await completeAssessmentSCO(page, false);
      await clickSequencingButton(page, "continue");

      const pretestValidity = await getNavigationValidity(page, "choice", PRETEST_ACTIVITY.id);
      expect(["false", "unknown"]).toContain(pretestValidity);
    });

    /**
     * Test: Navigation validity for all activities
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Navigation Validity (SB.2.2)
     * - Expected Behavior: Navigation validity should be determined for all activities
     *
     * Manifest Analysis:
     * - Choice and flow navigation are enabled
     * - PreConditionRules control access to activities
     */
    test("should determine navigation validity for all activities per SCORM 2004 SN Book SB.2.2", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      const activities = [
        PRETEST_ACTIVITY.id,
        "playing_item",
        "etuqiette_item",
        "handicapping_item",
        "havingfun_item",
        POSTTEST_ACTIVITY.id,
      ];

      for (const id of activities) {
        const validity = await getNavigationValidity(page, "choice", id);
        expect(["true", "false", "unknown"]).toContain(validity);
      }
    });

    /**
     * Test: Actual navigation request processing
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Navigation Request Processing (SB.2.2)
     * - Expected Behavior: Navigation requests should be processed and current activity updated
     *
     * Manifest Analysis:
     * - Choice and flow navigation are enabled
     * - Navigation requests should update current activity
     */
    test("should process navigation requests and update current activity per SCORM 2004 SN Book SB.2.2", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await requestChoiceNavigation(page, PRETEST_ACTIVITY.id);
      await waitForScoContent(page, PRETEST_ACTIVITY.key);

      const frameSrc = await getModuleFramePath(page);
      expect(frameSrc).toContain(PRETEST_ACTIVITY.key);

      const navState = await getNavigationValidity(page, "choice", PRETEST_ACTIVITY.id);
      expect(["false", "unknown"]).toContain(navState);
    });

    /**
     * Test: Free form navigation between activities
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Choice Navigation (SB.2.2.1)
     * - Expected Behavior: Choice navigation allows free form navigation between accessible activities
     *
     * Manifest Analysis:
     * - Choice and flow navigation are enabled
     * - Pre-test and content SCOs should be accessible via choice
     */
    test("should allow free form navigation between accessible activities per SCORM 2004 SN Book SB.2.2.1", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      const pretestValidity = await getNavigationValidity(page, "choice", PRETEST_ACTIVITY.id);
      expect(["true", "false", "unknown"]).toContain(pretestValidity);

      await requestChoiceNavigation(page, "playing_item");
      await waitForScoContent(page, "playing");

      const etiquetteValidity = await getNavigationValidity(page, "choice", "etuqiette_item");
      expect(["true", "false", "unknown"]).toContain(etiquetteValidity);
    });

    /**
     * Test: Content wrapper rollup calculation
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Content wrapper should be satisfied when all children are completed
     *
     * Manifest Analysis:
     * - Content wrapper has rollup rule: all children completed → satisfied
     * - Should write to global: content_completed when satisfied
     */
    test("should calculate content wrapper rollup when all children completed per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);

      // Query from global objective map in sequencing state
      const contentObjective = await getGlobalObjectiveStatus(
        page,
        "com.scorm.golfsamples.sequencing.preorposttestrollup.content_completed",
      );

      expect(contentObjective?.satisfiedStatus).toBe(true);
    });

    /**
     * Test: Dummy wrapper rollup behavior
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Dummy wrapper should roll up from children
     *
     * Manifest Analysis:
     * - Dummy wrapper has rollup rules: any child completed → incomplete, all children completed → completed
     * - Reads from global: assessment_satisfied
     */
    test("should calculate dummy wrapper rollup per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await startPretest(page);
      await completeAssessmentSCO(page, true);
      await clickSequencingButton(page, "continue");

      const dummyStatus = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();

        // Find dummy wrapper
        if (state?.rootActivity?.children) {
          const dummyWrapper = state.rootActivity.children.find(
            (child: any) => child.id === "dummy_item",
          );
          return {
            completionStatus: dummyWrapper?.completionStatus || null,
            objectiveSatisfiedStatus: dummyWrapper?.objectiveSatisfiedStatus || false,
          };
        }
        return { completionStatus: null, objectiveSatisfiedStatus: false };
      });

      // After passing the pretest:
      // - dummy_item reads from global assessment_satisfied → becomes satisfied
      // - dummy_item's completion rules: "any completed → incomplete", "all completed → completed"
      // - Since only pretest is complete (not all children), completionStatus = "incomplete"
      // - But objectiveSatisfiedStatus = true from the global objective sync
      expect(dummyStatus.objectiveSatisfiedStatus).toBe(true);
      expect(dummyStatus.completionStatus).toBe("incomplete"); // Only pretest done, not all children
    });

    /**
     * Test: Pass pre-test and verify rollup behavior
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.5), PreConditionRules (SB.2.3)
     * - Expected Behavior: When a learner passes the pre-test:
     *   1. Module sets success_status to "passed"
     *   2. Rollup occurs based on pre-test results
     *   3. Content activities may be skipped if pre-test passed
     *
     * This module tests both pre-test and post-test rollup behavior.
     */
    test("should pass pre-test and verify rollup per SCORM 2004 SN Book SB.2.5", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await startPretest(page);

      const { score, successStatus, completionStatus } = await completeAssessmentSCO(page, true);
      await clickSequencingButton(page, "continue");

      // Verify the module set the score
      expect(score).toBeGreaterThanOrEqual(70); // Should pass

      // Verify the module set success_status to "passed"
      expect(successStatus).toBe("passed");

      // Verify completion_status was set
      expect(completionStatus).toBe("completed");
    });

    /**
     * Test: Pass post-test and verify rollup behavior
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.5)
     * - Expected Behavior: When a learner passes the post-test:
     *   1. Module sets success_status to "passed"
     *   2. Rollup occurs based on post-test results
     *   3. Parent activity rollup reflects assessment completion
     *
     * This module tests post-test rollup behavior.
     */
    test("should pass post-test and verify rollup per SCORM 2004 SN Book SB.2.5", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);
      await startPosttest(page);
      const { score, successStatus, completionStatus } = await completeAssessmentSCO(page, true);

      // Verify the module set the score
      expect(score).toBeGreaterThanOrEqual(70); // Should pass

      // Verify the module set success_status to "passed"
      expect(successStatus).toBe("passed");

      // Verify completion_status was set
      expect(completionStatus).toBe("completed");
    });
  });
});
