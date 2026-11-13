import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TextareaField } from './';
import { createRef } from 'react';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('TextareaField — label', () => {
  it('links the visible label to the textarea', () => {
    render(<TextareaField label="Assembly notes" />);
    const textarea = screen.getByLabelText('Assembly notes');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders a real <label> element', () => {
    render(<TextareaField label="Assembly notes" />);
    expect(screen.getByText('Assembly notes').closest('label')).toBeInTheDocument();
  });

  it('uses the given id', () => {
    render(<TextareaField label="Assembly notes" id="assembly-notes" />);
    expect(screen.getByLabelText('Assembly notes')).toHaveAttribute('id', 'assembly-notes');
  });

  it('forwards the ref to the <textarea>', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextareaField label="Assembly notes" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText('Assembly notes'));
  });
});

/* ===============================================================
 * REQUIRED
 * =============================================================== */

describe('TextareaField — required', () => {
  it('marks the textarea as required and shows a hidden-from-AT asterisk', () => {
    render(<TextareaField label="Assembly notes" required />);
    const textarea = screen.getByRole('textbox', { name: 'Assembly notes' });
    expect(textarea).toBeRequired();
    expect(textarea).not.toHaveAttribute('aria-required');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows no asterisk when optional', () => {
    render(<TextareaField label="Assembly notes" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * HINT AND ERROR
 * =============================================================== */

describe('TextareaField — hint and error', () => {
  it('only accepts plain text as the hint', () => {
    // @ts-expect-error -- the hint is the accessible description: text only, no markup
    render(<TextareaField label="Assembly notes" hint={<strong>Up to 280 characters</strong>} />);
    expect(screen.getByLabelText('Assembly notes')).toBeInTheDocument();
  });

  it('describes the textarea with the hint', () => {
    render(<TextareaField label="Assembly notes" hint="Up to 280 characters" />);
    expect(screen.getByLabelText('Assembly notes')).toHaveAccessibleDescription(
      'Up to 280 characters',
    );
  });

  it('requires an error message when invalid', () => {
    // @ts-expect-error -- `invalid` without `error` must not compile
    render(<TextareaField label="Assembly notes" invalid />);
    expect(screen.getByLabelText('Assembly notes')).toBeInTheDocument();
  });

  it('marks the textarea invalid and reads hint then error', () => {
    render(
      <TextareaField
        label="Assembly notes"
        hint="Up to 280 characters"
        invalid
        error="Describe the delivery in 280 characters or fewer"
      />,
    );
    const textarea = screen.getByLabelText('Assembly notes');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription(
      'Up to 280 characters Error: Describe the delivery in 280 characters or fewer',
    );
  });

  it('does not use a live region for the error', () => {
    render(<TextareaField label="Assembly notes" invalid error="Describe the delivery again" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('is valid when there is no error', () => {
    render(<TextareaField label="Assembly notes" />);
    expect(screen.getByLabelText('Assembly notes')).not.toHaveAttribute('aria-invalid');
  });

  it('does not mark the textarea invalid when error is whitespace only', () => {
    render(<TextareaField label="Assembly notes" invalid error="   " />);
    expect(screen.getByLabelText('Assembly notes')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * PASS-THROUGH
 * =============================================================== */

describe('TextareaField — native props', () => {
  it('passes native attributes to the textarea', () => {
    render(<TextareaField label="Assembly notes" name="notes" rows={6} maxLength={280} />);
    const textarea = screen.getByLabelText('Assembly notes');
    expect(textarea).toHaveAttribute('name', 'notes');
    expect(textarea).toHaveAttribute('rows', '6');
    expect(textarea).toHaveAttribute('maxlength', '280');
  });

  it('sends the size and resize to the field, not to the wrapper', () => {
    render(<TextareaField label="Assembly notes" size="lg" resize="none" />);
    const textarea = screen.getByLabelText('Assembly notes');
    expect(textarea).toHaveClass('size-lg', 'resize-none');
    expect(textarea.parentElement).not.toHaveClass('size-lg');
  });

  it('disables the textarea', () => {
    render(<TextareaField label="Assembly notes" disabled />);
    expect(screen.getByLabelText('Assembly notes')).toBeDisabled();
  });

  it('accepts text typed across lines', async () => {
    const user = userEvent.setup();
    render(<TextareaField label="Assembly notes" />);
    const textarea = screen.getByLabelText('Assembly notes');
    await user.type(textarea, 'Two people.{Enter}{Enter}Start with the shelf.');
    expect(textarea).toHaveValue('Two people.\n\nStart with the shelf.');
  });

  it('focuses the textarea when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<TextareaField label="Assembly notes" />);
    await user.click(screen.getByText('Assembly notes'));
    expect(screen.getByLabelText('Assembly notes')).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('TextareaField — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <TextareaField label="Assembly notes" hint="Shown to the assembly team" />
        <TextareaField label="Delivery instructions" required rows={2} />
        <TextareaField
          label="Gate code"
          invalid
          error="Tell us how the courier gets in, in 280 characters or fewer"
        />
        <TextareaField label="Archived note" disabled />
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
