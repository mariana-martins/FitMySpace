import { getProduct, getRecentProducts, getStores, searchProducts } from '@/lib/products';
import { mockProducts, mockStores } from '@/mocks/data';
import { Room } from '@/types';

const isSortedNewestFirst = (dates: string[]) =>
  dates.every((date, i) => i === 0 || new Date(dates[i - 1]) >= new Date(date));

describe('searchProducts', () => {
  it('returns paginated results with total, page and limit', async () => {
    const result = await searchProducts({ page: 1, limit: 5 });

    expect(result.products).toHaveLength(5);
    expect(result.total).toBe(mockProducts.length);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(5);
  });

  it('returns the next slice on page 2', async () => {
    const page1 = await searchProducts({ page: 1, limit: 5 });
    const page2 = await searchProducts({ page: 2, limit: 5 });

    const page1Ids = page1.products.map((p) => p.id);
    expect(page2.products.every((p) => !page1Ids.includes(p.id))).toBe(true);
  });

  it('sorts results by most recent first', async () => {
    const result = await searchProducts({ limit: mockProducts.length });

    expect(isSortedNewestFirst(result.products.map((p) => p.createdAt))).toBe(true);
  });

  it('filters by query in name or description, case-insensitively', async () => {
    const result = await searchProducts({ query: 'PANTRY' });

    expect(result.total).toBeGreaterThan(0);
    result.products.forEach((product) => {
      const text = `${product.name} ${product.description}`.toLowerCase();
      expect(text).toContain('pantry');
    });
  });

  it('filters by store', async () => {
    const result = await searchProducts({ store: '2' });

    expect(result.total).toBeGreaterThan(0);
    result.products.forEach((product) => expect(product.store.id).toBe('2'));
  });

  it('filters by room', async () => {
    const result = await searchProducts({ room: Room.KITCHEN });

    expect(result.total).toBeGreaterThan(0);
    result.products.forEach((product) => expect(product.room).toBe(Room.KITCHEN));
  });

  it('does not mutate the source data order', async () => {
    const originalIds = mockProducts.map((p) => p.id);
    await searchProducts({ limit: mockProducts.length });

    expect(mockProducts.map((p) => p.id)).toEqual(originalIds);
  });
});

describe('getRecentProducts', () => {
  it('returns at most `limit` products, newest first', async () => {
    const result = await getRecentProducts(3);

    expect(result).toHaveLength(3);
    expect(isSortedNewestFirst(result.map((p) => p.createdAt))).toBe(true);
  });
});

describe('getProduct', () => {
  it('returns the product with the given ID', async () => {
    const product = await getProduct(mockProducts[0].id);

    expect(product).toEqual(mockProducts[0]);
  });

  it('returns null for an unknown ID', async () => {
    expect(await getProduct('does-not-exist')).toBeNull();
  });
});

describe('getStores', () => {
  it('returns all stores', async () => {
    expect(await getStores()).toEqual(mockStores);
  });
});
