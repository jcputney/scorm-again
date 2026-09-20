import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupChildFilter } from "../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import { ObjectiveRollupProcessor } from "../../../../src/cmi/scorm2004/sequencing/rollup/objective_rollup";
import { ProgressRollupProcessor } from "../../../../src/cmi/scorm2004/sequencing/rollup/progress_rollup";
import { CompletionStatus } from "../../../../src/constants/enums";

/**
 * Regression coverage for the default activity progress rollup subprocess
 * (RB.1.3) collapsing an unknown child completion status into "incomplete".
 *
 * @spec SN Book: RB.1.3 (Activity Progress Rollup Using Default: completed if
 * all children completed, incomplete if any child incomplete - unknown does
 * not count as either)
 */
describe("Activity Progress Rollup Using Default (RB.1.3)", () => {
  let processor: ProgressRollupProcessor;
  let parent: Activity;
  let child1: Activity;
  let child2: Activity;
  let child3: Activity;

  beforeEach(() => {
    const childFilter = new RollupChildFilter();
    const ruleEvaluator = new RollupRuleEvaluator(childFilter);
    const objectiveProcessor = new ObjectiveRollupProcessor(childFilter, ruleEvaluator);
    processor = new ProgressRollupProcessor(childFilter, ruleEvaluator, objectiveProcessor);

    parent = new Activity("parent", "Parent");
    child1 = new Activity("child1", "Child 1");
    child2 = new Activity("child2", "Child 2");
    child3 = new Activity("child3", "Child 3");

    parent.addChild(child1);
    parent.addChild(child2);
    parent.addChild(child3);

    parent.sequencingControls.rollupProgressCompletion = true;
  });

  it("leaves completionStatus untouched when every contributor is unknown (never attempted)", () => {
    // child1-3 are all untouched: CompletionStatus.UNKNOWN by construction.
    const priorStatus = parent.completionStatus;

    processor.activityProgressRollupProcess(parent);

    expect(parent.completionStatus).toBe(priorStatus);
    expect(parent.completionStatus).toBe(CompletionStatus.UNKNOWN);
  });

  it("rolls up to incomplete when one contributor is known-incomplete even though others are unknown", () => {
    child1.completionStatus = CompletionStatus.INCOMPLETE;
    // child2, child3 remain unknown.

    processor.activityProgressRollupProcess(parent);

    expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
  });

  it("rolls up to completed when all contributors are known and completed", () => {
    child1.completionStatus = CompletionStatus.COMPLETED;
    child2.completionStatus = CompletionStatus.COMPLETED;
    child3.completionStatus = CompletionStatus.COMPLETED;

    processor.activityProgressRollupProcess(parent);

    expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
  });

  it("leaves completionStatus untouched when some contributors are known-completed and the rest are unknown", () => {
    child1.completionStatus = CompletionStatus.COMPLETED;
    // child2, child3 remain unknown - not enough information to call it "completed".
    const priorStatus = parent.completionStatus;

    processor.activityProgressRollupProcess(parent);

    expect(parent.completionStatus).toBe(priorStatus);
  });
});
