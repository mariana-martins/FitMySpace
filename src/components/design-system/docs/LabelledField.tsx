import type { LabelSize } from '../ui/Typography';
import { Label } from '../ui/Typography';
import type { ReactNode } from 'react';
import { useId } from 'react';

/* ---------------------------------------------------------------
 * LabelledField (Storybook docs helper)
 *
 * Puts a visible <label> above a bare field (Input, Select) in the
 * stories of those components, so every example follows the rule
 * that a form control always has a visible label tied to it.
 * Not part of the public design system API: in an app, use
 * TextField or SelectField, or render the Label yourself.
 *
 * The id comes from useId, because a docs page renders every story
 * at once and repeated ids would tie a label to the wrong field.
 * --------------------------------------------------------------- */

export interface LabelledFieldProps {
  label: string;
  size?: LabelSize;
  children: (fieldId: string) => ReactNode;
}

export function LabelledField({ label, size = 'md', children }: LabelledFieldProps) {
  const fieldId = useId();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--ds-semantic-spacing-gap-sm)',
      }}
    >
      <Label as="label" htmlFor={fieldId} size={size}>
        {label}
      </Label>
      {children(fieldId)}
    </div>
  );
}
