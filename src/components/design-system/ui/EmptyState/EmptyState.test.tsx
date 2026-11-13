import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { PackageOpen } from 'lucide-react';
import { createRef } from 'react';
import { EmptyState } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * CONTENT
 * =============================================================== */

describe('EmptyState — content', () => {
  it('renders the title as a level 2 heading by default', () => {
    render(<EmptyState title="No products found" />);
    expect(screen.getByRole('heading', { level: 2, name: 'No products found' })).toBeVisible();
  });

  it('uses the given heading level', () => {
    render(<EmptyState title="No products found" headingLevel={3} />);
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });

  it('renders the description and the actions', () => {
    render(
      <EmptyState title="No products found" description="Try fewer filters.">
        <button type="button">Clear filters</button>
      </EmptyState>,
    );
    expect(screen.getByText('Try fewer filters.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('hides the default and a custom icon from assistive technology', () => {
    const { container, rerender } = render(<EmptyState title="No products found" />);
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    rerender(<EmptyState title="Your list is empty" icon={<PackageOpen />} />);
    expect(container.querySelector('svg')).toHaveClass('lucide-package-open');
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('is not a live region, so it is never announced twice', () => {
    render(<EmptyState title="No products found" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} title="No products found" data-testid="empty" />);
    expect(ref.current).toBe(screen.getByTestId('empty'));
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('EmptyState — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <EmptyState title="No products found" description="Try fewer filters.">
        <button type="button">Clear filters</button>
      </EmptyState>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
