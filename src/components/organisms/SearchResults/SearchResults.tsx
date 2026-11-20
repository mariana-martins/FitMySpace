'use client';

import {
  getPaginationRange,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Text,
} from '@/components/design-system';
import { buildPageUrl, usePagination, type SearchParamsObject } from '@/hooks/usePagination';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { useSuspenseSearchProducts } from '@/hooks/useProducts';
import { EmptyState } from '@/components/molecules/EmptyState';
import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { type MouseEvent, useEffect, useRef } from 'react';
import { Button } from '@/components/atoms/Button';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import styles from './SearchResults.module.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Set by a page link, read by the results of the new page: the keyed boundary in page.tsx
// remounts them, so the summary the click saw is gone by the time the new one shows.
let focusSummaryOnNextPage = false;

interface SearchResultsProps {
  searchParams: SearchParamsObject;
}

const EMPTY_STATE = {
  withQuery: {
    title: (query: string) => `No products found for "${query}"`,
    description: "Try adjusting your search terms or filters to find what you're looking for.",
  },
  withoutQuery: {
    title: 'No products found',
    description: 'Start by searching for products or browsing recent arrivals.',
  },
};

export function SearchResults({ searchParams }: SearchResultsProps) {
  const filters = parseSearchFilters(searchParams, ITEMS_PER_PAGE);

  const { data } = useSuspenseSearchProducts(filters);

  const { currentPage, totalPages, goToPage } = usePagination({
    searchParams,
    total: data.total,
    limit: filters.limit,
  });

  const pathname = usePathname();
  const hrefFor = (page: number) => buildPageUrl(searchParams, pathname, page);

  const summaryRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (focusSummaryOnNextPage) {
      focusSummaryOnNextPage = false;
      summaryRef.current?.focus();
    }
  }, [currentPage]);

  // e.g. `?page=99` when the results only fill 2 pages
  const isPageOutOfRange = data.total > 0 && currentPage > totalPages;

  if (isPageOutOfRange) {
    return (
      <div className="flex flex-col items-center">
        <EmptyState
          title={`Page ${currentPage} doesn't exist`}
          description={`These results only go up to page ${totalPages}.`}
        />
        <Button onClick={() => goToPage(totalPages)}>Go to page {totalPages}</Button>
      </div>
    );
  }

  const emptyState = filters.query ? EMPTY_STATE.withQuery : EMPTY_STATE.withoutQuery;
  const emptyTitle =
    typeof emptyState.title === 'function' ? emptyState.title(filters.query) : emptyState.title;

  return (
    <div className="flex flex-col gap-8">
      <div className={styles.results}>
        {data.total > 0 && (
          <Text ref={summaryRef} tabIndex={-1} className={styles.summary}>
            {describeShownRange(currentPage, filters.limit, data.total)}
          </Text>
        )}
        <ProductGrid
          products={data.products}
          emptyTitle={emptyTitle}
          emptyDescription={emptyState.description}
        />
      </div>

      {totalPages > 1 && (
        <ResultsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          hrefFor={hrefFor}
          onNavigate={requestSummaryFocus}
        />
      )}
    </div>
  );
}

/**
 * The page links under the results. Every page is a real link, so it can be
 * opened in a new tab, reloaded and shared; the ends stay on screen as
 * disabled links, so the row keeps its shape on the first and last page.
 */
function ResultsPagination({
  currentPage,
  totalPages,
  hrefFor,
  onNavigate,
}: {
  currentPage: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  onNavigate: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Pagination>
      <PaginationItem>
        <PaginationPrevious asChild disabled={currentPage === 1} onClick={onNavigate}>
          <Link href={hrefFor(currentPage - 1)} />
        </PaginationPrevious>
      </PaginationItem>

      {/* No siblings: seven 40px entries fit one row on a 360px phone; nine wrap below ~420px. */}
      {getPaginationRange({ page: currentPage, pageCount: totalPages, siblingCount: 0 }).map(
        (rangeItem) => (
          <PaginationItem key={rangeItem}>
            {typeof rangeItem === 'number' ? (
              <PaginationLink
                asChild
                page={rangeItem}
                aria-current={rangeItem === currentPage ? 'page' : undefined}
                onClick={onNavigate}
              >
                <Link href={hrefFor(rangeItem)} />
              </PaginationLink>
            ) : (
              <PaginationEllipsis />
            )}
          </PaginationItem>
        ),
      )}

      <PaginationItem>
        <PaginationNext asChild disabled={currentPage === totalPages} onClick={onNavigate}>
          <Link href={hrefFor(currentPage + 1)} />
        </PaginationNext>
      </PaginationItem>
    </Pagination>
  );
}

/** "Showing 13–24 of 47 products", the line the focus moves to after a page change. */
function describeShownRange(page: number, limit: number, total: number): string {
  const first = (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);
  const range = first === last ? `${first}` : `${first}–${last}`;
  return `Showing ${range} of ${total} ${total === 1 ? 'product' : 'products'}`;
}

/**
 * The new results replace the ones the reader is looking at, so the focus goes
 * to the summary above them: the screen reader reads the new range, and the
 * keyboard starts at the top of the new page.
 */
function requestSummaryFocus(event: MouseEvent<HTMLAnchorElement>) {
  // A modified click opens the page in another tab or window: these results stay on screen.
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  focusSummaryOnNextPage = true;
}
