import { ProductDetail } from '@/components/organisms/ProductDetail';
import { PageLayout } from '@/components/templates/PageLayout';
import { Skeleton } from '@/components/atoms/Skeleton';
import { mockProducts } from '@/mocks/data';
import { notFound } from 'next/navigation';
import { type Product } from '@/types';
import { Suspense } from 'react';

function getProduct(id: string): Product | null {
  // In a real app, this would fetch from an API
  const product = mockProducts.find((p) => p.id === id);
  return product || null;
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="grid gap-8 md:grid-cols-2">
              <Skeleton className="aspect-square w-full" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          }
        >
          <ProductDetail product={product} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
