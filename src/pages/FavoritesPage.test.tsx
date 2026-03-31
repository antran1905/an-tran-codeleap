import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  function mockBreedsQuery() {
    vi.mocked(useDogBreedsQuery).mockReturnValue({
      data: [
        {
          id: 1,
          name: 'Affenpinscher',
          weight: { metric: '3 - 6' },
          height: { metric: '23 - 29' },
          reference_image_id: 'image-1',
        },
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
  }

  it('shows favourites from API data', () => {
    mockBreedsQuery();

    vi.mocked(useDogFavouritesQuery).mockReturnValue({
      data: {
        items: [
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
        page: 0,
        limit: 10,
        totalCount: 11,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDogFavouritesQuery>);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Akita')).toBeInTheDocument();
    expect(screen.getByText('Dogs saved to your favourites list (11).')).toBeInTheDocument();
  });

  it('sorts favourites by created_at descending', () => {
    mockBreedsQuery();

    vi.mocked(useDogFavouritesQuery).mockReturnValue({
      data: {
        items: [
          {
            id: 10,
            image_id: 'image-1',
            created_at: '2025-01-01T09:00:00.000Z',
            image: {
              id: 'image-1',
              url: 'https://example.com/affenpinscher.jpg',
            },
          },
          {
            id: 11,
            image_id: 'image-2',
            created_at: '2025-01-02T09:00:00.000Z',
            image: {
              id: 'image-2',
              url: 'https://example.com/akita.jpg',
            },
          },
        ],
        page: 0,
        limit: 10,
        totalCount: 2,
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useDogFavouritesQuery>);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    const listItems = screen.getAllByRole('listitem');
    expect(within(listItems[0]).getByText('Akita')).toBeInTheDocument();
    expect(within(listItems[1]).getByText('Affenpinscher')).toBeInTheDocument();
  });

  it('shows loading state while favourites are refetching', () => {
    mockBreedsQuery();

    vi.mocked(useDogFavouritesQuery).mockReturnValue({
      data: {
        items: [
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
        page: 0,
        limit: 10,
        totalCount: 10,
      },
      isLoading: false,
      isFetching: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useDogFavouritesQuery>);

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Loading favourites...')).toBeInTheDocument();
    expect(screen.queryByText('Akita')).not.toBeInTheDocument();
  });

  it('moves to next page when clicking next', async () => {
    mockBreedsQuery();

    vi.mocked(useDogFavouritesQuery).mockImplementation((options) => {
      if (options.page === 1) {
        return {
          data: {
            items: [
              {
                id: 201,
                image_id: 'image-2',
                created_at: '2025-01-03T09:00:00.000Z',
                image: {
                  id: 'image-2',
                  url: 'https://example.com/akita.jpg',
                },
              },
            ],
            page: 1,
            limit: 10,
            totalCount: 20,
          },
          isLoading: false,
          isFetching: false,
          isError: false,
          error: null,
        } as ReturnType<typeof useDogFavouritesQuery>;
      }

      return {
        data: {
          items: [
            {
              id: 101,
              image_id: 'image-1',
              created_at: '2025-01-02T09:00:00.000Z',
              image: {
                id: 'image-1',
                url: 'https://example.com/affenpinscher.jpg',
              },
            },
          ],
          page: 0,
          limit: 10,
          totalCount: 20,
        },
        isLoading: false,
        isFetching: false,
        isError: false,
        error: null,
      } as ReturnType<typeof useDogFavouritesQuery>;
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <FavoritesPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Affenpinscher')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Akita')).toBeInTheDocument();
  });
});
