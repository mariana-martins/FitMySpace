import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../../ui/Dialog';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../../ui/Toast';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { TextField } from '../../ui/TextField';
import { List, ListItem } from '../../ui/List';
import { Heading } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { formText } from '../../docs';

/* ---------------------------------------------------------------
 * Dialog form (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Tasks/Dialog Form',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A short form in a dialog, from the button that opens it to the confirmation after it closes: the dialog checks its own field, closes on save, gives the focus back, and only then a toast says what happened.\n\n' +
          '### When to Use\n' +
          '- **A quick task that belongs to the page behind it:** adding a room to the list, renaming it. One to three fields.\n' +
          '- **Not for:** a long form (give it its own page, see Form Validation), or a question with no fields (see Delete Confirmation).\n\n' +
          '### Anatomy\n' +
          '- A `DialogTrigger` with a `Button` — the focus returns to it when the dialog closes.\n' +
          '- `DialogContent` (`initialFocus="first"`), `DialogTitle`, `DialogDescription`.\n' +
          '- A `<form>` holding `DialogBody` with the `TextField`, and `DialogFooter` with Cancel (`DialogClose`) and the submit `Button`.\n' +
          '- A `Toast` (`success`), raised after the dialog has closed, inside one `ToastProvider` and `ToastViewport` for the whole app.\n\n' +
          '### Accessibility\n' +
          '- **The dialog validates its own field:** an empty name keeps it open, shows the error under the field and puts the focus back in it.\n' +
          '- **The toast waits for the dialog to close.** While a modal dialog is open, everything outside it is hidden from assistive technology, so a toast raised during the close would be announced to nobody. `onCloseAutoFocus` runs once the dialog is gone and the focus is back on the trigger: that is when the toast goes up.\n' +
          '- **The page changes too:** the new room shows up in the list, so the toast confirms what is already visible instead of being the only proof.\n' +
          '- **Enter submits** because the dialog body is a real `<form>`; the submit button keeps its native behaviour.\n\n' +
          '### In the App\n' +
          '- The dialog holds only the draft. Saving is a TanStack Query mutation; close the dialog on success, and on a failed request keep it open with an `Alert` above the field. The toast queue lives in `src/hooks/`.',
      },
      story: { height: '420px' },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const NAME_MISSING = 'Enter a name for the room, such as Study.';

function AddRoomDialog() {
  const [rooms, setRooms] = useState(['Bathroom', 'Bedroom']);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [addedRoom, setAddedRoom] = useState('');
  const justSaved = useRef(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  function handleOpenChange(isOpen: boolean) {
    setDialogOpen(isOpen);
    if (isOpen) setNameError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const roomName = formText(new FormData(event.currentTarget), 'room-name').trim();
    if (!roomName) {
      setNameError(NAME_MISSING);
      nameInputRef.current?.focus();
      return;
    }
    setRooms((currentRooms) => [...currentRooms, roomName]);
    setAddedRoom(roomName);
    justSaved.current = true;
    setDialogOpen(false);
  }

  /* Runs once the dialog is gone and focus is back on the trigger: the page is no longer
     hidden from assistive technology, so the toast can be heard. */
  function handleCloseAutoFocus() {
    if (!justSaved.current) return;
    justSaved.current = false;
    setToastOpen(true);
  }

  return (
    <ToastProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          width: '24rem',
          maxWidth: '100%',
        }}
      >
        <Heading level={2} size="sm" style={{ margin: 0 }}>
          Your rooms
        </Heading>
        <List size="sm" aria-label="Your rooms">
          {rooms.map((room) => (
            <ListItem key={room} icon="home">
              {room}
            </ListItem>
          ))}
        </List>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="primary" appearance="fill" size="md" style={{ alignSelf: 'start' }}>
              Add room
            </Button>
          </DialogTrigger>

          <DialogContent initialFocus="first" onCloseAutoFocus={handleCloseAutoFocus}>
            <DialogTitle>Add a room</DialogTitle>
            <DialogDescription>Name it after how you use it, not after its size.</DialogDescription>

            <form noValidate onSubmit={handleSubmit}>
              <DialogBody>
                <TextField
                  ref={nameInputRef}
                  label="Room name"
                  name="room-name"
                  hint="Up to 40 characters."
                  maxLength={40}
                  required
                  {...(nameError ? { invalid: true, error: nameError } : { invalid: false })}
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

      <ToastViewport />

      <Toast open={toastOpen} onOpenChange={setToastOpen} variant="success">
        <ToastTitle>Room added</ToastTitle>
        <ToastDescription>{addedRoom} is now in your list of rooms.</ToastDescription>
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}

/* ---------------------------------------------------------------
 * Dialog form
 * --------------------------------------------------------------- */

export const DialogForm: Story = {
  name: 'Dialog Form (A11y)',
  render: () => <AddRoomDialog />,
  parameters: {
    docs: {
      description: {
        story:
          'Press "Add room" and save with the field empty to see the error inside the dialog. Then name the room and save: the dialog closes, the focus returns to "Add room", the room joins the list, and the toast slides in.',
      },
      source: {
        code: `const justSaved = useRef(false);

function handleSubmit(event) {
  event.preventDefault();
  if (!roomName) {
    setNameError('Enter a name for the room, such as Study.');
    nameInputRef.current?.focus();
    return;
  }
  saveRoom.mutate(roomName, {
    onSuccess: () => {
      justSaved.current = true;
      setDialogOpen(false);
    },
  });
}

<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogTrigger asChild>
    <Button variant="primary" appearance="fill" size="md">Add room</Button>
  </DialogTrigger>

  <DialogContent
    initialFocus="first"
    onCloseAutoFocus={() => {
      // The dialog is gone and focus is back: now the toast can be heard.
      if (justSaved.current) showToast({ variant: 'success', title: 'Room added' });
      justSaved.current = false;
    }}
  >
    <DialogTitle>Add a room</DialogTitle>
    <form noValidate onSubmit={handleSubmit}>
      <DialogBody>
        <TextField
          ref={nameInputRef}
          label="Room name"
          name="room-name"
          required
          {...(nameError ? { invalid: true, error: nameError } : { invalid: false })}
        />
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Add room' })).toBeEnabled();
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Dialog Form (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const DialogFormInteraction: Story = {
  ...DialogForm,
  name: 'Dialog Form (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const trigger = canvas.getByRole('button', { name: 'Add room' });
    await userEvent.click(trigger);

    const field = await page.findByRole('textbox', { name: 'Room name' });
    await expect(field).toHaveFocus();
    await userEvent.click(page.getByRole('button', { name: 'Save room' }));
    await expect(field).toHaveAttribute('aria-invalid', 'true');
    await expect(field).toHaveFocus();
    await expect(page.getByRole('dialog')).toBeInTheDocument();

    await userEvent.type(field, 'Study{Enter}');
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(canvas.getByText('Study')).toBeInTheDocument();
    await expect(await page.findByText('Room added')).toBeInTheDocument();
  },
};
