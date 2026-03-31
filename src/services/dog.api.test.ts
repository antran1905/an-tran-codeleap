import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DogBreed } from '@/interfaces/dog-breed.interface';
import type { DogFavorite, PaginatedDogFavourites } from '@/interfaces/favorite.interface';
import type { DogVoteResponse } from '@/interfaces/vote.interface';
import {
  createDogFavourite,
  createDogVote,
  getDogBreeds,
  getDogFavourites,
} from '@/services/dog.api';
import { httpApi } from '@/services/http.api';

vi.mock('@/services/http.api', () => ({
  httpApi: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe('dog.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets breeds list', async () => {
    const breeds: DogBreed[] = [
      {
        id: 1,
        name: 'Affenpinscher',
        weight: { metric: '3 - 6' },
        height: { metric: '23 - 29' },
      },
    ];

    vi.mocked(httpApi.get).mockResolvedValueOnce({
      data: breeds,
    });

    const result = await getDogBreeds();

    expect(result).toEqual(breeds);
    expect(httpApi.get).toHaveBeenCalledWith('/breeds');
  });

  it('creates a vote with mapped API payload', async () => {
    const voteResponse: DogVoteResponse = {
      id: 10,
      image_id: 'img_1',
      value: 2,
      created_at: '2026-03-31T00:00:00.000Z',
    };

    vi.mocked(httpApi.post).mockResolvedValueOnce({
      data: voteResponse,
    });

    const result = await createDogVote({ imageId: 'img_1', value: 2 });

    expect(result).toEqual(voteResponse);
    expect(httpApi.post).toHaveBeenCalledWith('/votes', {
      image_id: 'img_1',
      value: 2,
    });
  });

  it('gets paginated favourites using pagination headers when valid', async () => {
    const items: DogFavorite[] = [
      {
        id: 1,
        image_id: 'img_1',
      },
    ];

    vi.mocked(httpApi.get).mockResolvedValueOnce({
      data: items,
      headers: {
        'pagination-count': '25',
        'pagination-page': '3',
        'pagination-limit': '10',
      },
    });

    const result = await getDogFavourites({
      page: 1,
      limit: 5,
      order: 'ASC',
    });

    const expected: PaginatedDogFavourites = {
      items,
      totalCount: 25,
      page: 3,
      limit: 10,
    };

    expect(result).toEqual(expected);
    expect(httpApi.get).toHaveBeenCalledWith('/favourites', {
      params: {
        page: 1,
        limit: 5,
        order: 'ASC',
      },
    });
  });

  it('falls back to request params when pagination headers are invalid', async () => {
    const items: DogFavorite[] = [
      { id: 1, image_id: 'img_1' },
      { id: 2, image_id: 'img_2' },
    ];

    vi.mocked(httpApi.get).mockResolvedValueOnce({
      data: items,
      headers: {
        'pagination-count': 'invalid',
        'pagination-page': '-1',
        'pagination-limit': '3.5',
      },
    });

    const result = await getDogFavourites({
      page: 2,
      limit: 20,
      order: 'DESC',
    });

    expect(result).toEqual({
      items,
      totalCount: 2,
      page: 2,
      limit: 20,
    });
  });

  it('creates favourite with mapped API payload', async () => {
    const favourite: DogFavorite = {
      id: 11,
      image_id: 'img_42',
    };

    vi.mocked(httpApi.post).mockResolvedValueOnce({
      data: favourite,
    });

    const result = await createDogFavourite({ imageId: 'img_42' });

    expect(result).toEqual(favourite);
    expect(httpApi.post).toHaveBeenCalledWith('/favourites', {
      image_id: 'img_42',
    });
  });
});
