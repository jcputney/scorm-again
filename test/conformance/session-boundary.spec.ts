import { describe, expect, it } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import type { StringKeyMap } from "../../src/utilities";

function cloneRuntimeData(runtimeData: StringKeyMap): StringKeyMap {
  return JSON.parse(JSON.stringify(runtimeData)) as StringKeyMap;
}

describe("Session boundary conformance", () => {
  it("loads SCORM 1.2 objectives and interactions from a prior-session commit", () => {
    const firstSession = new Scorm12API({ logLevel: LogLevelEnum.NONE });
    firstSession.loadFromJSON({
      cmi: {
        core: {
          student_id: "learner-12",
          student_name: "Learner 12",
          lesson_mode: "normal",
          credit: "credit",
          entry: "ab-initio",
          total_time: "00:01:00",
        },
        launch_data: "lesson=1",
      },
    });

    expect(firstSession.lmsInitialize()).toBe("true");
    expect(firstSession.lmsSetValue("cmi.core.lesson_location", "module-2/page-3")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.core.lesson_status", "incomplete")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.core.score.raw", "86")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.suspend_data", "bookmark=module-2/page-3")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.objectives.0.id", "objective-1")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.objectives.0.status", "incomplete")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.objectives.0.score.raw", "86")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.id", "interaction-1")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.time", "12:34:56")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.type", "choice")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.weighting", "1")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.student_response", "a")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.result", "correct")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.latency", "00:00:10")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.objectives.0.id", "objective-1")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "a")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.core.session_time", "00:02:03")).toBe("true");

    const priorRuntimeData = cloneRuntimeData(
      firstSession.renderCommitObject(true).runtimeData as StringKeyMap,
    );

    const secondSession = new Scorm12API({ logLevel: LogLevelEnum.NONE });
    secondSession.loadFromJSON(priorRuntimeData);
    expect(secondSession.lmsInitialize()).toBe("true");

    expect(secondSession.lmsGetValue("cmi.core.student_id")).toBe("learner-12");
    expect(secondSession.lmsGetValue("cmi.core.lesson_location")).toBe("module-2/page-3");
    expect(secondSession.lmsGetValue("cmi.core.lesson_status")).toBe("incomplete");
    expect(secondSession.lmsGetValue("cmi.core.total_time")).toBe("00:03:03");
    expect(secondSession.lmsGetValue("cmi.suspend_data")).toBe("bookmark=module-2/page-3");
    expect(secondSession.lmsGetValue("cmi.objectives._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.objectives.0.id")).toBe("objective-1");
    expect(secondSession.lmsGetValue("cmi.objectives.0.status")).toBe("incomplete");
    expect(secondSession.lmsGetValue("cmi.objectives.0.score.raw")).toBe("86");
    expect(secondSession.lmsGetValue("cmi.interactions._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.interactions.0.objectives._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.interactions.0.correct_responses._count")).toBe(1);

    const secondRuntimeData = secondSession.renderCommitObject(false).runtimeData as StringKeyMap;
    const secondCmi = secondRuntimeData.cmi as StringKeyMap;
    const interactions = secondCmi.interactions as StringKeyMap;
    const interaction = interactions["0"] as StringKeyMap;
    const interactionObjectives = interaction.objectives as StringKeyMap;
    const correctResponses = interaction.correct_responses as StringKeyMap;

    expect(interaction.id).toBe("interaction-1");
    expect(interaction.type).toBe("choice");
    expect(interaction.student_response).toBe("a");
    expect(interaction.result).toBe("correct");
    expect((interactionObjectives["0"] as StringKeyMap).id).toBe("objective-1");
    expect((correctResponses["0"] as StringKeyMap).pattern).toBe("a");
  });

  it("loads SCORM 2004 objectives, interactions, and entry from prior-session data", () => {
    const firstSession = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    firstSession.loadFromJSON({
      cmi: {
        learner_id: "learner-2004",
        learner_name: "Learner 2004",
        credit: "credit",
        mode: "normal",
        entry: "ab-initio",
        launch_data: "lesson=1",
        total_time: "PT5M",
      },
    });

    expect(firstSession.lmsInitialize()).toBe("true");
    expect(firstSession.lmsSetValue("cmi.location", "module-4/page-8")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.suspend_data", "bookmark=module-4/page-8")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.completion_status", "incomplete")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.success_status", "unknown")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.score.scaled", "0.86")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.objectives.0.id", "objective-2004")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.objectives.0.success_status", "passed")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.objectives.0.completion_status", "completed")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.objectives.0.progress_measure", "1")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.objectives.0.description", "Primary objective")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.objectives.0.score.scaled", "0.86")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.id", "interaction-2004")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.type", "choice")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.timestamp", "2024-01-02T12:34:56")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.interactions.0.weighting", "1")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.learner_response", "choice_a")).toBe(
      "true",
    );
    expect(firstSession.lmsSetValue("cmi.interactions.0.result", "correct")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.latency", "PT10S")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.description", "Question 1")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.interactions.0.objectives.0.id", "objective-2004")).toBe(
      "true",
    );
    expect(
      firstSession.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "choice_a"),
    ).toBe("true");
    expect(firstSession.lmsSetValue("cmi.session_time", "PT2M")).toBe("true");
    expect(firstSession.lmsSetValue("cmi.exit", "suspend")).toBe("true");

    const secondSessionData = cloneRuntimeData(
      firstSession.renderCommitObject(true).runtimeData as StringKeyMap,
    );
    const secondCmiData = secondSessionData.cmi as StringKeyMap;
    secondCmiData.entry = firstSession.determineEntryValue(
      String(secondCmiData.exit ?? ""),
      Boolean(secondCmiData.suspend_data),
    );
    secondCmiData.exit = "";
    secondCmiData.session_time = "PT0H0M0S";

    const secondSession = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    secondSession.loadFromJSON(secondSessionData);
    expect(secondSession.lmsInitialize()).toBe("true");

    expect(secondSession.lmsGetValue("cmi.learner_id")).toBe("learner-2004");
    expect(secondSession.lmsGetValue("cmi.entry")).toBe("resume");
    expect(secondSession.lmsGetValue("cmi.location")).toBe("module-4/page-8");
    expect(secondSession.lmsGetValue("cmi.suspend_data")).toBe("bookmark=module-4/page-8");
    expect(secondSession.lmsGetValue("cmi.total_time")).toBe("PT7M");
    expect(secondSession.lmsGetValue("cmi.objectives._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.objectives.0.id")).toBe("objective-2004");
    expect(secondSession.lmsGetValue("cmi.objectives.0.success_status")).toBe("passed");
    expect(secondSession.lmsGetValue("cmi.objectives.0.completion_status")).toBe("completed");
    expect(secondSession.lmsGetValue("cmi.objectives.0.progress_measure")).toBe("1");
    expect(secondSession.lmsGetValue("cmi.objectives.0.score.scaled")).toBe("0.86");
    expect(secondSession.lmsGetValue("cmi.interactions._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.interactions.0.id")).toBe("interaction-2004");
    expect(secondSession.lmsGetValue("cmi.interactions.0.type")).toBe("choice");
    expect(secondSession.lmsGetValue("cmi.interactions.0.learner_response")).toBe("choice_a");
    expect(secondSession.lmsGetValue("cmi.interactions.0.result")).toBe("correct");
    expect(secondSession.lmsGetValue("cmi.interactions.0.objectives._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.interactions.0.objectives.0.id")).toBe("objective-2004");
    expect(secondSession.lmsGetValue("cmi.interactions.0.correct_responses._count")).toBe(1);
    expect(secondSession.lmsGetValue("cmi.interactions.0.correct_responses.0.pattern")).toBe(
      "choice_a",
    );
  });
});
