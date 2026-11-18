import { expect, userEvent, waitFor, within } from 'storybook/test';
import { SAMPLE_PRODUCTS, SampleProductGrid } from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../../ui/Typography';
import { useEffect, useRef, useState } from 'react';
import { EmptyState } from '../../ui/EmptyState';
import { Skeleton } from '../../ui/Skeleton';
import { Button } from '../../ui/Button';
import { Alert } from '../../ui/Alert';
import { Card } from '../../ui/Card';

/* ---------------------------------------------------------------
 * Results states (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Tasks/Results States',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The four things the results area can show, and how it moves between them: loading, products, no products, and a request that failed.\n\n' +
          '### What It Solves\n' +
          'The same spot on the page has to say very different things, and each one needs its own answer: a wait (placeholders the shape of the products), a result (the grid and how many), nothing found (what to change), and a failure (what went wrong and a way to try again). People who cannot see the grid must hear every change.\n\n' +
          '### When to Use\n' +
          '- **Any list that loads from the network:** search results, a category, a room.\n' +
          '- **Not for:** a short wait inside a button (keep the button and its text), or an error in what people typed (that is a field error, see Product Search).\n\n' +
          '### Anatomy\n' +
          '- A `<section>` named by its `Heading`, with `aria-busy="true"` while loading.\n' +
          '- A status line — `Text` with `role="status"` — that stays on the page in every state and says what is there now.\n' +
          '- **Loading:** `Card`s holding `Skeleton`s, laid out like the real cards.\n' +
          '- **Products:** the grid (the Product Card pattern).\n' +
          '- **No products:** an `EmptyState` that says what to change, with one `Button`.\n' +
          '- **Failed:** an `Alert` (`error`) that says what happened and what to do, with a "Try again" `Button`.\n\n' +
          '### Accessibility\n' +
          '- **One status line carries the news** ("Loading products…", "16 products", "No products match these filters"). It exists before the first change, so every change is read, and the skeletons stay silent.\n' +
          '- **A failure is an alert, not a status:** `live="assertive"` interrupts, because waiting for products that will never come is worse than being interrupted.\n' +
          '- **The button that was pressed disappears** ("Try again", "Clear filters"), so the focus moves to the section heading, at the top of what changed.\n' +
          '- **No layout jump:** the skeleton cards take the size of the real ones, so the page does not move when the products arrive.\n\n' +
          '### In the App\n' +
          '- Map TanStack Query to the states: `isPending` is loading, `isError` is failed (with `refetch` behind "Try again"), and an empty `data` is no products. Show the loading state only for a first load; when filters change, keep the old products until the new ones arrive.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ResultsState = 'loading' | 'products' | 'empty' | 'error';

const LOADING_TIME_MS = 600;
const PLACEHOLDER_CARDS = ['first', 'second', 'third', 'fourth'];

const STATUS_TEXT: Record<ResultsState, string> = {
  loading: 'Loading products…',
  products: `${SAMPLE_PRODUCTS.length} products`,
  empty: 'No products match these filters',
  error: '',
};

function LoadingCards() {
  return (
    <ul
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
        gap: '1.5rem',
        margin: 0,
        padding: 0,
        listStyle: 'none',
      }}
    >
      {PLACEHOLDER_CARDS.map((placeholder) => (
        <Card key={placeholder} asChild padding="sm">
          <li>
            <Skeleton shape="rectangle" style={{ aspectRatio: '1' }} />
            <Skeleton size="sm" width="60%" />
            <Skeleton size="md" width="85%" />
            <Skeleton size="sm" width="30%" />
          </li>
        </Card>
      ))}
    </ul>
  );
}

function ResultsArea({ initialState }: { initialState: ResultsState }) {
  const [state, setState] = useState<ResultsState>(initialState);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /* "Try again" fakes a request that succeeds after a short wait. */
  useEffect(() => {
    if (state !== 'loading' || initialState === 'loading') return;
    const timer = setTimeout(() => setState('products'), LOADING_TIME_MS);
    return () => clearTimeout(timer);
  }, [state, initialState]);

  function moveTo(nextState: ResultsState) {
    setState(nextState);
    // The pressed button is about to disappear: start again from the top of the results.
    headingRef.current?.focus();
  }

  return (
    <section
      aria-labelledby="results-heading"
      aria-busy={state === 'loading'}
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}
    >
      <Heading
        ref={headingRef}
        id="results-heading"
        tabIndex={-1}
        level={2}
        size="sm"
        style={{ margin: 0 }}
      >
        Storage products
      </Heading>
      <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
        {STATUS_TEXT[state]}
      </Text>

      {state === 'loading' && <LoadingCards />}

      {state === 'products' && <SampleProductGrid products={SAMPLE_PRODUCTS} />}

      {state === 'empty' && (
        <EmptyState
          title="Nothing fits these filters"
          headingLevel={3}
          icon="sliders-horizontal"
          description="Try fewer rooms, or a larger size for your space."
        >
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            onClick={() => moveTo('products')}
          >
            Clear filters
          </Button>
        </EmptyState>
      )}

      {state === 'error' && (
        <Alert
          variant="error"
          live="assertive"
          headingLevel={3}
          title="We could not load the products"
        >
          <Text as="p" size="md" style={{ margin: 0 }}>
            Check your connection, then try again. Your filters are kept.
          </Text>
          <div style={{ marginBlockStart: '0.75rem' }}>
            <Button
              variant="error"
              appearance="outline"
              size="sm"
              onClick={() => moveTo('loading')}
            >
              Try again
            </Button>
          </div>
        </Alert>
      )}
    </section>
  );
}

