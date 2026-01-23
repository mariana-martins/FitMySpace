/**
 * Accessibility (a11y) tests for app pages
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@/__tests__/utils';

expect.extend(toHaveNoViolations);

import NotFound from '@/app/not-found';
import ErrorPage from '@/app/error';

// Mock PageLayout to simplify testing
jest.mock('@/components/templates/PageLayout', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="page-layout">{children}</div>
  ),
}));

describe('App Pages Accessibility', () => {
  describe('NotFound Page', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<NotFound />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Error Page', () => {
    const mockError = Object.assign(new globalThis.Error('Something went wrong'), {
      digest: undefined,
    });
    const mockReset = jest.fn();

    beforeEach(() => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should have no accessibility violations', async () => {
      const { container } = render(<ErrorPage error={mockError} reset={mockReset} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
