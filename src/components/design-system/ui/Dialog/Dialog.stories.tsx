import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TextField } from '../TextField';
import { Button } from '../Button';
import { useState } from 'react';

import type { DialogContentProps } from './';
import type { FormEvent } from 'react';

const meta = {
  title: 'Design System/Components/Overlays/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  args: {
    size: 'md',
    initialFocus: 'first',
    closeLabel: 'Close',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A `Dialog` interrupts the page with something that has to be dealt with before going back: a form, a confirmation, a long explanation. It is built on Radix Dialog, which owns the scrim, the focus trap, Escape, the scroll lock, the return of focus to the trigger and the `aria-hidden` it puts on the rest of the page. `role="dialog"` and `aria-labelledby` come from Radix too; this component adds `aria-modal`.\n\n' +
          'You compose it rather than configure it: `DialogTrigger`, then `DialogContent` with `DialogTitle`, an optional `DialogDescription`, `DialogBody` and `DialogFooter`. The header and the footer stay put while only the body scrolls, so the title and the actions are always in sight.\n\n' +
          '### Best Practices\n' +
          '- **Always give it a title:** Radix names the dialog with `aria-labelledby` from `DialogTitle`. A dialog with no title opens with nothing to tell the reader what it is.\n' +
          '- **Say what the dialog does, not that it opened:** the title is a label ("Move the shelf"), the description is the one line that adds something. Leave the description out when the title already says it all — Radix then drops `aria-describedby`.\n' +
          '- **Choose where the focus starts:** the first control (`initialFocus="first"`, right for a form, so typing starts at once) or the title (`"title"`, right for a dialog with nothing to fill in, so the reader hears the title first).\n' +
          '- **Keep the actions in the footer:** the confirming action and a way out, always both. On a narrow screen they stack, full width, so neither becomes a missed tap.\n' +
          '- **Do not bury the page in dialogs:** never open one from another, and never put a Toast inside one. If the dialog is only telling the user something, an `Alert` in the page is usually the better answer.\n' +
          '- **An error is not a dialog:** a form that failed stays open and shows its own `Alert`; do not close it and announce the failure somewhere else.\n\n' +
          '### Key Features\n' +
          '- **Composed parts** — trigger, content, title, description, body, footer and close, so any content fits.\n' +
          '- **Three widths** — `sm` 400px, `md` 560px, `lg` 720px, each capped by the viewport minus its margin.\n' +
          '- **Fixed header and footer** — only the body scrolls, on any height.\n' +
          '- **Close button included** — icon-only, in the corner, named by `closeLabel`, so no dialog can be rendered without a way out.\n' +
          '- **`modal` on `Dialog`** — defaults to `true`; `false` leaves the page usable, and `aria-modal` follows it.\n' +
          '- **Reduced motion and `forced-colors`** — the scrim and the dialog stop moving when asked, and the dialog draws its own edge when the system drops shadows.\n\n' +
          '### Patterns\n' +
          '- [Dialog Form](?path=/docs/design-system-patterns-tasks-dialog-form--docs) — a short form in a dialog, then a toast once the dialog has closed.\n' +
          '- [Delete Confirmation](?path=/docs/design-system-patterns-tasks-delete-confirmation--docs) — a delete that cannot be undone asks with `AlertDialog` instead, and shows where the focus goes after a delete.\n' +
          '- [Choosing Feedback](?path=/docs/design-system-patterns-guides-choosing-feedback--docs) — field error, alert, toast, empty state or dialog: which fits which situation.\n' +
          '- [Site Header](?path=/docs/design-system-patterns-page-sections-site-header--docs) — the brand and the main sections, folding into a menu dialog on a phone.',
      },
    },
  },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The dialog opens in a portal at the end of <body>, outside the story's own
   node, so every query goes through the document. */
function page() {
  return within(document.body);
}

/*
 * The plays of the visible stories only check the resting state. A play runs as soon
 * as the page loads, so one that opened and closed the dialog made it flash on screen
 * before anyone pressed a button. Opening, focus, Escape and the scrim are covered in
 * Dialog.test.tsx; what only a real browser can show is in the test-only story at the end.
 */
