import { Link, useLoaderData, useParams } from 'react-router-dom';

import { DogDetailsPanel } from '@/components/organisms/DogDetailsPanel';
import { ErrorState } from '@/components/atoms/ErrorState';
import { LoadingState } from '@/components/atoms/LoadingState';
import type { DogDetailsLoaderData } from '@/routes/loaders/dog-details.loader';
import { useDogBreedsQuery } from '@/hooks/useDogBreedsQuery';

export function DogDetailsPage() {
  const loaderData = useLoaderData() as DogDetailsLoaderData | undefined;
  const params = useParams();
  const dogBreedsQuery = useDogBreedsQuery();
  const dogId = Number(loaderData?.dogId ?? params.dogId);

  if (dogBreedsQuery.isLoading) {
    return <LoadingState message="Loading breed details..." />;
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

  return (
    <section className="space-y-4">
      <Link to="/" className="text-sm text-primary underline-offset-2 hover:underline">
        Back to feed
      </Link>
      <DogDetailsPanel breed={breed} />
    </section>
  );
}
