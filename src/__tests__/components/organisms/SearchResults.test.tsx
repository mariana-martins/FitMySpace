import { SearchResults } from '@/components/organisms/SearchResults';
import { type ProductSearchResponse } from '@/types';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import { mockProducts } from '@/mocks/data';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));

let mockSearchResponse: ProductSearchResponse;
jest.mock('@/hooks/useProducts', () => ({
  useSuspenseSearchProducts: () => ({ data: mockSearchResponse }),
}));

function mockSearchResults({ total, page }: { total: number; page: number }) {
  const productsOnPage = page === 1 ? mockProducts.slice(0, Math.min(total, 12)) : [];
  mockSearchResponse = { products: productsOnPage, total, page, limit: 12 };
}

describe('SearchResults', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the products and pagination for a valid page', () => {
    mockSearchResults({ total: 20, page: 1 });
    render(<SearchResults searchParams={{}} />);

    expect(screen.getByRole('list', { name: 'Product grid' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /pagination/i })).toBeInTheDocument();
  });

  it('shows the regular empty state when nothing matches', () => {
    mockSearchResults({ total: 0, page: 1 });
    render(<SearchResults searchParams={{ query: 'spaceship' }} />);

    expect(screen.getByText('No products found for "spaceship"')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /go to page/i })).not.toBeInTheDocument();
  });

  describe('when the page is beyond the last page', () => {
    it('explains that the page does not exist', () => {
      mockSearchResults({ total: 20, page: 99 });
      render(<SearchResults searchParams={{ page: '99' }} />);

      expect(screen.getByText("Page 99 doesn't exist")).toBeInTheDocument();
      expect(screen.getByText('These results only go up to page 2.')).toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: /pagination/i })).not.toBeInTheDocument();
    });

    it('navigates to the last page, keeping the other filters', async () => {
      mockSearchResults({ total: 20, page: 99 });
      const user = userEvent.setup();
      render(<SearchResults searchParams={{ query: 'box', page: '99' }} />);

      await user.click(screen.getByRole('button', { name: 'Go to page 2' }));

      expect(mockPush).toHaveBeenCalledWith('/?query=box&page=2');
    });
  });
});
