import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingProcess,
  SequencingRequestType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";
import { SequencingService } from "../../../../src/services/SequencingService";
import { Sequencing } from "../../../../src/cmi/scorm2004/sequencing/sequencing";
import { CMI } from "../../../../src/cmi/scorm2004/cmi";
import { ADL } from "../../../../src/cmi/scorm2004/adl";
import { EventService } from "../../../../src/services/EventService";
import { LoggingService } from "../../../../src/services/LoggingService";

/**
 * Auto-Progress Integration Tests (REQ-NAV-058)
 *
 * These tests verify auto-progress on completion functionality, including:
 * 1. Auto-continue when post-condition rule triggers continue action
 * 2. Auto-progress setting configuration
 * 3. Integration with CMI completion status changes
 */
describe("Auto-Progress Integration Tests (REQ-NAV-058)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overallSequencingProcess: OverallSequencingProcess;
  let rootActivity: Activity;
  let parentActivity: Activity;
  let childActivity1: Activity;
  let childActivity2: Activity;
  let childActivity3: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();

    // Create activities
    rootActivity = new Activity("root", "Root Activity");
    parentActivity = new Activity("parent", "Parent Activity");
    childActivity1 = new Activity("child1", "Child 1");
    childActivity2 = new Activity("child2", "Child 2");
    childActivity3 = new Activity("child3", "Child 3");

    // Build tree structure
    rootActivity.addChild(parentActivity);
    parentActivity.addChild(childActivity1);
    parentActivity.addChild(childActivity2);
    parentActivity.addChild(childActivity3);

    // Set root
    activityTree.root = rootActivity;

    // Initialize processes
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overallSequencingProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess
    );
  });

  describe("Post-Condition Continue Action Auto-Progress", () => {
    it("should trigger continue request when activity completes with continue post-condition rule", () => {
      // Add post-condition rule to auto-continue when completed
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Mark activity as completed
      childActivity1.completionStatus = CompletionStatus.COMPLETED;

      // Evaluate post-condition rules
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return continue request for auto-progress
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
      expect(result.terminationRequest).toBeNull();
    });

    it("should NOT trigger continue when activity is incomplete", () => {
      // Add post-condition rule to auto-continue when completed
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Activity is NOT completed
      childActivity1.completionStatus = CompletionStatus.INCOMPLETE;

      // Evaluate post-condition rules
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should NOT return continue request
      expect(result.sequencingRequest).toBeNull();
      expect(result.terminationRequest).toBeNull();
    });

    it("should trigger continue on completion even with unknown initial status", () => {
      // Add post-condition rule
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Start with unknown status
      childActivity1.completionStatus = CompletionStatus.UNKNOWN;
      let result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // Change to completed
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should now trigger continue
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should trigger continue when activity is satisfied with objective-based rule", () => {
      // Add post-condition rule based on satisfaction
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Mark activity as passed/satisfied
      childActivity1.successStatus = SuccessStatus.PASSED;

      // Evaluate post-condition rules
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return continue request
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should handle combined completion and satisfaction conditions for auto-progress", () => {
      // Create rule that requires BOTH completed AND satisfied
      const continueRule = new SequencingRule(RuleActionType.CONTINUE, "all");
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      continueRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Only completed, not satisfied
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      childActivity1.successStatus = SuccessStatus.FAILED;
      let result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // Both completed and satisfied
      childActivity1.successStatus = SuccessStatus.PASSED;
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });
  });

  describe("Auto-Progress Configuration", () => {
    let sequencing: Sequencing;
    let cmi: CMI;
    let adl: ADL;
    let eventService: EventService;
    let loggingService: LoggingService;

    beforeEach(() => {
      sequencing = new Sequencing();
      sequencing.activityTree.root = rootActivity;
      cmi = new CMI();
      adl = new ADL();
      eventService = new EventService();
      loggingService = new LoggingService();
    });

    it("should support autoProgressOnCompletion setting in SequencingService", () => {
      // Create sequencing service with auto-progress enabled
      // The configuration is validated at construction time
      expect(() => {
        new SequencingService(sequencing, cmi, adl, eventService, loggingService, {
          autoProgressOnCompletion: true,
          autoRollupOnCMIChange: true,
          validateNavigationRequests: true
        });
      }).not.toThrow();
    });

    it("should support autoProgressOnCompletion configuration with default values", () => {
      // Create sequencing service without specifying auto-progress
      // The default value for autoProgressOnCompletion is false
      expect(() => {
        new SequencingService(sequencing, cmi, adl, eventService, loggingService, {});
      }).not.toThrow();
    });

    it("should allow runtime configuration updates via updateConfiguration", () => {
      // Create sequencing service
      const sequencingService = new SequencingService(sequencing, cmi, adl, eventService, loggingService, {
        autoProgressOnCompletion: false
      });

      // Update configuration - updateConfiguration is the public API
      expect(() => {
        sequencingService.updateConfiguration({
          autoProgressOnCompletion: true
        });
      }).not.toThrow();

      // Configuration update should be logged (verifiable via logs if needed)
    });
  });

  describe("Integration with Termination Request Process", () => {
    it("should evaluate post-conditions during EXIT termination and return continue request", () => {
      // Setup activity with continue post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Setup activity state
      childActivity1.isActive = true;
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      activityTree.currentActivity = childActivity1;

      // Process EXIT termination
      const terminationResult = (overallSequencingProcess as any).terminationRequestProcess(
        SequencingRequestType.EXIT,
        false
      );

      // Should be valid and include the continue sequencing request from post-condition
      expect(terminationResult.valid).toBe(true);
      expect(terminationResult.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should handle post-condition continue after auto-completion", () => {
      // Setup for auto-completion
      childActivity1.sequencingControls.completionSetByContent = false;
      childActivity1.isActive = true;
      childActivity1.attemptProgressStatus = false; // Content didn't set completion

      // Add continue rule that triggers on completion
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      activityTree.currentActivity = childActivity1;

      // Execute end attempt (which auto-completes)
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, childActivity1);

      // Verify auto-completion occurred
      expect(childActivity1.completionStatus).toBe("completed");
      expect(childActivity1.wasAutoCompleted).toBe(true);

      // Now evaluate post-conditions
      const postResult = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should trigger continue after auto-completion
      expect(postResult.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should process continue request from post-condition in termination flow", () => {
      // Setup child with continue post-condition on completion
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      childActivity1.isActive = true;
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      activityTree.currentActivity = childActivity1;

      // Mock the termination request process
      const result = (overallSequencingProcess as any).handleExitTermination(
        childActivity1,
        false // no existing sequencing request
      );

      // Should include continue from post-condition
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
      expect(result.valid).toBe(true);
    });
  });

  describe("Post-Condition Loop with Continue Action", () => {
    it("should process continue in post-condition loop without triggering EXIT_PARENT", () => {
      // Setup: child has continue post-condition, parent does not
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      childActivity1.isActive = true;
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      activityTree.currentActivity = childActivity1;

      // Process termination
      const result = (overallSequencingProcess as any).terminationRequestProcess(
        SequencingRequestType.EXIT,
        false
      );

      // Should return continue, not EXIT_PARENT
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
      expect(result.terminationRequest).toBe(SequencingRequestType.EXIT);
      expect(result.valid).toBe(true);
    });

    it("should handle multiple activities with continue post-conditions in sequence", () => {
      // Setup all children with continue on completion
      const continueRule1 = new SequencingRule(RuleActionType.CONTINUE);
      continueRule1.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule1);

      const continueRule2 = new SequencingRule(RuleActionType.CONTINUE);
      continueRule2.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity2.sequencingRules.addPostConditionRule(continueRule2);

      const continueRule3 = new SequencingRule(RuleActionType.CONTINUE);
      continueRule3.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity3.sequencingRules.addPostConditionRule(continueRule3);

      // Test each activity in sequence
      for (const child of [childActivity1, childActivity2, childActivity3]) {
        child.isActive = true;
        child.completionStatus = CompletionStatus.COMPLETED;
        activityTree.currentActivity = child;

        const result = sequencingProcess.evaluatePostConditionRules(child);

        expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
        expect(result.terminationRequest).toBeNull();
      }
    });

    it("should prefer first matching post-condition rule (continue over retry)", () => {
      // Add multiple post-condition rules - continue first, then retry
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      const retryRule = new SequencingRule(RuleActionType.RETRY);
      retryRule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));
      childActivity1.sequencingRules.addPostConditionRule(retryRule);

      // Set both conditions to true
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      childActivity1.successStatus = SuccessStatus.PASSED;

      // Evaluate post-conditions
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should return first matching rule (continue)
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });
  });

  describe("CMI Completion Status Integration", () => {
    it("should trigger continue when CMI completion status changes to completed", () => {
      // Setup continue post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Initially incomplete
      childActivity1.completionStatus = CompletionStatus.INCOMPLETE;
      let result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // Simulate CMI data change to completed
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should now trigger continue
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should respect completionSetByContent setting for auto-progress", () => {
      // Setup activity with completionSetByContent=true (content must set status)
      childActivity1.sequencingControls.completionSetByContent = true;
      childActivity1.isActive = true;
      childActivity1.attemptProgressStatus = false; // Content hasn't set it

      // Add continue post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      activityTree.currentActivity = childActivity1;

      // End attempt without content setting completion
      const endAttemptProcess = (overallSequencingProcess as any).endAttemptProcess;
      endAttemptProcess.call(overallSequencingProcess, childActivity1);

      // Should default to incomplete (not auto-complete)
      expect(childActivity1.completionStatus).toBe("incomplete");

      // Post-condition should NOT trigger continue
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();
    });

    it("should handle progress_known condition for auto-progress eligibility", () => {
      // Setup rule that requires progress to be known
      const continueRule = new SequencingRule(RuleActionType.CONTINUE, "all");
      continueRule.addCondition(new RuleCondition(RuleConditionType.PROGRESS_KNOWN));
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Unknown progress status
      childActivity1.completionStatus = CompletionStatus.UNKNOWN;
      let result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // Known progress, but incomplete
      childActivity1.completionStatus = CompletionStatus.INCOMPLETE;
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // Known progress and completed
      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });
  });

  describe("Edge Cases and Complex Scenarios", () => {
    it("should handle continue action when activity has no parent (root level)", () => {
      // Setup root with continue post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      rootActivity.sequencingRules.addPostConditionRule(continueRule);

      rootActivity.completionStatus = CompletionStatus.COMPLETED;
      rootActivity.isActive = true;
      activityTree.currentActivity = rootActivity;

      // Evaluate - should handle gracefully even at root
      const result = sequencingProcess.evaluatePostConditionRules(rootActivity);

      // Continue request should still be generated
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should handle measure-based conditions for auto-progress", () => {
      // Setup rule based on objective measure
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      const measureCondition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN
      );
      measureCondition.parameters.set("threshold", 0.7);
      continueRule.addCondition(measureCondition);
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // Below threshold
      childActivity1.objectiveMeasureStatus = true;
      childActivity1.objectiveNormalizedMeasure = 0.6;
      let result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // Above threshold
      childActivity1.objectiveNormalizedMeasure = 0.8;
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should not auto-progress when post-condition evaluates to false", () => {
      // Setup continue rule with condition that will be false
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.NEVER));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      childActivity1.completionStatus = CompletionStatus.COMPLETED;

      // Evaluate post-conditions
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should not trigger continue with NEVER condition
      expect(result.sequencingRequest).toBeNull();
    });

    it("should handle attempt-based conditions for auto-progress", () => {
      // Setup rule based on attempt count
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      const attemptCondition = new RuleCondition(RuleConditionType.ATTEMPTED);
      continueRule.addCondition(attemptCondition);
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      // No attempts yet
      let result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBeNull();

      // After attempting
      childActivity1.incrementAttemptCount();
      result = sequencingProcess.evaluatePostConditionRules(childActivity1);
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should integrate with rollup processes when auto-progressing", () => {
      // Setup parent with rollup enabled
      parentActivity.sequencingControls.rollupProgressCompletion = true;
      parentActivity.sequencingControls.rollupObjectiveSatisfied = true;

      // Setup child with continue post-condition
      const continueRule = new SequencingRule(RuleActionType.CONTINUE);
      continueRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      childActivity1.sequencingRules.addPostConditionRule(continueRule);

      childActivity1.completionStatus = CompletionStatus.COMPLETED;
      childActivity1.successStatus = SuccessStatus.PASSED;

      // Perform rollup
      rollupProcess.overallRollupProcess(childActivity1);

      // Evaluate post-conditions
      const result = sequencingProcess.evaluatePostConditionRules(childActivity1);

      // Should trigger continue
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);

      // Parent should have rollup state updated
      expect(parentActivity.objectiveMeasureStatus).toBeDefined();
    });
  });
});
