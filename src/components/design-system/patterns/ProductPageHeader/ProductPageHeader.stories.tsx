import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../../ui/Breadcrumb';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Heading } from '../../ui/Typography';

/* ---------------------------------------------------------------
 * Product page header (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Product Page Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The top of a product page: the trail back through the rooms and categories, then the one page heading that names the product.\n\n' +
          '### When to Use\n' +
          '- **Every page deep in the hierarchy:** a product, a category inside a room.\n' +
          '- **Not for:** the home page or a page one level down, where the trail would only repeat the main navigation.\n\n' +
          '### Anatomy\n' +
          '- `Breadcrumb` — Home (with `home`), then each level, ending with the current page.\n' +
          '- `Heading` level 1 — the product name, the only `h1` on the page.\n\n' +
          '### Accessibility\n' +
          '- **The trail is a landmark:** `<nav aria-label="Breadcrumb">`, so screen readers can jump to it or past it.\n' +
          '- **The last step is the current page:** it carries `aria-current="page"` and repeats the heading below.\n' +
          '- **Long trails wrap** instead of scrolling sideways; the example sits in a narrow column to show it.\n\n' +
          '### In the App\n' +
          '- Build the trail from the product data, and wrap Next.js `<Link>` with `asChild` on each `BreadcrumbLink`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Product page header
 * --------------------------------------------------------------- */

export const ProductPageHeader: Story = {
  name: 'Product Page Header (A11y)',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        width: '22rem',
        maxWidth: '100%',
      }}
    >
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#rooms">Rooms</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#bathroom">Bathroom</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#wall-shelves">Wall shelves & caddies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#bamboo-shower-caddy" aria-current="page">
            Bamboo shower caddy
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading level={1} size="lg" style={{ margin: 0 }}>
        Bamboo shower caddy
      </Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A five-step trail in a narrow column: it wraps onto a second line and never scrolls sideways.',
      },
      source: {
        code: `<Breadcrumb>\n  {crumbs.map((crumb, index) => (\n    <BreadcrumbItem key={crumb.href}>\n      <BreadcrumbLink\n        asChild\n        home={index === 0}\n        aria-current={index === crumbs.length - 1 ? 'page' : undefined}\n      >\n        <NextLink href={crumb.href}>{crumb.label}</NextLink>\n      </BreadcrumbLink>\n    </BreadcrumbItem>\n  ))}\n</Breadcrumb>\n<Heading level={1} size="lg">{product.name}</Heading>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Bamboo shower caddy',
    );
    await expect(canvas.getByRole('link', { name: 'Bamboo shower caddy' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
