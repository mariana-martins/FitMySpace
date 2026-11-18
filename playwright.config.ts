import { defineConfig, devices } from '@playwright/test';

/*
 * App journeys (docs/adr/0008-e2e-before-migration.md): search, filter, pagination, the product
 * 404 and the keyboard path. They use roles and accessible names only, so they keep passing when
 * a legacy component is swapped for a design-system one — which is exactly what they are here to
 * watch over.
 *
 * They run against a production build on its own port, so `npm run dev` stays free and MSW never
 * answers a request: the dev-only worker is skipped in a production build, and the route handlers
 * and server components read the data layer in `src/lib/products.ts` directly.
 */
const PORT = 3100;
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e/app',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // A journey touches a streamed server component, so a CI runner under load can miss a deadline.
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    // A cold `next build` on a CI runner is the slow part of this job.
    timeout: 300_000,
    env: { NEXT_TELEMETRY_DISABLED: '1', PORT: String(PORT) },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    /*
     * The Safari engine, and only for the keyboard path: focus order and the skip link are what
     * differs most between engines, and nothing else in the repo touches WebKit. Widening this to
     * every journey is a later decision, not a default.
     */
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testMatch: 'keyboard.spec.ts' },
  ],
});
