import js from "@eslint/js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // Global Ignores
  {
    ignores: [".next/*", "node_modules/*"],
  },

  // Base JS
  js.configs.recommended,

  // TypeScript (Type Checked & Scoped)
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
  },

  // React (Native Flat Config)
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat["jsx-runtime"],

  // React Hooks
  {
    plugins: {
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },

  // Next.js
  {
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // Accessibility
  jsxA11y.flatConfigs.recommended,

  // CommonJS Config Files (jest.config.js, next.config.js)
  {
    files: ["*.config.js", "*.config.mjs"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        process: "readonly",
      },
    },
  },

  // Jest Setup & Test Files
  {
    files: ["jest.setup.js", "**/*.test.{js,ts,tsx}", "**/*.spec.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        beforeEach: "readonly",
        afterAll: "readonly",
        afterEach: "readonly",
        global: "readonly",
        require: "readonly",
        module: "readonly",
        console: "readonly",
        URLSearchParams: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Custom Rules & Senior Overrides
  // TS Specific Rules
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "react/prop-types": "off",
      "@typescript-eslint/require-await": "off",
    },
  },
  // General/Framework Rules
  {
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/no-unescaped-entities": "error",
      "@next/next/no-img-element": "warn",
    },
  },

  // Prettier (must be last)
  prettier,
];
