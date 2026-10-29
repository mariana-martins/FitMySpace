import { parseSearchFilters } from '@/lib/parseSearchFilters';
import { type NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  const filters = parseSearchFilters(Object.fromEntries(request.nextUrl.searchParams));

  return NextResponse.json(await searchProducts(filters));
}
