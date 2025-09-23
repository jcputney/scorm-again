import { describe, expect, it } from "vitest";

import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";

describe("RollupProcess objective synchronization", () => {
  it("should synchronize objectives with global map info", () => {
    const activity = new Activity("root");

    const primaryObjective = new ActivityObjective("primary", {
      satisfiedByMeasure: true,
      minNormalizedMeasure: 0.7,
      mapInfo: [
        {
          targetObjectiveID: "GLOBAL_PRIMARY",
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true,
          readCompletionStatus: true,
          writeCompletionStatus: true,
          updateAttemptData: true,
        },
      ],
      isPrimary: true,
    });
    activity.primaryObjective = primaryObjective;
    activity.objectiveNormalizedMeasure = 0.5;
    activity.objectiveMeasureStatus = true;

    const secondaryObjective = new ActivityObjective("secondary", {
      mapInfo: [
        {
          targetObjectiveID: "GLOBAL_SECONDARY",
          writeNormalizedMeasure: true,
        },
      ],
    });
    secondaryObjective.normalizedMeasure = 0.3;
    secondaryObjective.measureStatus = true;
    activity.addObjective(secondaryObjective);

    const rollupProcess = new RollupProcess();
    const globalObjectives = new Map<string, any>();

    rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

    expect(globalObjectives.has("GLOBAL_PRIMARY")).toBe(true);
    expect(globalObjectives.has("GLOBAL_SECONDARY")).toBe(true);

    const primaryGlobal = globalObjectives.get("GLOBAL_PRIMARY");
    const secondaryGlobal = globalObjectives.get("GLOBAL_SECONDARY");

    expect(primaryGlobal.normalizedMeasure).toBeCloseTo(0.5);
    expect(secondaryGlobal.normalizedMeasure).toBeCloseTo(0.3);

    // Simulate LMS updating primary objective state
    primaryGlobal.normalizedMeasure = 0.9;
    primaryGlobal.normalizedMeasureKnown = true;
    primaryGlobal.satisfiedStatus = true;
    primaryGlobal.satisfiedStatusKnown = true;

    rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

    expect(activity.objectiveNormalizedMeasure).toBeCloseTo(0.9);
    expect(activity.objectiveSatisfiedStatus).toBe(true);
  });
});
