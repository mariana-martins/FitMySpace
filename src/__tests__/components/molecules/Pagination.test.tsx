import { Pagination } from '@/components/molecules/Pagination';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders navigation with correct aria-label', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders previous and next buttons', () => {
    render(<Pagination currentPage={2} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(<Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('enables both buttons on middle pages', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByRole('button', { name: /previous/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('calls onPageChange with previous page when clicking previous', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: /previous/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with next page when clicking next', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it('renders page number buttons', () => {
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);
    expect(screen.getByRole('button', { name: 'Go to page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 5' })).toBeInTheDocument();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination currentPage={3} totalPages={5} onPageChange={mockOnPageChange} />);
    const currentPageButton = screen.getByRole('button', { name: 'Go to page 3' });
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when clicking page number', async () => {
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />);

    await user.click(screen.getByRole('button', { name: 'Go to page 5' }));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('shows ellipsis for many pages', () => {
    render(<Pagination currentPage={5} totalPages={10} onPageChange={mockOnPageChange} />);
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it('merges custom className', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        className="custom-class"
      />,
    );
    expect(screen.getByRole('navigation')).toHaveClass('custom-class');
  });
});
