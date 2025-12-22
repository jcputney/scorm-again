import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * See https://playwright.dev/docs/test-configuration
 */
const skipWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER === "true";
const collectCoverage = process.env.COVERAGE === "true";
const shardIndex = process.env.SHARD_INDEX || "1";

// Configure reporters based on coverage mode
const reporters: any[] = [["list"]];
if (collectCoverage) {
  const coverageDir = path.resolve(__dirname, `./coverage/e2e/shard-${shardIndex}`);
  reporters.push([
    "monocart-reporter",
    {
      name: `E2E Coverage Report (Shard ${shardIndex})`,
      outputFile: path.join(coverageDir, "report.html"),
      coverage: {
        entryFilter: (entry: { url: string }) => {
          // Only collect coverage for our source files
          return entry.url.includes("/dist/") && entry.url.endsWith(".js");
        },
        sourceFilter: (sourcePath: string) => {
          // Include only src files, exclude node_modules
          return sourcePath.includes("/src/") && !sourcePath.includes("node_modules");
        },
        reports: [["lcovonly", { file: path.join(coverageDir, "lcov.info") }], ["v8"]],
      },
    },
  ]);
}

export default defineConfig({
  testDir: "./test/integration",
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Maximize parallel workers - defaults to 50% of CPU cores, this uses all cores */
  workers: process.env.CI ? "50%" : "100%",
  /* Reporter to use */
  reporter: reporters,
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: "http://localhost:3000",
    /* Collect trace when retrying the failed test */
    trace: "on-first-retry",
    /* Record video: "off" | "on" | "on-first-retry" | "retain-on-failure" */
    /* "on" records all tests, "retain-on-failure" records all but only keeps failed ones */
    video: process.env.RECORD_VIDEO === "true" ? "on" : "on-first-retry",
    /* Take a screenshot for failed tests */
    screenshot: {
      mode: "only-on-failure",
      fullPage: true,
    },
  },
  /* Configure projects for major browsers */
  projects: process.env.CI
    ? [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "firefox",
          use: { ...devices["Desktop Firefox"] },
        },
        {
          name: "webkit",
          use: { ...devices["Desktop Safari"] },
        },
        {
          name: "player-wrapper-demos",
          testMatch: "test/integration/demos/player-wrapper.spec.ts",
        },
      ]
    : [
        // Run only chromium locally for faster feedback
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"] },
        },
        {
          name: "player-wrapper-demos",
          testMatch: "test/integration/demos/player-wrapper.spec.ts",
        },
      ],
  /* Run local server before starting the tests */
  webServer: skipWebServer
    ? undefined
    : {
        command: "npm run test:integration:server",
        url: "http://localhost:3000",
        reuseExistingServer: true,
        stdout: "pipe",
        stderr: "pipe",
        timeout: 120000, // Increase timeout to 2 minutes
      },
});
