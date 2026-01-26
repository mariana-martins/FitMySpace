import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { SkipLink } from '@/components/atoms/SkipLink';
import { cn } from '@/lib/utils';

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function PageLayout({ children, className, ...props }: PageLayoutProps) {
  return (
    <div className="w-full justify-center flex min-h-screen bg-white flex-col">
      <SkipLink />
      <Navbar />
      <main id="main-content" className={cn('flex-1 bg-white', className)} {...props} tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
