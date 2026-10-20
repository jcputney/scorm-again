import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { NavigationRequestType } from "../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

const disabled = {
  preConditionRules: [{ action: "disabled", conditions: [{ condition: "always" }] }],
};

function fixture(scoItemIdValidator?: (id: string) => boolean) {
  const update = vi.fn();
  const limit = vi.fn();
  const delivery = vi.fn();
  const api = new Scorm2004API({
    logLevel: 5,
    selfReportSessionTime: false,
    scoItemIdValidator,
    sequencing: {
      eventListeners: {
        onNavigationValidityUpdate: update,
        onLimitConditionCheck: limit,
        onDeliveryRequestProcessing: delivery,
      },
      activityTree: {
        id: "course",
        sequencingControls: { flow: true, choice: true },
        children: [
          { id: "lesson" },
          { id: "quiz" },
          { id: "locked", sequencingRules: disabled },
          { id: "cluster", sequencingRules: disabled, children: [{ id: "nested" }] },
          { id: "limited" },
        ],
      },
    },
  });
  api.Initialize("");
  const tree = api.adl.sequencing.activityTree;
  const limited = tree.getActivity("limited")!;
  limited.attemptLimit = 1;
  limited.attemptCount = 1;
  const process = api.getSequencingService()!.getOverallSequencingProcess()!;
  limit.mockClear();
  delivery.mockClear();
  return { api, tree, process, update, limit, delivery };
}

const jump = (api: Scorm2004API, id: string) =>
  api.GetValue(`adl.nav.request_valid.jump.{target=${id}}`);

describe("SCORM 2004 jump validity", () => {
  it("predicts deliverable leaves and publishes the same map without delivery events", () => {
    const { api, tree, process, update, limit, delivery } = fixture();
    const expected: Record<string, string> = {
      course: "false",
      lesson: "true",
      quiz: "true",
      locked: "false",
      cluster: "false",
      nested: "false",
      limited: "false",
    };
    for (const activity of tree.getAllActivities()) {
      expect(jump(api, activity.id)).toBe(expected[activity.id]);
      expect(api.adl.nav.request_valid.jump._isTargetValid(activity.id)).toBe(
        expected[activity.id],
      );
    }
    expect(jump(api, "unknown")).toBe("false");
    process.updateNavigationValidity();
    expect(update.mock.lastCall?.[0].jump).toEqual(expected);
    expect(limit).not.toHaveBeenCalled();
    expect(delivery).not.toHaveBeenCalled();
  });

  it("rechecks limits without cache invalidation, including ancestor limits", () => {
    const { api, tree } = fixture();
    expect(jump(api, "quiz")).toBe("true");
    const quiz = tree.getActivity("quiz")!;
    quiz.attemptAbsoluteDurationLimit = "PT1S";
    quiz.attemptExperiencedDuration = "PT2S";
    expect(jump(api, "quiz")).toBe("false");
    quiz.attemptExperiencedDuration = "PT0S";
    expect(jump(api, "quiz")).toBe("true");
    tree.root!.attemptLimit = 1;
    tree.root!.attemptCount = 1;
    expect(jump(api, "quiz")).toBe("false");
  });

  it("preserves LMS maps during validity refresh", () => {
    const { api, process } = fixture();
    api.adl.nav.request_valid.choice.setStaticValue("{target=quiz}", "false");
    api.adl.nav.request_valid.jump.setStaticValue("{target=quiz}", "false");
    const choice = api.adl.nav.request_valid.choice.getAll();
    const jumpMap = api.adl.nav.request_valid.jump.getAll();
    const choiceWrite = vi.spyOn(api.adl.nav.request_valid, "choice", "set");
    const jumpWrite = vi.spyOn(api.adl.nav.request_valid, "jump", "set");
    process.updateNavigationValidity();
    expect(choiceWrite).not.toHaveBeenCalled();
    expect(jumpWrite).not.toHaveBeenCalled();
    expect(api.adl.nav.request_valid.choice.getAll()).toEqual(choice);
    expect(api.adl.nav.request_valid.jump.getAll()).toEqual(jumpMap);
  });

  it("gives the LMS validator precedence over live prediction", () => {
    const { api } = fixture((id) => id === "course");
    expect(jump(api, "course")).toBe("true");
    expect(jump(api, "quiz")).toBe("false");
  });

  it("uses the LMS static map without sequencing", () => {
    const api = new Scorm2004API({ logLevel: 5, scoItemIds: ["quiz"] });
    api.adl.nav.request_valid.jump.setStaticValue("{target=quiz}", "false");
    api.adl.nav.request_valid.jump.setStaticValue("{target=other}", "true");
    api.Initialize("");
    expect(jump(api, "quiz")).toBe("false");
    expect(jump(api, "other")).toBe("true");
  });

  it.each([
    ["course", "DB.1.1-1"],
    ["unknown", "SB.2.13-1"],
  ])("preserves real jump exceptions for %s", (target, exception) => {
    const { process } = fixture();
    expect(process.processNavigationRequest(NavigationRequestType.JUMP, target).exception).toBe(
      exception,
    );
  });
});
