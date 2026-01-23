import { render, screen } from '@/__tests__/utils';
import { Badge } from '@/components/atoms/Badge';

describe('Badge', () => {
  it('renders children correctly', () => {
    render(<Badge variant="rounded">Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies rounded variant styles', () => {
    render(<Badge variant="rounded">Rounded</Badge>);
    const badge = screen.getByText('Rounded');
    expect(badge).toHaveClass('rounded-full');
  });

  it('applies square variant styles', () => {
    render(<Badge variant="square">Square</Badge>);
    const badge = screen.getByText('Square');
    expect(badge).toHaveClass('rounded-sm');
  });

  it('merges custom className', () => {
    render(
      <Badge variant="rounded" className="custom-class">
        Custom
      </Badge>,
    );
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(
      <Badge variant="rounded" ref={ref}>
        Ref Test
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('passes additional props to span element', () => {
    render(
      <Badge variant="rounded" data-testid="badge-test">
        Props Test
      </Badge>,
    );
    expect(screen.getByTestId('badge-test')).toBeInTheDocument();
  });
});
