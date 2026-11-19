import { expect, it } from "vitest";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  GlobalObjective,
  GlobalObjectiveSynchronizer,
} from "../../../../src/cmi/scorm2004/sequencing/objectives/global_objective_synchronizer";
import {
  RuleCondition,
  RuleConditionType,
  RuleConditionOperator,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { CompletionStatus } from "../../../../src/constants/enums";

/** @spec ADL CTS CO-02a: read progress measure determines local completion. */
it.each([
  [0.49, CompletionStatus.INCOMPLETE],
  [0.5, CompletionStatus.COMPLETED],
  [0.8, CompletionStatus.COMPLETED],
])("derives completion at measure %s", (measure, expected) => {
  const activity = new Activity("reader");
  activity.completedByMeasure = true;
  activity.minProgressMeasure = 0.5;
  const objective = new ActivityObjective("primary", { isPrimary: true });
  const map = {
    targetObjectiveID: "global",
    readCompletionStatus: true,
    readProgressMeasure: true,
  };
  const global = {
    progressMeasureKnown: true,
    progressMeasure: measure,
    completionStatusKnown: true,
    completionStatus: measure < 0.5 ? CompletionStatus.COMPLETED : CompletionStatus.INCOMPLETE,
  } as GlobalObjective;
  expect(
    GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(activity, objective, map, global)
      .completionStatus,
  ).toBe(expected);
  expect(
    GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(
      activity,
      objective,
      { ...map, readProgressMeasure: false },
      global,
    ).completionStatus,
  ).toBe(global.completionStatus);
  expect(
    GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(activity, objective, map, {
      ...global,
      progressMeasureKnown: false,
    }).completionStatus,
  ).toBe(global.completionStatus);
  activity.completedByMeasure = false;
  expect(
    GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(activity, objective, map, global)
      .completionStatus,
  ).toBe(global.completionStatus);
});

/** @spec SCORM 2004 SN tracking information is unavailable for tracked=false; CO-05b. */
it.each([
  RuleConditionType.COMPLETED,
  RuleConditionType.ACTIVITY_COMPLETED,
  RuleConditionType.PROGRESS_KNOWN,
  RuleConditionType.ACTIVITY_PROGRESS_KNOWN,
])("hides untracked %s even under NOT", (condition) => {
  const activity = new Activity("untracked");
  activity.sequencingControls.tracked = false;
  activity.completionStatus = CompletionStatus.COMPLETED;
  activity.attemptCount = 2;
  activity.attemptLimit = 1;
  expect(new RuleCondition(condition).evaluate(activity)).toBe("unknown");
  expect(new RuleCondition(condition, RuleConditionOperator.NOT).evaluate(activity)).toBe(
    "unknown",
  );
  expect(new RuleCondition(RuleConditionType.ALWAYS).evaluate(activity)).toBe(true);
});
