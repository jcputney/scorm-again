import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

describe("Terminate during host delivery notifications", () => {
  for (const listener of ["callback", "event"]) {
    for (const target of ["a", "b"]) {
      it(`preserves the delivered attempt when unload ${listener} terminates during choice to ${target}`, () => {
        // The service catches listener errors, so record results here and assert them afterwards.
        let terminateResult: string | undefined;
        let terminatedInListener: boolean | undefined;
        const onUnload = vi.fn(() => {
          terminateResult = api.Terminate("");
          terminatedInListener = api.isTerminated();
        });
        const api = new Scorm2004API({
          logLevel: 5,
          sequencing: {
            activityTree: {
              id: "root",
              sequencingControls: { flow: true, choice: true },
              children: [{ id: "a" }, { id: "b" }],
            },
            eventListeners: listener === "callback" ? { onActivityUnload: onUnload } : {},
          },
        });
        expect(api.processNavigationRequest("start")).toBe(true);
        expect(api.Initialize("")).toBe("true");
        if (listener === "event") api.on("ActivityUnload", onUnload);
        if (target === "a") expect(api.processNavigationRequest("suspendAll")).toBe(true);
        const prepare = vi.spyOn(api.getSequencingService()!, "prepareNavigationRequest");
        const commit = vi.spyOn(api, "renderCommitCMI");
        expect(api.processNavigationRequest("choice", target)).toBe(true);
        expect(onUnload).toHaveBeenCalledTimes(1);
        expect(terminateResult).toBe("true");
        expect(terminatedInListener).toBe(true);
        expect(commit).toHaveBeenCalled();
        expect(api.adl.sequencing.getCurrentActivity()).toMatchObject({
          id: target,
          isActive: true,
          activityAttemptActive: true,
          attemptCount: 1,
          deliveryWasResumed: target === "a",
        });
        expect(prepare).toHaveBeenCalledTimes(1);
        expect(api.getSequencingService()!.isDeliveryInProgress()).toBe(false);
      });
    }
  }
});
