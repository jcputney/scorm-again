import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { ActivitySettings } from "../../src/types/sequencing_types";
import {
  RuleActionType,
  RuleConditionType,
  RuleConditionOperator,
} from "../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {
  RollupActionType,
  RollupConditionType,
  RollupConsiderationType,
} from "../../src/cmi/scorm2004/sequencing/rollup_rules";

const flow = { choice: false, flow: true };
const leaf = (n: number, extra: Partial<ActivitySettings> = {}): ActivitySettings => ({
  id: `activity_${n}`,
  title: `Activity ${n}`,
  hideLmsUi: ["continue", "previous", "suspendAll"],
  ...extra,
});
const objective = (targetObjectiveID: string, write = false) => ({
  objectiveID: "PRIMARYOBJ",
  mapInfo: [
    {
      targetObjectiveID,
      readSatisfiedStatus: false,
      readNormalizedMeasure: false,
      readCompletionStatus: true,
      readProgressMeasure: true,
      writeCompletionStatus: write,
      writeProgressMeasure: write,
    },
  ],
});
const skip = (condition: RuleConditionType, negate = false, referencedObjective?: string) => ({
  preConditionRules: [
    {
      action: RuleActionType.SKIP,
      conditions: [
        {
          condition,
          ...(negate ? { operator: RuleConditionOperator.NOT } : {}),
          ...(referencedObjective ? { referencedObjective } : {}),
        },
      ],
    },
  ],
});

