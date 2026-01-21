import { cn } from '@/lib/utils';
import * as React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-gray-500 bg-white px-3 py-2 text-base',
          'placeholder:text-gray-600',
          'focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:border-red-500 aria-invalid:focus:ring-red-500',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
