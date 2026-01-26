import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="status"
      className={cn('animate-pulse rounded-md bg-gray-200', className)}
      aria-busy="true"
      aria-label="Loading content"
      {...props}
    />
  );
});
Skeleton.displayName = 'Skeleton';

export { Skeleton };
