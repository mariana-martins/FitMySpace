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
 * Search results (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Search Results',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Moving through the pages of a long result list: a summary of the range on screen, then the page links, each one keeping the query.\n\n' +
          '### When to Use\n' +
          '- **More results than one page holds**, where people may want to come back to a page or share it.\n' +
          '- **Not for:** a feed people read top to bottom without coming back (load more on scroll instead), or a list short enough for one page.\n\n' +
          '### Anatomy\n' +
          '- A `<section>` named by the summary (`aria-labelledby`).\n' +
          '- The summary — `Text` with `tabIndex={-1}`, "Showing 13–24 of 47".\n' +
          '- `Pagination` — Previous, the page range from `getPaginationRange`, Next.\n\n' +
          '### Accessibility\n' +
          '- **Focus moves to the summary after a page change**, so screen readers announce the new range and keyboard users start from the top of the new page instead of the bottom of the old one.\n' +
          '- **Every page is a real link** (`?q=shelf&page=2`): it opens in a new tab, survives a reload and can be shared.\n' +
          '- **The current page** carries `aria-current="page"`; Previous and Next are disabled, not removed, at the ends.\n\n' +
          '### In the App\n' +
          '- The page lives in the URL with the query. Wrap Next.js `<Link>` with `asChild` and let the URL drive the page; hide `Pagination` when there is one page only.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PRODUCT_COUNT = 47;
const PRODUCTS_PER_PAGE = 12;

function SearchResultsRecipe() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(PRODUCT_COUNT / PRODUCTS_PER_PAGE);
  const firstShown = (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastShown = Math.min(currentPage * PRODUCTS_PER_PAGE, PRODUCT_COUNT);

  const goTo = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
    document.getElementById('results-summary')?.focus();
  };

  return (
    <section
      aria-labelledby="results-summary"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
    >
      <Text as="p" id="results-summary" tabIndex={-1} style={{ margin: 0 }}>
        Showing {firstShown}–{lastShown} of {PRODUCT_COUNT} storage products
      </Text>
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
 * Search results
 * --------------------------------------------------------------- */

export const SearchResults: Story = {
  name: 'Search Results (A11y)',
  render: () => <SearchResultsRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Pick a page: the summary updates and takes the focus, so the range is the first thing announced. Each link still points at its own URL.',
      },
      source: {
        code: `{totalPages > 1 && (\n  <Pagination>\n    <PaginationItem>\n      <PaginationPrevious asChild disabled={currentPage === 1}>\n        <NextLink href={pageHref(currentPage - 1)} />\n      </PaginationPrevious>\n    </PaginationItem>\n    {getPaginationRange({ page: currentPage, pageCount: totalPages }).map((rangeItem) => (\n      <PaginationItem key={rangeItem}>\n        {typeof rangeItem === 'number' ? (\n          <PaginationLink\n            asChild\n            page={rangeItem}\n            aria-current={rangeItem === currentPage ? 'page' : undefined}\n          >\n            <NextLink href={pageHref(rangeItem)} />\n          </PaginationLink>\n        ) : (\n          <PaginationEllipsis />\n        )}\n      </PaginationItem>\n    ))}\n    <PaginationItem>\n      <PaginationNext asChild disabled={currentPage === totalPages}>\n        <NextLink href={pageHref(currentPage + 1)} />\n      </PaginationNext>\n    </PaginationItem>\n  </Pagination>\n)}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '?q=shelf&page=2',
    );
    await expect(canvas.getByRole('link', { name: 'Page 2' })).not.toHaveAttribute('aria-current');
  },
};

/* ---------------------------------------------------------------
 * Search Results (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const SearchResultsInteraction: Story = {
  ...SearchResults,
  name: 'Search Results (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('link', { name: 'Page 2' }));
    const summary = canvas.getByText(/Showing 13–24 of 47/);
    await expect(summary).toHaveFocus();
    await expect(canvas.getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '?q=shelf&page=2',
    );
  },
};
