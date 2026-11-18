import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { TextField } from '../TextField';
import { Caption } from '../Typography';
import type { ReactNode } from 'react';
import { Button } from '../Button';
import { Link } from '../Link';

/* ---------------------------------------------------------------
 * VisuallyHidden (documentation only)
 *
 * The design system does not wrap this one: components and apps use
 * Radix's `VisuallyHidden` from `@radix-ui/react-visually-hidden`
 * directly. This page explains when and how.
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Components/Utilities/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "`VisuallyHidden` holds words that screen readers read and that nobody sees: the part of a message that sighted people get from the layout, the colour or the icon. The design system does not wrap it. Use Radix's own, from `@radix-ui/react-visually-hidden`: `import { VisuallyHidden } from '@radix-ui/react-visually-hidden'`.\n\n" +
          '### Best Practices\n' +
          '- **Add what the eye already gets:** "Error: " before a field error that is red with an icon, " Oak wall shelf" after a "Remove" button in a list row, " (opens in a new tab)" after a link with an arrow.\n' +
          '- **Keep the visible words first:** add to a name, never replace it, so voice users can still say what they see (WCAG 2.5.3, Label in Name).\n' +
          '- **Announce changes with it:** a `VisuallyHidden` with `role="status"` that is always on the page reads out "Loading products…" or "3 products" without showing a second copy.\n' +
          '- **Never put anything focusable in it:** a link or button nobody can see, but the keyboard can reach, is a trap.\n' +
          '- **Never a local `.visually-hidden` class or inline style:** one implementation, everywhere (AGENTS.md).\n\n' +
          '### Which One Hides What\n' +
          '| Tool | Seen | Heard | Use it for |\n' +
          '| --- | --- | --- | --- |\n' +
          '| `VisuallyHidden` | No | Yes | Words that only assistive technology needs |\n' +
          '| `aria-hidden="true"` | Yes | No | Decoration that would be read twice, such as an icon beside its word |\n' +
          '| `hidden` or `display: none` | No | No | Content that is not there for anyone yet, such as a closed panel |\n' +
          '| `aria-label` | — | Replaces the content | Naming an element that has no visible words, such as an icon-only button |\n\n' +
          '### Key Features\n' +
          '- **Out of sight, not out of the tree** — Radix clips it to a single invisible pixel, so it takes no room and stays in the accessibility tree; it is never `display: none`.\n' +
          '- **A `<span>` by default** — it sits inside text and inline controls; `asChild` puts the hiding styles on your own element.\n' +
          '- **Server-safe** — no state, no effects.\n' +
          '- **Already inside the design system** — the "Error:" prefix of every field, the variant prefix of `Alert` and `Toast`, "(opens in a new tab)" in `Link`, "Page" in `Pagination`, and the loading status of `Skeleton` recipes.',
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/** What is seen above, what a screen reader hears below. */
function SeenAndHeard({ heard, children }: { heard: string; children: ReactNode }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}
    >
      {children}
      <Caption>A screen reader hears: {heard}</Caption>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Default: a name that needs its row
 * --------------------------------------------------------------- */

export const Default: Story = {
  render: () => (
    <SeenAndHeard heard="“Remove Oak wall shelf, button”">
      <Button variant="secondary" appearance="outline" size="sm">
        Remove<VisuallyHidden> Oak wall shelf</VisuallyHidden>
      </Button>
    </SeenAndHeard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A "Remove" button in a list row. Sighted people see which row it is in; a screen reader listing the buttons would hear "Remove, Remove, Remove" without the hidden name. The visible word stays first.',
      },
      source: {
        code: `<Button variant="secondary" appearance="outline" size="sm">
  Remove<VisuallyHidden> {product.name}</VisuallyHidden>
</Button>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Remove Oak wall shelf' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * A prefix the colour gives
 * --------------------------------------------------------------- */

export const ErrorPrefix: Story = {
  name: 'A Prefix the Colour Gives',
  render: () => (
    <SeenAndHeard heard="“Width, edit text, invalid entry, Error: Enter a width above 0 cm.”">
      <div style={{ width: '20rem', maxWidth: '100%' }}>
        <TextField
          label="Width"
          unit="cm"
          defaultValue="0"
          invalid
          error="Enter a width above 0 cm."
        />
      </div>
    </SeenAndHeard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The red text and the icon say "this is an error" to the eye. `TextField` adds a hidden "Error: " before the message, so the field\'s description says it in words.',
      },
      source: {
        code: `<span id={errorId}>
  <VisuallyHidden>Error: </VisuallyHidden>
  {error}
</span>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Width' })).toHaveAccessibleDescription(
      /Error: Enter a width above 0 cm\./,
    );
  },
};

/* ---------------------------------------------------------------
 * What the arrow means
 * --------------------------------------------------------------- */

export const NewTab: Story = {
  name: 'What the Arrow Means',
  render: () => (
    <SeenAndHeard heard="“View at IKEA (opens in a new tab), link”">
      <Link href="#ikea" opensInNewTab>
        View at IKEA
      </Link>
    </SeenAndHeard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The arrow tells the eye the link leaves the site. `Link` with `opensInNewTab` hides the arrow from screen readers and says " (opens in a new tab)" instead.',
      },
      source: {
        code: `<ArrowIcon aria-hidden="true" />
<VisuallyHidden> (opens in a new tab)</VisuallyHidden>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'View at IKEA (opens in a new tab)' }),
    ).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * A status nobody needs to see
 * --------------------------------------------------------------- */

export const LiveStatus: Story = {
  name: 'A Status Nobody Needs to See',
  render: () => (
    <SeenAndHeard heard="“Loading products…”, read as soon as it changes">
      <div style={{ display: 'flex', gap: '0.5rem' }} aria-hidden="true">
        {['first', 'second', 'third'].map((placeholder) => (
          <span
            key={placeholder}
            style={{
              inlineSize: '64px',
              blockSize: '64px',
              borderRadius: 'var(--ds-semantic-radii-surface-md)',
              backgroundColor: 'var(--ds-semantic-colour-background-default-hover)',
            }}
          />
        ))}
      </div>
      <VisuallyHidden role="status">Loading products…</VisuallyHidden>
    </SeenAndHeard>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Grey placeholders tell the eye that products are coming. A hidden status region tells the screen reader, and is updated when they arrive ("16 products"). It stays on the page between messages, so each change is read.',
      },
      source: {
        code: `<VisuallyHidden role="status">{isPending ? 'Loading products…' : \`\${count} products\`}</VisuallyHidden>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading products…');
  },
};
