import { PackageOpen, SlidersHorizontal } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../Button';
import { EmptyState } from './';

const meta = {
  title: 'Design System/Components/Display/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  args: {
    title: 'No products found',
    description: 'Try fewer filters or a broader search, such as basket or shelf.',
    headingLevel: 2,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `EmptyState` component fills a list or page that has nothing to show, such as a search with no results or an empty saved list. It says what happened and what to do next.\n\n' +
          '### Best Practices\n' +
          '- **Say what happened, then what to do:** The `title` states the situation ("No products found"); the `description` offers a way forward ("Try fewer filters").\n' +
          '- **Offer one clear action:** Pass a `Button` or `Link` as children, such as "Clear filters". Keep it to one or two.\n' +
          '- **Fit the page outline:** Set `headingLevel` so the title follows the headings above it.\n' +
          '- **Announce it elsewhere:** `EmptyState` is not a live region. Announce "0 products" in a results summary that is already on the page.\n\n' +
          '### Key Features\n' +
          '- **Calm by default** — a search icon with a cross in a pale sage circle; pass `icon` for another Lucide icon. The icon is decorative and hidden from screen readers.\n' +
          '- **Readable** — the description keeps to a comfortable line length and the column centres in any container.\n' +
          '- **Server-rendered** — no client hooks.',
      },
    },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    title: 'No products found',
    description: 'Try fewer filters or a broader search, such as basket or shelf.',
    headingLevel: 2,
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'What happened, as a heading.',
    },
    description: {
      control: 'text',
      description: 'What people can do next.',
    },
    headingLevel: {
      control: { type: 'select' },
      options: [2, 3, 4, 5, 6],
      description: 'Heading level of the title, to fit the page outline. Defaults to 2.',
    },
    icon: {
      control: false,
      description: 'Decorative icon. Defaults to a search icon with a cross.',
    },
    children: {
      control: false,
      description: 'Actions, such as a Button that clears the filters.',
    },
  },
  render: (args) => (
    <EmptyState {...args}>
      <Button variant="secondary" appearance="outline" size="md">
        Clear filters
      </Button>
    </EmptyState>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'No products found' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))' }}>
      <EmptyState
        title="Your list is empty"
        headingLevel={3}
        icon={<PackageOpen />}
        description="Save products you like and they will wait for you here."
      />
      <EmptyState
        title="No matches for these filters"
        headingLevel={3}
        icon={<SlidersHorizontal />}
        description="Remove a filter to see more products."
      >
        <Button variant="secondary" appearance="outline" size="sm">
          Clear filters
        </Button>
      </EmptyState>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pick an icon that matches the situation: an open box for an empty list, sliders when filters hide everything. It stays decorative; the title carries the meaning.',
      },
      source: {
        code: `<EmptyState title="Your list is empty" icon={<PackageOpen />} description="…" />`,
      },
    },
  },
};
