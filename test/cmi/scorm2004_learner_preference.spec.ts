import { describe, expect, it } from "vitest";
import { CMILearnerPreference } from "../../src/cmi/scorm2004/learner_preference";
import { scorm2004_constants } from "../../src";

describe("SCORM 2004 CMILearnerPreference Tests", () => {
  describe("Initialization Tests", () => {
    it("should initialize with default values", () => {
      const learnerPreference = new CMILearnerPreference();

      expect(learnerPreference.audio_level).toBe("1");
      expect(learnerPreference.language).toBe("");
      expect(learnerPreference.delivery_speed).toBe("1");
      expect(learnerPreference.audio_captioning).toBe("0");
    });

    it("should have read-only _children property", () => {
      const learnerPreference = new CMILearnerPreference();

      expect(learnerPreference["_children"]).toBe(scorm2004_constants.student_preference_children);

      expect(() => {
        // eslint-disable-next-line
        // @ts-ignore - Testing invalid assignment
        learnerPreference["_children"] = "invalid";
      }).toThrow();
    });
  });

  describe("Reset Tests", () => {
    it("should reset to default values", () => {
      const learnerPreference = new CMILearnerPreference();

      // Set non-default values
      learnerPreference.audio_level = "0.5";
      learnerPreference.language = "en";
      learnerPreference.delivery_speed = "2";
      learnerPreference.audio_captioning = "1";

      // Reset
      learnerPreference.reset();

      // Values should remain the same after reset
      expect(learnerPreference.audio_level).toBe("0.5");
      expect(learnerPreference.language).toBe("en");
      expect(learnerPreference.delivery_speed).toBe("2");
      expect(learnerPreference.audio_captioning).toBe("1");
    });
  });

  describe("Property Tests", () => {
    describe("audio_level", () => {
      it("should set and get audio_level", () => {
        const learnerPreference = new CMILearnerPreference();

        learnerPreference.audio_level = "0.5";
        expect(learnerPreference.audio_level).toBe("0.5");

        learnerPreference.audio_level = "0";
        expect(learnerPreference.audio_level).toBe("0");

        learnerPreference.audio_level = "1";
        expect(learnerPreference.audio_level).toBe("1");

        learnerPreference.audio_level = "0.75";
        expect(learnerPreference.audio_level).toBe("0.75");
      });

      it("should reject invalid audio_level values", () => {
        const learnerPreference = new CMILearnerPreference();

        // Invalid format
        expect(() => {
          learnerPreference.audio_level = "invalid";
        }).toThrow();

        // Out of range
        expect(() => {
          learnerPreference.audio_level = "-0.1";
        }).toThrow();

        expect(() => {
          learnerPreference.audio_level = "1000";
        }).toThrow();
      });
    });

    describe("language", () => {
      it("should set and get language", () => {
        const learnerPreference = new CMILearnerPreference();

        learnerPreference.language = "en";
        expect(learnerPreference.language).toBe("en");

        learnerPreference.language = "fr";
        expect(learnerPreference.language).toBe("fr");

        learnerPreference.language = "es";
        expect(learnerPreference.language).toBe("es");

        learnerPreference.language = "de";
        expect(learnerPreference.language).toBe("de");
      });

      it("should reject invalid language values", () => {
        const learnerPreference = new CMILearnerPreference();

        // Invalid format
        expect(() => {
          learnerPreference.language = "123";
        }).toThrow();

        expect(() => {
          learnerPreference.language = "en-US-invalid";
        }).toThrow();
      });
    });

    describe("delivery_speed", () => {
      it("should set and get delivery_speed", () => {
        const learnerPreference = new CMILearnerPreference();

        learnerPreference.delivery_speed = "0.5";
        expect(learnerPreference.delivery_speed).toBe("0.5");

        learnerPreference.delivery_speed = "1";
        expect(learnerPreference.delivery_speed).toBe("1");

        learnerPreference.delivery_speed = "2.5";
        expect(learnerPreference.delivery_speed).toBe("2.5");
      });

      it("should reject invalid delivery_speed values", () => {
        const learnerPreference = new CMILearnerPreference();

        // Invalid format
        expect(() => {
          learnerPreference.delivery_speed = "invalid";
        }).toThrow();

        // Out of range
        expect(() => {
          learnerPreference.delivery_speed = "-0.1";
        }).toThrow();
      });

      it("should reject zero delivery_speed (spec requires > 0)", () => {
        const learnerPreference = new CMILearnerPreference();
        expect(() => {
          learnerPreference.delivery_speed = "0";
        }).toThrow();
      });
    });

    describe("audio_captioning", () => {
      it("should set and get audio_captioning", () => {
        const learnerPreference = new CMILearnerPreference();

        learnerPreference.audio_captioning = "0";
        expect(learnerPreference.audio_captioning).toBe("0");

        learnerPreference.audio_captioning = "1";
        expect(learnerPreference.audio_captioning).toBe("1");

        learnerPreference.audio_captioning = "-1";
        expect(learnerPreference.audio_captioning).toBe("-1");
      });

      it("should reject invalid audio_captioning values", () => {
        const learnerPreference = new CMILearnerPreference();

        // Invalid format
        expect(() => {
          learnerPreference.audio_captioning = "invalid";
        }).toThrow();

        expect(() => {
          learnerPreference.audio_captioning = "1.5";
        }).toThrow();
      });
    });
  });

  describe("JSON Serialization", () => {
    it("should serialize to JSON correctly", () => {
      const learnerPreference = new CMILearnerPreference();

      // Set non-default values
      learnerPreference.audio_level = "0.5";
      learnerPreference.language = "en";
      learnerPreference.delivery_speed = "2";
      learnerPreference.audio_captioning = "1";

      const json = JSON.stringify(learnerPreference);
      const parsed = JSON.parse(json);

      expect(parsed.audio_level).toBe("0.5");
      expect(parsed.language).toBe("en");
      expect(parsed.delivery_speed).toBe("2");
      expect(parsed.audio_captioning).toBe("1");
    });
  });
});
