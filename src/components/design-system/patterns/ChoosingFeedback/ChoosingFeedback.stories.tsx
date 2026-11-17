import {
  Dialog,
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
import { Heading, Text } from '../../ui/Typography';
import type { FormEvent, ReactNode } from 'react';
import { EmptyState } from '../../ui/EmptyState';
import { TextField } from '../../ui/TextField';
import { List, ListItem } from '../../ui/List';
import { Button } from '../../ui/Button';
import { Alert } from '../../ui/Alert';
import { formText } from '../../docs';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Choosing feedback (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Choosing Feedback',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Which way to tell people something: a field error, an alert, a toast, an empty state or a dialog. Each one interrupts a different amount and lives in a different place.\n\n' +
          '### What It Solves\n' +
          'The same news shown the wrong way fails people: a toast for a form error disappears from beside the field that needs fixing, a dialog for a saved setting stops everything for nothing, an alert for an empty search looks like something broke. Pick by two questions: **where is the thing people need to act on?** and **must they stop?**\n\n' +
          '### When to Use Which\n' +
          '| Situation | Use | Why |\n' +
          '| --- | --- | --- |\n' +
          '| A value people typed is wrong | Field error (`TextField` `error`) | It sits under the field that needs fixing, and is read with it. |\n' +
          '| Several fields are wrong after a submit | The error summary of Form Validation | One list at the top, each line a link to its field. |\n' +
          '| Something people should know about this part of the page | `Alert`, in place | It stays until the situation changes; nothing is interrupted. |\n' +
          '| An action finished and the page shows it, or it happened elsewhere | `Toast` | Short, out of the way, and offers Undo when there is one. |\n' +
          '| A list came back with nothing | `EmptyState` | Not an error: it says what to change. |\n' +
          '| A list could not load | `Alert` (`error`, assertive) in its place | See Results States. |\n' +
          '| A decision before something that cannot be undone | `Dialog` | It stops everything, so keep it for what is worth stopping for. |\n' +
          '| The whole page cannot show | Page Errors | The page itself becomes the message. |\n\n' +
          'Each story below is one situation from FitMySpace, shown in its place, with the feedback it needs and why the tempting alternative would fail.\n\n' +
          '### Accessibility\n' +
          '- **Loudness follows urgency:** field errors are read when the field is reached; alerts and toasts are polite unless something failed; only a dialog takes the focus.\n' +
          '- **Never colour alone:** each one has words, and an icon where it helps.\n' +
          '- **Never a toast for something people must act on later:** it closes, and the instruction goes with it.\n\n' +
          '### In the App\n' +
          '- Field errors and summaries come from Zod; alerts and empty states from the TanStack Query state of the list; toasts from the toast queue in `src/hooks/`; dialogs from a local `open` state.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The frame of each situation: what is going on, then the screen it happens on. */
function Situation({ context, children }: { context: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '30rem',
        maxWidth: '100%',
      }}
    >
      <Text as="p" size="sm" style={{ margin: 0 }}>
        {context}
      </Text>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
 * A value is wrong: field error
 * --------------------------------------------------------------- */

function WrongValue() {
  const [widthError, setWidthError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const width = Number(formText(new FormData(event.currentTarget), 'width'));
    setWidthError(width > 0 ? null : 'Enter a width above 0 cm.');
  }

  return (
    <Situation context="Someone measures their bathroom niche and types 0 for the width.">
      <form
        noValidate
        aria-label="Bathroom niche"
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}
      >
        <TextField
          name="width"
          label="Width"
          unit="cm"
          defaultValue="0"
          inputMode="decimal"
          {...(widthError ? { invalid: true, error: widthError } : { invalid: false })}
        />
        <Button variant="primary" appearance="fill" size="md" type="submit">
          Save the space
        </Button>
      </form>
    </Situation>
  );
}

export const FieldError: Story = {
  name: 'A Value Is Wrong: Field Error',
  render: () => <WrongValue />,
  parameters: {
    docs: {
      description: {
        story:
          'Press "Save the space". **Use a field error:** the message appears under the width, says how to fix it, and is read when the field is reached. **Not a toast:** it would slide away from the bottom corner before the reader found the field. **Not an alert at the top:** it would send them searching for which field it meant.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('textbox', { name: 'Width' })).not.toHaveAttribute(
      'aria-invalid',
    );
  },
};

export const FieldErrorInteraction: Story = {
  ...FieldError,
  name: 'A Value Is Wrong: Field Error: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save the space' }));
    await expect(canvas.getByRole('textbox', { name: 'Width' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
    await expect(canvas.getByText('Enter a width above 0 cm.')).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Something to know here: alert
 * --------------------------------------------------------------- */

export const InlineAlert: Story = {
  name: 'Something to Know Here: Alert',
  render: () => (
    <Situation context="A wardrobe is sold only for pickup, and it is too deep for most lifts.">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Heading level={3} size="md" style={{ margin: 0 }}>
          Two-door oak wardrobe
        </Heading>
        <Alert variant="warning" title="Pickup only">
          At 98 cm deep it does not fit most lifts. Check the stairs before you buy.
        </Alert>
        <div>
          <Button variant="primary" appearance="fill" size="md">
            View at IKEA
          </Button>
        </div>
      </div>
    </Situation>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '**Use an alert, in place:** it sits next to the thing it is about and stays as long as it is true. **Not a toast:** the warning matters at the moment of buying, not for a few seconds after the page opens. **Not a dialog:** nothing has to be decided yet, so nothing should stop the reader.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Pickup only');
  },
};

/* ---------------------------------------------------------------
 * An action finished: toast
 * --------------------------------------------------------------- */

function FinishedAction() {
  const [saved, setSaved] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  return (
    <ToastProvider>
      <Situation context="Someone saves a room they just measured. The room list shows it at once.">
        <List appearance="outline" aria-label="Your rooms">
          <ListItem
            icon="bath"
            description={saved ? 'Saved' : '240 × 180 cm, not saved yet'}
            trailing={
              <Button
                variant="primary"
                appearance="fill"
                size="sm"
                disabled={saved}
                onClick={() => {
                  setSaved(true);
                  setToastOpen(true);
                }}
              >
                Save the room
              </Button>
            }
          >
            Bathroom
          </ListItem>
        </List>
      </Situation>

      <ToastViewport />
      <Toast open={toastOpen} onOpenChange={setToastOpen} variant="success">
        <ToastTitle>Room saved</ToastTitle>
        <ToastDescription>Bathroom is now in your list of rooms.</ToastDescription>
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}

export const FinishedToast: Story = {
  name: 'An Action Finished: Toast',
  render: () => <FinishedAction />,
  parameters: {
    docs: {
      description: {
        story:
          'Press "Save the room". **Use a toast:** the row already says "Saved", so the toast only confirms, out of the way, and is announced politely. **Not an alert:** it would stay on the page long after the news is old. **Not a dialog:** an "OK" to press for something that went right is a step for nothing.',
      },
      story: { height: '320px' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Save the room' })).toBeEnabled();
  },
};

export const FinishedToastInteraction: Story = {
  ...FinishedToast,
  name: 'An Action Finished: Toast: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save the room' }));
    await expect(canvas.getByText('Saved')).toBeVisible();
    await expect(await within(document.body).findByText('Room saved')).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Nothing found: empty state
 * --------------------------------------------------------------- */

export const NothingFound: Story = {
  name: 'Nothing Found: Empty State',
  render: () => (
    <Situation context="A search for “sofa” on a storage site finds nothing.">
      <EmptyState
        title="No products for “sofa”"
        headingLevel={3}
        description="Try a broader word, such as basket or shelf."
      >
        <Button variant="primary" appearance="fill" size="md">
          Show all products
        </Button>
      </EmptyState>
    </Situation>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '**Use an empty state:** in the place of the results, it says what to try and offers one way forward. **Not an error alert:** nothing broke, and a red box would say otherwise. **Not a toast:** the empty grid would stay, with nothing to explain it.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'No products for “sofa”' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Cannot be undone: dialog
 * --------------------------------------------------------------- */

export const CannotBeUndone: Story = {
  name: 'Cannot Be Undone: Dialog',
  render: () => (
    <Situation context="Deleting a room also removes the 12 products saved in it.">
      <Dialog>
        <List appearance="outline" aria-label="Your rooms">
          <ListItem
            icon="bed"
            description="12 saved products"
            trailing={
              <DialogTrigger asChild>
                <Button variant="error" appearance="fill" size="sm">
                  Delete room
                </Button>
              </DialogTrigger>
            }
          >
            Bedroom
          </ListItem>
        </List>
        <DialogContent size="sm" initialFocus="title" closeLabel="Close delete confirmation">
          <DialogTitle>Delete “Bedroom”?</DialogTitle>
          <DialogDescription>
            This removes the 12 products saved in it. You cannot undo this.
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary" appearance="outline" size="md">
                Keep room
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="error" appearance="fill" size="md">
                Delete room
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Situation>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Press "Delete room". **Use a dialog:** the loss cannot be reversed, so it is worth one question, with the safe answer first. **Not a toast with Undo:** there is no Undo for twelve products gone with their room (when there is, see Remove with Undo). **Not an alert:** a warning on the page does not stop the click that matters.',
      },
      story: { height: '360px' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Delete room' })).toBeEnabled();
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const CannotBeUndoneInteraction: Story = {
  ...CannotBeUndone,
  name: 'Cannot Be Undone: Dialog: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Delete room' }));
    await expect(await page.findByRole('heading', { name: 'Delete “Bedroom”?' })).toHaveFocus();
    await userEvent.click(page.getByRole('button', { name: 'Keep room' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
