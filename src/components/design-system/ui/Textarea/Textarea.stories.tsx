import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { LabelledField } from '../../docs';
import { Text } from '../Typography';
import { Textarea } from './';

const meta = {
  title: 'Design System/Components/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    placeholder: 'e.g. Two people, start with the shelf',
    size: 'md',
    rows: 4,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Textarea` component is the bare multi-line text field: the same box as `Input`, drawn by a native `<textarea>` that grows with `rows`. It has **no visible label** of its own and is driven by the tier-3 `textarea` component tokens. Every example below gives it one, because a form control always needs a visible label.\n\n' +
          '### Best Practices\n' +
          '- **Form fields:** Use `TextareaField` instead. It adds the visible label, hint and error message and wires them for assistive technology.\n' +
          '- **One line, one field:** Use `Input` for anything that fits on a line, such as a name or a measurement. A multi-line box asks for an answer with sentences in it, such as delivery instructions or assembly notes.\n' +
          '- **Standalone use:** Use `Textarea` directly only for layouts `TextareaField` does not cover, and still tie it to visible text: a `<Label as="label" htmlFor>` or `aria-labelledby` pointing at a visible heading. Never rely on `aria-label` or the placeholder alone: the placeholder disappears once people type.\n' +
          '- **Rows:** Set `rows` to the height the shortest useful answer needs, so the field does not start as an empty well. Cap the answer with `maxLength` and say the limit in the hint.\n' +
          '- **Errors:** Always pair `invalid` with a visible message linked through `aria-describedby`. Colour alone never conveys the error.\n\n' +
          '### Key Features\n' +
          '- **Same box as `Input`** — the border, the sage focus edge and halo, and the resting shadow, so a multi-line field sits in a form without looking like a different system.\n' +
          '- **3 sizes** (`sm`, `md`, `lg`) with token-driven padding and font, and a minimum height that matches the `Button` beside it.\n' +
          '- **Resizing** — `resize` defaults to `vertical`, so people can make the field taller without breaking the column it sits in.\n' +
          '- **States** — `invalid`, `disabled` and `readOnly`, all mapped to native attributes.\n' +
          '- **Native first, server first** — a real `<textarea>` with no client hooks: it renders on the server, and spellcheck, undo and mobile keyboards keep working.\n' +
          '- **Ref** — points to the `<textarea>`.',
      },
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    placeholder: 'e.g. Two people, start with the shelf',
    size: 'md',
    rows: 4,
    resize: 'vertical',
    invalid: false,
    disabled: false,
    readOnly: false,
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the field. Defaults to `md`.',
    },
    rows: {
      control: { type: 'number', min: 1 },
      description: 'Visible lines. Defaults to `4`.',
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'both'],
      description:
        'Whether the person can drag the field bigger. Defaults to `vertical`; `both` lets a drag widen the field.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Shows the error style and sets `aria-invalid`. Pair it with a visible error message.',
    },
    disabled: {
      control: 'boolean',
      description: 'Native `disabled`: the field cannot be focused and is not submitted.',
    },
    readOnly: {
      control: 'boolean',
      description:
        'Native `readonly`: the field stays focusable and is submitted, but cannot be edited.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '26rem' }}>
      <LabelledField label="Assembly notes" size={args.size}>
        {(fieldId) => <Textarea {...args} id={fieldId} />}
      </LabelledField>
    </div>
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
    const textarea = canvas.getByRole('textbox', { name: 'Assembly notes' });
    await expect(textarea).toHaveAttribute('rows', '4');
    await userEvent.type(textarea, 'Two people.');
    await expect(textarea).toHaveValue('Two people.');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <LabelledField label="Large" size="lg">
        {(fieldId) => (
          <Textarea id={fieldId} size="lg" rows={2} placeholder="lg padding and font" />
        )}
      </LabelledField>
      <LabelledField label="Medium" size="md">
        {(fieldId) => (
          <Textarea id={fieldId} size="md" rows={2} placeholder="md padding and font" />
        )}
      </LabelledField>
      <LabelledField label="Small" size="sm">
        {(fieldId) => (
          <Textarea id={fieldId} size="sm" rows={2} placeholder="sm padding and font" />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The field comes in 3 sizes, each with its own padding and font. Size `md` is the default standard size. Match the `Label` size to the field. Even with `rows={1}`, the box is never shorter than the `Button` next to it.',
      },
      source: {
        code: `<Label as="label" htmlFor="notes" size="lg">Assembly notes</Label>\n<Textarea id="notes" size="lg" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Large' })).toBeInTheDocument();
    await expect(canvas.getByRole('textbox', { name: 'Small' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Rows
 * --------------------------------------------------------------- */

export const WithRows: Story = {
  name: 'Rows and Limits',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <LabelledField label="Gate code">
        {(fieldId) => (
          <Textarea id={fieldId} rows={1} maxLength={40} placeholder="Building B, code 4821" />
        )}
      </LabelledField>
      <LabelledField label="Assembly notes">
        {(fieldId) => (
          <Textarea id={fieldId} rows={8} placeholder="Anything the assembly team should know" />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`rows` is the visible line count, so set it to the height the shortest useful answer needs. Cap the answer with `maxLength`, which stops the field accepting more characters, and say the limit in the hint: no browser shows a counter for you, so render one yourself and link it with `aria-describedby`.',
      },
      source: {
        code: `<Label as="label" htmlFor="gate-code">Gate code</Label>\n<Textarea id="gate-code" rows={1} maxLength={40} />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Gate code' })).toHaveAttribute('rows', '1');
    await expect(canvas.getByRole('textbox', { name: 'Assembly notes' })).toHaveAttribute(
      'rows',
      '8',
    );
  },
};

/* ---------------------------------------------------------------
 * Resize
 * --------------------------------------------------------------- */

export const WithResize: Story = {
  name: 'Resizing',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <LabelledField label="Vertical (default)">
        {(fieldId) => (
          <Textarea id={fieldId} resize="vertical" placeholder="Drag the bottom-right corner" />
        )}
      </LabelledField>
      <LabelledField label="None">
        {(fieldId) => <Textarea id={fieldId} resize="none" placeholder="Fixed height" />}
      </LabelledField>
      <LabelledField label="Both">
        {(fieldId) => (
          <Textarea id={fieldId} resize="both" placeholder="Drag any corner, width included" />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The resize grip sits in the bottom-right corner and is part of the native control. `vertical` is the default: people can make the field tall enough to read, and a drag can never widen it out of the column it sits in. Use `none` where the field grows on its own, and `both` only for a pane the person is meant to size, such as a notes panel.',
      },
      source: {
        code: `<Textarea resize="vertical" />\n<Textarea resize="none" />\n<Textarea resize="both" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'None' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Invalid
 * --------------------------------------------------------------- */

export const Invalid: Story = {
  render: () => (
    <div style={{ maxWidth: '26rem' }}>
      <LabelledField label="Delivery instructions">
        {(fieldId) => (
          <>
            <Textarea
              id={fieldId}
              invalid
              defaultValue="Gate code is"
              aria-describedby={`${fieldId}-error`}
            />
            <Text
              as="p"
              size="sm"
              id={`${fieldId}-error`}
              style={{ margin: 0, color: 'var(--ds-semantic-color-text-utility-error-base)' }}
            >
              Error: Add the gate code, such as 4821.
            </Text>
          </>
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `invalid` prop sets `aria-invalid="true"` and switches the border and focus halo to the error colour. The bare `Textarea` does not draw a message and cannot require one, so render it yourself and link it with `aria-describedby`, as here. In a form, use `TextareaField`: it draws the message, links it, and TypeScript requires an `error` whenever `invalid` is `true`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole('textbox', { name: 'Delivery instructions' });
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect(textarea).toHaveAccessibleDescription('Error: Add the gate code, such as 4821.');
  },
};

/* ---------------------------------------------------------------
 * Disabled and read-only
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled and Read-only',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <LabelledField label="Disabled">
        {(fieldId) => <Textarea id={fieldId} placeholder="No notes on this order" disabled />}
      </LabelledField>
      <LabelledField label="Read-only">
        {(fieldId) => (
          <Textarea id={fieldId} value="Delivered to the side entrance." readOnly rows={2} />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` field cannot be focused and is not submitted with the form. A `readOnly` field stays focusable and is submitted, but cannot be edited — use it to show an answer the person should read and copy but not change.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Disabled' })).toBeDisabled();
    await expect(canvas.getByRole('textbox', { name: 'Read-only' })).toHaveAttribute('readonly');
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <LabelledField label="Default">
        {(fieldId) => <Textarea id={fieldId} rows={2} placeholder="Default" />}
      </LabelledField>
      <LabelledField label="Hover">
        {(fieldId) => (
          <Textarea id={fieldId} rows={2} placeholder="Hover" className="pseudo-hover" />
        )}
      </LabelledField>
      <LabelledField label="Focus">
        {(fieldId) => (
          <Textarea id={fieldId} rows={2} placeholder="Focus" className="pseudo-focus" />
        )}
      </LabelledField>
      <LabelledField label="Invalid + focus">
        {(fieldId) => (
          <Textarea
            id={fieldId}
            rows={2}
            defaultValue="Gate code is"
            invalid
            className="pseudo-focus"
          />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states of the field using the `storybook-addon-pseudo-states` plugin. Unlike `Input`, the box is the element itself, so the focus style is drawn by `:focus`. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focus: ['.pseudo-focus'],
    },
  },
};
