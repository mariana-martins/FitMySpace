import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { useRouter, usePathname } from 'next/navigation';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { useCallback } from 'react';

type SearchParamsObject = { [key: string]: string | string[] | undefined };

interface UsePaginationOptions {
  searchParams: SearchParamsObject;
  limit?: number;
  total: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Hook to manage pagination state and URL synchronization.
 *
 * @param options - Pagination configuration
 * @returns Pagination state and handlers
 *
 * @example
 * ```tsx
 * const { currentPage, totalPages, goToPage } = usePagination({
 *   searchParams,
 *   total: data.total,
 *   limit: 12,
 * });
 * ```
 */
export function usePagination({
  searchParams,
  limit = ITEMS_PER_PAGE,
  total,
}: UsePaginationOptions): UsePaginationReturn {
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = parseSearchFilters(searchParams).page;

  const totalPages = Math.ceil(total / limit);

  const goToPage = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams();

      // Preserve existing search params
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          params.set(key, value);
        }
      });

      // Update or remove page param
      if (newPage > 1) {
        params.set('page', newPage.toString());
      } else {
        params.delete('page');
      }

      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [searchParams, pathname, router],
  );

  return {
    currentPage,
    totalPages,
    goToPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}
