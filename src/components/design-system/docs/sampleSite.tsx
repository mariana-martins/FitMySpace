'use client';

import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '../ui/Dialog';
import { Caption, Heading } from '../ui/Typography';
import { List, ListItem } from '../ui/List';
import type { MouseEvent } from 'react';
import { Button } from '../ui/Button';
import { Link } from '../ui/Link';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Sample site (Storybook docs helper)
 *
 * The header and the footer of FitMySpace, as the Site Header and
 * Footer patterns build them, so the Page Layout pattern can show a
 * whole page without copying them. Links point at fragments and only
 * change which page is current. Not part of the public design system
 * API.
 * --------------------------------------------------------------- */

export const SAMPLE_NAVIGATION = [
  { name: 'Recent arrivals', href: '#recent', icon: 'sparkles' },
  { name: 'Rooms', href: '#rooms', icon: 'home' },
  { name: 'About us', href: '#about', icon: 'info' },
] as const;

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.5rem',
  width: '100%',
  boxSizing: 'border-box',
  paddingBlock: 'var(--ds-semantic-spacing-inset-md)',
  borderBlockEnd:
    'var(--ds-semantic-border-width-default) solid var(--ds-semantic-colour-border-disabled)',
} as const;

function Brand() {
  return (
    <Link href="#home" appearance="standalone" size="lg">
      FitMySpace
    </Link>
  );
}

export interface SampleSiteHeaderProps {
  /** `wide` shows the links in a row; `narrow` puts them behind a menu button, as on a phone. */
  layout: 'wide' | 'narrow';
}

/** The site header: the brand, the main navigation and the saved list. */
export function SampleSiteHeader({ layout }: SampleSiteHeaderProps) {
  const [currentHref, setCurrentHref] = useState<string>(SAMPLE_NAVIGATION[0].href);
  const [menuOpen, setMenuOpen] = useState(false);

  function goTo(href: string) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setCurrentHref(href);
      setMenuOpen(false);
    };
  }

  if (layout === 'wide') {
    return (
      <header style={headerStyle}>
        <Brand />
        <nav aria-label="Main navigation">
          <ul style={{ display: 'flex', gap: '1.5rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {SAMPLE_NAVIGATION.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  appearance="standalone"
                  size="md"
                  aria-current={item.href === currentHref ? 'page' : undefined}
                  onClick={goTo(item.href)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Button asChild variant="secondary" appearance="outline" size="sm" icon="star">
          <a href="#saved">Saved</a>
        </Button>
      </header>
    );
  }

  return (
    <header style={headerStyle}>
      <Brand />
      <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            appearance="ghost"
            size="md"
            icon="menu"
            aria-label="Open the menu"
          />
        </DialogTrigger>
        <DialogContent size="sm" initialFocus="title" closeLabel="Close the menu">
          <DialogTitle>Menu</DialogTitle>
          <DialogDescription>Where to go on FitMySpace.</DialogDescription>
          <DialogBody>
            <nav aria-label="Main navigation">
              <List size="sm">
                {[
                  ...SAMPLE_NAVIGATION,
                  { name: 'Saved', href: '#saved', icon: 'star' } as const,
                ].map((item) => (
                  <ListItem key={item.href} icon={item.icon}>
                    <Link
                      href={item.href}
                      appearance="standalone"
                      stretched
                      aria-current={item.href === currentHref ? 'page' : undefined}
                      onClick={goTo(item.href)}
                    >
                      {item.name}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </nav>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </header>
  );
}

const FOOTER_GROUPS = [
  {
    id: 'footer-rooms',
    title: 'Shop by room',
    links: ['Bathroom', 'Bedroom', 'Kitchen', 'Living room'],
  },
  {
    id: 'footer-about',
    title: 'FitMySpace',
    links: ['About us', 'How we check prices', 'Contact'],
  },
];

/** The site footer: groups of links, then the small print. */
export function SampleFooter() {
  return (
    <footer
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '100%',
        boxSizing: 'border-box',
        paddingBlock: 'var(--ds-semantic-spacing-section-sm)',
        borderBlockStart:
          'var(--ds-semantic-border-width-default) solid var(--ds-semantic-colour-border-disabled)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
        {FOOTER_GROUPS.map((group) => (
          <nav key={group.id} aria-labelledby={group.id}>
            <Heading id={group.id} level={2} size="sm" style={{ margin: '0 0 0.5rem' }}>
              {group.title}
            </Heading>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--ds-semantic-spacing-gap-md)',
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              {group.links.map((link) => (
                <li key={link}>
                  <Link
                    href={`#${link.toLowerCase().replaceAll(' ', '-')}`}
                    appearance="standalone"
                    size="sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <Caption>
        © 2026 FitMySpace. Prices and stock come from each store and can change; we check them every
        day.
      </Caption>
    </footer>
  );
}
