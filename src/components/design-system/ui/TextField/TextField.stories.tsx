import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Mail, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '../Button';
import { useState } from 'react';
import { TextField } from './';

const meta = {
  title: 'Design System/Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: {
    label: 'Room name',
    hint: 'Shown on your saved rooms.',
    placeholder: 'e.g. Living room',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `TextField` component is the default form field: a visible `label`, the `Input`, an optional `hint` and an `error` message required whenever `invalid` is `true`, all linked for assistive technology.\n\n' +
          '### Best Practices\n' +
          '- **Always label:** The label stays visible. Never use the placeholder as the label.\n' +
          '- **Hints:** Use them for format and context ("Measure wall to wall"), not to repeat the label.\n' +
          '- **Errors:** Whenever `invalid` is `true`, pass a descriptive `error` message that names the field and says how to fix it — "Enter the room width in centimetres", not "Invalid value". Set it after validation, not while the user is still typing.\n' +
          "- **Validation:** Validate on submit, then move focus to the first invalid field. Add `noValidate` to the `<form>` so the browser's own bubbles do not appear.\n" +
          '- **Input type:** Use the right `type` and `autoComplete` (`email`, `tel`, `given-name`…) so mobile keyboards and autofill help the user.\n\n' +
          '### Key Features\n' +
          '- **Label** — a real `<label for>` built from the Typography `Label` (powered by Radix `Label`), scaled with the field size.\n' +
          '- **Descriptions** — `aria-describedby` points to the hint, then the error, then the unit, read in that order.\n' +
          '- **Errors** — TypeScript enforces a required `error` message whenever `invalid` is `true`. Sets `aria-invalid` and prefixes the message with a screen-reader-only "Error:". No live region, because focus moves to the field on submit.\n' +
          '- **Required** — `required` sets the native attribute and shows a decorative asterisk.\n' +
          '- **Pass-through** — every other prop (`name`, `type`, `onChange`, `unit`, icons…) goes to the `Input`; `ref` points to the `<input>`.',
      },
    },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Room name',
    hint: 'Shown on your saved rooms.',
    placeholder: 'e.g. Living room',
    size: 'md',
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
    unit: {
      control: 'text',
      description: 'Unit shown after the value, e.g. `cm`.',
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
    <div style={{ maxWidth: '22rem' }}>
      <TextField {...args} />
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
    const input = canvas.getByRole('textbox', { name: 'Room name' });
    await expect(input).toHaveAccessibleDescription('Shown on your saved rooms.');
    await userEvent.type(input, 'Studio');
    await expect(input).toHaveValue('Studio');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}>
      <TextField size="lg" label="Large" placeholder="56px field" />
      <TextField size="md" label="Medium" placeholder="48px field" />
      <TextField size="sm" label="Small" placeholder="40px field" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The text field comes in 3 sizes. The label scales with the field (`Label` sm / md / lg). Size `md` is the default standard size.',
      },
      source: {
        code: `<TextField size="lg" label="Large" />\n<TextField size="md" label="Medium" />\n<TextField size="sm" label="Small" />`,
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
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        iconStart={<Mail />}
        placeholder="you@example.com"
      />
      <TextField
        label="Search furniture"
        type="search"
        iconStart={<Search />}
        placeholder="Sofa, desk, shelf…"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Icons are passed straight to the `Input`. They are decorative and hidden from screen readers; the label gives the field its name.',
      },
      source: {
        code: `<TextField label="Email" type="email" autoComplete="email" iconStart={<Mail />} />`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Required
 * --------------------------------------------------------------- */

export const Required: Story = {
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <TextField label="Room width" type="number" inputMode="decimal" unit="cm" required />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `required` prop sets the native `required` attribute, which screen readers announce. The asterisk is decorative and hidden from them, so "required" is not read twice.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('spinbutton', { name: 'Room width' })).toBeRequired();
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <TextField
        label="Room depth"
        type="number"
        inputMode="decimal"
        unit="cm"
        defaultValue={-40}
        hint="Measure wall to wall."
        invalid
        error="Enter a room depth above 0 cm."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `invalid` is `true`, TypeScript requires an `error` message. The field is marked invalid and the message is linked to it; screen readers read the hint first, then the error, then the unit.',
      },
      source: {
        code: `<TextField\n  label="Room depth"\n  type="number"\n  inputMode="decimal"\n  unit="cm"\n  defaultValue={-40}\n  hint="Measure wall to wall."\n  invalid\n  error="Enter a room depth above 0 cm."\n/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const depth = canvas.getByRole('spinbutton', { name: 'Room depth' });
    await expect(depth).toHaveAttribute('aria-invalid', 'true');
    await expect(depth).toHaveAccessibleDescription(
      'Measure wall to wall. Error: Enter a room depth above 0 cm. cm',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled and read-only
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled and Read-only',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}>
      <TextField
        label="Ceiling height"
        unit="cm"
        hint="Available after you add the room width."
        disabled
      />
      <TextField label="Saved on" defaultValue="5 November 2026" readOnly />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` field dims its label and cannot be focused. A `readOnly` field stays focusable and readable. Do not combine `required` with `disabled`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Ceiling height' })).toBeDisabled();
    await expect(canvas.getByRole('textbox', { name: 'Saved on' })).toHaveAttribute('readonly');
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}>
      <TextField label="Default" placeholder="e.g. Living room" />
      <TextField label="Hover" placeholder="e.g. Living room" inputClassName="pseudo-hover" />
      <TextField
        label="Focus"
        placeholder="e.g. Living room"
        inputClassName="pseudo-focus-within"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states of the field using the `storybook-addon-pseudo-states` plugin. `inputClassName` targets the field box. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusWithin: ['.pseudo-focus-within'],
    },
  },
};