const sourceCode = `<section aria-labelledby="results-heading" aria-busy={isPending}>
  <Heading ref={headingRef} id="results-heading" tabIndex={-1} level={2} size="sm">
    Storage products
  </Heading>
  <Text as="p" size="sm" role="status">{statusText}</Text>

  {isPending && <LoadingCards />}
  {isSuccess && products.length > 0 && <ProductGrid products={products} />}
  {isSuccess && products.length === 0 && (
    <EmptyState title="Nothing fits these filters" headingLevel={3} icon="sliders-horizontal">
      <Button variant="secondary" appearance="outline" size="md" onClick={clearFilters}>
        Clear filters
      </Button>
    </EmptyState>
  )}
  {isError && (
    <Alert variant="error" live="assertive" headingLevel={3} title="We could not load the products">
      <Text as="p" size="md">Check your connection, then try again.</Text>
      <Button variant="error" appearance="outline" size="sm" onClick={retry}>Try again</Button>
    </Alert>
  )}
</section>`;

/* ---------------------------------------------------------------
 * Loading
 * --------------------------------------------------------------- */

export const Loading: Story = {
  name: 'Loading (A11y)',
  render: () => <ResultsArea initialState="loading" />,
  parameters: {
    docs: {
      description: {
        story:
          'Placeholders the shape of the product cards, so nothing jumps when the products arrive. The section is `aria-busy` and the status line says "Loading products…"; the skeletons themselves are silent.',
      },
      source: { code: sourceCode },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Storage products' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading products…');
  },
};

/* ---------------------------------------------------------------
 * Products
 * --------------------------------------------------------------- */

export const Products: Story = {
  name: 'Products (A11y)',
  render: () => <ResultsArea initialState="products" />,
  parameters: {
    docs: {
      description: {
        story: 'The products, and the status line that counts them.',
      },
      source: { code: sourceCode },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('16 products');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(16);
  },
};

/* ---------------------------------------------------------------
 * No products
 * --------------------------------------------------------------- */

export const NoProducts: Story = {
  name: 'No Products (A11y)',
  render: () => <ResultsArea initialState="empty" />,
  parameters: {
    docs: {
      description: {
        story:
          'Nothing matched, which is not an error: the empty state says what to change and offers one way out. "Clear filters" brings the products back and moves the focus to the heading.',
      },
      source: { code: sourceCode },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Nothing fits these filters' })).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent('No products match these filters');
  },
};

/* ---------------------------------------------------------------
 * Failed
 * --------------------------------------------------------------- */

export const Failed: Story = {
  name: 'Failed (A11y)',
  render: () => <ResultsArea initialState="error" />,
  parameters: {
    docs: {
      description: {
        story:
          'The request failed. The alert interrupts, says what to do and keeps the way forward inside it. Press "Try again": the placeholders come back, then the products, with the focus on the heading.',
      },
      source: { code: sourceCode },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('We could not load the products');
    await expect(canvas.getByRole('button', { name: 'Try again' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * Failed (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const FailedInteraction: Story = {
  ...Failed,
  name: 'Failed (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }));
    await expect(canvas.getByRole('heading', { name: 'Storage products' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Loading products…');
    await waitFor(() => expect(canvas.getByRole('status')).toHaveTextContent('16 products'));
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * No Products (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const NoProductsInteraction: Story = {
  ...NoProducts,
  name: 'No Products (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.getByRole('heading', { name: 'Storage products' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('16 products');
  },
};
