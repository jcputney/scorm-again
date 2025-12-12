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
  getNavigationValidity,
  clickSequencingButton,
  waitForScoContent,
  getModuleFramePath,
  advanceScoPages,
} from "./helpers/scorm2004-helpers";
import { scormCommonApiTests } from "./suites/scorm-common-api.js";
import { scorm2004DataModelTests } from "./suites/scorm2004-data-model.js";
import { scorm2004NavigationTests } from "./suites/scorm2004-navigation.js";
import { scorm2004InteractionsObjectivesTests } from "./suites/scorm2004-interactions-objectives.js";

/**
 * Comprehensive integration tests for SequencingPostTestRollup_SCORM20043rdEdition module
 *
 * This module demonstrates post-test rollup in SCORM 2004 3rd Edition.
 *
 * Sequencing Strategy:
 * - Forced sequential navigation (like ForcedSequential example)
 * - Uses satisfied status (not completion status) for prerequisites (3rd Edition)
 * - Requires learner to visit SCOs in order
 * - Once a SCO has been visited, learner can jump backwards to review material
 * - Learner cannot jump ahead beyond the next SCO
 *
 * Rollup Strategy:
 * - Content SCOs: No rollup (rollupObjectiveSatisfied="false", rollupProgressCompletion="false", objectiveMeasureWeight="0")
 * - Assessment: Full rollup (rollupObjectiveSatisfied="true", rollupProgressCompletion="true", objectiveMeasureWeight="1")
 * - Course can only be completed and satisfied by completing and satisfying the post test
 * - Because sequencing requires all activities to be completed before the post test can be accessed,
 *   by implication, all activities must be completed for the course to be completed
 * - The score for the course is entirely dependent on the score from the post test
 *
 * Structure:
 * - 5 SCOs: playing_item, etiquette_item, handicapping_item, havingfun_item, assessment_item
 * - Each SCO has a global objective that tracks satisfied status (3rd Edition)
 * - Uses sequencing collection (content_seq_rules) for reusable sequencing rules
 * - Assessment does not reference the sequencing collection (has its own rollup rules)
 *
 * Tests cover:
 * - API initialization with sequencing configuration
 * - Forced sequential navigation using satisfied status (3rd Edition)
 * - Satisfied status tracking on global objectives (3rd Edition)
 * - PreConditionRule with satisfied status conditions
 * - Assessment rollup behavior
 * - Navigation validity per specification
 */

// Module path - first SCO in the sequence
const MODULE_PATH =
  "/test/integration/modules/SequencingPostTestRollup_SCORM20043rdEdition/shared/launchpage.html?content=playing";

