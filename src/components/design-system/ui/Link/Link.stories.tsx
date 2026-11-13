import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Text } from '../Typography';
import { useState } from 'react';
import { Link } from './';

const meta = {
  title: 'Design System/Components/Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    href: '#recent',
    children: 'Recent arrivals',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Link` component takes people to another page or place. It renders a native `<a>`, or your router link through `asChild`.\n\n' +
          '### Best Practices\n' +
          '- **Links go somewhere:** Use a link to navigate and a `Button` to act (submit, open, delete). Never give a link `href="#"` to make it behave like a button.\n' +
          '- **Pick the appearance by context:** `inline` (default) inside a sentence; `standalone` for links on their own, such as the main navigation, a footer or "See all products".\n' +
          '- **Say where it goes:** The text should make sense out of context ("Read the returns policy", never "click here"); screen readers often list links on their own.\n' +
          '- **Current page:** In navigation, set `aria-current="page"` on the link to the page people are on. The standalone underline stays visible on it.\n' +
          "- **New tabs:** Avoid them. When a link must open a new tab, such as a store's own website, use `opensInNewTab`, which says so with an icon and to screen readers.\n\n" +
          '### Key Features\n' +
          '- **2 appearances** — `inline` keeps a resting underline so it never depends on colour alone (WCAG 1.4.1); `standalone` is dark at rest and, on hover, turns sage while an underline in the same colour slides in from the left and leaves to the right, in a calm 400ms.\n' +
          "- **3 sizes** for standalone links (`sm`, `md`, `lg`), on the `Label` styles, or the parent's font when `size` is left out.\n" +
          '- **`asChild`** — Radix `Slot` merges the styles and props onto Next.js `<Link>` or any router link.\n' +
          '- **`stretched`** — makes a whole `Card` the click area of its title link, with the focus ring around the card.\n' +
          '- **Motion and contrast** — the animation stops with `prefers-reduced-motion`, and Windows High Contrast gets a real underline.',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    href: '#recent',
    children: 'Recent arrivals',
    appearance: 'standalone',
    size: 'md',
    opensInNewTab: false,
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The link text. Say where the link goes, even out of context.',
    },
    href: {
      control: 'text',
      description: 'The destination URL.',
    },
    appearance: {
      control: { type: 'inline-radio' },
      options: ['inline', 'standalone'],
      description:
        '`inline` (default) inside running text, always underlined; `standalone` on its own, with an animated underline on hover.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description:
        'Type size of a standalone link, on the `Label` styles. Leave it out to take the font of the parent, e.g. a card title. An inline link always takes the size of its text.',
    },
    opensInNewTab: {
      control: 'boolean',
      description:
        'Opens the page in a new tab, with a safe `rel`, an icon and a screen-reader "(opens in a new tab)".',
    },
    stretched: {
      control: false,
      description: 'Stretches the click area over the nearest positioned ancestor, such as a Card.',
    },
    asChild: {
      control: false,
      description: 'Render as the child element (Radix Slot), e.g. Next.js `<Link>`.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Recent arrivals' })).toHaveAttribute(
      'href',
      '#recent',
    );
  },
};

/* ---------------------------------------------------------------
 * Appearances
 * --------------------------------------------------------------- */

export const AllAppearances: Story = {
  name: 'Inline and Standalone',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '32rem' }}>
      <Text style={{ margin: 0 }}>
        Need a hand? Read our <Link href="#returns">returns policy</Link> or{' '}
        <Link href="#contact">contact the team</Link> before you order.
      </Text>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="#recent" appearance="standalone">
          Recent arrivals
        </Link>
        <Link href="#about" appearance="standalone">
          About us
        </Link>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Choose the appearance by where the link sits.\n\n' +
          '- **`inline`** (default) — inside a sentence. It takes the font of the text around it and keeps a thin underline at rest, so people can find it without relying on colour. It stays sage, darkens on hover, and the underline thickens.\n' +
          '- **`standalone`** — on its own, where the context already says it is a link: the main navigation, a footer, a "See all" link. It is dark like the text around it, with no underline; on hover the text turns sage and a sage underline slides in from the left and leaves to the right. Hover each link to compare.',
      },
      source: {
        code: `<Text>\n  Read our <Link href="/returns">returns policy</Link> before you order.\n</Text>\n<Link href="/recent" appearance="standalone">Recent arrivals</Link>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const inlineLink = canvas.getByRole('link', { name: 'returns policy' });
    const standaloneLink = canvas.getByRole('link', { name: 'About us' });
    await expect(getComputedStyle(inlineLink).textDecorationLine).toBe('underline');
    await expect(getComputedStyle(standaloneLink).textDecorationLine).toBe('none');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem' }}>
      <Link href="#large" appearance="standalone" size="lg">
        Large
      </Link>
      <Link href="#medium" appearance="standalone" size="md">
        Medium
      </Link>
      <Link href="#small" appearance="standalone" size="sm">
        Small
      </Link>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Standalone links come in 3 sizes on the `Label` styles: `lg` (16px) for the main navigation, `md` (14px, default) for most links, and `sm` (12px) for footers and dense lists. All three use the medium weight of `Label`, so a standalone link reads as a control. Leave `size` out to take the font of the parent, such as a card title inside a `Heading`. Inline links have no size: they match the sentence they sit in.',
      },
      source: {
        code: `<Link href="/recent" appearance="standalone" size="lg">Recent arrivals</Link>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Opens in a new tab
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'Opens in a New Tab',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text style={{ margin: 0 }}>
        Sold by{' '}
        <Link href="https://www.ikea.com" opensInNewTab>
          IKEA
        </Link>
        .
      </Text>
      <Link href="https://www.muji.com" appearance="standalone" opensInNewTab>
        Visit the Muji store
      </Link>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`opensInNewTab` sets `target="_blank"` with `rel="noopener noreferrer"`, adds an arrow icon and tells screen readers "(opens in a new tab)". Use it only when leaving the page would lose people\'s place, such as a store\'s own website.',
      },
      source: {
        code: `<Link href="https://www.ikea.com" opensInNewTab>IKEA</Link>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ikea = canvas.getByRole('link', { name: 'IKEA (opens in a new tab)' });
    await expect(ikea).toHaveAttribute('target', '_blank');
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="#default" appearance="standalone">
          Default
        </Link>
        <Link href="#hover" appearance="standalone" className="pseudo-hover">
          Hover
        </Link>
        <Link href="#focus" appearance="standalone" className="pseudo-focus-visible">
          Focus
        </Link>
        <Link href="#current" appearance="standalone" aria-current="page">
          Current page
        </Link>
      </div>
      <Text style={{ margin: 0 }}>
        Inline: <Link href="#inline-default">default</Link>,{' '}
        <Link href="#inline-hover" className="pseudo-hover">
          hover
        </Link>{' '}
        and{' '}
        <Link href="#inline-focus" className="pseudo-focus-visible">
          focus
        </Link>
        .
      </Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states with the `storybook-addon-pseudo-states` plugin.\n\n' +
          '- **Hover** — a standalone link turns from dark to sage and gains a 2px sage underline that slides in from the left; an inline link darkens and its underline thickens from 1px to 2px.\n' +
          '- **Focus** — keyboard focus draws the shared sage focus ring around the link.\n' +
          '- **Current page** — `aria-current="page"` keeps the standalone link sage with its underline visible, so people see where they are.\n\n' +
          'You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Main navigation (recipe)
 * --------------------------------------------------------------- */

const NAVIGATION_ITEMS = [
  { name: 'Recent arrivals', href: '#recent' },
  { name: 'Rooms', href: '#rooms' },
  { name: 'About us', href: '#about' },
] as const;

function MainNavigation() {
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

export const NavigationExample: Story = {
  name: 'Main Navigation (A11y)',
  render: () => <MainNavigation />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for the main navigation: a `<nav>` with an `aria-label`, a list of standalone links, and `aria-current="page"` on the link to the current page, so screen readers announce "current page" and the underline stays. In the app, wrap Next.js `<Link>` with `asChild` and compare the path with `usePathname()`.',
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