/* ---------------------------------------------------------------
 * Form example (recipe)
 * --------------------------------------------------------------- */

const ROOM_DIMENSIONS = [
  { name: 'width', label: 'Width' },
  { name: 'depth', label: 'Depth' },
  { name: 'height', label: 'Ceiling height' },
] as const;

type DimensionName = (typeof ROOM_DIMENSIONS)[number]['name'];

function RoomDimensionsForm() {
  const [errors, setErrors] = useState<Partial<Record<DimensionName, string>>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Partial<Record<DimensionName, string>> = {};

    for (const dimension of ROOM_DIMENSIONS) {
      const value = Number(formData.get(dimension.name));
      if (!value || value <= 0) {
        nextErrors[dimension.name] = `Enter the ${dimension.label.toLowerCase()} in centimetres.`;
      }
    }

    setErrors(nextErrors);

    const firstInvalid = ROOM_DIMENSIONS.find((dimension) => nextErrors[dimension.name]);
    if (firstInvalid) {
      form.querySelector<HTMLInputElement>(`[name="${firstInvalid.name}"]`)?.focus();
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Room dimensions"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}
    >
      {ROOM_DIMENSIONS.map((dimension) => {
        const errorMessage = errors[dimension.name];
        return (
          <TextField
            key={dimension.name}
            name={dimension.name}
            label={dimension.label}
            type="number"
            inputMode="decimal"
            unit="cm"
            required
            {...(errorMessage ? { invalid: true, error: errorMessage } : { invalid: false })}
          />
        );
      })}
      <div>
        <Button variant="primary" appearance="fill" size="lg" type="submit">
          Save room
        </Button>
      </div>
    </form>
  );
}

export const FormExample: Story = {
  name: 'Form Example (A11y)',
  render: () => <RoomDimensionsForm />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe composing `TextField` and `Button`. Validation runs on submit, each error names the field and how to fix it, and focus moves to the first invalid field.',
      },
      source: {
        code: `<form noValidate onSubmit={handleSubmit}>\n  <TextField\n    name="width"\n    label="Width"\n    type="number"\n    unit="cm"\n    required\n    {...(errors.width ? { invalid: true, error: errors.width } : { invalid: false })}\n  />\n  <Button variant="primary" appearance="fill" size="lg" type="submit">Save room</Button>\n</form>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('spinbutton', { name: 'Width' }), '320');
    await userEvent.click(canvas.getByRole('button', { name: 'Save room' }));
    const depth = canvas.getByRole('spinbutton', { name: 'Depth' });
    await expect(depth).toHaveFocus();
    await expect(depth).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('spinbutton', { name: 'Width' })).not.toHaveAttribute(
      'aria-invalid',
    );
  },
};
