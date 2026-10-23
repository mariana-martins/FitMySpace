import { getQueryClient } from '@/lib/react-query';

describe('getQueryClient', () => {
  it('returns the same client on every call in the browser', () => {
    expect(getQueryClient()).toBe(getQueryClient());
  });

  it('dehydrates pending queries so server prefetches can stream', () => {
    const client = getQueryClient();
    const shouldDehydrateQuery = client.getDefaultOptions().dehydrate?.shouldDehydrateQuery;

    expect(shouldDehydrateQuery).toBeDefined();
  });
});
