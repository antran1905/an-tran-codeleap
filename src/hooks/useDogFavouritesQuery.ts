import { queryKeys } from '@/common/queryKeys';
import { useQueryCustom } from '@/hooks/useQueryCustom';
import type { GetDogFavouritesParams } from '@/interfaces/favorite.interface';
import { getDogFavourites } from '@/services/dog.api';

export function useDogFavouritesQuery(options: GetDogFavouritesParams) {
  return useQueryCustom({
    queryKey: queryKeys.favouritesPage({
      page: options.page,
      limit: options.limit,
      order: options.order,
    }),
    queryFn: () => getDogFavourites(options),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
