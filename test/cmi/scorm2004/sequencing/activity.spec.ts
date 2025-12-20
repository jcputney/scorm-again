// noinspection DuplicatedCode

import { afterAll, describe, expect, it, vi } from "vitest";

import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

describe("Activity", () => {
  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      const activity = new Activity();
      expect(activity.id).toBe("");
      expect(activity.title).toBe("");
      expect(activity.children).toEqual([]);
      expect(activity.parent).toBe(null);
      expect(activity.isVisible).toBe(true);
      expect(activity.isActive).toBe(false);
      expect(activity.isSuspended).toBe(false);
      expect(activity.isCompleted).toBe(false);
      expect(activity.completionStatus).toBe(CompletionStatus.UNKNOWN);
      expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN);
      expect(activity.attemptCount).toBe(0);
      expect(activity.objectiveMeasureStatus).toBe(false);
      expect(activity.objectiveNormalizedMeasure).toBe(0);
    });

    it("should initialize with provided id and title", () => {
      const activity = new Activity("activity1", "Activity 1");
      expect(activity.id).toBe("activity1");
      expect(activity.title).toBe("Activity 1");
    });
  });

  describe("id setter", () => {
    it("should set id when valid format is provided", () => {
      const activity = new Activity();
      activity.id = "valid_id";
      expect(activity.id).toBe("valid_id");
    });

    it("should throw error when invalid format is provided", () => {
      const activity = new Activity("initial_id", "Title");

      // Attempt to set an invalid id should throw an error
      expect(() => {
        activity.id = "".padEnd(4001, "a"); // Too long id
      }).toThrow(Scorm2004ValidationError);

      // Id should remain unchanged after error
      expect(activity.id).toBe("initial_id");
    });
  });

  describe("title setter", () => {
    it("should set title when valid format is provided", () => {
      const activity = new Activity();
      activity.title = "Valid Title";
      expect(activity.title).toBe("Valid Title");
    });

    it("should throw error when invalid format is provided", () => {
      const activity = new Activity("id", "Initial Title");

      // Attempt to set an invalid title should throw an error
      expect(() => {
        activity.title = "".padEnd(251, "a"); // Too long title
      }).toThrow(Scorm2004ValidationError);

      // Title should remain unchanged after error
      expect(activity.title).toBe("Initial Title");
    });
  });

  describe("initialize", () => {
    it("should set initialized flag", () => {
      const activity = new Activity();
      activity.initialize();
      expect(activity.initialized).toBe(true);
    });

    it("should initialize children", () => {
      const activity = new Activity();
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      activity.addChild(child1);
      activity.addChild(child2);

      const child1InitializeSpy = vi.spyOn(child1, "initialize");
      const child2InitializeSpy = vi.spyOn(child2, "initialize");

      activity.initialize();

      expect(child1InitializeSpy).toHaveBeenCalled();
      expect(child2InitializeSpy).toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset all properties to default values", () => {
      const activity = new Activity("activity1", "Activity 1");
      activity.isActive = true;
      activity.isSuspended = true;
      activity.isCompleted = true;
      activity.completionStatus = CompletionStatus.COMPLETED;
      activity.successStatus = SuccessStatus.PASSED;
      activity.incrementAttemptCount(); // Set attemptCount to 1
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.8;

      activity.reset();

      expect(activity.id).toBe("activity1"); // ID should not be reset
      expect(activity.title).toBe("Activity 1"); // Title should not be reset
      expect(activity.isActive).toBe(false);
      expect(activity.isSuspended).toBe(false);
      expect(activity.isCompleted).toBe(false);
      expect(activity.completionStatus).toBe(CompletionStatus.UNKNOWN);
      expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN);
      expect(activity.attemptCount).toBe(0);
      expect(activity.objectiveMeasureStatus).toBe(false);
      expect(activity.objectiveNormalizedMeasure).toBe(0);
    });

    it("should reset children", () => {
      const activity = new Activity();
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      activity.addChild(child1);
      activity.addChild(child2);

      const child1ResetSpy = vi.spyOn(child1, "reset");
      const child2ResetSpy = vi.spyOn(child2, "reset");

      activity.reset();

      expect(child1ResetSpy).toHaveBeenCalled();
      expect(child2ResetSpy).toHaveBeenCalled();
    });
  });

  describe("addChild", () => {
    it("should add a child activity", () => {
      const activity = new Activity();
      const child = new Activity("child1", "Child 1");

      activity.addChild(child);

      expect(activity.children).toContain(child);
      expect(child.parent).toBe(activity);
    });

    it("should throw an error if child is not an Activity", () => {
      const activity = new Activity();

      expect(() => {
        activity.addChild("not an activity" as any);
      }).toThrow(Scorm2004ValidationError);
    });
  });

  describe("removeChild", () => {
    it("should remove a child activity", () => {
      const activity = new Activity();
      const child = new Activity("child1", "Child 1");

      activity.addChild(child);
      const result = activity.removeChild(child);

      expect(result).toBe(true);
      expect(activity.children).not.toContain(child);
      expect(child.parent).toBe(null);
    });

    it("should return false if child is not found", () => {
      const activity = new Activity();
      const child = new Activity("child1", "Child 1");

      const result = activity.removeChild(child);

      expect(result).toBe(false);
    });
  });

  describe("incrementAttemptCount", () => {
    it("should increment the attempt count", () => {
      const activity = new Activity();
      expect(activity.attemptCount).toBe(0);

      activity.incrementAttemptCount();
      expect(activity.attemptCount).toBe(1);

      activity.incrementAttemptCount();
      expect(activity.attemptCount).toBe(2);
    });
  });

  describe("completionStatus", () => {
    it("should update isCompleted when completionStatus is set", () => {
      const activity = new Activity();

      activity.completionStatus = CompletionStatus.COMPLETED;
      expect(activity.isCompleted).toBe(true);

      activity.completionStatus = CompletionStatus.INCOMPLETE;
      expect(activity.isCompleted).toBe(false);

      activity.completionStatus = CompletionStatus.UNKNOWN;
      expect(activity.isCompleted).toBe(false);
    });
  });

  describe("isVisible", () => {
    it("should get and set isVisible property", () => {
      const activity = new Activity();
      expect(activity.isVisible).toBe(true); // Default value

      activity.isVisible = false;
      expect(activity.isVisible).toBe(false);

      activity.isVisible = true;
      expect(activity.isVisible).toBe(true);
    });
  });

  describe("isActive", () => {
    it("should set isActive property", () => {
      const activity = new Activity();
      expect(activity.isActive).toBe(false); // Default value

      activity.isActive = true;
      expect(activity.isActive).toBe(true);

      activity.isActive = false;
      expect(activity.isActive).toBe(false);
    });
  });

  describe("isSuspended", () => {
    it("should get and set isSuspended property", () => {
      const activity = new Activity();
      expect(activity.isSuspended).toBe(false); // Default value

      activity.isSuspended = true;
      expect(activity.isSuspended).toBe(true);

      activity.isSuspended = false;
      expect(activity.isSuspended).toBe(false);
    });
  });

  describe("isCompleted", () => {
    it("should get and set isCompleted property", () => {
      const activity = new Activity();
      expect(activity.isCompleted).toBe(false); // Default value

      activity.isCompleted = true;
      expect(activity.isCompleted).toBe(true);

      activity.isCompleted = false;
      expect(activity.isCompleted).toBe(false);
    });
  });

  describe("successStatus", () => {
    it("should get and set successStatus property", () => {
      const activity = new Activity();
      expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN); // Default value

      activity.successStatus = SuccessStatus.PASSED;
      expect(activity.successStatus).toBe(SuccessStatus.PASSED);

      activity.successStatus = SuccessStatus.FAILED;
      expect(activity.successStatus).toBe(SuccessStatus.FAILED);

      activity.successStatus = SuccessStatus.UNKNOWN;
      expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN);
    });
  });

  describe("objectiveMeasureStatus", () => {
    it("should get and set objectiveMeasureStatus property", () => {
      const activity = new Activity();
      expect(activity.objectiveMeasureStatus).toBe(false); // Default value

      activity.objectiveMeasureStatus = true;
      expect(activity.objectiveMeasureStatus).toBe(true);

      activity.objectiveMeasureStatus = false;
      expect(activity.objectiveMeasureStatus).toBe(false);
    });
  });

  describe("objectiveNormalizedMeasure", () => {
    it("should get and set objectiveNormalizedMeasure property", () => {
      const activity = new Activity();
      expect(activity.objectiveNormalizedMeasure).toBe(0); // Default value

      activity.objectiveNormalizedMeasure = 0.5;
      expect(activity.objectiveNormalizedMeasure).toBe(0.5);

      activity.objectiveNormalizedMeasure = 1;
      expect(activity.objectiveNormalizedMeasure).toBe(1);
    });
  });

  describe("parent", () => {
    it("should get parent property", () => {
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      expect(child.parent).toBe(null); // Default value

      parent.addChild(child);
      expect(child.parent).toBe(parent);

      parent.removeChild(child);
      expect(child.parent).toBe(null);
    });
  });

  describe("objectiveSatisfiedStatusKnown property", () => {
    it("should default to false", () => {
      const activity = new Activity("test");
      expect(activity.objectiveSatisfiedStatusKnown).toBe(false);
    });

    it("should be settable to true", () => {
      const activity = new Activity("test");
      activity.objectiveSatisfiedStatusKnown = true;
      expect(activity.objectiveSatisfiedStatusKnown).toBe(true);
    });

    it("should become true when objectiveSatisfiedStatus is set", () => {
      const activity = new Activity("test");
      expect(activity.objectiveSatisfiedStatusKnown).toBe(false);
      activity.objectiveSatisfiedStatus = true;
      expect(activity.objectiveSatisfiedStatusKnown).toBe(true);
    });

    it("should become true when objectiveSatisfiedStatus is set to false explicitly", () => {
      const activity = new Activity("test");
      activity.objectiveSatisfiedStatusKnown = false; // Reset
      activity.objectiveSatisfiedStatus = false;
      expect(activity.objectiveSatisfiedStatusKnown).toBe(true);
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation of the activity", () => {
      const activity = new Activity("activity1", "Activity 1");
      activity.isActive = true;
      activity.completionStatus = CompletionStatus.COMPLETED;
      activity.successStatus = SuccessStatus.PASSED;
      activity.incrementAttemptCount();
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.8;

      const child = new Activity("child1", "Child 1");
      activity.addChild(child);

      const result = activity.toJSON();

      expect(result).toHaveProperty("id", "activity1");
      expect(result).toHaveProperty("title", "Activity 1");
      expect(result).toHaveProperty("isActive", true);
      expect(result).toHaveProperty("isCompleted", true);
      expect(result).toHaveProperty("completionStatus", CompletionStatus.COMPLETED);
      expect(result).toHaveProperty("successStatus", SuccessStatus.PASSED);
      expect(result).toHaveProperty("attemptCount", 1);
      expect(result).toHaveProperty("objectiveMeasureStatus", true);
      expect(result).toHaveProperty("objectiveNormalizedMeasure", 0.8);
      expect(result).toHaveProperty("children");
      expect(Array.isArray((result as any).children)).toBe(true);
      expect((result as any).children.length).toBe(1);
      expect((result as any).children[0]).toHaveProperty("id", "child1");
    });
  });
});
