import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { SampleFooter } from '../../docs';

/* ---------------------------------------------------------------
 * Footer (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Footer',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The end of every page: groups of links that are useful from anywhere, and the small print about where the prices come from.\n\n' +
          '### What It Solves\n' +
          'People who reach the bottom of a page are looking for a way on, or for the fine print. The footer gives both in a few named groups, without repeating the whole header.\n\n' +
          '### When to Use\n' +
          '- **Every page of the app,** below the main content.\n' +
          '- **Not for:** the main sections (they are in the Site Header), or anything people need before they scroll.\n\n' +
          '### Anatomy\n' +
          '- A `<footer>` with a faint top border.\n' +
          '- One `<nav>` per group, named by its `Heading`, holding a plain list of standalone `Link`s, `semantic.spacing.gap.md` apart. Not a `List`: its rows are built for an icon, a description and an action, and would spread a column of short links too far apart.\n' +
          '- A `Caption` with the small print.\n\n' +
          '### Accessibility\n' +
          '- **Landmarks:** `<footer>` is the page\'s content information, and each group is a named navigation ("Shop by room"), so the groups can be told apart from the Main Navigation.\n' +
          '- **Headings at level 2,** like the sections of the page, so the footer groups appear in the outline after the content.\n' +
          '- **Links say where they go** on their own ("How we check prices"), because a footer is often read as a list of links.\n\n' +
          '### In the App\n' +
          '- Render it once in the root layout, after `<main>`; wrap Next.js `<Link>` with `asChild`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Footer
 * --------------------------------------------------------------- */

export const Footer: Story = {
  name: 'Footer (A11y)',
  render: () => (
    <div style={{ width: '56rem', maxWidth: '100%' }}>
      <SampleFooter />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Two groups of links and the small print, under a faint line.',
      },
      source: {
        code: `<footer>
  <nav aria-labelledby="footer-rooms">
    <Heading id="footer-rooms" level={2} size="sm">Shop by room</Heading>
    <ul>
      {rooms.map((room) => (
        <li key={room.slug}>
          <Link asChild appearance="standalone" size="sm">
            <NextLink href={\`/rooms/\${room.slug}\`}>{room.name}</NextLink>
          </Link>
        </li>
      ))}
    </ul>
  </nav>
  {/* … the other groups */}
  <Caption>© 2026 FitMySpace. Prices and stock come from each store and can change.</Caption>
</footer>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('contentinfo')).toBeInTheDocument();
    await expect(canvas.getByRole('navigation', { name: 'Shop by room' })).toBeInTheDocument();
    await expect(canvas.getByRole('link', { name: 'How we check prices' })).toBeVisible();
  },
};
