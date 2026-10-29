'use client';

import { ProductGrid } from '@/components/organisms/ProductGrid';
import { useSuspenseSearchProducts } from '@/hooks/useProducts';
import { Pagination } from '@/components/molecules/Pagination';
import { EmptyState } from '@/components/molecules/EmptyState';
import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { usePagination } from '@/hooks/usePagination';
import { Button } from '@/components/atoms/Button';
import { ITEMS_PER_PAGE } from '@/lib/constants';

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
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
      <ProductGrid
        products={data.products}
        emptyTitle={emptyTitle}
        emptyDescription={emptyState.description}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          className="mt-8"
        />
      )}
    </div>
  );
}
