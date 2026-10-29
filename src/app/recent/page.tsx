import { ProductGrid } from '@/components/organisms/ProductGrid';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { PageLayout } from '@/components/templates/PageLayout';
import { getRecentProducts } from '@/lib/products';
import { Clock, Home } from 'lucide-react';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function RecentPage() {
  const products = await getRecentProducts(8);

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
        <section aria-labelledby="recent-products-heading">
          <h2 id="recent-products-heading" className="sr-only">
            Recent products
          </h2>
          <ProductGrid
            products={products}
            emptyTitle="No recent products"
            emptyDescription="Check back soon for new arrivals!"
          />
        </section>
      </div>
    </PageLayout>
  );
}
