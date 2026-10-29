import { ProductDetail } from '@/components/organisms/ProductDetail';
import { PageLayout } from '@/components/templates/PageLayout';
import { getProduct } from '@/lib/products';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';

type ProductPageProps = { params: Promise<{ id: string }> };

// generateMetadata and the page both need the product: cache() runs the lookup once per request
const getProductForRequest = cache(getProduct);

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductForRequest(id);

  if (!product) {
    return { title: 'Product not found | FitMySpace' };
  }

  const title = `${product.name} | FitMySpace`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: { title, description: product.description, type: 'website' },
  };
}

// No Suspense here: the product is awaited before rendering, and loading.tsx shows the skeleton meanwhile
export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductForRequest(id);

  if (!product) {
    notFound();
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProductDetail product={product} />
      </div>
    </PageLayout>
  );
}
