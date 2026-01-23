import { productKeys } from '@/hooks/useProducts';
import { Room } from '@/types';

describe('productKeys', () => {
  describe('all', () => {
    it('returns base key', () => {
      expect(productKeys.all).toEqual(['products']);
    });
  });

  describe('lists', () => {
    it('returns list base key', () => {
      expect(productKeys.lists()).toEqual(['products', 'list']);
    });
  });

  describe('list', () => {
    it('includes filters in key', () => {
      const filters = { query: 'test', room: Room.KITCHEN };
      expect(productKeys.list(filters)).toEqual(['products', 'list', filters]);
    });

    it('creates unique keys for different filters', () => {
      const filters1 = { query: 'test1' };
      const filters2 = { query: 'test2' };
      expect(productKeys.list(filters1)).not.toEqual(productKeys.list(filters2));
    });
  });

  describe('details', () => {
    it('returns detail base key', () => {
      expect(productKeys.details()).toEqual(['products', 'detail']);
    });
  });

  describe('detail', () => {
    it('includes product ID in key', () => {
      expect(productKeys.detail('123')).toEqual(['products', 'detail', '123']);
    });
  });

  describe('recent', () => {
    it('includes limit in key', () => {
      expect(productKeys.recent(8)).toEqual(['products', 'recent', 8]);
    });
  });
});
