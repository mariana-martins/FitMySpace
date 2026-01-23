import { ProductDetail } from '@/components/organisms/ProductDetail';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import { Product, Room } from '@/types';

// Mock useRouter since it's used in the component
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'A great test product',
  price: 99.99,
  currency: 'AUD',
  room: Room.LIVING_ROOM,
  store: {
    id: 'store-1',
    name: 'Test Store',
    logo: '/test-logo.png',
    url: 'https://test-store.com/product',
  },
  image: '/test-image.jpg',
  dimensions: {
    length: 5,
    width: 10,
    height: 20,
    unit: 'cm',
  },
  createdAt: '2023-01-01',
  updatedAt: '2023-01-01',
};

describe('ProductDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product information correctly', () => {
    render(<ProductDetail product={mockProduct} />);

    expect(screen.getByRole('heading', { level: 1, name: mockProduct.name })).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(/99.99/)).toBeInTheDocument();
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  it('renders "Buy at Store" button when store URL is present', () => {
    render(<ProductDetail product={mockProduct} />);

    const buyButton = screen.getByRole('link', { name: /Buy at Test Store/i });
    expect(buyButton).toBeInTheDocument();
    expect(buyButton).toHaveAttribute('href', mockProduct.store.url);
    expect(buyButton).toHaveAttribute('target', '_blank');
  });

  it('renders "Continue Shopping" button', () => {
    render(<ProductDetail product={mockProduct} />);

    const continueButton = screen.getByRole('link', { name: /Continue Shopping/i });
    expect(continueButton).toBeInTheDocument();
    expect(continueButton).toHaveAttribute('href', '/');
  });

  it('renders dimensions correctly', () => {
    render(<ProductDetail product={mockProduct} />);
    // formatDimensions outputs e.g. "5cm × 10cm × 20cm"
    expect(screen.getByText(/5cm × 10cm × 20cm/)).toBeInTheDocument();
  });

  it('renders back button and handles click', async () => {
    const user = userEvent.setup();
    render(<ProductDetail product={mockProduct} />);

    const backButton = screen.getByRole('button', { name: /back to results/i });

    await user.click(backButton);
    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
