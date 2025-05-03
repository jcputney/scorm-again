import { describe, expect, it } from "vitest";
import { CMIStatus } from "../../src/cmi/scorm2004/status";

describe("SCORM 2004 CMIStatus Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const status = new CMIStatus();

      expect(status.completion_status).toBe("unknown");
      expect(status.success_status).toBe("unknown");
      expect(status.progress_measure).toBe("");
    });
  });

  describe("Property Tests", () => {
    describe("completion_status", () => {
      it("should set and get completion_status", () => {
        const status = new CMIStatus();

        status.completion_status = "completed";
        expect(status.completion_status).toBe("completed");

        status.completion_status = "incomplete";
        expect(status.completion_status).toBe("incomplete");

        status.completion_status = "not attempted";
        expect(status.completion_status).toBe("not attempted");

        status.completion_status = "unknown";
        expect(status.completion_status).toBe("unknown");
      });

      it("should reject invalid completion_status values", () => {
        const status = new CMIStatus();

        expect(() => {
          status.completion_status = "invalid-status";
        }).toThrow();
      });
    });

    describe("success_status", () => {
      it("should set and get success_status", () => {
        const status = new CMIStatus();

        status.success_status = "passed";
        expect(status.success_status).toBe("passed");

        status.success_status = "failed";
        expect(status.success_status).toBe("failed");

        status.success_status = "unknown";
        expect(status.success_status).toBe("unknown");
      });

      it("should reject invalid success_status values", () => {
        const status = new CMIStatus();

        expect(() => {
          status.success_status = "invalid-status";
        }).toThrow();
      });
    });

    describe("progress_measure", () => {
      it("should set and get progress_measure", () => {
        const status = new CMIStatus();

        status.progress_measure = "0.5";
        expect(status.progress_measure).toBe("0.5");

        status.progress_measure = "1.0";
        expect(status.progress_measure).toBe("1.0");

        status.progress_measure = "0.0";
        expect(status.progress_measure).toBe("0.0");
      });

      it("should reject invalid progress_measure values", () => {
        const status = new CMIStatus();

        // Non-numeric value
        expect(() => {
          status.progress_measure = "invalid-measure";
        }).toThrow();

        // Value out of range (less than 0)
        expect(() => {
          status.progress_measure = "-0.1";
        }).toThrow();

        // Value out of range (greater than 1)
        expect(() => {
          status.progress_measure = "1.1";
        }).toThrow();
      });
    });
  });

  describe("Method Tests", () => {
    describe("reset", () => {
      it("should reset properties to default values", () => {
        const status = new CMIStatus();

        status.completion_status = "completed";
        status.success_status = "passed";
        status.progress_measure = "0.75";
        status.initialize();

        status.reset();

        expect(status.completion_status).toBe("unknown");
        expect(status.success_status).toBe("unknown");
        expect(status.progress_measure).toBe("");
        expect(status.initialized).toBe(false);
      });
    });
  });
});
