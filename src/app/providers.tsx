'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { queryClient } from '@/lib/react-query';
import { useEffect } from 'react';

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: unknown;
  resetErrorBoundary: () => void;
}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  return (
    <div role="alert" className="p-4 border border-red-300 rounded-lg bg-red-50">
      <h2 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h2>
      <pre className="text-sm text-red-600 mb-4">{errorMessage}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Try again
      </button>
    </div>
  );
}

function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize MSW in development, browser environment, AND on localhost
    // This allows real API routes to work when accessing from other devices on the network
    if (
      typeof window === 'undefined' ||
      process.env.NODE_ENV !== 'development' ||
      !window.location.hostname.includes('localhost')
    ) {
      return;
    }

    // Initialize MSW asynchronously without blocking render
    import('@/mocks/browser')
      .then(({ worker }) => {
        worker
          .start({
            onUnhandledRequest: 'bypass',
            quiet: true, // Reduce console logs
          })
          .catch(() => {
            // Silently fail - app will work without mocks
          });
      })
      .catch(() => {
        // Silently fail - app will work without mocks
      });
  }, []);

  // Always render children immediately - don't wait for MSW
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <MSWProvider>{children}</MSWProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
