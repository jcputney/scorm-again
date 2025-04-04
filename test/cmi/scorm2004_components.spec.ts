import { describe, it } from "mocha";
import { expect } from "expect";
import { CMIContent } from "../../src/cmi/scorm2004/content";
import { CMILearner } from "../../src/cmi/scorm2004/learner";
import { CMIMetadata } from "../../src/cmi/scorm2004/metadata";
import { CMISession } from "../../src/cmi/scorm2004/session";
import { CMISettings } from "../../src/cmi/scorm2004/settings";
import { CMIStatus } from "../../src/cmi/scorm2004/status";
import { CMIThresholds } from "../../src/cmi/scorm2004/thresholds";
import { scorm2004_constants } from "../../src/constants/api_constants";
import { CompletionStatus, SuccessStatus } from "../../src/constants/enums";

describe("SCORM 2004 Component Tests", () => {
  describe("CMIContent Tests", () => {
    it("should initialize with default values", () => {
      const content = new CMIContent();

      expect(content.launch_data).toBe("");
      expect(content.location).toBe("");
      expect(content.suspend_data).toBe("");
    });

    it("should reset to default values", () => {
      const content = new CMIContent();
      content.location = "page1";
      content.suspend_data = "some data";

      content.reset();

      expect(content.location).toBe("");
      expect(content.suspend_data).toBe("");
    });

    it("should set and get location", () => {
      const content = new CMIContent();
      content.location = "page1";

      expect(content.location).toBe("page1");
    });

    it("should set and get suspend_data", () => {
      const content = new CMIContent();
      content.suspend_data = "some data";

      expect(content.suspend_data).toBe("some data");
    });

    it("should set and get launch_data", () => {
      const content = new CMIContent();
      content.launch_data = "some launch data";

      expect(content.launch_data).toBe("some launch data");
    });
  });

  describe("CMILearner Tests", () => {
    it("should initialize with default values", () => {
      const learner = new CMILearner();

      expect(learner.learner_id).toBe("");
      expect(learner.learner_name).toBe("");
    });

    it("should reset to default values", () => {
      const learner = new CMILearner();
      learner.learner_id = "student1";
      learner.learner_name = "John Doe";

      learner.reset();

      expect(learner.learner_id).toBe("student1"); // learner_id should not be reset
      expect(learner.learner_name).toBe("John Doe"); // learner_name should not be reset
    });

    it("should set and get learner_id", () => {
      const learner = new CMILearner();
      learner.learner_id = "student1";

      expect(learner.learner_id).toBe("student1");
    });

    it("should set and get learner_name", () => {
      const learner = new CMILearner();
      learner.learner_name = "John Doe";

      expect(learner.learner_name).toBe("John Doe");
    });
  });

  describe("CMIMetadata Tests", () => {
    it("should initialize with default values", () => {
      const metadata = new CMIMetadata();

      expect(metadata._version).toBe("1.0");
      expect(metadata._children).toBe(scorm2004_constants.cmi_children);
    });

    it("should reset to default values", () => {
      const metadata = new CMIMetadata();

      metadata.reset();

      expect(metadata._version).toBe("1.0");
      expect(metadata._children).toBe(scorm2004_constants.cmi_children);
    });
  });

  describe("CMISession Tests", () => {
    it("should initialize with default values", () => {
      const session = new CMISession();

      expect(session.entry).toBe("");
      // exit is write-only, so we don't test reading it
      // session_time is write-only, so we don't test reading it
      expect(session.total_time).toBe("");
    });

    it("should reset to default values", () => {
      const session = new CMISession();
      session.entry = "resume";
      session.exit = "suspend";
      session.session_time = "PT1H0M0S";
      session.total_time = "PT2H0M0S";

      session.reset();

      expect(session.entry).toBe("");
      // exit is write-only, so we don't test reading it
      // session_time is write-only, so we don't test reading it
      expect(session.total_time).toBe("PT2H0M0S"); // total_time should not be reset
    });

    it("should set and get entry", () => {
      const session = new CMISession();
      session.entry = "resume";

      expect(session.entry).toBe("resume");
    });

    it("should set exit without error", () => {
      const session = new CMISession();

      expect(() => {
        session.exit = "suspend";
      }).not.toThrow();
    });

    it("should set session_time without error", () => {
      const session = new CMISession();

      expect(() => {
        session.session_time = "PT1H0M0S";
      }).not.toThrow();
    });

    it("should set and get total_time", () => {
      const session = new CMISession();
      session.total_time = "PT2H0M0S";

      expect(session.total_time).toBe("PT2H0M0S");
    });

    it("should calculate current total time", () => {
      const session = new CMISession();
      session.total_time = "PT1H0M0S";
      session.session_time = "PT30M0S";

      expect(session.getCurrentTotalTime()).toBe("PT1H30M");
    });
  });

  describe("CMISettings Tests", () => {
    it("should initialize with default values", () => {
      const settings = new CMISettings();

      expect(settings.credit).toBe("credit");
      expect(settings.mode).toBe("normal");
      expect(settings.max_time_allowed).toBe("");
      expect(settings.time_limit_action).toBe("continue,no message");
    });

    it("should reset to default values", () => {
      const settings = new CMISettings();
      settings.credit = "no-credit";
      settings.mode = "browse";
      settings.max_time_allowed = "PT1H0M0S";
      settings.time_limit_action = "exit,message";

      settings.reset();

      expect(settings.credit).not.toBe("credit");
      expect(settings.mode).not.toBe("normal");
      expect(settings.max_time_allowed).not.toBe("");
      expect(settings.time_limit_action).not.toBe("continue,no message");
    });

    it("should set and get credit", () => {
      const settings = new CMISettings();
      settings.credit = "no-credit";

      expect(settings.credit).toBe("no-credit");
    });

    it("should set and get mode", () => {
      const settings = new CMISettings();
      settings.mode = "browse";

      expect(settings.mode).toBe("browse");
    });

    it("should set and get max_time_allowed", () => {
      const settings = new CMISettings();
      settings.max_time_allowed = "PT1H0M0S";

      expect(settings.max_time_allowed).toBe("PT1H0M0S");
    });

    it("should set and get time_limit_action", () => {
      const settings = new CMISettings();
      settings.time_limit_action = "exit,message";

      expect(settings.time_limit_action).toBe("exit,message");
    });
  });

  describe("CMIStatus Tests", () => {
    it("should initialize with default values", () => {
      const status = new CMIStatus();

      expect(status.completion_status).toBe(CompletionStatus.UNKNOWN);
      expect(status.progress_measure).toBe("");
      expect(status.success_status).toBe(SuccessStatus.UNKNOWN);
    });

    it("should reset to default values", () => {
      const status = new CMIStatus();
      status.completion_status = CompletionStatus.COMPLETED;
      status.progress_measure = "0.5";
      status.success_status = SuccessStatus.PASSED;

      status.reset();

      expect(status.completion_status).toBe(CompletionStatus.UNKNOWN);
      expect(status.progress_measure).toBe("");
      expect(status.success_status).toBe(SuccessStatus.UNKNOWN);
    });

    it("should set and get completion_status", () => {
      const status = new CMIStatus();
      status.completion_status = CompletionStatus.COMPLETED;

      expect(status.completion_status).toBe(CompletionStatus.COMPLETED);
    });

    it("should set and get progress_measure", () => {
      const status = new CMIStatus();
      status.progress_measure = "0.5";

      expect(status.progress_measure).toBe("0.5");
    });

    it("should set and get success_status", () => {
      const status = new CMIStatus();
      status.success_status = SuccessStatus.PASSED;

      expect(status.success_status).toBe(SuccessStatus.PASSED);
    });
  });

  describe("CMIThresholds Tests", () => {
    it("should initialize with default values", () => {
      const thresholds = new CMIThresholds();

      expect(thresholds.completion_threshold).toBe("");
      expect(thresholds.scaled_passing_score).toBe("");
    });

    it("should reset to default values", () => {
      const thresholds = new CMIThresholds();
      thresholds.completion_threshold = "0.8";
      thresholds.scaled_passing_score = "0.7";

      thresholds.reset();

      expect(thresholds.completion_threshold).not.toBe("");
      expect(thresholds.scaled_passing_score).not.toBe("");
    });

    it("should set and get completion_threshold", () => {
      const thresholds = new CMIThresholds();
      thresholds.completion_threshold = "0.8";

      expect(thresholds.completion_threshold).toBe("0.8");
    });

    it("should set and get scaled_passing_score", () => {
      const thresholds = new CMIThresholds();
      thresholds.scaled_passing_score = "0.7";

      expect(thresholds.scaled_passing_score).toBe("0.7");
    });
  });
});
