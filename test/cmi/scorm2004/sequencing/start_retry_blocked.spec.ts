import { describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { FlowTraversalService } from "../../../../src/cmi/scorm2004/sequencing/traversal/flow_traversal_service";
import { RuleEvaluationEngine } from "../../../../src/cmi/scorm2004/sequencing/rules/rule_evaluation_engine";

/** @spec SN Book: SB.2.5; SB.2.10 - enter the same flow-enabled cluster for Start and Retry. */
function fixture(request: SequencingRequestType) {
  const root = new Activity("root");
  const a = new Activity("a");
  const b = new Activity("b");
  root.sequencingControls.flow = true;
  root.addChild(a);
  root.addChild(b);
  const tree = new ActivityTree(root);
  // @spec SN Book: SB.2.10 step 3 - cluster Retry requires a current inactive cluster.
  if (request === SequencingRequestType.RETRY) {
    tree.currentActivity = root;
    root.isActive = false;
  }
  return { root, a, b, tree, process: new SequencingProcess(tree) };
}

/** @spec SN Book: UP.2; SB.2.2 steps 3, 5.1 - distinguish Skipped rules from blocked candidates. */
function addPrecondition(activity: Activity, action: RuleActionType): void {
  const rule = new SequencingRule(action);
  rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
  activity.sequencingRules.addPreConditionRule(rule);
}

/** @spec SN Book: SB.2.5 step 3.2.1; SB.2.10 step 3; SB.2.2 - preserve the first flow result for all entry requests. */
describe.each([
  SequencingRequestType.START,
  SequencingRequestType.RETRY_ALL,
  SequencingRequestType.RETRY,
])("%s blocked first candidate (SB.2.5 / SB.2.10 / SB.2.2)", (request) => {
  /** @spec SN Book: SB.2.2 step 5.1; UP.5 - a blocked first candidate terminates flow with SB.2.2-2. */
  it.each(["disabled", "attemptLimit", "stopForwardTraversal"])(
    "fails at %s instead of delivering a later child (SB.2.2-2)",
    (blocker) => {
      const { a, process } = fixture(request);
      // @spec SN Book: SB.2.2 step 5.1; UP.5 - exercise each blocking mechanism independently.
      if (blocker === "disabled") {
        addPrecondition(a, RuleActionType.DISABLED);
      } else if (blocker === "attemptLimit") {
        a.attemptLimit = 1;
        a.attemptCount = 1;
      } else {
        a.sequencingControls.stopForwardTraversal = true;
      }

      const result = process.sequencingRequestProcess(request);

      expect(result.deliveryRequest).toBe("doNotDeliver");
      expect(result.targetActivity).toBeNull();
      expect(result.exception).toBe("SB.2.2-2");
    },
  );

  /** @spec SN Book: SB.2.2 step 3 - an explicit Skip rule advances to the next candidate. */
  it("delivers the next child after Skip (SB.2.2 step 3)", () => {
    const { a, b, process } = fixture(request);
    addPrecondition(a, RuleActionType.SKIP);

    const result = process.sequencingRequestProcess(request);

    expect(result.deliveryRequest).toBe("deliver");
    expect(result.targetActivity).toBe(b);
    expect(result.exception).toBeNull();
  });

  /** @spec SN Book: SB.2.2 steps 5.1, 6.3.3; SB.2.5 step 3.2.1 - propagate a nested blocked leaf. */
  it("stops at a nested blocked first leaf (SB.2.2 steps 5.1, 6.3.3)", () => {
    const { a, process } = fixture(request);
    const blocked = new Activity("blocked");
    a.sequencingControls.flow = true;
    a.addChild(blocked);
    a.addChild(new Activity("later-leaf"));
    addPrecondition(blocked, RuleActionType.DISABLED);

    const result = process.sequencingRequestProcess(request);

    expect(result.deliveryRequest).toBe("doNotDeliver");
    expect(result.targetActivity).toBeNull();
    expect(result.exception).toBe("SB.2.2-2");
  });
});

/** @spec SN Book: SB.2.5 step 3.2; SB.2.2 step 5.1 - the legacy wrapper must not walk past a blocked candidate. */
it("findFirstDeliverableActivity stops at a blocked first child (SB.2.5 / SB.2.2)", () => {
  const { root, a, tree } = fixture(SequencingRequestType.START);
  addPrecondition(a, RuleActionType.DISABLED);
  const service = new FlowTraversalService(tree, new RuleEvaluationEngine());

  expect(service.findFirstDeliverableActivity(root)).toBeNull();
});
