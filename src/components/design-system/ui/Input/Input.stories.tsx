import { Search, Mail, Ruler, Eye, EyeOff } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { LabelledField } from '../../docs';
import { Text } from '../Typography';
import { Button } from '../Button';
import { useState } from 'react';
import { Input } from './';

const meta = {
  title: 'Design System/Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'e.g. Living room',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Input` component is the bare text field: the box, its states and its adornments. It has **no visible label** of its own and is driven by the tier-3 `input` component tokens. Every example below gives it one, because a form control always needs a visible label.\n\n' +
          '### Best Practices\n' +
          '- **Form fields:** Use `TextField` instead. It adds the visible label, hint and error message and wires them for assistive technology.\n' +
          '- **Standalone use:** Use `Input` directly only for layouts `TextField` does not cover, and still tie it to visible text: a `<Label as="label" htmlFor>` or `aria-labelledby` pointing at a visible heading. Never rely on `aria-label` or the placeholder alone: the placeholder disappears once people type.\n' +
          '- **Errors:** Always pair `invalid` with a visible message linked through `aria-describedby`. Colour alone never conveys the error.\n' +
          '- **Input type:** Pick the right `type`, `inputMode` and `autoComplete` so mobile keyboards and autofill help the user.\n' +
          '- **Numbers:** For measurements and other numbers, keep the default text type and set `inputMode="decimal"` (or `"numeric"`). Avoid `type="number"`: it accepts letters such as "e", changes the value on mouse scroll and returns an empty value when the input is invalid.\n\n' +
          '### Key Features\n' +
          '- **3 sizes** (`sm` 40px, `md` 48px, `lg` 56px) with token-driven height, padding, font and icon sizing.\n' +
          '- **Focus** — the border turns sage, thickens and gains a soft halo, so the change is visible without relying on colour alone.\n' +
          '- **States** — `invalid`, `disabled` and `readOnly`, all mapped to native attributes.\n' +
          '- **Adornments** — decorative `iconStart` / `iconEnd`, a `unit` suffix (e.g. `cm`) that is also announced to screen readers, and an interactive `endAction` slot.\n' +
          '- **Native first** — the real `<input>` keeps autofill, mobile keyboards and spellcheck; `ref` points to it.',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    placeholder: 'e.g. Living room',
    size: 'md',
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
    unit: {
      control: 'text',
      description:
        'Unit shown after the value, e.g. `cm`. Also added to the accessible description.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '20rem' }}>
      <LabelledField label="Room name" size={args.size}>
        {(fieldId) => <Input {...args} id={fieldId} />}
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
    const input = canvas.getByRole('textbox', { name: 'Room name' });
    await expect(input).toHaveAttribute('type', 'text');
    await userEvent.type(input, 'Living room');
    await expect(input).toHaveValue('Living room');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
      <LabelledField label="Large" size="lg">
        {(fieldId) => <Input id={fieldId} size="lg" placeholder="56px field" />}
      </LabelledField>
      <LabelledField label="Medium" size="md">
        {(fieldId) => <Input id={fieldId} size="md" placeholder="48px field" />}
      </LabelledField>
      <LabelledField label="Small" size="sm">
        {(fieldId) => <Input id={fieldId} size="sm" placeholder="40px field" />}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The input comes in 3 sizes, 56, 48 and 40px tall. Size `md` is the default standard size. Use `lg` for prominent fields such as a hero search, and `sm` for dense layouts such as filters. Match the `Label` size to the field.',
      },
      source: {
        code: `<Label as="label" htmlFor="room-name" size="lg">Room name</Label>\n<Input id="room-name" size="lg" />`,
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
      <LabelledField label="Search furniture">
        {(fieldId) => (
          <Input
            id={fieldId}
            type="search"
            iconStart={<Search />}
            placeholder="Sofa, desk, shelf…"
          />
        )}
      </LabelledField>
      <LabelledField label="Email">
        {(fieldId) => (
          <Input
            id={fieldId}
            type="email"
            autoComplete="email"
            iconStart={<Mail />}
            placeholder="you@example.com"
          />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icons can be added to the start (`iconStart`) or end (`iconEnd`) of the field. They are decorative, hidden from screen readers, and sized by the field's size token. An icon never replaces the visible label.",
      },
      source: {
        code: `<Label as="label" htmlFor="search-furniture">Search furniture</Label>\n<Input id="search-furniture" type="search" iconStart={<Search />} />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const search = canvas.getByRole('searchbox', { name: 'Search furniture' });
    await expect(search).not.toHaveAccessibleDescription();
  },
};

/* ---------------------------------------------------------------
 * With unit
 * --------------------------------------------------------------- */

export const WithUnit: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
      <LabelledField label="Width">
        {(fieldId) => (
          <Input id={fieldId} inputMode="decimal" unit="cm" iconStart={<Ruler />} placeholder="0" />
        )}
      </LabelledField>
      <LabelledField label="Depth">
        {(fieldId) => <Input id={fieldId} inputMode="decimal" unit="cm" defaultValue={240} />}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `unit` sits after a hairline divider, with aligned digits. It is part of the accessible description, so a screen reader announces "Depth, 240, cm". For measurements, keep the default text type and set `inputMode="decimal"`: mobile keyboards show digits, and the field avoids the known problems of `type="number"`.',
      },
      source: {
        code: `<Label as="label" htmlFor="depth">Depth</Label>\n<Input id="depth" inputMode="decimal" unit="cm" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Depth' })).toHaveAccessibleDescription('cm');
  },
};

/* ---------------------------------------------------------------
 * With end action
 * --------------------------------------------------------------- */

function PasswordWithToggle() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <div style={{ maxWidth: '20rem' }}>
      <LabelledField label="Password">
        {(fieldId) => (
          <Input
            id={fieldId}
            type={isPasswordVisible ? 'text' : 'password'}
            autoComplete="current-password"
            defaultValue="sofa-and-shelves"
            endAction={
              <Button
                variant="secondary"
                appearance="ghost"
                size="xs"
                icon={isPasswordVisible ? <EyeOff /> : <Eye />}
                aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
              />
            }
          />
        )}
      </LabelledField>
    </div>
  );
}

