import { describe, it } from "mocha";
import { expect } from "expect";
import { ADL, ADLNav, ADLNavRequestValid } from "../../src/cmi/scorm2004/adl";
import { NAVBoolean } from "../../src/constants/enums";

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
      expect(requestValid.choice).toEqual({});
      expect(requestValid.jump).toEqual({});
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

      expect(requestValid.choice).toEqual({
        "{target=target1}": NAVBoolean.TRUE,
      });

      expect(() => {
        requestValid.choice = { "{target=target1}": "false" };
      }).not.toThrow();

      expect(requestValid.choice).toEqual({
        "{target=target1}": NAVBoolean.FALSE,
      });

      expect(() => {
        requestValid.choice = { "{target=target1}": "unknown" };
      }).not.toThrow();

      expect(requestValid.choice).toEqual({
        "{target=target1}": NAVBoolean.UNKNOWN,
      });
    });

    it("should export to JSON correctly", () => {
      const requestValid = new ADLNavRequestValid();
      requestValid.continue = NAVBoolean.TRUE;
      requestValid.previous = NAVBoolean.FALSE;
      requestValid.choice = { "{target=target1}": "true" };

      const json = JSON.stringify(requestValid);
      const parsed = JSON.parse(json);

      expect(parsed.continue).toBe("true");
      expect(parsed.previous).toBe("false");
      expect(parsed.choice["{target=target1}"]).toBe("true");
    });
  });
});
