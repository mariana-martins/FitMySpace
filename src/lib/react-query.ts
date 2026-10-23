import { QueryClient, defaultShouldDehydrateQuery, isServer } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute — avoids refetching right after hydration
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1,
      },
      dehydrate: {
        // Also dehydrate pending queries so server prefetches can stream into Suspense boundaries
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        // Next.js redacts server errors itself and relies on them to detect dynamic rendering
        shouldRedactErrors: () => false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns a QueryClient for the current environment.
 * - Server: a new client per call, so cached data never leaks between requests/users.
 * - Browser: a singleton, so the cache survives re-renders and suspensions.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
