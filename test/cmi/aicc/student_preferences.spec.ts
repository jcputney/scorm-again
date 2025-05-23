import { describe, expect, it, vi } from "vitest";

import { AICCStudentPreferences } from "../../../src/cmi/aicc/student_preferences";
import { CMIArray } from "../../../src/cmi/common/array";

describe("AICCStudentPreferences", () => {
  it("should initialize with default values", () => {
    const studentPreferences = new AICCStudentPreferences();

    // Check default values
    expect(studentPreferences.audio).toBe("");
    expect(studentPreferences.language).toBe("");
    expect(studentPreferences.lesson_type).toBe("");
    expect(studentPreferences.speed).toBe("");
    expect(studentPreferences.text).toBe("");
    expect(studentPreferences.text_color).toBe("");
    expect(studentPreferences.text_location).toBe("");
    expect(studentPreferences.text_size).toBe("");
    expect(studentPreferences.video).toBe("");
    expect(studentPreferences.windows).toBeInstanceOf(CMIArray);
  });

  it("should initialize child objects when initialize is called", () => {
    const studentPreferences = new AICCStudentPreferences();
    const windowsInitializeSpy = vi.spyOn(studentPreferences.windows, "initialize");

    studentPreferences.initialize();

    expect(windowsInitializeSpy).toHaveBeenCalled();
    expect(studentPreferences.initialized).toBe(true);
  });

  describe("Getters and Setters", () => {
    it("should set and get lesson_type property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.lesson_type = "test_lesson_type";
      expect(studentPreferences.lesson_type).toBe("test_lesson_type");
    });

    it("should not set lesson_type property when invalid", () => {
      const studentPreferences = new AICCStudentPreferences();
      // Set a valid value first
      studentPreferences.lesson_type = "test_lesson_type";

      // Try to set an invalid value (too long)
      const longValue = "a".repeat(257);
      try {
        studentPreferences.lesson_type = longValue;
      } catch (e) {
        // Expected to throw an error
      }

      // Should still have the original valid value
      expect(studentPreferences.lesson_type).toBe("test_lesson_type");
    });

    it("should set and get text_color property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.text_color = "red";
      expect(studentPreferences.text_color).toBe("red");
    });

    it("should not set text_color property when invalid", () => {
      const studentPreferences = new AICCStudentPreferences();
      // Set a valid value first
      studentPreferences.text_color = "red";

      // Try to set an invalid value (too long)
      const longValue = "a".repeat(257);
      try {
        studentPreferences.text_color = longValue;
      } catch (e) {
        // Expected to throw an error
      }

      // Should still have the original valid value
      expect(studentPreferences.text_color).toBe("red");
    });

    it("should set and get text_location property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.text_location = "top";
      expect(studentPreferences.text_location).toBe("top");
    });

    it("should not set text_location property when invalid", () => {
      const studentPreferences = new AICCStudentPreferences();
      // Set a valid value first
      studentPreferences.text_location = "top";

      // Try to set an invalid value (too long)
      const longValue = "a".repeat(257);
      try {
        studentPreferences.text_location = longValue;
      } catch (e) {
        // Expected to throw an error
      }

      // Should still have the original valid value
      expect(studentPreferences.text_location).toBe("top");
    });

    it("should set and get text_size property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.text_size = "large";
      expect(studentPreferences.text_size).toBe("large");
    });

    it("should not set text_size property when invalid", () => {
      const studentPreferences = new AICCStudentPreferences();
      // Set a valid value first
      studentPreferences.text_size = "large";

      // Try to set an invalid value (too long)
      const longValue = "a".repeat(257);
      try {
        studentPreferences.text_size = longValue;
      } catch (e) {
        // Expected to throw an error
      }

      // Should still have the original valid value
      expect(studentPreferences.text_size).toBe("large");
    });

    it("should set and get video property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.video = "on";
      expect(studentPreferences.video).toBe("on");
    });

    it("should not set video property when invalid", () => {
      const studentPreferences = new AICCStudentPreferences();
      // Set a valid value first
      studentPreferences.video = "on";

      // Try to set an invalid value (too long)
      const longValue = "a".repeat(257);
      try {
        studentPreferences.video = longValue;
      } catch (e) {
        // Expected to throw an error
      }

      // Should still have the original valid value
      expect(studentPreferences.video).toBe("on");
    });

    // Also test inherited properties
    it("should set and get audio property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.audio = "50";
      expect(studentPreferences.audio).toBe("50");
    });

    it("should set and get language property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.language = "en-US";
      expect(studentPreferences.language).toBe("en-US");
    });

    it("should set and get speed property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.speed = "50";
      expect(studentPreferences.speed).toBe("50");
    });

    it("should set and get text property", () => {
      const studentPreferences = new AICCStudentPreferences();
      studentPreferences.text = "0";
      expect(studentPreferences.text).toBe("0");
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation with all properties", () => {
      const studentPreferences = new AICCStudentPreferences();

      // Set some values
      studentPreferences.audio = "50";
      studentPreferences.language = "en-US";
      studentPreferences.lesson_type = "test_lesson_type";
      studentPreferences.speed = "50";
      studentPreferences.text = "0";
      studentPreferences.text_color = "red";
      studentPreferences.text_location = "top";
      studentPreferences.text_size = "large";
      studentPreferences.video = "on";

      const result = studentPreferences.toJSON();

      // Check that all properties are included
      expect(result).toHaveProperty("audio");
      expect(result).toHaveProperty("language");
      expect(result).toHaveProperty("lesson_type");
      expect(result).toHaveProperty("speed");
      expect(result).toHaveProperty("text");
      expect(result).toHaveProperty("text_color");
      expect(result).toHaveProperty("text_location");
      expect(result).toHaveProperty("text_size");
      expect(result).toHaveProperty("video");
      expect(result).toHaveProperty("windows");

      // Check values
      expect(result.audio).toBe("50");
      expect(result.language).toBe("en-US");
      expect(result.lesson_type).toBe("test_lesson_type");
      expect(result.speed).toBe("50");
      expect(result.text).toBe("0");
      expect(result.text_color).toBe("red");
      expect(result.text_location).toBe("top");
      expect(result.text_size).toBe("large");
      expect(result.video).toBe("on");
      expect(result.windows).toBe(studentPreferences.windows);
    });
  });
});
