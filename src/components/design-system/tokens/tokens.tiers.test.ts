import { readdirSync, readFileSync } from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
 * Token tier tests
 *
 * Each tier may only reference the tier directly below it, so a
 * component token never skips the semantic layer:
 *   - tier 2 (`semantic.*`) references tier 1 literals only;
 *   - tier 3 (`component.*`) references tier 2 or other tier-3 tokens.
 * Skipping a tier hard-codes a palette choice into a component and
 * breaks theming (e.g. dark mode swaps tier-2 aliases only).
 * --------------------------------------------------------------- */

type TokenTree = { [key: string]: TokenTree | string };

const REFERENCE_PATTERN = /\{([^}]+)\}/g;

/** Every `{token.path}` reference in a tier folder, with the file it came from. */
function collectReferences(tierFolder: string): { fileName: string; reference: string }[] {
  const tierDirectory = path.join(__dirname, tierFolder);
  const references: { fileName: string; reference: string }[] = [];

  function walk(node: TokenTree, fileName: string) {
    for (const [key, child] of Object.entries(node)) {
      if (typeof child === 'object') {
        walk(child, fileName);
      } else if (key === 'value') {
        for (const match of child.matchAll(REFERENCE_PATTERN)) {
          references.push({ fileName, reference: match[1] });
        }
      }
    }
  }

  for (const fileName of readdirSync(tierDirectory).filter((name) => name.endsWith('.json'))) {
    const fileContent = readFileSync(path.join(tierDirectory, fileName), 'utf8');
    walk(JSON.parse(fileContent) as TokenTree, fileName);
  }
  return references;
}

function isSemanticOrComponent(reference: string): boolean {
  return reference.startsWith('semantic.') || reference.startsWith('component.');
}

function describeReference({ fileName, reference }: { fileName: string; reference: string }) {
  return `${fileName}: {${reference}}`;
}

/* ===============================================================
 * TIERS
 * =============================================================== */

describe('Token tiers — references', () => {
  it('semantic tokens reference tier-1 literals only', () => {
    const violations = collectReferences('tier-2-definitions')
      .filter(({ reference }) => isSemanticOrComponent(reference))
      .map(describeReference);
    expect(violations).toEqual([]);
  });

  it('component tokens reference semantic or component tokens only', () => {
    const violations = collectReferences('tier-3-definitions')
      .filter(({ reference }) => !isSemanticOrComponent(reference))
      .map(describeReference);
    expect(violations).toEqual([]);
  });
});
