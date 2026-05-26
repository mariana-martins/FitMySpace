'use client';

import { forwardRef, useState, useEffect, useId } from 'react';
import { Input } from '@/components/atoms/Input';
import { Label } from '@radix-ui/react-label';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button/Button';
import { cn } from '@/lib/utils';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onSearch?: (value: string) => void;
  searchButtonLabel?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
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
    const [value, setValue] = useState(propValue?.toString() || '');
    const [isFocused, setIsFocused] = useState(false);

    // Sync internal state with prop value when it changes (e.g. from URL)
    useEffect(() => {
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

    const inputId = useId();

    return (
      <form onSubmit={handleSubmit} role="search" className={cn('relative w-full', className)}>
        {label && (
          <Label
            htmlFor={inputId}
            className={cn(
              'absolute left-4 -top-6 text-sm font-medium text-indigo-600 transition-all duration-300 pointer-events-none z-10',
              isFocused || value
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            )}
          >
            {label}
          </Label>
        )}
        <div className="w-full flex gap-2 mt-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-slate-400" aria-hidden="true" />
            </div>
            <Input
              id={inputId}
              ref={ref}
              type="search"
              value={value}
              onChange={handleOnChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={props.placeholder || 'Search for organizers...'}
              className={cn(
                'w-full pl-11 pr-12 py-3 h-12',
                'rounded-full',
                'border-slate-200 bg-white',
                'text-slate-900 placeholder:text-slate-400',
                'shadow-sm',
                'focus:border-indigo-600 focus:ring-indigo-600',
                'transition-shadow duration-200',
              )}
              {...props}
            />
            {/* Clear button - shown when there's a value */}
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 rounded-full"
                aria-label="Clear search"
              >
                <X size={20} aria-hidden="true" />
              </button>
            )}
          </div>
          {/* External Desktop Search Button */}
          <Button type="submit" size="lg" className="rounded-full shrink-0 hidden sm:flex">
            {_searchButtonLabel || 'Search'}
          </Button>
          {/* Mobile search submit button */}
          <button
            type="submit"
            className="sm:hidden shrink-0 flex items-center justify-center bg-indigo-600 text-white rounded-full w-12 h-12 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-colors"
            aria-label="Search"
          >
            <Search size={20} aria-hidden="true" />
          </button>
        </div>
      </form>
    );
  },
);
SearchInput.displayName = 'SearchInput';

export { SearchInput };
