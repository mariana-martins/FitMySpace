'use client';

import { ArrowLeft, ExternalLink, Home, Ruler, Store, Tag } from 'lucide-react';
import { Breadcrumbs } from '@/components/molecules/Breadcrumbs';
import { formatPrice, formatDimensions } from '@/lib/utils';
import { ROOM_LABELS, ROOM_COLORS } from '@/lib/constants';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { useRouter } from 'next/navigation';
import { type Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

export interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Products', href: '/' },
    { label: product.name },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-sm"
      >
        <ArrowLeft
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          aria-hidden="true"
        />
        <span>Back to results</span>
      </button>

      {/* Main Content Grid */}
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square w-full max-w-sm lg:max-w-md overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 384px, 448px"
            unoptimized={product.image.startsWith('data:')}
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Room Badge */}
          <Badge variant="rounded" className={ROOM_COLORS[product.room]}>
            {ROOM_LABELS[product.room]}
          </Badge>

          {/* Title */}
          <h1 className="mt-4 text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight">
            {product.name}
          </h1>

          {/* Description */}
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {/* Details Card */}
          <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-4">
              Product Details
            </h2>
            <dl className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200">
                  <Store className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500 uppercase">Available at</dt>
                  <dd className="text-sm font-medium text-slate-900">{product.store.name}</dd>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200">
                  <Tag className="w-5 h-5 text-slate-600" aria-hidden="true" />
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500 uppercase">Room</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {ROOM_LABELS[product.room]}
                  </dd>
                </div>
              </div>

              {product.dimensions && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200">
                    <Ruler className="w-5 h-5 text-slate-600" aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-slate-500 uppercase">Dimensions</dt>
                    <dd className="text-sm font-medium text-slate-900">
                      {formatDimensions(product.dimensions)}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            {product.store.url && (
              <Button asChild size="lg" className="flex-1 h-auto min-h-12 gap-2 text-center">
                <a href={product.store.url} target="_blank" rel="noopener noreferrer">
                  <span>Buy at {product.store.name}</span>
                  <ExternalLink className="w-4 h-4 shrink-0" aria-hidden="true" />
                </a>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              size="lg"
              className="flex-1 h-auto min-h-12 text-center"
            >
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
