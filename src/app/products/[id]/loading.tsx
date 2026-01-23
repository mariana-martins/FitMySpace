import { Skeleton } from '@/components/atoms/Skeleton';

export default function Loading() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}
