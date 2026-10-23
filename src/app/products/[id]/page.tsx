import { ProductDetail } from '@/components/organisms/ProductDetail';
import { PageLayout } from '@/components/templates/PageLayout';
import { Skeleton } from '@/components/atoms/Skeleton';
import { notFound } from 'next/navigation';
import { getProduct } from '@/lib/products';
import { Suspense } from 'react';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

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
