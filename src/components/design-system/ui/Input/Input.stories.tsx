import { Search, Mail, Ruler, Eye, EyeOff } from 'lucide-react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button';
import { useState } from 'react';
import { Input } from './';

const meta = {
  title: 'Design System/Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Room name',
    placeholder: 'e.g. Living room',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Input` component is the bare text field: the box, its states and its adornments. It has **no visible label** of its own and is driven by the tier-3 `input` component tokens.\n\n' +
          '### Best Practices\n' +
          '- **Form fields:** Use `TextField` instead. It adds the visible label, hint and error message and wires them for assistive technology.\n' +
          '- **Standalone use:** Use `Input` directly only when the accessible name comes from elsewhere, such as a search box with `aria-label`.\n' +
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
    'aria-label': 'Room name',
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
      <Input {...args} />
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
      <Input aria-label="Large" size="lg" placeholder="Large" />
      <Input aria-label="Medium" size="md" placeholder="Medium" />
      <Input aria-label="Small" size="sm" placeholder="Small" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The input comes in 3 sizes. Size `md` is the default standard size. Use `lg` for prominent fields such as a hero search, and `sm` for dense layouts such as filters.',
      },
      source: {
        code: `<Input aria-label="Large" size="lg" />\n<Input aria-label="Medium" size="md" />\n<Input aria-label="Small" size="sm" />`,
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
      <Input
        aria-label="Search furniture"
        type="search"
        iconStart={<Search />}
        placeholder="Sofa, desk, shelf…"
      />
      <Input
        aria-label="Email"
        type="email"
        autoComplete="email"
        iconStart={<Mail />}
        placeholder="you@example.com"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icons can be added to the start (`iconStart`) or end (`iconEnd`) of the field. They are decorative, hidden from screen readers, and sized by the field's size token. The field still needs an accessible name.",
      },
      source: {
        code: `<Input aria-label="Search furniture" type="search" iconStart={<Search />} />`,
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
      <Input
        aria-label="Width"
        inputMode="decimal"
        unit="cm"
        iconStart={<Ruler />}
        placeholder="0"
      />
      <Input aria-label="Depth" inputMode="decimal" unit="cm" defaultValue={240} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `unit` sits after a hairline divider, with aligned digits. It is part of the accessible description, so a screen reader announces "Depth, 240, cm". For measurements, keep the default text type and set `inputMode="decimal"`: mobile keyboards show digits, and the field avoids the known problems of `type="number"`.',
      },
      source: {
        code: `<Input aria-label="Depth" inputMode="decimal" unit="cm" />`,
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
      <Input
        aria-label="Password"
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
        code: `<Input\n  aria-label="Password"\n  type={isPasswordVisible ? 'text' : 'password'}\n  endAction={\n    <Button\n      variant="secondary"\n      appearance="ghost"\n      size="xs"\n      icon={isPasswordVisible ? <EyeOff /> : <Eye />}\n      aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}\n      onClick={togglePasswordVisibility}\n    />\n  }\n/>`,
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
      <Input aria-label="Room depth" inputMode="decimal" unit="cm" defaultValue={-40} invalid />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `invalid` prop sets `aria-invalid="true"` and switches the border and focus halo to the error colour. Set it only after validation, and always show a message — `TextField` does both for you.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Room depth' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled and read-only
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled and Read-only',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '20rem' }}>
      <Input aria-label="Disabled" placeholder="Disabled" disabled />
      <Input aria-label="Disabled with unit" unit="cm" disabled />
      <Input aria-label="Read-only" value="320" unit="cm" readOnly />
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
      <Input aria-label="Default" placeholder="Default" />
      <Input aria-label="Hover" placeholder="Hover" className="pseudo-hover" />
      <Input aria-label="Focus" placeholder="Focus" className="pseudo-focus-within" />
      <Input
        aria-label="Invalid focus"
        defaultValue="Invalid + focus"
        invalid
        className="pseudo-focus-within"
      />
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
