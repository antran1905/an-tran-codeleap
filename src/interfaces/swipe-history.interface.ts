import type { VoteValue } from '@/interfaces/vote.interface';

export type HistoryFilter = 'all' | 'dislike' | 'like' | 'super-like';

export interface SwipeHistoryEntry {
  id: string;
  breedId: number;
  breedName: string;
  imageUrl: string | null;
  imageId: string | null;
  value: VoteValue;
  createdAt: string;
}
