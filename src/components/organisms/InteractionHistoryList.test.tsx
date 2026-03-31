import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { InteractionHistoryList } from '@/components/organisms/InteractionHistoryList';

describe('InteractionHistoryList', () => {
  it('renders empty state message when there are no entries', () => {
    render(
      <MemoryRouter>
        <InteractionHistoryList entries={[]} emptyMessage="No activity yet" />
      </MemoryRouter>,
    );

    expect(screen.getByText('No activity yet')).toBeInTheDocument();
  });

  it('renders history item details and details link when breedId is present', () => {
    render(
      <MemoryRouter>
        <InteractionHistoryList
          emptyMessage="No activity yet"
          entries={[
            {
              id: 'h1',
              breedId: 10,
              breedName: 'Affenpinscher',
              imageUrl: null,
              imageId: null,
              value: 1,
              createdAt: '2026-03-31T00:00:00.000Z',
            },
            {
              id: 'h2',
              breedId: 0,
              breedName: 'Unknown',
              imageUrl: null,
              imageId: null,
              value: -1,
              createdAt: '2026-03-31T00:00:00.000Z',
            },
          ]}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('Affenpinscher')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View Details' })).toHaveAttribute('href', '/dogs/10');
    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });
});
