import { ErrorState } from '@/components/atoms/ErrorState';
import { LoadingState } from '@/components/atoms/LoadingState';
import { InteractionHistoryList } from '@/components/organisms/InteractionHistoryList';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';
import { useDogFavouritesQuery } from '@/hooks/useDogFavouritesQuery';
import type { DogBreed } from '@/interfaces/dog-breed.interface';
import type { DogFavorite } from '@/interfaces/favorite.interface';
import type { SwipeHistoryEntry } from '@/interfaces/swipe-history.interface';

function findBreedForFavourite(options: { favourite: DogFavorite; breeds: DogBreed[] }): DogBreed | undefined {
  const favouriteBreed = options.favourite.image?.breeds?.[0];

  if (favouriteBreed) {
    return favouriteBreed;
  }

  return options.breeds.find((breed) => {
    if (!options.favourite.image_id) {
      return false;
    }

    return breed.reference_image_id === options.favourite.image_id || breed.image?.id === options.favourite.image_id;
  });
}

function mapFavouritesToHistoryEntries(options: {
  favourites: DogFavorite[];
  breeds: DogBreed[];
}): SwipeHistoryEntry[] {
  return options.favourites.map((favourite) => {
    const matchedBreed = findBreedForFavourite({
      favourite,
      breeds: options.breeds,
    });

    return {
      id: `favourite-${favourite.id}`,
      breedId: matchedBreed?.id ?? 0,
      breedName: matchedBreed?.name ?? `Favourite #${favourite.id}`,
      imageUrl: favourite.image?.url ?? null,
      imageId: favourite.image_id ?? favourite.image?.id ?? null,
      value: 1,
      createdAt: favourite.created_at ?? new Date().toISOString(),
    };
  });
}

export function FavoritesPage() {
  const dogBreedsQuery = useDogBreedsQuery();
  const dogFavouritesQuery = useDogFavouritesQuery();

  if (dogBreedsQuery.isLoading || dogFavouritesQuery.isLoading) {
    return (
      <ListPageTemplate title="Favorites" subtitle="Dogs saved to your favourites list.">
        <LoadingState message="Loading favourites..." />
      </ListPageTemplate>
    );
  }

  if (dogBreedsQuery.isError || dogFavouritesQuery.isError) {
    return (
      <ListPageTemplate title="Favorites" subtitle="Dogs saved to your favourites list.">
        <ErrorState message="Unable to load favourites right now." />
      </ListPageTemplate>
    );
  }

  const favouriteEntries = mapFavouritesToHistoryEntries({
    favourites: dogFavouritesQuery.data ?? [],
    breeds: dogBreedsQuery.data ?? [],
  });

  return (
    <ListPageTemplate
      title="Favorites"
      subtitle="Dogs saved to your favourites list."
    >
      <InteractionHistoryList entries={favouriteEntries} emptyMessage="No favourites saved yet." />
    </ListPageTemplate>
  );
}
