import { ProductCard } from '@/components/organisms/ProductCard';
import { render, screen } from '@/__tests__/utils';
import { Room, type Product } from '@/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt, ...props }: { alt: string; [key: string]: unknown }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />;
  },
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Organizer',
  description: 'A great organizing solution for your home',
  price: 29.99,
  currency: 'AUD',
  image: 'https://example.com/image.jpg',
  store: { id: '1', name: 'Test Store', url: 'https://teststore.com' },
  room: Room.KITCHEN,
  dimensions: { length: 30, width: 20, height: 15, unit: 'cm' },
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Organizer')).toBeInTheDocument();
  });

  it('renders product description', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('A great organizing solution for your home')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders store name badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  it('renders room label badge', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
  });

  it('renders product image', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByRole('img', { name: 'Test Organizer' });
    expect(image).toBeInTheDocument();
  });

  it('links to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link', { name: /view details for test organizer/i });
    expect(link).toHaveAttribute('href', '/products/1');
  });

  it('has correct aria-label for accessibility', () => {
    render(<ProductCard product={mockProduct} />);
    expect(
      screen.getByRole('link', { name: /view details for test organizer/i }),
    ).toBeInTheDocument();
  });

  it('renders dimensions when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/30.*20.*15.*cm/i)).toBeInTheDocument();
  });

  it('does not render dimensions when not available', () => {
    const productWithoutDimensions = { ...mockProduct, dimensions: undefined };
    const { container } = render(<ProductCard product={productWithoutDimensions} />);
    expect(container.textContent).not.toMatch(/cm/);
  });

  it('has focus styles for accessibility', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus-visible:ring-2');
  });

  it('has hover shadow effect', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:shadow-lg');
  });
});
