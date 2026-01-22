import { Room } from '@/types';

type SearchParamsObject = { [key: string]: string | string[] | undefined };

export interface ParsedSearchFilters {
  query: string;
  store: string | undefined;
  room: Room | undefined;
  page: number;
  limit: number;
}

/**
 * Parses URL search params into strongly-typed filter values.
 *
 * @param searchParams - Raw search params object from Next.js
 * @param defaultLimit - Default items per page (default: 12)
 * @returns Parsed and typed filter values
 *
 * @example
 * ```tsx
 * const filters = parseSearchFilters(searchParams);
 * const { data } = useSuspenseSearchProducts(filters);
 * ```
 */
export function parseSearchFilters(
  searchParams: SearchParamsObject,
  defaultLimit = 12,
): ParsedSearchFilters {
  return {
    query: typeof searchParams.query === 'string' ? searchParams.query : '',
    store: typeof searchParams.store === 'string' ? searchParams.store : undefined,
    room: (typeof searchParams.room === 'string' ? searchParams.room : undefined) as
      | Room
      | undefined,
    page: typeof searchParams.page === 'string' ? Number(searchParams.page) || 1 : 1,
    limit:
      typeof searchParams.limit === 'string'
        ? Number(searchParams.limit) || defaultLimit
        : defaultLimit,
  };
}
