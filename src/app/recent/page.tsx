import { ProductGrid, ProductGridSkeleton } from '@/components/organisms/ProductGrid';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { PageLayout } from '@/components/templates/PageLayout';
import { mockProducts } from '@/mocks/data';
import { Clock, Home } from 'lucide-react';
import { Suspense } from 'react';

export const revalidate = 60; // ISR: revalidate every 60 seconds

function getRecentProducts() {
  // In a real app, this would fetch from an API
  // For now, we'll use mock data sorted by date
  const recent = [...mockProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return recent;
}

export default async function RecentPage() {
  const products = getRecentProducts();

  const breadcrumbItems = [{ label: 'Home', href: '/', icon: Home }, { label: 'Recent Arrivals' }];

  return (
    <PageLayout>
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs items={breadcrumbItems} className="max-w-2xl mx-auto mb-8" />

        {/* Hero Section */}
        <section className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-6">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-5xl font-semibold text-slate-900 mb-4 tracking-tight">
            Recent Arrivals
          </h1>
          <p className="text-lg text-slate-600">
            Discover the latest home organization products we&apos;ve curated just for you.
          </p>
        </section>

        {/* Products Grid */}
        <section aria-label="Recent products">
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <ProductGrid
              products={products}
              emptyTitle="No recent products"
              emptyDescription="Check back soon for new arrivals!"
            />
          </Suspense>
        </section>
      </div>
    </PageLayout>
  );
}
