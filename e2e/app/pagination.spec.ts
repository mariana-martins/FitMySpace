import { expect, test } from '@playwright/test';

import {
  PRODUCTS_PER_PAGE,
  openHomePage,
  pagination,
  productCards,
  searchThroughApi,
} from './support';

function lastPageNumber(total: number): number {
  return Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE));
}

function cardsOnLastPage(total: number): number {
  return total - (lastPageNumber(total) - 1) * PRODUCTS_PER_PAGE;
}

test.describe('pagination', () => {
  test('the last page holds what is left, and the controls say where they are', async ({
    page,
  }) => {
    await openHomePage(page);

    const { total } = await searchThroughApi(page);
    test.skip(total <= PRODUCTS_PER_PAGE, 'the catalogue fits on one page');
    const lastPage = lastPageNumber(total);

    await expect(pagination(page)).toBeVisible();
    await expect(productCards(page)).toHaveCount(PRODUCTS_PER_PAGE);
    await expect(page.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();

    await page.getByRole('button', { name: `Go to page ${lastPage}` }).click();

    await expect(page).toHaveURL(new RegExp(`page=${lastPage}`));
    await expect(productCards(page)).toHaveCount(cardsOnLastPage(total));
    await expect(page.getByRole('button', { name: `Go to page ${lastPage}` })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.getByRole('button', { name: 'Go to next page' })).toBeDisabled();

    await page.getByRole('button', { name: 'Go to previous page' }).click();

    // Page 1 is the URL without a `page` param, which is how `usePagination` writes it.
    const previousPage = lastPage - 1;
    await expect(page).toHaveURL(previousPage > 1 ? new RegExp(`page=${previousPage}$`) : /\/$/);
    await expect(productCards(page)).toHaveCount(PRODUCTS_PER_PAGE);
  });

  test('a page beyond the last one offers the last page instead', async ({ page }) => {
    await page.goto('/?page=99');

    const { total } = await searchThroughApi(page);
    const lastPage = lastPageNumber(total);
    test.skip(total <= PRODUCTS_PER_PAGE, 'the catalogue fits on one page');

    const message = page.getByRole('status');
    await expect(message.getByRole('heading', { name: /Page 99 doesn.t exist/ })).toBeVisible();
    await expect(message).toContainText(`only go up to page ${lastPage}`);

    await page.getByRole('button', { name: `Go to page ${lastPage}` }).click();

    await expect(page).toHaveURL(new RegExp(`page=${lastPage}`));
    await expect(productCards(page)).toHaveCount(cardsOnLastPage(total));
  });
});
