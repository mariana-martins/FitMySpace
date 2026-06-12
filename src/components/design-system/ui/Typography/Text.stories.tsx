import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Text } from './Typography';

const meta = {
  title: 'Design System/Components/Typography/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Text` component is the workhorse for all standard reading material in your application, designed to optimize legibility and accessibility.\n\n' +
          'By default, it renders as a semantic `<p>` paragraph, which is ideal for long-form content and screen readers. If you need to drop text inside another element (like a button or a badge) where a paragraph would create invalid HTML, you can switch it to an inline element using `as="span"`. The `size` prop adjusts the body scale without affecting the underlying HTML structure.',
      },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children:
      'Organizing your space should feel natural, not overwhelming. FitMySpace helps you find the right place for everything — one room at a time.',
    as: 'p',
    size: 'md',
  },
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['p', 'span'],
      description: 'Rendered HTML element.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Typography scale variant.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = canvas.getByText(/Organizing your space/);
    await expect(text.tagName).toBe('P');
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Text size="lg">Body Large — 1.125rem / 400</Text>
      <Text size="md">Body Medium — 1rem / 400</Text>
      <Text size="sm">Body Small — 0.875rem / 400</Text>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Text size="lg">Body Large</Text>\n<Text size="md">Body Medium</Text>\n<Text size="sm">Body Small</Text>`,
      },
    },
  },
};
