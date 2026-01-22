import { SearchAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 px-4 text-center',
          className,
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <SearchAlert size={48} className="text-gray-900 mb-1" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4 max-w-md">{description}</p>}
      </div>
    );
  },
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
