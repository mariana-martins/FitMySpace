import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Caption, Heading, Text } from '../../ui/Typography';
import { formatPrice, priceStyle } from '../../docs';
import { expect, within } from 'storybook/test';
import type { CSSProperties } from 'react';
import { Badge } from '../../ui/Badge';
import { Link } from '../../ui/Link';
import { Card } from '../../ui/Card';

/* ---------------------------------------------------------------
 * Store offers (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Page Sections/Store Offers',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The same product in several stores: the price, how it gets to you, and a link to each store, cheapest first.\n\n' +
          '### What It Solves\n' +
          'FitMySpace does not sell anything: it sends people to a store. The choice between stores is price, delivery and stock, so each offer shows those three the same way, the best price is named in words, and every link says where it goes and that it leaves the site.\n\n' +
          '### When to Use\n' +
          '- **A product page, under Product Details,** when the product is sold in more than one store.\n' +
          '- **Not for:** a single store (the "View at" button in Product Details is enough), or comparing different products.\n\n' +
          '### Anatomy\n' +
          '- A `Heading` level 2 ("Where to buy") and a short line that says how the list is ordered.\n' +
          '- A list (`<ul>`), each offer an outline `Card` rendered as `<li>`.\n' +
          '- In each card: the store as a `Heading` level 3, the price (in the `heading-md` type role, like Product Details, and in the brand sage so it stands out from the black store name), the delivery as `Caption`, a `Badge` for "Lowest price" or "Out of stock", and a standalone `Link` with `opensInNewTab`.\n\n' +
          '### Accessibility\n' +
          '- **Each link names its store** ("View at Kmart"), so a list of links read on its own still makes sense, and `opensInNewTab` adds the arrow and "(opens in a new tab)".\n' +
          '- **The best price is said, not only shown:** the `Badge` holds the words "Lowest price"; the order is stated in the line above the list.\n' +
          '- **An offer out of stock stays in the list** with its badge, so people know the store has it, and its link still works for checking back.\n' +
          '- **Store headings** let screen readers jump from offer to offer.\n\n' +
          '### In the App\n' +
          '- Offers come with the product from the API. Sort them in the query (in stock first, then by price), and keep the prices in cents until they are formatted.\n' +
          '- If more stores need comparing on more columns, this list will want a `Table` component, which the design system does not have yet.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Offer {
  store: string;
  priceInCents: number;
  delivery: string;
  inStock: boolean;
  href: string;
}

const OFFERS: Offer[] = [
  {
    store: 'Kmart',
    priceInCents: 2200,
    delivery: 'Click and collect today',
    inStock: true,
    href: '#kmart',
  },
  {
    store: 'IKEA',
    priceInCents: 2499,
    delivery: 'Delivered in 3–5 days',
    inStock: true,
    href: '#ikea',
  },
  {
    store: 'Bunnings',
    priceInCents: 2698,
    delivery: 'Delivered in 2–4 days',
    inStock: true,
    href: '#bunnings',
  },
  {
    store: 'Howards Storage World',
    priceInCents: 3495,
    delivery: 'Back in stock in 2 weeks',
    inStock: false,
    href: '#howards',
  },
];

/* In a list of stores, the price is what people scan for: the brand sage sets it apart from
   the store name above it, which shares its weight. */
const offerPriceStyle: CSSProperties = {
  ...priceStyle,
  color: 'var(--ds-semantic-colour-text-brand-base)',
};

/** In stock first, then by price, so the first offer is one people can actually buy. */
function sortOffers(offers: Offer[]) {
  return [...offers].sort(
    (first, second) =>
      Number(second.inStock) - Number(first.inStock) || first.priceInCents - second.priceInCents,
  );
}

function StoreOffersRecipe() {
  const offers = sortOffers(OFFERS);
  const lowestPrice = Math.min(
    ...offers.filter((offer) => offer.inStock).map((offer) => offer.priceInCents),
  );

  return (
    <section
      aria-labelledby="offers-heading"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '36rem',
        maxWidth: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Heading id="offers-heading" level={2} size="sm" style={{ margin: 0 }}>
          Where to buy
        </Heading>
        <Text as="p" size="sm" style={{ margin: 0 }}>
          {offers.length} stores, in stock first, cheapest first.
        </Text>
      </div>

      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {offers.map((offer) => (
          <Card key={offer.store} asChild appearance="outline" padding="sm">
            <li
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
                gap: '0.25rem 1rem',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}
                >
                  <Heading level={3} size="sm" style={{ margin: 0 }}>
                    {offer.store}
                  </Heading>
                  {offer.inStock && offer.priceInCents === lowestPrice && (
                    <Badge variant="success" appearance="soft" size="sm">
                      Lowest price
                    </Badge>
                  )}
                  {!offer.inStock && (
                    <Badge variant="warning" appearance="soft" size="sm">
                      Out of stock
                    </Badge>
                  )}
                </div>
                <p style={offerPriceStyle}>{formatPrice(offer.priceInCents)}</p>
                <Caption>{offer.delivery}</Caption>
              </div>
              <Link href={offer.href} appearance="standalone" size="sm" opensInNewTab>
                View at {offer.store}
              </Link>
            </li>
          </Card>
        ))}
      </ul>
    </section>
  );
}

/* ---------------------------------------------------------------
 * Store offers
 * --------------------------------------------------------------- */

export const StoreOffers: Story = {
  name: 'Store Offers (A11y)',
  render: () => <StoreOffersRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Four stores for the same shower caddy. Kmart is cheapest and says so in words; Howards Storage World is out of stock, so it goes last, but stays listed.',
      },
      source: {
        code: `<section aria-labelledby="offers-heading">
  <Heading id="offers-heading" level={2} size="sm">Where to buy</Heading>
  <Text as="p" size="sm">{offers.length} stores, in stock first, cheapest first.</Text>

  <ul>
    {offers.map((offer) => (
      <Card key={offer.store} asChild appearance="outline" padding="sm">
        <li>
          <Heading level={3} size="sm">{offer.store}</Heading>
          {offer.isLowest && <Badge variant="success" appearance="soft" size="sm">Lowest price</Badge>}
          {!offer.inStock && <Badge variant="warning" appearance="soft" size="sm">Out of stock</Badge>}
          <p style={{ ...priceStyle, color: 'var(--ds-semantic-colour-text-brand-base)' }}>
            {formatPrice(offer.priceInCents)}
          </p>
          <Caption>{offer.delivery}</Caption>
          <Link href={offer.url} appearance="standalone" size="sm" opensInNewTab>
            View at {offer.store}
          </Link>
        </li>
      </Card>
    ))}
  </ul>
</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const offers = canvas.getAllByRole('listitem');
    await expect(offers).toHaveLength(4);
    await expect(within(offers[0]).getByRole('heading', { level: 3 })).toHaveTextContent('Kmart');
    await expect(within(offers[0]).getByText('Lowest price')).toBeVisible();
    await expect(within(offers[3]).getByText('Out of stock')).toBeVisible();
    await expect(
      canvas.getByRole('link', { name: 'View at Kmart (opens in a new tab)' }),
    ).toHaveAttribute('target', '_blank');
  },
};
