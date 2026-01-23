import { FilterBar } from '@/components/organisms/FilterBar';
import { render, screen } from '@/__tests__/utils';
import { Room } from '@/types';

// Mock useSearch hook
const mockHandleRoomFilter = jest.fn();
const mockHandleStoreFilter = jest.fn();

jest.mock('@/hooks/useSearch', () => ({
  useSearch: () => ({
    currentRoom: Room.KITCHEN,
    currentStore: '1',
    handleRoomFilter: mockHandleRoomFilter,
    handleStoreFilter: mockHandleStoreFilter,
  }),
}));

// Mock pointer capture for Radix Select
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
});

describe('FilterBar', () => {
  beforeEach(() => {
    mockHandleRoomFilter.mockClear();
    mockHandleStoreFilter.mockClear();
  });

  it('renders filter group with aria-label', () => {
    render(<FilterBar />);
    expect(screen.getByRole('group', { name: 'Filter results' })).toBeInTheDocument();
  });

  it('renders room filter buttons', () => {
    render(<FilterBar />);
    expect(screen.getByRole('button', { name: 'Kitchen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pantry' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bathroom' })).toBeInTheDocument();
  });

  it('marks current room as pressed', () => {
    render(<FilterBar />);
    const kitchenButton = screen.getByRole('button', { name: 'Kitchen' });
    expect(kitchenButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('renders store filter dropdown', () => {
    render(<FilterBar />);
    expect(screen.getByRole('combobox', { name: 'Filter by store' })).toBeInTheDocument();
  });

  it('displays selected store in dropdown', () => {
    render(<FilterBar />);
    // The Container Store is id '1' in mock data
    expect(screen.getByRole('combobox')).toHaveTextContent('The Container Store');
  });
});
