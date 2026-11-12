import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Check } from 'lucide-react';
import { createRef } from 'react';
import { Badge } from './';

import type { BadgeAppearance, BadgeVariant } from './';

expect.extend(toHaveNoViolations);

const VARIANTS: BadgeVariant[] = [
  'primary',
  'secondary',
  'error',
  'success',
  'warning',
  'information',
];
const APPEARANCES: BadgeAppearance[] = ['fill', 'soft'];

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Badge — rendering', () => {
  it('renders its text in a <span>', () => {
    render(
      <Badge variant="secondary" appearance="soft" size="md">
        In stock
      </Badge>,
    );
    expect(screen.getByText('In stock').tagName).toBe('SPAN');
  });

  it('is static text: no role and not focusable', () => {
    render(
      <Badge variant="secondary" appearance="soft" size="md">
        In stock
      </Badge>,
    );
    const badge = screen.getByText('In stock');
    expect(badge).not.toHaveAttribute('role');
    expect(badge).not.toHaveAttribute('tabindex');
  });

  it('forwards the ref to the <span>', () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} variant="secondary" appearance="soft" size="md">
        In stock
      </Badge>,
    );
    expect(ref.current).toBe(screen.getByText('In stock'));
  });

  it('passes native attributes and merges the class name', () => {
    render(
      <Badge variant="primary" appearance="fill" size="sm" className="custom" title="Store">
        IKEA
      </Badge>,
    );
    const badge = screen.getByText('IKEA');
    expect(badge).toHaveClass('custom');
    expect(badge).toHaveAttribute('title', 'Store');
  });

  it('requires visible text', () => {
    // @ts-expect-error -- a badge without text would carry meaning by colour alone
    render(<Badge variant="success" appearance="fill" size="md" />);
  });
});

/* ===============================================================
 * VARIANTS
 * =============================================================== */

describe('Badge — variants', () => {
  it.each(VARIANTS.flatMap((variant) => APPEARANCES.map((appearance) => [variant, appearance])))(
    'applies the %s %s class',
    (variant, appearance) => {
      render(
        <Badge
          variant={variant as BadgeVariant}
          appearance={appearance as BadgeAppearance}
          size="md"
        >
          Label
        </Badge>,
      );
      expect(screen.getByText('Label')).toHaveClass(`${appearance}-${variant}`);
    },
  );

  it('is a pill by default and can be rounded', () => {
    const { rerender } = render(
      <Badge variant="secondary" appearance="soft" size="md">
        Label
      </Badge>,
    );
    expect(screen.getByText('Label')).toHaveClass('shape-pill');
    rerender(
      <Badge variant="secondary" appearance="soft" size="md" shape="rounded">
        Label
      </Badge>,
    );
    expect(screen.getByText('Label')).toHaveClass('shape-rounded');
  });
});

/* ===============================================================
 * ICON
 * =============================================================== */

describe('Badge — icon', () => {
  it('hides the icon from assistive technology', () => {
    const { container } = render(
      <Badge variant="success" appearance="soft" size="md" icon={<Check />}>
        In stock
      </Badge>,
    );
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.getByText('In stock')).toHaveTextContent(/^In stock$/);
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Badge — accessibility', () => {
  it('has no axe violations across variants', async () => {
    const { container } = render(
      <p>
        {VARIANTS.flatMap((variant) =>
          APPEARANCES.map((appearance) => (
            <Badge
              key={`${variant}-${appearance}`}
              variant={variant}
              appearance={appearance}
              size="md"
              icon={<Check />}
            >
              {variant}
            </Badge>
          )),
        )}
      </p>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
