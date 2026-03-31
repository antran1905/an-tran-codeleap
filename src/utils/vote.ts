import type { HistoryFilter } from '@/interfaces/swipe-history.interface';
import type { VoteValue } from '@/interfaces/vote.interface';

export function getVoteLabel(value: VoteValue): string {
  if (value === -1) {
    return 'Reject';
  }

  if (value === 2) {
    return 'Super Like';
  }

  return 'Like';
}

export function getVoteFilter(value: VoteValue): HistoryFilter {
  if (value === -1) {
    return 'dislike';
  }

  if (value === 2) {
    return 'super-like';
  }

  return 'like';
}

export function toVoteValue(filter: HistoryFilter): VoteValue | null {
  if (filter === 'dislike') {
    return -1;
  }

  if (filter === 'super-like') {
    return 2;
  }

  if (filter === 'like') {
    return 1;
  }

  return null;
}
