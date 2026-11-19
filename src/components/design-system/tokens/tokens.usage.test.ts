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
 * such as `--ds-colour-${prefix}-${weight}`, which cannot be checked statically.
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

/* ===============================================================
 * TIER 1 STAYS IN THE TOKENS
 *
 * Tier 1 holds the raw values; everything that draws (components,
 * stories, the app's CSS and TSX) reads a semantic or component
 * token, so a theme can change one role without hunting down raw
 * values. Only the tokens themselves and the pages that document
 * tier 1 (Foundation pages and the Introduction) may name it.
 * Stylelint checks the same in design-system CSS as you type.
 * =============================================================== */

const SOURCE_ROOT = path.join(__dirname, '..', '..', '..');
const TIER_ONE_EXCEPTIONS = ['tokens', 'foundations', 'introduction'].map((folder) =>
  path.join(DESIGN_SYSTEM_ROOT, folder),
);
const TIER_ONE_EXTENSIONS = [...SOURCE_EXTENSIONS, '.css'];
const TIER_ONE_USE_PATTERN = /var\(\s*(--ds-(?!semantic-|component-)[a-z0-9-]+)/g;

function isTierOneException(absolutePath: string): boolean {
  return TIER_ONE_EXCEPTIONS.some((folder) => absolutePath.startsWith(folder + path.sep));
}

function listAppAndSystemFiles(): string[] {
  const relativePaths = readdirSync(SOURCE_ROOT, { recursive: true, encoding: 'utf8' });
  return relativePaths
    .map((relativePath) => path.join(SOURCE_ROOT, relativePath))
    .filter((absolutePath) => TIER_ONE_EXTENSIONS.includes(path.extname(absolutePath)))
    .filter((absolutePath) => !/\.test\.tsx?$/.test(absolutePath))
    .filter((absolutePath) => !isTierOneException(absolutePath));
}

describe('Token usage — tier 1 stays in the tokens', () => {
  it('no component, story or app file reads a tier-1 token', () => {
    const tierOneUses = listAppAndSystemFiles().flatMap((absolutePath) =>
      [...readFileSync(absolutePath, 'utf8').matchAll(TIER_ONE_USE_PATTERN)].map(
        (match) => `${path.relative(SOURCE_ROOT, absolutePath)}: ${match[1]}`,
      ),
    );
    expect(tierOneUses).toEqual([]);
  });
});
