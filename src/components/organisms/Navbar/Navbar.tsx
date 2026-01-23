'use client';

import { CustomLink } from '@/components/atoms/CustomLink/CustomLink';
import { SearchInput } from '@/components/molecules/SearchInput';
import { useSearch } from '@/hooks/useSearch';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import * as React from 'react';
import Link from 'next/link';

const navigation = [
  { name: 'Recent Arrivals', href: '/recent' },
  { name: 'About Us', href: '/about' },
];

export function Navbar() {
  const pathname = usePathname();
  const { currentQuery, handleSearch } = useSearch();
  const [showSearch, setShowSearch] = React.useState(false);

  React.useEffect(() => {
    // Only enable the intersection observer on the home page where the hero search exists
    if (pathname !== '/') {
      setShowSearch(false);
      return;
    }

    const heroSection = document.getElementById('hero-search-section');
    if (!heroSection) return;

    // IntersectionObserver watches the hero search section.
    // When the hero search scrolls out of view (isIntersecting is false) AND is above the viewport (top < 0),
    // we show the sticky search bar in the navbar.
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isScrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setShowSearch(isScrolledPast);
      },
      { threshold: 0 },
    );

    observer.observe(heroSection);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm transition-all"
    >
      <div className="w-full h-20 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        <Link
          href="/"
          aria-label="Fit My Space Home"
          className="text-2xl font-semibold text-brand-primary transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 rounded-sm shrink-0"
        >
          Fit My Space
        </Link>

        {/* Sticky Search Bar */}
        <div
          className={cn(
            'flex-1 max-w-md transition-all duration-300 ease-in-out flex items-center justify-center',
            showSearch
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-2 pointer-events-none',
          )}
          aria-hidden={!showSearch}
        >
          <SearchInput
            label="Search products"
            placeholder="Search products..."
            value={currentQuery}
            onSearch={handleSearch}
            className="h-10 text-sm w-full"
          />
        </div>

        <ul className="flex space-x-6 shrink-0 items-center">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <CustomLink href={item.href} isActive={isActive}>
                  {item.name}
                </CustomLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
