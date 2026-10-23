import { type Product, type ProductSearchResponse, type SearchParams, type Store } from '@/types';
import { mockProducts, mockStores } from '@/mocks/data';

/**
 * Product data access layer.
 * Single source of truth for route handlers, server components and MSW handlers.
 * Backed by mock data for now; swap the implementation when the real crawler/API exists.
 */

const DEFAULT_LIMIT = 12;

// Simulated network latency in development to demonstrate Suspense boundaries
const DEV_DELAY_MS = 1000;

function simulateLatency() {
  if (process.env.NODE_ENV !== 'development') return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, DEV_DELAY_MS));
}

const byNewest = (a: Product, b: Product) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

/**
 * Searches products by text, store and room, sorted by most recent first.
 * @param searchParams - The search filters to apply
 * @returns Paginated product results
 */
export async function searchProducts({
  query,
  store,
  room,
  page = 1,
  limit = DEFAULT_LIMIT,
}: SearchParams): Promise<ProductSearchResponse> {
  await simulateLatency();

  const queryLower = query?.toLowerCase();

  const filteredProducts = mockProducts
    .filter(
      (product) =>
        !queryLower ||
        product.name.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower),
    )
    .filter((product) => !store || product.store.id === store)
    .filter((product) => !room || product.room === room)
    .sort(byNewest);

  const start = (page - 1) * limit;

  return {
    products: filteredProducts.slice(start, start + limit),
    total: filteredProducts.length,
    page,
    limit,
  };
}

/**
 * Returns the most recently added products.
 * @param limit - Maximum number of products to return
 */
export async function getRecentProducts(limit = DEFAULT_LIMIT): Promise<Product[]> {
  return [...mockProducts].sort(byNewest).slice(0, limit);
}

/**
 * Returns a single product by ID, or null if it does not exist.
 * @param id - The product ID
 */
export async function getProduct(id: string): Promise<Product | null> {
  return mockProducts.find((product) => product.id === id) ?? null;
}

/** Returns all available stores. */
export async function getStores(): Promise<Store[]> {
  return mockStores;
}
