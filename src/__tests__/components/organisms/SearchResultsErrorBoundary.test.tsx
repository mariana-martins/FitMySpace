import { SearchResultsErrorBoundary } from '@/components/organisms/SearchResults';
import { useSuspenseQuery } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import { Suspense } from 'react';

describe('SearchResultsErrorBoundary', () => {
  let shouldRequestFail: boolean;
  const fetchProducts = jest.fn(async () => {
    if (shouldRequestFail) throw new Error('Request failed');
    return 'Loaded products';
  });

  function ProductsConsumer() {
    const { data } = useSuspenseQuery({ queryKey: ['search-flaky'], queryFn: fetchProducts });
    return <p>{data}</p>;
  }

  function renderSearchArea() {
    return render(
      <>
        <input aria-label="Search" />
        <SearchResultsErrorBoundary>
          <Suspense fallback={<p>Loading</p>}>
            <ProductsConsumer />
          </Suspense>
        </SearchResultsErrorBoundary>
      </>,
    );
  }

  beforeEach(() => {
    fetchProducts.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the results when the query succeeds', async () => {
    shouldRequestFail = false;
    renderSearchArea();
    expect(await screen.findByText('Loaded products')).toBeInTheDocument();
  });

  it('shows the error inside the results area and keeps the rest of the page', async () => {
    shouldRequestFail = true;
    renderSearchArea();

    expect(await screen.findByRole('alert')).toHaveTextContent("We couldn't load the products");
    expect(screen.getByRole('textbox', { name: 'Search' })).toBeInTheDocument();
  });

  it('fetches again when try again is clicked', async () => {
    shouldRequestFail = true;
    const user = userEvent.setup();
    renderSearchArea();
    await screen.findByRole('alert');

    shouldRequestFail = false;
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Loaded products')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledTimes(2);
  });
});
