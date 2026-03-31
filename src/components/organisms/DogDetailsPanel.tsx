import type { DogBreed } from '@/interfaces/dog-breed.interface';

import { StatRow } from '@/components/atoms/StatRow';

interface DogDetailsPanelProps {
  breed: DogBreed;
}

export function DogDetailsPanel(props: DogDetailsPanelProps) {
  return (
    <section className="grid gap-6 rounded-2xl border border-border bg-card p-4 shadow-lg lg:grid-cols-[1.1fr_1fr] lg:p-6">
      <div
        className="h-80 rounded-2xl border border-border bg-muted"
        style={{
          backgroundImage: props.breed.image?.url ? `url(${props.breed.image.url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div>
        <h1 className="text-3xl font-bold text-foreground">{props.breed.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Breed Profile</p>
        <div className="mt-4 space-y-2.5">
          <StatRow label="Name" value={props.breed.name} />
          <StatRow label="Weight (Metric)" value={props.breed.weight.metric} />
          <StatRow label="Height (Metric)" value={props.breed.height.metric} />
          <StatRow label="Bred For" value={props.breed.bred_for} />
          <StatRow label="Breed Group" value={props.breed.breed_group} />
          <StatRow label="Life Span" value={props.breed.life_span} />
          <StatRow label="Temperament" value={props.breed.temperament} />
        </div>
      </div>
    </section>
  );
}
