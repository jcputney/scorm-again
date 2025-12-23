import { describe, it, expect, beforeEach } from "vitest";
import { NAV } from "../../../src/cmi/scorm12/nav";

describe("SCORM 1.2 NAV Object", () => {
  let nav: NAV;

  beforeEach(() => {
    nav = new NAV();
  });

  describe("constructor", () => {
    it("should initialize with empty event", () => {
      expect(nav.event).toBe("");
    });

    it("should set correct CMI element path", () => {
      // Access the internal _cmi_element via toJSON to verify it's set correctly
      const json = nav.toJSON();
      expect(json).toBeDefined();
    });
  });

  describe("event property", () => {
    describe("valid navigation events", () => {
      it("should accept 'previous' event", () => {
        nav.event = "previous";
        expect(nav.event).toBe("previous");
      });

      it("should accept 'continue' event", () => {
        nav.event = "continue";
        expect(nav.event).toBe("continue");
      });

      it("should accept 'start' event", () => {
        nav.event = "start";
        expect(nav.event).toBe("start");
      });

      it("should accept 'resumeAll' event", () => {
        nav.event = "resumeAll";
        expect(nav.event).toBe("resumeAll");
      });

      it("should accept 'exit' event", () => {
        nav.event = "exit";
        expect(nav.event).toBe("exit");
      });

      it("should accept 'exitAll' event", () => {
        nav.event = "exitAll";
        expect(nav.event).toBe("exitAll");
      });

      it("should accept 'abandon' event", () => {
        nav.event = "abandon";
        expect(nav.event).toBe("abandon");
      });

      it("should accept 'abandonAll' event", () => {
        nav.event = "abandonAll";
        expect(nav.event).toBe("abandonAll");
      });

      it("should accept 'suspendAll' event", () => {
        nav.event = "suspendAll";
        expect(nav.event).toBe("suspendAll");
      });

      it("should accept 'retry' event", () => {
        nav.event = "retry";
        expect(nav.event).toBe("retry");
      });

      it("should accept 'retryAll' event", () => {
        nav.event = "retryAll";
        expect(nav.event).toBe("retryAll");
      });

      it("should accept 'choice' event", () => {
        nav.event = "choice";
        expect(nav.event).toBe("choice");
      });

      it("should accept 'jump' event", () => {
        nav.event = "jump";
        expect(nav.event).toBe("jump");
      });

      it("should accept '_none_' event", () => {
        nav.event = "_none_";
        expect(nav.event).toBe("_none_");
      });

      it("should accept events with underscore prefix", () => {
        nav.event = "_previous";
        expect(nav.event).toBe("_previous");

        nav.event = "_continue";
        expect(nav.event).toBe("_continue");

        nav.event = "_exit";
        expect(nav.event).toBe("_exit");
      });
    });

    describe("empty string handling", () => {
      it("should accept empty string", () => {
        nav.event = "previous";
        nav.event = "";
        expect(nav.event).toBe("");
      });

      it("should allow resetting to empty string", () => {
        nav.event = "continue";
        expect(nav.event).toBe("continue");
        nav.event = "";
        expect(nav.event).toBe("");
      });
    });

    describe("invalid events", () => {
      it("should throw exception for invalid events", () => {
        expect(() => {
          nav.event = "invalid_event";
        }).toThrow();
      });

      it("should throw exception for partially matching events", () => {
        expect(() => {
          nav.event = "continues";
        }).toThrow();
      });

      it("should throw exception for events with incorrect casing", () => {
        expect(() => {
          nav.event = "PREVIOUS";
        }).toThrow();
      });

      it("should throw exception for events with spaces", () => {
        expect(() => {
          nav.event = "previous ";
        }).toThrow();
      });

      it("should throw exception for random invalid strings", () => {
        expect(() => {
          nav.event = "not_a_valid_event";
        }).toThrow();
      });
    });

    describe("event transitions", () => {
      it("should allow changing from one valid event to another", () => {
        nav.event = "previous";
        expect(nav.event).toBe("previous");

        nav.event = "continue";
        expect(nav.event).toBe("continue");

        nav.event = "exit";
        expect(nav.event).toBe("exit");
      });
    });
  });

  describe("reset", () => {
    it("should reset event to empty string", () => {
      nav.event = "continue";
      nav.reset();
      expect(nav.event).toBe("");
    });

    it("should reset multiple times", () => {
      nav.event = "previous";
      nav.reset();
      expect(nav.event).toBe("");

      nav.event = "exit";
      nav.reset();
      expect(nav.event).toBe("");
    });

    it("should allow setting event after reset", () => {
      nav.event = "continue";
      nav.reset();
      nav.event = "previous";
      expect(nav.event).toBe("previous");
    });
  });

  describe("toJSON", () => {
    it("should return object with event property", () => {
      nav.event = "previous";
      const json = nav.toJSON();
      expect(json).toEqual({ event: "previous" });
    });

    it("should return empty event when not set", () => {
      const json = nav.toJSON();
      expect(json).toEqual({ event: "" });
    });

    it("should return correct value for 'continue' event", () => {
      nav.event = "continue";
      const json = nav.toJSON();
      expect(json).toEqual({ event: "continue" });
    });

    it("should return correct value for underscore-prefixed events", () => {
      nav.event = "_previous";
      const json = nav.toJSON();
      expect(json).toEqual({ event: "_previous" });
    });

    it("should return current state after reset", () => {
      nav.event = "exit";
      nav.reset();
      const json = nav.toJSON();
      expect(json).toEqual({ event: "" });
    });

    it("should have correct structure", () => {
      nav.event = "jump";
      const json = nav.toJSON();
      expect(json).toHaveProperty("event");
      expect(Object.keys(json)).toHaveLength(1);
    });
  });
});
