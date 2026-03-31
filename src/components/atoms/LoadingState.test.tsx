import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingState } from '@/components/atoms/LoadingState';

describe('LoadingState', () => {
  it('renders provided loading copy', () => {
    render(
      <LoadingState
        title="Loading favorites"
        message="Syncing your liked dogs."
        hint="This can take a few seconds."
      />,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading favorites')).toBeInTheDocument();
    expect(screen.getByText('Syncing your liked dogs.')).toBeInTheDocument();
    expect(screen.getByText('This can take a few seconds.')).toBeInTheDocument();
  });

  it('uses default copy when no text is provided', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Please wait while we fetch the latest data.')).toBeInTheDocument();
  });
});
