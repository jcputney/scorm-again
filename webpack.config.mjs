import path from 'path';
import { fileURLToPath } from 'url';
import ESLintPlugin from 'eslint-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSLoader = {
  test: /\.m?js$/i,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
  },
};

export default {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    'aicc': './src/exports/aicc.js',
    'scorm12': './src/exports/scorm12.js',
    'scorm2004': './src/exports/scorm2004.js',
    'scorm-again': './src/exports/scorm-again.js',
    'aicc.min': './src/exports/aicc.js',
    'scorm12.min': './src/exports/scorm12.js',
    'scorm2004.min': './src/exports/scorm2004.js',
    'scorm-again.min': './src/exports/scorm-again.js',
  },
  target: ['web', 'es5'],
  module: {
    rules: [
      JSLoader,
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    environment: {
      arrowFunction: false,
    },
  },
  optimization: {
    minimize: true,
    minimizer: [new UglifyJsPlugin({
      include: /\.min\.js$/,
    })],
  },
  plugins: [
    new ESLintPlugin({
      overrideConfigFile: path.resolve(__dirname, 'eslint.config.mjs'),
      configType: 'flat',
      context: path.resolve(__dirname, '../src'),
      files: ['**/*.js', '**/*.mjs'],
    }),
  ],
};
