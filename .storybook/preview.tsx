import type { Preview } from '@storybook/nextjs-vite';

/* Design System tokens (CSS custom properties) */
import '../src/components/design-system/tokens/tokens.css';

/* Tailwind base styles */
import '../src/app/globals.css';

/* DM Sans — scoped to Storybook only (main app uses Inter) */
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
