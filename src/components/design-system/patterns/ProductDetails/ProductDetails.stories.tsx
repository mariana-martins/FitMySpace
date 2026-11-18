import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../../ui/Breadcrumb';
import { formatPrice, priceStyle, SHELF_IMAGE } from '../../docs';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Label, Text } from '../../ui/Typography';
import { expect, userEvent, within } from 'storybook/test';
import { Card, CardMedia } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useState } from 'react';
import Image from 'next/image';

/* ---------------------------------------------------------------
 * Product details (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Page Sections/Product Details',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The top of a product page: where it sits in the catalogue, what it is, what it costs, its measurements, and the two things people do next — go to the store, or save it for later.\n\n' +
          '### What It Solves\n' +
          'People land here from a search to decide. Everything that decides — the price, the size, which store — has to be readable at a glance and in a sensible order for a screen reader, and the one action that leaves the site has to say so before it is used.\n\n' +
          '### When to Use\n' +
          '- **Every product page,** above the Fit Check and the Store Offers.\n' +
          '- **Not for:** the product grid (see Product Card), or comparing several products side by side.\n\n' +
          '### Anatomy\n' +
          '- The Product Page Header — `Breadcrumb` and the `h1` with the product name.\n' +
          '- The picture — `CardMedia` in an outline `Card`.\n' +
          '- `Badge`s for the room and the store, the price, and a short description. The price is a paragraph in the `heading-md` type role (larger and bold, through its generated shorthand), not a heading.\n' +
          '- The measurements — a description list (`<dl>`): width, depth, height, weight.\n' +
          '- The actions — a `Button` rendered as a link to the store (`asChild`), and a "Save" `Button` that toggles.\n\n' +
          '### Accessibility\n' +
          '- **One `h1`, then the facts in reading order:** name, labels, price, description, measurements, actions.\n' +
          '- **The store link says it opens a new tab** with screen-reader-only text and the arrow icon, before anyone follows it.\n' +
          '- **A long store name wraps** inside the button ("View at The Container Store") instead of pushing the page sideways on a phone.\n' +
          '- **"Save" is a toggle:** `aria-pressed` says whether it is saved, and its words stay the same, because a label that changes ("Save" → "Saved") would make the pressed state say the opposite.\n' +
          '- **The image is decorative** (`alt=""`): the heading names the product. Describe it only when the picture shows something the text does not.\n\n' +
          '### In the App\n' +
          '- The product comes from TanStack Query by id; the saved state is a mutation, optimistic, rolled back with an `Alert` if it fails.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PRODUCT = {
  name: 'Bamboo shower caddy',
  room: 'Bathroom',
  store: 'The Container Store',
  priceInCents: 2499,
  description:
    'Three open shelves in oiled bamboo for bottles and towels. Water drains through the slats, and the feet keep it off a wet floor.',
  measurements: [
    { label: 'Width', value: '48 cm' },
    { label: 'Depth', value: '26 cm' },
    { label: 'Height', value: '70 cm' },
    { label: 'Weight', value: '2.1 kg' },
  ],
};

function ProductDetailsRecipe() {
  const [saved, setSaved] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '56rem',
        maxWidth: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink href="#home" home>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#bathroom">Bathroom</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#bamboo-shower-caddy" aria-current="page">
              {PRODUCT.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading level={1} size="lg" style={{ margin: 0 }}>
          {PRODUCT.name}
        </Heading>
      </div>

      <div
        style={{
          display: 'grid',
          width: '100%',
          gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        <Card appearance="outline" padding="sm">
          <CardMedia aspectRatio="square">
            <Image src={SHELF_IMAGE} alt="" fill unoptimized sizes="24rem" />
          </CardMedia>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <Badge variant="primary" appearance="soft" size="md">
              {PRODUCT.room}
            </Badge>
            <Badge variant="secondary" appearance="soft" size="md" shape="rounded">
              {PRODUCT.store}
            </Badge>
          </div>

          <p style={priceStyle}>{formatPrice(PRODUCT.priceInCents)}</p>

          <Text as="p" size="md" style={{ margin: 0 }}>
            {PRODUCT.description}
          </Text>

          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '0.5rem 1.5rem',
              margin: 0,
            }}
          >
            {PRODUCT.measurements.map((measurement) => (
              <div key={measurement.label} style={{ display: 'contents' }}>
                <dt>
                  <Label size="sm">{measurement.label}</Label>
                </dt>
                <dd style={{ margin: 0 }}>
                  <Text as="span" size="sm">
                    {measurement.value}
                  </Text>
                </dd>
              </div>
            ))}
          </dl>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Button
              asChild
              variant="primary"
              appearance="fill"
              size="md"
              icon="arrow-up-right"
              iconPosition="end"
            >
              <a
                href="#the-container-store-bamboo-shower-caddy"
                target="_blank"
                rel="noopener noreferrer"
              >
                View at {PRODUCT.store}
                <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
              </a>
            </Button>
            <Button
              variant="secondary"
              appearance={saved ? 'fill' : 'outline'}
              size="md"
              icon="star"
              aria-pressed={saved}
              onClick={() => setSaved((isSaved) => !isSaved)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Product details
 * --------------------------------------------------------------- */

export const ProductDetails: Story = {
  name: 'Product Details (A11y)',
  render: () => <ProductDetailsRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Press "Save": the button fills in and is announced as pressed, with the same word. "View at The Container Store" says, before you follow it, that it opens a new tab; on a narrow screen its label wraps onto two lines instead of pushing the page sideways.',
      },
      source: {
        code: `<Breadcrumb>…</Breadcrumb>
<Heading level={1} size="lg">{product.name}</Heading>

<Card appearance="outline" padding="sm">
  <CardMedia aspectRatio="square">
    <Image src={product.image} alt="" fill sizes="…" />
  </CardMedia>
</Card>

<Badge variant="primary" appearance="soft" size="md">{product.room}</Badge>
<p style={priceStyle}>{formatPrice(product.price)}</p>
<Text as="p" size="md">{product.description}</Text>

<dl>
  <dt><Label size="sm">Width</Label></dt>
  <dd><Text as="span" size="sm">48 cm</Text></dd>
  {/* … */}
</dl>

<Button asChild variant="primary" appearance="fill" size="md" icon="arrow-up-right" iconPosition="end">
  <a href={product.storeUrl} target="_blank" rel="noopener noreferrer">
    View at {product.store}
    <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
  </a>
</Button>
<Button
  variant="secondary"
  appearance={saved ? 'fill' : 'outline'}
  size="md"
  icon="star"
  aria-pressed={saved}
  onClick={toggleSaved}
>
  Save
</Button>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Bamboo shower caddy',
    );
    await expect(
      canvas.getByRole('link', { name: 'View at The Container Store (opens in a new tab)' }),
    ).toHaveAttribute('target', '_blank');
    await expect(canvas.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  },
};

/* ---------------------------------------------------------------
 * Product Details (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const ProductDetailsInteraction: Story = {
  ...ProductDetails,
  name: 'Product Details (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole('button', { name: 'Save' });
    await userEvent.click(save);
    await expect(save).toHaveAttribute('aria-pressed', 'true');
    await expect(save).toHaveAccessibleName('Save');
    await userEvent.click(save);
    await expect(save).toHaveAttribute('aria-pressed', 'false');
  },
};
