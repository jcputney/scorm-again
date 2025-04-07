import { describe, it } from "mocha";
import { expect } from "expect";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

describe("SequencingControls", () => {
  describe("constructor", () => {
    it("should initialize with default values", () => {
      const controls = new SequencingControls();

      // Check default values for sequencing control modes
      expect(controls.enabled).toBe(true);
      expect(controls.choiceExit).toBe(true);
      expect(controls.flow).toBe(false);
      expect(controls.forwardOnly).toBe(false);
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(true);
      expect(controls.useCurrentAttemptProgressInfo).toBe(true);

      // Check default values for constrain choice controls
      expect(controls.preventActivation).toBe(false);
      expect(controls.constrainChoice).toBe(false);

      // Check default values for rollup controls
      expect(controls.rollupObjectiveSatisfied).toBe(true);
      expect(controls.rollupProgressCompletion).toBe(true);
      expect(controls.objectiveMeasureWeight).toBe(1.0);
    });
  });

  describe("reset", () => {
    it("should reset all properties to default values", () => {
      const controls = new SequencingControls();

      // Change some values
      controls.enabled = false;
      controls.choiceExit = false;
      controls.flow = true;
      controls.forwardOnly = true;
      controls.useCurrentAttemptObjectiveInfo = false;
      controls.useCurrentAttemptProgressInfo = false;
      controls.preventActivation = true;
      controls.constrainChoice = true;
      controls.rollupObjectiveSatisfied = false;
      controls.rollupProgressCompletion = false;
      controls.objectiveMeasureWeight = 0.5;

      // Reset
      controls.reset();

      // Check that values are reset to defaults
      expect(controls.enabled).toBe(true);
      expect(controls.choiceExit).toBe(true);
      expect(controls.flow).toBe(false);
      expect(controls.forwardOnly).toBe(false);
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(true);
      expect(controls.useCurrentAttemptProgressInfo).toBe(true);
      expect(controls.preventActivation).toBe(false);
      expect(controls.constrainChoice).toBe(false);
      expect(controls.rollupObjectiveSatisfied).toBe(true);
      expect(controls.rollupProgressCompletion).toBe(true);
      expect(controls.objectiveMeasureWeight).toBe(1.0);
    });
  });

  describe("property getters and setters", () => {
    it("should set and get enabled property", () => {
      const controls = new SequencingControls();
      controls.enabled = false;
      expect(controls.enabled).toBe(false);
    });

    it("should set and get choiceExit property", () => {
      const controls = new SequencingControls();
      controls.choiceExit = false;
      expect(controls.choiceExit).toBe(false);
    });

    it("should set and get flow property", () => {
      const controls = new SequencingControls();
      controls.flow = true;
      expect(controls.flow).toBe(true);
    });

    it("should set and get forwardOnly property", () => {
      const controls = new SequencingControls();
      controls.forwardOnly = true;
      expect(controls.forwardOnly).toBe(true);
    });

    it("should set and get useCurrentAttemptObjectiveInfo property", () => {
      const controls = new SequencingControls();
      controls.useCurrentAttemptObjectiveInfo = false;
      expect(controls.useCurrentAttemptObjectiveInfo).toBe(false);
    });

    it("should set and get useCurrentAttemptProgressInfo property", () => {
      const controls = new SequencingControls();
      controls.useCurrentAttemptProgressInfo = false;
      expect(controls.useCurrentAttemptProgressInfo).toBe(false);
    });

    it("should set and get preventActivation property", () => {
      const controls = new SequencingControls();
      controls.preventActivation = true;
      expect(controls.preventActivation).toBe(true);
    });

    it("should set and get constrainChoice property", () => {
      const controls = new SequencingControls();
      controls.constrainChoice = true;
      expect(controls.constrainChoice).toBe(true);
    });

    it("should set and get rollupObjectiveSatisfied property", () => {
      const controls = new SequencingControls();
      controls.rollupObjectiveSatisfied = false;
      expect(controls.rollupObjectiveSatisfied).toBe(false);
    });

    it("should set and get rollupProgressCompletion property", () => {
      const controls = new SequencingControls();
      controls.rollupProgressCompletion = false;
      expect(controls.rollupProgressCompletion).toBe(false);
    });

    it("should set and get objectiveMeasureWeight property", () => {
      const controls = new SequencingControls();
      controls.objectiveMeasureWeight = 0.5;
      expect(controls.objectiveMeasureWeight).toBe(0.5);
    });

    it("should not set objectiveMeasureWeight outside valid range", () => {
      const controls = new SequencingControls();

      // Try to set to negative value
      controls.objectiveMeasureWeight = -0.5;
      expect(controls.objectiveMeasureWeight).toBe(1.0); // Should remain at default

      // Try to set to value > 1
      controls.objectiveMeasureWeight = 1.5;
      expect(controls.objectiveMeasureWeight).toBe(1.0); // Should remain at default

      // Set to valid value
      controls.objectiveMeasureWeight = 0.75;
      expect(controls.objectiveMeasureWeight).toBe(0.75);
    });
  });

  describe("navigation methods", () => {
    it("isChoiceNavigationAllowed should return correct value", () => {
      const controls = new SequencingControls();

      // Default values: enabled = true, constrainChoice = false
      expect(controls.isChoiceNavigationAllowed()).toBe(true);

      // Disabled
      controls.enabled = false;
      expect(controls.isChoiceNavigationAllowed()).toBe(false);

      // Enabled but constrained
      controls.enabled = true;
      controls.constrainChoice = true;
      expect(controls.isChoiceNavigationAllowed()).toBe(false);

      // Both enabled and not constrained
      controls.enabled = true;
      controls.constrainChoice = false;
      expect(controls.isChoiceNavigationAllowed()).toBe(true);
    });

    it("isFlowNavigationAllowed should return correct value", () => {
      const controls = new SequencingControls();

      // Default values: enabled = true, flow = false
      expect(controls.isFlowNavigationAllowed()).toBe(false);

      // Disabled
      controls.enabled = false;
      expect(controls.isFlowNavigationAllowed()).toBe(false);

      // Enabled but flow disabled
      controls.enabled = true;
      controls.flow = false;
      expect(controls.isFlowNavigationAllowed()).toBe(false);

      // Both enabled and flow enabled
      controls.enabled = true;
      controls.flow = true;
      expect(controls.isFlowNavigationAllowed()).toBe(true);
    });

    it("isForwardNavigationAllowed should return correct value", () => {
      const controls = new SequencingControls();

      // Default values: enabled = true, forwardOnly = false, flow = false
      expect(controls.isForwardNavigationAllowed()).toBe(true);

      // Disabled
      controls.enabled = false;
      expect(controls.isForwardNavigationAllowed()).toBe(false);

      // Enabled, forwardOnly = true, flow = false
      controls.enabled = true;
      controls.forwardOnly = true;
      controls.flow = false;
      expect(controls.isForwardNavigationAllowed()).toBe(false);

      // Enabled, forwardOnly = true, flow = true
      controls.enabled = true;
      controls.forwardOnly = true;
      controls.flow = true;
      expect(controls.isForwardNavigationAllowed()).toBe(true);

      // Enabled, forwardOnly = false, flow = false
      controls.enabled = true;
      controls.forwardOnly = false;
      controls.flow = false;
      expect(controls.isForwardNavigationAllowed()).toBe(true);
    });

    it("isBackwardNavigationAllowed should return correct value", () => {
      const controls = new SequencingControls();

      // Default values: enabled = true, forwardOnly = false
      expect(controls.isBackwardNavigationAllowed()).toBe(true);

      // Disabled
      controls.enabled = false;
      expect(controls.isBackwardNavigationAllowed()).toBe(false);

      // Enabled but forwardOnly
      controls.enabled = true;
      controls.forwardOnly = true;
      expect(controls.isBackwardNavigationAllowed()).toBe(false);

      // Both enabled and not forwardOnly
      controls.enabled = true;
      controls.forwardOnly = false;
      expect(controls.isBackwardNavigationAllowed()).toBe(true);
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation of the controls", () => {
      const controls = new SequencingControls();

      // Change some values
      controls.enabled = false;
      controls.flow = true;
      controls.objectiveMeasureWeight = 0.5;

      const result = controls.toJSON();

      expect(result).toHaveProperty("enabled", false);
      expect(result).toHaveProperty("choiceExit", true);
      expect(result).toHaveProperty("flow", true);
      expect(result).toHaveProperty("forwardOnly", false);
      expect(result).toHaveProperty("useCurrentAttemptObjectiveInfo", true);
      expect(result).toHaveProperty("useCurrentAttemptProgressInfo", true);
      expect(result).toHaveProperty("preventActivation", false);
      expect(result).toHaveProperty("constrainChoice", false);
      expect(result).toHaveProperty("rollupObjectiveSatisfied", true);
      expect(result).toHaveProperty("rollupProgressCompletion", true);
      expect(result).toHaveProperty("objectiveMeasureWeight", 0.5);
    });
  });
});
