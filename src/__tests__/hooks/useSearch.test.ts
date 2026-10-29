import { renderHook, act } from '@testing-library/react';
import { useSearch } from '@/hooks/useSearch';
import { Room } from '@/types';

// Mock Next.js navigation
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('useSearch', () => {
  beforeEach(() => {
    mockPush.mockClear();
    // Reset search params
    mockSearchParams.delete('query');
    mockSearchParams.delete('room');
    mockSearchParams.delete('store');
    mockSearchParams.delete('page');
  });

  describe('handleSearch', () => {
    it('updates query param and keeps scroll position', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('organizers');
      });

      expect(mockPush).toHaveBeenCalledWith('/?query=organizers', { scroll: false });
    });

    it('removes query param when empty string', () => {
      mockSearchParams.set('query', 'old-query');
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('');
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });

    it('drops the current page so results restart from page 1', () => {
      mockSearchParams.set('page', '3');
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleSearch('bins');
      });

      expect(mockPush).toHaveBeenCalledWith('/?query=bins', { scroll: false });
    });
  });

  describe('handleRoomFilter', () => {
    it('sets room filter', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleRoomFilter(Room.KITCHEN);
      });

      expect(mockPush).toHaveBeenCalledWith('/?room=kitchen', { scroll: false });
    });

    it('toggles off room filter when same room selected', () => {
      mockSearchParams.set('room', Room.KITCHEN);
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleRoomFilter(Room.KITCHEN);
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });
  });

  describe('handleStoreFilter', () => {
    it('sets store filter', () => {
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleStoreFilter('1');
      });

      expect(mockPush).toHaveBeenCalledWith('/?store=1', { scroll: false });
    });

    it('clears store filter when "all" is selected', () => {
      mockSearchParams.set('store', '1');
      const { result } = renderHook(() => useSearch());

      act(() => {
        result.current.handleStoreFilter('all');
      });

      expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
    });
  });

  describe('current values', () => {
    it('returns currentQuery from search params', () => {
      mockSearchParams.set('query', 'test-query');
      const { result } = renderHook(() => useSearch());

      expect(result.current.currentQuery).toBe('test-query');
    });

    it('returns empty string for missing query', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.currentQuery).toBe('');
    });

    it('returns currentRoom from search params', () => {
      mockSearchParams.set('room', Room.BATHROOM);
      const { result } = renderHook(() => useSearch());

      expect(result.current.currentRoom).toBe(Room.BATHROOM);
    });

    it('returns null for missing room', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.currentRoom).toBeNull();
    });

    it('returns null for an unknown room', () => {
      mockSearchParams.set('room', 'spaceship');
      const { result } = renderHook(() => useSearch());

      expect(result.current.currentRoom).toBeNull();
    });

    it('returns currentStore from search params', () => {
      mockSearchParams.set('store', '2');
      const { result } = renderHook(() => useSearch());

      expect(result.current.currentStore).toBe('2');
    });

    it('returns null for missing store', () => {
      const { result } = renderHook(() => useSearch());
      expect(result.current.currentStore).toBeNull();
    });
  });
});
