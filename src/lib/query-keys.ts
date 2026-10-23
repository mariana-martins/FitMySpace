import { type SearchParams } from '@/types';

/**
 * Query key factory for products.
 * Kept free of data/fetch imports so it can be shared by server prefetching and client hooks.
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => ['products', 'list'] as const,
  list: (filters: SearchParams) => ['products', 'list', filters] as const,
  details: () => ['products', 'detail'] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  recent: (limit: number) => ['products', 'recent', limit] as const,
};
