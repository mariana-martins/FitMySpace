'use client';

import { SearchInput } from '@/components/molecules/SearchInput';
import { useSearch } from '@/hooks/useSearch';

export type SearchBarProps = React.HTMLAttributes<HTMLDivElement>;

export function SearchBar({ className, ...props }: SearchBarProps) {
  const { currentQuery, handleSearch } = useSearch();

  return (
    <div className={className} {...props}>
      <SearchInput
        label="Search products"
        placeholder="Search for home organization products..."
        value={currentQuery}
        onSearch={handleSearch}
        searchButtonLabel="Search"
      />
    </div>
  );
}
