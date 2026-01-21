import { useRouter, useSearchParams } from 'next/navigation';

export function useSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const currentQuery = searchParams.get('query') || '';

  return {
    handleSearch,
    currentQuery,
    searchParams,
  };
}
