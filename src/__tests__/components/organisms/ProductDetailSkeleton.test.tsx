import { ProductDetailSkeleton } from '@/components/organisms/ProductDetail';
import { render, screen } from '@/__tests__/utils';

describe('ProductDetailSkeleton', () => {
  it('announces loading once through a single status region', () => {
    render(<ProductDetailSkeleton />);
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveTextContent('Loading product…');
  });

  it('hides the placeholder blocks from assistive tech', () => {
    render(<ProductDetailSkeleton />);
    const placeholders = screen.getByRole('status').querySelectorAll('.animate-pulse');
    expect(placeholders.length).toBeGreaterThan(0);
    placeholders.forEach((placeholder) => {
      expect(placeholder).toHaveAttribute('aria-hidden', 'true');
    });
  });
});
