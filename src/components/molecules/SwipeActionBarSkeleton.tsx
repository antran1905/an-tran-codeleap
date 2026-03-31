import { Skeleton } from '@/components/atoms/Skeleton';

export function SwipeActionBarSkeleton() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-4 sm:gap-6">
      <Skeleton className="h-[52px] w-[52px] rounded-full sm:h-[58px] sm:w-[58px]" />
      <Skeleton className="h-[42px] w-[42px] rounded-full sm:h-[46px] sm:w-[46px]" />
      <Skeleton className="h-[52px] w-[52px] rounded-full sm:h-[58px] sm:w-[58px]" />
    </div>
  );
}
