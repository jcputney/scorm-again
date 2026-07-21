import { describe, expect, it } from "vitest";
import { Activity, ActivityObjective } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import {
  GlobalObjective,
  GlobalObjectiveSynchronizer,
} from "../../../../../src/cmi/scorm2004/sequencing/objectives/global_objective_synchronizer";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionOperator,
  RuleConditionType,
  SequencingRule,
} from "../../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { CompletionStatus } from "../../../../../src/constants/enums";

describe("GlobalObjectiveSynchronizer tri-state regression", () => {
  it("propagates satisfied status knowledge to read-mapped objectives before rule evaluation", () => {
    const root = new Activity("root", "Course");
    const writerActivity = new Activity("sco_1", "SCO 1");
    const readerActivity = new Activity("sco_2", "SCO 2");
    root.addChild(writerActivity);
    root.addChild(readerActivity);

    const writerObjective = new ActivityObjective("sco_1_satisfied");
    writerObjective.mapInfo = [
      {
        targetObjectiveID: "sco_1_global",
        writeSatisfiedStatus: true,
        readSatisfiedStatus: false,
        writeNormalizedMeasure: false,
        readNormalizedMeasure: false,
        writeCompletionStatus: false,
        readCompletionStatus: false,
        writeProgressMeasure: false,
        readProgressMeasure: false,
        updateAttemptData: false,
      },
    ];
    writerObjective.satisfiedStatus = true;
    writerObjective.satisfiedStatusKnown = true;
    writerObjective.progressStatus = true;
    writerObjective.measureStatus = true;
    writerActivity.addObjective(writerObjective);

    const readerObjective = new ActivityObjective("previous_sco_satisfied");
    readerObjective.mapInfo = [
      {
        targetObjectiveID: "sco_1_global",
        writeSatisfiedStatus: false,
        readSatisfiedStatus: true,
        writeNormalizedMeasure: false,
        readNormalizedMeasure: false,
        writeCompletionStatus: false,
        readCompletionStatus: false,
        writeProgressMeasure: false,
        readProgressMeasure: false,
        updateAttemptData: false,
      },
    ];
    readerActivity.addObjective(readerObjective);

    const globalObjectives = new Map<string, GlobalObjective>();
    new GlobalObjectiveSynchronizer().processGlobalObjectiveMapping(root, globalObjectives);

    expect(globalObjectives.get("sco_1_global")?.satisfiedStatus).toBe(true);
    expect(globalObjectives.get("sco_1_global")?.satisfiedStatusKnown).toBe(true);
    expect(readerObjective.satisfiedStatus).toBe(true);
    expect(readerObjective.satisfiedStatusKnown).toBe(true);
    expect(readerObjective.progressStatus).toBe(true);

    const notSatisfied = new RuleCondition(
      RuleConditionType.SATISFIED,
      RuleConditionOperator.NOT,
    );
    notSatisfied.referencedObjective = "previous_sco_satisfied";
    const notObjectiveStatusKnown = new RuleCondition(
      RuleConditionType.OBJECTIVE_STATUS_KNOWN,
      RuleConditionOperator.NOT,
    );
    notObjectiveStatusKnown.referencedObjective = "previous_sco_satisfied";

    const disabledRule = new SequencingRule(RuleActionType.DISABLED, RuleConditionOperator.OR);
    disabledRule.addCondition(notSatisfied);
    disabledRule.addCondition(notObjectiveStatusKnown);
    readerActivity.sequencingRules.addPreConditionRule(disabledRule);

    expect(disabledRule.evaluate(readerActivity)).toBe(false);
    expect(readerActivity.sequencingRules.evaluatePreConditionRules(readerActivity)).toBe(null);
  });

  it("propagates satisfaction knowledge when satisfaction is derived from a known global measure", () => {
    const activity = new Activity("sco_2", "SCO 2");
    const objective = new ActivityObjective("measure_based_satisfied", {
      satisfiedByMeasure: true,
      minNormalizedMeasure: 0.8,
    });
    objective.mapInfo = [
      {
        targetObjectiveID: "measure_global",
        writeSatisfiedStatus: false,
        readSatisfiedStatus: false,
        writeNormalizedMeasure: false,
        readNormalizedMeasure: true,
        writeCompletionStatus: false,
        readCompletionStatus: false,
        writeProgressMeasure: false,
        readProgressMeasure: false,
        updateAttemptData: false,
      },
    ];
    activity.addObjective(objective);

    const globalObjectives = new Map<string, GlobalObjective>([
      [
        "measure_global",
        {
          id: "measure_global",
          satisfiedStatus: false,
          satisfiedStatusKnown: false,
          normalizedMeasure: 0.9,
          normalizedMeasureKnown: true,
          progressMeasure: 0,
          progressMeasureKnown: false,
          completionStatus: CompletionStatus.UNKNOWN,
          completionStatusKnown: false,
          satisfiedByMeasure: true,
          minNormalizedMeasure: 0.8,
        },
      ],
    ]);

    new GlobalObjectiveSynchronizer().syncGlobalObjectivesReadPhase(activity, globalObjectives);

    expect(objective.normalizedMeasure).toBe(0.9);
    expect(objective.measureStatus).toBe(true);
    expect(objective.satisfiedStatus).toBe(true);
    expect(objective.satisfiedStatusKnown).toBe(true);
    expect(objective.progressStatus).toBe(true);
  });
});
