import { ProductCard } from '@/components/organisms/ProductCard';
import { EmptyState } from '@/components/molecules/EmptyState';
import { type Product } from '@/types';
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface ProductGridProps extends React.HTMLAttributes<HTMLDivElement> {
  products?: Product[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function ProductGrid({
  products,
  emptyTitle = 'No products found',
  emptyDescription = "Try adjusting your search or filters to find what you're looking for.",
  className,
  ...props
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} {...props} />;
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
      role="list"
      aria-label="Product grid"
      {...props}
    >
      {products.map((product) => (
        <div key={product.id} role="listitem" className="h-full">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
