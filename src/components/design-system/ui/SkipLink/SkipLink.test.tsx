import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { SkipLink } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('SkipLink — rendering', () => {
  it('links to the main content with the default words', () => {
    render(<SkipLink />);

    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
      'href',
      '#main-content',
    );
  });

  it('links to another target with other words', () => {
    render(<SkipLink targetId="results">Skip to results</SkipLink>);

    expect(screen.getByRole('link', { name: 'Skip to results' })).toHaveAttribute(
      'href',
      '#results',
    );
  });

  it('keeps the class the app passes', () => {
    render(<SkipLink className="extra" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('skip-link');
    expect(link).toHaveClass('extra');
  });

  it('points its ref at the link', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(<SkipLink ref={ref} />);

    expect(ref.current?.tagName).toBe('A');
  });
});

/* ===============================================================
 * KEYBOARD
 * =============================================================== */

describe('SkipLink — keyboard', () => {
  it('is the first stop when it comes first on the page', () => {
    render(
      <>
        <SkipLink />
        <a href="/rooms">Rooms</a>
        <main id="main-content">Content</main>
      </>,
    );

    screen.getByRole('link', { name: 'Skip to content' }).focus();
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveFocus();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <SkipLink />
        <main id="main-content">Content</main>
      </>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
