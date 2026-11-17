import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Link } from '../../ui/Link';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Main navigation (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Main Navigation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The few links to the main sections of the site, with the current one marked.\n\n' +
          '### When to Use\n' +
          '- **The site header:** a handful of top-level sections that stay the same on every page.\n' +
          '- **Not for:** a long list of categories (it needs a menu), or the steps back from a deep page (use the Product Page Header trail).\n\n' +
          '### Anatomy\n' +
          '- `<nav aria-label="Main navigation">` — the landmark.\n' +
          '- A list (`<ul>`) of standalone `Link`s, `size="lg"`.\n' +
          '- `aria-current="page"` on the link to the page you are on.\n\n' +
          '### Accessibility\n' +
          '- **A named landmark:** screen readers list it as "Main navigation" and can jump to it; give a second `<nav>` on the page a different name.\n' +
          '- **The current page is said and seen:** `aria-current="page"` makes screen readers say "current page", and the link keeps its underline, so the state does not rest on colour.\n' +
          '- **The list tells the count:** "list, 3 items".\n\n' +
          '### In the App\n' +
          '- Wrap Next.js `<Link>` with `asChild` and compare each `href` with `usePathname()`. On a phone, the same list moves into a menu (a later pattern).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAVIGATION_ITEMS = [
  { name: 'Recent arrivals', href: '#recent' },
  { name: 'Rooms', href: '#rooms' },
  { name: 'About us', href: '#about' },
] as const;

function MainNavigationRecipe() {
  const [currentHref, setCurrentHref] = useState<string>(NAVIGATION_ITEMS[0].href);

  return (
    <nav aria-label="Main navigation">
      <ul style={{ display: 'flex', gap: '1.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
        {NAVIGATION_ITEMS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              appearance="standalone"
              size="lg"
              aria-current={item.href === currentHref ? 'page' : undefined}
              onClick={(event) => {
                event.preventDefault();
                setCurrentHref(item.href);
              }}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------------------------------------------------------------
 * Main navigation
 * --------------------------------------------------------------- */

export const MainNavigation: Story = {
  name: 'Main Navigation (A11y)',
  render: () => <MainNavigationRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Click a section: it becomes the current page, marked for screen readers and by its underline.',
      },
      source: {
        code: `<nav aria-label="Main navigation">\n  <ul>\n    {navigation.map((item) => (\n      <li key={item.href}>\n        <Link\n          asChild\n          appearance="standalone"\n          size="lg"\n          aria-current={pathname === item.href ? 'page' : undefined}\n        >\n          <NextLink href={item.href}>{item.name}</NextLink>\n        </Link>\n      </li>\n    ))}\n  </ul>\n</nav>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Main navigation' });
    await expect(within(navigation).getByRole('link', { name: 'Recent arrivals' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(within(navigation).getAllByRole('listitem')).toHaveLength(3);
  },
};
