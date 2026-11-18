import { FoundationPage, InlineCode, LinkCard, LinkCardGrid, TokenGroup } from '../docs';
import { Pagination, PaginationItem, PaginationLink } from '../ui/Pagination';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../ui/Breadcrumb';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchField } from '../ui/SearchField';
import { expect, within } from 'storybook/test';
import type { CSSProperties } from 'react';
import { Skeleton } from '../ui/Skeleton';
import { Text } from '../ui/Typography';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { Link } from '../ui/Link';
import { Chip } from '../ui/Chip';
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

/** One grid of cards per group. Previews are pictures: LinkCard makes them inert. */
const PageSectionsGrid = () => (
  <LinkCardGrid>
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-site-header--docs"
      title="Site Header"
      description="The brand, the main sections and the saved list, folding into a menu sheet on a phone."
      preview={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text size="sm" as="span">
            <strong>FitMySpace</strong>
          </Text>
          <Button variant="secondary" appearance="ghost" size="xs" icon="menu" aria-label="Menu" />
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-main-navigation--docs"
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
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-footer--docs"
      title="Footer"
      description="Named groups of links and the small print about where prices come from."
      preview={
        <Text size="sm" as="span">
          Shop by room · About us · Contact
        </Text>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-product-page-header--docs"
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
      path="/docs/design-system-patterns-page-sections-product-details--docs"
      title="Product Details"
      description="The top of a product page: name, labels, price, details and measurements in tabs, the store link and Save."
      preview={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="primary"
            appearance="fill"
            size="xs"
            icon="arrow-up-right"
            iconPosition="end"
          >
            View at IKEA
          </Button>
          <Button variant="secondary" appearance="outline" size="xs" icon="star">
            Save
          </Button>
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-product-card--docs"
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
      path="/docs/design-system-patterns-page-sections-store-offers--docs"
      title="Store Offers"
      description="The same product in several stores: price, delivery and stock, cheapest first."
      preview={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Text size="sm" as="span">
            Kmart · $22.00
          </Text>
          <Badge variant="success" appearance="soft" size="sm">
            Lowest price
          </Badge>
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-fit-check--docs"
      title="Fit Check"
      description="Compares a product with a saved space: fits, fits only just, or does not fit, and why."
      preview={
        <Alert variant="success" live="off" title="Fits, with 4 cm to spare">
          In depth, the tightest measurement.
        </Alert>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-filter-bar--docs"
      title="Filter Bar"
      description="Room filters, a sort order and a count that follows them, and the same controls in a dialog on a phone."
      preview={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Chip size="sm" selected>
            Kitchen
          </Chip>
          <Chip size="sm" selected={false}>
            Bathroom
          </Chip>
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-page-sections-paginated-results--docs"
      title="Paginated Results"
      description="A long list split into pages, with the focus taken back to the top of each new page."
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
      path="/docs/design-system-patterns-page-sections-icon-toolbar--docs"
      title="Icon Toolbar"
      description="Icon buttons with tooltips, one Tab stop for the row and the arrow keys to move along it."
      preview={
        <div style={{ display: 'flex', gap: '4px' }}>
          <Button
            variant="secondary"
            appearance="ghost"
            size="xs"
            icon="sliders-horizontal"
            aria-label="Filters"
          />
          <Button
            variant="secondary"
            appearance="ghost"
            size="xs"
            icon="arrow-up-down"
            aria-label="Sort"
          />
          <Button
            variant="secondary"
            appearance="ghost"
            size="xs"
            icon="rotate-ccw"
            aria-label="Reset"
          />
        </div>
      }
    />
  </LinkCardGrid>
);

const TasksGrid = () => (
  <LinkCardGrid>
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-form-validation--docs"
      title="Form Validation"
      description="Field errors plus a summary at the top that links to each one, focused after a failed submit."
      preview={
        <Alert variant="error" live="off" title="There are 2 problems">
          Enter the width in centimetres.
        </Alert>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-dialog-form--docs"
      title="Dialog Form"
      description="A short form in a dialog that checks its field, gives the focus back, then confirms with a toast."
      preview={
        <Button variant="primary" appearance="fill" size="sm" icon="plus">
          Add room
        </Button>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-delete-confirmation--docs"
      title="Delete Confirmation"
      description="One question before a delete, and a focus that lands on the next item once it is gone."
      preview={
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Text size="sm" as="span">
            Bedroom
          </Text>
          <Button variant="error" appearance="ghost" size="sm">
            Delete
          </Button>
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-remove-with-undo--docs"
      title="Remove with Undo"
      description="Take an item out at once, then offer Undo in a toast, with the focus kept in place."
      preview={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Text size="sm" as="span">
            Removed from your list
          </Text>
          <Button variant="secondary" appearance="outline" size="xs">
            Undo
          </Button>
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-preferences--docs"
      title="Preferences"
      description="Settings that apply the moment they change, with one quiet line that confirms each save."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Switch size="sm" label="Order updates" defaultChecked />
          <Switch size="sm" label="Price alerts" />
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-product-search--docs"
      title="Product Search"
      description="A search box and what the page says after each search: products found, nothing found, or an error."
      preview={<SearchField size="sm" label="Search products" />}
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-tasks-results-states--docs"
      title="Results States"
      description="Loading, products, no products and a failed request: what each one shows and says."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', inlineSize: '160px' }}>
          <Skeleton shape="rectangle" height="48px" />
          <Skeleton size="sm" width="70%" />
        </div>
      }
    />
  </LinkCardGrid>
);

const PagesGrid = () => (
  <LinkCardGrid>
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-pages-page-layout--docs"
      title="Page Layout"
      description="The frame every page shares: header, one main area, footer, one h1 and the same section rhythm."
      preview={
        <Text size="sm" as="span">
          <strong>Bathroom storage</strong>
        </Text>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-pages-search-results-page--docs"
      title="Search Results Page"
      description="The whole page: search, filters, one summary line, the products and the pages, sharing one state."
      preview={
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Text size="sm" as="span">
            <strong>Find storage that fits</strong>
          </Text>
          <Text size="sm" as="span">
            3 products for “shelf”
          </Text>
        </div>
      }
    />
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-pages-page-errors--docs"
      title="Page Errors"
      description="A page that does not exist and a page that broke: plain words and a way on."
      preview={
        <Text size="sm" as="span">
          <strong>We could not find that page</strong>
        </Text>
      }
    />
  </LinkCardGrid>
);

const GuidesGrid = () => (
  <LinkCardGrid>
    <LinkCard
      headingLevel={4}
      path="/docs/design-system-patterns-guides-choosing-feedback--docs"
      title="Choosing Feedback"
      description="Field error, alert, toast, empty state or dialog: which one fits which situation."
      preview={
        <Alert variant="information" live="off">
          Pick by where people act and whether they must stop.
        </Alert>
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
          <li>
            <Text as="span" size="sm">
              <strong>The groups below follow Atomic Design loosely.</strong> Page Sections are its
              organisms; Pages are its templates (Page Layout) and pages (the rest). Tasks and
              Guides have no Atomic Design name: they are about what people do and which part to
              pick, not about size.
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

      <TokenGroup
        title="Page Sections"
        description="Pieces of a page made of several components — what Atomic Design calls organisms."
      >
        <PageSectionsGrid />
      </TokenGroup>

      <TokenGroup
        title="Tasks"
        description="Something people do from start to finish: fill a form, delete, undo, search. The focus and the announcements matter as much as the parts."
      >
        <TasksGrid />
      </TokenGroup>

      <TokenGroup
        title="Pages"
        description="Whole pages: Page Layout is the template every page shares; the others are pages built on it."
      >
        <PagesGrid />
      </TokenGroup>

      <TokenGroup title="Guides" description="How to choose between components for a situation.">
        <GuidesGrid />
      </TokenGroup>

      <TokenGroup
        title="Not in the design system yet"
        description="What the patterns asked for and had to do without. Each is a candidate for a component."
      >
        <ul style={ruleListStyle}>
          <li>
            <Text as="span" size="sm">
              <strong>Table</strong> — to compare stores or products on several columns (Store
              Offers). A nice-to-have: the app does not need it yet.
            </Text>
          </li>
          <li>
            <Text as="span" size="sm">
              <strong>Combobox</strong> — suggestions while typing in the search box.
            </Text>
          </li>
        </ul>
      </TokenGroup>
    </FoundationPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Patterns', level: 2 })).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Product Search' })).toHaveAttribute(
      'href',
      './?path=/docs/design-system-patterns-tasks-product-search--docs',
    );
    // The previews are pictures: their controls are not exposed.
    await expect(canvas.queryByRole('searchbox')).not.toBeInTheDocument();
  },
};
