import {
  getPaginationRange,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/Pagination';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Text } from '../../ui/Typography';
import type { MouseEvent } from 'react';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Paginated results (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Paginated Results',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A list too long for one screen, split into pages: a line that says which products are on screen, the products, and the page links underneath.\n\n' +
          '### What It Solves\n' +
          'When people click "Next", three things must happen together: the list changes, the line above it changes ("Showing 13–24 of 47"), and the reader is taken back to the top of the new page — not left at the bottom, next to the links, with no clue that anything changed.\n\n' +
          '### When to Use\n' +
          '- **More products than one page holds**, where people may want to come back to a page or share it: search results, a category.\n' +
          '- **Not for:** a feed people read top to bottom once (load more on scroll), or a list that fits on one page (leave the links out).\n\n' +
          '### Anatomy\n' +
          '- A `<section>` named by the summary line (`aria-labelledby`).\n' +
          '- The summary — `Text` with `tabIndex={-1}`: "Showing 13–24 of 47 storage products".\n' +
          '- The products on this page.\n' +
          '- `Pagination` — Previous, the page numbers from `getPaginationRange`, Next.\n\n' +
          '### Accessibility\n' +
          '- **After a page change, the focus moves to the summary line.** Screen readers read the new range at once, and keyboard users carry on from the top of the new page.\n' +
          '- **Every page is a real link** (`?q=shelf&page=2`): it opens in a new tab, survives a reload and can be shared.\n' +
          '- **The current page** carries `aria-current="page"`, so it is announced as the current page, not only shown in green.\n\n' +
          '### In the App\n' +
          '- The page number lives in the URL next to the query. Wrap Next.js `<Link>` with `asChild` on each page link, and leave `Pagination` out when there is only one page.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PRODUCT_COUNT = 47;
const PRODUCTS_PER_PAGE = 12;
const PRODUCT_TYPES = ['Oak wall shelf', 'Wire basket', 'Linen box', 'Bamboo caddy'];

/** Sample product names, numbered so a page change is visible at a glance. */
const PRODUCTS = Array.from(
  { length: PRODUCT_COUNT },
  (_unused, index) => `${PRODUCT_TYPES[index % PRODUCT_TYPES.length]} no. ${index + 1}`,
);

function PaginatedResultsRecipe() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(PRODUCT_COUNT / PRODUCTS_PER_PAGE);
  const firstShown = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastShown = Math.min(currentPage * PRODUCTS_PER_PAGE, PRODUCT_COUNT);
  const productsOnPage = PRODUCTS.slice(firstShown - 1, lastShown);

  const goTo = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
    document.getElementById('results-summary')?.focus();
  };

  return (
    <section
      aria-labelledby="results-summary"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}
    >
      <Text as="p" id="results-summary" tabIndex={-1} style={{ margin: 0 }}>
        Showing {firstShown}–{lastShown} of {PRODUCT_COUNT} storage products
      </Text>
      <ul
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
          gap: '0.5rem 1.5rem',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        {productsOnPage.map((product) => (
          <li key={product}>
            <Text as="span" size="sm">
              {product}
            </Text>
          </li>
        ))}
      </ul>
      <Pagination aria-label="Search results pages">
        <PaginationItem>
          <PaginationPrevious
            href={`?q=shelf&page=${currentPage - 1}`}
            disabled={currentPage === 1}
            onClick={goTo(currentPage - 1)}
          />
        </PaginationItem>
        {getPaginationRange({ page: currentPage, pageCount }).map((rangeItem) => (
          <PaginationItem key={rangeItem}>
            {typeof rangeItem === 'number' ? (
              <PaginationLink
                page={rangeItem}
                href={`?q=shelf&page=${rangeItem}`}
                aria-current={rangeItem === currentPage ? 'page' : undefined}
                onClick={goTo(rangeItem)}
              />
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href={`?q=shelf&page=${currentPage + 1}`}
            disabled={currentPage === pageCount}
            onClick={goTo(currentPage + 1)}
          />
        </PaginationItem>
      </Pagination>
    </section>
  );
}

/* ---------------------------------------------------------------
 * Paginated results
 * --------------------------------------------------------------- */

export const PaginatedResults: Story = {
  name: 'Paginated Results (A11y)',
  render: () => <PaginatedResultsRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Click "2" or "Next": the products change, the line above them now says "Showing 13–24 of 47", and the keyboard focus jumps up to that line, ready to read the new page from the top.',
      },
      source: {
        code: `<section aria-labelledby="results-summary">
  <Text as="p" id="results-summary" tabIndex={-1}>
    Showing {firstShown}–{lastShown} of {total} storage products
  </Text>

  <ProductGrid products={productsOnPage} />

  {totalPages > 1 && (
    <Pagination aria-label="Search results pages">
      <PaginationItem>
        <PaginationPrevious asChild disabled={currentPage === 1}>
          <NextLink href={pageHref(currentPage - 1)} />
        </PaginationPrevious>
      </PaginationItem>
      {getPaginationRange({ page: currentPage, pageCount: totalPages }).map((rangeItem) => (
        <PaginationItem key={rangeItem}>
          {typeof rangeItem === 'number' ? (
            <PaginationLink
              asChild
              page={rangeItem}
              aria-current={rangeItem === currentPage ? 'page' : undefined}
            >
              <NextLink href={pageHref(rangeItem)} />
            </PaginationLink>
          ) : (
            <PaginationEllipsis />
          )}
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext asChild disabled={currentPage === totalPages}>
          <NextLink href={pageHref(currentPage + 1)} />
        </PaginationNext>
      </PaginationItem>
    </Pagination>
  )}
</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Showing 1–12 of 47 storage products')).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '?q=shelf&page=2',
    );
    await expect(canvas.getByRole('link', { name: 'Page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

/* ---------------------------------------------------------------
 * Paginated Results (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const PaginatedResultsInteraction: Story = {
  ...PaginatedResults,
  name: 'Paginated Results (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'Page 2' }));
    await expect(canvas.getByText('Showing 13–24 of 47 storage products')).toHaveFocus();
    await expect(canvas.getByText('Oak wall shelf no. 13')).toBeVisible();
    await expect(canvas.queryByText('Oak wall shelf no. 1')).not.toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
