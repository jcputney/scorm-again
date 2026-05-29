import { beforeEach, describe, expect, it } from "vitest";
import { CMIInteractionsCorrectResponsesObject } from "../../../src/cmi/scorm2004/interactions";
import { Scorm2004ValidationError } from "../../../src/exceptions/scorm2004_exceptions";

describe("SCORM 2004 Interactions Pattern Validation", () => {
  describe("Performance Pattern Validation", () => {
    let correctResponse: CMIInteractionsCorrectResponsesObject;

    beforeEach(() => {
      correctResponse = new CMIInteractionsCorrectResponsesObject("performance");
    });

    describe("Valid Performance Patterns", () => {
      it("should accept performance pattern with short identifier answer", () => {
        // step_answer as CMIShortIdentifier
        correctResponse.pattern = "step1.answer1";
        expect(correctResponse.pattern).toBe("step1.answer1");
      });

      it("should accept performance pattern with decimal number answer (INT-03 bug fix)", () => {
        // step_answer as decimal number - this was the bug!
        // Previously rejected because "3.14" contains a dot
        correctResponse.pattern = "step1.3.14";
        expect(correctResponse.pattern).toBe("step1.3.14");
      });

      it("should accept performance pattern with integer answer", () => {
        // step_answer as integer
        correctResponse.pattern = "step1.42";
        expect(correctResponse.pattern).toBe("step1.42");
      });

      it("should accept performance pattern with numeric range answer", () => {
        // step_answer as numeric range (decimal:decimal)
        correctResponse.pattern = "step1.3.5:4.2";
        expect(correctResponse.pattern).toBe("step1.3.5:4.2");
      });

      it("should accept performance pattern with integer range answer", () => {
        // step_answer as integer range
        correctResponse.pattern = "step1.10:20";
        expect(correctResponse.pattern).toBe("step1.10:20");
      });

      it("should accept performance pattern with zero values", () => {
        correctResponse.pattern = "step1.0";
        expect(correctResponse.pattern).toBe("step1.0");

        correctResponse.pattern = "step2.0.0";
        expect(correctResponse.pattern).toBe("step2.0.0");
      });

      it("should accept multiple performance nodes separated by comma", () => {
        correctResponse.pattern = "step1.answer1,step2.3.14,step3.10:20";
        expect(correctResponse.pattern).toBe("step1.answer1,step2.3.14,step3.10:20");
      });

      it("should accept a step_answer characterstring containing spaces (spec example)", () => {
        // Per RTE 4.2.9.1 the step_answer may be any characterstring (SPM 250),
        // spaces included: "step_1[.]inspect wound[,]step_2[.]clean wound".
        correctResponse.pattern = "step_1[.]inspect wound[,]step_2[.]clean wound";
        expect(correctResponse.pattern).toBe("step_1[.]inspect wound[,]step_2[.]clean wound");
      });

      it("should accept the {order_matters=false} + empty step_name spec example", () => {
        // Verbatim spec example: order_matters property delimiter, both records
        // omit the step_name ("[.]<answer>").
        correctResponse.pattern = "{order_matters=false}[.]drink coffee[,][.]eat cereal";
        expect(correctResponse.pattern).toBe("{order_matters=false}[.]drink coffee[,][.]eat cereal");
      });

      it("should accept a record with step_name only (empty step_answer)", () => {
        // A record may be "<name>[.]" - step_answer is optional.
        correctResponse.pattern = "step_1[.]";
        expect(correctResponse.pattern).toBe("step_1[.]");
      });

      it("should accept a record with step_answer only (empty step_name)", () => {
        // A record may be "[.]<answer>" - step_name is optional.
        correctResponse.pattern = "[.]answer";
        expect(correctResponse.pattern).toBe("[.]answer");
      });

      it("should accept a bracketed numeric range step_answer", () => {
        // step_answer may be a numeric range <min>[:]<max> per spec.
        correctResponse.pattern = "step_1[.]3[:]4";
        expect(correctResponse.pattern).toBe("step_1[.]3[:]4");
      });

      it("should accept open-ended bracketed numeric range step_answers", () => {
        // The spec lists [:]<max>, <min>[:] and [:] as valid range forms.
        correctResponse.pattern = "step_1[.][:]10";
        expect(correctResponse.pattern).toBe("step_1[.][:]10");

        correctResponse.pattern = "step_2[.]4[:]";
        expect(correctResponse.pattern).toBe("step_2[.]4[:]");
      });

      it("should accept identical step_name and step_answer", () => {
        // The spec does not forbid name == answer.
        correctResponse.pattern = "same.same";
        expect(correctResponse.pattern).toBe("same.same");
      });
    });

    describe("Invalid Performance Patterns", () => {
      it("should reject performance patterns without delimiter", () => {
        expect(() => {
          correctResponse.pattern = "step1value1";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should accept performance patterns with one empty part", () => {
        // Per spec a record may omit either the step_name ("[.]<answer>") or the
        // step_answer ("<name>[.]"); only both-empty is invalid.
        correctResponse.pattern = ".value1";
        expect(correctResponse.pattern).toBe(".value1");

        correctResponse.pattern = "step1.";
        expect(correctResponse.pattern).toBe("step1.");
      });

      it("should reject performance records that are completely empty", () => {
        // A record must contain at least one of step_name/step_answer.
        expect(() => {
          correctResponse.pattern = "[.]";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should accept performance patterns with dots in step_answer", () => {
        // CMIShortIdentifier allows dots, so "b.c" is a valid step_answer
        correctResponse.pattern = "a.b.c";
        expect(correctResponse.pattern).toBe("a.b.c");

        // Even multiple dots are allowed in CMIShortIdentifier
        correctResponse.pattern = "step1.3..14";
        expect(correctResponse.pattern).toBe("step1.3..14");
      });

      it("should accept performance patterns with valid URI characters in step_name", () => {
        // URI characters like @, #, : are valid in CMIShortIdentifier per RFC 3986
        correctResponse.pattern = "step@1.value1";
        expect(correctResponse.pattern).toBe("step@1.value1");

        correctResponse.pattern = "step#1.value1";
        expect(correctResponse.pattern).toBe("step#1.value1");

        correctResponse.pattern = "step:1.value1";
        expect(correctResponse.pattern).toBe("step:1.value1");
      });

      it("should reject performance patterns with whitespace in step_name", () => {
        // Whitespace is not allowed in CMIShortIdentifier
        expect(() => {
          correctResponse.pattern = "step 1.value1";
        }).toThrow(Scorm2004ValidationError);
      });

      it("should accept performance patterns with valid URI characters in step_answer", () => {
        // URI characters like @, #, : are valid in CMIShortIdentifier per RFC 3986
        correctResponse.pattern = "step1.value@1";
        expect(correctResponse.pattern).toBe("step1.value@1");

        correctResponse.pattern = "step1.value#1";
        expect(correctResponse.pattern).toBe("step1.value#1");

        correctResponse.pattern = "step1.3:4:5";
        expect(correctResponse.pattern).toBe("step1.3:4:5");
      });

      it("should accept whitespace in step_answer (characterstring, spaces allowed)", () => {
        // step_answer is a characterstring per spec; spaces are valid content.
        correctResponse.pattern = "step1.answer 1";
        expect(correctResponse.pattern).toBe("step1.answer 1");
      });
    });
  });

  describe("Numeric Pattern Validation", () => {
    let correctResponse: CMIInteractionsCorrectResponsesObject;

    beforeEach(() => {
      correctResponse = new CMIInteractionsCorrectResponsesObject("numeric");
    });

    it("should accept valid numeric patterns", () => {
      // Single value
      correctResponse.pattern = "100";
      expect(correctResponse.pattern).toBe("100");

      // Range with default (legacy plain) delimiter
      correctResponse.pattern = "10:20";
      expect(correctResponse.pattern).toBe("10:20");
    });

    it("should accept bracketed numeric ranges (spec [:] delimiter)", () => {
      // Spec example (SCORM 2004 RTE Table 4.2.9.1a): <min>[:]<max>
      correctResponse.pattern = "4[:]10";
      expect(correctResponse.pattern).toBe("4[:]10");

      // Decimal bounds keep their literal dots because [:] is the delimiter
      correctResponse.pattern = "3.14159[:]3.14159";
      expect(correctResponse.pattern).toBe("3.14159[:]3.14159");
    });

    it("should accept open-ended bracketed numeric ranges", () => {
      // Spec: [:]<max>, <min>[:], and [:] are all valid
      correctResponse.pattern = "[:]10";
      expect(correctResponse.pattern).toBe("[:]10");

      correctResponse.pattern = "4[:]";
      expect(correctResponse.pattern).toBe("4[:]");

      correctResponse.pattern = "[:]";
      expect(correctResponse.pattern).toBe("[:]");
    });

    it("should reject numeric patterns with too many values", () => {
      expect(() => {
        correctResponse.pattern = "10:20:30";
      }).toThrow(Scorm2004ValidationError);
    });

    it("should reject numeric patterns with invalid format", () => {
      expect(() => {
        correctResponse.pattern = "10a";
      }).toThrow(Scorm2004ValidationError);

      expect(() => {
        correctResponse.pattern = "10:a20";
      }).toThrow(Scorm2004ValidationError);
    });
  });

  describe("Pattern with Multiple Nodes", () => {
    let correctResponse: CMIInteractionsCorrectResponsesObject;

    beforeEach(() => {
      correctResponse = new CMIInteractionsCorrectResponsesObject("choice");
    });

    it("should accept valid choice patterns with multiple nodes", () => {
      correctResponse.pattern = "choice_1,choice_2,choice_3";
      expect(correctResponse.pattern).toBe("choice_1,choice_2,choice_3");
    });

    it("should reject patterns with duplicate nodes when uniqueness is required", () => {
      expect(() => {
        correctResponse.pattern = "choice_1,choice_1,choice_2";
      }).toThrow(Scorm2004ValidationError);
    });

    it("should reject empty patterns", () => {
      expect(() => {
        correctResponse.pattern = "";
      }).toThrow(Scorm2004ValidationError);
    });
  });

  describe("Matching Pattern Validation", () => {
    let correctResponse: CMIInteractionsCorrectResponsesObject;

    beforeEach(() => {
      correctResponse = new CMIInteractionsCorrectResponsesObject("matching");
    });

    it("should accept valid matching patterns", () => {
      // Spec example (SCORM 2004 RTE Table 4.2.9.1a): source[.]target pairs,
      // pairs separated by [,]
      correctResponse.pattern = "1[.]a[,]2[.]c[,]3[.]b";
      expect(correctResponse.pattern).toBe("1[.]a[,]2[.]c[,]3[.]b");

      const single = new CMIInteractionsCorrectResponsesObject("matching");
      single.pattern = "source1[.]target1";
      expect(single.pattern).toBe("source1[.]target1");
    });

    it("should accept matching identifiers that contain literal dots", () => {
      // Per spec sec 4.1.1.6, only the bracketed "[.]" token is a delimiter;
      // a bare "." is part of the underlying short_identifier. So "a.b" is the
      // source and "c.d" is the target.
      correctResponse.pattern = "a.b[.]c.d";
      expect(correctResponse.pattern).toBe("a.b[.]c.d");
    });

    it("should reject invalid matching patterns", () => {
      expect(() => {
        correctResponse.pattern = "sourcetarget";
      }).toThrow(Scorm2004ValidationError);

      expect(() => {
        correctResponse.pattern = "[.]target1";
      }).toThrow(Scorm2004ValidationError);

      expect(() => {
        correctResponse.pattern = "source1[.]";
      }).toThrow(Scorm2004ValidationError);
    });
  });

  describe("Fill-in Pattern Validation", () => {
    let correctResponse: CMIInteractionsCorrectResponsesObject;

    beforeEach(() => {
      correctResponse = new CMIInteractionsCorrectResponsesObject("fill-in");
    });

    it("should accept valid fill-in patterns", () => {
      correctResponse.pattern = "answer";
      expect(correctResponse.pattern).toBe("answer");

      // Empty pattern should be allowed for fill-in
      correctResponse.pattern = "";
      expect(correctResponse.pattern).toBe("");
    });
  });
});
