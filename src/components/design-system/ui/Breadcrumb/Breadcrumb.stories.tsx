import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from './';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Heading } from '../Typography';
import { Bath } from 'lucide-react';

const DEFAULT_TRAIL = (
  <>
    <BreadcrumbItem>
      <BreadcrumbLink href="#home" home>
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#rooms">Rooms</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#bathroom">Bathroom</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbItem>
      <BreadcrumbLink href="#bamboo-shower-caddy" aria-current="page">
        Bamboo shower caddy
      </BreadcrumbLink>
    </BreadcrumbItem>
  </>
);

const meta = {
  title: 'Design System/Components/Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: {
    size: 'md',
    separator: 'chevron',
    children: DEFAULT_TRAIL,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Breadcrumb` component shows where the user sits in the site hierarchy and links back to every ancestor page. It wraps an ordered list (`<ol>`) inside a `<nav>` landmark.\n\n' +
          '### Best Practices\n' +
          '- **Use for hierarchies only:** Breadcrumbs show parent pages (`Home › Rooms › Bathroom › Product`). Do not use them for view switching (`Tabs`) or site-wide top menus (`Link`).\n' +
          '- **Keep the current page as a link:** Put `aria-current="page"` on the final `BreadcrumbLink` so the trail structure stays consistent and screen readers announce "current page".\n' +
          '- **Keep labels concise:** Match each step to its destination page title so people recognize where each link leads.\n' +
          '- **One landmark name:** `Breadcrumb` sets `aria-label="Breadcrumb"` automatically so screen readers distinguish it from the main `<nav>`.\n\n' +
          '### Key Features\n' +
          '- **Semantic HTML** — renders `<nav aria-label="Breadcrumb">` and an `<ol>` with decorative `aria-hidden` dividers inside each `<li>`.\n' +
          '- **2 sizes** (`sm` 12px, `md` 14px) with heavier weight and darker text on `[aria-current="page"]`.\n' +
          '- **2 separators** — `chevron` (Lucide chevron, default) or `slash` (`/`).\n' +
          '- **Home and custom icons** — pass `home` on the root `BreadcrumbLink` to render Lucide’s `Home` icon, or `icon` for a custom leading icon.\n' +
          '- **`asChild` support** — Radix `Slot` on `BreadcrumbLink` forwards styles and `aria-current` onto Next.js `<Link>` or any router link.\n' +
          '- **Reflow and contrast** — items wrap cleanly on narrow screens, meet 24px target height (WCAG 2.5.8), and restore an underline on the current page in Windows High Contrast.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    size: 'md',
    separator: 'chevron',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'Type size and divider scale of the trail. Defaults to `md`.',
    },
    separator: {
      control: { type: 'inline-radio' },
      options: ['chevron', 'slash'],
      description: 'Decorative divider placed between items. Defaults to `chevron`.',
    },
    children: {
      control: false,
      description: 'Ordered `BreadcrumbItem` elements.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
      source: {
        code: `<Breadcrumb size="md" separator="chevron">\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/" home>Home</BreadcrumbLink>\n  </BreadcrumbItem>\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/rooms">Rooms</BreadcrumbLink>\n  </BreadcrumbItem>\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/rooms/bathroom" aria-current="page">\n      Bathroom\n    </BreadcrumbLink>\n  </BreadcrumbItem>\n</Breadcrumb>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const navigation = canvas.getByRole('navigation', { name: 'Breadcrumb' });
    await expect(within(navigation).getAllByRole('listitem')).toHaveLength(4);
    await expect(
      within(navigation).getByRole('link', { name: 'Bamboo shower caddy' }),
    ).toHaveAttribute('aria-current', 'page');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Breadcrumb size="md" aria-label="Medium breadcrumb">
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#kitchen">Kitchen</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#drawer-organisers" aria-current="page">
            Drawer organisers
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb size="sm" aria-label="Small breadcrumb">
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#kitchen">Kitchen</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#drawer-organisers" aria-current="page">
            Drawer organisers
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`md` (14px, default) works above page headings; `sm` (12px) suits compact product headers and dense mobile layouts.',
      },
      source: {
        code: `<Breadcrumb size="sm">\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/" home>Home</BreadcrumbLink>\n  </BreadcrumbItem>\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/kitchen" aria-current="page">Kitchen</BreadcrumbLink>\n  </BreadcrumbItem>\n</Breadcrumb>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Breadcrumb aria-label="Breadcrumb with a room icon">
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#bathroom" icon={<Bath />}>
            Bathroom
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#towel-racks" aria-current="page">
            Towel racks
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb aria-label="Breadcrumb with an icon-only home">
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home aria-label="Home" />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#bathroom">Bathroom</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#towel-racks" aria-current="page">
            Towel racks
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`home` adds the Lucide `Home` icon before the first step; `icon` takes any icon, such as a room, and wins over `home` when both are set. Icons are decorative and hidden from screen readers. For a compact trail, leave the Home link without text and give it `aria-label="Home"`, so it keeps an accessible name.',
      },
      source: {
        code: `<BreadcrumbLink href="/" home>Home</BreadcrumbLink>\n<BreadcrumbLink href="/rooms/bathroom" icon={<Bath />}>Bathroom</BreadcrumbLink>\n\n{/* Icon only */}\n<BreadcrumbLink href="/" home aria-label="Home" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const compactTrail = canvas.getByRole('navigation', {
      name: 'Breadcrumb with an icon-only home',
    });
    await expect(within(compactTrail).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '#home',
    );
  },
};

