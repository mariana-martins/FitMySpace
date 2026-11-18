import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Caption, Text } from '../../ui/Typography';
import { EmptyState } from '../../ui/EmptyState';
import { Button } from '../../ui/Button';
import { Link } from '../../ui/Link';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Page errors (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Pages/Page Errors',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The whole page when there is nothing to show: a page that does not exist, and a page that broke. Each says what happened in plain words and offers a way on.\n\n' +
          '### What It Solves\n' +
          'An error page is a dead end unless it gives people somewhere to go. The two cases need different words: a missing page is usually an old link (send people to search), a broken page is our fault (say their things are safe and let them try again). Neither should show a technical message.\n\n' +
          '### When to Use\n' +
          '- **Not Found:** a URL that matches nothing, or a product that is no longer sold.\n' +
          '- **Something Went Wrong:** an error the page could not recover from.\n' +
          '- **Not for:** a failed list inside a working page (see Results States), or an empty result (see Product Search).\n\n' +
          '### Anatomy\n' +
          '- An `EmptyState` with `headingLevel={1}`: the page has nothing else, so its title is the page heading.\n' +
          '- Not Found: a `Button` rendered as a link to search, and a `Link` to the home page.\n' +
          '- Something Went Wrong: a "Try again" `Button`, a `Link` home, and a `Caption` with a reference people can quote to support.\n\n' +
          '### Accessibility\n' +
          '- **One `h1` that says what happened**, and the browser tab says it too (the page `title`), because that is what screen readers announce first on a new page.\n' +
          '- **Plain words, no codes in the heading:** "We could not find that page", not "404". The technical detail goes in the reference line, for support.\n' +
          '- **Every way on is a real link or button,** with a name that says where it goes.\n\n' +
          '### In the App\n' +
          '- Not Found is `src/app/not-found.tsx`, and it must be served with a real 404 status: keep `loading.tsx` out of `/products/[id]`, or unknown products answer 200.\n' +
          '- Something Went Wrong is `src/app/error.tsx`: "Try again" resets the failed queries and calls `retry`. Show `error.digest` as the reference, never `error.message`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Not found
 * --------------------------------------------------------------- */

export const NotFound: Story = {
  name: 'Not Found (A11y)',
  render: () => (
    <EmptyState
      title="We could not find that page"
      headingLevel={1}
      icon="search-x"
      description="The link may be old, or the product is no longer sold. Search for something like it."
    >
      <Button asChild variant="primary" appearance="fill" size="md" icon="search">
        <a href="#search">Search for storage</a>
      </Button>
      <Link href="#home" appearance="standalone" size="md">
        Go to the home page
      </Link>
    </EmptyState>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An old link or a product that has gone. The way on is a search, because people came for a kind of product, not that exact page.',
      },
      source: {
        code: `// src/app/not-found.tsx — served with a 404 status
<EmptyState
  title="We could not find that page"
  headingLevel={1}
  icon="search-x"
  description="The link may be old, or the product is no longer sold. Search for something like it."
>
  <Button asChild variant="primary" appearance="fill" size="md" icon="search">
    <NextLink href="/">Search for storage</NextLink>
  </Button>
  <Link asChild appearance="standalone" size="md">
    <NextLink href="/">Go to the home page</NextLink>
  </Link>
</EmptyState>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'We could not find that page',
    );
    await expect(canvas.getByRole('link', { name: 'Search for storage' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Something went wrong
 * --------------------------------------------------------------- */

const ERROR_REFERENCE = '7F3K-21';

function SomethingWentWrong() {
  const [attempts, setAttempts] = useState(0);

  return (
    <EmptyState
      title="Something went wrong on our side"
      headingLevel={1}
      icon="circle-alert"
      description="Your saved spaces and products are safe. Try again, or come back in a few minutes."
    >
      <Button
        variant="primary"
        appearance="fill"
        size="md"
        onClick={() => setAttempts(attempts + 1)}
      >
        Try again
      </Button>
      <Link href="#home" appearance="standalone" size="md">
        Go to the home page
      </Link>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem',
          flexBasis: '100%',
        }}
      >
        <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
          {attempts > 0 ? 'Still not working. Wait a few minutes before you try again.' : ''}
        </Text>
        <Caption>Reference for support: {ERROR_REFERENCE}</Caption>
      </div>
    </EmptyState>
  );
}

export const SomethingWentWrongPage: Story = {
  name: 'Something Went Wrong (A11y)',
  render: () => <SomethingWentWrong />,
  parameters: {
    docs: {
      description: {
        story:
          'The page broke. It reassures first (nothing is lost), then offers "Try again", which here fails again on purpose to show the status line that answers it. The reference is for support, out of the way.',
      },
      source: {
        code: `// src/app/error.tsx
<EmptyState
  title="Something went wrong on our side"
  headingLevel={1}
  icon="circle-alert"
  description="Your saved spaces and products are safe. Try again, or come back in a few minutes."
>
  <Button variant="primary" appearance="fill" size="md" onClick={handleTryAgain}>
    Try again
  </Button>
  <Link asChild appearance="standalone" size="md">
    <NextLink href="/">Go to the home page</NextLink>
  </Link>
  <Caption>Reference for support: {error.digest}</Caption>
</EmptyState>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Something went wrong on our side',
    );
    await expect(canvas.getByText(`Reference for support: ${ERROR_REFERENCE}`)).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Something Went Wrong (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const SomethingWentWrongInteraction: Story = {
  ...SomethingWentWrongPage,
  name: 'Something Went Wrong (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tryAgain = canvas.getByRole('button', { name: 'Try again' });
    await userEvent.click(tryAgain);
    await expect(canvas.getByRole('status')).toHaveTextContent('Still not working');
    await expect(tryAgain).toHaveFocus();
  },
};
