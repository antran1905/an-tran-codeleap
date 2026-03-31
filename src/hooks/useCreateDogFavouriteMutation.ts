import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { queryKeys } from '@/common/queryKeys';
import { useMutationCustom } from '@/hooks/useMutationCustom';
import type { CreateDogFavouritePayload } from '@/interfaces/favorite.interface';
import { createDogFavourite } from '@/services/dog.api';

export function useCreateDogFavouriteMutation() {
  const queryClient = useQueryClient();

  return useMutationCustom({
    mutationFn: (payload: CreateDogFavouritePayload) => createDogFavourite(payload),
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;

        if (typeof statusCode === 'number' && statusCode >= 400 && statusCode < 500) {
          return false;
        }
      }

      return failureCount < 2;
    },
    retryDelay: (failureCount) => Math.min(800 * 2 ** (failureCount - 1), 3_200),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.favourites,
      });
    },
  });
}
