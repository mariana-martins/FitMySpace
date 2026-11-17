import {
  getPaginationRange,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../ui/Pagination';
import { SAMPLE_PRODUCTS, SAMPLE_ROOMS, SampleProductGrid } from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Label, Text } from '../../ui/Typography';
import { expect, userEvent, within } from 'storybook/test';
import type { CSSProperties, MouseEvent } from 'react';
import { Select, SelectItem } from '../../ui/Select';
import { SearchField } from '../../ui/SearchField';
import { EmptyState } from '../../ui/EmptyState';
import type { SampleRoom } from '../../docs';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';
import { Chip } from '../../ui/Chip';

/* ---------------------------------------------------------------
 * Search results page (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Search Results Page',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The whole results page, put together from the other search patterns: the search box, the filters and sort order, the line that sums up the results, the products, and the pages.\n\n' +
          '### What It Solves\n' +
          'Each part works on its own; this page shows how they share one state and one summary. A search, a filter, a sort and a page change all update the same line ("3 products for “shelf” in Bedroom"), so there is one place to look and one thing to hear, whatever was changed.\n\n' +
          '### When to Use\n' +
          '- **The results page of the app**, and any page that lists products people narrow down.\n' +
          '- **Build it from the parts:** see Product Search, Filter Bar, Results States and Paginated Results for each piece and its reasons.\n\n' +
          '### Anatomy\n' +
          '- `Heading` level 1, then `SearchField`.\n' +
          '- The filters — the Filter Bar chips and sort order.\n' +
          '- A results `<section>` named by its `Heading` level 2, with one status line under it.\n' +
          '- The products (Product Card grid), or an `EmptyState` that clears the search and the filters.\n' +
          '- `Pagination`, when there is more than one page.\n\n' +
          '### Accessibility\n' +
          '- **One summary for every change.** The status line says the count, the search, the rooms and the range shown; any change rewrites it, so it is announced whatever caused it.\n' +
          '- **The focus only moves when its button disappears or the page changes:** a page link sends it to the results heading, and "Clear search and filters" sends it to the search box. Searching, filtering and sorting leave it where it is.\n' +
          '- **Any change goes back to page 1**, so a filter never leaves people on a page that no longer exists.\n' +
          '- **Headings give the outline:** the page `h1`, the results `h2`, one `h3` per product.\n\n' +
          '### In the App\n' +
          '- Everything here is URL state (`?q=shelf&room=bedroom&sort=price-ascending&page=2`) read with `useSearchParams` and validated with Zod; the products come from TanStack Query, with the loading and error states from Results States.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const filterRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 14rem',
  gridTemplateRows: 'auto auto',
  justifyContent: 'start',
  columnGap: '1.5rem',
  rowGap: '0.5rem',
  alignItems: 'center',
};

const filterRowFieldStyle: CSSProperties = {
  display: 'grid',
  gridRow: 'span 2',
  gridTemplateRows: 'subgrid',
  alignItems: 'center',
};

const PRODUCTS_PER_PAGE = 8;
const MINIMUM_QUERY_LENGTH = 2;

const SORT_LABELS = {
  relevance: 'Relevance',
  'price-ascending': 'Price: low to high',
  'price-descending': 'Price: high to low',
} as const;
type SortOrder = keyof typeof SORT_LABELS;

function findProducts(query: string, rooms: SampleRoom[], sortOrder: SortOrder) {
  const matches = SAMPLE_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) &&
      (rooms.length === 0 || rooms.includes(product.room)),
  );
  if (sortOrder === 'relevance') return matches;
  const direction = sortOrder === 'price-ascending' ? 1 : -1;
  return [...matches].sort(
    (first, second) => (first.priceInCents - second.priceInCents) * direction,
  );
}

/** "3 products for “shelf” in Bedroom", plus the range once there is more than one page. */
function describeResults(
  count: number,
  query: string,
  rooms: SampleRoom[],
  firstShown: number,
  lastShown: number,
) {
  const products = `${count} ${count === 1 ? 'product' : 'products'}`;
  const forQuery = query ? ` for “${query}”` : '';
  const inRooms = rooms.length ? ` in ${rooms.join(', ')}` : '';
  const range = count > PRODUCTS_PER_PAGE ? `. Showing ${firstShown}–${lastShown}` : '';
  return `${products}${forQuery}${inRooms}${range}`;
}

