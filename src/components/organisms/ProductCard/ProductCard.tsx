'use client';

import { formatPrice, formatDimensions } from '@/lib/utils';
import { ROOM_LABELS, ROOM_COLORS } from '@/lib/constants';
import { Badge } from '@/components/atoms/Badge';
import { type Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`} // Work in progress – the idea is to implement product details page
      className="group flex flex-col h-full rounded-lg border border-slate-100 bg-white shadow-md p-4 transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      aria-label={`View details for ${product.name}`}
    >
      <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-md bg-slate-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={product.image.startsWith('data:')}
        />
      </div>
      <div className="flex flex-col flex-grow space-y-2">
        <div className="flex flex-col items-start justify-between gap-2">
          <h3 className="text-base font-medium text-slate-900 line-clamp-2">{product.name}</h3>
          <Badge variant="square" className={'bg-slate-100 text-slate-600 '}>
            {product.store.name}
          </Badge>
        </div>

        <p className="text-sm font-light text-slate-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-lg font-semibold text-slate-900">
            {formatPrice(product.price, product.currency)}
          </span>
          <Badge variant="rounded" className={ROOM_COLORS[product.room]}>
            {ROOM_LABELS[product.room]}
          </Badge>
        </div>
        {product.dimensions && (
          <p className="text-xs text-slate-500">{formatDimensions(product.dimensions)}</p>
        )}
      </div>
    </Link>
  );
}
