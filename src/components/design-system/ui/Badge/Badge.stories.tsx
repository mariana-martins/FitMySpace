import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './';

const meta = {
  title: 'Design System/Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'brand',
    size: 'md',
    shape: 'rounded',
    children: 'Badge',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Badge` component is a non-interactive presentational element used to display statuses, labels, categories, or numeric counters. It is driven by our design system\'s tier-3 component tokens.\n\n' +
          '### Best Practices\n' +
          '- **Static Labels:** For static categories or tags (e.g., "Admin", "Pro"), use the badge as a standard visual indicator without extra ARIA roles.\n' +
          '- **Dynamic Statuses & Counters:** When representing dynamic information like unread notification counts or live status updates, apply `role="status"` so assistive technologies announce updates politely.\n' +
          '- **Color Contrast:** All 6 color variants strictly meet WCAG AA (4.5:1) contrast ratios.\n\n' +
          '### Key Features\n' +
          '- **6 color variants** (`brand`, `subtle`, `success`, `error`, `warning`, `information`).\n' +
          '- **4 sizes** (`xs`, `sm`, `md`, `lg`) with token-driven padding, font sizes, and line heights.\n' +
          '- **2 shapes** (`rounded`, `square`). Defaults to `rounded`.\n' +
          '- **Semantic neutrality** — renders a standard `<span>` element by default.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    children: 'Badge',
    variant: 'brand',
    size: 'md',
    shape: 'rounded',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['brand', 'subtle', 'success', 'error', 'warning', 'information'],
      description: 'The semantic color intent of the badge.',
    },
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'The size of the badge. Defaults to `md`.',
    },
    shape: {
      control: { type: 'select' },
      options: ['rounded', 'square'],
      description: 'The shape of the badge. Defaults to `rounded`.',
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
    const badge = canvas.getByText('Badge');
    await expect(badge).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * All Variants
 * --------------------------------------------------------------- */

export const AllVariants: Story = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Badge variant="brand" size="md">Brand</Badge>
      <Badge variant="subtle" size="md">Subtle</Badge>
      <Badge variant="success" size="md">Success</Badge>
      <Badge variant="error" size="md">Error</Badge>
      <Badge variant="warning" size="md">Warning</Badge>
      <Badge variant="information" size="md">Information</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays all 6 semantic color variants available in the Design System.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * All Sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
      <Badge variant="brand" size="xs">99+</Badge>
      <Badge variant="brand" size="sm">Small</Badge>
      <Badge variant="brand" size="md">Medium</Badge>
      <Badge variant="brand" size="lg">Large Banner</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays the 4 sizing options (`xs`, `sm`, `md`, `lg`). Notice how `xs` is optimized for compact numeric counters.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * All Shapes
 * --------------------------------------------------------------- */

export const AllShapes: Story = {
  name: 'All Shapes',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Badge variant="brand" size="md" shape="rounded">Rounded (Default)</Badge>
      <Badge variant="brand" size="md" shape="square">Square</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Displays the 2 shape options (`rounded` vs `square`).',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Accessibility — Dynamic Status Badge
 * --------------------------------------------------------------- */

export const DynamicStatusBadge: Story = {
  name: 'Accessibility: Dynamic Status Badge',
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Badge
        variant="error"
        size="sm"
        role="status"
        aria-label="3 unread notifications"
      >
        3 new
      </Badge>
      <Badge
        variant="success"
        size="md"
        role="status"
        aria-label="System status: Operational"
      >
        Operational
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When badges represent dynamic notifications, counters, or real-time statuses, add `role="status"` and `aria-label`. ' +
          'This establishes an assistive live region with implicit `aria-live="polite"`, announcing updates without interrupting the user.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const statusBadge = canvas.getByText('3 new');
    await expect(statusBadge).toHaveAttribute('role', 'status');
    await expect(statusBadge).toHaveAttribute('aria-label', '3 unread notifications');
  },
};
