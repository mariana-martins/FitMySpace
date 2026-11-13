import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { Skeleton } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * SHAPES
 * =============================================================== */

describe('Skeleton — shapes', () => {
  it('renders one medium text line by default', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('skeleton', 'text', 'size-md');
  });

  it.each(['rectangle', 'circle'] as const)('renders the %s shape without a text size', (shape) => {
    render(<Skeleton data-testid="skeleton" shape={shape} />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass(shape);
    expect(skeleton.className).not.toMatch(/size-/);
  });

  it('sets the width and height', () => {
    render(<Skeleton data-testid="skeleton" shape="rectangle" width="12rem" height="8rem" />);
    expect(screen.getByTestId('skeleton')).toHaveStyle({ inlineSize: '12rem', blockSize: '8rem' });
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Skeleton ref={ref} data-testid="skeleton" />);
    expect(ref.current).toBe(screen.getByTestId('skeleton'));
  });
});

/* ===============================================================
 * LINES
 * =============================================================== */

describe('Skeleton — lines', () => {
  it('renders several lines and shortens the last one', () => {
    render(<Skeleton data-testid="skeleton" lines={3} size="sm" />);
    const wrapper = screen.getByTestId('skeleton');
    expect(wrapper).toHaveClass('lines', 'size-sm');
    expect(wrapper.children).toHaveLength(3);
    expect(wrapper.lastElementChild).toHaveClass('last-line');
    expect(wrapper.firstElementChild).not.toHaveClass('last-line');
  });

  it('ignores lines on shapes other than text', () => {
    render(<Skeleton data-testid="skeleton" shape="circle" lines={3} />);
    expect(screen.getByTestId('skeleton').children).toHaveLength(0);
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Skeleton — accessibility', () => {
  it('is hidden from assistive technology', () => {
    render(<Skeleton data-testid="skeleton" lines={2} />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations inside a busy region', async () => {
    const { container } = render(
      <section aria-label="Products" aria-busy="true">
        <p role="status">Loading products…</p>
        <Skeleton shape="rectangle" height="8rem" />
        <Skeleton lines={2} />
      </section>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
