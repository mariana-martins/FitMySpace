'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';

import { RoomFilter } from '@/components/atoms/RoomFilter';
import { useSearch } from '@/hooks/useSearch';
import { mockStores } from '@/mocks/data';

export const mockFilterStores = mockStores.map((store) => ({
  id: store.id,
  name: store.name,
}));

export function FilterBar() {
  const { currentRoom, currentStore, handleRoomFilter, handleStoreFilter } = useSearch();

  return (
    <div role="group" aria-label="Filter results">
      <RoomFilter currentRoom={currentRoom} onSelect={handleRoomFilter} />
      <div className="flex justify-start mt-6">
        <Select value={currentStore || ''} onValueChange={handleStoreFilter}>
          <SelectTrigger
            className=" w-[180px] rounded-sm bg-white cursor-pointer text-sm font-light"
            aria-label="Filter by store"
          >
            <SelectValue placeholder="Filter by Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {mockFilterStores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
