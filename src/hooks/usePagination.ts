import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { useRouter, usePathname } from 'next/navigation';
import { ITEMS_PER_PAGE } from '@/lib/constants';
import { useCallback } from 'react';

export type SearchParamsObject = { [key: string]: string | string[] | undefined };

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
 * The URL of a results page: the current search params with `page` set, or
 * removed for page 1, which is the plain URL. The page links and `goToPage`
 * share it, so they never disagree about where a page lives.
 */
export function buildPageUrl(
  searchParams: SearchParamsObject,
  pathname: string,
  page: number,
): string {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      params.set(key, value);
    }
  });

  if (page > 1) {
    params.set('page', page.toString());
  } else {
    params.delete('page');
  }

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
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
      router.push(buildPageUrl(searchParams, pathname, newPage));
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
