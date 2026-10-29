import { MAX_LIMIT, parseSearchFilters } from '@/lib/parseSearchFilters';
import { Room } from '@/types';

describe('parseSearchFilters', () => {
  it('returns defaults for empty params', () => {
    const result = parseSearchFilters({});
    expect(result).toEqual({
      query: '',
      store: undefined,
      room: undefined,
      page: 1,
      limit: 12,
    });
  });

  it('parses query parameter', () => {
    const result = parseSearchFilters({ query: 'organizer' });
    expect(result.query).toBe('organizer');
  });

  it('parses store parameter', () => {
    const result = parseSearchFilters({ store: '1' });
    expect(result.store).toBe('1');
  });

  it('parses room parameter', () => {
    const result = parseSearchFilters({ room: Room.KITCHEN });
    expect(result.room).toBe(Room.KITCHEN);
  });

  it('parses page parameter', () => {
    const result = parseSearchFilters({ page: '3' });
    expect(result.page).toBe(3);
  });

  it('parses limit parameter', () => {
    const result = parseSearchFilters({ limit: '24' });
    expect(result.limit).toBe(24);
  });

  it('uses default limit when provided', () => {
    const result = parseSearchFilters({}, 16);
    expect(result.limit).toBe(16);
  });

  it('handles invalid page number', () => {
    const result = parseSearchFilters({ page: 'invalid' });
    expect(result.page).toBe(1);
  });

  it('handles invalid limit number', () => {
    const result = parseSearchFilters({ limit: 'invalid' });
    expect(result.limit).toBe(12);
  });

  it.each(['-1', '0', '1.5', ''])('falls back to page 1 for out-of-range page "%s"', (page) => {
    expect(parseSearchFilters({ page }).page).toBe(1);
  });

  it.each(['0', '-5', '2.5', String(MAX_LIMIT + 1)])(
    'falls back to the default limit for out-of-range limit "%s"',
    (limit) => {
      expect(parseSearchFilters({ limit }).limit).toBe(12);
    },
  );

  it('accepts limit up to MAX_LIMIT', () => {
    expect(parseSearchFilters({ limit: String(MAX_LIMIT) }).limit).toBe(MAX_LIMIT);
  });

  it('ignores unknown rooms', () => {
    expect(parseSearchFilters({ room: 'spaceship' }).room).toBeUndefined();
  });

  it('treats an empty store as no store filter', () => {
    expect(parseSearchFilters({ store: '' }).store).toBeUndefined();
  });

  it('ignores repeated (array) numeric params', () => {
    expect(parseSearchFilters({ page: ['3'] }).page).toBe(1);
  });

  it('handles array values (uses undefined)', () => {
    const result = parseSearchFilters({ query: ['a', 'b'] });
    expect(result.query).toBe('');
  });

  it('parses all parameters together', () => {
    const result = parseSearchFilters({
      query: 'bins',
      store: '2',
      room: Room.BATHROOM,
      page: '2',
      limit: '8',
    });

    expect(result).toEqual({
      query: 'bins',
      store: '2',
      room: Room.BATHROOM,
      page: 2,
      limit: 8,
    });
  });
});
