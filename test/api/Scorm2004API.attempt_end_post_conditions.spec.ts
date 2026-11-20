import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { ActivitySettings } from "../../src/types/sequencing_types";
const leaf = (n: number, extra: any = {}) => ({
  id: `activity_${n}`,
  title: `Activity ${n}`,
  sequencingControls: { flow: false },
  ...extra,
});
const sco = (n: number, extra: any = {}) =>
  leaf(n, { hideLmsUi: ["continue", "previous", "suspendAll"], ...extra });
const cond = (condition: string, operator?: string, referencedObjective?: string) => ({
  condition,
  ...(operator ? { operator } : {}),
  ...(referencedObjective ? { referencedObjective } : {}),
});
const rule = (action: string, conditions: any[], conditionCombination = "all") => ({
  action,
  conditions,
  conditionCombination,
});
const flow = { choice: false, flow: true };
const roll = (
  condition: string,
  action: string,
  operator?: string,
  consideration = "all",
  minimumPercent?: number,
) => ({
  rules: [{ action, conditions: [cond(condition, operator)], consideration, minimumPercent }],
});
const obj = (objectiveID: string, target?: string, write = false) => ({
  objectiveID,
  ...(target
    ? {
        mapInfo: [
          {
            targetObjectiveID: target,
            ...(write
              ? {
                  readNormalizedMeasure: false,
                  readSatisfiedStatus: false,
                  writeSatisfiedStatus: true,
                }
              : {}),
          },
        ],
      }
    : {}),
});
const cluster = (id: string) => ({ id, title: id, sequencingControls: flow });
// CO-12d has adlseq:mapInfo only, with no imsss:mapInfo. The unified API map
// must disable IMS satisfaction/measure reads while retaining the ADL defaults.
const primary = (target: string, flags: any = {}): any => ({
  objectiveID: "PRIMARYOBJ",
  mapInfo: [
    {
      targetObjectiveID: target,
      readCompletionStatus: true,
      readProgressMeasure: true,
      readSatisfiedStatus: false,
      readNormalizedMeasure: false,
      readRawScore: true,
      readMinScore: true,
      readMaxScore: true,
      ...flags,
    },
  ],
});

const ru13d: ActivitySettings = {
  ...cluster("RU-13d"),
  primaryObjective: obj("PRIMARYOBJ", "gObj-RU13d-1"),
  sequencingRules: { postConditionRules: [rule("retry", [cond("satisfied", "not")])] },
  children: [
    {
      ...leaf(1),
      sequencingControls: flow,
      primaryObjective: obj(""),
      objectives: [obj("obj1", "gObj-RU13d-1")],
      sequencingRules: {
        preConditionRules: [
          rule("skip", [cond("attempted"), cond("objectiveStatusKnown", "not", "obj1")]),
        ],
        postConditionRules: [rule("exitParent", [cond("satisfied")])],
      },
      rollupRules: roll("satisfied", "satisfied", undefined, "atLeastPercent", 0.4),
      children: [
        sco(2, {
          primaryObjective: obj(""),
          objectives: [obj("obj1", "gObj-RU13d-2")],
          sequencingRules: {
            preConditionRules: [
              rule(
                "skip",
                [cond("objectiveStatusKnown", "not", "obj1"), cond("satisfied", "not", "obj1")],
                "any",
              ),
            ],
          },
        }),
        sco(3),
        sco(4, {
          primaryObjective: obj(""),
          objectives: [obj("obj1", "gObj-RU13d-1", true), obj("obj2", "gObj-RU13d-2", true)],
          sequencingRules: { postConditionRules: [rule("exitParent", [cond("always")])] },
        }),
        leaf(5),
      ],
    },
    sco(6),
  ],
};
const co12d: ActivitySettings = {
  id: "CO-12d",
  title: "CO-12d",
  sequencingControls: flow,
  children: [
    {
      ...leaf(1),
      sequencingControls: flow,
      completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.7 },
      primaryObjective: primary("gObj-CO12d"),
      sequencingRules: {
        exitConditionRules: [
          {
            conditions: [{ condition: "completed" }, { condition: "satisfied" }],
            conditionCombination: "any",
            action: "exit",
          },
        ],
        postConditionRules: [
          rule("retry", [cond("completed", "not")]),
          rule("continue", [cond("completed")]),
        ],
      },
      children: [
        {
          ...sco(2),
          primaryObjective: primary("gObj-CO12d", {
            readCompletionStatus: false,
            readProgressMeasure: false,
            writeProgressMeasure: true,
          }),
          completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.5 },
        },
        sco(3),
      ],
    },
    sco(4),
  ],
};

function replay(tree: ActivitySettings) {
  const delivered: string[] = [];
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: tree,
      eventListeners: {
        onActivityDelivery: (a) => delivered.push(a.id),
      },
    },
  });
  api.processNavigationRequest("start");
  const visit = (values: Record<string, string> = {}) => {
    expect(api.Initialize("")).toBe("true");
    for (const [element, value] of Object.entries(values))
      expect(api.SetValue(element, value)).toBe("true");
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.SetValue("cmi.exit", "normal")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    api.reset();
  };
  return { api, delivered, visit };
}

describe("ADL attempt-end post-conditions", () => {
  /**
   * @spec ADL RU-13d manifest and Act3V1 / Act4V1 commands.
   * @spec SN TB.2.3 3.3.4.1.1-3 / TB.2.2: each Exit Parent ends the parent
   * attempt (UP.4 / RB.1.5 rollup), then evaluates that parent's post-conditions.
   * The 40% rollup satisfies Activity 1, so its Exit Parent reaches the root,
   * whose mapped objective was written as failed, so its Retry rule fires.
   * ADL CTS expects Activity 6 instead. This is a deliberate difference; see
   * "Deliberate sequencing differences" in test/conformance/adl/README.md.
   */
  it("retries the root after Act4 exits its satisfied parent", () => {
    const { api, delivered, visit } = replay(ru13d);
    expect(delivered).toEqual(["activity_3"]);
    visit();
    expect(delivered).toEqual(["activity_3", "activity_4"]);
    expect(api.Initialize("")).toBe("true");
    const values: Record<string, string> = {};
    for (let i = 0; i < Number(api.GetValue("cmi.objectives._count")); i++) {
      const id = api.GetValue(`cmi.objectives.${i}.id`);
      if (id === "obj1" || id === "obj2")
        values[`cmi.objectives.${i}.success_status`] = id === "obj1" ? "failed" : "passed";
    }
    expect(Object.keys(values)).toHaveLength(2);
    for (const [element, value] of Object.entries(values))
      expect(api.SetValue(element, value)).toBe("true");
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.SetValue("cmi.exit", "normal")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    expect(delivered).toEqual(["activity_3", "activity_4", "activity_2"]);
  });

  /**
   * @spec ADL CO-12d manifest and Act2V1 through Act4V1 commands.
   * @spec SN TB.2.1 3-4 / TB.2.3 3.2-3.3.2: the parent's satisfied exit
   * rule makes it current before its incomplete Retry post-condition runs.
   * Flow leaving a cluster alone does not invoke ancestor post-conditions.
   */
  it("retries the incomplete parent before continuing from the completed parent", () => {
    const { delivered, visit } = replay(co12d);
    visit({ "cmi.progress_measure": "0.05" });
    expect(delivered).toEqual(["activity_2", "activity_3"]);
    visit();
    expect(delivered).toEqual(["activity_2", "activity_3", "activity_2"]);
    visit({ "cmi.progress_measure": "0.95" });
    expect(delivered).toEqual(["activity_2", "activity_3", "activity_2", "activity_4"]);
  });
});
