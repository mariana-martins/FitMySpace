import { SearchBar } from '@/components/organisms/SearchBar';
import { render, screen } from '@/__tests__/utils';

// Mock useSearch hook
const mockHandleSearch = jest.fn();
jest.mock('@/hooks/useSearch', () => ({
  useSearch: () => ({
    currentQuery: 'test query',
    handleSearch: mockHandleSearch,
  }),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockHandleSearch.mockClear();
  });

  it('renders search input', () => {
    render(<SearchBar />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders with label for accessibility', () => {
    render(<SearchBar />);
    expect(screen.getByText('Search products')).toBeInTheDocument();
  });

  it('displays current query value from hook', () => {
    render(<SearchBar />);
    expect(screen.getByRole('searchbox')).toHaveValue('test query');
  });

  it('has correct placeholder', () => {
    render(<SearchBar />);
    expect(
      screen.getByPlaceholderText('Search for home organization products...'),
    ).toBeInTheDocument();
  });

  it('merges custom className', () => {
    const { container } = render(<SearchBar className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('passes additional props to container', () => {
    render(<SearchBar data-testid="search-bar" />);
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });
});
