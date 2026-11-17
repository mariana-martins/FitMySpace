import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '../../ui/Dialog';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../../ui/Typography';
import { EmptyState } from '../../ui/EmptyState';
import { List, ListItem } from '../../ui/List';
import type { IconName } from '../../ui/Icon';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';

/* ---------------------------------------------------------------
 * Delete confirmation (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Delete Confirmation',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Removing one item from a list: each item has its own Delete button, a dialog asks once, and after the delete the focus lands somewhere that still exists.\n\n' +
          '### When to Use\n' +
          '- **Deleting something people cannot get back**, or that takes other things with it: a room and the items saved in it.\n' +
          '- **Not for:** something that can be undone in one step (delete at once and offer Undo instead), or clearing a field.\n\n' +
          '### Anatomy\n' +
          '- A heading and a `List`; each `ListItem` has the room\'s icon, its name, how many items it holds, and an outline `error` `Button` at the end whose name includes the room ("Delete Bedroom").\n' +
          '- One `Dialog` for the whole list, opened with the item to delete: `DialogContent` (`size="sm"`, `initialFocus="title"`), a `DialogTitle` that is the whole question, a `DialogDescription` that says what is lost, and the two ways out in `DialogFooter`.\n' +
          '- A status line — `Text` with `role="status"` — that says what was deleted.\n' +
          '- An `EmptyState` once the list is empty.\n\n' +
          '### Accessibility\n' +
          '- **Every Delete button has its own name:** the visible word is "Delete", and a screen-reader-only part adds the room, so a list of buttons is not "Delete, Delete, Delete".\n' +
          '- **The focus starts on the title**, so the question is heard before either button. The safe answer ("Keep room") comes first, and on a phone the buttons stack, so the destructive one is never under a stray thumb.\n' +
          "- **After a delete, the focus moves on** to the next item's Delete button (or the previous one at the end of the list, or the heading when the list is empty). The button that opened the dialog is gone, and focus left on nothing drops a keyboard reader at the top of the page.\n" +
          '- **Cancel returns the focus** to the button that opened the dialog. One dialog serves every button, so there is no `DialogTrigger` to do it: `onCloseAutoFocus` does.\n\n' +
          '### In the App\n' +
          '- Delete with a TanStack Query mutation and move the focus once it succeeds; on a failure keep the dialog open with an `Alert`. For a delete that can be undone, skip the dialog and use a toast with Undo.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ROOMS: { name: string; items: number; icon: IconName }[] = [
  { name: 'Bathroom', items: 4, icon: 'bath' },
  { name: 'Bedroom', items: 12, icon: 'bed' },
  { name: 'Kitchen', items: 7, icon: 'cooking-pot' },
];

function RoomList() {
  const [rooms, setRooms] = useState(ROOMS);
  // The room stays set while the dialog closes, so the title does not empty during its exit.
  const [roomToDelete, setRoomToDelete] = useState<(typeof ROOMS)[number] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastDeleted, setLastDeleted] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const deleteButtons = useRef(new Map<string, HTMLButtonElement>());
  const focusAfterDelete = useRef<string | null>(null);

  function deleteRoom() {
    if (!roomToDelete) return;
    const index = rooms.findIndex((room) => room.name === roomToDelete.name);
    const remainingRooms = rooms.filter((room) => room.name !== roomToDelete.name);
    // The next room takes the place of the deleted one; at the end of the list, the previous one.
    const nextRoom = remainingRooms[index] ?? remainingRooms[index - 1];
    focusAfterDelete.current = nextRoom?.name ?? '';
    setRooms(remainingRooms);
    setLastDeleted(`${roomToDelete.name} deleted.`);
    setDialogOpen(false);
  }

  /* One dialog serves every Delete button, so there is no `DialogTrigger` for Radix to return
     the focus to: this does it. Cancel goes back to the button that opened the dialog; after
     a delete that button is gone, so the focus goes to the next room, or the heading. */
  function handleCloseAutoFocus(event: Event) {
    event.preventDefault();
    const deletedTarget = focusAfterDelete.current;
    focusAfterDelete.current = null;
    if (deletedTarget === null) {
      if (roomToDelete) deleteButtons.current.get(roomToDelete.name)?.focus();
      return;
    }
    (deletedTarget ? deleteButtons.current.get(deletedTarget) : headingRef.current)?.focus();
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '26rem',
        maxWidth: '100%',
      }}
    >
      <Heading ref={headingRef} tabIndex={-1} level={2} size="sm" style={{ margin: 0 }}>
        Your rooms
      </Heading>

      {rooms.length > 0 ? (
        <List aria-label="Your rooms">
          {rooms.map((room) => (
            <ListItem
              key={room.name}
              icon={room.icon}
              description={`${room.items} saved items`}
              trailing={
                <Button
                  ref={(button) => {
                    if (button) deleteButtons.current.set(room.name, button);
                    else deleteButtons.current.delete(room.name);
                  }}
                  variant="error"
                  appearance="outline"
                  size="sm"
                  onClick={() => {
                    setRoomToDelete(room);
                    setDialogOpen(true);
                  }}
                >
                  Delete<VisuallyHidden> {room.name}</VisuallyHidden>
                </Button>
              }
            >
              {room.name}
            </ListItem>
          ))}
        </List>
      ) : (
        <EmptyState
          title="No rooms yet"
          headingLevel={3}
          description="Add a room to see only the products that fit it."
        />
      )}

      <Text as="p" size="sm" role="status" style={{ margin: 0, minBlockSize: '1lh' }}>
        {lastDeleted}
      </Text>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          size="sm"
          initialFocus="title"
          closeLabel="Close delete confirmation"
          onCloseAutoFocus={handleCloseAutoFocus}
        >
          <DialogTitle>Delete “{roomToDelete?.name}”?</DialogTitle>
          <DialogDescription>
            This removes {roomToDelete?.items} saved items from the room. The items themselves stay
            in your list.
          </DialogDescription>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" appearance="outline" size="md">
                Keep room
              </Button>
            </DialogClose>
            <Button variant="error" appearance="fill" size="md" onClick={deleteRoom}>
              Delete room
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Delete confirmation
 * --------------------------------------------------------------- */

