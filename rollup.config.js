import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";
import cache from "@mo36924/rollup-plugin-cache";
import { babel } from "@rollup/plugin-babel";
import { codecovRollupPlugin } from "@codecov/rollup-plugin";

// Entry points
const entries = {
  aicc: "src/AICC.ts",
  scorm12: "src/Scorm12API.ts",
  scorm2004: "src/Scorm2004API.ts",
  "scorm-again": "src/ScormAgain.ts",
  "cross-frame-api": "src/CrossFrameAPI.ts",
  "cross-frame-lms": "src/CrossFrameLMS.ts",
};
const esmEntries = {
  aicc: "src/esm/AICC.esm.ts",
  scorm12: "src/esm/Scorm12API.esm.ts",
  scorm2004: "src/esm/Scorm2004API.esm.ts",
  "scorm-again": "src/esm/ScormAgain.esm.ts",
  "cross-frame-api": "src/esm/CrossFrameAPI.esm.ts",
  "cross-frame-lms": "src/esm/CrossFrameLMS.esm.ts",
};

// Build configurations
const configs = [];

// Generate standard builds (CJS format)
Object.entries(entries).forEach(([name, input]) => {
  let exportName = name;
  switch (name) {
    case "scorm2004":
      exportName = "Scorm2004API";
      break;
    case "scorm12":
      exportName = "Scorm12API";
      break;
    case "aicc":
      exportName = "AICC";
      break;
    case "cross-frame-api":
      exportName = "CrossFrameAPI";
      break;
    case "cross-frame-lms":
      exportName = "CrossFrameLMS";
      break;
  }

  // Regular build
  configs.push({
    input,
    output: {
      file: `dist/${name}.js`,
      format: "iife",
      sourcemap: true,
      exports: "auto",
      name: exportName,
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
      name: exportName,
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
      name: exportName,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        target: "es2015",
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
      name: exportName,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        target: "es2015",
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
      codecovRollupPlugin({
        enableBundleAnalysis: process.env.CODECOV_TOKEN !== undefined && name === "scorm-again",
        bundleName: "scorm-again",
        uploadToken: process.env.CODECOV_TOKEN,
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
