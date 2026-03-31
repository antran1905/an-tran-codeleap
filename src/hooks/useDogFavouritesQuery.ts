import { queryKeys } from '@/common/queryKeys';
import { useQueryCustom } from '@/hooks/useQueryCustom';
import { getDogFavourites } from '@/services/dog.api';

export function useDogFavouritesQuery() {
  return useQueryCustom({
    queryKey: queryKeys.favourites,
    queryFn: getDogFavourites,
    staleTime: 60_000,
  });
}
