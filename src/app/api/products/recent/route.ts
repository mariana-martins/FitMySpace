import { type NextRequest, NextResponse } from 'next/server';
import { getRecentProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 12;

  return NextResponse.json(await getRecentProducts(limit));
}
