import { Skeleton } from '@/components/atoms/Skeleton';
import { cn } from '@/lib/utils';
import * as React from 'react';

export type SkeletonCardProps = React.HTMLAttributes<HTMLDivElement>;

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('rounded-lg border border-gray-200 p-4', className)} {...props}>
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    );
  },
);
SkeletonCard.displayName = 'SkeletonCard';

export { SkeletonCard };