function SearchResultsPageRecipe() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<SampleRoom[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const products = findProducts(query, rooms, sortOrder);
  const pageCount = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const firstShown = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const lastShown = Math.min(page * PRODUCTS_PER_PAGE, products.length);
  const productsOnPage = products.slice(firstShown - 1, lastShown);

  function search(submittedQuery: string) {
    if (submittedQuery.length > 0 && submittedQuery.length < MINIMUM_QUERY_LENGTH) {
      setQueryError(`Enter at least ${MINIMUM_QUERY_LENGTH} characters to search.`);
      searchInputRef.current?.focus();
      return;
    }
    setQueryError(null);
    setQuery(submittedQuery);
    setPage(1);
  }

  function toggleRoom(room: SampleRoom, isSelected: boolean) {
    setRooms((current) =>
      isSelected ? [...current, room] : current.filter((selected) => selected !== room),
    );
    setPage(1);
  }

  function clearEverything() {
    setInputValue('');
    setQuery('');
    setQueryError(null);
    setRooms([]);
    setPage(1);
    searchInputRef.current?.focus();
  }

  const goTo = (nextPage: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setPage(nextPage);
    resultsHeadingRef.current?.focus();
  };

  const pageHref = (pageNumber: number) =>
    `?q=${encodeURIComponent(query)}&page=${String(pageNumber)}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '60rem',
        maxWidth: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '36rem',
          maxWidth: '100%',
        }}
      >
        <Heading level={1} size="lg" style={{ margin: 0 }}>
          Find storage that fits
        </Heading>
        <SearchField
          ref={searchInputRef}
          label="Search products"
          value={inputValue}
          onValueChange={setInputValue}
          onSearch={search}
          onClear={() => search('')}
          {...(queryError ? { invalid: true, error: queryError } : { invalid: false })}
        />
      </div>

      {/* Labels on one grid row, controls centred on the next: see the Filter Bar pattern. */}
      <div style={filterRowStyle}>
        <div style={filterRowFieldStyle}>
          <Label id="page-room-filter-label" size="sm">
            Filter by room
          </Label>
          <div
            role="group"
            aria-labelledby="page-room-filter-label"
            style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
          >
            {SAMPLE_ROOMS.map((room) => (
              <Chip
                key={room}
                size="sm"
                selected={rooms.includes(room)}
                onSelectedChange={(isSelected) => toggleRoom(room, isSelected)}
              >
                {room}
              </Chip>
            ))}
          </div>
        </div>
        <div style={filterRowFieldStyle}>
          <Label as="label" htmlFor="page-sort" size="sm">
            Sort by
          </Label>
          <Select
            id="page-sort"
            size="sm"
            iconStart="arrow-up-down"
            value={sortOrder}
            onValueChange={(nextValue) => {
              setSortOrder(nextValue as SortOrder);
              setPage(1);
            }}
          >
            {(Object.keys(SORT_LABELS) as SortOrder[]).map((sortKey) => (
              <SelectItem key={sortKey} value={sortKey}>
                {SORT_LABELS[sortKey]}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <section
        aria-labelledby="page-results-heading"
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <Heading
          ref={resultsHeadingRef}
          id="page-results-heading"
          tabIndex={-1}
          level={2}
          size="sm"
          style={{ margin: 0 }}
        >
          Results
        </Heading>
        <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
          {describeResults(products.length, query, rooms, firstShown, lastShown)}
        </Text>

        {products.length > 0 ? (
          <SampleProductGrid products={productsOnPage} />
        ) : (
          <EmptyState
            title="Nothing matches this search"
            headingLevel={3}
            description="Try a broader word, such as shelf or basket, or fewer rooms."
          >
            <Button variant="secondary" appearance="outline" size="md" onClick={clearEverything}>
              Clear search and filters
            </Button>
          </EmptyState>
        )}

        {pageCount > 1 && (
          <PageLinks page={page} pageCount={pageCount} hrefFor={pageHref} onPick={goTo} />
        )}
      </section>
    </div>
  );
}

interface PageLinksProps {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
  onPick: (page: number) => (event: MouseEvent<HTMLAnchorElement>) => void;
}

function PageLinks({ page, pageCount, hrefFor, onPick }: PageLinksProps) {
  return (
    <Pagination aria-label="Results pages">
      <PaginationItem>
        <PaginationPrevious
          href={hrefFor(page - 1)}
          disabled={page === 1}
          onClick={onPick(page - 1)}
        />
      </PaginationItem>
      {getPaginationRange({ page, pageCount }).map((rangeItem) => (
        <PaginationItem key={rangeItem}>
          {typeof rangeItem === 'number' ? (
            <PaginationLink
              page={rangeItem}
              href={hrefFor(rangeItem)}
              aria-current={rangeItem === page ? 'page' : undefined}
              onClick={onPick(rangeItem)}
            />
          ) : (
            <PaginationEllipsis />
          )}
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext
          href={hrefFor(page + 1)}
          disabled={page === pageCount}
          onClick={onPick(page + 1)}
        />
      </PaginationItem>
    </Pagination>
  );
}

/* ---------------------------------------------------------------
 * Search results page
 * --------------------------------------------------------------- */

export const SearchResultsPage: Story = {
  name: 'Search Results Page (A11y)',
  render: () => <SearchResultsPageRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Search "shelf", then pick "Bedroom": the line under "Results" follows every step. Clear the search to get 16 products over two pages, and use the page links: the focus moves to "Results". Search "sofa" to reach the empty state.',
      },
      source: {
        code: `<Heading level={1} size="lg">Find storage that fits</Heading>
<SearchField label="Search products" defaultValue={params.q} onSearch={setQuery} />

<FilterBar rooms={params.rooms} sort={params.sort} onChange={updateParams} />

<section aria-labelledby="results-heading">
  <Heading ref={resultsHeadingRef} id="results-heading" tabIndex={-1} level={2} size="sm">
    Results
  </Heading>
  <Text as="p" size="sm" role="status">{describeResults(data, params)}</Text>

  {data.products.length > 0 ? (
    <ProductGrid products={data.products} />
  ) : (
    <EmptyState title="Nothing matches this search" headingLevel={3}>
      <Button variant="secondary" appearance="outline" size="md" onClick={clearEverything}>
        Clear search and filters
      </Button>
    </EmptyState>
  )}

  {data.pageCount > 1 && <PageLinks page={params.page} pageCount={data.pageCount} />}
</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Find storage that fits',
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('16 products. Showing 1–8');
  },
};

/* ---------------------------------------------------------------
 * Search Results Page (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const SearchResultsPageInteraction: Story = {
  ...SearchResultsPage,
  name: 'Search Results Page (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole('status');

    await userEvent.click(canvas.getByRole('link', { name: 'Page 2' }));
    await expect(canvas.getByRole('heading', { name: 'Results' })).toHaveFocus();
    await expect(status).toHaveTextContent('16 products. Showing 9–16');

    const searchBox = canvas.getByRole('searchbox', { name: 'Search products' });
    await userEvent.type(searchBox, 'shelf{Enter}');
    await expect(status).toHaveTextContent('3 products for “shelf”');
    await userEvent.click(canvas.getByRole('button', { name: 'Bedroom' }));
    await expect(status).toHaveTextContent('1 product for “shelf” in Bedroom');

    await userEvent.clear(searchBox);
    await userEvent.type(searchBox, 'sofa{Enter}');
    await expect(status).toHaveTextContent('0 products for “sofa” in Bedroom');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search and filters' }));
    await expect(searchBox).toHaveFocus();
    await expect(status).toHaveTextContent('16 products. Showing 1–8');
  },
};
