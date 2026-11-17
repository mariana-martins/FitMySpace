import { UTILITY_VARIANT_ICONS, UTILITY_VARIANT_LABELS } from './';
import { render } from '@testing-library/react';
import { DS_ICONS } from '../ui/Icon';

import type { UtilityVariant } from './';

const VARIANTS: UtilityVariant[] = ['information', 'success', 'warning', 'error'];

/* ===============================================================
 * UTILITY VARIANTS
 * =============================================================== */

describe('utilityVariants — maps', () => {
  it.each(VARIANTS)('%s has its own icon, kept out of the tab order', (variant) => {
    const { container } = render(DS_ICONS[UTILITY_VARIANT_ICONS[variant]].icon);
    expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
  });

  it('gives every variant a different icon', () => {
    const iconClasses = VARIANTS.map((variant) => {
      const { container } = render(DS_ICONS[UTILITY_VARIANT_ICONS[variant]].icon);
      return container.querySelector('svg')?.getAttribute('class');
    });
    expect(new Set(iconClasses).size).toBe(VARIANTS.length);
  });

  it('labels each variant with a capitalised word for the screen-reader prefix', () => {
    expect(VARIANTS.map((variant) => UTILITY_VARIANT_LABELS[variant])).toEqual([
      'Information',
      'Success',
      'Warning',
      'Error',
    ]);
  });
});
