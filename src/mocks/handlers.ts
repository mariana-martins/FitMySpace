import { getProduct, getRecentProducts, getStores, searchProducts } from '@/lib/products';
import { http, HttpResponse } from 'msw';
import { type Room } from '@/types';

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

    const response = await searchProducts({
      query: url.searchParams.get('query') || undefined,
      store: url.searchParams.get('store') || undefined,
      room: (url.searchParams.get('room') || undefined) as Room | undefined,
      page: parseInt(url.searchParams.get('page') || '1', 10),
      limit: parseInt(url.searchParams.get('limit') || '12', 10),
    });

    return HttpResponse.json(response);
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
