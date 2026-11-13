import {
  getPaginationRange,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { PaginationSize } from './';
import type { MouseEvent } from 'react';
import { Text } from '../Typography';
import { useState } from 'react';

type ProductPagesProps = {
  initialPage: number;
  pageCount: number;
  size?: PaginationSize;
  'aria-label'?: string;
};

/**
 * A trail of links built with getPaginationRange. The links keep their
 * real href; the click is intercepted only so the story can move between
 * pages without leaving Storybook.
 */
function ProductPages({
  initialPage,
  pageCount,
  size,
  'aria-label': ariaLabel,
}: ProductPagesProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const goTo = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <Pagination size={size} aria-label={ariaLabel}>
      <PaginationItem>
        <PaginationPrevious
          href={`?page=${currentPage - 1}`}
          disabled={currentPage === 1}
          onClick={goTo(currentPage - 1)}
        />
      </PaginationItem>
      {getPaginationRange({ page: currentPage, pageCount }).map((rangeItem) => (
        <PaginationItem key={rangeItem}>
          {typeof rangeItem === 'number' ? (
            <PaginationLink
              page={rangeItem}
              href={`?page=${rangeItem}`}
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
          href={`?page=${currentPage + 1}`}
          disabled={currentPage === pageCount}
          onClick={goTo(currentPage + 1)}
        />
      </PaginationItem>
    </Pagination>
  );
}

const meta = {
  title: 'Design System/Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    size: 'md',
    children: null,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Pagination` component splits a long list, such as search results, into pages and links to each one. It renders a `<nav aria-label="Pagination">` with an ordered list of links: each page has its own URL, so people can open a page in a new tab, share it or go back to it.\n\n' +
          '### Best Practices\n' +
          '- **Links, not buttons:** Give every page a real `href` (`?page=3`) that keeps the current filters. With Next.js, pass `<Link>` through `asChild`.\n' +
          '- **Build the list with `getPaginationRange`:** It always shows the first and last pages, the pages next to the current one, and an ellipsis for the rest, with the same number of entries on every page so the controls never jump.\n' +
          '- **Mark the current page:** Set `aria-current="page"` on its `PaginationLink`.\n' +
          '- **Hide it when there is one page:** Render `Pagination` only when there is more than one page.\n' +
          '- **Move focus to the results:** After a page change, move focus to the top of the results (e.g. their heading), so keyboard and screen reader users start at the new content.\n\n' +
          '### Key Features\n' +
          '- **Clear names** — page links read "Page 3"; Previous and Next read "Previous page" and "Next page"; an ellipsis reads "More pages".\n' +
          '- **Ends of the list** — on the first or last page, Previous or Next is hidden but keeps its space, as GOV.UK does, so nothing leads nowhere and the page numbers stay put.\n' +
          '- **2 sizes** — `sm` (32px) and `md` (40px, default), the Chip heights, with tabular numbers so the entries keep their width.\n' +
          '- **Server-rendered** — no client hooks; `asChild` uses Radix `Slot`.\n' +
          '- **High contrast** — the current page keeps an outline in Windows High Contrast, where its fill disappears.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'Height and type size of the entries: 32px (`sm`) or 40px (`md`, default).',
    },
    children: {
      control: false,
      description:
        '`PaginationItem` elements holding `PaginationPrevious`, `PaginationLink`, `PaginationEllipsis` and `PaginationNext`.',
    },
  },
  render: (args) => <ProductPages initialPage={5} pageCount={12} size={args.size} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. Click the pages to move through all 12.',
      },
      source: {
        code: `<Pagination>\n  <PaginationItem>\n    <PaginationPrevious href="?page=4" />\n  </PaginationItem>\n  {getPaginationRange({ page: 5, pageCount: 12 }).map((rangeItem) => (\n    <PaginationItem key={rangeItem}>\n      {typeof rangeItem === 'number' ? (\n        <PaginationLink\n          page={rangeItem}\n          href={\`?page=\${rangeItem}\`}\n          aria-current={rangeItem === 5 ? 'page' : undefined}\n        />\n      ) : (\n        <PaginationEllipsis />\n      )}\n    </PaginationItem>\n  ))}\n  <PaginationItem>\n    <PaginationNext href="?page=6" />\n  </PaginationItem>\n</Pagination>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Page 5' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(canvas.getByRole('link', { name: 'Next page' }));
    await expect(canvas.getByRole('link', { name: 'Page 6' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ProductPages initialPage={2} pageCount={5} size="md" aria-label="Medium pagination" />
      <ProductPages initialPage={2} pageCount={5} size="sm" aria-label="Small pagination" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`md` (40px, default) suits search results; `sm` (32px) suits dense places such as a table footer. Both keep at least the 24px target size of WCAG 2.5.8.',
      },
      source: {
        code: `<Pagination size="md">…</Pagination>\n<Pagination size="sm">…</Pagination>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Long ranges
 * --------------------------------------------------------------- */

export const LongRanges: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <ProductPages initialPage={1} pageCount={20} aria-label="First page of 20" />
      <ProductPages initialPage={10} pageCount={20} aria-label="Middle page of 20" />
      <ProductPages initialPage={20} pageCount={20} aria-label="Last page of 20" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Twenty pages on the first, a middle and the last page. `getPaginationRange` keeps 7 entries between Previous and Next, so the controls never move under the pointer; an ellipsis never hides a single page. At either end, Previous or Next is hidden but keeps its space.',
      },
      source: {
        code: `getPaginationRange({ page: 10, pageCount: 20 });\n// [1, 'start-ellipsis', 9, 10, 11, 'end-ellipsis', 20]`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const firstPage = canvas.getByRole('navigation', { name: 'First page of 20' });
    await expect(
      within(firstPage).queryByRole('link', { name: 'Previous page' }),
    ).not.toBeInTheDocument();
    const middlePage = canvas.getByRole('navigation', { name: 'Middle page of 20' });
    await expect(within(middlePage).getAllByText('More pages')).toHaveLength(2);
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <Pagination aria-label="Pagination states">
      <PaginationItem>
        <PaginationPrevious href="#previous" disabled />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink page={1} href="#page-1" aria-current="page" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink page={2} href="#page-2" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink page={3} href="#page-3" className="pseudo-hover" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink page={4} href="#page-4" className="pseudo-active" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink page={5} href="#page-5" className="pseudo-focus-visible" />
      </PaginationItem>
      <PaginationItem>
        <PaginationNext href="#next" />
      </PaginationItem>
    </Pagination>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the states with the `storybook-addon-pseudo-states` plugin, from left to right:\n\n' +
          '- **Hidden Previous** — on the first page, an empty space where Previous would be.\n' +
          '- **Current page (1)** — a sage fill with white text, set by `aria-current="page"`.\n' +
          '- **Default (2)** — plain text, no box.\n' +
          '- **Hover (3)** — a pale neutral box appears.\n' +
          '- **Pressed (4)** — the box darkens one step.\n' +
          '- **Focus (5)** — the shared sage focus ring.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      active: ['.pseudo-active'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Search results (recipe)
 * --------------------------------------------------------------- */

const PRODUCT_COUNT = 47;
const PRODUCTS_PER_PAGE = 12;

function SearchResultsPages() {
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

export const SearchResultsExample: Story = {
  name: 'Search Results (A11y)',
  render: () => <SearchResultsPages />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for the search results: every link keeps the query (`?q=shelf&page=2`), and after a page change focus moves to the results summary, so screen readers announce the new range. In the app, wrap Next.js `<Link>` with `asChild` and let the URL drive the page.',
      },
      source: {
        code: `{totalPages > 1 && (\n  <Pagination>\n    <PaginationItem>\n      <PaginationPrevious asChild disabled={currentPage === 1}>\n        <NextLink href={pageHref(currentPage - 1)} />\n      </PaginationPrevious>\n    </PaginationItem>\n    {getPaginationRange({ page: currentPage, pageCount: totalPages }).map((rangeItem) => (\n      <PaginationItem key={rangeItem}>\n        {typeof rangeItem === 'number' ? (\n          <PaginationLink\n            asChild\n            page={rangeItem}\n            aria-current={rangeItem === currentPage ? 'page' : undefined}\n          >\n            <NextLink href={pageHref(rangeItem)} />\n          </PaginationLink>\n        ) : (\n          <PaginationEllipsis />\n        )}\n      </PaginationItem>\n    ))}\n    <PaginationItem>\n      <PaginationNext asChild disabled={currentPage === totalPages}>\n        <NextLink href={pageHref(currentPage + 1)} />\n      </PaginationNext>\n    </PaginationItem>\n  </Pagination>\n)}`,
      },
    },
  },
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
