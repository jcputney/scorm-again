import { describe, expect, it, beforeEach } from "vitest";
import Scorm12API from "../../../src/Scorm12API";
import Scorm2004API from "../../../src/Scorm2004API";
import { scorm12_errors, scorm2004_errors } from "../../../src/constants/error_codes";

describe("CMIArray Sequential Index Validation", () => {
  describe("SCORM 1.2 Array Index Validation", () => {
    let scorm12API: Scorm12API;

    beforeEach(() => {
      scorm12API = new Scorm12API();
      scorm12API.lmsInitialize();
    });

    it("should allow setting index 0 on empty objectives array", () => {
      const result = scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      expect(result).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should allow setting index 1 when index 0 exists in objectives array", () => {
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm12API.lmsSetValue("cmi.objectives.1.id", "obj_1");
      expect(result).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should fail when setting index 2 when only index 0 exists (gap at index 1) in objectives", () => {
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm12API.lmsSetValue("cmi.objectives.2.id", "obj_2");
      expect(result).toBe("false");
      const errorCode = scorm12API.lmsGetLastError();
      // Should be INVALID_SET_VALUE (402) or GENERAL_SET_FAILURE
      expect(errorCode).toBe(String(scorm12_errors.INVALID_SET_VALUE));
    });

    it("should allow updating existing index 0 in objectives array", () => {
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0_updated");
      expect(result).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
      expect(scorm12API.lmsGetValue("cmi.objectives.0.id")).toBe("obj_0_updated");
    });

    it("should allow sequential index setting (0, 1, 2, 3) in objectives", () => {
      expect(scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0")).toBe("true");
      expect(scorm12API.lmsSetValue("cmi.objectives.1.id", "obj_1")).toBe("true");
      expect(scorm12API.lmsSetValue("cmi.objectives.2.id", "obj_2")).toBe("true");
      expect(scorm12API.lmsSetValue("cmi.objectives.3.id", "obj_3")).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should allow setting index 0 on empty interactions array", () => {
      const result = scorm12API.lmsSetValue("cmi.interactions.0.id", "int_0");
      expect(result).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should fail when setting index 2 when only index 0 exists in interactions", () => {
      scorm12API.lmsSetValue("cmi.interactions.0.id", "int_0");
      const result = scorm12API.lmsSetValue("cmi.interactions.2.id", "int_2");
      expect(result).toBe("false");
      const errorCode = scorm12API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm12_errors.INVALID_SET_VALUE));
    });

    it("should fail when setting index 5 on empty interactions array", () => {
      const result = scorm12API.lmsSetValue("cmi.interactions.5.id", "int_5");
      expect(result).toBe("false");
      const errorCode = scorm12API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm12_errors.INVALID_SET_VALUE));
    });

    it("should allow sequential setting in nested interactions.objectives array", () => {
      scorm12API.lmsSetValue("cmi.interactions.0.id", "int_0");
      expect(scorm12API.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj_0")).toBe("true");
      expect(scorm12API.lmsSetValue("cmi.interactions.0.objectives.1.id", "obj_1")).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should fail when skipping index in nested interactions.objectives array", () => {
      scorm12API.lmsSetValue("cmi.interactions.0.id", "int_0");
      scorm12API.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj_0");
      const result = scorm12API.lmsSetValue("cmi.interactions.0.objectives.2.id", "obj_2");
      expect(result).toBe("false");
      const errorCode = scorm12API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm12_errors.INVALID_SET_VALUE));
    });

    it("should allow sequential setting in interactions.correct_responses array", () => {
      scorm12API.lmsSetValue("cmi.interactions.0.id", "int_0");
      scorm12API.lmsSetValue("cmi.interactions.0.type", "choice");
      expect(
        scorm12API.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "a"),
      ).toBe("true");
      expect(
        scorm12API.lmsSetValue("cmi.interactions.0.correct_responses.1.pattern", "b"),
      ).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should fail when skipping index in interactions.correct_responses array", () => {
      scorm12API.lmsSetValue("cmi.interactions.0.id", "int_0");
      scorm12API.lmsSetValue("cmi.interactions.0.type", "choice");
      scorm12API.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "a");
      const result = scorm12API.lmsSetValue("cmi.interactions.0.correct_responses.3.pattern", "d");
      expect(result).toBe("false");
      const errorCode = scorm12API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm12_errors.INVALID_SET_VALUE));
    });
  });

  describe("SCORM 2004 Array Index Validation", () => {
    let scorm2004API: Scorm2004API;

    beforeEach(() => {
      scorm2004API = new Scorm2004API();
      scorm2004API.lmsInitialize();
    });

    it("should allow setting index 0 on empty objectives array", () => {
      const result = scorm2004API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      expect(result).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should allow setting index 1 when index 0 exists in objectives array", () => {
      scorm2004API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm2004API.lmsSetValue("cmi.objectives.1.id", "obj_1");
      expect(result).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should fail when setting index 2 when only index 0 exists (gap at index 1) in objectives", () => {
      scorm2004API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm2004API.lmsSetValue("cmi.objectives.2.id", "obj_2");
      expect(result).toBe("false");
      const errorCode = scorm2004API.lmsGetLastError();
      // Should be GENERAL_SET_FAILURE (351) for SCORM 2004
      expect(errorCode).toBe(String(scorm2004_errors.GENERAL_SET_FAILURE));
    });

    it("should allow updating existing index 0 in objectives array", () => {
      scorm2004API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm2004API.lmsSetValue("cmi.objectives.0.id", "obj_0_updated");
      expect(result).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
      expect(scorm2004API.lmsGetValue("cmi.objectives.0.id")).toBe("obj_0_updated");
    });

    it("should allow sequential index setting (0, 1, 2, 3) in objectives", () => {
      expect(scorm2004API.lmsSetValue("cmi.objectives.0.id", "obj_0")).toBe("true");
      expect(scorm2004API.lmsSetValue("cmi.objectives.1.id", "obj_1")).toBe("true");
      expect(scorm2004API.lmsSetValue("cmi.objectives.2.id", "obj_2")).toBe("true");
      expect(scorm2004API.lmsSetValue("cmi.objectives.3.id", "obj_3")).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should allow setting index 0 on empty interactions array", () => {
      const result = scorm2004API.lmsSetValue("cmi.interactions.0.id", "int_0");
      expect(result).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should fail when setting index 2 when only index 0 exists in interactions", () => {
      scorm2004API.lmsSetValue("cmi.interactions.0.id", "int_0");
      const result = scorm2004API.lmsSetValue("cmi.interactions.2.id", "int_2");
      expect(result).toBe("false");
      const errorCode = scorm2004API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm2004_errors.GENERAL_SET_FAILURE));
    });

    it("should fail when setting index 5 on empty interactions array", () => {
      const result = scorm2004API.lmsSetValue("cmi.interactions.5.id", "int_5");
      expect(result).toBe("false");
      const errorCode = scorm2004API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm2004_errors.GENERAL_SET_FAILURE));
    });

    it("should allow sequential setting in nested interactions.objectives array", () => {
      scorm2004API.lmsSetValue("cmi.interactions.0.id", "int_0");
      expect(scorm2004API.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj_0")).toBe("true");
      expect(scorm2004API.lmsSetValue("cmi.interactions.0.objectives.1.id", "obj_1")).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should fail when skipping index in nested interactions.objectives array", () => {
      scorm2004API.lmsSetValue("cmi.interactions.0.id", "int_0");
      scorm2004API.lmsSetValue("cmi.interactions.0.objectives.0.id", "obj_0");
      const result = scorm2004API.lmsSetValue("cmi.interactions.0.objectives.2.id", "obj_2");
      expect(result).toBe("false");
      const errorCode = scorm2004API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm2004_errors.GENERAL_SET_FAILURE));
    });

    it("should allow sequential setting in interactions.correct_responses array", () => {
      scorm2004API.lmsSetValue("cmi.interactions.0.id", "int_0");
      scorm2004API.lmsSetValue("cmi.interactions.0.type", "choice");
      expect(
        scorm2004API.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "a"),
      ).toBe("true");
      expect(
        scorm2004API.lmsSetValue("cmi.interactions.0.correct_responses.1.pattern", "b"),
      ).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should fail when skipping index in interactions.correct_responses array", () => {
      scorm2004API.lmsSetValue("cmi.interactions.0.id", "int_0");
      scorm2004API.lmsSetValue("cmi.interactions.0.type", "choice");
      scorm2004API.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "a");
      const result = scorm2004API.lmsSetValue("cmi.interactions.0.correct_responses.3.pattern", "d");
      expect(result).toBe("false");
      const errorCode = scorm2004API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm2004_errors.GENERAL_SET_FAILURE));
    });

    it("should allow setting index 0 on empty comments_from_learner array", () => {
      const result = scorm2004API.lmsSetValue("cmi.comments_from_learner.0.comment", "test");
      expect(result).toBe("true");
      expect(scorm2004API.lmsGetLastError()).toBe("0");
    });

    it("should fail when skipping index in comments_from_learner array", () => {
      scorm2004API.lmsSetValue("cmi.comments_from_learner.0.comment", "first");
      const result = scorm2004API.lmsSetValue("cmi.comments_from_learner.2.comment", "third");
      expect(result).toBe("false");
      const errorCode = scorm2004API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm2004_errors.GENERAL_SET_FAILURE));
    });
  });

  describe("Edge Cases", () => {
    let scorm12API: Scorm12API;

    beforeEach(() => {
      scorm12API = new Scorm12API();
      scorm12API.lmsInitialize();
    });

    it("should handle large index gaps correctly", () => {
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      const result = scorm12API.lmsSetValue("cmi.objectives.100.id", "obj_100");
      expect(result).toBe("false");
      const errorCode = scorm12API.lmsGetLastError();
      expect(errorCode).toBe(String(scorm12_errors.INVALID_SET_VALUE));
    });

    it("should allow filling gaps by adding sequential indices", () => {
      // Start with index 0
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");

      // Try to skip to index 2 - should fail
      let result = scorm12API.lmsSetValue("cmi.objectives.2.id", "obj_2");
      expect(result).toBe("false");

      // Now add index 1 - should succeed
      result = scorm12API.lmsSetValue("cmi.objectives.1.id", "obj_1");
      expect(result).toBe("true");

      // Now index 2 should succeed
      result = scorm12API.lmsSetValue("cmi.objectives.2.id", "obj_2");
      expect(result).toBe("true");
      expect(scorm12API.lmsGetLastError()).toBe("0");
    });

    it("should maintain correct array count after sequential additions", () => {
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");
      scorm12API.lmsSetValue("cmi.objectives.1.id", "obj_1");
      scorm12API.lmsSetValue("cmi.objectives.2.id", "obj_2");

      const count = scorm12API.lmsGetValue("cmi.objectives._count");
      expect(count).toBe(3);
    });

    it("should not increment count when attempting to skip indices", () => {
      scorm12API.lmsSetValue("cmi.objectives.0.id", "obj_0");

      // Try to skip to index 3 - should fail
      scorm12API.lmsSetValue("cmi.objectives.3.id", "obj_3");

      const count = scorm12API.lmsGetValue("cmi.objectives._count");
      expect(count).toBe(1); // Count should remain 1
    });
  });
});
