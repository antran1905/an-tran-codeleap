import type { DogBreed } from '@/interfaces/dog-breed.interface';

export interface FavoriteImage {
  id: string;
  url: string;
  breeds?: DogBreed[];
}

export interface DogFavorite {
  id: number;
  image_id: string;
  created_at?: string;
  image?: FavoriteImage;
}

export type FavouriteOrder = 'ASC' | 'DESC' | 'RANDOM';

export interface GetDogFavouritesParams {
  page: number;
  limit: number;
  order: FavouriteOrder;
}

export interface PaginatedDogFavourites {
  items: DogFavorite[];
  page: number;
  limit: number;
  totalCount: number;
}

export interface CreateDogFavouritePayload {
  imageId: string;
}
