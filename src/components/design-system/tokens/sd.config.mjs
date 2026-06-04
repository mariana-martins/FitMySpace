import StyleDictionary from 'style-dictionary';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sd = new StyleDictionary({
  source: [resolve(__dirname, '*.json')],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: resolve(__dirname, '/'),
      prefix: 'ds',
      files: [
        {
          destination: resolve(__dirname, 'tokens.css'),
          format: 'css/variables',
          options: {
            outputReferences: true,
          },
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log('✅ Design System tokens built successfully.');
