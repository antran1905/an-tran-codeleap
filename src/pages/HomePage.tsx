import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorState } from "@/components/atoms/ErrorState";
import { SwipeActionBar } from "@/components/molecules/SwipeActionBar";
import { SwipeActionBarSkeleton } from "@/components/molecules/SwipeActionBarSkeleton";
import { DogCardStack } from "@/components/organisms/DogCardStack";
import { DogCardStackSkeleton } from "@/components/organisms/DogCardStackSkeleton";
import { useCreateDogFavouriteMutation } from "@/hooks/useCreateDogFavouriteMutation";
import { useDogBreedsQuery } from "@/hooks/useDogBreedsQuery";
import { useVoteDogMutation } from "@/hooks/useVoteDogMutation";
import type { DogBreed } from "@/interfaces/dog-breed.interface";
import type { SwipeHistoryEntry } from "@/interfaces/swipe-history.interface";
import type { VoteValue } from "@/interfaces/vote.interface";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useSwipeStore } from "@/stores/useSwipeStore";
import { isBreedSwipeable, toDogCard } from "@/utils/dog-card";
import { toQueryErrorMessage } from "@/utils/errorMessage";

/** Builds the client-side history row; `imageId` drives vote + favourite API calls when present. */
function createHistoryEntry(
  breed: DogBreed,
  value: VoteValue,
): SwipeHistoryEntry {
  return {
    id: `${breed.id}-${Date.now()}`,
    breedId: breed.id,
    breedName: breed.name,
    imageUrl: breed.image?.url ?? null,
    imageId: breed.reference_image_id ?? breed.image?.id ?? null,
    value,
    createdAt: new Date().toISOString(),
  };
}

export function HomePage() {
  const navigate = useNavigate();
  const dogBreedsQuery = useDogBreedsQuery();
  const voteDogMutation = useVoteDogMutation();
  const createDogFavouriteMutation = useCreateDogFavouriteMutation();

  const currentIndex = useSwipeStore((state) => state.currentIndex);
  const hydrateIndex = useSwipeStore((state) => state.hydrateIndex);
  const advance = useSwipeStore((state) => state.advance);
  const setCurrentIndex = useSwipeStore((state) => state.setCurrentIndex);
  const showSwipeFeedback = useSwipeStore((state) => state.showSwipeFeedback);

  const hydrateHistory = useHistoryStore((state) => state.hydrateHistory);
  const appendEntry = useHistoryStore((state) => state.appendEntry);
  const [queuedSwipeValue, setQueuedSwipeValue] = useState<VoteValue | null>(
    null,
  );

  const breeds =
    dogBreedsQuery.data?.filter((breed) => isBreedSwipeable(breed)) ?? [];
  const currentBreed = breeds[currentIndex];
  const nextBreed = breeds[currentIndex + 1];

  useEffect(() => {
    hydrateHistory();
  }, [hydrateHistory]);

  useEffect(() => {
    if (breeds.length > 0) {
      hydrateIndex(breeds.length);
    }
  }, [breeds.length, hydrateIndex]);

  function submitVote(value: VoteValue) {
    if (!currentBreed) {
      return;
    }

    const historyEntry = createHistoryEntry(currentBreed, value);

    appendEntry(historyEntry);

    if (historyEntry.imageId) {
      voteDogMutation.mutate({
        imageId: historyEntry.imageId,
        value,
      });

      // Likes and super-likes also create a favourite on the backend; rejects do not.
      if (value === 1 || value === 2) {
        createDogFavouriteMutation.mutate({
          imageId: historyEntry.imageId,
        });
      }
    }

    showSwipeFeedback(value);
    advance(breeds.length);
  }

  /**
   * Action bar taps cannot drive the same pointer path as dragging the card. Queue a vote so
   * `DogCardStack` runs the throw animation, then calls `submitVote` once via `onSwipe`.
   */
  function queueSwipe(value: VoteValue) {
    if (!currentBreed || queuedSwipeValue) {
      return;
    }

    setQueuedSwipeValue(value);
  }

  function handleOpenDetails(breedId: number) {
    navigate(`/dogs/${breedId}`);
  }

  if (dogBreedsQuery.isLoading) {
    return (
      <section className="flex h-full min-h-0 flex-col overflow-hidden sm:gap-4">
        <div className="min-h-0 flex-1">
          <DogCardStackSkeleton />
        </div>
        <div className="px-3 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:px-0 sm:py-0">
          <SwipeActionBarSkeleton />
        </div>
      </section>
    );
  }

  if (dogBreedsQuery.isError) {
    const errorContent = toQueryErrorMessage({
      error: dogBreedsQuery.error,
      fallbackMessage: "We could not load the dog deck.",
    });

    return (
      <ErrorState
        title="Unable to load dogs"
        message={errorContent.message}
        details={errorContent.details}
        action={
          <button
            type="button"
            className="rounded-full border border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => {
              void dogBreedsQuery.refetch();
            }}
          >
            Try again
          </button>
        }
      />
    );
  }

  if (breeds.length === 0) {
    return (
      <ErrorState
        title="No dogs available yet"
        message="We could not find swipe-ready breeds at the moment."
        details="Please refresh in a moment to load a new deck."
        action={
          <button
            type="button"
            className="rounded-full border border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => {
              void dogBreedsQuery.refetch();
            }}
          >
            Refresh deck
          </button>
        }
      />
    );
  }

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden sm:gap-4">
      <div className="min-h-0 flex-1">
        <DogCardStack
          currentCard={currentBreed ? toDogCard(currentBreed) : null}
          nextCard={nextBreed ? toDogCard(nextBreed) : null}
          disabled={Boolean(queuedSwipeValue)}
          queuedSwipeValue={queuedSwipeValue}
          onQueuedSwipeHandled={() => setQueuedSwipeValue(null)}
          onSwipe={submitVote}
          onOpenDetails={handleOpenDetails}
        />
      </div>

      <div className="px-3 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:px-0 sm:py-0">
        <SwipeActionBar
          disabled={!currentBreed || Boolean(queuedSwipeValue)}
          onReject={() => queueSwipe(-1)}
          onLike={() => queueSwipe(1)}
          onSuperLike={() => queueSwipe(2)}
        />
      </div>

      {!currentBreed ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            You reached the end of this deck.
          </p>
          <button
            type="button"
            className="mt-4 rounded-full border border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            onClick={() => setCurrentIndex(0, breeds.length)}
          >
            Restart deck
          </button>
        </div>
      ) : null}
    </section>
  );
}
