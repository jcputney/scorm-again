import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { Settings } from "../../src/types/api_types";

/** @spec SN Book: SB.2.5; NB.2.1 - deliver a course with flow and choice navigation. */
function createApi(settings: Settings = {}): Scorm2004API {
  return new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: {
        id: "root",
        sequencingControls: { flow: true, choice: true },
        children: [{ id: "a" }, { id: "b" }, { id: "c" }],
      },
    },
    ...settings,
  });
}

/** @spec SCORM 2004 4th Ed. RTE 4.4; SN Book: NB.2.1 - validity belongs to the delivered activity across SCO resets. */
function expectFirstActivityValidity(api: Scorm2004API): void {
  expect(api.getSequencingState().currentActivity?.id).toBe("a");
  expect(api.adl.nav.request_valid.continue).toBe("true");
  expect(api.adl.nav.request_valid.previous).toBe("false");
  expect(api.adl.nav.request_valid.choice._isTargetValid("b")).toBe("true");
  expect(api.adl.nav.request_valid.jump._isTargetValid("b")).toBe("true");
  expect(api.adl.nav.sequencing).toBe(api.adl.sequencing);
  expect(api.adl.sequencing?.adlNav).toBe(api.adl.nav);

  expect(api.Initialize("")).toBe("true");
  expect(api.GetValue("adl.nav.request_valid.continue")).toBe("true");
  expect(api.GetValue("adl.nav.request_valid.previous")).toBe("false");
  expect(api.GetValue("adl.nav.request_valid.choice.{target=b}")).toBe("true");
  expect(api.GetValue("adl.nav.request_valid.jump.{target=b}")).toBe("true");
}

/** @spec SCORM 2004 4th Ed. RTE 4.4; SN Book: NB.2.1 - LMS navigation validity survives per-SCO reset. */
describe("reset navigation validity (RTE 4.4 / NB.2.1)", () => {
  /** @spec SCORM 2004 4th Ed. RTE 4.4; SN Book: NB.2.1 - recompute validity and notify the LMS after reset. */
  it("recomputes validity after Start and reset (RTE 4.4 / NB.2.1)", () => {
    const api = createApi();
    const onNavigationValidityUpdate = vi.fn();
    api.setSequencingEventListeners({ onNavigationValidityUpdate });
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    const nav = api.adl.nav;
    const requestValid = nav.request_valid;
    onNavigationValidityUpdate.mockClear();

    api.reset();

    expect(api.adl.nav).toBe(nav);
    expect(api.adl.nav.request_valid).toBe(requestValid);
    expect(onNavigationValidityUpdate).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ continue: true, previous: false }),
    );
    expectFirstActivityValidity(api);
  });

  /** @spec SN Book: SB.2.6; NB.2.1; SCORM 2004 4th Ed. RTE 4.4 - restored sequencing owns post-reset validity. */
  it("recomputes validity after save/load, Resume All and reset (SB.2.6 / RTE 4.4 / NB.2.1)", async () => {
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
    const original = createApi(settings);
    expect(original.processNavigationRequest("start")).toBe(true);
    expect(original.Initialize("")).toBe("true");
    expect(original.SetValue("cmi.exit", "suspend")).toBe("true");
    expect(original.SetValue("adl.nav.request", "suspendAll")).toBe("true");
    expect(original.Terminate("")).toBe("true");
    expect(await original.saveSequencingState()).toBe(true);
    loadState.mockResolvedValue(saveState.mock.calls[0]![0]);

    const restored = createApi(settings);
    expect(await restored.loadSequencingState()).toBe(true);
    expect(restored.processNavigationRequest("resumeAll")).toBe(true);
    const onNavigationValidityUpdate = vi.fn();
    restored.setSequencingEventListeners({ onNavigationValidityUpdate });

    restored.reset();

    expect(onNavigationValidityUpdate).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ continue: true, previous: false }),
    );
    expectFirstActivityValidity(restored);
  });

  /** @spec SN Book: SB.2.7; NB.2.1; SCORM 2004 4th Ed. RTE 4.4 - a later delivery refreshes the same ADL object. */
  it("keeps validity connected through successive deliveries and resets (SB.2.7 / NB.2.1)", () => {
    const api = createApi();
    expect(api.processNavigationRequest("start")).toBe(true);
    api.reset();
    expectFirstActivityValidity(api);
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("b");

    api.reset();

    expect(api.adl.nav.request_valid.continue).toBe("true");
    expect(api.adl.nav.request_valid.previous).toBe("true");
    expect(api.Initialize("")).toBe("true");
    expect(api.GetValue("adl.nav.request_valid.previous")).toBe("true");
  });

  /** @spec SCORM 2004 4th Ed. RTE 4.4 - retain unknown when no sequencing delivery determines validity. */
  it.each([false, true])(
    "keeps unknown without a current activity, sequencing=%s (RTE 4.4)",
    (sequencing) => {
      // @spec SCORM 2004 4th Ed. RTE 4.4 - cover both unconfigured and configured-but-not-started navigation.
      const api = sequencing ? createApi() : new Scorm2004API({ logLevel: 5 });
      api.adl.nav.request_valid.continue = "true";
      api.adl.nav.request_valid.previous = "true";
      api.adl.nav.request_valid.choice = { "{target=b}": "true" };
      api.adl.nav.request_valid.jump = { "{target=b}": "true" };

      api.reset();

      expect(api.adl.nav.request_valid.continue).toBe("unknown");
      expect(api.adl.nav.request_valid.previous).toBe("unknown");
      expect(api.adl.nav.request_valid.choice._isTargetValid("b")).toBe("unknown");
      expect(api.adl.nav.request_valid.jump._isTargetValid("b")).toBe("unknown");
    },
  );
});
