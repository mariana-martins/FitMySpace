import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogBody,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '../Typography';
import { Button } from '../Button';
import { useState } from 'react';

import type { AlertDialogContentProps } from './';

const meta = {
  title: 'Design System/Components/Overlays/AlertDialog',
  component: AlertDialogContent,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    initialFocus: 'cancel',
  },
  parameters: {
    docs: {
      description: {
        component:
          'An `AlertDialog` interrupts the page to ask something that must be answered before going back: delete this room, sign in again, discard these changes. It is built on Radix AlertDialog, which is Radix `Dialog` with the rules of `role="alertdialog"`: always modal, Escape answers the safe way out, and clicking the scrim or outside does nothing, because the reader owes the dialog an answer.\n\n' +
          'You compose it exactly like `Dialog` — `AlertDialogTrigger`, then `AlertDialogContent` with `AlertDialogTitle`, `AlertDialogDescription`, the optional `AlertDialogBody` and `AlertDialogFooter` — except that the footer holds two named answers, `AlertDialogCancel` and `AlertDialogAction`, instead of a Close button.\n\n' +
          '### Best Practices\n' +
          '- **Reach for it only where a wrong click costs something:** an action that cannot be undone, or that takes other things with it. Anything else wants a `Dialog`, and something the reader can undo in one step wants no dialog at all — delete it and offer Undo in a `Toast`.\n' +
          '- **The title is the whole question, the description is what is lost:** "Delete “Bedroom”?" and "This removes 12 saved items." The description is not optional here, as it is in `Dialog`: the alert dialog pattern asks for `aria-describedby` pointing at the consequence, so the reader hears it with the question.\n' +
          '- **Name both answers:** "Keep room" and "Delete room", never "OK" and "Cancel". A reader who heard only the question should still know which button does what.\n' +
          '- **Put the safe answer first and leave the focus on it:** that is what `initialFocus` defaults to, and it is what the pattern asks for before an irreversible action — the way out is already under the key. Use `initialFocus="action"` when the action is the expected one, and `"title"` when the dialog only tells the reader something.\n' +
          '- **Keep it short:** `sm` for a question, `md` when there is a list of what is affected. If the reader has to fill something in, it is a `Dialog`, not an alert dialog.\n' +
          '- **Do not stack interruptions:** never open one from another, and never from a `Toast`.\n\n' +
          '### Key Features\n' +
          '- **Two named answers** — `AlertDialogCancel` changes nothing, `AlertDialogAction` does the thing; both take `asChild`, so the app’s `Button` stays the thing you see.\n' +
          '- **No Close button** — a cross in the corner would be a third answer that says nothing, so the dialog cannot be assembled without one of the two real ones.\n' +
          '- **`initialFocus`** — `cancel` (the default), `action` or `title`, aimed at whichever answer the app wrote, in either order.\n' +
          '- **Two widths** — `sm` 400px and `md` 560px, each capped by the viewport minus its margin.\n' +
          '- **Modal, always** — `aria-modal` is ours to add, as in `Dialog`; there is no `modal` prop, because there is no non-modal alert dialog.\n' +
          '- **Reduced motion and `forced-colors`** — the scrim and the dialog stop moving when asked, and the dialog draws its own edge when the system drops shadows.\n\n' +
          '### Patterns\n' +
          '- [Delete Confirmation](?path=/docs/design-system-patterns-tasks-delete-confirmation--docs) — one alert dialog for a list of Delete buttons, and where the focus goes after a delete.\n' +
          '- [Dialog Form](?path=/docs/design-system-patterns-tasks-dialog-form--docs) — the same box when the answer is a form, which wants `Dialog` instead.\n' +
          '- [Choosing Feedback](?path=/docs/design-system-patterns-guides-choosing-feedback--docs) — field error, alert, toast, empty state or dialog: which fits which situation.',
      },
    },
  },
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The dialog opens in a portal at the end of <body>, outside the story's own
   node, so every query goes through the document. */
function page() {
  return within(document.body);
}

/*
 * The plays of the visible stories only check the resting state. A play runs as soon
 * as the page loads, so one that opened a dialog made it flash on screen before anyone
 * pressed a button. Opening, focus, Escape and the scrim are covered in
 * AlertDialog.test.tsx; the interaction that shows them is in the test-only story at
 * the end.
 */