// Transcribed from ADL CTS imsmanifest.xml and TestCases/<ID>.properties.
// Commands retain physical file order: CO-04b and CO-10 contain duplicate numeric keys.
// Objective ID GETs represent the CTS launcher's index lookup.
type Command = [method: string, element: string, value: string, error: string];
type Visit = [activity: string, commands: Command[]];
const scripts: Record<string, Visit[]> = {
  "CO-03": [
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.progress_measure", "0.55", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_2",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.completion_status", "completed", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_7",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
  ],
  "CO-04a": [
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.progress_measure", "0.85", "0"],
        ["SET", "cmi.completion_status", "completed", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_4",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
  ],
  "CO-04b": [
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "completed", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_4",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
  ],
  "CO-05a": [
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.50", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_3",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
  ],
  "CO-10": [
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.2", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["SET", "cmi.objectives.&obj1&.progress_measure", "0.5", "0"],
        ["SET", "cmi.objectives.&obj1&.completion_status", "incomplete", "0"],
        ["SET", "cmi.objectives.&obj1&.score.raw", "50", "0"],
        ["SET", "cmi.objectives.&obj1&.score.min", "23", "0"],
        ["SET", "cmi.objectives.&obj1&.score.max", "200", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["SET", "cmi.objectives.&obj2&.completion_status", "not attempted", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["SET", "cmi.objectives.&obj3&.progress_measure", "0.1", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "suspend", "0"],
      ],
    ],
    [
      "activity_2",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.2", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "incomplete", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.3", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["GET", "cmi.objectives.&obj1&.progress_measure", "0.5", "0"],
        ["GET", "cmi.objectives.&obj1&.completion_status", "incomplete", "0"],
        ["GET", "cmi.objectives.&obj1&.score.raw", "50", "0"],
        ["GET", "cmi.objectives.&obj1&.score.min", "23", "0"],
        ["GET", "cmi.objectives.&obj1&.score.max", "200", "0"],
        ["SET", "cmi.objectives.&obj1&.progress_measure", "0.99", "0"],
        ["SET", "cmi.objectives.&obj1&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&obj1&.score.raw", "7", "0"],
        ["SET", "cmi.objectives.&obj1&.score.min", "0", "0"],
        ["SET", "cmi.objectives.&obj1&.score.max", "99", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["GET", "cmi.objectives.&obj2&.completion_status", "incomplete", "0"],
        ["SET", "cmi.objectives.&obj2&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["GET", "cmi.objectives.&obj3&.progress_measure", "0.1", "0"],
        ["SET", "cmi.objectives.&obj3&.progress_measure", "0.25", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "suspend", "0"],
      ],
    ],
    [
      "activity_3",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.3", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.65", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["GET", "cmi.objectives.&obj1&.progress_measure", "0.99", "0"],
        ["GET", "cmi.objectives.&obj1&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj1&.score.raw", "7", "0"],
        ["GET", "cmi.objectives.&obj1&.score.min", "0", "0"],
        ["GET", "cmi.objectives.&obj1&.score.max", "99", "0"],
        ["SET", "cmi.objectives.&obj1&.progress_measure", "0.2", "0"],
        ["SET", "cmi.objectives.&obj1&.completion_status", "incomplete", "0"],
        ["SET", "cmi.objectives.&obj1&.score.raw", "76.8", "0"],
        ["SET", "cmi.objectives.&obj1&.score.min", "10", "0"],
        ["SET", "cmi.objectives.&obj1&.score.max", "76.9", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["GET", "cmi.objectives.&obj2&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&obj2&.completion_status", "incomplete", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["GET", "cmi.objectives.&obj3&.progress_measure", "0.25", "0"],
        ["SET", "cmi.objectives.&obj3&.progress_measure", "0.8", "0"],
        ["SET", "adl.nav.request", "previous", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_2",
      [
        ["I", "", "true", "0"],
        ["SET", "cmi.progress_measure", "0.39", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.3", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["GET", "cmi.objectives.&obj1&.progress_measure", "0.99", "0"],
        ["GET", "cmi.objectives.&obj1&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj1&.score.raw", "7", "0"],
        ["GET", "cmi.objectives.&obj1&.score.min", "0", "0"],
        ["GET", "cmi.objectives.&obj1&.score.max", "99", "0"],
        ["SET", "cmi.objectives.&obj1&.progress_measure", "0.4", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["GET", "cmi.objectives.&obj2&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["GET", "cmi.objectives.&obj3&.progress_measure", "0.25", "0"],
        ["SET", "cmi.objectives.&obj3&.progress_measure", "0.29", "0"],
        ["SET", "adl.nav.request", "previous", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.39", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.6", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["GET", "cmi.objectives.&obj1&.progress_measure", "0.4", "0"],
        ["GET", "cmi.objectives.&obj1&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj1&.score.raw", "7", "0"],
        ["GET", "cmi.objectives.&obj1&.score.min", "0", "0"],
        ["GET", "cmi.objectives.&obj1&.score.max", "99", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["GET", "cmi.objectives.&obj2&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&obj2&.completion_status", "incomplete", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["GET", "cmi.objectives.&obj3&.progress_measure", "0.29", "0"],
        ["SET", "adl.nav.request", "continue", "0"],
        ["SET", "cmi.exit", "suspend", "0"],
      ],
    ],
    [
      "activity_2",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.6", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "completed", "0"],
        ["SET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.1", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["GET", "cmi.objectives.&obj1&.progress_measure", "0.4", "0"],
        ["GET", "cmi.objectives.&obj1&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj1&.score.raw", "7", "0"],
        ["GET", "cmi.objectives.&obj1&.score.min", "0", "0"],
        ["GET", "cmi.objectives.&obj1&.score.max", "99", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["GET", "cmi.objectives.&obj2&.completion_status", "incomplete", "0"],
        ["SET", "cmi.objectives.&obj2&.completion_status", "not attempted", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["GET", "cmi.objectives.&obj3&.progress_measure", "0.29", "0"],
        ["SET", "adl.nav.request", "previous", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
    [
      "activity_1",
      [
        ["I", "", "true", "0"],
        ["GET", "cmi.progress_measure", "", "403"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.id", "", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.progress_measure", "0.1", "0"],
        ["GET", "cmi.objectives.&PRIMARYOBJ&.completion_status", "incomplete", "0"],
        ["GET", "cmi.objectives.&obj1&.id", "", "0"],
        ["GET", "cmi.objectives.&obj1&.progress_measure", "0.4", "0"],
        ["GET", "cmi.objectives.&obj1&.completion_status", "completed", "0"],
        ["GET", "cmi.objectives.&obj1&.score.raw", "7", "0"],
        ["GET", "cmi.objectives.&obj1&.score.min", "0", "0"],
        ["GET", "cmi.objectives.&obj1&.score.max", "99", "0"],
        ["GET", "cmi.objectives.&obj2&.id", "", "0"],
        ["GET", "cmi.objectives.&obj2&.completion_status", "incomplete", "0"],
        ["GET", "cmi.objectives.&obj3&.id", "", "0"],
        ["GET", "cmi.objectives.&obj3&.progress_measure", "0.29", "0"],
        ["SET", "cmi.exit", "normal", "0"],
      ],
    ],
  ],
};

function replay(id: string, children: ActivitySettings[]) {
  const delivered: string[] = [];
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: { id, title: id, sequencingControls: flow, children },
      eventListeners: {
        onActivityDelivery: (a) => {
          delivered.push(a.id);
        },
      },
    },
  });
  expect(api.processNavigationRequest("start")).toBe(true);
  const visits = scripts[id]!;
  visits.forEach(([activity, commands], visit) => {
    expect(delivered[visit], `${id} delivery ${visit + 1}`).toBe(activity);
    if (visit) api.reset();
    commands.forEach(([method, rawElement, value, error], command) => {
      const element = rawElement.replace(/&([^&]+)&/g, (_, objectiveID) => {
        const count = Number(api.GetValue("cmi.objectives._count"));
        for (let i = 0; i < count; i++) {
          if (api.GetValue(`cmi.objectives.${i}.id`) === objectiveID) return String(i);
        }
        throw new Error(`Missing objective ${objectiveID}`);
      });
      const result =
        method === "I"
          ? api.Initialize("")
          : method === "SET"
            ? api.SetValue(element, value)
            : api.GetValue(element);
      const expected =
        method !== "GET"
          ? "true"
          : element.endsWith(".id")
            ? rawElement.match(/&([^&]+)&/)![1]
            : value;
      expect(result, `${id} ${activity} command ${command}: ${element}`).toBe(expected);
      expect(api.GetLastError()).toBe(error);
    });
    if (visit === visits.length - 1) expect(api.SetValue("adl.nav.request", "exit")).toBe("true");
    expect(api.Terminate("")).toBe("true");
  });
  expect(delivered).toEqual(visits.map(([activity]) => activity));
}

describe("ADL global objective completion", () => {
  /** @spec ADL CO-03: mapped child completion participates in all-completed rollup. */
  it("CO-03 delivers Act1 -> Act2 -> Act7", () => {
    replay("CO-03", [
      leaf(1, {
        primaryObjective: {
          objectiveID: "PRIMARYOBJ",
          mapInfo: [
            {
              targetObjectiveID: "gObj-CO03-1",
              readSatisfiedStatus: false,
              readNormalizedMeasure: false,
              readCompletionStatus: false,
              readProgressMeasure: false,
              writeCompletionStatus: true,
            },
            {
              targetObjectiveID: "gObj-CO03-3",
              readSatisfiedStatus: false,
              readNormalizedMeasure: false,
              readCompletionStatus: false,
              readProgressMeasure: false,
              writeProgressMeasure: true,
            },
          ],
        },
      }),
      leaf(2, {
        primaryObjective: {
          ...objective("gObj-CO03-2"),
          mapInfo: [{ ...objective("gObj-CO03-2").mapInfo[0]!, writeCompletionStatus: true }],
        },
      }),
      leaf(3, {
        sequencingControls: flow,
        sequencingRules: skip(RuleConditionType.SATISFIED),
        rollupRules: {
          rules: [
            {
              action: RollupActionType.SATISFIED,
              consideration: RollupConsiderationType.ALL,
              conditions: [{ condition: RollupConditionType.COMPLETED }],
            },
          ],
        },
        children: [
          leaf(4, { primaryObjective: objective("gObj-CO03-1") }),
          leaf(5, { primaryObjective: objective("gObj-CO03-2") }),
          leaf(6, {
            primaryObjective: objective("gObj-CO03-3"),
            completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.5 },
          }),
        ],
      }),
      leaf(7),
    ]);
  });

  /** @spec ADL CO-04b: measure-based activity completion is unknown without a measure. */
  it("CO-04b delivers Act1 -> Act4", () => {
    replay("CO-04b", [
      leaf(1, { primaryObjective: objective("gObj-CO04b", true) }),
      leaf(2, {
        primaryObjective: objective("gObj-CO04b"),
        completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.75 },
        sequencingRules: skip(RuleConditionType.ACTIVITY_PROGRESS_KNOWN, true),
      }),
      leaf(3, {
        primaryObjective: objective("gObj-CO04b"),
        completionThreshold: { minProgressMeasure: 0.1 },
        sequencingRules: skip(RuleConditionType.COMPLETED, false, "PRIMARYOBJ"),
      }),
      leaf(4),
    ]);
  });

  /** @spec ADL CO-10: mapped objective values survive differing activity thresholds and resume. */
  it("CO-10 preserves mapped completion across all seven deliveries", () => {
    replay(
      "CO-10",
      [1, 2, 3].map((n) =>
        leaf(n, {
          deliveryControls: { objectiveSetByContent: true, tracked: n !== 3 },
          completionThreshold: {
            completedByMeasure: true,
            minProgressMeasure: [0.4, 0.15, 0.6][n - 1]!,
          },
          primaryObjective: objective("gObj-CO10-4", true),
          objectives: [1, 2, 3].map((i) => ({
            ...objective(`gObj-CO10-${i}`, true),
            objectiveID: `obj${i}`,
            mapInfo: [
              {
                ...objective(`gObj-CO10-${i}`, true).mapInfo[0]!,
                ...(i === 1
                  ? {
                      readRawScore: true,
                      readMinScore: true,
                      readMaxScore: true,
                      writeRawScore: true,
                      writeMinScore: true,
                      writeMaxScore: true,
                    }
                  : {}),
              },
            ],
          })),
        }),
      ),
    );
  });

  /** @spec ADL CO-04a: read progress determines activity completion with the local threshold. */
  it("CO-04a delivers Act1 -> Act4", () => {
    replay("CO-04a", [
      leaf(1, {
        primaryObjective: objective("gObj-CO04a", true),
        completionThreshold: { completedByMeasure: true },
      }),
      leaf(2, {
        primaryObjective: objective("gObj-CO04a"),
        completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.4 },
        sequencingRules: skip(RuleConditionType.COMPLETED),
      }),
      leaf(3, {
        primaryObjective: objective("gObj-CO04a"),
        completionThreshold: { minProgressMeasure: 0.1 },
        sequencingRules: skip(RuleConditionType.COMPLETED, true),
      }),
      leaf(4),
    ]);
  });

  /** @spec ADL CO-05a: untracked clusters hide activity progress conditions. */
  it("CO-05a delivers Act1 -> Act3", () => {
    replay("CO-05a", [
      leaf(1, { primaryObjective: objective("gObj-CO05a", true) }),
      leaf(2, {
        sequencingControls: flow,
        deliveryControls: { tracked: false },
        sequencingRules: skip(RuleConditionType.ACTIVITY_PROGRESS_KNOWN),
        primaryObjective: objective("gObj-CO05a"),
        children: [
          leaf(3, {
            primaryObjective: { objectiveID: "" },
            objectives: [{ ...objective("gObj-CO05a"), objectiveID: "obj" }],
          }),
          leaf(4),
          leaf(5),
        ],
      }),
      leaf(6),
    ]);
  });
});

/** @spec SN UP.4: retain the deliberate CO-04c auto-completion difference (see ADL README). */
describe("completedByMeasure End Attempt defaults with objective maps", () => {
  for (const precedingStatus of ["incomplete", "completed"]) {
    for (const variant of ["none", "write", "readCompletion", "readProgress"]) {
      for (const completionSetByContent of [false, true]) {
        for (const measure of [undefined, "0.4", "0.5"]) {
          it(`${precedingStatus}, ${variant}, content=${completionSetByContent}, measure=${measure}`, () => {
            const map = {
              targetObjectiveID: "g",
              readSatisfiedStatus: false,
              readNormalizedMeasure: false,
              readCompletionStatus: variant === "readCompletion" || variant === "readProgress",
              readProgressMeasure: variant === "readProgress",
              writeCompletionStatus: variant === "write",
            };
            const api = new Scorm2004API({
              logLevel: 5,
              sequencing: {
                activityTree: {
                  id: "root",
                  title: "root",
                  sequencingControls: flow,
                  children: [
                    leaf(1, {
                      primaryObjective: {
                        objectiveID: "PRIMARYOBJ",
                        mapInfo: [
                          {
                            ...map,
                            readCompletionStatus: false,
                            readProgressMeasure: false,
                            writeCompletionStatus: true,
                          },
                        ],
                      },
                    }),
                    leaf(2, {
                      primaryObjective: {
                        objectiveID: "PRIMARYOBJ",
                        mapInfo: variant === "none" ? [] : [map],
                      },
                      completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.5 },
                      sequencingControls: { completionSetByContent },
                    }),
                    leaf(3, { primaryObjective: objective("g") }),
                  ],
                },
              },
            });
            expect(api.processNavigationRequest("start")).toBe(true);
            expect(api.Initialize("")).toBe("true");
            expect(api.SetValue("cmi.completion_status", precedingStatus)).toBe("true");
            expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
            expect(api.Terminate("")).toBe("true");
            api.reset();
            expect(api.Initialize("")).toBe("true");
            const a2 = api.getSequencingState().rootActivity.children[1];
            expect(a2.completionStatus).not.toBe("completed");
            expect(a2.isCompleted).toBe(false);
            expect(api.GetValue("cmi.objectives.0.completion_status")).toBe(
              map.readCompletionStatus ? precedingStatus : "unknown",
            );
            if (measure !== undefined)
              expect(api.SetValue("cmi.progress_measure", measure)).toBe("true");
            expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
            expect(api.Terminate("")).toBe("true");
            const expected =
              measure === undefined
                ? completionSetByContent
                  ? "incomplete"
                  : "completed"
                : Number(measure) >= 0.5
                  ? "completed"
                  : "incomplete";
            const ended = api.getSequencingState().rootActivity.children[1];
            expect(ended.completionStatus).toBe(expected);
            expect(ended.isCompleted).toBe(expected === "completed");
            if (variant === "write") {
              api.reset();
              expect(api.Initialize("")).toBe("true");
              expect(api.GetValue("cmi.objectives.0.completion_status")).toBe(expected);
            }
          });
        }
      }
    }
  }
});

/** @spec RTE 4.2.17 / SN 4.2.1.4: a resumed SCO can update primary progress through its objective row. */
describe("resumed primary objective progress writes", () => {
  it.each([
    ["0.2", "0.8", "completed"],
    ["0.8", "0.2", "incomplete"],
  ])(
    "restored top-level %s yields to row write %s (%s)",
    (savedMeasure, rowMeasure, completion) => {
      const createApi = () =>
        new Scorm2004API({
          logLevel: 5,
          sequencing: {
            activityTree: {
              id: "root",
              title: "root",
              sequencingControls: flow,
              children: [
                leaf(1, {
                  primaryObjective: { objectiveID: "PRIMARYOBJ" },
                  completionThreshold: { completedByMeasure: true, minProgressMeasure: 0.5 },
                }),
                leaf(2),
              ],
            },
          },
        });
      const original = createApi();
      expect(original.processNavigationRequest("start")).toBe(true);
      expect(original.Initialize("")).toBe("true");
      expect(original.SetValue("cmi.progress_measure", savedMeasure)).toBe("true");
      expect(original.SetValue("cmi.exit", "suspend")).toBe("true");
      expect(original.SetValue("adl.nav.request", "suspendAll")).toBe("true");
      expect(original.Terminate("")).toBe("true");

      const restored = createApi();
      expect(restored.deserializeSequencingState(original.serializeSequencingState())).toBe(true);
      expect(restored.processNavigationRequest("resumeAll")).toBe(true);
      restored.loadFromJSON({ entry: "resume", progress_measure: savedMeasure });
      expect(restored.Initialize("")).toBe("true");
      expect(restored.GetValue("cmi.entry")).toBe("resume");
      expect(restored.GetValue("cmi.progress_measure")).toBe(savedMeasure);
      expect(restored.GetValue("cmi.objectives.0.id")).toBe("PRIMARYOBJ");
      expect(restored.SetValue("cmi.objectives.0.progress_measure", rowMeasure)).toBe("true");
      expect(restored.SetValue("adl.nav.request", "continue")).toBe("true");
      expect(restored.Terminate("")).toBe("true");
      expect(restored.getSequencingState().rootActivity.children[0]).toMatchObject({
        attemptCompletionAmount: Number(rowMeasure),
        completionStatus: completion,
        isCompleted: completion === "completed",
      });
    },
  );
});
