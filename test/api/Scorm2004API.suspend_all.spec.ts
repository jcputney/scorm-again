import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

/** @spec SN Book: SB.2.5; RB.1.5 - deliver a leaf with two rollup ancestors. */
function createApi(): Scorm2004API {
  return new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: {
        id: "course",
        title: "Course",
        sequencingControls: { flow: true },
        children: [
          {
            id: "module",
            title: "Module",
            sequencingControls: { flow: true },
            children: [
              {
                id: "test_4",
                title: "Quiz",
                primaryObjective: {
                  objectiveID: "quiz",
                  mapInfo: [
                    {
                      targetObjectiveID: "shared-quiz",
                      readSatisfiedStatus: false,
                      readNormalizedMeasure: false,
                      writeSatisfiedStatus: true,
                      writeNormalizedMeasure: true,
                    },
                  ],
                },
                objectives: [
                  {
                    objectiveID: "remediation",
                    mapInfo: [
                      {
                        targetObjectiveID: "shared-remediation",
                        readSatisfiedStatus: false,
                        readNormalizedMeasure: false,
                        writeSatisfiedStatus: true,
                        writeNormalizedMeasure: true,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  });
}

/** @spec SN Book: TB.2.3 step 5; SCORM 2004 4th Ed. RTE 4.2.8 / 4.4. */
function terminateWithSuspendAll(api: Scorm2004API): void {
  expect(api.SetValue("cmi.exit", "suspend")).toBe("true");
  expect(api.SetValue("adl.nav.request", "suspendAll")).toBe("true");
  expect(api.Terminate("")).toBe("true");
}

/** @spec SN Book: TB.2.3 step 5.1; RB.1.5; SB.2.6. */
describe("SCORM 2004 Suspend All RTE transfer", () => {
  /** @spec SN Book: TB.2.3 step 5.1.1; RB.1.5; SB.2.6; RTE 4.2.7 / 4.2.8. */
  it("rolls up reported completion, failure and score on Terminate and resumes the same attempt", () => {
    const api = createApi();
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    const leaf = api.getSequencingState().currentActivity;
    const attemptCount = leaf.attemptCount;
    expect(api.SetValue("cmi.completion_status", "completed")).toBe("true");
    expect(api.SetValue("cmi.success_status", "failed")).toBe("true");
    expect(api.SetValue("cmi.score.scaled", "0.33")).toBe("true");
    expect(api.SetValue("cmi.location", "question-4")).toBe("true");

    terminateWithSuspendAll(api);

    for (const id of ["test_4", "module", "course"]) {
      expect(api.getActivityTrackingData(id)).toMatchObject({
        completionStatus: "completed",
        successStatus: "failed",
        score: 0.33,
      });
    }
    expect(leaf.isActive).toBe(false);
    expect(leaf.isSuspended).toBe(true);
    expect(leaf.activityAttemptActive).toBe(true);
    expect(leaf.attemptCount).toBe(attemptCount);
    expect(api.getSequencingState().currentActivity).toBeNull();

    const restored = createApi();
    expect(restored.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
    expect(restored.processNavigationRequest("resumeAll")).toBe(true);
    expect(restored.getSequencingState().currentActivity).toMatchObject({
      id: "test_4",
      attemptCount,
      isActive: true,
      isSuspended: false,
      completionStatus: "completed",
      successStatus: "failed",
    });
    // The host restores SCO-local RTE data separately from the sequencing tree.
    // @spec SCORM 2004 4th Ed. RTE 4.2.7 / 4.2.8 - suspend determines resume entry.
    restored.loadFromJSON({
      entry: restored.determineEntryValue(api.cmi.getExitValueInternal(), false),
      location: api.cmi.location,
    });
    expect(restored.Initialize("")).toBe("true");
    expect(restored.GetValue("cmi.entry")).toBe("resume");
    expect(restored.GetValue("cmi.location")).toBe("question-4");
  });

  /** @spec SCORM 2004 SN 4th Ed. SM.7 Objective Map write timing; RTE 4.2.17. */
  it("writes primary and non-primary RTE objectives to mapped globals on suspendAll", () => {
    const api = createApi();
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    const leaf = api.getSequencingState().currentActivity;
    expect(api.SetValue("cmi.success_status", "failed")).toBe("true");
    expect(api.SetValue("cmi.score.scaled", "0.33")).toBe("true");
    expect(api.GetValue("cmi.objectives.1.id")).toBe("remediation");
    expect(api.SetValue("cmi.objectives.1.success_status", "passed")).toBe("true");
    expect(api.SetValue("cmi.objectives.1.score.scaled", "0.8")).toBe("true");

    terminateWithSuspendAll(api);

    expect(leaf.primaryObjective).toMatchObject({
      satisfiedStatus: false,
      satisfiedStatusKnown: true,
      normalizedMeasure: 0.33,
      measureStatus: true,
    });
    expect(leaf.objectives[0]).toMatchObject({
      id: "remediation",
      satisfiedStatus: true,
      satisfiedStatusKnown: true,
      normalizedMeasure: 0.8,
      measureStatus: true,
    });
    const globals = api.adl.sequencing?.overallSequencingProcess?.getGlobalObjectiveMap();
    expect(globals?.get("shared-quiz")).toMatchObject({
      satisfiedStatus: false,
      satisfiedStatusKnown: true,
      normalizedMeasure: 0.33,
      normalizedMeasureKnown: true,
    });
    expect(globals?.get("shared-remediation")).toMatchObject({
      satisfiedStatus: true,
      satisfiedStatusKnown: true,
      normalizedMeasure: 0.8,
      normalizedMeasureKnown: true,
    });
  });

  /** @spec SCORM 2004 SN 4th Ed. UP.4 step 1.1.1; TB.2.3 step 5. */
  it("does not auto-complete or auto-satisfy an unreported suspended SCO", () => {
    const api = createApi();
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    const leaf = api.getSequencingState().currentActivity;
    const attemptCount = leaf.attemptCount;
    expect(leaf.sequencingControls.completionSetByContent).toBe(false);
    expect(leaf.sequencingControls.objectiveSetByContent).toBe(false);

    terminateWithSuspendAll(api);

    expect(leaf.completionStatus).not.toBe("completed");
    expect(leaf.attemptProgressStatus).toBe(false);
    expect(leaf.objectiveSatisfiedStatusKnown).toBe(false);
    expect(leaf.wasAutoCompleted).toBe(false);
    expect(leaf.wasAutoSatisfied).toBe(false);
    expect(leaf.isSuspended).toBe(true);
    expect(leaf.activityAttemptActive).toBe(true);
    expect(leaf.attemptCount).toBe(attemptCount);
    expect(api.getActivityTrackingData("course")?.completionStatus).not.toBe("completed");
    expect(api.getActivityTrackingData("course")?.successStatus).not.toBe("passed");
  });

  /** @spec SN Book: TB.2.3 step 5; SCORM 2004 4th Ed. RTE 3.1.6. */
  it("suspends before Initialize without transferring absent RTE data", () => {
    const api = createApi();
    expect(api.processNavigationRequest("start")).toBe(true);
    const leaf = api.getSequencingState().currentActivity;
    const tracking = api.getActivityTrackingData("test_4");

    expect(api.processNavigationRequest("suspendAll")).toBe(true);

    expect(api.getActivityTrackingData("test_4")).toEqual(tracking);
    expect(leaf.isSuspended).toBe(true);
    expect(leaf.isActive).toBe(false);
    expect(api.processNavigationRequest("resumeAll")).toBe(true);
    expect(api.getSequencingState().currentActivity).toBe(leaf);
  });
});
