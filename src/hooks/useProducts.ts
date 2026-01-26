import { ProductSearchResponseSchema, ProductArraySchema, ProductSchema } from '@/lib/schemas';
import { type Product, type ProductSearchResponse, type SearchParams } from '@/types';
import { keepPreviousData, useQuery, useSuspenseQuery } from '@tanstack/react-query';

// Use absolute URL on server (SSR) and relative URL on client
// Server needs a full URL, client relative URL works across hosts (localhost, LAN IP)
const getApiBase = () => {
  if (typeof window === 'undefined') {
    // Server-side: use localhost since Next.js API routes are on the same server
    return 'http://localhost:3000/api';
  }
  // Client-side: use relative URL
  return '/api';
};

const API_BASE = getApiBase();

export const productKeys = {
  all: ['products'] as const,
  lists: () => ['products', 'list'] as const,
  list: (filters: SearchParams) => ['products', 'list', filters] as const,
  details: () => ['products', 'detail'] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
  recent: (limit: number) => ['products', 'recent', limit] as const,
};

/**
 * Builds URLSearchParams from search filters.
 * @param searchParams - The search filters to apply
 * @returns URLSearchParams object with all non-null/undefined values
 */
function buildSearchParams(searchParams: SearchParams): URLSearchParams {
  const params = new URLSearchParams();

  // Define defaults for pagination
  const paramEntries: Record<string, string | number | null | undefined> = {
    query: searchParams.query,
    store: searchParams.store,
    room: searchParams.room,
    minPrice: searchParams.minPrice,
    maxPrice: searchParams.maxPrice,
    page: searchParams.page ?? 1,
    limit: searchParams.limit ?? 12,
  };

  // Append all defined parameters
  Object.entries(paramEntries).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, value.toString());
    }
  });

  return params;
}

/**
 * Fetches products based on search parameters.
 * @param searchParams - The search filters to apply
 * @returns Promise resolving to paginated product results
 * @throws Error if the API request fails or response validation fails
 */
async function fetchProducts(searchParams: SearchParams): Promise<ProductSearchResponse> {
  const params = buildSearchParams(searchParams);

  const response = await fetch(`${API_BASE}/products?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  const data: unknown = await response.json();
  return ProductSearchResponseSchema.parse(data);
}

/**
 * Fetches recently added products.
 * @param limit - Maximum number of products to return
 * @returns Promise resolving to array of products
 * @throws Error if the API request fails or response validation fails
 */
async function fetchRecentProducts(limit = 12): Promise<Product[]> {
  const response = await fetch(`${API_BASE}/products/recent?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recent products');
  }
  const data: unknown = await response.json();
  return ProductArraySchema.parse(data);
}

/**
 * Fetches a single product by ID.
 * @param id - The product ID to fetch
 * @returns Promise resolving to the product
 * @throws Error if the API request fails or response validation fails
 */
async function fetchProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  const data: unknown = await response.json();
  return ProductSchema.parse(data);
}

/**
 * Hook to search products with filters.
 * Uses `keepPreviousData` to maintain UI stability during filter changes.
 *
 * @param searchParams - Search filters (query, store, room, price range)
 * @returns Query result with products, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useSearchProducts({ query: 'bins' });
 * ```
 */
export function useSearchProducts(searchParams: SearchParams) {
  return useQuery<ProductSearchResponse, Error>({
    queryKey: productKeys.list(searchParams),
    queryFn: () => fetchProducts(searchParams),
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to search products with filters using Suspense.
 *
 * @param searchParams - Search filters (query, store, room, price range)
 * @returns Query result with products (suspends on loading)
 */
export function useSuspenseSearchProducts(searchParams: SearchParams) {
  return useSuspenseQuery<ProductSearchResponse, Error>({
    queryKey: productKeys.list(searchParams),
    queryFn: () => fetchProducts(searchParams),
  });
}

/**
 * Hook to fetch recently added products.
 *
 * @param limit - Maximum number of products to return (default: 12)
 * @returns Query result with products array, loading state, and error
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useRecentProducts(8);
 * ```
 */
export function useRecentProducts(limit = 12) {
  return useQuery<Product[], Error>({
    queryKey: productKeys.recent(limit),
    queryFn: () => fetchRecentProducts(limit),
  });
}

/**
 * Hook to fetch a single product by ID.
 * Query is disabled when ID is empty/falsy.
 *
 * @param id - The product ID to fetch
 * @returns Query result with product data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: product, isLoading } = useProduct('prod-123');
 * ```
 */
export function useProduct(id: string) {
  return useQuery<Product, Error>({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}
