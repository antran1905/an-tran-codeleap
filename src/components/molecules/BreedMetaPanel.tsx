interface BreedMetaPanelProps {
  breedName: string;
  temperamentList: string[];
}

function toCapitalizedWords(value: string): string {
  return value
    .toLowerCase()
    .split(' ')
    .map((part) => {
      if (part.length === 0) {
        return part;
      }

      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(' ');
}

export function BreedMetaPanel(props: BreedMetaPanelProps) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4">
      <div className="px-4 py-3 shadow-xl">
        <h2 className="text-2xl font-semibold text-foreground drop-shadow-sm">
          {props.breedName}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {props.temperamentList.map((temperament) => {
            return (
              <span
                key={temperament}
                className="rounded-full border border-primary/70 bg-primary/20 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary shadow-md backdrop-blur-md transition-transform duration-200 hover:-translate-y-0.5"
              >
                {toCapitalizedWords(temperament)}
              </span>
            );
          })}
          {props.temperamentList.length === 0 ? (
            <span className="rounded-full border border-primary/70 bg-primary/20 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-primary backdrop-blur-md">
              Unknown temperament
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
