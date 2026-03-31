import { useLoaderData, useParams } from 'react-router-dom';

import { DogCardStackSkeleton } from '@/components/organisms/DogCardStackSkeleton';
import { DogDetailsPanel } from '@/components/organisms/DogDetailsPanel';
import { SwipeActionBarSkeleton } from '@/components/molecules/SwipeActionBarSkeleton';
import { ErrorState } from '@/components/atoms/ErrorState';
import { useCreateDogFavouriteMutation } from '@/hooks/useCreateDogFavouriteMutation';
import type { DogDetailsLoaderData } from '@/routes/loaders/dog-details.loader';
import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';
import { useVoteDogMutation } from '@/hooks/useVoteDogMutation';
import type { VoteValue } from '@/interfaces/vote.interface';

export function DogDetailsPage() {
  const loaderData = useLoaderData() as DogDetailsLoaderData | undefined;
  const params = useParams();
  const dogBreedsQuery = useDogBreedsQuery();
  const voteDogMutation = useVoteDogMutation();
  const createDogFavouriteMutation = useCreateDogFavouriteMutation();
  const dogId = Number(loaderData?.dogId ?? params.dogId);

  if (dogBreedsQuery.isLoading) {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden sm:gap-4">
        <div className="min-h-0 flex-1">
          <DogCardStackSkeleton />
        </div>
        <div className="px-3 py-2 sm:px-0 sm:py-0">
          <SwipeActionBarSkeleton />
        </div>
      </section>
    );
  }

  if (dogBreedsQuery.isError) {
    return <ErrorState message="Unable to load breed details." />;
  }

  if (!Number.isInteger(dogId) || dogId <= 0) {
    return <ErrorState message="Invalid breed id." />;
  }

  const breed = dogBreedsQuery.data?.find((item) => Number(item.id) === dogId);

  if (!breed) {
    return <ErrorState message="Breed not found." />;
  }

  const selectedBreed = breed;

  function handleVote(value: VoteValue) {
    const imageId = selectedBreed.reference_image_id ?? selectedBreed.image?.id;

    if (!imageId) {
      return;
    }

    voteDogMutation.mutate({
      imageId,
      value,
    });

    if (value === 1 || value === 2) {
      createDogFavouriteMutation.mutate({
        imageId,
      });
    }
  }

  return (
    <DogDetailsPanel breed={selectedBreed} onVote={handleVote} />
  );
}
