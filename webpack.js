const path = require('path');
const webpack = require('webpack');
const ESLintPlugin = require('eslint-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const JSLoader = {
  test: /\.js$/i,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            'corejs': '3',
            'useBuiltIns': 'entry',
            'targets': {
              'browsers': [
                'edge >= 16',
                'safari >= 9',
                'firefox >= 57',
                'ie >= 11',
                'ios >= 9',
                'chrome >= 49',
              ],
            },
          },
        ],
        ['@babel/preset-flow'],
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods',
        '@babel/plugin-proposal-optional-chaining',
      ],
    },
  },
};

module.exports = {
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
      overrideConfigFile: path.resolve(__dirname, '.eslintrc.js'),
      context: path.resolve(__dirname, '../src'),
      files: '**/*.js',
    }),
  ],
};
