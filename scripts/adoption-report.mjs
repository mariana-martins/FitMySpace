import { appendFileSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

/*
 * Design-system adoption in the app (docs/migration-plan.md): which design-system components the
 * app's production code imports, and which legacy components it still does. It counts files, not
 * renders, and leaves out tests, stories and the design system itself, so the numbers move only
 * when the app changes.
 *
 *   npm run adoption            Markdown, also appended to the GitHub job summary in CI
 *   npm run adoption -- --json  the same numbers as JSON
 *
 * It never fails a build: it is a measurement. The migration plan reads it.
 */
const SOURCE_ROOT = resolve('src');
const DESIGN_SYSTEM_ROOT = join(SOURCE_ROOT, 'components', 'design-system');
const DESIGN_SYSTEM_ENTRY = '@/components/design-system';
const LEGACY_TIERS = ['atoms', 'molecules', 'organisms', 'templates'];
const SOURCE_EXTENSIONS = ['.ts', '.tsx'];
const IGNORED_DIRECTORIES = [
  DESIGN_SYSTEM_ROOT,
  join(SOURCE_ROOT, '__tests__'),
  join(SOURCE_ROOT, 'mocks'),
  // The check page renders design-system components on purpose; it is not adoption.
  join(SOURCE_ROOT, 'app', 'design-system'),
];
const IGNORED_FILE_PATTERN = /\.(test|spec|stories)\.tsx?$/;

const IMPORT_PATTERN = /import\s+(type\s+)?([^'"]*?)\s*from\s*['"]([^'"]+)['"]/g;

function isIgnoredDirectory(directoryPath) {
  return IGNORED_DIRECTORIES.some((ignored) => directoryPath === ignored);
}

function isProductionSourceFile(fileName) {
  const hasSourceExtension = SOURCE_EXTENSIONS.some((extension) => fileName.endsWith(extension));
  return hasSourceExtension && !IGNORED_FILE_PATTERN.test(fileName) && !fileName.endsWith('.d.ts');
}

function listProductionFiles(directoryPath) {
  const files = [];

  for (const entry of readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (!isIgnoredDirectory(entryPath)) files.push(...listProductionFiles(entryPath));
    } else if (isProductionSourceFile(entry.name)) {
      files.push(entryPath);
    }
  }

  return files;
}

function readDesignSystemComponentNames() {
  const entryPoint = readFileSync(join(DESIGN_SYSTEM_ROOT, 'index.ts'), 'utf8');
  return [...entryPoint.matchAll(/export \* from '\.\/ui\/([A-Za-z]+)'/g)].map((match) => match[1]);
}

/** Every value a component folder exports, mapped to the folder: `Heading` to `Typography`. */
function readExportOwners(componentNames) {
  const owners = new Map();

  for (const componentName of componentNames) {
    const barrel = readFileSync(join(DESIGN_SYSTEM_ROOT, 'ui', componentName, 'index.tsx'), 'utf8');

    for (const [, exportList] of barrel.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const exportedName of exportList.split(',').map((name) => name.trim())) {
        if (exportedName) owners.set(exportedName.split(/\s+as\s+/).pop(), componentName);
      }
    }
  }

  return owners;
}

function listLegacyComponents() {
  return LEGACY_TIERS.flatMap((tier) =>
    readdirSync(join(SOURCE_ROOT, 'components', tier), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => `${tier}/${entry.name}`),
  );
}

/** `@/x` and relative specifiers as a path inside `src`, or null for a package. */
function resolveSpecifier(specifier, importingFile) {
  if (specifier.startsWith('@/')) return join(SOURCE_ROOT, specifier.slice(2));
  if (specifier.startsWith('.')) return resolve(dirname(importingFile), specifier);
  return null;
}

/** The legacy component (`atoms/Button`) a path points into, or null. */
function legacyComponentOf(absolutePath) {
  const parts = relative(join(SOURCE_ROOT, 'components'), absolutePath).split(sep);
  const [tier, componentName] = parts;
  return LEGACY_TIERS.includes(tier) && componentName ? `${tier}/${componentName}` : null;
}

