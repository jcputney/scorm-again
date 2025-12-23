import { describe, it, expect, beforeEach } from "vitest";
import { CMIStudentData } from "../../../src/cmi/scorm12/student_data";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";

describe("CMIStudentData Edge Cases", () => {
  let studentData: CMIStudentData;

  beforeEach(() => {
    studentData = new CMIStudentData();
  });

  describe("max_time_allowed setter", () => {
    it("should handle undefined value", () => {
      studentData.max_time_allowed = undefined as unknown as string;
      expect(studentData.max_time_allowed).toBe("");
    });

    it("should handle null value", () => {
      studentData.max_time_allowed = null as unknown as string;
      expect(studentData.max_time_allowed).toBe("");
    });

    it("should handle empty string", () => {
      studentData.max_time_allowed = "01:00:00";
      studentData.max_time_allowed = "";
      expect(studentData.max_time_allowed).toBe("");
    });

    it("should parse SCORM 1.2 timespan format", () => {
      studentData.max_time_allowed = "01:30:00";
      expect(studentData.max_time_allowed).toBe("01:30:00");
    });

    it("should parse ISO 8601 duration format", () => {
      studentData.max_time_allowed = "PT1H30M";
      expect(studentData.max_time_allowed).toBe("01:30:00");
    });

    it("should throw error for invalid format", () => {
      expect(() => {
        studentData.max_time_allowed = "invalid";
      }).toThrow(Scorm12ValidationError);
    });

    it("should prevent setting after initialization", () => {
      studentData.initialize();
      expect(() => {
        studentData.max_time_allowed = "01:00:00";
      }).toThrow(Scorm12ValidationError);
    });

    it("should convert non-string values to string", () => {
      // Test the String() conversion branch in line 157
      const numericValue = { toString: () => "02:30:00" };
      studentData.max_time_allowed = numericValue as unknown as string;
      expect(studentData.max_time_allowed).toBe("02:30:00");
    });
  });

  describe("time_limit_action setter", () => {
    it("should handle undefined value", () => {
      studentData.time_limit_action = undefined as unknown as string;
      expect(studentData.time_limit_action).toBe("");
    });

    it("should handle null value", () => {
      studentData.time_limit_action = null as unknown as string;
      expect(studentData.time_limit_action).toBe("");
    });

    it("should accept valid time limit actions", () => {
      const validActions = ["exit,message", "exit,no message", "continue,message", "continue,no message"];

      validActions.forEach((action) => {
        studentData.time_limit_action = action;
        expect(studentData.time_limit_action).toBe(action);
      });
    });

    it("should throw error for invalid action", () => {
      expect(() => {
        studentData.time_limit_action = "invalid";
      }).toThrow(Scorm12ValidationError);
    });

    it("should prevent setting after initialization", () => {
      studentData.initialize();
      expect(() => {
        studentData.time_limit_action = "exit,message";
      }).toThrow(Scorm12ValidationError);
    });

    it("should convert non-string values to string", () => {
      // Test the String() conversion branch in line 189
      const objectValue = { toString: () => "exit,message" };
      studentData.time_limit_action = objectValue as unknown as string;
      expect(studentData.time_limit_action).toBe("exit,message");
    });
  });

  describe("mastery_score setter", () => {
    it("should handle undefined value", () => {
      studentData.mastery_score = undefined as unknown as string;
      expect(studentData.mastery_score).toBe("");
    });

    it("should handle null value", () => {
      studentData.mastery_score = null as unknown as string;
      expect(studentData.mastery_score).toBe("");
    });

    it("should handle empty string", () => {
      studentData.mastery_score = "80";
      studentData.mastery_score = "";
      expect(studentData.mastery_score).toBe("");
    });

    it("should accept valid mastery scores", () => {
      studentData.mastery_score = "80";
      expect(studentData.mastery_score).toBe("80");
    });

    it("should normalize number to string", () => {
      studentData.mastery_score = 75 as unknown as string;
      expect(studentData.mastery_score).toBe("75");
    });

    it("should throw error for invalid range", () => {
      expect(() => {
        studentData.mastery_score = "150";
      }).toThrow(Scorm12ValidationError);
    });

    it("should prevent setting after initialization", () => {
      studentData.initialize();
      expect(() => {
        studentData.mastery_score = "80";
      }).toThrow(Scorm12ValidationError);
    });
  });

  describe("_children property", () => {
    it("should return default children", () => {
      expect(studentData._children).toBeDefined();
      expect(typeof studentData._children).toBe("string");
    });

    it("should accept custom children in constructor", () => {
      const customChildren = "custom,children,list";
      const customData = new CMIStudentData(customChildren);
      expect(customData._children).toBe(customChildren);
    });

    it("should throw error when trying to set _children", () => {
      expect(() => {
        studentData._children = "new,children";
      }).toThrow(Scorm12ValidationError);
    });
  });

  describe("reset method", () => {
    it("should reset initialized state", () => {
      studentData.initialize();
      expect(studentData.initialized).toBe(true);

      studentData.reset();
      expect(studentData.initialized).toBe(false);
    });
  });

  describe("toJSON method", () => {
    it("should serialize all properties with default values", () => {
      const json = studentData.toJSON();
      expect(json).toEqual({
        mastery_score: "",
        max_time_allowed: "",
        time_limit_action: "",
      });
    });

    it("should serialize all properties with set values", () => {
      studentData.mastery_score = "80";
      studentData.max_time_allowed = "01:00:00";
      studentData.time_limit_action = "exit,message";

      const json = studentData.toJSON();
      expect(json).toEqual({
        mastery_score: "80",
        max_time_allowed: "01:00:00",
        time_limit_action: "exit,message",
      });
    });

    it("should handle mixed set and unset properties", () => {
      studentData.mastery_score = "75";
      // Leave max_time_allowed and time_limit_action unset

      const json = studentData.toJSON();
      expect(json).toEqual({
        mastery_score: "75",
        max_time_allowed: "",
        time_limit_action: "",
      });
    });
  });
});
