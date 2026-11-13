import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { EmptyState } from '../EmptyState';
import { useRef, useState } from 'react';
import { Text } from '../Typography';
import { Button } from '../Button';
import { SearchField } from './';

const meta = {
  title: 'Design System/Components/Forms/SearchField',
  component: SearchField,
  tags: ['autodocs'],
  args: {
    label: 'Search products',
    placeholder: 'Shelves, baskets, drawer organisers…',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `SearchField` component is a complete search form: a visible `label`, a search input with a Clear button, a Search button and an optional `hint`. It renders a `<form role="search">` named by its label, so screen readers can jump to it as a search landmark.\n\n' +
          '### Best Practices\n' +
          '- **Keep the label visible:** It names the field and the search landmark. Use the placeholder only for examples of what to type.\n' +
          '- **Let the URL hold the query:** Without `onSearch`, the form submits natively: `action="/" method="get"` sends `?q=…`, works without JavaScript, and lets people share and go back to a search. With Next.js, read `q` from the search params and pass it as `defaultValue`.\n' +
          '- **Use `onSearch` for client-side routing:** It receives the trimmed query and stops the native submit, e.g. to call `router.push`.\n' +
          '- **One search per page area:** For two search forms on a page, give each a distinct label so the landmarks can be told apart.\n' +
          '- **Announce the results:** After a search, update a results summary inside a live region that is already on the page, such as "12 products for basket".\n' +
          '- **Errors are for the query only:** Use `invalid` and `error` when people must change what they typed, such as a query that is too short. No matches or a failed request belong in the results area.\n\n' +
          '### Key Features\n' +
          '- **Search landmark** — `<form role="search">` named by the visible label through `aria-labelledby`.\n' +
          '- **Clear button** — appears while there is text, has its own name ("Clear search"), empties the field and returns focus to it. The browser\'s own clear control is hidden, so there is only one.\n' +
          '- **Controlled or uncontrolled** — `value` / `onValueChange` or `defaultValue`, through Radix `useControllableState`.\n' +
          '- **Mobile keyboards** — `type="search"` and `enterKeyHint="search"` show a Search key; Enter submits.\n' +
          '- **Errors** — the `TextField` pattern: TypeScript requires an `error` message whenever `invalid` is `true`; the field gets `aria-invalid` and the error style, and the message, prefixed with a screen-reader-only "Error:", is linked after the hint.\n' +
          '- **3 sizes** — `sm`, `md` and `lg`, the `Input` and `Button` heights, so the field and its button always line up.',
      },
    },
  },
} satisfies Meta<typeof SearchField>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Search products',
    hint: 'Search by product, room or store.',
    placeholder: 'Shelves, baskets, drawer organisers…',
    size: 'md',
    invalid: false,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. It also names the search landmark.',
    },
    hint: {
      control: 'text',
      description: 'Help text below the field, linked with `aria-describedby`.',
    },
    placeholder: {
      control: 'text',
      description: 'Examples of what to type. Never a replacement for the label.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Height of the field and the Search button: 40, 48 or 56px. Defaults to `md`.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the query invalid. Requires a descriptive `error` message (enforced by TypeScript).',
    },
    error: {
      control: 'text',
      description: 'Error message, required when `invalid` is `true`. Say how to fix the query.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and both buttons.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '36rem' }}>
      <SearchField {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. Type to see the Clear button appear.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('search', { name: 'Search products' })).toBeInTheDocument();
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search products' }), 'basket');
    await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '36rem' }}>
      <SearchField size="lg" label="Large" defaultValue="bamboo" />
      <SearchField size="md" label="Medium" defaultValue="bamboo" />
      <SearchField size="sm" label="Small" defaultValue="bamboo" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`lg` (56px) for a hero search on the home page, `md` (48px, default) for a results page, and `sm` (40px) for a search inside a panel or filter bar. The Search button always matches the field height.',
      },
      source: {
        code: `<SearchField size="lg" label="Search products" />`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <div style={{ maxWidth: '36rem' }}>
      <SearchField
        label="Search products"
        hint="Search by product, room or store."
        defaultValue="a"
        invalid
        error="Enter at least 2 characters to search."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the error only for a query people can fix, such as one that is too short. When `invalid` is `true`, TypeScript requires an `error` message. The field takes the error border and halo, and screen readers read the hint first, then the error. Nothing found or a failed request is not a field error: show it in the results area.',
      },
      source: {
        code: `<SearchField\n  label="Search products"\n  invalid\n  error="Enter at least 2 characters to search."\n/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('searchbox', { name: 'Search products' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
      'Search by product, room or store. Error: Enter at least 2 characters to search.',
    );
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '36rem' }}>
      <SearchField label="Empty" />
      <SearchField label="With text" defaultValue="oak shelf" />
      <SearchField label="Focus" defaultValue="oak shelf" className="pseudo-focus-within" />
      <SearchField label="Disabled" defaultValue="oak shelf" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the states with the `storybook-addon-pseudo-states` plugin:\n\n' +
          '- **Empty** — no Clear button.\n' +
          '- **With text** — the Clear button appears at the end of the field.\n' +
          '- **Focus** — the field takes the `Input` focus style: a 2px sage edge and a pale halo.\n' +
          '- **Disabled** — the field and both buttons are dimmed, and the Clear button is hidden.',
      },
    },
    pseudo: {
      focusWithin: ['.pseudo-focus-within [role="presentation"]'],
    },
  },
};

/* ---------------------------------------------------------------
 * Search page (recipe)
 * --------------------------------------------------------------- */

const PRODUCTS = ['Bamboo shower caddy', 'Oak wall shelf', 'Linen storage basket', 'Wire basket'];

const MINIMUM_QUERY_LENGTH = 2;
const QUERY_TOO_SHORT = `Enter at least ${MINIMUM_QUERY_LENGTH} characters to search.`;

function SearchPage() {
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

export const SearchPageExample: Story = {
  name: 'Search Page (A11y)',
  render: () => <SearchPage />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a results page: `onSearch` filters the list, and the summary sits in a `role="status"` live region that is always on the page, so screen readers announce "1 products for wire" or "0 products for sofa". With no results, an `EmptyState` says what to try next. A one-letter query is a field error: the message says how to fix it and focus returns to the field.',
      },
      source: {
        code: `<SearchField\n  ref={searchInputRef}\n  label="Search products"\n  defaultValue={searchParams.q}\n  onSearch={search}\n  onClear={() => router.push('/')}\n  {...(queryError ? { invalid: true, error: queryError } : { invalid: false })}\n/>\n<Text as="p" role="status">{resultsSummary}</Text>`,
      },
    },
  },
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
