import { describe, expect, it } from "vitest";
import { CMIArray } from "../../../src/cmi/common/array";

describe("CMIArray Reset Tests", () => {
  describe("reset()", () => {
    // Mock child object class for testing
    class MockChild {
      public id: string;
      public resetCalled: boolean = false;

      constructor(id: string) {
        this.id = id;
      }

      reset() {
        this.resetCalled = true;
        this.id = "";
      }
    }

    it("should reset all child objects when wipe is false", () => {
      // Create CMIArray with some child objects
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Add mock children
      const child1 = new MockChild("child1");
      const child2 = new MockChild("child2");
      array.childArray.push(child1);
      array.childArray.push(child2);

      // Reset with wipe=false (default)
      array.reset();

      // Verify children were kept but reset was called on each
      expect(array.childArray.length).toBe(2);
      expect(array.childArray[0].resetCalled).toBe(true);
      expect(array.childArray[1].resetCalled).toBe(true);
      expect(array.childArray[0].id).toBe("");
      expect(array.childArray[1].id).toBe("");
    });

    it("should wipe all child objects when wipe is true", () => {
      // Create CMIArray with some child objects
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Add mock children
      const child1 = new MockChild("child1");
      const child2 = new MockChild("child2");
      array.childArray.push(child1);
      array.childArray.push(child2);

      // Reset with wipe=true
      array.reset(true);

      // Verify all children were removed
      expect(array.childArray.length).toBe(0);
    });

    it("should set _initialized to false", () => {
      // Create CMIArray
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Set initialized to true
      (array as any)._initialized = true;

      // Reset
      array.reset();

      // Verify initialized is false
      expect((array as any)._initialized).toBe(false);
    });

    it("should handle empty arrays", () => {
      // Create empty CMIArray
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Reset without errors
      expect(() => array.reset()).not.toThrow();
      expect(array.childArray.length).toBe(0);

      // Reset with wipe=true without errors
      expect(() => array.reset(true)).not.toThrow();
      expect(array.childArray.length).toBe(0);
    });

    it("should allow adding new children after reset with wipe=true", () => {
      // Create CMIArray with children
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Add mock children
      array.childArray.push(new MockChild("child1"));

      // Reset with wipe=true
      array.reset(true);

      // Add a new child
      const newChild = new MockChild("newChild");
      array.childArray.push(newChild);

      // Verify new child was added
      expect(array.childArray.length).toBe(1);
      expect(array.childArray[0].id).toBe("newChild");
    });

    it("should allow adding new children after reset with wipe=false", () => {
      // Create CMIArray with children
      const array = new CMIArray({
        CMIElement: "cmi.test",
        children: "id",
      });

      // Add mock child
      array.childArray.push(new MockChild("child1"));

      // Reset with wipe=false
      array.reset(false);

      // Add a new child
      const newChild = new MockChild("newChild");
      array.childArray.push(newChild);

      // Verify both children exist, with first one reset
      expect(array.childArray.length).toBe(2);
      expect(array.childArray[0].id).toBe(""); // Reset was called
      expect(array.childArray[1].id).toBe("newChild");
    });
  });
});
