import { describe, expect, it } from 'vitest';

import type { DogBreed } from '@/interfaces/dog-breed.interface';
import { isBreedSwipeable, toDogCard } from '@/utils/dog-card';

function buildBreed(overrides?: Partial<DogBreed>): DogBreed {
  return {
    id: 1,
    name: 'Affenpinscher',
    weight: { metric: '3 - 6' },
    height: { metric: '23 - 29' },
    ...overrides,
  };
}

describe('dog-card utils', () => {
  it('maps breed to card with parsed temperament and preferred image id', () => {
    const breed = buildBreed({
      temperament: 'Alert, Curious,  Loyal ',
      reference_image_id: 'ref_1',
      image: {
        id: 'img_1',
        url: 'https://example.com/dog.jpg',
      },
    });

    const result = toDogCard(breed);

    expect(result).toEqual({
      breedId: 1,
      breedName: 'Affenpinscher',
      temperamentList: ['Alert', 'Curious', 'Loyal'],
      imageUrl: 'https://example.com/dog.jpg',
      imageId: 'ref_1',
    });
  });

  it('falls back to null values when image references are missing', () => {
    const result = toDogCard(buildBreed());

    expect(result.imageUrl).toBeNull();
    expect(result.imageId).toBeNull();
    expect(result.temperamentList).toEqual([]);
  });

  it('marks breed as swipeable if image url or reference image id exists', () => {
    expect(
      isBreedSwipeable(
        buildBreed({
          image: { id: 'img_1', url: 'https://example.com/dog.jpg' },
        }),
      ),
    ).toBe(true);

    expect(
      isBreedSwipeable(
        buildBreed({
          reference_image_id: 'ref_1',
        }),
      ),
    ).toBe(true);

    expect(isBreedSwipeable(buildBreed())).toBe(false);
  });
});
