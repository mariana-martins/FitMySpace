import { ProductDetail, ProductDetailSkeleton } from '@/components/organisms/ProductDetail';
import { PageLayout } from '@/components/templates/PageLayout';
import { getProduct } from '@/lib/products';
import { notFound } from 'next/navigation';
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
        <Suspense fallback={<ProductDetailSkeleton />}>
          <ProductDetail product={product} />
        </Suspense>
      </div>
    </PageLayout>
  );
}
