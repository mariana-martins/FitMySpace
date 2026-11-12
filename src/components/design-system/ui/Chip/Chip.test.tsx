import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';
import { Bath } from 'lucide-react';
import { Chip } from './';

expect.extend(toHaveNoViolations);

function ToggleChip({ initiallySelected = false }: { initiallySelected?: boolean }) {
  const [isSelected, setIsSelected] = useState(initiallySelected);
  return (
    <Chip size="md" selected={isSelected} onSelectedChange={setIsSelected}>
      Bathroom
    </Chip>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Chip — rendering', () => {
  it('renders a native toggle button named by its text', () => {
    render(
      <Chip size="md" selected={false}>
        Bathroom
      </Chip>,
    );
    const chip = screen.getByRole('button', { name: 'Bathroom' });
    expect(chip.tagName).toBe('BUTTON');
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('forwards the ref to the <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Chip ref={ref} size="md" selected={false}>
        Bathroom
      </Chip>,
    );
    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('applies the size class and merges the class name', () => {
    render(
      <Chip size="sm" selected={false} className="custom">
        Bathroom
      </Chip>,
    );
    expect(screen.getByRole('button')).toHaveClass('size-sm', 'custom');
  });

  it('requires visible text', () => {
    // @ts-expect-error -- a chip without text has no accessible name
    render(<Chip size="md" selected={false} />);
  });
});

/* ===============================================================
 * SELECTION
 * =============================================================== */

describe('Chip — selection', () => {
  it('toggles aria-pressed on click, Enter and Space', async () => {
    const user = userEvent.setup();
    render(<ToggleChip />);
    const chip = screen.getByRole('button', { name: 'Bathroom' });

    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard(' ');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('keeps the same accessible name in both states', async () => {
    const user = userEvent.setup();
    render(<ToggleChip />);
    await user.click(screen.getByRole('button', { name: 'Bathroom' }));
    expect(screen.getByRole('button', { name: 'Bathroom', pressed: true })).toBeInTheDocument();
  });

  it('shows a decorative check mark in place of the icon while selected', () => {
    const { container, rerender } = render(
      <Chip size="md" selected={false} icon={<Bath data-testid="room-icon" />}>
        Bathroom
      </Chip>,
    );
    expect(screen.getByTestId('room-icon')).toBeInTheDocument();

    rerender(
      <Chip size="md" selected icon={<Bath data-testid="room-icon" />}>
        Bathroom
      </Chip>,
    );
    expect(screen.queryByTestId('room-icon')).not.toBeInTheDocument();
    const checkMark = container.querySelector('svg');
    expect(checkMark?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('calls onClick first and skips the change when it prevents the default', async () => {
    const user = userEvent.setup();
    const handleSelectedChange = jest.fn();
    render(
      <Chip
        size="md"
        selected={false}
        onClick={(event) => event.preventDefault()}
        onSelectedChange={handleSelectedChange}
      >
        Bathroom
      </Chip>,
    );
    await user.click(screen.getByRole('button'));
    expect(handleSelectedChange).not.toHaveBeenCalled();
  });

  it('cannot be toggled when disabled', async () => {
    const user = userEvent.setup();
    const handleSelectedChange = jest.fn();
    render(
      <Chip size="md" selected={false} disabled onSelectedChange={handleSelectedChange}>
        Bathroom
      </Chip>,
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();
    expect(handleSelectedChange).not.toHaveBeenCalled();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Chip — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <div role="group" aria-label="Rooms">
        <Chip size="md" selected={false} icon={<Bath />}>
          Bathroom
        </Chip>
        <Chip size="md" selected>
          Kitchen
        </Chip>
        <Chip size="sm" selected={false} disabled>
          Garage
        </Chip>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
