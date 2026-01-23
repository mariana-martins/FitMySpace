import { Footer } from '@/components/organisms/Footer';
import { render, screen } from '@/__tests__/utils';

describe('Footer', () => {
  it('renders footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders brand name', () => {
    render(<Footer />);
    expect(screen.getByText('Fit My Space')).toBeInTheDocument();
  });

  it('renders tagline', () => {
    render(<Footer />);
    expect(screen.getByText(/find your perfect/i)).toBeInTheDocument();
    expect(screen.getByText(/home organization products/i)).toBeInTheDocument();
  });

  it('renders shopping bag icon', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    const icon = footer.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('has border styling', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('border-t');
  });
});
