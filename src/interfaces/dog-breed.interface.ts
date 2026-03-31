export interface DogBreedImage {
  id: string;
  url: string;
}

export interface DogBreedWeight {
  metric: string;
}

export interface DogBreedHeight {
  metric: string;
}

export interface DogBreed {
  id: number;
  name: string;
  weight: DogBreedWeight;
  height: DogBreedHeight;
  bred_for?: string;
  breed_group?: string;
  life_span?: string;
  temperament?: string;
  image?: DogBreedImage;
  reference_image_id?: string;
}
