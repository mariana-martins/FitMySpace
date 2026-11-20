import { SearchResults } from '@/components/organisms/SearchResults';
import { render, screen, within } from '@/__tests__/utils';
import { type ProductSearchResponse } from '@/types';
import userEvent from '@testing-library/user-event';
import { mockProducts } from '@/mocks/data';

// The page links are Next.js router links; the tests only need their href and their click.
jest.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return <a {...props}>{children}</a>;
  },
}));

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

    const pagination = screen.getByRole('navigation', { name: 'Pagination' });
    expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute(
      'href',
      '/?page=2',
    );
    expect(within(pagination).getByRole('link', { name: 'Previous page' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('says which products are on screen', () => {
    mockSearchResults({ total: 20, page: 2 });
    render(<SearchResults searchParams={{ page: '2' }} />);

    expect(screen.getByText('Showing 13–20 of 20 products')).toBeInTheDocument();
  });

  // The router swaps the page in the real app; here a rerender with the new page stands in.
  it('moves focus to the summary of the new page when a page link is followed', async () => {
    mockSearchResults({ total: 20, page: 1 });
    const { rerender } = render(<SearchResults searchParams={{}} />);

    const user = userEvent.setup();
    await user.click(
      within(screen.getByRole('navigation', { name: 'Pagination' })).getByRole('link', {
        name: 'Page 2',
      }),
    );
    mockSearchResults({ total: 20, page: 2 });
    rerender(<SearchResults searchParams={{ page: '2' }} />);

    expect(screen.getByText('Showing 13–20 of 20 products')).toHaveFocus();
  });

  it('leaves the focus alone when a page opens in a new tab', async () => {
    mockSearchResults({ total: 20, page: 1 });
    const { rerender } = render(<SearchResults searchParams={{}} />);

    const user = userEvent.setup();
    await user.keyboard('{Control>}');
    await user.click(
      within(screen.getByRole('navigation', { name: 'Pagination' })).getByRole('link', {
        name: 'Page 2',
      }),
    );
    await user.keyboard('{/Control}');
    mockSearchResults({ total: 20, page: 2 });
    rerender(<SearchResults searchParams={{ page: '2' }} />);

    expect(screen.getByText('Showing 13–20 of 20 products')).not.toHaveFocus();
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
