import { useRouter, useSearchParams } from 'next/navigation';
import { RoomSchema } from '@/lib/schemas';
import { Room } from '@/types';

/**
 * Custom hook for managing search and filter state in the URL.
 * Handles updating query parameters for search text, room filters, and store filters.
 * Automatically resets pagination to page 1 when filters change.
 */
export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Updates a specific URL search parameter and pushes the new URL.
   * Resets to page 1 on any filter change (page 1 is implicit, matching usePagination).
   * Keeps the scroll position so the filters stay in view while results update.
   */
  const updateParams = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page');
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/', { scroll: false });
  };

  /**
   * Updates the search query parameter.
   * @param query - The search text
   */
  const handleSearch = (query: string) => {
    updateParams('query', query || null);
  };

  /**
   * Toggles the room filter. If the room is already selected, it removes the filter.
   * @param room - The room category to filter by
   */
  const handleRoomFilter = (room: Room) => {
    const currentRoom = searchParams.get('room');
    if (currentRoom === room) {
      updateParams('room', null);
    } else {
      updateParams('room', room);
    }
  };

  /**
   * Updates the store filter.
   * @param storeId - The store ID to filter by, or 'all' to clear the filter
   */
  const handleStoreFilter = (storeId: string) => {
    if (storeId === 'all') {
      updateParams('store', null);
    } else {
      updateParams('store', storeId);
    }
  };

  const currentQuery = searchParams.get('query') || '';
  const parsedRoom = RoomSchema.safeParse(searchParams.get('room'));
  const currentRoom: Room | null = parsedRoom.success ? parsedRoom.data : null;
  const currentStore = searchParams.get('store');

  return {
    handleSearch,
    handleRoomFilter,
    handleStoreFilter,
    currentQuery,
    currentRoom,
    currentStore,
    searchParams,
  };
}
