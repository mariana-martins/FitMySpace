import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
  }).format(price);
}

export function formatDimensions(dimensions?: {
  length?: number;
  width?: number;
  height?: number;
  unit: 'cm' | 'in';
}): string {
  if (!dimensions) return 'Dimensions not available';
  const { length, width, height, unit } = dimensions;
  const parts = [length, width, height].filter(Boolean).map((d) => `${d}${unit}`);
  return parts.join(' × ') || 'Dimensions not available';
}
