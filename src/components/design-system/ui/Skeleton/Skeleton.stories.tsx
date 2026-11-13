import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Card } from '../Card';
import { Skeleton } from './';

const meta = {
  title: 'Design System/Components/Display/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  args: {
    shape: 'text',
    size: 'md',
    lines: 1,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Skeleton` component is a softly pulsing placeholder that holds the shape of content while it loads, so the page does not jump when the content arrives.\n\n' +
          '### Best Practices\n' +
          '- **Match the layout:** Mirror the real content: an image block, a title line, two lines of text. A skeleton that looks nothing like the result makes the page jump anyway.\n' +
          '- **Announce the loading on the container:** Skeletons are hidden from screen readers. Set `aria-busy="true"` on the region that is loading and add a visually hidden `role="status"` message such as "Loading products…"; remove both when the content arrives.\n' +
          '- **Only for short waits:** Use skeletons for content that arrives in a few seconds. For long tasks, show progress or a message.\n' +
          '- **Not for actions:** Do not use a skeleton for a button or field people can already use.\n\n' +
          '### Key Features\n' +
          '- **3 shapes** — `text` (one or more lines, sized like `Text` sm / md / lg), `rectangle` (images and blocks) and `circle` (avatars and icons).\n' +
          '- **Text rhythm** — a text bar is one line tall at the size it replaces, so stacked lines keep the spacing of real text; the last of several lines is shorter.\n' +
          '- **Calm motion** — a slow pulse between two pale neutrals; it stops with `prefers-reduced-motion`.\n' +
          '- **Hidden from assistive technology** — always `aria-hidden`; Windows High Contrast keeps an outline.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    shape: 'text',
    size: 'md',
    lines: 3,
    width: '20rem',
  },
  argTypes: {
    shape: {
      control: { type: 'inline-radio' },
      options: ['text', 'rectangle', 'circle'],
      description:
        '`text` (default) for lines of text, `rectangle` for images and blocks, `circle` for avatars.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Text shape only: the `Text` size it stands in for. Defaults to `md`.',
    },
    lines: {
      control: { type: 'number', min: 1, max: 6 },
      description: 'Text shape only: the number of lines. The last of several lines is shorter.',
    },
    width: {
      control: 'text',
      description:
        'Width, e.g. `75%` or `12rem`. Text and rectangles fill their container; a circle is 48px.',
    },
    height: {
      control: 'text',
      description:
        'Height of a rectangle, e.g. `8rem`. Without it, a rectangle keeps a 4:3 ratio. A circle takes its width as its height.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Shapes
 * --------------------------------------------------------------- */

export const AllShapes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <Skeleton shape="circle" width="3rem" />
      <Skeleton shape="rectangle" width="8rem" height="6rem" />
      <Skeleton width="12rem" lines={3} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three shapes: `circle` for an avatar or icon (48px by default; its width sets its height), `rectangle` for an image or block (4:3 by default, or the `height` you give it), and `text` for lines of text.',
      },
      source: {
        code: `<Skeleton shape="circle" width="3rem" />\n<Skeleton shape="rectangle" width="8rem" height="6rem" />\n<Skeleton width="12rem" lines={3} />`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Text sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '20rem' }}>
      <Skeleton size="lg" lines={2} />
      <Skeleton size="md" lines={2} />
      <Skeleton size="sm" lines={2} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A text skeleton matches the `Text` size it replaces: `lg` (18px), `md` (16px, default) and `sm` (14px). Each bar is as tall as the letters and each line as tall as a line of text, so the content arrives without shifting.',
      },
      source: {
        code: `<Skeleton size="lg" lines={2} />\n<Skeleton size="md" lines={2} />\n<Skeleton size="sm" lines={2} />`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Loading card (recipe)
 * --------------------------------------------------------------- */

export const LoadingCards: Story = {
  name: 'Loading Product Cards (A11y)',
  render: () => (
    <section aria-label="Products" aria-busy="true">
      <VisuallyHidden role="status">Loading products…</VisuallyHidden>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
          gap: '1.5rem',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {['first', 'second', 'third'].map((placeholder) => (
          <Card key={placeholder} asChild padding="sm">
            <li>
              <Skeleton shape="rectangle" style={{ aspectRatio: '1' }} />
              <Skeleton size="md" width="75%" />
              <Skeleton size="sm" lines={2} />
            </li>
          </Card>
        ))}
      </ul>
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a loading product grid: `Card`s with the same layout as the real ones. The skeletons are hidden from screen readers; the section is `aria-busy="true"` and a visually hidden `role="status"` says "Loading products…". When the products arrive, render them and drop both.',
      },
      source: {
        code: `<section aria-label="Products" aria-busy="true">\n  <VisuallyHidden role="status">Loading products…</VisuallyHidden>\n  <ul>\n    <Card asChild padding="sm">\n      <li>\n        <Skeleton shape="rectangle" style={{ aspectRatio: '1' }} />\n        <Skeleton width="75%" />\n        <Skeleton size="sm" lines={2} />\n      </li>\n    </Card>\n  </ul>\n</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Products' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading products…');
  },
};
