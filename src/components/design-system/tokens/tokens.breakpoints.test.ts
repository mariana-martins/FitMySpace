import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import documentedTokens from './tokens.docs.json';

/* ---------------------------------------------------------------
 * Breakpoint tests
 *
 * A media query cannot read a custom property, so a stylesheet writes
 * the value of a `semantic.breakpoint.*` token out by hand:
 * `@media (width < 640px)` for `--ds-semantic-breakpoint-sm`. These
 * tests read every design-system stylesheet and check that each width
 * in a media query is one of those values, so the CSS cannot drift
 * from the JSON (or slip back to `max-width: 639px`).
 * --------------------------------------------------------------- */

const DESIGN_SYSTEM_ROOT = path.join(__dirname, '..');
const GENERATED_STYLESHEET = path.join('tokens', 'tokens.css');

const MEDIA_PRELUDE_PATTERN = /@media([^{]+)\{/g;
const WIDTH_FEATURE_PATTERN = /width/;
const LENGTH_PATTERN = /\d+(?:\.\d+)?[a-z]+/g;

const breakpointValues = new Set(
  documentedTokens
    .filter((token) => token.path[0] === 'semantic' && token.path[1] === 'breakpoint')
    .map((token) => token.value),
);

function listStylesheets(): string[] {
  const relativePaths = readdirSync(DESIGN_SYSTEM_ROOT, { recursive: true, encoding: 'utf8' });
  return relativePaths
    .filter((relativePath) => relativePath.endsWith('.css'))
    .filter((relativePath) => relativePath !== GENERATED_STYLESHEET);
}

function findWidthMediaPreludes(stylesheet: string): string[] {
  return [...stylesheet.matchAll(MEDIA_PRELUDE_PATTERN)]
    .map((match) => match[1].trim())
    .filter((prelude) => WIDTH_FEATURE_PATTERN.test(prelude));
}

function findLengths(prelude: string): string[] {
  return prelude.match(LENGTH_PATTERN) ?? [];
}

/* ===============================================================
 * BREAKPOINT TOKENS
 * =============================================================== */

describe('Breakpoints — tokens', () => {
  it('finds the breakpoint tokens', () => {
    expect(breakpointValues.size).toBeGreaterThan(0);
  });
});

/* ===============================================================
 * MEDIA QUERIES
 * =============================================================== */

describe('Breakpoints — media queries', () => {
  it('only uses breakpoint token values in width media queries', () => {
    const strayWidths = listStylesheets().flatMap((relativePath) => {
      const stylesheet = readFileSync(path.join(DESIGN_SYSTEM_ROOT, relativePath), 'utf8');
      return findWidthMediaPreludes(stylesheet).flatMap((prelude) =>
        findLengths(prelude)
          .filter((length) => !breakpointValues.has(length))
          .map((length) => `${relativePath}: @media ${prelude} uses ${length}`),
      );
    });
    expect(strayWidths).toEqual([]);
  });
});
