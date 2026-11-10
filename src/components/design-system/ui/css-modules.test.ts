import { readdirSync, readFileSync } from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
 * CSS Module conventions
 *
 * Class names are kebab-case (`.icon-only`, `.error-icon`), matching
 * the variant classes built from props (`.fill-primary`, `.size-md`).
 * Components read them with bracket access: `styles['error-icon']`.
 * --------------------------------------------------------------- */

const UI_ROOT = __dirname;
const KEBAB_CASE = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const COMMENT_PATTERN = /\/\*[\s\S]*?\*\//g;
/** The text before each `{`: a selector list, or an at-rule such as `@media (...)`. */
const BLOCK_PRELUDE_PATTERN = /([^{}]+)\{/g;
const CLASS_SELECTOR_PATTERN = /\.(-?[_a-zA-Z][\w-]*)/g;

function listCssModules(): string[] {
  return readdirSync(UI_ROOT, { recursive: true, encoding: 'utf8' }).filter((relativePath) =>
    relativePath.endsWith('.module.css'),
  );
}

function findClassNames(css: string): string[] {
  const classNames = [...css.replace(COMMENT_PATTERN, '').matchAll(BLOCK_PRELUDE_PATTERN)]
    .map((match) => match[1].trim())
    .filter((prelude) => !prelude.startsWith('@'))
    .flatMap((selectorList) =>
      [...selectorList.matchAll(CLASS_SELECTOR_PATTERN)].map((match) => match[1]),
    );
  return [...new Set(classNames)];
}

/* ===============================================================
 * CLASS NAMES
 * =============================================================== */

describe('CSS Modules — class names', () => {
  it('finds the component style sheets', () => {
    expect(listCssModules().length).toBeGreaterThan(0);
  });

  it('uses kebab-case class names', () => {
    const invalidClassNames = listCssModules().flatMap((relativePath) =>
      findClassNames(readFileSync(path.join(UI_ROOT, relativePath), 'utf8'))
        .filter((className) => !KEBAB_CASE.test(className))
        .map((className) => `${relativePath}: .${className}`),
    );
    expect(invalidClassNames).toEqual([]);
  });
});
