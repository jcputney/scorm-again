import path from "path";
import { fileURLToPath } from "url";
import ESLintPlugin from "eslint-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Webpack configuration factory
 *
 * @param {Object} env - Environment variables
 * @param {Object} argv - Command line arguments
 * @returns {Array} - Array of webpack configurations
 */
export default (env, argv) => {
  // Determine if we're in production mode
  const isProduction = argv.mode === "production";

  // Configure source maps based on mode
  const devtool = isProduction ? "source-map" : "eval-source-map";

  // Define entry points
  const entries = {
    aicc: "./src/AICC.ts",
    scorm12: "./src/Scorm12API.ts",
    scorm2004: "./src/Scorm2004API.ts",
    "scorm-again": "./src/ScormAgain.ts",
  };

  // In production, add minified versions
  if (isProduction) {
    Object.assign(entries, {
      "aicc.min": "./src/AICC.ts",
      "scorm12.min": "./src/Scorm12API.ts",
      "scorm2004.min": "./src/Scorm2004API.ts",
      "scorm-again.min": "./src/ScormAgain.ts",
    });
  }

  // TypeScript loader configuration
  const TSLoader = {
    test: /\.ts$/i,
    exclude: /node_modules/,
    use: {
      loader: "ts-loader",
      options: {
        // Enable faster builds in development
        transpileOnly: !isProduction,
      },
    },
  };

  // Define optimization settings
  const optimization = {
    // Enable tree shaking to eliminate unused code
    usedExports: true,
    // Enable module concatenation for better tree shaking
    concatenateModules: true,
    // Only minimize in production
    minimize: isProduction,
  };

  // Add minimizer in production mode
  if (isProduction) {
    optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        include: /\.min\.js$/,
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            passes: 3,
            drop_console: false, // Preserve console messages
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
          },
        },
      }),
    ];
  }

  // Common configuration for all builds
  const commonConfig = {
    mode: isProduction ? "production" : "development",
    devtool,
    entry: entries,
    module: {
      rules: [TSLoader],
    },
    // Define externals for window-attached objects
    externals: {
      // These objects will be available on window in the browser
      // so we don't need to include them in the bundle
      "window.API": "API",
      "window.API_1484_11": "API_1484_11",
    },
    optimization,
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      new ESLintPlugin({
        overrideConfigFile: path.resolve(__dirname, "eslint.config.js"),
        configType: "flat",
        context: path.resolve(__dirname, "../src"),
        files: ["**/*.js", "**/*.ts"],
        // Only emit errors in production
        emitError: isProduction,
        // Always emit warnings
        emitWarning: true,
      }),
    ],
  };

  // ES5 CommonJS configuration
  const cjsConfig = {
    ...commonConfig,
    name: "cjs",
    target: ["web", "es5"],
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      library: {
        type: "window",
      },
      environment: {
        arrowFunction: false,
      },
    },
  };

  // ES5 ESM configuration
  const esmConfig = {
    ...commonConfig,
    name: "esm",
    target: ["web", "es5"],
    output: {
      path: path.resolve(__dirname, "dist/esm"),
      filename: "[name].js",
      library: {
        type: "module",
      },
      environment: {
        arrowFunction: false,
      },
    },
    experiments: {
      outputModule: true,
    },
  };

  // Modern build configuration (ES2015+)
  const modernConfig = {
    ...commonConfig,
    name: "modern",
    target: ["web", "es2015"],
    output: {
      path: path.resolve(__dirname, "dist/modern"),
      filename: "[name].js",
      library: {
        type: "module",
      },
      environment: {
        arrowFunction: true,
      },
    },
    experiments: {
      outputModule: true,
    },
  };

  // Return all configurations
  // In development, only build the CJS and ESM versions to speed up builds
  return isProduction
    ? [cjsConfig, esmConfig, modernConfig]
    : [cjsConfig, esmConfig];
};
