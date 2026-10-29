import { type MouseEvent } from 'react';

/**
 * The part of the Navigation API used here, declared locally so it type-checks with any
 * TypeScript `lib.dom` version. Optional because older browsers do not implement it.
 */
type WindowWithNavigationApi = Window & { navigation?: { canGoBack: boolean } };

/**
 * Whether the previous history entry belongs to this site.
 * Uses the Navigation API, whose history only lists same-origin entries. Browsers without it
 * report `false`, so callers fall back to a regular link instead of leaving the site.
 */
export function canGoBackWithinSite(): boolean {
  if (typeof window === 'undefined') return false;

  const { navigation } = window as WindowWithNavigationApi;
  return navigation?.canGoBack ?? false;
}

/** A plain left click, without modifiers that open the link in a new tab or window. */
export function isPlainLeftClick(event: MouseEvent): boolean {
  const hasModifierKey = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  return event.button === 0 && !hasModifierKey;
}
