import { basename, dirname, resolve } from 'path';
import StyleDictionary from 'style-dictionary';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';

/* ---------------------------------------------------------------
 * Style Dictionary build
 *
 *   node sd.config.mjs          writes tokens.css and tokens.docs.json
 *   node sd.config.mjs --check  fails if either file is out of date
 *                               with the JSON (writes nothing)
 *
 * tokens.css is what components use. tokens.docs.json feeds the
 * Storybook Foundation pages, so they never keep a hand-written list.
 * --------------------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CSS_OUTPUT_FILE = 'tokens.css';
const DOCS_OUTPUT_FILE = 'tokens.docs.json';
const isCheck = process.argv.includes('--check');

/**
 * One entry per token: the CSS variable, its path in the JSON, the
 * resolved value and its comment. The alias chain is left out on
 * purpose: the docs should not lead consumers from a semantic token
 * to the tier-1 value behind it.
 */
function formatDocs({ dictionary }) {
  const documentedTokens = dictionary.allTokens.map((token) => ({
    name: `--${token.name}`,
    path: token.path,
    value: token.value,
    comment: token.comment ?? null,
  }));
  // One token per line keeps the file short and its diffs readable.
  const lines = documentedTokens.map((documentedToken) => `  ${JSON.stringify(documentedToken)}`);
  return `[\n${lines.join(',\n')}\n]\n`;
}

const sd = new StyleDictionary({
  // In check mode Style Dictionary would still log "✔︎ tokens.css", as if it had written the file.
  log: { verbosity: isCheck ? 'silent' : 'default' },
  hooks: {
    formats: { 'json/docs': formatDocs },
  },
  source: [
    resolve(__dirname, 'tier-1-definitions/*.json'),
    resolve(__dirname, 'tier-2-definitions/*.json'),
    resolve(__dirname, 'tier-3-definitions/*.json'),
  ],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: `${__dirname}/`,
      prefix: 'ds',
      files: [
        {
          destination: CSS_OUTPUT_FILE,
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    docs: {
      // Same transforms and prefix as css, so names and values match tokens.css.
      transformGroup: 'css',
      buildPath: `${__dirname}/`,
      prefix: 'ds',
      files: [{ destination: DOCS_OUTPUT_FILE, format: 'json/docs' }],
    },
  },
});

function readCommittedOutput(destination) {
  const filePath = resolve(__dirname, destination);
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : null;
}

async function checkOutputIsCurrent() {
  const platformOutputs = await Promise.all(
    Object.keys(sd.platforms).map((platform) => sd.formatPlatform(platform)),
  );
  const staleFiles = platformOutputs
    .flat()
    .filter(
      (generatedFile) => generatedFile.output !== readCommittedOutput(generatedFile.destination),
    )
    .map((generatedFile) => basename(generatedFile.destination));

  if (staleFiles.length > 0) {
    console.error(
      `❌ Out of date with the token JSON: ${staleFiles.join(', ')}. Run: npm run tokens:build`,
    );
    process.exit(1);
  }
  console.log(`✅ ${CSS_OUTPUT_FILE} and ${DOCS_OUTPUT_FILE} are up to date.`);
}

if (isCheck) {
  await checkOutputIsCurrent();
} else {
  await sd.buildAllPlatforms();
  console.log('✅ Design System tokens built successfully.');
}
