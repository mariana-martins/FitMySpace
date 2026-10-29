import { useSuspenseQuery } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Providers } from '@/app/providers';
import { Suspense } from 'react';

describe('Providers', () => {
  it('renders children correctly', () => {
    render(
      <Providers>
        <div data-testid="child">Child Content</div>
      </Providers>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('wraps children without errors', () => {
    const { container } = render(
      <Providers>
        <span>Test</span>
      </Providers>,
    );
    expect(container).toContainHTML('Test');
  });
});

describe('ErrorFallback (via Providers)', () => {
  // Test the ErrorFallback component by triggering an error
  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  beforeEach(() => {
    // Suppress error boundary console output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error fallback when child throws', () => {
    render(
      <Providers>
        <ThrowError shouldThrow={true} />
      </Providers>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('displays error message in fallback', () => {
    render(
      <Providers>
        <ThrowError shouldThrow={true} />
      </Providers>,
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('renders try again button in fallback', () => {
    render(
      <Providers>
        <ThrowError shouldThrow={true} />
      </Providers>,
    );

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('fallback has alert role for accessibility', () => {
    render(
      <Providers>
        <ThrowError shouldThrow={true} />
      </Providers>,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('try again button has focus styles', () => {
    render(
      <Providers>
        <ThrowError shouldThrow={true} />
      </Providers>,
    );

    const button = screen.getByRole('button', { name: /try again/i });
    expect(button).toHaveClass('focus:ring-2');
  });
});

describe('ErrorFallback recovery (via Providers)', () => {
  let shouldRequestFail: boolean;
  const fetchProducts = jest.fn(async () => {
    if (shouldRequestFail) throw new Error('Request failed');
    return 'Loaded products';
  });

  function ProductsConsumer() {
    // retry: false keeps the test fast; the app default retries once before failing
    const { data } = useSuspenseQuery({
      queryKey: ['providers-flaky-products'],
      queryFn: fetchProducts,
      retry: false,
    });
    return <p>{data}</p>;
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches failed queries again when try again is clicked', async () => {
    shouldRequestFail = true;
    const user = userEvent.setup();
    render(
      <Providers>
        <Suspense fallback={<p>Loading</p>}>
          <ProductsConsumer />
        </Suspense>
      </Providers>,
    );

    expect(await screen.findByText('Request failed')).toBeInTheDocument();

    shouldRequestFail = false;
    await user.click(screen.getByRole('button', { name: /try again/i }));

    expect(await screen.findByText('Loaded products')).toBeInTheDocument();
  });
});
