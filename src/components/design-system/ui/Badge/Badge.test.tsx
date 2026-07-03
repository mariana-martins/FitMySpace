import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Badge } from './';
import { createRef } from 'react';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Badge — rendering', () => {
  it('renders a <span> element by default', () => {
    render(
      <Badge variant="brand" size="md">
        New
      </Badge>,
    );
    const badge = screen.getByText('New');
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe('SPAN');
  });

  it('renders the text content', () => {
    render(
      <Badge variant="brand" size="md">
        Active status
      </Badge>,
    );
    expect(screen.getByText('Active status')).toBeInTheDocument();
  });
});

/* ===============================================================
 * VARIANTS
 * =============================================================== */

describe('Badge — variants', () => {
  const variants = ['brand', 'subtle', 'success', 'error', 'warning', 'information'] as const;

  it.each(variants)('applies variant-%s class when variant="%s"', (variant) => {
    const { container } = render(
      <Badge variant={variant} size="md">
        {variant}
      </Badge>,
    );
    expect(container.firstChild).toHaveClass(`variant-${variant}`);
  });
});

/* ===============================================================
 * SIZES
 * =============================================================== */

describe('Badge — sizes', () => {
  const sizes = ['xs', 'sm', 'md', 'lg'] as const;

  it.each(sizes)('applies size-%s class when size="%s"', (size) => {
    const { container } = render(
      <Badge variant="brand" size={size}>
        Size {size}
      </Badge>,
    );
    expect(container.firstChild).toHaveClass(`size-${size}`);
  });
});

/* ===============================================================
 * SHAPES
 * =============================================================== */

describe('Badge — shapes', () => {
  it('applies shape-rounded by default when shape prop is omitted', () => {
    const { container } = render(
      <Badge variant="brand" size="md">
        Default shape
      </Badge>,
    );
    expect(container.firstChild).toHaveClass('shape-rounded');
  });

  const shapes = ['square', 'rounded'] as const;

  it.each(shapes)('applies shape-%s class when shape="%s"', (shape) => {
    const { container } = render(
      <Badge variant="brand" size="md" shape={shape}>
        Shape {shape}
      </Badge>,
    );
    expect(container.firstChild).toHaveClass(`shape-${shape}`);
  });
});

/* ===============================================================
 * REF FORWARDING
 * =============================================================== */

describe('Badge — ref forwarding', () => {
  it('forwards ref to the span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge variant="brand" size="md" ref={ref}>
        Ref test
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('SPAN');
  });
});

/* ===============================================================
 * CUSTOM PROPS
 * =============================================================== */

describe('Badge — custom props', () => {
  it('merges custom className', () => {
    const { container } = render(
      <Badge variant="brand" size="md" className="custom-badge-class">
        Custom
      </Badge>,
    );
    expect(container.firstChild).toHaveClass('custom-badge-class');
    expect(container.firstChild).toHaveClass('badge');
  });

  it('spreads native HTML attributes', () => {
    render(
      <Badge variant="brand" size="md" data-testid="custom-badge" id="my-badge">
        Native
      </Badge>,
    );
    const badge = screen.getByTestId('custom-badge');
    expect(badge).toHaveAttribute('id', 'my-badge');
  });
});

/* ===============================================================
 * ACCESSIBILITY (jest-axe)
 * =============================================================== */

describe('Badge — accessibility', () => {
  it('has no a11y violations for a static badge', async () => {
    const { container } = render(
      <Badge variant="brand" size="md">
        Accessible badge
      </Badge>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations for a dynamic status badge with role="status"', async () => {
    const { container } = render(
      <Badge variant="error" size="sm" role="status" aria-label="3 unread notifications">
        3 new
      </Badge>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
