import { render, screen } from '@testing-library/react';
import { Providers } from '@/app/providers';

// Mock react-query
jest.mock('@/lib/react-query', () => ({
  queryClient: {
    mount: jest.fn(),
    unmount: jest.fn(),
    getQueryCache: jest.fn(() => ({ clear: jest.fn() })),
    getMutationCache: jest.fn(() => ({ clear: jest.fn() })),
    getDefaultOptions: jest.fn(() => ({})),
    setDefaultOptions: jest.fn(),
    setQueryDefaults: jest.fn(),
    getQueryDefaults: jest.fn(),
    setMutationDefaults: jest.fn(),
    getMutationDefaults: jest.fn(),
    defaultQueryOptions: jest.fn(() => ({})),
    defaultMutationOptions: jest.fn(() => ({})),
  },
}));

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
