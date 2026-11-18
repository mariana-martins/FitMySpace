import { readdirSync, readFileSync } from 'fs';
import path from 'path';

import { UTILITY_VARIANTS } from '../utils';

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

const PAGE_BACKGROUND = 'semantic.colour.background.default.base';

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
 * FOCUS
 * =============================================================== */

describe('Focus tokens — contrast', () => {
  it.each([
    // The outset ring sits on the page; the inset ring sits on the item's own
    // background, which is the hover tint when the pointer is also over it.
    ['the page', PAGE_BACKGROUND],
    ['a hovered item', 'semantic.colour.background.default.hover'],
  ])('default ring stands out from %s', (_description, backgroundToken) => {
    expect(contrastRatio('semantic.focus.ring.colour', backgroundToken)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });
});

/* ===============================================================
 * BUTTON
 * =============================================================== */

const BUTTON_VARIANTS = ['primary', 'secondary', ...UTILITY_VARIANTS];
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

/* ===============================================================
 * CHECKBOX
 * =============================================================== */

describe('Checkbox tokens — contrast', () => {
  it.each([
    ['default', 'component.checkbox.border.default'],
    ['hover', 'component.checkbox.border.hover'],
    ['invalid', 'component.checkbox.border.invalid'],
  ])('%s box border stands out from the page', (_state, borderToken) => {
    expect(contrastRatio(borderToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['primary checked', 'component.checkbox.background.primary.checked'],
    ['primary checked and hovered', 'component.checkbox.background.primary.checked-hover'],
    ['secondary checked', 'component.checkbox.background.secondary.checked'],
    ['secondary checked and hovered', 'component.checkbox.background.secondary.checked-hover'],
    ['checked and invalid', 'component.checkbox.background.invalid-checked'],
  ])('%s box stands out from the page', (_state, backgroundToken) => {
    expect(contrastRatio(backgroundToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });

  it.each([
    ['primary checked', 'component.checkbox.background.primary.checked'],
    ['primary checked and hovered', 'component.checkbox.background.primary.checked-hover'],
    ['secondary checked', 'component.checkbox.background.secondary.checked'],
    ['secondary checked and hovered', 'component.checkbox.background.secondary.checked-hover'],
    ['checked and invalid', 'component.checkbox.background.invalid-checked'],
  ])('mark stands out from the %s box', (_state, backgroundToken) => {
    expect(
      contrastRatio('component.checkbox.mark.default', backgroundToken),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['label', 'component.checkbox.label.text'],
    ['required marker', 'component.checkbox.label.required-marker'],
    ['hint', 'component.checkbox.hint.text'],
    ['error message', 'component.checkbox.error.text'],
  ])('%s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * BADGE
 * =============================================================== */

const BADGE_VARIANTS = ['primary', 'secondary', ...UTILITY_VARIANTS];
const BADGE_APPEARANCES = ['fill', 'soft'];

const badgeCases = BADGE_VARIANTS.flatMap((variant) =>
  BADGE_APPEARANCES.map((appearance) => [variant, appearance]),
);

describe('Badge tokens — contrast', () => {
  it.each(badgeCases)('%s %s text is readable', (variant, appearance) => {
    const tokenGroup = `component.badge.${variant}.${appearance}`;
    expect(contrastRatio(`${tokenGroup}.text`, `${tokenGroup}.background`)).toBeGreaterThanOrEqual(
      TEXT_MINIMUM,
    );
  });
});

/* ===============================================================
 * CHIP
 * =============================================================== */

describe('Chip tokens — contrast', () => {
  it.each([
    ['resting', 'component.chip.text.default', 'component.chip.background.default'],
    ['hovered', 'component.chip.text.default', 'component.chip.background.hover'],
    ['pressed', 'component.chip.text.default', 'component.chip.background.active'],
    ['selected', 'component.chip.text.selected', 'component.chip.background.selected'],
  ])('%s text is readable', (_state, textToken, backgroundToken) => {
    expect(contrastRatio(textToken, backgroundToken)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it.each([
    ['resting', 'component.chip.border.default'],
    ['hovered', 'component.chip.border.hover'],
    ['selected', 'component.chip.border.selected'],
    ['selected and hovered', 'component.chip.border.selected-hover'],
  ])('%s border stands out from the page', (_state, borderToken) => {
    expect(contrastRatio(borderToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });
});

/* ===============================================================
 * SELECT AND SELECT FIELD
 * =============================================================== */

describe('Select tokens — contrast', () => {
  it.each([
    ['chosen option', 'component.select.text.default'],
    ['placeholder', 'component.select.text.placeholder'],
  ])('%s text is readable', (_description, textToken) => {
    expect(contrastRatio(textToken, 'component.select.background.default')).toBeGreaterThanOrEqual(
      TEXT_MINIMUM,
    );
  });

  it.each([
    ['default', 'component.select.border.default'],
    ['hover', 'component.select.border.hover'],
    ['focus', 'component.select.border.focus'],
    ['invalid', 'component.select.border.invalid'],
  ])('%s border stands out from the field', (_state, borderToken) => {
    expect(
      contrastRatio(borderToken, 'component.select.background.default'),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['default', 'component.select.icon.default'],
    ['focus', 'component.select.icon.focus'],
    ['invalid', 'component.select.icon.invalid'],
  ])('%s chevron stands out from the field', (_state, iconToken) => {
    expect(contrastRatio(iconToken, 'component.select.background.default')).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });

  it.each([
    ['option', 'component.select.item.text', 'component.select.content.background'],
    [
      'highlighted option',
      'component.select.item.highlighted-text',
      'component.select.item.highlighted-background',
    ],
    ['group label', 'component.select.group-label.text', 'component.select.content.background'],
  ])('%s text is readable in the list', (_description, textToken, backgroundToken) => {
    expect(contrastRatio(textToken, backgroundToken)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it.each([
    ['the list', 'component.select.content.background'],
    ['a highlighted option', 'component.select.item.highlighted-background'],
  ])('selected check mark stands out from %s', (_description, backgroundToken) => {
    expect(
      contrastRatio('component.select.item.indicator', backgroundToken),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['label', 'component.select-field.label.text'],
    ['required marker', 'component.select-field.label.required-marker'],
    ['hint', 'component.select-field.hint.text'],
    ['error message', 'component.select-field.error.text'],
  ])('select field %s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * RADIO GROUP
 * =============================================================== */

describe('RadioGroup tokens — contrast', () => {
  it.each([
    ['default', 'component.radio-group.border.default'],
    ['hover', 'component.radio-group.border.hover'],
    ['invalid', 'component.radio-group.border.invalid'],
  ])('%s circle border stands out from the page', (_state, borderToken) => {
    expect(contrastRatio(borderToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  const checkedBackgrounds = [
    ['primary checked', 'component.radio-group.background.primary.checked'],
    ['primary checked and hovered', 'component.radio-group.background.primary.checked-hover'],
    ['secondary checked', 'component.radio-group.background.secondary.checked'],
    ['secondary checked and hovered', 'component.radio-group.background.secondary.checked-hover'],
    ['checked and invalid', 'component.radio-group.background.invalid-checked'],
  ];

  it.each(checkedBackgrounds)('%s circle stands out from the page', (_state, backgroundToken) => {
    expect(contrastRatio(backgroundToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });

  it.each(checkedBackgrounds)('dot stands out from the %s circle', (_state, backgroundToken) => {
    expect(
      contrastRatio('component.radio-group.dot.default', backgroundToken),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['label', 'component.radio-group.label.text'],
    ['required marker', 'component.radio-group.label.required-marker'],
    ['hint', 'component.radio-group.hint.text'],
    ['error message', 'component.radio-group.error.text'],
  ])('%s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * LINK
 * =============================================================== */

describe('Link tokens — contrast', () => {
  it.each([
    ['inline', 'component.link.text.inline.default'],
    ['hovered inline', 'component.link.text.inline.hover'],
    ['standalone', 'component.link.text.standalone.default'],
    ['hovered standalone', 'component.link.text.standalone.hover'],
    ['current page', 'component.link.text.standalone.current'],
  ])('%s link text is readable on the page', (_state, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * BREADCRUMB
 * =============================================================== */

describe('Breadcrumb tokens — contrast', () => {
  it.each([
    ['ancestor', 'component.breadcrumb.text.default'],
    ['hovered ancestor', 'component.breadcrumb.text.hover'],
    ['current page', 'component.breadcrumb.text.current'],
  ])('%s text is readable on the page', (_state, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it('separator stands out from the page', () => {
    expect(
      contrastRatio('component.breadcrumb.separator.colour', PAGE_BACKGROUND),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });
});

/* ===============================================================
 * PAGINATION
 * =============================================================== */

describe('Pagination tokens — contrast', () => {
  it.each([
    ['page number', 'component.pagination.text.default', PAGE_BACKGROUND],
    [
      'hovered page number',
      'component.pagination.text.default',
      'component.pagination.background.hover',
    ],
    [
      'pressed page number',
      'component.pagination.text.default',
      'component.pagination.background.active',
    ],
    [
      'current page number',
      'component.pagination.text.current',
      'component.pagination.background.current',
    ],
    ['ellipsis', 'component.pagination.text.ellipsis', PAGE_BACKGROUND],
  ])('%s is readable', (_description, textToken, backgroundToken) => {
    expect(contrastRatio(textToken, backgroundToken)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it('current page stands out from the page', () => {
    expect(
      contrastRatio('component.pagination.background.current', PAGE_BACKGROUND),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });
});

/* ===============================================================
 * SEARCH FIELD
 * =============================================================== */

describe('SearchField tokens — contrast', () => {
  it.each([
    ['label', 'component.search-field.label.text'],
    ['hint', 'component.search-field.hint.text'],
    ['error message', 'component.search-field.error.text'],
  ])('%s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * EMPTY STATE
 * =============================================================== */

describe('EmptyState tokens — contrast', () => {
  it.each([
    ['title', 'component.empty-state.title.text'],
    ['description', 'component.empty-state.description.text'],
  ])('%s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it('icon stands out from its circle', () => {
    expect(
      contrastRatio('component.empty-state.icon.colour', 'component.empty-state.icon.background'),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });
});

/* ===============================================================
 * LIST
 * =============================================================== */

describe('List tokens — contrast', () => {
  it.each([
    ['title', 'component.list.title.text'],
    ['description', 'component.list.description.text'],
  ])('%s is readable on the list', (_description, textToken) => {
    expect(contrastRatio(textToken, 'component.list.background')).toBeGreaterThanOrEqual(
      TEXT_MINIMUM,
    );
  });

  it.each([
    ['title', 'component.list.title.text'],
    ['description', 'component.list.description.text'],
  ])('%s is readable on a hovered row', (_description, textToken) => {
    expect(contrastRatio(textToken, 'component.list.hover.background')).toBeGreaterThanOrEqual(
      TEXT_MINIMUM,
    );
  });

  it('icon stands out from its circle', () => {
    expect(
      contrastRatio('component.list.leading.icon', 'component.list.leading.background'),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it('outline edge stands out from the page', () => {
    expect(contrastRatio('component.list.border.outline', PAGE_BACKGROUND)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });
});

/* ===============================================================
 * SKIP LINK
 * =============================================================== */

describe('SkipLink tokens — contrast', () => {
  it('text is readable on its fill', () => {
    expect(
      contrastRatio('component.skip-link.text', 'component.skip-link.background'),
    ).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it('fill stands out from the page', () => {
    expect(contrastRatio('component.skip-link.background', PAGE_BACKGROUND)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });
});

/* ===============================================================
 * SWITCH
 * =============================================================== */

describe('Switch tokens — contrast', () => {
  it.each([
    ['default', 'component.switch.track.edge.default'],
    ['hover', 'component.switch.track.edge.hover'],
    ['invalid', 'component.switch.track.edge.invalid'],
  ])('%s track edge stands out from the page', (_state, edgeToken) => {
    expect(contrastRatio(edgeToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  const checkedTracks = [
    ['primary checked', 'component.switch.track.background.primary-checked'],
    ['primary checked and hovered', 'component.switch.track.background.primary-checked-hover'],
    ['secondary checked', 'component.switch.track.background.secondary-checked'],
    ['secondary checked and hovered', 'component.switch.track.background.secondary-checked-hover'],
    ['checked and invalid', 'component.switch.track.background.checked-invalid'],
  ];

  it.each(checkedTracks)('%s track stands out from the page', (_state, backgroundToken) => {
    expect(contrastRatio(backgroundToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });

  it.each(checkedTracks)('checked knob stands out from the %s track', (_state, backgroundToken) => {
    expect(contrastRatio('component.switch.thumb.checked', backgroundToken)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });

  it('unchecked knob stands out from the unchecked track', () => {
    expect(
      contrastRatio(
        'component.switch.thumb.unchecked',
        'component.switch.track.background.default',
      ),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['label', 'component.switch.label.text'],
    ['required marker', 'component.switch.label.required-marker'],
    ['hint', 'component.switch.hint.text'],
    ['error message', 'component.switch.error.text'],
  ])('%s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * TEXTAREA AND TEXTAREA FIELD
 * =============================================================== */

describe('Textarea tokens — contrast', () => {
  it.each([
    ['value text', 'component.textarea.text.default', 'component.textarea.background.default'],
    ['placeholder', 'component.textarea.text.placeholder', 'component.textarea.background.default'],
    [
      'value text when read-only',
      'component.textarea.text.default',
      'component.textarea.background.readonly',
    ],
  ])('%s is readable', (_description, foregroundToken, backgroundToken) => {
    expect(contrastRatio(foregroundToken, backgroundToken)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  it.each([
    ['default', 'component.textarea.border.default'],
    ['hover', 'component.textarea.border.hover'],
    ['focus', 'component.textarea.border.focus'],
    ['invalid', 'component.textarea.border.invalid'],
  ])('%s border stands out from the field', (_state, borderToken) => {
    expect(
      contrastRatio(borderToken, 'component.textarea.background.default'),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each([
    ['label', 'component.textarea-field.label.text'],
    ['required marker', 'component.textarea-field.label.required-marker'],
    ['hint', 'component.textarea-field.hint.text'],
    ['error message', 'component.textarea-field.error.text'],
  ])('textarea field %s is readable on the page', (_description, textToken) => {
    expect(contrastRatio(textToken, PAGE_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * ALERT
 * =============================================================== */

const ALERT_VARIANTS = UTILITY_VARIANTS;
const ALERT_APPEARANCES = ['soft', 'fill'];

const ALERT_COLOUR_COMBINATIONS = ALERT_VARIANTS.flatMap((variant) =>
  ALERT_APPEARANCES.map((appearance) => [variant, appearance]),
);

describe('Alert tokens — contrast', () => {
  // The icon takes the message colour, so clearing the text pair clears it too.
  it.each(ALERT_COLOUR_COMBINATIONS)('%s %s message is readable', (variant, appearance) => {
    const tokenGroup = `component.alert.${variant}.${appearance}`;
    expect(contrastRatio(`${tokenGroup}.text`, `${tokenGroup}.background`)).toBeGreaterThanOrEqual(
      TEXT_MINIMUM,
    );
  });

  // Against the page, not the block: a fill border blends into its own
  // background on purpose, and the page is the side the edge has to show up on.
  it.each(ALERT_COLOUR_COMBINATIONS)(
    '%s %s border stands out from the page',
    (variant, appearance) => {
      const ratio = contrastRatio(
        `component.alert.${variant}.${appearance}.border`,
        PAGE_BACKGROUND,
      );
      expect(ratio).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
    },
  );
});

/* ===============================================================
 * INVERSE SURFACE
 * =============================================================== */

describe('Inverse surface tokens — contrast', () => {
  // A reversed block (the Tooltip, and anything else that paints
  // `background.inverse`) carries `text.inverse`, so the pair is
  // checked here rather than once per component.
  it('inverse text is readable on the inverse background', () => {
    expect(
      contrastRatio('semantic.colour.text.inverse', 'semantic.colour.background.inverse'),
    ).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * DIALOG
 * =============================================================== */

const DIALOG_BACKGROUND = 'component.dialog.background';

describe('Dialog tokens — contrast', () => {
  it.each([
    ['title', 'component.dialog.title.text'],
    ['description', 'component.dialog.description.text'],
  ])('%s is readable on the dialog', (_description, textToken) => {
    expect(contrastRatio(textToken, DIALOG_BACKGROUND)).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  // The Close button is the ghost secondary Button, so its icon follows that
  // text colour — on the dialog, not on the page it covers.
  it('close icon stands out from the dialog', () => {
    expect(
      contrastRatio('component.button.secondary.ghost.text.default', DIALOG_BACKGROUND),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it('footer divider separates the actions from the body', () => {
    expect(
      contrastRatio('component.dialog.footer.border', DIALOG_BACKGROUND),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it('the dialog edge stands out from its own surface', () => {
    expect(contrastRatio('component.dialog.border', DIALOG_BACKGROUND)).toBeGreaterThanOrEqual(
      NON_TEXT_MINIMUM,
    );
  });
});

/* ===============================================================
 * TOOLTIP
 * =============================================================== */

describe('Tooltip tokens — contrast', () => {
  // The bubble paints the component tokens, so the pair is checked on them: the
  // inverse pair above covers the semantics, this one covers the component.
  it('text is readable on the bubble', () => {
    expect(
      contrastRatio('component.tooltip.text', 'component.tooltip.background'),
    ).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});

/* ===============================================================
 * TOAST
 * =============================================================== */

const TOAST_VARIANTS = UTILITY_VARIANTS;

describe('Toast tokens — contrast', () => {
  it.each(TOAST_VARIANTS)('%s text is readable on its card', (variant) => {
    expect(
      contrastRatio(`component.toast.${variant}.text`, `component.toast.${variant}.background`),
    ).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });

  // The card floats over anything, so its edge has to read against its own
  // surface as well as against the page it covers.
  it.each(TOAST_VARIANTS)('%s edge stands out from its card', (variant) => {
    expect(
      contrastRatio(`component.toast.${variant}.border`, `component.toast.${variant}.background`),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each(TOAST_VARIANTS)('%s edge stands out from the page behind it', (variant) => {
    expect(
      contrastRatio(`component.toast.${variant}.border`, PAGE_BACKGROUND),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  // The Close in the corner is the ghost secondary Button, drawn on the tinted card.
  it.each(TOAST_VARIANTS)('%s close icon stands out from its card', (variant) => {
    expect(
      contrastRatio(
        'component.button.secondary.ghost.text.default',
        `component.toast.${variant}.background`,
      ),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  // The ring is the variant's own colour: around the card it sits on the page, around
  // the action and the Close it sits on the card.
  it.each(TOAST_VARIANTS)('%s focus ring stands out from its card', (variant) => {
    expect(
      contrastRatio(
        `component.toast.${variant}.focus-ring`,
        `component.toast.${variant}.background`,
      ),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  it.each(TOAST_VARIANTS)('%s focus ring stands out from the page', (variant) => {
    expect(
      contrastRatio(`component.toast.${variant}.focus-ring`, PAGE_BACKGROUND),
    ).toBeGreaterThanOrEqual(NON_TEXT_MINIMUM);
  });

  // The action fills with the variant's edge on hover, so its text reverses.
  it.each(TOAST_VARIANTS)('%s action is readable while hovered', (variant) => {
    expect(
      contrastRatio('semantic.colour.text.inverse', `component.toast.${variant}.border`),
    ).toBeGreaterThanOrEqual(TEXT_MINIMUM);
  });
});
