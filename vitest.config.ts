import { defineConfig } from "vitest/config";

export default defineConfig({
  poolOptions: {
    threads: {
      minWorkers: 1,
      maxWorkers: 1
    }
  },
  test: {
    include: ["test/**/*.spec.ts"],
    exclude: ["test/integration/*"],
    environment: "jsdom",
    globals: true,
    // Use a single worker thread to avoid process kill restrictions
    pool: "threads",
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage/unit",
      reporter: ["html", "lcov", "text", "text-summary", "json-summary", "json"],
      reportOnFailure: true,
      include: ["src/**/*.ts"],
      exclude: [
        "test/**/*.*",
        "src/exports/*.*",
        "src/interfaces/*.*",
        "src/types/*.*",
        "src/ScormAgain.ts",
        "src/index.ts",
        "src/esm/**/*.ts",
        "src/utilities/index.ts",
        "src/scorm12-lms-helpers/index.ts",
        "src/global.d.ts"
      ]
    }
  }
});
