import js from "@eslint/js";
import tanstackQuery from "@tanstack/eslint-plugin-query";
import tanstackRouter from "@tanstack/eslint-plugin-router";
import prettierConfig from "eslint-config-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tailwind from "eslint-plugin-tailwindcss";
import { defineConfig } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig([
  // Ignore
  { ignores: ["dist"] },
  // TypeScript
  js.configs.recommended,
  ...ts.configs.recommended,
  // React
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
  // Prettier
  prettierConfig,
  // Tailwind CSS
  {
    ...tailwind.configs.recommended,
    settings: {
      tailwindcss:
        /** @type {import('eslint-plugin-tailwindcss').PluginSettings} */
        ({
          cssConfigPath: "./src/index.css",
        }),
    },
  },
  // Tanstack
  ...tanstackRouter.configs["flat/recommended"],
  ...tanstackQuery.configs["flat/recommended"],
  // Customizations
  {
    rules: {
      "@tanstack/query/exhaustive-deps": [
        "error",
        {
          allowlist: {
            types: ["RedmineApiClient"],
          },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);
