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
 *
 * The `shorthand` token of each text style is generated here, not
 * written in the JSON: it can never drift from the parts it is built from.
 * --------------------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CSS_OUTPUT_FILE = 'tokens.css';
const DOCS_OUTPUT_FILE = 'tokens.docs.json';
const isCheck = process.argv.includes('--check');

/** The text style parts the CSS `font` shorthand can carry. Letter spacing is not one of them. */
const SHORTHAND_PARTS = ['fontWeight', 'fontSize', 'lineHeight', 'fontFamily'];

function isTextStyle(group) {
  return SHORTHAND_PARTS.every((part) => part in group);
}

/**
 * Adds `semantic.typography.<role>.<size>.shorthand` to every text style:
 * a `font` value made of references to the style's own tokens, e.g.
 * `font: var(--ds-semantic-typography-heading-lg-shorthand)`.
 */
function addTypographyShorthands(tokenTree) {
  const textRoles = tokenTree.semantic?.typography ?? {};
  for (const [role, textStyles] of Object.entries(textRoles)) {
    for (const [size, textStyle] of Object.entries(textStyles)) {
      if (!isTextStyle(textStyle)) continue;
      const referenceTo = (part) => `{semantic.typography.${role}.${size}.${part}}`;
      textStyle.shorthand = {
        value: `${referenceTo('fontWeight')} ${referenceTo('fontSize')}/${referenceTo('lineHeight')} ${referenceTo('fontFamily')}`,
        comment: 'The CSS font shorthand. It cannot carry letter spacing: set letter-spacing too.',
      };
    }
  }
  return tokenTree;
}

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
    preprocessors: { 'typography/shorthand': addTypographyShorthands },
  },
  preprocessors: ['typography/shorthand'],
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
