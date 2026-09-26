import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { ActivityTreeBuilder } from "../../../../src/configuration/activity_tree_builder";
import { ActivitySettings } from "../../../../src/types/sequencing_types";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";
import {
  NavigationRequestType,
  OverallSequencingProcess,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  SequencingRequestType,
  SequencingProcess,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { clonePreviewState } from "../../../../src/cmi/scorm2004/sequencing/utils/clone_preview_state";

const CONTENT_COMPLETED = "com.scorm.golfsamples.sequencing.randomtest.content_completed";

/** The Random Test course's content prerequisite, current-attempt defaults and test bank. */
function randomTestSettings(): ActivitySettings {
  return {
    id: "golf_sample_default_org",
    title: "Random Test",
    sequencingControls: { choice: true, flow: true },
    children: [
      {
        id: "content_wrapper",
        title: "Content Wrapper",
        isVisible: false,
        sequencingControls: {
          choice: true,
          flow: true,
          rollupObjectiveSatisfied: false,
          rollupProgressCompletion: false,
          objectiveMeasureWeight: 0,
        },
        rollupRules: {
          rules: [
            {
              childActivitySet: "all",
              conditionCombination: "all",
              conditions: [{ condition: "completed" }],
              action: "satisfied",
            },
          ],
        },
        primaryObjective: {
          objectiveID: "content_completed",
          mapInfo: [{ targetObjectiveID: CONTENT_COMPLETED, writeSatisfiedStatus: true }],
        },
        children: ["playing_item", "etuqiette_item", "handicapping_item", "havingfun_item"].map(
          (id) => ({
            id,
            title: id,
            sequencingControls: { completionSetByContent: true, objectiveSetByContent: true },
          }),
        ),
      },
      {
        id: "posttest_item",
        title: "Post Test",
        sequencingControls: { choice: true, flow: true },
        sequencingRules: {
          preConditionRules: [
            {
              action: "disabled",
              conditionCombination: "any",
              conditions: [
                {
                  condition: "satisfied",
                  operator: "not",
                  referencedObjective: "content_completed",
                },
                {
                  condition: "objectiveStatusKnown",
                  operator: "not",
                  referencedObjective: "content_completed",
                },
              ],
            },
          ],
        },
        objectives: [
          {
            objectiveID: "content_completed",
            mapInfo: [{ targetObjectiveID: CONTENT_COMPLETED, readSatisfiedStatus: true }],
          },
        ],
        children: [1, 2, 3, 4].map((n) => ({ id: `test_${n}`, title: `Test ${n}` })),
      },
    ],
  };
}

function createEngine() {
  const root = new ActivityTreeBuilder().createActivity(randomTestSettings());
  const tree = new ActivityTree(root);
  const sequencing = new SequencingProcess(tree);
  const rollup = new RollupProcess();
  const overall = new OverallSequencingProcess(tree, sequencing, rollup, new ADLNav(), () => {});
  const wrapper = tree.getActivity("content_wrapper")!;
  const posttest = tree.getActivity("posttest_item")!;
  expect(overall.processNavigationRequest(NavigationRequestType.START).valid).toBe(true);
  for (const leaf of wrapper.children.slice(0, 3)) {
    expect(tree.currentActivity).toBe(leaf);
    leaf.completionStatus = "completed";
    expect(overall.processNavigationRequest(NavigationRequestType.CONTINUE).valid).toBe(true);
  }
  expect(tree.currentActivity).toBe(wrapper.children[3]);
  return { tree, sequencing, rollup, overall, wrapper, posttest };
}

function alwaysRule(action: RuleActionType): SequencingRule {
  const rule = new SequencingRule(action);
  rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
  return rule;
}

/** @spec SCORM 2004 SN 4th Ed. SB.2.2 / SB.2.9 / DB.2 / UP.3 / SM.7 */
describe("branch attempts are committed only at delivery", () => {
  it("leaves the entire activity tree, objective dirty flags and globals unchanged after refused Continue", () => {
    const { tree, overall, rollup, wrapper } = createEngine();
    const prepared = overall.prepareNavigationRequest(NavigationRequestType.CONTINUE);
    const globals = overall.getGlobalObjectiveMap();
    const before = clonePreviewState({ tree, globals });
    const write = vi.spyOn(rollup, "syncTerminatedActivityObjectives");
    const endRollup = vi.spyOn(rollup, "overallRollupProcess");

    expect(overall.completeNavigationRequest(prepared)).toMatchObject({
      valid: false,
      exception: "SB.2.2-2",
    });
    expect({ tree, globals }).toEqual(before);
    expect(wrapper.isActive).toBe(true);
    expect(wrapper.attemptCount).toBe(1);
    expect(write).not.toHaveBeenCalled();
    expect(endRollup).not.toHaveBeenCalled();
  });

  it.each([
    [RuleActionType.HIDE_FROM_CHOICE, "SB.2.9-4"],
    [RuleActionType.DISABLED, "SB.2.9-5"],
  ])("preserves the old branch after Choice is refused by %s", (action, exception) => {
    const { tree, sequencing, overall, rollup, posttest } = createEngine();
    posttest.sequencingRules.preConditionRules.splice(0, Infinity, alwaysRule(action));
    overall.prepareNavigationRequest(NavigationRequestType.CONTINUE);
    const globals = overall.getGlobalObjectiveMap();
    const before = clonePreviewState({ tree, globals });
    const write = vi.spyOn(rollup, "syncTerminatedActivityObjectives");
    const endRollup = vi.spyOn(rollup, "overallRollupProcess");

    expect(
      sequencing.sequencingRequestProcess(SequencingRequestType.CHOICE, posttest.id),
    ).toMatchObject({ exception });
    expect({ tree, globals }).toEqual(before);
    expect(write).not.toHaveBeenCalled();
    expect(endRollup).not.toHaveBeenCalled();
  });

  it.each([
    [RuleActionType.HIDE_FROM_CHOICE, "SB.2.9-4"],
    [RuleActionType.DISABLED, "SB.2.9-5"],
  ])("uses disposable mapped values for Choice %s rules", (action, exception) => {
    const { tree, sequencing, overall, wrapper, posttest } = createEngine();
    tree.currentActivity!.completionStatus = "completed";
    overall.prepareNavigationRequest(NavigationRequestType.CONTINUE);
    const rule = new SequencingRule(action);
    const satisfied = new RuleCondition(RuleConditionType.SATISFIED);
    satisfied.referencedObjective = "content_completed";
    rule.addCondition(satisfied);
    posttest.sequencingRules.preConditionRules.splice(0, Infinity, rule);
    const globals = overall.getGlobalObjectiveMap();
    expect(wrapper.primaryObjective!.isDirty("satisfiedStatus")).toBe(true);
    expect(globals.get(CONTENT_COMPLETED).satisfiedStatus).toBe(false);
    const before = clonePreviewState({ tree, globals });

    expect(
      sequencing.sequencingRequestProcess(SequencingRequestType.CHOICE, posttest.id),
    ).toMatchObject({ exception });
    expect({ tree, globals }).toEqual(before);
  });

  it.each([NavigationRequestType.CONTINUE, NavigationRequestType.CHOICE])(
    "projects rolled-up satisfaction, then ends and writes the wrapper once on successful %s",
    (request) => {
      const { tree, overall, rollup, wrapper, posttest } = createEngine();
      tree.currentActivity!.completionStatus = "completed";
      const deliveryTarget =
        request === NavigationRequestType.CHOICE
          ? new Activity("free-choice", "Free Choice")
          : posttest.children[0]!;
      if (request === NavigationRequestType.CHOICE) {
        tree.root!.addChild(deliveryTarget);
        tree.root = tree.root;
      }
      const prepared = overall.prepareNavigationRequest(
        request,
        request === NavigationRequestType.CHOICE ? deliveryTarget.id : null,
      );
      const globals = overall.getGlobalObjectiveMap();
      expect(wrapper.primaryObjective!.satisfiedStatus).toBe(true);
      expect(globals.get(CONTENT_COMPLETED).satisfiedStatus).toBe(false);
      const write = vi.spyOn(rollup, "syncTerminatedActivityObjectives");
      const endRollup = vi.spyOn(rollup, "overallRollupProcess");

      expect(overall.completeNavigationRequest(prepared)).toMatchObject({
        valid: true,
        targetActivity: deliveryTarget,
      });
      expect(write.mock.calls.filter(([activity]) => activity === wrapper)).toHaveLength(1);
      expect(endRollup.mock.calls.filter(([activity]) => activity === wrapper)).toHaveLength(1);
      expect(wrapper.isActive).toBe(false);
      expect(wrapper.attemptCount).toBe(1);
      expect(tree.root!.isActive).toBe(true);
      expect(tree.root!.attemptCount).toBe(1);
      expect(globals.get(CONTENT_COMPLETED)).toMatchObject({
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
      });
      expect(posttest.objectives[0]!.satisfiedStatus).toBe(true);
    },
  );

  it("keeps dirty rolled-up objective values and stale globals when the projected value refuses Continue", () => {
    const { tree, overall, wrapper, posttest } = createEngine();
    tree.currentActivity!.completionStatus = "completed";
    const prepared = overall.prepareNavigationRequest(NavigationRequestType.CONTINUE);
    const rule = new SequencingRule(RuleActionType.DISABLED);
    const satisfied = new RuleCondition(RuleConditionType.SATISFIED);
    satisfied.referencedObjective = "content_completed";
    rule.addCondition(satisfied);
    posttest.sequencingRules.preConditionRules.splice(0, Infinity, rule);
    const globals = overall.getGlobalObjectiveMap();
    expect(wrapper.primaryObjective!.isDirty("satisfiedStatus")).toBe(true);
    expect(globals.get(CONTENT_COMPLETED).satisfiedStatus).toBe(false);
    const before = clonePreviewState({ tree, globals });

    expect(overall.completeNavigationRequest(prepared)).toMatchObject({
      valid: false,
      exception: "SB.2.2-2",
    });
    expect({ tree, globals }).toEqual(before);
    expect(wrapper.primaryObjective!.isDirty("satisfiedStatus")).toBe(true);
  });

  it("projects unknown satisfaction over a stale satisfied global without publishing it", () => {
    const { tree, overall, wrapper } = createEngine();
    const prepared = overall.prepareNavigationRequest(NavigationRequestType.CONTINUE);
    const globals = overall.getGlobalObjectiveMap();
    wrapper.objectiveSatisfiedStatusKnown = false;
    wrapper.primaryObjective!.progressStatus = false;
    globals.get(CONTENT_COMPLETED).satisfiedStatus = true;
    globals.get(CONTENT_COMPLETED).satisfiedStatusKnown = true;
    const before = clonePreviewState({ tree, globals });

    expect(overall.completeNavigationRequest(prepared)).toMatchObject({
      valid: false,
      exception: "SB.2.2-2",
    });
    expect({ tree, globals }).toEqual(before);
  });

  it("does not commit a valid sequencing candidate when DB.1.1 rejects an ancestor", () => {
    const { tree, overall, rollup } = createEngine();
    tree.currentActivity!.completionStatus = "completed";
    const prepared = overall.prepareNavigationRequest(NavigationRequestType.CONTINUE);
    tree.root!.attemptLimit = tree.root!.attemptCount;
    const globals = overall.getGlobalObjectiveMap();
    const before = clonePreviewState({ tree, globals });
    const write = vi.spyOn(rollup, "syncTerminatedActivityObjectives");

    expect(overall.completeNavigationRequest(prepared)).toMatchObject({
      valid: false,
      exception: "DB.1.1-3",
    });
    expect({ tree, globals }).toEqual(before);
    expect(write).not.toHaveBeenCalled();
  });

  it.each([
    NavigationRequestType.CONTINUE,
    NavigationRequestType.PREVIOUS,
    NavigationRequestType.JUMP,
  ])(
    "ends nested departed clusters bottom-up, once, excluding the common ancestor on %s",
    (request) => {
      const { tree, overall, rollup, wrapper } = createEngine();
      const nested = new Activity("nested", "Nested");
      const leaf = new Activity("nested-leaf", "Nested Leaf");
      nested.sequencingControls.flow = true;
      nested.addChild(leaf);
      wrapper.addChild(nested);
      const previous = new Activity("previous", "Previous");
      tree.root!.addChild(previous);
      tree.root!.setChildOrder(
        request === NavigationRequestType.CONTINUE
          ? [wrapper.id, previous.id, "posttest_item"]
          : [previous.id, wrapper.id, "posttest_item"],
      );
      tree.root!.setProcessedChildren([...tree.root!.children]);
      tree.root = tree.root;
      tree.currentActivity = leaf;
      leaf.isActive = false;
      const writes = vi.spyOn(rollup, "syncTerminatedActivityObjectives");
      // Previous must leave both clusters rather than stop at an earlier wrapper child.
      wrapper.setProcessedChildren([nested]);
      const result = overall.processNavigationRequest(
        request,
        request === NavigationRequestType.JUMP ? previous.id : null,
      );
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(previous);
      expect(writes.mock.calls.map(([activity]) => activity.id)).toEqual([nested.id, wrapper.id]);
      expect(tree.root!.isActive).toBe(true);
      expect(nested.isActive).toBe(false);
      expect(wrapper.isActive).toBe(false);
    },
  );
});

/** Integration through public CMI and navigation APIs, using the Random Test prerequisite. */
describe("Random Test refused Continue recovery", () => {
  it("previews a refused Continue from incomplete SCO 4 without changing any live tracking or globals", () => {
    const events = vi.fn();
    const api = new Scorm2004API({
      logLevel: 5,
      autocommit: false,
      sequencing: {
        activityTree: randomTestSettings(),
        eventListeners: {
          onActivityDelivery: events,
          onActivityUnload: events,
          onSequencingSessionEnd: events,
        },
      },
    });
    const service = api.getSequencingService()!;
    expect(service.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    for (let i = 0; i < 3; i++) {
      expect(api.SetValue("cmi.completion_status", "completed")).toBe("true");
      expect(service.processNavigationRequest("continue")).toBe(true);
      expect(api.SetValue("cmi.completion_status", "incomplete")).toBe("true");
    }
    const tree = api.adl.sequencing.activityTree;
    const globals = service.getOverallSequencingProcess()!.getGlobalObjectiveMap();
    const before = clonePreviewState({ tree, globals });
    const cmi = JSON.stringify(api.cmi);
    const commit = vi.spyOn(api, "storeData");
    events.mockClear();
    for (let i = 0; i < 3; i++) {
      expect(api.previewNavigationRequest("continue")).toEqual({
        outcome: "blocked",
        targetActivityId: null,
        endSequencingSession: false,
        exception: "SB.2.2-2",
      });
      expect({ tree, globals }).toEqual(before);
      expect(JSON.stringify(api.cmi)).toBe(cmi);
    }
    expect(events).not.toHaveBeenCalled();
    expect(commit).not.toHaveBeenCalled();
    commit.mockRestore();
  });

  it("retains SCOs 1-3 in the wrapper attempt after refusal, Choice back, and completing SCO 4", () => {
    const api = new Scorm2004API({
      logLevel: 5,
      autocommit: false,
      sequencing: { activityTree: randomTestSettings() },
    });
    const service = api.getSequencingService()!;
    expect(service.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    for (let i = 0; i < 3; i++) {
      expect(api.SetValue("cmi.completion_status", "completed")).toBe("true");
      expect(service.processNavigationRequest("continue")).toBe(true);
      expect(api.SetValue("cmi.completion_status", "incomplete")).toBe("true");
    }
    const wrapper = service.getSequencingState().rootActivity!.children[0]!;
    expect(service.getSequencingState().currentActivity!.id).toBe("havingfun_item");
    const attempts = wrapper.attemptCount;
    expect(service.processNavigationRequest("continue")).toBe(false);
    expect(service.getSequencingState().lastSequencingResult!.exception).toBe("SB.2.2-2");
    expect(wrapper.isActive).toBe(true);
    expect(wrapper.attemptCount).toBe(attempts);
    expect(service.processNavigationRequest("choice", "havingfun_item")).toBe(true);
    expect(wrapper.attemptCount).toBe(attempts);
    expect(
      wrapper.children
        .slice(0, 3)
        .map((child) => [
          child.completionStatus,
          child.progressInfoAvailableInCurrentParentAttempt,
        ]),
    ).toEqual([
      ["completed", true],
      ["completed", true],
      ["completed", true],
    ]);
    expect(api.SetValue("cmi.completion_status", "completed")).toBe("true");
    expect(service.processNavigationRequest("continue")).toBe(true);
    expect(service.getSequencingState().currentActivity!.parent!.id).toBe("posttest_item");
    expect(wrapper.isActive).toBe(false);
    expect(wrapper.attemptCount).toBe(attempts);
    expect(
      service.getOverallSequencingProcess()!.getGlobalObjectiveMap().get(CONTENT_COMPLETED),
    ).toMatchObject({ satisfiedStatus: true, satisfiedStatusKnown: true });
  });
});

/** @spec SCORM 2004 SN 4th Ed. TB.2.3 / TB.2.2 / SB.2.10 / DB.2 */
describe.each([false, true])(
  "Random Test exitParent retry (randomization=%s)",
  (randomizeChildren) => {
    it.each(["direct", "Terminate"])(
      "retries an unsubmitted test once, then exits at the posttest attempt limit via %s",
      (mode) => {
        const settings = randomTestSettings();
        const posttestSettings = settings.children![1]!;
        posttestSettings.attemptLimit = 2;
        posttestSettings.sequencingControls = {
          choice: false,
          flow: true,
          randomizeChildren,
          randomizationTiming: "onEachNewAttempt",
          reorderChildren: true,
        };
        posttestSettings.sequencingRules!.preConditionRules!.push({
          action: "disabled",
          conditionCombination: "any",
          conditions: [{ condition: "attemptLimitExceeded" }, { condition: "satisfied" }],
        });
        posttestSettings.sequencingRules!.postConditionRules = [
          {
            action: "retry",
            conditionCombination: "all",
            conditions: [
              { condition: "satisfied", operator: "not" },
              { condition: "attemptLimitExceeded", operator: "not" },
            ],
          },
          {
            action: "retry",
            conditionCombination: "all",
            conditions: [
              { condition: "objectiveStatusKnown", operator: "not" },
              { condition: "attemptLimitExceeded", operator: "not" },
            ],
          },
          {
            action: "exitAll",
            conditionCombination: "any",
            conditions: [
              { condition: "objectiveStatusKnown" },
              { condition: "attemptLimitExceeded" },
            ],
          },
        ];
        posttestSettings.rollupRules = {
          rules: [
            {
              childActivitySet: "any",
              conditions: [{ condition: "satisfied" }],
              action: "satisfied",
            },
            {
              childActivitySet: "any",
              conditions: [{ condition: "satisfied", operator: "not" }],
              action: "notSatisfied",
            },
          ],
        };
        const courseScore = "com.scorm.golfsamples.sequencing.randomtest.course_score";
        posttestSettings.primaryObjective = {
          objectiveID: "course_score",
          mapInfo: [
            {
              targetObjectiveID: courseScore,
              readSatisfiedStatus: false,
              readNormalizedMeasure: true,
            },
          ],
        };
        for (const test of posttestSettings.children!) {
          test.isVisible = false;
          test.sequencingCollectionRefs = ["test_sequencing_rules"];
        }
        const sessionEnd = vi.fn();
        const random = vi.spyOn(Math, "random").mockReturnValue(0.999);
        try {
          const api = new Scorm2004API({
            logLevel: 5,
            autocommit: false,
            sequencing: {
              activityTree: settings,
              eventListeners: { onSequencingSessionEnd: sessionEnd },
              collections: {
                test_sequencing_rules: {
                  sequencingRules: {
                    postConditionRules: [
                      { action: "exitParent", conditions: [{ condition: "always" }] },
                    ],
                  },
                  objectives: [
                    {
                      objectiveID: "course_score",
                      isPrimary: true,
                      mapInfo: [
                        {
                          targetObjectiveID: courseScore,
                          readSatisfiedStatus: false,
                          readNormalizedMeasure: false,
                          writeNormalizedMeasure: true,
                        },
                      ],
                    },
                  ],
                  sequencingControls: { completionSetByContent: true, objectiveSetByContent: true },
                },
              },
            },
          });
          const service = api.getSequencingService()!;
          expect(service.processNavigationRequest("start")).toBe(true);
          expect(api.Initialize("")).toBe("true");
          const continueRequest = () => {
            if (mode === "direct") return service.processNavigationRequest("continue");
            expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
            expect(api.Terminate("")).toBe("true");
            const result = service.getSequencingState().lastSequencingResult!;
            if (result.exception) return false;
            if (service.getSequencingState().currentActivity) {
              api.reset();
              expect(api.Initialize("")).toBe("true");
            }
            return true;
          };
          for (let i = 0; i < 4; i++) {
            expect(api.SetValue("cmi.completion_status", "completed")).toBe("true");
            expect(continueRequest()).toBe(true);
            expect(api.SetValue("cmi.completion_status", "incomplete")).toBe("true");
            expect(api.SetValue("cmi.success_status", "unknown")).toBe("true");
          }
          const posttest = service.getSequencingState().rootActivity!.children[1]!;
          const wrapper = service.getSequencingState().rootActivity!.children[0]!;
          expect(service.getSequencingState().currentActivity!.id).toBe("test_1");
          expect(posttest.attemptCount).toBe(1);
          expect(wrapper.attemptCount).toBe(1);
          expect(
            service.getOverallSequencingProcess()!.getGlobalObjectiveMap().get(CONTENT_COMPLETED),
          ).toMatchObject({ satisfiedStatus: true, satisfiedStatusKnown: true });
          random.mockReturnValue(0);

          const globals = service.getOverallSequencingProcess()!.getGlobalObjectiveMap();
          const tree = api.adl.sequencing.activityTree;
          const beforePreview = clonePreviewState({ tree, globals });
          const preview = api.previewNavigationRequest("continue");
          // Configured randomness is intentionally indeterminate; the host proceeds on unknown.
          // Fixed order exercises the full cloned termination/sequencing/delivery path.
          expect(preview.outcome).toBe(randomizeChildren ? "unknown" : "allowed");
          expect({ tree, globals }).toEqual(beforePreview);
          expect(
            continueRequest(),
            JSON.stringify(service.getSequencingState().lastSequencingResult?.exception),
          ).toBe(true);
          expect(posttest.attemptCount).toBe(2);
          const secondTest = service.getSequencingState().currentActivity!;
          expect(secondTest.parent).toBe(posttest);
          if (!randomizeChildren) expect(secondTest).toBe(posttest.getAvailableChildren()[0]);
          expect(wrapper.attemptCount).toBe(1);
          expect(api.SetValue("cmi.completion_status", "incomplete")).toBe("true");
          expect(api.SetValue("cmi.success_status", "unknown")).toBe("true");

          expect(continueRequest()).toBe(true);
          expect(service.getSequencingState().currentActivity).toBeNull();
          expect(posttest.attemptCount).toBe(2);
          expect(posttest.isActive).toBe(false);
          expect(sessionEnd).toHaveBeenCalledWith(expect.objectContaining({ reason: "exit_all" }));
        } finally {
          random.mockRestore();
        }
      },
    );
  },
);
