import { readdirSync, readFileSync } from 'fs';
import path from 'path';

/* ---------------------------------------------------------------
 * Token contrast tests (WCAG 2.2 AA)
 *
 * Resolves every token reference down to its hex value and checks
 * the colour pairs each component actually renders, in every
 * interactive state. This runs without a browser, so it covers
 * states that rendered tests cannot reach: storybook-addon-pseudo-states
 * only rewrites hover/active/focus styles in the Storybook UI, not in
 * the Vitest runner, so axe never sees those states there.
 *
 * Thresholds:
 *   - text: 4.5:1 (WCAG 1.4.3, normal-size text)
 *   - UI boundaries and focus indicators: 3:1 (WCAG 1.4.11)
 * Disabled states are exempt from both criteria and are not checked.
 * --------------------------------------------------------------- */

type TokenTree = { [key: string]: TokenTree | string };

const TEXT_MINIMUM = 4.5;
const NON_TEXT_MINIMUM = 3;
const TOKEN_TIERS = ['tier-1-definitions', 'tier-2-definitions', 'tier-3-definitions'];

function mergeTokenTrees(target: TokenTree, source: TokenTree): TokenTree {
  for (const [key, sourceValue] of Object.entries(source)) {
    const targetValue = target[key];
    if (typeof sourceValue === 'object' && typeof targetValue === 'object') {
      mergeTokenTrees(targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }
  return target;
}

function loadAllTokens(): TokenTree {
  const allTokens: TokenTree = {};
  for (const tier of TOKEN_TIERS) {
    const tierDirectory = path.join(__dirname, tier);
    for (const fileName of readdirSync(tierDirectory).filter((name) => name.endsWith('.json'))) {
      const fileContent = readFileSync(path.join(tierDirectory, fileName), 'utf8');
      mergeTokenTrees(allTokens, JSON.parse(fileContent) as TokenTree);
    }
  }
  return allTokens;
}

const allTokens = loadAllTokens();

/** Resolves a token path such as `component.button.primary.focus-ring` to its final value. */
function resolveToken(tokenPath: string): string {
  let currentNode: TokenTree | string = allTokens;
  for (const segment of tokenPath.split('.')) {
    if (typeof currentNode !== 'object' || !(segment in currentNode)) {
      throw new Error(`Unknown token: ${tokenPath}`);
    }
    currentNode = currentNode[segment];
  }
  if (typeof currentNode !== 'object' || typeof currentNode.value !== 'string') {
    throw new Error(`Not a token: ${tokenPath}`);
  }
  const reference = /^\{(.+)\}$/.exec(currentNode.value);
  return reference ? resolveToken(reference[1]) : currentNode.value;
}

function relativeLuminance(hexColour: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hexColour.slice(start, start + 2), 16) / 255);
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

const PAGE_BACKGROUND = 'semantic.color.background.default.base';

/** Resolves a colour token to hex. A transparent background shows the page behind it. */
function resolveColour(tokenPath: string): string {
  const value = resolveToken(tokenPath);
  return value === 'transparent' ? resolveToken(PAGE_BACKGROUND) : value;
}

function contrastRatio(foregroundToken: string, backgroundToken: string): number {
  const foregroundLuminance = relativeLuminance(resolveColour(foregroundToken));
  const backgroundLuminance = relativeLuminance(resolveColour(backgroundToken));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ===============================================================
 * BUTTON
 * =============================================================== */

const BUTTON_VARIANTS = ['primary', 'secondary', 'error', 'success', 'warning', 'information'];
const BUTTON_APPEARANCES = ['fill', 'outline', 'ghost'];
const BUTTON_INTERACTIVE_STATES = ['default', 'hover', 'focus', 'active'];

const buttonTextCases = BUTTON_VARIANTS.flatMap((variant) =>
  BUTTON_APPEARANCES.flatMap((appearance) =>
    BUTTON_INTERACTIVE_STATES.map((state) => [variant, appearance, state]),
  ),
);

describe('Button tokens — contrast', () => {
  it.each(buttonTextCases)(
    '%s %s text is readable in the %s state',
    (variant, appearance, state) => {
      const tokenGroup = `component.button.${variant}.${appearance}`;
      const ratio = contrastRatio(
        `${tokenGroup}.text.${state}`,
        `${tokenGroup}.background.${state}`,
      );
      expect(ratio).toBeGreaterThanOrEqual(TEXT_MINIMUM);
    },
  );

  it.each(BUTTON_VARIANTS)('%s focus ring stands out from the page', (variant) => {
    const ratio = contrastRatio(`component.button.${variant}.focus-ring`, PAGE_BACKGROUND);
    expect(ratio).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });
});

/* ===============================================================
 * INPUT AND TEXT FIELD
 * =============================================================== */

describe('Input tokens — contrast', () => {
  it.each([
    ['value text', 'component.input.text.default', 'component.input.background.default'],
    ['placeholder', 'component.input.text.placeholder', 'component.input.background.default'],
    ['unit', 'component.input.unit.text', 'component.input.background.default'],
    ['unit when disabled', 'component.input.unit.disabled', 'component.input.background.disabled'],
    [
      'value text when read-only',
      'component.input.text.default',
      'component.input.background.readonly',
    ],
  ])('%s is readable', (_description, foregroundToken, backgroundToken) => {
    expect(contrastRatio(foregroundToken, backgroundToken)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it.each([
    ['default', 'component.input.border.default'],
    ['hover', 'component.input.border.hover'],
    ['focus', 'component.input.border.focus'],
    ['invalid', 'component.input.border.invalid'],
  ])('%s border stands out from the field', (_state, borderToken) => {
    expect(contrastRatio(borderToken, 'component.input.background.default')).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });

  it.each([
    ['label', 'component.text-field.label.text'],
    ['required marker', 'component.text-field.label.required-marker'],
    ['hint', 'component.text-field.hint.text'],
    ['error message', 'component.text-field.error.text'],
  ])('text field %s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});
