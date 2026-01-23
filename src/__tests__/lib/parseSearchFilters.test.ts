import { parseSearchFilters } from '@/lib/parseSearchFilters';
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
