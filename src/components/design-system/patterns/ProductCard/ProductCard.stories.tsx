import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../../ui/Typography';
import { expect, within } from 'storybook/test';
import { Card, CardMedia } from '../../ui/Card';
import { SHELF_IMAGE } from '../../docs';
import { Badge } from '../../ui/Badge';
import { Link } from '../../ui/Link';
import Image from 'next/image';

/* ---------------------------------------------------------------
 * Product card (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Product Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'One product in a grid of results: its picture, the room and store it belongs to, its name and its price, with the whole card leading to the product page.\n\n' +
          '### When to Use\n' +
          '- **Any grid or list of products:** search results, a room, recently viewed.\n' +
          '- **Not for:** the product page itself, or a card that needs two actions (a stretched link leaves no room for a second one).\n\n' +
          '### Anatomy\n' +
          '- A list (`<ul>`), each product a `Card` rendered as `<li>` with `asChild`.\n' +
          '- `CardMedia` — the picture, cropped to a square.\n' +
          '- Two `Badge` — the room (`primary`) and the store (`secondary`, `rounded`).\n' +
          '- `Heading` with a `stretched` `Link` — the name, and the click area of the whole card.\n' +
          '- `Text` — the price.\n\n' +
          '### Accessibility\n' +
          '- **One link per product**, named by its title: a screen reader lists "Oak wall shelf", not "image, link, Bathroom, IKEA…".\n' +
          '- **The image is decorative** (`alt=""`) because the title already names the product; describe it only when the picture adds something the text does not say.\n' +
          '- **The list tells the size of the grid**: screen readers announce "list, 2 items".\n\n' +
          '### In the App\n' +
          '- Wrap Next.js `<Link>` with `asChild` inside the title, and use Next.js `<Image fill>` with `sizes` matching the grid column.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Product card
 * --------------------------------------------------------------- */

export const ProductCard: Story = {
  name: 'Product Card (A11y)',
  render: () => (
    <ul
      style={{
        display: 'grid',
        width: '100%',
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
          'Two products in the grid. Hover or tab to a card: the whole card is the link, and the focus ring wraps it.',
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
