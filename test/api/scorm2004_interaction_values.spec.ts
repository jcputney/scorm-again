import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import {
  CMIInteractionsObject,
  CMIInteractionsCorrectResponsesObject,
} from "../../src/cmi/scorm2004/interactions";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

const pattern = "correct_responses.0.pattern";
const newline = "line one\nline two";
const crlf = "line one\r\nline two";
const emptyPatterns = ["choice", "fill-in", "long-fill-in", "other", "sequencing"];
const emptyLearnerResponses = [...emptyPatterns, "matching"];
const rejected: [string, string, string][] = [
  ...["true-false", "likert", "matching", "performance", "numeric"].map(
    (type): [string, string, string] => [type, pattern, ""],
  ),
  ...["true-false", "likert", "performance"].map((type): [string, string, string] => [
    type,
    "learner_response",
    "",
  ]),
  ...[pattern, "learner_response"].flatMap((element): [string, string, string][] => [
    ["sequencing", element, "a[,][,]b"],
    ["choice", element, "a[,][,]b"],
    ["matching", element, "a[.]"],
    ["matching", element, "[.]b"],
  ]),
];
const accepted: [string, string, string][] = [
  ...emptyPatterns.map((type): [string, string, string] => [type, pattern, ""]),
  ...emptyLearnerResponses.map((type): [string, string, string] => [type, "learner_response", ""]),
  ...[
    "{case_matters=true}Paris",
    "{case_matters=false}Paris",
    "{case_matters=true}{lang=en}Paris",
    "{lang=en}Paris",
    "Paris, France",
    newline,
    crlf,
  ].map((value): [string, string, string] => ["long-fill-in", pattern, value]),
  ["long-fill-in", "learner_response", newline],
  ["long-fill-in", "learner_response", crlf],
  ["other", pattern, "Paris, France"],
  ["other", pattern, newline],
  ...["Paris, France", " Bob ", "Bob[,] Alice", "{case_matters=true}Paris", "", newline].map(
    (value): [string, string, string] => ["fill-in", pattern, value],
  ),
  ["fill-in", "learner_response", "Paris, France"],
  ["fill-in", "learner_response", newline],
  // One free-text item longer than the 250-char SPM, with literal commas
  ["fill-in", "learner_response", "a".repeat(200) + ", " + "b".repeat(200)],
  ["performance", pattern, "s[.]a, b"],
  ["performance", pattern, "s[.]a,b"],
  ["performance", "learner_response", "s[.]a,b"],
  ["performance", "learner_response", "s[.]a, b"],
  ["choice", pattern, ""],
  ["choice", "learner_response", ""],
  ...[pattern, "learner_response"].flatMap((element): [string, string, string][] => [
    ["matching", element, "1.a,2.b"],
    ["sequencing", element, "a,b"],
    ["choice", element, "a,b"],
    ["performance", element, "s.a"],
  ]),
  ["numeric", pattern, "1:2"],
  // Free-text fill-in patterns keep accepting a lang tag the format regex can't parse
  ["fill-in", pattern, "{lang=en-GB-oxendict}Paris"],
];

function createAPI() {
  const api = new Scorm2004API({ autocommit: false, logLevel: 5 });
  expect(api.Initialize("")).toBe("true");
  return api;
}

