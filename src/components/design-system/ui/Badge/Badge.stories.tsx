import { CircleAlert, Clock, PackageCheck, Sparkles } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Heading, Text } from '../Typography';
import { Badge } from './';

import type { BadgeAppearance, BadgeVariant } from './';

const meta = {
  title: 'Design System/Components/Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'In stock',
    variant: 'success',
    appearance: 'soft',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Badge` component is a short, static label for a status or category, such as "In stock", "Bathroom" or "New". It renders a `<span>` and is never interactive.\n\n' +
          '### Best Practices\n' +
          '- **Short text:** One or two words. A badge does not wrap; long text belongs in a sentence.\n' +
          '- **Text carries the meaning:** Colour only reinforces it. "Out of stock" in red, never a red dot on its own.\n' +
          '- **Soft by default:** Use `soft` for categories, quiet statuses and any badge that repeats across cards. Keep `fill` for the one label per card or group that must stand out (see All Variants).\n' +
          '- **Not a button:** For something people click to filter or remove, use a button (a future Chip), not a Badge.\n' +
          '- **Counts need context:** A number such as "3" means nothing out of context. Write "3 new" or add visually hidden text.\n\n' +
          '### Key Features\n' +
          '- **6 variants** with the same names as Button, each in a `fill` and a `soft` appearance, all at 4.5:1 text contrast.\n' +
          '- **2 sizes** (`sm` 20px, `md` 24px) and **2 shapes** (`pill`, `rounded`).\n' +
          '- **Decorative icon** — `icon` is hidden from screen readers; the text names the badge.\n' +
          '- **High contrast** — in Windows High Contrast the fill disappears, so an outline keeps the shape visible.',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const VARIANTS: BadgeVariant[] = [
  'primary',
  'secondary',
  'error',
  'success',
  'warning',
  'information',
];
const APPEARANCES: BadgeAppearance[] = ['soft', 'fill'];

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    children: 'In stock',
    variant: 'success',
    appearance: 'soft',
    size: 'md',
    shape: 'pill',
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The visible text. Keep it to one or two words.',
    },
    variant: {
      control: { type: 'select' },
      options: VARIANTS,
      description: 'Visual color variant, the same names as Button.',
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: APPEARANCES,
      description: 'A soft pale tint for quiet labels, or a solid fill for emphasis.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'The size of the badge: 20px (`sm`) or 24px (`md`) tall.',
    },
    shape: {
      control: { type: 'inline-radio' },
      options: ['pill', 'rounded'],
      description: 'Fully rounded ends (`pill`, default) or slightly rounded corners.',
    },
    icon: {
      control: false,
      description: 'Decorative icon before the text. Hidden from screen readers.',
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
    await expect(canvas.getByText('In stock')).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * All variants
 * --------------------------------------------------------------- */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {APPEARANCES.map((appearance) => (
        <div key={appearance} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant} appearance={appearance} size="md">
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Six variants in the `soft` (top) and `fill` (bottom) appearances. `secondary` is the neutral choice for categories such as a store name; the utility variants carry a status.\n\n' +
          '**When to use each appearance**\n\n' +
          '- **`soft` (the default choice)** — categories and quiet statuses: the room, the store, "In stock". Use it whenever badges repeat, such as on every card in a product grid, so they inform without competing with each other or with the main action.\n' +
          '- **`fill`** — the one label that must catch the eye before anything else in its group, such as "New" on a product card. Use at most one `fill` badge per card or group; next to a `primary` fill Button, prefer `soft`, so the badge does not read as a second button.\n\n' +
          'A quick test: if every badge in the group were `fill`, keep `fill` only on the one people must notice first, and make the rest `soft`. Give the same status the same appearance on every page, so people learn it.',
      },
      source: {
        code: `<Badge variant="success" appearance="soft" size="md">Success</Badge>\n<Badge variant="success" appearance="fill" size="md">Success</Badge>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * All sizes and shapes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes and Shapes',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge variant="primary" appearance="soft" size="md">
          Medium pill
        </Badge>
        <Badge variant="primary" appearance="soft" size="sm">
          Small pill
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge variant="secondary" appearance="soft" size="md" shape="rounded">
          Medium rounded
        </Badge>
        <Badge variant="secondary" appearance="soft" size="sm" shape="rounded">
          Small rounded
        </Badge>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Size and shape are set separately, so any size works with any shape.\n\n' +
          '- **`md`** — 24px tall with 14px text (`Label` md). Use it for a status that sits next to body text, such as "In stock" under a product description.\n' +
          '- **`sm`** — 20px tall with 12px text (`Label` sm). Use it in dense places, such as the row of labels at the top of a product card.\n\n' +
          'Both heights are minimums: the badge grows with the text when people enlarge it.\n\n' +
          '- **`pill`** (default) — fully rounded ends. Use it for statuses and categories, such as "New" or "Bathroom".\n' +
          '- **`rounded`** — 4px corners. It reads as a tag, such as a store name on a product card.\n\n' +
          'Give each shape one meaning across the page, so people learn what it stands for.',
      },
      source: {
        code: `<Badge variant="primary" appearance="soft" size="md">Medium pill</Badge>\n<Badge variant="secondary" appearance="soft" size="sm" shape="rounded">Small rounded</Badge>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
      <Badge variant="success" appearance="soft" size="md" icon={<PackageCheck />}>
        In stock
      </Badge>
      <Badge variant="warning" appearance="soft" size="md" icon={<Clock />}>
        Ships in 2 weeks
      </Badge>
      <Badge variant="error" appearance="soft" size="md" icon={<CircleAlert />}>
        Out of stock
      </Badge>
      <Badge variant="primary" appearance="fill" size="sm" icon={<Sparkles />}>
        New
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An icon before the text helps scanning. It is decorative and hidden from screen readers, so the text alone must name the status.',
      },
      source: {
        code: `<Badge variant="success" appearance="soft" size="md" icon={<PackageCheck />}>\n  In stock\n</Badge>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inStock = canvas.getByText('In stock');
    await expect(inStock.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  },
};

