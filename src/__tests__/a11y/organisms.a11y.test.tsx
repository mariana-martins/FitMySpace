/**
 * Accessibility (a11y) tests for organism components
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import { Room, type Product } from '@/types';
import { render } from '@/__tests__/utils';

expect.extend(toHaveNoViolations);

import { ProductGridSkeleton } from '@/components/organisms/ProductGrid';
import { ProductGrid } from '@/components/organisms/ProductGrid';
import { ProductCard } from '@/components/organisms/ProductCard';
import { Footer } from '@/components/organisms/Footer';

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt, ...props }: { alt: string; [key: string]: unknown }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  },
}));

const mockProduct: Product = {
  id: '1',
  name: 'Kitchen Organizer Bins',
  description: 'Set of 4 clear bins for pantry organization',
  price: 29.99,
  currency: 'AUD',
  image: 'https://example.com/image.jpg',
  store: { id: '1', name: 'The Container Store', url: 'https://containerstore.com' },
  room: Room.KITCHEN,
  dimensions: { length: 30, width: 20, height: 15, unit: 'cm' },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

const mockProducts: Product[] = [
  mockProduct,
  { ...mockProduct, id: '2', name: 'Bathroom Caddy', room: Room.BATHROOM },
  { ...mockProduct, id: '3', name: 'Office Drawer Organizer', room: Room.OFFICE },
];

describe('Organisms Accessibility', () => {
  describe('Footer', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ProductCard', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ProductCard product={mockProduct} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations without dimensions', async () => {
      const productWithoutDimensions = { ...mockProduct, dimensions: undefined };
      const { container } = render(<ProductCard product={productWithoutDimensions} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ProductGrid', () => {
    it('should have no accessibility violations with products', async () => {
      const { container } = render(<ProductGrid products={mockProducts} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when empty', async () => {
      const { container } = render(
        <ProductGrid
          products={[]}
          emptyTitle="No products found"
          emptyDescription="Try a different search"
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('ProductGridSkeleton', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<ProductGridSkeleton count={4} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
