import { Inter } from 'next/font/google';
import { Providers } from './providers';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
