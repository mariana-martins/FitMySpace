import { formatPrice, SAMPLE_PRODUCTS, SAMPLE_ROOMS, SampleProductGrid } from './';
import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * CATALOGUE
 * =============================================================== */

describe('sampleProducts — catalogue', () => {
  it('has four products in every room', () => {
    for (const room of SAMPLE_ROOMS) {
      expect(SAMPLE_PRODUCTS.filter((product) => product.room === room)).toHaveLength(4);
    }
  });

  it('gives every product its own id', () => {
    const ids = SAMPLE_PRODUCTS.map((product) => product.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('formats a price in Australian dollars', () => {
    expect(formatPrice(2499)).toBe('$24.99');
  });
});

/* ===============================================================
 * GRID
 * =============================================================== */

describe('SampleProductGrid — rendering', () => {
  it('renders one list item and one link per product', () => {
    render(<SampleProductGrid products={SAMPLE_PRODUCTS.slice(0, 3)} />);
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });

  it('names each product with a heading at the level it is given', () => {
    render(<SampleProductGrid products={SAMPLE_PRODUCTS.slice(0, 1)} headingLevel={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(SAMPLE_PRODUCTS[0].name);
  });

  it('has no axe violations', async () => {
    const { container } = render(<SampleProductGrid products={SAMPLE_PRODUCTS.slice(0, 2)} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
