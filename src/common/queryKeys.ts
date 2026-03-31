export const queryKeys = {
  breeds: ['dogs', 'breeds'] as const,
  favourites: ['dogs', 'favourites'] as const,
  favouritesPage: (options: { page: number; limit: number; order: string }) =>
    ['dogs', 'favourites', options.page, options.limit, options.order] as const,
};
