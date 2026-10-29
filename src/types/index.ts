import type {
  DimensionsSchema,
  ProductSchema,
  ProductSearchResponseSchema,
  StoreSchema,
} from '@/lib/schemas';
import type { z } from 'zod';

export enum Room {
  KITCHEN = 'kitchen',
  PANTRY = 'pantry',
  BATHROOM = 'bathroom',
  CLOSET = 'closet',
  OFFICE = 'office',
  LIVING_ROOM = 'living-room',
  BEDROOM = 'bedroom',
  GARAGE = 'garage',
  LAUNDRY = 'laundry',
}

// API data types come from the zod schemas, so the runtime validation and the types cannot drift apart.
// Type-only imports: no runtime cycle with @/lib/schemas, which imports Room from here.
export type Store = z.infer<typeof StoreSchema>;
export type Dimensions = z.infer<typeof DimensionsSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type ProductSearchResponse = z.infer<typeof ProductSearchResponseSchema>;

export interface SearchParams {
  query?: string;
  store?: string;
  room?: Room;
  page?: number;
  limit?: number;
}
