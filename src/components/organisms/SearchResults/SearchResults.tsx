'use client';

import { ProductGrid } from '@/components/organisms/ProductGrid';
import { useSuspenseSearchProducts } from '@/hooks/useProducts';
import { Pagination } from '@/components/molecules/Pagination';
import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { usePagination } from '@/hooks/usePagination';

interface SearchResultsProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const ITEMS_PER_PAGE = 12;

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
    limit: ITEMS_PER_PAGE,
  });

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
