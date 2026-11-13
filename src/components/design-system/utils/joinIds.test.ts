import { joinIds } from './';

/* ===============================================================
 * JOIN IDS
 * =============================================================== */

describe('joinIds — output', () => {
  it('joins ids with a single space, in order', () => {
    expect(joinIds('summary', 'hint', 'error')).toBe('summary hint error');
  });

  it('skips missing and empty ids', () => {
    expect(joinIds(undefined, 'hint', '', 'error')).toBe('hint error');
  });

  it('returns undefined when no id is left, so the attribute is omitted', () => {
    expect(joinIds(undefined, '')).toBeUndefined();
    expect(joinIds()).toBeUndefined();
  });
});