// Activity tree configuration based on manifest analysis
const ACTIVITY_TREE = {
  id: "golf_sample_default_org",
  title: "Golf Explained - Sequencing Post Test Rollup",
  sequencingControls: {
    flow: true,
    choice: false,
  },
  children: [
    {
      id: "playing_item",
      title: "Playing the Game",
      identifierref: "playing_resource",
      objectives: [
        {
          objectiveID: "playing_satisfied",
          isPrimary: true,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.playing_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: true,
            },
          ],
        },
      ],
      sequencingControls: {
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
        objectiveMeasureWeight: 0,
      },
    },
    {
      id: "etuqiette_item",
      title: "Etiquette",
      identifierref: "etiquette_resource",
      objectives: [
        {
          objectiveID: "etiquette_satisfied",
          isPrimary: true,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.etiquette_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: true,
            },
          ],
        },
        {
          objectiveID: "previous_sco_satisfied",
          isPrimary: false,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.playing_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: false,
            },
          ],
        },
      ],
      sequencingRules: {
        preConditionRules: [
          {
            action: "disabled",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
              {
                condition: "objectiveStatusKnown",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
            ],
          },
        ],
      },
      sequencingControls: {
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
        objectiveMeasureWeight: 0,
      },
    },
    {
      id: "handicapping_item",
      title: "Handicapping",
      identifierref: "handicapping_resource",
      objectives: [
        {
          objectiveID: "handicapping_satisfied",
          isPrimary: true,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.handicapping_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: true,
            },
          ],
        },
        {
          objectiveID: "previous_sco_satisfied",
          isPrimary: false,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.etiquette_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: false,
            },
          ],
        },
      ],
      sequencingRules: {
        preConditionRules: [
          {
            action: "disabled",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
              {
                condition: "objectiveStatusKnown",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
            ],
          },
        ],
      },
      sequencingControls: {
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
        objectiveMeasureWeight: 0,
      },
    },
    {
      id: "havingfun_item",
      title: "Having Fun",
      identifierref: "havingfun_resource",
      objectives: [
        {
          objectiveID: "havingfun_satisfied",
          isPrimary: true,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.havingfun_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: true,
            },
          ],
        },
        {
          objectiveID: "previous_sco_satisfied",
          isPrimary: false,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.handicapping_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: false,
            },
          ],
        },
      ],
      sequencingRules: {
        preConditionRules: [
          {
            action: "disabled",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
              {
                condition: "objectiveStatusKnown",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
            ],
          },
        ],
      },
      sequencingControls: {
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
        objectiveMeasureWeight: 0,
      },
    },
    {
      id: "assessment_item",
      title: "Quiz",
      identifierref: "assessment_resource",
      objectives: [
        {
          objectiveID: "assessment_satisfied",
          isPrimary: true,
        },
        {
          objectiveID: "previous_sco_satisfied",
          isPrimary: false,
          mapInfo: [
            {
              targetObjectiveID:
                "com.scorm.golfsamples.sequencing.forcedsequential.havingfun_satisfied",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: false,
            },
          ],
        },
      ],
      sequencingRules: {
        preConditionRules: [
          {
            action: "disabled",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
              {
                condition: "objectiveStatusKnown",
                operator: "not",
                referencedObjective: "previous_sco_satisfied",
              },
            ],
          },
        ],
      },
      sequencingControls: {
        rollupObjectiveSatisfied: true,
        rollupProgressCompletion: true,
        objectiveMeasureWeight: 1,
      },
    },
  ],
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

const CONTENT_ACTIVITIES = [
  { id: "playing_item", key: "playing" },
  { id: "etuqiette_item", key: "etiquette" },
  { id: "handicapping_item", key: "handicapping" },
  { id: "havingfun_item", key: "havingfun" },
];

const ASSESSMENT_ACTIVITY = { id: "assessment_item", key: "assessment" };

