import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import ErrorPage from '@/app/error';
import { Suspense } from 'react';

describe('Error Page', () => {
  const mockRetry = jest.fn();

  // Create error object that matches expected shape
  const createMockError = (message: string) => {
    const error = Object.assign(new globalThis.Error(message), { digest: undefined });
    return error as Error & { digest?: string };
  };

  beforeEach(() => {
    mockRetry.mockClear();
    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error alert with correct role', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} retry={mockRetry} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays the error as the page heading', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} retry={mockRetry} />);
    expect(
      screen.getByRole('heading', { level: 1, name: /something went wrong/i }),
    ).toBeInTheDocument();
  });

  it('keeps the site navigation so the user can leave the error page', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} retry={mockRetry} />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('displays error message', () => {
    const mockError = createMockError('Custom error message');
    render(<ErrorPage error={mockError} retry={mockRetry} />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders try again button', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} retry={mockRetry} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls retry when try again is clicked', async () => {
    const user = userEvent.setup();
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} retry={mockRetry} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockRetry).toHaveBeenCalledTimes(1);
  });

  it('logs error to console on mount', () => {
    const mockError = createMockError('Test error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorPage error={mockError} retry={mockRetry} />);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  });

  it('has centered layout', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} retry={mockRetry} />);
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });

  describe('recovering from a failed suspense query', () => {
    let shouldRequestFail: boolean;
    const fetchProducts = jest.fn(async () => {
      if (shouldRequestFail) throw new globalThis.Error('Request failed');
      return 'Loaded products';
    });

    function ProductsConsumer() {
      const { data } = useSuspenseQuery({ queryKey: ['flaky-products'], queryFn: fetchProducts });
      return <p>{data}</p>;
    }

    // Stands in for the error boundary Next.js wraps around each route segment
    function SimulatedSegment() {
      return (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorPage error={error as Error} retry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<p>Loading</p>}>
            <ProductsConsumer />
          </Suspense>
        </ErrorBoundary>
      );
    }

    beforeEach(() => {
      fetchProducts.mockClear();
    });

    it('fetches again instead of rethrowing the cached error', async () => {
      shouldRequestFail = true;
      const user = userEvent.setup();
      render(<SimulatedSegment />);

      expect(await screen.findByText('Request failed')).toBeInTheDocument();

      shouldRequestFail = false;
      await user.click(screen.getByRole('button', { name: /try again/i }));

      expect(await screen.findByText('Loaded products')).toBeInTheDocument();
      expect(fetchProducts).toHaveBeenCalledTimes(2);
    });
  });
});
