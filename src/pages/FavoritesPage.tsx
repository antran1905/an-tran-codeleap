import { useState } from 'react';

import { ErrorState } from '@/components/atoms/ErrorState';
import { LoadingState } from '@/components/atoms/LoadingState';
import { PaginationControls } from '@/components/molecules/PaginationControls';
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

function toCreatedAtTimestamp(value: string): number {
  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return timestamp;
}

function sortEntriesByCreatedAt(options: {
  entries: SwipeHistoryEntry[];
}): SwipeHistoryEntry[] {
  return [...options.entries].sort((left, right) => {
    return toCreatedAtTimestamp(right.createdAt) - toCreatedAtTimestamp(left.createdAt);
  });
}

const favouritesPageSize = 10;
const favouritesOrder = 'DESC' as const;

export function FavoritesPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const dogBreedsQuery = useDogBreedsQuery();
  const dogFavouritesQuery = useDogFavouritesQuery({
    page: currentPage,
    limit: favouritesPageSize,
    order: favouritesOrder,
  });

  if (
    dogBreedsQuery.isLoading ||
    dogBreedsQuery.isFetching ||
    dogFavouritesQuery.isLoading ||
    dogFavouritesQuery.isFetching
  ) {
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
    favourites: dogFavouritesQuery.data?.items ?? [],
    breeds: dogBreedsQuery.data ?? [],
  });
  const sortedFavouriteEntries = sortEntriesByCreatedAt({
    entries: favouriteEntries,
  });
  const totalCount = dogFavouritesQuery.data?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / favouritesPageSize));
  const currentPageOneBased = currentPage + 1;

  return (
    <ListPageTemplate
      title="Favorites"
      subtitle={`Dogs saved to your favourites list (${totalCount}).`}
    >
      <InteractionHistoryList entries={sortedFavouriteEntries} emptyMessage="No favourites saved yet." />
      <PaginationControls
        currentPage={currentPageOneBased}
        totalPages={totalPages}
        disabled={dogFavouritesQuery.isFetching}
        onPageChange={(nextPage) => {
          const clampedPage = Math.min(Math.max(nextPage, 1), totalPages);
          setCurrentPage(clampedPage - 1);
        }}
      />
    </ListPageTemplate>
  );
}
