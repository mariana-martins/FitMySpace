import { SkeletonCard } from '@/components/molecules/SkeletonCard';
import { cn } from '@/lib/utils';

export interface ProductGridSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
}

export function ProductGridSkeleton({ count = 8, className, ...props }: ProductGridSkeletonProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
      aria-busy="true"
      aria-label="Loading products"
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
