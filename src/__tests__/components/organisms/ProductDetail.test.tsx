import { ProductDetail } from '@/components/organisms/ProductDetail';
import { render, screen, within } from '@/__tests__/utils';
import userEvent from '@testing-library/user-event';
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

  describe('back link', () => {
    afterEach(() => {
      Reflect.deleteProperty(window, 'navigation');
    });

    function mockNavigationHistory({ canGoBack }: { canGoBack: boolean }) {
      Object.defineProperty(window, 'navigation', { value: { canGoBack }, configurable: true });
    }

    it('links to the home page so it works without history', () => {
      render(<ProductDetail product={mockProduct} />);

      expect(screen.getByRole('link', { name: /back to results/i })).toHaveAttribute('href', '/');
    });

    it('goes back in history when the previous page belongs to the site', async () => {
      mockNavigationHistory({ canGoBack: true });
      const user = userEvent.setup();
      render(<ProductDetail product={mockProduct} />);

      await user.click(screen.getByRole('link', { name: /back to results/i }));

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it('does not go back when the user arrived from another site', async () => {
      mockNavigationHistory({ canGoBack: false });
      const user = userEvent.setup();
      render(<ProductDetail product={mockProduct} />);

      await user.click(screen.getByRole('link', { name: /back to results/i }));

      expect(mockBack).not.toHaveBeenCalled();
    });

    it('does not go back when the browser lacks the Navigation API', async () => {
      const user = userEvent.setup();
      render(<ProductDetail product={mockProduct} />);

      await user.click(screen.getByRole('link', { name: /back to results/i }));

      expect(mockBack).not.toHaveBeenCalled();
    });

    it('does not go back on a modified click that opens a new tab', async () => {
      mockNavigationHistory({ canGoBack: true });
      const user = userEvent.setup();
      render(<ProductDetail product={mockProduct} />);

      await user.keyboard('{Control>}');
      await user.click(screen.getByRole('link', { name: /back to results/i }));
      await user.keyboard('{/Control}');

      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  it('shows Home and the product name in the breadcrumb, without a duplicate link to home', () => {
    render(<ProductDetail product={mockProduct} />);

    const breadcrumb = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const breadcrumbLinks = within(breadcrumb).getAllByRole('link');

    expect(breadcrumbLinks).toHaveLength(1);
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/');
    expect(within(breadcrumb).getByText(mockProduct.name)).toHaveAttribute('aria-current', 'page');
  });
});
