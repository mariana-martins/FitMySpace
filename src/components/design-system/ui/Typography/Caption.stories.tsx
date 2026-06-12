import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Caption } from './Typography';

const meta = {
  title: 'Design System/Foundation/Typography/Caption',
  component: Caption,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Caption` component is designed for small, supplementary information that provides extra context without competing for the user\'s primary attention.\n\n' +
          'By default, it renders as an inline `<span>` so it can easily sit inside or alongside other text elements (like timestamps or tiny metadata). If you need it to behave as a standalone block of text, you can use the `as="p"` prop. It naturally adopts a subtle color to enforce proper visual hierarchy.',
      },
    },
  },
} satisfies Meta<typeof Caption>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Last updated 3 hours ago',
  },
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['span', 'p'],
      description: 'Rendered HTML element.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const caption = canvas.getByText('Last updated 3 hours ago');
    await expect(caption.tagName).toBe('SPAN');
  },
};