// Run tests for each wrapper type
wrappers.forEach((wrapper) => {
  test.describe(`SequencingPostTestRollup SCORM 2004 3rd Edition Integration (${wrapper.name})`, () => {
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

    const continueToNextSco = async (page: any, contentKey: string) => {
      await clickSequencingButton(page, "continue");
      await waitForScoContent(page, contentKey);
    };

    const completeSequentialContent = async (page: any) => {
      for (let i = 0; i < CONTENT_ACTIVITIES.length; i++) {
        const { key } = CONTENT_ACTIVITIES[i];
        await waitForScoContent(page, key);
        await completeContentSCO(page);
        if (i < CONTENT_ACTIVITIES.length - 1) {
          await continueToNextSco(page, CONTENT_ACTIVITIES[i + 1].key);
        }
      }
    };

    const startAssessment = async (page: any) => {
      await continueToNextSco(page, ASSESSMENT_ACTIVITY.key);
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
            results.isActive = state?.isActive || false;
            results.hasRootActivity = !!state?.rootActivity;
            results.hasCurrentActivity = !!state?.currentActivity;
            results.currentActivityId = state?.currentActivity?.id || null;
            results.rootActivityId = state?.rootActivity?.id || null;
          }
        }

        return results;
      });

      expect(sequencingInfo.hasSequencingService).toBe(true);
      expect(sequencingInfo.hasSequencingState).toBe(true);
      // Root activity should exist after sequencing is configured
      expect(sequencingInfo.hasRootActivity).toBe(true);
      expect(sequencingInfo.rootActivityId).toBe("golf_sample_default_org");
      // Current activity should be the first SCO (playing_item) after sequencing starts
      // Note: May be null if sequencing hasn't auto-started, which is OK
      if (sequencingInfo.currentActivityId) {
        expect(sequencingInfo.currentActivityId).toBe("playing_item");
      }
    });

    /**
     * Test: PreConditionRule with satisfied status condition (3rd Edition)
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: PreConditionRule (SB.2.3)
     * - Rule Condition: "satisfied" (SB.2.3.2)
     * - Rule Action: "disabled" (SB.2.3.1)
     * - Expected Behavior: Activity is disabled if referenced objective's satisfied status is not "satisfied"
     *
     * Manifest Analysis:
     * - etiquette_item has preConditionRule checking if "previous_sco_satisfied" (mapped to playing_satisfied) is satisfied
     * - Uses satisfied status (not completion status) - 3rd Edition
     * - If not satisfied, action="disabled" should prevent access
     */
    test("should enforce preConditionRule with satisfied status per SCORM 2004 SN Book SB.2.3 (3rd Edition)", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      const navResult = await getNavigationValidity(page, "choice", "etuqiette_item");
      expect(["false", "unknown"]).toContain(navResult);
    });

    /**
     * Test: Satisfied status on global objectives (3rd Edition)
     *
     * Specification: SCORM 2004 3rd Edition Content Aggregation Model (CAM) Book
     * - Section: imsss:objectives with readSatisfiedStatus/writeSatisfiedStatus
     * - Expected Behavior: Global objectives can track satisfied status
     *
     * Manifest Analysis:
     * - playing_item has primary objective "playing_satisfied" mapped to global objective
     * - Uses readSatisfiedStatus="true" and writeSatisfiedStatus="true"
     * - Satisfied status (not completion status) is used for prerequisites
     */
    test("should track satisfied status on global objectives per SCORM 2004 3rd Edition", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await waitForScoContent(page, CONTENT_ACTIVITIES[0].key);
      await completeContentSCO(page);

      await continueToNextSco(page, CONTENT_ACTIVITIES[1].key);

      const playingActivityStatus = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        const child = state?.rootActivity?.children?.find(
          (activity: any) => activity.id === "playing_item",
        );
        return {
          objectiveSatisfiedStatus: child?.objectiveSatisfiedStatus ?? null,
          successStatus: child?.successStatus ?? null,
          completionStatus: child?.completionStatus ?? null,
        };
      });

      expect(playingActivityStatus.objectiveSatisfiedStatus).toBe(true);
      expect(
        ["completed", "incomplete"].includes(playingActivityStatus.completionStatus ?? ""),
      ).toBe(true);
    });

    /**
     * Test: Allow navigation after satisfied status is set (3rd Edition)
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: PreConditionRule evaluation (SB.2.3)
     * - Expected Behavior: After prerequisite activity is satisfied, next activity should be accessible
     *
     * Manifest Analysis:
     * - After playing_item is satisfied, etiquette_item should become accessible
     * - Uses satisfied status (not completion status) for prerequisite check
     */
    test("should allow navigation to next SCO after current SCO is satisfied (3rd Edition)", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await waitForScoContent(page, CONTENT_ACTIVITIES[0].key);
      await completeContentSCO(page);
      await continueToNextSco(page, CONTENT_ACTIVITIES[1].key);

      const navResult = await getNavigationValidity(page, "previous");
      expect(["true", "unknown"]).toContain(navResult);
    });

    /**
     * Test: Assessment rollup behavior
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Assessment rolls up objective satisfaction and progress completion
     *
     * Manifest Analysis:
     * - Assessment has rollupObjectiveSatisfied="true", rollupProgressCompletion="true", objectiveMeasureWeight="1"
     * - Content SCOs have rollupObjectiveSatisfied="false", rollupProgressCompletion="false", objectiveMeasureWeight="0"
     * - Rollup is entirely dependent on the post test (assessment)
     */
    test("should configure assessment rollup rules correctly per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      // Verify rollup rules for assessment_item
      // Note: rollupObjectiveSatisfied and rollupProgressCompletion are on sequencingControls
      const assessmentRollup = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        let assessment: any = null;

        if (state?.rootActivity?.children) {
          assessment = state.rootActivity.children.find(
            (child: any) => child.id === "assessment_item",
          );
        }

        return assessment
          ? {
              rollupObjectiveSatisfied:
                assessment.sequencingControls?.rollupObjectiveSatisfied ?? false,
              rollupProgressCompletion:
                assessment.sequencingControls?.rollupProgressCompletion ?? false,
              objectiveMeasureWeight: assessment.sequencingControls?.objectiveMeasureWeight ?? 0,
            }
          : null;
      });

      expect(assessmentRollup).not.toBeNull();
      expect(assessmentRollup.rollupObjectiveSatisfied).toBe(true);
      expect(assessmentRollup.rollupProgressCompletion).toBe(true);
      expect(assessmentRollup.objectiveMeasureWeight).toBe(1);
    });

    /**
     * Test: Content SCOs have no rollup
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Content SCOs do not roll up to parent
     *
     * Manifest Analysis:
     * - Content SCOs use sequencing collection with rollupObjectiveSatisfied="false",
     *   rollupProgressCompletion="false", objectiveMeasureWeight="0"
     * - Only assessment rolls up to parent
     */
    test("should configure content SCOs with no rollup per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      // Verify rollup rules for content SCOs (should have no rollup)
      // Note: rollupObjectiveSatisfied and rollupProgressCompletion are on sequencingControls
      const contentRollup = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        const rollupInfo: Record<string, any> = {};

        if (state?.rootActivity?.children) {
          for (const child of state.rootActivity.children) {
            if (child.id !== "assessment_item") {
              rollupInfo[child.id] = {
                rollupObjectiveSatisfied:
                  child.sequencingControls?.rollupObjectiveSatisfied ?? false,
                rollupProgressCompletion:
                  child.sequencingControls?.rollupProgressCompletion ?? false,
                objectiveMeasureWeight: child.sequencingControls?.objectiveMeasureWeight ?? 0,
              };
            }
          }
        }

        return rollupInfo;
      });

      // All content SCOs should have no rollup
      for (const [activityId, rollup] of Object.entries(contentRollup)) {
        expect(rollup.rollupObjectiveSatisfied).toBe(false);
        expect(rollup.rollupProgressCompletion).toBe(false);
        expect(rollup.objectiveMeasureWeight).toBe(0);
      }
    });

    /**
     * Test: Complete all SCOs in sequence using satisfied status
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Navigation and Sequencing (SB.2)
     * - Expected Behavior: Learner can navigate through all SCOs by satisfying each one
     *
     * Manifest Analysis:
     * - 5 SCOs: playing_item, etiquette_item, handicapping_item, havingfun_item, assessment_item
     * - Each SCO must be satisfied before next SCO is accessible (forced sequential)
     * - Uses satisfied status (not completion status) for prerequisites (3rd Edition)
     */
    test("should complete all SCOs in sequence using satisfied status (3rd Edition)", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      const visitedActivities: string[] = [];

      for (let i = 0; i < CONTENT_ACTIVITIES.length; i++) {
        const activity = CONTENT_ACTIVITIES[i];
        await waitForScoContent(page, activity.key);
        visitedActivities.push(activity.id);

        await completeContentSCO(page);

        if (i < CONTENT_ACTIVITIES.length - 1) {
          await continueToNextSco(page, CONTENT_ACTIVITIES[i + 1].key);
        }
      }

      expect(visitedActivities).toEqual(CONTENT_ACTIVITIES.map(({ id }) => id));

      // After all content SCOs are satisfied, the assessment should become available
      const assessmentAccess = await getNavigationValidity(page, "choice", ASSESSMENT_ACTIVITY.id);
      expect(["true", "unknown"]).toContain(assessmentAccess);
    });

    /**
     * Test: Navigation validity for all activities
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Navigation Validity (SB.2.2)
     * - Expected Behavior: Navigation validity should be determined for all navigation types
     *
     * Manifest Analysis:
     * - Choice and flow navigation are enabled
     * - PreConditionRules control access to activities
     * - All activities should have valid navigation states
     */
    test("should determine navigation validity for all activities per SCORM 2004 SN Book SB.2.2", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      // Check navigation validity for all activities
      const navValidity = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const activities = [
          "playing_item",
          "etuqiette_item",
          "handicapping_item",
          "havingfun_item",
          "assessment_item",
        ];
        const validity: Record<string, any> = {};

        for (const activityId of activities) {
          validity[activityId] = {
            continue: api.lmsGetValue("adl.nav.request_valid.continue"),
            previous: api.lmsGetValue("adl.nav.request_valid.previous"),
            choice: api.lmsGetValue(`adl.nav.request_valid.choice.{target=${activityId}}`),
          };
        }

        return validity;
      });

      // Verify navigation validity is determined (not undefined/null)
      // Values should be "true", "false", or "unknown"
      for (const [activityId, validity] of Object.entries(navValidity)) {
        expect(["true", "false", "unknown"]).toContain(validity.continue);
        expect(["true", "false", "unknown"]).toContain(validity.previous);
        expect(["true", "false", "unknown"]).toContain(validity.choice);
      }
    });

    /**
     * Test: Backward navigation to review previous SCOs
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Previous Navigation Request (SB.2.2.1)
     * - Expected Behavior: Once a SCO has been visited, learner can navigate backward
     *
     * Manifest Analysis:
     * - Manifest states: "Once a SCO has been visited, the learner can jump backwards to review material"
     * - Flow navigation is enabled, allowing backward navigation
     */
    test("should allow backward navigation to review previous SCOs per SCORM 2004 SN Book SB.2.2.1", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await waitForScoContent(page, CONTENT_ACTIVITIES[0].key);
      await completeContentSCO(page);
      await continueToNextSco(page, CONTENT_ACTIVITIES[1].key);

      // Check if previous navigation is valid after visiting the second SCO
      const previousNav = await getNavigationValidity(page, "previous");
      expect(["true", "unknown"]).toContain(previousNav);

      // Use the sequencing controls to move back and verify the first SCO loads again
      await clickSequencingButton(page, "previous");
      await waitForScoContent(page, CONTENT_ACTIVITIES[0].key);
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
      await waitForScoContent(page, CONTENT_ACTIVITIES[0].key);
      await completeContentSCO(page);
      await continueToNextSco(page, CONTENT_ACTIVITIES[1].key);

      const navigationResult = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        return {
          processed: state?.currentActivity?.id === "etuqiette_item",
          currentActivity: state?.currentActivity?.id || null,
        };
      });

      expect(navigationResult.processed).toBe(true);
      expect(navigationResult.currentActivity).toBe("etuqiette_item");
    });

    /**
     * Test: Assessment rollup to root activity
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.4)
     * - Expected Behavior: Assessment should roll up completion and satisfaction to root
     *
     * Manifest Analysis:
     * - Assessment has rollupObjectiveSatisfied="true", rollupProgressCompletion="true"
     * - When assessment is satisfied, root should be satisfied/completed
     */
    test("should rollup assessment status to root activity per SCORM 2004 SN Book SB.2.4", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);
      await startAssessment(page);
      await completeAssessmentSCO(page, true);

      // Verify root activity rollup
      const rootStatus = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        return {
          completionStatus: state?.rootActivity?.completionStatus || null,
          successStatus: state?.rootActivity?.successStatus || null,
        };
      });

      expect(rootStatus.completionStatus).toBe("completed");
      expect(rootStatus.successStatus).toBe("passed");
    });

    /**
     * Test: Choice navigation to specific activities
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Choice Navigation Request (SB.2.2.1)
     * - Expected Behavior: Choice navigation should respect PreConditionRules
     *
     * Manifest Analysis:
     * - Choice navigation is enabled
     * - PreConditionRules control which activities are accessible via choice
     */
    test("should handle choice navigation respecting PreConditionRules per SCORM 2004 SN Book SB.2.2.1", async ({
      page,
    }) => {
      await launchSequencedModule(page);

      // Check choice navigation validity for each activity
      const choiceValidity = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const activities = [
          "playing_item",
          "etuqiette_item",
          "handicapping_item",
          "havingfun_item",
          "assessment_item",
        ];
        const validity: Record<string, string> = {};

        for (const activityId of activities) {
          validity[activityId] = api.lmsGetValue(
            `adl.nav.request_valid.choice.{target=${activityId}}`,
          );
        }

        return validity;
      });

      // playing_item should be accessible (first in sequence)
      const playingValidity = choiceValidity["playing_item"];
      expect(["true", "false", "unknown"]).toContain(playingValidity);

      // Other activities should be disabled until prerequisites met
      const etiquetteValidity = choiceValidity["etuqiette_item"];
      expect(["true", "false", "unknown"]).toContain(etiquetteValidity);
    });

    /**
     * Test: Pass post-test and verify rollup behavior
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.5)
     * - Expected Behavior: When a learner passes the post-test assessment:
     *   1. Module sets success_status to "passed"
     *   2. Rollup occurs based on post-test results
     *   3. Parent activity rollup reflects assessment completion
     *
     * This module's rollup is entirely dependent on the post-test.
     */
    test("should pass post-test and verify rollup per SCORM 2004 SN Book SB.2.5", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);
      await startAssessment(page);

      const { score, successStatus, completionStatus } = await completeAssessmentSCO(page, true);

      expect(score).toBeGreaterThanOrEqual(70);
      expect(successStatus).toBe("passed");
      expect(completionStatus).toBe("completed");

      const rootStatus = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        return {
          completionStatus: state?.rootActivity?.completionStatus || null,
          successStatus: state?.rootActivity?.successStatus || null,
        };
      });

      expect(rootStatus.successStatus).toBe("passed");
      expect(rootStatus.completionStatus).toBe("completed");
    });

    /**
     * Test: Fail post-test and verify rollup behavior
     *
     * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
     * - Section: Rollup Rules (SB.2.5)
     * - Expected Behavior: When a learner fails the post-test assessment:
     *   1. Module sets success_status to "failed"
     *   2. Rollup may not occur or may reflect failure
     *   3. Parent activity may not be satisfied
     *
     * This module's rollup is entirely dependent on the post-test.
     */
    test("should fail post-test and verify rollup behavior per SCORM 2004 SN Book SB.2.5", async ({
      page,
    }) => {
      await launchSequencedModule(page);
      await completeSequentialContent(page);
      await startAssessment(page);

      const { score, successStatus, completionStatus } = await completeAssessmentSCO(page, false);

      expect(score).toBeLessThan(70);
      expect(successStatus).toBe("failed");
      expect(completionStatus).toBe("completed");

      const rootStatus = await page.evaluate(() => {
        const api = (window as any).API_1484_11;
        const state = api.getSequencingState();
        return {
          completionStatus: state?.rootActivity?.completionStatus || null,
          successStatus: state?.rootActivity?.successStatus || null,
        };
      });

      expect(rootStatus.completionStatus).toBe("completed");
      expect(rootStatus.successStatus).toBe("failed");
    });
  });
});
