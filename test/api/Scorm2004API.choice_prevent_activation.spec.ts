import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { NavigationValidityUpdate, ActivitySettings } from "../../src/types/sequencing_types";

const leaf = (n: number) => ({ id: `activity_${n}`, title: `Activity ${n}` });
const cm17: ActivitySettings = {
  id: "CM-17a",
  title: "CM-17a",
  children: [
    leaf(1),
    {
      ...leaf(2),
      sequencingControls: { flow: true, preventActivation: true },
      children: [
        leaf(3),
        {
          ...leaf(4),
          sequencingControls: { flow: true, preventActivation: true },
          children: [leaf(5), leaf(6)],
        },
        leaf(7),
      ],
    },
    leaf(8),
  ],
};
const cm16: ActivitySettings = {
  id: "CM-16",
  title: "CM-16",
  sequencingControls: { constrainChoice: true },
  children: [leaf(1), leaf(2), leaf(3)],
};

// CM-07d: IDRef supplies both controls on 13 and 16. The local
// constrainedChoiceConsiderations elements on 11 and 12 override that element:
// 11 has constrainChoice only; 12 has preventActivation only.
const shared = { constrainChoice: true, preventActivation: true };
const cm07: ActivitySettings = {
  id: "CM-07d",
  title: "CM-07d",
  sequencingControls: { flow: true, choice: false },
  children: [
    { ...leaf(1), sequencingControls: { flow: true }, children: [leaf(2), leaf(3)] },
    {
      ...leaf(4),
      sequencingControls: { constrainChoice: true },
      children: [
        { ...leaf(5), children: [leaf(6), { ...leaf(7), sequencingControls: { choice: false } }] },
        leaf(8),
      ],
    },
    {
      ...leaf(9),
      sequencingControls: { flow: true, constrainChoice: true },
      children: [
        leaf(10),
        {
          ...leaf(11),
          sequencingControls: { constrainChoice: true, flow: true },
          children: [
            {
              ...leaf(12),
              sequencingControls: { preventActivation: true, flow: true },
              children: [{ ...leaf(13), sequencingControls: shared }, leaf(14)],
            },
            leaf(15),
          ],
        },
      ],
    },
    { ...leaf(16), sequencingControls: { ...shared, flow: true }, children: [leaf(17), leaf(18)] },
  ],
};
function session(activityTree: ActivitySettings) {
  const delivered: string[] = [];
  const validity: NavigationValidityUpdate[] = [];
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree,
      eventListeners: {
        onActivityDelivery: (activity) => delivered.push(activity.id),
        onNavigationValidityUpdate: (update) => validity.push(update),
      },
    },
  });
  const valid = (answers: Record<number, boolean>) => {
    for (const [id, answer] of Object.entries(answers)) {
      expect(
        api.GetValue(`adl.nav.request_valid.choice.{target=activity_${id}}`),
        `choice ${id}`,
      ).toBe(String(answer));
      const probe = session(activityTree);
      expect(probe.api.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
      expect(probe.api.processNavigationRequest("choice", `activity_${id}`)).toBe(answer);
    }
  };
  const terminate = (request?: string) => {
    expect(api.SetValue("cmi.exit", "normal")).toBe("true");
    if (request) expect(api.SetValue("adl.nav.request", request)).toBe("true");
    expect(api.Terminate("")).toBe("true");
  };
  const initialize = () => {
    api.reset();
    expect(api.Initialize("")).toBe("true");
  };
  return { api, delivered, validity, valid, terminate, initialize };
}

