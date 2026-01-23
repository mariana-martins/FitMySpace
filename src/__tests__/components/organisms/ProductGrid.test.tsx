import { ProductGrid } from '@/components/organisms/ProductGrid';
import { render, screen } from '@/__tests__/utils';
import { Room, type Product } from '@/types';

// Mock ProductCard to isolate ProductGrid testing
jest.mock('@/components/organisms/ProductCard', () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-card-${product.id}`}>{product.name}</div>
  ),
}));

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 19.99,
    currency: 'AUD',
    image: 'https://example.com/1.jpg',
    store: { id: '1', name: 'Store 1' },
    room: Room.KITCHEN,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 29.99,
    currency: 'AUD',
    image: 'https://example.com/2.jpg',
    store: { id: '2', name: 'Store 2' },
    room: Room.BATHROOM,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z',
  },
];

describe('ProductGrid', () => {
  it('renders products in a grid', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
  });

  it('has role="list" for accessibility', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByRole('list', { name: 'Product grid' })).toBeInTheDocument();
  });

  it('wraps each product in role="listitem"', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders EmptyState when products array is empty', () => {
    render(<ProductGrid products={[]} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('renders EmptyState when products is undefined', () => {
    render(<ProductGrid />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('uses custom empty title', () => {
    render(<ProductGrid products={[]} emptyTitle="Custom empty title" />);
    expect(screen.getByText('Custom empty title')).toBeInTheDocument();
  });

  it('uses custom empty description', () => {
    render(<ProductGrid products={[]} emptyDescription="Custom description" />);
    expect(screen.getByText('Custom description')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<ProductGrid products={mockProducts} className="custom-class" />);
    expect(screen.getByRole('list')).toHaveClass('custom-class');
  });

  it('has responsive grid classes', () => {
    render(<ProductGrid products={mockProducts} />);
    const grid = screen.getByRole('list');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('xl:grid-cols-4');
  });
});
