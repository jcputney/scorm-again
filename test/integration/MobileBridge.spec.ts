import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { AddressInfo } from "node:net";
import { createMockLmsServer, type MockLmsServer } from "./mock-lms-server.js";

// CI downloads dist from the build job before running integration tests.
const bundle = readFileSync(new URL("../../dist/scorm-again.js", import.meta.url), "utf8");
const bridge = readFileSync(
  new URL("../../docs-site/examples/mobile-bridge.js", import.meta.url),
  "utf8",
);

// Each test gets its own mock LMS, so the shared one's resets and history stay
// with the specs that use them.
let lms: MockLmsServer | undefined;
test.afterEach(async () => {
  await lms?.stop();
  lms = undefined;
});

for (const version of ["1.2", "2004"] as const) {
  test(`mobile bridge: SCORM ${version}`, async ({ page }) => {
    const is12 = version === "1.2";
    const apiName = is12 ? "API" : "API_1484_11";
    const module = is12 ? "RuntimeBasicCalls_SCORM12" : "RuntimeBasicCalls_SCORM20043rdEdition";
    lms = await createMockLmsServer(0);
    const commitUrl = `http://localhost:${(lms.server.address() as AddressInfo).port}/lms/commit`;
    const requests: string[] = [];
    // Watch commits instead of routing them: Playwright's WebKit does not pass
    // synchronous XHRs, the default commit transport, through page.route.
    page.on("request", (request) => {
      if (request.method() === "POST" && request.url().startsWith(commitUrl)) {
        requests.push(request.postData() || "");
      }
    });
    const config = {
      version,
      settings: {
        lmsCommitUrl: commitUrl,
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
        // Report the network state as a native app does. Playwright's WebKit can
        // start with navigator.onLine false, which would queue every commit.
        window.dispatchEvent(new CustomEvent("scorm-again:network-status", { detail: { online: true } }));
      }`,
    });
    // These SCOs keep a global API variable of their own. Keep the LMS API
    // in a parent document, just as a native launcher does. Serve that document
    // from the real server: Chromium blocks requests to the loopback mock LMS
    // from a page that page.route served.
    const sco = `/test/integration/modules/${module}/shared/launchpage.html`;
    await page.goto(`/test/integration/wrappers/mobile-launcher.html?sco=${sco}`);
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
