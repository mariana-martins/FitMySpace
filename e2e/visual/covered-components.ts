/*
 * The stories the visual run screenshots: the components the app is about to adopt, plus the ones a
 * token change reaches through a shared role (`semantic.size.control.*` heights, the focus ring, the
 * overlay layers). Every story of these components is captured, including the `Pseudo States` ones,
 * so a colour token that shifts fails the run before a migration PR builds on it.
 *
 * A name here that no longer matches a Storybook page fails the run: coverage must not shrink in
 * silence when a component is renamed.
 */
export const VISUAL_COMPONENT_NAMES = [
  'Button',
  'Input',
  'List',
  'Dialog',
  'Toast',
  'AlertDialog',
  'Tabs',
  'Popover',
  'Sheet',
  'Combobox',
];

/*
 * Overlays render only their trigger until they open, so their screenshots open them first: click the
 * story's first button and wait for what it opens. A combobox opens its list from the keyboard.
 * A toast is found by its place in the Notifications region: the `status` role belongs to Radix's
 * hidden announcer, so looking for it once clicked the close button of a toast already on screen.
 * `keepClosed` lists the stories (by the part of the id after `--`) whose closed state is the point.
 */
type Opener = {
  opens: 'dialog' | 'alertdialog' | 'toast' | 'listbox';
  keepClosed?: string[];
};

export const OPEN_BEFORE_SCREENSHOT: Record<string, Opener> = {
  Dialog: { opens: 'dialog' },
  Sheet: { opens: 'dialog' },
  Popover: { opens: 'dialog' },
  AlertDialog: { opens: 'alertdialog' },
  Toast: { opens: 'toast' },
  Combobox: { opens: 'listbox', keepClosed: ['pseudo-states', 'with-error'] },
};
