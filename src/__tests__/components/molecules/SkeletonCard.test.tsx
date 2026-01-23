import { SkeletonCard } from '@/components/molecules/SkeletonCard';
import { render, screen } from '@/__tests__/utils';

describe('SkeletonCard', () => {
  it('renders correctly', () => {
    render(<SkeletonCard data-testid="skeleton-card" />);
    expect(screen.getByTestId('skeleton-card')).toBeInTheDocument();
  });

  it('contains multiple skeleton elements', () => {
    render(<SkeletonCard data-testid="skeleton-card" />);
    const card = screen.getByTestId('skeleton-card');
    const skeletons = card.querySelectorAll('[aria-busy="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('has border and rounded corners', () => {
    render(<SkeletonCard data-testid="skeleton-card" />);
    const card = screen.getByTestId('skeleton-card');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
  });

  it('merges custom className', () => {
    render(<SkeletonCard className="custom-class" data-testid="skeleton-card" />);
    expect(screen.getByTestId('skeleton-card')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<SkeletonCard ref={ref} data-testid="skeleton-card" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional props', () => {
    render(<SkeletonCard data-testid="skeleton-card" id="custom-id" />);
    expect(screen.getByTestId('skeleton-card')).toHaveAttribute('id', 'custom-id');
  });
});
