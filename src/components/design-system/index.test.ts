import { existsSync, readdirSync, readFileSync } from 'fs';
import path from 'path';

import * as designSystem from './';

/* ---------------------------------------------------------------
 * Entry point tests
 *
 * The app imports the design system from `index.ts` only, so a
 * component missing from it cannot be used. Every folder in `ui/`
 * with an `index.tsx` barrel must be re-exported there.
 * --------------------------------------------------------------- */

const UI_ROOT = path.join(__dirname, 'ui');
const ENTRY_POINT = readFileSync(path.join(__dirname, 'index.ts'), 'utf8');

function listComponentFolders(): string[] {
  return readdirSync(UI_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((folder) => existsSync(path.join(UI_ROOT, folder, 'index.tsx')));
}

/* ===============================================================
 * EXPORTS
 * =============================================================== */

describe('Design system entry point — exports', () => {
  it('re-exports every component folder', () => {
    const missingFolders = listComponentFolders().filter(
      (folder) => !ENTRY_POINT.includes(`export * from './ui/${folder}';`),
    );
    expect(missingFolders).toEqual([]);
  });

  it('exposes the components at runtime', () => {
    expect(designSystem.Button).toBeDefined();
    expect(designSystem.Dialog).toBeDefined();
    expect(designSystem.DS_ICONS).toBeDefined();
  });
});
