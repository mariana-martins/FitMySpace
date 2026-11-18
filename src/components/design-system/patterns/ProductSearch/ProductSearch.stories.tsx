import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SearchField } from '../../ui/SearchField';
import { EmptyState } from '../../ui/EmptyState';
import { List, ListItem } from '../../ui/List';
import { Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';

/* ---------------------------------------------------------------
 * Product search (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Tasks/Product Search',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A search box above the products it finds, and what the page says after each search.\n\n' +
          '### What It Solves\n' +
          'A search can end three ways, and each one needs its own answer:\n' +
          '- **Products found:** the line under the search box counts them ("1 product for wire") and the list shows them.\n' +
          '- **Nothing found:** this is not a mistake, so there is no error. A message says what to try instead, with a button to see everything again.\n' +
          '- **The search cannot run** (a one-letter word): this is a mistake people must fix, so the search box shows an error and takes the focus back.\n\n' +
          '### When to Use\n' +
          '- **A page whose main job is finding products:** the home page and the results page.\n' +
          '- **Not for:** filtering a short list already on screen (use `Chip` filters) or picking one value from a known set (use `Select`).\n\n' +
          '### Anatomy\n' +
          '- `SearchField` — the search landmark, its label, the Clear and Search buttons, and the query error.\n' +
          '- A results summary — `Text` with `role="status"`, always on the page.\n' +
          '- The results — a `List` of products, or an `EmptyState` with one way forward (`Button`).\n\n' +
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

function countProducts(count: number) {
  return `${count} ${count === 1 ? 'product' : 'products'}`;
}

function ProductSearchRecipe() {
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '36rem',
        maxWidth: '100%',
      }}
    >
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
        {query ? `${countProducts(matches.length)} for “${query}”` : countProducts(PRODUCTS.length)}
      </Text>
      {matches.length > 0 ? (
        <List size="sm" aria-label="Products">
          {matches.map((product) => (
            <ListItem key={product}>{product}</ListItem>
          ))}
        </List>
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
 * Product search
 * --------------------------------------------------------------- */

export const ProductSearch: Story = {
  name: 'Product Search (A11y)',
  render: () => <ProductSearchRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Try the three endings: search "wire" to find one product, "sofa" to find nothing, and "a" to see the error. The line under the search box always says what happened, and screen readers read it without moving the focus.',
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
 * Product Search (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const ProductSearchInteraction: Story = {
  ...ProductSearch,
  name: 'Product Search (A11y): Interaction (Test Only)',
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
