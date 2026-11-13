import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { SearchField } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * STRUCTURE
 * =============================================================== */

describe('SearchField — structure', () => {
  it('renders a search landmark named by its visible label', () => {
    render(<SearchField label="Search products" />);
    expect(screen.getByRole('search', { name: 'Search products' }).tagName).toBe('FORM');
    expect(screen.getByText('Search products').tagName).toBe('LABEL');
  });

  it('renders a search input named by the label, submitted as q', () => {
    render(<SearchField label="Search products" placeholder="Shelves, baskets…" />);
    const input = screen.getByRole('searchbox', { name: 'Search products' });
    expect(input).toHaveAttribute('type', 'search');
    expect(input).toHaveAttribute('name', 'q');
    expect(input).toHaveAttribute('placeholder', 'Shelves, baskets…');
  });

  it('renders a Search submit button', () => {
    render(<SearchField label="Search products" />);
    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('type', 'submit');
  });

  it('describes the input with the hint', () => {
    render(<SearchField label="Search products" hint="Try a room, such as kitchen." />);
    expect(screen.getByRole('searchbox')).toHaveAccessibleDescription(
      'Try a room, such as kitchen.',
    );
  });

  it('passes form props such as action and method to the form', () => {
    render(<SearchField label="Search products" action="/" method="get" />);
    const form = screen.getByRole('search');
    expect(form).toHaveAttribute('action', '/');
    expect(form).toHaveAttribute('method', 'get');
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchField label="Search products" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('searchbox'));
  });
});

/* ===============================================================
 * CLEAR
 * =============================================================== */

describe('SearchField — clear', () => {
  it('shows the Clear button only while there is text', async () => {
    const user = userEvent.setup();
    render(<SearchField label="Search products" />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'shelf');
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('empties the field, calls onClear and moves focus back to the input', async () => {
    const user = userEvent.setup();
    const handleClear = jest.fn();
    render(<SearchField label="Search products" defaultValue="shelf" onClear={handleClear} />);
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('hides the Clear button when disabled', () => {
    render(<SearchField label="Search products" defaultValue="shelf" disabled />);
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });
});

/* ===============================================================
 * SEARCH
 * =============================================================== */

describe('SearchField — search', () => {
  it('calls onSearch with the trimmed query on submit', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(<SearchField label="Search products" onSearch={handleSearch} />);
    await user.type(screen.getByRole('searchbox'), '  bamboo caddy  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(handleSearch).toHaveBeenCalledWith('bamboo caddy');
  });

  it('submits with the Enter key', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(<SearchField label="Search products" onSearch={handleSearch} />);
    await user.type(screen.getByRole('searchbox'), 'basket{Enter}');
    expect(handleSearch).toHaveBeenCalledWith('basket');
  });

  it('lets its own onSubmit cancel onSearch', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    const handleSubmit = jest.fn((event: SubmitEvent<HTMLFormElement>) => event.preventDefault());
    render(<SearchField label="Search products" onSubmit={handleSubmit} onSearch={handleSearch} />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('works as a controlled field', async () => {
    const user = userEvent.setup();
    function ControlledSearch() {
      const [query, setQuery] = useState('shelf');
      return (
        <>
          <SearchField label="Search products" value={query} onValueChange={setQuery} />
          <p>Query: {query}</p>
        </>
      );
    }
    render(<ControlledSearch />);
    await user.type(screen.getByRole('searchbox'), 's');
    expect(screen.getByText('Query: shelfs')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByText('Query:')).toBeInTheDocument();
  });
});

/* ===============================================================
 * ERROR
 * =============================================================== */

describe('SearchField — error', () => {
  it('requires an error message when invalid', () => {
    // @ts-expect-error -- `invalid` without `error` must not compile
    render(<SearchField label="Search products" invalid />);
    expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-invalid');
  });

  it('marks the input invalid and reads hint then error', () => {
    render(
      <SearchField
        label="Search products"
        hint="Search by product, room or store."
        invalid
        error="Enter at least 2 characters to search."
      />,
    );
    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      'Search by product, room or store. Error: Enter at least 2 characters to search.',
    );
  });

  it('does not use a live region for the error', () => {
    render(<SearchField label="Search products" invalid error="Enter at least 2 characters." />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('ignores a whitespace-only error', () => {
    render(<SearchField label="Search products" invalid error="   " />);
    expect(screen.getByRole('searchbox')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('SearchField — accessibility', () => {
  it('has no axe violations, empty and with text', async () => {
    const { container } = render(
      <>
        <SearchField label="Search products" hint="Try a room, such as kitchen." />
        <SearchField label="Search the shelf aisle" defaultValue="oak" size="sm" />
        <SearchField
          label="Search the basket aisle"
          defaultValue="a"
          invalid
          error="Enter at least 2 characters to search."
        />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
