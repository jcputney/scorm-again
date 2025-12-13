import { describe, it, expect } from "vitest";
import {
  NavigationExceptions,
  TerminationExceptions,
  FlowTreeTraversalExceptions,
  FlowActivityTraversalExceptions,
  ContinueExceptions,
  PreviousExceptions,
  ChoiceExceptions,
  ChoiceTraversalExceptions,
  RetryExceptions,
  ExitExceptions,
  SequencingRequestExceptions,
  JumpExceptions,
  StartExceptions,
  ResumeExceptions,
  SuspendExceptions,
  SequencingExceptions,
  getExceptionDescription,
} from "../../src/constants/sequencing_exceptions";

describe("Sequencing Exceptions Constants", () => {
  describe("NavigationExceptions (NB.2.1)", () => {
    it("should define all NB.2.1 exception codes", () => {
      expect(NavigationExceptions["NB.2.1-1"]).toBe("Sequencing session already started");
      expect(NavigationExceptions["NB.2.1-2"]).toBe(
        "Current activity not defined / sequencing not begun",
      );
      expect(NavigationExceptions["NB.2.1-3"]).toBe("No suspended activity to resume");
      expect(NavigationExceptions["NB.2.1-4"]).toBe("Flow not enabled / current activity is root");
      expect(NavigationExceptions["NB.2.1-5"]).toBe(
        "Violates control mode (forward only or flow disabled)",
      );
      expect(NavigationExceptions["NB.2.1-6"]).toBe("Cannot move backward from root");
      expect(NavigationExceptions["NB.2.1-7"]).toBe("Forward/Backward navigation not supported");
      expect(NavigationExceptions["NB.2.1-8"]).toBe("Forward-only constraint violation");
      expect(NavigationExceptions["NB.2.1-9"]).toBe("Activity path empty");
      expect(NavigationExceptions["NB.2.1-10"]).toBe("Choice control disabled on parent");
      expect(NavigationExceptions["NB.2.1-11"]).toBe("Target activity does not exist");
      expect(NavigationExceptions["NB.2.1-12"]).toBe("Activity already terminated");
      expect(NavigationExceptions["NB.2.1-13"]).toBe("Undefined navigation request");
      expect(NavigationExceptions["NB.2.1-14"]).toBe("No current activity for EXIT_ALL");
      expect(NavigationExceptions["NB.2.1-15"]).toBe("No current activity for ABANDON");
      expect(NavigationExceptions["NB.2.1-16"]).toBe("No current activity for ABANDON_ALL");
      expect(NavigationExceptions["NB.2.1-17"]).toBe("No current activity for SUSPEND_ALL");
      expect(NavigationExceptions["NB.2.1-18"]).toBe("Invalid navigation request type");
    });

    it("should have exactly 18 navigation exception codes", () => {
      const keys = Object.keys(NavigationExceptions);
      expect(keys).toHaveLength(18);
    });

    it("should have all keys starting with NB.2.1", () => {
      const keys = Object.keys(NavigationExceptions);
      keys.forEach((key) => {
        expect(key).toMatch(/^NB\.2\.1-\d+$/);
      });
    });
  });

  describe("TerminationExceptions (TB.2.3)", () => {
    it("should define all TB.2.3 exception codes", () => {
      expect(TerminationExceptions["TB.2.3-1"]).toBe("No current activity to terminate");
      expect(TerminationExceptions["TB.2.3-2"]).toBe("Current activity already terminated");
      expect(TerminationExceptions["TB.2.3-3"]).toBe("Nothing to suspend (root activity)");
      expect(TerminationExceptions["TB.2.3-4"]).toBe("Cannot EXIT_PARENT from root activity");
      expect(TerminationExceptions["TB.2.3-5"]).toBe("Activity path is empty during suspend");
      expect(TerminationExceptions["TB.2.3-6"]).toBe("Nothing to abandon");
      expect(TerminationExceptions["TB.2.3-7"]).toBe("Undefined termination request");
    });

    it("should have exactly 7 termination exception codes", () => {
      const keys = Object.keys(TerminationExceptions);
      expect(keys).toHaveLength(7);
    });

    it("should have all keys starting with TB.2.3", () => {
      const keys = Object.keys(TerminationExceptions);
      keys.forEach((key) => {
        expect(key).toMatch(/^TB\.2\.3-\d+$/);
      });
    });
  });

  describe("FlowTreeTraversalExceptions (SB.2.1)", () => {
    it("should define all SB.2.1 exception codes", () => {
      expect(FlowTreeTraversalExceptions["SB.2.1-2"]).toBe("No available children to deliver");
      expect(FlowTreeTraversalExceptions["SB.2.1-3"]).toBe("Reached beginning of course");
    });
  });

  describe("FlowActivityTraversalExceptions (SB.2.2)", () => {
    it("should define all SB.2.2 exception codes", () => {
      expect(FlowActivityTraversalExceptions["SB.2.2-1"]).toBe("Flow control disabled on parent");
      expect(FlowActivityTraversalExceptions["SB.2.2-2"]).toBe("Activity not available");
    });
  });

  describe("ContinueExceptions (SB.2.7)", () => {
    it("should define all SB.2.7 exception codes", () => {
      expect(ContinueExceptions["SB.2.7-1"]).toBe(
        "Sequencing session not begun (current activity not terminated)",
      );
      expect(ContinueExceptions["SB.2.7-2"]).toBe(
        "Cannot continue - flow disabled or no activity available",
      );
    });
  });

  describe("PreviousExceptions (SB.2.8)", () => {
    it("should define all SB.2.8 exception codes", () => {
      expect(PreviousExceptions["SB.2.8-1"]).toBe("Current activity not terminated");
      expect(PreviousExceptions["SB.2.8-2"]).toBe(
        "Cannot go previous - at beginning or forwardOnly enabled",
      );
    });
  });

  describe("ChoiceExceptions (SB.2.9)", () => {
    it("should define all SB.2.9 exception codes", () => {
      expect(ChoiceExceptions["SB.2.9-1"]).toBe("Target activity does not exist");
      expect(ChoiceExceptions["SB.2.9-2"]).toBe("Target activity not in tree");
      expect(ChoiceExceptions["SB.2.9-3"]).toBe("Cannot choose root activity");
      expect(ChoiceExceptions["SB.2.9-4"]).toBe("Activity hidden from choice");
      expect(ChoiceExceptions["SB.2.9-5"]).toBe("Choice control is not allowed");
      expect(ChoiceExceptions["SB.2.9-6"]).toBe("Current activity not terminated");
      expect(ChoiceExceptions["SB.2.9-7"]).toBe("No activity available from target");
    });
  });

  describe("ChoiceTraversalExceptions (SB.2.4)", () => {
    it("should define all SB.2.4 exception codes", () => {
      expect(ChoiceTraversalExceptions["SB.2.4-1"]).toBe(
        "Stop forward traversal rule evaluates to true",
      );
      expect(ChoiceTraversalExceptions["SB.2.4-2"]).toBe(
        "Constrained choice requires forward traversal from leaf",
      );
      expect(ChoiceTraversalExceptions["SB.2.4-3"]).toBe(
        "Cannot walk backward from root of activity tree",
      );
    });

    it("should have exactly 3 choice traversal exception codes", () => {
      const keys = Object.keys(ChoiceTraversalExceptions);
      expect(keys).toHaveLength(3);
    });

    it("should have all keys starting with SB.2.4", () => {
      const keys = Object.keys(ChoiceTraversalExceptions);
      keys.forEach((key) => {
        expect(key).toMatch(/^SB\.2\.4-\d+$/);
      });
    });
  });

  describe("RetryExceptions (SB.2.10)", () => {
    it("should define all SB.2.10 exception codes", () => {
      expect(RetryExceptions["SB.2.10-1"]).toBe("Current activity not defined");
      expect(RetryExceptions["SB.2.10-2"]).toBe("Activity is still active or suspended");
      expect(RetryExceptions["SB.2.10-3"]).toBe(
        "Flow subprocess returned false (nothing to deliver)",
      );
    });

    it("should have exactly 3 retry exception codes", () => {
      const keys = Object.keys(RetryExceptions);
      expect(keys).toHaveLength(3);
    });

    it("should have all keys starting with SB.2.10", () => {
      const keys = Object.keys(RetryExceptions);
      keys.forEach((key) => {
        expect(key).toMatch(/^SB\.2\.10-\d+$/);
      });
    });
  });

  describe("ExitExceptions (SB.2.11)", () => {
    it("should define all SB.2.11 exception codes", () => {
      expect(ExitExceptions["SB.2.11-1"]).toBe("Exit not allowed - no parent");
      expect(ExitExceptions["SB.2.11-2"]).toBe("Exit not allowed by sequencing controls");
    });
  });

  describe("SequencingRequestExceptions (SB.2.12)", () => {
    it("should define all SB.2.12 exception codes", () => {
      expect(SequencingRequestExceptions["SB.2.12-1"]).toBe("No current activity");
      expect(SequencingRequestExceptions["SB.2.12-5"]).toBe("No target activity specified");
      expect(SequencingRequestExceptions["SB.2.12-6"]).toBe("Undefined sequencing request");
    });
  });

  describe("JumpExceptions (SB.2.13)", () => {
    it("should define all SB.2.13 exception codes", () => {
      expect(JumpExceptions["SB.2.13-1"]).toBe("Target activity does not exist");
      expect(JumpExceptions["SB.2.13-2"]).toBe("Target activity not in tree");
      expect(JumpExceptions["SB.2.13-3"]).toBe("Target not available");
    });
  });

  describe("StartExceptions (SB.2.5)", () => {
    it("should define all SB.2.5 exception codes", () => {
      expect(StartExceptions["SB.2.5-1"]).toBe("No activity tree");
      expect(StartExceptions["SB.2.5-2"]).toBe("Sequencing session already begun");
      expect(StartExceptions["SB.2.5-3"]).toBe("No activity available");
    });
  });

  describe("ResumeExceptions (SB.2.6)", () => {
    it("should define all SB.2.6 exception codes", () => {
      expect(ResumeExceptions["SB.2.6-1"]).toBe("No suspended activity");
      expect(ResumeExceptions["SB.2.6-2"]).toBe("Current activity already defined");
    });
  });

  describe("SuspendExceptions (SB.2.15)", () => {
    it("should define all SB.2.15 exception codes", () => {
      expect(SuspendExceptions["SB.2.15-1"]).toBe("Cannot suspend root");
    });
  });

  describe("SequencingExceptions (Combined)", () => {
    it("should include all navigation exceptions", () => {
      Object.keys(NavigationExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
        expect(SequencingExceptions[key as keyof typeof SequencingExceptions]).toBe(
          NavigationExceptions[key as keyof typeof NavigationExceptions],
        );
      });
    });

    it("should include all termination exceptions", () => {
      Object.keys(TerminationExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
    });

    it("should include all flow exceptions", () => {
      Object.keys(FlowTreeTraversalExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(FlowActivityTraversalExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
    });

    it("should include all sequencing request exceptions", () => {
      Object.keys(ContinueExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(PreviousExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(ChoiceExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(ChoiceTraversalExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(RetryExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(ExitExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(SequencingRequestExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(JumpExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(StartExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(ResumeExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
      Object.keys(SuspendExceptions).forEach((key) => {
        expect(SequencingExceptions).toHaveProperty(key);
      });
    });
  });

  describe("getExceptionDescription helper function", () => {
    it("should return correct description for navigation exceptions", () => {
      expect(getExceptionDescription("NB.2.1-1")).toBe("Sequencing session already started");
      expect(getExceptionDescription("NB.2.1-11")).toBe("Target activity does not exist");
      expect(getExceptionDescription("NB.2.1-18")).toBe("Invalid navigation request type");
    });

    it("should return correct description for termination exceptions", () => {
      expect(getExceptionDescription("TB.2.3-1")).toBe("No current activity to terminate");
      expect(getExceptionDescription("TB.2.3-2")).toBe("Current activity already terminated");
      expect(getExceptionDescription("TB.2.3-3")).toBe("Nothing to suspend (root activity)");
      expect(getExceptionDescription("TB.2.3-4")).toBe("Cannot EXIT_PARENT from root activity");
      expect(getExceptionDescription("TB.2.3-5")).toBe("Activity path is empty during suspend");
      expect(getExceptionDescription("TB.2.3-6")).toBe("Nothing to abandon");
      expect(getExceptionDescription("TB.2.3-7")).toBe("Undefined termination request");
    });

    it("should return correct description for flow exceptions", () => {
      expect(getExceptionDescription("SB.2.1-2")).toBe("No available children to deliver");
      expect(getExceptionDescription("SB.2.2-1")).toBe("Flow control disabled on parent");
    });

    it("should return correct description for sequencing request exceptions", () => {
      expect(getExceptionDescription("SB.2.7-1")).toBe(
        "Sequencing session not begun (current activity not terminated)",
      );
      expect(getExceptionDescription("SB.2.9-1")).toBe("Target activity does not exist");
      expect(getExceptionDescription("SB.2.4-1")).toBe(
        "Stop forward traversal rule evaluates to true",
      );
      expect(getExceptionDescription("SB.2.4-2")).toBe(
        "Constrained choice requires forward traversal from leaf",
      );
      expect(getExceptionDescription("SB.2.4-3")).toBe(
        "Cannot walk backward from root of activity tree",
      );
      expect(getExceptionDescription("SB.2.10-1")).toBe("Current activity not defined");
      expect(getExceptionDescription("SB.2.10-2")).toBe("Activity is still active or suspended");
      expect(getExceptionDescription("SB.2.10-3")).toBe(
        "Flow subprocess returned false (nothing to deliver)",
      );
      expect(getExceptionDescription("SB.2.12-1")).toBe("No current activity");
    });

    it("should return 'Unknown exception' for undefined codes", () => {
      expect(getExceptionDescription("XX.9.9-99")).toBe("Unknown exception");
      expect(getExceptionDescription("")).toBe("Unknown exception");
      expect(getExceptionDescription("invalid")).toBe("Unknown exception");
    });
  });
});
