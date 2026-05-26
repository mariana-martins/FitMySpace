import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  errorId?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, errorId, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md bg-white px-3 py-2 text-base',
          'shadow-sm ring-1 ring-inset ring-slate-300',
          'placeholder:text-slate-500',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-600 focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'aria-invalid:ring-2 aria-invalid:ring-red-500 aria-invalid:focus:ring-red-500',
          className,
        )}
        ref={ref}
        aria-invalid={!!error || props['aria-invalid']}
        aria-describedby={errorId || ariaDescribedBy}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
