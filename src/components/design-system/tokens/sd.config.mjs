import StyleDictionary from 'style-dictionary';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/* ---------------------------------------------------------------
 * Style Dictionary build
 *
 *   node sd.config.mjs          writes tokens.css
 *   node sd.config.mjs --check  fails if tokens.css is out of date
 *                               with the JSON (writes nothing)
 * --------------------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_FILE = 'tokens.css';
const isCheck = process.argv.includes('--check');

const sd = new StyleDictionary({
  // In check mode Style Dictionary would still log "✔︎ tokens.css", as if it had written the file.
  log: { verbosity: isCheck ? 'silent' : 'default' },
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
          destination: OUTPUT_FILE,
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
});

async function checkOutputIsCurrent() {
  const [generatedFile] = await sd.formatPlatform('css');
  const committedOutput = readFileSync(resolve(__dirname, OUTPUT_FILE), 'utf8');

  if (generatedFile.output !== committedOutput) {
    console.error(`❌ ${OUTPUT_FILE} is out of date with the token JSON. Run: npm run tokens:build`);
    process.exit(1);
  }
  console.log(`✅ ${OUTPUT_FILE} is up to date.`);
}

if (isCheck) {
  await checkOutputIsCurrent();
} else {
  await sd.buildAllPlatforms();
  console.log('✅ Design System tokens built successfully.');
}
