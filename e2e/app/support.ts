import { expect, type Locator, type Page } from '@playwright/test';

/*
 * Shared helpers for the app journeys. Everything here finds things the way a person or a screen
 * reader would: a role and a name, never a class or a `data-testid`. That is the point of the suite
 * (docs/adr/0008-e2e-before-migration.md) — a journey that still passes when a legacy component is
 * replaced by a design-system one is what tells the two apart.
 */

/** Products on one results page: `ITEMS_PER_PAGE` in `src/lib/constants.ts`. */
export const PRODUCTS_PER_PAGE = 12;

type ApiProduct = { id: string; name: string };

type ProductSearchBody = {
  products: ApiProduct[];
  total: number;
  page: number;
  limit: number;
};

export function productGrid(page: Page): Locator {
  return page.getByRole('list', { name: 'Product grid' });
}

export function productCards(page: Page): Locator {
  return productGrid(page).getByRole('listitem');
}

export function searchField(page: Page): Locator {
  return page.getByRole('searchbox', { name: 'Search products' });
}

/** Opens the home page and waits for the streamed results to arrive. */
export async function openHomePage(page: Page): Promise<void> {
  await page.goto('/');
  await expect(productCards(page)).not.toHaveCount(0);
}

export async function searchFor(page: Page, term: string): Promise<void> {
  await searchField(page).fill(term);
  await searchField(page).press('Enter');
}

/**
 * Asks the API the same question the page is answering, so the expected count comes from the data
 * layer instead of a number copied into the test. The page caps what it shows at `PRODUCTS_PER_PAGE`.
 */
export async function searchThroughApi(
  page: Page,
  filters: Record<string, string> = {},
): Promise<ProductSearchBody> {
  const params = new URLSearchParams({ limit: '48', ...filters });
  const response = await page.request.get(`/api/products?${params}`);

  expect(response.ok(), `the API answered ${response.status()} for ${params}`).toBe(true);

  return (await response.json()) as ProductSearchBody;
}

/** The first page of results holds a full page, unless the matches run out first. */
export function expectedCardsOnFirstPage(total: number): number {
  return Math.min(total, PRODUCTS_PER_PAGE);
}

export async function chooseStoreFilter(page: Page, storeName: string): Promise<void> {
  await page.getByRole('combobox', { name: 'Filter by store' }).click();
  await page.getByRole('option', { name: storeName }).click();
}

export function pagination(page: Page): Locator {
  return page.getByRole('navigation', { name: 'Pagination' });
}

/**
 * Safari moves Tab to links only with full keyboard access on, a system setting headless WebKit
 * cannot rely on; Option+Tab is Safari's own key for "every focusable element", links included.
 */
export function tabKey(page: Page): string {
  return page.context().browser()?.browserType().name() === 'webkit' ? 'Alt+Tab' : 'Tab';
}

/** What the keyboard has landed on, in the few facts the journeys need to decide where to go next. */
export type FocusedElement = {
  tag: string;
  type: string | null;
  id: string;
  href: string | null;
  text: string;
};

export async function focusedElement(page: Page): Promise<FocusedElement> {
  return page.evaluate(() => {
    const element = document.activeElement;

    if (!(element instanceof HTMLElement)) {
      return { tag: 'none', type: null, id: '', href: null, text: '' };
    }

    return {
      tag: element.tagName.toLowerCase(),
      type: element.getAttribute('type'),
      id: element.id,
      href: element.getAttribute('href'),
      text: (element.textContent ?? '').trim(),
    };
  });
}

/**
 * Tabs until something matches, and fails with the number of presses if nothing does. The journeys
 * ask "can a keyboard reach this", not "is it the fourth stop", so they survive a new nav link.
 */
export async function tabUntil(
  page: Page,
  isTarget: (focused: FocusedElement) => boolean,
  maxTabs: number,
  target: string,
): Promise<FocusedElement> {
  for (let tabs = 1; tabs <= maxTabs; tabs += 1) {
    await page.keyboard.press(tabKey(page));

    const focused = await focusedElement(page);
    if (isTarget(focused)) return focused;
  }

  throw new Error(`never reached ${target} within ${maxTabs} Tab presses`);
}
