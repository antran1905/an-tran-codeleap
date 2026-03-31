import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { App } from '@/app/App';
import type { DogBreed } from '@/interfaces/dog-breed.interface';
import type { DogFavorite } from '@/interfaces/favorite.interface';
import { DogDetailsPage } from '@/pages/DogDetailsPage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { HomePage } from '@/pages/HomePage';
import { dogDetailsLoader } from '@/routes/loaders/dog-details.loader';
import { httpApi } from '@/services/http.api';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { useSwipeStore } from '@/stores/useSwipeStore';

vi.mock('@/services/http.api', () => ({
  httpApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

function renderApp(initialPath: string) {
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
        {
          path: 'dogs/:dogId',
          element: <DogDetailsPage />,
          loader: dogDetailsLoader,
        },
        {
          path: 'history',
          element: <HistoryPage />,
        },
        {
          path: 'favorites',
          element: <FavoritesPage />,
        },
      ],
    },
  ];

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const router = createMemoryRouter(routes, {
    initialEntries: [initialPath],
  });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('App integration flows', () => {
  let breeds: DogBreed[];
  let favourites: DogFavorite[];
  let favouriteIdCounter: number;
  let voteIdCounter: number;

  beforeEach(() => {
    window.localStorage.clear();
    useHistoryStore.setState({ entries: [], filter: 'all' });
    useSwipeStore.setState({
      currentIndex: 0,
      progressSaveSignal: 0,
      lastSavedIndex: 0,
      swipeFeedbackSignal: 0,
      lastSwipeFeedbackValue: null,
    });

    favouriteIdCounter = 100;
    voteIdCounter = 900;
    favourites = [];
    breeds = [
      {
        id: 1,
        name: 'Affenpinscher',
        weight: { metric: '3 - 6' },
        height: { metric: '23 - 29' },
        reference_image_id: 'img-1',
        image: { id: 'img-1', url: 'https://example.test/dog-1.jpg' },
      },
      {
        id: 2,
        name: 'Basenji',
        weight: { metric: '9 - 11' },
        height: { metric: '40 - 43' },
        reference_image_id: 'img-2',
        image: { id: 'img-2', url: 'https://example.test/dog-2.jpg' },
      },
    ];

    vi.mocked(httpApi.get).mockImplementation(async (url, config) => {
      if (url === '/breeds') {
        return {
          data: breeds,
          headers: {},
        } as never;
      }

      if (url === '/favourites') {
        const params = (config as { params?: { page?: number; limit?: number } } | undefined)?.params;
        const page = params?.page ?? 0;
        const limit = params?.limit ?? 10;
        const start = page * limit;
        const pagedItems = favourites.slice(start, start + limit);

        return {
          data: pagedItems,
          headers: {
            'pagination-count': String(favourites.length),
            'pagination-page': String(page),
            'pagination-limit': String(limit),
          },
        } as never;
      }

      throw new Error(`Unhandled GET: ${url}`);
    });

    vi.mocked(httpApi.post).mockImplementation(async (url, payload) => {
      if (url === '/votes') {
        const body = payload as { image_id: string; value: -1 | 1 | 2 };
        return {
          data: {
            id: voteIdCounter++,
            image_id: body.image_id,
            value: body.value,
            created_at: '2026-04-01T00:00:00.000Z',
          },
          headers: {},
        } as never;
      }

      if (url === '/favourites') {
        const body = payload as { image_id: string };
        const matchedBreed = breeds.find((breed) => {
          return breed.reference_image_id === body.image_id || breed.image?.id === body.image_id;
        });
        const favourite: DogFavorite = {
          id: favouriteIdCounter++,
          image_id: body.image_id,
          created_at: new Date().toISOString(),
          image: {
            id: body.image_id,
            url: matchedBreed?.image?.url ?? 'https://example.test/fallback.jpg',
            breeds: matchedBreed ? [matchedBreed] : [],
          },
        };
        favourites.unshift(favourite);

        return {
          data: favourite,
          headers: {},
        } as never;
      }

      throw new Error(`Unhandled POST: ${url}`);
    });
  });

  it('propagates like flow from home to history and favorites', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(await screen.findByRole('button', { name: 'Love' }));

    await waitFor(() => {
      expect(useHistoryStore.getState().entries).toHaveLength(1);
    });
    expect(useHistoryStore.getState().entries[0]?.breedName).toBe('Affenpinscher');
    expect(useHistoryStore.getState().entries[0]?.value).toBe(1);

    await user.click(screen.getByRole('link', { name: 'History' }));
    await expect(screen.findByRole('heading', { name: 'History' })).resolves.toBeVisible();
    expect(await screen.findByText('Affenpinscher')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Favorites' }));
    await expect(screen.findByRole('heading', { name: 'Favorites' })).resolves.toBeVisible();
    expect(await screen.findByText('Dogs saved to your favourites list (1).')).toBeInTheDocument();
    expect(await screen.findByText('Affenpinscher')).toBeInTheDocument();
  });

  it('records super-like from home page and exposes it in history filters', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.click(await screen.findByRole('button', { name: 'Star' }));

    await waitFor(() => {
      expect(useHistoryStore.getState().entries).toHaveLength(1);
    });
    expect(useHistoryStore.getState().entries[0]?.breedName).toBe('Affenpinscher');
    expect(useHistoryStore.getState().entries[0]?.value).toBe(2);

    await user.click(screen.getByRole('link', { name: 'History' }));
    await expect(screen.findByRole('heading', { name: 'History' })).resolves.toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Super Likes' }));
    const allListItems = await screen.findAllByRole('listitem');
    const superLikeRow = allListItems.find((item) => {
      return within(item).queryByText('Affenpinscher') !== null;
    });

    expect(superLikeRow).toBeDefined();

    if (!superLikeRow) {
      return;
    }

    expect(within(superLikeRow).getByText('Affenpinscher')).toBeInTheDocument();
    expect(within(superLikeRow).getByText('Super Like')).toBeInTheDocument();
  });
});
