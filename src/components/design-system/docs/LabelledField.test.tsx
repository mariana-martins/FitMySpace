import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LabelledField } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('LabelledField — label', () => {
  it('names the field with its visible label', () => {
    render(<LabelledField label="Room name">{(fieldId) => <input id={fieldId} />}</LabelledField>);
    expect(screen.getByRole('textbox', { name: 'Room name' })).toBeInTheDocument();
    expect(screen.getByText('Room name').tagName).toBe('LABEL');
  });

  it('gives each field its own id, so labels never point to the wrong field', () => {
    render(
      <>
        <LabelledField label="Width">{(fieldId) => <input id={fieldId} />}</LabelledField>
        <LabelledField label="Depth">{(fieldId) => <input id={fieldId} />}</LabelledField>
      </>,
    );
    const width = screen.getByRole('textbox', { name: 'Width' });
    const depth = screen.getByRole('textbox', { name: 'Depth' });
    expect(width.id).not.toBe(depth.id);
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('LabelledField — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <LabelledField label="Room name">{(fieldId) => <input id={fieldId} />}</LabelledField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
