import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { Settings } from "../../src/types/api_types";

function createApi(limits: Record<string, string>, settings: Settings = {}) {
  return new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: {
        id: "root",
        title: "CM-01",
        sequencingControls: { choice: false, flow: true },
        children: [
          { id: "activity_1", title: "A1", ...limits },
          { id: "activity_2", title: "A2" },
          { id: "activity_3", title: "A3", attemptAbsoluteDurationLimit: "P5Y6M4DT12H30M58.55S" },
        ],
      },
    },
    ...settings,
  });
}

describe("duration limits (CM-01 / DB.1.1)", () => {
  /** @spec SN Book DB.1.1: unconsumed duration limits permit delivery (ADL CM-01). */
  it.each([
    { attemptAbsoluteDurationLimit: "P5Y6M4DT12H30M58S" },
    { attemptAbsoluteDurationLimit: "PT2H" },
    { activityAbsoluteDurationLimit: "PT2H" },
  ])("starts with configured limit %j and preserves it", (limits) => {
    const api = createApi(limits);
    const onActivityDelivery = vi.fn();
    api.setSequencingEventListeners({ onActivityDelivery });
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(onActivityDelivery).toHaveBeenCalledWith(expect.objectContaining({ id: "activity_1" }));
    expect(api.getSequencingState().currentActivity).toMatchObject(limits);
  });

  /** @spec SN Book DB.1.1 / state persistence: legacy limit aliases must not become elapsed durations. */
  it("restores a 3.5.1 snapshot without consuming its duration limits", async () => {
    const saveState = vi.fn().mockResolvedValue(true);
    const loadState = vi.fn();
    const settings: Settings = {
      sequencingStatePersistence: {
        persistence: { saveState, loadState },
        autoSaveOn: "never",
        autoLoadOnInitialize: false,
        compress: false,
      },
    };
    const limits = { attemptAbsoluteDurationLimit: "PT2H", activityAbsoluteDurationLimit: "PT2H" };
    const original = createApi(limits, settings);
    expect(await original.saveSequencingState()).toBe(true);
    const snapshot = JSON.parse(saveState.mock.calls[0]![0]);
    const state = snapshot.sequencing.activityStates.activity_1;
    delete state.attemptAbsoluteDurationValue;
    delete state.activityAbsoluteDurationValue;
    state.attemptAbsoluteDuration = "PT2H";
    state.activityAbsoluteDuration = "PT2H";
    loadState.mockResolvedValue(JSON.stringify(snapshot));
    const restored = createApi(limits, settings);
    expect(await restored.loadSequencingState()).toBe(true);
    expect(restored.processNavigationRequest("start")).toBe(true);
    expect(restored.getSequencingState().currentActivity).toMatchObject(limits);
  });
});
