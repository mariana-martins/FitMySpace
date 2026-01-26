import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: 'square' | 'rounded';
}

const VARIANTS = {
  square: 'rounded-sm px-2 py-1 font-base',
  rounded: 'rounded-full px-2.5 py-0.5 font-medium',
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'rounded', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn('w-fit items-center', 'text-xs', VARIANTS[variant], className)}
        {...props}
      />
    );
  },
);
Badge.displayName = 'Badge';

export { Badge };
