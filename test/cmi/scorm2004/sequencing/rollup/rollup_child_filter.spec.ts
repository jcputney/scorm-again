import { beforeEach, describe, expect, it } from "vitest";
import {
  RollupChildFilter
} from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { SuccessStatus } from "../../../../../src/constants/enums";
import {
  createMockActivity,
  createMockRollupConsiderations
} from "../../../../helpers/mock-factories";

describe("RollupChildFilter", () => {
  let filter: RollupChildFilter;

  beforeEach(() => {
    filter = new RollupChildFilter();
  });

  describe("checkChildForRollupSubprocess", () => {
    describe("tracking requirements", () => {
      it("should return false when tracked is false", () => {
        const child = createMockActivity({ tracked: false });

        expect(filter.checkChildForRollupSubprocess(child, "objective")).toBe(false);
        expect(filter.checkChildForRollupSubprocess(child, "measure")).toBe(false);
        expect(filter.checkChildForRollupSubprocess(child, "progress")).toBe(false);
      });

      it("should return true when tracked is true", () => {
        const child = createMockActivity({ tracked: true });

        expect(filter.checkChildForRollupSubprocess(child, "objective")).toBe(true);
      });
    });

    describe("objective/measure rollup", () => {
      it("should return false when rollupObjectiveSatisfied is false", () => {
        const child = createMockActivity({ rollupObjectiveSatisfied: false });

        expect(filter.checkChildForRollupSubprocess(child, "objective")).toBe(false);
        expect(filter.checkChildForRollupSubprocess(child, "measure")).toBe(false);
      });

      it("should return true with default 'always' consideration", () => {
        const child = createMockActivity({
          requiredForSatisfied: "always",
          requiredForNotSatisfied: "always"
        });

        expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(true);
        expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(true);
      });

      describe("ifNotSuspended consideration", () => {
        it("should exclude if not attempted for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifNotSuspended",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(false);
        });

        it("should exclude if attempted and suspended for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifNotSuspended",
            attemptProgressStatus: true,
            attemptCount: 1,
            isSuspended: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(false);
        });

        it("should include if attempted and not suspended for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifNotSuspended",
            attemptProgressStatus: true,
            attemptCount: 1,
            isSuspended: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(true);
        });

        it("should exclude if not attempted for notSatisfied action", () => {
          const child = createMockActivity({
            requiredForNotSatisfied: "ifNotSuspended",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(false);
        });

        it("should exclude if attempted and suspended for notSatisfied action", () => {
          const child = createMockActivity({
            requiredForNotSatisfied: "ifNotSuspended",
            attemptProgressStatus: true,
            attemptCount: 1,
            isSuspended: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(false);
        });
      });

      describe("ifAttempted consideration", () => {
        it("should exclude if not attempted for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifAttempted",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(false);
        });

        it("should exclude if attemptCount is 0 for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifAttempted",
            attemptProgressStatus: true,
            attemptCount: 0
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(false);
        });

        it("should include if attempted for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifAttempted",
            attemptProgressStatus: true,
            attemptCount: 1
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(true);
        });

        it("should exclude if not attempted for notSatisfied action", () => {
          const child = createMockActivity({
            requiredForNotSatisfied: "ifAttempted",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(false);
        });

        it("should exclude if attemptCount is 0 for notSatisfied action", () => {
          const child = createMockActivity({
            requiredForNotSatisfied: "ifAttempted",
            attemptProgressStatus: true,
            attemptCount: 0
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(false);
        });
      });

      describe("ifNotSkipped consideration", () => {
        it("should exclude if skipped for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifNotSkipped",
            wasSkipped: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(false);
        });

        it("should include if not skipped for satisfied action", () => {
          const child = createMockActivity({
            requiredForSatisfied: "ifNotSkipped",
            wasSkipped: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "satisfied")).toBe(true);
        });

        it("should exclude if skipped for notSatisfied action", () => {
          const child = createMockActivity({
            requiredForNotSatisfied: "ifNotSkipped",
            wasSkipped: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(false);
        });

        it("should include if not skipped for notSatisfied action", () => {
          const child = createMockActivity({
            requiredForNotSatisfied: "ifNotSkipped",
            wasSkipped: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")).toBe(true);
        });
      });
    });

    describe("progress rollup", () => {
      it("should return false when rollupProgressCompletion is false", () => {
        const child = createMockActivity({ rollupProgressCompletion: false });

        expect(filter.checkChildForRollupSubprocess(child, "progress")).toBe(false);
      });

      it("should return true with default 'always' consideration", () => {
        const child = createMockActivity({
          requiredForCompleted: "always",
          requiredForIncomplete: "always"
        });

        expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(true);
        expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(true);
      });

      describe("ifNotSuspended consideration", () => {
        it("should exclude if not attempted for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifNotSuspended",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(false);
        });

        it("should exclude if attempted and suspended for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifNotSuspended",
            attemptProgressStatus: true,
            attemptCount: 1,
            isSuspended: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(false);
        });

        it("should include if attempted and not suspended for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifNotSuspended",
            attemptProgressStatus: true,
            attemptCount: 1,
            isSuspended: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(true);
        });

        it("should exclude if not attempted for incomplete action", () => {
          const child = createMockActivity({
            requiredForIncomplete: "ifNotSuspended",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(false);
        });

        it("should exclude if attempted and suspended for incomplete action", () => {
          const child = createMockActivity({
            requiredForIncomplete: "ifNotSuspended",
            attemptProgressStatus: true,
            attemptCount: 1,
            isSuspended: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(false);
        });
      });

      describe("ifAttempted consideration", () => {
        it("should exclude if not attempted for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifAttempted",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(false);
        });

        it("should exclude if attemptCount is 0 for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifAttempted",
            attemptProgressStatus: true,
            attemptCount: 0
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(false);
        });

        it("should include if attempted for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifAttempted",
            attemptProgressStatus: true,
            attemptCount: 1
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(true);
        });

        it("should exclude if not attempted for incomplete action", () => {
          const child = createMockActivity({
            requiredForIncomplete: "ifAttempted",
            attemptProgressStatus: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(false);
        });

        it("should exclude if attemptCount is 0 for incomplete action", () => {
          const child = createMockActivity({
            requiredForIncomplete: "ifAttempted",
            attemptProgressStatus: true,
            attemptCount: 0
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(false);
        });
      });

      describe("ifNotSkipped consideration", () => {
        it("should exclude if skipped for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifNotSkipped",
            wasSkipped: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(false);
        });

        it("should include if not skipped for completed action", () => {
          const child = createMockActivity({
            requiredForCompleted: "ifNotSkipped",
            wasSkipped: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "completed")).toBe(true);
        });

        it("should exclude if skipped for incomplete action", () => {
          const child = createMockActivity({
            requiredForIncomplete: "ifNotSkipped",
            wasSkipped: true
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(false);
        });

        it("should include if not skipped for incomplete action", () => {
          const child = createMockActivity({
            requiredForIncomplete: "ifNotSkipped",
            wasSkipped: false
          });

          expect(filter.checkChildForRollupSubprocess(child, "progress", "incomplete")).toBe(true);
        });
      });
    });

    describe("availability check", () => {
      it("should return false when child is not available", () => {
        const child = createMockActivity({ isAvailable: false });

        expect(filter.checkChildForRollupSubprocess(child, "objective")).toBe(false);
        expect(filter.checkChildForRollupSubprocess(child, "progress")).toBe(false);
      });
    });
  });

  describe("filterChildrenForRequirement", () => {
    it("should filter children based on rollup requirements", () => {
      const trackedChild = createMockActivity({ tracked: true });
      const untrackedChild = createMockActivity({ tracked: false });
      const children = [trackedChild, untrackedChild];
      const considerations = createMockRollupConsiderations();

      const result = filter.filterChildrenForRequirement(children, "objective", "satisfied", considerations);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(trackedChild);
    });

    it("should filter all children when none meet requirements", () => {
      const untrackedChild1 = createMockActivity({ tracked: false });
      const untrackedChild2 = createMockActivity({ tracked: false });
      const children = [untrackedChild1, untrackedChild2];
      const considerations = createMockRollupConsiderations();

      const result = filter.filterChildrenForRequirement(children, "objective", "satisfied", considerations);

      expect(result).toHaveLength(0);
    });

    it("should return all children when all meet requirements", () => {
      const child1 = createMockActivity({ tracked: true });
      const child2 = createMockActivity({ tracked: true });
      const children = [child1, child2];
      const considerations = createMockRollupConsiderations();

      const result = filter.filterChildrenForRequirement(children, "objective", "satisfied", considerations);

      expect(result).toHaveLength(2);
    });

    it("should filter for progress rollup", () => {
      const trackedChild = createMockActivity({
        tracked: true,
        rollupProgressCompletion: true
      });
      const noProgressChild = createMockActivity({
        tracked: true,
        rollupProgressCompletion: false
      });
      const children = [trackedChild, noProgressChild];
      const considerations = createMockRollupConsiderations();

      const result = filter.filterChildrenForRequirement(children, "progress", "completed", considerations);

      expect(result).toHaveLength(1);
      expect(result[0]).toBe(trackedChild);
    });
  });

  describe("shouldIncludeChildForRollup", () => {
    it("should include child when checkChildForRollupSubprocess returns true", () => {
      const child = createMockActivity({ tracked: true });
      const considerations = createMockRollupConsiderations();

      expect(filter.shouldIncludeChildForRollup(child, "objective", "satisfied", considerations)).toBe(true);
    });

    it("should exclude child when checkChildForRollupSubprocess returns false", () => {
      const child = createMockActivity({ tracked: false });
      const considerations = createMockRollupConsiderations();

      expect(filter.shouldIncludeChildForRollup(child, "objective", "satisfied", considerations)).toBe(false);
    });

    it("should exclude active child when measureSatisfactionIfActive is false for objective rollup", () => {
      const activeChild = createMockActivity({
        tracked: true,
        activityAttemptActive: true
      });
      const considerations = createMockRollupConsiderations({ measureSatisfactionIfActive: false });

      expect(filter.shouldIncludeChildForRollup(activeChild, "objective", "satisfied", considerations)).toBe(false);
    });

    it("should exclude isActive child when measureSatisfactionIfActive is false", () => {
      const activeChild = createMockActivity({
        tracked: true,
        isActive: true
      });
      const considerations = createMockRollupConsiderations({ measureSatisfactionIfActive: false });

      expect(filter.shouldIncludeChildForRollup(activeChild, "objective", "satisfied", considerations)).toBe(false);
    });

    it("should include active child when measureSatisfactionIfActive is true", () => {
      const activeChild = createMockActivity({
        tracked: true,
        activityAttemptActive: true
      });
      const considerations = createMockRollupConsiderations();

      expect(filter.shouldIncludeChildForRollup(activeChild, "objective", "satisfied", considerations)).toBe(true);
    });

    it("should not apply measureSatisfactionIfActive for progress rollup", () => {
      const activeChild = createMockActivity({
        tracked: true,
        activityAttemptActive: true,
        rollupProgressCompletion: true
      });
      const considerations = createMockRollupConsiderations({ measureSatisfactionIfActive: false });

      expect(filter.shouldIncludeChildForRollup(activeChild, "progress", "completed", considerations)).toBe(true);
    });
  });

  describe("isChildSatisfiedForRollup", () => {
    it("should return true when objectiveSatisfiedStatus is true", () => {
      const child = createMockActivity({ objectiveSatisfiedStatus: true });

      expect(filter.isChildSatisfiedForRollup(child)).toBe(true);
    });

    it("should return false when objectiveSatisfiedStatus is false", () => {
      const child = createMockActivity({ objectiveSatisfiedStatus: false });

      expect(filter.isChildSatisfiedForRollup(child)).toBe(false);
    });

    it("should return true when successStatus is PASSED and objectiveSatisfiedStatus is null", () => {
      const child = createMockActivity({
        objectiveSatisfiedStatus: null,
        successStatus: SuccessStatus.PASSED
      });

      expect(filter.isChildSatisfiedForRollup(child)).toBe(true);
    });

    it("should return false when successStatus is FAILED and objectiveSatisfiedStatus is null", () => {
      const child = createMockActivity({
        objectiveSatisfiedStatus: null,
        successStatus: SuccessStatus.FAILED
      });

      expect(filter.isChildSatisfiedForRollup(child)).toBe(false);
    });

    it("should return false when objectiveSatisfiedStatus is null and successStatus is UNKNOWN", () => {
      const child = createMockActivity({
        objectiveSatisfiedStatus: null,
        successStatus: SuccessStatus.UNKNOWN
      });

      expect(filter.isChildSatisfiedForRollup(child)).toBe(false);
    });
  });

  describe("isChildCompletedForRollup", () => {
    it("should return true when completionStatus is 'completed'", () => {
      const child = createMockActivity({ completionStatus: "completed" });

      expect(filter.isChildCompletedForRollup(child)).toBe(true);
    });

    it("should return true when isCompleted is true", () => {
      const child = createMockActivity({
        completionStatus: "unknown",
        isCompleted: true
      });

      expect(filter.isChildCompletedForRollup(child)).toBe(true);
    });

    it("should return false when completionStatus is not 'completed' and isCompleted is false", () => {
      const child = createMockActivity({
        completionStatus: "incomplete",
        isCompleted: false
      });

      expect(filter.isChildCompletedForRollup(child)).toBe(false);
    });

    it("should return false when completionStatus is 'not attempted'", () => {
      const child = createMockActivity({
        completionStatus: "not attempted",
        isCompleted: false
      });

      expect(filter.isChildCompletedForRollup(child)).toBe(false);
    });
  });

  describe("getTrackableChildren", () => {
    it("should return only tracked children", () => {
      const trackedChild1 = createMockActivity({ tracked: true });
      const trackedChild2 = createMockActivity({ tracked: true });
      const untrackedChild = createMockActivity({ tracked: false });
      const parent = createMockActivity({
        children: [trackedChild1, untrackedChild, trackedChild2] as Activity[]
      });

      const result = filter.getTrackableChildren(parent);

      expect(result).toHaveLength(2);
      expect(result).toContain(trackedChild1);
      expect(result).toContain(trackedChild2);
      expect(result).not.toContain(untrackedChild);
    });

    it("should return empty array when no children are tracked", () => {
      const untrackedChild1 = createMockActivity({ tracked: false });
      const untrackedChild2 = createMockActivity({ tracked: false });
      const parent = createMockActivity({
        children: [untrackedChild1, untrackedChild2] as Activity[]
      });

      const result = filter.getTrackableChildren(parent);

      expect(result).toHaveLength(0);
    });

    it("should return all children when all are tracked", () => {
      const trackedChild1 = createMockActivity({ tracked: true });
      const trackedChild2 = createMockActivity({ tracked: true });
      const parent = createMockActivity({
        children: [trackedChild1, trackedChild2] as Activity[]
      });

      const result = filter.getTrackableChildren(parent);

      expect(result).toHaveLength(2);
    });

    it("should return empty array when parent has no children", () => {
      const parent = createMockActivity({ children: [] as Activity[] });

      const result = filter.getTrackableChildren(parent);

      expect(result).toHaveLength(0);
    });
  });

  describe("integration scenarios", () => {
    it("should correctly filter and check satisfaction for complex tree", () => {
      // Create a mix of children with different states
      const satisfiedChild = createMockActivity({
        tracked: true,
        objectiveSatisfiedStatus: true
      });
      const failedChild = createMockActivity({
        tracked: true,
        successStatus: SuccessStatus.FAILED
      });
      const untrackedChild = createMockActivity({
        tracked: false,
        objectiveSatisfiedStatus: true
      });
      const suspendedChild = createMockActivity({
        tracked: true,
        isSuspended: true,
        attemptCount: 1,
        attemptProgressStatus: true,
        requiredForSatisfied: "ifNotSuspended"
      });

      const considerations = createMockRollupConsiderations();

      // Filter for satisfied action
      const filtered = filter.filterChildrenForRequirement(
        [satisfiedChild, failedChild, untrackedChild, suspendedChild],
        "objective",
        "satisfied",
        considerations
      );

      // Check satisfaction status of filtered children
      const satisfiedCount = filtered.filter((child) => filter.isChildSatisfiedForRollup(child)).length;

      expect(filtered).toHaveLength(2); // satisfiedChild and failedChild (not suspended, not untracked)
      expect(satisfiedCount).toBe(1); // Only satisfiedChild is satisfied
    });

    it("should correctly handle progress rollup with mixed children", () => {
      const completedChild = createMockActivity({
        tracked: true,
        rollupProgressCompletion: true,
        completionStatus: "completed"
      });
      const incompleteChild = createMockActivity({
        tracked: true,
        rollupProgressCompletion: true,
        completionStatus: "incomplete",
        isCompleted: false
      });
      const skippedChild = createMockActivity({
        tracked: true,
        rollupProgressCompletion: true,
        wasSkipped: true,
        requiredForCompleted: "ifNotSkipped"
      });

      const considerations = createMockRollupConsiderations();

      const filtered = filter.filterChildrenForRequirement(
        [completedChild, incompleteChild, skippedChild],
        "progress",
        "completed",
        considerations
      );

      // skippedChild should be excluded due to ifNotSkipped consideration
      expect(filtered).toHaveLength(2);
      expect(filtered).toContain(completedChild);
      expect(filtered).toContain(incompleteChild);

      // Check completion status
      const completedCount = filtered.filter((child) => filter.isChildCompletedForRollup(child)).length;
      expect(completedCount).toBe(1);
    });
  });
});
