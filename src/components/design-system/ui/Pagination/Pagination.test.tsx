import {
  getPaginationRange,
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './';
import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { ReactNode } from 'react';
import { createRef } from 'react';

expect.extend(toHaveNoViolations);

function RouterLink({ href, children, ...props }: { href: string; children?: ReactNode }) {
  return (
    <a href={href} data-router-link="" {...props}>
      {children}
    </a>
  );
}

function renderPagination(currentPage: number, pageCount = 3) {
  return render(
    <Pagination>
      <PaginationItem>
        <PaginationPrevious href={`?page=${currentPage - 1}`} disabled={currentPage === 1} />
      </PaginationItem>
      {Array.from({ length: pageCount }, (_, offset) => offset + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            page={page}
            href={`?page=${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          />
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext href={`?page=${currentPage + 1}`} disabled={currentPage === pageCount} />
      </PaginationItem>
    </Pagination>,
  );
}

/* ===============================================================
 * RANGE
 * =============================================================== */

describe('getPaginationRange — range', () => {
  it('lists every page when they all fit', () => {
    expect(getPaginationRange({ page: 2, pageCount: 5 })).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses the end near the first page', () => {
    expect(getPaginationRange({ page: 2, pageCount: 20 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'end-ellipsis',
      20,
    ]);
  });

  it('collapses both sides in the middle', () => {
    expect(getPaginationRange({ page: 10, pageCount: 20 })).toEqual([
      1,
      'start-ellipsis',
      9,
      10,
      11,
      'end-ellipsis',
      20,
    ]);
  });

  it('collapses the start near the last page', () => {
    expect(getPaginationRange({ page: 19, pageCount: 20 })).toEqual([
      1,
      'start-ellipsis',
      16,
      17,
      18,
      19,
      20,
    ]);
  });

  it('keeps the same length on every page, so the controls never jump', () => {
    const lengths = Array.from({ length: 20 }, (_, offset) =>
      getPaginationRange({ page: offset + 1, pageCount: 20 }),
    ).map((range) => range.length);
    expect(new Set(lengths)).toEqual(new Set([7]));
  });

  it('never hides a single page behind an ellipsis', () => {
    expect(getPaginationRange({ page: 4, pageCount: 8 })).toEqual([
      1,
      2,
      3,
      4,
      5,
      'end-ellipsis',
      8,
    ]);
    expect(getPaginationRange({ page: 5, pageCount: 8 })).toEqual([
      1,
      'start-ellipsis',
      4,
      5,
      6,
      7,
      8,
    ]);
  });

  it('shows more siblings when asked', () => {
    expect(getPaginationRange({ page: 10, pageCount: 20, siblingCount: 2 })).toEqual([
      1,
      'start-ellipsis',
      8,
      9,
      10,
      11,
      12,
      'end-ellipsis',
      20,
    ]);
  });

  it('clamps an out-of-range page and handles no pages', () => {
    expect(getPaginationRange({ page: 99, pageCount: 3 })).toEqual([1, 2, 3]);
    expect(getPaginationRange({ page: 1, pageCount: 0 })).toEqual([]);
  });
});

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Pagination — rendering', () => {
  it('renders a named navigation landmark with an ordered list', () => {
    renderPagination(2);
    const navigation = screen.getByRole('navigation', { name: 'Pagination' });
    const list = within(navigation).getByRole('list');
    expect(list.tagName).toBe('OL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(5);
  });

  it('names each page link "Page n" and marks the current page', () => {
    renderPagination(2);
    expect(screen.getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '?page=1');
    const current = screen.getByRole('link', { name: 'Page 2' });
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveTextContent('2');
  });

  it('names Previous and Next with the visible text plus "page"', () => {
    renderPagination(2);
    expect(screen.getByRole('link', { name: 'Previous page' })).toHaveAttribute('rel', 'prev');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('rel', 'next');
  });

  it('hides Previous on the first page but keeps its place', () => {
    const { container } = renderPagination(1);
    expect(screen.queryByRole('link', { name: 'Previous page' })).not.toBeInTheDocument();
    const disabled = container.querySelector('[data-disabled]');
    expect(disabled).toHaveTextContent('Previous');
    expect(disabled).toHaveAttribute('aria-hidden', 'true');
    expect(disabled?.tagName).toBe('SPAN');
  });

  it('reads an ellipsis as "More pages"', () => {
    render(
      <Pagination>
        <PaginationItem>
          <PaginationEllipsis data-testid="ellipsis" />
        </PaginationItem>
      </Pagination>,
    );
    expect(screen.getByTestId('ellipsis')).toHaveTextContent('…More pages');
    expect(screen.getByText('…')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders router links with asChild', () => {
    render(
      <Pagination>
        <PaginationItem>
          <PaginationLink page={3} asChild>
            <RouterLink href="?page=3" />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext asChild>
            <RouterLink href="?page=4" />
          </PaginationNext>
        </PaginationItem>
      </Pagination>,
    );
    expect(screen.getByRole('link', { name: 'Page 3' })).toHaveAttribute('data-router-link');
    expect(screen.getByRole('link', { name: 'Next page' })).toHaveAttribute('data-router-link');
  });

  it('forwards refs to the nav and the link', () => {
    const navRef = createRef<HTMLElement>();
    const linkRef = createRef<HTMLAnchorElement>();
    render(
      <Pagination ref={navRef}>
        <PaginationItem>
          <PaginationLink ref={linkRef} page={1} href="?page=1" />
        </PaginationItem>
      </Pagination>,
    );
    expect(navRef.current).toBe(screen.getByRole('navigation'));
    expect(linkRef.current).toBe(screen.getByRole('link'));
  });

  it.each(['sm', 'md'] as const)('applies size-%s', (size) => {
    render(
      <Pagination size={size}>
        <PaginationItem>
          <PaginationLink page={1} href="?page=1" />
        </PaginationItem>
      </Pagination>,
    );
    expect(screen.getByRole('navigation')).toHaveClass(`size-${size}`);
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Pagination — accessibility', () => {
  it('has no axe violations on the first, middle and last page', async () => {
    for (const currentPage of [1, 2, 3]) {
      const { container, unmount } = renderPagination(currentPage);
      expect(await axe(container)).toHaveNoViolations();
      unmount();
    }
  });
});
