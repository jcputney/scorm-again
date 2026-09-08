import { describe, expect, it } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../src/constants/enums";

const objective = (targetObjectiveID: string, writeSatisfiedStatus: boolean) => ({
  objectiveID: "learning_objective_satisfied",
  mapInfo: [
    {
      targetObjectiveID,
      readSatisfiedStatus: true,
      writeSatisfiedStatus,
      writeNormalizedMeasure: writeSatisfiedStatus,
    },
  ],
});

const skipIfSatisfied = {
  preConditionRules: [
    {
      action: "skip",
      conditionCombination: "all",
      conditions: [{ condition: "satisfied" }],
    },
  ],
};

const contentActivity = (id: string, targetObjectiveID: string) => ({
  id,
  title: id,
  sequencingRules: skipIfSatisfied,
  sequencingControls: {
    rollupObjectiveSatisfied: false,
    rollupProgressCompletion: false,
    objectiveMeasureWeight: 0,
    completionSetByContent: true,
    objectiveSetByContent: true,
  },
  primaryObjective: objective(targetObjectiveID, false),
});

const testActivity = (id: string, targetObjectiveID: string, last = false) => ({
  id,
  title: id,
  sequencingRules: {
    ...skipIfSatisfied,
    ...(last
      ? {
          postConditionRules: [
            {
              action: "exitParent",
              conditionCombination: "all",
              conditions: [{ condition: "always" }],
            },
          ],
        }
      : {}),
  },
  sequencingControls: {
    rollupObjectiveSatisfied: true,
    rollupProgressCompletion: true,
    objectiveMeasureWeight: 1,
    completionSetByContent: true,
    objectiveSetByContent: true,
  },
  rollupConsiderations: {
    requiredForCompleted: "ifNotSkipped",
  },
  primaryObjective: objective(targetObjectiveID, true),
});

const SIMPLE_REMEDIATION_TREE = {
  id: "simple_remediation",
  title: "Simple remediation",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "content_wrapper",
      title: "Remediation wrapper",
      sequencingControls: {
        choice: false,
        flow: true,
        choiceExit: false,
      },
      sequencingRules: {
        postConditionRules: [
          {
            action: "retry",
            conditionCombination: "any",
            conditions: [
              { condition: "satisfied", operator: "not" },
              { condition: "objectiveStatusKnown", operator: "not" },
            ],
          },
          {
            action: "exitAll",
            conditionCombination: "any",
            conditions: [{ condition: "satisfied" }],
          },
        ],
      },
      children: [
        contentActivity("content_1", "global_1"),
        contentActivity("content_2", "global_2"),
        testActivity("test_1", "global_1"),
        testActivity("test_2", "global_2", true),
      ],
    },
  ],
};

function createApi(): Scorm2004API {
  return new Scorm2004API({
    autocommit: false,
    logLevel: LogLevelEnum.NONE,
    sequencing: {
      activityTree: SIMPLE_REMEDIATION_TREE as any,
    },
  });
}

function currentActivityId(api: Scorm2004API): string | undefined {
  return api.getSequencingState().currentActivity?.id;
}

function beginVisit(api: Scorm2004API): void {
  api.reset();
  expect(api.lmsInitialize("")).toBe("true");
}

function finishAndContinue(
  api: Scorm2004API,
  successStatus?: "passed" | "failed",
): void {
  expect(api.lmsSetValue("cmi.completion_status", "completed")).toBe("true");
  if (successStatus) {
    expect(api.lmsSetValue("cmi.success_status", successStatus)).toBe("true");
    expect(api.lmsSetValue("cmi.score.scaled", successStatus === "passed" ? "1" : "0")).toBe(
      "true",
    );
  }
  expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
  expect(api.lmsSetValue("adl.nav.request", "_continue")).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
}

describe("SCORM 2004 simple remediation", () => {
  it("exits after a failed objective is remediated while mastered siblings are skipped", () => {
    const api = createApi();

    expect(api.lmsInitialize("")).toBe("true");
    expect(currentActivityId(api)).toBe("content_1");

    finishAndContinue(api);
    expect(currentActivityId(api)).toBe("content_2");
    beginVisit(api);

    finishAndContinue(api);
    expect(currentActivityId(api)).toBe("test_1");
    beginVisit(api);

    finishAndContinue(api, "passed");
    expect(currentActivityId(api)).toBe("test_2");
    beginVisit(api);

    finishAndContinue(api, "failed");
    expect(currentActivityId(api)).toBe("content_2");
    beginVisit(api);

    finishAndContinue(api);
    expect(currentActivityId(api)).toBe("test_2");
    beginVisit(api);

    finishAndContinue(api, "passed");

    const root = api.getSequencingState().rootActivity;
    const wrapper = root?.children[0];
    const masteredContent = wrapper?.children.find((activity) => activity.id === "content_1");
    const masteredTest = wrapper?.children.find((activity) => activity.id === "test_1");

    expect(masteredContent?.wasSkipped).toBe(true);
    expect(masteredTest?.wasSkipped).toBe(true);
    expect(masteredTest?.objectiveInfoAvailableInCurrentParentAttempt).toBe(true);
    expect(masteredTest?.requiredForCompleted).toBe("ifNotSkipped");
    expect(wrapper?.objectiveSatisfiedStatusKnown).toBe(true);
    expect(wrapper?.objectiveSatisfiedStatus).toBe(true);
    expect(wrapper?.completionStatus).toBe("completed");
    expect(currentActivityId(api)).toBeUndefined();
  });
});
