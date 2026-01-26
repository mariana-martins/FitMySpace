import { render, screen, fireEvent } from '@/__tests__/utils';
import { Navbar } from '@/components/organisms/Navbar';

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

  it('has sticky positioning', () => {
    render(<Navbar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sticky');
    expect(nav).toHaveClass('top-0');
  });

  it('has correct z-index for layering', () => {
    render(<Navbar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('z-50');
  });

  it('contains search input container (hidden by default on non-home pages)', () => {
    render(<Navbar />);
    // Search container exists but is invisible initially (controlled by intersection observer)
    const searchContainer = document.querySelector('[aria-hidden]');
    expect(searchContainer).toBeInTheDocument();
  });

  // Mobile menu tests
  it('renders hamburger menu button for mobile navigation', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: 'Open menu' });
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
  });

  it('toggles mobile menu when hamburger button is clicked', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: 'Open menu' });

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByRole('button', { name: 'Close menu' })).toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Mobile navigation menu' })).toBeInTheDocument();

    // Close menu
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('mobile menu has proper accessibility attributes', () => {
    render(<Navbar />);
    const menuButton = screen.getByRole('button', { name: 'Open menu' });

    fireEvent.click(menuButton);

    const mobileMenu = screen.getByRole('dialog', { name: 'Mobile navigation menu' });
    expect(mobileMenu).toHaveAttribute('aria-modal', 'true');
    expect(mobileMenu).toHaveAttribute('id', 'mobile-menu');
  });
});
