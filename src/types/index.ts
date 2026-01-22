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

export interface Store {
  id: string;
  name: string;
  logo?: string;
}

export interface Dimensions {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'in';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  store: Store;
  room: Room;
  dimensions?: Dimensions;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  query?: string;
  store?: string;
  room?: Room;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSearchResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}