async function expectClosed(triggerName: string) {
  await expect(page().getByRole('button', { name: triggerName })).toBeEnabled();
  await expect(page().queryByRole('alertdialog')).not.toBeInTheDocument();
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

function DeleteRoomDialog(contentProps: AlertDialogContentProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="error" appearance="outline" size="md">
          Delete Bedroom
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent {...contentProps}>
        <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
        <AlertDialogDescription>
          This removes 12 saved items from the room. The items themselves stay in your list.
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary" appearance="outline" size="md">
              Keep room
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="error" appearance="fill" size="md">
              Delete room
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const Default: Story = {
  args: {
    size: 'sm',
    initialFocus: 'cancel',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
      description: 'Width: 400px or 560px, capped by the viewport minus its margin.',
    },
    initialFocus: {
      control: { type: 'inline-radio' },
      options: ['cancel', 'action', 'title'],
      description:
        'Where the focus goes when the dialog opens: the answer that changes nothing (the default), the one that does the thing, or the title.',
    },
    children: {
      control: false,
      description:
        'The parts: `AlertDialogTitle`, `AlertDialogDescription`, the optional `AlertDialogBody`, `AlertDialogFooter`.',
    },
  },
  render: (args) => <DeleteRoomDialog {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The dialog starts closed: press **Delete Bedroom** to open it, and Escape or **Keep room** to leave it without deleting anything.',
      },
      source: {
        code: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="error" appearance="outline" size="md">Delete Bedroom</Button>
  </AlertDialogTrigger>

  <AlertDialogContent size="sm" initialFocus="cancel">
    <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
    <AlertDialogDescription>
      This removes 12 saved items from the room. The items themselves stay in your list.
    </AlertDialogDescription>

    <AlertDialogFooter>
      <AlertDialogCancel asChild>
        <Button variant="secondary" appearance="outline" size="md">Keep room</Button>
      </AlertDialogCancel>
      <AlertDialogAction asChild>
        <Button variant="error" appearance="fill" size="md">Delete room</Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Delete Bedroom');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

const SIZE_TRIGGERS = [
  { size: 'sm', label: 'Small alert dialog' },
  { size: 'md', label: 'Medium alert dialog' },
] as const;

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {SIZE_TRIGGERS.map(({ size, label }) => (
        <AlertDialog key={size}>
          <AlertDialogTrigger asChild>
            <Button variant="secondary" appearance="outline" size="md">
              {label}
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent size={size}>
            <AlertDialogTitle>{label}</AlertDialogTitle>
            <AlertDialogDescription>
              An alert dialog is a question, so it never takes the widest width the `Dialog` has:
              {size === 'sm' ? ' 400px' : ' 560px'} is enough for a question and what it costs.
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="secondary" appearance="outline" size="md">
                  Not now
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button variant="primary" appearance="fill" size="md">
                  Continue
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` for a question about one thing, `md` when the description has to name several things that are affected. On a narrow screen the margin around the dialog shrinks from 24px to 16px, and the two answers stack one under the other, each across the whole width.',
      },
      source: {
        code: `<AlertDialogContent size="md">
  <AlertDialogTitle>Medium alert dialog</AlertDialogTitle>
  <AlertDialogDescription>…</AlertDialogDescription>
  <AlertDialogFooter>…</AlertDialogFooter>
</AlertDialogContent>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Small alert dialog');
    await expectClosed('Medium alert dialog');
  },
};

/* ---------------------------------------------------------------
 * Where the focus starts
 * --------------------------------------------------------------- */

export const InitialFocus: Story = {
  name: 'Initial Focus (Cancel, Action or Title)',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="error" appearance="outline" size="md">
            Delete Bedroom
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes 12 saved items from the room. The items themselves stay in your list.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" appearance="outline" size="md">
                Keep room
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="error" appearance="fill" size="md">
                Delete room
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" appearance="outline" size="md">
            Expire my session
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent initialFocus="action">
          <AlertDialogTitle>Sign in again</AlertDialogTitle>
          <AlertDialogDescription>
            Your session expired, so nothing has been saved since the last change.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" appearance="outline" size="md">
                Not now
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="primary" appearance="fill" size="md">
                Sign in
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="secondary" appearance="outline" size="md">
            Why the estimate changes
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent initialFocus="title">
          <AlertDialogTitle>The estimate changes with the room</AlertDialogTitle>
          <AlertDialogDescription>
            Prices come from the store you chose, and stock changes every hour.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button variant="primary" appearance="fill" size="md">
                Got it
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three dialogs, three starting points. The first is the default: the focus starts on **Keep room**, the answer that changes nothing, so the way out is already under the key before a wrong Enter can delete anything — and it stays there even though the safe answer is written first in one dialog and second in the other. The second starts on **Sign in**, because that is what the reader came for. The third has one answer and nothing to decide, so the focus starts on the title and the reader hears the sentence first.',
      },
      source: {
        code: `<AlertDialogContent>                      {/* the default: focus on Cancel */}
<AlertDialogContent initialFocus="action"> {/* the action is the expected one */}
<AlertDialogContent initialFocus="title">  {/* nothing to decide */}`,
      },
    },
  },
  play: async () => {
    await expectClosed('Delete Bedroom');
    await expectClosed('Expire my session');
    await expectClosed('Why the estimate changes');
  },
};

/* ---------------------------------------------------------------
 * Long body
 * --------------------------------------------------------------- */

const AFFECTED_ITEMS = [
  '12 saved products, in 3 lists.',
  'The “Move in October” budget of R$ 4.200.',
  'Two measurements saved by the fitter in March.',
  'One note: “the shelf above the bed needs the long anchors”.',
];

export const LongBody: Story = {
  name: 'Long Body (Only the Body Scrolls)',
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="error" appearance="outline" size="md">
          Delete Bedroom
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent size="md">
        <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
        <AlertDialogDescription>
          Four things go with the room. The products themselves stay in your lists.
        </AlertDialogDescription>

        <AlertDialogBody>
          {/* list-style is off in the app's global reset, so a list has to ask for its markers back. */}
          <ul style={{ margin: 0, paddingInlineStart: '1.25rem', listStyleType: 'revert' }}>
            {AFFECTED_ITEMS.map((item) => (
              <li key={item} style={{ marginBottom: '0.5rem' }}>
                {item}
              </li>
            ))}
          </ul>
        </AlertDialogBody>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="secondary" appearance="outline" size="md">
              Keep room
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="error" appearance="fill" size="md">
              Delete room
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When the consequence is a list, it goes in `AlertDialogBody`, and the dialog never grows past the viewport: the title and the description stay at the top, the two answers stay at the bottom, and only the body scrolls. Keep the description to the summary and the list to the items, so the reader hears the shape of it before reading the details.',
      },
      source: {
        code: `<AlertDialogContent size="md">
  <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
  <AlertDialogDescription>Four things go with the room.</AlertDialogDescription>

  <AlertDialogBody>
    <ul>{/* what is affected */}</ul>
  </AlertDialogBody>

  <AlertDialogFooter>…</AlertDialogFooter>
</AlertDialogContent>`,
      },
    },
  },
  play: async () => {
    await expectClosed('Delete Bedroom');
  },
};

