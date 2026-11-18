import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../../ui/Toast';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmptyState } from '../../ui/EmptyState';
import { List, ListItem } from '../../ui/List';
import { Heading } from '../../ui/Typography';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';

/* ---------------------------------------------------------------
 * Remove with undo (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Remove with Undo',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Taking something out of a list at once, with a way back: the item goes, a toast says so, and "Undo" puts it back where it was.\n\n' +
          '### What It Solves\n' +
          'A question before every small removal ("Are you sure?") slows everyone down and is clicked through without reading. When the removal is easy to reverse, doing it straight away and offering Undo is faster and safer. The hard part is the focus: the button that was pressed disappears, and Undo must bring the item back to the same place.\n\n' +
          '### When to Use\n' +
          '- **Removals that cost nothing to reverse:** an item from a saved list, a filter, a product from a comparison.\n' +
          '- **Not for:** anything that cannot be brought back or takes other things with it — ask first (see Delete Confirmation).\n\n' +
          '### Anatomy\n' +
          '- A `Heading` and a `List`; each `ListItem` has the product name as its title and an outline `Button` "Remove" at the end, whose name includes the item.\n' +
          '- One `Toast` (`success`, polite) for the last removal, with `ToastTitle`, `ToastDescription`, a `ToastAction` "Undo" and `ToastClose`.\n' +
          '- An `EmptyState` once the list is empty.\n\n' +
          '### Accessibility\n' +
          "- **The focus moves on after a removal:** to the next item's Remove button, the previous one at the end of the list, or the heading when the list is empty.\n" +
          '- **"Undo" says what it undoes:** the `altText` ("Undo removing Oak wall shelf from your saved list") is read with the announcement, because the button itself is reached later, if at all.\n' +
          '- **Undo puts the item back where it was** and moves the focus to its Remove button, so people can carry on from it.\n' +
          '- **The toast does not time out:** an Undo that vanishes while someone is still reading is an Undo they never had. A new removal replaces it, so the stack never grows.\n\n' +
          '### In the App\n' +
          '- Remove the item at once, optimistically, and send the request. Undo cancels it or sends the reverse. The toast queue lives in `src/hooks/`.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SAVED_ITEMS = ['Bamboo shower caddy', 'Oak wall shelf', 'Linen storage box', 'Woven basket'];

interface Removal {
  item: string;
  index: number;
}

function SavedList() {
  const [items, setItems] = useState(SAVED_ITEMS);
  const [lastRemoval, setLastRemoval] = useState<Removal | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const removeButtons = useRef(new Map<string, HTMLButtonElement>());
  /* The item whose Remove button takes the focus after the next render; '' is the heading. */
  const focusAfterRender = useRef<string | null>(null);

  function registerButton(item: string) {
    return (button: HTMLButtonElement | null) => {
      if (button) removeButtons.current.set(item, button);
      else removeButtons.current.delete(item);
      if (button && focusAfterRender.current === item) {
        focusAfterRender.current = null;
        button.focus();
      }
    };
  }

  function remove(item: string) {
    const index = items.indexOf(item);
    const remaining = items.filter((savedItem) => savedItem !== item);
    const next = remaining[index] ?? remaining[index - 1];
    setItems(remaining);
    setLastRemoval({ item, index });
    setToastOpen(true);
    if (next) {
      removeButtons.current.get(next)?.focus();
    } else {
      headingRef.current?.focus();
    }
  }

  function undo() {
    if (!lastRemoval) return;
    const { item, index } = lastRemoval;
    setItems((current) => [...current.slice(0, index), item, ...current.slice(index)]);
    // The button comes back on the next render; its ref callback takes the focus then.
    focusAfterRender.current = item;
    setLastRemoval(null);
  }

  return (
    <ToastProvider>
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
          Your saved products
        </Heading>

        {items.length > 0 ? (
          <List aria-label="Saved products">
            {items.map((item) => (
              <ListItem
                key={item}
                trailing={
                  <Button
                    ref={registerButton(item)}
                    variant="secondary"
                    appearance="outline"
                    size="sm"
                    onClick={() => remove(item)}
                  >
                    Remove<VisuallyHidden> {item}</VisuallyHidden>
                  </Button>
                }
              >
                {item}
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyState
            title="Nothing saved yet"
            headingLevel={3}
            icon="star"
            description="Press Save on a product to keep it here."
          />
        )}
      </div>

      <ToastViewport />

      {lastRemoval && (
        <Toast
          key={lastRemoval.item}
          open={toastOpen}
          onOpenChange={setToastOpen}
          variant="success"
          type="background"
        >
          <ToastTitle>Removed from your list</ToastTitle>
          <ToastDescription>{lastRemoval.item}</ToastDescription>
          <ToastAction
            altText={`Undo removing ${lastRemoval.item} from your saved list`}
            onClick={undo}
          >
            Undo
          </ToastAction>
          <ToastClose />
        </Toast>
      )}
    </ToastProvider>
  );
}

/* ---------------------------------------------------------------
 * Remove with undo
 * --------------------------------------------------------------- */

export const RemoveWithUndo: Story = {
  name: 'Remove with Undo (A11y)',
  render: () => <SavedList />,
  parameters: {
    docs: {
      description: {
        story:
          'Remove "Oak wall shelf": it goes at once, the focus moves to "Remove Linen storage box", and a toast offers Undo. Press Undo: the shelf comes back in its place, with the focus on its button.',
      },
      source: {
        code: `function remove(item) {
  const next = itemAfter(item) ?? itemBefore(item);
  removeItem.mutate(item); // optimistic
  showToast({ item, index });
  next ? focusRemoveButton(next) : headingRef.current?.focus();
}

<ListItem
  trailing={
    <Button variant="secondary" appearance="outline" size="sm" onClick={() => remove(item)}>
      Remove<VisuallyHidden> {item}</VisuallyHidden>
    </Button>
  }
>
  {item}
</ListItem>

<Toast key={lastRemoval.item} open={toastOpen} onOpenChange={setToastOpen} variant="success" type="background">
  <ToastTitle>Removed from your list</ToastTitle>
  <ToastDescription>{lastRemoval.item}</ToastDescription>
  <ToastAction altText={\`Undo removing \${lastRemoval.item} from your saved list\`} onClick={undo}>
    Undo
  </ToastAction>
  <ToastClose />
</Toast>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Your saved products' })).toBeVisible();
    await expect(canvas.getAllByRole('button', { name: /^Remove / })).toHaveLength(4);
    await expect(canvas.getByRole('button', { name: 'Remove Oak wall shelf' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * Remove with Undo (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const RemoveWithUndoInteraction: Story = {
  ...RemoveWithUndo,
  name: 'Remove with Undo (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);

    await userEvent.click(canvas.getByRole('button', { name: 'Remove Oak wall shelf' }));
    // The toast repeats the name, so check the list itself: its Remove button is gone.
    await expect(
      canvas.queryByRole('button', { name: 'Remove Oak wall shelf' }),
    ).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Remove Linen storage box' })).toHaveFocus();

    await userEvent.click(await page.findByRole('button', { name: 'Undo' }));
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Remove Oak wall shelf' })).toHaveFocus(),
    );
    const restored = canvas.getByRole('button', { name: 'Remove Oak wall shelf' });
    const savedList = restored.closest('ul');
    await expect(savedList?.children[1]).toHaveTextContent('Oak wall shelf');
  },
};
