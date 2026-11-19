import { expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

const leaf = (n: number) => ({ id: `activity_${n}`, title: `Activity ${n}` });
const tree = {
  id: "RU-07c",
  title: "RU-07c",
  sequencingControls: { choice: false, flow: true },
  sequencingRules: {
    exitConditionRules: [
      { action: "exit", conditionCombination: "all", conditions: [{ condition: "completed" }] },
    ],
    postConditionRules: [
      {
        action: "retry",
        conditionCombination: "all",
        conditions: [{ condition: "satisfied", operator: "not" }],
      },
    ],
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      sequencingControls: { choice: false, flow: true, rollupProgressCompletion: false },
      sequencingRules: {
        preConditionRules: [
          {
            action: "skip",
            conditionCombination: "all",
            conditions: [{ condition: "attemptLimitExceeded" }],
          },
        ],
      },
      attemptLimit: 2,
      rollupConsiderations: { requiredForSatisfied: "ifNotSkipped" },
      children: [leaf(2), leaf(3), leaf(4)],
    },
    leaf(5),
    {
      ...leaf(6),
      sequencingControls: { rollupProgressCompletion: false, rollupObjectiveSatisfied: false },
    },
  ],
};

// Script: per visit, the SetValue steps (nav request last before exit, exit normal)
const script: Record<string, [string, string][]> = {
  Act2V1: [
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act3V1: [
    ["cmi.success_status", "failed"],
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act4V1: [
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act5V1: [
    ["cmi.success_status", "passed"],
    ["cmi.completion_status", "completed"],
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act2V2: [
    ["cmi.success_status", "failed"],
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act3V2: [
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act4V2: [
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act5V2: [
    ["cmi.success_status", "failed"],
    ["cmi.completion_status", "completed"],
    ["adl.nav.request", "continue"],
    ["cmi.exit", "normal"],
  ],
  Act5V3: [["cmi.exit", "normal"]],
};
const expected = [
  "Act2V1",
  "Act3V1",
  "Act4V1",
  "Act5V1",
  "Act2V2",
  "Act3V2",
  "Act4V2",
  "Act5V2",
  "Act5V3",
];

/** @spec SCORM 2004 4th Ed. SN UP.1 / DB.1.1: active ancestor attempts do not block delivery.
 * ADL LMSTestPackage_RU-07c/imsmanifest.xml and TestCases/RU-07c.properties.
 */
it("delivers the complete RU-07c script through the active cluster's final attempt", () => {
  const delivered: string[] = [];
  const errors: string[] = [];
  const visits: Record<string, number> = {};
  let pending: string | null = null;
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: tree,
      eventListeners: {
        onActivityDelivery: (activity) => {
          pending = activity.id;
        },
        onSequencingError: (error, context) => errors.push(`${error}@${context}`),
      },
    },
  });
  const builtTree = api._sequencing!.activityTree;
  const root = builtTree.root!;
  const cluster = builtTree.getActivity("activity_1")!;
  expect(root.sequencingControls).toMatchObject({ flow: true, choice: false });
  expect(root.sequencingRules.exitConditionRules).toMatchObject([
    { action: "exit", conditions: [{ condition: "completed" }] },
  ]);
  expect(root.sequencingRules.postConditionRules).toMatchObject([
    { action: "retry", conditions: [{ condition: "satisfied", operator: "not" }] },
  ]);
  expect(cluster.sequencingRules.preConditionRules).toMatchObject([
    { action: "skip", conditions: [{ condition: "attemptLimitExceeded" }] },
  ]);
  expect(cluster.attemptLimit).toBe(2);
  expect(cluster.sequencingControls).toMatchObject({
    flow: true,
    choice: false,
    rollupProgressCompletion: false,
  });
  expect(cluster.requiredForSatisfied).toBe("ifNotSkipped");
  expect(builtTree.getActivity("activity_6")!.sequencingControls).toMatchObject({
    rollupProgressCompletion: false,
    rollupObjectiveSatisfied: false,
  });

  expect(api.processNavigationRequest("start")).toBe(true);
  for (let guard = 0; guard < 12 && pending; guard++) {
    const number = (pending as string).replace("activity_", "");
    visits[number] = (visits[number] ?? 0) + 1;
    const key = `Act${number}V${visits[number]}`;
    delivered.push(key);
    pending = null;
    if (guard > 0) api.reset();
    expect(api.Initialize(""), key).toBe("true");
    expect(script[key], key).toBeDefined();
    for (const [element, value] of script[key]!) {
      expect(api.SetValue(element, value), `${key}: ${element}`).toBe("true");
      expect(api.GetLastError()).toBe("0");
    }
    expect(api.Terminate(""), key).toBe("true");
    expect(api.GetLastError()).toBe("0");
  }
  expect(delivered).toEqual(expected);
  expect(errors).toEqual([]);
});
