import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { Settings } from "../../src/types/api_types";

const api = (settings?: Settings): Scorm2004API => {
  return new Scorm2004API({ ...settings, logLevel: LogLevelEnum.NONE });
};

const apiInitialized = (settings?: Settings): Scorm2004API => {
  const API = api(settings);
  API.loadFromJSON({}, "");
  API.lmsInitialize();
  return API;
};

describe("SCORM 2004 API Navigation Request Processing Tests", () => {
  beforeAll(() => {
    vi.stubGlobal("fetch", vi.fn());
    (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: "true", errorCode: 0 }),
      } as Response);
    });
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("Navigation Request Basic Tests", () => {
    it("should access adl.nav properties", () => {
      const apiInstance = apiInitialized();

      // Test that navigation properties are accessible
      expect(apiInstance.adl.nav).toBeDefined();
      expect(apiInstance.adl.nav.request_valid).toBeDefined();
      expect(apiInstance.adl.nav.request).toBeDefined();
    });

    it("should return error 405 when reading adl.nav.request (write-only)", () => {
      const apiInstance = apiInitialized();

      // adl.nav.request is write-only per SCORM 2004 spec
      const result = apiInstance.lmsGetValue("adl.nav.request");

      expect(result).toBe("");
      expect(apiInstance.lmsGetLastError()).toBe("405"); // WRITE_ONLY_ELEMENT
    });

    it("should handle lmsGetValue for adl.nav.request_valid", () => {
      const apiInstance = apiInitialized();

      // Test basic getValue for navigation request valid - returns the object as string
      const result = apiInstance.lmsGetValue("adl.nav.request_valid");
      expect(result).toBeDefined();
    });
  });

  describe("Navigation Request Processing During Terminate", () => {
    it("refreshes rejected Choice validity after End Attempt without emitting a legacy Choice event", () => {
      const apiInstance = api({
        sequencing: {
          activityTree: {
            id: "objective-choice-root",
            sequencingControls: { choice: true, flow: true },
            children: [
              {
                id: "current",
                primaryObjective: {
                  objectiveID: "current-objective",
                  mapInfo: [
                    {
                      targetObjectiveID: "shared-completion",
                      readCompletionStatus: true,
                      writeCompletionStatus: true,
                    },
                  ],
                },
                sequencingControls: { completionSetByContent: true },
              },
              {
                id: "target",
                objectives: [
                  {
                    objectiveID: "previous-completed",
                    mapInfo: [
                      {
                        targetObjectiveID: "shared-completion",
                        readCompletionStatus: true,
                        writeCompletionStatus: false,
                      },
                    ],
                  },
                ],
                sequencingRules: {
                  preConditionRules: [
                    {
                      action: "disabled",
                      conditionCombination: "any",
                      conditions: [
                        {
                          condition: "completed",
                          operator: "not",
                          referencedObjective: "previous-completed",
                        },
                        {
                          condition: "activityProgressKnown",
                          operator: "not",
                          referencedObjective: "previous-completed",
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      });

      expect(apiInstance.lmsInitialize()).toBe("true");
      const sequencingProcess = apiInstance.getSequencingService()?.getOverallSequencingProcess();
      expect(sequencingProcess).toBeDefined();

      // Seed the shared objective as completed so the Choice request is valid
      // before End Attempt transfers the current SCO's incomplete status.
      sequencingProcess?.updateGlobalObjective("shared-completion", {
        completionStatus: "completed",
        completionStatusKnown: true,
      });
      sequencingProcess?.synchronizeGlobalObjectives();
      expect(apiInstance.adl.nav.request_valid.choice._isTargetValid("target")).toBe("true");

      const validityUpdates: any[] = [];
      apiInstance.setSequencingEventListeners({
        onNavigationValidityUpdate: (update) => validityUpdates.push(update),
      });
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      expect(apiInstance.lmsSetValue("cmi.completion_status", "incomplete")).toBe("true");
      expect(apiInstance.lmsSetValue("adl.nav.request", "{target=target}choice")).toBe("true");
      expect(apiInstance.lmsFinish()).toBe("true");

      const current = apiInstance.getSequencingState().currentActivity;
      expect(current?.id).toBe("current");
      expect(current?.isActive).toBe(false);
      expect(current?.completionStatus).toBe("incomplete");
      expect(sequencingProcess?.getGlobalObjectiveMap().get("shared-completion")).toMatchObject({
        completionStatus: "incomplete",
        completionStatusKnown: true,
      });
      expect(apiInstance.adl.nav.request_valid.choice._isTargetValid("target")).toBe("false");
      expect(validityUpdates.some((update) => update.choice?.target === "false")).toBe(true);
      expect(
        processListenersSpy.mock.calls.some(([eventName]) => eventName === "SequenceChoice"),
      ).toBe(false);
    });

    it("should process navigation request during Terminate when set", () => {
      const apiInstance = apiInitialized();

      // Mock processListeners to verify navigation event is fired
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      // Set a navigation request
      apiInstance.lmsSetValue("adl.nav.request", "continue");
      expect(apiInstance.lmsGetLastError()).toBe("0");

      // Terminate should process the navigation request
      const result = apiInstance.lmsFinish();
      expect(result).toBe("true");

      // Verify that processListeners was called with SequenceNext (for continue)
      expect(processListenersSpy).toHaveBeenCalled();
      const calls = processListenersSpy.mock.calls;
      const hasSequenceNext = calls.some((call) => call[0] === "SequenceNext");
      expect(hasSequenceNext).toBe(true);
    });

    it("should reset navigation request to _none_ after Terminate", () => {
      const apiInstance = apiInitialized();

      // Set a navigation request
      apiInstance.lmsSetValue("adl.nav.request", "continue");

      // Store initial request value directly (since adl.nav.request is write-only)
      const initialRequest = apiInstance.adl.nav.request;
      expect(initialRequest).toBe("continue");

      // Terminate should process and reset the navigation request
      apiInstance.lmsFinish();

      // After Terminate, request should be reset to _none_
      expect(apiInstance.adl.nav.request).toBe("_none_");
    });

    it("should process different navigation request types during Terminate", () => {
      const navActions: { [key: string]: string } = {
        previous: "SequencePrevious",
        continue: "SequenceNext",
        exit: "SequenceExit",
        exitAll: "SequenceExitAll",
      };

      for (const [navRequest, expectedEvent] of Object.entries(navActions)) {
        const apiInstance = apiInitialized();
        const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

        apiInstance.lmsSetValue("adl.nav.request", navRequest);
        apiInstance.lmsFinish();

        const calls = processListenersSpy.mock.calls;
        const hasExpectedEvent = calls.some((call) => call[0] === expectedEvent);
        expect(hasExpectedEvent).toBe(true);
      }
    });

    it("should not process navigation when request is _none_", () => {
      const apiInstance = apiInitialized();
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      // Don't set any navigation request (default is _none_)
      expect(apiInstance.adl.nav.request).toBe("_none_");

      // Terminate with autoProgress disabled
      apiInstance.settings.autoProgress = false;
      apiInstance.lmsFinish();

      // Verify that processListeners was not called for navigation events
      // Note: processListeners may be called for BeforeTerminate and Terminate events,
      // but not for navigation events like SequenceNext, SequencePrevious, etc.
      const calls = processListenersSpy.mock.calls;
      const hasNavigationEvent = calls.some((call) =>
        [
          "SequenceNext",
          "SequencePrevious",
          "SequenceChoice",
          "SequenceJump",
          "SequenceExit",
          "SequenceExitAll",
          "SequenceAbandon",
          "SequenceAbandonAll",
        ].includes(call[0]),
      );
      expect(hasNavigationEvent).toBe(false);
    });

    it("should process SequenceNext when autoProgress is enabled and request is _none_", () => {
      const apiInstance = apiInitialized();
      const processListenersSpy = vi.spyOn(apiInstance, "processListeners");

      // Enable autoProgress
      apiInstance.settings.autoProgress = true;
      expect(apiInstance.adl.nav.request).toBe("_none_");

      // Terminate should trigger SequenceNext due to autoProgress
      apiInstance.lmsFinish();

      // Verify that processListeners was called with SequenceNext
      expect(processListenersSpy).toHaveBeenCalled();
      const calls = processListenersSpy.mock.calls;
      const hasSequenceNext = calls.some((call) => call[0] === "SequenceNext");
      expect(hasSequenceNext).toBe(true);
    });
  });
});