export const DeleteConfirmation: Story = {
  name: 'Delete Confirmation (A11y)',
  render: () => <RoomList />,
  parameters: {
    docs: {
      description: {
        story:
          'Delete "Bedroom" with the keyboard: after the confirmation, the focus is on "Delete Kitchen", the next room, and the status line says what went. Delete every room to reach the empty state, with the focus on the heading.',
      },
      source: {
        code: `<Button
  ref={registerDeleteButton(room.name)}
  variant="error"
  appearance="outline"
  size="sm"
  onClick={() => openConfirmation(room)}
>
  Delete<VisuallyHidden> {room.name}</VisuallyHidden>
</Button>

<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent
    size="sm"
    initialFocus="title"
    closeLabel="Close delete confirmation"
    onCloseAutoFocus={(event) => {
      // No DialogTrigger to return to: focus the opener on Cancel, the next room after a delete.
      event.preventDefault();
      focusOpenerOrNextRoom();
    }}
  >
    <DialogTitle>Delete “{roomToDelete.name}”?</DialogTitle>
    <DialogDescription>This removes {roomToDelete.items} saved items from the room.</DialogDescription>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="secondary" appearance="outline" size="md">Keep room</Button>
      </DialogClose>
      <Button variant="error" appearance="fill" size="md" onClick={deleteRoom}>Delete room</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Delete Bedroom' })).toBeEnabled();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

/* ---------------------------------------------------------------
 * Delete Confirmation (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const DeleteConfirmationInteraction: Story = {
  ...DeleteConfirmation,
  name: 'Delete Confirmation (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    // Cancel: the focus goes back to the button that opened the dialog.
    const deleteBedroom = canvas.getByRole('button', { name: 'Delete Bedroom' });
    await userEvent.click(deleteBedroom);
    await expect(await page.findByRole('heading', { name: 'Delete “Bedroom”?' })).toHaveFocus();
    await userEvent.click(page.getByRole('button', { name: 'Keep room' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(deleteBedroom).toHaveFocus();

    // Delete: the focus moves to the next room's button.
    await userEvent.click(deleteBedroom);
    await userEvent.click(await page.findByRole('button', { name: 'Delete room' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Delete Kitchen' })).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Bedroom deleted.');

    // The last room: the focus moves back to the one before it.
    await userEvent.click(canvas.getByRole('button', { name: 'Delete Kitchen' }));
    await userEvent.click(await page.findByRole('button', { name: 'Delete room' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Delete Bathroom' })).toHaveFocus();
  },
};