async function expectClosed(triggerName: string) {
  await expect(page().getByRole('button', { name: triggerName })).toBeEnabled();
  await expect(page().queryByRole('dialog')).not.toBeInTheDocument();
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

function EditRoomDialog(contentProps: DialogContentProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="primary" appearance="fill" size="md">
          Edit room
        </Button>
      </DialogTrigger>

      <DialogContent {...contentProps}>
        <DialogTitle>Edit room</DialogTitle>
        <DialogDescription>The name shows up in your list of rooms.</DialogDescription>

        <DialogBody>
          <TextField label="Room name" name="room-name" defaultValue="Bedroom" />
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" appearance="outline" size="md">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" appearance="fill" size="md">
            Save room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Default: Story = {
  args: {
    size: 'md',
    initialFocus: 'first',
    closeLabel: 'Close',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Width: 400px, 560px or 720px, capped by the viewport minus its margin.',
    },
    initialFocus: {
      control: { type: 'inline-radio' },
      options: ['first', 'title'],
      description:
        'Where the focus goes when the dialog opens: the first control, or the title for a dialog with nothing to fill in.',
    },
    closeLabel: {
      control: 'text',
      description: 'Accessible name of the icon-only Close button. Defaults to `Close`.',
    },
    children: {
      control: false,
      description: 'The parts: `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter`.',
    },
  },
  render: (args) => <EditRoomDialog {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The dialog starts closed: press **Edit room** to open it, and Escape, Cancel or the Close button to leave it.',
      },
      source: {
        code: `<Dialog>
  <DialogTrigger asChild>
    <Button variant="primary" appearance="fill" size="md">Edit room</Button>
  </DialogTrigger>

  <DialogContent size="md" initialFocus="first" closeLabel="Close">
    <DialogTitle>Edit room</DialogTitle>
    <DialogDescription>The name shows up in your list of rooms.</DialogDescription>

    <DialogBody>
      <TextField label="Room name" name="room-name" defaultValue="Bedroom" />
    </DialogBody>

    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary" appearance="outline" size="md">Cancel</Button>
      </DialogClose>
      <Button variant="primary" appearance="fill" size="md">Save room</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Edit room');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

const SIZE_TRIGGERS = [
  { size: 'sm', label: 'Small dialog' },
  { size: 'md', label: 'Medium dialog' },
  { size: 'lg', label: 'Large dialog' },
] as const;

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {SIZE_TRIGGERS.map(({ size, label }) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="secondary" appearance="outline" size="md">
              {label}
            </Button>
          </DialogTrigger>

          <DialogContent size={size}>
            <DialogTitle>{label}</DialogTitle>
            <DialogBody>
              <p>
                The width is {size === 'sm' ? '400' : size === 'md' ? '560' : '720'}px, and never
                more than the viewport minus its margin, so the dialog stays inside the screen on a
                phone as well as on a desktop.
              </p>
            </DialogBody>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="primary" appearance="fill" size="md">
                  Done
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three widths, one rule: the dialog is as wide as its content needs and never wider than the screen. `sm` for a confirmation, `md` for a short form, `lg` for a table or a long explanation. On a narrow screen the margin around the dialog shrinks from 24px to 16px.',
      },
      source: {
        code: `<DialogContent size="lg">
  <DialogTitle>Large dialog</DialogTitle>
  <DialogBody>…</DialogBody>
  <DialogFooter>…</DialogFooter>
</DialogContent>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Small dialog');
    await expectClosed('Medium dialog');
    await expectClosed('Large dialog');
  },
};

/* ---------------------------------------------------------------
 * Read-only
 * --------------------------------------------------------------- */

export const ReadOnly: Story = {
  name: 'Read-only (Focus on the Title)',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" appearance="outline" size="md">
          Why this fits
        </Button>
      </DialogTrigger>

      <DialogContent initialFocus="title">
        <DialogTitle>Why this fits</DialogTitle>
        <DialogBody>
          <p>
            Sizes are measured with the doors open and the drawers pulled out, so the shelf clears
            everything beside it. There is 4cm left on the wall and 12cm above it.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary" appearance="fill" size="md">
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A dialog with nothing to fill in has no first field to focus, so `initialFocus="title"` puts the focus on the heading instead: the reader hears the title before anything else. The heading carries `tabindex="-1"`, which is what lets the focus rest there; it stays out of the tab order.',
      },
      source: {
        code: `<DialogContent initialFocus="title">
  <DialogTitle>Why this fits</DialogTitle>
  <DialogBody>…</DialogBody>
  <DialogFooter>
    <DialogClose asChild>
      <Button variant="primary" appearance="fill" size="md">Got it</Button>
    </DialogClose>
  </DialogFooter>
</DialogContent>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Why this fits');
  },
};

/* ---------------------------------------------------------------
 * Long content
 * --------------------------------------------------------------- */

const MEASUREMENTS = [
  'Wall space: 214cm, with the skirting counted in.',
  'Door swing: the wardrobe door needs 62cm to open fully.',
  'Lift: the longest panel is 186cm, the lift is 190cm.',
  'Stairs: the turn at the second landing leaves 74cm.',
  'Front door: 92cm wide, and the panel goes in upright.',
  'Delivery: two people, because each panel weighs 28kg.',
];

export const LongContent: Story = {
  name: 'Long Content (Only the Body Scrolls)',
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" appearance="outline" size="md">
          Delivery checklist
        </Button>
      </DialogTrigger>

      <DialogContent size="md" initialFocus="title">
        <DialogTitle>Delivery checklist</DialogTitle>
        <DialogDescription>
          Measured on 12 March, by the fitter who will come back.
        </DialogDescription>

        <DialogBody>
          {/* list-style is off in the app's global reset, so a list has to ask for its markers back. */}
          <ul style={{ margin: 0, paddingInlineStart: '1.25rem', listStyleType: 'revert' }}>
            {MEASUREMENTS.map((measurement) => (
              <li key={measurement} style={{ marginBottom: '0.5rem' }}>
                {measurement}
              </li>
            ))}
            <li>Bring a long drill bit; the wall is concrete behind the plaster.</li>
            <li>The bedroom door is 76cm, so the panels go in one at a time.</li>
          </ul>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary" appearance="fill" size="md">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The dialog never grows past the viewport: its height stops at the margin, and the body is the part that scrolls. The title and the description stay at the top, the footer stays at the bottom, so the reader always knows which dialog this is and how to leave it.',
      },
      source: {
        code: `<DialogContent initialFocus="title">
  <DialogTitle>Delivery checklist</DialogTitle>
  <DialogDescription>Measured on 12 March, by the fitter who will come back.</DialogDescription>

  <DialogBody>
    <ul>{/* long content */}</ul>
  </DialogBody>

  <DialogFooter>
    <DialogClose asChild>
      <Button variant="primary" appearance="fill" size="md">Close</Button>
    </DialogClose>
  </DialogFooter>
</DialogContent>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Delivery checklist');
  },
};

