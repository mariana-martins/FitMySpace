import { ProductGridSkeleton } from '@/components/organisms/ProductGrid';
import { SearchResults } from '@/components/organisms/SearchResults';
import { PageLayout } from '@/components/templates/PageLayout';
import { SearchBar } from '@/components/organisms/SearchBar';
import { FilterBar } from '@/components/organisms/FilterBar';
import { Suspense } from 'react';

type SearchParams = { [key: string]: string | string[] | undefined };

/** Creates a stable key for Suspense boundary based on search params */
function getSearchKey(params: SearchParams): string {
  const query = typeof params.query === 'string' ? params.query : '';
  const store = typeof params.store === 'string' ? params.store : '';
  const room = typeof params.room === 'string' ? params.room : '';
  const page = typeof params.page === 'string' ? params.page : '1';
  return `${query}-${store}-${room}-${page}`;
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;

  return (
    <PageLayout>
      <div className="px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <section id="hero-search-section" className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
            Everything in its place.
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Find the perfect organizing solutions for your home.
          </p>
          <SearchBar className="max-w-xl mx-auto" />
        </section>

        <section className="mb-4">
          <FilterBar />
        </section>

        <section aria-label="Search results">
          <Suspense fallback={<ProductGridSkeleton />} key={getSearchKey(resolvedSearchParams)}>
            <SearchResults searchParams={resolvedSearchParams} />
          </Suspense>
        </section>
      </div>
    </PageLayout>
  );
}
