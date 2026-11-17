import { FoundationPage, InlineCode, LinkCard, LinkCardGrid, TokenGroup } from '../docs';
import { Pagination, PaginationItem, PaginationLink } from '../ui/Pagination';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../ui/Breadcrumb';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchField } from '../ui/SearchField';
import { expect, within } from 'storybook/test';
import type { CSSProperties } from 'react';
import { Text } from '../ui/Typography';
import { Badge } from '../ui/Badge';
import { Link } from '../ui/Link';
import { Card } from '../ui/Card';

/* ---------------------------------------------------------------
 * Patterns overview
 *
 * The front page of the Patterns section: what a pattern is, the
 * rules every pattern follows, and a card for each one.
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Overview',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ruleListStyle: CSSProperties = {
  margin: 0,
  paddingInlineStart: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

/** One card per pattern. Previews are pictures: LinkCard makes them inert. */
const PatternGrid = () => (
  <LinkCardGrid>
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-search-page--docs"
      title="Search Page"
      description="A search form above its results, with a live summary, an empty state and a query error."
      preview={<SearchField size="sm" label="Search products" />}
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-search-results--docs"
      title="Search Results"
      description="Page links that keep the query, and focus that moves to the new range."
      preview={
        <Pagination aria-label="Sample pages" size="sm">
          <PaginationItem>
            <PaginationLink page={1} href="#page-1" aria-current="page" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink page={2} href="#page-2" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink page={3} href="#page-3" />
          </PaginationItem>
        </Pagination>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-product-card--docs"
      title="Product Card"
      description="One product in a grid: picture, room and store, name and price, the whole card a link."
      preview={
        <Card padding="sm" style={{ inlineSize: '160px' }}>
          <div>
            <Badge variant="primary" appearance="soft" size="sm">
              Bathroom
            </Badge>
          </div>
          <Text size="sm" as="span">
            Oak wall shelf
          </Text>
        </Card>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-product-page-header--docs"
      title="Product Page Header"
      description="The trail back through rooms and categories, then the one heading that names the page."
      preview={
        <Breadcrumb size="sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="#home" home>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#bathroom" aria-current="page">
              Bathroom
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-main-navigation--docs"
      title="Main Navigation"
      description="The links to the main sections of the site, with the current one said and seen."
      preview={
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link href="#recent" appearance="standalone" size="sm" aria-current="page">
            Recent
          </Link>
          <Link href="#rooms" appearance="standalone" size="sm">
            Rooms
          </Link>
        </div>
      }
    />
  </LinkCardGrid>
);

/* ---------------------------------------------------------------
 * Overview
 * --------------------------------------------------------------- */

export const Overview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The front page of the Patterns section: what a pattern is, the rules every pattern follows, and a link to each one.',
      },
    },
  },
  render: () => (
    <FoundationPage
      title="Patterns"
      introduction="A pattern is a recipe: components that already exist, put together to solve a problem that keeps coming back, such as a search page or a product grid. It adds no component and no styles of its own. It shows the FitMySpace way to assemble the parts, why they go together that way, and the code to copy."
    >
      <TokenGroup
        title="Patterns or component examples"
        description="Where an example lives depends on how many components it is about."
      >
        <ul style={ruleListStyle}>
          <li>
            <Text as="span" size="sm">
              <strong>A component page</strong> shows that one component in a real setting: a
              TextField inside a form, a Select used as a sort menu.
            </Text>
          </li>
          <li>
            <Text as="span" size="sm">
              <strong>A pattern</strong> puts several components together into a piece of a page,
              where how they work together matters as much as each part.
            </Text>
          </li>
        </ul>
      </TokenGroup>

      <TokenGroup title="What every pattern follows">
        <ul style={ruleListStyle}>
          <li>
            <Text as="span" size="sm">
              <strong>Only design-system components.</strong> Layout is written inline with{' '}
              <InlineCode>style</InlineCode>; no CSS Module, no icon outside{' '}
              <InlineCode>DS_ICONS</InlineCode>, no data from the network.
            </Text>
          </li>
          <li>
            <Text as="span" size="sm">
              <strong>The app owns the state.</strong> The query, the page and the filters live in
              the URL, and the products come from the app. A pattern says where each one goes, and
              fakes it with sample data.
            </Text>
          </li>
          <li>
            <Text as="span" size="sm">
              <strong>The same page every time:</strong> when to use it and when not, its anatomy,
              what it does for accessibility, how it fits the app, and the code.
            </Text>
          </li>
          <li>
            <Text as="span" size="sm">
              <strong>Resting on load.</strong> A visible story only checks its first state; the
              interaction is tested in a hidden copy, so nothing moves before you touch it.
            </Text>
          </li>
          <li>
            <Text as="span" size="sm">
              <strong>No improvising.</strong> A pattern that needs a part the design system does
              not have yet waits for it instead of drawing its own.
            </Text>
          </li>
        </ul>
      </TokenGroup>

      <TokenGroup title="Patterns">
        <PatternGrid />
      </TokenGroup>
    </FoundationPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Patterns', level: 2 })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Search Page' })).toHaveAttribute(
      'href',
      './?path=/docs/design-system-patterns-search-page--docs',
    );
    // The previews are pictures: their controls are not exposed.
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument();
  },
};
