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
    launch: {
      student_data: {
        mastery_score: "80",
        max_time_allowed: "01:00:00",
        time_limit_action: "exit,message",
      },
    },
    launchValues: {
      "cmi.student_data.mastery_score": "80",
      "cmi.student_data.max_time_allowed": "01:00:00",
      "cmi.student_data.time_limit_action": "exit,message",
    },
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
    launch: {
      scaled_passing_score: "0.8",
      completion_threshold: "0.7",
      max_time_allowed: "PT1H",
      time_limit_action: "exit,message",
      launch_data: "outgoing",
    },
    launchValues: {
      "cmi.scaled_passing_score": "0.8",
      "cmi.completion_threshold": "0.7",
      "cmi.max_time_allowed": "PT1H",
      "cmi.time_limit_action": "exit,message",
      "cmi.launch_data": "outgoing",
    },
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

  it.each([undefined, {}, { clearLaunchData: false }])(
    "preserves launch data by default with options %j",
    (options) => {
      const api = config.create();
      api.loadFromJSON({ cmi: config.launch });
      expect(api.lmsInitialize()).toBe("true");
      api.reset(undefined, options);
      expect(api.lmsInitialize()).toBe("true");
      for (const [field, value] of Object.entries(config.launchValues)) {
        expect(api.lmsGetValue(field), field).toBe(value);
      }
    },
  );

  it("clears launch data to fresh defaults and accepts new host launch data", () => {
    const fresh = config.create();
    expect(fresh.lmsInitialize()).toBe("true");
    const api = config.create();
    api.loadFromJSON({ cmi: config.launch });
    expect(api.lmsInitialize()).toBe("true");
    api.reset(undefined, { clearLaunchData: true });
    expect(api.settings).not.toHaveProperty("clearLaunchData");
    expect(api.lmsInitialize()).toBe("true");
    for (const field of Object.keys(config.launchValues)) {
      expect(api.lmsGetValue(field), field).toBe(fresh.lmsGetValue(field));
    }

    api.reset(undefined, { clearLaunchData: true });
    api.loadFromJSON({ cmi: config.launch });
    expect(api.lmsInitialize()).toBe("true");
    for (const [field, value] of Object.entries(config.launchValues)) {
      expect(api.lmsGetValue(field), field).toBe(value);
    }
  });

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

describe("SCORM 2004 clearing launch data with sequencing", () => {
  it("reapplies the current activity completion threshold after clearing", () => {
    const api = new Scorm2004API({
      logLevel: 5,
      sequencing: {
        activityTree: {
          id: "root",
          sequencingControls: { flow: true },
          children: [
            {
              id: "sco",
              completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.5 },
            },
          ],
        },
      },
    });
    api.loadFromJSON({ cmi: { completion_threshold: "0.9", launch_data: "outgoing" } });
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    api.reset(undefined, { clearLaunchData: true });
    expect(api.cmi.completion_threshold).toBe("0.5");
    expect(api.Initialize("")).toBe("true");
    expect(api.GetValue("cmi.completion_threshold")).toBe("0.5");
    expect(api.GetValue("cmi.launch_data")).toBe("");
  });
});
