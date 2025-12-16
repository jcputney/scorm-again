import { describe, expect, it, beforeEach } from "vitest";
import { ADL, ADLData, ADLDataObject } from "../../../src/cmi/scorm2004/adl";
import Scorm2004API from "../../../src/Scorm2004API";
import { scorm2004_errors } from "../../../src/constants/error_codes";
import { LogLevelEnum } from "../../../src/constants/enums";

/**
 * SCORM 2004 4th Edition ADL Data Compliance Tests
 * Tests for adl.data requirements from the specification
 */
describe("ADL Data Compliance Tests", () => {
  describe("ADLDataObject - Error Handling Compliance", () => {
    let adlDataObject: ADLDataObject;

    beforeEach(() => {
      adlDataObject = new ADLDataObject();
    });

    // REQ-ADL-017: store SPM is 64000 characters
    describe("REQ-ADL-017: store accepts 64000 characters", () => {
      it("should accept exactly 64000 characters", () => {
        const maxStore = "a".repeat(64000);
        adlDataObject.store = maxStore;
        expect(adlDataObject.store).toBe(maxStore);
      });

      it("should throw error when setting 64001 characters", () => {
        const tooLongStore = "a".repeat(64001);
        expect(() => {
          adlDataObject.store = tooLongStore;
        }).toThrow();
      });
    });

    // REQ-ADL-015: id is read-only after initialization
    describe("REQ-ADL-015: id is read-only after initialization", () => {
      it("should allow setting id before initialization", () => {
        adlDataObject.id = "test_id";
        expect(adlDataObject.id).toBe("test_id");
      });

      it("should throw error 404 when setting id after initialization", () => {
        adlDataObject.id = "initial_id";
        adlDataObject.initialize();

        expect(() => {
          adlDataObject.id = "new_id";
        }).toThrow();

        try {
          adlDataObject.id = "new_id";
        } catch (e: any) {
          expect(e.errorCode).toBe(scorm2004_errors.READ_ONLY_ELEMENT);
        }
      });
    });

    // REQ-ADL-020: GetValue on uninitialized store returns error 403
    describe("REQ-ADL-020: GetValue on uninitialized store returns error 403", () => {
      it("should throw error 403 when getting uninitialized store after init", () => {
        adlDataObject.id = "test_id";
        adlDataObject.initialize();

        expect(() => {
          const _ = adlDataObject.store;
        }).toThrow();

        try {
          const _ = adlDataObject.store;
        } catch (e: any) {
          expect(e.errorCode).toBe(scorm2004_errors.VALUE_NOT_INITIALIZED);
        }
      });

      it("should return store value after it has been set", () => {
        adlDataObject.id = "test_id";
        adlDataObject.store = "test_store";
        adlDataObject.initialize();

        expect(adlDataObject.store).toBe("test_store");
      });
    });

    // REQ-ADL-025: Dependency check - id must be set before store
    describe("REQ-ADL-025: store requires id to be set first", () => {
      it("should throw error 408 when setting store before id after init", () => {
        adlDataObject.initialize();

        expect(() => {
          adlDataObject.store = "test_store";
        }).toThrow();

        try {
          adlDataObject.store = "test_store";
        } catch (e: any) {
          expect(e.errorCode).toBe(scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED);
        }
      });

      it("should allow setting store after id is set and after init", () => {
        adlDataObject.id = "test_id";
        adlDataObject.initialize();

        // This should work because id was set before init
        adlDataObject.store = "test_store";
        expect(adlDataObject.store).toBe("test_store");
      });

      it("should allow setting store before id when not initialized", () => {
        // Before initialization, dependency check is not enforced
        adlDataObject.store = "test_store";
        expect(adlDataObject.store).toBe("test_store");
      });
    });

    // REQ-ADL-012: id accepts valid URI/URN formats
    describe("REQ-ADL-012: id accepts valid URI/URN formats", () => {
      it("should accept simple identifier", () => {
        adlDataObject.id = "simple_id";
        expect(adlDataObject.id).toBe("simple_id");
      });

      it("should accept URN format", () => {
        adlDataObject.id = "urn:scorm:adl:data:1";
        expect(adlDataObject.id).toBe("urn:scorm:adl:data:1");
      });

      it("should accept URI format", () => {
        adlDataObject.id = "http://example.com/data/1";
        expect(adlDataObject.id).toBe("http://example.com/data/1");
      });

      it("should accept identifier up to 4000 characters", () => {
        const longId = "a".repeat(4000);
        adlDataObject.id = longId;
        expect(adlDataObject.id).toBe(longId);
      });
    });
  });

  describe("API-Level ADL Data Compliance", () => {
    let api: Scorm2004API;

    beforeEach(() => {
      api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      api.lmsInitialize();
    });

    describe("adl.data GetValue/SetValue through API", () => {
      it("should return 'id,store' for adl.data._children", () => {
        const children = api.lmsGetValue("adl.data._children");
        expect(children).toBe("id,store");
      });

      it("should return error 404 when setting adl.data._children", () => {
        const result = api.lmsSetValue("adl.data._children", "invalid");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });

      it("should return '0' for adl.data._count when empty", () => {
        const count = api.lmsGetValue("adl.data._count");
        expect(String(count)).toBe("0");
      });

      it("should return error 404 when setting adl.data._count", () => {
        const result = api.lmsSetValue("adl.data._count", "5");
        expect(result).toBe("false");
        expect(api.lmsGetLastError()).toBe("404");
      });
    });

    describe("adl.data.n element access through API", () => {
      it("should return error for out-of-bounds GetValue on adl.data.n.id", () => {
        // Try to get data that doesn't exist
        const result = api.lmsGetValue("adl.data.0.id");
        expect(result).toBe("");
        // Should be an error (301, 401, or 403)
        const error = api.lmsGetLastError();
        expect(parseInt(error)).toBeGreaterThan(0);
      });
    });
  });
});
