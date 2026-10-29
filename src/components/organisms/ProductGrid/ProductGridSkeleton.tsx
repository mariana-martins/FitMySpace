import { SkeletonCard } from '@/components/molecules/SkeletonCard';

export interface ProductGridSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

/** One status region announces the loading state; the placeholder cards are hidden from assistive tech. */
export function ProductGridSkeleton({ count = 8, className, ...props }: ProductGridSkeletonProps) {
  return (
    <div role="status" className={className} {...props}>
      <span className="sr-only">Loading products…</span>
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-hidden="true"
      >
        {Array.from({ length: count }, (_, cardIndex) => (
          <SkeletonCard key={cardIndex} />
        ))}
      </div>
    </div>
  );
}
