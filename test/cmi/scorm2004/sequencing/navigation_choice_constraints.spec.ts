import { beforeEach, describe, expect, it } from "vitest";

import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  NavigationRequestType,
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("OverallSequencingProcess choice constraints", () => {
  let root: Activity;
  let clusterA: Activity;
  let clusterMid: Activity;
  let clusterB: Activity;
  let leafA1: Activity;
  let leafA2: Activity;
  let leafMid: Activity;
  let leafB1: Activity;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overall: OverallSequencingProcess;

  beforeEach(() => {
    root = new Activity("root", "Root");
    clusterA = new Activity("clusterA", "Cluster A");
    clusterMid = new Activity("clusterMid", "Cluster Mid");
    clusterB = new Activity("clusterB", "Cluster B");
    leafA1 = new Activity("leafA1", "Leaf A1");
    leafA2 = new Activity("leafA2", "Leaf A2");
    leafMid = new Activity("leafMid", "Leaf Mid");
    leafB1 = new Activity("leafB1", "Leaf B1");

    clusterA.addChild(leafA1);
    clusterA.addChild(leafA2);
    clusterMid.addChild(leafMid);
    clusterB.addChild(leafB1);
    root.addChild(clusterA);
    root.addChild(clusterMid);
    root.addChild(clusterB);

    root.sequencingControls.choice = true;
    clusterA.sequencingControls.choice = true;
    clusterMid.sequencingControls.choice = true;
    clusterB.sequencingControls.choice = true;
    leafA1.sequencingControls.choice = true;
    leafA2.sequencingControls.choice = true;
    leafMid.sequencingControls.choice = true;
    leafB1.sequencingControls.choice = true;

    root.initialize();

    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overall = new OverallSequencingProcess(activityTree, sequencingProcess, rollupProcess);
  });

  it("blocks choice outside constrained branch", () => {
    root.sequencingControls.constrainChoice = true;

    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafB1.id);

    expect(result.valid).toBe(false);
    expect(result.exception).toBe("NB.2.1-11");
  });

  it("allows choice within constrained branch", () => {
    root.sequencingControls.constrainChoice = true;

    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafA2.id);

    expect(result.valid).toBe(true);
    expect(result.targetActivity).toBe(leafA2);
  });

  it("blocks backward choice when ancestor is forward-only", () => {
    clusterA.sequencingControls.forwardOnly = true;
    activityTree.currentActivity = leafA2;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafA1.id);

    expect(result.valid).toBe(false);
    expect(result.exception).toBe("NB.2.1-8");
  });

  it("blocks choice to an activity disabled by precondition rules", () => {
    const disableRule = new SequencingRule(RuleActionType.DISABLED);
    disableRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
    leafA2.sequencingRules.addPreConditionRule(disableRule);

    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafA2.id);

    expect(result.valid).toBe(false);
    expect(result.exception).toBe("NB.2.1-11");
  });

  it("blocks choice past stop-forward traversal boundary", () => {
    leafA1.sequencingControls.stopForwardTraversal = true;
    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafA2.id);

    expect(result.valid).toBe(false);
    expect(result.exception).toBe("NB.2.1-11");
  });

  it("blocks branch switch when preventActivation is set on ancestor", () => {
    root.sequencingControls.preventActivation = true;
    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafB1.id);

    expect(result.valid).toBe(false);
    expect(result.exception).toBe("NB.2.1-11");
  });

  it("allows choice into a branch with an active attempt when preventActivation is set", () => {
    root.sequencingControls.preventActivation = true;
    activityTree.currentActivity = leafA1;

    (clusterMid as any).mandatory = false;
    clusterMid.isCompleted = true;
    clusterMid.completionStatus = "completed";

    leafB1.isActive = true;
    leafB1.activityAttemptActive = true;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafB1.id);

    expect(result.valid).toBe(true);
    expect(result.targetActivity).toBe(leafB1);
  });

  it("blocks sibling choice when preventActivation is set on cluster", () => {
    clusterA.sequencingControls.preventActivation = true;
    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafA2.id);

    expect(result.valid).toBe(false);
    expect(result.exception).toBe("NB.2.1-11");
  });

  it("allows choice past sibling skipped by precondition rule", () => {
    const skipRule = new SequencingRule(RuleActionType.SKIP);
    skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
    clusterMid.sequencingRules.addPreConditionRule(skipRule);

    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafB1.id);

    expect(result.valid).toBe(true);
    expect(result.targetActivity).toBe(leafB1);
  });

  it("allows choice past sibling hidden from choice", () => {
    clusterMid.isHiddenFromChoice = true;
    activityTree.currentActivity = leafA1;

    const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, leafB1.id);

    expect(result.valid).toBe(true);
    expect(result.targetActivity).toBe(leafB1);
  });
});
