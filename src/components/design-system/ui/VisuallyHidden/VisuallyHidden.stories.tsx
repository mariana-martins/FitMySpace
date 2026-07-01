import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { VisuallyHidden } from './';

const meta = {
  title: 'Design System/Components/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `VisuallyHidden` component renders content that is **invisible on screen** but fully **accessible to assistive technologies** such as screen readers.\n\n' +
          'It works by applying a set of CSS rules (absolute positioning, zero dimensions, clipping) that remove the element from visual flow without removing it from the accessibility tree.\n\n' +
          '### When to Use\n' +
          '- **Icon-only buttons or links** — wrap a descriptive label inside `VisuallyHidden` so screen readers can announce the purpose.\n' +
          '- **Supplementary context** — add extra information for assistive tech users that would be redundant visually.\n' +
          '- **Skip navigation links** — the hidden text becomes visible on focus for keyboard users.\n\n' +
          '### Key Details\n' +
          '- Renders a `<span>` by default.\n' +
          '- Forwards `ref` and all native HTML attributes.\n' +
          '- Built on top of [Radix UI VisuallyHidden](https://www.radix-ui.com/primitives/docs/utilities/visually-hidden).',
      },
    },
  },
} satisfies Meta<typeof VisuallyHidden>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    children: 'This text is visually hidden but accessible to screen readers',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The default usage. The text below is present in the DOM and announced by screen readers, but visually invisible. ' +
          'Inspect the rendered HTML to confirm it is there.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hiddenText = canvas.getByText(
      'This text is visually hidden but accessible to screen readers',
    );
    await expect(hiddenText).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Practical Example — Icon Button with Hidden Label
 * --------------------------------------------------------------- */

export const IconButtonWithLabel: Story = {
  name: 'Practical: Icon Button with Hidden Label',
  render: () => (
    <button
      type="button"
      aria-label="Close dialog"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 8,
        border: '1px solid #ccc',
        background: '#f5f5f5',
        cursor: 'pointer',
        fontSize: 20,
      }}
    >
      <span aria-hidden="true">✕</span>
      <VisuallyHidden>Close dialog</VisuallyHidden>
    </button>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A common pattern: an icon-only button uses `VisuallyHidden` to provide an accessible label. ' +
          'The "✕" icon is marked `aria-hidden="true"` so screen readers only announce the hidden text: **"Close dialog"**.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hiddenLabel = canvas.getByText('Close dialog');
    await expect(hiddenLabel).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Practical Example — Card with Hidden Context
 * --------------------------------------------------------------- */

export const CardWithHiddenContext: Story = {
  name: 'Practical: Card with Hidden Context',
  render: () => (
    <article
      style={{
        padding: 24,
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        maxWidth: 320,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h3 style={{ margin: '0 0 8px' }}>Annual Report 2025</h3>
      <p style={{ margin: '0 0 16px', color: '#666' }}>
        View the full financial summary and growth metrics.
      </p>
      <a
        href="#download"
        style={{
          color: '#0066cc',
          textDecoration: 'underline',
          fontWeight: 500,
        }}
      >
        Download
        <VisuallyHidden> Annual Report 2025 (PDF, 2.4 MB)</VisuallyHidden>
      </a>
    </article>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A card with a generic "Download" link. `VisuallyHidden` adds context — screen readers announce ' +
          '**"Download Annual Report 2025 (PDF, 2.4 MB)"** instead of just "Download", making it meaningful out of context.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hiddenContext = canvas.getByText(
      /Annual Report 2025 \(PDF, 2\.4 MB\)/,
    );
    await expect(hiddenContext).toBeInTheDocument();
  },
};
