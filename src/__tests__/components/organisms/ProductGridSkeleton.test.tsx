import { ProductGridSkeleton } from '@/components/organisms/ProductGrid';
import { render, screen } from '@/__tests__/utils';

describe('ProductGridSkeleton', () => {
  function getPlaceholderGrid() {
    return screen.getByRole('status').querySelector('.grid') as HTMLElement;
  }

  it('renders 8 skeleton cards by default', () => {
    render(<ProductGridSkeleton />);
    expect(getPlaceholderGrid().children).toHaveLength(8);
  });

  it('renders a custom count of skeleton cards', () => {
    render(<ProductGridSkeleton count={4} />);
    expect(getPlaceholderGrid().children).toHaveLength(4);
  });

  it('announces loading once through a single status region', () => {
    render(<ProductGridSkeleton />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Loading products…');
  });

  it('hides the placeholder cards from assistive tech', () => {
    render(<ProductGridSkeleton />);
    expect(getPlaceholderGrid()).toHaveAttribute('aria-hidden', 'true');
  });

  it('has responsive grid classes', () => {
    render(<ProductGridSkeleton />);
    expect(getPlaceholderGrid()).toHaveClass(
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4',
    );
  });

  it('merges custom className on the status region', () => {
    render(<ProductGridSkeleton className="custom-class" />);
    expect(screen.getByRole('status')).toHaveClass('custom-class');
  });
});
