import { SearchResults, SearchResultsErrorBoundary } from '@/components/organisms/SearchResults';
import { type ParsedSearchFilters, parseSearchFilters } from '@/lib/parseSearchFilters';
import { ProductGridSkeleton } from '@/components/organisms/ProductGrid';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { PageLayout } from '@/components/templates/PageLayout';
import { SearchBar } from '@/components/organisms/SearchBar';
import { FilterBar } from '@/components/organisms/FilterBar';
import { getStores, searchProducts } from '@/lib/products';
import { getQueryClient } from '@/lib/react-query';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { productKeys } from '@/lib/query-keys';
import { Suspense } from 'react';

type SearchParams = { [key: string]: string | string[] | undefined };

/** Creates a stable key for Suspense boundary based on the validated filters */
function getSearchKey({ query, store, room, page, limit }: ParsedSearchFilters): string {
  return `${query}-${store ?? ''}-${room ?? ''}-${page}-${limit}`;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const filters = parseSearchFilters(resolvedSearchParams, ITEMS_PER_PAGE);

  // Prefetch on the server without awaiting: the pending query is dehydrated and streamed to the client, so the Suspense fallback still shows and the client never refetches.
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => searchProducts(filters),
  });

  const stores = await getStores();

  return (
    <PageLayout>
      <div className="px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <section className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-balance text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
            Everything in its place.
          </h1>
          <p className="text-pretty text-lg text-slate-600 mb-14">
            Find the perfect organizing solutions for your home.
          </p>
          <SearchBar className="max-w-xl mx-auto" />
        </section>

        <section className="mb-4">
          <FilterBar stores={stores} />
        </section>

        <section aria-labelledby="search-results-heading">
          <h2 id="search-results-heading" className="sr-only">
            Search results
          </h2>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <SearchResultsErrorBoundary key={getSearchKey(filters)}>
              <Suspense fallback={<ProductGridSkeleton />}>
                <SearchResults searchParams={resolvedSearchParams} />
              </Suspense>
            </SearchResultsErrorBoundary>
          </HydrationBoundary>
        </section>
      </div>
    </PageLayout>
  );
}
