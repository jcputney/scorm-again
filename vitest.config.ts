import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.spec.ts"],
    exclude: ["test/integration/*"],
    environment: "jsdom",
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["html", "lcov", "text", "text-summary", "json-summary", "json", "junit"],
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
