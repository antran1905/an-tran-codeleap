import { useState } from "react";

import { StatRow } from "@/components/atoms/StatRow";
import { SwipeActionBar } from "@/components/molecules/SwipeActionBar";
import { DogCardStack } from "@/components/organisms/DogCardStack";
import type { DogBreed } from "@/interfaces/dog-breed.interface";
import type { VoteValue } from "@/interfaces/vote.interface";
import { toDogCard } from "@/utils/dog-card";

interface DogDetailsPanelProps {
  breed: DogBreed;
  onVote: (value: VoteValue) => void;
}

export function DogDetailsPanel(props: DogDetailsPanelProps) {
  const [queuedSwipeValue, setQueuedSwipeValue] = useState<VoteValue | null>(
    null,
  );

  function queueSwipe(value: VoteValue) {
    if (queuedSwipeValue) {
      return;
    }

    setQueuedSwipeValue(value);
  }

  function handleSwipe(value: VoteValue) {
    props.onVote(value);
  }

  const detailRows = [
    { label: "Breed For", value: props.breed.bred_for },
    { label: "Breed Group", value: props.breed.breed_group },
    { label: "Height (Metric)", value: props.breed.height.metric },
    { label: "Weight (Metric)", value: props.breed.weight.metric },
    { label: "Life Span", value: props.breed.life_span },
    { label: "Temperament", value: props.breed.temperament },
  ];

  const metadata = (
    <div className="absolute inset-x-0 bottom-0 p-4">
      <div
        key={`metadata-${props.breed.id}`}
        className="details-metadata-enter rounded-2xl border border-border/60 bg-background/55 p-4 shadow-xl backdrop-blur-md"
      >
        <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
          {props.breed.name}
        </h1>
        <p className="mt-1 text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Breed profile
        </p>
        <div className="mt-4 space-y-2.5">
          {detailRows.map((row, index) => {
            return (
              <StatRow
                key={row.label}
                label={row.label}
                value={row.value}
                className="details-row-enter"
                style={{
                  animationDelay: `${50 + index * 35}ms`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden sm:gap-4">
      <div className="min-h-0 flex-1">
        <DogCardStack
          currentCard={toDogCard(props.breed)}
          nextCard={null}
          disabled={Boolean(queuedSwipeValue)}
          canOpenDetails={false}
          metadata={metadata}
          queuedSwipeValue={queuedSwipeValue}
          onQueuedSwipeHandled={() => setQueuedSwipeValue(null)}
          onSwipe={handleSwipe}
          onOpenDetails={() => undefined}
        />
      </div>
      <div className="px-3 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] sm:px-0 sm:py-0">
        <SwipeActionBar
          disabled={Boolean(queuedSwipeValue)}
          onReject={() => queueSwipe(-1)}
          onLike={() => queueSwipe(1)}
          onSuperLike={() => queueSwipe(2)}
        />
      </div>
    </section>
  );
}
