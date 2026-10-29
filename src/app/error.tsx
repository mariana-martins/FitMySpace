'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';
import { useEffect } from 'react';

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { reset: resetFailedQueries } = useQueryErrorResetBoundary();

  useEffect(() => {
    console.error(error);
  }, [error]);

  function handleTryAgain() {
    // Without this, useSuspenseQuery rethrows the cached error instead of fetching again
    resetFailedQueries();
    // Unlike reset(), retry() also re-fetches the segment's Server Components
    retry();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4" role="alert">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <Button onClick={handleTryAgain}>Try again</Button>
    </div>
  );
}
