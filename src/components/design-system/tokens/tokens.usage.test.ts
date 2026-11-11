import { readdirSync, readFileSync } from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
 * Token usage tests
 *
 * A misspelled or deleted token is silent in CSS: `var(--ds-typo)`
 * resolves to nothing and the browser drops the declaration. These
 * tests read every design-system TypeScript and MDX file (inline
 * styles, stories) and check that each `--ds-*` name it mentions is
 * defined in the generated tokens.css.
 *
 * Stylesheets are checked by Stylelint instead (`npm run lint:css`):
 * unknown tokens, tier-1 tokens in components and class name casing.
 * --------------------------------------------------------------- */

const DESIGN_SYSTEM_ROOT = path.join(__dirname, '..');
const TOKENS_CSS = path.join(__dirname, 'tokens.css');
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.mdx'];

/**
 * A complete token name. The lookahead skips names built at runtime,
 * such as `--ds-color-${prefix}-${weight}`, which cannot be checked statically.
 */
const TOKEN_NAME_PATTERN = /--ds-[a-z0-9-]*[a-z0-9](?![\w$-])/g;
const DEFINITION_PATTERN = /^\s*(--ds-[a-z0-9-]+):/gm;

function listSourceFiles(): string[] {
  const relativePaths = readdirSync(DESIGN_SYSTEM_ROOT, { recursive: true, encoding: 'utf8' });
  return relativePaths
    .filter((relativePath) => SOURCE_EXTENSIONS.includes(path.extname(relativePath)))
    .filter((relativePath) => !relativePath.endsWith('.test.ts'));
}

function readSource(relativePath: string): string {
  return readFileSync(path.join(DESIGN_SYSTEM_ROOT, relativePath), 'utf8');
}

function findTokenNames(source: string): string[] {
  return [...new Set(source.match(TOKEN_NAME_PATTERN) ?? [])];
}

const definedTokens = new Set(
  [...readFileSync(TOKENS_CSS, 'utf8').matchAll(DEFINITION_PATTERN)].map((match) => match[1]),
);

/* ===============================================================
 * DEFINED TOKENS
 * =============================================================== */

describe('Token usage — defined tokens', () => {
  it('finds the generated tokens', () => {
    expect(definedTokens.size).toBeGreaterThan(0);
  });

  it('only references tokens that exist in tokens.css', () => {
    const unknownTokens = listSourceFiles().flatMap((relativePath) =>
      findTokenNames(readSource(relativePath))
        .filter((tokenName) => !definedTokens.has(tokenName))
        .map((tokenName) => `${relativePath}: ${tokenName}`),
    );
    expect(unknownTokens).toEqual([]);
  });
});
