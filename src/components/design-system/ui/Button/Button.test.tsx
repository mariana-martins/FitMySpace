import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './';
import { createRef } from 'react';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Button — rendering', () => {
  it('renders a <button> element by default', () => {
    render(
      <Button variant="primary" appearance="fill" size="md">
        Click me
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('sets type="button" by default to prevent accidental form submission', () => {
    render(
      <Button variant="primary" appearance="fill" size="md">
        Submit
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('renders the text content', () => {
    render(
      <Button variant="primary" appearance="fill" size="md">
        Save changes
      </Button>,
    );
    expect(screen.getByRole('button')).toHaveTextContent('Save changes');
  });
});

/* ===============================================================
 * VARIANTS
 * =============================================================== */

describe('Button — variants', () => {
  const variants = ['primary', 'secondary', 'error', 'success', 'warning', 'information'] as const;

  it.each(variants)('applies fill-%s class for variant="%s" appearance="fill"', (variant) => {
    const { container } = render(
      <Button variant={variant} appearance="fill" size="md">
        {variant}
      </Button>,
    );
    expect(container.firstChild).toHaveClass(`fill-${variant}`);
  });

  it.each(variants)('applies outline-%s class for variant="%s" appearance="outline"', (variant) => {
    const { container } = render(
      <Button variant={variant} appearance="outline" size="md">
        {variant}
      </Button>,
    );
    expect(container.firstChild).toHaveClass(`outline-${variant}`);
  });
});

/* ===============================================================
 * SIZES
 * =============================================================== */

describe('Button — sizes', () => {
  const sizes = ['xs', 'sm', 'md', 'lg'] as const;

  it.each(sizes)('applies size-%s class when size="%s"', (size) => {
    const { container } = render(
      <Button variant="primary" appearance="fill" size={size}>
        Size {size}
      </Button>,
    );
    expect(container.firstChild).toHaveClass(`size-${size}`);
  });
});

/* ===============================================================
 * ICONS
 * =============================================================== */

describe('Button — icons', () => {
  const MockIcon = () => (
    <svg data-testid="mock-icon" viewBox="0 0 24 24">
      <path d="M12 2v20" />
    </svg>
  );

  it('renders the icon when provided', () => {
    render(
      <Button variant="primary" appearance="fill" size="md" icon={<MockIcon />}>
        Add
      </Button>,
    );
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('marks the icon wrapper as aria-hidden="true"', () => {
    render(
      <Button variant="primary" appearance="fill" size="md" icon={<MockIcon />}>
        Add
      </Button>,
    );
    const iconWrapper = screen.getByTestId('mock-icon').closest('span');
    expect(iconWrapper).toHaveAttribute('aria-hidden', 'true');
  });

  it('places icon before text by default (start)', () => {
    const { container } = render(
      <Button variant="primary" appearance="fill" size="md" icon={<MockIcon />}>
        Add
      </Button>,
    );
    const button = container.firstChild as HTMLElement;
    const children = Array.from(button.childNodes);
    const iconIndex = children.findIndex(
      (n) => n instanceof HTMLElement && n.querySelector('[data-testid="mock-icon"]'),
    );
    const textIndex = children.findIndex(
      (n) => n.textContent === 'Add' && n.nodeType === Node.TEXT_NODE,
    );
    expect(iconIndex).toBeLessThan(textIndex);
  });

  it('places icon after text when iconPosition="end"', () => {
    const { container } = render(
      <Button variant="primary" appearance="fill" size="md" icon={<MockIcon />} iconPosition="end">
        Add
      </Button>,
    );
    const button = container.firstChild as HTMLElement;
    const children = Array.from(button.childNodes);
    const iconIndex = children.findIndex(
      (n) => n instanceof HTMLElement && n.querySelector('[data-testid="mock-icon"]'),
    );
    const textIndex = children.findIndex(
      (n) => n.textContent === 'Add' && n.nodeType === Node.TEXT_NODE,
    );
    expect(iconIndex).toBeGreaterThan(textIndex);
  });
});

/* ===============================================================
 * ICON-ONLY
 * =============================================================== */

describe('Button — icon-only', () => {
  const MockIcon = () => (
    <svg data-testid="mock-icon" viewBox="0 0 24 24">
      <path d="M12 2v20" />
    </svg>
  );

  it('renders an icon-only button with aria-label', () => {
    render(<Button variant="primary" appearance="fill" size="md" icon={<MockIcon />} aria-label="Add item" />);
    const btn = screen.getByRole('button', { name: 'Add item' });
    expect(btn).toBeInTheDocument();
  });

  it('applies the icon-only class', () => {
    const { container } = render(<Button variant="primary" appearance="fill" size="md" icon={<MockIcon />} aria-label="Delete" />);
    expect(container.firstChild).toHaveClass('icon-only');
  });
});

/* ===============================================================
 * DISABLED
 * =============================================================== */

describe('Button — disabled', () => {
  it('sets the disabled attribute', () => {
    render(
      <Button variant="primary" appearance="fill" size="md" disabled>
        Disabled
      </Button>,
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('prevents onClick when disabled (native)', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" appearance="fill" size="md" disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    screen.getByRole('button').click();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('prevents onClick when disabled (asChild)', () => {
    const handleClick = jest.fn();
    render(
      <Button variant="primary" appearance="fill" size="md" asChild disabled onClick={() => handleClick()}>
        <a href="/test">Disabled Link</a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    link.click();
    expect(handleClick).not.toHaveBeenCalled();
  });
});

/* ===============================================================
 * asChild
 * =============================================================== */

describe('Button — asChild', () => {
  it('renders as the child element when asChild is true', () => {
    render(
      <Button variant="primary" appearance="fill" size="md" asChild>
        <a href="/home">Go Home</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go Home' });
    expect(link).toBeInTheDocument();
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('merges button classes onto the child element', () => {
    const { container } = render(
      <Button asChild variant="secondary" appearance='fill' size="lg">
        <a href="/about">About</a>
      </Button>,
    );
    const link = container.querySelector('a');
    expect(link).toHaveClass('button');
    expect(link).toHaveClass('fill-secondary');
    expect(link).toHaveClass('size-lg');
  });

  it('uses aria-disabled instead of disabled for asChild', () => {
    render(
      <Button variant="primary" appearance="fill" size="md" asChild disabled>
        <a href="/disabled">Disabled Link</a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).not.toHaveAttribute('disabled');
  });
});

/* ===============================================================
 * REF FORWARDING
 * =============================================================== */

describe('Button — ref forwarding', () => {
  it('forwards ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button variant="primary" appearance="fill" size="md" ref={ref}>Ref test</Button>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('BUTTON');
  });
});

/* ===============================================================
 * CUSTOM PROPS
 * =============================================================== */

describe('Button — custom props', () => {
  it('merges custom className', () => {
    const { container } = render(<Button variant="primary" appearance="fill" size="md" className="custom-class">Custom</Button>);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('button');
  });

  it('spreads native HTML attributes', () => {
    render(
      <Button variant="primary" appearance="fill" size="md" data-testid="custom-btn" id="my-button">
        Native
      </Button>,
    );
    const btn = screen.getByTestId('custom-btn');
    expect(btn).toHaveAttribute('id', 'my-button');
  });
});

/* ===============================================================
 * ACCESSIBILITY (jest-axe)
 * =============================================================== */

describe('Button — accessibility', () => {
  const MockIcon = () => (
    <svg data-testid="mock-icon" viewBox="0 0 24 24">
      <path d="M12 2v20" />
    </svg>
  );

  it('has no a11y violations for a default button', async () => {
    const { container } = render(<Button variant="primary" appearance="fill" size="md">Accessible button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations for an icon-only button with aria-label', async () => {
    const { container } = render(<Button variant="primary" appearance="fill" size="md" icon={<MockIcon />} aria-label="Delete item" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations for a button with icon and text', async () => {
    const { container } = render(<Button variant="primary" appearance="fill" size="md" icon={<MockIcon />}>Add item</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no a11y violations for a disabled button', async () => {
    const { container } = render(
      <Button variant="primary" appearance="fill" size="md" disabled>
        Disabled
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
