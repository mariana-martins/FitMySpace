import { type NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/mocks/data';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query')?.toLowerCase();
  const store = searchParams.get('store');
  const room = searchParams.get('room');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const limit = Number(searchParams.get('limit')) || 12;
  const page = Number(searchParams.get('page')) || 1;

  // Artificial delay to demonstrate Suspense
  await new Promise((resolve) => setTimeout(resolve, 1000));

  let filteredProducts = [...mockProducts];

  if (query) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query),
    );
  }

  if (store) {
    filteredProducts = filteredProducts.filter((product) => product.store.id === store);
  }

  if (room) {
    filteredProducts = filteredProducts.filter((product) => (product.room as string) === room);
  }

  if (minPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price >= Number(minPrice));
  }

  if (maxPrice) {
    filteredProducts = filteredProducts.filter((product) => product.price <= Number(maxPrice));
  }

  const total = filteredProducts.length;
  const start = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(start, start + limit);

  return NextResponse.json({
    products: paginatedProducts,
    total,
    page,
    limit,
  });
}
