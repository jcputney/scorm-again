import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import complexity from "eslint-plugin-complexity";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "script" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-this-alias": "off",
      // Complexity rules
      "complexity/complexity": ["warn", { max: 15 }],
      "max-depth": ["warn", { max: 4 }],
      "max-nested-callbacks": ["warn", { max: 3 }],
      "max-params": ["warn", { max: 4 }],
    },
  },
  complexity.configs.recommended,
];
