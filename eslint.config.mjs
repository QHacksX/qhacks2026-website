import { defineConfig, globalIgnores } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores(["dist/*", ".next/*", "**/*.js", "**/next-env.d.ts"]),
  {
    extends: compat.extends("next", "next/core-web-vitals", "next/typescript"),

    languageOptions: {
      ecmaVersion: 5,
      sourceType: "script",

      parserOptions: {
        project: "./tsconfig.json",
      },
    },

    ignores: ["*.config.mjs"],

    rules: {
      "no-eq-null": "off",
      "prefer-object-has-own": "off",
      "no-negated-condition": "off",
      "react/no-unescaped-entities": "off",
    },
  },
]);
