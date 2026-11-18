import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TextareaField } from '../../ui/TextareaField';
import { SelectField } from '../../ui/SelectField';
import type { FormEvent, MouseEvent } from 'react';
import { TextField } from '../../ui/TextField';
import { Checkbox } from '../../ui/Checkbox';
import { SelectItem } from '../../ui/Select';
import { Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';
import { Alert } from '../../ui/Alert';
import { formText } from '../../docs';
import { Link } from '../../ui/Link';

/* ---------------------------------------------------------------
 * Form validation (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Tasks/Form Validation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A form long enough to need a list of what went wrong: each field says its own error, and a summary at the top lists every error with a link to its field.\n\n' +
          '### When to Use\n' +
          '- **A form with more than a few fields**, where an error can sit below the fold: adding a room with its measurements, a delivery address.\n' +
          '- **Not for:** one or two fields (the field error alone is enough), or settings that apply the moment they change (see Preferences).\n\n' +
          '### Anatomy\n' +
          '- A line that explains the asterisk, above the first field.\n' +
          '- The error summary — an `Alert` (`error`, `live="off"`) with a heading that counts the problems and one `Link` per error. It only exists after a failed submit.\n' +
          '- The fields — `TextField`, `SelectField`, `RadioGroup`, `TextareaField` and `Checkbox`, each with its own `invalid` and `error`.\n' +
          '- One submit `Button` at the end.\n' +
          '- After a successful submit, an `Alert` (`success`) in the same place says what was saved.\n\n' +
          '### Accessibility\n' +
          '- **Validate on submit, not while typing:** an error that appears before people finish is noise.\n' +
          '- **Focus moves to the summary** after a failed submit. It is not a live region: focus reads it once, and a live region on top would read it twice.\n' +
          '- **Each link focuses its field**, and each error says the field and how to fix it ("Enter the width in centimetres, from 30 to 2000"), so the summary makes sense read on its own.\n' +
          '- **The field errors stay** under each field, linked with `aria-describedby`, for people who reach the field by Tab instead of the link.\n' +
          '- **Required fields** carry the asterisk in their label and `required`; the line above the form says what it means.\n\n' +
          '### In the App\n' +
          '- Validate with the same Zod schema the server uses, and map its issues to `{ field, message }` in field order. The order of the summary is the order of the form.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* Field ids double as the targets of the summary links. */
const FIELD_IDS = {
  name: 'room-name',
  type: 'room-type',
  width: 'room-width',
  depth: 'room-depth',
  height: 'room-height',
  storage: 'room-storage',
  notes: 'room-notes',
} as const;

type FieldName = keyof typeof FIELD_IDS;
type FieldErrors = Partial<Record<FieldName, string>>;

const MEASUREMENTS = [
  { name: 'width', label: 'Width' },
  { name: 'depth', label: 'Depth' },
  { name: 'height', label: 'Ceiling height' },
] as const;

const SMALLEST_MEASUREMENT_CM = 30;
const LARGEST_MEASUREMENT_CM = 2000;
const NOTES_MAX_LENGTH = 280;

function measurementError(label: string, rawValue: string) {
  const value = Number(rawValue);
  if (rawValue.trim() === '') {
    return `Enter the ${label.toLowerCase()} in centimetres.`;
  }
  if (
    !Number.isFinite(value) ||
    value < SMALLEST_MEASUREMENT_CM ||
    value > LARGEST_MEASUREMENT_CM
  ) {
    return `Enter the ${label.toLowerCase()} in centimetres, from ${SMALLEST_MEASUREMENT_CM} to ${LARGEST_MEASUREMENT_CM}.`;
  }
  return undefined;
}

/** Checks every field in form order, so the summary lists the errors as the form shows them. */
function validateRoom(formData: FormData): FieldErrors {
  const errors: FieldErrors = {};
  if (!formText(formData, 'name').trim()) errors.name = 'Enter a name for the room.';
  if (!formText(formData, 'type')) errors.type = 'Choose the type of room.';
  for (const measurement of MEASUREMENTS) {
    const error = measurementError(measurement.label, formText(formData, measurement.name));
    if (error) errors[measurement.name] = error;
  }
  if (!formText(formData, 'storage')) errors.storage = 'Choose what you need to store in the room.';
  if (formText(formData, 'notes').length > NOTES_MAX_LENGTH) {
    errors.notes = `Shorten the notes to ${NOTES_MAX_LENGTH} characters or fewer.`;
  }
  return errors;
}

/** Moves focus to a field from the summary. A radio group takes it on its first option. */
function focusField(fieldName: FieldName) {
  const field = document.getElementById(FIELD_IDS[fieldName]);
  const target =
    field?.getAttribute('role') === 'radiogroup' ? field.querySelector('button') : field;
  target?.focus();
  target?.scrollIntoView({ block: 'center' });
}

function errorProps(message: string | undefined) {
  return message ? { invalid: true as const, error: message } : { invalid: false as const };
}

function AddRoomForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [savedRoom, setSavedRoom] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const errorEntries = Object.entries(errors) as [FieldName, string][];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validateRoom(formData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSavedRoom(null);
      // The summary renders with the new errors first; focus it on the next frame.
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const size = MEASUREMENTS.map((measurement) => formText(formData, measurement.name)).join(
      ' × ',
    );
    setSavedRoom(`${formText(formData, 'name').trim()}, ${size} cm`);
  }

  function handleSummaryLinkClick(fieldName: FieldName) {
    return (event: MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      focusField(fieldName);
    };
  }

  return (
    <form
      noValidate
      aria-label="Add a room"
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '28rem',
        maxWidth: '100%',
      }}
    >
      {errorEntries.length > 0 && (
        <Alert
          ref={summaryRef}
          variant="error"
          live="off"
          tabIndex={-1}
          headingLevel={2}
          title={
            errorEntries.length === 1
              ? 'There is a problem with this room'
              : `There are ${errorEntries.length} problems with this room`
          }
        >
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              margin: 0,
              padding: 0,
              listStyle: 'none',
            }}
          >
            {errorEntries.map(([fieldName, message]) => (
              <li key={fieldName}>
                <Link href={`#${FIELD_IDS[fieldName]}`} onClick={handleSummaryLinkClick(fieldName)}>
                  {message}
                </Link>
              </li>
            ))}
          </ul>
        </Alert>
      )}

      {savedRoom && (
        <Alert variant="success" headingLevel={2} title="Room saved">
          {savedRoom}
        </Alert>
      )}

      <Text size="sm" style={{ margin: 0 }}>
        Fields marked with an asterisk (*) are required.
      </Text>

      <TextField
        id={FIELD_IDS.name}
        name="name"
        label="Room name"
        required
        {...errorProps(errors.name)}
      />

      <SelectField
        id={FIELD_IDS.type}
        name="type"
        label="Type of room"
        placeholder="Choose a type"
        required
        {...errorProps(errors.type)}
      >
        <SelectItem value="bathroom">Bathroom</SelectItem>
        <SelectItem value="bedroom">Bedroom</SelectItem>
        <SelectItem value="kitchen">Kitchen</SelectItem>
        <SelectItem value="laundry">Laundry</SelectItem>
        <SelectItem value="living-room">Living room</SelectItem>
      </SelectField>

      {MEASUREMENTS.map((measurement) => (
        <TextField
          key={measurement.name}
          id={FIELD_IDS[measurement.name]}
          name={measurement.name}
          label={measurement.label}
          hint="Measure wall to wall, at floor height."
          inputMode="decimal"
          unit="cm"
          required
          {...errorProps(errors[measurement.name])}
        />
      ))}

      <RadioGroup
        id={FIELD_IDS.storage}
        name="storage"
        label="What do you need to store?"
        required
        {...errorProps(errors.storage)}
      >
        <RadioGroupItem value="toiletries" label="Towels and toiletries" />
        <RadioGroupItem value="clothes" label="Clothes and shoes" />
        <RadioGroupItem value="pantry" label="Food and kitchenware" />
        <RadioGroupItem value="mixed" label="A bit of everything" />
      </RadioGroup>

      <TextareaField
        id={FIELD_IDS.notes}
        name="notes"
        label="Notes"
        hint={`Anything that limits what fits, such as a radiator. Up to ${NOTES_MAX_LENGTH} characters.`}
        rows={3}
        {...errorProps(errors.notes)}
      />

      <Checkbox
        name="filter"
        label="Use this room to filter search results"
        hint="Only products that fit it are shown."
        defaultChecked
      />

      <div>
        <Button variant="primary" appearance="fill" size="lg" type="submit">
          Save room
        </Button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------
 * Form validation
 * --------------------------------------------------------------- */

