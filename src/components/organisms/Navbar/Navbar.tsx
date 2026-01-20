'use client';

import { CustomLink } from '@/components/atoms/CustomLink/CustomLink';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigation = [
  { name: 'Recent Arrivals', href: '/recent' },
  { name: 'About', href: '/about' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="w-full border-b border-slate-200 bg-white p-4">
      <div className="w-full max-h-16 max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Fit My Space Home"
          className="text-2xl font-semibold text-brand-primary transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 rounded-sm"
        >
          Fit My Space
        </Link>

        <ul className="flex space-x-6">
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
