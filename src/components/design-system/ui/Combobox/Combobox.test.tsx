import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';
import { Combobox } from './';

import type { ComboboxOption, ComboboxProps } from './';
import type { Ref } from 'react';

expect.extend(toHaveNoViolations);

// jsdom does not lay anything out, so it has no scrollIntoView; the highlight calls it.
beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

const ROOMS: ComboboxOption[] = [
  { value: 'bathroom', label: 'Bathroom', icon: 'bath' },
  { value: 'bedroom', label: 'Bedroom', icon: 'bed', description: '12 saved products' },
  { value: 'kitchen', label: 'Kitchen', icon: 'cooking-pot', disabled: true },
  { value: 'living-room', label: 'Living room', icon: 'sofa' },
];

type FixtureProps = Partial<Omit<ComboboxProps, 'invalid' | 'error'>> & {
  inputRef?: Ref<HTMLInputElement>;
};

/** A room search that filters the rooms by what is typed, as the app would. */
function RoomCombobox({ inputRef, ...props }: FixtureProps) {
  const [query, setQuery] = useState('');
  const options = ROOMS.filter((room) => room.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <Combobox
      ref={inputRef}
      label="Room"
      options={options}
      inputValue={query}
      onInputValueChange={setQuery}
      emptyMessage="No rooms match"
      {...props}
    />
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Combobox — rendering', () => {
  it('renders a labelled, collapsed combobox', () => {
    render(<RoomCombobox />);
    const input = screen.getByRole('combobox', { name: 'Room' });

    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(input).toHaveAttribute('aria-autocomplete', 'list');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('forwards the ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<RoomCombobox inputRef={ref} />);

    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('wires the hint and the error like a TextField', () => {
    render(
      <Combobox
        label="Room"
        options={[]}
        hint="Pick a room you saved"
        invalid
        error="Pick a room"
      />,
    );

    expect(screen.getByRole('combobox')).toHaveAccessibleDescription(
      'Pick a room you saved Error: Pick a room',
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});

/* ===============================================================
 * TYPING AND POINTER
 * =============================================================== */

describe('Combobox — typing and pointer', () => {
  it('opens the suggestions while typing, keeps the focus, and says how many', async () => {
    const user = userEvent.setup();
    render(<RoomCombobox />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'b');

    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-expanded', 'true');
    expect(input).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Bathroom',
      'Bedroom12 saved products',
    ]);
    expect(screen.getByRole('status')).toHaveTextContent('2 suggestions');
  });

  it('shows the empty message when nothing matches, and says it', async () => {
    const user = userEvent.setup();
    render(<RoomCombobox />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'garage');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByRole('status')).toHaveTextContent('No rooms match');
  });

  it('picks an option with the pointer and writes its label into the field', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    render(<RoomCombobox onOptionSelect={handleSelect} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'liv');
    await user.click(screen.getByRole('option', { name: 'Living room' }));

    expect(input).toHaveValue('Living room');
    expect(input).toHaveFocus();
    expect(handleSelect).toHaveBeenCalledWith(ROOMS[3]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('ignores a click on a disabled option', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    render(<RoomCombobox onOptionSelect={handleSelect} />);

    await user.type(screen.getByRole('combobox'), 'kit');
    const kitchen = screen.getByRole('option', { name: 'Kitchen' });
    expect(kitchen).toHaveAttribute('aria-disabled', 'true');

    await user.click(kitchen);
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('closes when the field loses the focus', async () => {
    const user = userEvent.setup();
    render(
      <>
        <RoomCombobox />
        <button type="button">Next</button>
      </>,
    );

    await user.type(screen.getByRole('combobox'), 'b');
    await user.tab();

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });
});

/* ===============================================================
 * KEYBOARD
 * =============================================================== */

describe('Combobox — keyboard', () => {
  it('opens on ArrowDown and moves the highlight, skipping disabled options and wrapping', async () => {
    const user = userEvent.setup();
    render(<RoomCombobox />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Bathroom' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(input).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Bathroom' }).id,
    );

    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Living room' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('option', { name: 'Bathroom' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('option', { name: 'Living room' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('opens on Alt+ArrowDown without moving the highlight', async () => {
    const user = userEvent.setup();
    render(<RoomCombobox />);
    const input = screen.getByRole('combobox');

    await user.click(input);
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-activedescendant');
  });

  it('picks the highlighted option with Enter', async () => {
    const user = userEvent.setup();
    const handleSelect = jest.fn();
    render(<RoomCombobox onOptionSelect={handleSelect} />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'bed');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(input).toHaveValue('Bedroom');
    expect(handleSelect).toHaveBeenCalledWith(ROOMS[1]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('leaves Enter to the form when nothing is highlighted', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn((event: SubmitEvent) => event.preventDefault());
    render(
      <form onSubmit={(event) => handleSubmit(event.nativeEvent)}>
        <RoomCombobox />
      </form>,
    );

    await user.type(screen.getByRole('combobox'), 'bath{Enter}');
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape, then empties the field on a second Escape', async () => {
    const user = userEvent.setup();
    render(<RoomCombobox />);
    const input = screen.getByRole('combobox');

    await user.type(input, 'b');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(input).toHaveValue('b');

    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Combobox — accessibility', () => {
  it('has no axe violations while closed', async () => {
    const { container } = render(<RoomCombobox />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with the list open and an option highlighted', async () => {
    const user = userEvent.setup();
    const { container } = render(<RoomCombobox />);

    await user.type(screen.getByRole('combobox'), 'b');
    await user.keyboard('{ArrowDown}');

    // The list sits in a portal at the end of <body>, outside the field: check both.
    expect(await axe(container)).toHaveNoViolations();
    expect(await axe(screen.getByRole('listbox'))).toHaveNoViolations();
  });
});
