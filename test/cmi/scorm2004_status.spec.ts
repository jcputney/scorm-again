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

// API-level tests for success_status GetValue evaluation
import Scorm2004API from "../../src/Scorm2004API";

describe("SCORM 2004 success_status GetValue evaluation", () => {
  describe("cmi.success_status GetValue evaluation", () => {
    it("should return 'passed' when score.scaled >= scaled_passing_score", () => {
      const api = new Scorm2004API();
      api.cmi.scaled_passing_score = "0.8";
      api.lmsInitialize();
      api.lmsSetValue("cmi.score.scaled", "0.85");

      expect(api.lmsGetValue("cmi.success_status")).toBe("passed");
    });

    it("should return 'failed' when score.scaled < scaled_passing_score", () => {
      const api = new Scorm2004API();
      api.cmi.scaled_passing_score = "0.8";
      api.lmsInitialize();
      api.lmsSetValue("cmi.score.scaled", "0.75");

      expect(api.lmsGetValue("cmi.success_status")).toBe("failed");
    });

    it("should return 'unknown' when scaled_passing_score set but no score yet", () => {
      const api = new Scorm2004API();
      api.cmi.scaled_passing_score = "0.8";
      api.lmsInitialize();

      expect(api.lmsGetValue("cmi.success_status")).toBe("unknown");
    });

    it("should return SCO-set value when no scaled_passing_score defined", () => {
      const api = new Scorm2004API();
      api.lmsInitialize();
      api.lmsSetValue("cmi.success_status", "passed");

      expect(api.lmsGetValue("cmi.success_status")).toBe("passed");
    });

    it("should override SCO-set value when threshold defined and score available", () => {
      const api = new Scorm2004API();
      api.cmi.scaled_passing_score = "0.8";
      api.lmsInitialize();
      api.lmsSetValue("cmi.success_status", "passed"); // SCO says passed
      api.lmsSetValue("cmi.score.scaled", "0.5"); // But score says failed

      expect(api.lmsGetValue("cmi.success_status")).toBe("failed"); // LMS overrides
    });

    it("should handle exact threshold value as passed", () => {
      const api = new Scorm2004API();
      api.cmi.scaled_passing_score = "0.8";
      api.lmsInitialize();
      api.lmsSetValue("cmi.score.scaled", "0.8");

      expect(api.lmsGetValue("cmi.success_status")).toBe("passed");
    });

    it("should return stored value when scaled_passing_score is empty string", () => {
      const api = new Scorm2004API();
      api.cmi.scaled_passing_score = "";
      api.lmsInitialize();
      api.lmsSetValue("cmi.success_status", "failed");

      expect(api.lmsGetValue("cmi.success_status")).toBe("failed");
    });

    it("should return 'unknown' when no threshold and no SCO value set", () => {
      const api = new Scorm2004API();
      api.lmsInitialize();

      expect(api.lmsGetValue("cmi.success_status")).toBe("unknown");
    });
  });
});
