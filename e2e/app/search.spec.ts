import { expect, test } from '@playwright/test';

import {
  expectedCardsOnFirstPage,
  openHomePage,
  productCards,
  productGrid,
  searchField,
  searchFor,
  searchThroughApi,
} from './support';

test.describe('search', () => {
  test('a search narrows the results and puts the term in the URL', async ({ page }) => {
    await openHomePage(page);

    const matches = await searchThroughApi(page, { query: 'pantry' });
    await searchFor(page, 'pantry');

    await expect(page).toHaveURL(/query=pantry/);
    await expect(productCards(page)).toHaveCount(expectedCardsOnFirstPage(matches.total));

    // Every match contains the term in its name or its description, and the card shows both.
    await expect(productCards(page).filter({ hasText: /pantry/i })).toHaveCount(
      expectedCardsOnFirstPage(matches.total),
    );
  });

  test('the Search button submits what was typed', async ({ page }) => {
    await openHomePage(page);

    const matches = await searchThroughApi(page, { query: 'basket' });
    await searchField(page).fill('basket');
    // `exact`, or the Clear search button answers to it too; the filter picks the one on screen
    // (the other one is the mobile button).
    await page
      .getByRole('button', { name: 'Search', exact: true })
      .filter({ visible: true })
      .click();

    await expect(page).toHaveURL(/query=basket/);
    await expect(productCards(page)).toHaveCount(expectedCardsOnFirstPage(matches.total));
  });

  test('a search with no matches says so and says what to change', async ({ page }) => {
    await openHomePage(page);

    await searchFor(page, 'nothingmatches thisterm');

    const message = page.getByRole('status');
    await expect(
      message.getByRole('heading', { name: 'No products found for "nothingmatches thisterm"' }),
    ).toBeVisible();
    await expect(message).toContainText('Try adjusting your search terms');
    await expect(productGrid(page)).toHaveCount(0);
  });

  test('clearing the search brings the rest of the catalogue back', async ({ page }) => {
    await openHomePage(page);

    await searchFor(page, 'pantry');
    await expect(page).toHaveURL(/query=pantry/);

    const everything = await searchThroughApi(page);
    await page.getByRole('button', { name: 'Clear search' }).click();

    await expect(page).not.toHaveURL(/query=/);
    await expect(productCards(page)).toHaveCount(expectedCardsOnFirstPage(everything.total));
  });
});
