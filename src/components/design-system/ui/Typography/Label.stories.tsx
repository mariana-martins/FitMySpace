import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Label, Caption } from './';

const meta = {
  title: 'Design System/Components/Typography/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Label` component is built with strict accessibility rules in mind (WCAG guidelines).\n\n' +
          'By default, it renders as a purely visual `<span>`. However, when you use it to label form inputs, you must pass `as="label"`. The magic happens here: TypeScript acts as an accessibility guard and makes the `htmlFor` prop **mandatory**. This guarantees that your labels are always correctly tied to their respective inputs for screen readers.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Field Label',
    size: 'md',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Typography scale variant.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Field Label');
    await expect(label.tagName).toBe('SPAN');
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label size="lg">Label Large — 1rem / 500</Label>
      <Label size="md">Label Medium — 0.875rem / 500</Label>
      <Label size="sm">Label Small — 0.75rem / 500</Label>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Label size="lg">Label Large</Label>\n<Label size="md">Label Medium</Label>\n<Label size="sm">Label Small</Label>`,
      },
    },
  },
};

export const FormExample: Story = {
  name: 'Form Example (A11y)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Label as="label" htmlFor="email-demo" size="md">
        Email Address
      </Label>
      <input
        id="email-demo"
        type="email"
        placeholder="you@example.com"
        aria-describedby="email-hint"
        style={{
          padding: '0.5rem 0.75rem',
          border: '1px solid var(--ds-semantic-color-border-default-base)',
          borderRadius: 'var(--ds-semantic-radii-interactive-sm)',
          fontFamily: 'var(--ds-font-family-sans)',
          fontSize: 'var(--ds-font-size-16)',
        }}
      />
      <Caption id="email-hint">We will never share your email with anyone.</Caption>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Label as="label" htmlFor="email-input">Email Address</Label>\n<input id="email-input" type="email" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const label = canvas.getByText('Email Address');
    await expect(label.tagName).toBe('LABEL');
    await expect(label).toHaveAttribute('for', 'email-demo');

    const input = canvas.getByLabelText('Email Address');
    await expect(input).toBeInTheDocument();
  },
};
