import { describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";

const apis = [
  {
    version: "SCORM 1.2",
    create: () => new Scorm12API({ logLevel: 5 }),
    event: "LMSSetValue.cmi.core.lesson_location",
    location: "cmi.core.lesson_location",
    totalTime: "cmi.core.total_time",
    seed: { cmi: { core: { total_time: "00:00:12" } } },
    savedTime: "00:00:12",
    zeroTime: "00:00:00",
  },
  {
    version: "SCORM 2004",
    create: () => new Scorm2004API({ logLevel: 5 }),
    event: "SetValue.cmi.location",
    location: "cmi.location",
    totalTime: "cmi.total_time",
    seed: { cmi: { total_time: "PT12S" } },
    savedTime: "PT12S",
    zeroTime: "PT0S",
  },
];

describe.each(apis)("$version reset options", (config) => {
  it.each([undefined, {}, { preserveListeners: false, resetTotalTime: false }])(
    "keeps the existing defaults with options %j",
    (options) => {
      const api = config.create();
      const listener = vi.fn();
      api.on(config.event, listener);
      api.loadFromJSON(config.seed);
      expect(api.lmsInitialize()).toBe("true");
      expect(api.lmsSetValue(config.location, "first")).toBe("true");

      api.reset(undefined, options);
      expect(api.lmsInitialize()).toBe("true");
      expect(api.lmsSetValue(config.location, "second")).toBe("true");
      expect(listener).toHaveBeenCalledTimes(1);
      expect(api.lmsGetValue(config.totalTime)).toBe(config.savedTime);
    },
  );

  it.each([
    { preserveListeners: true, resetTotalTime: false },
    { preserveListeners: false, resetTotalTime: true },
    { preserveListeners: true, resetTotalTime: true },
  ])("applies independent reset options %j", (options) => {
    const api = config.create();
    const listener = vi.fn();
    api.on(config.event, listener);
    api.loadFromJSON(config.seed);
    expect(api.lmsInitialize()).toBe("true");
    expect(api.lmsSetValue(config.location, "first")).toBe("true");

    api.reset({ scoId: "second" }, options);
    expect(api.isNotInitialized()).toBe(true);
    expect(api.settings.scoId).toBe("second");
    expect(api.settings).not.toHaveProperty("preserveListeners");
    expect(api.settings).not.toHaveProperty("resetTotalTime");
    expect(api.lmsInitialize()).toBe("true");
    expect(api.lmsSetValue(config.location, "second")).toBe("true");
    expect(listener).toHaveBeenCalledTimes(options.preserveListeners ? 2 : 1);
    expect(api.lmsGetValue(config.totalTime)).toBe(
      options.resetTotalTime ? config.zeroTime : config.savedTime,
    );

    // Options apply to one call; a later ordinary reset keeps its existing contract.
    api.reset();
    expect(api.lmsInitialize()).toBe("true");
    expect(api.lmsSetValue(config.location, "third")).toBe("true");
    expect(listener).toHaveBeenCalledTimes(options.preserveListeners ? 2 : 1);
  });
});

describe("SCORM 2004 SCO transitions", () => {
  it("preserves listeners and sequencing while separating SCO total times (#1700)", () => {
    const deliveries: string[] = [];
    const api = new Scorm2004API({
      logLevel: 5,
      sequencing: {
        activityTree: {
          id: "course",
          sequencingControls: { flow: true },
          children: [{ id: "sco1" }, { id: "sco2" }],
        },
        eventListeners: { onActivityDelivery: (activity) => deliveries.push(activity.id) },
      },
    });
    const listener = vi.fn();
    api.on("SetValue.cmi.location", listener);
    expect(api.processNavigationRequest("start")).toBe(true);
    const root = api.getSequencingState().rootActivity;
    expect(api.Initialize("")).toBe("true");
    expect(api.SetValue("cmi.location", "first")).toBe("true");
    expect(api.SetValue("cmi.session_time", "PT12S")).toBe("true");
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    expect(api.cmi.total_time).toBe("PT12S");

    api.reset(undefined, { preserveListeners: true, resetTotalTime: true });
    expect(api.cmi.total_time).toBe("PT0S");
    expect(api.getSequencingState().rootActivity).toBe(root);
    expect(api.getSequencingState().currentActivity.id).toBe("sco2");
    // An LMS can still seed the incoming SCO's own previously saved total.
    api.loadFromJSON({ cmi: { total_time: "PT7S" } });
    expect(api.Initialize("")).toBe("true");
    expect(api.GetValue("cmi.total_time")).toBe("PT7S");
    expect(api.SetValue("cmi.location", "second")).toBe("true");
    expect(api.SetValue("cmi.session_time", "PT3S")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    expect(api.cmi.total_time).toBe("PT10S");
    expect(listener.mock.calls).toEqual([
      ["cmi.location", "first"],
      ["cmi.location", "second"],
    ]);
    expect(deliveries).toEqual(["sco1", "sco2"]);
  });
});
