import { CircleArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  targetId?: string;
}

export function SkipLink({ className, targetId = 'main-content', ...props }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'group sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-6 focus:z-50',
        'flex items-center gap-2 focus:p-3',
        'bg-brand-secondary text-white font-medium rounded-md shadow-lg',
        'focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:ring-offset-2',
        'transition-all duration-300 ease-in-out',
        className,
      )}
      {...props}
    >
      <CircleArrowDown size={20} className="group-focus:animate-bounce" aria-hidden="true" />
      Skip to content
    </a>
  );
}
