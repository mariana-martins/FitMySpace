import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import ErrorPage from '@/app/error';

describe('Error Page', () => {
  const mockReset = jest.fn();

  // Create error object that matches expected shape
  const createMockError = (message: string) => {
    const error = Object.assign(new globalThis.Error(message), { digest: undefined });
    return error as Error & { digest?: string };
  };

  beforeEach(() => {
    mockReset.mockClear();
    // Suppress console.error for cleaner test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders error alert with correct role', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays error heading', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
  });

  it('displays error message', () => {
    const mockError = createMockError('Custom error message');
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('renders try again button', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} reset={mockReset} />);
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('calls reset function when try again is clicked', async () => {
    const user = userEvent.setup();
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} reset={mockReset} />);

    await user.click(screen.getByRole('button', { name: /try again/i }));
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('logs error to console on mount', () => {
    const mockError = createMockError('Test error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  });

  it('has centered layout', () => {
    const mockError = createMockError('Test error');
    render(<ErrorPage error={mockError} reset={mockReset} />);
    const container = screen.getByRole('alert');
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('justify-center');
  });
});
