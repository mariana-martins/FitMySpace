'use client';

import { CustomLink } from '@/components/atoms/CustomLink/CustomLink';
import * as Dialog from '@radix-ui/react-dialog';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

const navigation = [
  { name: 'Recent Arrivals', href: '/recent' },
  { name: 'About Us', href: '/about' },
];

const barStyles =
  'w-full h-16 sm:h-20 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4';

const brandLinkStyles =
  'text-xl sm:text-2xl font-semibold text-brand-primary transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 rounded-sm shrink-0';

const menuButtonStyles =
  'md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 transition-colors';

export function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Closing on link click also covers links to the current page, where no navigation happens
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      aria-label="Main navigation"
      className="w-full border-b border-slate-200 bg-white shadow-sm"
    >
      <div className={barStyles}>
        <Link href="/" aria-label="Fit My Space Home" className={brandLinkStyles}>
          Fit My Space
        </Link>

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

        {/* Mobile Menu: Radix Dialog handles the focus trap, Escape, click outside, scroll lock and focus return */}
        <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <Dialog.Trigger asChild>
            <button type="button" className={menuButtonStyles} aria-label="Open menu">
              <Menu size={24} aria-hidden="true" />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/20 md:hidden" />

            {/* The panel covers the navbar and repeats its top row, so the close button sits where the menu button was */}
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed inset-x-0 top-0 z-50 bg-white border-b border-slate-200 shadow-lg md:hidden"
            >
              <Dialog.Title className="sr-only">Mobile navigation menu</Dialog.Title>

              <div className={barStyles}>
                <Link
                  href="/"
                  aria-label="Fit My Space Home"
                  className={brandLinkStyles}
                  onClick={closeMobileMenu}
                >
                  Fit My Space
                </Link>

                <Dialog.Close asChild>
                  <button type="button" className={menuButtonStyles} aria-label="Close menu">
                    <X size={24} aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>

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
                        onClick={closeMobileMenu}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </nav>
  );
}
