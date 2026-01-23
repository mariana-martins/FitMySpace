import { renderHook, act } from '@testing-library/react';
import { usePagination } from '@/hooks/usePagination';

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => '/',
}));

describe('usePagination', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('currentPage', () => {
    it('returns 1 when no page param', () => {
      const { result } = renderHook(() => usePagination({ searchParams: {}, total: 100 }));
      expect(result.current.currentPage).toBe(1);
    });

    it('parses page param from searchParams', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: '3' }, total: 100 }),
      );
      expect(result.current.currentPage).toBe(3);
    });

    it('defaults to 1 for invalid page param', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: 'invalid' }, total: 100 }),
      );
      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('totalPages', () => {
    it('calculates total pages with default limit', () => {
      const { result } = renderHook(() => usePagination({ searchParams: {}, total: 25 }));
      expect(result.current.totalPages).toBe(3); // 25 / 12 = 2.08 -> 3
    });

    it('calculates total pages with custom limit', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: {}, total: 30, limit: 10 }),
      );
      expect(result.current.totalPages).toBe(3);
    });

    it('returns 0 for empty results', () => {
      const { result } = renderHook(() => usePagination({ searchParams: {}, total: 0 }));
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe('hasNextPage and hasPreviousPage', () => {
    it('hasNextPage is true when not on last page', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: '1' }, total: 30 }),
      );
      expect(result.current.hasNextPage).toBe(true);
    });

    it('hasNextPage is false on last page', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: '3' }, total: 30 }),
      );
      expect(result.current.hasNextPage).toBe(false);
    });

    it('hasPreviousPage is false on first page', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: '1' }, total: 30 }),
      );
      expect(result.current.hasPreviousPage).toBe(false);
    });

    it('hasPreviousPage is true on subsequent pages', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: '2' }, total: 30 }),
      );
      expect(result.current.hasPreviousPage).toBe(true);
    });
  });

  describe('goToPage', () => {
    it('navigates to specified page', () => {
      const { result } = renderHook(() => usePagination({ searchParams: {}, total: 100 }));

      act(() => {
        result.current.goToPage(3);
      });

      expect(mockPush).toHaveBeenCalledWith('/?page=3');
    });

    it('removes page param when going to page 1', () => {
      const { result } = renderHook(() =>
        usePagination({ searchParams: { page: '3' }, total: 100 }),
      );

      act(() => {
        result.current.goToPage(1);
      });

      expect(mockPush).toHaveBeenCalledWith('/?');
    });

    it('preserves other search params', () => {
      const { result } = renderHook(() =>
        usePagination({
          searchParams: { query: 'test', room: 'kitchen' },
          total: 100,
        }),
      );

      act(() => {
        result.current.goToPage(2);
      });

      expect(mockPush).toHaveBeenCalledWith('/?query=test&room=kitchen&page=2');
    });
  });
});
