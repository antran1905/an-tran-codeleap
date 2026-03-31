import { Skeleton } from '@/components/atoms/Skeleton';

export function SwipeActionBarSkeleton() {
  return (
    <div aria-hidden className="flex items-center justify-center gap-6">
      <Skeleton className="h-[58px] w-[58px] rounded-full" />
      <Skeleton className="h-[46px] w-[46px] rounded-full" />
      <Skeleton className="h-[58px] w-[58px] rounded-full" />
    </div>
  );
}
