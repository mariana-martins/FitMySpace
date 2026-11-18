import { expect, test } from '@playwright/test';

import { searchThroughApi } from './support';

test.describe('product page', () => {
  test('a product opens its detail page', async ({ page }) => {
    await page.goto('/');

    const { products } = await searchThroughApi(page);
    const product = products[0];
    expect(product, 'the catalogue has at least one product').toBeDefined();

    await page.goto(`/products/${product.id}`);

    await expect(page.getByRole('heading', { level: 1, name: product.name })).toBeVisible();
  });

  test('an unknown product id answers 404', async ({ page }) => {
    /*
     * A `loading.tsx` anywhere above `/products/[id]` turns this response into a 200 with the not-found
     * page inside it (AGENTS.md). The status line is the whole point of the test, so the look of the
     * page is checked second.
     */
    const response = await page.goto('/products/there-is-no-product-with-this-id');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /couldn.t find that page/ })).toBeVisible();

    await page.getByRole('link', { name: 'Go back home' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('searchbox', { name: 'Search products' })).toBeVisible();
  });
});