export const FormValidation: Story = {
  name: 'Form Validation (A11y)',
  render: () => <AddRoomForm />,
  parameters: {
    docs: {
      description: {
        story:
          'Press "Save room" with the form empty: the summary appears above the form and takes the focus, and each link in it jumps to its field. Fill everything in and save again to see the confirmation in the same place.',
      },
      source: {
        code: `{errors.length > 0 && (
  <Alert
    ref={summaryRef}
    variant="error"
    live="off"
    tabIndex={-1}
    headingLevel={2}
    title={\`There are \${errors.length} problems with this room\`}
  >
    <ul>
      {errors.map(({ field, message }) => (
        <li key={field}>
          <Link href={\`#\${fieldIds[field]}\`} onClick={focusField(field)}>{message}</Link>
        </li>
      ))}
    </ul>
  </Alert>
)}

<Text size="sm">Fields marked with an asterisk (*) are required.</Text>
<TextField
  id="room-name"
  name="name"
  label="Room name"
  required
  {...(fieldErrors.name ? { invalid: true, error: fieldErrors.name } : { invalid: false })}
/>
{/* …the other fields, each with its own id, invalid and error */}
<Button variant="primary" appearance="fill" size="lg" type="submit">Save room</Button>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText('Fields marked with an asterisk (*) are required.'),
    ).toBeVisible();
    // No summary until a failed submit.
    await expect(canvas.queryByRole('heading', { name: /problem/ })).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Form Validation (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const FormValidationInteraction: Story = {
  ...FormValidation,
  name: 'Form Validation (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('textbox', { name: 'Room name' }), 'Study');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Width' }), '320');
    await userEvent.type(canvas.getByRole('textbox', { name: 'Depth' }), '12');
    await userEvent.click(canvas.getByRole('button', { name: 'Save room' }));

    // Type, depth, ceiling height and storage are missing or out of range.
    const summaryHeading = await canvas.findByRole('heading', {
      name: 'There are 4 problems with this room',
    });
    await expect(summaryHeading.closest('[tabindex="-1"]')).toHaveFocus();

    const depthLink = canvas.getByRole('link', {
      name: 'Enter the depth in centimetres, from 30 to 2000.',
    });
    await userEvent.click(depthLink);
    const depth = canvas.getByRole('textbox', { name: 'Depth' });
    await expect(depth).toHaveFocus();
    await expect(depth).toHaveAttribute('aria-invalid', 'true');

    await userEvent.click(
      canvas.getByRole('link', { name: 'Choose what you need to store in the room.' }),
    );
    await expect(canvas.getAllByRole('radio')[0]).toHaveFocus();
    await expect(canvas.getByRole('textbox', { name: 'Width' })).not.toHaveAttribute(
      'aria-invalid',
    );
  },
};
