import { useMutationCustom } from '@/hooks/useMutationCustom';
import type { CreateVotePayload } from '@/interfaces/vote.interface';
import { createDogVote } from '@/services/dog.api';

export function useVoteDogMutation() {
  return useMutationCustom({
    mutationFn: (payload: CreateVotePayload) => createDogVote(payload),
    retry: 2,
    retryDelay: (failureCount) => Math.min(800 * 2 ** (failureCount - 1), 3_200),
  });
}
