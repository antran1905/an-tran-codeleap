import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { FavoritesPage } from '@/pages/FavoritesPage';
import { useHistoryStore } from '@/stores/useHistoryStore';

describe('FavoritesPage', () => {
  beforeEach(() => {
    useHistoryStore.setState({
      entries: [
        {
          id: '1',
          breedId: 1,
          breedName: 'Affenpinscher',
          imageUrl: null,
          imageId: null,
          value: -1,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          breedId: 2,
          breedName: 'Akita',
          imageUrl: null,
          imageId: null,
          value: 1,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          breedId: 3,
          breedName: 'Basenji',
          imageUrl: null,
          imageId: null,
          value: 2,
          createdAt: new Date().toISOString(),
        },
      ],
      filter: 'all',
      hydrateHistory: () => undefined,
    });
  });

  it('shows only likes and super likes', () => {
    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    expect(screen.queryByText('Affenpinscher')).not.toBeInTheDocument();
    expect(screen.getByText('Akita')).toBeInTheDocument();
    expect(screen.getByText('Basenji')).toBeInTheDocument();
  });
});