describe("ADL choice activation regressions (#1797)", () => {
  /** @spec ADL CM-17a manifest and Act8V1 through Act5V2 UIQ/UIA and commands. */
  it("delivers the full CM-17a script with the ADL choice validity answers", () => {
    const { api, delivered, valid, terminate, initialize } = session(cm17);
    const root = api.getSequencingState().rootActivity!;
    expect(root.sequencingControls.preventActivation).toBe(false);
    const cluster = root.children[1]!;
    for (const activity of [cluster, cluster.children[1]!]) {
      expect(activity.sequencingControls.preventActivation).toBe(true);
      expect(activity.sequencingControls.flow).toBe(true);
    }
    api.processNavigationRequest("choice", "activity_8");
    expect(api.Initialize("")).toBe("true");
    valid({ 1: true, 4: false, 6: false });
    terminate("{target=activity_2}choice");
    expect(delivered).toEqual(["activity_8", "activity_3"]);
    initialize();
    valid({ 1: true, 2: true, 6: false, 4: true, 5: false });
    terminate("{target=activity_4}choice");
    expect(delivered).toEqual(["activity_8", "activity_3", "activity_5"]);
    initialize();
    valid({ 2: true, 6: true, 7: true });
    terminate("{target=activity_8}choice");
    initialize();
    valid({ 1: true, 3: false, 5: false });
    terminate("{target=activity_5}jump");
    initialize();
    terminate();
    api.processNavigationRequest("exit");
    expect(delivered).toEqual([
      "activity_8",
      "activity_3",
      "activity_5",
      "activity_8",
      "activity_5",
    ]);
  });

  /** @spec ADL CM-17a Act3V1: active Activity 2 is selectable; inactive Activity 4 protects Activity 5. */
  it("allows choosing the active common ancestor but refuses its protected descendant", () => {
    const { api, delivered, initialize, valid, terminate } = session(cm17);
    api.processNavigationRequest("choice", "activity_8");
    expect(api.Initialize("")).toBe("true");
    terminate("{target=activity_2}choice");
    initialize();
    valid({ 2: true, 5: false });
    api.processNavigationRequest("choice", "activity_5");
    expect(delivered).toEqual(["activity_8", "activity_3"]);
    terminate("{target=activity_2}choice");
    expect(delivered).toEqual(["activity_8", "activity_3", "activity_3"]);
  });

  /** @spec ADL CM-16 Act2V1, Act2V2, Act3V1, Act1V1 including suspend/relaunch. */
  it.each([true, false])("allows CM-16 choices with suspend/resume=%s", (suspend) => {
    let { api, delivered, valid, terminate, initialize } = session(cm16);
    expect(api.getSequencingState().rootActivity!.sequencingControls.constrainChoice).toBe(true);
    api.processNavigationRequest("choice", "activity_2");
    expect(api.Initialize("")).toBe("true");
    if (suspend) {
      terminate("suspendAll");
      const state = api.serializeSequencingState();
      const priorDeliveries = [...delivered];
      ({ api, delivered, valid, terminate, initialize } = session(cm16));
      expect(api.deserializeSequencingState(state)).toBe(true);
      expect(api.processNavigationRequest("resumeAll")).toBe(true);
      delivered.unshift(...priorDeliveries);
      initialize();
    }
    valid({ 3: true });
    terminate("{target=activity_3}choice");
    expect(delivered.at(-1)).toBe("activity_3");
    initialize();
    valid({ 1: true });
    terminate("{target=activity_1}choice");
    initialize();
    terminate();
    api.processNavigationRequest("exit");
    expect(delivered).toEqual(
      suspend
        ? ["activity_2", "activity_2", "activity_3", "activity_1"]
        : ["activity_2", "activity_3", "activity_1"],
    );
  });
});