/* ---------------------------------------------------------------
 * Session expired (recipe)
 * --------------------------------------------------------------- */

function ExpiredSessionDialog() {
  const [open, setOpen] = useState(false);
  const [signedInAt, setSignedInAt] = useState('');

  function signOut() {
    setSignedInAt('');
    setOpen(true);
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
      <Button variant="secondary" appearance="outline" size="md" onClick={signOut}>
        Expire my session
      </Button>

      <Text as="p" size="sm" role="status" style={{ margin: 0, minBlockSize: '1lh' }}>
        {signedInAt}
      </Text>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent initialFocus="action">
          <AlertDialogTitle>Your session expired</AlertDialogTitle>
          <AlertDialogDescription>
            Nothing was saved since your last change. Sign in again to keep working.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" appearance="outline" size="md">
                Not now
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="primary"
                appearance="fill"
                size="md"
                onClick={() => setSignedInAt('Signed in again.')}
              >
                Sign in
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const SessionExpired: Story = {
  name: 'Session Expired (A11y)',
  render: () => <ExpiredSessionDialog />,
  parameters: {
    docs: {
      description: {
        story:
          'Not every alert dialog opens from a trigger. This one opens when something happens to the page, so the app owns `open` and there is no `AlertDialogTrigger` — which means there is no button for Radix to hand the focus back to when the dialog closes, and the page has to be ready for wherever the focus lands next. The action answers and says what happened in a `role="status"` line; Escape and **Not now** change nothing.',
      },
      source: {
        code: `const [open, setOpen] = useState(false);

<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogContent initialFocus="action">
    <AlertDialogTitle>Your session expired</AlertDialogTitle>
    <AlertDialogDescription>Nothing was saved since your last change.</AlertDialogDescription>

    <AlertDialogFooter>
      <AlertDialogCancel asChild>
        <Button variant="secondary" appearance="outline" size="md">Not now</Button>
      </AlertDialogCancel>
      <AlertDialogAction asChild>
        <Button variant="primary" appearance="fill" size="md" onClick={signIn}>Sign in</Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Expire my session' })).toBeEnabled();
    await expect(page().queryByRole('alertdialog')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 *
 * Hidden from the sidebar and the docs page (`!dev`, `!autodocs`), so nobody
 * watches it run, but `npm run test:storybook` still plays it. It holds the
 * behaviour a visible story may not start by itself: opening, the focus on the
 * safe answer, the scrim that does not close, and Escape.
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          'Test-only: opens the delete dialog, checks that the focus starts on the safe answer, that the scrim does not close it, and that Escape gives the focus back to the button that opened it.',
      },
    },
  },
  play: async () => {
    await userEvent.click(page().getByRole('button', { name: 'Delete Bedroom' }));

    const dialog = await page().findByRole('alertdialog', { name: 'Delete “Bedroom”?' });
    await expect(page().getByRole('button', { name: 'Keep room' })).toHaveFocus();

    /* The alert dialog is owed an answer: the scrim is not one. The class name is hashed
       by CSS Modules in a real build, so the scrim is found by what sits under a corner of
       the screen — while a modal dialog is open Radix holds the page itself out of reach,
       so the only thing a click can meet there is the scrim. */
    const scrim = document.elementFromPoint(4, 4);
    await expect(scrim).not.toBeNull();
    await userEvent.click(scrim as Element);
    await expect(dialog).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    await expect(page().getByRole('button', { name: 'Delete Bedroom' })).toHaveFocus();
  },
};
