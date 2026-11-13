import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { ReactNode } from 'react';
import { createRef } from 'react';
import { Link } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Link — rendering', () => {
  it('renders a native link named by its text', () => {
    render(<Link href="/recent">Recent arrivals</Link>);
    const link = screen.getByRole('link', { name: 'Recent arrivals' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/recent');
  });

  it('forwards the ref to the <a>', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="/recent" ref={ref}>
        Recent arrivals
      </Link>,
    );
    expect(ref.current).toBe(screen.getByRole('link'));
  });

  it('renders the child element with asChild', () => {
    function RouterLink({ href, children, ...props }: { href: string; children: ReactNode }) {
      return (
        <a href={href} data-router-link="" {...props}>
          {children}
        </a>
      );
    }
    render(
      <Link appearance="standalone" asChild>
        <RouterLink href="/about">About us</RouterLink>
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'About us' });
    expect(link).toHaveAttribute('data-router-link');
    expect(link).toHaveClass('standalone');
  });
});

/* ===============================================================
 * APPEARANCE
 * =============================================================== */

describe('Link — appearance', () => {
  it('is an inline link by default, with no size class', () => {
    render(<Link href="/returns">returns policy</Link>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('inline');
    expect(link.className).not.toMatch(/size-/);
  });

  it('lets a standalone link without a size take the font of its parent', () => {
    render(
      <Link href="/products/1" appearance="standalone">
        Bamboo shower caddy
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('standalone');
    expect(link.className).not.toMatch(/size-/);
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size-%s to a standalone link', (size) => {
    render(
      <Link href="/recent" appearance="standalone" size={size}>
        Recent arrivals
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveClass(`size-${size}`);
  });

  it('does not accept a size on an inline link', () => {
    render(
      // @ts-expect-error -- an inline link takes the size of the text around it
      <Link href="/returns" size="lg">
        returns policy
      </Link>,
    );
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('passes aria-current through for the current page', () => {
    render(
      <Link href="/recent" appearance="standalone" aria-current="page">
        Recent arrivals
      </Link>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page');
  });
});

/* ===============================================================
 * NEW TAB AND STRETCHED
 * =============================================================== */

describe('Link — new tab and stretched', () => {
  it('opens in a new tab safely and says so to screen readers', () => {
    const { container } = render(
      <Link href="https://www.ikea.com" opensInNewTab rel="external">
        IKEA
      </Link>,
    );
    const link = screen.getByRole('link', { name: 'IKEA (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer external');
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('does not set a target otherwise', () => {
    render(<Link href="/recent">Recent arrivals</Link>);
    expect(screen.getByRole('link')).not.toHaveAttribute('target');
  });

  it('marks a stretched link so a container can style it', () => {
    render(
      <Link href="/products/1" stretched>
        Bamboo shower caddy
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('stretched');
    expect(link).toHaveAttribute('data-link-stretched', 'true');
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Link — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <nav aria-label="Main navigation">
        <p>
          Read our <Link href="/returns">returns policy</Link> before you order.
        </p>
        <Link href="/recent" appearance="standalone" aria-current="page">
          Recent arrivals
        </Link>
        <Link href="https://www.ikea.com" appearance="standalone" opensInNewTab>
          IKEA
        </Link>
      </nav>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
