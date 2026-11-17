import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SearchField } from '../../ui/SearchField';
import { EmptyState } from '../../ui/EmptyState';
import { Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';

/* ---------------------------------------------------------------
 * Search page (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Search Page',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A search form above its results: the query goes in, a summary says how many products came back, and an empty state says what to try when nothing did.\n\n' +
          '### When to Use\n' +
          '- **A page whose main job is finding products:** the home page and the results page.\n' +
          '- **Not for:** filtering a short list already on screen (use `Chip` filters) or picking one value from a known set (use `Select`).\n\n' +
          '### Anatomy\n' +
          '- `SearchField` — the search landmark, its label, the Clear and Search buttons, and the query error.\n' +
          '- A results summary — `Text` with `role="status"`, always on the page.\n' +
          '- The results — a list of products, or an `EmptyState` with one way forward (`Button`).\n\n' +
          '### Accessibility\n' +
          '- **The summary is the announcement:** it sits in a live region that exists before the search, so screen readers read "0 products for sofa" without moving focus. `EmptyState` is not a live region.\n' +
          '- **A query error is a field error:** a one-letter query is `invalid` with a message that says how to fix it, and focus returns to the field. No matches is not an error.\n' +
          '- **Clear returns focus to the field**, so typing can start again at once.\n\n' +
          '### In the App\n' +
          '- The query lives in the URL (`?q=…`): read it as `defaultValue` and call `router.push` from `onSearch`. The results come from TanStack Query, never from this pattern.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PRODUCTS = ['Bamboo shower caddy', 'Oak wall shelf', 'Linen storage basket', 'Wire basket'];

const MINIMUM_QUERY_LENGTH = 2;
const QUERY_TOO_SHORT = `Enter at least ${MINIMUM_QUERY_LENGTH} characters to search.`;

function SearchPageRecipe() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [queryError, setQueryError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const showAllProducts = () => {
    setInputValue('');
    setQuery('');
    setQueryError(null);
  };

  const search = (submittedQuery: string) => {
    // An empty query is fine: it shows every product.
    if (submittedQuery.length > 0 && submittedQuery.length < MINIMUM_QUERY_LENGTH) {
      setQueryError(QUERY_TOO_SHORT);
      searchInputRef.current?.focus();
      return;
    }
    setQueryError(null);
    setQuery(submittedQuery);
  };
  const matches = PRODUCTS.filter((product) => product.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '36rem' }}>
      <SearchField
        ref={searchInputRef}
        label="Search products"
        value={inputValue}
        onValueChange={setInputValue}
        onSearch={search}
        onClear={showAllProducts}
        {...(queryError ? { invalid: true, error: queryError } : { invalid: false })}
      />
      <Text as="p" role="status" style={{ margin: 0 }}>
        {query ? `${matches.length} products for “${query}”` : `${PRODUCTS.length} products`}
      </Text>
      {matches.length > 0 ? (
        <ul style={{ margin: 0, paddingInlineStart: '1.25rem' }}>
          {matches.map((product) => (
            <li key={product}>{product}</li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={`No products for “${query}”`}
          headingLevel={3}
          description="Check the spelling or try a broader word, such as basket or shelf."
        >
          <Button variant="secondary" appearance="outline" size="md" onClick={showAllProducts}>
            Show all products
          </Button>
        </EmptyState>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
 * Search page
 * --------------------------------------------------------------- */

export const SearchPage: Story = {
  name: 'Search Page (A11y)',
  render: () => <SearchPageRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Search for "wire" to see one result, "sofa" to see the empty state, or "a" to see the query error. The summary under the field is the live region: it changes with every search, and screen readers read it where it is.',
      },
      source: {
        code: `<SearchField\n  ref={searchInputRef}\n  label="Search products"\n  defaultValue={searchParams.q}\n  onSearch={search}\n  onClear={() => router.push('/')}\n  {...(queryError ? { invalid: true, error: queryError } : { invalid: false })}\n/>\n<Text as="p" role="status">{resultsSummary}</Text>\n{products.length > 0 ? (\n  <ProductList products={products} />\n) : (\n  <EmptyState title={\`No products for “\${query}”\`} headingLevel={2} description="…">\n    <Button variant="secondary" appearance="outline" size="md" onClick={showAll}>\n      Show all products\n    </Button>\n  </EmptyState>\n)}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('searchbox', { name: 'Search products' })).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 products');
  },
};

/* ---------------------------------------------------------------
 * Search Page (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const SearchPageInteraction: Story = {
  ...SearchPage,
  name: 'Search Page (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search products' });
    await userEvent.type(input, 'a{Enter}');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveFocus();
    await userEvent.clear(input);

    await userEvent.type(input, 'sofa{Enter}');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(canvas.getByRole('status')).toHaveTextContent('0 products for “sofa”');
    await expect(canvas.getByRole('heading', { name: 'No products for “sofa”' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Show all products' }));
    await expect(input).toHaveValue('');
    await expect(canvas.getByRole('status')).toHaveTextContent('4 products');

    await userEvent.type(input, 'oak{Enter}');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }));
    await expect(input).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 products');
  },
};
