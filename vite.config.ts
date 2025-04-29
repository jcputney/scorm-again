import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";

// Define entry points for regular files
const regularEntries = {
  aicc: "./src/AICC.ts",
  scorm12: "./src/Scorm12API.ts",
  scorm2004: "./src/Scorm2004API.ts",
  "scorm-again": "./src/ScormAgain.ts",
  "cross-frame-facade": "./src/facades/CrossFrameFacade.ts",
};

// Define entry points for minified files
const minEntries = {
  "aicc.min": "./src/AICC.ts",
  "scorm12.min": "./src/Scorm12API.ts",
  "scorm2004.min": "./src/Scorm2004API.ts",
  "scorm-again.min": "./src/ScormAgain.ts",
  "cross-frame-facade.min": "./src/facades/CrossFrameFacade.ts",
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";

  // Combine entries based on mode
  const entries = {
    ...regularEntries,
    ...(isProduction ? minEntries : {}),
  };

  // Create input object for build.lib
  const input = {};
  Object.keys(entries).forEach((name) => {
    input[name] = resolve(__dirname, entries[name]);
  });

  return {
    plugins: [
      dts({ include: ["src/**/*.ts"] }),
      eslint({
        include: ["src/**/*.ts"],
        emitError: isProduction,
        emitWarning: true,
      }),
    ],
    build: {
      lib: {
        entry: input,
        formats: ["es", "cjs"],
        fileName: (format, entryName) => {
          const outputFormat = format === "es" ? "esm" : format;
          return `${outputFormat === "esm" ? "esm/" : ""}${entryName}.js`;
        },
      },
      outDir: "dist",
      minify: isProduction ? "terser" : false,
      terserOptions: isProduction
        ? {
            compress: {
              passes: 3,
              drop_console: false,
              pure_getters: true,
              unsafe: true,
              unsafe_comps: true,
              unsafe_math: true,
              unsafe_methods: true,
              unsafe_proto: true,
            },
            output: {
              comments: false,
            },
            mangle: true,
          }
        : undefined,
      sourcemap: !isProduction,
      rollupOptions: {
        external: ["window.API", "window.API_1484_11"],
        output: {
          preserveModules: false,
          exports: "named",
        },
      },
      // For now, target ES2015+ browsers only, to be compatible with esbuild's limitations
      target: "es2015",
    },
    test: {
      include: ["test/**/*.spec.ts"],
      exclude: ["test/integration/*"],
      globals: true,
      environment: "jsdom",
      coverage: {
        provider: "v8",
        reporter: ["html", "lcov", "text", "text-summary"],
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
  };
});
