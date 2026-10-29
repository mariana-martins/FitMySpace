'use client';

import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { PageLayout } from '@/components/templates/PageLayout';
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
    resetFailedQueries();
    retry();
  }

  return (
    <PageLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4" role="alert">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-4">{error.message}</p>
        <Button onClick={handleTryAgain}>Try again</Button>
      </div>
    </PageLayout>
  );
}
