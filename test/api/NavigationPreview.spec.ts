import { afterEach, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

const disabled = {
  preConditionRules: [{ action: "disabled", conditions: [{ condition: "always" }] }],
};

function fixture(
  children: any[] = [{ id: "lesson" }, { id: "locked", sequencingRules: disabled }],
) {
  const events = vi.fn();
  const api = new Scorm2004API({
    logLevel: 5,
    selfReportSessionTime: false,
    sequencing: {
      eventListeners: {
        onNavigationRequest: events,
        onActivityDelivery: events,
        onActivityUnload: events,
        onSequencingSessionEnd: events,
        onGlobalObjectiveMapUpdate: events,
      },
      activityTree: { id: "course", sequencingControls: { flow: true, choice: true }, children },
    },
  });
  expect(api.Initialize("")).toBe("true");
  api.SetValue("cmi.location", "page-4");
  api.SetValue("cmi.suspend_data", "internal-screen-state");
  const commit = vi.spyOn(api, "storeData");
  events.mockClear();
  return { api, events, commit };
}

function state(api: Scorm2004API) {
  const saved = JSON.parse(api.serializeSequencingState());
  delete saved.timestamp;
  delete saved.sequencing.timestamp;
  if (saved.suspensionState) delete saved.suspensionState.timestamp;
  return {
    saved,
    cmi: JSON.stringify(api.cmi),
    error: api.GetLastError(),
    initialized: api.isInitialized(),
    terminated: api.isTerminated(),
    tracking: structuredClone(api.adl.sequencing.activityTree),
    globalMap: structuredClone(
      api.getSequencingService()!.getOverallSequencingProcess()!.getGlobalObjectiveMap(),
    ),
  };
}

afterEach(() => vi.restoreAllMocks());

describe("host navigation preview", () => {
  it("reports a blocked Continue without ending the attempt or publishing any effect", () => {
    const { api, events, commit } = fixture();
    expect(api.GetValue("adl.nav.request_valid.continue")).toBe("true");
    api.GetValue("cmi.invalid"); // Preserve the existing API error, too.
    const before = state(api);
    const current = api.getSequencingState().currentActivity;
    events.mockClear();
    for (let i = 0; i < 3; i++) {
      expect(api.previewNavigationRequest("continue")).toEqual({
        outcome: "blocked",
        targetActivityId: null,
        endSequencingSession: false,
        exception: "SB.2.2-2",
      });
    }
    expect(events).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
    expect(state(api)).toEqual(before);
    expect(api.getSequencingState().currentActivity).toBe(current);
    expect(current.isActive).toBe(true);
    expect(current.attemptCount).toBe(1);
    api.SetValue("adl.nav.request", "continue");
    expect(api.Terminate("")).toBe("true");
    expect(api.getSequencingState().lastSequencingResult.exception).toBe("SB.2.2-2");
  });

  it("includes End Attempt objective writes that unlock the next SCO", () => {
    const { api, events, commit } = fixture([
      {
        id: "lesson",
        sequencingControls: { completionSetByContent: true },
        primaryObjective: {
          objectiveID: "source",
          mapInfo: [
            {
              targetObjectiveID: "shared",
              writeCompletionStatus: true,
              readCompletionStatus: false,
            },
          ],
        },
      },
      {
        id: "next",
        objectives: [
          {
            objectiveID: "prerequisite",
            mapInfo: [
              {
                targetObjectiveID: "shared",
                readCompletionStatus: true,
                writeCompletionStatus: false,
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
                { condition: "completed", operator: "not", referencedObjective: "prerequisite" },
                {
                  condition: "activityProgressKnown",
                  operator: "not",
                  referencedObjective: "prerequisite",
                },
              ],
            },
          ],
        },
      },
    ]);
    api.SetValue("cmi.completion_status", "incomplete");
    expect(api.previewNavigationRequest("continue").outcome).toBe("blocked");
    api.SetValue("cmi.completion_status", "completed");
    const before = state(api);
    events.mockClear();
    expect(api.previewNavigationRequest("continue")).toEqual({
      outcome: "allowed",
      targetActivityId: "next",
      endSequencingSession: false,
      exception: null,
    });
    expect(events).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
    expect(state(api)).toEqual(before);
    api.SetValue("adl.nav.request", "continue");
    api.Terminate("");
    expect(api.getSequencingState().currentActivity.id).toBe("next");
  });

  it.each(["allowed", "blocked"])("preserves authored-vs-seeded unknown status (%s)", (outcome) => {
    const { api } = fixture([
      {
        id: "lesson",
        sequencingRules: {
          postConditionRules: [{ action: "exitAll", conditions: [{ condition: "satisfied" }] }],
        },
      },
      { id: "next" },
    ]);
    // The default End Attempt policy auto-satisfies only if the SCO did not
    // communicate status. A bulk LMS load must remain distinct from SetValue.
    if (outcome === "blocked") api.SetValue("cmi.success_status", "unknown");
    else api.loadFromJSON({ success_status: "unknown" });
    const current = api.getSequencingState().currentActivity;
    const before = state(api);
    expect(api.previewNavigationRequest("continue")).toMatchObject({
      outcome: "allowed",
      endSequencingSession: outcome === "allowed",
      targetActivityId: outcome === "allowed" ? null : "next",
    });
    expect(state(api)).toEqual(before);
    api.SetValue("adl.nav.request", "continue");
    api.Terminate("");
    expect(current.objectiveSatisfiedStatus).toBe(outcome === "allowed");
  });

  it("allows genuine end-of-course with no next SCO", () => {
    const { api } = fixture([{ id: "lesson" }]);
    expect(api.previewNavigationRequest("continue")).toEqual({
      outcome: "allowed",
      targetActivityId: null,
      endSequencingSession: true,
      exception: null,
    });
    expect(api.isInitialized()).toBe(true);
  });

  it("honors explicit Skip, rather than treating it as a disabled candidate", () => {
    const { api } = fixture([
      { id: "lesson" },
      {
        id: "skipped",
        sequencingRules: {
          preConditionRules: [{ action: "skip", conditions: [{ condition: "always" }] }],
        },
      },
      { id: "next" },
    ]);
    expect(api.previewNavigationRequest("continue").targetActivityId).toBe("next");
  });

  it("checks nested flow and candidate attempt limits", () => {
    const { api } = fixture([
      {
        id: "cluster",
        sequencingControls: { flow: true },
        children: [{ id: "lesson" }, { id: "next" }],
      },
    ]);
    expect(api.previewNavigationRequest("continue").targetActivityId).toBe("next");
    const next = api.adl.sequencing.activityTree.getActivity("next")!;
    next.attemptLimit = 1;
    next.attemptCount = 1;
    const before = state(api);
    expect(api.previewNavigationRequest("continue")).toMatchObject({
      outcome: "blocked",
      exception: "SB.2.2-2",
    });
    expect(state(api)).toEqual(before);
  });

  it("previews Previous from the second SCO without changing either attempt", () => {
    const { api } = fixture([{ id: "lesson" }, { id: "next" }]);
    api.processNavigationRequest("choice", "next");
    const before = state(api);
    expect(api.previewNavigationRequest("previous")).toMatchObject({
      outcome: "allowed",
      targetActivityId: "lesson",
    });
    expect(state(api)).toEqual(before);
  });

  it("previews a resumed attempt without starting a new one", () => {
    let { api } = fixture();
    api.SetValue("cmi.exit", "suspend");
    api.SetValue("adl.nav.request", "suspendAll");
    api.Terminate("");
    expect(api.previewNavigationRequest("continue").outcome).toBe("unknown");
    const saved = api.serializeSequencingState();
    api = new Scorm2004API(api.settings);
    expect(api.deserializeSequencingState(saved)).toBe(true);
    expect(api.processNavigationRequest("resumeAll")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    const before = state(api);
    expect(api.previewNavigationRequest("continue").outcome).toBe("blocked");
    expect(state(api)).toEqual(before);
    expect(api.getSequencingState().currentActivity.attemptCount).toBe(1);
  });

  it("allows authored Retry of the current SCO", () => {
    const { api } = fixture([
      {
        id: "lesson",
        sequencingRules: {
          postConditionRules: [{ action: "retry", conditions: [{ condition: "always" }] }],
        },
      },
      { id: "next" },
    ]);
    const before = state(api);
    expect(api.previewNavigationRequest("continue").targetActivityId).toBe("lesson");
    expect(state(api)).toEqual(before);
  });

  it("returns unknown for unsupported lifecycle and requests", () => {
    const api = new Scorm2004API({ logLevel: 5 });
    expect(api.previewNavigationRequest("continue").outcome).toBe("unknown");
    expect(api.Initialize("")).toBe("true");
    expect(api.previewNavigationRequest("continue").outcome).toBe("unknown");
    const active = fixture().api;
    expect(active.previewNavigationRequest("choice" as "continue").outcome).toBe("unknown");
  });

  it("does not consume randomness for randomized trees", () => {
    const { api } = fixture();
    const root = api.getSequencingState().rootActivity;
    root.sequencingControls.randomizeChildren = true;
    root.sequencingControls.randomizationTiming = "onEachNewAttempt";
    const random = vi.spyOn(Math, "random");
    expect(api.previewNavigationRequest("continue").outcome).toBe("unknown");
    expect(random).not.toHaveBeenCalled();
  });

  it("returns unknown without invoking custom model accessors", () => {
    const { api } = fixture();
    const getter = vi.fn();
    Object.defineProperty(api.getSequencingState().currentActivity, "custom", { get: getter });
    expect(api.previewNavigationRequest("continue").outcome).toBe("unknown");
    expect(getter).not.toHaveBeenCalled();
  });
});
