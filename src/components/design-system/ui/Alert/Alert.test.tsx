import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { Alert } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * ROLE AND ANNOUNCEMENT
 * =============================================================== */

describe('Alert — role and announcement', () => {
  it('is a status region by default', () => {
    render(<Alert>Your order ships from two stores.</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('is an assertive region with live="assertive"', () => {
    render(<Alert live="assertive">Your session ends in one minute.</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('is not a live region with live="off", but still speaks its type', () => {
    render(
      <Alert live="off" variant="warning" data-testid="note">
        Delivery dates are estimates.
      </Alert>,
    );
    const note = screen.getByTestId('note');
    expect(note).not.toHaveAttribute('role');
    expect(note).toHaveTextContent('Warning: Delivery dates are estimates.');
  });

  it('keeps an empty live region on the page and draws nothing in it', () => {
    const { container, rerender } = render(<Alert variant="success">{''}</Alert>);
    const status = screen.getByRole('status');
    expect(status).toBeEmptyDOMElement();
    expect(container.querySelector('svg')).toBeNull();

    rerender(<Alert variant="success">Room saved.</Alert>);
    expect(screen.getByRole('status')).toBe(status);
    expect(status).toHaveTextContent('Success: Room saved.');
  });

  it.each([
    ['nothing', undefined],
    ['null', null],
    ['false', false],
    ['true, which React does not render', true],
    ['a whitespace-only string', '   '],
  ])('treats %s as no message', (_description, emptyMessage) => {
    const { container } = render(<Alert>{emptyMessage}</Alert>);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('shows the number 0 as a message', () => {
    render(<Alert>{0}</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent('Information: 0');
  });

  it('leaves aria-live to the role, which sets it implicitly', () => {
    render(<Alert>Saved.</Alert>);
    const status = screen.getByRole('status');
    expect(status).not.toHaveAttribute('aria-live');
    expect(status).not.toHaveAttribute('aria-atomic');
  });

  it.each([
    ['information', 'Information'],
    ['success', 'Success'],
    ['warning', 'Warning'],
    ['error', 'Error'],
  ] as const)('the %s type is spoken, so it never rests on colour alone', (variant, label) => {
    render(<Alert variant={variant}>The shelf needs two people.</Alert>);
    expect(screen.getByRole('status')).toHaveTextContent(`${label}: The shelf needs two people.`);
  });

  it('does not name the region after its own title', () => {
    render(<Alert title="Payment declined">Try another card.</Alert>);
    const status = screen.getByRole('status');
    expect(status).not.toHaveAttribute('aria-label');
    expect(status).not.toHaveAttribute('aria-labelledby');
  });
});

/* ===============================================================
 * MESSAGE
 * =============================================================== */

describe('Alert — message', () => {
  it('sets a plain text message in a paragraph', () => {
    render(<Alert>Room saved.</Alert>);
    expect(screen.getByText('Room saved.').tagName).toBe('P');
  });

  it('keeps the structure of elements passed as the message, without nesting them in a paragraph', () => {
    render(
      <Alert variant="error" title="Check two fields">
        <ul>
          <li>Enter the room width.</li>
          <li>Choose a store.</li>
        </ul>
      </Alert>,
    );
    const list = screen.getByRole('list');
    expect(list.closest('p')).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});

/* ===============================================================
 * TITLE
 * =============================================================== */

describe('Alert — title', () => {
  it('renders the title as a level 3 heading by default', () => {
    render(<Alert title="Room saved">We added it to your list of rooms.</Alert>);
    expect(screen.getByRole('heading', { level: 3, name: 'Room saved' })).toBeInTheDocument();
  });

  it('honours the heading level given', () => {
    render(
      <Alert title="Room saved" headingLevel={2}>
        We added it to your list of rooms.
      </Alert>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Room saved' })).toBeInTheDocument();
  });

  it('renders no heading when there is no title', () => {
    render(<Alert>The shelf needs two people.</Alert>);
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * ICON
 * =============================================================== */

describe('Alert — icon', () => {
  it('shows one decorative icon', () => {
    const { container } = render(<Alert variant="warning">Two people needed.</Alert>);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(1);
    expect(svgs[0].closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('swaps the icon for the one given', () => {
    const { container } = render(
      <Alert icon={<svg data-testid="custom-icon" />}>Two people needed.</Alert>,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(container.querySelectorAll('svg')).toHaveLength(1);
  });
});

/* ===============================================================
 * VARIANTS AND APPEARANCES
 * =============================================================== */

describe('Alert — variants and appearances', () => {
  it('is a soft information alert by default', () => {
    const { container } = render(<Alert>Saved.</Alert>);
    expect(container.firstChild).toHaveClass('variant-information', 'appearance-soft');
  });

  it.each(['information', 'success', 'warning', 'error'] as const)(
    'applies variant-%s class',
    (variant) => {
      const { container } = render(<Alert variant={variant}>Saved.</Alert>);
      expect(container.firstChild).toHaveClass(`variant-${variant}`);
    },
  );

  it.each(['soft', 'fill'] as const)('applies appearance-%s class', (appearance) => {
    const { container } = render(<Alert appearance={appearance}>Saved.</Alert>);
    expect(container.firstChild).toHaveClass(`appearance-${appearance}`);
  });
});

/* ===============================================================
 * NATIVE PROPS
 * =============================================================== */

describe('Alert — native props', () => {
  it('forwards the ref to the region', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Saved.</Alert>);
    expect(ref.current).toBe(screen.getByRole('status'));
  });

  it('passes native attributes to the region', () => {
    render(
      <Alert id="save-alert" className="mt-4">
        Saved.
      </Alert>,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('id', 'save-alert');
    expect(status).toHaveClass('mt-4');
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Alert — accessibility', () => {
  it('has no axe violations across variants and appearances', async () => {
    const { container } = render(
      <div>
        <h2>Checkout</h2>
        <Alert variant="information">Fields marked with an asterisk (*) are required.</Alert>
        <Alert variant="success" title="Order placed">
          You will get an email with the tracking number.
        </Alert>
        <Alert variant="warning" appearance="fill">
          This item ships from two stores, so it may arrive separately.
        </Alert>
        <Alert variant="error" live="assertive" title="Payment declined">
          Try another card or pay with a link by email.
        </Alert>
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
