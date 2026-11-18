import { expect, test } from '@playwright/test';

import {
  chooseStoreFilter,
  expectedCardsOnFirstPage,
  openHomePage,
  productCards,
  searchThroughApi,
} from './support';

/** The store id of `IKEA` in `src/mocks/data.ts`, which is what the filter sends as `?store=`. */
const IKEA_STORE_ID = '2';

test.describe('filters', () => {
  test('a room filter narrows the results and toggles off', async ({ page }) => {
    await openHomePage(page);

    const matches = await searchThroughApi(page, { room: 'kitchen' });
    const kitchen = page.getByRole('button', { name: 'Kitchen' });
    await expect(kitchen).toHaveAttribute('aria-pressed', 'false');

    await kitchen.click();

    await expect(page).toHaveURL(/room=kitchen/);
    await expect(kitchen).toHaveAttribute('aria-pressed', 'true');
    await expect(productCards(page)).toHaveCount(expectedCardsOnFirstPage(matches.total));
    await expect(productCards(page).filter({ hasText: /kitchen/i })).toHaveCount(
      expectedCardsOnFirstPage(matches.total),
    );

    await kitchen.click();

    await expect(page).not.toHaveURL(/room=/);
    await expect(kitchen).toHaveAttribute('aria-pressed', 'false');
  });

  test('the store filter keeps one store', async ({ page }) => {
    await openHomePage(page);

    const matches = await searchThroughApi(page, { store: IKEA_STORE_ID });
    await chooseStoreFilter(page, 'IKEA');

    await expect(page).toHaveURL(new RegExp(`store=${IKEA_STORE_ID}`));
    await expect(productCards(page)).toHaveCount(expectedCardsOnFirstPage(matches.total));
    // The card carries the store's name, so every card on screen must carry this one.
    await expect(productCards(page).filter({ hasText: 'IKEA' })).toHaveCount(
      expectedCardsOnFirstPage(matches.total),
    );

    await chooseStoreFilter(page, 'All Stores');

    await expect(page).not.toHaveURL(/store=/);
    await expect(productCards(page)).toHaveCount(
      expectedCardsOnFirstPage((await searchThroughApi(page)).total),
    );
  });

  test('changing a filter goes back to the first page', async ({ page }) => {
    await page.goto('/?page=2');
    await expect(productCards(page)).not.toHaveCount(0);

    await page.getByRole('button', { name: 'Kitchen' }).click();

    await expect(page).toHaveURL(/room=kitchen/);
    await expect(page).not.toHaveURL(/page=/);
  });
});