describe("SCORM 2004 interaction values", () => {
  it.each(accepted)("accepts %s %s %j and preserves it", (type, element, value) => {
    const api = createAPI();
    expect(api.SetValue("cmi.interactions.0.id", "q1")).toBe("true");
    expect(api.SetValue("cmi.interactions.0.type", type)).toBe("true");
    const path = `cmi.interactions.0.${element}`;
    expect(api.SetValue(path, value)).toBe("true");
    expect(api.GetLastError()).toBe("0");
    expect(api.GetValue(path)).toBe(value);
    expect(api.GetLastError()).toBe("0");
  });

  it.each(emptyPatterns)("overwrites an existing %s pattern with empty text", (type) => {
    const api = createAPI();
    api.SetValue("cmi.interactions.0.id", "q1");
    api.SetValue("cmi.interactions.0.type", type);
    const path = `cmi.interactions.0.${pattern}`;
    expect(api.SetValue(path, "a")).toBe("true");
    expect(api.SetValue(path, "")).toBe("true");
    expect(api.GetLastError()).toBe("0");
    expect(api.GetValue(path)).toBe("");
    expect(api.GetLastError()).toBe("0");
  });

  it.each(emptyPatterns)("accepts an empty %s pattern directly", (type) => {
    const response = new CMIInteractionsCorrectResponsesObject(type);
    response.pattern = "a";
    response.pattern = "";
    expect(response.pattern).toBe("");
  });

  it.each(emptyLearnerResponses)("accepts an empty %s learner response directly", (type) => {
    const interaction = new CMIInteractionsObject();
    interaction.id = "q1";
    interaction.type = type;
    interaction.learner_response = type === "matching" ? "a[.]b" : "a";
    interaction.learner_response = "";
    expect(interaction.learner_response).toBe("");
  });

  it.each(rejected)("rejects %s %s %j directly", (type, element, value) => {
    expect(() => {
      if (element === pattern) {
        new CMIInteractionsCorrectResponsesObject(type).pattern = value;
      } else {
        const interaction = new CMIInteractionsObject();
        interaction.type = type;
        interaction.learner_response = value;
      }
    }).toThrow(Scorm2004ValidationError);
  });

  it.each([
    ...rejected,
    ["fill-in", pattern, "{lang=en}{lang=fr}Paris"],
    ["long-fill-in", pattern, "{order_matters=true}Paris"],
    ["long-fill-in", pattern, "{lang=en}{order_matters=true}Paris"],
    ["long-fill-in", pattern, "{case_matters=yes}Paris"],
    ["long-fill-in", pattern, "{case_matters=true}{case_matters=false}Paris"],
    ["long-fill-in", pattern, "{lang=en}{case_matters=true}Paris"],
    // Records joined by a bare comma are not split once the value uses [.]
    ["matching", pattern, "1[.]a,2[.]b"],
    ["matching", "learner_response", "1[.]a,2[.]b"],
    ["matching", pattern, "1.a[,]2.b"],
    ["matching", "learner_response", "1.a[,]2.b"],
  ])("rejects %s %s %j", (type, element, value) => {
    const api = createAPI();
    api.SetValue("cmi.interactions.0.id", "q1");
    api.SetValue("cmi.interactions.0.type", type);
    expect(api.SetValue(`cmi.interactions.0.${element}`, value)).toBe("false");
    expect(api.GetLastError()).toBe("406");
  });

  it.each(["{curly} start", newline, "{lang=en}Paris"])("accepts comment %j", (value) => {
    const api = createAPI();
    expect(api.SetValue("cmi.comments_from_learner.0.comment", value)).toBe("true");
    expect(api.GetLastError()).toBe("0");
    expect(api.GetValue("cmi.comments_from_learner.0.comment")).toBe(value);
  });

  it.each([
    "{order_matters=true}Paris",
    "{lang=en}{order_matters=true}Paris",
    "{case_matters=yes}Paris",
    "{lang=en}{case_matters=true}Paris",
  ])("rejects long-fill-in pattern %j on the correct response object", (value) => {
    const correctResponse = new CMIInteractionsCorrectResponsesObject("long-fill-in");
    expect(() => {
      correctResponse.pattern = value;
    }).toThrow(Scorm2004ValidationError);
  });

  it("rejects a malformed comment language tag", () => {
    const api = createAPI();
    expect(api.SetValue("cmi.comments_from_learner.0.comment", "{lang=bad!}x")).toBe("false");
    expect(api.GetLastError()).toBe("406");
  });
});
