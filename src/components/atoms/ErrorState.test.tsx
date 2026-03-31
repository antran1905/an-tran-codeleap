import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorState } from '@/components/atoms/ErrorState';

describe('ErrorState', () => {
  it('renders title, message, details and optional action', () => {
    render(
      <ErrorState
        title="Unable to load dogs"
        message="Please retry to continue swiping."
        details="The dog service is having trouble right now."
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Unable to load dogs')).toBeInTheDocument();
    expect(screen.getByText('Please retry to continue swiping.')).toBeInTheDocument();
    expect(screen.getByText('The dog service is having trouble right now.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('falls back to default title', () => {
    render(<ErrorState message="Something failed" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
