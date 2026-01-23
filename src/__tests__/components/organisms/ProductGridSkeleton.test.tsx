import { ProductGridSkeleton } from '@/components/organisms/ProductGrid';
import { render, screen } from '@/__tests__/utils';

describe('ProductGridSkeleton', () => {
  it('renders default 8 skeleton cards', () => {
    render(<ProductGridSkeleton />);
    const skeletons = screen.getAllByLabelText('Loading content');
    expect(skeletons.length).toBeGreaterThanOrEqual(8);
  });

  it('renders custom count of skeleton cards', () => {
    render(<ProductGridSkeleton count={4} />);
    const container = screen.getByLabelText('Loading products');
    const cards = container.children;
    expect(cards).toHaveLength(4);
  });

  it('has aria-busy for loading state', () => {
    render(<ProductGridSkeleton />);
    const grid = screen.getByLabelText('Loading products');
    expect(grid).toHaveAttribute('aria-busy', 'true');
  });

  it('has aria-label for accessibility', () => {
    render(<ProductGridSkeleton />);
    expect(screen.getByLabelText('Loading products')).toBeInTheDocument();
  });

  it('has responsive grid classes', () => {
    render(<ProductGridSkeleton />);
    const grid = screen.getByLabelText('Loading products');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('xl:grid-cols-4');
  });

  it('merges custom className', () => {
    render(<ProductGridSkeleton className="custom-class" />);
    const grid = screen.getByLabelText('Loading products');
    expect(grid).toHaveClass('custom-class');
  });
});
