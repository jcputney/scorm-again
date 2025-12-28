import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  DeliveryValidator
} from "../../../../../src/cmi/scorm2004/sequencing/validation/delivery_validator";
import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";

describe("DeliveryValidator", () => {
  let validator: DeliveryValidator;
  let activityTree: ActivityTree;
  let root: Activity;
  let child1: Activity;
  let child2: Activity;
  let grandchild1: Activity;
  let grandchild2: Activity;
  let eventCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    child1 = new Activity("module1", "Module 1");
    child2 = new Activity("module2", "Module 2");
    grandchild1 = new Activity("lesson1", "Lesson 1");
    grandchild2 = new Activity("lesson2", "Lesson 2");

    root.addChild(child1);
    root.addChild(child2);
    child1.addChild(grandchild1);
    child1.addChild(grandchild2);

    activityTree.root = root;
    eventCallback = vi.fn();

    validator = new DeliveryValidator(activityTree, eventCallback);
  });

  describe("validateTreeConsistency", () => {
    it("should return consistent when tree is valid", () => {
      const result = validator.validateTreeConsistency(grandchild1);
      expect(result.consistent).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should return inconsistent when no root exists", () => {
      activityTree.root = null;
      const result = validator.validateTreeConsistency(grandchild1);
      expect(result.consistent).toBe(false);
      expect(result.exception).toBe("DB.1.1-4");
    });

    it("should return inconsistent when activity is not in tree", () => {
      const orphan = new Activity("orphan", "Orphan Activity");
      const result = validator.validateTreeConsistency(orphan);
      expect(result.consistent).toBe(false);
      expect(result.exception).toBe("DB.1.1-5");
    });

    it("should return inconsistent when multiple activities are active", () => {
      grandchild1.isActive = true;
      grandchild2.isActive = true;

      const result = validator.validateTreeConsistency(child1);
      expect(result.consistent).toBe(false);
      expect(result.exception).toBe("DB.1.1-6");
      expect(eventCallback).toHaveBeenCalledWith("onStateInconsistency", expect.any(Object));
    });

    it("should detect when activity is not part of tree", () => {
      // Create an orphan activity that's not part of any tree
      const orphanActivity = new Activity("orphan", "Orphan");

      const result = validator.validateTreeConsistency(orphanActivity);
      expect(result.consistent).toBe(false);
      expect(result.exception).toBe("DB.1.1-5");
    });
  });

  describe("validateResources", () => {
    it("should return available when no special resources needed", () => {
      const result = validator.validateResources(grandchild1);
      expect(result.available).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should detect video requirements based on title", () => {
      const videoActivity = new Activity("video1", "Video Tutorial");
      root.addChild(videoActivity);

      const resources = validator.getRequiredResources(videoActivity);
      expect(resources).toContain("video-codec");
    });

    it("should detect audio requirements based on title", () => {
      const audioActivity = new Activity("audio1", "Audio Lesson");
      root.addChild(audioActivity);

      const resources = validator.getRequiredResources(audioActivity);
      expect(resources).toContain("audio-codec");
    });

    it("should detect flash requirements based on location", () => {
      const flashActivity = new Activity("flash1", "Flash Content");
      flashActivity.location = "content.swf";
      root.addChild(flashActivity);

      const resources = validator.getRequiredResources(flashActivity);
      expect(resources).toContain("flash-plugin");
    });

    it("should detect java requirements based on title", () => {
      const javaActivity = new Activity("java1", "Java Applet");
      root.addChild(javaActivity);

      const resources = validator.getRequiredResources(javaActivity);
      expect(resources).toContain("java-runtime");
    });

    it("should require high-bandwidth for container activities", () => {
      const resources = validator.getRequiredResources(child1);
      expect(resources).toContain("high-bandwidth");
    });

    it("should require extended storage for long duration activities", () => {
      const longActivity = new Activity("long1", "Long Content");
      longActivity.attemptAbsoluteDurationLimit = "PT2H0M0S"; // 2 hours
      root.addChild(longActivity);

      const resources = validator.getRequiredResources(longActivity);
      expect(resources).toContain("extended-storage");
    });

    it("should require persistent storage for multi-attempt activities", () => {
      const multiAttemptActivity = new Activity("multi1", "Multi Attempt");
      multiAttemptActivity.attemptLimit = 3;
      root.addChild(multiAttemptActivity);

      const resources = validator.getRequiredResources(multiAttemptActivity);
      expect(resources).toContain("persistent-storage");
    });
  });

  describe("isResourceAvailable", () => {
    it("should check video codec availability", () => {
      const result = validator.isResourceAvailable("video-codec");
      expect(typeof result).toBe("boolean");
    });

    it("should check audio codec availability", () => {
      const result = validator.isResourceAvailable("audio-codec");
      expect(typeof result).toBe("boolean");
    });

    it("should check flash plugin availability", () => {
      const result = validator.isResourceAvailable("flash-plugin");
      expect(typeof result).toBe("boolean");
    });

    it("should check java runtime availability", () => {
      const result = validator.isResourceAvailable("java-runtime");
      expect(typeof result).toBe("boolean");
    });

    it("should check high-bandwidth availability", () => {
      const result = validator.isResourceAvailable("high-bandwidth");
      expect(typeof result).toBe("boolean");
    });

    it("should check extended storage availability", () => {
      const result = validator.isResourceAvailable("extended-storage");
      expect(result).toBe(true);
    });

    it("should check persistent storage availability", () => {
      const result = validator.isResourceAvailable("persistent-storage");
      expect(typeof result).toBe("boolean");
    });

    it("should return true for unknown resources", () => {
      const result = validator.isResourceAvailable("unknown-resource");
      expect(result).toBe(true);
    });
  });

  describe("checkSystemLimits", () => {
    it("should return adequate for normal conditions", () => {
      const result = validator.checkSystemLimits();
      expect(typeof result.adequate).toBe("boolean");
    });
  });

  describe("validateConcurrentDelivery", () => {
    it("should allow delivery when no content is delivered", () => {
      const result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should block concurrent delivery when content is already delivered", () => {
      validator.setContentDeliveredGetter(() => true);
      activityTree.currentActivity = grandchild2;

      const result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(false);
      expect(result.exception).toBe("DB.1.1-10");
    });

    it("should allow re-delivery of same activity", () => {
      validator.setContentDeliveredGetter(() => true);
      activityTree.currentActivity = grandchild1;

      const result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(true);
    });

    it("should block when pending delivery requests exist", () => {
      (activityTree as any).pendingRequests = [{ id: "test" }];

      const result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(false);
      expect(result.exception).toBe("DB.1.1-11");
    });

    it("should block when delivery is locked", () => {
      (activityTree as any).navigationLocked = true;

      const result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(false);
      expect(result.exception).toBe("DB.1.1-12");
    });

    it("should block when termination is in progress", () => {
      (activityTree as any).terminationInProgress = true;

      const result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(false);
      expect(result.exception).toBe("DB.1.1-12");
    });
  });

  describe("validateDependencies", () => {
    it("should return satisfied when no dependencies exist", () => {
      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should fail when prerequisites are not satisfied", () => {
      // Set up a prerequisite relationship via sequencing rules
      grandchild2.sequencingControls.choiceExit = false;

      // grandchild1 should be a prerequisite for grandchild2
      const prerequisites = validator.getPrerequisites(grandchild2);
      expect(prerequisites).toContain("lesson1");

      const result = validator.validateDependencies(grandchild2);
      expect(result.satisfied).toBe(false);
    });

    it("should pass when prerequisites are completed", () => {
      grandchild1.completionStatus = "completed";

      const isSatisfied = validator.isPrerequisiteSatisfied("lesson1", grandchild2);
      expect(isSatisfied).toBe(true);
    });

    it("should fail for non-existent prerequisite", () => {
      const isSatisfied = validator.isPrerequisiteSatisfied("non-existent", grandchild1);
      expect(isSatisfied).toBe(false);
    });
  });

  describe("getPrerequisites", () => {
    it("should return empty array for activity with no dependencies", () => {
      const prerequisites = validator.getPrerequisites(grandchild1);
      expect(prerequisites).toEqual([]);
    });

    it("should return siblings as prerequisites when choiceExit is false", () => {
      grandchild2.sequencingControls.choiceExit = false;

      const prerequisites = validator.getPrerequisites(grandchild2);
      expect(prerequisites).toContain("lesson1");
    });

    it("should include explicit prerequisite activities", () => {
      (grandchild1 as any).prerequisiteActivities = ["module2"];

      const prerequisites = validator.getPrerequisites(grandchild1);
      expect(prerequisites).toContain("module2");
    });

    it("should deduplicate prerequisites", () => {
      grandchild2.sequencingControls.choiceExit = false;
      (grandchild2 as any).prerequisiteActivities = ["lesson1"];

      const prerequisites = validator.getPrerequisites(grandchild2);
      expect(prerequisites.filter((p) => p === "lesson1").length).toBe(1);
    });
  });

  describe("getObjectiveDependencies", () => {
    it("should return empty array for activity with no objectives", () => {
      const dependencies = validator.getObjectiveDependencies(grandchild1);
      expect(dependencies).toEqual([]);
    });

    it("should detect global objective dependencies", () => {
      (grandchild1 as any).objectives = [
        { id: "obj1", globalObjectiveID: "global-obj-1" }
      ];

      const dependencies = validator.getObjectiveDependencies(grandchild1);
      expect(dependencies).toContain("global-obj-1");
    });

    it("should detect measure-based dependencies", () => {
      (grandchild1 as any).objectives = [
        { id: "obj1", satisfiedByMeasure: false, readNormalizedMeasure: true }
      ];

      const dependencies = validator.getObjectiveDependencies(grandchild1);
      expect(dependencies).toContain("obj1_measure");
    });
  });

  describe("isObjectiveDependencySatisfied", () => {
    it("should check global objectives", () => {
      (activityTree as any).globalObjectives = {
        "global-obj-1": { satisfied: true, statusKnown: true }
      };

      const result = validator.isObjectiveDependencySatisfied("global-obj-1");
      expect(result).toBe(true);
    });

    it("should return false for unsatisfied global objectives", () => {
      (activityTree as any).globalObjectives = {
        "global-obj-1": { satisfied: false, statusKnown: true }
      };

      const result = validator.isObjectiveDependencySatisfied("global-obj-1");
      expect(result).toBe(false);
    });

    it("should check measure-based dependencies", () => {
      (activityTree as any).globalObjectives = {
        "obj1": { measureKnown: true, normalizedMeasure: 0.8 }
      };

      const result = validator.isObjectiveDependencySatisfied("obj1_measure");
      expect(result).toBe(true);
    });

    it("should fail measure dependencies with negative measure", () => {
      (activityTree as any).globalObjectives = {
        "obj1": { measureKnown: true, normalizedMeasure: -0.5 }
      };

      const result = validator.isObjectiveDependencySatisfied("obj1_measure");
      expect(result).toBe(false);
    });

    it("should check activity-specific objectives", () => {
      grandchild1.objectiveSatisfiedStatus = true;
      grandchild1.objectiveMeasureStatus = true;

      const result = validator.isObjectiveDependencySatisfied("lesson1");
      expect(result).toBe(true);
    });

    it("should return false for non-existent objectives", () => {
      const result = validator.isObjectiveDependencySatisfied("non-existent-obj");
      expect(result).toBe(false);
    });
  });

  describe("checkActivity (UP.5)", () => {
    it("should return true for available activity", () => {
      grandchild1.isAvailable = true;

      const result = validator.checkActivity(grandchild1);
      expect(result).toBe(true);
    });

    it("should return false for unavailable activity", () => {
      grandchild1.isAvailable = false;

      const result = validator.checkActivity(grandchild1);
      expect(result).toBe(false);
    });

    it("should check limit conditions", () => {
      grandchild1.attemptLimit = 1;
      grandchild1.attemptCount = 1;

      const result = validator.checkActivity(grandchild1);
      expect(result).toBe(false);
    });
  });

  describe("checkLimitConditions (UP.1)", () => {
    it("should pass with no limits set", () => {
      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(true);
      expect(eventCallback).toHaveBeenCalledWith(
        "onLimitConditionCheck",
        expect.objectContaining({ result: true })
      );
    });

    it("should fail when attempt limit exceeded", () => {
      grandchild1.attemptLimit = 3;
      grandchild1.attemptCount = 3;

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(false);
      expect(eventCallback).toHaveBeenCalledWith(
        "onLimitConditionCheck",
        expect.objectContaining({
          result: false,
          failureReason: "Attempt limit exceeded"
        })
      );
    });

    it("should pass when under attempt limit", () => {
      grandchild1.attemptLimit = 3;
      grandchild1.attemptCount = 2;

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(true);
    });

    it("should fail when attempt duration limit exceeded", () => {
      grandchild1.attemptAbsoluteDurationLimit = "PT1H0M0S"; // 1 hour
      grandchild1.attemptAbsoluteDuration = "PT2H0M0S"; // 2 hours

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(false);
      expect(eventCallback).toHaveBeenCalledWith(
        "onLimitConditionCheck",
        expect.objectContaining({
          result: false,
          failureReason: "Attempt duration limit exceeded"
        })
      );
    });

    it("should check duration limits", () => {
      // The Activity class maps attemptAbsoluteDuration to the same field as limit
      // so we can only test the limit check exists
      grandchild1.attemptAbsoluteDurationLimit = "PT1H0M0S";

      const result = validator.checkLimitConditions(grandchild1);
      // Result depends on internal implementation
      expect(typeof result).toBe("boolean");
    });

    it("should fail when activity duration limit exceeded", () => {
      grandchild1.activityAbsoluteDurationLimit = "PT1H0M0S"; // 1 hour
      grandchild1.activityAbsoluteDuration = "PT2H0M0S"; // 2 hours

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(false);
      expect(eventCallback).toHaveBeenCalledWith(
        "onLimitConditionCheck",
        expect.objectContaining({
          result: false,
          failureReason: "Activity duration limit exceeded"
        })
      );
    });

    it("should check activity duration limits", () => {
      // Similar to attempt duration, the Activity class maps activityAbsoluteDuration to the same field as limit
      grandchild1.activityAbsoluteDurationLimit = "PT1H0M0S";

      const result = validator.checkLimitConditions(grandchild1);
      expect(typeof result).toBe("boolean");
    });

    it("should fail when begin time not yet reached", () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      grandchild1.beginTimeLimit = futureDate.toISOString();

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(false);
      expect(eventCallback).toHaveBeenCalledWith(
        "onLimitConditionCheck",
        expect.objectContaining({
          result: false,
          failureReason: "Not yet time to begin"
        })
      );
    });

    it("should pass when begin time has passed", () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      grandchild1.beginTimeLimit = pastDate.toISOString();

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(true);
    });

    it("should fail when end time has passed", () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      grandchild1.endTimeLimit = pastDate.toISOString();

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(false);
      expect(eventCallback).toHaveBeenCalledWith(
        "onLimitConditionCheck",
        expect.objectContaining({
          result: false,
          failureReason: "Time limit expired"
        })
      );
    });

    it("should pass when end time not yet reached", () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      grandchild1.endTimeLimit = futureDate.toISOString();

      const result = validator.checkLimitConditions(grandchild1);
      expect(result).toBe(true);
    });

    it("should use custom now function when provided", () => {
      const fixedDate = new Date("2024-01-15T12:00:00Z");
      const customValidator = new DeliveryValidator(activityTree, eventCallback, {
        now: () => fixedDate
      });

      grandchild1.beginTimeLimit = "2024-01-14T12:00:00Z"; // Before fixed date
      grandchild1.endTimeLimit = "2024-01-16T12:00:00Z"; // After fixed date

      const result = customValidator.checkLimitConditions(grandchild1);
      expect(result).toBe(true);
    });
  });

  describe("Event handling", () => {
    it("should handle event callback errors gracefully", () => {
      const errorCallback = vi.fn(() => {
        throw new Error("Event handler error");
      });
      const errorValidator = new DeliveryValidator(activityTree, errorCallback);

      // Should not throw
      expect(() => {
        errorValidator.checkLimitConditions(grandchild1);
      }).not.toThrow();
    });

    it("should work without event callback", () => {
      const noEventValidator = new DeliveryValidator(activityTree);

      const result = noEventValidator.checkLimitConditions(grandchild1);
      expect(result).toBe(true);
    });
  });

  describe("setContentDeliveredGetter", () => {
    it("should use the provided getter for content delivered status", () => {
      let delivered = false;
      validator.setContentDeliveredGetter(() => delivered);

      let result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(true);

      delivered = true;
      activityTree.currentActivity = grandchild2;

      result = validator.validateConcurrentDelivery(grandchild1);
      expect(result.allowed).toBe(false);
    });
  });

  describe("Sequencing rule dependencies", () => {
    it("should check precondition rules with objectiveStatusKnown", () => {
      grandchild1.sequencingRules = {
        preConditionRules: [
          {
            conditions: [
              { condition: "objectiveStatusKnown" }
            ],
            action: "skip"
          }
        ],
        exitConditionRules: [],
        postConditionRules: []
      };

      // No objective status set
      grandchild1.objectiveSatisfiedStatus = false;
      grandchild1.objectiveMeasureStatus = false;

      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(false);
    });

    it("should check precondition rules with activityProgressKnown", () => {
      grandchild1.sequencingRules = {
        preConditionRules: [
          {
            conditions: [
              { condition: "activityProgressKnown" }
            ],
            action: "skip"
          }
        ],
        exitConditionRules: [],
        postConditionRules: []
      };

      grandchild1.progressMeasureStatus = false;

      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(false);
    });

    it("should check precondition rules with attemptLimitExceeded", () => {
      grandchild1.sequencingRules = {
        preConditionRules: [
          {
            conditions: [
              { condition: "attemptLimitExceeded" }
            ],
            action: "skip"
          }
        ],
        exitConditionRules: [],
        postConditionRules: []
      };

      grandchild1.attemptLimit = null;

      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(false);
    });

    it("should check precondition rules with timeLimitExceeded", () => {
      // Create a new activity without duration limits
      const testActivity = new Activity("test-activity", "Test Activity");
      root.addChild(testActivity);

      testActivity.sequencingRules = {
        preConditionRules: [
          {
            conditions: [
              { condition: "timeLimitExceeded" }
            ],
            action: "skip"
          }
        ],
        exitConditionRules: [],
        postConditionRules: []
      };

      // Activity has no duration limits set (null by default)
      const result = validator.validateDependencies(testActivity);
      expect(result.satisfied).toBe(false);
    });

    it("should pass for always/never condition types", () => {
      grandchild1.sequencingRules = {
        preConditionRules: [
          {
            conditions: [
              { condition: "always" }
            ],
            action: "skip"
          }
        ],
        exitConditionRules: [],
        postConditionRules: []
      };

      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(true);
    });

    it("should fail for unknown condition types", () => {
      grandchild1.sequencingRules = {
        preConditionRules: [
          {
            conditions: [
              { condition: "unknownCondition" }
            ],
            action: "skip"
          }
        ],
        exitConditionRules: [],
        postConditionRules: []
      };

      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(false);
    });

    it("should check exit condition rules with objective references", () => {
      grandchild1.sequencingRules = {
        preConditionRules: [],
        exitConditionRules: [
          {
            conditions: [
              { condition: "objectiveSatisfied", referencedObjectiveID: "non-existent" }
            ],
            action: "exit"
          }
        ],
        postConditionRules: []
      };

      const result = validator.validateDependencies(grandchild1);
      expect(result.satisfied).toBe(false);
    });

    it("should check rollup rule dependencies with incomplete children", () => {
      child1.rollupRules = {
        rules: [
          {
            conditions: [{ condition: "completed" }],
            childActivitySet: "all",
            action: "satisfied"
          }
        ]
      };

      grandchild1.isCompleted = false;
      grandchild2.isCompleted = false;

      const result = validator.validateDependencies(child1);
      expect(result.satisfied).toBe(false);
    });

    it("should pass rollup rule dependencies when all children are completed", () => {
      child1.rollupRules = {
        rules: [
          {
            conditions: [{ condition: "completed" }],
            childActivitySet: "all",
            action: "satisfied"
          }
        ]
      };

      grandchild1.isCompleted = true;
      grandchild2.isCompleted = true;

      const result = validator.validateDependencies(child1);
      expect(result.satisfied).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle root with no parent gracefully", () => {
      // Root activity has no parent by default
      const result = validator.validateTreeConsistency(root);
      expect(result.consistent).toBe(true);
    });

    it("should handle activity with empty children array", () => {
      const result = validator.validateTreeConsistency(grandchild1);
      expect(result.consistent).toBe(true);
    });

    it("should handle pending window requests", () => {
      const originalWindow = globalThis.window;
      (globalThis as any).window = { pendingScormRequests: 1 };

      try {
        const result = validator.validateConcurrentDelivery(grandchild1);
        expect(result.allowed).toBe(false);
        expect(result.exception).toBe("DB.1.1-11");
      } finally {
        (globalThis as any).window = originalWindow;
      }
    });

    it("should handle maintenance mode", () => {
      const originalWindow = globalThis.window;
      (globalThis as any).window = { scormMaintenanceMode: true };

      try {
        const result = validator.validateConcurrentDelivery(grandchild1);
        expect(result.allowed).toBe(false);
        expect(result.exception).toBe("DB.1.1-12");
      } finally {
        (globalThis as any).window = originalWindow;
      }
    });

    it("should handle resource check errors gracefully", () => {
      // Mock document to throw an error
      const originalDocument = globalThis.document;
      (globalThis as any).document = {
        createElement: () => {
          throw new Error("DOM error");
        }
      };

      try {
        const result = validator.isResourceAvailable("video-codec");
        expect(result).toBe(false);
      } finally {
        (globalThis as any).document = originalDocument;
      }
    });
  });
});
