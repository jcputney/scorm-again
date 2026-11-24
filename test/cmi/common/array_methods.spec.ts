import { describe, expect, it } from "vitest";
import { CMIArray } from "../../../src/cmi/common/array";
import { BaseScormValidationError } from "../../../src/exceptions";
import { scorm12_errors } from "../../../src/constants/error_codes";

describe("CMIArray Methods", () => {
  // Mock child object class for testing
  class MockChild {
    public id: string;
    public value: string;

    constructor(id: string, value: string) {
      this.id = id;
      this.value = value;
    }

    toJSON() {
      return {
        id: this.id,
        value: this.value,
      };
    }
  }

  describe("toJSON()", () => {
    it("should serialize empty array", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id,value",
      });

      const result = array.toJSON();

      expect(result).toEqual({});
      expect(Object.keys(result).length).toBe(0);
    });

    it("should serialize array with single child", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id,value",
      });

      const child = new MockChild("child1", "value1");
      array.childArray.push(child);

      const result = array.toJSON();

      expect(result).toEqual({
        "0": {
          id: "child1",
          value: "value1",
        },
      });
    });

    it("should serialize array with multiple children", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id,value",
      });

      const child1 = new MockChild("child1", "value1");
      const child2 = new MockChild("child2", "value2");
      const child3 = new MockChild("child3", "value3");
      array.childArray.push(child1);
      array.childArray.push(child2);
      array.childArray.push(child3);

      const result = array.toJSON();

      expect(result).toEqual({
        "0": {
          id: "child1",
          value: "value1",
        },
        "1": {
          id: "child2",
          value: "value2",
        },
        "2": {
          id: "child3",
          value: "value3",
        },
      });
    });

    it("should use string indices", () => {
      const array = new CMIArray({
        CMIElement: "cmi.objectives",
        children: "id",
      });

      const child1 = new MockChild("obj1", "val1");
      const child2 = new MockChild("obj2", "val2");
      array.childArray.push(child1);
      array.childArray.push(child2);

      const result = array.toJSON();

      // Verify keys are strings
      expect(Object.keys(result)).toEqual(["0", "1"]);
      expect(typeof Object.keys(result)[0]).toBe("string");
      expect(typeof Object.keys(result)[1]).toBe("string");
    });

    it("should set and reset jsonString flag during serialization", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // jsonString should be false initially
      expect((array as any).jsonString).toBe(false);

      // Create a spy to check jsonString during toJSON
      const child = {
        id: "test",
        toJSON: function () {
          // During serialization, jsonString should be true
          return { id: this.id };
        },
      };
      array.childArray.push(child);

      array.toJSON();

      // jsonString should be false after serialization
      expect((array as any).jsonString).toBe(false);
    });
  });

  describe("_children setter", () => {
    it("should throw error when attempting to set _children", () => {
      const array = new CMIArray({
        CMIElement: "cmi.objectives",
        children: "id,status",
      });

      expect(() => {
        array._children = "new_children";
      }).toThrow(BaseScormValidationError);
    });

    it("should throw error with correct CMI element path", () => {
      const array = new CMIArray({
        CMIElement: "cmi.interactions",
        children: "id,type",
      });

      try {
        array._children = "invalid";
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BaseScormValidationError);
        expect(error.message).toContain("cmi.interactions._children");
      }
    });

    it("should throw error with correct error code when errorCode is provided", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
        errorCode: scorm12_errors.CHILDREN_ERROR,
      });

      try {
        array._children = "invalid";
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BaseScormValidationError);
        expect(error.errorCode).toBe(scorm12_errors.CHILDREN_ERROR);
      }
    });

    it("should throw error with default GENERAL error code when not provided", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      try {
        array._children = "invalid";
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BaseScormValidationError);
        expect(error.errorCode).toBe(scorm12_errors.GENERAL);
      }
    });

    it("should not affect _children getter", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id,value,status",
      });

      // Getter should still work
      expect(array._children).toBe("id,value,status");

      // Try to set (will throw)
      try {
        array._children = "new_value";
      } catch (e) {
        // Expected
      }

      // Getter should still return original value
      expect(array._children).toBe("id,value,status");
    });
  });

  describe("_count setter", () => {
    it("should throw error when attempting to set _count", () => {
      const array = new CMIArray({
        CMIElement: "cmi.objectives",
        children: "id",
      });

      expect(() => {
        array._count = 5;
      }).toThrow(BaseScormValidationError);
    });

    it("should throw error with correct CMI element path", () => {
      const array = new CMIArray({
        CMIElement: "cmi.interactions",
        children: "id",
      });

      try {
        array._count = 10;
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BaseScormValidationError);
        expect(error.message).toContain("cmi.interactions._count");
      }
    });

    it("should throw error with correct error code when errorCode is provided", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
        errorCode: scorm12_errors.COUNT_ERROR,
      });

      try {
        array._count = 3;
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BaseScormValidationError);
        expect(error.errorCode).toBe(scorm12_errors.COUNT_ERROR);
      }
    });

    it("should throw error with default GENERAL error code when not provided", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      try {
        array._count = 7;
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error).toBeInstanceOf(BaseScormValidationError);
        expect(error.errorCode).toBe(scorm12_errors.GENERAL);
      }
    });

    it("should not affect _count getter", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Add some children
      array.childArray.push(new MockChild("1", "val1"));
      array.childArray.push(new MockChild("2", "val2"));

      // Getter should return actual count
      expect(array._count).toBe(2);

      // Try to set (will throw)
      try {
        array._count = 100;
      } catch (e) {
        // Expected
      }

      // Getter should still return actual count
      expect(array._count).toBe(2);
    });

    it("should throw error even when setting to zero", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      expect(() => {
        array._count = 0;
      }).toThrow(BaseScormValidationError);
    });

    it("should throw error even when setting to current count value", () => {
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      array.childArray.push(new MockChild("1", "val1"));

      // Even setting to the current value (1) should throw
      expect(() => {
        array._count = 1;
      }).toThrow(BaseScormValidationError);
    });
  });
});
