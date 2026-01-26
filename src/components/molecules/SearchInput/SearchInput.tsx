'use client';

import { Input } from '@/components/atoms/Input';
import { Label } from '@radix-ui/react-label';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onSearch?: (value: string) => void;
  searchButtonLabel?: string;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      label,
      onSearch,
      searchButtonLabel: _searchButtonLabel,
      value: propValue,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState(propValue?.toString() || '');

    // Sync internal state with prop value when it changes (e.g. from URL)
    React.useEffect(() => {
      setValue(propValue?.toString() || '');
    }, [propValue]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch?.(value);
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (newValue === '') {
        onSearch?.('');
      }
    };

    const handleClear = () => {
      setValue('');
      onSearch?.('');
      // Optional: focus back to input
    };

    const inputId = React.useId();

    return (
      <form onSubmit={handleSubmit} role="search" className={cn('relative w-full', className)}>
        {label && (
          <Label htmlFor={inputId} className="sr-only">
            {label}
          </Label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-slate-400" aria-hidden="true" />
          </div>
          <Input
            id={inputId}
            ref={ref}
            type="search"
            value={value}
            onChange={handleOnChange}
            aria-label={label || 'Search'}
            placeholder={props.placeholder || 'Search for organizers...'}
            className={cn(
              'w-full pl-11 pr-20 sm:pr-10 py-3 h-12',
              'rounded-full',
              'border-slate-200 bg-white',
              'text-slate-900 placeholder:text-slate-400',
              'shadow-sm',
              'focus:border-indigo-600 focus:ring-indigo-600',
              'transition-shadow duration-200',
            )}
            {...props}
          />
          {/* Clear button - shown when there's a value, hidden on mobile when submit button is shown */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-12 sm:right-0 pr-2 sm:pr-4 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-full"
              aria-label="Clear search"
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
          {/* Mobile search submit button */}
          <button
            type="submit"
            className="sm:hidden absolute inset-y-1.5 right-1.5 flex items-center justify-center bg-indigo-600 text-white rounded-full w-9 h-9 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-colors"
            aria-label="Search"
          >
            <Search size={18} aria-hidden="true" />
          </button>
        </div>
      </form>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