it("ports every CM-07d delivery and UIA answer", () => {
  const tree: ActivitySettings = cm07;
  const { api, delivered, terminate, initialize } = session(tree);
  api.processNavigationRequest("start");
  expect(api.Initialize("")).toBe("true");
  const steps = [
    { delivery: "activity_2", answers: {}, action: "Choice~Activity 3" },
    {
      delivery: "activity_3",
      answers: {
        activity_7: true,
        activity_10: true,
        root: true,
        activity_13: false,
        activity_18: false,
        continue: true,
        previous: true,
      },
      action: "Choice~Activity 6",
    },
    {
      delivery: "activity_6",
      answers: {
        activity_3: true,
        activity_15: true,
        root: true,
        activity_13: false,
        activity_18: false,
      },
      action: "Choice~Activity 10",
    },
    {
      delivery: "activity_10",
      answers: { activity_2: false, activity_7: true, activity_13: false, activity_18: false },
      action: "Continue",
    },
    {
      delivery: "activity_13",
      answers: {
        activity_3: false,
        activity_7: false,
        activity_13: true,
        activity_10: true,
        activity_14: true,
        activity_18: false,
      },
      action: "Choice~Activity 15",
    },
    {
      delivery: "activity_15",
      answers: { activity_7: false, activity_10: true, activity_18: false },
      action: "Continue",
    },
    {
      delivery: "activity_17",
      answers: {
        activity_2: false,
        activity_6: false,
        activity_10: true,
        activity_14: false,
        activity_18: true,
      },
      action: "Exit",
    },
  ];
  for (const [index, step] of steps.entries()) {
    expect(delivered).toEqual(steps.slice(0, index + 1).map((s) => s.delivery));
    for (const [target, answer] of Object.entries(step.answers)) {
      const id = target === "root" ? tree.id : target;
      const property =
        target === "continue" || target === "previous" ? target : `choice.{target=${id}}`;
      expect(api.GetValue(`adl.nav.request_valid.${property}`), `${step.delivery}: ${target}`).toBe(
        String(answer),
      );
      if (property.startsWith("choice")) {
        const probe = session(tree);
        expect(probe.api.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
        expect(
          probe.api.processNavigationRequest("choice", id),
          `${step.delivery}: actual ${target}`,
        ).toBe(answer);
      }
    }
    const [action, title] = step.action.split("~");
    if (action === "Choice") terminate(`{target=activity_${title!.split(" ")[1]}}choice`);
    else if (action === "Continue") terminate("continue");
    else {
      terminate();
      api.processNavigationRequest("exit");
    }
    if (index < steps.length - 1) initialize();
  }
  expect(delivered).toEqual(steps.map((s) => s.delivery));
});

it("ports every CM-17b delivery and UIA answer", () => {
  const tree: ActivitySettings = { ...cm17, id: "CM-17b", title: "CM-17b" };
  const { api, delivered, terminate, initialize } = session(tree);
  api.processNavigationRequest("choice", "activity_2");
  expect(api.Initialize("")).toBe("true");
  const steps = [
    {
      delivery: "activity_3",
      answers: { activity_1: true, activity_4: true, activity_6: false },
      action: "Continue",
    },
    {
      delivery: "activity_5",
      answers: { activity_1: true, activity_2: true, activity_6: true },
      action: "Choice~Activity 7",
    },
    { delivery: "activity_7", answers: { activity_2: true, activity_6: false }, action: "Exit" },
  ];
  for (const [index, step] of steps.entries()) {
    expect(delivered).toEqual(steps.slice(0, index + 1).map((s) => s.delivery));
    for (const [target, answer] of Object.entries(step.answers)) {
      const id = target === "root" ? tree.id : target;
      const property =
        target === "continue" || target === "previous" ? target : `choice.{target=${id}}`;
      expect(api.GetValue(`adl.nav.request_valid.${property}`), `${step.delivery}: ${target}`).toBe(
        String(answer),
      );
      if (property.startsWith("choice")) {
        const probe = session(tree);
        expect(probe.api.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
        expect(
          probe.api.processNavigationRequest("choice", id),
          `${step.delivery}: actual ${target}`,
        ).toBe(answer);
      }
    }
    const [action, title] = step.action.split("~");
    if (action === "Choice") terminate(`{target=activity_${title!.split(" ")[1]}}choice`);
    else if (action === "Continue") terminate("continue");
    else {
      terminate();
      api.processNavigationRequest("exit");
    }
    if (index < steps.length - 1) initialize();
  }
  expect(delivered).toEqual(steps.map((s) => s.delivery));
});

describe("request_valid agrees with preventActivation choice delivery", () => {
  it.each([false, true])(
    "refuses an attempted descendant after its cluster becomes inactive (exit=%s)",
    (exit) => {
      const { api, delivered, validity, terminate, initialize } = session(cm17);
      expect(api.processNavigationRequest("choice", "activity_2")).toBe(true);
      expect(api.Initialize("")).toBe("true");
      terminate("{target=activity_8}choice");
      initialize();
      expect(validity.at(-1)!.choice.activity_3).toBe("false");
      if (exit) expect(api.processNavigationRequest("exit")).toBe(true);
      const cluster = api.getSequencingState().rootActivity!.children[1]!;
      expect(cluster.isActive).toBe(false);
      expect(cluster.children[0]!.attemptCount).toBeGreaterThan(0);
      expect(api.GetValue("adl.nav.request_valid.choice.{target=activity_3}")).toBe("false");
      const before = [...delivered];
      expect(api.processNavigationRequest("choice", "activity_3")).toBe(false);
      expect(delivered).toEqual(before);
    },
  );

  it("delivers a descendant under an active preventActivation cluster", () => {
    const { api, delivered, validity } = session(cm17);
    expect(api.processNavigationRequest("choice", "activity_2")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    expect(api.getSequencingState().rootActivity!.children[1]!.isActive).toBe(true);
    expect(validity.at(-1)!.choice.activity_7).toBe("true");
    expect(api.GetValue("adl.nav.request_valid.choice.{target=activity_7}")).toBe("true");
    expect(api.processNavigationRequest("choice", "activity_7")).toBe(true);
    expect(delivered.at(-1)).toBe("activity_7");
  });

  it("keeps the inactive flagged cluster itself selectable", () => {
    const { api, delivered, validity } = session(cm17);
    expect(api.processNavigationRequest("choice", "activity_8")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    expect(api.getSequencingState().rootActivity!.children[1]!.isActive).toBe(false);
    expect(validity.at(-1)!.choice.activity_2).toBe("true");
    expect(api.GetValue("adl.nav.request_valid.choice.{target=activity_2}")).toBe("true");
    expect(api.processNavigationRequest("choice", "activity_2")).toBe(true);
    expect(delivered.at(-1)).toBe("activity_3");
  });
});
