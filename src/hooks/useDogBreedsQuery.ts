import { queryKeys } from '@/common/queryKeys';
import { useQueryCustom } from '@/hooks/useQueryCustom';
import { getDogBreeds } from '@/services/dog.api';

export function useDogBreedsQuery() {
  return useQueryCustom({
    queryKey: queryKeys.breeds,
    queryFn: getDogBreeds,
    staleTime: 60_000,
  });
}
