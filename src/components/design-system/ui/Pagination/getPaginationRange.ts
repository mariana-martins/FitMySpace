import type { PaginationRangeItem } from './Pagination.types';

export interface PaginationRangeOptions {
  page: number;
  pageCount: number;
  /** Pages shown on each side of the current page. Defaults to 1. */
  siblingCount?: number;
}

function pagesBetween(first: number, last: number): number[] {
  return Array.from({ length: last - first + 1 }, (_, offset) => first + offset);
}

/**
 * The page numbers to show, with an ellipsis for each run of hidden pages.
 * The first and last pages always show, and the list keeps the same length
 * on every page, so the controls never jump as people move through them.
 * An ellipsis never hides a single page: that page is shown instead.
 */
export function getPaginationRange({
  page,
  pageCount,
  siblingCount = 1,
}: PaginationRangeOptions): PaginationRangeItem[] {
  if (pageCount < 1) return [];

  const currentPage = Math.min(Math.max(page, 1), pageCount);
  // First, last, current, two ellipses and the siblings on both sides.
  const slotCount = siblingCount * 2 + 5;

  if (pageCount <= slotCount) return pagesBetween(1, pageCount);

  const firstSibling = Math.max(currentPage - siblingCount, 1);
  const lastSibling = Math.min(currentPage + siblingCount, pageCount);
  const hasStartEllipsis = firstSibling > 3;
  const hasEndEllipsis = lastSibling < pageCount - 2;
  const edgeRunLength = siblingCount * 2 + 3;

  if (!hasStartEllipsis) {
    return [...pagesBetween(1, edgeRunLength), 'end-ellipsis', pageCount];
  }

  if (!hasEndEllipsis) {
    return [1, 'start-ellipsis', ...pagesBetween(pageCount - edgeRunLength + 1, pageCount)];
  }

  return [
    1,
    'start-ellipsis',
    ...pagesBetween(firstSibling, lastSibling),
    'end-ellipsis',
    pageCount,
  ];
}
