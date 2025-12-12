import esbuild from "rollup-plugin-esbuild";
import cache from "@mo36924/rollup-plugin-cache";
import { babel } from "@rollup/plugin-babel";
import { minify } from "terser";

/**
 * Bundle Size Optimization Notes:
 *
 * 1. Source Maps: Source maps are now only generated in production mode.
 *    Set NODE_ENV=production when building for production.
 *
 * 2. Minification: Mangling is now enabled in terser for better minification.
 *
 * 3. Modern Directory: The dist/modern directory appears to be generated outside
 *    this configuration and is not referenced in package.json exports.
 *    Consider removing it if not needed to reduce package size.
 *
 * 4. For production builds, consider setting NODE_ENV=production to:
 *    - Generate source maps only when needed
 *    - Enable additional optimizations
 */
const reservedWords = [
  "Scorm12API",
  "Scorm2004API",
  "AICC", // public classes
  "LMSInitialize",
  "LMSFinish",
  "LMSGetValue",
  "LMSSetValue",
  "LMSCommit",
  "LMSGetLastError",
  "LMSGetErrorString",
  "LMSGetDiagnostic", // SCORM 1.2 API methods
  "Initialize",
  "Terminate",
  "GetValue",
  "SetValue",
  "Commit",
  "GetLastError",
  "GetErrorString",
  "GetDiagnostic", // SCORM 2004 API methods
  "on",
  "off",
  "clear",
  "loadFromJSON",
  "reset",
  "getCurrentTotalTime", // event/utility methods
  "cmi",
  "core",
  "student_id",
  "student_name",
  "lesson_location",
  "credit",
  "lesson_status",
  "entry",
  "exit",
  "score",
  "total_time",
  "lesson_mode",
  "session_time", // SCORM 1.2 cmi.core
  "suspend_data",
  "launch_data",
  "comments",
  "comments_from_lms", // other SCORM 1.2 cmi fields
  "student_data",
  "mastery_score",
  "max_time_allowed",
  "time_limit_action", // SCORM 1.2 student_data
  "student_preference",
  "audio",
  "language",
  "speed",
  "text", // SCORM 1.2 student_preference
  "objectives",
  "status",
  "interactions",
  "id",
  "type",
  "time",
  "timestamp",
  "weighting",
  "student_response",
  "learner_response",
  "result",
  "latency",
  "description", // interactions fields
  "correct_responses",
  "pattern", // interaction sub-fields
  "completion_status",
  "success_status",
  "progress_measure",
  "scaled_passing_score", // SCORM 2004 status/metrics
  "learner_id",
  "learner_name",
  "location",
  "mode", // SCORM 2004 renamed fields
  "comments_from_learner",
  "comment",
  "content", // SCORM 2004 comments (comment/content)
  "audio_level",
  "audio_captioning",
  "delivery_speed",
  "learner_preference", // SCORM 2004 learner_preference
  "adl",
  "nav",
  "request",
  "request_valid", // SCORM 2004 navigation API
  "_children",
  "_count",
  "_version", // special meta-properties
];

function cloneOptions(options) {
  if (!options) {
    return {};
  }
  return JSON.parse(JSON.stringify(options));
}

function buildTerserOptions(overrides, outputOptions) {
  const options = cloneOptions(overrides);
  const sourcemap =
    outputOptions.sourcemap === true || typeof outputOptions.sourcemap === "string";

  if (sourcemap) {
    options.sourceMap = true;
  }

  if (outputOptions.format === "es") {
    options.module = true;
  }

  if (outputOptions.format === "cjs") {
    options.toplevel = true;
  }

  return options;
}

function createTerserPlugin(overrides = {}) {
  return {
    name: "inline-terser",
    async renderChunk(code, chunk, outputOptions) {
      const options = buildTerserOptions(overrides, outputOptions);
      const result = await minify(code, options);

      if (result.map) {
        const map =
          typeof result.map === "string" ? JSON.parse(result.map) : result.map || null;
        return {
          code: result.code ?? code,
          map,
        };
      }

      return result.code ?? code;
    },
  };
}

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

// Determine if we're in production mode
const isProduction = process.env.NODE_ENV === "production";

// Allow skipping minified builds for faster development
const skipMinified = process.env.SKIP_MINIFIED === "true";

// Source map configuration - only generate source maps in production
const generateSourceMap = isProduction;

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
      sourcemap: generateSourceMap,
      exports: "auto",
      name: exportName,
      extend: true,
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: generateSourceMap,
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

  // Minified build (skip in dev for faster builds)
  if (!skipMinified) {
    configs.push({
      input,
      output: {
        file: `dist/${name}.min.js`,
        format: "iife",
        sourcemap: generateSourceMap,
        exports: "auto",
        name: exportName,
        extend: true,
      },
      external: ["window.API", "window.API_1484_11"],
      plugins: [
        cache(),
        esbuild({
          tsconfig: "./tsconfig.json",
          sourceMap: generateSourceMap,
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
        createTerserPlugin({
          compress: {
            passes: 2, // Reduced from 3 to 2 for faster builds
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
          mangle: {
            reserved: reservedWords,
          },
        }),
      ],
    });
  }
});

Object.entries(esmEntries).forEach(([name, input]) => {
  // ESM copies
  configs.push({
    input,
    output: {
      file: `dist/esm/${name}.js`,
      format: "es",
      sourcemap: generateSourceMap,
      exports: "auto",
    },
    external: ["window.API", "window.API_1484_11"],
    plugins: [
      cache(),
      esbuild({
        tsconfig: "./tsconfig.json",
        sourceMap: generateSourceMap,
        target: "es2022",
      }),
    ],
  });

  // ESM minified copies (skip in dev for faster builds)
  if (!skipMinified) {
    configs.push({
      input,
      output: {
        file: `dist/esm/${name}.min.js`,
        format: "es",
        sourcemap: generateSourceMap,
        exports: "auto",
      },
      external: ["window.API", "window.API_1484_11"],
      plugins: [
        cache(),
        esbuild({
          tsconfig: "./tsconfig.json",
          sourceMap: generateSourceMap,
          target: "es2022",
        }),
        createTerserPlugin({
          compress: {
            passes: 2, // Reduced from 3 to 2 for faster builds
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
          mangle: {
            reserved: reservedWords,
          },
        }),
      ],
    });
  }
});

// Add maxParallelFileOps to each config
configs.forEach((config) => {
  config.maxParallelFileOps = 50;
});

export default configs;
