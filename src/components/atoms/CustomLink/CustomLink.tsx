import { cn } from '@/lib/utils';
import Link from 'next/link';

export interface CustomLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  isActive?: boolean;
}

export function CustomLink({ href, children, isActive, className, ...props }: CustomLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-block text-lg font-medium transition-colors duration-300',
        'text-brand-primary hover:text-brand-secondary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 rounded-sm',
        isActive && 'text-brand-secondary',
        className,
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
      <span
        className={cn(
          'absolute bottom-0 left-0 h-[2px] w-full bg-brand-secondary transition-transform duration-300 ease-out',
          'scale-x-0 origin-bottom-right',
          'group-hover:scale-x-100 group-hover:origin-bottom-left',
          isActive && 'scale-x-100 origin-bottom-left',
        )}
        aria-hidden="true"
      />
    </Link>
  );
}
