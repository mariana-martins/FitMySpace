import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LinkCard, LinkCardGrid } from './';

expect.extend(toHaveNoViolations);

const BUTTON_DOCS_PATH = '/docs/design-system-components-actions-button--docs';

function renderCard() {
  return render(
    <LinkCardGrid>
      <LinkCard
        path={BUTTON_DOCS_PATH}
        title="Button"
        description="Actions in six variants and three appearances."
        preview={<button type="button">Sample</button>}
      />
    </LinkCardGrid>,
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('LinkCard — rendering', () => {
  it('renders each card as an item of a list', () => {
    renderCard();
    const list = screen.getByRole('list');
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
  });

  it('puts the link inside a heading, named by the title alone', () => {
    renderCard();
    const heading = screen.getByRole('heading', { level: 3, name: 'Button' });
    expect(within(heading).getByRole('link', { name: 'Button' })).toBeInTheDocument();
  });

  it('accepts another heading level to fit the page outline', () => {
    render(
      <LinkCardGrid>
        <LinkCard
          path={BUTTON_DOCS_PATH}
          title="Button"
          description="Actions."
          preview={null}
          headingLevel={4}
        />
      </LinkCardGrid>,
    );
    expect(screen.getByRole('heading', { level: 4, name: 'Button' })).toBeInTheDocument();
  });
});

/* ===============================================================
 * NAVIGATION
 * =============================================================== */

describe('LinkCard — navigation', () => {
  it('links to the Storybook path in the top window', () => {
    renderCard();
    const link = screen.getByRole('link', { name: 'Button' });
    expect(link).toHaveAttribute('href', `./?path=${BUTTON_DOCS_PATH}`);
    expect(link).toHaveAttribute('target', '_top');
  });
});

/* ===============================================================
 * PREVIEW
 * =============================================================== */

describe('LinkCard — preview', () => {
  it('hides the preview from assistive technology and makes it inert', () => {
    renderCard();
    expect(screen.queryByRole('button', { name: 'Sample' })).not.toBeInTheDocument();
    const preview = screen.getByText('Sample').parentElement;
    expect(preview).toHaveAttribute('aria-hidden', 'true');
    expect(preview).toHaveAttribute('inert');
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('LinkCard — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = renderCard();
    expect(await axe(container)).toHaveNoViolations();
  });
});
