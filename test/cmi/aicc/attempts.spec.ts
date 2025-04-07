import { describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { CMIAttemptRecords, CMIAttemptRecordsObject } from "../../../src/cmi/aicc/attempts";
import { CMIScore } from "../../../src/cmi/common/score";

describe("AICC Attempts Classes", () => {
  describe("CMIAttemptRecords", () => {
    it("should initialize as a CMIArray", () => {
      const attemptRecords = new CMIAttemptRecords();
      expect(Array.isArray(attemptRecords.childArray)).toBe(true);
    });
  });

  describe("CMIAttemptRecordsObject", () => {
    it("should initialize with empty lesson_status and a score object", () => {
      const attemptRecord = new CMIAttemptRecordsObject();
      expect(attemptRecord.lesson_status).toBe("");
      expect(attemptRecord.score).toBeInstanceOf(CMIScore);
    });

    it("should initialize child objects when initialize is called", () => {
      const attemptRecord = new CMIAttemptRecordsObject();
      const scoreInitializeSpy = sinon.spy(attemptRecord.score, "initialize");

      attemptRecord.initialize();

      expect(scoreInitializeSpy.called).toBe(true);
      expect(attemptRecord.initialized).toBe(true);
      expect(attemptRecord.lesson_status).toBe("");

      scoreInitializeSpy.restore();
    });

    it("should reset child objects when reset is called", () => {
      const attemptRecord = new CMIAttemptRecordsObject();
      const scoreResetSpy = sinon.spy(attemptRecord.score, "reset");

      attemptRecord.reset();

      expect(scoreResetSpy.called).toBe(true);
      expect(attemptRecord.initialized).toBe(false);

      scoreResetSpy.restore();
    });

    it("should set lesson_status property when valid", () => {
      const attemptRecord = new CMIAttemptRecordsObject();
      attemptRecord.lesson_status = "completed";
      expect(attemptRecord.lesson_status).toBe("completed");
    });

    it("should not set lesson_status property when invalid", () => {
      const attemptRecord = new CMIAttemptRecordsObject();
      // Set a valid status first
      attemptRecord.lesson_status = "completed";

      // Try to set an invalid status
      try {
        attemptRecord.lesson_status = "invalid_status";
      } catch (e) {
        // Expected to throw an error
      }

      // Should still have the original valid status
      expect(attemptRecord.lesson_status).toBe("completed");
    });

    it("should return a JSON representation with toJSON", () => {
      const attemptRecord = new CMIAttemptRecordsObject();
      attemptRecord.lesson_status = "completed";

      // Set some score values
      attemptRecord.score.raw = "85";
      attemptRecord.score.min = "0";
      attemptRecord.score.max = "100";

      const result = attemptRecord.toJSON();

      expect(result).toHaveProperty("lesson_status");
      expect(result).toHaveProperty("score");
      expect(result.lesson_status).toBe("completed");
      expect(result.score).toBe(attemptRecord.score);
    });
  });
});
