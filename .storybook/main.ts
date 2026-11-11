import type { StorybookConfig } from '@storybook/nextjs-vite';

/*
 * `storybook build` makes the static site published on GitHub Pages. It has
 * no dev server, so the panels that depend on one would look broken there:
 * the Vitest test runner, the MCP server and the onboarding checklist.
 * `storybook dev` and `vitest` keep them.
 */
const isStaticBuild = process.argv.includes('build');

const devServerAddons = ['@storybook/addon-vitest', '@storybook/addon-mcp'];

const config: StorybookConfig = {
  stories: [
    '../src/components/design-system/**/*.mdx',
    '../src/components/design-system/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    ...(isStaticBuild ? [] : devServerAddons),
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-designs',
    'storybook-addon-pseudo-states',
  ],
  framework: '@storybook/nextjs-vite',
  // Vite would copy the app's public/ folder (images, MSW worker) into the site. No story uses it.
  viteFinal: (viteConfig) => ({ ...viteConfig, publicDir: false }),
  core: {
    disableWhatsNewNotifications: isStaticBuild,
    // project.json lists the project's dependencies for Storybook's own tooling; visitors don't need it.
    disableProjectJson: isStaticBuild,
  },
  features: {
    sidebarOnboardingChecklist: !isStaticBuild,
    menuOnboardingChecklist: !isStaticBuild,
  },
};
export default config;
