'use client';

import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';

function SearchResultsErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="flex flex-col items-center gap-4 py-12 px-4 text-center">
      <h3 className="text-lg font-semibold text-gray-900">We couldn&apos;t load the products</h3>
      <p className="text-gray-600 max-w-md">
        Something went wrong on our side. Your search and filters are still here, so you can try again.
      </p>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

/**
 * Keeps a failed search inside the results area, so the search bar and filters stay usable.
 * "Try again" also clears the failed query, or useSuspenseQuery would rethrow the cached error.
 */
export function SearchResultsErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetFailedQueries }) => (
        <ErrorBoundary FallbackComponent={SearchResultsErrorFallback} onReset={resetFailedQueries}>
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
