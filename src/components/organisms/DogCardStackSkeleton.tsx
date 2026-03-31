import { Skeleton } from '@/components/atoms/Skeleton';

export function DogCardStackSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading dog feed"
      className="relative h-full w-full overflow-hidden touch-none sm:mx-auto sm:h-[74svh] sm:min-h-[20rem] sm:max-h-[34rem] sm:max-w-md"
      role="status"
    >
      <div
        aria-hidden
        className="absolute inset-0 translate-y-[18px] scale-[0.94] animate-pulse bg-muted shadow-lg sm:rounded-3xl sm:border sm:border-border"
      />

      <div className="absolute inset-0 overflow-hidden bg-card shadow-2xl sm:rounded-3xl sm:border sm:border-border">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none sm:rounded-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/15 sm:rounded-3xl" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="px-4 py-3 shadow-xl">
            <Skeleton className="h-8 w-52 max-w-[85%]" />
            <div className="mt-3 flex flex-wrap gap-2.5">
              <Skeleton className="h-[30px] w-20 rounded-full" />
              <Skeleton className="h-[30px] w-24 rounded-full" />
              <Skeleton className="h-[30px] w-16 rounded-full" />
              <Skeleton className="h-[30px] w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
