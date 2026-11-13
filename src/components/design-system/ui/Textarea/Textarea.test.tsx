import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Label } from '../Typography';
import { createRef } from 'react';
import { Textarea } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('Textarea — label', () => {
  it('renders a native <textarea>', () => {
    render(<Textarea aria-label="Assembly notes" />);
    const textarea = screen.getByRole('textbox', { name: 'Assembly notes' });
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('forwards the ref to the <textarea>', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Assembly notes" />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('keeps the accessible description it is given', () => {
    render(
      <>
        <p id="notes-summary">Shown to the assembly team.</p>
        <Textarea aria-label="Assembly notes" aria-describedby="notes-summary" />
      </>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Shown to the assembly team.');
  });
});

/* ===============================================================
 * SIZE AND RESIZE
 * =============================================================== */

describe('Textarea — size and resize', () => {
  it('uses size md and vertical resize by default', () => {
    const { container } = render(<Textarea aria-label="Assembly notes" />);
    expect(container.firstChild).toHaveClass('size-md', 'resize-vertical');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size-%s class', (size) => {
    const { container } = render(<Textarea aria-label="Assembly notes" size={size} />);
    expect(container.firstChild).toHaveClass(`size-${size}`);
  });

  it.each(['none', 'vertical', 'both'] as const)('applies resize-%s class', (resize) => {
    const { container } = render(<Textarea aria-label="Assembly notes" resize={resize} />);
    expect(container.firstChild).toHaveClass(`resize-${resize}`);
  });
});

/* ===============================================================
 * NATIVE PROPS
 * =============================================================== */

describe('Textarea — native props', () => {
  it('shows four rows by default and honours the rows given', () => {
    render(<Textarea aria-label="Assembly notes" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4');
  });

  it('passes native attributes to the textarea', () => {
    render(<Textarea aria-label="Assembly notes" name="notes" rows={6} maxLength={280} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('name', 'notes');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toHaveAttribute('maxlength', '280');
  });

  it('keeps line breaks typed across lines', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Assembly notes" />);
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Two people.{Enter}{Enter}Start with the shelf.');
    expect(textarea).toHaveValue('Two people.\n\nStart with the shelf.');
  });

  it('disables the textarea', () => {
    render(<Textarea aria-label="Assembly notes" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('makes the textarea read-only', () => {
    render(<Textarea aria-label="Assembly notes" readOnly />);
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
  });
});

/* ===============================================================
 * INVALID
 * =============================================================== */

describe('Textarea — invalid', () => {
  it('marks the textarea invalid through the invalid prop', () => {
    const { container } = render(<Textarea aria-label="Assembly notes" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(container.firstChild).toHaveAttribute('data-invalid');
  });

  it('marks the textarea invalid through aria-invalid', () => {
    render(<Textarea aria-label="Assembly notes" aria-invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('is valid when there is no error', () => {
    render(<Textarea aria-label="Assembly notes" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Textarea — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <Label as="label" htmlFor="notes">
          Assembly notes
        </Label>
        <Textarea id="notes" placeholder="Anything the assembly team should know" />
        <Label as="label" htmlFor="delivery">
          Delivery instructions
        </Label>
        <Textarea id="delivery" invalid defaultValue="Gate code" />
        <Label as="label" htmlFor="cancelled">
          Cancelled field
        </Label>
        <Textarea id="cancelled" disabled />
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
