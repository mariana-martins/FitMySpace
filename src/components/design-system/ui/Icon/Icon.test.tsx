import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DS_ICONS, Icon } from './';
import { createRef } from 'react';

import type { IconSize } from './';

import { Check } from 'lucide-react';

expect.extend(toHaveNoViolations);

const SIZES: IconSize[] = ['xs', 'sm', 'md', 'lg'];

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Icon — rendering', () => {
  it('draws the icon inside a <span>', () => {
    const { container } = render(<Icon>{<Check focusable="false" />}</Icon>);

    const box = container.firstElementChild;
    expect(box?.tagName).toBe('SPAN');
    expect(box?.querySelector('svg')).toBeInTheDocument();
  });

  it.each(SIZES)('takes the %s size class', (size) => {
    const { container } = render(<Icon size={size}>{<Check focusable="false" />}</Icon>);

    expect(container.firstElementChild).toHaveClass(`size-${size}`);
  });

  it('writes no size class when the app leaves `size` out', () => {
    const { container } = render(<Icon>{<Check focusable="false" />}</Icon>);

    // The stylesheet's own fallback is `md`, so the box needs no class to be that.
    expect(container.firstElementChild?.className).not.toMatch(/size-/);
  });

  it('draws an icon from the registry', () => {
    const { container } = render(<Icon>{DS_ICONS['chevron-down'].icon}</Icon>);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('keeps the class the app passes', () => {
    const { container } = render(<Icon className="own-token">{<Check focusable="false" />}</Icon>);

    const box = container.firstElementChild;
    expect(box).toHaveClass('icon');
    expect(box).toHaveClass('own-token');
  });

  it('points its ref at the box', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Icon ref={ref}>{<Check focusable="false" />}</Icon>);

    expect(ref.current?.tagName).toBe('SPAN');
  });
});

/* ===============================================================
 * SEEING AND HEARING
 * =============================================================== */

describe('Icon — seeing and hearing', () => {
  it('stays out of the way of assistive technology by default', () => {
    render(<Icon>{<Check focusable="false" />}</Icon>);

    // The box is hidden whole: no role to read, and no name.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const box = document.querySelector('.icon');
    expect(box).toHaveAttribute('aria-hidden', 'true');
  });

  it('becomes one named image when the icon carries the meaning', () => {
    render(<Icon label="The room has a bath">{DS_ICONS.bath.icon}</Icon>);

    // Nothing hides it any more: the box is one image with a name.
    const image = screen.getByRole('img', { name: 'The room has a bath' });
    expect(image).not.toHaveAttribute('aria-hidden');
  });

  it('stays hidden when the label is empty', () => {
    render(<Icon label="">{<Check focusable="false" />}</Icon>);

    // An image with no name is worse than no image: nothing to read.
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(document.querySelector('.icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('has no axe violations, hidden or named', async () => {
    const { container } = render(
      <p>
        <Icon>{DS_ICONS['map-pin'].icon}</Icon>
        <Icon label="The room has a bath">{DS_ICONS.bath.icon}</Icon>
        <Icon size="lg">{DS_ICONS.ruler.icon}</Icon>
      </p>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
