import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Heading, Text } from '../Typography';
import { SHELF_IMAGE } from '../../docs';
import { Card, CardMedia } from './';
import Image from 'next/image';
import { Link } from '../Link';

const meta = {
  title: 'Design System/Components/Display/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    appearance: 'raised',
    padding: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Card` component is a surface that groups content about one thing, such as a product or a room. You compose what goes inside: `CardMedia` for the image, then `Heading`, `Text`, `Badge` and `Link`.\n\n' +
          '### Best Practices\n' +
          '- **One subject per card:** A card holds one item. For a page section, use plain layout instead.\n' +
          '- **Pick the element:** Use `asChild` to render an `<article>` for self-contained items (a product in a grid) or an `<li>` inside a list, so screen readers announce the structure.\n' +
          '- **Whole-card links:** Put a `<Link stretched>` in the title. The whole card becomes the click area, the link name stays the title, and the focus ring wraps the card. Do not nest other links or buttons on top of a stretched link: they would sit under its click area.\n' +
          '- **Images:** Give the image `alt=""` when the title already names the item; describe it only when it adds information.\n' +
          '- **Consistent cards:** Use one appearance and padding per grid.\n\n' +
          '### Key Features\n' +
          '- **2 appearances** — `raised` (a soft shadow, default) and `outline` (a 1px border, for flat or dense layouts).\n' +
          '- **3 paddings** (`sm` 16px, `md` 24px, `lg` 32px), each with a matching gap between the children.\n' +
          '- **`CardMedia`** — a `square`, `landscape` (4:3) or `wide` (16:9) frame that crops `<img>`, Next.js `<Image fill>` or `<video>`, with a placeholder colour while it loads.\n' +
          '- **`asChild`** — Radix `Slot` merges the card styles onto your element.\n' +
          '- **High contrast** — a raised card gains a border in Windows High Contrast, where shadows disappear.\n\n' +
          '### Patterns\n' +
          '- [Product Card](?path=/docs/design-system-patterns-product-card--docs) — a grid of products, each card a list item with a stretched title link.\n' +
          '- [Product Details](?path=/docs/design-system-patterns-product-details--docs) — the top of a product page: name, labels, price, measurements and actions.\n' +
          '- [Store Offers](?path=/docs/design-system-patterns-store-offers--docs) — the same product in several stores, cheapest first, each link naming its store.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    appearance: 'raised',
    padding: 'md',
  },
  argTypes: {
    appearance: {
      control: { type: 'inline-radio' },
      options: ['raised', 'outline'],
      description: 'A soft shadow (`raised`, default) or a 1px border (`outline`).',
    },
    padding: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Inner padding and the gap between children. Defaults to `md`.',
    },
    asChild: {
      control: false,
      description: 'Render as the child element (Radix Slot), e.g. `<article>` or `<li>`.',
    },
  },
  render: (args) => (
    <div style={{ width: '20rem', maxWidth: '100%' }}>
      <Card {...args}>
        <Heading level={3} size="sm">
          Bathroom
        </Heading>
        <Text size="sm" style={{ margin: 0 }}>
          Shelves, caddies and baskets that keep a small bathroom tidy.
        </Text>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Bathroom' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Appearances
 * --------------------------------------------------------------- */

export const AllAppearances: Story = {
  name: 'Raised and Outline',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
      <Card appearance="raised" style={{ width: '14rem' }}>
        <Heading level={3} size="sm">
          Raised
        </Heading>
        <Text size="sm" style={{ margin: 0 }}>
          A soft shadow lifts the card off the page.
        </Text>
      </Card>
      <Card appearance="outline" style={{ width: '14rem' }}>
        <Heading level={3} size="sm">
          Outline
        </Heading>
        <Text size="sm" style={{ margin: 0 }}>
          A 1px border keeps the card flat.
        </Text>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`raised` (default) suits cards on the plain page, such as a product grid. `outline` suits flat or dense layouts, such as cards inside a panel or a settings list, where many shadows would feel heavy.',
      },
      source: {
        code: `<Card appearance="raised">…</Card>\n<Card appearance="outline">…</Card>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Paddings
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  name: 'All Paddings',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1.5rem' }}>
      {(['sm', 'md', 'lg'] as const).map((padding) => (
        <Card key={padding} padding={padding} appearance="outline" style={{ width: '12rem' }}>
          <Heading level={3} size="sm">
            Padding {padding}
          </Heading>
          <Text size="sm" style={{ margin: 0 }}>
            The gap between children grows with the padding.
          </Text>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three paddings: `sm` (16px, gap 12px) for compact cards in dense grids, `md` (24px, gap 16px, default) for most cards, and `lg` (32px, gap 24px) for a featured card.',
      },
      source: {
        code: `<Card padding="sm">…</Card>\n<Card padding="md">…</Card>\n<Card padding="lg">…</Card>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Media
 * --------------------------------------------------------------- */

export const WithMedia: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '1.5rem' }}>
      {(['square', 'landscape', 'wide'] as const).map((aspectRatio) => (
        <Card key={aspectRatio} padding="sm" style={{ width: '12rem' }}>
          <CardMedia aspectRatio={aspectRatio}>
            <Image src={SHELF_IMAGE} alt="" fill unoptimized sizes="15rem" />
          </CardMedia>
          <Text size="sm" style={{ margin: 0 }}>
            {aspectRatio}
          </Text>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`CardMedia` frames the image in a `square`, `landscape` (4:3, default) or `wide` (16:9) ratio and crops it to fill, so cards in a grid line up whatever the photo size. With Next.js, pass `<Image fill sizes="…" />` as the child.',
      },
      source: {
        code: `<Card padding="sm">\n  <CardMedia aspectRatio="square">\n    <Image src={product.image} alt="" fill sizes="(max-width: 768px) 100vw, 33vw" />\n  </CardMedia>\n  …\n</Card>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

function LinkedCard({ title, className }: { title: string; className?: string }) {
  return (
    <Card asChild className={className} style={{ width: '14rem' }}>
      <article>
        <Heading level={3} size="sm">
          <Link href={`#${title.toLowerCase()}`} appearance="standalone" stretched>
            {title}
          </Link>
        </Heading>
        <Text size="sm" style={{ margin: 0 }}>
          The whole card opens the link.
        </Text>
      </article>
    </Card>
  );
}

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', padding: '0.5rem' }}>
      <LinkedCard title="Default" />
      <LinkedCard title="Hover" className="pseudo-hover" />
      <LinkedCard title="Focus" className="pseudo-focus-visible" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A card with a `<Link stretched>` in its title, shown with the `storybook-addon-pseudo-states` plugin:\n\n' +
          '- **Hover** — anywhere on the card: the shadow deepens and the title gains the standalone underline.\n' +
          '- **Focus** — keyboard focus on the title link draws the sage focus ring around the whole card, with its rounded corners.\n\n' +
          'A card without a stretched link is static and never reacts to the pointer.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover', '.pseudo-hover a'],
      focusVisible: ['.pseudo-focus-visible a'],
    },
  },
};
