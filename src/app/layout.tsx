// The design system's tokens come first: globals.css and every component read them.
import '@/components/design-system/tokens/tokens.css';
import { Providers } from './providers';
import type { Metadata } from 'next';
import { SITE_URL } from '@/config';
import { dmSans } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'FitMySpace - Find Your Perfect Home Organization Products',
  description: 'Discover the perfect home organization products across multiple stores.',
  keywords: ['home organization', 'organizers', 'storage', 'home decor'],
  authors: [{ name: 'FitMySpace' }],
  openGraph: {
    title: 'FitMySpace - Find Your Perfect Home Organization Products',
    description: 'Discover the perfect home organization products across multiple stores.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={dmSans.variable}>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
