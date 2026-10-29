/**
 * @jest-environment node
 */
import { GET as getProductById } from '@/app/api/products/[id]/route';
import { GET as getRecent } from '@/app/api/products/recent/route';
import { GET as searchProducts } from '@/app/api/products/route';
import { type ProductSearchResponse } from '@/types';
import { mockProducts } from '@/mocks/data';
import { NextRequest } from 'next/server';

function createRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, 'http://localhost'));
}

describe('GET /api/products', () => {
  it('returns paginated search results', async () => {
    const response = await searchProducts(createRequest('/api/products?page=1&limit=4'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.products).toHaveLength(4);
    expect(body).toMatchObject({ total: mockProducts.length, page: 1, limit: 4 });
  });

  it('falls back to defaults for invalid page and limit', async () => {
    const response = await searchProducts(createRequest('/api/products?page=-1&limit=9999'));
    const body = await response.json();

    expect(body).toMatchObject({ page: 1, limit: 12 });
    expect(body.products).toHaveLength(Math.min(12, mockProducts.length));
  });

  it('ignores an unknown room instead of returning nothing', async () => {
    const response = await searchProducts(createRequest('/api/products?room=spaceship'));
    const body = await response.json();

    expect(body.total).toBe(mockProducts.length);
  });

  it('applies the store filter', async () => {
    const response = await searchProducts(createRequest('/api/products?store=2'));
    const body: ProductSearchResponse = await response.json();

    expect(body.products.every((product) => product.store.id === '2')).toBe(true);
  });
});

describe('GET /api/products/recent', () => {
  it('returns at most `limit` products', async () => {
    const response = await getRecent(createRequest('/api/products/recent?limit=3'));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toHaveLength(3);
  });
});

describe('GET /api/products/[id]', () => {
  it('returns the product', async () => {
    const product = mockProducts[0];
    const response = await getProductById(createRequest(`/api/products/${product.id}`), {
      params: Promise.resolve({ id: product.id }),
    });

    expect(response.status).toBe(200);
    expect((await response.json()).id).toBe(product.id);
  });

  it('returns 404 for an unknown product', async () => {
    const response = await getProductById(createRequest('/api/products/nope'), {
      params: Promise.resolve({ id: 'nope' }),
    });

    expect(response.status).toBe(404);
  });
});
