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
  const devtool = isProduction ? false : "eval-source-map";

  // Define entry points for regular files
  const regularEntries = {
    aicc: "./src/AICC.ts",
    scorm12: "./src/Scorm12API.ts",
    scorm2004: "./src/Scorm2004API.ts",
    "scorm-again": "./src/ScormAgain.ts",
  };

  // Define entry points for minified files (only in production)
  const minEntries = isProduction ? {
    "aicc.min": "./src/AICC.ts",
    "scorm12.min": "./src/Scorm12API.ts",
    "scorm2004.min": "./src/Scorm2004API.ts",
    "scorm-again.min": "./src/ScormAgain.ts",
  } : {};

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
    sideEffects: false,
  };

  // Define base optimization settings
  const baseOptimization = {
    // Enable tree shaking to eliminate unused code
    usedExports: true,
    // Enable module concatenation for better tree shaking
    concatenateModules: true,
    // Disable code splitting for integration tests
    splitChunks: false,
  };

  // Optimization settings for regular files (no minification)
  const regularOptimization = {
    ...baseOptimization,
    minimize: false,
  };

  // Optimization settings for minified files
  const minOptimization = {
    ...baseOptimization,
    minimize: isProduction,
  };

  // Add minimizer for minified files in production mode
  if (isProduction) {
    minOptimization.minimizer = [
      new TerserPlugin({
        parallel: true,
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
          mangle: true,
        },
        extractComments: false,
      }),
    ];
  }

  // Base configuration for all builds
  const baseConfig = {
    mode: isProduction ? "production" : "development",
    devtool,
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

  // Configuration for regular (non-minified) files
  const regularConfig = {
    ...baseConfig,
    entry: regularEntries,
    optimization: regularOptimization,
  };

  // Configuration for minified files
  const minConfig = {
    ...baseConfig,
    entry: minEntries,
    optimization: minOptimization,
  };

  // Create output configurations
  const outputConfigs = {
    cjs: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
      library: {
        type: "window",
      },
      environment: {
        arrowFunction: false,
      },
    },
    esm: {
      path: path.resolve(__dirname, "dist/esm"),
      filename: "[name].js",
      library: {
        type: "module",
      },
      environment: {
        arrowFunction: false,
      },
    },
    modern: {
      path: path.resolve(__dirname, "dist/modern"),
      filename: "[name].js",
      library: {
        type: "window",
      },
      environment: {
        arrowFunction: true,
      },
    },
  };

  // Create configurations for regular files
  const cjsRegularConfig = {
    ...regularConfig,
    name: "cjs-regular",
    target: ["web", "es5"],
    output: outputConfigs.cjs,
  };

  const esmRegularConfig = {
    ...regularConfig,
    name: "esm-regular",
    target: ["web", "es5"],
    output: outputConfigs.esm,
    experiments: {
      outputModule: true,
    },
  };

  const modernRegularConfig = {
    ...regularConfig,
    name: "modern-regular",
    target: ["web", "es2015"],
    output: outputConfigs.modern,
  };

  // Create configurations for minified files (only in production)
  const cjsMinConfig = {
    ...minConfig,
    name: "cjs-min",
    target: ["web", "es5"],
    output: outputConfigs.cjs,
  };

  const esmMinConfig = {
    ...minConfig,
    name: "esm-min",
    target: ["web", "es5"],
    output: outputConfigs.esm,
    experiments: {
      outputModule: true,
    },
  };

  const modernMinConfig = {
    ...minConfig,
    name: "modern-min",
    target: ["web", "es2015"],
    output: outputConfigs.modern,
  };

  // Combine configurations
  const configs = [cjsRegularConfig, esmRegularConfig];

  if (isProduction) {
    // Add modern build in production
    configs.push(modernRegularConfig);

    // Add minified builds in production
    if (Object.keys(minEntries).length > 0) {
      configs.push(cjsMinConfig, esmMinConfig, modernMinConfig);
    }
  }

  return configs;
};
