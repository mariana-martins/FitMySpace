import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  ...props
}: PaginationProps) {
  // Generate page numbers to display
  const pages = React.useMemo(() => {
    const items: (number | '...')[] = [];

    // Always show first page
    items.push(1);

    if (currentPage > 3) {
      items.push('...');
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(i);
    }

    if (currentPage < totalPages - 2) {
      items.push('...');
    }

    // Always show last page if more than 1 page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-2', className)}
      {...props}
    >
      <Button
        variant="outline"
        size="md"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Go to previous page"
        className="gap-1 pl-2.5"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>

      <div className="flex items-center gap-1">
        {pages.map((page, i) => (
          <React.Fragment key={i}>
            {page === '...' ? (
              <span
                className="flex h-9 w-9 items-center justify-center text-sm text-slate-500"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <Button
                variant={currentPage === page ? 'default' : 'ghost'}
                size="md"
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={cn('h-10 w-10 p-0', currentPage === page)}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        size="md"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Go to next page"
        className="gap-1 pr-2.5"
      >
        <span>Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
