import { useRouter, usePathname } from 'next/navigation';
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
  limit = 12,
  total,
}: UsePaginationOptions): UsePaginationReturn {
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = typeof searchParams.page === 'string' ? Number(searchParams.page) || 1 : 1;

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

      router.push(`${pathname}?${params.toString()}`);
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
