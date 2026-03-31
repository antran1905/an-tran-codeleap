import type { DogBreed } from '@/interfaces/dog-breed.interface';
import type { DogCard } from '@/interfaces/dog-card.interface';

export function toDogCard(breed: DogBreed): DogCard {
  const temperamentList = breed.temperament
    ? breed.temperament
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    : [];

  return {
    breedId: breed.id,
    breedName: breed.name,
    temperamentList,
    imageUrl: breed.image?.url ?? null,
    imageId: breed.reference_image_id ?? breed.image?.id ?? null,
  };
}

export function isBreedSwipeable(breed: DogBreed): boolean {
  return Boolean(breed.image?.url || breed.reference_image_id);
}
