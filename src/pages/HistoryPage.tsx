import { useEffect } from 'react';

import { HistoryFilterTabs } from '@/components/molecules/HistoryFilterTabs';
import { InteractionHistoryList } from '@/components/organisms/InteractionHistoryList';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import type { HistoryFilter, SwipeHistoryEntry } from '@/interfaces/swipe-history.interface';
import { useHistoryStore } from '@/stores/useHistoryStore';
import { toVoteValue } from '@/utils/vote';

function filterHistoryEntries(entries: SwipeHistoryEntry[], filter: HistoryFilter): SwipeHistoryEntry[] {
  const voteValue = toVoteValue(filter);

  if (voteValue === null) {
    return entries;
  }

  return entries.filter((entry) => entry.value === voteValue);
}

export function HistoryPage() {
  const entries = useHistoryStore((state) => state.entries);
  const filter = useHistoryStore((state) => state.filter);
  const hydrateHistory = useHistoryStore((state) => state.hydrateHistory);
  const setFilter = useHistoryStore((state) => state.setFilter);

  useEffect(() => {
    hydrateHistory();
  }, [hydrateHistory]);

  const filteredEntries = filterHistoryEntries(entries, filter);

  return (
    <ListPageTemplate
      title="History"
      subtitle="Review every Reject, Like, and Super Like from your swipes."
      action={<HistoryFilterTabs value={filter} onChange={setFilter} />}
    >
      <InteractionHistoryList entries={filteredEntries} emptyMessage="No interactions yet." />
    </ListPageTemplate>
  );
}