/** Value imports from the entry point, e.g. `{ Button, type ButtonProps }` gives `Button`. */
function namedValueImports(importClause) {
  const braces = importClause.match(/\{([^}]*)\}/);
  if (!braces) return [];

  return braces[1]
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name && !name.startsWith('type '))
    .map((name) => name.split(/\s+as\s+/)[0]);
}

function measureAdoption() {
  const designSystemComponents = readDesignSystemComponentNames();
  const exportOwners = readExportOwners(designSystemComponents);
  const legacyComponents = listLegacyComponents();
  const designSystemUse = new Map(designSystemComponents.map((name) => [name, new Set()]));
  const legacyUse = new Map(legacyComponents.map((name) => [name, new Set()]));

  for (const file of listProductionFiles(SOURCE_ROOT)) {
    const source = readFileSync(file, 'utf8');
    const fileFromRoot = relative(process.cwd(), file);
    const ownLegacyComponent = legacyComponentOf(file);

    for (const [, typeOnly, importClause, specifier] of source.matchAll(IMPORT_PATTERN)) {
      if (typeOnly) continue;

      if (specifier === DESIGN_SYSTEM_ENTRY) {
        for (const name of namedValueImports(importClause)) {
          designSystemUse.get(exportOwners.get(name))?.add(fileFromRoot);
        }
        continue;
      }

      const target = resolveSpecifier(specifier, file);
      const legacyComponent = target && legacyComponentOf(target);
      // A component's own files importing each other is not use by the app.
      if (legacyComponent && legacyComponent !== ownLegacyComponent) {
        legacyUse.get(legacyComponent)?.add(fileFromRoot);
      }
    }
  }

  return { designSystemUse, legacyUse };
}

function summarise({ designSystemUse, legacyUse }) {
  const designSystemInUse = [...designSystemUse].filter(([, files]) => files.size > 0);
  const legacyInUse = [...legacyUse].filter(([, files]) => files.size > 0);

  return {
    designSystem: {
      componentsInUse: designSystemInUse.length,
      componentsAvailable: designSystemUse.size,
      importingFiles: new Set(designSystemInUse.flatMap(([, files]) => [...files])).size,
      byComponent: Object.fromEntries(designSystemInUse.map(([name, files]) => [name, files.size])),
    },
    legacy: {
      componentsInUse: legacyInUse.length,
      componentsTotal: legacyUse.size,
      byComponent: Object.fromEntries(legacyInUse.map(([name, files]) => [name, files.size])),
      unused: [...legacyUse].filter(([, files]) => files.size === 0).map(([name]) => name),
    },
  };
}

function plural(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

function toMarkdown(summary) {
  const { designSystem, legacy } = summary;
  const lines = [
    '## Design-system adoption',
    '',
    `- Design-system components the app imports: **${designSystem.componentsInUse} of ${designSystem.componentsAvailable}**, in ${plural(designSystem.importingFiles, 'file')}`,
    `- Legacy components still imported: **${legacy.componentsInUse} of ${legacy.componentsTotal}**`,
    '',
    '| Legacy component | Files importing it |',
    '| --- | --: |',
    ...Object.entries(legacy.byComponent)
      .sort(([, first], [, second]) => second - first)
      .map(([name, count]) => `| ${name} | ${count} |`),
  ];

  if (legacy.unused.length > 0) {
    lines.push('', `Legacy components nothing imports (delete them): ${legacy.unused.join(', ')}`);
  }

  if (designSystem.componentsInUse > 0) {
    lines.push(
      '',
      '| Design-system component | Files importing it |',
      '| --- | --: |',
      ...Object.entries(designSystem.byComponent).map(([name, count]) => `| ${name} | ${count} |`),
    );
  }

  return `${lines.join('\n')}\n`;
}

const summary = summarise(measureAdoption());

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(summary, null, 2));
} else {
  const markdown = toMarkdown(summary);
  console.log(markdown);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}
