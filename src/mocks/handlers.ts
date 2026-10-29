import { getProduct, getRecentProducts, getStores, searchProducts } from '@/lib/products';
import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { http, HttpResponse } from 'msw';

const API_BASE = '/api';

// Handlers delegate to the same data layer as the Next.js route handlers,
// so mocked and real responses never diverge (filters, sorting, pagination).
export const handlers = [
  // Get all stores
  http.get(`${API_BASE}/stores`, async () => {
    return HttpResponse.json(await getStores());
  }),

  // Search products
  http.get(`${API_BASE}/products`, async ({ request }) => {
    const url = new URL(request.url);
    const filters = parseSearchFilters(Object.fromEntries(url.searchParams));

    return HttpResponse.json(await searchProducts(filters));
  }),

  // Get recent products
  http.get(`${API_BASE}/products/recent`, async ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);

    return HttpResponse.json(await getRecentProducts(limit));
  }),

  // Get product by ID
  http.get(`${API_BASE}/products/:id`, async ({ params }) => {
    const product = await getProduct(params.id as string);

    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),
];
