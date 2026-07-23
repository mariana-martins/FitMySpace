import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Icon } from './';
import { createRef } from 'react';
import { Home, Search } from 'lucide-react';

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Icon — rendering', () => {
  it('renders an SVG element', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies the base icon class', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" />,
    );
    expect(container.firstChild).toHaveClass('icon');
  });
});

/* ===============================================================
 * SIZES
 * =============================================================== */

describe('Icon — sizes', () => {
  const sizes = ['sm', 'md', 'lg', 'xl'] as const;

  it.each(sizes)('applies size-%s class when size="%s"', (size) => {
    const { container } = render(
      <Icon icon={Home} size={size} color="default" />,
    );
    expect(container.firstChild).toHaveClass(`size-${size}`);
  });
});

/* ===============================================================
 * COLORS
 * =============================================================== */

describe('Icon — colors', () => {
  const colors = [
    'default',
    'primary',
    'subtle',
    'inverse',
    'disabled',
    'error',
    'success',
    'warning',
    'information',
  ] as const;

  it.each(colors)('applies color-%s class when color="%s"', (color) => {
    const { container } = render(
      <Icon icon={Home} size="md" color={color} />,
    );
    expect(container.firstChild).toHaveClass(`color-${color}`);
  });
});

/* ===============================================================
 * ACCESSIBILITY — Decorative (default)
 * =============================================================== */

describe('Icon — accessibility (decorative)', () => {
  it('applies aria-hidden="true" when no aria-label is provided', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" />,
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not set role="img" when decorative', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" />,
    );
    expect(container.firstChild).not.toHaveAttribute('role');
  });
});

/* ===============================================================
 * ACCESSIBILITY — Meaningful (aria-label)
 * =============================================================== */

describe('Icon — accessibility (meaningful)', () => {
  it('sets role="img" when aria-label is provided', () => {
    render(
      <Icon icon={Search} size="md" color="default" aria-label="Search" />,
    );
    const icon = screen.getByRole('img', { name: 'Search' });
    expect(icon).toBeInTheDocument();
  });

  it('does not set aria-hidden when aria-label is provided', () => {
    render(
      <Icon icon={Search} size="md" color="default" aria-label="Search" />,
    );
    const icon = screen.getByRole('img', { name: 'Search' });
    expect(icon).not.toHaveAttribute('aria-hidden', 'true');
  });

  it('applies the provided aria-label', () => {
    render(
      <Icon icon={Home} size="lg" color="primary" aria-label="Go to homepage" />,
    );
    const icon = screen.getByRole('img', { name: 'Go to homepage' });
    expect(icon).toHaveAttribute('aria-label', 'Go to homepage');
  });
});

/* ===============================================================
 * ACCESSIBILITY — explicit aria-hidden override
 * =============================================================== */

describe('Icon — aria-hidden override', () => {
  it('respects an explicit aria-hidden="false" even without aria-label', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" aria-hidden={false} />,
    );
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'false');
  });
});

/* ===============================================================
 * REF FORWARDING
 * =============================================================== */

describe('Icon — ref forwarding', () => {
  it('forwards ref to the SVG element', () => {
    const ref = createRef<SVGSVGElement>();
    render(
      <Icon icon={Home} size="md" color="default" ref={ref} />,
    );
    expect(ref.current).toBeInstanceOf(SVGElement);
    expect(ref.current?.tagName.toLowerCase()).toBe('svg');
  });
});

/* ===============================================================
 * CUSTOM PROPS
 * =============================================================== */

describe('Icon — custom props', () => {
  it('merges custom className', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" className="custom-icon" />,
    );
    expect(container.firstChild).toHaveClass('custom-icon');
    expect(container.firstChild).toHaveClass('icon');
  });

  it('spreads native SVG attributes', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" data-testid="my-icon" />,
    );
    expect(container.querySelector('[data-testid="my-icon"]')).toBeInTheDocument();
  });

  it('applies custom strokeWidth', () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" strokeWidth={1.5} />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('stroke-width', '1.5');
  });
});

/* ===============================================================
 * ACCESSIBILITY — jest-axe audit
 * =============================================================== */

describe('Icon — jest-axe audit', () => {
  it('has no a11y violations when decorative', async () => {
    const { container } = render(
      <Icon icon={Home} size="md" color="default" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations when meaningful (with aria-label)', async () => {
    const { container } = render(
      <Icon icon={Search} size="lg" color="primary" aria-label="Search products" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
