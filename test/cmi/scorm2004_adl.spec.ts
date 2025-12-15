import { describe, expect, it, vi } from "vitest";
import { ADL, ADLData, ADLDataObject, ADLNav, ADLNavRequestValid } from "../../src";
import { NAVBoolean } from "../../src/constants/enums";
import { Sequencing } from "../../src/cmi/scorm2004/sequencing/sequencing";

describe("SCORM 2004 ADL Tests", () => {
  describe("ADL Class Tests", () => {
    it("should initialize with default values", () => {
      const adl = new ADL();

      expect(adl.nav).toBeDefined();
      expect(adl.nav.request).toBe("_none_");

      expect(adl.data).toBeDefined();
    });

    it("should reset to default values", () => {
      const adl = new ADL();
      adl.nav.request = "continue";

      adl.reset();

      expect(adl.nav.request).toBe("_none_");
    });

    it("should export to JSON correctly", () => {
      const adl = new ADL();
      adl.nav.request = "continue";

      const json = JSON.stringify(adl);
      const parsed = JSON.parse(json);

      expect(parsed.nav.request).toBe("continue");
    });
  });

  describe("ADLNav Class Tests", () => {
    it("should initialize with default values", () => {
      const nav = new ADLNav();

      expect(nav.request).toBe("_none_");
      expect(nav.request_valid).toBeDefined();
    });

    it("should reset to default values", () => {
      const nav = new ADLNav();
      nav.request = "continue";

      nav.reset();

      expect(nav.request).toBe("_none_");
    });

    it("should accept valid request values", () => {
      const nav = new ADLNav();

      expect(() => {
        nav.request = "continue";
      }).not.toThrow();

      expect(nav.request).toBe("continue");

      expect(() => {
        nav.request = "previous";
      }).not.toThrow();

      expect(nav.request).toBe("previous");

      expect(() => {
        nav.request = "choice";
      }).not.toThrow();

      expect(nav.request).toBe("choice");

      expect(() => {
        nav.request = "exit";
      }).not.toThrow();

      expect(nav.request).toBe("exit");

      expect(() => {
        nav.request = "exitAll";
      }).not.toThrow();

      expect(nav.request).toBe("exitAll");

      expect(() => {
        nav.request = "abandon";
      }).not.toThrow();

      expect(nav.request).toBe("abandon");

      expect(() => {
        nav.request = "abandonAll";
      }).not.toThrow();

      expect(nav.request).toBe("abandonAll");

      expect(() => {
        nav.request = "suspendAll";
      }).not.toThrow();

      expect(nav.request).toBe("suspendAll");

      expect(() => {
        nav.request = "_none_";
      }).not.toThrow();

      expect(nav.request).toBe("_none_");
    });

    it("should reject invalid request values", () => {
      const nav = new ADLNav();

      expect(() => {
        nav.request = "invalid";
      }).toThrow();

      expect(() => {
        nav.request = "CONTINUE";
      }).toThrow();

      expect(() => {
        nav.request = "next";
      }).toThrow();
    });

    it("should export to JSON correctly", () => {
      const nav = new ADLNav();
      nav.request = "continue";

      const json = JSON.stringify(nav);
      const parsed = JSON.parse(json);

      expect(parsed.request).toBe("continue");
    });
  });

  describe("ADLNavRequestValid Class Tests", () => {
    it("should initialize with default values", () => {
      const requestValid = new ADLNavRequestValid();

      expect(requestValid.continue).toBe(NAVBoolean.UNKNOWN);
      expect(requestValid.previous).toBe(NAVBoolean.UNKNOWN);
      expect(requestValid.choice).toBeDefined();
      expect(requestValid.jump).toBeDefined();
    });

    it("should reset to default values", () => {
      const requestValid = new ADLNavRequestValid();
      requestValid.continue = NAVBoolean.TRUE;
      requestValid.previous = NAVBoolean.TRUE;

      requestValid.reset();

      expect(requestValid.continue).toBe(NAVBoolean.UNKNOWN);
      expect(requestValid.previous).toBe(NAVBoolean.UNKNOWN);
    });

    it("should accept valid continue values", () => {
      const requestValid = new ADLNavRequestValid();

      expect(() => {
        requestValid.continue = NAVBoolean.TRUE;
      }).not.toThrow();

      expect(requestValid.continue).toBe(NAVBoolean.TRUE);

      expect(() => {
        requestValid.continue = NAVBoolean.FALSE;
      }).not.toThrow();

      expect(requestValid.continue).toBe(NAVBoolean.FALSE);

      expect(() => {
        requestValid.continue = NAVBoolean.UNKNOWN;
      }).not.toThrow();

      expect(requestValid.continue).toBe(NAVBoolean.UNKNOWN);
    });

    it("should accept valid previous values", () => {
      const requestValid = new ADLNavRequestValid();

      expect(() => {
        requestValid.previous = NAVBoolean.TRUE;
      }).not.toThrow();

      expect(requestValid.previous).toBe(NAVBoolean.TRUE);

      expect(() => {
        requestValid.previous = NAVBoolean.FALSE;
      }).not.toThrow();

      expect(requestValid.previous).toBe(NAVBoolean.FALSE);

      expect(() => {
        requestValid.previous = NAVBoolean.UNKNOWN;
      }).not.toThrow();

      expect(requestValid.previous).toBe(NAVBoolean.UNKNOWN);
    });

    it("should accept valid choice values", () => {
      const requestValid = new ADLNavRequestValid();

      expect(() => {
        requestValid.choice = { "{target=target1}": "true" };
      }).not.toThrow();

      // Choice is now a wrapper class, check internal values via getAll()
      expect((requestValid.choice as any).getAll()).toEqual({
        "{target=target1}": NAVBoolean.TRUE,
      });

      expect(() => {
        requestValid.choice = { "{target=target1}": "false" };
      }).not.toThrow();

      expect((requestValid.choice as any).getAll()).toEqual({
        "{target=target1}": NAVBoolean.FALSE,
      });

      expect(() => {
        requestValid.choice = { "{target=target1}": "unknown" };
      }).not.toThrow();

      expect((requestValid.choice as any).getAll()).toEqual({
        "{target=target1}": NAVBoolean.UNKNOWN,
      });
    });

    it("should accept valid jump values", () => {
      const requestValid = new ADLNavRequestValid();

      expect(() => {
        requestValid.jump = { "{target=target1}": "true" };
      }).not.toThrow();

      // Jump is now a wrapper class, check internal values via getAll()
      expect((requestValid.jump as any).getAll()).toEqual({
        "{target=target1}": NAVBoolean.TRUE,
      });

      expect(() => {
        requestValid.jump = { "{target=target1}": "false" };
      }).not.toThrow();

      expect((requestValid.jump as any).getAll()).toEqual({
        "{target=target1}": NAVBoolean.FALSE,
      });

      expect(() => {
        requestValid.jump = { "{target=target1}": "unknown" };
      }).not.toThrow();

      expect((requestValid.jump as any).getAll()).toEqual({
        "{target=target1}": NAVBoolean.UNKNOWN,
      });
    });

    it("should reject invalid jump values", () => {
      const requestValid = new ADLNavRequestValid();

      expect(() => {
        requestValid.jump = "not an object" as any;
      }).toThrow();

      expect(() => {
        requestValid.jump = { "invalid-key": "true" };
      }).toThrow();
    });

    it("should reject setting choice after initialization", () => {
      const requestValid = new ADLNavRequestValid();
      requestValid.initialize();

      expect(() => {
        requestValid.choice = { "{target=target1}": "true" };
      }).toThrow();
    });

    it("should reject setting jump after initialization", () => {
      const requestValid = new ADLNavRequestValid();
      requestValid.initialize();

      expect(() => {
        requestValid.jump = { "{target=target1}": "true" };
      }).toThrow();
    });

    it("should export to JSON correctly", () => {
      const requestValid = new ADLNavRequestValid();
      requestValid.continue = NAVBoolean.TRUE;
      requestValid.previous = NAVBoolean.FALSE;
      requestValid.choice = { "{target=target1}": "true" };
      requestValid.jump = { "{target=target2}": "false" };

      const json = JSON.stringify(requestValid);
      const parsed = JSON.parse(json);

      expect(parsed.continue).toBe("true");
      expect(parsed.previous).toBe("false");
      expect(parsed.choice["{target=target1}"]).toBe("true");
      expect(parsed.jump["{target=target2}"]).toBe("false");
    });
  });

  describe("ADLData Class Tests", () => {
    it("should initialize with default values", () => {
      const data = new ADLData();
      expect(data).toBeDefined();
      expect(data._children).toBeDefined();
    });
  });

  describe("ADLDataObject Class Tests", () => {
    it("should initialize with default values", () => {
      const dataObj = new ADLDataObject();
      expect(dataObj.id).toBe("");
      expect(dataObj.store).toBe("");
    });

    it("should set and get id correctly", () => {
      const dataObj = new ADLDataObject();
      dataObj.id = "test-id";
      expect(dataObj.id).toBe("test-id");
    });

    it("should set and get store correctly", () => {
      const dataObj = new ADLDataObject();
      dataObj.store = "test-store";
      expect(dataObj.store).toBe("test-store");
    });

    it("should reset correctly", () => {
      const dataObj = new ADLDataObject();
      dataObj.id = "test-id";
      dataObj.store = "test-store";

      dataObj.reset();

      // Values should remain after reset, only initialized flag is changed
      expect(dataObj.id).toBe("test-id");
      expect(dataObj.store).toBe("test-store");
    });

    it("should handle toJSON correctly", () => {
      const dataObj = new ADLDataObject();
      dataObj.id = "test-id";
      dataObj.store = "test-store";

      const json = JSON.stringify(dataObj);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe("test-id");
      expect(parsed.store).toBe("test-store");
    });
  });

  describe("ADL Initialize and Sequencing Tests", () => {
    it("should initialize ADL and its children", () => {
      const adl = new ADL();
      adl.initialize();

      expect(adl.initialized).toBe(true);
      expect(adl.nav.initialized).toBe(true);
      expect(adl.nav.request_valid.initialized).toBe(true);
    });

    it("should handle sequencing assignment", () => {
      const adl = new ADL();
      const sequencing = new Sequencing();

      adl.sequencing = sequencing;

      expect(adl.sequencing).toBe(sequencing);
      expect(adl.nav.sequencing).toBe(sequencing);
      expect(sequencing.adlNav).toBe(adl.nav);
    });

    it("should handle null sequencing assignment", () => {
      const adl = new ADL();
      const sequencing = new Sequencing();

      adl.sequencing = sequencing;
      expect(adl.sequencing).toBe(sequencing);

      adl.sequencing = null;
      expect(adl.sequencing).toBe(null);
    });

    it("should reset ADLNav and clear sequencing", () => {
      const adl = new ADL();
      const nav = adl.nav;
      const sequencing = new Sequencing();

      nav.sequencing = sequencing;
      expect(nav.sequencing).toBe(sequencing);

      nav.reset();
      expect(nav.sequencing).toBe(null);
      expect(sequencing.adlNav).toBe(null);
      expect(nav.request).toBe("_none_");
    });

    it("should store navigation request when set", () => {
      const adl = new ADL();
      const mockSequencing = {
        adlNav: null,
      };

      adl.nav.sequencing = mockSequencing as any;
      adl.nav.request = "continue";

      // The ADL.nav setter now only stores the value - navigation processing is handled by SequencingService
      expect(adl.nav.request).toBe("continue");
    });
  });
});
