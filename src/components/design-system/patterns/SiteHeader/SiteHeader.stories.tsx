import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SampleSiteHeader } from '../../docs';

/* ---------------------------------------------------------------
 * Site header (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Site Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The band at the top of every page: the name of the site, the few main sections, and the saved list. On a phone the sections move behind a menu button.\n\n' +
          '### What It Solves\n' +
          'The header is the one thing on every page, so it must be quick to pass and easy to find again. It holds only what is needed everywhere, marks where you are, and on a narrow screen folds away without hiding the links from anyone.\n\n' +
          '### When to Use\n' +
          '- **Every page of the app,** above the main content.\n' +
          '- **Not for:** the steps back from a deep page (that is the Product Page Header trail), or actions on one page (they belong in that page).\n\n' +
          '### Anatomy\n' +
          '- A `<header>`: the brand as a standalone `Link` to the home page.\n' +
          '- The Main Navigation: a `<nav>` with a list of standalone `Link`s, the current one with `aria-current="page"`.\n' +
          '- The saved list: a `Button` rendered as a link, with the star icon.\n' +
          '- On a phone: an icon-only `Button` ("Open the menu") opens a `Dialog` whose body is the same `<nav>`, as a `List` of rows, each a stretched `Link` with an icon.\n\n' +
          '### Accessibility\n' +
          '- **Landmarks:** `<header>` is the banner and `<nav aria-label="Main navigation">` the navigation, so screen readers can jump to or past them.\n' +
          '- **The current page is said and seen** in both layouts (`aria-current="page"`, and the underline or the row).\n' +
          '- **The menu is a modal dialog:** the focus starts on its title ("Menu"), Tab reaches the links, Escape and the Close button shut it, and the focus returns to "Open the menu". Picking a link closes it too.\n' +
          '- **Skip link:** `SkipLink` comes before the header, so a keyboard user can pass it in one key press (see Page Layout).\n' +
          '### In the App\n' +
          "- Compare each `href` with `usePathname()` for `aria-current`, wrap Next.js `<Link>` with `asChild`, and switch between the two layouts with a CSS media query in the app's header component, so both are rendered on the server.\n" +
          '- The phone menu would read better as a sheet sliding in from the side, which the design system does not have yet (see the gaps in the Patterns overview).',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Wide screen
 * --------------------------------------------------------------- */

export const WideScreen: Story = {
  name: 'Wide Screen (A11y)',
  render: () => (
    <div style={{ width: '56rem', maxWidth: '100%' }}>
      <SampleSiteHeader layout="wide" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'On a desktop: the brand on the left, the sections in the middle, the saved list on the right. Click a section to make it the current page.',
      },
      source: {
        code: `<header>
  <Link asChild appearance="standalone" size="lg"><NextLink href="/">FitMySpace</NextLink></Link>

  <nav aria-label="Main navigation">
    <ul>
      {navigation.map((item) => (
        <li key={item.href}>
          <Link asChild appearance="standalone" size="md" aria-current={pathname === item.href ? 'page' : undefined}>
            <NextLink href={item.href}>{item.name}</NextLink>
          </Link>
        </li>
      ))}
    </ul>
  </nav>

  <Button asChild variant="secondary" appearance="outline" size="sm" icon="star">
    <NextLink href="/saved">Saved</NextLink>
  </Button>
</header>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('banner')).toBeInTheDocument();
    const navigation = canvas.getByRole('navigation', { name: 'Main navigation' });
    await expect(within(navigation).getByRole('link', { name: 'Recent arrivals' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

/* ---------------------------------------------------------------
 * On a phone
 * --------------------------------------------------------------- */

export const OnAPhone: Story = {
  name: 'On a Phone (A11y)',
  render: () => (
    <div style={{ width: '22rem', maxWidth: '100%' }}>
      <SampleSiteHeader layout="narrow" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'On a narrow screen the sections fold behind "Open the menu". The menu is a dialog holding the same navigation as rows, the current one marked; picking one closes the menu.',
      },
      source: {
        code: `<header>
  <Link asChild appearance="standalone" size="lg"><NextLink href="/">FitMySpace</NextLink></Link>

  <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
    <DialogTrigger asChild>
      <Button variant="secondary" appearance="ghost" size="md" icon="menu" aria-label="Open the menu" />
    </DialogTrigger>
    <DialogContent size="sm" initialFocus="title" closeLabel="Close the menu">
      <DialogTitle>Menu</DialogTitle>
      <DialogBody>
        <nav aria-label="Main navigation">
          <List size="sm">
            {navigation.map((item) => (
              <ListItem key={item.href} icon={item.icon}>
                <Link asChild appearance="standalone" stretched aria-current={…}>
                  <NextLink href={item.href} onClick={() => setMenuOpen(false)}>{item.name}</NextLink>
                </Link>
              </ListItem>
            ))}
          </List>
        </nav>
      </DialogBody>
    </DialogContent>
  </Dialog>
</header>`,
      },
      story: { height: '480px' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Open the menu' })).toBeEnabled();
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * On a Phone (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const OnAPhoneInteraction: Story = {
  ...OnAPhone,
  name: 'On a Phone (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const menuButton = canvas.getByRole('button', { name: 'Open the menu' });
    await userEvent.click(menuButton);

    const menu = await page.findByRole('dialog', { name: 'Menu' });
    // The menu holds only links, which Radix never focuses first: the title takes the focus,
    // and Tab moves on to the first link.
    await expect(within(menu).getByRole('heading', { name: 'Menu' })).toHaveFocus();
    await userEvent.tab();
    await expect(within(menu).getByRole('link', { name: 'Recent arrivals' })).toHaveFocus();
    await userEvent.click(within(menu).getByRole('link', { name: 'Rooms' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(menuButton).toHaveFocus();

    await userEvent.click(menuButton);
    const reopened = await page.findByRole('dialog', { name: 'Menu' });
    await expect(within(reopened).getByRole('link', { name: 'Rooms' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};
