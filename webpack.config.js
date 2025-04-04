import path from "path";
import { fileURLToPath } from "url";
import ESLintPlugin from "eslint-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TSLoader = {
  test: /\.ts$/i,
  exclude: /node_modules/,
  use: {
    loader: "ts-loader",
  },
};

const commonConfig = {
  mode: "production",
  devtool: "source-map",
  entry: {
    aicc: "./src/AICC.ts",
    scorm12: "./src/Scorm12API.ts",
    scorm2004: "./src/Scorm2004API.ts",
    "scorm-again": "./src/ScormAgain.ts",
    "aicc.min": "./src/AICC.ts",
    "scorm12.min": "./src/Scorm12API.ts",
    "scorm2004.min": "./src/Scorm2004API.ts",
    "scorm-again.min": "./src/ScormAgain.ts",
  },
  target: ["web", "es5"],
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
  optimization: {
    // Enable tree shaking to eliminate unused code
    usedExports: true,
    // Enable module concatenation for better tree shaking
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        include: /\.min\.js$/,
        terserOptions: {
          output: {
            comments: false,
          },
          compress: {
            passes: 3,
            drop_console: false, // Changed from true to preserve console messages
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            unsafe_math: true,
            unsafe_methods: true,
            unsafe_proto: true,
          },
        },
      }),
    ],
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
    }),
  ],
};

const cjsConfig = {
  ...commonConfig,
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

const esmConfig = {
  ...commonConfig,
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

export default [cjsConfig, esmConfig];
