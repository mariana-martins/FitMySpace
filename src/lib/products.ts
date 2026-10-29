import {
  type Product,
  type ProductSearchResponse,
  type Room,
  type SearchParams,
  type Store,
} from '@/types';
import { mockProducts, mockStores } from '@/mocks/data';

/**
 * Product data access layer.
 * Single source of truth for route handlers, server components and MSW handlers.
 * Backed by mock data for now; swap the implementation when the real crawler/API exists.
 */

const DEFAULT_LIMIT = 12;

// Simulated network latency in development to demonstrate Suspense boundaries
const DEV_DELAY_MS = 1000;

function simulateLatency(): Promise<void> {
  if (process.env.NODE_ENV !== 'development') return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, DEV_DELAY_MS));
}

function compareByNewestFirst(firstProduct: Product, secondProduct: Product): number {
  const firstCreatedAt = new Date(firstProduct.createdAt).getTime();
  const secondCreatedAt = new Date(secondProduct.createdAt).getTime();
  return secondCreatedAt - firstCreatedAt;
}

function matchesSearchText(product: Product, searchText: string | undefined): boolean {
  if (!searchText) return true;

  const normalizedSearchText = searchText.toLowerCase();
  const nameMatches = product.name.toLowerCase().includes(normalizedSearchText);
  const descriptionMatches = product.description.toLowerCase().includes(normalizedSearchText);

  return nameMatches || descriptionMatches;
}

function matchesStore(product: Product, storeId: string | undefined): boolean {
  if (!storeId) return true;
  return product.store.id === storeId;
}

function matchesRoom(product: Product, room: Room | undefined): boolean {
  if (!room) return true;
  return product.room === room;
}

/**
 * Searches products by text, store and room, sorted by most recent first.
 * @param filters - The search filters to apply
 * @returns Paginated product results
 */
export async function searchProducts(filters: SearchParams): Promise<ProductSearchResponse> {
  const { query, store, room, page = 1, limit = DEFAULT_LIMIT } = filters;
  await simulateLatency();

  const matchingProducts: Product[] = [];
  for (const product of mockProducts) {
    if (
      matchesSearchText(product, query) &&
      matchesStore(product, store) &&
      matchesRoom(product, room)
    ) {
      matchingProducts.push(product);
    }
  }
  matchingProducts.sort(compareByNewestFirst);

  const firstIndexOnPage = (page - 1) * limit;
  const lastIndexOnPage = firstIndexOnPage + limit;

  return {
    products: matchingProducts.slice(firstIndexOnPage, lastIndexOnPage),
    total: matchingProducts.length,
    page,
    limit,
  };
}

/**
 * Returns the most recently added products.
 * @param limit - Maximum number of products to return
 */
export async function getRecentProducts(limit = DEFAULT_LIMIT): Promise<Product[]> {
  const productsByNewest = [...mockProducts].sort(compareByNewestFirst);
  return productsByNewest.slice(0, limit);
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
