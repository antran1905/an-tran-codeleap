import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';
import { useDogFavouritesQuery } from '@/hooks/useDogFavouritesQuery';
import { FavoritesPage } from '@/pages/FavoritesPage';

vi.mock('@/hooks/useDogBreedsQuery', () => {
  return {
    useDogBreedsQuery: vi.fn(),
  };
});

vi.mock('@/hooks/useDogFavouritesQuery', () => {
  return {
    useDogFavouritesQuery: vi.fn(),
  };
});

describe('FavoritesPage', () => {
  it('shows favourites from API data', () => {
    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [
        {
          id: 2,
          name: 'Akita',
          weight: { metric: '32 - 39' },
          height: { metric: '61 - 71' },
          reference_image_id: 'image-2',
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDogBreedsQuery>);

    vi.mocked(useDogFavouritesQuery).mockReturnValue({
      data: [
        {
          id: 100,
          image_id: 'image-2',
          created_at: new Date().toISOString(),
          image: {
            id: 'image-2',
            url: 'https://example.com/akita.jpg',
          },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDogFavouritesQuery>);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Akita')).toBeInTheDocument();
  });
});
