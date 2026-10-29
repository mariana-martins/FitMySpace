import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { defineConfig } from 'vitest/config';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

import { playwright } from '@vitest/browser-playwright';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      // Only the design system components: the rest of the app is covered by Jest (npm run test:coverage)
      include: ['src/components/design-system/**/*.{ts,tsx}'],
      exclude: [
        '**/*.stories.tsx',
        '**/*.test.tsx',
        '**/*.types.ts', // type-only, no runtime code to cover
        '**/index.tsx', // barrel re-exports
      ],
      // Separate folder, so it does not overwrite the Jest report in ./coverage
      reportsDirectory: './coverage/storybook',
    },
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
