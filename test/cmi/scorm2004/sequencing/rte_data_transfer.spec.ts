/**
 * RTE Data Transfer Tests
 *
 * Tests for full RTE data transfer implementation including:
 * - Primary objective data transfer
 * - Non-primary objective data transfer
 * - Change tracking for global objective protection
 * - Score normalization (ScaleRawScore)
 * - 4th Edition specific behavior
 */

import { beforeEach, describe, expect, it } from "vitest";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  CMIDataForTransfer,
  OverallSequencingProcess,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { CompletionStatus } from "../../../../src/constants/enums";
import { RteDataTransferService } from "../../../../src/cmi/scorm2004/sequencing/handlers/rte_data_transfer";

describe("RTE Data Transfer", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overallSequencingProcess: OverallSequencingProcess;
  let rootActivity: Activity;
  let leafActivity: Activity;

  beforeEach(() => {
    // Create activity tree
    rootActivity = new Activity("root", "Root Activity");
    leafActivity = new Activity("leaf1", "Leaf Activity 1");
    rootActivity.addChild(leafActivity);

    activityTree = new ActivityTree();
    activityTree.root = rootActivity;
    activityTree.currentActivity = leafActivity;

    // Initialize activities
    rootActivity.initialize();
    leafActivity.initialize();

    // Create primary objective for leaf activity
    const primaryObjective = new ActivityObjective("primary_obj", {
      isPrimary: true,
      satisfiedByMeasure: true,
      minNormalizedMeasure: 0.7,
    });
    leafActivity.primaryObjective = primaryObjective;

    // Make leaf activity active for testing
    leafActivity.isActive = true;
    leafActivity.activityAttemptActive = true;

    // Create sequencing processes
    rollupProcess = new RollupProcess();
    sequencingProcess = new SequencingProcess(
      activityTree,
      rootActivity.sequencingRules,
      rootActivity.sequencingControls,
    );
  });

  describe("Primary Objective Data Transfer", () => {
    it("should transfer completion status from CMI to activity", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "completed",
        success_status: "unknown",
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      // Trigger data transfer via endAttemptProcess (internal method tested via navigation)
      const navResult = overallSequencingProcess.processNavigationRequest("exit" as any, null);

      expect(leafActivity.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(leafActivity.attemptProgressStatus).toBe(true);
    });

    it("should transfer success status from CMI to activity", () => {
      leafActivity.primaryObjective!.satisfiedByMeasure = false;
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "passed",
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      expect(leafActivity.objectiveSatisfiedStatus).toBe(true);
      expect(leafActivity.successStatus).toBe("passed");
      expect(leafActivity.primaryObjective?.satisfiedStatus).toBe(true);
      expect(leafActivity.primaryObjective?.progressStatus).toBe(true);
    });

    it("should derive measure-controlled satisfaction using the default threshold", () => {
      leafActivity.primaryObjective!.minNormalizedMeasure = null;
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });

      // @spec SCORM 2004 4th Ed. SN 3.10 Objective Description - direct
      // success is ignored and the default minimum normalized measure is 1.0.
      transfer.transferPrimaryObjective(leafActivity, {
        completion_status: "unknown",
        success_status: "passed",
        score: { scaled: "0.85" },
      });

      expect(leafActivity.primaryObjective?.satisfiedStatus).toBe(false);
      expect(leafActivity.primaryObjective?.satisfiedStatusKnown).toBe(true);
      expect(leafActivity.successStatus).toBe("failed");
    });

    it("should leave measure-controlled satisfaction unknown without a measure", () => {
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });

      transfer.transferPrimaryObjective(leafActivity, {
        completion_status: "unknown",
        success_status: "passed",
      });

      expect(leafActivity.primaryObjective?.satisfiedStatusKnown).toBe(false);
      expect(leafActivity.primaryObjective?.progressStatus).toBe(false);
      expect(leafActivity.successStatus).toBe("unknown");
    });

    it("should transfer scaled score from CMI to activity", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          scaled: "0.85",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      expect(leafActivity.objectiveNormalizedMeasure).toBe(0.85);
      expect(leafActivity.objectiveMeasureStatus).toBe(true);
      expect(leafActivity.primaryObjective?.normalizedMeasure).toBe(0.85);
      expect(leafActivity.primaryObjective?.measureStatus).toBe(true);
    });

    it("should transfer progress measure from CMI to activity", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        progress_measure: "0.75",
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      expect(leafActivity.progressMeasure).toBe(0.75);
      expect(leafActivity.progressMeasureStatus).toBe(true);
      expect(leafActivity.primaryObjective?.progressMeasure).toBe(0.75);
      expect(leafActivity.primaryObjective?.progressMeasureStatus).toBe(true);
    });
  });

  describe("Non-Primary Objective Data Transfer", () => {
    it("should transfer multiple objective data by ID matching", () => {
      // Add additional objectives to activity
      const objective1 = new ActivityObjective("obj1", { isPrimary: false });
      const objective2 = new ActivityObjective("obj2", { isPrimary: false });
      leafActivity.addObjective(objective1);
      leafActivity.addObjective(objective2);

      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "obj1",
            success_status: "passed",
            completion_status: "completed",
            score: { scaled: "0.9" },
          },
          {
            id: "obj2",
            success_status: "failed",
            completion_status: "incomplete",
            score: { scaled: "0.4" },
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Verify objective 1
      const obj1 = leafActivity.getObjectiveById("obj1");
      expect(obj1).not.toBeNull();
      expect(obj1?.objective.satisfiedStatus).toBe(true);
      expect(obj1?.objective.progressStatus).toBe(true);
      expect(obj1?.objective.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(obj1?.objective.normalizedMeasure).toBe(0.9);
      expect(obj1?.objective.measureStatus).toBe(true);

      // Verify objective 2
      const obj2 = leafActivity.getObjectiveById("obj2");
      expect(obj2).not.toBeNull();
      expect(obj2?.objective.satisfiedStatus).toBe(false);
      expect(obj2?.objective.progressStatus).toBe(true);
      expect(obj2?.objective.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(obj2?.objective.normalizedMeasure).toBe(0.4);
      expect(obj2?.objective.measureStatus).toBe(true);
    });

    it("should skip objectives not found in activity", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "non_existent",
            success_status: "passed",
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      // Should not throw error
      expect(() => {
        overallSequencingProcess.processNavigationRequest("exit" as any, null);
      }).not.toThrow();
    });

    it("should transfer matching primary objective data via objectives array", () => {
      leafActivity.primaryObjective!.satisfiedByMeasure = false;
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "primary_obj",
            success_status: "failed",
            completion_status: "completed",
            score: {
              raw: "256.78",
              min: "254",
              max: "0.8",
            },
            progress_measure: "0.5",
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3 - cmi.objectives.n
      // entries matched to the activity primary objective transfer into the
      // primary objective state used by objective maps.
      expect(leafActivity.primaryObjective?.satisfiedStatus).toBe(false);
      expect(leafActivity.primaryObjective?.progressStatus).toBe(true);
      expect(leafActivity.primaryObjective?.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(leafActivity.primaryObjective?.rawScore).toBe("256.78");
      expect(leafActivity.primaryObjective?.minScore).toBe("254");
      expect(leafActivity.primaryObjective?.maxScore).toBe("0.8");
      expect(leafActivity.primaryObjective?.progressMeasure).toBe(0.5);
      expect(leafActivity.successStatus).toBe("failed");
    });

    it("should transfer not attempted as known incomplete sequencing state", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "primary_obj",
            completion_status: "not attempted",
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // @spec SCORM 2004 4th Ed. RTE-to-SN Data Transfer - "not attempted"
      // is known false in sequencing's completion model, so UP.4 must not
      // auto-complete the activity after content reports that status.
      expect(leafActivity.primaryObjective?.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(leafActivity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(leafActivity.attemptProgressStatus).toBe(true);
      expect(leafActivity.wasAutoCompleted).toBe(false);
    });

    it("should clear a previously known objective completion status", () => {
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });
      const primaryObjective = leafActivity.primaryObjective!;

      primaryObjective.applyReadMappedState({
        completionStatus: CompletionStatus.INCOMPLETE,
      });
      primaryObjective.applyToActivity(leafActivity);
      leafActivity.attemptProgressStatus = true;

      transfer.transferNonPrimaryObjectives(leafActivity, {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "primary_obj",
            completion_status: "unknown",
            completion_status_was_set: true,
          },
        ],
      });

      // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3 - a SCO can
      // replace a read-mapped known completion status with unknown.
      expect(primaryObjective.completionStatus).toBe(CompletionStatus.UNKNOWN);
      expect(primaryObjective.isDirty("completionStatus")).toBe(true);
      expect(leafActivity.completionStatus).toBe(CompletionStatus.UNKNOWN);
      expect(leafActivity.attemptProgressStatus).toBe(false);
    });

    it("should clear a previously known objective satisfaction status", () => {
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });
      const primaryObjective = leafActivity.primaryObjective!;
      primaryObjective.satisfiedByMeasure = false;

      primaryObjective.applyReadMappedState({
        satisfiedStatus: true,
        normalizedMeasure: 0.6,
      });
      primaryObjective.applyToActivity(leafActivity);

      transfer.transferNonPrimaryObjectives(leafActivity, {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "primary_obj",
            success_status: "unknown",
            success_status_was_set: true,
            score: {
              scaled: "0.8",
            },
          },
        ],
      });

      // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3 - a SCO can
      // replace a read-mapped known satisfied status with unknown without
      // clearing an independently supplied objective measure.
      expect(primaryObjective.satisfiedStatusKnown).toBe(false);
      expect(primaryObjective.progressStatus).toBe(false);
      expect(primaryObjective.isDirty("satisfiedStatus")).toBe(true);
      expect(primaryObjective.normalizedMeasure).toBe(0.8);
      expect(primaryObjective.measureStatus).toBe(true);
      expect(leafActivity.objectiveSatisfiedStatusKnown).toBe(false);
      expect(leafActivity.successStatus).toBe("unknown");
    });

    it("should not let a launch-seeded primary objective override top-level content status", () => {
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });
      leafActivity.primaryObjective!.satisfiedByMeasure = false;
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "failed",
        objectives: [
          {
            id: "primary_obj",
            success_status: "passed",
            success_status_was_set: false,
          },
        ],
      };

      transfer.transferPrimaryObjective(leafActivity, cmiData);
      transfer.transferNonPrimaryObjectives(leafActivity, cmiData);

      // @spec SCORM 2004 4th Ed. RTE 4.2.17 - initialization of a primary
      // cmi.objectives row is not a SCO write and cannot override a later
      // top-level cmi.success_status write during RTE-to-SN transfer.
      expect(leafActivity.primaryObjective?.satisfiedStatus).toBe(false);
      expect(leafActivity.primaryObjective?.satisfiedStatusKnown).toBe(true);
      expect(leafActivity.primaryObjective?.progressStatus).toBe(true);
      expect(leafActivity.successStatus).toBe("failed");
    });

    it("should retain a launch-seeded primary status when content leaves both views untouched", () => {
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });
      leafActivity.primaryObjective!.satisfiedByMeasure = false;
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        success_status_was_set: false,
        objectives: [
          {
            id: "primary_obj",
            success_status: "failed",
            success_status_was_set: false,
          },
        ],
      };

      transfer.transferPrimaryObjective(leafActivity, cmiData);
      transfer.transferNonPrimaryObjectives(leafActivity, cmiData);

      // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3 - a value
      // initialized through a read map remains the activity objective value
      // written at End Attempt unless content replaces the primary RTE view.
      expect(leafActivity.primaryObjective?.satisfiedStatus).toBe(false);
      expect(leafActivity.primaryObjective?.satisfiedStatusKnown).toBe(true);
      expect(leafActivity.primaryObjective?.progressStatus).toBe(true);
      expect(leafActivity.successStatus).toBe("failed");
    });

    it("should retain a launch-seeded non-primary status for write mapping", () => {
      const transfer = new RteDataTransferService({
        getCMIData: null,
        fireEvent: () => undefined,
      });
      const objective = new ActivityObjective("mapped_obj", {
        isPrimary: false,
        satisfiedByMeasure: false,
      });
      leafActivity.addObjective(objective);

      transfer.transferNonPrimaryObjectives(leafActivity, {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "mapped_obj",
            success_status: "passed",
            success_status_was_set: false,
          },
        ],
      });

      // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3 - read and write
      // mappings may be combined, so an unchanged read-mapped value remains
      // available to the objective's write maps at End Attempt.
      expect(objective.satisfiedStatus).toBe(true);
      expect(objective.satisfiedStatusKnown).toBe(true);
      expect(objective.progressStatus).toBe(true);
    });

    it("should not auto-satisfy after content explicitly reports unknown", () => {
      leafActivity.primaryObjective!.satisfiedByMeasure = false;
      leafActivity.sequencingControls.objectiveSetByContent = false;
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "primary_obj",
            success_status: "unknown",
            success_status_was_set: true,
            score: {
              scaled: "-0.4",
            },
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // @spec SCORM 2004 4th Ed. SN 3.13.3 / RTE 4.2.17 - the default
      // objectiveSetByContent=false auto-satisfies only when the SCO does not
      // communicate success information; an explicit unknown is communication.
      expect(leafActivity.primaryObjective?.satisfiedStatusKnown).toBe(false);
      expect(leafActivity.primaryObjective?.progressStatus).toBe(false);
      expect(leafActivity.primaryObjective?.measureStatus).toBe(true);
      expect(leafActivity.primaryObjective?.normalizedMeasure).toBe(-0.4);
      expect(leafActivity.successStatus).toBe("unknown");
      expect(leafActivity.wasAutoSatisfied).toBe(false);
    });

    it("should auto-satisfy when content reports a measure without success information", () => {
      leafActivity.primaryObjective!.satisfiedByMeasure = false;
      leafActivity.sequencingControls.objectiveSetByContent = false;
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score_was_set: true,
        score: {
          scaled: "-0.25",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // @spec SCORM 2004 4th Ed. TR OB-04 and SN UP.4 - a score provides
      // objective measure information, not objective satisfaction information.
      // With objectiveSetByContent=false, the sequencer supplies the missing
      // satisfied status while preserving the content-provided measure.
      expect(leafActivity.primaryObjective?.progressStatus).toBe(true);
      expect(leafActivity.primaryObjective?.satisfiedStatus).toBe(true);
      expect(leafActivity.primaryObjective?.measureStatus).toBe(true);
      expect(leafActivity.primaryObjective?.normalizedMeasure).toBe(-0.25);
      expect(leafActivity.successStatus).toBe("passed");
      expect(leafActivity.wasAutoSatisfied).toBe(true);
    });
  });

  describe("Score Normalization (ScaleRawScore)", () => {
    it("should use scaled score if available", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          scaled: "0.85",
          raw: "50",
          min: "0",
          max: "100",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should use scaled score directly
      expect(leafActivity.objectiveNormalizedMeasure).toBe(0.85);
    });

    it("should calculate scaled from raw/min/max when scaled not available", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          raw: "75",
          min: "0",
          max: "100",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should calculate: (75 - 0) / (100 - 0) = 0.75
      expect(leafActivity.objectiveNormalizedMeasure).toBe(0.75);
      expect(leafActivity.objectiveMeasureStatus).toBe(true);
    });

    it("should handle non-zero minimum scores", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          raw: "50",
          min: "20",
          max: "80",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should calculate: (50 - 20) / (80 - 20) = 30 / 60 = 0.5
      expect(leafActivity.objectiveNormalizedMeasure).toBe(0.5);
    });

    it("should clamp normalized score to [-1, 1] range", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          raw: "150",
          min: "0",
          max: "100",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should calculate 1.5 but clamp to 1.0
      expect(leafActivity.objectiveNormalizedMeasure).toBe(1);
    });

    it("should not normalize if min equals max", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          raw: "50",
          min: "50",
          max: "50",
        },
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should not set normalized measure (division by zero)
      expect(leafActivity.objectiveMeasureStatus).toBe(false);
    });

    it("should normalize scores for non-primary objectives", () => {
      const objective1 = new ActivityObjective("obj1", { isPrimary: false });
      leafActivity.addObjective(objective1);

      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "obj1",
            score: {
              raw: "80",
              min: "0",
              max: "100",
            },
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      const obj1 = leafActivity.getObjectiveById("obj1");
      expect(obj1?.objective.normalizedMeasure).toBe(0.8);
      expect(obj1?.objective.measureStatus).toBe(true);
    });
  });

  describe("Change Tracking and Global Objective Protection", () => {
    it("should only transfer changed values during runtime", () => {
      // This test verifies that unchanged CMI values don't overwrite global objectives
      // The current implementation transfers all non-unknown values
      // More sophisticated change tracking could be added in the future

      const objective1 = new ActivityObjective("global_obj", { isPrimary: false });
      objective1.satisfiedStatus = true; // Pre-existing global objective status
      leafActivity.addObjective(objective1);

      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "global_obj",
            success_status: "unknown", // Unchanged/unknown should not overwrite
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Objective status should remain true (not overwritten by "unknown")
      const obj = leafActivity.getObjectiveById("global_obj");
      expect(obj?.objective.satisfiedStatus).toBe(true);
    });
  });

  describe("Integration with endAttemptProcess", () => {
    it("should transfer data before auto-completion logic", () => {
      // If content sets completion, it should be transferred BEFORE auto-completion
      leafActivity.sequencingControls.completionSetByContent = false; // Auto-completion enabled

      const cmiData: CMIDataForTransfer = {
        completion_status: "incomplete", // Content set incomplete
        success_status: "unknown",
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should respect content's incomplete status, not auto-complete to completed
      expect(leafActivity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(leafActivity.attemptProgressStatus).toBe(true);
      expect(leafActivity.wasAutoCompleted).toBe(false);
    });

    it("should allow auto-completion when CMI data is unknown", () => {
      leafActivity.sequencingControls.completionSetByContent = false;

      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown", // Content didn't set
        success_status: "unknown",
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      overallSequencingProcess.processNavigationRequest("exit" as any, null);

      // Should auto-complete since content didn't set it
      expect(leafActivity.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(leafActivity.wasAutoCompleted).toBe(true);
    });
  });

  describe("No CMI Data Provider", () => {
    it("should handle missing getCMIData callback gracefully", () => {
      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          // No getCMIData callback provided
        },
      );

      // Should not throw error
      expect(() => {
        overallSequencingProcess.processNavigationRequest("exit" as any, null);
      }).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty score objects", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {}, // Empty score
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      expect(() => {
        overallSequencingProcess.processNavigationRequest("exit" as any, null);
      }).not.toThrow();
    });

    it("should handle empty objectives array", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      expect(() => {
        overallSequencingProcess.processNavigationRequest("exit" as any, null);
      }).not.toThrow();
    });

    it("should handle objectives with missing IDs", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        objectives: [
          {
            id: "", // Missing ID
            success_status: "passed",
          },
        ],
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      expect(() => {
        overallSequencingProcess.processNavigationRequest("exit" as any, null);
      }).not.toThrow();
    });

    it("should handle invalid numeric values gracefully", () => {
      const cmiData: CMIDataForTransfer = {
        completion_status: "unknown",
        success_status: "unknown",
        score: {
          scaled: "not-a-number",
          raw: "invalid",
          min: "bad",
          max: "worse",
        },
        progress_measure: "NaN",
      };

      overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        null,
        null,
        {
          getCMIData: () => cmiData,
        },
      );

      expect(() => {
        overallSequencingProcess.processNavigationRequest("exit" as any, null);
      }).not.toThrow();

      // Should not set invalid values
      expect(leafActivity.objectiveMeasureStatus).toBe(false);
      expect(leafActivity.progressMeasureStatus).toBe(false);
    });
  });

  describe("ActivityObjective initializeFromCMI method", () => {
    it("should mark satisfiedStatus as dirty even when set to default value (false)", () => {
      const objective = new ActivityObjective("test_obj", { isPrimary: false });

      // Initially not dirty
      expect(objective.isDirty("satisfiedStatus")).toBe(false);
      expect(objective.satisfiedStatus).toBe(false);

      // Use initializeFromCMI to set to false (the default)
      objective.initializeFromCMI(false, 0, true);

      // Should be marked dirty even though value matches default
      expect(objective.isDirty("satisfiedStatus")).toBe(true);
      expect(objective.satisfiedStatus).toBe(false);
    });

    it("should mark normalizedMeasure as dirty even when set to default value (0)", () => {
      const objective = new ActivityObjective("test_obj", { isPrimary: false });

      // Initially not dirty
      expect(objective.isDirty("normalizedMeasure")).toBe(false);
      expect(objective.normalizedMeasure).toBe(0);

      // Use initializeFromCMI to set to 0 (the default)
      objective.initializeFromCMI(false, 0, true);

      // Should be marked dirty even though value matches default
      expect(objective.isDirty("normalizedMeasure")).toBe(true);
      expect(objective.normalizedMeasure).toBe(0);
    });

    it("should set measureStatus from parameter", () => {
      const objective = new ActivityObjective("test_obj", { isPrimary: false });

      expect(objective.measureStatus).toBe(false);

      objective.initializeFromCMI(true, 0.8, true);

      expect(objective.measureStatus).toBe(true);
    });

    it("should set both satisfiedStatus and normalizedMeasure together", () => {
      const objective = new ActivityObjective("test_obj", { isPrimary: false });

      objective.initializeFromCMI(true, 0.75, true);

      expect(objective.satisfiedStatus).toBe(true);
      expect(objective.normalizedMeasure).toBe(0.75);
      expect(objective.measureStatus).toBe(true);
      expect(objective.isDirty("satisfiedStatus")).toBe(true);
      expect(objective.isDirty("normalizedMeasure")).toBe(true);
    });

    it("should set measureStatus to false when parameter is false", () => {
      const objective = new ActivityObjective("test_obj", { isPrimary: false });
      objective.initializeFromCMI(true, 0.8, true);
      expect(objective.measureStatus).toBe(true);

      objective.initializeFromCMI(false, 0, false);
      expect(objective.measureStatus).toBe(false);
    });
  });
});
