import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SelectItem } from '../Select';
import { createRef } from 'react';
import { SelectField } from './';

expect.extend(toHaveNoViolations);

// jsdom lacks the pointer-capture and scrolling APIs Radix Select calls.
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

const ROOM_OPTIONS = [
  <SelectItem key="bathroom" value="bathroom">
    Bathroom
  </SelectItem>,
  <SelectItem key="kitchen" value="kitchen">
    Kitchen
  </SelectItem>,
];

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('SelectField — label', () => {
  it('links the visible label to the select', () => {
    render(<SelectField label="Room">{ROOM_OPTIONS}</SelectField>);
    expect(screen.getByRole('combobox', { name: 'Room' }).tagName).toBe('BUTTON');
  });

  it('renders a real <label> element', () => {
    render(<SelectField label="Room">{ROOM_OPTIONS}</SelectField>);
    expect(screen.getByText('Room').closest('label')).toBeInTheDocument();
  });

  it('uses the given id', () => {
    render(
      <SelectField label="Room" id="room">
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'room');
  });

  it('forwards the ref to the trigger <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <SelectField label="Room" ref={ref}>
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('focuses and opens the select when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<SelectField label="Room">{ROOM_OPTIONS}</SelectField>);
    await user.click(screen.getByText('Room'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    // While the list is open, Radix hides the rest of the page from assistive technology.
    expect(screen.getByRole('combobox', { hidden: true })).toHaveAttribute('aria-expanded', 'true');
  });
});

/* ===============================================================
 * REQUIRED
 * =============================================================== */

describe('SelectField — required', () => {
  it('marks the select as required and shows a hidden-from-AT asterisk', () => {
    render(
      <SelectField label="Room" placeholder="Choose a room" required>
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(screen.getByRole('combobox', { name: 'Room' })).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });
});

/* ===============================================================
 * HINT AND ERROR
 * =============================================================== */

describe('SelectField — hint and error', () => {
  it('describes the select with the hint', () => {
    render(
      <SelectField label="Room" hint="Filters the results">
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(screen.getByRole('combobox')).toHaveAccessibleDescription('Filters the results');
  });

  it('marks the select invalid and reads hint then error', () => {
    render(
      <SelectField
        label="Room"
        hint="Filters the results"
        invalid
        error="Choose the room the product is for"
      >
        {ROOM_OPTIONS}
      </SelectField>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription(
      'Filters the results Error: Choose the room the product is for',
    );
  });

  it('requires an error message when invalid', () => {
    render(
      // @ts-expect-error -- `invalid` without `error` must not compile
      <SelectField label="Room" invalid>
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
  });

  it('does not use a live region for the error', () => {
    render(
      <SelectField label="Room" invalid error="Choose a room">
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not mark the select invalid when error is whitespace only', () => {
    render(
      <SelectField label="Room" invalid error="   ">
        {ROOM_OPTIONS}
      </SelectField>,
    );
    expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('SelectField — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <SelectField label="Room" hint="Filters the results" placeholder="All rooms">
          {ROOM_OPTIONS}
        </SelectField>
        <SelectField
          label="Store"
          placeholder="Choose a store"
          required
          invalid
          error="Choose a store"
        >
          {ROOM_OPTIONS}
        </SelectField>
        <SelectField label="Delivery" disabled>
          {ROOM_OPTIONS}
        </SelectField>
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
