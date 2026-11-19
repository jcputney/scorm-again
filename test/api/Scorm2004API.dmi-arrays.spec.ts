import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

const create = () => {
  const api = new Scorm2004API({ logLevel: 5 });
  api.lmsInitialize();
  return api;
};

describe("DMI array bindings", () => {
  it.each(["cmi.objectives.0.id", "cmi.interactions.0.id", "cmi.comments_from_learner.0.comment"])(
    "reads missing %s with 301",
    (element) => {
      const api = create();
      expect(api.lmsGetValue(element)).toBe("");
      expect(api.lmsGetLastError()).toBe("301");
    },
  );
  it.each([
    ["cmi.interactions.0.timestamp", "bad", "408"],
    ["cmi.objectives.0.id", "", "406"],
    ["cmi.comments_from_learner.0.timestamp", "bad", "406"],
  ])("does not create an entry after failed %s", (element, value, error) => {
    const api = create();
    expect(api.lmsSetValue(element!, value!)).toBe("false");
    expect(api.lmsGetLastError()).toBe(error);
    expect(api.lmsGetValue(element!.split(".").slice(0, 2).join(".") + "._count")).toBe("0");
  });
  it.each([
    "cmi.interactions.0.objectives.0.id",
    "cmi.interactions.0.result",
    "cmi.interactions.0.description",
    "cmi.objectives.0.description",
    "cmi.objectives.0.score.raw",
  ])("requires the parent id for %s", (element) => {
    const api = create();
    expect(api.lmsSetValue(element, "x")).toBe("false");
    expect(api.lmsGetLastError()).toBe("408");
  });
  it.each([
    "cmi.interactions.01.description",
    "cmi.interactions.2.description",
    "cmi.objectives.1.description",
  ])("checks index before dependency for %s", (element) => {
    const api = create();
    expect(api.lmsSetValue(element, "x")).toBe("false");
    expect(api.lmsGetLastError()).toBe("351");
  });
  it.each(["interactions", "objectives"])(
    "requires IDs on existing empty %s entries",
    (collection) => {
      const api = new Scorm2004API({ logLevel: 5 });
      api.loadFromJSON({ cmi: { [collection]: [{ description: "launch" }] } }, "");
      api.lmsInitialize();
      expect(api.lmsSetValue(`cmi.${collection}.0.description`, "change")).toBe("false");
      expect(api.lmsGetLastError()).toBe("408");
      expect(api.lmsGetValue(`cmi.${collection}._count`)).toBe("1");
    },
  );
  it.each([
    "objectives.1.id",
    "objectives.01.id",
    "correct_responses.1.pattern",
    "correct_responses.01.pattern",
  ])("checks nested index before type dependency for %s", (suffix) => {
    const api = create();
    api.lmsSetValue("cmi.interactions.0.id", "urn:interaction");
    expect(api.lmsSetValue(`cmi.interactions.0.${suffix}`, "bad")).toBe("false");
    expect(api.lmsGetLastError()).toBe("351");
  });
  it("preserves nested counts after failed writes", () => {
    const api = create();
    api.lmsSetValue("cmi.interactions.0.id", "urn:interaction");
    expect(api.lmsSetValue("cmi.interactions.0.objectives.0.id", "")).toBe("false");
    expect(api.lmsGetLastError()).toBe("406");
    expect(api.lmsGetValue("cmi.interactions.0.objectives._count")).toBe("0");
    expect(api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "true")).toBe("false");
    expect(api.lmsGetLastError()).toBe("408");
    expect(api.lmsGetValue("cmi.interactions.0.correct_responses._count")).toBe("0");
    api.lmsSetValue("cmi.interactions.0.type", "true-false");
    expect(api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "bad")).toBe("false");
    expect(api.lmsGetLastError()).toBe("406");
    expect(api.lmsGetValue("cmi.interactions.0.correct_responses._count")).toBe("0");
  });
  it("allows rewriting interaction IDs but preserves objective IDs", () => {
    const api = create();
    for (const collection of ["interactions", "objectives"]) {
      expect(api.lmsSetValue(`cmi.${collection}.0.id`, "urn:first")).toBe("true");
      expect(api.lmsSetValue(`cmi.${collection}.0.id`, "urn:second")).toBe(
        collection === "interactions" ? "true" : "false",
      );
    }
  });
  it.each(["comment", "location", "timestamp"])(
    "protects LMS %s before validation and permits launch seeding",
    (field) => {
      const api = new Scorm2004API({ logLevel: 5 });
      api.loadFromJSON(
        {
          cmi: {
            comments_from_lms: [
              { comment: "seed", location: "here", timestamp: "2000-01-01T00:00:00" },
            ],
          },
        },
        "",
      );
      api.lmsInitialize();
      expect(api.lmsSetValue(`cmi.comments_from_lms.0.${field}`, "bad")).toBe("false");
      expect(api.lmsGetLastError()).toBe("404");
      expect(api.lmsGetValue("cmi.comments_from_lms.0.comment")).toBe("seed");
      expect(api.lmsSetValue(`cmi.comments_from_lms.1.${field}`, "bad")).toBe("false");
      expect(api.lmsGetLastError()).toBe("404");
      expect(api.lmsGetValue("cmi.comments_from_lms._count")).toBe("1");
    },
  );
});
