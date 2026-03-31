import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ErrorState } from '@/components/atoms/ErrorState';

describe('ErrorState', () => {
  it('renders message and optional action', () => {
    render(
      <ErrorState
        message="Something went wrong"
        action={<button type="button">Retry</button>}
      />,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });
});
