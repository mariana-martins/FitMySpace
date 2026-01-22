import { ROOM_LABELS, ROOM_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Room } from '@/types';

// Using Props interface to strictly define the usage
interface RoomFilterProps {
  currentRoom: Room | null;
  onSelect: (room: Room) => void;
  className?: string;
}

export function RoomFilter({ currentRoom, onSelect, className }: RoomFilterProps) {
  return (
    <div className={cn('flex flex-wrap justify-center gap-3', className)}>
      {Object.values(Room).map((room) => {
        if (!ROOM_LABELS[room]) return null;

        const isActive = currentRoom === room;
        const colorClass = ROOM_COLORS[room] || 'bg-slate-50 text-slate-600';

        return (
          <button
            key={room}
            onClick={() => onSelect(room)}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
              colorClass,
              isActive ? 'ring-2 ring-offset-2 ring-indigo-600' : 'hover:scale-105',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-600',
              'cursor-pointer',
            )}
            aria-pressed={isActive}
          >
            {ROOM_LABELS[room]}
          </button>
        );
      })}
    </div>
  );
}
