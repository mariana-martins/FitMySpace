import { render, screen, within } from '@/__tests__/utils';
import { Navbar } from '@/components/organisms/Navbar';
import userEvent from '@testing-library/user-event';

// Mock useSearch hook
jest.mock('@/hooks/useSearch', () => ({
  useSearch: () => ({
    currentQuery: '',
    handleSearch: jest.fn(),
  }),
}));

describe('Navbar', () => {
  it('renders navigation with correct aria-label', () => {
    render(<Navbar />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('renders brand link', () => {
    render(<Navbar />);
    const brandLink = screen.getByRole('link', { name: 'Fit My Space Home' });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('renders brand text', () => {
    render(<Navbar />);
    expect(screen.getByText('Fit My Space')).toBeInTheDocument();
  });

  it('renders desktop navigation links (hidden on mobile)', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: 'Recent Arrivals' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About Us' })).toBeInTheDocument();
  });

  it('Recent Arrivals links to /recent', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: 'Recent Arrivals' })).toHaveAttribute(
      'href',
      '/recent',
    );
  });

  it('About Us links to /about', () => {
    render(<Navbar />);
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('href', '/about');
  });

  it('contains search input container (hidden by default on non-home pages)', () => {
    render(<Navbar />);
    // Search container exists but is invisible initially (controlled by intersection observer)
    const searchContainer = document.querySelector('[aria-hidden]');
    expect(searchContainer).toBeInTheDocument();
  });

  // Mobile menu tests use userEvent: it fires pointerdown/mousedown before click like a real tap,
  // which is what made the old close button reopen the menu
  it('renders the menu button collapsed and linked to the menu', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);

    const mobileMenu = screen.getByRole('dialog', { name: 'Mobile navigation menu' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(menuButton).toHaveAttribute('aria-controls', mobileMenu.id);
  });

  it('closes the mobile menu with the close button', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('closes the mobile menu on Escape and returns focus to the menu button', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    await user.click(menuButton);
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(menuButton).toHaveFocus();
  });

  it('closes the mobile menu when a link is clicked', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const mobileMenu = screen.getByRole('dialog', { name: 'Mobile navigation menu' });
    await user.click(within(mobileMenu).getByRole('link', { name: 'About Us' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps keyboard focus inside the open mobile menu', async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const mobileMenu = screen.getByRole('dialog', { name: 'Mobile navigation menu' });

    for (let tabPress = 0; tabPress < 6; tabPress++) {
      await user.tab();
      expect(mobileMenu).toContainElement(document.activeElement as HTMLElement);
    }
  });
});
