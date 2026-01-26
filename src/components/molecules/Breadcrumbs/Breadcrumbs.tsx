import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** URL to navigate to. If undefined, renders as current page (no link) */
  href?: string;
  /** Optional icon component to display before the label */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Array of breadcrumb items to display */
  items: BreadcrumbItem[];
}

const linkStyles = cn(
  'hover:text-indigo-600 transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-sm',
);

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm text-slate-500', className)}
      {...props}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={item.label}>
            {/* Separator (not before first item) */}
            {index > 0 && <ChevronRight className="w-4 h-4 shrink-0" aria-hidden="true" />}

            {/* Breadcrumb item */}
            {isLast || !item.href ? (
              // Current page (no link)
              <span
                className={cn(
                  'text-slate-900 font-medium truncate max-w-[200px]',
                  Icon && 'flex items-center gap-1',
                )}
                aria-current="page"
              >
                {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                {item.label}
              </span>
            ) : (
              // Link to another page
              <Link href={item.href} className={cn(linkStyles, Icon && 'flex items-center gap-1')}>
                {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                <span>{item.label}</span>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
