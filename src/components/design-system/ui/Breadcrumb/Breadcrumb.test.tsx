import { render, screen, within } from '@testing-library/react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from './';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { ReactNode } from 'react';
import { createRef } from 'react';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Breadcrumb — rendering', () => {
  it('renders a navigation landmark with an ordered list and links', () => {
    render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms">Rooms</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms/bathroom" aria-current="page">
            Bathroom
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Breadcrumb' });
    const list = within(navigation).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(within(list).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(list).getByRole('link', { name: 'Rooms' })).toHaveAttribute('href', '/rooms');
    expect(within(list).getByRole('link', { name: 'Bathroom' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('forwards refs to the nav, li, and anchor elements', () => {
    const navRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLLIElement>();
    const linkRef = createRef<HTMLAnchorElement>();

    render(
      <Breadcrumb ref={navRef}>
        <BreadcrumbItem ref={itemRef}>
          <BreadcrumbLink ref={linkRef} href="/">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(navRef.current).toBe(screen.getByRole('navigation'));
    expect(itemRef.current).toBe(screen.getByRole('listitem'));
    expect(linkRef.current).toBe(screen.getByRole('link', { name: 'Home' }));
  });

  it('supports a custom aria-label or aria-labelledby', () => {
    render(
      <>
        <h2 id="trail-heading">Category trail</h2>
        <Breadcrumb aria-labelledby="trail-heading">
          <BreadcrumbItem>
            <BreadcrumbLink href="/" aria-current="page">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </>,
    );

    const navigation = screen.getByRole('navigation', { name: 'Category trail' });
    expect(navigation).not.toHaveAttribute('aria-label');
  });

  it('renders the child element when asChild is true', () => {
    function RouterLink({ href, children, ...props }: { href: string; children: ReactNode }) {
      return (
        <a href={href} data-router-link="" {...props}>
          {children}
        </a>
      );
    }

    render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <RouterLink href="/rooms">Rooms</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    const link = screen.getByRole('link', { name: 'Rooms' });
    expect(link).toHaveAttribute('data-router-link');
    expect(link).toHaveClass('link');
  });

  it('renders Lucide Home icon hidden from assistive technology when home is true', () => {
    render(
      <Breadcrumb separator="slash">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms" aria-current="page">
            Rooms
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const iconWrapper = homeLink.querySelector('.icon');
    expect(iconWrapper).not.toBeNull();
    expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
    const svg = iconWrapper?.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveClass('lucide-house');
  });

  it('forwards the home icon inside the child element when asChild is true', () => {
    function RouterLink({ href, children, ...props }: { href: string; children: ReactNode }) {
      return (
        <a href={href} data-router-link="" {...props}>
          {children}
        </a>
      );
    }

    render(
      <Breadcrumb separator="slash">
        <BreadcrumbItem>
          <BreadcrumbLink home asChild>
            <RouterLink href="/">Home</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('data-router-link');
    expect(homeLink.querySelector('.icon svg')).toHaveClass('lucide-house');
  });

  it('renders a custom leading icon and prefers it over home when both are set', () => {
    render(
      <Breadcrumb separator="slash">
        <BreadcrumbItem>
          <BreadcrumbLink href="/" home icon={<span data-testid="custom-icon">*</span>}>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink.querySelector('.icon')).toContainElement(screen.getByTestId('custom-icon'));
    expect(homeLink.querySelector('svg')).toBeNull();
  });
});

/* ===============================================================
 * SIZES AND SEPARATORS
 * =============================================================== */

describe('Breadcrumb — sizes and separators', () => {
  it.each(['sm', 'md'] as const)('applies size-%s class when size="%s"', (size) => {
    render(
      <Breadcrumb size={size}>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" aria-current="page">
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.getByRole('navigation')).toHaveClass(`size-${size}`);
  });

  it('uses chevron separators, hidden from assistive technology, by default', () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms" aria-current="page">
            Rooms
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(screen.getByRole('list')).toHaveAttribute('data-separator', 'chevron');
    const separators = container.querySelectorAll('.separator');
    expect(separators).toHaveLength(2);
    separators.forEach((separatorElement) => {
      expect(separatorElement).toHaveAttribute('aria-hidden', 'true');
      expect(separatorElement.querySelector('svg')).toHaveAttribute('focusable', 'false');
    });
  });

  it('renders decorative slash separators when separator="slash"', () => {
    const { container } = render(
      <Breadcrumb separator="slash">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms" aria-current="page">
            Rooms
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    // Both separators are rendered; CSS shows the one the list's data-separator picks.
    expect(screen.getByRole('list')).toHaveAttribute('data-separator', 'slash');
    const separators = container.querySelectorAll('.separator');
    expect(separators).toHaveLength(2);
    separators.forEach((separatorElement) => {
      expect(separatorElement).toHaveAttribute('aria-hidden', 'true');
      expect(separatorElement.querySelector('.separator-slash')).toHaveTextContent('/');
    });
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Breadcrumb — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" home>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms">Rooms</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms/bathroom">Bathroom</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/rooms/bathroom/bamboo-shower-caddy" aria-current="page">
            Bamboo shower caddy
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