/* ---------------------------------------------------------------
 * Separators
 * --------------------------------------------------------------- */

export const Separators: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <Breadcrumb separator="chevron" aria-label="Breadcrumb with chevron separator">
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#wardrobe">Wardrobe</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#linen-boxes" aria-current="page">
            Linen storage boxes
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Breadcrumb separator="slash" aria-label="Breadcrumb with slash separator">
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#wardrobe">Wardrobe</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#linen-boxes" aria-current="page">
            Linen storage boxes
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Choose between `chevron` (default) and `slash` (`/`). Both dividers are marked `aria-hidden="true"` so screen readers announce the hierarchy cleanly without reading punctuation.',
      },
      source: {
        code: `<Breadcrumb separator="slash">\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/" home>Home</BreadcrumbLink>\n  </BreadcrumbItem>\n  <BreadcrumbItem>\n    <BreadcrumbLink href="/wardrobe" aria-current="page">Wardrobe</BreadcrumbLink>\n  </BreadcrumbItem>\n</Breadcrumb>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <Breadcrumb>
      <BreadcrumbItem>
        <BreadcrumbLink href="#default">Default</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#hover" className="pseudo-hover">
          Hover
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#focus" className="pseudo-focus-visible">
          Focus
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbItem>
        <BreadcrumbLink href="#current" aria-current="page">
          Current page
        </BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates interactive states with `storybook-addon-pseudo-states`:\n\n' +
          '- **Default** — ancestor links stay subtle charcoal so they do not compete with the page heading.\n' +
          '- **Hover** — turns sage and gains an underline.\n' +
          '- **Focus** — shows the shared sage focus ring and an underline.\n' +
          '- **Current page** — `aria-current="page"` uses darker default ink and medium weight.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Product page trail (recipe)
 * --------------------------------------------------------------- */

export const ProductPageExample: Story = {
  name: 'Product Page Trail (A11y)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '22rem' }}>
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="#home" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#rooms">Rooms</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#bathroom">Bathroom</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#wall-shelves">Wall shelves & caddies</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="#bamboo-shower-caddy" aria-current="page">
            Bamboo shower caddy
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Heading level={1} size="lg" style={{ margin: 0 }}>
        Bamboo shower caddy
      </Heading>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A recipe placing `Breadcrumb` above a page heading inside a narrow column to show wrapping behaviour without horizontal scroll. With Next.js App Router, wrap `<NextLink>` with `asChild` on each `BreadcrumbLink`.',
      },
      source: {
        code: `<Breadcrumb>\n  {crumbs.map((crumb, index) => (\n    <BreadcrumbItem key={crumb.href}>\n      <BreadcrumbLink\n        asChild\n        home={index === 0}\n        aria-current={index === crumbs.length - 1 ? 'page' : undefined}\n      >\n        <NextLink href={crumb.href}>{crumb.label}</NextLink>\n      </BreadcrumbLink>\n    </BreadcrumbItem>\n  ))}\n</Breadcrumb>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Bamboo shower caddy',
    );
    await expect(canvas.getByRole('link', { name: 'Bamboo shower caddy' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
