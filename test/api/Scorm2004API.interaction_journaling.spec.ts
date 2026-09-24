import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";

// SCORM 2004 3rd Edition RTE 4.2.9, pp. RTE-4-48/49: interactions form a bag.
// A SCO may append another response to the same question instead of replacing it.
describe("SCORM 2004 interaction journaling", () => {
  const createApi = () => new Scorm2004API({ logLevel: LogLevelEnum.NONE });
  const questionId = "com.scorm.golfsamples.interactions.playing_1";

  function recordAnswer(api: Scorm2004API, answer: string, result: string) {
    const index = api.GetValue("cmi.interactions._count");
    const prefix = `cmi.interactions.${index}`;
    for (const [field, value] of [
      ["id", questionId],
      ["description", "The rules of golf are maintained by?"],
      ["objectives.0.id", "obj_playing"],
      ["type", "choice"],
      ["learner_response", answer],
      ["correct_responses.0.pattern", "1"],
      ["result", result],
    ]) {
      expect(api.SetValue(`${prefix}.${field}`, value)).toBe("true");
      expect(api.GetLastError()).toBe("0");
    }
  }

  it.each([false, true])("preserves failed and correct answers with reload=%s", (reload) => {
    let api = createApi();
    expect(api.Initialize("")).toBe("true");
    recordAnswer(api, "0", "incorrect");

    if (reload) {
      const saved = JSON.parse(JSON.stringify(api.cmi));
      api = createApi();
      api.loadFromJSON({ cmi: saved });
      expect(api.Initialize("")).toBe("true");
    }

    recordAnswer(api, "1", "correct");
    expect(api.GetValue("cmi.interactions._count")).toBe("2");
    for (const index of [0, 1]) {
      expect(api.GetValue(`cmi.interactions.${index}.id`)).toBe(questionId);
      expect(api.GetValue(`cmi.interactions.${index}.objectives.0.id`)).toBe("obj_playing");
    }
    expect(api.GetValue("cmi.interactions.0.learner_response")).toBe("0");
    expect(api.GetValue("cmi.interactions.0.result")).toBe("incorrect");
    expect(api.GetValue("cmi.interactions.1.learner_response")).toBe("1");
    expect(api.GetValue("cmi.interactions.1.result")).toBe("correct");

    const saved = JSON.parse(JSON.stringify(api.cmi));
    const restored = createApi();
    restored.loadFromJSON({ cmi: saved });
    expect(restored.Initialize("")).toBe("true");
    expect(restored.GetValue("cmi.interactions._count")).toBe("2");
    expect(restored.GetValue("cmi.interactions.0.result")).toBe("incorrect");
    expect(restored.GetValue("cmi.interactions.1.result")).toBe("correct");
    recordAnswer(restored, "1", "correct");
    expect(restored.GetValue("cmi.interactions._count")).toBe("3");
  });
});
