import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.spec.ts"],
    exclude: ["test/integration/*"],
    environment: "jsdom",
    globals: true,
    // Use a single worker thread to avoid process kill restrictions
    pool: "threads",
    poolOptions: {
      threads: {
        minWorkers: 1,
        maxWorkers: 1,
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["html", "lcov", "text", "text-summary", "json-summary", "json"],
      reportOnFailure: true,
      include: ["src/**/*.ts"],
      exclude: [
        "test/**/*.*",
        "src/exports/*.*",
        "src/interfaces/*.*",
        "src/types/*.*",
        "src/ScormAgain.ts",
      ],
    },
  },
});
