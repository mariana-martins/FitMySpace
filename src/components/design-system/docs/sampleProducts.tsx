import { Heading, Text } from '../ui/Typography';
import { SHELF_IMAGE } from './sampleImages';
import { Card, CardMedia } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import Image from 'next/image';

/* ---------------------------------------------------------------
 * Sample products (Storybook docs helper)
 *
 * A fixed catalogue for the search patterns, and the grid that shows
 * it. The grid is the Product Card pattern, so the patterns built on
 * top of it (Filter Bar, Results States, Search Results Page) stay
 * about their own job; see that pattern for the card itself. Not part
 * of the public design system API.
 * --------------------------------------------------------------- */

export const SAMPLE_ROOMS = ['Bathroom', 'Bedroom', 'Kitchen', 'Living room'] as const;
export type SampleRoom = (typeof SAMPLE_ROOMS)[number];

export interface SampleProduct {
  id: string;
  name: string;
  room: SampleRoom;
  store: string;
  /** In cents, so sorting by price compares whole numbers. */
  priceInCents: number;
}

const PRODUCT_NAMES: Record<SampleRoom, string[]> = {
  Bathroom: [
    'Bamboo shower caddy',
    'Over-door towel rack',
    'Under-sink drawer',
    'Wall mirror shelf',
  ],
  Bedroom: ['Linen storage box', 'Under-bed drawer', 'Hanging shoe organiser', 'Bedside shelf'],
  Kitchen: [
    'Spice drawer insert',
    'Stackable pantry jar',
    'Pot lid rack',
    'Corner cupboard carousel',
  ],
  'Living room': ['Oak wall shelf', 'Woven basket', 'Media console tray', 'Magazine rack'],
};

const STORES = ['IKEA', 'Kmart', 'Bunnings', 'Howards Storage World'];

/** Sixteen products, four per room, with prices spread so every sort order differs. */
export const SAMPLE_PRODUCTS: SampleProduct[] = SAMPLE_ROOMS.flatMap((room, roomIndex) =>
  PRODUCT_NAMES[room].map((name, productIndex) => ({
    id: name.toLowerCase().replaceAll(' ', '-'),
    name,
    room,
    store: STORES[(roomIndex + productIndex) % STORES.length],
    priceInCents: 1499 + (((roomIndex * 4 + productIndex) * 2350) % 9000),
  })),
);

export function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(
    priceInCents / 100,
  );
}

export interface SampleProductGridProps {
  products: SampleProduct[];
  /** The heading level of each product name, one below the heading of the results. */
  headingLevel?: 2 | 3 | 4;
}

/** The products as a grid of Product Cards: one list item and one link per product. */
export function SampleProductGrid({ products, headingLevel = 3 }: SampleProductGridProps) {
  return (
    <ul
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {products.map((product) => (
        <Card key={product.id} asChild padding="sm">
          <li>
            <CardMedia aspectRatio="square">
              <Image src={SHELF_IMAGE} alt="" fill unoptimized sizes="12rem" />
            </CardMedia>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              <Badge variant="primary" appearance="soft" size="sm">
                {product.room}
              </Badge>
              <Badge variant="secondary" appearance="soft" size="sm" shape="rounded">
                {product.store}
              </Badge>
            </div>
            <Heading level={headingLevel} size="sm">
              <Link href={`#${product.id}`} appearance="standalone" stretched>
                {product.name}
              </Link>
            </Heading>
            <Text size="sm" style={{ margin: 0 }}>
              {formatPrice(product.priceInCents)}
            </Text>
          </li>
        </Card>
      ))}
    </ul>
  );
}
