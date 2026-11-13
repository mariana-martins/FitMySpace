import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type { HeadingLevel } from '../Typography';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type AlertVariant = 'information' | 'success' | 'warning' | 'error';
export type AlertAppearance = 'soft' | 'fill';
export type AlertLive = 'polite' | 'assertive' | 'off';

/* ---------------------------------------------------------------
 * Props
 *
 * `Alert` is a status message: the four utility colours, an icon, an
 * optional title and the message itself. By default it is a live
 * region, so it announces itself when its text changes.
 *
 * The region is a `<div>` with `role="status"` (`live="polite"`) or
 * `role="alert"` (`live="assertive"`), and no role at all with
 * `live="off"`, for a fixed note that is on the page from the start.
 * No native element fits: `<output>` has the
 * implicit `status` role but only permits phrasing content, so it
 * cannot hold a heading and a paragraph, and its meaning is the
 * result of a calculation inside a form.
 *
 * The text only — MDN says `role="alert"` holds text, never
 * interactive elements, so a dismiss button does not belong inside.
 * Where a message must be closable, the pattern is an `alertdialog`,
 * which is a different component.
 * --------------------------------------------------------------- */

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'title'> {
  variant?: AlertVariant;
  appearance?: AlertAppearance;
  title?: string;
  headingLevel?: HeadingLevel;
  icon?: ReactElement;
  live?: AlertLive;
  children?: ReactNode;
}
