/**
 * Accessibility (a11y) tests for molecule components
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@/__tests__/utils';

expect.extend(toHaveNoViolations);

import { SkeletonCard } from '@/components/molecules/SkeletonCard';
import { SearchInput } from '@/components/molecules/SearchInput';
import { Pagination } from '@/components/molecules/Pagination';
import { EmptyState } from '@/components/molecules/EmptyState';

describe('Molecules Accessibility', () => {
  describe('EmptyState', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <EmptyState title="No products found" description="Try adjusting your search filters" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations without description', async () => {
      const { container } = render(<EmptyState title="Empty" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Pagination', () => {
    const mockOnPageChange = jest.fn();

    it('should have no accessibility violations', async () => {
      const { container } = render(
        <Pagination currentPage={2} totalPages={10} onPageChange={mockOnPageChange} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations on first page', async () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={5} onPageChange={mockOnPageChange} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations on last page', async () => {
      const { container } = render(
        <Pagination currentPage={5} totalPages={5} onPageChange={mockOnPageChange} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('SearchInput', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <SearchInput
          label="Search products"
          placeholder="Enter search term..."
          onSearch={jest.fn()}
        />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with value', async () => {
      const { container } = render(
        <SearchInput label="Search" value="organizer" onSearch={jest.fn()} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('SkeletonCard', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<SkeletonCard />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
