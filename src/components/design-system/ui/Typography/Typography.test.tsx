import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { Heading, Text, Label, Caption } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * HEADING
 * =============================================================== */

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>Title</Heading>);
    const el = screen.getByRole('heading', { level: 2 });
    expect(el).toBeInTheDocument();
    expect(el).toHaveTextContent('Title');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)(
    'renders an h%i when level=%i',
    (level) => {
      render(<Heading level={level}>Level {level}</Heading>);
      expect(screen.getByRole('heading', { level })).toBeInTheDocument();
    },
  );

  it('applies the size class', () => {
    const { container } = render(<Heading size="sm">Small</Heading>);
    expect(container.firstChild).toHaveClass('heading-sm');
  });

  it('applies the displaySize class when set (overrides size)', () => {
    const { container } = render(
      <Heading size="sm" displaySize="lg">
        Display
      </Heading>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('display-lg');
    expect(el).not.toHaveClass('heading-sm');
  });

  it('merges custom className', () => {
    const { container } = render(
      <Heading className="custom-class">Title</Heading>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('base');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(<Heading ref={ref}>Title</Heading>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('H2');
  });

  it('spreads native HTML attributes', () => {
    render(
      <Heading data-testid="custom-heading" id="section-title">
        Title
      </Heading>,
    );
    const el = screen.getByTestId('custom-heading');
    expect(el).toHaveAttribute('id', 'section-title');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Heading level={2}>Accessible Heading</Heading>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ===============================================================
 * TEXT
 * =============================================================== */

describe('Text', () => {
  it('renders a <p> by default', () => {
    render(<Text>Paragraph</Text>);
    const el = screen.getByText('Paragraph');
    expect(el.tagName).toBe('P');
  });

  it('renders a <span> when as="span"', () => {
    render(<Text as="span">Inline</Text>);
    const el = screen.getByText('Inline');
    expect(el.tagName).toBe('SPAN');
  });

  it('applies the size class', () => {
    const { container } = render(<Text size="lg">Large</Text>);
    expect(container.firstChild).toHaveClass('body-lg');
  });

  it('applies the default size class (md)', () => {
    const { container } = render(<Text>Default</Text>);
    expect(container.firstChild).toHaveClass('body-md');
  });

  it('merges custom className', () => {
    const { container } = render(
      <Text className="my-class">Content</Text>,
    );
    expect(container.firstChild).toHaveClass('my-class');
    expect(container.firstChild).toHaveClass('base');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Text ref={ref}>Content</Text>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('P');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Text>Accessible text content</Text>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('Label', () => {
  it('renders a <span> by default', () => {
    render(<Label>Field Label</Label>);
    const el = screen.getByText('Field Label');
    expect(el.tagName).toBe('SPAN');
  });

  it('renders a <label> when as="label"', () => {
    render(
      <Label as="label" htmlFor="test-input">
        Email
      </Label>,
    );
    const el = screen.getByText('Email');
    expect(el.tagName).toBe('LABEL');
  });

  it('forwards htmlFor when as="label"', () => {
    render(
      <Label as="label" htmlFor="email-field">
        Email
      </Label>,
    );
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email-field');
  });

  it('applies the size class', () => {
    const { container } = render(<Label size="lg">Large</Label>);
    expect(container.firstChild).toHaveClass('label-lg');
  });

  it('applies the default size class (md)', () => {
    const { container } = render(<Label>Default</Label>);
    expect(container.firstChild).toHaveClass('label-md');
  });

  it('merges custom className', () => {
    const { container } = render(
      <Label className="extra">Content</Label>,
    );
    expect(container.firstChild).toHaveClass('extra');
    expect(container.firstChild).toHaveClass('base');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Label ref={ref}>Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('has no accessibility violations (as span)', async () => {
    const { container } = render(<Label>Visual-only label</Label>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no accessibility violations (as label with input)', async () => {
    const { container } = render(
      <>
        <Label as="label" htmlFor="a11y-input">
          Email Address
        </Label>
        <input id="a11y-input" type="email" />
      </>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ===============================================================
 * CAPTION
 * =============================================================== */

describe('Caption', () => {
  it('renders a <span> by default', () => {
    render(<Caption>Small text</Caption>);
    const el = screen.getByText('Small text');
    expect(el.tagName).toBe('SPAN');
  });

  it('renders a <p> when as="p"', () => {
    render(<Caption as="p">Paragraph caption</Caption>);
    const el = screen.getByText('Paragraph caption');
    expect(el.tagName).toBe('P');
  });

  it('applies the caption-md class', () => {
    const { container } = render(<Caption>Caption</Caption>);
    expect(container.firstChild).toHaveClass('caption-md');
  });

  it('merges custom className', () => {
    const { container } = render(
      <Caption className="custom">Content</Caption>,
    );
    expect(container.firstChild).toHaveClass('custom');
    expect(container.firstChild).toHaveClass('base');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Caption ref={ref}>Caption</Caption>);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('SPAN');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Caption>Accessible caption</Caption>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

/* ===============================================================
 * SHARED BEHAVIOR
 * =============================================================== */

describe('Shared behavior', () => {
  it('all components apply the base class', () => {
    const { container: c1 } = render(<Heading>H</Heading>);
    const { container: c2 } = render(<Text>T</Text>);
    const { container: c3 } = render(<Label>L</Label>);
    const { container: c4 } = render(<Caption>C</Caption>);

    expect(c1.firstChild).toHaveClass('base');
    expect(c2.firstChild).toHaveClass('base');
    expect(c3.firstChild).toHaveClass('base');
    expect(c4.firstChild).toHaveClass('base');
  });
});
