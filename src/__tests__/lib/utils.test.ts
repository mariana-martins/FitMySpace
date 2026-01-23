import { cn, formatPrice, formatDimensions } from '@/lib/utils';

describe('cn (className merger)', () => {
  it('merges class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const isTrue = true;
    const isFalse = false;
    expect(cn('base', isTrue && 'active', isFalse && 'hidden')).toBe('base active');
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
  });

  it('handles array of classes', () => {
    expect(cn(['class1', 'class2'])).toBe('class1 class2');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });
});

describe('formatPrice', () => {
  it('formats price with default AUD currency', () => {
    expect(formatPrice(29.99)).toBe('$29.99');
  });

  it('formats price with explicit AUD currency', () => {
    expect(formatPrice(100, 'AUD')).toBe('$100.00');
  });

  it('formats whole numbers with cents', () => {
    expect(formatPrice(50, 'AUD')).toBe('$50.00');
  });

  it('formats zero price', () => {
    expect(formatPrice(0, 'AUD')).toBe('$0.00');
  });

  it('formats large prices with commas', () => {
    expect(formatPrice(1234.56, 'AUD')).toBe('$1,234.56');
  });

  it('handles different currencies', () => {
    // en-AU locale formats USD as "USD X.XX"
    expect(formatPrice(100, 'USD')).toMatch(/USD\s*100\.00/);
  });
});

describe('formatDimensions', () => {
  it('formats all dimensions in cm', () => {
    expect(formatDimensions({ length: 30, width: 20, height: 15, unit: 'cm' })).toBe(
      '30cm × 20cm × 15cm',
    );
  });

  it('formats all dimensions in inches', () => {
    expect(formatDimensions({ length: 12, width: 8, height: 6, unit: 'in' })).toBe(
      '12in × 8in × 6in',
    );
  });

  it('handles missing dimensions', () => {
    expect(formatDimensions({ length: 30, unit: 'cm' })).toBe('30cm');
  });

  it('handles only two dimensions', () => {
    expect(formatDimensions({ length: 30, width: 20, unit: 'cm' })).toBe('30cm × 20cm');
  });

  it('returns fallback for undefined input', () => {
    expect(formatDimensions(undefined)).toBe('Dimensions not available');
  });

  it('returns fallback for empty dimensions object', () => {
    expect(formatDimensions({ unit: 'cm' })).toBe('Dimensions not available');
  });
});
