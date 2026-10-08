import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

function fixture() {
  const events: string[] = [];
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: {
        id: "root",
        sequencingControls: { flow: true, choice: true },
        children: [{ id: "a" }, { id: "b" }],
      },
      eventListeners: {
        onActivityUnload: (activity) => events.push(`unload:${activity.id}`),
        onActivityDelivery: (activity) => events.push(`deliver:${activity.id}`),
      },
    },
  });
  return { api, events };
}

function start() {
  const context = fixture();
  expect(context.api.processNavigationRequest("start")).toBe(true);
  expect(context.events).toEqual(["deliver:a"]);
  expect(context.api.Initialize("")).toBe("true");
  context.events.length = 0;
  return context;
}

function terminate(api: Scorm2004API, exit: string, request?: string) {
  expect(api.SetValue("cmi.exit", exit)).toBe("true");
  if (request) expect(api.SetValue("adl.nav.request", request)).toBe("true");
  expect(api.Terminate("")).toBe("true");
}

function expectDelivery(api: Scorm2004API, id: string, attemptCount: number, resumed: boolean) {
  expect(api.getSequencingState().currentActivity).toMatchObject({
    id,
    attemptCount,
    deliveryWasResumed: resumed,
  });
}

/** @spec SCORM 2004 4th Ed. SN DB.2: launch every delivery, including resumed
 * attempts; SCORM 2004 4th Ed. RTE 4.2.7: resumed launches have entry=resume. */
describe("DB.2 resumed host redelivery", () => {
  for (const target of ["a", "root"]) {
    it(`unloads and redelivers the suspended attempt on Terminate Choice to ${target}`, () => {
      const { api, events } = start();
      terminate(api, "suspend", `{target=${target}}choice`);
      expect(events).toEqual(["unload:a", "deliver:a"]);
      expectDelivery(api, "a", 1, true);
    });
  }

  it("unloads and redelivers a suspended attempt on host Choice after Terminate", () => {
    const { api, events } = start();
    terminate(api, "suspend");
    expect(events).toEqual([]);
    expect(api.getSequencingService()!.processNavigationRequest("choice", "a")).toBe(true);
    expect(events).toEqual(["unload:a", "deliver:a"]);
    expectDelivery(api, "a", 1, true);
  });

  it("unloads and delivers attempt 2 on normal-exit Choice to self", () => {
    const { api, events } = start();
    terminate(api, "", "{target=a}choice");
    expect(events).toEqual(["unload:a", "deliver:a"]);
    expectDelivery(api, "a", 2, false);
  });

  it("delivers b then resumes suspended a with one unload and delivery each", () => {
    const { api, events } = start();
    terminate(api, "suspend", "{target=b}choice");
    expect(events).toEqual(["unload:a", "deliver:b"]);
    expectDelivery(api, "b", 1, false);
    api.reset();
    expect(api.Initialize("")).toBe("true");
    events.length = 0;
    terminate(api, "suspend", "{target=a}choice");
    expect(events).toEqual(["unload:b", "deliver:a"]);
    expectDelivery(api, "a", 1, true);
  });

  it("delivers exactly once on Resume All in a fresh restored API", () => {
    const { api } = start();
    terminate(api, "suspend", "suspendAll");
    const restored = fixture();
    expect(restored.api.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
    expect(restored.api.processNavigationRequest("resumeAll")).toBe(true);
    expect(restored.events).toEqual(["deliver:a"]);
    expectDelivery(restored.api, "a", 1, true);
  });
});
