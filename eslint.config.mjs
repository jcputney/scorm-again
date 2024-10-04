import globals from "globals";
import babelParser from "babel-eslint";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("eslint:recommended"), {
    languageOptions: {
        globals: {
            ...globals.browser,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: babelParser,
        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            allowImportExportEverywhere: false,
            classPrivateMethods: true,

            ecmaFeatures: {
                globalReturn: false,
                legacyDecorators: true,
            },

            babelOptions: {
                configFile: "./.babelrc",
            },
        },
    },

    rules: {
        camelcase: "off",
        "max-len": "off",
        "no-unused-vars": "off",
    },
}, {
    files: ["**/*.spec.mjs"],

    rules: {
        "no-undef": 0,
    },
}];