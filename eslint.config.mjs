import hooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import { fixupConfigRules } from '@eslint/compat';
import storybook from 'eslint-plugin-storybook';
import prettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import js from '@eslint/js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DESIGN_SYSTEM_STORIES = 'src/components/design-system/**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)';

// Storybook rules apply to the design system stories only. The preset's other block
// (.storybook/main) is dropped because it lives outside the design system folder.
const designSystemStorybookConfigs = storybook.configs['flat/recommended']
  .filter((config) => config.name !== 'storybook:recommended:main-rules')
  .map((config) => (config.files ? { ...config, files: [DESIGN_SYSTEM_STORIES] } : config));

export default fixupConfigRules([
  // Global Ignores
  {
    ignores: ['.next/', 'node_modules/', 'storybook-static/', '.agents/'],
  },

  // Base JS
  js.configs.recommended,

  // TypeScript (Type Checked & Scoped)
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },

  // React (Native Flat Config)
  reactPlugin.configs.flat.recommended,
  reactPlugin.configs.flat['jsx-runtime'],

  // React Hooks
  {
    plugins: {
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
    },
  },

  // Next.js
  {
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // Accessibility
  jsxA11y.flatConfigs.recommended,

  // Storybook (design system stories only)
  ...designSystemStorybookConfigs,

  // Node scripts and config files (jest.config.js, next.config.mjs, the Playwright static server
  // and the baseline script). They run outside the browser, so they need Node's globals.
  {
    files: ['**/*.config.js', '**/*.config.mjs', 'e2e/**/*.mjs', 'scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        process: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
  },

  // Jest Setup & Test Files
  {
    files: ['jest.setup.js', '**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}'],
    languageOptions: {
      globals: {
        jest: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterAll: 'readonly',
        afterEach: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        console: 'readonly',
        URLSearchParams: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },

  // Custom Rules & Senior Overrides
  // TS Specific Rules
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'react/prop-types': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  // General/Framework Rules
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/no-unescaped-entities': 'error',
      '@next/next/no-img-element': 'warn',
    },
  },

  // No inline styles: styling lives in CSS modules (or Tailwind in legacy code), where tokens and
  // Stylelint reach it. Stories are the exception, and so are the Storybook-only helpers in
  // design-system/docs. Skeleton takes its width and height as props, at run time.
  {
    files: ['src/**/*.tsx'],
    ignores: [
      '**/*.stories.tsx',
      'src/components/design-system/docs/**',
      'src/components/design-system/ui/Skeleton/Skeleton.tsx',
    ],
    rules: {
      'react/forbid-dom-props': [
        'error',
        {
          forbid: [
            {
              propName: 'style',
              message: 'Use a CSS module with design tokens, not an inline style.',
            },
          ],
        },
      ],
      'react/forbid-component-props': [
        'error',
        {
          forbid: [
            {
              propName: 'style',
              message: 'Use a CSS module with design tokens, not an inline style.',
            },
          ],
        },
      ],
    },
  },

  // Design system icons: every icon comes from the Icon registry, the only lucide-react import.
  {
    files: ['src/components/design-system/**/*.{ts,tsx}'],
    ignores: ['src/components/design-system/ui/Icon/icons.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'lucide-react',
              message:
                'Use DS_ICONS and Icon from ui/Icon. Add a missing icon to ui/Icon/icons.tsx, the only lucide-react import.',
            },
            {
              name: 'react',
              importNames: ['forwardRef'],
              message:
                'React 19 passes ref as a prop: function Name({ ref, ...props }: NameProps & { ref?: Ref<HTMLElement> }).',
            },
          ],
        },
      ],
    },
  },

  // The app imports the design system from its entry point only, never a file inside it,
  // so the design system can reorganise its folders without breaking the app.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/design-system/**'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              // Any path into the folder (alias or relative), except the token stylesheet
              // the app loads once in its root layout.
              regex: '(^|/)design-system/(?!tokens/tokens\\.css$).+',
              message: "Import from '@/components/design-system', the design system's entry point.",
            },
          ],
        },
      ],
    },
  },

  // Prettier (must be last)
  prettier,
]);
