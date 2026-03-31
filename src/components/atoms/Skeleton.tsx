import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton(props: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-muted', props.className)}
    />
  );
}
