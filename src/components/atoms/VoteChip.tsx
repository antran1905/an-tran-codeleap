import type { VoteValue } from '@/interfaces/vote.interface';
import { cn } from '@/lib/utils';
import { getVoteLabel } from '@/utils/vote';

interface VoteChipProps {
  value: VoteValue;
}

export function VoteChip(props: VoteChipProps) {
  const toneClass = props.value === -1
    ? 'bg-destructive/20 text-destructive border-destructive/40'
    : props.value === 2
      ? 'bg-primary text-primary-foreground border-primary/60'
      : 'bg-secondary text-secondary-foreground border-border';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        toneClass,
      )}
    >
      {getVoteLabel(props.value)}
    </span>
  );
}
