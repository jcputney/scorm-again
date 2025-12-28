import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingProcess,
  SequencingRequestType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";

describe("Limit Conditions Check Process (UP.1)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rootActivity: Activity;
  let testActivity: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    sequencingProcess = new SequencingProcess(activityTree);

    // Create activities
    rootActivity = new Activity("root", "Root Activity");
    testActivity = new Activity("test", "Test Activity");

    // Build tree structure
    rootActivity.addChild(testActivity);

    // Set root
    activityTree.root = rootActivity;
  });

  describe("Attempt Limit", () => {
    it("should prevent delivery when attempt limit is reached", () => {
      // Set attempt limit
      testActivity.attemptLimit = 3;

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Attempt activity multiple times
      for (let i = 0; i < 3; i++) {
        testActivity.incrementAttemptCount();
      }

      // Try to deliver activity - should fail due to attempt limit
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should not deliver due to limit exceeded
      expect(result.deliveryRequest).toBe("doNotDeliver");
      expect(testActivity.attemptCount).toBe(3);
    });

    it("should allow delivery when under attempt limit", () => {
      // Set attempt limit
      testActivity.attemptLimit = 3;

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Attempt activity twice (under limit)
      testActivity.incrementAttemptCount();
      testActivity.incrementAttemptCount();

      // Try to deliver activity - should succeed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );


      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(testActivity);
    });

    it("should allow unlimited attempts when attemptLimit is null", () => {
      // No attempt limit set (null)
      testActivity.attemptLimit = null;

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Attempt activity many times
      for (let i = 0; i < 10; i++) {
        testActivity.incrementAttemptCount();
      }

      // Try to deliver activity - should succeed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(testActivity);
    });
  });

  describe("Attempt Absolute Duration Limit", () => {
    it("should prevent delivery when attempt duration limit is exceeded", () => {
      // Set attempt duration limit to 1 hour
      testActivity.attemptAbsoluteDurationLimit = "PT1H";

      // Set attempt experienced duration to 1 hour 30 minutes
      testActivity.attemptExperiencedDuration = "PT1H30M";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should fail due to duration limit
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should not deliver due to limit exceeded
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should allow delivery when under attempt duration limit", () => {
      // Set attempt duration limit to 2 hours
      testActivity.attemptAbsoluteDurationLimit = "PT2H";

      // Set attempt experienced duration to 1 hour
      testActivity.attemptExperiencedDuration = "PT1H";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should succeed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(testActivity);
    });

    it("should handle duration with seconds and decimals", () => {
      // Set attempt duration limit to 30 minutes
      testActivity.attemptAbsoluteDurationLimit = "PT30M";

      // Set attempt experienced duration to 29 minutes 59.5 seconds
      testActivity.attemptExperiencedDuration = "PT29M59.5S";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should succeed (just under limit)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(testActivity);
    });
  });

  describe("Activity Absolute Duration Limit", () => {
    it("should prevent delivery when activity duration limit is exceeded", () => {
      // Set activity duration limit to 5 hours
      testActivity.activityAbsoluteDurationLimit = "PT5H";

      // Set activity experienced duration to 6 hours
      testActivity.activityExperiencedDuration = "PT6H";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should fail due to duration limit
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should not deliver due to limit exceeded
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should allow delivery when under activity duration limit", () => {
      // Set activity duration limit to 10 hours
      testActivity.activityAbsoluteDurationLimit = "PT10H";

      // Set activity experienced duration to 5 hours
      testActivity.activityExperiencedDuration = "PT5H";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should succeed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(testActivity);
    });
  });

  describe("Multiple Limits", () => {
    it("should prevent delivery when any limit is exceeded", () => {
      // Set multiple limits
      testActivity.attemptLimit = 5;
      testActivity.attemptAbsoluteDurationLimit = "PT2H";
      testActivity.activityAbsoluteDurationLimit = "PT10H";

      // Exceed attempt limit but not duration limits
      for (let i = 0; i < 5; i++) {
        testActivity.incrementAttemptCount();
      }
      testActivity.attemptExperiencedDuration = "PT1H";
      testActivity.activityExperiencedDuration = "PT5H";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should fail due to attempt limit
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should not deliver due to attempt limit exceeded
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should allow delivery when all limits are satisfied", () => {
      // Set multiple limits
      testActivity.attemptLimit = 5;
      testActivity.attemptAbsoluteDurationLimit = "PT2H";
      testActivity.activityAbsoluteDurationLimit = "PT10H";

      // Stay under all limits
      testActivity.incrementAttemptCount(); // 1 attempt
      testActivity.attemptExperiencedDuration = "PT30M";
      testActivity.activityExperiencedDuration = "PT1H";

      // Set root as current but not active (terminated)
      activityTree.currentActivity = rootActivity;
      rootActivity.isActive = false;

      // Try to deliver activity - should succeed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test"
      );

      // Should deliver successfully
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(testActivity);
    });
  });
});
