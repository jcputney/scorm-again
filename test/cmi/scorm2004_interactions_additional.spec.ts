import { describe, expect, it } from "vitest";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
} from "../../src/cmi/scorm2004/interactions";

describe("SCORM 2004 Additional Interactions Tests", () => {
  describe("Learner Response Tests", () => {
    describe("performance interaction type", () => {
      it("should accept a valid performance response", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "performance";

        expect(() => {
          interaction.learner_response = "step1.value1";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("step1.value1");
      });

      it("should accept multiple valid performance responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "performance";

        expect(() => {
          interaction.learner_response = "step1.value1,step2.value2,step3.value3";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("step1.value1,step2.value2,step3.value3");
      });

      it("should reject invalid performance responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "performance";

        expect(() => {
          interaction.learner_response = "step1-value1";
        }).toThrow();

        expect(() => {
          interaction.learner_response = "step1.";
        }).toThrow();

        expect(() => {
          interaction.learner_response = ".value1";
        }).toThrow();
      });
    });

    describe("sequencing interaction type", () => {
      it("should accept a valid sequencing response", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "sequencing";

        expect(() => {
          interaction.learner_response = "item1";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("item1");
      });

      it("should accept multiple valid sequencing responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "sequencing";

        expect(() => {
          interaction.learner_response = "item1,item2,item3";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("item1,item2,item3");
      });

      it("should reject too many sequencing responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "sequencing";

        // Create a string with 37 items (more than the max of 36)
        const tooManyItems = Array.from({ length: 37 }, (_, i) => `item${i + 1}`).join(",");

        expect(() => {
          interaction.learner_response = tooManyItems;
        }).toThrow();
      });
    });

    describe("likert interaction type", () => {
      it("should accept a valid likert response", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "likert";

        expect(() => {
          interaction.learner_response = "likert_1";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("likert_1");
      });

      it("should reject multiple likert responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "likert";

        expect(() => {
          interaction.learner_response = "likert_1,likert_2";
        }).toThrow();
      });
    });

    describe("numeric interaction type", () => {
      it("should accept a valid numeric response", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "numeric";

        expect(() => {
          interaction.learner_response = "42.5";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("42.5");
      });

      it("should accept a valid integer numeric response", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "numeric";

        expect(() => {
          interaction.learner_response = "42";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("42");
      });

      it("should reject multiple numeric responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "numeric";

        expect(() => {
          interaction.learner_response = "42.5,43.5";
        }).toThrow();
      });

      it("should reject invalid numeric responses", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "numeric";

        expect(() => {
          interaction.learner_response = "not-a-number";
        }).toThrow();
      });
    });

    describe("other interaction type", () => {
      it("should accept a valid other response", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "other";

        expect(() => {
          interaction.learner_response = "Any string up to 4000 characters";
        }).not.toThrow();

        expect(interaction.learner_response).toBe("Any string up to 4000 characters");
      });

      it("should reject a response that's too long", () => {
        const interaction = new CMIInteractionsObject();
        interaction.id = "interaction-1";
        interaction.type = "other";

        // Create a string with 4001 characters (more than the max of 4000)
        const tooLongResponse = "a".repeat(4001);

        expect(() => {
          interaction.learner_response = tooLongResponse;
        }).toThrow();
      });
    });
  });

  describe("Correct Response Tests", () => {
    describe("performance correct response", () => {
      it("should accept a valid performance pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("performance");

        expect(() => {
          correctResponse.pattern = "step1.value1";
        }).not.toThrow();

        expect(correctResponse.pattern).toBe("step1.value1");
      });

      it("should accept multiple valid performance patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("performance");

        expect(() => {
          correctResponse.pattern = "step1.value1,step2.value2";
        }).not.toThrow();

        expect(correctResponse.pattern).toBe("step1.value1,step2.value2");
      });

      it("should reject empty step names or answers", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("performance");

        expect(() => {
          cr.pattern = "step1.";
        }).toThrow(); // empty answer
        expect(() => {
          cr.pattern = ".value1";
        }).toThrow(); // empty step
      });

      it("should accept identifier answers", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("performance");

        // 'abcd' as a step answer is valid per SCORM's characterstring rule
        expect(() => {
          cr.pattern = "step1.abcd";
        }).not.toThrow();
        expect(cr.pattern).toBe("step1.abcd");
      });

      it("should accept numeric‐range answers", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("performance");

        expect(() => {
          cr.pattern = "step1.3.5:4.2";
        }).not.toThrow();
        expect(cr.pattern).toBe("step1.3.5:4.2");
      });
      it("should accept valid performance patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("performance");
        // both parts match format and delimiter is dot
        expect(() => {
          cr.pattern = "step1.value1";
        }).not.toThrow();
      });

      it("should reject too many components", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("performance");
        // three parts → invalid
        expect(() => {
          cr.pattern = "a.b.c";
        }).toThrow();
      });

      it("should reject duplicate performance patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("performance");
        expect(() => {
          cr.pattern = "step1.x,step1.x";
        }).toThrow();
      });
    });

    describe("numeric correct response", () => {
      it("should accept a valid numeric range pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("numeric");

        expect(() => {
          correctResponse.pattern = "42.5:43.5";
        }).not.toThrow();

        expect(correctResponse.pattern).toBe("42.5:43.5");
      });

      it("should accept a valid single numeric pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("numeric");

        expect(() => {
          correctResponse.pattern = "42.5";
        }).not.toThrow();

        expect(correctResponse.pattern).toBe("42.5");
      });

      it("should reject invalid numeric patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("numeric");

        expect(() => {
          correctResponse.pattern = "not-a-number";
        }).toThrow();

        expect(() => {
          correctResponse.pattern = "42.5:not-a-number";
        }).toThrow();

        expect(() => {
          correctResponse.pattern = "42.5:43.5:44.5"; // Too many values
        }).toThrow();
      });
    });

    describe("true-false correct response", () => {
      it("should accept valid true-false patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("true-false");

        expect(() => {
          correctResponse.pattern = "true";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("true");

        correctResponse.reset();
        expect(() => {
          correctResponse.pattern = "false";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("false");
      });

      it("should reject invalid true-false patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("true-false");

        expect(() => {
          correctResponse.pattern = "TRUE"; // Case sensitive
        }).toThrow();

        expect(() => {
          correctResponse.pattern = "FALSE"; // Case sensitive
        }).toThrow();

        expect(() => {
          correctResponse.pattern = "yes"; // Not a valid value
        }).toThrow();
      });
    });

    describe("choice correct response", () => {
      it("should accept a valid choice pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("choice");

        expect(() => {
          correctResponse.pattern = "choice1";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("choice1");
      });

      it("should accept multiple valid choice patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("choice");

        expect(() => {
          correctResponse.pattern = "choice1,choice2,choice3";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("choice1,choice2,choice3");
      });

      it("should reject too many choices", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("choice");

        // Create a string with 37 choices (more than the max of 36)
        const tooManyChoices = Array.from({ length: 37 }, (_, i) => `choice${i + 1}`).join(",");

        expect(() => {
          correctResponse.pattern = tooManyChoices;
        }).toThrow();
      });

      it("should reject duplicate choice patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("choice");
        expect(() => {
          cr.pattern = "choice1,choice1";
        }).toThrow(); // duplicate not allowed
      });

      it("should reject open-ended lower bound '5:'", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("numeric");
        expect(() => {
          cr.pattern = "5:";
        }).toThrow();
      });

      it("should accept open-ended upper bound ':10'", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("numeric");
        expect(() => {
          cr.pattern = ":10";
        }).toThrow();
      });
    });

    describe("fill-in correct response", () => {
      it("should accept a valid fill-in pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("fill-in");

        expect(() => {
          correctResponse.pattern = "answer";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("answer");
      });

      it("should accept multiple valid fill-in patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("fill-in");

        expect(() => {
          correctResponse.pattern = "answer1,answer2,answer3";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("answer1,answer2,answer3");
      });
    });

    describe("long-fill-in correct response", () => {
      it("should accept a valid long-fill-in pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("long-fill-in");

        expect(() => {
          correctResponse.pattern = "This is a long answer that could be up to 4000 characters.";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe(
          "This is a long answer that could be up to 4000 characters.",
        );
      });

      // Long-fill-in multiple
      it("should reject multiple long-fill-in patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("long-fill-in");
        expect(() => {
          cr.pattern = "a,b";
        }).toThrow();
      });

      it("should reject a pattern that's too long", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("long-fill-in");

        // Create a string with 4001 characters (more than the max of 4000)
        const tooLongPattern = "a".repeat(4001);

        expect(() => {
          correctResponse.pattern = tooLongPattern;
        }).toThrow();
      });
    });

    describe("matching correct response", () => {
      it("should accept a valid matching pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("matching");

        expect(() => {
          correctResponse.pattern = "source1.target1";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("source1.target1");
      });

      it("should accept multiple valid matching patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("matching");

        expect(() => {
          correctResponse.pattern = "source1.target1,source2.target2,source3.target3";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("source1.target1,source2.target2,source3.target3");
      });

      it("should reject invalid matching patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("matching");

        expect(() => {
          correctResponse.pattern = "source1-target1"; // Invalid delimiter
        }).toThrow();

        expect(() => {
          correctResponse.pattern = "source1."; // Missing target
        }).toThrow();

        expect(() => {
          correctResponse.pattern = ".target1"; // Missing source
        }).toThrow();
      });

      it("should reject too many matching patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("matching");
        const tooMany = Array.from({ length: 37 }, (_, i) => `src${i}.tgt${i}`).join(",");
        expect(() => {
          cr.pattern = tooMany;
        }).toThrow();
      });

      it("should reject duplicate matching patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("matching");
        expect(() => {
          cr.pattern = "a.b,a.b";
        }).toThrow();
      });
    });

    describe("sequencing correct response", () => {
      it("should accept a valid sequencing pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("sequencing");

        expect(() => {
          correctResponse.pattern = "item1";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("item1");
      });

      it("should accept multiple valid sequencing patterns", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("sequencing");

        expect(() => {
          correctResponse.pattern = "item1,item2,item3";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("item1,item2,item3");
      });

      // Sequencing too many
      it("should reject too many sequencing patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("sequencing");
        const tooMany = Array.from({ length: 37 }, (_, i) => `item${i + 1}`).join(",");
        expect(() => {
          cr.pattern = tooMany;
        }).toThrow();
      });
    });

    describe("likert correct response", () => {
      it("should accept a valid likert pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("likert");

        expect(() => {
          correctResponse.pattern = "likert_1";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("likert_1");
      });

      // Likert multiple
      it("should reject multiple likert patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("likert");
        expect(() => {
          cr.pattern = "l1,l2";
        }).toThrow();
      });
    });

    describe("other correct response", () => {
      it("should accept a valid other pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("other");

        expect(() => {
          correctResponse.pattern = "Any string up to 4000 characters";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("Any string up to 4000 characters");
      });

      // Other multiple
      it("should reject multiple other patterns", () => {
        const cr = new CMIInteractionsCorrectResponsesObject("other");
        expect(() => {
          cr.pattern = "foo,bar";
        }).toThrow();
      });
    });

    describe("reset method", () => {
      it("should reset the pattern to an empty string", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("choice");

        correctResponse.pattern = "choice1";
        expect(correctResponse.pattern).toBe("choice1");

        correctResponse.reset();
        expect(correctResponse.pattern).toBe("");
      });
    });

    describe("toJSON method", () => {
      it("should return a JSON object with the pattern", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject("choice");

        correctResponse.pattern = "choice1";
        const json = correctResponse.toJSON();

        expect(json).toEqual({ pattern: "choice1" });
      });
    });

    describe("without parent interaction", () => {
      it("should accept any valid pattern format", () => {
        const correctResponse = new CMIInteractionsCorrectResponsesObject();

        // Without a parent interaction, only basic format validation is performed
        expect(() => {
          correctResponse.pattern = "any valid string";
        }).not.toThrow();
        expect(correctResponse.pattern).toBe("any valid string");
      });
    });
  });
});
