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
