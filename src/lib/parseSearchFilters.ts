import { ITEMS_PER_PAGE } from '@/lib/constants';
import { RoomSchema } from '@/lib/schemas';
import { type Room } from '@/types';
import { z } from 'zod';

type SearchParamsObject = { [key: string]: string | string[] | undefined };

/** Upper bound for `limit`, so a crafted URL cannot request the whole catalogue at once. */
export const MAX_LIMIT = 48;

export interface ParsedSearchFilters {
  query: string;
  store: string | undefined;
  room: Room | undefined;
  page: number;
  limit: number;
}

/** Each field falls back to its default instead of failing, since URLs are user input. */
function createSearchFiltersSchema(defaultLimit: number) {
  return z.object({
    query: z.string().catch(''),
    store: z.string().min(1).optional().catch(undefined),
    room: RoomSchema.optional().catch(undefined),
    page: z.coerce.number().int().min(1).catch(1),
    limit: z.coerce.number().int().min(1).max(MAX_LIMIT).catch(defaultLimit),
  });
}

/**
 * Returns the param value only when it appears once in the URL.
 * Repeated params (e.g. `?page=1&page=2`) arrive as arrays and are ignored.
 */
function getSingleValue(searchParams: SearchParamsObject, key: string): string | undefined {
  const value = searchParams[key];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Parses URL search params into validated, strongly-typed filter values.
 * Invalid values (e.g. `page=-1`, `page=1.5`, `limit=9999`, unknown room) fall back to defaults.
 * Array values (repeated params) are ignored.
 *
 * @param searchParams - Raw search params object from Next.js
 * @param defaultLimit - Default items per page (default: ITEMS_PER_PAGE)
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
  defaultLimit = ITEMS_PER_PAGE,
): ParsedSearchFilters {
  const rawFilters = {
    query: getSingleValue(searchParams, 'query'),
    store: getSingleValue(searchParams, 'store'),
    room: getSingleValue(searchParams, 'room'),
    page: getSingleValue(searchParams, 'page'),
    limit: getSingleValue(searchParams, 'limit'),
  };

  const validatedFilters = createSearchFiltersSchema(defaultLimit).parse(rawFilters);

  return {
    query: validatedFilters.query,
    store: validatedFilters.store,
    room: validatedFilters.room,
    page: validatedFilters.page,
    limit: validatedFilters.limit,
  };
}
