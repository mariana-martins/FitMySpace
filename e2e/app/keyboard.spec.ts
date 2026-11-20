import { expect, test, type Page } from '@playwright/test';

import { openHomePage, tabKey, tabUntil } from './support';

/*
 * The keyboard path, and the only suite that also runs in WebKit (docs/adr/0008): focus order is what
 * jsdom cannot see and what the Safari engine is most likely to disagree about. It runs against the
 * app's legacy components today and against the design-system ones after the migration, and that
 * comparison is the point.
 *
 * WebKit moves Tab to links only when full keyboard access is on, so there the journeys press
 * Option+Tab (`tabKey`), the key Safari users press for the same thing.
 */

/** Types a search with the keyboard only, the way a person who never touches the mouse would. */
async function searchByKeyboard(page: Page): Promise<void> {
  await tabUntil(
    page,
    (focused) => focused.tag === 'input' && focused.type === 'search',
    15,
    'the search field',
  );

  await page.keyboard.type('basket');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/query=basket/);
}

test.describe('keyboard', () => {
  test('the skip link is the first stop for the keyboard', async ({ page }) => {
    await openHomePage(page);

    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    // Out of sight is not hidden: the link keeps its box, so toBeVisible() would pass either way.
    await expect(skipLink).not.toBeInViewport();
    await page.keyboard.press(tabKey(page));

    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeInViewport();
  });

  test('activating the skip link hands focus to the main content', async ({ page }) => {
    await openHomePage(page);

    const skipLink = page.getByRole('link', { name: 'Skip to content' });
    await skipLink.focus();
    await skipLink.press('Enter');

    await expect(page).toHaveURL(/#main-content/);
    await expect.poll(() => page.evaluate(() => document.activeElement?.id)).toBe('main-content');
  });

  test('the keyboard reaches the search field and submits a search', async ({ page }) => {
    await openHomePage(page);

    await searchByKeyboard(page);
  });

  test('a product card opens with Enter', async ({ page }) => {
    await openHomePage(page);
    await searchByKeyboard(page);

    const productLink = await tabUntil(
      page,
      (focused) => focused.href?.startsWith('/products/') ?? false,
      40,
      'a product card link',
    );
    await page.keyboard.press('Enter');

    await expect(page).toHaveURL(/\/products\/\d+/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(productLink.text);
  });
});
