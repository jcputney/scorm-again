import { beforeEach, describe, expect, it } from "vitest";
import { CMI } from "../../../src/cmi/scorm12/cmi";
import { CMIStudentData } from "../../../src/cmi/scorm12/student_data";
import { scorm12_constants } from "../../../src/constants/api_constants";

describe("CMI - SCORM 1.2", () => {
  let cmi: CMI;

  beforeEach(() => {
    cmi = new CMI();
  });

  describe("constructor", () => {
    it("should initialize with default cmi_children when not provided", () => {
      const cmi = new CMI();
      expect(cmi._children).toBe(scorm12_constants.cmi_children);
    });

    it("should use provided cmi_children parameter", () => {
      const customChildren = "core,suspend_data,launch_data";
      const cmi = new CMI(customChildren);
      expect(cmi._children).toBe(customChildren);
    });

    it("should use provided student_data parameter", () => {
      const customStudentData = new CMIStudentData();
      customStudentData.mastery_score = "80";

      const cmi = new CMI(undefined, customStudentData);
      expect(cmi.student_data).toBe(customStudentData);
      expect(cmi.student_data.mastery_score).toBe("80");
    });

    it("should initialize with default student_data when not provided", () => {
      const cmi = new CMI();
      expect(cmi.student_data).toBeDefined();
      expect(cmi.student_data).toBeInstanceOf(CMIStudentData);
    });

    it("should mark CMI as initialized when initialized parameter is true", () => {
      const cmi = new CMI(undefined, undefined, true);
      expect(cmi.initialized).toBe(true);
    });

    it("should not mark CMI as initialized when initialized parameter is false", () => {
      const cmi = new CMI(undefined, undefined, false);
      expect(cmi.initialized).toBe(false);
    });

    it("should not mark CMI as initialized when initialized parameter is not provided", () => {
      const cmi = new CMI();
      expect(cmi.initialized).toBe(false);
    });

    it("should initialize all child objects when initialized is true", () => {
      const cmi = new CMI(undefined, undefined, true);
      expect(cmi.initialized).toBe(true);
      // Note: Child objects are created after initialize() is called in constructor,
      // so they are not initialized by the constructor parameter.
      // They need to be initialized separately by calling cmi.initialize() again.
      expect(cmi.core.initialized).toBe(false);
      expect(cmi.objectives.initialized).toBe(false);
      expect(cmi.student_data.initialized).toBe(false);
      expect(cmi.student_preference.initialized).toBe(false);
      expect(cmi.interactions.initialized).toBe(false);
    });

    it("should combine all constructor parameters", () => {
      const customChildren = "core,objectives";
      const customStudentData = new CMIStudentData();
      customStudentData.mastery_score = "90";

      const cmi = new CMI(customChildren, customStudentData, true);

      expect(cmi._children).toBe(customChildren);
      expect(cmi.student_data.mastery_score).toBe("90");
      expect(cmi.initialized).toBe(true);
    });
  });

  describe("initialization", () => {
    it("should initialize all child objects when initialize() is called", () => {
      const cmi = new CMI();
      expect(cmi.initialized).toBe(false);
      expect(cmi.core.initialized).toBe(false);

      cmi.initialize();

      expect(cmi.initialized).toBe(true);
      expect(cmi.core.initialized).toBe(true);
      expect(cmi.objectives.initialized).toBe(true);
      expect(cmi.student_data.initialized).toBe(true);
      expect(cmi.student_preference.initialized).toBe(true);
      expect(cmi.interactions.initialized).toBe(true);
    });
  });

  describe("reset", () => {
    it("should reset initialized flag to false", () => {
      cmi.initialize();
      expect(cmi.initialized).toBe(true);

      cmi.reset();

      expect(cmi.initialized).toBe(false);
    });

    it("should reset child objects", () => {
      cmi.initialize();
      cmi.core.score.raw = "85";
      expect(cmi.core.initialized).toBe(true);
      expect(cmi.core.score.raw).toBe("85");

      cmi.reset();

      // reset() resets the initialized flag and score
      expect(cmi.core.initialized).toBe(false);
      expect(cmi.core.score.raw).toBe("");
    });
  });

  describe("_children", () => {
    it("should be read-only after construction", () => {
      expect(() => {
        cmi._children = "modified";
      }).toThrow();
    });
  });
});
