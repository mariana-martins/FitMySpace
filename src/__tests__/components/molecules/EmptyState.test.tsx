import { EmptyState } from '@/components/molecules/EmptyState';
import { render, screen } from '@/__tests__/utils';

describe('EmptyState', () => {
  it('renders title correctly', () => {
    render(<EmptyState title="No results found" />);
    expect(screen.getByRole('heading', { name: 'No results found' })).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="No results" description="Try a different search" />);
    expect(screen.getByText('Try a different search')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(<EmptyState title="No results" />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs.length).toBe(0);
  });

  it('has role="status" for accessibility', () => {
    render(<EmptyState title="Empty" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-live="polite" for screen readers', () => {
    render(<EmptyState title="Empty" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });

  it('renders icon with aria-hidden', () => {
    render(<EmptyState title="Empty" />);
    const icon = screen.getByRole('status').querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('merges custom className', () => {
    render(<EmptyState title="Empty" className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<EmptyState title="Empty" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
