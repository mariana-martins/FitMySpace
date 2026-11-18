import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../Typography';
import type { ReactNode } from 'react';
import { Link } from '../Link';
import { SkipLink } from './';

/* ---------------------------------------------------------------
 * SkipLink
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Components/Navigation/SkipLink',
  component: SkipLink,
  tags: ['autodocs'],
  args: {
    targetId: 'main-content',
    children: 'Skip to content',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `SkipLink` is the first thing a keyboard reaches on a page: a link straight to the main content, out of sight until it takes the focus. One press of Enter passes the header and its navigation, which a keyboard user would otherwise tab through on every page (WCAG 2.4.1, Bypass Blocks).\n\n' +
          '### Best Practices\n' +
          '- **First in the body:** render it before the header, in the root layout, so it is the first Tab stop of every page.\n' +
          '- **Point at the main content:** `<main id="main-content">` is the default target. Give the target `tabIndex={-1}`: following the link moves the screen reader there, and the next Tab continues from the content instead of the header, in every browser, Safari included.\n' +
          '- **Keep the words plain:** "Skip to content". Use `targetId` and other words only for a page whose main job is lower down, such as "Skip to results".\n' +
          '- **Never hide it for good:** it is out of sight, not gone. `display: none` or `aria-hidden` would remove it for the people it exists for.\n\n' +
          '### Key Features\n' +
          '- **Shown on focus** — fixed at the top start of the window, it slides in when focused, over the header, and leaves when the focus moves on.\n' +
          '- **No script** — a plain fragment link, so it renders on the server and works before JavaScript loads.\n' +
          '- **Brand fill** — white on sage, with the shared focus ring and the floating shadow; a drawn edge in Windows High Contrast.\n' +
          '- **Reduced motion** — the slide stops when the reader asks for less motion.\n\n' +
          '### Patterns\n' +
          '- [Page Layout](?path=/docs/design-system-patterns-page-layout--docs) — the skip link first, then the header, `<main id="main-content">` and the footer.',
      },
      story: { height: '120px' },
    },
  },
} satisfies Meta<typeof SkipLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A small page: the link first, then a header with links, then the main content. */
function SamplePage({
  targetId = 'main-content',
  skipLink,
}: {
  targetId?: string;
  skipLink: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '32rem',
        maxWidth: '100%',
      }}
    >
      {skipLink}
      <nav aria-label="Sample navigation" style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="#recent" appearance="standalone">
          Recent arrivals
        </Link>
        <Link href="#rooms" appearance="standalone">
          Rooms
        </Link>
        <Link href="#about" appearance="standalone">
          About us
        </Link>
      </nav>
      {/* A div, not <main>: the docs page shows several of these at once. */}
      <div id={targetId} tabIndex={-1}>
        <Heading level={2} size="sm" style={{ margin: 0 }}>
          Bathroom storage
        </Heading>
        <Text as="p" size="sm" style={{ margin: 0 }}>
          Click in this frame, then press Tab: the skip link slides in before the navigation.
        </Text>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  argTypes: {
    targetId: {
      control: { type: 'text' },
      description: 'The id of the element the link skips to. Defaults to `main-content`.',
    },
    children: {
      control: { type: 'text' },
      description: 'The words of the link. Defaults to "Skip to content".',
    },
  },
  render: (args) => <SamplePage targetId={args.targetId} skipLink={<SkipLink {...args} />} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The link is in the page but out of sight: click the frame and press Tab to bring it in.',
      },
      source: {
        code: `// src/app/layout.tsx
<body>
  <SkipLink />
  <SiteHeader />
  <main id="main-content" tabIndex={-1}>{children}</main>
  <Footer />
</body>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const skipLink = canvas.getByRole('link', { name: 'Skip to content' });
    await userEvent.tab();
    await expect(skipLink).toHaveFocus();
    // Focused, it slides back into view.
    await waitFor(() => expect(getComputedStyle(skipLink).transform).toBe('none'));
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <SamplePage skipLink={<SkipLink className="pseudo-focus pseudo-focus-visible" />} />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The link as a keyboard user sees it, shown with the `storybook-addon-pseudo-states` plugin: in the top corner, over the page, in the brand fill with the sage focus ring.',
      },
    },
    pseudo: {
      focus: ['.pseudo-focus'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Another target (recipe)
 * --------------------------------------------------------------- */

export const AnotherTarget: Story = {
  name: 'Another Target (A11y)',
  render: () => (
    <SamplePage
      targetId="results"
      skipLink={<SkipLink targetId="results">Skip to results</SkipLink>}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A search page whose reason to exist is its results: the link skips the header and the filters too, and says so.',
      },
      source: {
        code: `<SkipLink targetId="results">Skip to results</SkipLink>\n…\n<section id="results" tabIndex={-1}>…</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Skip to results' })).toHaveAttribute(
      'href',
      '#results',
    );
  },
};
