import { PageLayout } from '@/components/templates/PageLayout';
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageLayout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oops! We couldn&apos;t find that page.
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          We&apos;re sorry, but the page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link href="/">
          <Button>Go back home</Button>
        </Link>
      </div>
    </PageLayout>
  );
}
