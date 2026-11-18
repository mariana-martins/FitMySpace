import type { Preview } from '@storybook/nextjs-vite';
import type { CSSProperties } from 'react';

/* Design System tokens (CSS custom properties) */
import '../src/components/design-system/tokens/tokens.css';

/* App global base styles */
import '../src/app/globals.css';

/* DM Sans — scoped to Storybook only (main app uses Inter) */
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/400.css';

/*
 * Every story sits in the middle of its canvas, on both axes. The decorator centres it
 * rather than `layout: 'centered'`, because Storybook's centred layout shrinks the root to
 * its content, and a story that should fill the width (a product grid) would collapse to
 * one column. Here the box spans the canvas: a narrow story is centred in it, and a story
 * that asks for `width: 100%` gets the whole width. On its own page (story view) the box is
 * as tall as the window, minus the canvas padding; on a docs page it follows its content.
 * Pages that fill the frame (Introduction, Foundation, Patterns overview) set
 * `layout: 'fullscreen'` and are left alone.
 */
const STORY_CANVAS_PADDING = '2rem';

function centredCanvasStyle(viewMode: string): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: viewMode === 'story' ? `calc(100vh - ${STORY_CANVAS_PADDING})` : undefined,
  };
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const fillsTheFrame = context.parameters.layout === 'fullscreen';

      return (
        <div
          style={{
            color: 'var(--ds-semantic-colour-text-default-base)',
            ...(fillsTheFrame ? {} : centredCanvasStyle(context.viewMode)),
          }}
        >
          <Story />
        </div>
      );
    },
  ],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          'Design System',
          [
            'Introduction',
            'Foundation',
            [
              'Colour',
              'Typography',
              'Spacing',
              'Size',
              'Radii',
              'Border Width',
              'Shadow',
              'Layer',
              'Focus',
              'Motion',
            ],
            'Components',
            [
              'Actions',
              'Forms',
              'Navigation',
              'Display',
              'Feedback',
              'Overlays',
              'Typography',
              'Utilities',
            ],
            'Patterns',
            ['Overview'],
            'Changelog',
          ],
        ],
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error',
    },
  },
};

export default preview;
