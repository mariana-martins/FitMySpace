import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Heading, Text } from '../Typography';
import { Card, CardMedia } from './';
import { Badge } from '../Badge';
import Image from 'next/image';
import { Link } from '../Link';

/** A drawn shelf, inlined so the stories never load an image from the network. */
const SHELF_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#e3efe9"/>' +
    '<rect x="90" y="70" width="220" height="12" rx="4" fill="#5b8a72"/>' +
    '<rect x="90" y="150" width="220" height="12" rx="4" fill="#5b8a72"/>' +
    '<rect x="90" y="230" width="220" height="12" rx="4" fill="#5b8a72"/>' +
    '<rect x="110" y="30" width="36" height="40" rx="6" fill="#c9a98a"/>' +
    '<rect x="160" y="110" width="52" height="40" rx="6" fill="#9fb8c9"/>' +
    '<circle cx="250" cy="208" r="22" fill="#d8c3a5"/>' +
    '</svg>',
)}`;

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
          '- **High contrast** — a raised card gains a border in Windows High Contrast, where shadows disappear.',
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
    <div style={{ maxWidth: '20rem' }}>
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

/* ---------------------------------------------------------------
 * Product card (recipe)
 * --------------------------------------------------------------- */

export const ProductCardExample: Story = {
  name: 'Product Card (A11y)',
  render: () => (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(15rem, 1fr))',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {['Bamboo shower caddy', 'Oak wall shelf'].map((productName) => (
        <Card key={productName} asChild padding="sm">
          <li>
            <CardMedia aspectRatio="square">
              <Image src={SHELF_IMAGE} alt="" fill unoptimized sizes="15rem" />
            </CardMedia>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Badge variant="primary" appearance="soft" size="sm">
                Bathroom
              </Badge>
              <Badge variant="secondary" appearance="soft" size="sm" shape="rounded">
                IKEA
              </Badge>
            </div>
            <Heading level={3} size="sm">
              <Link
                href={`#${productName.toLowerCase().replaceAll(' ', '-')}`}
                appearance="standalone"
                stretched
              >
                {productName}
              </Link>
            </Heading>
            <Text size="sm" style={{ margin: 0 }}>
              €24.99
            </Text>
          </li>
        </Card>
      ))}
    </ul>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for the product grid: a list of cards rendered as `<li>` with `asChild`, a decorative image (`alt=""`, because the title names the product), badges, and a stretched title link. Screen readers hear one link per product, named by its title, and the whole card is clickable.',
      },
      source: {
        code: `<ul>\n  <Card asChild padding="sm">\n    <li>\n      <CardMedia aspectRatio="square">\n        <Image src={product.image} alt="" fill sizes="…" />\n      </CardMedia>\n      <Badge variant="primary" appearance="soft" size="sm">Bathroom</Badge>\n      <Heading level={3} size="sm">\n        <Link asChild appearance="standalone" stretched>\n          <NextLink href={\`/products/\${product.id}\`}>{product.name}</NextLink>\n        </Link>\n      </Heading>\n      <Text size="sm">{formatPrice(product.price)}</Text>\n    </li>\n  </Card>\n</ul>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(2);
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    await expect(canvas.getByRole('link', { name: 'Oak wall shelf' })).toHaveAttribute(
      'data-link-stretched',
      'true',
    );
  },
};
