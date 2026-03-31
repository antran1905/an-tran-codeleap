import type { DogBreed } from '@/interfaces/dog-breed.interface';
import type {
  CreateDogFavouritePayload,
  DogFavorite,
  GetDogFavouritesParams,
  PaginatedDogFavourites,
} from '@/interfaces/favorite.interface';
import type { CreateVotePayload, DogVoteResponse } from '@/interfaces/vote.interface';
import { httpApi } from '@/services/http.api';

export async function getDogBreeds(): Promise<DogBreed[]> {
  const response = await httpApi.get<DogBreed[]>('/breeds');
  return response.data;
}

export async function createDogVote(payload: CreateVotePayload): Promise<DogVoteResponse> {
  const response = await httpApi.post<DogVoteResponse>('/votes', {
    image_id: payload.imageId,
    value: payload.value,
  });

  return response.data;
}

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== 'string') {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export async function getDogFavourites(
  params: GetDogFavouritesParams,
): Promise<PaginatedDogFavourites> {
  const response = await httpApi.get<DogFavorite[]>('/favourites', {
    params: {
      page: params.page,
      limit: params.limit,
      order: params.order,
    },
  });

  const totalCount = parsePositiveInteger(response.headers['pagination-count']);
  const currentPage = parsePositiveInteger(response.headers['pagination-page']);
  const currentLimit = parsePositiveInteger(response.headers['pagination-limit']);

  return {
    items: response.data,
    totalCount: totalCount ?? response.data.length,
    page: currentPage ?? params.page,
    limit: currentLimit ?? params.limit,
  };
}

export async function createDogFavourite(payload: CreateDogFavouritePayload): Promise<DogFavorite> {
  const response = await httpApi.post<DogFavorite>('/favourites', {
    image_id: payload.imageId,
  });

  return response.data;
}
