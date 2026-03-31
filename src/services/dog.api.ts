import type { DogBreed } from '@/interfaces/dog-breed.interface';
import type { CreateDogFavouritePayload, DogFavorite } from '@/interfaces/favorite.interface';
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

export async function getDogFavourites(): Promise<DogFavorite[]> {
  const response = await httpApi.get<DogFavorite[]>('/favourites');
  return response.data;
}

export async function createDogFavourite(payload: CreateDogFavouritePayload): Promise<DogFavorite> {
  const response = await httpApi.post<DogFavorite>('/favourites', {
    image_id: payload.imageId,
  });

  return response.data;
}
