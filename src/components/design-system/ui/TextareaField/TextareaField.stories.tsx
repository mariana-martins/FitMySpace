import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { FormEvent } from 'react';
import { Text } from '../Typography';
import { Button } from '../Button';
import { TextareaField } from './';
import { useState } from 'react';
import { useRef } from 'react';

const meta = {
  title: 'Design System/Components/Forms/TextareaField',
  component: TextareaField,
  tags: ['autodocs'],
  args: {
    label: 'Assembly notes',
    hint: 'Shown to the assembly team.',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `TextareaField` component is a `Textarea` with its label, hint and error message wired together for assistive technology: the label is a real `<label for>`, `aria-describedby` points at the hint and then the error, and `aria-invalid` is set when the value is wrong.\n\n' +
          '### Best Practices\n' +
          '- **Always use it for a labelled multi-line field:** `Textarea` on its own has no label. If the label, hint and error are not linked, the field fails WCAG 1.3.1 and 3.3.1.\n' +
          '- **One line, one field:** use `TextField` for anything that fits on a line. A multi-line box asks for an answer in sentences: delivery instructions, assembly notes, a room description.\n' +
          '- **Say what good looks like:** the `hint` is where the limit, the audience or the format belongs ("Up to 280 characters", "Shown to the assembly team").\n' +
          '- **Errors:** whenever `invalid` is `true`, pass an `error` message that names the field and says how to fix it. Validate on submit and move focus to the field.\n' +
          '- **Required fields:** pass `required` and say once above the form that an asterisk (*) marks a required field.\n\n' +
          '### Key Features\n' +
          '- **Composed, not configured** — `Label` + `Textarea` + hint + error, using the same box, sizes and states as `TextField`.\n' +
          '- **Sizes** — `sm`, `md`, `lg` drive the field and the label together, so they never drift apart.\n' +
          '- **Descriptions** — `aria-describedby` points to the hint, then the error, so a screen reader reads them in that order.\n' +
          '- **Errors** — TypeScript enforces a required `error` message whenever `invalid` is `true`. The message gets an icon, a screen-reader-only "Error:" prefix, and `aria-invalid` on the field.\n' +
          '- **Pass-through** — every other prop (`name`, `rows`, `maxLength`, `required`, `defaultValue`…) goes to the native `<textarea>`; `ref` points to it.',
      },
    },
  },
} satisfies Meta<typeof TextareaField>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Assembly notes',
    hint: 'Shown to the assembly team.',
    placeholder: 'e.g. Two people, start with the shelf',
    size: 'md',
    rows: 4,
    resize: 'vertical',
    invalid: false,
    required: false,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. Always shown, never replaced by the placeholder.',
    },
    hint: {
      control: 'text',
      description: 'Persistent help text below the field.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field invalid. Requires a descriptive `error` message (enforced by TypeScript).',
    },
    error: {
      control: 'text',
      description:
        'Error message, required when `invalid` is `true`. Marks the field invalid and is announced with it.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the field and its label. Defaults to `md`.',
    },
    rows: {
      control: { type: 'number', min: 1 },
      description: 'Visible lines. Defaults to `4`.',
    },
    resize: {
      control: { type: 'select' },
      options: ['none', 'vertical', 'both'],
      description: 'Whether the person can drag the field bigger. Defaults to `vertical`.',
    },
    required: {
      control: 'boolean',
      description: 'Sets the native `required` attribute and shows an asterisk.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and dims the label.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '26rem' }}>
      <TextareaField {...args} />
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
    await expect(textarea).toHaveAccessibleDescription('Shown to the assembly team.');
    await userEvent.type(textarea, 'Start with the shelf.');
    await expect(textarea).toHaveValue('Start with the shelf.');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <TextareaField label="Large" size="lg" rows={2} />
      <TextareaField label="Medium" size="md" rows={2} />
      <TextareaField label="Small" size="sm" rows={2} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The field comes in 3 sizes. The `size` prop drives the label and the field together, so a `lg` label never sits on top of a `sm` box. Size `md` is the default standard size.',
      },
      source: {
        code: `<TextareaField label="Large" size="lg" />\n<TextareaField label="Medium" size="md" />\n<TextareaField label="Small" size="sm" />`,
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
 * Required
 * --------------------------------------------------------------- */

export const Required: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <Text size="sm" style={{ margin: 0 }}>
        Fields marked with an asterisk (*) are required.
      </Text>
      <TextareaField
        label="Delivery instructions"
        hint="The courier reads this on the way."
        required
        rows={2}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`required` sets the native attribute, so an empty field blocks a native submit, and adds an asterisk that assistive technology ignores because the field already says it is required. Say once above the form what the asterisk means.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Delivery instructions' })).toBeRequired();
    await expect(canvas.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <TextareaField
        label="Delivery instructions"
        hint="Up to 280 characters."
        invalid
        error="Tell us how the courier gets in, in 280 characters or fewer."
        defaultValue="Gate code 4821, then the second door on the left, past the bike room, and leave it with"
      />
      <TextareaField
        label="Assembly notes"
        invalid
        error="Add at least one note so the assembly team can prepare."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `invalid` is `true`, TypeScript requires an `error` message. The field takes the error border, and screen readers read the hint first and then the message, each prefixed with a spoken "Error:". The icon and the words carry the problem too, so it never depends on colour alone.',
      },
      source: {
        code: `<TextareaField\n  label="Delivery instructions"\n  hint="Up to 280 characters."\n  invalid\n  error="Tell us how the courier gets in, in 280 characters or fewer."\n/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const instructions = canvas.getByRole('textbox', { name: 'Delivery instructions' });
    await expect(instructions).toHaveAttribute('aria-invalid', 'true');
    await expect(instructions).toHaveAccessibleDescription(
      'Up to 280 characters. Error: Tell us how the courier gets in, in 280 characters or fewer.',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled and read-only
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled and Read-only',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <TextareaField label="Assembly notes" disabled rows={2} />
      <TextareaField
        label="Saved note"
        readOnly
        rows={2}
        value="Delivered to the side entrance, please fold the boxes flat."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` field dims its label, cannot be focused and is not submitted. A `readOnly` field keeps its label at full strength, stays focusable and is submitted, but cannot be edited. Explain nearby why a field is unavailable.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Assembly notes' })).toBeDisabled();
    await expect(canvas.getByRole('textbox', { name: 'Saved note' })).toHaveAttribute('readonly');
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}>
      <TextareaField label="Default" rows={2} />
      <TextareaField label="Hover" rows={2} textareaClassName="pseudo-hover" />
      <TextareaField label="Focus" rows={2} textareaClassName="pseudo-focus" />
      <TextareaField
        label="Invalid and focused"
        rows={2}
        invalid
        error="Add the gate code so the courier gets in."
        textareaClassName="pseudo-focus"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states using the `storybook-addon-pseudo-states` plugin, through `textareaClassName` because the box is the `<textarea>` itself. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focus: ['.pseudo-focus'],
    },
  },
};

