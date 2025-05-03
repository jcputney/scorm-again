import { describe, expect, it } from "vitest";
import { CMIMetadata } from "../../src/cmi/scorm2004/metadata";
import { scorm2004_constants, scorm2004_errors } from "../../src";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 CMIMetadata Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const metadata = new CMIMetadata();

      expect(metadata._version).toBe("1.0");
      expect(metadata._children).toBe(scorm2004_constants.cmi_children);
    });
  });

  describe("Property Tests", () => {
    describe("_version", () => {
      it("should get _version", () => {
        const metadata = new CMIMetadata();

        expect(metadata._version).toBe("1.0");
      });

      it("should reject modifications to _version", () => {
        const metadata = new CMIMetadata();

        expect(() => {
          metadata._version = "2.0";
        }).toThrow(
          new Scorm2004ValidationError("cmi._version", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });

    describe("_children", () => {
      it("should get _children", () => {
        const metadata = new CMIMetadata();

        expect(metadata._children).toBe(scorm2004_constants.cmi_children);
      });

      it("should reject modifications to _children", () => {
        const metadata = new CMIMetadata();

        expect(() => {
          // eslint-disable-next-line
          // @ts-ignore - Intentionally testing invalid assignment
          metadata._children = "modified_children";
        }).toThrow(
          new Scorm2004ValidationError("cmi._children", scorm2004_errors.READ_ONLY_ELEMENT),
        );
      });
    });
  });

  describe("Method Tests", () => {
    describe("reset", () => {
      it("should reset initialization flag but not properties", () => {
        const metadata = new CMIMetadata();

        metadata.initialize();

        metadata.reset();

        // Properties should not be reset as they are constants
        expect(metadata._version).toBe("1.0");
        expect(metadata._children).toBe(scorm2004_constants.cmi_children);
        expect(metadata.initialized).toBe(false);
      });
    });
  });
});
