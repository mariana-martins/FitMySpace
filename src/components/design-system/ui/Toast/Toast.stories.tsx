import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { UTILITY_VARIANTS } from '../../utils';
import { Button } from '../Button';
import { useState } from 'react';

import type { ToastProps, ToastVariant } from './';

const meta = {
  title: 'Design System/Components/Feedback/Toast',
  component: Toast,
  tags: ['autodocs'],
  args: {
    variant: 'success',
  },
  parameters: {
    controls: { include: ['variant'] },
    docs: {
      // A docs page draws each story in a box with a transform, which makes the
      // box, not the screen, what the fixed stack is placed against: the box has
      // to be tall enough for the card it raises, or the card is cut off.
      story: { height: '320px' },
      description: {
        component:
          'A `Toast` tells the reader something happened while they were somewhere else: a save that finished, a sync that failed, a background job that came in. It is built on Radix Toast, which is the W3C toast pattern: one labelled region the cards stack in, a hidden live region per card for the announcement, and a hotkey (F8) that moves focus *into* the region instead of the card stealing focus from wherever the reader was.\n\n' +
          "You compose it: `ToastProvider` once around the app, `ToastViewport` once where the stack should live, then a `Toast` with `ToastTitle`, an optional `ToastDescription`, an optional `ToastAction` and a `ToastClose`. The app decides when a card is open — Radix has no imperative API, and that is the point: the queue, its order and how many cards stay on screen are app state (`src/hooks/`), not the design system's.\n\n" +
          '### Best Practices\n' +
          '- **A toast is for something that already happened:** the save, the upload, the sync. A message the reader has to act on where they are standing — a form that failed, a limit they hit — is an `Alert` in the page, next to the thing it describes.\n' +
          '- **Never put an `Alert` inside a toast, and never a toast inside a `Dialog`:** the card floats over everything and pulls the reader out of the thing they are doing. A dialog shows its own errors in its own body.\n' +
          '- **Leave the timer off unless you must:** the default is no auto-dismiss, because a card that vanishes mid-sentence is a card nobody read. Count down only for a low-importance confirmation, and give it 6–8 seconds — the timer pauses while the pointer is over the card or focus is inside it.\n' +
          '- **Say what the action does in `altText`:** the reader hears the announcement long before they can reach the button, and the button is reached by pressing it, which also closes the card.\n' +
          '- **Keep the queue short:** three cards is the most a screen can hold at a small text size. The app drops or merges older ones; the viewport only stops the stack from running off the top of the screen.\n' +
          '- **One `ToastViewport`, one `ToastProvider`:** Radix renders the cards into the viewport, and shows nothing at all without one.\n\n' +
          '### Key Features\n' +
          '- **Four variants, the Alert\'s colours** — the same tier-2 tokens as `Alert`\'s soft appearance, so "saved" looks the same in the page and floating over it.\n' +
          '- **Loudness that follows the variant** — `type` defaults to `foreground` (assertive) for an error or a warning and `background` (polite) for a confirmation; MDN says `alert` "must be used sparingly".\n' +
          '- **The card is not the live region** — Radix announces through a hidden region of its own, which is what lets the card hold a button: MDN says `role="alert"` holds text, not controls.\n' +
          '- **Above the dialog** — `semantic.layer.toast`, over `layer.floating`, so a tooltip explaining a button in the card still shows.\n' +
          '- **Slides in and out** — the card arrives from the screen edge and leaves the same way, by itself or by a swipe; bottom-right, or bottom-centre on a phone, clear of the home indicator through `env(safe-area-inset-*)`.\n' +
          '- **Reduced motion and `forced-colors`** — the card stops moving when asked, and draws its own edge when the system drops shadows.\n\n' +
          '### Patterns\n' +
          '- [Dialog Form](?path=/docs/design-system-patterns-dialog-form--docs) — a short form in a dialog, then a toast once the dialog has closed.',
      },
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/*
 * The plays only check the resting state. A play runs as soon as the page loads, so
 * one that raised and closed a card showed it flying past before anyone pressed a
 * button. Raising, announcing, the action and the timer are covered in Toast.test.tsx.
 */
async function expectRestingStack(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole('region', { name: /Notifications/ })).toBeInTheDocument();
  await expect(canvas.queryByRole('listitem')).not.toBeInTheDocument();
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

function SaveRoomToast({ variant }: Pick<ToastProps, 'variant'>) {
  const [saved, setSaved] = useState(false);

  return (
    <ToastProvider>
      <Button variant="primary" appearance="fill" size="md" onClick={() => setSaved(true)}>
        Save room
      </Button>

      <ToastViewport />

      <Toast open={saved} onOpenChange={setSaved} variant={variant}>
        <ToastTitle>Room saved</ToastTitle>
        <ToastDescription>The name shows up in your list of rooms.</ToastDescription>
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}

export const Default: Story = {
  args: {
    variant: 'success',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [...UTILITY_VARIANTS],
      description: 'The four utility messages, in the same colours as `Alert`.',
    },
    type: {
      control: false,
      description:
        "How loudly the card is announced. Defaults to the variant's own: `foreground` (assertive) for an error or a warning, `background` (polite) for a confirmation.",
    },
    duration: {
      control: false,
      description:
        'Milliseconds before the card closes itself. Off by default; pass 6000–8000 for a low-importance confirmation.',
    },
    icon: {
      control: false,
      description: "A registered icon in place of the variant's own. Decorative either way.",
    },
  },
  render: (args) => <SaveRoomToast {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. Press "Save room" to raise a card: it slides in at the bottom-right and stays until it is dismissed. Nothing is focused, so the reader keeps typing where they were.',
      },
      source: {
        code: `<ToastProvider>
  <Button variant="primary" appearance="fill" size="md" onClick={() => setSaved(true)}>Save room</Button>

  <ToastViewport />

  <Toast open={saved} onOpenChange={setSaved} variant="success">
    <ToastTitle>Room saved</ToastTitle>
    <ToastDescription>The name shows up in your list of rooms.</ToastDescription>
    <ToastClose />
  </Toast>
</ToastProvider>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expectRestingStack(canvasElement);
    await expect(within(canvasElement).getByRole('button', { name: 'Save room' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * All variants
 * --------------------------------------------------------------- */

const VARIANTS: { variant: ToastVariant; trigger: string; title: string; detail: string }[] = [
  {
    variant: 'information',
    trigger: 'Raise an information',
    title: '3 items are still syncing',
    detail: 'They show up as soon as the upload finishes.',
  },
  {
    variant: 'success',
    trigger: 'Raise a success',
    title: 'Room saved',
    detail: 'The name shows up in your list of rooms.',
  },
  {
    variant: 'warning',
    trigger: 'Raise a warning',
    title: 'Only one shelf left on this wall',
    detail: 'The next item will not fit.',
  },
  {
    variant: 'error',
    trigger: 'Raise an error',
    title: 'Could not save the room',
    detail: 'Check your connection and try again.',
  },
];

export const AllVariants: Story = {
  render: () => (
    <ToastProvider>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {VARIANTS.map(({ variant, trigger, title, detail }) => (
          <VariantTrigger
            key={variant}
            variant={variant}
            trigger={trigger}
            title={title}
            detail={detail}
          />
        ))}
      </div>

      <ToastViewport />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The four utility messages, in the same colours as the `Alert` of the same variant. An error or a warning is announced over whatever the reader was hearing; an information or a confirmation waits for their next pause.',
      },
      source: {
        code: `<Toast variant="error">
  <ToastTitle>Could not save the room</ToastTitle>
  <ToastDescription>Check your connection and try again.</ToastDescription>
  <ToastClose />
</Toast>`,
      },
    },
  },
  // The page waits for the reader: no card until a button is pressed.
  play: async ({ canvasElement }) => {
    await expectRestingStack(canvasElement);
    await expect(
      within(canvasElement).getByRole('button', { name: 'Raise an information' }),
    ).toBeEnabled();
    await expect(
      within(canvasElement).getByRole('button', { name: 'Raise a success' }),
    ).toBeEnabled();
    await expect(
      within(canvasElement).getByRole('button', { name: 'Raise a warning' }),
    ).toBeEnabled();
    await expect(
      within(canvasElement).getByRole('button', { name: 'Raise an error' }),
    ).toBeEnabled();
  },
};

function VariantTrigger({
  variant,
  trigger,
  title,
  detail,
}: {
  variant: ToastVariant;
  trigger: string;
  title: string;
  detail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        appearance="outline"
        size="md"
        onClick={() => setOpen((current) => !current)}
      >
        {trigger}
      </Button>

      <Toast open={open} onOpenChange={setOpen} variant={variant}>
        <ToastTitle>{title}</ToastTitle>
        <ToastDescription>{detail}</ToastDescription>
        <ToastClose />
      </Toast>
    </>
  );
}

/* ---------------------------------------------------------------
 * With an action
 * --------------------------------------------------------------- */

export const WithAction: Story = {
  name: 'With an Action',
  render: () => (
    <ToastProvider>
      <ActionToast />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'One thing the reader can do about the message, and pressing it closes the card. `altText` says in a full phrase what the button does: the reader hears the announcement seconds before they can reach the button, and "Undo" on its own says nothing about undoing what. The visible word stays short because the card is small.',
      },
      source: {
        code: `<Toast variant="warning">
  <ToastTitle>Removed 3 items</ToastTitle>
  <ToastDescription>They are gone from the shelf, not from your account.</ToastDescription>
  <ToastAction altText="Undo removing the 3 items">Undo</ToastAction>
</Toast>`,
      },
    },
  },
  // The page waits for the reader: no card until a button is pressed.
  play: async ({ canvasElement }) => {
    await expectRestingStack(canvasElement);
    await expect(within(canvasElement).getByRole('button', { name: 'Remove items' })).toBeEnabled();
  },
};

function ActionToast() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" appearance="outline" size="md" onClick={() => setOpen(true)}>
        Remove items
      </Button>

      <ToastViewport />

      <Toast open={open} onOpenChange={setOpen} variant="warning">
        <ToastTitle>Removed 3 items</ToastTitle>
        <ToastDescription>They are gone from the shelf, not from your account.</ToastDescription>
        <ToastAction altText="Undo removing the 3 items">Undo</ToastAction>
      </Toast>
    </>
  );
}

/* ---------------------------------------------------------------
 * Closing on its own
 * --------------------------------------------------------------- */

export const AutoDismiss: Story = {
  name: 'Closing on Its Own (Rare)',
  render: () => (
    <ToastProvider>
      <TimedToast />
    </ToastProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The only card allowed to leave on its own is a low-importance confirmation, and then 6 to 8 seconds: enough to read twice. The timer pauses while the pointer is over the card or focus is inside it, so nothing is lost mid-sentence. Anything the reader might act on — an action, an error, a warning — has no timer at all.\n\n' +
          'This demo closes after 3 seconds so you can watch it slide out without waiting; the code below shows the 7 seconds to use in the app.',
      },
      source: {
        code: `<Toast open={copied} onOpenChange={setCopied} variant="success" duration={7000}>
  <ToastTitle>Link copied</ToastTitle>
</Toast>`,
      },
    },
  },
  // The page waits for the reader: no card until a button is pressed.
  play: async ({ canvasElement }) => {
    await expectRestingStack(canvasElement);
    await expect(within(canvasElement).getByRole('button', { name: 'Copy link' })).toBeEnabled();
  },
};

function TimedToast() {
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Button variant="secondary" appearance="outline" size="md" onClick={() => setCopied(true)}>
        Copy link
      </Button>

      <ToastViewport />

      {/* Shorter than the 6–8s the app uses, only so the demo leaves while you watch. */}
      <Toast open={copied} onOpenChange={setCopied} variant="success" duration={3000}>
        <ToastTitle>Link copied</ToastTitle>
        <ToastClose />
      </Toast>
    </>
  );
}

/* ---------------------------------------------------------------
 * Several at once (recipe)
 * --------------------------------------------------------------- */

const QUEUE: { variant: ToastVariant; title: string; detail: string }[] = [
  { variant: 'success', title: 'Room saved', detail: 'The name shows up in your list of rooms.' },
  {
    variant: 'information',
    title: '3 items are still syncing',
    detail: 'They show up as soon as the upload finishes.',
  },
  {
    variant: 'error',
    title: 'Could not save the room',
    detail: 'Check your connection and try again.',
  },
];

export const SeveralAtOnce: Story = {
  name: 'Several at Once',
  render: () => (
    <ToastProvider>
      <ToastViewport />

      {QUEUE.map(({ variant, title, detail }) => (
        <Toast key={title} defaultOpen variant={variant}>
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{detail}</ToastDescription>
          <ToastClose />
        </Toast>
      ))}
    </ToastProvider>
  ),
  parameters: {
    docs: {
      story: { height: '520px' },
      description: {
        story:
          "Cards stack from the bottom edge upwards, newest nearest it. How many are on screen, and what happens to the older ones, is the app's queue — in `src/hooks/`, next to the queries that raise them. The viewport itself only stops a long stack from running past the top of the screen: it then scrolls inside itself, and the region's hotkey (F8) moves focus into it so the cards can be read one at a time.",
      },
      source: {
        code: `{queue.map((message) => (
  <Toast key={message.id} open onOpenChange={close(message.id)} variant={message.variant}>
    <ToastTitle>{message.title}</ToastTitle>
    <ToastDescription>{message.detail}</ToastDescription>
    <ToastClose />
  </Toast>
))}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Newest last in the source, so it sits nearest the bottom edge.
    const region = canvas.getByRole('region', { name: /Notifications/ });
    const titles = within(region)
      .getAllByRole('listitem')
      .map((card) => card.textContent);
    await expect(titles).toHaveLength(3);
    await expect(titles[2]).toContain('Could not save the room');
  },
};
