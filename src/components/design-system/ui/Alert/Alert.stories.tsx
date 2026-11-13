import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Clock, MapPin } from 'lucide-react';
import { Button } from '../Button';
import { useState } from 'react';
import { Alert } from './';

import type { AlertVariant } from './';

const meta = {
  title: 'Design System/Components/Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'information',
    appearance: 'soft',
    title: 'This order ships from two stores',
    headingLevel: 3,
    live: 'polite',
    children: 'The items may arrive on different days, with separate tracking.',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Alert` component is a status message in one of the four utility colours, with an icon, an optional title and the message itself. By default it is a **live region**: `role="status"` (`live="polite"`), `role="alert"` with `live="assertive"`, and no role with `live="off"` for a fixed note.\n\n' +
          '### Best Practices\n' +
          '- **Keep it mounted, swap the text:** A live region is only announced when its content changes, so render the `Alert` once and change what is inside it. With no message it draws nothing but stays on the page, so never hide it with `hidden`: that takes it out of the accessibility tree and the next message is missed.\n' +
          '- **Use `live="assertive"` sparingly:** `role="alert"` interrupts whatever the screen reader is saying. Reserve it for a payment that just failed or a session about to end; everything else is a status.\n' +
          '- **Fixed notes are not live:** A note that is on the page from the start, such as "Delivery dates are estimates", takes `live="off"`, so the page does not fill up with live regions.\n' +
          '- **Never put controls inside:** An alert holds text only. A message that needs a dismiss button or an action belongs to a different pattern, such as an `alertdialog`.\n' +
          '- **Say the type in words:** The icon is decorative and colour alone is not enough, so a screen-reader-only prefix reads "Error:", "Success:" and so on. Write the message so it stands on its own too.\n' +
          '- **Fit the page outline:** Set `headingLevel` so the title sits under the heading above it.\n\n' +
          '### Key Features\n' +
          '- **Four utility colours** — `information`, `success`, `warning` and `error`, each with a `soft` block for a message inside a page and a `fill` block for when the message is the main thing on the screen.\n' +
          '- **Icons from Lucide** — one per variant by default; pass `icon` to replace it.\n' +
          '- **Text or structure** — plain text is set in a paragraph; pass your own `<p>` or `<ul>` for longer messages, such as a list of errors.\n' +
          '- **Server-rendered** — no client hooks.',
      },
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

const EXAMPLES: Record<AlertVariant, { title: string; message: string }> = {
  information: {
    title: 'This room fits six of these shelves',
    message: 'Sizes are measured with the doors open and the drawers pulled out.',
  },
  success: {
    title: 'Room saved',
    message: 'We added the shelf to your list for this room.',
  },
  warning: {
    title: 'Two people needed',
    message: 'This shelf is too tall to carry up the stairs alone.',
  },
  error: {
    title: 'Payment declined',
    message: 'The bank did not accept this card. Try another one.',
  },
};

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    variant: 'information',
    appearance: 'soft',
    title: 'This order ships from two stores',
    headingLevel: 3,
    live: 'polite',
    children: 'The items may arrive on different days, with separate tracking.',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['information', 'success', 'warning', 'error'],
      description: 'Utility colour and default icon.',
    },
    appearance: {
      control: { type: 'select' },
      options: ['soft', 'fill'],
      description:
        '`soft` is a tinted block inside a page; `fill` is a solid block for a message that stands alone.',
    },
    title: {
      control: 'text',
      description: 'Optional title, shown above the message as a heading.',
    },
    headingLevel: {
      control: { type: 'select' },
      options: [2, 3, 4, 5, 6],
      description: 'Heading level of the title. Defaults to 3.',
    },
    live: {
      control: { type: 'inline-radio' },
      options: ['polite', 'assertive', 'off'],
      description:
        '`polite` (default, `role="status"`) waits for the screen reader; `assertive` (`role="alert"`) interrupts it; `off` is a fixed note with no role.',
    },
    icon: {
      control: false,
      description: 'Replaces the variant icon. Decorative.',
    },
    children: {
      control: 'text',
      description: 'The message. Text only.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'This order ships from two stores' }),
    ).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * All variants
 * --------------------------------------------------------------- */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
      {(['information', 'success', 'warning', 'error'] as const).map((variant) => (
        <Alert key={variant} variant={variant} title={EXAMPLES[variant].title}>
          {EXAMPLES[variant].message}
        </Alert>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The four utility colours, each with its own icon and its own spoken prefix. Pick the colour that matches what happened, never the one that matches the mood: `warning` is for something that may go wrong, `error` for something that did.',
      },
      source: {
        code: `<Alert variant="warning" title="Two people needed">
  This shelf is too tall to carry up the stairs alone.
</Alert>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Soft and fill
 * --------------------------------------------------------------- */

export const SoftAndFill: Story = {
  name: 'Soft and Fill',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
        gap: '1rem',
      }}
    >
      {(['information', 'success', 'warning', 'error'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Alert variant={variant} appearance="soft">
            Soft, for a message inside a page.
          </Alert>
          <Alert variant={variant} appearance="fill">
            Fill, for a message that stands alone.
          </Alert>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`soft` is a tinted block with a coloured border, for a message beside other content. `fill` is solid, for a message that is the main thing on the screen, such as a failed payment. Warning is the exception in both: its text stays dark, because white on yellow never reaches 4.5:1.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Without a title
 * --------------------------------------------------------------- */

export const WithoutTitle: Story = {
  name: 'Without a Title',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
      <Alert variant="success">Added to your list.</Alert>
      <Alert variant="error" live="assertive">
        The bank did not accept this card.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A one-line message needs no title. Pass the message as children and the region reads "Success: Added to your list.", with no heading added to the outline.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Error: The bank did not accept this card.',
    );
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
      <Alert variant="warning" icon={<MapPin />} title="Pickup only">
        This wardrobe is too wide for the lift in your building.
      </Alert>
      <Alert variant="information" icon={<Clock />} title="Order cut-off at 14:00">
        Orders placed after that time ship the next working day.
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pass a Lucide icon when the message is about something the default icon does not show: a place, a deadline. It stays decorative — the title and the spoken prefix carry the meaning.',
      },
      source: {
        code: `<Alert variant="warning" icon={<MapPin />} title="Pickup only">
  This wardrobe is too wide for the lift in your building.
</Alert>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Live update (recipe)
 * --------------------------------------------------------------- */

type SaveState = 'idle' | 'saving' | 'saved' | 'failed';

const SAVE_MESSAGE: Record<SaveState, string> = {
  idle: '',
  saving: 'Saving…',
  saved: 'Room saved.',
  failed: 'We could not save this room. Check your connection.',
};

const SAVE_VARIANT: Record<SaveState, AlertVariant> = {
  idle: 'information',
  saving: 'information',
  saved: 'success',
  failed: 'error',
};

function SaveRoomStatus() {
  const [saveState, setSaveState] = useState<SaveState>('idle');

  const saveRoom = () => {
    setSaveState('saving');
    window.setTimeout(() => setSaveState('saved'), 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '36rem' }}>
      <Button variant="primary" appearance="fill" size="md" onClick={saveRoom}>
        Save room
      </Button>

      <Alert variant={SAVE_VARIANT[saveState]}>{SAVE_MESSAGE[saveState]}</Alert>
    </div>
  );
}

export const LiveUpdate: Story = {
  name: 'Live Update (A11y)',
  render: () => <SaveRoomStatus />,
  parameters: {
    docs: {
      description: {
        story:
          'The region is on the page **before** its text changes, which is what makes a screen reader announce the change. Before the first save it has no message, so it draws nothing but is already in the accessibility tree; then the same region moves from "Saving…" to "Room saved." The button stays outside it: an alert holds text only, so a control inside it would not be read.',
      },
      source: {
        code: `const [saveState, setSaveState] = useState<SaveState>('idle');

<Button onClick={saveRoom}>Save room</Button>

{/* Always mounted: an empty message draws nothing but keeps the region. */}
<Alert variant={SAVE_VARIANT[saveState]}>{SAVE_MESSAGE[saveState]}</Alert>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save room' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Information: Saving…');
    await waitFor(
      () => expect(canvas.getByRole('status')).toHaveTextContent('Success: Room saved.'),
      {
        timeout: 3000,
      },
    );
  },
};
