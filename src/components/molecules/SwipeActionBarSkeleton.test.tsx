import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { SwipeActionBarSkeleton } from '@/components/molecules/SwipeActionBarSkeleton';

describe('SwipeActionBarSkeleton', () => {
  it('renders three circular skeleton placeholders', () => {
    const { container } = render(<SwipeActionBarSkeleton />);

    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.rounded-full').length).toBeGreaterThanOrEqual(3);
  });
});
