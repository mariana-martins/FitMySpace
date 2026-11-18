import { SAMPLE_PRODUCTS, SampleFooter, SampleProductGrid, SampleSiteHeader } from '../../docs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../../ui/Breadcrumb';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../../ui/Typography';
import { expect, within } from 'storybook/test';
import { List, ListItem } from '../../ui/List';
import { SkipLink } from '../../ui/SkipLink';
import type { CSSProperties } from 'react';

/* ---------------------------------------------------------------
 * Page layout (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Pages/Page Layout',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          "The frame every page shares: the header, one main area that holds the page's own content, and the footer — with a readable width, one `h1` and the same spacing between sections everywhere.\n\n" +
          '### What It Solves\n' +
          'Pages built one by one drift: a slightly wider column here, two `h1`s there, sections that sit closer on one page than another. A shared frame keeps the width, the outline and the rhythm the same, and gives assistive technology the landmarks it expects.\n\n' +
          '### When to Use\n' +
          '- **Every page of the app.** A page only decides what goes inside `<main>`.\n' +
          '- **Not for:** a dialog or a toast, which sit on top of the page.\n\n' +
          '### Anatomy\n' +
          '- `SkipLink`, then the Site Header, then `<main id="main-content">`, then the Footer.\n' +
          '- A content column capped at `semantic.size.container.lg` (1024px), centred, with `semantic.spacing.inset.lg` at the sides.\n' +
          '- Inside `<main>`: the `Breadcrumb` (on pages below the top level), one `Heading` level 1, an introduction, then `<section>`s, each named by a `Heading` level 2.\n' +
          '- Sections are `semantic.spacing.section.md` apart.\n\n' +
          '### Accessibility\n' +
          '- **Landmarks in order:** banner (`<header>`), navigation, main, content information (`<footer>`); screen readers list them and jump between them.\n' +
          '- **One `h1` per page,** then `h2` for each section and `h3` inside; never a level skipped for looks — the `size` prop changes the look.\n' +
          '- **A skip link first:** `SkipLink` is the first focusable element and lands on `<main id="main-content" tabIndex={-1}>`, so one key press passes the header. Click the page and press Tab to see it.\n' +
          '- **Readable lines:** the column cap keeps text from running across a wide screen.\n\n' +
          '### In the App\n' +
          '- The header, the skip link and the footer belong in `src/app/layout.tsx`; each page renders only its `<main>` content. Keep `loading.tsx` out of `/products/[id]` so a missing product still answers 404.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const columnStyle: CSSProperties = {
  width: '100%',
  maxWidth: 'var(--ds-semantic-size-container-lg)',
  marginInline: 'auto',
  paddingInline: 'var(--ds-semantic-spacing-inset-lg)',
  boxSizing: 'border-box',
};

const SAVED_SPACES = [
  { name: 'Bathroom niche', size: '60 × 30 × 90 cm' },
  { name: 'Under the basin', size: '55 × 40 × 50 cm' },
];

function RoomPage() {
  const bathroomProducts = SAMPLE_PRODUCTS.filter((product) => product.room === 'Bathroom');

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
      }}
    >
      <SkipLink />
      <div style={columnStyle}>
        <SampleSiteHeader layout="wide" />
      </div>

      <main
        id="main-content"
        style={{ ...columnStyle, paddingBlock: 'var(--ds-semantic-spacing-section-sm)' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--ds-semantic-spacing-section-md)',
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
                <BreadcrumbLink href="#rooms">Rooms</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="#bathroom" aria-current="page">
                  Bathroom
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading level={1} size="lg" style={{ margin: 0 }}>
              Bathroom storage
            </Heading>
            <Text as="p" size="md" style={{ margin: 0, maxWidth: '40rem' }}>
              Shelves, caddies and drawers for small, damp rooms, checked against the spaces you
              saved.
            </Text>
          </div>

          <section
            aria-labelledby="popular-heading"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Heading id="popular-heading" level={2} size="md" style={{ margin: 0 }}>
              Popular in bathrooms
            </Heading>
            <SampleProductGrid products={bathroomProducts} headingLevel={3} />
          </section>

          <section
            aria-labelledby="spaces-heading"
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <Heading id="spaces-heading" level={2} size="md" style={{ margin: 0 }}>
              Your saved spaces
            </Heading>
            <div style={{ width: '28rem', maxWidth: '100%' }}>
              <List appearance="outline">
                {SAVED_SPACES.map((space) => (
                  <ListItem key={space.name} icon="ruler" description={space.size}>
                    {space.name}
                  </ListItem>
                ))}
              </List>
            </div>
          </section>
        </div>
      </main>

      <div style={columnStyle}>
        <SampleFooter />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Room page
 * --------------------------------------------------------------- */

export const PageLayout: Story = {
  name: 'Room Page (A11y)',
  render: () => <RoomPage />,
  parameters: {
    docs: {
      description: {
        story:
          'A whole room page: header, breadcrumb, one heading, two sections and the footer, in one column capped at 1024px.',
      },
      source: {
        code: `// src/app/layout.tsx
<SkipLink targetId="main-content" />
<SiteHeader />
<main id="main-content" tabIndex={-1}>{children}</main>
<Footer />

// src/app/rooms/[room]/page.tsx — only the main content
<Breadcrumb>…</Breadcrumb>
<Heading level={1} size="lg">Bathroom storage</Heading>
<Text as="p" size="md">Shelves, caddies and drawers for small, damp rooms…</Text>

<section aria-labelledby="popular-heading">
  <Heading id="popular-heading" level={2} size="md">Popular in bathrooms</Heading>
  <ProductGrid products={products} />
</section>

<section aria-labelledby="spaces-heading">
  <Heading id="spaces-heading" level={2} size="md">Your saved spaces</Heading>
  <List appearance="outline">…</List>
</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    await expect(canvas.getByRole('main')).toHaveAttribute('id', 'main-content');
    await expect(canvas.getByRole('contentinfo')).toBeInTheDocument();
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expect(canvas.getByRole('region', { name: 'Popular in bathrooms' })).toBeInTheDocument();
  },
};
