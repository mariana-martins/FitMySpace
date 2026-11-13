import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Card, CardMedia } from './';
import { createRef } from 'react';
import Image from 'next/image';
import { Link } from '../Link';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * CARD
 * =============================================================== */

describe('Card — rendering', () => {
  it('renders a raised card with medium padding by default', () => {
    render(<Card data-testid="card">Bamboo shower caddy</Card>);
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('card', 'raised', 'padding-md');
  });

  it.each(['raised', 'outline'] as const)('applies the %s appearance', (appearance) => {
    render(
      <Card data-testid="card" appearance={appearance}>
        Content
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass(appearance);
  });

  it.each(['sm', 'md', 'lg'] as const)('applies padding-%s', (padding) => {
    render(
      <Card data-testid="card" padding={padding}>
        Content
      </Card>,
    );
    expect(screen.getByTestId('card')).toHaveClass(`padding-${padding}`);
  });

  it('renders the child element with asChild', () => {
    render(
      <Card asChild>
        <article aria-label="Bamboo shower caddy">Content</article>
      </Card>,
    );
    const article = screen.getByRole('article', { name: 'Bamboo shower caddy' });
    expect(article).toHaveClass('card');
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref} data-testid="card">
        Content
      </Card>,
    );
    expect(ref.current).toBe(screen.getByTestId('card'));
  });
});

/* ===============================================================
 * CARD MEDIA
 * =============================================================== */

describe('CardMedia — rendering', () => {
  it('frames its image in the landscape ratio by default', () => {
    render(
      <CardMedia data-testid="media">
        <Image src="/caddy.jpg" alt="" fill sizes="100vw" />
      </CardMedia>,
    );
    expect(screen.getByTestId('media')).toHaveClass('media', 'ratio-landscape');
  });

  it.each(['square', 'landscape', 'wide'] as const)('applies ratio-%s', (aspectRatio) => {
    render(
      <CardMedia data-testid="media" aspectRatio={aspectRatio}>
        <Image src="/caddy.jpg" alt="" fill sizes="100vw" />
      </CardMedia>,
    );
    expect(screen.getByTestId('media')).toHaveClass(`ratio-${aspectRatio}`);
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Card — accessibility', () => {
  it('has no axe violations as a whole-card link', async () => {
    const { container } = render(
      <ul>
        <Card asChild>
          <li>
            <CardMedia>
              <Image src="/caddy.jpg" alt="" fill sizes="100vw" />
            </CardMedia>
            <h3>
              <Link href="/products/1" appearance="standalone" stretched>
                Bamboo shower caddy
              </Link>
            </h3>
            <p>Three shelves for shampoo, soap and a razor.</p>
          </li>
        </Card>
      </ul>,
    );
    expect(screen.getByRole('link', { name: 'Bamboo shower caddy' })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
