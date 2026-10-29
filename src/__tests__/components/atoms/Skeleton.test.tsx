import { Skeleton } from '@/components/atoms/Skeleton';
import { render, screen } from '@/__tests__/utils';

describe('Skeleton', () => {
  it('renders correctly', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });

  it('has pulse animation', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('animate-pulse');
  });

  it('has correct background color', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('bg-gray-200');
  });

  it('has rounded corners', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('rounded-md');
  });

  it('is hidden from assistive tech, since the loading region announces the state', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).not.toHaveAttribute('role');
  });

  it('merges custom className', () => {
    render(<Skeleton className="h-10 w-full" data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveClass('h-10');
    expect(skeleton).toHaveClass('w-full');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Skeleton ref={ref} data-testid="skeleton" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes additional props', () => {
    render(<Skeleton data-testid="skeleton" id="custom-id" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('id', 'custom-id');
  });
});
