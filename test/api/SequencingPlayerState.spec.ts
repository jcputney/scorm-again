import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

function makeApi(onActivityDelivery = vi.fn()) {
  return new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: {
        id: "course",
        title: "Course",
        sequencingControls: { flow: true },
        children: [0.5, 0.3, 0.4, 0.3, 0.1].map((weight, index) => ({
          id: `sco${index + 1}`,
          title: `SCO ${index + 1}`,
          completionThreshold: { progressWeight: weight },
        })),
      },
      eventListeners: { onActivityDelivery },
    },
  });
}

function terminateSuspendedSco(api: Scorm2004API) {
  expect(api.processNavigationRequest("start")).toBe(true);
  expect(api.Initialize("")).toBe("true");
  expect(api.SetValue("cmi.location", "3")).toBe("true");
  expect(api.SetValue("cmi.progress_measure", "0.5")).toBe("true");
  expect(api.SetValue("cmi.exit", "suspend")).toBe("true");
  expect(api.Terminate("")).toBe("true");
}

describe("SCORM 2004 player tracking data", () => {
  it("returns null for an unknown activity or an unconfigured tree", () => {
    expect(makeApi().getActivityTrackingData("missing")).toBeNull();
    expect(new Scorm2004API({ logLevel: 5 }).getActivityTrackingData("course")).toBeNull();
  });

  it("distinguishes unknown completion amount from a reported zero", () => {
    const api = makeApi();
    expect(api.getActivityTrackingData("sco1")).toMatchObject({
      attemptCompletionAmount: 0,
      attemptCompletionAmountStatus: false,
    });
    expect(api.getActivityTrackingData("course")).toMatchObject({
      attemptCompletionAmount: 0,
      attemptCompletionAmountStatus: false,
    });

    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    expect(api.SetValue("cmi.progress_measure", "0")).toBe("true");
    expect(api.Terminate("")).toBe("true");

    for (const id of ["sco1", "course"]) {
      expect(api.getActivityTrackingData(id)).toMatchObject({
        attemptCompletionAmount: 0,
        attemptCompletionAmountStatus: true,
      });
    }
  });

  it("exposes weighted course completion independently of SCO progress and score", () => {
    const api = makeApi();
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    expect(api.SetValue("cmi.progress_measure", "1")).toBe("true");
    expect(api.SetValue("cmi.score.scaled", "0.8")).toBe("true");
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.Terminate("")).toBe("true");

    api.reset();
    expect(api.Initialize("")).toBe("true");
    expect(api.SetValue("cmi.progress_measure", "0.5")).toBe("true");
    expect(api.SetValue("cmi.exit", "suspend")).toBe("true");
    expect(api.Terminate("")).toBe("true");

    expect(api.getActivityTrackingData("sco1")).toMatchObject({
      progressMeasure: 1,
      score: 0.8,
      attemptCompletionAmount: 1,
      attemptCompletionAmountStatus: true,
    });
    expect(api.getActivityTrackingData("sco2")).toMatchObject({
      progressMeasure: 0.5,
      attemptCompletionAmount: 0.5,
      attemptCompletionAmountStatus: true,
    });
    const course = api.getActivityTrackingData("course");
    expect(course?.progressMeasure).toBe(0);
    expect(course?.attemptCompletionAmountStatus).toBe(true);
    // SN RB.1.1.b: unreported children still contribute their weights to the denominator.
    expect(course?.attemptCompletionAmount).toBeCloseTo(0.40625);

    const restored = makeApi();
    expect(restored.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
    expect(restored.getActivityTrackingData("course")).toEqual(course);
  });
});

describe("SCORM 2004 closed-window suspension", () => {
  it("retains start/resumeAll validation for a snapshot without suspendAll", () => {
    const source = makeApi();
    terminateSuspendedSco(source);

    const restored = makeApi();
    expect(restored.deserializeSequencingState(source.serializeSequencingState())).toBe(true);
    expect(restored.processNavigationRequest("resumeAll")).toBe(false);
    expect(restored.processNavigationRequest("start")).toBe(false);
  });

  it.each(["before saving", "after restoring"])(
    "can suspend a terminated SCO %s and resume its existing attempt",
    (when) => {
      const source = makeApi();
      terminateSuspendedSco(source);
      const tracking = source.getActivityTrackingData("sco1");
      const courseTracking = source.getActivityTrackingData("course");
      const attemptCount = source.getSequencingState().currentActivity.attemptCount;

      if (when === "before saving") {
        expect(source.processNavigationRequest("suspendAll")).toBe(true);
        expect(source.getSequencingState().currentActivity).toBeNull();
      }

      const onDelivery = vi.fn();
      const restored = makeApi(onDelivery);
      expect(restored.deserializeSequencingState(source.serializeSequencingState())).toBe(true);
      if (when === "after restoring") {
        expect(restored.processNavigationRequest("suspendAll")).toBe(true);
        expect(restored.getSequencingState().currentActivity).toBeNull();
      }
      expect(onDelivery).not.toHaveBeenCalled();
      expect(restored.getActivityTrackingData("sco1")).toEqual(tracking);
      expect(restored.getActivityTrackingData("course")).toEqual(courseTracking);

      expect(restored.processNavigationRequest("resumeAll")).toBe(true);
      expect(onDelivery).toHaveBeenCalledOnce();
      expect(onDelivery.mock.calls[0]?.[0].id).toBe("sco1");
      expect(restored.getSequencingState().currentActivity.attemptCount).toBe(attemptCount);
      // SCO runtime data is persisted separately from the sequencing snapshot by the host.
      restored.loadFromJSON({ location: "3", entry: "resume" });
      expect(restored.Initialize("")).toBe("true");
      expect(restored.GetValue("cmi.location")).toBe("3");
      expect(restored.GetValue("cmi.entry")).toBe("resume");
    },
  );

  it("resumes when an active SCO requests suspendAll during Terminate", () => {
    const source = makeApi();
    expect(source.processNavigationRequest("start")).toBe(true);
    expect(source.Initialize("")).toBe("true");
    expect(source.SetValue("cmi.exit", "suspend")).toBe("true");
    expect(source.SetValue("adl.nav.request", "suspendAll")).toBe("true");
    expect(source.Terminate("")).toBe("true");

    const restored = makeApi();
    expect(restored.deserializeSequencingState(source.serializeSequencingState())).toBe(true);
    expect(restored.processNavigationRequest("resumeAll")).toBe(true);
    expect(restored.getSequencingState().currentActivity.id).toBe("sco1");
  });

  it("keeps restored APIs reusable across reset", () => {
    const source = makeApi();
    terminateSuspendedSco(source);

    const restored = makeApi();
    expect(restored.deserializeSequencingState(source.serializeSequencingState())).toBe(true);
    expect(typeof restored.adl.nav.request_valid.reset).toBe("function");
    expect(() => restored.reset()).not.toThrow();
  });
});
