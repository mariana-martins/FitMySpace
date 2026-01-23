import { type ProductSearchResponse, Room } from '@/types';
import { mockProducts, mockStores } from './data';
import { http, HttpResponse } from 'msw';

const API_BASE = '/api';

export const handlers = [
  // Get all stores
  http.get(`${API_BASE}/stores`, () => {
    return HttpResponse.json(mockStores);
  }),

  // Search products
  http.get(`${API_BASE}/products`, ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('query') || '';
    const storeId = url.searchParams.get('store');
    const room = url.searchParams.get('room') as Room | null;
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);

    let filteredProducts = [...mockProducts];

    // Filter by query
    if (query) {
      const queryLower = query.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(queryLower) ||
          product.description.toLowerCase().includes(queryLower),
      );
    }

    // Filter by store
    if (storeId) {
      filteredProducts = filteredProducts.filter((product) => product.store.id === storeId);
    }

    // Filter by room
    if (room) {
      filteredProducts = filteredProducts.filter((product) => product.room === room);
    }

    // Sort by most recent first
    filteredProducts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const response: ProductSearchResponse = {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
    };

    return HttpResponse.json(response);
  }),

  // Get recent products
  http.get(`${API_BASE}/products/recent`, ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '12', 10);

    // Sort by most recent and take the limit
    const recentProducts = [...mockProducts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);

    return HttpResponse.json(recentProducts);
  }),

  // Get product by ID
  http.get(`${API_BASE}/products/:id`, ({ params }) => {
    const { id } = params;
    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return HttpResponse.json(product);
  }),
];
