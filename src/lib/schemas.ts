import { Room } from '@/types';
import { z } from 'zod';

/**
 * Zod schemas for runtime API response validation.
 * These mirror the TypeScript types in @/types but provide runtime validation.
 */

export const RoomSchema = z.enum(Room);

export const StoreSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string().optional(),
  url: z.string().optional(),
});

export const DimensionsSchema = z.object({
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  unit: z.enum(['cm', 'in']),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  image: z.string(),
  store: StoreSchema,
  room: RoomSchema,
  dimensions: DimensionsSchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ProductSearchResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export const ProductArraySchema = z.array(ProductSchema);

// Type inference from schemas (alternative to manual types)
export type ProductFromSchema = z.infer<typeof ProductSchema>;
export type ProductSearchResponseFromSchema = z.infer<typeof ProductSearchResponseSchema>;