export const WithEndAction: Story = {
  render: () => <PasswordWithToggle />,
  parameters: {
    docs: {
      description: {
        story:
          'Use `endAction` for an interactive control inside the field, such as "Show password" or "Clear search". ' +
          'Unlike `iconStart` / `iconEnd`, it stays visible to screen readers, receives its own clicks and follows the input in the Tab order. Give it its own accessible name.',
      },
      source: {
        code: `<Label as="label" htmlFor="password">Password</Label>\n<Input\n  id="password"\n  type={isPasswordVisible ? 'text' : 'password'}\n  endAction={\n    <Button\n      variant="secondary"\n      appearance="ghost"\n      size="xs"\n      icon={isPasswordVisible ? <EyeOff /> : <Eye />}\n      aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}\n      onClick={togglePasswordVisibility}\n    />\n  }\n/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const password = canvas.getByLabelText('Password');
    await expect(password).toHaveAttribute('type', 'password');
    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
    await expect(password).toHaveAttribute('type', 'text');
    await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Invalid
 * --------------------------------------------------------------- */

export const Invalid: Story = {
  render: () => (
    <div style={{ maxWidth: '20rem' }}>
      <LabelledField label="Room depth">
        {(fieldId) => (
          <>
            <Input
              id={fieldId}
              inputMode="decimal"
              unit="cm"
              defaultValue={-40}
              invalid
              aria-describedby={`${fieldId}-error`}
            />
            <Text
              as="p"
              size="sm"
              id={`${fieldId}-error`}
              style={{ margin: 0, color: 'var(--ds-semantic-color-text-utility-error-base)' }}
            >
              Error: Enter a depth of at least 1 cm.
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
          'The `invalid` prop sets `aria-invalid="true"` and switches the border and focus halo to the error colour. Set it only after validation. The bare `Input` does not draw a message and cannot require one, so render it yourself and link it with `aria-describedby`, as here; the unit is added to the description after it. In a form, use `TextField`: it draws the message, links it, and TypeScript requires an `error` whenever `invalid` is `true`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Room depth' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Error: Enter a depth of at least 1 cm. cm');
  },
};

/* ---------------------------------------------------------------
 * Disabled and read-only
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled and Read-only',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
      <LabelledField label="Disabled">
        {(fieldId) => <Input id={fieldId} placeholder="Disabled" disabled />}
      </LabelledField>
      <LabelledField label="Disabled with unit">
        {(fieldId) => <Input id={fieldId} unit="cm" disabled />}
      </LabelledField>
      <LabelledField label="Read-only">
        {(fieldId) => <Input id={fieldId} value="320" unit="cm" readOnly />}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` field cannot be focused and is not submitted with the form. A `readOnly` field stays focusable and is submitted, but cannot be edited — use it to show a value the user should see but not change.',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
      <LabelledField label="Default">
        {(fieldId) => <Input id={fieldId} placeholder="Default" />}
      </LabelledField>
      <LabelledField label="Hover">
        {(fieldId) => <Input id={fieldId} placeholder="Hover" className="pseudo-hover" />}
      </LabelledField>
      <LabelledField label="Focus">
        {(fieldId) => <Input id={fieldId} placeholder="Focus" className="pseudo-focus-within" />}
      </LabelledField>
      <LabelledField label="Invalid + focus">
        {(fieldId) => (
          <Input id={fieldId} defaultValue="-40" invalid className="pseudo-focus-within" />
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states of the input using the `storybook-addon-pseudo-states` plugin. The focus style is drawn by `:focus-within` on the field box. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusWithin: ['.pseudo-focus-within'],
    },
  },
};
