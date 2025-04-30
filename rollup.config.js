import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
import cache from "@mo36924/rollup-plugin-cache";
import { babel } from "@rollup/plugin-babel";

// Entry points
const entries = {
  aicc: "src/AICC.ts",
  scorm12: "src/Scorm12API.ts",
  scorm2004: "src/Scorm2004API.ts",
  "scorm-again": "src/ScormAgain.ts",
  "cross-frame-facade": "src/facades/CrossFrameFacade.ts",
};
const esmEntries = {
  aicc: "src/facades/AICC.esm.ts",
  scorm12: "src/facades/Scorm12API.esm.ts",
  scorm2004: "src/facades/Scorm2004API.esm.ts",
  "scorm-again": "src/facades/ScormAgain.esm.ts",
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
        format: {
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
        format: {
          comments: false,
        },
        mangle: false,
      }),
    ],
  });
});

Object.entries(esmEntries).forEach(([name, input]) => {
  // ESM copies
  configs.push({
    input,
    output: {
      file: `dist/esm/${name}.js`,
      format: "es",
      sourcemap: true,
      exports: "auto",
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

  // ESM minified copies
  configs.push({
    input,
    output: {
      file: `dist/esm/${name}.min.js`,
      format: "es",
      sourcemap: true,
      exports: "auto",
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
        format: {
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
