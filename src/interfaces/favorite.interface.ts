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

export interface CreateDogFavouritePayload {
  imageId: string;
}
