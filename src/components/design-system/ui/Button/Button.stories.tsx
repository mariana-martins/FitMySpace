import { Plus, Trash2, ArrowRight, Download, Star } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Button } from './';

const meta = {
  title: 'Design System/Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    variant: 'primary',
    appearance: 'fill',
    size: 'md',
    children: 'Button',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Button` component is the primary interactive element used for actions and links. It is fully accessible and driven by our design system\'s tier-3 component tokens.\n\n' +
          '### Best Practices\n' +
          '- **Primary Actions:** Use the `primary` variant for the main action on a page. Only one primary button should be visible at a time.\n' +
          '- **Secondary Actions:** Use `secondary` or `outline` appearances for alternative actions.\n' +
          '- **Destructive Actions:** Use the `error` variant for irreversible actions like deletions.\n' +
          '- **Icon-only Buttons:** Always provide an `aria-label` when using a button without text to ensure screen reader support.\n\n' +
          '### Key Features\n' +
          '- **6 color variants** (`primary`, `secondary`, `error`, `success`, `warning`, `information`) × **2 appearances** (`fill`, `outline`).\n' +
          '- **4 sizes** (`xs`, `sm`, `md`, `lg`) with token-driven padding, font, gap, and icon sizing.\n' +
          '- **Icon support** — leading or trailing icons via the `icon` prop.\n' +
          '- **Icon-only mode** — TypeScript enforces `aria-label` when `children` is omitted.\n' +
          '- **`asChild` pattern** — renders as any child element (e.g. `<a>`, Next.js `<Link>`) via Radix `Slot`.\n' +
          '- **Keyboard accessible** — `:focus-visible` ring, native `<button>` semantics, and `scale(0.96)` on press.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    appearance: 'fill',
    size: 'md',
    disabled: false,
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'error', 'success', 'warning', 'information'],
      description: 'The color intent of the button.',
    },
    appearance: {
      control: { type: 'select' },
      options: ['fill', 'outline'],
      description: 'The visual style. Use `fill` for emphasis and `outline` for secondary actions.',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'The size of the button. Defaults to `md`.',
    },
    iconPosition: {
      control: { type: 'select' },
      options: ['start', 'end'],
      description: 'Where to place the icon relative to the text.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Button' });
    await expect(button).toBeInTheDocument();
    await expect(button).toHaveAttribute('type', 'button');
  },
};

/* ---------------------------------------------------------------
 * All variants — Fill
 * --------------------------------------------------------------- */

export const FillVariants: Story = {
  name: 'All Variants (Fill)',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button variant="primary" size="md" appearance="fill">Primary</Button>
      <Button variant="secondary" size="md" appearance="fill">Secondary</Button>
      <Button variant="error" size="md" appearance="fill">Error</Button>
      <Button variant="success" size="md" appearance="fill">Success</Button>
      <Button variant="warning" size="md" appearance="fill">Warning</Button>
      <Button variant="information" size="md" appearance="fill">Information</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Fill buttons are solid and provide high emphasis. They are ideal for primary actions on a page.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Primary' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Information' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * All variants — Outline
 * --------------------------------------------------------------- */

export const OutlineVariants: Story = {
  name: 'All Variants (Outline)',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button variant="primary" size="md" appearance="outline">Primary</Button>
      <Button variant="secondary" size="md" appearance="outline">Secondary</Button>
      <Button variant="error" size="md" appearance="outline">Error</Button>
      <Button variant="success" size="md" appearance="outline">Success</Button>
      <Button variant="warning" size="md" appearance="outline">Warning</Button>
      <Button variant="information" size="md" appearance="outline">Information</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Outline buttons have a transparent background and visible border. They are perfect for secondary actions that shouldn\'t distract from the primary focus.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button variant='primary' size="lg" appearance='fill'>Large</Button>
      <Button variant='primary' size="md" appearance='fill'>Medium</Button>
      <Button variant='primary' size="sm" appearance='fill'>Small</Button>
      <Button variant='primary' size="xs" appearance='fill'>Extra Small</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'The button comes in 4 sizes. Size `md` is the default standard size. Use `lg` for prominent calls to action, and `sm` or `xs` for dense layouts.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Large' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Extra Small' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button variant='primary' appearance='fill' size='md' icon={<Plus />}>Add Item</Button>
      <Button variant='secondary' appearance='fill' size='md' icon={<Download />}>Download</Button>
      <Button variant='error' appearance='fill' size='md' icon={<Trash2 />}>Delete</Button>
      <Button variant='warning' appearance='fill' size='md' icon={<ArrowRight />} iconPosition="end">Continue</Button>
      <Button variant='information' appearance='fill' size='md' icon={<Star />} iconPosition="end" >Favorite</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icons can be added to the start (default) or end of the button text. The gap spacing and icon size are automatically adjusted based on the button\'s size token.',
      },
      source: {
        code: `<Button icon={<Plus />}>Add Item</Button>\n<Button icon={<ArrowRight />} iconPosition="end">Continue</Button>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Icon-only
 * --------------------------------------------------------------- */

export const IconOnly: Story = {
  name: 'Icon Only',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button variant='primary' appearance='fill' size='md' icon={<Plus />} aria-label="Add item" />
      <Button variant='error' appearance='fill' size='md' icon={<Trash2 />} aria-label="Delete item" />
      <Button variant='secondary' appearance='fill' size='sm' icon={<Download />} aria-label="Download file" />
      <Button variant='warning' appearance='fill' size='xs' icon={<Star />} aria-label="Favorite" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons **require** the `aria-label` prop — TypeScript will error if it is omitted. This ensures screen readers always announce the button\'s purpose. They also adjust padding to remain perfectly square with an optimal hit area.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const addBtn = canvas.getByRole('button', { name: 'Add item' });
    await expect(addBtn).toBeInTheDocument();
    await expect(addBtn).toHaveAttribute('aria-label', 'Add item');
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button disabled variant='primary' appearance='fill' size='md'>Primary</Button>
      <Button disabled variant="secondary" appearance='fill' size='md'>Secondary</Button>
      <Button disabled variant="error" appearance='fill' size='md'>Error</Button>
      <Button disabled variant='primary' appearance='fill' icon={<Plus />} size='md'>With Icon</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A standard disabled state that removes pointer events and adjusts colors according to the design system semantic tokens.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Button variant="primary" appearance='fill' size='md'>Default</Button>
      <Button variant="primary" appearance='fill' size='md' className="pseudo-hover">Hover</Button>
      <Button variant="primary" appearance='fill' size='md' className="pseudo-active">Active</Button>
      <Button variant="primary" appearance='fill' size='md' className="pseudo-focus-visible">Focus Visible</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the different interactive states of the button using the `storybook-addon-pseudo-states` plugin. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      active: ['.pseudo-active'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * asChild
 * --------------------------------------------------------------- */

export const AsChild: Story = {
  name: 'asChild (Link)',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button asChild variant="information" appearance="fill" size="md">
        <a href="https://example.com">Visit Example</a>
      </Button>
      <Button
        asChild
        variant="secondary"
        appearance="outline"
        size="md"
        icon={<ArrowRight />}
        iconPosition="end"
      >
        <a href="https://example.com/docs">Documentation</a>
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `asChild` prop uses Radix `Slot` to render the Button as its child element (e.g. `<a>` or Next.js `<Link>`). ' +
          'All button styles and classes are merged onto the child seamlessly without adding an extra wrapper node.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'Visit Example' });
    await expect(link).toBeInTheDocument();
    await expect(link.tagName).toBe('A');
  },
};
