'use client';

import { CustomLink } from '@/components/atoms/CustomLink/CustomLink';
import { SearchInput } from '@/components/molecules/SearchInput';
import { useSearch } from '@/hooks/useSearch';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on Escape key
  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMobileMenuOpen]);

  // Trap focus in mobile menu when open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileMenuOpen]);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm transition-all"
    >
      <div className="w-full h-16 sm:h-20 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        <Link
          href="/"
          aria-label="Fit My Space Home"
          className="text-xl sm:text-2xl font-semibold text-brand-primary transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 rounded-sm shrink-0"
        >
          Fit My Space
        </Link>

        {/* Sticky Search Bar - Hidden on mobile */}
        <div
          className={cn(
            'hidden sm:flex flex-1 max-w-md transition-all duration-300 ease-in-out items-center justify-center',
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

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 shrink-0 items-center">
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

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-colors"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMobileMenuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/20 md:hidden z-40"
            aria-hidden="true"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu */}
          <div
            ref={mobileMenuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden z-50"
          >
            <ul className="flex flex-col p-4 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-lg font-medium transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600',
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </nav>
  );
}
