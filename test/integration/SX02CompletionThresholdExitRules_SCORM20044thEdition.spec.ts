import { expect, test } from "@playwright/test";
import { configureWrapper, waitForPageReady } from "./helpers/scorm-common-helpers";
import { getWrapperConfigs } from "./helpers/scorm2004-helpers";

/**
 * ADL CTS SX-02 regression coverage for SCORM 2004 4th Edition sequencing.
 *
 * This scenario exercises completionThreshold completedByMeasure behavior, rollup
 * into an intermediate cluster, and TB.2.1 ancestor exit action rule processing
 * before post-condition sequencing request selection.
 */

const SX02_ACTIVITY_TREE = {
  id: "SX-02",
  title: "SX-02",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
    },
    {
      id: "activity_2",
      title: "Activity 2",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      sequencingRules: {
        exitConditionRules: [
          {
            action: "exit",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
              },
            ],
          },
        ],
        postConditionRules: [
          {
            action: "previous",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
              },
            ],
          },
        ],
      },
      rollupRules: {
        rules: [
          {
            action: "satisfied",
            consideration: "all",
            conditions: [
              {
                condition: "completed",
              },
            ],
          },
        ],
      },
      children: [
        {
          id: "activity_3",
          title: "Activity 3",
          completionThreshold: {
            completedByMeasure: true,
            minProgressMeasure: 0.5,
          },
        },
        {
          id: "activity_4",
          title: "Activity 4",
        },
        {
          id: "activity_5",
          title: "Activity 5",
          completionThreshold: {
            completedByMeasure: true,
            minProgressMeasure: 0.75,
          },
        },
      ],
    },
    {
      id: "activity_6",
      title: "Activity 6",
    },
  ],
};

const wrappers = getWrapperConfigs();

type ActivitySnapshot = {
  completionStatus: string;
  successStatus: string;
  objectiveSatisfiedStatus: boolean | null;
  attemptCompletionAmount: number;
  attemptCompletionAmountStatus: boolean;
  progressMeasure: number;
  progressMeasureStatus: boolean;
};

type VisitResult = {
  currentActivityId: string | null;
  setResults: string[];
  navSetResult: string;
  terminateResult: string;
  activity3: ActivitySnapshot | null;
  activity2: ActivitySnapshot | null;
};

async function setupSX02(page: any, wrapperPath: string): Promise<void> {
  await configureWrapper(page, {
    sequencing: {
      activityTree: SX02_ACTIVITY_TREE,
    },
  });

  await page.goto(wrapperPath);
  await waitForPageReady(page);

  const initResult = await page.evaluate(() => {
    const api = (window as any).API_1484_11;
    return api.lmsInitialize("");
  });

  expect(initResult).toBe("true");
  await expect.poll(() => currentActivityId(page)).toBe("activity_1");
}

async function prepareNextVisit(page: any): Promise<void> {
  const initResult = await page.evaluate(() => {
    const api = (window as any).API_1484_11;
    api.reset();
    return api.lmsInitialize("");
  });

  expect(initResult).toBe("true");
}

async function currentActivityId(page: any): Promise<string | null> {
  return await page.evaluate(() => {
    const api = (window as any).API_1484_11;
    return api.getSequencingState().currentActivity?.id ?? null;
  });
}

async function visitAndContinue(
  page: any,
  cmiUpdates: Array<[string, string]>,
): Promise<VisitResult> {
  return await page.evaluate((updates) => {
    const api = (window as any).API_1484_11;
    const setResults = updates.map(([element, value]) => api.lmsSetValue(element, value));
    const navSetResult = api.lmsSetValue("adl.nav.request", "_continue");
    const terminateResult = api.lmsFinish("");

    const state = api.getSequencingState();
    const findActivity = (activity: any, id: string): any => {
      if (!activity) return null;
      if (activity.id === id) return activity;
      for (const child of activity.children ?? []) {
        const result = findActivity(child, id);
        if (result) return result;
      }
      return null;
    };
    const snapshot = (activity: any): ActivitySnapshot | null => {
      if (!activity) return null;
      return {
        completionStatus: activity.completionStatus,
        successStatus: activity.successStatus,
        objectiveSatisfiedStatus: activity.objectiveSatisfiedStatus,
        attemptCompletionAmount: activity.attemptCompletionAmount,
        attemptCompletionAmountStatus: activity.attemptCompletionAmountStatus,
        progressMeasure: activity.progressMeasure,
        progressMeasureStatus: activity.progressMeasureStatus,
      };
    };

    return {
      currentActivityId: state.currentActivity?.id ?? null,
      setResults,
      navSetResult,
      terminateResult,
      activity3: snapshot(findActivity(state.rootActivity, "activity_3")),
      activity2: snapshot(findActivity(state.rootActivity, "activity_2")),
    };
  }, cmiUpdates);
}

wrappers.forEach((wrapper) => {
  test.describe(`ADL CTS SX-02 completion threshold and exit rules (${wrapper.name})`, () => {
    test("derives completedByMeasure completion and applies ancestor exit/post-condition sequencing", async ({
      page,
    }) => {
      await setupSX02(page, wrapper.path);

      const firstVisit = await visitAndContinue(page, [["cmi.exit", "normal"]]);
      expect(firstVisit.setResults).toEqual(["true"]);
      expect(firstVisit.navSetResult).toBe("true");
      expect(firstVisit.terminateResult).toBe("true");
      expect(firstVisit.currentActivityId).toBe("activity_3");

      await prepareNextVisit(page);
      expect(await currentActivityId(page)).toBe("activity_3");

      const activity3Visit = await visitAndContinue(page, [
        ["cmi.completion_status", "incomplete"],
        ["cmi.progress_measure", "0.5"],
        ["cmi.exit", "normal"],
      ]);
      expect(activity3Visit.setResults).toEqual(["true", "true", "true"]);
      expect(activity3Visit.terminateResult).toBe("true");
      expect(activity3Visit.currentActivityId).toBe("activity_4");
      expect(activity3Visit.activity3?.completionStatus).toBe("completed");
      expect(activity3Visit.activity3?.attemptCompletionAmountStatus).toBe(true);
      expect(activity3Visit.activity3?.attemptCompletionAmount).toBe(0.5);

      await prepareNextVisit(page);
      expect(await currentActivityId(page)).toBe("activity_4");

      const activity4Visit = await visitAndContinue(page, [
        ["cmi.success_status", "failed"],
        ["cmi.exit", "normal"],
      ]);
      expect(activity4Visit.setResults).toEqual(["true", "true"]);
      expect(activity4Visit.terminateResult).toBe("true");
      expect(activity4Visit.currentActivityId).toBe("activity_5");

      await prepareNextVisit(page);
      expect(await currentActivityId(page)).toBe("activity_5");

      const activity5Visit = await visitAndContinue(page, [
        ["cmi.progress_measure", "0.9"],
        ["cmi.exit", "normal"],
      ]);
      expect(activity5Visit.setResults).toEqual(["true", "true"]);
      expect(activity5Visit.terminateResult).toBe("true");
      expect(activity5Visit.activity2?.objectiveSatisfiedStatus).toBe(true);
      expect(activity5Visit.currentActivityId).toBe("activity_1");
    });
  });
});
