import { describe, it, vi } from "vitest";
import { CMIContent } from "../../src/cmi/scorm2004/content";
import { scorm2004_errors } from "../../src/constants/error_codes";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 CMIContent Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const content = new CMIContent();

      expect(content.location).toBe("");
      expect(content.launch_data).toBe("");
      expect(content.suspend_data).toBe("");
    });
  });

  describe("Property Tests", () => {
    describe("location", () => {
      it("should set and get location", () => {
        const content = new CMIContent();

        content.location = "page1";
        expect(content.location).toBe("page1");

        content.location = "page2";
        expect(content.location).toBe("page2");
      });

      it("should reject invalid location values", () => {
        const content = new CMIContent();

        // Create a string that's too long (more than 1000 characters)
        const tooLongLocation = "a".repeat(1001);

        expect(() => {
          content.location = tooLongLocation;
        }).toThrow();
      });
    });

    describe("launch_data", () => {
      it("should set and get launch_data before initialization", () => {
        const content = new CMIContent();

        content.launch_data = "initial data";
        expect(content.launch_data).toBe("initial data");
      });

      it("should reject modifications to launch_data after initialization", () => {
        const content = new CMIContent();

        content.launch_data = "initial data";
        content.initialize();

        expect(() => {
          content.launch_data = "modified data";
        }).toThrow(
          new Scorm2004ValidationError("cmi.launch_data", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });

    describe("suspend_data", () => {
      it("should set and get suspend_data", () => {
        const content = new CMIContent();

        content.suspend_data = "saved state";
        expect(content.suspend_data).toBe("saved state");

        content.suspend_data = "new saved state";
        expect(content.suspend_data).toBe("new saved state");
      });

      it("should reject invalid suspend_data values", () => {
        const content = new CMIContent();

        // Create a string that's too long (more than 64000 characters)
        const tooLongSuspendData = "a".repeat(64001);

        expect(() => {
          content.suspend_data = tooLongSuspendData;
        }).toThrow();
      });
    });
  });

  describe("Method Tests", () => {
    describe("reset", () => {
      it("should reset properties to default values", () => {
        const content = new CMIContent();

        content.location = "page1";
        content.launch_data = "initial data";
        content.suspend_data = "saved state";
        content.initialize();

        content.reset();

        expect(content.location).toBe("");
        // launch_data should not be reset as it's read-only after initialization
        expect(content.launch_data).toBe("initial data");
        expect(content.suspend_data).toBe("");
        expect(content.initialized).toBe(false);
      });
    });
  });
});