/* ---------------------------------------------------------------
 * Form example (recipe)
 * --------------------------------------------------------------- */

const NOTES_ERROR = 'Add a note so the assembly team can prepare.';

function RoomOrderForm() {
  const [notesError, setNotesError] = useState<string | null>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const notes = new FormData(event.currentTarget).get('notes');
    const hasNotes = typeof notes === 'string' && notes.trim().length > 0;
    setNotesError(hasNotes ? null : NOTES_ERROR);
    if (!hasNotes) notesRef.current?.focus();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Order"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '26rem' }}
    >
      <Text size="sm" style={{ margin: 0 }}>
        Fields marked with an asterisk (*) are required.
      </Text>
      <TextareaField
        ref={notesRef}
        name="notes"
        label="Assembly notes"
        hint="Anything the assembly team should know."
        required
        {...(notesError ? { invalid: true, error: notesError } : { invalid: false })}
      />
      <div>
        <Button variant="primary" appearance="fill" size="lg" type="submit">
          Place order
        </Button>
      </div>
    </form>
  );
}

export const FormExample: Story = {
  name: 'Form Example (A11y)',
  render: () => <RoomOrderForm />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe composing `TextareaField` and `Button`. Validation runs on submit: an empty required field gets an error that says how to fix it, and focus moves to the field so a keyboard and screen-reader user lands on the problem. Because the field is a native `<textarea>`, the same form works with a Next.js Server Action and no client JavaScript.',
      },
      source: {
        code: `<form noValidate onSubmit={handleSubmit}>\n  <Text size="sm">Fields marked with an asterisk (*) are required.</Text>\n  <TextareaField\n    ref={notesRef}\n    name="notes"\n    label="Assembly notes"\n    hint="Anything the assembly team should know."\n    required\n    {...(notesError ? { invalid: true, error: notesError } : { invalid: false })}\n  />\n  <Button variant="primary" appearance="fill" size="lg" type="submit">Place order</Button>\n</form>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    const notes = canvas.getByRole('textbox', { name: 'Assembly notes' });
    await expect(notes).toHaveFocus();
    await expect(notes).toHaveAttribute('aria-invalid', 'true');

    await userEvent.type(notes, 'Two people, start with the shelf.');
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    await expect(notes).not.toHaveAttribute('aria-invalid');
  },
};