/* ---------------------------------------------------------------
 * Product card labels (recipe)
 * --------------------------------------------------------------- */

export const ProductCardLabels: Story = {
  name: 'Product Card Labels (A11y)',
  render: () => (
    <article
      aria-labelledby="badge-recipe-title"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        maxWidth: '18rem',
        padding: '1.5rem',
        borderRadius: 'var(--ds-semantic-radii-container-md)',
        boxShadow: 'var(--ds-semantic-shadow-card-base)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Badge variant="primary" appearance="soft" size="sm">
          Bathroom
        </Badge>
        <Badge variant="secondary" appearance="soft" size="sm" shape="rounded">
          IKEA
        </Badge>
      </div>
      <Heading level={3} size="sm" id="badge-recipe-title">
        Bamboo shower caddy
      </Heading>
      <Text size="sm" style={{ margin: 0 }}>
        Three shelves that hold shampoo, soap and a razor.
      </Text>
      <div>
        <Badge variant="success" appearance="soft" size="md" icon={<PackageCheck />}>
          In stock
        </Badge>
      </div>
    </article>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a product card: soft badges for the room and the store, and a status badge whose text says what the colour means. The badges are plain text inside the card, read in order with the title.',
      },
      source: {
        code: `<Badge variant="primary" appearance="soft" size="sm">Bathroom</Badge>\n<Badge variant="secondary" appearance="soft" size="sm" shape="rounded">IKEA</Badge>\n<Heading level={3} size="sm">Bamboo shower caddy</Heading>\n<Badge variant="success" appearance="soft" size="md" icon={<PackageCheck />}>In stock</Badge>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole('article', { name: 'Bamboo shower caddy' });
    await expect(card).toHaveTextContent('Bathroom');
    await expect(within(card).queryByRole('button')).not.toBeInTheDocument();
  },
};
