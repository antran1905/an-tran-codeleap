import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { HistoryPage } from '@/pages/HistoryPage';
import { useHistoryStore } from '@/stores/useHistoryStore';

describe('HistoryPage', () => {
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
      ],
      filter: 'all',
      hydrateHistory: () => undefined,
    });
  });

  it('filters entries by selected type', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <HistoryPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Affenpinscher')).toBeInTheDocument();
    expect(screen.getByText('Akita')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Rejects' }));

    expect(screen.getByText('Affenpinscher')).toBeInTheDocument();
    expect(screen.queryByText('Akita')).not.toBeInTheDocument();
  });
});
