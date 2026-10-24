import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

// CI downloads dist from the build job before running integration tests.
const bundle = readFileSync(new URL("../../dist/scorm-again.js", import.meta.url), "utf8");
const bridge = readFileSync(
  new URL("../../docs-site/examples/mobile-bridge.js", import.meta.url),
  "utf8",
);

for (const version of ["1.2", "2004"] as const) {
  test(`mobile bridge: SCORM ${version}`, async ({ page }) => {
    const is12 = version === "1.2";
    const apiName = is12 ? "API" : "API_1484_11";
    const module = is12 ? "RuntimeBasicCalls_SCORM12" : "RuntimeBasicCalls_SCORM20043rdEdition";
    const requests: string[] = [];
    await page.route("**/mobile-lms/commit", async (route) => {
      requests.push(route.request().postData() || "");
      await route.fulfill({ json: { result: "true", errorCode: 0 } });
    });
    const config = {
      version,
      settings: {
        lmsCommitUrl: "http://localhost:3000/mobile-lms/commit",
        enableOfflineSupport: true,
        courseId: `mobile-${version}`,
        logLevel: 1,
      },
      cmi: is12 ? { core: { student_id: "mobile-learner" } } : { learner_id: "mobile-learner" },
    };
    // One init script guarantees ordering and runs before the real SCO scripts.
    // Subframes find the main frame API rather than constructing another one.
    await page.addInitScript({
      content: `if (window === window.top) {
        window.nativeMessages = [];
        window.ReactNativeWebView = { postMessage: function (json) {
          window.nativeMessages.push(JSON.parse(json));
        }};
        ${bundle}
        window.scormBridgeConfig = ${JSON.stringify(config)};
        ${bridge}
      }`,
    });
    // These SCOs keep a global API variable of their own. Keep the LMS API
    // in a parent document, just as a native launcher does.
    await page.route("**/mobile-launcher", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: `<!doctype html><iframe title="Course" src="/test/integration/modules/${module}/shared/launchpage.html"></iframe>`,
      }),
    );
    await page.goto("/mobile-launcher");
    const messages = () => page.evaluate(() => (window as any).nativeMessages);
    await expect
      .poll(messages)
      .toEqual(
        expect.arrayContaining([
          expect.objectContaining({ type: "event", name: is12 ? "LMSInitialize" : "Initialize" }),
        ]),
      );
    expect(await page.evaluate((name) => (window as any)[name].isInitialized(), apiName)).toBe(
      true,
    );

    const commit = async (location: string) => {
      expect(
        await page.evaluate(
          ({ apiName, is12, location }) => {
            const api = (window as any)[apiName];
            if (is12) {
              api.LMSSetValue("cmi.core.lesson_location", location);
              return api.LMSCommit("");
            }
            api.SetValue("cmi.location", location);
            return api.Commit("");
          },
          { apiName, is12, location },
        ),
      ).toBe("true");
    };
    const network = (online: boolean) =>
      page.evaluate((online) => {
        window.dispatchEvent(new CustomEvent("scorm-again:network-status", { detail: { online } }));
      }, online);
    await commit("online-marker");
    await expect.poll(() => requests.some((body) => body.includes("online-marker"))).toBe(true);
    await network(false);
    const before = requests.length;
    await commit("offline-marker");
    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("scorm_again_sync_queue")))
      .toContain("offline-marker");
    expect(requests).toHaveLength(before);
    const messageStart = (await messages()).length;
    await network(true);
    await expect.poll(() => requests.some((body) => body.includes("offline-marker"))).toBe(true);
    await expect
      .poll(async () =>
        (await messages())
          .slice(messageStart)
          .filter(
            (message: any) => message.type === "event" && message.name.startsWith("OfflineData"),
          )
          .map((message: any) => message.name),
      )
      .toEqual(["OfflineDataSyncing", "OfflineDataSynced"]);
    await expect
      .poll(() =>
        page.evaluate(
          () => JSON.parse(localStorage.getItem("scorm_again_sync_queue") || "[]").length,
        ),
      )
      .toBe(0);
    await expect.poll(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "log",
          level: expect.any(Number),
          message: expect.any(String),
        }),
      ]),
    );
  });
}