/* ---------------------------------------------------------------
 * Form example (recipe)
 * --------------------------------------------------------------- */

function SaveRoomForm() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [savedRoom, setSavedRoom] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavedRoom(roomName);
    setDialogOpen(false);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '24rem',
        maxWidth: '100%',
      }}
    >
      {savedRoom && <p style={{ margin: 0 }}>Room added: {savedRoom}</p>}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="primary" appearance="fill" size="md">
            Add room
          </Button>
        </DialogTrigger>

        <DialogContent initialFocus="first">
          <DialogTitle>Add a room</DialogTitle>
          <DialogDescription>Name it after how you use it, not after its size.</DialogDescription>

          <form onSubmit={handleSubmit}>
            <DialogBody>
              <TextField
                label="Room name"
                name="room-name"
                hint="Up to 40 characters."
                required
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
              />
            </DialogBody>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary" appearance="outline" size="md">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="primary" appearance="fill" size="md" type="submit">
                Save room
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const FormExample: Story = {
  name: 'Form Example (A11y)',
  render: () => <SaveRoomForm />,
  parameters: {
    docs: {
      description: {
        story:
          'The whole dialog is a `<form>`, so Enter in the field submits it and the submit button keeps its native behaviour. The state lives with the app (`open` and `onOpenChange`), because the app also has to know when the dialog closed — and the trigger stays a `DialogTrigger`, so focus goes back to the button that opened the dialog. The field is focused the moment it opens, and every field has a visible label: `aria-label` alone is never enough.',
      },
      source: {
        code: `const [dialogOpen, setDialogOpen] = useState(false);

<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button variant="primary" appearance="fill" size="md">Add room</Button>
  </DialogTrigger>

  <DialogContent initialFocus="first">
    <DialogTitle>Add a room</DialogTitle>
    <DialogDescription>Name it after how you use it.</DialogDescription>

    <form onSubmit={handleSubmit}>
      <DialogBody>
        <TextField label="Room name" name="room-name" hint="Up to 40 characters." required />
      </DialogBody>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" appearance="outline" size="md">Cancel</Button>
        </DialogClose>
        <Button variant="primary" appearance="fill" size="md" type="submit">Save room</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Add room');
  },
};

/* ---------------------------------------------------------------
 * Confirmation (recipe)
 * --------------------------------------------------------------- */

export const Confirmation: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="error" appearance="fill" size="md">
          Delete room
        </Button>
      </DialogTrigger>

      <DialogContent size="sm" initialFocus="title" closeLabel="Close delete confirmation">
        <DialogTitle>Delete “Bedroom”?</DialogTitle>
        <DialogDescription>
          This removes 12 saved items from the room. The items themselves stay in your list.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" appearance="outline" size="md">
              Keep room
            </Button>
          </DialogClose>
          <Button variant="error" appearance="fill" size="md">
            Delete room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A confirmation is short, so it takes `size="sm"`, and it has nothing to fill in, so the focus starts on the title and the reader hears what is about to happen before anything else. The title is the whole question and the description says what is lost. Both ways out are in the footer: on a phone they stack, so the destructive action is never the one a thumb hits by accident.',
      },
      source: {
        code: `<DialogContent size="sm" initialFocus="title" closeLabel="Close delete confirmation">
  <DialogTitle>Delete “Bedroom”?</DialogTitle>
  <DialogDescription>
    This removes 12 saved items from the room. The items themselves stay in your list.
  </DialogDescription>

  <DialogFooter>
    <DialogClose asChild>
      <Button variant="secondary" appearance="outline" size="md">Keep room</Button>
    </DialogClose>
    <Button variant="error" appearance="fill" size="md">Delete room</Button>
  </DialogFooter>
</DialogContent>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Delete room');
  },
};

/* ---------------------------------------------------------------
 * Browser behaviour (test only)
 *
 * Hidden from the sidebar and the docs page (`!dev`, `!autodocs`), so nobody
 * watches it run, but `npm run test:storybook` still plays it. It holds what
 * jsdom cannot show: the exit animation, and the form recipe end to end.
 * --------------------------------------------------------------- */

export const BrowserBehaviour: Story = {
  name: 'Browser Behaviour (Test Only)',
  tags: ['!dev', '!autodocs'],
  render: () => <SaveRoomForm />,
  parameters: {
    docs: {
      description: {
        story:
          'Test-only: opens the form recipe, submits it, and checks that the dialog fades out with the scrim instead of vanishing at once.',
      },
    },
  },
  play: async () => {
    await userEvent.click(page().getByRole('button', { name: 'Add room' }));

    // The required marker sits inside the label, so the field is found by its
    // role and accessible name, which leave the marker out.
    const field = await page().findByRole('textbox', { name: 'Room name' });
    await expect(field).toHaveFocus();
    const dialog = page().getByRole('dialog');

    await userEvent.type(field, 'Study{Enter}');

    // Right after the submit the dialog is still on screen, closing: Radix keeps it
    // until its exit animation ends, instead of removing it at once.
    await expect(dialog).toBeInTheDocument();
    await expect(dialog).toHaveAttribute('data-state', 'closed');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());

    await expect(page().getByText('Room added: Study')).toBeInTheDocument();
    await expect(page().getByRole('button', { name: 'Add room' })).toHaveFocus();
  },
};
