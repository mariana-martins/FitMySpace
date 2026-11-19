import { expect, test } from '@playwright/test';

/*
 * The app renders design-system components with the design system's tokens and font
 * (docs/migration-plan.md). If tokens.css stops loading, the button loses its brand colour; if the
 * font stops loading, the text falls back to another face. Either fails here before a migration
 * PR puts the component in front of anyone.
 */

/** Sage 700, which `component.button.primary.fill.background.default` resolves to. */
const BRAND_BACKGROUND = 'rgb(51, 95, 63)';
/** Charcoal 900, which `semantic.colour.text.default.base` resolves to. */
const DEFAULT_TEXT = 'rgb(28, 25, 23)';

test.describe('design system in the app', () => {
  test('a design-system button has the brand colour and DM Sans', async ({ page }) => {
    await page.goto('/design-system');

    const heading = page.getByRole('heading', { level: 1, name: 'Design system check' });
    await expect(heading).toBeVisible();
    // Typography inherits its colour, so this also checks the page sets the design system's.
    await expect(heading).toHaveCSS('color', DEFAULT_TEXT);

    const button = page.getByRole('button', { name: 'Save room' });
    await expect(button).toHaveCSS('background-color', BRAND_BACKGROUND);
    await expect(button).toHaveCSS('font-family', /^"DM Sans"/);

    const fontLoaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return document.fonts.check('500 16px "DM Sans"');
    });
    expect(fontLoaded, 'DM Sans is loaded, not only named').toBe(true);
  });

  test("the rest of the app uses DM Sans and the design system's text colour", async ({ page }) => {
    await page.goto('/about');

    const body = page.locator('body');
    await expect(body).toHaveCSS('font-family', /^"DM Sans"/);
    // Step 0 of docs/migration-plan.md: design-system text inherits this colour.
    await expect(body).toHaveCSS('color', DEFAULT_TEXT);
  });

  test('the check page stays out of search results', async ({ page }) => {
    await page.goto('/design-system');

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  });
});
