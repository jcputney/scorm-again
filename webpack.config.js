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

export default {
  mode: "production",
  devtool: "source-map",
  entry: {
    aicc: "./src/exports/aicc.js",
    scorm12: "./src/exports/scorm12.js",
    scorm2004: "./src/exports/scorm2004.js",
    "scorm-again": "./src/exports/scorm-again.js",
    "aicc.min": "./src/exports/aicc.js",
    "scorm12.min": "./src/exports/scorm12.js",
    "scorm2004.min": "./src/exports/scorm2004.js",
    "scorm-again.min": "./src/exports/scorm-again.js",
  },
  target: ["web", "es5"],
  module: {
    rules: [TSLoader],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    library: "scorm-again",
    libraryTarget: "umd",
    environment: {
      arrowFunction: false,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        include: /\.min\.js$/,
        terserOptions: {
          output: {
            comments: false,
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
