import { type NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';
import { type Room } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const result = await searchProducts({
    query: searchParams.get('query') ?? undefined,
    store: searchParams.get('store') ?? undefined,
    room: (searchParams.get('room') ?? undefined) as Room | undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: Number(searchParams.get('limit')) || 12,
  });

  return NextResponse.json(result);
}
