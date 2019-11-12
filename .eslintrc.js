module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'google'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    classPrivateMethods: true,
    ecmaFeatures: {
      globalReturn: false,
    },
    babelOptions: {
      configFile: './.babelrc',
    },
  },
  rules: {
    'camelcase': 'off',
    'max-len': 'off',
    'no-unused-vars': 'off',
  },
  overrides: [
    {
      'files': ['*.spec.js'],
      'rules': {
        'no-undef': 0,
      },
    },
  ],
};
