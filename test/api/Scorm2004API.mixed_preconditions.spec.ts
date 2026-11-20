import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { ActivitySettings, SequencingRulesSettings } from "../../src/types/sequencing_types";

const rules = (...actions: string[]): SequencingRulesSettings => ({
  preConditionRules: actions.map((action) => ({ action, conditions: [{ condition: "always" }] })),
});
const leaf = (id: string): ActivitySettings => ({ id, title: id });

function session(children: ActivitySettings[]) {
  const delivered: string[] = [];
  const activityTree = {
    id: "root",
    title: "root",
    sequencingControls: { flow: true },
    children,
  };
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree,
      eventListeners: { onActivityDelivery: (activity) => delivered.push(activity.id) },
    },
  });
  const check = (request: string, expected: boolean, target?: string) => {
    const property = target ? `choice.{target=${target}}` : request;
    expect(api.GetValue(`adl.nav.request_valid.${property}`)).toBe(String(expected));
    expect(api.processNavigationRequest(request, target)).toBe(expected);
  };
  return { api, delivered, check };
}

describe("independent precondition rule sets", () => {
  it("skips a candidate cluster even when Hidden from Choice matches first (SB.2.9.1)", () => {
    const { api, delivered, check } = session([
      {
        ...leaf("chosen"),
        sequencingControls: { flow: true },
        children: [
          {
            ...leaf("skipped"),
            sequencingControls: { flow: true },
            sequencingRules: rules("hiddenFromChoice", "skip"),
            children: [leaf("wrong")],
          },
          leaf("later"),
        ],
      },
    ]);
    expect(api.processNavigationRequest("choice", "later")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    delivered.length = 0;
    check("choice", true, "chosen");
    expect(delivered).toEqual(["later"]);
  });

  it.each([true, false])("Previous checks Skip before Disabled: skip=%s (SB.2.2)", (skip) => {
    const { api, delivered, check } = session([
      leaf("earlier"),
      { ...leaf("candidate"), sequencingRules: rules("disabled", ...(skip ? ["skip"] : [])) },
      leaf("current"),
    ]);
    expect(api.processNavigationRequest("choice", "current")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    check("previous", skip);
    expect(delivered[delivered.length - 1]).toBe(skip ? "earlier" : "current");
  });

  it.each([true, false])(
    "Previous uses effective child direction: forwardOnly=%s (SB.2.1)",
    (forwardOnly) => {
      const { api, delivered, check } = session([
        {
          ...leaf("cluster"),
          sequencingControls: { flow: true, forwardOnly },
          children: [leaf("A"), { ...leaf("B"), sequencingRules: rules("disabled") }],
        },
        leaf("current"),
      ]);
      expect(api.processNavigationRequest("choice", "current")).toBe(true);
      expect(api.Initialize("")).toBe("true");
      check("previous", forwardOnly);
      expect(delivered[delivered.length - 1]).toBe(forwardOnly ? "A" : "current");
    },
  );

  it.each([true, false])(
    "chosen Skip cluster checks Disabled independently: disabled=%s (UP.5)",
    (disabled) => {
      const { api, delivered, check } = session([
        {
          ...leaf("chosen"),
          sequencingControls: { flow: true },
          sequencingRules: rules("skip", ...(disabled ? ["stopForwardTraversal", "disabled"] : [])),
          children: [leaf("child")],
        },
        leaf("current"),
      ]);
      expect(api.processNavigationRequest("choice", "current")).toBe(true);
      expect(api.Initialize("")).toBe("true");
      delivered.length = 0;
      check("choice", !disabled, "chosen");
      expect(delivered).toEqual(disabled ? [] : ["child"]);
    },
  );
  it.each(["skip", "disabled"])(
    "rejects a chosen Skip cluster with only a %s child (SB.2.9.1)",
    (action) => {
      const { api, delivered, check } = session([
        {
          ...leaf("chosen"),
          sequencingControls: { flow: true },
          sequencingRules: rules("skip"),
          children: [{ ...leaf("child"), sequencingRules: rules(action) }],
        },
        leaf("current"),
      ]);
      expect(api.processNavigationRequest("choice", "current")).toBe(true);
      expect(api.Initialize("")).toBe("true");
      check("choice", false, "chosen");
      expect(delivered).toEqual(["current"]);
    },
  );

  it("still rejects a chosen Skip leaf", () => {
    const { api, delivered, check } = session([
      { ...leaf("chosen"), sequencingRules: rules("skip") },
      leaf("current"),
    ]);
    expect(api.processNavigationRequest("choice", "current")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    check("choice", false, "chosen");
    expect(delivered).toEqual(["current"]);
  });

  it("still refuses a chosen cluster hidden by a rule after Skip", () => {
    const { api, delivered, check } = session([
      {
        ...leaf("chosen"),
        sequencingControls: { flow: true },
        sequencingRules: rules("skip", "hiddenFromChoice"),
        children: [leaf("child")],
      },
      leaf("current"),
    ]);
    expect(api.processNavigationRequest("choice", "current")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    check("choice", false, "chosen");
    expect(delivered).toEqual(["current"]);
  });
});
