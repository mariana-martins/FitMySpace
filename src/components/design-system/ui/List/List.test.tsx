import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from '../Checkbox';
import { List, ListItem } from './';
import { Button } from '../Button';
import { createRef } from 'react';
import { Link } from '../Link';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('List — rendering', () => {
  it('renders an unordered list of items', () => {
    render(
      <List>
        <ListItem>Bathroom</ListItem>
        <ListItem>Bedroom</ListItem>
      </List>,
    );

    const list = screen.getByRole('list');
    expect(list.tagName).toBe('UL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('keeps the list role, which Safari drops from an unstyled list', () => {
    render(
      <List>
        <ListItem>Bathroom</ListItem>
      </List>,
    );

    expect(screen.getByRole('list')).toHaveAttribute('role', 'list');
  });

  it('renders an ordered list when the order means something', () => {
    render(
      <List as="ol">
        <ListItem>Cheapest</ListItem>
      </List>,
    );

    expect(screen.getByRole('list').tagName).toBe('OL');
  });

  it('is plain, medium and divided by default', () => {
    render(
      <List>
        <ListItem>Bathroom</ListItem>
      </List>,
    );

    expect(screen.getByRole('list')).toHaveClass('plain', 'size-md', 'dividers');
  });

  it('takes the outline appearance, the small size and no dividers', () => {
    render(
      <List appearance="outline" size="sm" dividers={false}>
        <ListItem>Bathroom</ListItem>
      </List>,
    );

    const list = screen.getByRole('list');
    expect(list).toHaveClass('outline', 'size-sm');
    expect(list).not.toHaveClass('dividers');
  });

  it('points its refs at the list and the item', () => {
    const listRef = createRef<HTMLElement>();
    const itemRef = createRef<HTMLLIElement>();
    render(
      <List ref={listRef}>
        <ListItem ref={itemRef}>Bathroom</ListItem>
      </List>,
    );

    expect(listRef.current?.tagName).toBe('UL');
    expect(itemRef.current?.tagName).toBe('LI');
  });
});

/* ===============================================================
 * SLOTS
 * =============================================================== */

describe('ListItem — slots', () => {
  it('shows the title and the description', () => {
    render(
      <List>
        <ListItem description="12 saved products">Bathroom</ListItem>
      </List>,
    );

    const item = screen.getByRole('listitem');
    expect(item).toHaveTextContent('Bathroom');
    expect(within(item).getByText('12 saved products')).toHaveClass('description');
  });

  it('draws a registry icon in a circle, hidden from assistive technology', () => {
    const { container } = render(
      <List>
        <ListItem icon="bath">Bathroom</ListItem>
      </List>,
    );

    const leading = container.querySelector('.leading');
    expect(leading?.querySelector('svg')).toBeInTheDocument();
    expect(leading?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('takes any other element at the start', () => {
    render(
      <List>
        <ListItem leading={<span data-testid="thumbnail" />}>Oak wall shelf</ListItem>
      </List>,
    );

    expect(screen.getByTestId('thumbnail').parentElement).toHaveClass('leading-custom');
  });

  it('keeps an action at the end, with its own name', () => {
    render(
      <List>
        <ListItem
          trailing={
            <Button variant="secondary" appearance="outline" size="sm">
              Remove
            </Button>
          }
        >
          Oak wall shelf
        </ListItem>
      </List>,
    );

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it('lets a Checkbox fill the row with its own label', () => {
    render(
      <List>
        <ListItem>
          <Checkbox label="Waterproof" hint="For the bathroom." />
        </ListItem>
      </List>,
    );

    expect(screen.getByRole('checkbox', { name: 'Waterproof' })).toBeInTheDocument();
  });

  it('makes the whole row clickable through a stretched link title', () => {
    render(
      <List>
        <ListItem description="12 saved products">
          <Link href="/rooms/bathroom" appearance="standalone" stretched>
            Bathroom
          </Link>
        </ListItem>
      </List>,
    );

    expect(screen.getByRole('link', { name: 'Bathroom' })).toHaveAttribute(
      'data-link-stretched',
      'true',
    );
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('List — accessibility', () => {
  it('has no axe violations with every slot in use', async () => {
    const { container } = render(
      <List appearance="outline" aria-label="Your rooms">
        <ListItem
          icon="bath"
          description="12 saved products"
          trailing={
            <Button variant="secondary" appearance="outline" size="sm">
              Remove
            </Button>
          }
        >
          <Link href="/rooms/bathroom" appearance="standalone" stretched>
            Bathroom
          </Link>
        </ListItem>
        <ListItem>
          <Checkbox label="Show only what fits" />
        </ListItem>
      </List>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
