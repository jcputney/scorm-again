import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
import cache from "@mo36924/rollup-plugin-cache";
import { bundleStats } from "rollup-plugin-bundle-stats";
import { babel } from "@rollup/plugin-babel";

// Entry points
const entries = {
  aicc: "src/AICC.ts",
  scorm12: "src/Scorm12API.ts",
  scorm2004: "src/Scorm2004API.ts",
  "scorm-again": "src/ScormAgain.ts",
  "cross-frame-facade": "src/facades/CrossFrameFacade.ts",
};

// Build configurations
const configs = [];

// Generate standard builds (CJS format)
Object.entries(entries).forEach(([name, input]) => {
  // Regular build
  configs.push({
    input,
    output: {
      file: `dist/${name}.js`,
      format: "iife",
      sourcemap: true,
      exports: "auto",
      name:
        name === "scorm2004"
          ? "Scorm2004API"
          : name === "scorm12"
            ? "Scorm12API"
            : name === "aicc"
              ? "AICC"
              : name,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      bundleStats(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
      }),
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["ie 11", "> 0.25%, not dead"],
              },
            },
          ],
        ],
        extensions: [".js", ".ts"],
      }),
      terser({
        compress: false,
        output: {
          comments: false,
        },
        mangle: false,
      }),
    ],
  });

  // Minified build
  configs.push({
    input,
    output: {
      file: `dist/${name}.min.js`,
      format: "iife",
      sourcemap: true,
      exports: "auto",
      name:
        name === "scorm2004"
          ? "Scorm2004API"
          : name === "scorm12"
            ? "Scorm12API"
            : name === "aicc"
              ? "AICC"
              : name,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
      }),
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["ie 11", "> 0.25%, not dead"],
              },
            },
          ],
        ],
        extensions: [".js", ".ts"],
      }),
      terser({
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
        mangle: false,
      }),
    ],
  });

  // Modern build (ES modules)
  configs.push({
    input,
    output: {
      file: `dist/modern/${name}.js`,
      format: "iife",
      sourcemap: true,
      exports: "auto",
      name:
        name === "scorm2004"
          ? "Scorm2004API"
          : name === "scorm12"
            ? "Scorm12API"
            : name === "aicc"
              ? "AICC"
              : name,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        target: "es2022",
      }),
    ],
  });

  // Modern minified build
  configs.push({
    input,
    output: {
      file: `dist/modern/${name}.min.js`,
      format: "iife",
      sourcemap: true,
      exports: "auto",
      name:
        name === "scorm2004"
          ? "Scorm2004API"
          : name === "scorm12"
            ? "Scorm12API"
            : name === "aicc"
              ? "AICC"
              : name,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        target: "es2022",
      }),
      terser({
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
        mangle: false,
      }),
    ],
  });

  // ESM copies
  configs.push({
    input,
    output: {
      file: `dist/esm/${name}.js`,
      format: "es",
      sourcemap: true,
      exports: "named",
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
      }),
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["ie 11", "> 0.25%, not dead"],
              },
            },
          ],
        ],
        extensions: [".js", ".ts"],
      }),
      terser({
        compress: false,
        output: {
          comments: false,
        },
        mangle: false,
      }),
    ],
  });

  // ESM minified copies
  configs.push({
    input,
    output: {
      file: `dist/esm/${name}.min.js`,
      format: "es",
      sourcemap: true,
      exports: "named",
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
      }),
      babel({
        babelHelpers: "bundled",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                browsers: ["ie 11", "> 0.25%, not dead"],
              },
            },
          ],
        ],
        extensions: [".js", ".ts"],
      }),
      terser({
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
        mangle: false,
      }),
    ],
  });
});

// Add maxParallelFileOps to each config
configs.forEach((config) => {
  config.maxParallelFileOps = 50;
});

export default configs;
