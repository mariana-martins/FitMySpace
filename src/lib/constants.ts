import { Room } from '@/types';

export const ROOM_LABELS: Record<Room, string> = {
  [Room.KITCHEN]: 'Kitchen',
  [Room.PANTRY]: 'Pantry',
  [Room.BATHROOM]: 'Bathroom',
  [Room.CLOSET]: 'Closet',
  [Room.OFFICE]: 'Office',
  [Room.LIVING_ROOM]: 'Living Room',
  [Room.BEDROOM]: 'Bedroom',
  [Room.GARAGE]: 'Garage',
  [Room.LAUNDRY]: 'Laundry',
};

/**
 * Room color classes using the new pastel design system.
 * Each room has: soft background (50), vibrant text (600), hover state (100)
 */
export const ROOM_COLORS: Record<Room, string> = {
  [Room.KITCHEN]: 'bg-orange-50 text-orange-600 hover:bg-orange-100',
  [Room.PANTRY]: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
  [Room.BATHROOM]: 'bg-sky-50 text-sky-600 hover:bg-sky-100',
  [Room.CLOSET]: 'bg-violet-50 text-violet-600 hover:bg-violet-100',
  [Room.OFFICE]: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
  [Room.LIVING_ROOM]: 'bg-teal-50 text-teal-600 hover:bg-teal-100',
  [Room.BEDROOM]: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
  [Room.GARAGE]: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
  [Room.LAUNDRY]: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
};
