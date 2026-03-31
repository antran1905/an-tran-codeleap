import { useMutationCustom } from '@/hooks/useMutationCustom';
import type { CreateVotePayload } from '@/interfaces/vote.interface';
import { createDogVote } from '@/services/dog.api';

export function useVoteDogMutation() {
  return useMutationCustom({
    mutationFn: (payload: CreateVotePayload) => createDogVote(payload),
  });
}
