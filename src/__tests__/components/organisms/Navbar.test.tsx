import { Navbar } from '@/components/organisms/Navbar';
import { render, screen } from '@/__tests__/utils';

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

  it('renders navigation links', () => {
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
});
