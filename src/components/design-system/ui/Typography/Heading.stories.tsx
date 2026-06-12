import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Heading } from './Typography';

const meta = {
  title: 'Design System/Components/Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The `Heading` component is the foundation for titles across the application. It is designed with a crucial principle in mind: **decoupling visual sizing from semantic HTML structure (Accessibility & SEO)**.\n\n' +
          'Use the `level` prop to choose the correct HTML tag (`h1` through `h6`) based on your page document outline. Then, use the `size` prop to dictate how large the text should visually appear. This allows you to render an `<h3>` that visually looks like an `<h2>`, keeping your accessibility tree perfect without compromising the design.',
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    level: 2,
    size: 'lg',
  },
  argTypes: {
    level: {
      control: { type: 'select' },
      options: [1, 2, 3, 4, 5, 6],
      description: 'Semantic heading level — controls the rendered HTML tag (h1–h6).',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Typography scale variant. Independent of `level`.',
    },
    displaySize: {
      control: { type: 'select' },
      options: [undefined, 'md', 'lg'],
      description: 'When set, uses the larger display scale.',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', { level: 2 });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveTextContent('The quick brown fox');
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Heading level={2} size="lg">Heading Large</Heading>
      <Heading level={3} size="md">Heading Medium</Heading>
      <Heading level={4} size="sm">Heading Small</Heading>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Heading level={2} size="lg">Heading Large</Heading>\n<Heading level={3} size="md">Heading Medium</Heading>\n<Heading level={4} size="sm">Heading Small</Heading>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument();
    await expect(canvas.getByRole('heading', { level: 4 })).toBeInTheDocument();
  },
};

export const DisplayScale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Heading level={1} displaySize="lg">Display Large</Heading>
      <Heading level={1} displaySize="md">Display Medium</Heading>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Heading level={1} displaySize="lg">Display Large</Heading>\n<Heading level={1} displaySize="md">Display Medium</Heading>`,
      },
    },
  },
};

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Heading level={1} size="lg">h1 — Page Title</Heading>
      <Heading level={2} size="lg">h2 — Section Title</Heading>
      <Heading level={3} size="md">h3 — Subsection Title</Heading>
      <Heading level={4} size="sm">h4 — Group Title</Heading>
      <Heading level={5} size="sm">h5 — Sub-group Title</Heading>
      <Heading level={6} size="sm">h6 — Detail Title</Heading>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// The "level" prop automatically controls the rendered HTML tag (h1-h6).\n<Heading level={1} size="lg">h1</Heading>\n<Heading level={2} size="lg">h2</Heading>`,
      },
    },
  },
};
