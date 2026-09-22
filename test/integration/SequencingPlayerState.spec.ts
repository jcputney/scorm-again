import { expect, test } from "@playwright/test";

// A host-controlled player exercising only the public API and the shipped ESM entry point.
const playerHtml = `<!doctype html>
<html lang="en">
<title>Sequencing player state</title>
<button id="finish" disabled>Finish SCO</button>
<output id="state"></output>
<script type="module">
  import { Scorm2004API } from "/dist/esm/scorm2004.js";

  const suspendOnClose = new URLSearchParams(location.search).get("suspendOnClose") === "true";
  const snapshotKey = "sequencing:learner:course:1";
  const runtimeKey = "runtime:learner:course:1:sco1";
  let deliveredId;
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree: {
        id: "course", title: "Course",
        children: [{ id: "sco1", title: "SCO 1" }, { id: "sco2", title: "SCO 2" }]
      },
      eventListeners: { onActivityDelivery: (activity) => { deliveredId = activity.id; } }
    }
  });
  const requireSuccess = (result) => {
    if (result !== true && result !== "true") throw new Error("Player operation failed");
  };

  const savedSnapshot = localStorage.getItem(snapshotKey);
  if (savedSnapshot) {
    requireSuccess(api.deserializeSequencingState(savedSnapshot));
    // Recovery for a known closed-window snapshot that was saved without suspendAll.
    if (!suspendOnClose && api.getSequencingState().currentActivity) {
      requireSuccess(api.processNavigationRequest("suspendAll"));
    }
    requireSuccess(api.processNavigationRequest("resumeAll"));
    api.loadFromJSON({ ...JSON.parse(localStorage.getItem(runtimeKey)), entry: "resume" });
  } else {
    requireSuccess(api.processNavigationRequest("start"));
  }
  requireSuccess(api.Initialize(""));
  document.querySelector("#state").textContent = JSON.stringify({
    deliveredId,
    location: api.GetValue("cmi.location"),
    attemptCount: api.getSequencingState().currentActivity.attemptCount,
    tracking: api.getActivityTrackingData("course")
  });

  const finish = document.querySelector("#finish");
  finish.disabled = false;
  finish.onclick = () => {
    requireSuccess(api.SetValue("cmi.location", "3"));
    requireSuccess(api.SetValue("cmi.progress_measure", "0.5"));
    localStorage.setItem(runtimeKey, JSON.stringify({ location: api.GetValue("cmi.location") }));
    requireSuccess(api.SetValue("cmi.exit", "suspend"));
    requireSuccess(api.Terminate(""));
    finish.disabled = true;
  };

  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    if (suspendOnClose && api.getSequencingState().currentActivity) {
      requireSuccess(api.processNavigationRequest("suspendAll"));
    }
    localStorage.setItem(snapshotKey, api.serializeSequencingState());
  });
</script>
</html>`;

for (const suspendOnClose of [true, false]) {
  test(`resumes a reloaded player with suspension ${suspendOnClose ? "on pagehide" : "after restore"}`, async ({
    page,
  }) => {
    await page.route("**/test/integration/player-state.html?*", (route) =>
      route.fulfill({ contentType: "text/html", body: playerHtml }),
    );
    const url = `/test/integration/player-state.html?suspendOnClose=${suspendOnClose}`;
    await page.goto(url);
    await page.locator("#finish").click();
    await expect(page.locator("#finish")).toBeDisabled();

    // Reload fires a real pagehide and creates a fresh API instance in both browser engines.
    await page.reload();
    await expect(page.locator("#finish")).toBeEnabled();
    const state = JSON.parse((await page.locator("#state").textContent())!);
    expect(state.deliveredId).toBe("sco1");
    expect(state.location).toBe("3");
    expect(state.attemptCount).toBe(1);
    expect(state.tracking.attemptCompletionAmountStatus).toBe(true);
    expect(state.tracking.attemptCompletionAmount).toBeCloseTo(0.25);
    expect(state.tracking.progressMeasure).toBe(0);
  });
}
