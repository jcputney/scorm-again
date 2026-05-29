import { beforeEach, describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";

/**
 * End-to-end SetValue() coverage for SCORM 2004
 * cmi.interactions.n.correct_responses.n.pattern and learner_response.
 *
 * These exercise the FULL public API path, which runs two validators:
 *   1. Scorm2004ResponseValidator (handlers/scorm2004/response_validator.ts)
 *   2. CMIInteractionsCorrectResponsesObject.set pattern -> validatePattern()
 *      (cmi/scorm2004/interactions.ts)
 * Both must agree for a value to be accepted.
 *
 * The expectation is the SCORM 2004 4th Edition RTE spec (sec 4.1.1.6 + 4.2.9.1,
 * Table 4.1.1.6b): the separator delimiters are the *bracketed* tokens "[,]",
 * "[.]", "[:]". See GitHub issue #1571.
 */
describe("SCORM 2004 correct_responses.pattern (end-to-end SetValue)", () => {
  let api: Scorm2004API;

  function newInteraction(type: string): Scorm2004API {
    const a = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    a.lmsInitialize();
    a.lmsSetValue("cmi.interactions.0.id", "q0");
    a.lmsSetValue("cmi.interactions.0.type", type);
    expect(a.lmsGetLastError()).toBe("0");
    return a;
  }

  function setPattern(type: string, pattern: string) {
    api = newInteraction(type);
    const ret = api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", pattern);
    return { ret, err: api.lmsGetLastError() };
  }

  function expectAccepted(type: string, pattern: string) {
    const { ret, err } = setPattern(type, pattern);
    expect(ret, `expected "${pattern}" (${type}) to be accepted`).toBe("true");
    expect(err, `expected "${pattern}" (${type}) to set error 0`).toBe("0");
    // Round-trips verbatim
    expect(api.lmsGetValue("cmi.interactions.0.correct_responses.0.pattern")).toBe(pattern);
  }

  function expectRejected(type: string, pattern: string) {
    const { ret, err } = setPattern(type, pattern);
    expect(ret, `expected "${pattern}" (${type}) to be rejected`).toBe("false");
    expect(err, `expected "${pattern}" (${type}) to set a failure code`).not.toBe("0");
  }

  describe("choice (bracketed [,] delimiter per spec)", () => {
    it("accepts the spec example with three choices", () => {
      expectAccepted("choice", "choice1[,]choice2[,]choice3");
    });
    it("accepts two choices", () => {
      expectAccepted("choice", "choice1[,]choice2");
    });
    it("accepts a single choice", () => {
      expectAccepted("choice", "choice1");
    });
    it("rejects duplicate choices (uniqueness)", () => {
      expectRejected("choice", "choice1[,]choice1");
    });
  });

  describe("fill-in (bracketed [,] delimiter + reserved property delimiters)", () => {
    it("accepts the spec example with case/lang property delimiters", () => {
      expectAccepted("fill-in", "{case_matters=true}{lang=en}car");
    });
    it("accepts multiple answers separated by [,]", () => {
      expectAccepted("fill-in", "car[,]automobile");
    });
    it("accepts a bare answer", () => {
      expectAccepted("fill-in", "car");
    });
  });

  describe("sequencing (bracketed [,] delimiter per spec)", () => {
    it("accepts the spec form", () => {
      expectAccepted("sequencing", "frag_a[,]frag_b[,]frag_c");
    });
    it("accepts a single fragment", () => {
      expectAccepted("sequencing", "frag_a");
    });
    it("rejects a fragment containing whitespace", () => {
      expectRejected("sequencing", "frag a[,]frag_b");
    });
  });

  describe("matching (bracketed [.] pair + [,] set delimiters per spec)", () => {
    it("accepts the spec example 1[.]a[,]2[.]c[,]3[.]b", () => {
      expectAccepted("matching", "1[.]a[,]2[.]c[,]3[.]b");
    });
    it("accepts a single source/target pair", () => {
      expectAccepted("matching", "1[.]a");
    });
    it("accepts identifiers that contain literal dots (only [.] is a delimiter)", () => {
      // a.b is one short_identifier (source), c.d is the target; bracketed [.] separates them
      expectAccepted("matching", "a.b[.]c.d");
    });
    it("rejects a pair with no delimiter", () => {
      expectRejected("matching", "sourcetarget");
    });
    it("rejects an empty source", () => {
      expectRejected("matching", "[.]target1");
    });
    it("rejects an empty target", () => {
      expectRejected("matching", "source1[.]");
    });
    it("rejects a record with three members", () => {
      expectRejected("matching", "a[.]b[.]c");
    });
  });

  describe("performance (bracketed [.] step delimiter + [,] set delimiter)", () => {
    it("accepts the spec form with step names and answers", () => {
      expectAccepted("performance", "step_1[.]answer1[,]step_2[.]answer2");
    });
    it("accepts a decimal step answer (literal dot in the answer)", () => {
      expectAccepted("performance", "step_1[.]3.14");
    });
  });

  describe("numeric (bracketed [:] range delimiter per spec)", () => {
    it("accepts a single value", () => {
      expectAccepted("numeric", "7");
    });
    it("accepts the spec range example 4[:]10", () => {
      expectAccepted("numeric", "4[:]10");
    });
    it("accepts the issue's range example 19[:]25", () => {
      expectAccepted("numeric", "19[:]25");
    });
    it("accepts a decimal range (literal dots in the bounds)", () => {
      expectAccepted("numeric", "3.14159[:]3.14159");
    });
    it("accepts an open upper range [:]10", () => {
      expectAccepted("numeric", "[:]10");
    });
    it("accepts an open lower range 4[:]", () => {
      expectAccepted("numeric", "4[:]");
    });
    it("accepts a fully open range [:]", () => {
      expectAccepted("numeric", "[:]");
    });
    it("rejects a non-numeric bound", () => {
      expectRejected("numeric", "abc[:]10");
    });
    it("rejects more than two bounds", () => {
      expectRejected("numeric", "4[:]10[:]20");
    });
    it("rejects min greater than max", () => {
      expectRejected("numeric", "10[:]4");
    });
  });

  describe("backward compatibility: plain (non-bracketed) forms still accepted", () => {
    it("plain choice", () => {
      expectAccepted("choice", "choice1,choice2,choice3");
    });
    it("plain numeric range", () => {
      expectAccepted("numeric", "10:20");
    });
    it("plain matching", () => {
      expectAccepted("matching", "1.a,2.c");
    });
  });
});

describe("SCORM 2004 learner_response (end-to-end SetValue, bracketed delimiters)", () => {
  function newInteraction(type: string): Scorm2004API {
    const a = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    a.lmsInitialize();
    a.lmsSetValue("cmi.interactions.0.id", "q0");
    a.lmsSetValue("cmi.interactions.0.type", type);
    expect(a.lmsGetLastError()).toBe("0");
    return a;
  }

  function expectLRAccepted(type: string, value: string) {
    const a = newInteraction(type);
    const ret = a.lmsSetValue("cmi.interactions.0.learner_response", value);
    expect(ret, `expected learner_response "${value}" (${type}) accepted`).toBe("true");
    expect(a.lmsGetLastError()).toBe("0");
    expect(a.lmsGetValue("cmi.interactions.0.learner_response")).toBe(value);
  }

  it("accepts bracketed choice", () => {
    expectLRAccepted("choice", "choice1[,]choice2[,]choice3");
  });
  it("accepts bracketed matching", () => {
    expectLRAccepted("matching", "1[.]a[,]2[.]c");
  });
  it("accepts bracketed performance with decimal answer", () => {
    expectLRAccepted("performance", "step_1[.]3.14[,]step_2[.]answer2");
  });
});
