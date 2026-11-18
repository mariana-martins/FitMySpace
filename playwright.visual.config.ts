import { defineConfig, devices } from '@playwright/test';

/*
 * Visual regression over the design system's stories (docs/adr/0007-visual-regression-with-playwright.md).
 * A token change that shifts a colour or a size fails the run until the new baseline is accepted.
 *
 * The stories are screenshotted from the static Storybook build, never from the dev server: the
 * build is what CI screenshots and what GitHub Pages publishes, so a local run looks at the same
 * markup the baseline was made of. `npm run test:visual` builds it first.
 */
const PORT = 6006;
const baseURL = process.env.VISUAL_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e/visual',
  // One worker: every test asks the same renderer for a pixel-identical screenshot.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // A screenshot either matches the baseline or the look changed. Retrying hides nothing useful.
  retries: 0,
  reporter: process.env.CI ? [['list'], ['github']] : [['list']],
  expect: {
    // A full-page screenshot of a long story needs more than the 5s a plain assertion gets.
    timeout: 20_000,
    toHaveScreenshot: {
      // Font smoothing on the same runner image is stable; this only absorbs the odd stray pixel.
      // A colour or size change moves whole areas, orders of magnitude above it.
      maxDiffPixels: 100,
      // Per-pixel colour tolerance. The default (0.2) let Sage 700 move from #335f3f to #2f6b3f
      // without a failure; one renderer on one image needs next to none.
      threshold: 0.01,
      animations: 'disabled',
    },
  },
  /*
   * Baselines live in one folder per browser, named by story id, so a review is a list of PNGs.
   * The default template ends the name with the platform, which would let a macOS run quietly
   * create its own set; without it, a local run compares against the Linux baseline the CI job
   * produced — and shows the font-rendering difference instead of pretending it is not there.
   */
  snapshotDir: './e2e/visual/baselines',
  snapshotPathTemplate: '{snapshotDir}/{projectName}/{arg}{ext}',
  use: {
    baseURL,
    ...devices['Desktop Chrome'],
    trace: 'off',
  },
  webServer: {
    command: `node e2e/support/serve-static.mjs storybook-static ${PORT}`,
    url: `${baseURL}/iframe.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium' }],
});
