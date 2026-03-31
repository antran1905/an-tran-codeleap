import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DogCardStackSkeleton } from '@/components/organisms/DogCardStackSkeleton';

describe('DogCardStackSkeleton', () => {
  it('renders loading status shell and skeleton placeholders', () => {
    const { container } = render(<DogCardStackSkeleton />);

    expect(screen.getByRole('status', { name: 'Loading dog feed' })).toBeInTheDocument();
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});
