import { RoomFilter } from '@/components/atoms/RoomFilter';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import { Room } from '@/types';

describe('RoomFilter', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  it('renders all room filter buttons', () => {
    render(<RoomFilter currentRoom={null} onSelect={mockOnSelect} />);

    expect(screen.getByRole('button', { name: 'Kitchen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pantry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bathroom' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Closet' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Office' })).toBeInTheDocument();
  });

  it('calls onSelect when a room button is clicked', async () => {
    const user = userEvent.setup();
    render(<RoomFilter currentRoom={null} onSelect={mockOnSelect} />);

    await user.click(screen.getByRole('button', { name: 'Kitchen' }));
    expect(mockOnSelect).toHaveBeenCalledWith(Room.KITCHEN);
  });

  it('marks the current room as pressed', () => {
    render(<RoomFilter currentRoom={Room.BATHROOM} onSelect={mockOnSelect} />);

    const bathroomButton = screen.getByRole('button', { name: 'Bathroom' });
    expect(bathroomButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('marks other rooms as not pressed', () => {
    render(<RoomFilter currentRoom={Room.BATHROOM} onSelect={mockOnSelect} />);

    const kitchenButton = screen.getByRole('button', { name: 'Kitchen' });
    expect(kitchenButton).toHaveAttribute('aria-pressed', 'false');
  });

  it('applies active ring styles to selected room', () => {
    render(<RoomFilter currentRoom={Room.KITCHEN} onSelect={mockOnSelect} />);

    const kitchenButton = screen.getByRole('button', { name: 'Kitchen' });
    expect(kitchenButton).toHaveClass('ring-2');
    expect(kitchenButton).toHaveClass('ring-indigo-600');
  });

  it('applies hover scale to non-selected rooms', () => {
    render(<RoomFilter currentRoom={Room.KITCHEN} onSelect={mockOnSelect} />);

    const pantryButton = screen.getByRole('button', { name: 'Pantry' });
    expect(pantryButton).toHaveClass('hover:scale-105');
  });

  it('merges custom className', () => {
    const { container } = render(
      <RoomFilter currentRoom={null} onSelect={mockOnSelect} className="custom-class" />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has focus styles for accessibility', () => {
    render(<RoomFilter currentRoom={null} onSelect={mockOnSelect} />);

    const button = screen.getByRole('button', { name: 'Kitchen' });
    expect(button).toHaveClass('focus-visible:ring-2');
  });
});
