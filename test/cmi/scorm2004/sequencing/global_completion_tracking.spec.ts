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
  // @spec ADL CO-10 / SN 4.2.1.2: objective reads retain mapped completion;
  // SN 4.2.1.4 applies the threshold to activity attempt completion instead.
  const readState = GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(
    activity,
    objective,
    map,
    global,
  );
  expect(readState.completionStatus).toBe(global.completionStatus);
  activity.primaryObjective = objective;
  objective.applyReadMappedState(readState);
  objective.applyToActivity(activity);
  expect(activity.completionStatus).toBe(expected);
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

/** Split read maps must have the same completion precedence as a single map. */
it.each(["read phase", "combined"])("keeps measure precedence in %s", (mode) => {
  for (const reverse of [false, true]) {
    for (const known of [false, true]) {
      for (const completedByMeasure of [false, true]) {
        const activity = new Activity("reader");
        activity.completedByMeasure = completedByMeasure;
        activity.minProgressMeasure = 0.5;
        const objective = new ActivityObjective("primary", { isPrimary: true });
        objective.mapInfo = [
          { targetObjectiveID: "progress", readProgressMeasure: true },
          { targetObjectiveID: "completion", readCompletionStatus: true },
        ];
        if (reverse) objective.mapInfo.reverse();
        activity.primaryObjective = objective;
        // A stale local measure must not replace a directly read completion.
        objective.progressMeasure = 0.8;
        objective.progressMeasureStatus = true;
        const globals = new Map<string, GlobalObjective>([
          ["progress", { progressMeasureKnown: known, progressMeasure: 0.8 } as GlobalObjective],
          [
            "completion",
            {
              completionStatusKnown: true,
              completionStatus: CompletionStatus.INCOMPLETE,
            } as GlobalObjective,
          ],
        ]);
        const synchronizer = new GlobalObjectiveSynchronizer();
        if (mode === "read phase") {
          synchronizer.syncGlobalObjectivesReadPhase(activity, globals);
        } else {
          synchronizer.synchronizeGlobalObjectives(activity, globals);
        }
        const expected = completedByMeasure
          ? known
            ? CompletionStatus.COMPLETED
            : CompletionStatus.UNKNOWN
          : CompletionStatus.INCOMPLETE;
        expect(
          objective.completionStatus,
          `reverse=${reverse}, known=${known}, byMeasure=${completedByMeasure}`,
        ).toBe(CompletionStatus.INCOMPLETE);
        expect(activity.completionStatus).toBe(expected);
      }
    }
  }
});
