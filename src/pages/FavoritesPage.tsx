import { useEffect } from 'react';

import { InteractionHistoryList } from '@/components/organisms/InteractionHistoryList';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { useHistoryStore } from '@/stores/useHistoryStore';

export function FavoritesPage() {
  const entries = useHistoryStore((state) => state.entries);
  const hydrateHistory = useHistoryStore((state) => state.hydrateHistory);

  useEffect(() => {
    hydrateHistory();
  }, [hydrateHistory]);

  const favoriteEntries = entries.filter((entry) => entry.value === 1 || entry.value === 2);

  return (
    <ListPageTemplate
      title="Favorites"
      subtitle="All dogs you liked and super liked in one place."
    >
      <InteractionHistoryList entries={favoriteEntries} emptyMessage="No favorites saved yet." />
    </ListPageTemplate>
  );
}
