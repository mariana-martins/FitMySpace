import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { VisuallyHidden } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('VisuallyHidden — rendering', () => {
  it('renders a <span> element in the DOM', () => {
    const { container } = render(
      <VisuallyHidden>Hidden label</VisuallyHidden>,
    );
    const span = container.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('renders children text content accessible in the document', () => {
    render(<VisuallyHidden>Screen reader only text</VisuallyHidden>);
    expect(screen.getByText('Screen reader only text')).toBeInTheDocument();
  });

  it('renders nested HTML content', () => {
    render(
      <VisuallyHidden>
        <em data-testid="nested">Important context</em>
      </VisuallyHidden>,
    );
    expect(screen.getByTestId('nested')).toBeInTheDocument();
    expect(screen.getByTestId('nested')).toHaveTextContent('Important context');
  });
});

/* ===============================================================
 * REF FORWARDING
 * =============================================================== */

describe('VisuallyHidden — ref forwarding', () => {
  it('forwards ref to the underlying span element', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<VisuallyHidden ref={ref}>Ref test</VisuallyHidden>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('SPAN');
  });
});

/* ===============================================================
 * CUSTOM PROPS
 * =============================================================== */

describe('VisuallyHidden — custom props', () => {
  it('spreads native HTML attributes', () => {
    render(
      <VisuallyHidden data-testid="custom-vh" id="my-hidden">
        Props test
      </VisuallyHidden>,
    );
    const el = screen.getByTestId('custom-vh');
    expect(el).toHaveAttribute('id', 'my-hidden');
  });
});

/* ===============================================================
 * ACCESSIBILITY (jest-axe)
 * =============================================================== */

describe('VisuallyHidden — accessibility', () => {
  it('has no a11y violations', async () => {
    const { container } = render(
      <VisuallyHidden>Accessible hidden content</VisuallyHidden>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations when used inside a button', async () => {
    const { container } = render(
      <button type="button">
        <span aria-hidden="true">✕</span>
        <VisuallyHidden>Close dialog</VisuallyHidden>
      </button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
