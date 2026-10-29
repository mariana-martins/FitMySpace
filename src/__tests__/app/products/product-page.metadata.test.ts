import { generateMetadata } from '@/app/products/[id]/page';
import { mockProducts } from '@/mocks/data';

function createProps(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe('product page metadata', () => {
  it('uses the product name and description', async () => {
    const product = mockProducts[0];
    const metadata = await generateMetadata(createProps(product.id));

    expect(metadata.title).toBe(`${product.name} | FitMySpace`);
    expect(metadata.description).toBe(product.description);
    expect(metadata.alternates?.canonical).toBe(`/products/${product.id}`);
  });

  it('returns a not-found title for an unknown product', async () => {
    const metadata = await generateMetadata(createProps('does-not-exist'));

    expect(metadata.title).toBe('Product not found | FitMySpace');
  });
});
