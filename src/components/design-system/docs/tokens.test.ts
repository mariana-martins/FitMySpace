import { formatTokenLabel, getTokens, groupTokens } from './tokens';

/* ===============================================================
 * QUERY
 * =============================================================== */

describe('Foundation tokens — query', () => {
  it('returns the tokens under a path, with their resolved value', () => {
    const insetTokens = getTokens('semantic', 'spacing', 'inset');
    expect(insetTokens.map((token) => token.path.at(-1))).toEqual(['xs', 'sm', 'md', 'lg', 'xl']);
    expect(insetTokens.find((token) => token.path.at(-1) === 'md')).toEqual({
      name: '--ds-semantic-spacing-inset-md',
      path: ['semantic', 'spacing', 'inset', 'md'],
      value: '16px',
      comment: null,
    });
  });

  it('matches whole path segments, not name prefixes', () => {
    // `semantic.color.halo.utility-error` exists, but `utility` is not one of its segments.
    expect(getTokens('semantic', 'color', 'halo', 'utility')).toEqual([]);
    expect(getTokens('semantic', 'color', 'halo', 'utility-error')).toHaveLength(1);
  });

  it('returns nothing for an unknown path', () => {
    expect(getTokens('semantic', 'unknown')).toEqual([]);
  });
});

/* ===============================================================
 * GROUPING
 * =============================================================== */

describe('Foundation tokens — grouping', () => {
  it('groups by a path segment in JSON order', () => {
    const groups = groupTokens(getTokens('semantic', 'spacing'), 2);
    expect([...groups.keys()]).toEqual(['inset', 'gap', 'section', 'control']);
  });

  it('groups by a custom key', () => {
    const groups = groupTokens(getTokens('semantic', 'size'), (token) =>
      token.value.endsWith('px') ? 'pixels' : 'other',
    );
    expect(groups.get('pixels')).toHaveLength(4);
  });
});

/* ===============================================================
 * LABELS
 * =============================================================== */

describe('Foundation tokens — labels', () => {
  it.each([
    [['inset', 'xs'], 'Inset XS'],
    [['radii', '2xl'], 'Radii 2XL'],
    [['utility-success', 'base'], 'Utility Success Base'],
    [['sage', '500'], 'Sage 500'],
  ])('formats %j as "%s"', (segments, label) => {
    expect(formatTokenLabel(segments)).toBe(label);
  });
});
