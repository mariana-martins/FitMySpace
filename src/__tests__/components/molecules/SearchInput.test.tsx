import { SearchInput } from '@/components/molecules/SearchInput';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';

describe('SearchInput', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('renders with label', () => {
    render(<SearchInput label="Search products" onSearch={mockOnSearch} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<SearchInput label="Search" placeholder="Type to search..." onSearch={mockOnSearch} />);
    expect(screen.getByPlaceholderText('Type to search...')).toBeInTheDocument();
  });

  it('has sr-only label for accessibility', () => {
    render(<SearchInput label="Search products" onSearch={mockOnSearch} />);
    expect(screen.getByText('Search products')).toHaveClass('sr-only');
  });

  it('renders search icon', () => {
    render(<SearchInput label="Search" onSearch={mockOnSearch} />);
    const form = screen.getByRole('search');
    const icon = form.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('updates value when typing', async () => {
    const user = userEvent.setup();
    render(<SearchInput label="Search" onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('calls onSearch when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchInput label="Search" onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'organizers');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('organizers');
  });

  it('shows clear button when value exists', async () => {
    const user = userEvent.setup();
    render(<SearchInput label="Search" onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');

    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('does not show clear button when empty', () => {
    render(<SearchInput label="Search" onSearch={mockOnSearch} />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
  });

  it('clears input and calls onSearch with empty when clear is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchInput label="Search" onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('calls onSearch with empty when input is cleared manually', async () => {
    const user = userEvent.setup();
    render(<SearchInput label="Search" value="initial" onSearch={mockOnSearch} />);

    const input = screen.getByRole('searchbox');
    await user.clear(input);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('syncs with controlled value prop', () => {
    const { rerender } = render(
      <SearchInput label="Search" value="initial" onSearch={mockOnSearch} />,
    );

    expect(screen.getByRole('searchbox')).toHaveValue('initial');

    rerender(<SearchInput label="Search" value="updated" onSearch={mockOnSearch} />);
    expect(screen.getByRole('searchbox')).toHaveValue('updated');
  });

  it('merges custom className', () => {
    render(<SearchInput label="Search" className="custom-class" onSearch={mockOnSearch} />);
    expect(screen.getByRole('search')).toHaveClass('custom-class');
  });
});
